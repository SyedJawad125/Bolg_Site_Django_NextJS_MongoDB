from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from utils.pagination import CustomPagination

def create_response(data, message, status_code):
    result = {
        "status_code": status_code,
        "message": message,
        "data": data
        }
    return Response(result, status=status_code)


def paginate_data(data, request):
    limit = request.query_params.get('limit')
    offset = request.query_params.get('offset')
    if limit and offset:
        pagination = CustomPagination()
        data, count = pagination.paginate_queryset(data, request)
        return data, count
    else:
        return data, data.count()


import re

def validate_password(s):
    has_upper = any(char.isupper() for char in s)
    has_digit = any(char.isdigit() for char in s)
    has_special = bool(re.search(r"[!@#$%^&*(),.?\":{}|<>]", s))
    return has_upper and has_digit and has_special