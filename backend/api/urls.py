from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    
    # Public customer menu & orders
    path('public/menu/<slug:slug>/', views.public_menu_by_slug, name='public_menu'),
    path('orders/', views.create_guest_order, name='create_order'),
    path('waiter-call/', views.call_waiter, name='call_waiter'),
    
    # Restaurant & Dashboard endpoints
    path('restaurants/', views.restaurant_list_create, name='restaurants'),
    path('restaurants/<slug:slug>/', views.restaurant_detail, name='restaurant_detail'),
    
    # Menu editor
    path('categories/', views.category_list_create, name='categories'),
    path('items/', views.item_list_create, name='items'),
    path('items/<uuid:pk>/', views.item_detail, name='item_detail'),
    
    # Billing & plans
    path('plans/', views.plan_list, name='plans'),
    path('billing/subscription/', views.subscription_status, name='subscription_status'),
    
    # Analytics & Templates
    path('analytics/', views.analytics_overview, name='analytics'),
    path('templates/', views.template_list, name='templates'),
]
