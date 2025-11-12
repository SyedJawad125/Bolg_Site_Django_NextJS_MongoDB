from django.urls import include, path
from .views import BlogPostView, CampaignView, CategoryView, CommentView, MediaView, NewsletterView, TagView 

urlpatterns = [
        path('v1/categories/', CategoryView.as_view()),
        path('v1/tags/', TagView.as_view()),
        path('v1/blog/posts/', BlogPostView.as_view()),
        path('v1/comments/', CommentView.as_view()),
        path('v1/media/', MediaView.as_view()),
        path('v1/newsletter/', NewsletterView.as_view()),
        path('v1/campaigns/', CampaignView.as_view()),
        path('ckeditor5/', include('django_ckeditor_5.urls')),
]
