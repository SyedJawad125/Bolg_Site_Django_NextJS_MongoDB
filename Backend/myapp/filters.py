import django_filters
from django_filters import FilterSet, CharFilter, BooleanFilter
from .models import Category, Tag


class CategoryFilter(django_filters.FilterSet):
    id = CharFilter(field_name='id')
    name = CharFilter(field_name='name', lookup_expr='icontains')
    slug = CharFilter(field_name='slug', lookup_expr='iexact')
    parent = CharFilter(field_name='parent__id')  # filter by parent category ID
    is_active = BooleanFilter(field_name='is_active')

    class Meta:
        model = Category
        fields = []  # only the filters we define above


class TagFilter(FilterSet):
    id = CharFilter(field_name='id')
    name = CharFilter(field_name='name', lookup_expr='icontains')
    color = CharFilter(field_name='color', lookup_expr='iexact')

    class Meta:
        model = Tag
        fields = []  # Only use defined filters
