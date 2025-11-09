from rest_framework import serializers
from .models import Tag, Country, Faq


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
