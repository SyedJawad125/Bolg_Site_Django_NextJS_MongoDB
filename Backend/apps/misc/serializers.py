from rest_framework import serializers

from config.settings import BACKEND_BASE_URL
from .models import Business, BusinessImage, Tag, Country, Faq
from django.db import transaction
from utils.enums import *



class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'deleted', 'created_by', 'updated_by')

    def validate(self, attrs):
        name = attrs.get('name', None)
        if self.instance:
            if Tag.objects.filter(name=name, deleted=False).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(f"Tag with name {name} already exists")
        else:
            if Tag.objects.filter(name=name, deleted=False).exists():
                raise serializers.ValidationError(f"Tag with name {name} already exists")
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = instance.created_by.full_name if instance.created_by else None
        data['updated_by'] = instance.updated_by.full_name if instance.updated_by else None
        data['assigned_items'] = 0
        return data


class TagListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color_code']


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('id', 'name', 'code')


class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Faq
        exclude = ('deleted',)
        read_only_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')

    def validate(self, attrs):
        question = attrs.get('question', None)
        if self.instance:
            if Faq.objects.filter(question=question, deleted=False).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(f"Faq with question {question[:20]}.. already exists")
        else:
            if Faq.objects.filter(question=question, deleted=False).exists():
                raise serializers.ValidationError(f"Faq with question {question[:20]}.. already exists")
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = instance.created_by.full_name if instance.created_by else None
        data['updated_by'] = instance.updated_by.full_name if instance.updated_by else None
        return data
    

class BusinessImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessImage
        exclude = ['deleted']
        read_only_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        exclude = ['deleted']
        read_only_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')

    def validate(self, attrs):
        name = attrs.get('name', None)
        if self.instance:
            if Business.objects.filter(name=name, deleted=False).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(f"Business with name {name} already exists")
        else:
            if Business.objects.filter(name=name, deleted=False).exists():
                raise serializers.ValidationError(f"Business with name {name} already exists")
        return attrs
    
    def update(self, instance ,validated_data):
        request = self.context.get('request')
        with transaction.atomic():
            data = []
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            if request.data.get('logo_image'):
                data.append(BusinessImage(business=instance, image=request.data.get('logo_image'), type=LOGO, created_by=request.user))
                BusinessImage.objects.filter(type=LOGO).update(deleted=True)
            if request.data.get('hero_image'):
                BusinessImage.objects.filter(type=HERO_IMAGE).update(deleted=True)
                data.append(BusinessImage(business=instance, image=request.data.get('hero_image'), type=HERO_IMAGE, created_by=request.user))
            BusinessImage.objects.bulk_create(data)
        return instance
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = instance.created_by.full_name if instance.created_by else None
        data['updated_by'] = instance.updated_by.full_name if instance.updated_by else None
        images = BusinessImageSerializer(instance.business_images.filter(deleted=False).order_by('id'), many=True).data
        images = [{**item, "image": f"{BACKEND_BASE_URL}{item['image']}"} for item in images]
        logo_image = [item for item in images if item['type'] == LOGO]
        hero_image = [item for item in images if item['type'] == HERO_IMAGE]
        data['logo_image'] = logo_image[0]['image'] if logo_image else None
        data['hero_image'] = hero_image[0]['image'] if hero_image else None
        return data
    