from django.urls import path
from .views import CategoryViews, TagViews

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
]
