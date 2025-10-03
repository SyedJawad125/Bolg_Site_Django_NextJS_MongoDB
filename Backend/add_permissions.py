import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')
import django
django.setup()
from user_auth.models import Permission

permissions = [
    Permission(name='Create Role', code_name='create_role', module_name='Role', description='User can create role'),
    Permission(name='Read Role', code_name='read_role', module_name='Role', description='User can read role'),
    Permission(name='Update Role', code_name='update_role', module_name='Role', description='User can update role'),
    Permission(name='Delete Role', code_name='delete_role', module_name='Role', description='User can delete role'),

    Permission(name='Create Category', code_name='create_category', module_name='Category', description='User can create category'),
    Permission(name='Read Category', code_name='read_category', module_name='Category', description='User can read category'),
    Permission(name='Update Category', code_name='update_category', module_name='Category', description='User can update category'),
    Permission(name='Delete Category', code_name='delete_category', module_name='Category', description='User can delete category'),

    Permission(name='Create Tag', code_name='create_tag', module_name='Tag', description='User can create tag'),
    Permission(name='Read Tag', code_name='read_tag', module_name='Tag', description='User can read tag'),
    Permission(name='Update Tag', code_name='update_tag', module_name='Tag', description='User can update tag'),
    Permission(name='Delete Tag', code_name='delete_tag', module_name='Tag', description='User can delete tag'),

    Permission(name='Create BlogPost', code_name='create_blogpost', module_name='BlogPost', description='User can create BlogPost'),
    Permission(name='Read BlogPost', code_name='read_blogpost', module_name='BlogPost', description='User can read BlogPost'),
    Permission(name='Update BlogPost', code_name='update_blogpost', module_name='BlogPost', description='User can update BlogPost'),
    Permission(name='Delete BlogPost', code_name='delete_blogpost', module_name='BlogPost', description='User can delete BlogPost'),
   
    Permission(name='Create Roles', code_name='create_roles', module_name='Roles', description='User can create roles'),
    Permission(name='Read Roles', code_name='read_roles', module_name='Roles', description='User can read roles'),
    Permission(name='Update Roles', code_name='update_roles', module_name='Roles', description='User can update roles'),
    Permission(name='Delete Roles', code_name='delete_roles', module_name='Roles', description='User can delete roles'),
   
    Permission(name='Create Permission', code_name='create_permission', module_name='Permission', description='User can create permission'),
    Permission(name='Read Permission', code_name='read_permission', module_name='Permission', description='User can read permission'),
    Permission(name='Update Permission', code_name='update_permission', module_name='Permission', description='User can update permission'),
    Permission(name='Delete Permission', code_name='delete_permission', module_name='Permission', description='User can delete permission'),
   
]


def add_permission():
    for permission in permissions:
        try:
            Permission.objects.get(code_name=permission.code_name)
        except Permission.DoesNotExist:
            permission.save()


if __name__ == '__main__':
    print("Populating hrm...")
    add_permission()