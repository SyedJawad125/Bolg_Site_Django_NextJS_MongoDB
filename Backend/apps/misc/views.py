
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (TagSerializer, CountrySerializer, FaqSerializer)
from .filters import (TagFilter, CountryFilter, FaqFilter)
from utils.base_api import BaseView
from utils.decorator import permission_required
from utils.permission_enums import *


class TagView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TagSerializer
    filterset_class = TagFilter

    @permission_required([CREATE_TAG])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_TAG])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_TAG])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_TAG])
    def delete(self, request):
        return super().delete_(request)


class CountryView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CountrySerializer
    filterset_class = CountryFilter

    @permission_required([CREATE_LOT])
    def get(self, request):
        return super().get_(request)


class FaqView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FaqSerializer
    filterset_class = FaqFilter

    @permission_required([CREATE_FAQ])
    def post(self, request):
        return super().post_(request)

    @permission_required([READ_FAQ])
    def get(self, request):
        return super().get_(request)

    @permission_required([UPDATE_FAQ])
    def patch(self, request):
        return super().patch_(request)

    @permission_required([DELETE_FAQ])
    def delete(self, request):
        return super().delete_(request)
