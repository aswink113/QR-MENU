from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import (
    Restaurant, Plan, Subscription, Template,
    Menu, Category, MenuItem, QRCodeRecord
)

class Command(BaseCommand):
    help = 'Seeds initial restaurant, plans, menu, and dishes into PostgreSQL'

    def handle(self, *args, **options):
        self.stdout.write("Seeding PostgreSQL data for QR Menu SaaS...")

        # 1. Plans
        starter, _ = Plan.objects.get_or_create(
            code='starter',
            defaults={
                'name': 'Starter',
                'price_minor': 29900,
                'currency': 'INR',
                'billing_interval': 'monthly',
                'feature_config': {'menus': 1, 'qr_downloads': True, 'templates': 'basic'},
                'is_active': True,
            }
        )

        pro, _ = Plan.objects.get_or_create(
            code='pro',
            defaults={
                'name': 'Professional',
                'price_minor': 59900,
                'currency': 'INR',
                'billing_interval': 'monthly',
                'feature_config': {'menus': 5, 'qr_downloads': True, 'templates': 'all', 'analytics': True},
                'is_active': True,
            }
        )

        enterprise, _ = Plan.objects.get_or_create(
            code='enterprise',
            defaults={
                'name': 'Enterprise',
                'price_minor': 99900,
                'currency': 'INR',
                'billing_interval': 'monthly',
                'feature_config': {'menus': 999, 'custom_domain': True, 'priority_support': True},
                'is_active': True,
            }
        )

        # 2. Templates
        noir, _ = Template.objects.get_or_create(
            code='noir',
            defaults={
                'name': 'Velvet Noir (Michelin)',
                'preview_image_url': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
                'default_config': {'accent': '#D4AF37', 'bg': '#0A0B10'},
                'version': 1,
                'is_active': True,
            }
        )

        sunset, _ = Template.objects.get_or_create(
            code='sunset',
            defaults={
                'name': 'Sunset Bistro',
                'preview_image_url': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
                'default_config': {'accent': '#FF6B35', 'bg': '#0E0F1E'},
                'version': 1,
                'is_active': True,
            }
        )

        botanica, _ = Template.objects.get_or_create(
            code='botanical',
            defaults={
                'name': 'Emerald Botanica',
                'preview_image_url': 'https://images.unsplash.com/photo-1543353071-087092ec393a?w=600',
                'default_config': {'accent': '#2EC4B6', 'bg': '#06130D'},
                'version': 1,
                'is_active': True,
            }
        )

        # 3. Primary Restaurant: The Spice Garden
        restaurant, _ = Restaurant.objects.get_or_create(
            slug='the-spice-route',
            defaults={
                'name': 'The Spice Garden',
                'logo_url': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop',
                'cover_url': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop',
                'address': '42 Brigade Road, Bengaluru, KA 560001',
                'phone': '+91 80 4123 4567',
                'email': 'contact@thespicegarden.in',
                'timezone': 'Asia/Kolkata',
                'status': 'active',
                'published_at': timezone.now(),
            }
        )

        # Also create spice-garden slug alias for demo
        Restaurant.objects.get_or_create(
            slug='spice-garden',
            defaults={
                'name': 'The Spice Garden',
                'logo_url': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop',
                'cover_url': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop',
                'address': '42 Brigade Road, Bengaluru, KA 560001',
                'phone': '+91 80 4123 4567',
                'email': 'contact@thespicegarden.in',
                'timezone': 'Asia/Kolkata',
                'status': 'active',
                'published_at': timezone.now(),
            }
        )

        # 4. Subscription for restaurant
        Subscription.objects.get_or_create(
            restaurant=restaurant,
            defaults={
                'plan': pro,
                'gateway': 'razorpay',
                'gateway_customer_id': 'cust_live_89324792',
                'gateway_subscription_id': 'sub_live_93481023',
                'status': 'active',
                'current_period_start': timezone.now(),
                'current_period_end': timezone.now() + timezone.timedelta(days=30),
                'cancel_at_period_end': False,
            }
        )

        # 5. Menu
        menu, _ = Menu.objects.get_or_create(
            restaurant=restaurant,
            defaults={
                'title': 'A La Carte & Tasting Menu',
                'template': noir,
                'theme_config': {
                    'template': 'noir',
                    'brand': {'primary': '#D4AF37', 'background': '#0A0B10'},
                    'layout': {'showImages': True, 'showDescriptions': True}
                },
                'is_published': True,
                'published_at': timezone.now(),
            }
        )

        # 6. Categories
        cat_specials, _ = Category.objects.get_or_create(
            restaurant=restaurant,
            name="Chef's Specials",
            defaults={'sort_order': 1, 'is_active': True, 'menu': menu}
        )

        cat_steaks, _ = Category.objects.get_or_create(
            restaurant=restaurant,
            name="Steaks & Wagyu",
            defaults={'sort_order': 2, 'is_active': True, 'menu': menu}
        )

        cat_pasta, _ = Category.objects.get_or_create(
            restaurant=restaurant,
            name="Handmade Pasta",
            defaults={'sort_order': 3, 'is_active': True, 'menu': menu}
        )

        cat_drinks, _ = Category.objects.get_or_create(
            restaurant=restaurant,
            name="Mixology & Cocktails",
            defaults={'sort_order': 4, 'is_active': True, 'menu': menu}
        )

        cat_desserts, _ = Category.objects.get_or_create(
            restaurant=restaurant,
            name="Artisan Desserts",
            defaults={'sort_order': 5, 'is_active': True, 'menu': menu}
        )

        # 7. Menu Items
        dishes = [
            {
                'category': cat_steaks,
                'name': 'Smoked Truffle Wagyu Ribeye (A5)',
                'description': 'Charcoal-seared A5 Japanese Wagyu, 48-hr bone marrow jus, shaved Périgord black truffle, roasted king trumpet.',
                'price_minor': 4800, # $48.00 or ₹4,800
                'image_url': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
                'dietary_labels': ['gluten-free', 'non-veg'],
                'calories': '740 kcal',
                'prep_time': '22 min',
                'spicy_level': 0,
            },
            {
                'category': cat_specials,
                'name': 'Saffron & Butter-Poached Lobster Tagliolini',
                'description': 'Handmade squid-ink & saffron strands, sweet Maine lobster claw, Oscietra royal caviar, Meyer lemon velvet.',
                'price_minor': 3900,
                'image_url': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
                'dietary_labels': ['signature', 'non-veg'],
                'calories': '580 kcal',
                'prep_time': '18 min',
                'spicy_level': 0,
            },
            {
                'category': cat_specials,
                'name': 'Artisanal Pugliese Burrata & Roasted Fig',
                'description': 'Imported Puglia burrata, lavender honey roasted Adriatic figs, 25-yr Modena balsamic drizzle, Sicilian pistachio crunch.',
                'price_minor': 2400,
                'image_url': 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&auto=format&fit=crop&q=80',
                'dietary_labels': ['veg', 'organic'],
                'calories': '420 kcal',
                'prep_time': '10 min',
                'spicy_level': 0,
            },
            {
                'category': cat_drinks,
                'name': 'Smoked Rosemary Blood Orange Mezcalita',
                'description': 'Artisanal Oaxaca espadín mezcal, torched organic rosemary, fresh blood orange cordial, black volcanic salt rim.',
                'price_minor': 1900,
                'image_url': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80',
                'dietary_labels': ['cocktail', 'veg'],
                'calories': '190 kcal',
                'prep_time': '5 min',
                'spicy_level': 1,
            },
            {
                'category': cat_desserts,
                'name': 'Gold Leaf Dark Chocolate Lava Sphere',
                'description': '70% Valrhona dark chocolate molten core, Madagascar bourbon vanilla bean gelato, edible 24k gold flakes.',
                'price_minor': 1800,
                'image_url': 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=600&auto=format&fit=crop&q=80',
                'dietary_labels': ['veg'],
                'calories': '510 kcal',
                'prep_time': '12 min',
                'spicy_level': 0,
            }
        ]

        for d in dishes:
            MenuItem.objects.get_or_create(
                restaurant=restaurant,
                name=d['name'],
                defaults={
                    'category': d['category'],
                    'description': d['description'],
                    'price_minor': d['price_minor'],
                    'image_url': d['image_url'],
                    'dietary_labels': d['dietary_labels'],
                    'calories': d['calories'],
                    'prep_time': d['prep_time'],
                    'spicy_level': d['spicy_level'],
                    'is_available': True,
                }
            )

        # 8. QR Code record
        QRCodeRecord.objects.get_or_create(
            restaurant=restaurant,
            table_number='14',
            defaults={
                'menu': menu,
                'public_url': 'http://localhost:5174/menu/the-spice-route',
                'format': 'svg',
            }
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded all data into PostgreSQL database 'qrmenu'!"))
