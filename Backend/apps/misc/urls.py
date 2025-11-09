from django.urls import path
from .views import (TagView, CountryView, FaqView)


urlpatterns = [
    path('v1/tag/', TagView.as_view()),
    path('v1/country/', CountryView.as_view()),
    path('v1/faq/', FaqView.as_view()),

]
