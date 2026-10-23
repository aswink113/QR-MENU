import json
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import (
    Restaurant, Plan, Subscription, Payment,
    Template, Menu, Category, MenuItem,
    QRCodeRecord, MenuEvent, OrderRecord
)
from .serializers import (
    RestaurantSerializer, PlanSerializer, SubscriptionSerializer,
    PaymentSerializer, TemplateSerializer, MenuSerializer,
    CategorySerializer, MenuItemSerializer, QRCodeRecordSerializer,
    OrderRecordSerializer
)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        'status': 'healthy',
        'db': 'postgresql',
        'time': timezone.now().isoformat()
    })

# ===== Public Customer Menu Endpoint =====
@api_view(['GET'])
@permission_classes([AllowAny])
def public_menu_by_slug(request, slug):
    restaurant = get_object_or_404(Restaurant, slug=slug)
    
    # Record scan / view event
    MenuEvent.objects.create(
        restaurant=restaurant,
        event_type='scan',
        metadata={'user_agent': request.META.get('HTTP_USER_AGENT', 'unknown')}
    )
    
    menu = restaurant.menus.filter(is_published=True).first()
    categories = Category.objects.filter(restaurant=restaurant, is_active=True).prefetch_related('items')
    
    cat_data = []
    for cat in categories:
        items = cat.items.filter(is_available=True)
        cat_data.append({
            'id': str(cat.id),
            'name': cat.name,
            'sort_order': cat.sort_order,
            'items': [
                {
                    'id': str(item.id),
                    'name': item.name,
                    'description': item.description,
                    'price': item.price_minor / 100.0,
                    'price_minor': item.price_minor,
                    'image_url': item.image_url,
                    'dietary_labels': item.dietary_labels,
                    'is_available': item.is_available,
                    'calories': item.calories,
                    'prep_time': item.prep_time,
                    'spicy_level': item.spicy_level,
                }
                for item in items
            ]
        })

    return Response({
        'restaurant': {
            'id': str(restaurant.id),
            'name': restaurant.name,
            'slug': restaurant.slug,
            'logo_url': restaurant.logo_url,
            'cover_url': restaurant.cover_url,
            'address': restaurant.address,
            'phone': restaurant.phone,
            'currency': restaurant.currency or 'INR',
            'status': restaurant.status,
        },
        'menu': {
            'title': menu.title if menu else 'Digital Menu',
            'theme_config': menu.theme_config if menu else {},
        },
        'categories': cat_data
    })


# ===== Guest Place Order =====
@api_view(['POST'])
@permission_classes([AllowAny])
def create_guest_order(request):
    data = request.data
    slug = data.get('restaurant_slug', 'the-spice-route')
    restaurant = Restaurant.objects.filter(slug=slug).first()
    if not restaurant:
        restaurant = Restaurant.objects.first()

    table_number = data.get('table_number', '14')
    items = data.get('items', [])
    total_minor = int(data.get('total_minor', 0))

    order = OrderRecord.objects.create(
        restaurant=restaurant,
        table_number=table_number,
        items=items,
        total_minor=total_minor,
        status='kitchen'
    )

    MenuEvent.objects.create(
        restaurant=restaurant,
        event_type='order',
        metadata={'order_id': str(order.id), 'total': total_minor / 100.0}
    )

    return Response(OrderRecordSerializer(order).data, status=status.HTTP_201_CREATED)


# ===== Call Waiter Action =====
@api_view(['POST'])
@permission_classes([AllowAny])
def call_waiter(request):
    data = request.data
    slug = data.get('restaurant_slug', 'the-spice-route')
    table_number = data.get('table_number', '14')
    restaurant = Restaurant.objects.filter(slug=slug).first()
    
    if restaurant:
        MenuEvent.objects.create(
            restaurant=restaurant,
            event_type='waiter_call',
            metadata={'table': table_number}
        )

    return Response({'status': 'notified', 'table': table_number})


# ===== Restaurant Management (Owner Dashboard) =====
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def restaurant_list_create(request):
    if request.method == 'GET':
        restaurants = Restaurant.objects.all()
        return Response(RestaurantSerializer(restaurants, many=True).data)
    else:
        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH'])
@permission_classes([AllowAny])
def restaurant_detail(request, slug):
    restaurant = get_object_or_404(Restaurant, slug=slug)
    if request.method == 'GET':
        return Response(RestaurantSerializer(restaurant).data)
    else:
        serializer = RestaurantSerializer(restaurant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===== Category CRUD =====
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def category_list_create(request):
    if request.method == 'GET':
        slug = request.query_params.get('slug', 'the-spice-route')
        restaurant = Restaurant.objects.filter(slug=slug).first()
        categories = Category.objects.filter(restaurant=restaurant) if restaurant else Category.objects.all()
        return Response(CategorySerializer(categories, many=True).data)
    else:
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===== Menu Item CRUD =====
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def item_list_create(request):
    if request.method == 'GET':
        slug = request.query_params.get('slug', 'the-spice-route')
        restaurant = Restaurant.objects.filter(slug=slug).first()
        items = MenuItem.objects.filter(restaurant=restaurant) if restaurant else MenuItem.objects.all()
        return Response(MenuItemSerializer(items, many=True).data)
    else:
        serializer = MenuItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def item_detail(request, pk):
    item = get_object_or_404(MenuItem, pk=pk)
    if request.method == 'GET':
        return Response(MenuItemSerializer(item).data)
    elif request.method == 'PATCH':
        serializer = MenuItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        item.delete()
        return Response({'deleted': True}, status=status.HTTP_204_NO_CONTENT)


# ===== Plans and Subscriptions =====
@api_view(['GET'])
@permission_classes([AllowAny])
def plan_list(request):
    plans = Plan.objects.filter(is_active=True)
    return Response(PlanSerializer(plans, many=True).data)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def subscription_status(request):
    slug = request.query_params.get('slug', 'the-spice-route')
    restaurant = Restaurant.objects.filter(slug=slug).first()
    sub = Subscription.objects.filter(restaurant=restaurant).first() if restaurant else Subscription.objects.first()
    
    if not sub:
        return Response({'subscription': None})
    return Response(SubscriptionSerializer(sub).data)


# ===== Analytics =====
@api_view(['GET'])
@permission_classes([AllowAny])
def analytics_overview(request):
    slug = request.query_params.get('slug', 'the-spice-route')
    restaurant = Restaurant.objects.filter(slug=slug).first()
    
    total_scans = MenuEvent.objects.filter(restaurant=restaurant, event_type='scan').count()
    total_orders = OrderRecord.objects.filter(restaurant=restaurant).count()
    items_count = MenuItem.objects.filter(restaurant=restaurant, is_available=True).count()

    actual_revenue = sum(o.total_minor for o in OrderRecord.objects.filter(restaurant=restaurant)) / 100.0 if total_orders > 0 else 0.0

    return Response({
        'total_scans': total_scans,
        'total_orders': total_orders,
        'active_items': items_count,
        'revenue_estimate': actual_revenue
    })


# ===== Templates =====
@api_view(['GET'])
@permission_classes([AllowAny])
def template_list(request):
    templates = Template.objects.filter(is_active=True)
    return Response(TemplateSerializer(templates, many=True).data)

