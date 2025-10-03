import django_filters
from django_filters import FilterSet, CharFilter, BooleanFilter
from .models import BlogPost, Category, Tag


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




class BlogPostFilter(django_filters.FilterSet):
    # Basic text search
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    subtitle = django_filters.CharFilter(field_name='subtitle', lookup_expr='icontains')
    excerpt = django_filters.CharFilter(field_name='excerpt', lookup_expr='icontains')
    content = django_filters.CharFilter(field_name='content', lookup_expr='icontains')

    # ForeignKey & M2M filtering
    author = django_filters.NumberFilter(field_name='author__id')
    category = django_filters.NumberFilter(field_name='category__id')
    tags = django_filters.ModelMultipleChoiceFilter(
        field_name="tags",
        to_field_name="id",
        queryset=BlogPost.tags.rel.model.objects.all()
    )

    # Choice filters
    status = django_filters.ChoiceFilter(choices=BlogPost.STATUS_CHOICES)
    visibility = django_filters.ChoiceFilter(choices=BlogPost.VISIBILITY_CHOICES)

    # Boolean filters
    is_featured = django_filters.BooleanFilter()
    allow_comments = django_filters.BooleanFilter()
    is_premium = django_filters.BooleanFilter()

    # Date/time filters
    created_at__gte = django_filters.DateTimeFilter(field_name="created_at", lookup_expr='gte')
    created_at__lte = django_filters.DateTimeFilter(field_name="created_at", lookup_expr='lte')
    published_at__gte = django_filters.DateTimeFilter(field_name="published_at", lookup_expr='gte')
    published_at__lte = django_filters.DateTimeFilter(field_name="published_at", lookup_expr='lte')

    class Meta:
        model = BlogPost
        fields = [
            'title', 'subtitle', 'excerpt', 'content',
            'author', 'category', 'tags',
            'status', 'visibility',
            'is_featured', 'allow_comments', 'is_premium',
            'created_at__gte', 'created_at__lte',
            'published_at__gte', 'published_at__lte'
        ]
