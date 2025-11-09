from rest_framework import serializers
from .models import Auction, Lot, LotImage, AuctionLot, NewsUpdate, NewsUpdateCategory
from utils.status_enums import *
from datetime import timedelta, datetime
from config.settings import AUCTION_START_TIME_DELAY, BACKEND_BASE_URL
from utils.reusable_functions import get_first_error
from django.db import transaction
from utils.enums import *
from ..misc.serializers import TagListingSerializer, CountrySerializer


class AuctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auction
        fields = '__all__'
        read_only_fields = ('total_bids', 'total_lots', 'created_at', 'updated_at', 'deleted', 'created_by', 'updated_by')

    def validate(self, attrs):
        request = self.context.get('request')
        start_date = attrs.get('start_date', None)
        end_date = attrs.get('end_date', None)
        start_time = attrs.get('start_time', None)
        attrs['status'] = request.query_params.get('status', SCHEDULED).title()

        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError(f"End Date must be greater then Start Date")
        elif start_date == end_date:
            raise serializers.ValidationError(f"End Date must be greater then Start Date")

        if self.instance:
            if start_date:
                obj = Auction.objects.filter(end_date__gt=start_date, deleted=False).exclude(id=self.instance.id).last()
                if obj:
                    raise serializers.ValidationError(f"An {obj.status} auction already exists in start date range")
            if start_time:
                obj = Auction.objects.filter(end_date=start_date, deleted=False).exclude(id=self.instance.id).first()
                if obj and obj.end_time and start_time <= obj.end_time:
                    raise serializers.ValidationError(
                        f"An {obj.status} auction with Same Date & higher End Time already exists")
            else:
                obj = Auction.objects.filter(deleted=False).exclude(id=self.instance.id).last()
                if obj and obj.end_time:
                    dummy_datetime = datetime.combine(datetime.today(), obj.end_time)
                    new_datetime = dummy_datetime + timedelta(minutes=AUCTION_START_TIME_DELAY)
                    attrs['start_time'] = new_datetime.time()
        else:
            if start_date:
                obj = Auction.objects.filter(end_date__gt=start_date, deleted=False).last()
                if obj:
                    raise serializers.ValidationError(f"An {obj.status} auction already exists in start date range")
            if start_time:
                obj = Auction.objects.filter(end_date=start_date, deleted=False).first()
                if obj and obj.end_time and start_time <= obj.end_time:
                    raise serializers.ValidationError(f"An {obj.status} auction with Same Date & higher End Time already exists")
            else:
                obj = Auction.objects.filter(deleted=False).last()
                if obj and obj.end_time:
                    dummy_datetime = datetime.combine(datetime.today(), obj.end_time)
                    new_datetime = dummy_datetime + timedelta(minutes=AUCTION_START_TIME_DELAY)
                    attrs['start_time'] = new_datetime.time()
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = instance.created_by.full_name if instance.created_by else None
        data['updated_by'] = instance.updated_by.full_name if instance.updated_by else None
        return data


class AuctionListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auction
        fields = ['id', 'title', 'start_date', 'end_date']


class LotImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LotImage
        fields = ['id', 'image', 'type']


class AuctionLotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuctionLot
        fields = ['id', 'auction', 'lot']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['auction_id'] = instance.auction.id
        data['auction_name'] = instance.auction.title
        del data['auction']
        del data['lot']
        return data


class LotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lot
        exclude = ['deleted']
        read_only_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')

    def validate(self, attrs):
        title = attrs.get('title', None)

        if self.instance:
            if Lot.objects.filter(title=title, deleted=False).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(f"Lot with name {title} already exists")
        else:
            if Lot.objects.filter(title=title, deleted=False).exists():
                raise serializers.ValidationError(f"Lot with name {title} already exists")
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        if not request.data.get('front_image'):
            raise serializers.ValidationError("Front Image Required")
        if not request.data.get('back_image'):
            raise serializers.ValidationError("Back Image Required")

        with transaction.atomic():
            instance = Lot.objects.create(**validated_data)
            if request.data.get('auction'):
                data = {"auction": request.data.get('auction'), "lot": instance.id}
                auction_lot_instance = AuctionLotSerializer(data=data)
                if auction_lot_instance.is_valid():
                    auction_lot_instance.save(created_by=request.user)
                    instance.status = AUCTION
                    instance.save()
                else:
                    raise serializers.ValidationError(get_first_error(auction_lot_instance.errors))

            data = [
                LotImage(lot=instance, image=request.data.get('front_image'), type=FRONT, created_by=request.user),
                LotImage(lot=instance, image=request.data.get('back_image'), type=BACK, created_by=request.user)
            ]
            if request.data.get('images'):
                for item in request.data.getlist('images'):
                    data.append(LotImage(lot=instance, image=item, created_by=request.user))
            LotImage.objects.bulk_create(data)

        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = instance.created_by.full_name if instance.created_by else None
        data['updated_by'] = instance.updated_by.full_name if instance.updated_by else None
        data['auctions_attended'] = AuctionLot.objects.filter(lot=instance.id, deleted=False).count()
        images = LotImageSerializer(instance.lot_images.filter(deleted=False), many=True).data
        images = [{**item, "image": f"{BACKEND_BASE_URL}{item['image']}"} for item in images]
        front_image = [item for item in images if item['type']==FRONT]
        back_image = [item for item in images if item['type']==BACK]
        data['front_image'] = front_image[0]['image'] if front_image else None
        data['back_image'] = back_image[0]['image'] if back_image else None
        data['images'] = [item for item in images if item['type'] not in [FRONT, BACK]]
        last_auction = instance.lot_auction_track.filter(deleted=False).last()
        data['auction'] = AuctionLotSerializer(last_auction).data if last_auction else None
        data['tag'] = TagListingSerializer(instance.tag).data if instance.tag else None
        data['country'] = CountrySerializer(instance.country).data if instance.country else None
        return data


class NewsUpdateCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsUpdateCategory
        fields = ['id', 'name', 'description', 'status', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = instance.created_by.full_name if instance.created_by else None
        data['updated_by'] = instance.updated_by.full_name if instance.updated_by else None
        return data

class NewsUpdateCategoryListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsUpdateCategory
        fields = ('id', 'name', 'description')


class NewsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsUpdate
        exclude = ['deleted'] if 'deleted' in [f.name for f in NewsUpdate._meta.fields] else []
        read_only_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')

    def validate(self, attrs):
        title = attrs.get('title', None)
        if self.instance:
            if NewsUpdate.objects.filter(title=title).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(f"News Update with title '{title}' already exists.")
        else:
            if NewsUpdate.objects.filter(title=title).exists():
                raise serializers.ValidationError(f"News Update with title '{title}' already exists.")
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = instance.created_by.full_name if instance.created_by else None
        data['updated_by'] = instance.updated_by.full_name if instance.updated_by else None
        data['category'] = NewsUpdateCategoryListingSerializer(instance.category).data if instance.category else None
        data['tag'] = TagListingSerializer(instance.tag).data if instance.tag else None
        return data
