import os
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django

django.setup()

from apps.users.models import User, Role, Permission
from django.contrib.auth.hashers import make_password
from config import settings
from apps.notification.models import EmailTemplate
from apps.misc.models import (Region, SubRegion, Country, State, City, CountryTimezone, Currency, CountryCurrency)
from django.db import transaction


def populate():
    permissions = Permission.objects.all()
    try:
        role = Role.objects.get(code_name='su')
        role.permissions.clear()
    except Role.DoesNotExist:
        role = Role.objects.create(name='Super', code_name='su')
    role.permissions.add(*permissions)
    role.save()

    try:
        s_user = User.objects.get(username='superuser')
    except User.DoesNotExist:
        s_user = User.objects.create_superuser(
            username="superuser",
            password="Admin@1234",
        )
        s_user.name = 'Super User'
        s_user.role = role
        s_user.save()
    s_user.is_active = True
    s_user.is_verified = True
    s_user.is_blocked = False
    s_user.name = 'Super User'
    s_user.save()


    try:
        s_user = User.objects.get(username='admin@yopmail.com')
    except User.DoesNotExist:
        s_user = User.objects.create(
            username="admin@yopmail.com",
            password=make_password("Admin@1234"),
            role=role,
            type='Employee'
        )
    s_user.is_active = True
    s_user.is_verified = True
    s_user.is_blocked = False
    s_user.save()

    try:
        s_user = User.objects.get(username='haider@yopmail.com')
    except User.DoesNotExist:
        s_user = User.objects.create(
            username="haider@yopmail.com",
            password=make_password("Admin@1234"),
            role=role,
            first_name='Haider',
            last_name='Ali',
            type='Employee',
            is_active=True,
            is_blocked=False,
            is_verified=True
        )


    try:
        s_user = User.objects.get(username='rizwan@yopmail.com')
    except User.DoesNotExist:
        s_user = User.objects.create(
            username="rizwan@yopmail.com",
            password=make_password("Admin@1234"),
            role=role,
            first_name='Rizwan',
            last_name='Khattak',
            type='Employee',
            is_active=True,
            is_blocked=False,
            is_verified=True
        )



def email_templates():
    email_temp_dict = {
        "forget_password": "Forget Password",
        "user_invitation": "Invite Employee",
        "user_delete": "Delete Employee",
        "user_deactivated": "Deactivate Employee",
        "user_reactivated": "Reactivate Employee",
    }

    print('Notifications - Email Templates...')

    for key, value in email_temp_dict.items():
        file_path = os.path.join(settings.TEMPLATES[0]['DIRS'][0], 'email', f'{key}.html')
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
        except FileNotFoundError:
            print(f"Template file not found at {file_path}")
            continue

        template_obj, created = EmailTemplate.objects.update_or_create(
            name=key.replace('_', ' ').title(),
            defaults={
                'code_name': key,
                'subject': value,
                'alternative_text': value,
                'html_template': html_content
            }
        )
        print(f"{'Created' if created else 'Updated'} email template: {template_obj.name}")


def regions():
    with open('json_files/regions.json', 'r', encoding='utf-8') as file:
        print('Regions, SubRegions...')
        regions = json.load(file)
        for item in regions:
            try:
                Region.objects.get(name=item['name'])
            except Region.DoesNotExist:
                region = Region.objects.create(name=item['name'])
                if item.get('sub_regions'):
                    list_ = []
                    for i in item.get('sub_regions'):
                        list_.append(SubRegion(region=region, name=i['name']))
                    SubRegion.objects.bulk_create(list_)


def currencies():
    with open('json_files/currencies.json', 'r', encoding='utf-8') as file:
        currencies = json.load(file)
        print('Currencies...')
        for item in currencies:
            try:
                Currency.objects.get(code=item['code'])
            except Currency.DoesNotExist:
                Currency.objects.create(**item)


def countries():
    with open('json_files/countries.json', 'r', encoding='utf-8') as file:
        countries = json.load(file)
        print('Countries, Timezones, States, Cities...')
        regions = Region.objects.all()
        regions_dict = {item.name: item for item in regions}
        sub_regions = SubRegion.objects.all()
        sub_regions_dict = {item.name: item for item in sub_regions}
        currencies = Currency.objects.all()
        currencies_dict = {item.code: item for item in currencies}
        gulf_countries = ['Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Bahrain', 'Oman', 'Qatar', 'Yemen', 'Iraq', 'Djibouti', 'Ghana']

        with transaction.atomic():
            for item in countries:
                if item['name'] in gulf_countries:
                    try:
                        country = Country.objects.get(name=item.get('name'))
                        if item['name'] == "United Arab Emirates":
                            country.code = "UAE"
                            country.save()
                    except Country.DoesNotExist:
                        if item['name'] == 'Antarctica':
                            continue
                        states = None
                        timezones = None
                        if 'states' in item:
                            states = item.pop('states')

                        if 'translations' in item:
                            item.pop('translations')

                        if 'id' in item:
                            item.pop('id')

                        if 'timezones' in item:
                            timezones = item.pop('timezones')
                        try:
                            if 'region' in item:
                                if regions_dict.get(item['region']):
                                    item['region'] = regions_dict[item['region']]
                                else:
                                    item.pop('region')
                        except Exception as e:
                            print('failing on region')
                            print(item['name'])
                            raise(e)
                        if 'subregion' in item:
                            if sub_regions_dict.get(item['subregion']):
                                item['sub_region'] = sub_regions_dict[item['subregion']]
                            item.pop('subregion')

                        try:
                            if item['name'] == "United Arab Emirates":
                                item['code'] = "UAE"
                            country = Country.objects.create(**item)

                        except Exception as e:
                            print("failing on country")
                            print(f"{item['name']}")
                            raise (e)

                        #######################Country Currency ####################
                        try:
                            if item.get('currency_code'):
                                if currencies_dict.get(item['currency_code']):
                                    currency_obj = currencies_dict[item['currency_code']]
                                    CountryCurrency.objects.create(country=country, currency=currency_obj, is_primary_currency=True)
                        except Exception as e:
                            print('failing on currency')
                            print(item['name'])
                            raise (e)

                        ####################### Timezone ############################

                        if timezones:
                            list_ = []
                            for t in timezones:
                                t['country'] = country
                                list_.append(CountryTimezone(**t))
                            try:
                                CountryTimezone.objects.bulk_create(list_)
                            except Exception as e:
                                print("failing on timezone")
                                print(f"{item['name']} - {t['zoneName']}")
                                raise (e)

                        ####################### State ############################

                        if states:
                            cities = None
                            for s in states:
                                if 'id' in s:
                                    s.pop('id')
                                if 'cities' in s:
                                    cities = s.pop('cities')

                                s['country'] = country
                                if s['state_code'] is None:
                                    s.pop('state_code')
                                try:
                                    state = State.objects.create(**s)
                                except Exception as e:
                                    print("failing on state")
                                    print(f"{item['name']} - {s['name']}")
                                    raise(e)

                                if cities:
                                    list_ = []
                                    for c in cities:
                                        if 'id' in c:
                                            c.pop('id')
                                        c['country'] = country
                                        c['state'] = state
                                        list_.append(City(**c))
                                    try:
                                        City.objects.bulk_create(list_)
                                    except Exception as e:
                                        print("failing on city")
                                        print(f"{item['name']} - {state.name} - {c['name']}")
                                        raise(e)



if __name__ == '__main__':
    print("Populating data...")
    populate()
    email_templates()
    regions()
    currencies()
    countries()