from rest_framework.views import APIView
from rest_framework.response import Response
from utils.reusable_functions import (create_response, get_first_error, get_tokens_for_user)
from rest_framework import status
from utils.response_messages import *
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (AuctionSerializer, LotSerializer, AuctionListingSerializer, NewsUpdateCategorySerializer, NewsUpdateSerializer)
from .filters import (AuctionFilter, LotFilter, NewsUpdateCategoryFilter, NewsUpdateFilter)
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from config.settings import (SIMPLE_JWT, FRONTEND_BASE_URL, PASSWORD_RESET_VALIDITY)
from django.utils import timezone
from utils.helpers import generate_token
from apps.notification.tasks import send_email
from utils.enums import *
from django.db import transaction
from utils.base_api import BaseView
from collections import defaultdict
from utils.decorator import permission_required
from utils.permission_enums import *


class AuctionView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AuctionSerializer
    filterset_class = AuctionFilter
    list_serializer = AuctionListingSerializer

    @permission_required([CREATE_AUCTION])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_AUCTION])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_AUCTION])
    def patch(self, request):
        return super().patch_(request)


class LotView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LotSerializer
    filterset_class = LotFilter
    select_related_args =('tag', 'country',)

    @permission_required([CREATE_LOT])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_LOT])
    def get(self, request):
        return super().get_(request)


class NewsUpdateCategoryView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = NewsUpdateCategorySerializer
    filterset_class = NewsUpdateCategoryFilter

    @permission_required([CREATE_NEWS_CATEGORY])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_NEWS_CATEGORY])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_NEWS_CATEGORY])
    def patch(self, request):
        return super().patch_(request)
    
    @permission_required([DELETE_NEWS_CATEGORY])
    def delete(self, request):
        return super().delete_(request)


class NewsUpdateView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = NewsUpdateSerializer
    filterset_class = NewsUpdateFilter

    @permission_required([CREATE_NEWS_UPDATE])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_NEWS_UPDATE])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_NEWS_UPDATE])
    def patch(self, request):
        return super().patch_(request)
    
    @permission_required([DELETE_NEWS_UPDATE])
    def delete(self, request):
        return super().delete_(request)
