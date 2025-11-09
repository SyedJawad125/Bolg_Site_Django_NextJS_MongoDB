from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .controllers import BlogPostController, CampaignController, CategoryController, CommentController, MediaController, NewsletterController, TagController
from utils.decorator import permission_required

category_controller = CategoryController()
tag_controller = TagController()
blogpost_controller = BlogPostController()
comment_controller = CommentController()
media_controller = MediaController()
newsletter_controller = NewsletterController()
campaign_controller = CampaignController()


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


class CommentViews(ModelViewSet):
    """Luxury Comment (Label) ViewSet"""
    # authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)
    
    @permission_required(['create_comment'])
    def post_comment(self, request):
        return comment_controller.create(request)

    @permission_required(['read_comment'])
    def get_comment(self, request):
        return comment_controller.get_comment(request)

    @permission_required(['update_comment'])
    def update_comment(self, request):
        return comment_controller.update_comment(request)

    @permission_required(['delete_comment'])
    def delete_comment(self, request):
        return comment_controller.delete_comment(request)
    

class MediaViews(ModelViewSet):
    """Luxury Comment (Label) ViewSet"""
    # authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)
    
    @permission_required(['create_media'])
    def post_media(self, request):
        return media_controller.create(request)

    @permission_required(['read_media'])
    def get_media(self, request):
        return media_controller.get_media(request)

    @permission_required(['update_media'])
    def update_media(self, request):
        return media_controller.update_media(request)

    @permission_required(['delete_media'])
    def delete_media(self, request):
        return media_controller.delete_media(request)


class NewsletterViews(ModelViewSet):
    """Luxury Newsletter (Label) ViewSet"""
    # authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)
    
    @permission_required(['create_newsletter'])
    def post_newsletter(self, request):
        return newsletter_controller.create(request)

    @permission_required(['read_newsletter'])
    def get_newsletter(self, request):
        return newsletter_controller.get_newsletter(request)

    @permission_required(['update_newsletter'])
    def update_newsletter(self, request):
        return newsletter_controller.update_newsletter(request)

    @permission_required(['delete_blogpost'])
    def delete_newsletter(self, request):
        return newsletter_controller.delete_newsletter(request)
    
class CampaignViews(ModelViewSet):
    """Luxury Campaign (Label) ViewSet"""
    # authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)
    
    @permission_required(['create_campaign'])
    def post_campaign(self, request):
        return campaign_controller.create(request)

    @permission_required(['read_campaign'])
    def get_campaign(self, request):
        return campaign_controller.get_campaign(request)

    @permission_required(['update_campaign'])
    def update_campaign(self, request):
        return campaign_controller.update_campaign(request)

    @permission_required(['delete_campaign'])
    def delete_campaign(self, request):
        return campaign_controller.delete_campaign(request)