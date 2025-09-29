from django.urls import path
from .views import (LoginView, RefreshView, LogoutView, ForgetPasswordView, VerifyLinkView, ResetPasswordView,
                    PermissionView, EmployeeView, EmployeeToggleView, RoleView)

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('refresh/', RefreshView.as_view()),
    path('logout/', LogoutView.as_view()),

    path('forget/password/', ForgetPasswordView.as_view()),
    path('verify/link/', VerifyLinkView.as_view()),
    path('reset/password/', ResetPasswordView.as_view()),

    path('', EmployeeView.as_view()),
    path('toggle/', EmployeeToggleView.as_view()),

    path('permission/', PermissionView.as_view()),
    path('role/', RoleView.as_view()),

]
