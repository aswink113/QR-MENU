from rest_framework import serializers
from .models import (
    Restaurant, Plan, Subscription, Payment,
    Template, Menu, Category, MenuItem,
    QRCodeRecord, MenuEvent, OrderRecord
)

class PlanSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()

    class Meta:
        model = Plan
        fields = '__all__'

    def get_price(self, obj):
        return obj.price_minor / 100.0


class MenuItemSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = '__all__'

    def get_price(self, obj):
        return obj.price_minor / 100.0


class CategorySerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = '__all__'


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = '__all__'


class MenuSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Menu
        fields = '__all__'


class SubscriptionSerializer(serializers.ModelSerializer):
    plan_details = PlanSerializer(source='plan', read_only=True)

    class Meta:
        model = Subscription
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    amount = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = '__all__'

    def get_amount(self, obj):
        return obj.amount_minor / 100.0


class QRCodeRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = QRCodeRecord
        fields = '__all__'


class OrderRecordSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()

    class Meta:
        model = OrderRecord
        fields = '__all__'

    def get_total(self, obj):
        return obj.total_minor / 100.0


class RestaurantSerializer(serializers.ModelSerializer):
    menus = MenuSerializer(many=True, read_only=True)
    subscriptions = SubscriptionSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = '__all__'
