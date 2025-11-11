from django.db import models
from utils.reusable_classes import TimeUserStamps, TimeStamps
from utils.enums import *
from utils.validators import *


class Tag(TimeUserStamps):
    status_choices = (
        (ACTIVE, ACTIVE),
        (INACTIVE, INACTIVE)
    )
    name = models.CharField(max_length=100)
    color_code = models.CharField(max_length=20)
    status = models.CharField(choices=status_choices, max_length=10, default=INACTIVE)


class Region(TimeStamps):
    name = models.CharField(max_length=20, validators=[val_name])


class SubRegion(TimeStamps):
    name = models.CharField(max_length=50, validators=[val_name])
    region = models.ForeignKey(Region, related_name='sub_regions', on_delete=models.PROTECT)


class Country(TimeStamps):
    name = models.CharField(max_length=100, validators=[val_name])
    code = models.CharField(max_length=5, validators=[val_code_name])
    iso2 = models.CharField(max_length=5, validators=[val_code_name])
    numeric_code = models.CharField(max_length=5, validators=[val_num])
    phone_code = models.CharField(max_length=5, validators=[val_num])
    capital = models.CharField(max_length=50, validators=[val_name])
    currency_code = models.CharField(max_length=5, validators=[val_code_name])
    currency_name = models.CharField(max_length=100, validators=[val_name])
    currency_symbol = models.CharField(max_length=10)
    tld = models.CharField(max_length=5)
    region = models.ForeignKey(Region, related_name='region_countries', on_delete=models.SET_NULL, null=True, blank=True)
    sub_region = models.ForeignKey(SubRegion, related_name='sub_region_countries', null=True, blank=True, on_delete=models.SET_NULL)
    nationality = models.CharField(max_length=50)
    professional_language = models.CharField(max_length=50, default='English')
    latitude = models.CharField(max_length=50, validators=[val_long_lat], null=True, blank=True)
    longitude = models.CharField(max_length=50, validators=[val_long_lat], null=True, blank=True)
    emoji = models.CharField(max_length=5)
    emojiU = models.CharField(max_length=50)


class CountryTimezone(TimeStamps):
    country = models.ForeignKey(Country, on_delete=models.PROTECT, related_name='country_timezone')
    zoneName = models.CharField(max_length=50)
    gmtOffset = models.IntegerField()
    gmtOffsetName = models.CharField(max_length=50)
    abbreviation = models.CharField(max_length=5)
    tzName = models.CharField(max_length=100)


class State(TimeStamps):
    country = models.ForeignKey(Country, related_name='country_states', on_delete=models.PROTECT)
    name = models.CharField(max_length=50, validators=[val_name])
    state_code = models.CharField(max_length=5, validators=[val_business_name], null=True, blank=True)
    latitude = models.CharField(max_length=50, validators=[val_long_lat], null=True, blank=True)
    longitude = models.CharField(max_length=50, validators=[val_long_lat], null=True, blank=True)
    type = models.CharField(max_length=50, null=True, blank=True)


class City(TimeStamps):
    country = models.ForeignKey(Country, related_name='country_cities', on_delete=models.PROTECT)
    state = models.ForeignKey(State, related_name='state_cities', on_delete=models.PROTECT)
    name = models.CharField(max_length=100, validators=[val_name])
    latitude = models.CharField(max_length=50, validators=[val_long_lat], null=True, blank=True)
    longitude = models.CharField(max_length=50, validators=[val_long_lat], null=True, blank=True)


class Currency(TimeStamps):
    name = models.CharField(max_length=50, validators=[val_name])
    code = models.CharField(max_length=5, validators=[val_code_name])

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        self.code = self.code.upper()
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class CountryCurrency(TimeStamps):
    country = models.ForeignKey(Country, related_name='country_currencies', on_delete=models.PROTECT)
    currency = models.ForeignKey(Currency, related_name='currencies_country', on_delete=models.PROTECT)
    is_primary_currency = models.BooleanField(default=False)

    class Meta:
        unique_together = ('country', 'currency')

    def __str__(self):
        return f"{self.country.name} - {self.currency.name}"


class Faq(TimeUserStamps):
    status_choices = (
        (PUBLISHED, PUBLISHED),
        (ARCHIVED, ARCHIVED),
    )
    question = models.CharField(max_length=500)
    answer = models.TextField()
    status = models.CharField(choices=status_choices, max_length=10, default=ARCHIVED)


class Business(TimeUserStamps):
    name = models.CharField(max_length=255, default='Bidalot Auctions')
    website_url = models.URLField(max_length=255, default='http://www.bidalot.com')
    support_email = models.EmailField(max_length=255, default='support@bidalot.com')

    def __str__(self): return self.name


class BusinessImage(TimeUserStamps):
    def business_image_path(self, filename): 
        return f'business_images/{self.type}_{self.created_at}.png'
    
    type_choices = (
        (LOGO, LOGO),
        (HERO_IMAGE, HERO_IMAGE)
        )
    business = models.ForeignKey(Business, on_delete=models.PROTECT, related_name="business_images")
    image = models.ImageField(upload_to=business_image_path)
    type = models.CharField(max_length=25, choices=type_choices)

    def __str__(self): return f"{self.business.name} - {self.type}"
