// ===== Mock Data Store for QRMenu SaaS =====

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  cuisine: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  status: 'active' | 'inactive';
  publishedAt: string | null;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'annual';
  features: string[];
  limits: {
    menus: number;
    items: number;
    templates: number;
    analytics: boolean;
    customDomain: boolean;
    qrDownloads: number;
    staff: number;
  };
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  restaurantId: string;
  planId: string;
  status: 'pending' | 'trialing' | 'active' | 'past_due' | 'cancel_at_period_end' | 'canceled';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  gateway: string;
  gatewaySubscriptionId: string;
}

export interface Category {
  id: string;
  restaurantId: string;
  menuId: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  dietaryLabel: string[];
  isAvailable: boolean;
  sortOrder: number;
}

export interface Menu {
  id: string;
  restaurantId: string;
  title: string;
  templateId: string;
  themeConfig: ThemeConfig;
  isPublished: boolean;
  publishedAt: string | null;
}

export interface ThemeConfig {
  template: string;
  brand: {
    primary: string;
    background: string;
    text: string;
    fontHeading: string;
    fontBody: string;
  };
  header: {
    showLogo: boolean;
    showCoverImage: boolean;
  };
  layout: {
    cardStyle: 'card' | 'list' | 'grid';
    showImages: boolean;
    showDescriptions: boolean;
  };
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending' | 'refunded';
  paidAt: string;
  receiptUrl: string;
}

export interface Template {
  id: string;
  name: string;
  code: string;
  previewImage: string;
  description: string;
  isActive: boolean;
}

// ===== Mock Plans =====
export const mockPlans: Plan[] = [
  {
    id: 'plan-1',
    code: 'starter',
    name: 'Starter',
    price: 499,
    currency: 'INR',
    interval: 'monthly',
    isPopular: false,
    features: [
      '1 Digital Menu',
      'Up to 50 items',
      '1 Template',
      'QR Code generation',
      'Mobile-optimized menu',
      'Basic analytics',
    ],
    limits: {
      menus: 1,
      items: 50,
      templates: 1,
      analytics: false,
      customDomain: false,
      qrDownloads: 5,
      staff: 1,
    },
  },
  {
    id: 'plan-2',
    code: 'growth',
    name: 'Growth',
    price: 1299,
    currency: 'INR',
    interval: 'monthly',
    isPopular: true,
    features: [
      '3 Digital Menus',
      'Unlimited items',
      'All Templates',
      'Custom branding & colors',
      'Advanced analytics',
      'Priority support',
      '3 Staff accounts',
      'Custom QR designs',
    ],
    limits: {
      menus: 3,
      items: -1,
      templates: -1,
      analytics: true,
      customDomain: false,
      qrDownloads: 50,
      staff: 3,
    },
  },
  {
    id: 'plan-3',
    code: 'pro',
    name: 'Pro',
    price: 2999,
    currency: 'INR',
    interval: 'monthly',
    isPopular: false,
    features: [
      'Unlimited Menus',
      'Unlimited items',
      'All Templates + Priority',
      'Custom domain',
      'Full analytics dashboard',
      'Dedicated support',
      'Unlimited staff',
      'API access',
      'White-label option',
    ],
    limits: {
      menus: -1,
      items: -1,
      templates: -1,
      analytics: true,
      customDomain: true,
      qrDownloads: -1,
      staff: -1,
    },
  },
];

// ===== Mock Restaurant =====
export const mockRestaurant: Restaurant = {
  id: 'rest-1',
  name: 'My Restaurant',
  slug: 'my-restaurant',
  logo: '',
  coverImage: '',
  cuisine: '',
  address: '',
  phone: '',
  email: '',
  timezone: 'Asia/Kolkata',
  status: 'active',
  publishedAt: null,
};

// ===== Mock Subscription =====
export const mockSubscription: Subscription = {
  id: 'sub-1',
  restaurantId: 'rest-1',
  planId: 'plan-1',
  status: 'active',
  currentPeriodStart: new Date().toISOString(),
  currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
  cancelAtPeriodEnd: false,
  gateway: 'Razorpay',
  gatewaySubscriptionId: 'sub_live',
};

import { ALL_TEMPLATES } from './templates'

// ===== Mock Templates (105+ Handcrafted Templates) =====
export const mockTemplates: Template[] = ALL_TEMPLATES.map(t => ({
  id: t.id,
  name: t.name,
  code: t.code,
  previewImage: t.previewImage,
  description: t.description,
  isActive: true,
}));

// ===== Mock Categories =====
export const mockCategories: Category[] = [];

// ===== Mock Menu Items =====
export const mockMenuItems: MenuItem[] = [];

// ===== Mock Menu =====
export const mockMenu: Menu = {
  id: 'menu-1',
  restaurantId: 'rest-1',
  title: 'Digital Menu',
  templateId: 'tpl-luxury-01',
  isPublished: true,
  publishedAt: new Date().toISOString(),
  themeConfig: {
    template: 'velvet-noir',
    brand: {
      primary: '#D4AF37',
      background: '#0A0B10',
      text: '#FDFBF7',
      fontHeading: 'Cinzel',
      fontBody: 'Cormorant Garamond',
    },
    header: {
      showLogo: true,
      showCoverImage: true,
    },
    layout: {
      cardStyle: 'card',
      showImages: true,
      showDescriptions: true,
    },
  },
};

// ===== Mock Payments =====
export const mockPayments: Payment[] = [];

// ===== Mock Analytics =====
export const mockAnalytics = {
  totalScans: 0,
  uniqueVisitors: 0,
  avgSessionTime: '0m 00s',
  topItem: 'None yet',
  weeklyScans: [0, 0, 0, 0, 0, 0, 0],
  monthlyScans: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  scansByDevice: { mobile: 0, desktop: 0, tablet: 0 },
  scansByHour: Array.from({length: 24}, (_, i) => ({
    hour: i,
    scans: 0,
  })),
};

// ===== Admin Mock Data =====
export const mockAdminRestaurants: any[] = [];

export const formatPrice = (amount: number, currency = 'INR') => {
  if (currency === 'INR') {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  }
  if (currency === 'EUR') return `€${amount.toFixed(2)}`;
  if (currency === 'GBP') return `£${amount.toFixed(2)}`;
  if (currency === 'AED') return `${amount.toFixed(2)} د.إ`;
  if (currency === 'SAR') return `${amount.toFixed(2)} ﷼`;
  return `$${amount.toFixed(2)}`;
};

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
