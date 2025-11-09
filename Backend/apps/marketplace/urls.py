from django.urls import path
from .views import (AuctionView, LotView, NewsUpdateCategoryView, NewsUpdateView)


urlpatterns = [
    path('v1/auction/', AuctionView.as_view()),
    path('v1/lot/', LotView.as_view()),
    path('v1/news/update/category/', NewsUpdateCategoryView.as_view()),
    path('v1/news/update/', NewsUpdateView.as_view()),
]
