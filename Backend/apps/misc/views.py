
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (BusinessSerializer, TagSerializer, CountrySerializer, FaqSerializer)
from .filters import (BusinessFilter, TagFilter, CountryFilter, FaqFilter)
from utils.base_api import BaseView
from utils.decorator import permission_required
from utils.permission_enums import *
from rest_framework.response import Response
from utils.reusable_functions import (create_response, get_first_error)
from rest_framework import status
from utils.response_messages import *


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


class BusinessView(BaseView):
    permission_classes = (IsAuthenticated,)
    serializer_class = BusinessSerializer
    filterset_class = BusinessFilter
    select_related_args = ()

    @permission_required([READ_BUSINESS])
    def get(self, request):
        try:
            instance = self.serializer_class.Meta.model.objects.filter(deleted=False).last()
            serialized_data = self.serializer_class(instance, context={'request': request}).data
            return Response(create_response(SUCCESSFUL, serialized_data, 1), status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @permission_required([UPDATE_BUSINESS])
    def patch(self, request):
        try:
            instance = self.serializer_class.Meta.model.objects.filter(deleted=False).last()
            if instance:
                serialized_data = self.serializer_class(instance, data=request.data, partial=True,
                                                        context={'request': request, 'id': instance.id})
                if serialized_data.is_valid():
                    resp = serialized_data.save(updated_by=request.user)
                    serialized_resp = self.serializer_class(resp, context={'request': request}).data
                    return Response(create_response(SUCCESSFUL, serialized_resp), status=status.HTTP_200_OK)
                else:
                    return Response(create_response(get_first_error(serialized_data.errors)),
                                    status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(create_response(NOT_FOUND), status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(str(e))
            return Response(create_response(str(e)), status=status.HTTP_400_BAD_REQUEST)

