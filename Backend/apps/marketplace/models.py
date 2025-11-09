from django.db import models
from utils.reusable_classes import TimeStamps, TimeUserStamps
from utils.status_enums import  *
from utils.enums import *


class Auction(TimeUserStamps):
    def auction_image_path(self, filename):
        return f'auction_images/{str(self.title)}_{self.start_date}_{self.end_date}.png'

    status_choices = (
        (LIVE, LIVE),
        (SCHEDULED, SCHEDULED),
        (DRAFT, DRAFT),
        (ENDED, ENDED)
    )
    title = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    total_bids = models.IntegerField(default=0)
    total_lots = models.IntegerField(default=0)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to=auction_image_path, null=True, blank=True)
    status = models.CharField(max_length=25, choices=status_choices, default=DRAFT)


class Lot(TimeUserStamps):
    type_choices = (
        (BUY_NOW, BUY_NOW),
        (AUCTION, AUCTION),
        (PROCESSED, PROCESSED)
    )
    title = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    year = models.PositiveIntegerField(default=1800)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    cost = models.PositiveBigIntegerField()
    starting_price = models.PositiveBigIntegerField()
    tag = models.ForeignKey('misc.Tag', on_delete=models.PROTECT, null=True, blank=True)
    status = models.CharField(max_length=25, choices=type_choices, default=BUY_NOW)
    country = models.ForeignKey('misc.Country', on_delete=models.PROTECT, null=True, blank=True)


class LotImage(TimeUserStamps):
    def lot_image_path(self, filename):
        return f'lot_images/{str(self.lot.title)}_{self.created_at}.png'

    type_choices = (
        (FRONT, FRONT),
        (BACK, BACK),
        (NORMAL, NORMAL)
    )
    lot = models.ForeignKey(Lot, on_delete=models.PROTECT, related_name="lot_images")
    image = models.ImageField(upload_to=lot_image_path)
    type = models.CharField(max_length=25, choices=type_choices, default=NORMAL)


class AuctionLot(TimeUserStamps):
    status_choices = (
        (SOLD, SOLD),
        (NOT_SOLD, SOLD)
    )
    auction = models.ForeignKey(Auction, on_delete=models.PROTECT, related_name='auction_lot_track')
    lot = models.ForeignKey(Lot, on_delete=models.PROTECT, related_name='lot_auction_track')
    status = models.CharField(max_length=25, choices=status_choices, default=NOT_SOLD)
    sold_price = models.PositiveBigIntegerField(null=True, blank=True)


class NewsUpdateCategory(TimeUserStamps):
    STATUS_CHOICES = (
        (ACTIVE, 'Active'),
        (INACTIVE, 'Inactive'),
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=ACTIVE)

    def __str__(self):
        return self.name


class NewsUpdate(TimeUserStamps):
    def news_update_image_path(self, filename):
        title =self.title.replace(" ", "_")
        return f'news_update_images/{title}_{self.created_at}.png'

    STATUS_CHOICES = (
        (DRAFT, 'Draft'),
        (PUBLISHED, 'Published'),
        (ARCHIVED, 'Archived'),
    )
    title = models.CharField(max_length=255)
    ### here ckeditor thing
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to=news_update_image_path, blank=True, null=True)
    category = models.ForeignKey(
        NewsUpdateCategory,
        on_delete=models.PROTECT,
        related_name='news_updates'
    )
    tag = models.ForeignKey('misc.Tag', on_delete=models.PROTECT, related_name='news_update', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=DRAFT)
    published_at = models.DateTimeField(blank=True, null=True)
    author = models.CharField(max_length=100)

    def __str__(self):
        return self.title
