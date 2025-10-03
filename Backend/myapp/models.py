from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
import uuid


class Category(models.Model):
    """Blog post categories with hierarchical structure"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    meta_title = models.CharField(max_length=160, blank=True)
    meta_description = models.CharField(max_length=320, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name='category_created_by', null=True, blank=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='category_updated_by', null=True, blank=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    """Tags for blog posts"""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)
    color = models.CharField(max_length=7, default='#007bff', help_text="Hex color code")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name='tag_created_by', null=True, blank=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tag_updated_by', null=True, blank=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    """Main blog post model with rich content"""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
        ('scheduled', 'Scheduled'),
    ]

    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('password', 'Password Protected'),
        ('members', 'Members Only'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    subtitle = models.CharField(max_length=300, blank=True)
    excerpt = models.TextField(max_length=500, blank=True, help_text="Short description for previews")
    content = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name='blogpost_created_by', null=True, blank=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blogpost_updated_by', null=True, blank=True)
    
    # Relationships
    # author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blog_posts')
    author = models.CharField(max_length=100, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    
    # Media
    featured_image = models.ImageField(upload_to='blog/featured/', blank=True, null=True)
    featured_image_alt = models.CharField(max_length=200, blank=True)
    
    # Status and Visibility
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='public')
    password = models.CharField(max_length=100, blank=True, help_text="Required if visibility is password protected")
    
    # SEO
    meta_title = models.CharField(max_length=160, blank=True)
    meta_description = models.CharField(max_length=320, blank=True)
    canonical_url = models.URLField(blank=True, null=True)
    
    # Engagement
    view_count = models.PositiveIntegerField(default=0)
    reading_time = models.PositiveIntegerField(default=0, help_text="Estimated reading time in minutes")
    
    # Scheduling
    published_at = models.DateTimeField(blank=True, null=True)
    scheduled_at = models.DateTimeField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Features
    is_featured = models.BooleanField(default=False)
    allow_comments = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'published_at']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['author', 'status']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# class Comment(models.Model):
#     """Comments system with moderation"""
    
#     STATUS_CHOICES = [
#         ('pending', 'Pending'),
#         ('approved', 'Approved'),
#         ('rejected', 'Rejected'),
#         ('spam', 'Spam'),
#     ]

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
#     parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
#     # Author info (can be registered user or guest)
#     user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     guest_name = models.CharField(max_length=100, blank=True)
#     guest_email = models.EmailField(blank=True)
#     guest_website = models.URLField(blank=True)
    
#     content = models.TextField(max_length=1000)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
#     ip_address = models.GenericIPAddressField(null=True, blank=True)
#     user_agent = models.TextField(blank=True)
    
#     # Moderation
#     moderated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='moderated_comments')
#     moderation_note = models.TextField(blank=True)
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['-created_at']

#     def __str__(self):
#         author = self.user.username if self.user else self.guest_name
#         return f"Comment by {author} on {self.post.title}"


# class Media(models.Model):
#     """Media library for managing images, videos, documents"""
    
#     TYPE_CHOICES = [
#         ('image', 'Image'),
#         ('video', 'Video'),
#         ('audio', 'Audio'),
#         ('document', 'Document'),
#         ('other', 'Other'),
#     ]

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     title = models.CharField(max_length=200)
#     description = models.TextField(blank=True)
#     file = models.FileField(upload_to='media/%Y/%m/')
#     file_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
#     file_size = models.PositiveIntegerField(help_text="File size in bytes")
#     mime_type = models.CharField(max_length=100)
    
#     # Image specific fields
#     width = models.PositiveIntegerField(null=True, blank=True)
#     height = models.PositiveIntegerField(null=True, blank=True)
    
#     # SEO
#     alt_text = models.CharField(max_length=200, blank=True)
#     caption = models.TextField(blank=True)
    
#     # Organization
#     uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
#     is_public = models.BooleanField(default=True)
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['-created_at']

#     def __str__(self):
#         return self.title


# class Newsletter(models.Model):
#     """Newsletter subscription management"""
    
#     STATUS_CHOICES = [
#         ('active', 'Active'),
#         ('inactive', 'Inactive'),
#         ('unsubscribed', 'Unsubscribed'),
#         ('bounced', 'Bounced'),
#     ]

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     email = models.EmailField(unique=True)
#     first_name = models.CharField(max_length=100, blank=True)
#     last_name = models.CharField(max_length=100, blank=True)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
#     # Preferences
#     frequency = models.CharField(max_length=20, choices=[
#         ('daily', 'Daily'),
#         ('weekly', 'Weekly'),
#         ('monthly', 'Monthly'),
#     ], default='weekly')
    
#     # Categories they're interested in
#     interested_categories = models.ManyToManyField(Category, blank=True)
    
#     # Tracking
#     subscription_source = models.CharField(max_length=100, blank=True, help_text="Where they subscribed from")
#     ip_address = models.GenericIPAddressField(null=True, blank=True)
#     confirmed_at = models.DateTimeField(null=True, blank=True)
#     unsubscribed_at = models.DateTimeField(null=True, blank=True)
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         name = f"{self.first_name} {self.last_name}".strip() or "Anonymous"
#         return f"{name} ({self.email})"


# class Campaign(models.Model):
#     """Email campaign management"""
    
#     STATUS_CHOICES = [
#         ('draft', 'Draft'),
#         ('scheduled', 'Scheduled'),
#         ('sending', 'Sending'),
#         ('sent', 'Sent'),
#         ('paused', 'Paused'),
#         ('cancelled', 'Cancelled'),
#     ]

#     TYPE_CHOICES = [
#         ('newsletter', 'Newsletter'),
#         ('promotion', 'Promotion'),
#         ('announcement', 'Announcement'),
#         ('welcome', 'Welcome Series'),
#     ]

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     name = models.CharField(max_length=200)
#     subject = models.CharField(max_length=200)
#     content = RichTextField()
#     campaign_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='newsletter')
    
#     # Targeting
#     target_categories = models.ManyToManyField(Category, blank=True)
#     target_all_subscribers = models.BooleanField(default=True)
    
#     # Scheduling
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
#     scheduled_at = models.DateTimeField(null=True, blank=True)
#     sent_at = models.DateTimeField(null=True, blank=True)
    
#     # Statistics
#     recipients_count = models.PositiveIntegerField(default=0)
#     delivered_count = models.PositiveIntegerField(default=0)
#     opened_count = models.PositiveIntegerField(default=0)
#     clicked_count = models.PositiveIntegerField(default=0)
#     bounced_count = models.PositiveIntegerField(default=0)
#     unsubscribed_count = models.PositiveIntegerField(default=0)
    
#     created_by = models.ForeignKey(User, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return self.name


# class Analytics(models.Model):
#     """Website analytics and tracking"""
    
#     EVENT_CHOICES = [
#         ('page_view', 'Page View'),
#         ('post_view', 'Post View'),
#         ('search', 'Search'),
#         ('download', 'Download'),
#         ('newsletter_signup', 'Newsletter Signup'),
#         ('comment_posted', 'Comment Posted'),
#         ('share', 'Social Share'),
#     ]

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     event_type = models.CharField(max_length=50, choices=EVENT_CHOICES)
    
#     # Content reference
#     post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, null=True, blank=True)
#     category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    
#     # User info
#     user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
#     session_id = models.CharField(max_length=100, blank=True)
#     ip_address = models.GenericIPAddressField()
    
#     # Technical info
#     user_agent = models.TextField(blank=True)
#     referrer = models.URLField(blank=True)
#     page_url = models.URLField()
    
#     # Geographic
#     country = models.CharField(max_length=100, blank=True)
#     city = models.CharField(max_length=100, blank=True)
    
#     # Additional data (JSON field for flexibility)
#     extra_data = models.JSONField(default=dict, blank=True)
    
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['-created_at']
#         indexes = [
#             models.Index(fields=['event_type', 'created_at']),
#             models.Index(fields=['post', 'event_type']),
#         ]

#     def __str__(self):
#         return f"{self.event_type} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


# class SiteConfiguration(models.Model):
#     """Site-wide configuration settings"""
    
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     site_name = models.CharField(max_length=200, default="My Luxury Blog")
#     site_tagline = models.CharField(max_length=300, blank=True)
#     site_description = models.TextField(blank=True)
#     site_url = models.URLField(blank=True)
    
#     # Contact info
#     contact_email = models.EmailField(blank=True)
#     admin_email = models.EmailField(blank=True)
    
#     # SEO defaults
#     default_meta_title = models.CharField(max_length=160, blank=True)
#     default_meta_description = models.CharField(max_length=320, blank=True)
    
#     # Social media
#     facebook_url = models.URLField(blank=True)
#     twitter_url = models.URLField(blank=True)
#     instagram_url = models.URLField(blank=True)
#     linkedin_url = models.URLField(blank=True)
#     youtube_url = models.URLField(blank=True)
    
#     # Features
#     enable_comments = models.BooleanField(default=True)
#     require_comment_moderation = models.BooleanField(default=True)
#     enable_newsletter = models.BooleanField(default=True)
#     enable_analytics = models.BooleanField(default=True)
#     posts_per_page = models.PositiveIntegerField(default=10)
    
#     # Appearance
#     logo = models.ImageField(upload_to='site/', blank=True, null=True)
#     favicon = models.ImageField(upload_to='site/', blank=True, null=True)
#     primary_color = models.CharField(max_length=7, default='#007bff')
#     secondary_color = models.CharField(max_length=7, default='#6c757d')
    
#     # Maintenance
#     maintenance_mode = models.BooleanField(default=False)
#     maintenance_message = models.TextField(blank=True)
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         verbose_name = "Site Configuration"
#         verbose_name_plural = "Site Configuration"

#     def __str__(self):
#         return self.site_name


# class ContactMessage(models.Model):
#     """Contact form messages"""
    
#     STATUS_CHOICES = [
#         ('new', 'New'),
#         ('read', 'Read'),
#         ('replied', 'Replied'),
#         ('archived', 'Archived'),
#     ]

#     PRIORITY_CHOICES = [
#         ('low', 'Low'),
#         ('medium', 'Medium'),
#         ('high', 'High'),
#         ('urgent', 'Urgent'),
#     ]

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     name = models.CharField(max_length=100)
#     email = models.EmailField()
#     phone = models.CharField(max_length=20, blank=True)
#     subject = models.CharField(max_length=200)
#     message = models.TextField()
    
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
#     priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    
#     # Admin response
#     admin_notes = models.TextField(blank=True)
#     replied_at = models.DateTimeField(null=True, blank=True)
#     replied_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
#     # Tracking
#     ip_address = models.GenericIPAddressField(null=True, blank=True)
#     user_agent = models.TextField(blank=True)
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['-created_at']

#     def __str__(self):
#         return f"{self.subject} - {self.name}"