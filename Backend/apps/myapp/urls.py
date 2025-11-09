from django.urls import path
from .views import BlogPostViews, CampaignViews, CategoryViews, CommentViews, MediaViews, NewsletterViews, TagViews

urlpatterns = [
    # Task URLs
    path('category', CategoryViews.as_view({
            "get": "get_category",
            "post": "post_category",
            "patch": "update_category",
            "delete": "delete_category"}),name="category"
    ),

    # TaskTag URLs
    path('tag', TagViews.as_view({
            "get": "get_tag",
            "post": "post_tag",
            "patch": "update_tag",
            "delete": "delete_tag"}),name="tag"
    ),
    # BlogPost URLs

    path('blogpost', BlogPostViews.as_view({
            "get": "get_blogpost",
            "post": "post_blogpost",
            "patch": "update_blogpost",
            "delete": "delete_blogpost"}),name="blogpost"
    ),
    # Comment URLs

    path('comment', CommentViews.as_view({
            "get": "get_comment",
            "post": "post_comment",
            "patch": "update_comment",
            "delete": "delete_comment"}),name="comment"
    ),
    # Media URLs

    path('media', MediaViews.as_view({
            "get": "get_media",
            "post": "post_media",
            "patch": "update_media",
            "delete": "delete_media"}),name="media"
    ),
    # Newsletter URLs

    path('newsletter', NewsletterViews.as_view({
            "get": "get_newsletter",
            "post": "post_newsletter",
            "patch": "update_newsletter",
            "delete": "delete_newsletter"}),name="newsletter"
    ),
    # Campaign URLs

    path('campaign', CampaignViews.as_view({
            "get": "get_campaign",
            "post": "post_campaign",
            "patch": "update_campaign",
            "delete": "delete_campaign"}),name="campaign"
    ),
]
