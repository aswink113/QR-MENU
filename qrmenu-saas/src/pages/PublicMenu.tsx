import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin, Phone, Search, QrCode, ShoppingBag, Plus, Minus,
  Sparkles, Flame, Star, Bell, X, CheckCircle2, ChevronRight,
  Filter, Heart, Utensils, Clock, Layers, Sliders, ChevronDown
} from 'lucide-react'
import { submitOrder, sendWaiterCall } from '../data/api'
import { useCurrency } from '../data/currency'
import { useRestaurantStore, recordLiveScan } from '../data/restaurantStore'
import CurrencySelector from '../components/CurrencySelector'
import {
  ALL_TEMPLATES,
  TEMPLATE_CATEGORIES,
  MenuTemplate,
  searchTemplates,
} from '../data/templates'

export default function PublicMenu() {
  const { currency, currencyConfig, formatPrice } = useCurrency()
  const { restaurant, categories, items } = useRestaurantStore()

  useEffect(() => {
    recordLiveScan()
  }, [])

  // Active Template State (Loaded from localStorage or default Velvet Noir)
  const [currentTemplate, setCurrentTemplate] = useState<MenuTemplate>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedId = window.localStorage.getItem('qrmenu_active_template')
      if (savedId) {
        const found = ALL_TEMPLATES.find(t => t.id === savedId || t.code === savedId)
        if (found) return found
      }
    }
    return ALL_TEMPLATES[0] // Velvet Noir (Michelin Star Luxury)
  })

  // Template Search Modal State
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateSearchQ, setTemplateSearchQ] = useState('')
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState('All')

  // Menu Search & Filter States
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all')

  // Cart & Order States
  const [cart, setCart] = useState<{ [id: string]: number }>({
    'item-1': 1,
    'item-4': 1
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [waiterCalled, setWaiterCalled] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  // Listen for template changes across tabs or dashboard
  useEffect(() => {
    const handleTemplateChange = (e: any) => {
      if (e.detail) {
        setCurrentTemplate(e.detail)
      }
    }
    window.addEventListener('qrmenu_template_changed', handleTemplateChange)
    return () => window.removeEventListener('qrmenu_template_changed', handleTemplateChange)
  }, [])

  const selectTemplate = (tpl: MenuTemplate) => {
    setCurrentTemplate(tpl)
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('qrmenu_active_template', tpl.id)
      window.localStorage.setItem('qrmenu_active_template_code', tpl.code)
    }
    setShowTemplateModal(false)
  }

  const modalFilteredTemplates = useMemo(() => {
    return searchTemplates(templateSearchQ, templateCategoryFilter)
  }, [templateSearchQ, templateCategoryFilter])

  // Cart operations
  const addToCart = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  const removeFromCart = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCart(prev => {
      const copy = { ...prev }
      if (copy[id] > 1) {
        copy[id] -= 1
      } else {
        delete copy[id]
      }
      return copy
    })
  }

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = items.find(i => i.id === id)
    return sum + (item ? item.price * qty : 0)
  }, 0)

  const filteredItems = items.filter(item => {
    const matchesCat = activeCategory ? item.categoryId === activeCategory : true
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    const matchesDiet = dietaryFilter === 'all'
      ? true
      : dietaryFilter === 'veg'
        ? item.dietaryLabel.includes('veg') || item.dietaryLabel.includes('vegan')
        : item.dietaryLabel.includes('non-veg')
    return matchesCat && matchesSearch && matchesDiet
  })

  const categoriesToShow = categories.filter(c => c.isActive)

  return (
    <div style={{
      backgroundColor: currentTemplate.backgroundColor,
      color: currentTemplate.textColor,
      fontFamily: currentTemplate.fontBody,
      minHeight: '100vh',
      paddingBottom: totalItems > 0 ? 120 : 60,
      transition: 'background 0.3s ease',
      position: 'relative'
    }}>
      {/* Interactive Template Switcher Bar & Currency Selector */}
      <header style={{
        background: 'rgba(10, 10, 15, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${currentTemplate.borderColor}`,
        padding: '10px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
      }}>
        {/* Template Selector with Dropdown and 100+ Catalog Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} color={currentTemplate.primaryColor} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: currentTemplate.primaryColor, letterSpacing: '0.04em' }}>
              TEMPLATE:
            </span>
          </div>

          {/* Quick Dropdown: All 105+ Templates */}
          <select
            value={currentTemplate.id}
            onChange={e => {
              const found = ALL_TEMPLATES.find(t => t.id === e.target.value)
              if (found) selectTemplate(found)
            }}
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#FFFFFF',
              border: `1px solid ${currentTemplate.primaryColor}60`,
              borderRadius: 'var(--radius-full)',
              padding: '5px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer',
              maxWidth: 220,
            }}
            id="public-menu-template-dropdown"
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

          {/* Browse 105+ Templates Modal Button */}
          <button
            onClick={() => setShowTemplateModal(true)}
            style={{
              background: `${currentTemplate.primaryColor}20`,
              color: currentTemplate.primaryColor,
              border: `1px solid ${currentTemplate.primaryColor}60`,
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Layers size={13} />
            <span>Browse 105+ Styles</span>
          </button>
        </div>

        {/* Currency & Waiter actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Dynamic Currency Selector with Logo & Flag */}
          <CurrencySelector compact />

          {/* Call Waiter Quick Action */}
          <button
            onClick={() => {
              sendWaiterCall('the-spice-route', '14')
              setWaiterCalled(true)
              setTimeout(() => setWaiterCalled(false), 3500)
            }}
            style={{
              background: waiterCalled ? '#06D6A0' : 'rgba(255,255,255,0.08)',
              color: waiterCalled ? '#000000' : currentTemplate.textColor,
              border: `1px solid ${waiterCalled ? '#06D6A0' : 'rgba(255,255,255,0.15)'}`,
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Bell size={13} />
            {waiterCalled ? 'Staff Notified (Table 14)!' : 'Call Waiter'}
          </button>
        </div>
      </header>

      {/* Hero Cover Banner */}
      <div style={{
        position: 'relative',
        height: 240,
        backgroundImage: restaurant.coverImage ? `url(${restaurant.coverImage})` : 'none',
        background: !restaurant.coverImage ? 'linear-gradient(135deg, rgba(255,107,53,0.3), rgba(123,47,190,0.3))' : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, ${currentTemplate.backgroundColor} 100%)`,
        }} />

        <div style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 72, height: 72,
              borderRadius: '50%',
              border: `2px solid ${currentTemplate.primaryColor}`,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              background: '#000',
              flexShrink: 0
            }}>
              {restaurant.logo ? (
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                  🍽️
                </div>
              )}
            </div>

            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: `${currentTemplate.primaryColor}20`,
                border: `1px solid ${currentTemplate.primaryColor}60`,
                padding: '2px 8px', borderRadius: 20,
                fontSize: '0.68rem', fontWeight: 700, color: currentTemplate.primaryColor,
                marginBottom: 4,
                fontFamily: currentTemplate.fontHeading,
              }}>
                {currentTemplate.vibe.toUpperCase()}
              </div>

              <h1 style={{
                fontFamily: currentTemplate.fontHeading,
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                fontWeight: 800,
                color: currentTemplate.textColor,
                margin: 0,
                lineHeight: 1.15,
              }}>
                {restaurant.name}
              </h1>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginTop: 4,
                flexWrap: 'wrap', fontSize: '0.8rem', color: currentTemplate.mutedColor
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} style={{ color: currentTemplate.primaryColor }} /> {restaurant.address || 'Digital Menu'}
                </span>
                <span>•</span>
                <span style={{ color: '#06D6A0', fontWeight: 700 }}>🟢 Open (Until 11:30 PM)</span>
              </div>
            </div>
          </div>

          {/* Guest Table Indicator Badge */}
          <div style={{
            background: 'rgba(0,0,0,0.65)',
            border: `1px solid ${currentTemplate.borderColor}`,
            padding: '8px 16px',
            borderRadius: currentTemplate.borderRadius,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Dine-In</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: currentTemplate.primaryColor, fontFamily: currentTemplate.fontHeading }}>
                Table 14
              </div>
            </div>
            <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FFD166', fontSize: '0.85rem', fontWeight: 800 }}>
              <Star size={15} style={{ fill: '#FFD166' }} /> 4.9
            </div>
          </div>
        </div>
      </div>

      {/* Search and Dietary Filter Bar */}
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{
            position: 'absolute', left: 14, top: '50%',
            transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)',
          }} />
          <input
            type="text"
            placeholder="Search truffle wagyu, pasta, cocktails, desserts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${currentTemplate.borderColor}`,
              borderRadius: currentTemplate.borderRadius,
              padding: '12px 14px 12px 40px',
              color: currentTemplate.textColor,
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Dietary and Category Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'veg', 'non-veg'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDietaryFilter(d)}
                style={{
                  background: dietaryFilter === d ? currentTemplate.primaryColor : 'rgba(255,255,255,0.06)',
                  color: dietaryFilter === d ? '#000000' : currentTemplate.mutedColor,
                  border: `1px solid ${dietaryFilter === d ? currentTemplate.primaryColor : currentTemplate.borderColor}`,
                  padding: '5px 12px',
                  borderRadius: currentTemplate.borderRadius,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
              >
                {d === 'all' ? 'All Items' : d === 'veg' ? '🌿 Pure Veg' : '🥩 Non-Veg'}
              </button>
            ))}
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: currentTemplate.mutedColor,
            fontFamily: currentTemplate.fontHeading,
          }}>
            Showing {filteredItems.length} curated dishes
          </div>
        </div>
      </div>

      {/* Sticky Categories Navigation Tabs */}
      <nav style={{
        background: 'rgba(12, 14, 20, 0.88)',
        backdropFilter: 'blur(16px)',
        borderTop: `1px solid ${currentTemplate.borderColor}`,
        borderBottom: `1px solid ${currentTemplate.borderColor}`,
        position: 'sticky',
        top: 50,
        zIndex: 35,
        padding: '8px 16px',
      }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              background: activeCategory === null ? currentTemplate.primaryColor : 'transparent',
              color: activeCategory === null ? '#000000' : currentTemplate.mutedColor,
              border: `1px solid ${activeCategory === null ? currentTemplate.primaryColor : 'transparent'}`,
              padding: '6px 14px',
              borderRadius: currentTemplate.borderRadius,
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: currentTemplate.fontHeading,
            }}
          >
            All Categories
          </button>

          {categoriesToShow.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: activeCategory === cat.id ? currentTemplate.primaryColor : 'transparent',
                color: activeCategory === cat.id ? '#000000' : currentTemplate.mutedColor,
                border: `1px solid ${activeCategory === cat.id ? currentTemplate.primaryColor : 'transparent'}`,
                padding: '6px 14px',
                borderRadius: currentTemplate.borderRadius,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: currentTemplate.fontHeading,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Menu Dish Items Grid (Rendered according to Active Template's Layout Model & Typography) */}
      <main style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: currentTemplate.mutedColor }}>
            <Utensils size={40} style={{ color: currentTemplate.primaryColor, marginBottom: 12 }} />
            <h3 style={{ color: currentTemplate.textColor, fontFamily: currentTemplate.fontHeading }}>No dishes found</h3>
            <p style={{ fontSize: '0.875rem' }}>Try searching another keyword or clearing filters.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: currentTemplate.layoutModel === 'minimal-compact'
              ? '1fr'
              : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {filteredItems.map((item, idx) => {
              const qtyInCart = cart[item.id] || 0

              // SPECIAL LAYOUT MODEL: MINIMAL COMPACT
              if (currentTemplate.layoutModel === 'minimal-compact') {
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{
                      background: currentTemplate.cardBackground,
                      border: `1px solid ${currentTemplate.borderColor}`,
                      borderRadius: currentTemplate.borderRadius,
                      padding: '14px 18px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                      <span style={{
                        fontFamily: currentTemplate.fontHeading,
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: currentTemplate.textColor,
                      }}>
                        {item.name}
                      </span>
                      <span style={{
                        flex: 1,
                        borderBottom: `1px dotted ${currentTemplate.mutedColor}`,
                        margin: '0 8px',
                        opacity: 0.5,
                      }} />
                      <span style={{
                        color: currentTemplate.primaryColor,
                        fontFamily: currentTemplate.fontHeading,
                        fontWeight: 800,
                        fontSize: '1.1rem',
                      }}>
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <p style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        color: currentTemplate.mutedColor,
                        lineHeight: 1.4,
                        maxWidth: '80%',
                      }}>
                        {item.description}
                      </p>
                      <button
                        onClick={e => addToCart(item.id, e)}
                        style={{
                          background: `${currentTemplate.primaryColor}20`,
                          color: currentTemplate.primaryColor,
                          border: `1px solid ${currentTemplate.primaryColor}50`,
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                )
              }

              // DEFAULT & OTHER STYLES (Modern, Bento, Luxury, Retro, Cyberpunk, etc.)
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  style={{
                    background: currentTemplate.cardBackground,
                    border: `${currentTemplate.borderWidth} solid ${currentTemplate.borderColor}`,
                    borderRadius: currentTemplate.borderRadius,
                    boxShadow: currentTemplate.shadowStyle,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.borderColor = currentTemplate.primaryColor
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = currentTemplate.borderColor
                  }}
                >
                  {/* Dish Thumbnail */}
                  {item.image && (
                    <div style={{ height: 160, position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                      }} />

                      {/* Dietary Tag */}
                      <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 4 }}>
                        {item.dietaryLabel.map((d: string) => (
                          <span
                            key={d}
                            style={{
                              background: d === 'veg' ? 'rgba(6,214,160,0.85)' : 'rgba(239,35,60,0.85)',
                              color: 'white',
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 10,
                              textTransform: 'uppercase',
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>

                      {/* Calories badge */}
                      {(item as any).calories && (
                        <span style={{
                          position: 'absolute', bottom: 8, right: 10,
                          fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)',
                          background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 6
                        }}>
                          {(item as any).calories}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Dish Information */}
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{
                      fontFamily: currentTemplate.fontHeading,
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: currentTemplate.textColor,
                      margin: '0 0 6px',
                      lineHeight: 1.3
                    }}>
                      {item.name}
                    </h3>

                    <p style={{
                      fontSize: '0.8rem',
                      color: currentTemplate.mutedColor,
                      lineHeight: 1.5,
                      margin: '0 0 14px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1,
                    }}>
                      {item.description}
                    </p>

                    {/* Price and Cart Action Buttons */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                      borderTop: `1px solid ${currentTemplate.borderColor}`
                    }}>
                      <div style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: currentTemplate.primaryColor,
                        fontFamily: currentTemplate.fontHeading
                      }}>
                        {formatPrice(item.price)}
                      </div>

                      {qtyInCart > 0 ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: `${currentTemplate.primaryColor}20`,
                          border: `1px solid ${currentTemplate.primaryColor}`,
                          borderRadius: currentTemplate.borderRadius,
                          padding: '2px 8px',
                        }}>
                          <button
                            onClick={e => removeFromCart(item.id, e)}
                            style={{
                              background: 'transparent', border: 'none', color: currentTemplate.primaryColor,
                              cursor: 'pointer', padding: 4, display: 'flex'
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: currentTemplate.primaryColor, minWidth: 16, textAlign: 'center' }}>
                            {qtyInCart}
                          </span>
                          <button
                            onClick={e => addToCart(item.id, e)}
                            style={{
                              background: 'transparent', border: 'none', color: currentTemplate.primaryColor,
                              cursor: 'pointer', padding: 4, display: 'flex'
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={e => addToCart(item.id, e)}
                          style={{
                            background: currentTemplate.primaryColor,
                            color: '#000000',
                            border: 'none',
                            borderRadius: currentTemplate.borderRadius,
                            padding: '6px 14px',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Plus size={14} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Sticky Order Bar */}
      {totalItems > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          right: 16,
          maxWidth: 600,
          margin: '0 auto',
          background: 'rgba(15, 16, 26, 0.95)',
          border: `1px solid ${currentTemplate.primaryColor}`,
          borderRadius: 20,
          padding: '12px 20px',
          boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${currentTemplate.primaryColor}30`,
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 45,
          animation: 'fade-in 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: currentTemplate.primaryColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#000', fontWeight: 800, fontSize: '0.9rem',
            }}>
              {totalItems}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Your Dine-In Order</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>
                Total: {formatPrice(totalPrice)}
              </div>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            style={{
              background: currentTemplate.primaryColor,
              color: '#000000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 14,
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: `0 8px 20px ${currentTemplate.primaryColor}40`,
            }}
          >
            Review & Order <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Template Browser Modal (105+ Templates Catalog with Live Search) */}
      {showTemplateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setShowTemplateModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0F1117',
              border: `1px solid ${currentTemplate.primaryColor}50`,
              borderRadius: 20,
              width: '100%',
              maxWidth: 900,
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#FFF', fontFamily: 'var(--font-display)' }}>
                  Browse 105+ Restaurant Templates
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                  Click any template to instantly re-theme and re-style this menu with unique fonts and layout models.
                </p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#FFF',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Search & Filter */}
            <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                <input
                  type="text"
                  placeholder="Search by cuisine, vibe, or font style (e.g. Sushi, Noir, Bodoni, Italian)..."
                  value={templateSearchQ}
                  onChange={e => setTemplateSearchQ(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 10,
                    padding: '10px 14px 10px 36px',
                    color: '#FFF',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
                {TEMPLATE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTemplateCategoryFilter(cat)}
                    style={{
                      background: templateCategoryFilter === cat ? currentTemplate.primaryColor : 'rgba(255,255,255,0.06)',
                      color: templateCategoryFilter === cat ? '#000000' : 'var(--gray-300)',
                      border: 'none',
                      padding: '4px 12px',
                      borderRadius: 14,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid in Modal */}
            <div style={{
              padding: 24,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
              maxHeight: '60vh',
            }}>
              {modalFilteredTemplates.map(tpl => {
                const active = currentTemplate.id === tpl.id
                return (
                  <div
                    key={tpl.id}
                    onClick={() => selectTemplate(tpl)}
                    style={{
                      background: active ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${active ? tpl.primaryColor : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 14,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ height: 110, position: 'relative' }}>
                      <img src={tpl.previewImage} alt={tpl.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{
                        position: 'absolute', bottom: 6, left: 6,
                        background: 'rgba(0,0,0,0.7)', padding: '2px 6px',
                        borderRadius: 4, fontSize: '0.65rem', color: '#FFF', fontWeight: 700,
                      }}>
                        {tpl.layoutModel}
                      </span>
                    </div>
                    <div style={{ padding: 12 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: active ? tpl.primaryColor : '#FFF', fontFamily: tpl.fontHeading }}>
                        {tpl.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', margin: '2px 0 6px' }}>
                        {tpl.vibe}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: tpl.primaryColor }}>
                        Font: {tpl.fontHeading} + {tpl.fontBody}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 60,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setCartOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 440,
              background: '#0F1117',
              borderLeft: `1px solid ${currentTemplate.borderColor}`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.7)',
            }}
          >
            <div style={{
              padding: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h3 style={{ margin: 0, color: '#FFF', fontSize: '1.2rem', fontWeight: 800 }}>Your Order</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Table 14 • Dine-In</span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#FFF',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Object.entries(cart).map(([id, qty]) => {
                const item = items.find(i => i.id === id)
                if (!item) return null
                return (
                  <div key={id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 12,
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: currentTemplate.primaryColor, fontWeight: 700 }}>
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => removeFromCart(id)}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: 'none',
                          color: '#FFF',
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          cursor: 'pointer',
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 800, color: '#FFF' }}>{qty}</span>
                      <button
                        onClick={() => addToCart(id)}
                        style={{
                          background: currentTemplate.primaryColor,
                          border: 'none',
                          color: '#000',
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontWeight: 800,
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ color: 'var(--gray-400)' }}>Total</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: currentTemplate.primaryColor }}>
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <button
                onClick={() => {
                  submitOrder({
                    restaurant_slug: restaurant.slug,
                    table_number: '14',
                    items: Object.entries(cart).map(([id, qty]) => {
                      const item = items.find(i => i.id === id)
                      return { menuItemId: id, name: item?.name || 'Item', price: item?.price || 0, quantity: qty }
                    }),
                    total_minor: Math.round(totalPrice * 100),
                  })
                  setOrderSuccess(true)
                  setCart({})
                  setTimeout(() => {
                    setOrderSuccess(false)
                    setCartOpen(false)
                  }, 2500)
                }}
                style={{
                  width: '100%',
                  background: currentTemplate.primaryColor,
                  color: '#000',
                  border: 'none',
                  padding: 14,
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                {orderSuccess ? '✓ Order Sent to Kitchen!' : 'Send Order to Kitchen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dish Detail Modal */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0F1117',
              border: `1px solid ${currentTemplate.borderColor}`,
              borderRadius: 20,
              maxWidth: 480,
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            }}
          >
            {selectedItem.image && (
              <div style={{ height: 220, position: 'relative' }}>
                <img src={selectedItem.image} alt={selectedItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(0,0,0,0.6)', border: 'none', color: '#FFF',
                    width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#FFF', fontFamily: currentTemplate.fontHeading }}>
                  {selectedItem.name}
                </h3>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: currentTemplate.primaryColor, fontFamily: currentTemplate.fontHeading }}>
                  {formatPrice(selectedItem.price)}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-300)', lineHeight: 1.5, margin: '0 0 20px' }}>
                {selectedItem.description}
              </p>
              <button
                onClick={() => {
                  addToCart(selectedItem.id)
                  setSelectedItem(null)
                }}
                style={{
                  width: '100%',
                  background: currentTemplate.primaryColor,
                  color: '#000',
                  border: 'none',
                  padding: 12,
                  borderRadius: 12,
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Plus size={16} /> Add to Order • {formatPrice(selectedItem.price)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
