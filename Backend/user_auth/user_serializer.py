from django.db.models import Q
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth import authenticate

from utils.helpers import generate_token
from utils.response_messages import *
from utils.reusable_functions import combine_role_permissions, extract_permission_codes, get_first_error
from django.db import transaction
from utils.enums import *
from utils.validators import clean_and_validate_mobile
from django.utils import timezone
from .models import User, Employee, Role, Permission
from my_project.settings import (MAX_LOGIN_ATTEMPTS, SIMPLE_JWT, PASSWORD_MIN_LENGTH)
from django.contrib.auth.hashers import check_password
from utils.helper import validate_password


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=100, required=True)
    password = serializers.CharField(max_length=100, required=True)

    def validate(self, attrs):
        email = attrs.get('email', None)
        password = attrs.get("password", None)
        if email and password:
            user_obj = User.objects.filter(email=email, deleted=False).first()
            # user = authenticate(username=username, password=password, deleted=False)
            # if not user:
            if not check_password(password, user_obj.password):
                if user_obj.login_attempts < MAX_LOGIN_ATTEMPTS:
                    user_obj.login_attempts += 1
                    user_obj.save()
                else:
                    user_obj.is_blocked = True
                    user_obj.save()
                    raise serializers.ValidationError(ACCOUNT_BLOCKED)
                if not user_obj.is_active and user_obj.activation_link_token:
                    raise serializers.ValidationError(FOLLOW_ACTIVATION_EMAIL)
                raise serializers.ValidationError(INVALID_CREDENTIALS)
            elif user_obj.deleted:
                raise serializers.ValidationError(INVALID_CREDENTIALS)
            elif user_obj.is_blocked:
                raise serializers.ValidationError(ACCOUNT_BLOCKED)
            else:
                user_obj.last_login = None
                user_obj.login_attempts = 0
                user_obj.save()
        else:
            raise serializers.ValidationError(EMAIL_OR_PASSWORD_MISSING)

        attrs['user'] = user_obj
        return attrs


# class LoginUserSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = User
#         fields = ('id', 'name', 'username', 'email', 'mobile', 'is_superuser', 'profile_image', 'role', 'type')

#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         tokens = self.context.get('tokens')
#         data['refresh_token'] = tokens['refresh']
#         data['access_token'] = tokens['access']
#         expiry = SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
#         data['age_in_seconds'] = expiry.total_seconds() * 1000
        
#         # Handle permissions based on user type
#         if instance.is_superuser:
#             # Return all permission codes for superuser
#             all_permissions = Permission.objects.all()
#             data['permissions'] = [perm.code_name for perm in all_permissions]
#         elif instance.role:
#             data['permissions'] = combine_role_permissions(instance.role)
#         else:
#             data['permissions'] = []
            
#         return data


class LoginUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'name', 'username', 'email', 'mobile',
            'is_superuser', 'profile_image', 'role', 'type'
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # ✅ 1. Add JWT tokens from context
        tokens = self.context.get('tokens')
        if tokens:
            data['refresh_token'] = tokens.get('refresh')
            data['access_token'] = tokens.get('access')

        # ✅ 2. Include token expiry in milliseconds
        expiry = SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
        data['age_in_seconds'] = expiry.total_seconds() * 1000
        data['role_name'] = instance.role.name if instance.role else None
        data['Role'] = RoleListingSerializer(instance.role).data if instance.role else None


        # ✅ 3. Handle permissions
        if instance.is_superuser:
            # Return all permission codes for superuser
            all_permissions = Permission.objects.all()
            data['permissions'] = [perm.code_name for perm in all_permissions]
        elif getattr(instance, 'role', None):
            data['permissions'] = combine_role_permissions(instance.role)
        else:
            data['permissions'] = []

        return data


class EmptySerializer(serializers.Serializer):
    pass


class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(max_length=500, required=True)

    def validate(self, attrs):
        refresh_token = attrs.get('refresh_token', None)
        try:
            RefreshToken(refresh_token).blacklist()
        except TokenError:
            raise serializers.ValidationError(INVALID_TOKEN)
        return attrs


class SetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField(
        label="token",
        style={"input_type": "token"},
        trim_whitespace=False,
    )
    new_password = serializers.CharField(
        label="new_password",
        style={"input_type": "new_password"},
        trim_whitespace=True,
    )
    confirm_password = serializers.CharField(
        label="confirm_password",
        style={"input_type": "confirm_password"},
        trim_whitespace=True,
    )

    def validate(self, instance):
        if instance['new_password'] != instance['confirm_password']:
            raise serializers.ValidationError(PASSWORD_DOES_NOT_MATCH)
        elif len(instance["new_password"]) < PASSWORD_MIN_LENGTH:
            raise serializers.ValidationError(PasswordMustBeEightChar)
        elif not validate_password(instance["new_password"]):
            raise serializers.ValidationError(FOLLOW_PASSWORD_PATTERN)
        return instance


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def validate(self, attrs):
        email = attrs.get('email', attrs.get('email'))

        if self.instance:
            if User.objects.filter(email=email, deleted=False).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('Email with this email already exists')
        else:
            if User.objects.filter(email=email, deleted=False).exists():
                raise serializers.ValidationError('Email with this email already exists')
        return attrs

    def create(self, validated_data):
        instance = User.objects.create(**validated_data)
        token_string = f"{instance.id}_{instance.email}"
        token = generate_token(token_string)
        instance.activation_link_token = token
        instance.activation_link_token_created_at = timezone.now()
        instance.save()
        return instance


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'mobile', 'profile_image', 'role', 'deactivated')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['role'] = RoleListingSerializer(instance.role).data if instance.role else None
        return data

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        exclude = ('deleted',)

    def create(self, validated_data):
        request = self.context.get('request')
        request.data['type'] = EMPLOYEE
        with transaction.atomic():
            user_instance = UserSerializer(data=request.data)
            if user_instance.is_valid():
                user_instance = user_instance.save()
            else:
                transaction.set_rollback(True)
                raise Exception(get_first_error(user_instance.errors))

            instance = Employee.objects.create(user=user_instance, **validated_data)
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        data['created_by'] = instance.created_by.name
        data['updated_by'] = instance.updated_by.name if instance.updated_by else None
        user_data = UserListSerializer(instance.user).data
        del user_data['id']
        del data['user']
        data.update(user_data)
        if request.method == POST:
            data['activation_link_token'] = instance.user.activation_link_token
        return data


class RoleListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'name', 'code_name')


class PermissionListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('id', 'name', 'code_name')


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

    def validate(self, attrs):
        name = attrs.get('name', None)
        code_name = attrs.get('code_name', None)

        if self.instance:
            if Role.objects.filter(name__iexact=name, deleted=False).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('Role with this name already exists')
            elif Role.objects.filter(code_name__iexact=code_name, deleted=False).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('Role with this code name already exists')
        else:
            if Role.objects.filter(name__iexact=name, deleted=False).exists():
                raise serializers.ValidationError('Role with this name already exists')
            elif Role.objects.filter(code_name__iexact=code_name, deleted=False).exists():
                raise serializers.ValidationError('Role with this code name already exists')
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = instance.created_by.name if instance.created_by else None
        data['updated_by'] = instance.updated_by.name if instance.updated_by else None
        data['permissions'] = PermissionListingSerializer(instance.permissions.all(), many=True).data if data['permissions'] else []
        return data