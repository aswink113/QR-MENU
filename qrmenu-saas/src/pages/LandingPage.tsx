import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  QrCode, Smartphone, Palette, BarChart3, Shield, Zap,
  ChevronRight, Star, Check, ArrowRight, Globe, Users,
  CreditCard, Menu, X, Sparkles, TrendingUp, Clock,
  Flame, Wine, Lock, ExternalLink, Copy, CheckCircle2,
  ShoppingBag, Eye, Heart
} from 'lucide-react'
import { mockPlans, formatPrice } from '../data/mockData'
import { ALL_TEMPLATES, TEMPLATE_CATEGORIES, MenuTemplate } from '../data/templates'

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Owner, The Spice Garden',
    avatar: 'RS',
    text: 'QRMenu transformed our restaurant. Customers love scanning the QR and seeing our beautiful digital menu. Menu updates that used to take days now take seconds!',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Manager, Café Aroma',
    avatar: 'PP',
    text: 'Setting up was incredibly easy. We had our digital menu live within an hour. The templates are gorgeous and our customers always compliment the design.',
    rating: 5,
  },
  {
    name: 'Aditya Nair',
    role: 'Founder, The Burger Lab',
    avatar: 'AN',
    text: 'The analytics are a game changer. Knowing which items get the most views helps us plan promotions. ROI was clear within the first month.',
    rating: 5,
  },
]

const features = [
  {
    icon: <QrCode size={24} />,
    title: 'Instant QR Codes',
    desc: 'Generate beautiful, scannable QR codes in seconds. Download in multiple formats. Menu updates never require a new QR code.',
    color: '#FF6B35',
  },
  {
    icon: <Smartphone size={24} />,
    title: 'Mobile-First Menus',
    desc: 'Stunning responsive menus that look perfect on every device. No app download required for your customers.',
    color: '#4CC9F0',
  },
  {
    icon: <Palette size={24} />,
    title: 'Beautiful Templates',
    desc: 'Choose from professionally designed templates. Customize colors, fonts and layout to match your brand.',
    color: '#7B2FBE',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Analytics Dashboard',
    desc: 'Track menu scans, popular items, peak hours and customer engagement. Data-driven decisions made easy.',
    color: '#06D6A0',
  },
  {
    icon: <Zap size={24} />,
    title: 'Instant Updates',
    desc: 'Update prices, add items, mark sold-out. Changes reflect immediately on your live menu — no app required.',
    color: '#FFD166',
  },
  {
    icon: <Shield size={24} />,
    title: 'Secure & Reliable',
    desc: 'Enterprise-grade security, 99.9% uptime SLA. Your menu is always available when customers need it.',
    color: '#EF233C',
  },
]

