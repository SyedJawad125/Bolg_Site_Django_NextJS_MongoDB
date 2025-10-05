import json
from rest_framework import serializers
from .models import BlogPost, Category, Newsletter, Tag, Comment, Media
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
    
class CommentSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=Comment.STATUS_CHOICES, required=False, default='pending')
    
    # Override ip_address to avoid the DRF bug
    ip_address = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
        max_length=45
    )
    
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
        extra_kwargs = {
            'user': {'required': False, 'allow_null': True},
            'created_by': {'required': False, 'allow_null': True},
            'updated_by': {'required': False, 'allow_null': True},
            'moderated_by': {'required': False, 'allow_null': True},
            'user_agent': {'required': False, 'allow_blank': True},
            'guest_name': {'required': False, 'allow_blank': True},
            'guest_email': {'required': False, 'allow_blank': True},
            'guest_website': {'required': False, 'allow_blank': True},
            'parent': {'required': False, 'allow_null': True},
            'moderation_note': {'required': False, 'allow_blank': True},
        }

    def validate_ip_address(self, value):
        """Custom validation for IP address"""
        if value:
            import ipaddress
            try:
                ipaddress.ip_address(value)
            except ValueError:
                raise serializers.ValidationError("Enter a valid IPv4 or IPv6 address.")
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        
        # Set the current user if authenticated
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
            validated_data['created_by'] = request.user
        
        # Set IP and user agent from request if not provided
        if request:
            if 'ip_address' not in validated_data:
                validated_data['ip_address'] = self.get_client_ip(request)
            if 'user_agent' not in validated_data:
                validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        
        return super().create(validated_data)
    
    def get_client_ip(self, request):
        """Extract client IP from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['user'] = UserListSerializer(instance.user).data if instance.user else None
        data['created_by'] = UserListSerializer(instance.created_by).data if instance.created_by else None
        data['updated_by'] = UserListSerializer(instance.updated_by).data if instance.updated_by else None
        data['moderated_by'] = UserListSerializer(instance.moderated_by).data if instance.moderated_by else None
        data['post'] = {
            'id': instance.post.id,
            'title': instance.post.title,
            'slug': instance.post.slug
        } if instance.post else None
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
    

class NewsletterSerializer(serializers.ModelSerializer):
    interested_categories = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Category.objects.all(),
        required=False
    )
    
    # Use CharField instead of IPAddressField to avoid the bug
    ip_address = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
        max_length=45  # IPv6 max length
    )
    
    class Meta:
        model = Newsletter
        fields = '__all__'
        # REMOVE created_by and updated_by from read_only_fields
        read_only_fields = ('created_at', 'updated_at')
        extra_kwargs = {
            'created_by': {'required': False, 'allow_null': True},
            'updated_by': {'required': False, 'allow_null': True},
        }
        
    def validate_ip_address(self, value):
        """Custom validation for IP address"""
        if value:
            import ipaddress
            try:
                ipaddress.ip_address(value)
            except ValueError:
                raise serializers.ValidationError("Enter a valid IPv4 or IPv6 address.")
        return value
    
    def create(self, validated_data):
        """Override create to set created_by from request"""
        request = self.context.get('request')
        
        # Set created_by if user is authenticated
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Override update to set updated_by from request"""
        request = self.context.get('request')
        
        # Set updated_by if user is authenticated
        if request and request.user.is_authenticated:
            validated_data['updated_by'] = request.user
        
        return super().update(instance, validated_data)
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = UserListSerializer(instance.created_by).data if instance.created_by else None
        data['updated_by'] = UserListSerializer(instance.updated_by).data if instance.updated_by else None
        return data