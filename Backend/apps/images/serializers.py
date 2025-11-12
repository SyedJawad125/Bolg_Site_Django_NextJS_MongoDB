from rest_framework import serializers
from .models import Categories, Images
from apps.users.serializers import UserListSerializer
from django.utils.text import slugify
from config.settings import BACKEND_BASE_URL
import re


# ======================= CATEGORY SERIALIZERS =======================

class CategoriesListingSerializer(serializers.ModelSerializer):
    """Minimal serializer for category listings in dropdowns/references"""
    images_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Categories
        fields = ['id', 'category', 'slug', 'is_active', 'images_count']
    
    def get_images_count(self, obj):
        """Get count of active images in this category"""
        if obj.deleted:
            return 0
        return obj.images_set.filter(deleted=False, is_active=True).count()


class CategoriesSerializer(serializers.ModelSerializer):
    """Full category serializer with validations and nested data"""
    images_count = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()
    
    class Meta:
        model = Categories
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'created_by', 'updated_by', 'deleted')
        # Make file/image fields optional
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
            'icon': {'required': False, 'allow_null': True},
            'thumbnail': {'required': False, 'allow_null': True},
            # Add any other file/image fields your model has
        }
    
    def get_images_count(self, obj):
        """Get count of active images in this category"""
        if obj.deleted:
            return 0
        
        # Check what the actual related name is for images
        # Common possibilities: images, image_set, category_images, etc.
        # You need to check your Image model's ForeignKey to Categories
        
        # Try these common patterns, use the correct one:
        if hasattr(obj, 'images') and obj.images.filter(deleted=False, is_active=True).exists():
            return obj.images.filter(deleted=False, is_active=True).count()
        elif hasattr(obj, 'image_set') and obj.image_set.filter(deleted=False, is_active=True).exists():
            return obj.image_set.filter(deleted=False, is_active=True).count()
        elif hasattr(obj, 'category_images') and obj.category_images.filter(deleted=False, is_active=True).exists():
            return obj.category_images.filter(deleted=False, is_active=True).count()
        else:
            return 0
    
    def get_created_by(self, obj):
        """Get created by user with proper serialization"""
        if obj.created_by:
            return UserListSerializer(obj.created_by).data
        return None
    
    def get_updated_by(self, obj):
        """Get updated by user with proper serialization"""
        if obj.updated_by:
            return UserListSerializer(obj.updated_by).data
        return None
    
    def validate_category(self, value):
        """Validate category name"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Category name must be at least 2 characters long")
        
        # Check for duplicate names (case-insensitive)
        qs = Categories.objects.filter(category__iexact=value.strip(), deleted=False)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        
        if qs.exists():
            raise serializers.ValidationError(f"Category with name '{value}' already exists")
        
        return value.strip()
    
    def validate(self, attrs):
        """Cross-field validation"""
        # Debug print
        print("DEBUG - Incoming attrs:", attrs)
        print("DEBUG - Instance:", self.instance)
        
        # Set deleted=False for new instances
        if not self.instance:
            attrs['deleted'] = False
        
        print("DEBUG - Final attrs:", attrs)
        return attrs
    
    def to_representation(self, instance):
        """Customize output representation"""
        data = super().to_representation(instance)
        
        # Remove deleted field from output
        data.pop('deleted', None)
        
        # Format datetime fields if needed
        if isinstance(data.get('created_at'), str):
            data['created_at'] = data['created_at'].replace('T', ' ').split('.')[0]
        if isinstance(data.get('updated_at'), str):
            data['updated_at'] = data['updated_at'].replace('T', ' ').split('.')[0]
        
        return data

class TextBoxCategoriesSerializer(serializers.ModelSerializer):
    """Lightweight serializer for textbox/autocomplete components"""
    
    class Meta:
        model = Categories
        fields = ['id', 'category', 'slug']
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Only include active categories
        if not instance.is_active or instance.deleted:
            return None
        return data


# ======================= IMAGE SERIALIZERS =======================

class ImagesListingSerializer(serializers.ModelSerializer):
    """Minimal serializer for image listings"""
    category_name = serializers.CharField(source='imagescategory.category', read_only=True)
    
    class Meta:
        model = Images
        fields = ['id', 'title', 'image', 'category_name', 'is_active', 'created_at']
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # Handle image URL with full backend URL
        if instance.image:
            data['image'] = f"{BACKEND_BASE_URL}{instance.image.url}"
        else:
            data['image'] = None
        
        return data


class ImagesSerializer(serializers.ModelSerializer):
    """Full image serializer with validations and nested data"""
    category_name = serializers.CharField(source='imagescategory.category', read_only=True)
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()
    category_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Images
        exclude = ['deleted']
        read_only_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')
    
    def get_created_by(self, obj):
        """Get created by user with proper serialization"""
        if obj.created_by:
            return UserListSerializer(obj.created_by).data
        return None
    
    def get_updated_by(self, obj):
        """Get updated by user with proper serialization"""
        if obj.updated_by:
            return UserListSerializer(obj.updated_by).data
        return None
    
    def get_category_details(self, obj):
        """Get full category details"""
        if obj.imagescategory and not obj.imagescategory.deleted:
            return CategoriesListingSerializer(obj.imagescategory).data
        return None
    
    def validate_title(self, value):
        """Validate image title"""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("Title must be at least 2 characters long")
        return value.strip() if value else None
    
    def validate_image(self, value):
        """Validate image file"""
        if not value:
            raise serializers.ValidationError("Image file is required")
        
        # Validate file size (e.g., max 5MB)
        max_size = 5 * 1024 * 1024  # 5MB
        if value.size > max_size:
            raise serializers.ValidationError(
                f"Image size cannot exceed {max_size / (1024 * 1024)}MB"
            )
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if hasattr(value, 'content_type') and value.content_type not in allowed_types:
            raise serializers.ValidationError(
                f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
            )
        
        return value
    
    def validate_imagescategory(self, value):
        """Validate category is active"""
        if value and (value.deleted or not value.is_active):
            raise serializers.ValidationError("Selected category is not active")
        return value
    
    def validate(self, attrs):
        """Cross-field validation"""
        # Ensure alt_text is provided for accessibility
        if 'image' in attrs and not attrs.get('alt_text'):
            # Auto-generate alt text from title or filename if not provided
            if attrs.get('title'):
                attrs['alt_text'] = attrs['title']
            else:
                attrs['alt_text'] = 'Image'
        
        return attrs
    
    def to_representation(self, instance):
        """Customize output representation"""
        data = super().to_representation(instance)
        
        # Handle image URL with full backend URL
        if instance.image:
            data['image'] = f"{BACKEND_BASE_URL}{instance.image.url}"
        else:
            data['image'] = None
        
        # Format datetime fields
        if isinstance(data.get('created_at'), str):
            data['created_at'] = data['created_at'].replace('T', ' ').split('.')[0]
        if isinstance(data.get('updated_at'), str):
            data['updated_at'] = data['updated_at'].replace('T', ' ').split('.')[0]
        
        return data


class PublicImagesSerializer(serializers.ModelSerializer):
    """Public-facing serializer with limited fields for anonymous users"""
    category_name = serializers.CharField(source='imagescategory.category', read_only=True)
    
    class Meta:
        model = Images
        fields = ['id', 'title', 'image', 'alt_text', 'category_name', 'created_at']
        read_only_fields = fields  # All fields are read-only for public
    
    def to_representation(self, instance):
        """Customize output - only show active images"""
        # Don't show deleted or inactive images to public
        if instance.deleted or not instance.is_active:
            return None
        
        data = super().to_representation(instance)
        
        # Handle image URL with full backend URL
        if instance.image:
            data['image'] = f"{BACKEND_BASE_URL}{instance.image.url}"
        else:
            data['image'] = None
        
        return data


class TextBoxImagesSerializer(serializers.ModelSerializer):
    """Lightweight serializer for textbox/autocomplete components"""
    category_name = serializers.CharField(source='imagescategory.category', read_only=True)
    
    class Meta:
        model = Images
        fields = ['id', 'title', 'image', 'category_name']
    
    def to_representation(self, instance):
        """Only include active images"""
        if not instance.is_active or instance.deleted:
            return None
        
        data = super().to_representation(instance)
        
        # Provide thumbnail or small image URL
        if instance.image:
            data['image'] = f"{BACKEND_BASE_URL}{instance.image.url}"
        
        return data