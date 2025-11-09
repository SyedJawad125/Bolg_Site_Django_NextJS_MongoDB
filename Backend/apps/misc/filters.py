import django_filters as filters
from .models import Tag, Country, Faq
from django.db.models import Q


class TagFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    status = filters.CharFilter(field_name='status', lookup_expr='iexact')

    class Meta:
        model = Tag
        fields = ['status']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(color__icontains=value) |
            Q(color_code__icontains=value) |
            Q(status__icontains=value)
        )


class CountryFilter(filters.FilterSet):
    search = filters.CharFilter(field_name='status', lookup_expr='icontains')

    class Meta:
        model = Country
        fields = ['name']


class FaqFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    status = filters.CharFilter(field_name='status', lookup_expr='iexact')

    class Meta:
        model = Faq
        fields = ['status']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(question__icontains=value) |
            Q(answer__icontains=value) |
            Q(status__icontains=value)
        )
