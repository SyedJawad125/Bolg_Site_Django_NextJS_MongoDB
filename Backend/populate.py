import os
import django

# Set the Django settings module environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')

# Set up Django
django.setup()

from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from user_auth.models import Role, Permission

User = get_user_model()

def populate():
    # --- Step 1: Ensure Superuser Role Exists ---
    permissions = Permission.objects.all()
    try:
        role = Role.objects.get(code_name='su')
        print('Superuser Role already exists.')
        # Clear existing permissions and re-assign all
        role.permissions.clear()
    except Role.DoesNotExist:
        role = Role.objects.create(name='Super', code_name='su')
        print('Superuser Role created successfully.')
    
    # Assign all permissions to superuser role
    role.permissions.add(*permissions)
    role.save()

    # --- Step 2: Ensure Superuser Account Exists ---
    try:
        s_user = User.objects.get(username='nicenick')
        print('Superuser already exists.')
    except User.DoesNotExist:
        s_user = User.objects.create_superuser(
            username='nicenick',
            email='nicenick1992@gmail.com',
            password='nicenick2025'
        )
        print('Superuser created successfully.')

    # --- Step 3: Assign Role and Other Flags ---   
    s_user.role = role
    s_user.is_active = True
    s_user.is_verified = True
    s_user.is_blocked = False
    s_user.name = 'Nice Nick'
    s_user.mobile = '0333 1906382'
    s_user.save()
    print('Superuser role and permissions assigned successfully.')

if __name__ == '__main__':
    populate()








# import os

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# import django

# django.setup()

# from apps.users.models import User, Role, Permission
# from django.contrib.auth.hashers import make_password
# from config import settings
# from apps.notification.models import EmailTemplate


# def populate():
#     permissions = Permission.objects.all()
#     try:
#         role = Role.objects.get(code_name='su')
#         role.permissions.clear()
#     except Role.DoesNotExist:
#         role = Role.objects.create(name='Super', code_name='su')
#     role.permissions.add(*permissions)
#     role.save()

#     try:
#         s_user = User.objects.get(username='superuser')
#     except User.DoesNotExist:
#         s_user = User.objects.create_superuser(
#             username="superuser",
#             password="Admin@1234",
#         )
#         s_user.name = 'Super User'
#         s_user.role = role
#         s_user.save()
#     s_user.is_active = True
#     s_user.is_verified = True
#     s_user.is_blocked = False
#     s_user.name = 'Super User'
#     s_user.save()


#     try:
#         s_user = User.objects.get(username='admin@yopmail.com')
#     except User.DoesNotExist:
#         s_user = User.objects.create(
#             username="admin@yopmail.com",
#             password=make_password("Admin@1234"),
#             role=role,
#             type='Employee'
#         )
#     s_user.is_active = True
#     s_user.is_verified = True
#     s_user.is_blocked = False
#     s_user.save()

#     try:
#         s_user = User.objects.get(username='haider@yopmail.com')
#     except User.DoesNotExist:
#         s_user = User.objects.create(
#             username="haider@yopmail.com",
#             password=make_password("Admin@1234"),
#             role=role,
#             name='Haider',
#             type='Employee',
#             is_active=True,
#             is_blocked=False,
#             is_verified=True
#         )



# def email_templates():
#     email_temp_dict = {
#         "forget_password": "Forget Password",
#         "user_invitation": "Invite Employee",
#         "user_delete": "Delete Employee",
#         "user_deactivated": "Deactivate Employee",
#         "user_reactivated": "Reactivate Employee",
#     }

#     print('Notifications - Email Templates...')

#     for key, value in email_temp_dict.items():
#         file_path = os.path.join(settings.TEMPLATES[0]['DIRS'][0], 'email', f'{key}.html')
#         try:
#             with open(file_path, 'r', encoding='utf-8') as f:
#                 html_content = f.read()
#         except FileNotFoundError:
#             print(f"Template file not found at {file_path}")
#             continue

#         template_obj, created = EmailTemplate.objects.update_or_create(
#             name=key.replace('_', ' ').title(),
#             defaults={
#                 'code_name': key,
#                 'subject': value,
#                 'alternative_text': value,
#                 'html_template': html_content
#             }
#         )
#         print(f"{'Created' if created else 'Updated'} email template: {template_obj.name}")


# if __name__ == '__main__':
#     print("Populating data...")
#     populate()
#     email_templates()