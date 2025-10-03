import json
from rest_framework import serializers
from .models import BlogPost, Category, Tag
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