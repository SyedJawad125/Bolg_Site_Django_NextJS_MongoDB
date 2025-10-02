# from rest_framework.exceptions import PermissionDenied, ValidationError
# from user_auth.models import Role


# def permission_required(permissions):
#     def decorator(drf_custom_method):
#         def _decorator(self, *args, **kwargs):
#             if self.request.user.deactivated:
#                 raise ValidationError({"message": "You have been deactivated, Please contact administrator."})
#             if hasattr(self.request.user, 'role') and Role.objects.filter(pk=self.request.user.role.pk, permissions__code_name__in=permissions).exists():
#                 return drf_custom_method(self, *args, **kwargs)
#             else:
#                 raise PermissionDenied({"message": "You do not have the required permission."})
#         return _decorator
#     return decorator



from rest_framework.exceptions import PermissionDenied, ValidationError
from user_auth.models import Role


def permission_required(permissions):
    def decorator(drf_custom_method):
        def _decorator(self, *args, **kwargs):
            # Check if user is deactivated
            if self.request.user.deactivated:
                raise ValidationError({"message": "You have been deactivated, Please contact administrator."})
            
            # Check if user is superuser (bypass permission check)
            if self.request.user.is_superuser:
                return drf_custom_method(self, *args, **kwargs)
            
            # Check if user has a role assigned
            if not hasattr(self.request.user, 'role') or self.request.user.role is None:
                raise PermissionDenied({"message": "No role assigned. Please contact administrator."})
            
            # Check if user's role has the required permissions
            if Role.objects.filter(pk=self.request.user.role.pk, permissions__code_name__in=permissions).exists():
                return drf_custom_method(self, *args, **kwargs)
            else:
                raise PermissionDenied({"message": "You do not have the required permission."})
        
        return _decorator
    return decorator