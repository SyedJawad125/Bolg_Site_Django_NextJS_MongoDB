from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .controllers import BlogPostController, CategoryController, TagController
from utils.decorator import permission_required

category_controller = CategoryController()
tag_controller = TagController()
blogpost_controller = BlogPostController()


class CategoryViews(ModelViewSet):
    """Luxury Task ViewSet"""
    # authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)

    # permission_classes = [IsAuthenticated]

    @permission_required(['create_category'])
    def post_category(self, request):
        return category_controller.create(request)

    @permission_required(['read_category'])
    def get_category(self, request):
        return category_controller.get_category(request)

    @permission_required(['update_category'])
    def update_category(self, request):
        return category_controller.update_category(request)

    @permission_required(['delete_category'])
    def delete_category(self, request):
        return category_controller.delete_category(request)


class TagViews(ModelViewSet):
    """Luxury TaskTag (Label) ViewSet"""
    # authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)
    

    @permission_required(['create_tag'])
    def post_tag(self, request):
        return tag_controller.create(request)

    @permission_required(['read_tag'])
    def get_tag(self, request):
        return tag_controller.get_tag(request)

    @permission_required(['update_tag'])
    def update_tag(self, request):
        return tag_controller.update_tag(request)

    @permission_required(['delete_tag'])
    def delete_tag(self, request):
        return tag_controller.delete_tag(request)

class BlogPostViews(ModelViewSet):
    """Luxury BlogPost (Label) ViewSet"""
    # authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)
    

    @permission_required(['create_blogpost'])
    def post_blogpost(self, request):
        return blogpost_controller.create(request)

    @permission_required(['read_blogpost'])
    def get_blogpost(self, request):
        return blogpost_controller.get_blogpost(request)

    @permission_required(['update_blogpost'])
    def update_blogpost(self, request):
        return blogpost_controller.update_blogpost(request)

    @permission_required(['delete_blogpost'])
    def delete_blogpost(self, request):
        return blogpost_controller.delete_blogpost(request)
