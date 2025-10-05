import json
from rest_framework import serializers
from .models import BlogPost, Category, Tag, Comment, Media
from rest_framework.serializers import ModelSerializer
from user_auth.user_serializer import UserListSerializer




class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = UserListSerializer(instance.created_by).data if instance.created_by else None
        data['updated_by'] = UserListSerializer(instance.updated_by).data if instance.updated_by else None
        return data



class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = UserListSerializer(instance.created_by).data if instance.created_by else None
        data['updated_by'] = UserListSerializer(instance.updated_by).data if instance.updated_by else None
        return data
    

class BlogPostSerializer(ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'
        

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = UserListSerializer(instance.created_by).data if instance.created_by else None
        data['updated_by'] = UserListSerializer(instance.updated_by).data if instance.updated_by else None
        data['category_name'] = instance.category.name if instance.category else None
        # Add tags names as a list
        data['tags_name'] = [tag.name for tag in instance.tags.all()]

        return data
    
class CommentSerializer(ModelSerializer):
    status = serializers.ChoiceField(choices=Comment.STATUS_CHOICES, required=False, default='pending')
    
    class Meta:
        model = Comment
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True},
            'created_by': {'read_only': True},
            'updated_by': {'read_only': True},
            'moderated_by': {'read_only': True},
            'ip_address': {'required': False},
            'user_agent': {'required': False},
        }

    def create(self, validated_data):
        request = self.context.get('request')
        
        # Set the current user if authenticated
        # if request and request.user.is_authenticated:
        #     validated_data['user'] = request.user
        #     validated_data['created_by'] = request.user
        
        # Set IP and user agent from request if not provided
        if request:
            if 'ip_address' not in validated_data:
                validated_data['ip_address'] = self.get_client_ip(request)
            if 'user_agent' not in validated_data:
                validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        
        return super().create(validated_data)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['user'] = UserListSerializer(instance.user).data if instance.user else None
        data['created_by'] = UserListSerializer(instance.created_by).data if instance.created_by else None
        data['updated_by'] = UserListSerializer(instance.updated_by).data if instance.updated_by else None
        data['moderated_by'] = UserListSerializer(instance.moderated_by).data if instance.moderated_by else None
        return data
    
class MediaSerializer(ModelSerializer):
    class Meta:
        model = Media
        fields = '__all__'
        

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = UserListSerializer(instance.created_by).data if instance.created_by else None
        data['updated_by'] = UserListSerializer(instance.updated_by).data if instance.updated_by else None
        return data