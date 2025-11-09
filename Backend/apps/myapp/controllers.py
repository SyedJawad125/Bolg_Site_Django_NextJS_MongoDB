from venv import logger
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import authenticate
from myapp.filters import BlogPostFilter, CampaignFilter, CategoryFilter, CommentFilter, MediaFilter, NewsletterFilter, TagFilter
from myapp.serializers import *
from myapp.models import Category, Tag
from utils.reusable_methods import get_first_error_message, generate_six_length_random_number
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg, F
from utils.helper import create_response, paginate_data
from utils.response_messages import *
from datetime import date, timedelta
from django.core.paginator import Paginator, EmptyPage


class CategoryController:
    serializer_class = CategorySerializer
    filterset_class = CategoryFilter

    def create(self, request):
        try:
            request.POST._mutable = True
            request.data["created_by"] = request.user.id
            request.POST._mutable = False

            # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
            validated_data = CategorySerializer(data=request.data)
            if validated_data.is_valid():
                response = validated_data.save()
                response_data = CategorySerializer(response).data
                return Response({'data': response_data}, 200)
            else:
                error_message = get_first_error_message(validated_data.errors, "UNSUCCESSFUL")
                return Response({'data': error_message}, 400)
            # else:
            #     return Response({'data': "Permission Denaied"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)

    # mydata = Member.objects.filter(firstname__endswith='s').values()
    def get_category(self, request):
        try:
            # Get all instances
            instances = self.serializer_class.Meta.model.objects.all()
            
            # Apply filters
            filtered_data = self.filterset_class(request.GET, queryset=instances)
            data = filtered_data.qs
            
            # Get pagination parameters from request
            page = request.GET.get('page', 1)
            limit = request.GET.get('limit', 12)  # Default to 12 items per page
            offset = request.GET.get('offset', 0)
            
            try:
                page = int(page)
                limit = int(limit)
                offset = int(offset)
            except ValueError:
                return create_response(
                    {"error": "Invalid pagination parameters. Page, limit and offset must be integers."},
                    "BAD_REQUEST",
                    400
                )
            
            # Apply offset and limit
            if offset > 0:
                data = data[offset:]
            
            paginator = Paginator(data, limit)
            
            try:
                paginated_data = paginator.page(page)
            except EmptyPage:
                return create_response(
                    {"error": "Page not found"},
                    "NOT_FOUND",
                    404
                )
            
            serialized_data = self.serializer_class(paginated_data, many=True).data
            
            response_data = {
                "count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page,
                "limit": limit,
                "offset": offset,
                "next": paginated_data.has_next(),
                "previous": paginated_data.has_previous(),
                "categories": serialized_data,
            }
            
            return create_response(response_data, "SUCCESSFUL", 200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def update_category(self, request):
        try:
            if "id" in request.data:
                # finding instance
                instance = Category.objects.filter(id=request.data["id"]).first()

                if instance:
                    request.POST._mutable = True
                    request.data["updated_by"] = request.user.id
                    request.POST._mutable = False

                    # updating the instance/record
                    serialized_data = CategorySerializer(instance, data=request.data, partial=True)
                    # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
                    if serialized_data.is_valid():
                        response = serialized_data.save()
                        response_data = CategorySerializer(response).data
                        return Response({"data": response_data}, 200)
                    else:
                        error_message = get_first_error_message(serialized_data.errors, "UNSUCCESSFUL")
                        return Response({'data': error_message}, 400)
                    # else:
                    #     return Response({'data': "Permission Denaied"}, 400)
                else:
                    return Response({"data": "NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)

        except Exception as e:
            return Response({'error': str(e)}, 500)

    def delete_category(self, request):
        try:
            if "id" in request.query_params:
                instance = Category.objects.filter(id=request.query_params['id']).first()

                if instance:
                    instance.delete()
                    return Response({"data": "SUCESSFULL"}, 200)
                else:
                    return Response({"data": "RECORD NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)
        


class TagController:
    serializer_class = TagSerializer
    filterset_class = TagFilter

    def create(self, request):
        try:
            request.POST._mutable = True
            request.data["created_by"] = request.user.id
            request.POST._mutable = False

            # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
            validated_data = TagSerializer(data=request.data)
            if validated_data.is_valid():
                response = validated_data.save()
                response_data = TagSerializer(response).data
                return Response({'data': response_data}, 200)
            else:
                error_message = get_first_error_message(validated_data.errors, "UNSUCCESSFUL")
                return Response({'data': error_message}, 400)
            # else:
            #     return Response({'data': "Permission Denaied"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)

    # mydata = Member.objects.filter(firstname__endswith='s').values()
    def get_tag(self, request):
        try:
            # Get all instances
            instances = self.serializer_class.Meta.model.objects.all()
            
            # Apply filters
            filtered_data = self.filterset_class(request.GET, queryset=instances)
            data = filtered_data.qs
            
            # Get pagination parameters from request
            page = request.GET.get('page', 1)
            limit = request.GET.get('limit', 12)  # Default to 12 items per page
            offset = request.GET.get('offset', 0)
            
            try:
                page = int(page)
                limit = int(limit)
                offset = int(offset)
            except ValueError:
                return create_response(
                    {"error": "Invalid pagination parameters. Page, limit and offset must be integers."},
                    "BAD_REQUEST",
                    400
                )
            
            # Apply offset and limit
            if offset > 0:
                data = data[offset:]
            
            paginator = Paginator(data, limit)
            
            try:
                paginated_data = paginator.page(page)
            except EmptyPage:
                return create_response(
                    {"error": "Page not found"},
                    "NOT_FOUND",
                    404
                )
            
            serialized_data = self.serializer_class(paginated_data, many=True).data
            
            response_data = {
                "count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page,
                "limit": limit,
                "offset": offset,
                "next": paginated_data.has_next(),
                "previous": paginated_data.has_previous(),
                "categories": serialized_data,
            }
            
            return create_response(response_data, "SUCCESSFUL", 200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def update_tag(self, request):
        try:
            if "id" in request.data:
                # finding instance
                instance = Tag.objects.filter(id=request.data["id"]).first()

                if instance:
                    request.POST._mutable = True
                    request.data["updated_by"] = request.user.id
                    request.POST._mutable = False

                    # updating the instance/record
                    serialized_data = TagSerializer(instance, data=request.data, partial=True)
                    # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
                    if serialized_data.is_valid():
                        response = serialized_data.save()
                        response_data = TagSerializer(response).data
                        return Response({"data": response_data}, 200)
                    else:
                        error_message = get_first_error_message(serialized_data.errors, "UNSUCCESSFUL")
                        return Response({'data': error_message}, 400)
                    # else:
                    #     return Response({'data': "Permission Denaied"}, 400)
                else:
                    return Response({"data": "NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)

        except Exception as e:
            return Response({'error': str(e)}, 500)

    def delete_tag(self, request):
        try:
            if "id" in request.query_params:
                instance = Tag.objects.filter(id=request.query_params['id']).first()

                if instance:
                    instance.delete()
                    return Response({"data": "SUCESSFULL"}, 200)
                else:
                    return Response({"data": "RECORD NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)




class BlogPostController:
    serializer_class = BlogPostSerializer
    filterset_class = BlogPostFilter

    def create(self, request):
        try:
            request.POST._mutable = True
            request.data["created_by"] = request.user.id
            request.POST._mutable = False

            # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
            validated_data = BlogPostSerializer(data=request.data)
            if validated_data.is_valid():
                response = validated_data.save()
                response_data = BlogPostSerializer(response).data
                return Response({'data': response_data}, 200)
            else:
                error_message = get_first_error_message(validated_data.errors, "UNSUCCESSFUL")
                return Response({'data': error_message}, 400)
            # else:
            #     return Response({'data': "Permission Denaied"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)

    # mydata = Member.objects.filter(firstname__endswith='s').values()
    def get_blogpost(self, request):
        try:
            # Get all instances
            instances = self.serializer_class.Meta.model.objects.all()
            
            # Apply filters
            filtered_data = self.filterset_class(request.GET, queryset=instances)
            data = filtered_data.qs
            
            # Get pagination parameters from request
            page = request.GET.get('page', 1)
            limit = request.GET.get('limit', 12)  # Default to 12 items per page
            offset = request.GET.get('offset', 0)
            
            try:
                page = int(page)
                limit = int(limit)
                offset = int(offset)
            except ValueError:
                return create_response(
                    {"error": "Invalid pagination parameters. Page, limit and offset must be integers."},
                    "BAD_REQUEST",
                    400
                )
            
            # Apply offset and limit
            if offset > 0:
                data = data[offset:]
            
            paginator = Paginator(data, limit)
            
            try:
                paginated_data = paginator.page(page)
            except EmptyPage:
                return create_response(
                    {"error": "Page not found"},
                    "NOT_FOUND",
                    404
                )
            
            serialized_data = self.serializer_class(paginated_data, many=True).data
            
            response_data = {
                "count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page,
                "limit": limit,
                "offset": offset,
                "next": paginated_data.has_next(),
                "previous": paginated_data.has_previous(),
                "categories": serialized_data,
            }
            
            return create_response(response_data, "SUCCESSFUL", 200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def update_blogpost(self, request):
        try:
            if "id" in request.data:
                # finding instance
                instance = BlogPost.objects.filter(id=request.data["id"]).first()

                if instance:
                    request.POST._mutable = True
                    request.data["updated_by"] = request.user.id
                    request.POST._mutable = False

                    # updating the instance/record
                    serialized_data = BlogPostSerializer(instance, data=request.data, partial=True)
                    # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
                    if serialized_data.is_valid():
                        response = serialized_data.save()
                        response_data = BlogPostSerializer(response).data
                        return Response({"data": response_data}, 200)
                    else:
                        error_message = get_first_error_message(serialized_data.errors, "UNSUCCESSFUL")
                        return Response({'data': error_message}, 400)
                    # else:
                    #     return Response({'data': "Permission Denaied"}, 400)
                else:
                    return Response({"data": "NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)

        except Exception as e:
            return Response({'error': str(e)}, 500)

    def delete_blogpost(self, request):
        try:
            if "id" in request.query_params:
                instance = BlogPost.objects.filter(id=request.query_params['id']).first()

                if instance:
                    instance.delete()
                    return Response({"data": "SUCESSFULL"}, 200)
                else:
                    return Response({"data": "RECORD NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)
        


class CommentController:
    serializer_class = CommentSerializer
    filterset_class = CommentFilter

    def create(self, request):
        try:
            request.POST._mutable = True
            request.data["created_by"] = request.user.id
            request.POST._mutable = False

            # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
            validated_data = CommentSerializer(data=request.data)
            if validated_data.is_valid():
                response = validated_data.save()
                response_data = CommentSerializer(response).data
                return Response({'data': response_data}, 200)
            else:
                error_message = get_first_error_message(validated_data.errors, "UNSUCCESSFUL")
                return Response({'data': error_message}, 400)
            # else:
            #     return Response({'data': "Permission Denaied"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)

    # mydata = Member.objects.filter(firstname__endswith='s').values()
    def get_comment(self, request):
        try:
            # Get all instances
            instances = self.serializer_class.Meta.model.objects.all()
            
            # Apply filters
            filtered_data = self.filterset_class(request.GET, queryset=instances)
            data = filtered_data.qs
            
            # Get pagination parameters from request
            page = request.GET.get('page', 1)
            limit = request.GET.get('limit', 12)  # Default to 12 items per page
            offset = request.GET.get('offset', 0)
            
            try:
                page = int(page)
                limit = int(limit)
                offset = int(offset)
            except ValueError:
                return create_response(
                    {"error": "Invalid pagination parameters. Page, limit and offset must be integers."},
                    "BAD_REQUEST",
                    400
                )
            
            # Apply offset and limit
            if offset > 0:
                data = data[offset:]
            
            paginator = Paginator(data, limit)
            
            try:
                paginated_data = paginator.page(page)
            except EmptyPage:
                return create_response(
                    {"error": "Page not found"},
                    "NOT_FOUND",
                    404
                )
            
            serialized_data = self.serializer_class(paginated_data, many=True).data
            
            response_data = {
                "count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page,
                "limit": limit,
                "offset": offset,
                "next": paginated_data.has_next(),
                "previous": paginated_data.has_previous(),
                "categories": serialized_data,
            }
            
            return create_response(response_data, "SUCCESSFUL", 200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def update_commemt(self, request):
        try:
            if "id" in request.data:
                # finding instance
                instance = Comment.objects.filter(id=request.data["id"]).first()

                if instance:
                    request.POST._mutable = True
                    request.data["updated_by"] = request.user.id
                    request.POST._mutable = False

                    # updating the instance/record
                    serialized_data = CommentSerializer(instance, data=request.data, partial=True)
                    # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
                    if serialized_data.is_valid():
                        response = serialized_data.save()
                        response_data = CommentSerializer(response).data
                        return Response({"data": response_data}, 200)
                    else:
                        error_message = get_first_error_message(serialized_data.errors, "UNSUCCESSFUL")
                        return Response({'data': error_message}, 400)
                    # else:
                    #     return Response({'data': "Permission Denaied"}, 400)
                else:
                    return Response({"data": "NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)

        except Exception as e:
            return Response({'error': str(e)}, 500)

    def delete_comment(self, request):
        try:
            if "id" in request.query_params:
                instance = Comment.objects.filter(id=request.query_params['id']).first()

                if instance:
                    instance.delete()
                    return Response({"data": "SUCESSFULL"}, 200)
                else:
                    return Response({"data": "RECORD NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)
        


class MediaController:
    serializer_class = MediaSerializer
    filterset_class = MediaFilter

    def create(self, request):
        try:
            request.POST._mutable = True
            request.data["created_by"] = request.user.id
            request.POST._mutable = False

            # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
            validated_data = MediaSerializer(data=request.data)
            if validated_data.is_valid():
                response = validated_data.save()
                response_data = MediaSerializer(response).data
                return Response({'data': response_data}, 200)
            else:
                error_message = get_first_error_message(validated_data.errors, "UNSUCCESSFUL")
                return Response({'data': error_message}, 400)
            # else:
            #     return Response({'data': "Permission Denaied"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)

    # mydata = Member.objects.filter(firstname__endswith='s').values()
    def get_media(self, request):
        try:
            # Get all instances
            instances = self.serializer_class.Meta.model.objects.all()
            
            # Apply filters
            filtered_data = self.filterset_class(request.GET, queryset=instances)
            data = filtered_data.qs
            
            # Get pagination parameters from request
            page = request.GET.get('page', 1)
            limit = request.GET.get('limit', 12)  # Default to 12 items per page
            offset = request.GET.get('offset', 0)
            
            try:
                page = int(page)
                limit = int(limit)
                offset = int(offset)
            except ValueError:
                return create_response(
                    {"error": "Invalid pagination parameters. Page, limit and offset must be integers."},
                    "BAD_REQUEST",
                    400
                )
            
            # Apply offset and limit
            if offset > 0:
                data = data[offset:]
            
            paginator = Paginator(data, limit)
            
            try:
                paginated_data = paginator.page(page)
            except EmptyPage:
                return create_response(
                    {"error": "Page not found"},
                    "NOT_FOUND",
                    404
                )
            
            serialized_data = self.serializer_class(paginated_data, many=True).data
            
            response_data = {
                "count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page,
                "limit": limit,
                "offset": offset,
                "next": paginated_data.has_next(),
                "previous": paginated_data.has_previous(),
                "categories": serialized_data,
            }
            
            return create_response(response_data, "SUCCESSFUL", 200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def update_media(self, request):
        try:
            if "id" in request.data:
                # finding instance
                instance = Media.objects.filter(id=request.data["id"]).first()

                if instance:
                    request.POST._mutable = True
                    request.data["updated_by"] = request.user.id
                    request.POST._mutable = False

                    # updating the instance/record
                    serialized_data = MediaSerializer(instance, data=request.data, partial=True)
                    # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
                    if serialized_data.is_valid():
                        response = serialized_data.save()
                        response_data = MediaSerializer(response).data
                        return Response({"data": response_data}, 200)
                    else:
                        error_message = get_first_error_message(serialized_data.errors, "UNSUCCESSFUL")
                        return Response({'data': error_message}, 400)
                    # else:
                    #     return Response({'data': "Permission Denaied"}, 400)
                else:
                    return Response({"data": "NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)

        except Exception as e:
            return Response({'error': str(e)}, 500)

    def delete_media(self, request):
        try:
            if "id" in request.query_params:
                instance = Media.objects.filter(id=request.query_params['id']).first()

                if instance:
                    instance.delete()
                    return Response({"data": "SUCESSFULL"}, 200)
                else:
                    return Response({"data": "RECORD NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)
        


class NewsletterController:
    serializer_class = NewsletterSerializer
    filterset_class = NewsletterFilter

    def create(self, request):
        try:
            request.POST._mutable = True
            request.data["created_by"] = request.user.id
            request.POST._mutable = False

            # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
            validated_data = NewsletterSerializer(data=request.data)
            if validated_data.is_valid():
                response = validated_data.save()
                response_data = NewsletterSerializer(response).data
                return Response({'data': response_data}, 200)
            else:
                error_message = get_first_error_message(validated_data.errors, "UNSUCCESSFUL")
                return Response({'data': error_message}, 400)
            # else:
            #     return Response({'data': "Permission Denaied"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)

    # mydata = Member.objects.filter(firstname__endswith='s').values()
    def get_newsletter(self, request):
        try:
            # Get all instances
            instances = self.serializer_class.Meta.model.objects.all()
            
            # Apply filters
            filtered_data = self.filterset_class(request.GET, queryset=instances)
            data = filtered_data.qs
            
            # Get pagination parameters from request
            page = request.GET.get('page', 1)
            limit = request.GET.get('limit', 12)  # Default to 12 items per page
            offset = request.GET.get('offset', 0)
            
            try:
                page = int(page)
                limit = int(limit)
                offset = int(offset)
            except ValueError:
                return create_response(
                    {"error": "Invalid pagination parameters. Page, limit and offset must be integers."},
                    "BAD_REQUEST",
                    400
                )
            
            # Apply offset and limit
            if offset > 0:
                data = data[offset:]
            
            paginator = Paginator(data, limit)
            
            try:
                paginated_data = paginator.page(page)
            except EmptyPage:
                return create_response(
                    {"error": "Page not found"},
                    "NOT_FOUND",
                    404
                )
            
            serialized_data = self.serializer_class(paginated_data, many=True).data
            
            response_data = {
                "count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page,
                "limit": limit,
                "offset": offset,
                "next": paginated_data.has_next(),
                "previous": paginated_data.has_previous(),
                "categories": serialized_data,
            }
            
            return create_response(response_data, "SUCCESSFUL", 200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def update_newsletter(self, request):
        try:
            if "id" in request.data:
                # finding instance
                instance = Newsletter.objects.filter(id=request.data["id"]).first()

                if instance:
                    request.POST._mutable = True
                    request.data["updated_by"] = request.user.id
                    request.POST._mutable = False

                    # updating the instance/record
                    serialized_data = NewsletterSerializer(instance, data=request.data, partial=True)
                    # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
                    if serialized_data.is_valid():
                        response = serialized_data.save()
                        response_data = NewsletterSerializer(response).data
                        return Response({"data": response_data}, 200)
                    else:
                        error_message = get_first_error_message(serialized_data.errors, "UNSUCCESSFUL")
                        return Response({'data': error_message}, 400)
                    # else:
                    #     return Response({'data': "Permission Denaied"}, 400)
                else:
                    return Response({"data": "NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)

        except Exception as e:
            return Response({'error': str(e)}, 500)

    def delete_newsletter(self, request):
        try:
            if "id" in request.query_params:
                instance = Newsletter.objects.filter(id=request.query_params['id']).first()

                if instance:
                    instance.delete()
                    return Response({"data": "SUCESSFULL"}, 200)
                else:
                    return Response({"data": "RECORD NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)
        


class CampaignController:
    serializer_class = CampaignSerializer
    filterset_class = CampaignFilter

    def create(self, request):
        try:
            request.POST._mutable = True
            request.data["created_by"] = request.user.id
            request.POST._mutable = False

            # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
            validated_data = CampaignSerializer(data=request.data)
            if validated_data.is_valid():
                response = validated_data.save()
                response_data = CampaignSerializer(response).data
                return Response({'data': response_data}, 200)
            else:
                error_message = get_first_error_message(validated_data.errors, "UNSUCCESSFUL")
                return Response({'data': error_message}, 400)
            # else:
            #     return Response({'data': "Permission Denaied"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)

    # mydata = Member.objects.filter(firstname__endswith='s').values()
    def get_campaign(self, request):
        try:
            # Get all instances
            instances = self.serializer_class.Meta.model.objects.all()
            
            # Apply filters
            filtered_data = self.filterset_class(request.GET, queryset=instances)
            data = filtered_data.qs
            
            # Get pagination parameters from request
            page = request.GET.get('page', 1)
            limit = request.GET.get('limit', 12)  # Default to 12 items per page
            offset = request.GET.get('offset', 0)
            
            try:
                page = int(page)
                limit = int(limit)
                offset = int(offset)
            except ValueError:
                return create_response(
                    {"error": "Invalid pagination parameters. Page, limit and offset must be integers."},
                    "BAD_REQUEST",
                    400
                )
            
            # Apply offset and limit
            if offset > 0:
                data = data[offset:]
            
            paginator = Paginator(data, limit)
            
            try:
                paginated_data = paginator.page(page)
            except EmptyPage:
                return create_response(
                    {"error": "Page not found"},
                    "NOT_FOUND",
                    404
                )
            
            serialized_data = self.serializer_class(paginated_data, many=True).data
            
            response_data = {
                "count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page,
                "limit": limit,
                "offset": offset,
                "next": paginated_data.has_next(),
                "previous": paginated_data.has_previous(),
                "categories": serialized_data,
            }
            
            return create_response(response_data, "SUCCESSFUL", 200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def update_campaign(self, request):
        try:
            if "id" in request.data:
                # finding instance
                instance = Campaign.objects.filter(id=request.data["id"]).first()

                if instance:
                    request.POST._mutable = True
                    request.data["updated_by"] = request.user.id
                    request.POST._mutable = False

                    # updating the instance/record
                    serialized_data = CampaignSerializer(instance, data=request.data, partial=True)
                    # if request.user.role in ['admin', 'manager'] or request.user.is_superuser:  # roles
                    if serialized_data.is_valid():
                        response = serialized_data.save()
                        response_data = CampaignSerializer(response).data
                        return Response({"data": response_data}, 200)
                    else:
                        error_message = get_first_error_message(serialized_data.errors, "UNSUCCESSFUL")
                        return Response({'data': error_message}, 400)
                    # else:
                    #     return Response({'data': "Permission Denaied"}, 400)
                else:
                    return Response({"data": "NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)

        except Exception as e:
            return Response({'error': str(e)}, 500)

    def delete_campaign(self, request):
        try:
            if "id" in request.query_params:
                instance = Campaign.objects.filter(id=request.query_params['id']).first()

                if instance:
                    instance.delete()
                    return Response({"data": "SUCESSFULL"}, 200)
                else:
                    return Response({"data": "RECORD NOT FOUND"}, 404)
            else:
                return Response({"data": "ID NOT PROVIDED"}, 400)
        except Exception as e:
            return Response({'error': str(e)}, 500)