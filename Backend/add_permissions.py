import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')
import django
django.setup()
from permissions.models import Permission

permissions = [
    Permission(name='Create Role', code='create_role', module_name='Role', description='User can create role'),
    Permission(name='Read Role', code='read_role', module_name='Role', description='User can read role'),
    Permission(name='Update Role', code='update_role', module_name='Role', description='User can update role'),
    Permission(name='Delete Role', code='delete_role', module_name='Role', description='User can delete role'),

    Permission(name='Create Category', code='create_category', module_name='Category', description='User can create category'),
    Permission(name='Read Category', code='read_category', module_name='Category', description='User can read category'),
    Permission(name='Update Category', code='update_category', module_name='Category', description='User can update category'),
    Permission(name='Delete Category', code='delete_category', module_name='Category', description='User can delete category'),

    Permission(name='Create Tag', code='create_tag', module_name='Tag', description='User can create tag'),
    Permission(name='Read Tag', code='read_tag', module_name='Tag', description='User can read tag'),
    Permission(name='Update Tag', code='update_tag', module_name='Tag', description='User can update tag'),
    Permission(name='Delete Tag', code='delete_tag', module_name='Tag', description='User can delete tag'),
   
]


def add_permission():
    for permission in permissions:
        try:
            Permission.objects.get(code=permission.code)
        except Permission.DoesNotExist:
            permission.save()


if __name__ == '__main__':
    print("Populating hrm...")
    add_permission()