const stats = [
  { value: '5,000+', label: 'Restaurants', icon: <Users size={18} /> },
  { value: '2.4M+', label: 'Menu Scans/mo', icon: <TrendingUp size={18} /> },
  { value: '99.9%', label: 'Uptime', icon: <Clock size={18} /> },
  { value: '4.9★', label: 'Rating', icon: <Star size={18} /> },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly')

  // Interactive 3D Showcase State
  const [menuTheme, setMenuTheme] = useState<'noir' | 'sunset' | 'botanical'>('noir')
  const [activeCategory, setActiveCategory] = useState<'all' | 'specials' | 'steaks' | 'cocktails'>('all')
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP' | 'AED'>('INR') // Default to Rupees!
  const [cartItems, setCartItems] = useState(2)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [likedDishes, setLikedDishes] = useState<Record<string, boolean>>({ wagyu: true })

  // Currency definition for showcase
  const CURRENCIES = {
    INR: { code: 'INR', symbol: '₹', flag: '🇮🇳', name: 'Rupees', rate: 1, format: (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}` },
    USD: { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'Dollar', rate: 0.1, format: (val: number) => `$${(val * 0.1).toFixed(2)}` },
    EUR: { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro', rate: 0.09, format: (val: number) => `€${(val * 0.09).toFixed(2)}` },
    GBP: { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'Pound', rate: 0.08, format: (val: number) => `£${(val * 0.08).toFixed(2)}` },
    AED: { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', name: 'Dirham', rate: 0.36, format: (val: number) => `${(val * 0.36).toFixed(2)} د.إ` },
  }

  const activeCurr = CURRENCIES[currency]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const copyUrl = () => {
    navigator.clipboard?.writeText?.('https://qrmenu.app/menu/spice-garden')
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const [cartTotalRupees, setCartTotalRupees] = useState(870)

  const handleAddToCart = (priceInINR: number) => {
    setCartItems(prev => prev + 1)
    setCartTotalRupees(prev => prev + priceInINR)
  }

  const toggleLike = (id: string) => {
    setLikedDishes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // 105+ Template Showcase State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-luxury-01')
  const activeTemplate = ALL_TEMPLATES.find(t => t.id === selectedTemplateId) || ALL_TEMPLATES[0]

  const currentT = {
    bg: activeTemplate.backgroundColor,
    surface: activeTemplate.cardBackground,
    cardBg: activeTemplate.cardBackground,
    cardBorder: activeTemplate.borderColor,
    accent: activeTemplate.primaryColor,
    accentBg: `${activeTemplate.primaryColor}20`,
    accentText: activeTemplate.secondaryColor,
    nameColor: activeTemplate.textColor,
    badge: `${activeTemplate.badgeStyle.toUpperCase()} • ${activeTemplate.vibe.toUpperCase()}`,
    badgeBg: `linear-gradient(135deg, ${activeTemplate.primaryColor}30, transparent)`,
    fontHeading: activeTemplate.fontHeading,
    fontBody: activeTemplate.fontBody,
    vibe: activeTemplate.vibe,
    layoutModel: activeTemplate.layoutModel,
    borderRadius: activeTemplate.borderRadius,
    shadowStyle: activeTemplate.shadowStyle,
  }

  // Menu Items for Preview (Costs in Indian Rupees ₹ by default!)
  const previewDishes = [
    {
      id: 'wagyu',
      category: 'steaks',
      name: 'Smoked Truffle Wagyu Ribeye (A5)',
      description: 'Charcoal-seared A5 Japanese Wagyu, 48-hr bone marrow jus, shaved Périgord black truffle, roasted king trumpet.',
      priceINR: 480,
      tag: 'Chef Signature',
      prepTime: '22 min',
      calories: '740 kcal',
      spicy: 0,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      dietary: ['Gluten-Free', 'A5 Certified']
    },
    {
      id: 'lobster',
      category: 'specials',
      name: 'Saffron & Butter-Poached Lobster Tagliolini',
      description: 'Handmade squid-ink & saffron strands, sweet Maine lobster claw, Oscietra royal caviar, Meyer lemon velvet.',
      priceINR: 390,
      tag: 'Most Loved',
      prepTime: '18 min',
      calories: '580 kcal',
      spicy: 0,
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
      dietary: ['Signature']
    },
    {
      id: 'burrata',
      category: 'specials',
      name: 'Artisanal Pugliese Burrata & Roasted Fig',
      description: 'Imported Puglia burrata, lavender honey roasted Adriatic figs, 25-yr Modena balsamic drizzle, Sicilian pistachio crunch.',
      priceINR: 240,
      tag: 'Vegetarian',
      prepTime: '10 min',
      calories: '420 kcal',
      spicy: 0,
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&auto=format&fit=crop&q=80',
      dietary: ['Organic', 'Vegetarian']
    },
    {
      id: 'cocktail',
      category: 'cocktails',
      name: 'Smoked Rosemary Blood Orange Mezcalita',
      description: 'Artisanal Oaxaca espadín mezcal, torched organic rosemary, fresh blood orange cordial, black volcanic salt rim.',
      priceINR: 190,
      tag: 'Award 2026',
      prepTime: '5 min',
      calories: '190 kcal',
      spicy: 1,
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80',
      dietary: ['Craft Cocktail']
    }
  ]

  const filteredDishes = activeCategory === 'all'
    ? previewDishes
    : previewDishes.filter(d => d.category === activeCategory)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
      {/* ===== Navbar ===== */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo" style={{ color: 'var(--dark-text)' }}>
            <div className="logo-icon">🍽️</div>
            <span>QRMenu</span>
          </Link>

          <ul className="navbar-nav">
            {['Features', 'Templates', 'Pricing', 'About'].map(item => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`}>{item}</a>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <Link to="/login" className="btn btn-ghost btn-sm" style={{ display: 'flex' }}>Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Start Free</Link>
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: 'none', padding: '8px' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ===== Hero Section with 3D Depth & Dynamic Showcase ===== */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 0 100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated Background 3D Glowing Orbs */}
        <div className="animate-glow" style={{
          position: 'absolute', top: '12%', left: '8%',
          width: 550, height: 550,
          background: 'radial-gradient(circle, rgba(255,107,53,0.18) 0%, rgba(212,175,55,0.08) 45%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
        <div className="animate-glow" style={{
          position: 'absolute', top: '35%', right: '5%',
          width: 480, height: 480,
          background: 'radial-gradient(circle, rgba(76,201,240,0.16) 0%, rgba(123,47,190,0.12) 50%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          animationDelay: '2.5s',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', left: '30%',
          width: 600, height: 350,
          background: 'radial-gradient(ellipse, rgba(46,196,182,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', maxWidth: 940, margin: '0 auto' }}>
            
            {/* 3D Floating Pill Tag */}
            <div className="animate-fade-up" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'rgba(255, 107, 53, 0.12)',
                border: '1px solid rgba(255, 107, 53, 0.35)',
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 8px 24px rgba(255, 107, 53, 0.15)',
                backdropFilter: 'blur(12px)',
              }}>
                <span style={{
                  background: 'var(--primary)', color: 'white',
                  borderRadius: '50%', width: 22, height: 22,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800
                }}>
                  3D
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-light)' }}>
                  Interactive Digital Menus • Multi-Theme 3D Experience
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                  Live Demo
                </span>
              </div>
            </div>

            {/* Headline with 3D Gradient Depth */}
            <h1 className="animate-fade-up" style={{
              fontSize: 'clamp(2.75rem, 7.5vw, 5.25rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              marginBottom: 'var(--space-6)',
              animationDelay: '0.1s',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              textShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}>
              Digital Menus That{' '}
              <span style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #FFD166 40%, #FF8C5A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                filter: 'drop-shadow(0 4px 15px rgba(255, 107, 53, 0.4))',
              }}>
                Captivate
              </span>{' '}
              Every Guest
            </h1>

            <p className="animate-fade-up" style={{
              fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)',
              color: 'var(--gray-300)',
              lineHeight: 1.7,
              marginBottom: 'var(--space-8)',
              animationDelay: '0.2s',
              maxWidth: 720,
              margin: '0 auto var(--space-8)',
              fontWeight: 400,
            }}>
              Replace outdated paper with dynamic, mouthwatering digital menus. 
              Update dishes in real-time, boost orders with high-res food styling, and let guests order in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-up" style={{
              display: 'flex', gap: 'var(--space-4)', justifyContent: 'center',
              flexWrap: 'wrap', animationDelay: '0.3s',
            }}>
              <Link to="/register" className="btn btn-primary btn-lg" style={{
                boxShadow: '0 12px 30px rgba(255,107,53,0.35)',
                fontWeight: 700,
              }}>
                Start Free — No credit card
                <ArrowRight size={20} />
              </Link>
              <a href="#showcase" className="btn btn-secondary btn-lg" style={{
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
              }}>
                <Sparkles size={18} style={{ color: 'var(--accent)' }} />
                Explore 3D Templates
              </a>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: 'var(--space-4)' }}>
              ⚡ 14-day free trial • Instant setup in under 5 minutes • Cancel anytime
            </p>

            {/* ===== 3D HERO SHOWCASE: qrmenu.app/menu/spice-garden ===== */}
            <div id="showcase" className="perspective-stage animate-fade-up" style={{
              marginTop: 'var(--space-16)',
              position: 'relative',
            }}>

              {/* FLOATING 3D ELEMENT 1: Scannable 3D Glass QR Badge (Left) */}
              <div className="animate-float-left glass-card-3d" style={{
                position: 'absolute',
                top: '15%',
                left: '-48px',
                zIndex: 30,
                width: 220,
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                border: '1px solid rgba(255, 107, 53, 0.4)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.65), 0 0 30px rgba(255,107,53,0.25)',
                textAlign: 'left',
                display: 'none', // Shown on large screens via CSS media or responsive check
              }}>
                {/* Responsive helper for desktop */}
                <style>{`
                  @media (min-width: 1080px) {
                    .animate-float-left { display: block !important; }
                    .animate-float-right { display: block !important; }
                  }
                `}</style>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#06D6A0', display: 'inline-block', boxShadow: '0 0 8px #06D6A0' }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#06D6A0', letterSpacing: '0.05em' }}>LIVE SCANNER</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>Table #14</span>
                </div>

                {/* QR Code Graphic with Scanning Laser */}
                <div style={{
                  position: 'relative',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: 10,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
                }}>
                  {/* Laser line */}
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
                    boxShadow: '0 0 8px #FF6B35',
                    animation: 'laser-sweep 2.5s ease-in-out infinite',
                    zIndex: 5,
                  }} />

                  {/* SVG QR code illustration */}
                  <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white" />
                    {/* Corner squares */}
                    <rect x="5" y="5" width="26" height="26" rx="4" fill="#1A1A2E" />
                    <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                    <rect x="13" y="13" width="10" height="10" rx="2" fill="#FF6B35" />

                    <rect x="69" y="5" width="26" height="26" rx="4" fill="#1A1A2E" />
                    <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                    <rect x="77" y="13" width="10" height="10" rx="2" fill="#FF6B35" />

                    <rect x="5" y="69" width="26" height="26" rx="4" fill="#1A1A2E" />
                    <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                    <rect x="13" y="77" width="10" height="10" rx="2" fill="#FF6B35" />

                    {/* Data dots */}
                    <rect x="36" y="8" width="6" height="6" rx="1" fill="#1A1A2E" />
                    <rect x="46" y="8" width="6" height="6" rx="1" fill="#1A1A2E" />
                    <rect x="56" y="8" width="6" height="6" rx="1" fill="#1A1A2E" />
                    <rect x="36" y="18" width="6" height="6" rx="1" fill="#FF6B35" />
                    <rect x="56" y="18" width="6" height="6" rx="1" fill="#1A1A2E" />

                    <rect x="8" y="36" width="6" height="6" rx="1" fill="#1A1A2E" />
                    <rect x="18" y="36" width="6" height="6" rx="1" fill="#1A1A2E" />
                    <rect x="28" y="36" width="6" height="6" rx="1" fill="#FF6B35" />

                    {/* Center Logo */}
                    <circle cx="50" cy="50" r="14" fill="#1A1A2E" stroke="#FF6B35" strokeWidth="2" />
                    <text x="50" y="55" textAnchor="middle" fill="#FF6B35" fontSize="12" fontWeight="bold">SG</text>

                    <rect x="69" y="36" width="6" height="6" rx="1" fill="#1A1A2E" />
                    <rect x="79" y="36" width="6" height="6" rx="1" fill="#FF6B35" />
                    <rect x="89" y="36" width="6" height="6" rx="1" fill="#1A1A2E" />

                    <rect x="36" y="69" width="6" height="6" rx="1" fill="#1A1A2E" />
                    <rect x="46" y="79" width="6" height="6" rx="1" fill="#FF6B35" />
                    <rect x="56" y="89" width="6" height="6" rx="1" fill="#1A1A2E" />
                    <rect x="69" y="69" width="6" height="6" rx="1" fill="#1A1A2E" />
                    <rect x="79" y="79" width="6" height="6" rx="1" fill="#FF6B35" />
                    <rect x="89" y="89" width="6" height="6" rx="1" fill="#1A1A2E" />
                  </svg>
                </div>

                <div style={{ marginTop: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>Scan with Camera</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: 2 }}>Opens Spice Garden instant menu</div>
                  <Link to="/menu/the-spice-route" target="_blank" className="btn btn-outline btn-sm w-full" style={{
                    marginTop: 8, fontSize: '0.75rem', padding: '4px 8px', justifyContent: 'center', borderColor: 'rgba(255,107,53,0.4)', color: 'var(--primary-light)'
                  }}>
                    Open Live Link <ExternalLink size={12} />
                  </Link>
                </div>
              </div>

              {/* FLOATING 3D ELEMENT 2: Live Guest Activity Dispatch (Right) */}
              <div className="animate-float-right glass-card-3d" style={{
                position: 'absolute',
                top: '25%',
                right: '-45px',
                zIndex: 30,
                width: 250,
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                border: '1px solid rgba(76, 201, 240, 0.4)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.65), 0 0 30px rgba(76,201,240,0.2)',
                textAlign: 'left',
                display: 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(6,214,160,0.15)', color: 'var(--success)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <ShoppingBag size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>Live Kitchen Order</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>Table 07 • 2m ago</div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 10px',
                  marginBottom: 8,
                }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--dark-text)', fontWeight: 600 }}>
                    1x A5 Wagyu Ribeye
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--dark-text)', fontWeight: 600 }}>
                    1x Saffron Lobster Tagliolini
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>Total</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#06D6A0' }}>{activeCurr.format(870)} Paid</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'var(--info)' }}>
                  <TrendingUp size={12} />
                  <span>Avg order size increased by 38%</span>
                </div>
              </div>

              {/* MAIN 3D TILTED BROWSER CHASSIS */}
              <div className="tilt-3d" style={{
                background: currentT.bg,
                border: `1px solid ${currentT.cardBorder}`,
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                boxShadow: `0 40px 100px rgba(0,0,0,0.85), 0 0 60px ${currentT.accentBg}`,
                transition: 'all 0.4s ease',
              }}>

                {/* TOOLBAR: Template Switcher + Currency Selector */}
                <div style={{
                  background: 'rgba(0,0,0,0.5)',
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  borderBottom: `1px solid ${currentT.cardBorder}`,
                }}>
                  {/* Left: Template Switcher Tabs & 105+ Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Palette size={15} style={{ color: currentT.accent }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark-text)', letterSpacing: '0.04em' }}>
                        TEMPLATE:
                      </span>
                    </div>

                    {[
                      { id: 'tpl-luxury-01', name: '✨ Velvet Noir', color: '#D4AF37' },
                      { id: 'tpl-cocktail-04', name: '🔥 Sunset Bistro', color: '#FF6B35' },
                      { id: 'tpl-healthy-01', name: '🌿 Botanica', color: '#2EC4B6' },
                      { id: 'tpl-asian-02', name: '🍣 Tokyo Izakaya', color: '#FF0055' },
                      { id: 'tpl-italian-01', name: "🍝 Nonna's", color: '#C1121F' },
                      { id: 'tpl-street-01', name: '🍔 Smash Burger', color: '#FFB703' },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTemplateId(t.id)}
                        style={{
                          background: selectedTemplateId === t.id ? t.color : 'rgba(255,255,255,0.06)',
                          color: selectedTemplateId === t.id ? '#000000' : 'var(--gray-300)',
                          border: `1px solid ${selectedTemplateId === t.id ? t.color : 'rgba(255,255,255,0.1)'}`,
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          transition: 'all 0.2s ease',
                          transform: selectedTemplateId === t.id ? 'scale(1.05)' : 'none',
                          boxShadow: selectedTemplateId === t.id ? `0 4px 14px ${t.color}40` : 'none',
                        }}
                      >
                        {t.name}
                      </button>
                    ))}

                    {/* 105+ Template Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>More:</span>
                      <select
                        value={activeTemplate.id}
                        onChange={e => setSelectedTemplateId(e.target.value)}
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          color: '#FFFFFF',
                          border: `1px solid ${currentT.accent}60`,
                          borderRadius: 'var(--radius-full)',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          outline: 'none',
                          cursor: 'pointer',
                          maxWidth: 180,
                        }}
                        id="landing-template-dropdown"
                      >
                        {TEMPLATE_CATEGORIES.filter(c => c !== 'All').map(cat => (
                          <optgroup key={cat} label={cat} style={{ background: '#12141D', color: '#FFF' }}>
                            {ALL_TEMPLATES.filter(t => t.category === cat).map(tpl => (
                              <option key={tpl.id} value={tpl.id}>
                                {tpl.name} ({tpl.fontHeading})
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Right: Currency Selector + Device toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {/* Live Currency Selector */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 'var(--radius-full)',
                      padding: '2px 6px',
                    }}>
                      <span style={{ fontSize: '0.7rem', color: currentT.accent, fontWeight: 800, paddingLeft: 4, paddingRight: 2 }}>
                        CURRENCY:
                      </span>
                      {(['INR', 'USD', 'EUR', 'GBP', 'AED'] as const).map(c => (
                        <button
                          key={c}
                          onClick={() => setCurrency(c)}
                          style={{
                            background: currency === c ? currentT.accent : 'transparent',
                            color: currency === c ? '#000000' : 'var(--gray-300)',
                            border: 'none',
                            borderRadius: 'var(--radius-full)',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            transition: 'all 0.15s',
                          }}
                        >
                          <span>{CURRENCIES[c].flag}</span>
                          <span>{CURRENCIES[c].symbol}</span>
                          {currency === c && <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>{c}</span>}
                        </button>
                      ))}
                    </div>

                    {/* Device toggle */}
                    <button
                      onClick={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.72rem', padding: '4px 10px', height: 28, gap: 6 }}
                    >
                      {viewMode === 'desktop' ? <Smartphone size={14} /> : <Eye size={14} />}
                      {viewMode === 'desktop' ? 'Phone' : 'Full'}
                    </button>
                  </div>
                </div>

                {/* Browser Address Bar: qrmenu.app/menu/spice-garden */}
                <div style={{
                  background: 'rgba(15, 16, 26, 0.9)',
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  borderBottom: `1px solid ${currentT.cardBorder}`,
                }}>
                  {/* Window buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#EF233C', display: 'block' }} />
                    <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FFD166', display: 'block' }} />
                    <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#06D6A0', display: 'block' }} />
                  </div>

                  {/* Address input bar */}
                  <div style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-full)',
                    padding: '5px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--gray-300)' }}>
                      <Lock size={12} style={{ color: '#06D6A0' }} />
                      <span style={{ color: 'var(--gray-500)' }}>https://</span>
                      <span style={{ color: currentT.accent, fontWeight: 700 }}>qrmenu.app/menu/spice-garden</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={copyUrl}
                        style={{
                          background: 'transparent', border: 'none', color: 'var(--gray-400)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                          fontSize: '0.72rem', padding: '2px 6px', borderRadius: 4
                        }}
                        title="Copy Public Menu URL"
                      >
                        {copiedLink ? <CheckCircle2 size={13} style={{ color: 'var(--success)' }} /> : <Copy size={13} />}
                        <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                      </button>

                      <Link
                        to="/menu/the-spice-route"
                        target="_blank"
                        style={{
                          color: currentT.accent, fontSize: '0.72rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: 4
                        }}
                      >
                        Open Live <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ===== THE RESTAURANT MENU TEMPLATE BODY ===== */}
                <div style={{
                  maxWidth: viewMode === 'mobile' ? 420 : '100%',
                  margin: '0 auto',
                  transition: 'max-width 0.4s ease',
                  borderLeft: viewMode === 'mobile' ? `2px solid ${currentT.accent}` : 'none',
                  borderRight: viewMode === 'mobile' ? `2px solid ${currentT.accent}` : 'none',
                }}>
                  {/* Restaurant Cover Header */}
                  <div style={{
                    position: 'relative',
                    height: 180,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, ${currentT.bg} 95%)`,
                    }} />

                    {/* Restaurant Identity Bar */}
                    <div style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 24,
                      right: 24,
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        {/* Monogram Seal */}
                        <div style={{
                          width: 58, height: 58, borderRadius: '50%',
                          background: currentT.bg,
                          border: `2px solid ${currentT.accent}`,
                          boxShadow: `0 8px 20px rgba(0,0,0,0.6), 0 0 15px ${currentT.accentBg}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.4rem', fontWeight: 800, color: currentT.accent,
                          fontFamily: currentT.fontHeading,
                        }}>
                          SG
                        </div>
                        <div>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: currentT.badgeBg,
                            border: `1px solid ${currentT.accent}`,
                            padding: '2px 8px', borderRadius: 'var(--radius-full)',
                            fontSize: '0.68rem', fontWeight: 700, color: currentT.accent,
                            marginBottom: 4
                          }}>
                            {currentT.badge}
                          </div>
                          <h2 style={{
                            fontSize: '1.65rem', fontWeight: 800,
                            color: currentT.nameColor,
                            fontFamily: currentT.fontHeading,
                            margin: 0,
                            lineHeight: 1.2,
                          }}>
                            The Spice Garden
                          </h2>
                          <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>Modern Gastronomy & Cocktail Lounge</span>
                            <span>•</span>
                            <span style={{ color: '#06D6A0', fontWeight: 600 }}>● Open Now (Closes 11:30 PM)</span>
                          </div>
                        </div>
                      </div>

                      {/* Guest Table Indicator */}
                      <div style={{
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '6px 14px', borderRadius: 'var(--radius-lg)',
                        display: 'flex', alignItems: 'center', gap: 10
                      }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>Dine-In Guest</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: currentT.accent }}>Table 14</div>
                        </div>
                        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FFD166', fontSize: '0.8rem', fontWeight: 700 }}>
                          <Star size={14} style={{ fill: '#FFD166' }} /> 4.9 (1.2k)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Category Pills */}
                  <div style={{
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    overflowX: 'auto',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {[
                      { id: 'all', label: 'All Dishes', icon: <Sparkles size={13} /> },
                      { id: 'specials', label: 'Chef Specials', icon: <Flame size={13} /> },
                      { id: 'steaks', label: 'Wagyu & Steaks', icon: <Flame size={13} /> },
                      { id: 'cocktails', label: 'Artisan Mixology', icon: <Wine size={13} /> },
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id as any)}
                        style={{
                          background: activeCategory === cat.id ? currentT.accent : 'rgba(255,255,255,0.05)',
                          color: activeCategory === cat.id ? '#000000' : 'var(--gray-300)',
                          border: `1px solid ${activeCategory === cat.id ? currentT.accent : 'rgba(255,255,255,0.08)'}`,
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s',
                        }}
                      >
                        {cat.icon}
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Dishes Grid Showcase */}
                  <div style={{
                    padding: '24px',
                    display: 'grid',
                    gridTemplateColumns: viewMode === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '16px',
                  }}>
                    {filteredDishes.map(dish => (
                      <div
                        key={dish.id}
                        style={{
                          background: currentT.cardBg,
                          border: `1px solid ${currentT.cardBorder}`,
                          borderRadius: 'var(--radius-xl)',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-4px)'
                          e.currentTarget.style.borderColor = currentT.accent
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.borderColor = currentT.cardBorder
                        }}
                      >
                        {/* Food Image Banner */}
                        <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
                          <img
                            src={dish.image}
                            alt={dish.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                          }} />

                          {/* Tag */}
                          <span style={{
                            position: 'absolute', top: 10, left: 10,
                            background: 'rgba(0,0,0,0.7)',
                            border: `1px solid ${currentT.accent}`,
                            color: currentT.accent,
                            padding: '3px 8px', borderRadius: 'var(--radius-full)',
                            fontSize: '0.68rem', fontWeight: 800,
                            backdropFilter: 'blur(8px)',
                          }}>
                            {dish.tag}
                          </span>

                          {/* Heart Like */}
                          <button
                            onClick={() => toggleLike(dish.id)}
                            style={{
                              position: 'absolute', top: 10, right: 10,
                              width: 30, height: 30, borderRadius: '50%',
                              background: 'rgba(0,0,0,0.6)', border: 'none',
                              color: likedDishes[dish.id] ? '#EF233C' : 'white',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', backdropFilter: 'blur(8px)',
                            }}
                          >
                            <Heart size={14} style={{ fill: likedDishes[dish.id] ? '#EF233C' : 'none' }} />
                          </button>

                          {/* Prep time badge */}
                          <div style={{
                            position: 'absolute', bottom: 8, right: 10,
                            fontSize: '0.7rem', color: 'var(--gray-300)',
                            display: 'flex', alignItems: 'center', gap: 4
                          }}>
                            <Clock size={11} /> {dish.prepTime}
                          </div>
                        </div>

                        {/* Dish Details */}
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                            <h3 style={{
                              fontSize: '1rem', fontWeight: 700,
                              color: currentT.nameColor,
                              fontFamily: currentT.fontHeading,
                              margin: 0,
                              lineHeight: 1.3
                            }}>
                              {dish.name}
                            </h3>
                          </div>

                          <p style={{
                            fontSize: '0.8rem', color: 'var(--gray-400)',
                            lineHeight: 1.5, marginBottom: '14px', flex: 1,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                          }}>
                            {dish.description}
                          </p>

                          {/* Footer with Price and Interactive Add Button */}
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            paddingTop: '10px',
                            borderTop: '1px solid rgba(255,255,255,0.06)'
                          }}>
                            <div>
                              <span style={{
                                fontSize: '1.25rem', fontWeight: 800,
                                color: currentT.accent,
                                fontFamily: 'var(--font-display)',
                              }}>
                                {activeCurr.format(dish.priceINR)}
                              </span>
                            </div>

                            <button
                              onClick={() => handleAddToCart(dish.priceINR)}
                              style={{
                                background: currentT.accent,
                                color: '#000000',
                                border: 'none',
                                borderRadius: 'var(--radius-full)',
                                padding: '6px 14px',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6,
                                transition: 'transform 0.15s, box-shadow 0.15s',
                                boxShadow: `0 4px 12px ${currentT.accentBg}`,
                              }}
                              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
                              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                              <span>+ Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Floating Cart Tray (Bottom Sticky) */}
                  <div style={{
                    background: 'rgba(10, 11, 18, 0.95)',
                    borderTop: `1px solid ${currentT.cardBorder}`,
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(20px)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: currentT.accent, color: '#000000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.9rem',
                        boxShadow: `0 4px 15px ${currentT.accentBg}`
                      }}>
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
                          Table 14 Order Tray ({cartItems} items)
                        </div>
                        <div style={{ fontSize: '0.75rem', color: currentT.accent, fontWeight: 700 }}>
                          Total: {activeCurr.format(cartTotalRupees)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setOrderPlaced(true)
                        setTimeout(() => setOrderPlaced(false), 3000)
                      }}
                      style={{
                        background: orderPlaced ? '#06D6A0' : `linear-gradient(135deg, ${currentT.accent}, #FF8C5A)`,
                        color: '#000000',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        padding: '8px 20px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {orderPlaced ? (
                        <>
                          <CheckCircle2 size={16} /> Order Sent to Kitchen!
                        </>
                      ) : (
                        <>
                          <span>Send Order</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ===== Stats Bar ===== */}
      <section style={{
        borderTop: '1px solid var(--dark-border)',
        borderBottom: '1px solid var(--dark-border)',
        padding: 'var(--space-10) 0',
        background: 'var(--dark-surface)',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-8)' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--dark-text)' }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  {s.icon} {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="section" id="features">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <span className="section-tag"><Zap size={14} /> Features</span>
            <h2 className="section-title">Everything you need to <span className="text-gradient">go digital</span></h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              From QR code generation to real-time analytics, QRMenu gives you all the tools to modernize your dining experience.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
            {features.map(f => (
              <div key={f.title} className="card" style={{ padding: 'var(--space-7)' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-md)',
                  background: `${f.color}20`,
                  border: `1px solid ${f.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color, marginBottom: 'var(--space-4)',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{f.title}</h3>
                <p style={{ color: 'var(--gray-400)', lineHeight: 1.65, fontSize: '0.9375rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="section" style={{ background: 'var(--dark-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <span className="section-tag"><Globe size={14} /> How It Works</span>
            <h2 className="section-title">Live in <span className="text-gradient">3 simple steps</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-8)', position: 'relative' }}>
            {[
              { step: '01', title: 'Create your menu', desc: 'Add your restaurant details, upload your logo, and build your menu with categories and items. Takes less than 30 minutes.', emoji: '🍴' },
              { step: '02', title: 'Choose & customize', desc: 'Pick a stunning template that matches your vibe. Customize colors, fonts and layout to perfectly match your brand.', emoji: '🎨' },
              { step: '03', title: 'Share your QR', desc: 'Download your unique QR code. Print it on table cards, receipts, windows — anywhere customers look.', emoji: '📲' },
            ].map((s, i) => (
              <div key={s.step} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', margin: '0 auto var(--space-5)',
                  boxShadow: 'var(--shadow-glow)',
                  animation: 'float 4s ease-in-out infinite',
                  animationDelay: `${i * 0.5}s`,
                }}>
                  {s.emoji}
                </div>
                <div style={{
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)',
                }}>Step {s.step}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-3)', fontFamily: 'var(--font-display)' }}>{s.title}</h3>
                <p style={{ color: 'var(--gray-400)', lineHeight: 1.65 }}>{s.desc}</p>

                {i < 2 && (
                  <div style={{
                    position: 'absolute', top: 40, right: -40, color: 'var(--gray-600)',
                    fontSize: '1.5rem',
                  }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Templates Preview ===== */}
      <section className="section" id="templates">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <span className="section-tag"><Palette size={14} /> Templates</span>
            <h2 className="section-title">Designs that <span className="text-gradient">make an impression</span></h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Professional templates crafted by designers. Customizable to match your brand.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
            {[
              { name: 'Modern Café', tag: 'Most Popular', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop', color: '#FF6B35' },
              { name: 'Fine Dining', tag: 'Elegant', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop', color: '#7B2FBE' },
              { name: 'Street Food', tag: 'Bold & Fun', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop', color: '#FFD166' },
              { name: 'Minimal Light', tag: 'Clean', img: 'https://images.unsplash.com/photo-1543353071-087092ec393a?w=600&h=400&fit=crop', color: '#4CC9F0' },
            ].map(t => (
              <div key={t.name} style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--dark-border)', transition: 'all 0.3s ease', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                  <img src={t.img} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(to top, rgba(0,0,0,0.7), transparent)`,
                  }} />
                  <span style={{
                    position: 'absolute', top: 12, right: 12,
                    background: t.color,
                    color: 'white', padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-display)',
                  }}>{t.tag}</span>
                </div>
                <div style={{ padding: 'var(--space-4)', background: 'var(--dark-surface)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{t.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section className="section" id="pricing" style={{ background: 'var(--dark-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-tag"><CreditCard size={14} /> Pricing</span>
            <h2 className="section-title">Simple, transparent <span className="text-gradient">pricing</span></h2>
            <p className="section-subtitle" style={{ margin: '0 auto var(--space-6)' }}>
              Start free. Scale as you grow. Cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)' }}>
              <span style={{ fontSize: '0.9rem', color: billingInterval === 'monthly' ? 'var(--dark-text)' : 'var(--gray-500)' }}>Monthly</span>
              <label className="toggle" onClick={() => setBillingInterval(prev => prev === 'monthly' ? 'annual' : 'monthly')}>
                <input type="checkbox" checked={billingInterval === 'annual'} readOnly />
                <span className="toggle-slider" />
              </label>
              <span style={{ fontSize: '0.9rem', color: billingInterval === 'annual' ? 'var(--dark-text)' : 'var(--gray-500)' }}>
                Annual <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>Save 2 months</span>
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', alignItems: 'start' }}>
            {mockPlans.map(plan => {
              const price = billingInterval === 'annual'
                ? Math.round(plan.price * 10 / 12)
                : plan.price
              return (
                <div key={plan.id} className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
                  {plan.isPopular && <div className="popular-badge">⭐ Most Popular</div>}
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{plan.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: plan.isPopular ? 'var(--primary)' : 'var(--dark-text)' }}>
                        {formatPrice(price)}
                      </span>
                      <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>/month</span>
                    </div>
                    {billingInterval === 'annual' && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: 4 }}>
                        Billed ₹{(price * 12).toLocaleString('en-IN')}/year
                      </p>
                    )}
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.9rem', color: 'var(--gray-300)' }}>
                        <Check size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link to="/register" className={`btn w-full ${plan.isPopular ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'center' }}>
                    Get Started <ChevronRight size={16} />
                  </Link>
                </div>
              )
            })}
          </div>

          <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 'var(--space-8)' }}>
            All plans include 14-day free trial. No credit card required to start.
          </p>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-tag"><Star size={14} /> Testimonials</span>
            <h2 className="section-title">Loved by <span className="text-gradient">restaurant owners</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)' }}>
            {testimonials.map(t => (
              <div key={t.name} className="card" style={{ padding: 'var(--space-7)' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-4)' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} style={{ fill: 'var(--warning)', color: 'var(--warning)' }} />
                  ))}
                </div>
                <p style={{ color: 'var(--gray-300)', lineHeight: 1.7, marginBottom: 'var(--space-5)', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div className="avatar">{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{
        padding: 'var(--space-24) 0',
        background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(76,201,240,0.05))',
        borderTop: '1px solid var(--dark-border)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-5)', animation: 'float 3s ease-in-out infinite' }}>🚀</div>
            <h2 className="section-title">Ready to go digital?</h2>
            <p style={{ color: 'var(--gray-400)', marginBottom: 'var(--space-8)', fontSize: '1.125rem', lineHeight: 1.7 }}>
              Join 5,000+ restaurants already using QRMenu. Start your free trial today — no credit card required.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create your menu free
                <ArrowRight size={20} />
              </Link>
              <Link to="/menu/spice-garden" className="btn btn-secondary btn-lg">
                View live demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer style={{
        background: 'var(--dark-surface)',
        borderTop: '1px solid var(--dark-border)',
        padding: 'var(--space-16) 0 var(--space-8)',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--space-10)', marginBottom: 'var(--space-12)' }}>
            <div>
              <div className="navbar-logo" style={{ marginBottom: 'var(--space-4)', fontSize: '1.25rem' }}>
                <div className="logo-icon">🍽️</div>
                <span>QRMenu</span>
              </div>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.7, fontSize: '0.9rem', maxWidth: 280 }}>
                The complete digital menu platform for modern restaurants, cafés and food businesses.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Templates', 'Pricing', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Refund Policy', 'Security'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-4)', fontFamily: 'var(--font-display)', fontSize: '0.9375rem' }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" style={{ color: 'var(--gray-500)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--dark-text)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}>
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{
            borderTop: '1px solid var(--dark-border)',
            paddingTop: 'var(--space-8)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              © 2026 QRMenu SaaS. All rights reserved.
            </p>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              Made with ❤️ for restaurants everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
