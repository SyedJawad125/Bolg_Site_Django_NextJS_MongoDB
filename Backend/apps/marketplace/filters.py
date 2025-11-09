import django_filters as filters
from .models import Auction, Lot, NewsUpdate, NewsUpdateCategory
from django.db.models import Q


class AuctionFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    status = filters.CharFilter(field_name='status', lookup_expr='iexact')

    class Meta:
        model = Auction
        fields = ['status']


    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(end_date=value) |
            Q(status__icontains=value)
        )


class LotFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    status = filters.CharFilter(field_name='status', lookup_expr='iexact')
    year = filters.CharFilter(field_name='year')
    country = filters.CharFilter(field_name='country')
    tag = filters.CharFilter(field_name='tag')


    class Meta:
        model = Lot
        fields = ['status', 'year', 'country', 'tag']

    def filter_search(self, queryset, name, value):
        return queryset.select_related('tag').filter(
            Q(title__icontains=value) |
            Q(year=value) |
            Q(weight=value) |
            Q(tag__name__icontains=value)
        )


class NewsUpdateCategoryFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    status = filters.CharFilter(field_name='status', lookup_expr='iexact')

    class Meta:
        model = NewsUpdateCategory
        fields = ['status']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(description__icontains=value)
        )


class NewsUpdateFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    category = filters.CharFilter(field_name='category')
    tag = filters.CharFilter(field_name='tag')
    status = filters.CharFilter(field_name='status', lookup_expr='iexact')
    published_at = filters.DateFromToRangeFilter(field_name='published_at')

    class Meta:
        model = NewsUpdate
        fields = ['category', 'status', 'published_at']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(category__name__icontains=value),
            deleted=False
        )
