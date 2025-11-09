import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django

django.setup()

from apps.users.models import Permission

permissions = [
    Permission(name='Show Role', code_name='show_role', module_name='Role', module_label='User Management', description='User can see role'),
    Permission(name='Create Role', code_name='create_role', module_name='Role', module_label='User Management', description='User can create role'),
    Permission(name='Read Role', code_name='read_role', module_name='Role', module_label='User Management', description='User can read role'),
    Permission(name='Update Role', code_name='update_role', module_name='Role', module_label='User Management', description='User can update role'),
    Permission(name='Delete Role', code_name='delete_role', module_name='Role', module_label='User Management', description='User can delete role'),

    Permission(name='Show User', code_name='show_user', module_name='User', module_label='User Management',
               description='User can see user'),
    Permission(name='Create User', code_name='create_user', module_name='User', module_label='User Management',
               description='User can create user'),
    Permission(name='Read User', code_name='read_user', module_name='User', module_label='User Management',
               description='User can read user'),
    Permission(name='Update User', code_name='update_user', module_name='User', module_label='User Management',
               description='User can update user'),
    Permission(name='Delete User', code_name='delete_user', module_name='User', module_label='User Management',
               description='User can delete user'),
    Permission(name='Deactivate User', code_name='toggle_user', module_name='User', module_label='User Management',
               description='User can deactivate user'),

    Permission(name='Show Auction', code_name='show_auction', module_name='Auction', module_label='Auction', description='User can see auction'),
    Permission(name='Create Auction', code_name='create_auction', module_name='Auction', module_label='Auction', description='User can create auction'),
    Permission(name='Read Auction', code_name='read_auction', module_name='Auction', module_label='Auction', description='User can read auction'),
    Permission(name='Update Auction', code_name='update_auction', module_name='Auction', module_label='Auction', description='User can update auction'),
    Permission(name='Delete Auction', code_name='delete_auction', module_name='Auction', module_label='Auction', description='User can delete auction'),

    Permission(name='Show Tag', code_name='show_tag', module_name='Tag', module_label='Tags', description='User can see tag'),
    Permission(name='Create Tag', code_name='create_tag', module_name='Tag', module_label='Tags', description='User can create tag'),
    Permission(name='Read Tag', code_name='read_tag', module_name='Tag', module_label='Tags', description='User can read tag'),
    Permission(name='Update Tag', code_name='update_tag', module_name='Tag', module_label='Tags', description='User can update tag'),
    Permission(name='Delete Tag', code_name='delete_tag', module_name='Tag', module_label='Tags', description='User can delete tag'),

    Permission(name='Show Lot', code_name='show_lot', module_name='Lot', module_label='Lots', description='User can see lot'),
    Permission(name='Create Lot', code_name='create_lot', module_name='Lot', module_label='Lots', description='User can create lot'),
    Permission(name='Read Lot', code_name='read_lot', module_name='Lot', module_label='Lots', description='User can read lot'),
    Permission(name='Update Lot', code_name='update_lot', module_name='Lot', module_label='Lots', description='User can update lot'),
    Permission(name='Delete Lot', code_name='delete_lot', module_name='Lot', module_label='Lots', description='User can delete lot'),

    Permission(name='Show FAQ', code_name='show_faq', module_name='FAQ', module_label='FAQs', description='User can see faq'),
    Permission(name='Create FAQ', code_name='create_faq', module_name='FAQ', module_label='FAQs', description='User can create faq'),
    Permission(name='Read FAQ', code_name='read_faq', module_name='FAQ', module_label='FAQs', description='User can read faq'),
    Permission(name='Update FAQ', code_name='update_faq', module_name='FAQ', module_label='FAQs', description='User can update faq'),
    Permission(name='Delete FAQ', code_name='delete_faq', module_name='FAQ', module_label='FAQs', description='User can delete faq'),

    Permission(name='Show Category', code_name='show_category', module_name='Category', module_label='Categories', description='User can see Category'),
    Permission(name='Create Category', code_name='create_category', module_name='Category', module_label='Categories', description='User can create Category'),
    Permission(name='Read Category', code_name='read_category', module_name='Category', module_label='Categories', description='User can read Category'),
    Permission(name='Update Category', code_name='update_category', module_name='Category', module_label='Categories', description='User can update Category'),
    Permission(name='Delete Category', code_name='delete_category', module_name='Category', module_label='Categories', description='User can delete Category'),

    Permission(name='Show NewsUpdate', code_name='show_newsupdate', module_name='NewsUpdate', module_label='NewsUpdate', description='User can see NewsUpdate'),
    Permission(name='Create NewsUpdate', code_name='create_newsupdate', module_name='NewsUpdate', module_label='NewsUpdate', description='User can create NewsUpdate'),
    Permission(name='Read NewsUpdate', code_name='read_newsupdate', module_name='NewsUpdate', module_label='NewsUpdate', description='User can read NewsUpdate'),
    Permission(name='Update NewsUpdate', code_name='update_newsupdate', module_name='NewsUpdate', module_label='NewsUpdate', description='User can update NewsUpdate'),
    Permission(name='Delete NewsUpdate', code_name='delete_newsupdate', module_name='NewsUpdate', module_label='NewsUpdate', description='User can delete NewsUpdate')
]


def add_permission():
    for permission in permissions:
        try:
            Permission.objects.get(code_name=permission.code_name)
        except Permission.DoesNotExist:
            permission.save()


if __name__ == '__main__':
    print("Populating Permissions ...")
    add_permission()