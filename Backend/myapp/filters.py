import django_filters
from django_filters import FilterSet, CharFilter, BooleanFilter
from .models import BlogPost, Category, Tag, Comment, Media


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


class CommentFilter(django_filters.FilterSet):
    # Custom filters
    post_title = django_filters.CharFilter(field_name='post__title', lookup_expr='icontains')
    username = django_filters.CharFilter(field_name='user__username', lookup_expr='icontains')
    guest_name = django_filters.CharFilter(lookup_expr='icontains')
    guest_email = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.ChoiceFilter(choices=Comment.STATUS_CHOICES)
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Comment
        fields = [
            'post',          # filter by Post ID
            'post_title',    # filter by Post title
            'status',        # pending, approved, etc.
            'user',          # registered user
            'guest_name',    # guest name
            'guest_email',   # guest email
            'parent',        # filter replies of a specific comment
            'created_after',
            'created_before',
        ]


class MediaFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    file_type = django_filters.CharFilter(lookup_expr='exact')
    uploaded_by = django_filters.UUIDFilter(field_name='uploaded_by__id', lookup_expr='exact')
    is_public = django_filters.BooleanFilter()
    created_at = django_filters.DateFromToRangeFilter()
    updated_at = django_filters.DateFromToRangeFilter()
    min_size = django_filters.NumberFilter(field_name='file_size', lookup_expr='gte')
    max_size = django_filters.NumberFilter(field_name='file_size', lookup_expr='lte')

    class Meta:
        model = Media
        fields = [
            'file_type',
            'uploaded_by',
            'is_public',
            'created_at',
            'updated_at',
        ]
