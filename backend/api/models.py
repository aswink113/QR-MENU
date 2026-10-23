import uuid
from django.db import models
from django.contrib.auth.models import User

class Restaurant(models.Model):
    STATUS_CHOICES = [
        ('trial', 'Trial'),
        ('active', 'Active'),
        ('suspended', 'Suspended'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restaurants', null=True, blank=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    logo_url = models.TextField(blank=True, default='')
    cover_url = models.TextField(blank=True, default='')
    address = models.TextField(blank=True, default='')
    phone = models.CharField(max_length=50, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    currency = models.CharField(max_length=10, default='INR', help_text="e.g. INR, USD, EUR, GBP, AED")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.slug})"


class Plan(models.Model):
    INTERVAL_CHOICES = [
        ('monthly', 'Monthly'),
        ('annual', 'Annual'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    price_minor = models.PositiveIntegerField(help_text="Price in minor units (e.g. paise/cents)")
    currency = models.CharField(max_length=10, default='INR')
    billing_interval = models.CharField(max_length=20, choices=INTERVAL_CHOICES, default='monthly')
    feature_config = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.price_minor / 100:.2f} {self.currency}/{self.billing_interval}"


class Subscription(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('trialing', 'Trialing'),
        ('active', 'Active'),
        ('past_due', 'Past Due'),
        ('cancel_at_period_end', 'Cancel at Period End'),
        ('canceled', 'Canceled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, related_name='subscriptions')
    gateway = models.CharField(max_length=50, default='razorpay')
    gateway_customer_id = models.CharField(max_length=100, blank=True, default='')
    gateway_subscription_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='active')
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.restaurant.name} - {self.plan.name} ({self.status})"


class Payment(models.Model):
    STATUS_CHOICES = [
        ('captured', 'Captured'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='payments')
    gateway_payment_id = models.CharField(max_length=100, unique=True)
    amount_minor = models.PositiveIntegerField()
    currency = models.CharField(max_length=10, default='INR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='captured')
    paid_at = models.DateTimeField(auto_now_add=True)
    receipt_url = models.TextField(blank=True, default='')

    def __str__(self):
        return f"Payment {self.gateway_payment_id} - {self.amount_minor/100:.2f} {self.currency}"


class Template(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    preview_image_url = models.TextField(blank=True, default='')
    default_config = models.JSONField(default=dict, blank=True)
    version = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Menu(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menus')
    title = models.CharField(max_length=255, default='Main Menu')
    template = models.ForeignKey(Template, on_delete=models.SET_NULL, null=True, blank=True)
    theme_config = models.JSONField(default=dict, blank=True)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} - {self.restaurant.name}"


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='categories')
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE, related_name='categories', null=True, blank=True)
    name = models.CharField(max_length=100)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return f"{self.name} ({self.restaurant.name})"


class MenuItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='items')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    price_minor = models.PositiveIntegerField(help_text="Price in minor units (paise/cents)")
    image_url = models.TextField(blank=True, default='')
    dietary_labels = models.JSONField(default=list, blank=True, help_text="e.g. ['veg', 'gluten-free']")
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    calories = models.CharField(max_length=50, blank=True, default='')
    prep_time = models.CharField(max_length=50, blank=True, default='')
    spicy_level = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'name']

    def __str__(self):
        return f"{self.name} - {self.price_minor/100:.2f}"


class QRCodeRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='qr_codes')
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE, related_name='qr_codes', null=True, blank=True)
    public_url = models.TextField()
    format = models.CharField(max_length=10, default='png')
    table_number = models.CharField(max_length=50, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"QR {self.table_number or 'General'} - {self.restaurant.name}"


class MenuEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=50) # 'scan', 'view', 'order', 'waiter_call'
    metadata = models.JSONField(default=dict, blank=True)
    occurred_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event_type} - {self.restaurant.name} at {self.occurred_at}"


class OrderRecord(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('kitchen', 'In Kitchen'),
        ('served', 'Served'),
        ('completed', 'Completed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='orders')
    table_number = models.CharField(max_length=50, default='14')
    items = models.JSONField(default=list)
    total_minor = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order Table {self.table_number} ({self.status}) - {self.total_minor/100:.2f}"
