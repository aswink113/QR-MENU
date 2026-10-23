import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, UtensilsCrossed, Palette, QrCode,
  CreditCard, BarChart3, Settings, LogOut, User, HelpCircle,
} from 'lucide-react'
import { mockPlans, formatDate } from '../data/mockData'
import { useRestaurantStore } from '../data/restaurantStore'

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
  { label: 'Menu Editor', icon: <UtensilsCrossed size={18} />, path: '/dashboard/menu' },
  { label: 'Templates', icon: <Palette size={18} />, path: '/dashboard/templates' },
  { label: 'QR Code', icon: <QrCode size={18} />, path: '/dashboard/qr' },
  { label: 'Analytics', icon: <BarChart3 size={18} />, path: '/dashboard/analytics' },
  { label: 'Billing', icon: <CreditCard size={18} />, path: '/dashboard/billing' },
  { label: 'Profile', icon: <Settings size={18} />, path: '/dashboard/profile' },
]

export default function Sidebar() {
  const location = useLocation()
  const { restaurant, subscription } = useRestaurantStore()
  const plan = mockPlans.find((p: any) => p.id === subscription.planId) || mockPlans[0]

  const getInitials = (name: string) => {
    if (!name) return 'MR'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">🍽️</div>
        <span>QRMenu</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Navigation</div>
        {navItems.map(item => {
          const isActive = item.path === '/dashboard'
            ? location.pathname === '/dashboard'
            : location.pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}

        <div className="sidebar-section-title" style={{ marginTop: 'var(--space-4)' }}>Support</div>
        <a href="#" className="sidebar-item">
          <HelpCircle size={18} />
          Help & Docs
        </a>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {/* Plan badge */}
        <div style={{
          background: 'rgba(255,107,53,0.08)',
          border: '1px solid rgba(255,107,53,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
          marginBottom: 'var(--space-4)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
              {plan?.name} Plan
            </span>
            <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Active</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
            Renews {formatDate(subscription.currentPeriodEnd)}
          </div>
          <Link to="/dashboard/billing" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 4, display: 'block' }}>
            Manage plan →
          </Link>
        </div>

        {/* User */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <div className="avatar">{getInitials(restaurant.name)}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {restaurant.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Owner</div>
          </div>
          <LogOut size={15} style={{ color: 'var(--gray-500)', cursor: 'pointer' }} />
        </div>
      </div>
    </aside>
  )
}
