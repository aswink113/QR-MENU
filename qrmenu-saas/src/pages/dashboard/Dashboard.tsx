import { Link } from 'react-router-dom'
import {
  QrCode, Eye, TrendingUp, Clock, ArrowRight,
  Smartphone, Globe, AlertCircle, CheckCircle2, ChevronRight, UtensilsCrossed, Plus,
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import { mockPlans, formatDate } from '../../data/mockData'
import { useRestaurantStore } from '../../data/restaurantStore'
import { useCurrency } from '../../data/currency'

const quickActions = [
  { label: 'Add Menu Item', emoji: '➕', path: '/dashboard/menu', color: '#FF6B35' },
  { label: 'Download QR', emoji: '📲', path: '/dashboard/qr', color: '#4CC9F0' },
  { label: 'Change Template', emoji: '🎨', path: '/dashboard/templates', color: '#7B2FBE' },
  { label: 'View Analytics', emoji: '📊', path: '/dashboard/analytics', color: '#06D6A0' },
]

export default function Dashboard() {
  const { formatPrice } = useCurrency()
  const { restaurant, categories, items, analytics, subscription, payments, menu } = useRestaurantStore()
  const plan = mockPlans.find(p => p.id === subscription.planId) || mockPlans[0]
  const activeItems = items.filter(i => i.isAvailable).length
  const lastPayment = payments.find(p => p.status === 'succeeded')
  const maxWeekly = Math.max(...analytics.weeklyScans, 0)

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader title="Dashboard" />

        <div className="dashboard-content">
          {/* Welcome Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(123,47,190,0.1))',
            border: '1px solid rgba(255,107,53,0.25)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6) var(--space-8)',
            marginBottom: 'var(--space-8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-1)', fontFamily: 'var(--font-display)' }}>
                👋 Welcome to your Dashboard
              </h2>
              <p style={{ color: 'var(--gray-400)', fontSize: '0.9375rem' }}>
                {restaurant.name} · {plan?.name} Plan · {menu.isPublished ? '🟢 Menu Published' : '🔴 Menu Unpublished'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Link to="/dashboard/menu" className="btn btn-primary btn-sm">
                Edit Menu <ArrowRight size={14} />
              </Link>
              <Link to={`/menu/${restaurant.slug}`} className="btn btn-secondary btn-sm">
                <Globe size={14} /> Preview
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {[
              {
                label: 'Total Scans', value: analytics.totalScans.toLocaleString(),
                change: analytics.totalScans > 0 ? '+100%' : '0 scans', positive: analytics.totalScans > 0, icon: <QrCode size={22} />, bg: '#FF6B35',
              },
              {
                label: 'Unique Visitors', value: analytics.uniqueVisitors.toLocaleString(),
                change: analytics.uniqueVisitors > 0 ? '+100%' : '0 visitors', positive: analytics.uniqueVisitors > 0, icon: <Eye size={22} />, bg: '#4CC9F0',
              },
              {
                label: 'Active Items', value: `${activeItems}/${items.length}`,
                change: items.length > 0 ? 'items online' : 'No items yet', positive: activeItems > 0, icon: <Smartphone size={22} />, bg: '#06D6A0',
              },
              {
                label: 'Avg. Session', value: analytics.avgSessionTime,
                change: analytics.totalScans > 0 ? 'active' : 'no data', positive: analytics.totalScans > 0, icon: <Clock size={22} />, bg: '#7B2FBE',
              },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: `${s.bg}20`, color: s.bg }}>
                  {s.icon}
                </div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
                <div className={`stat-change ${s.positive ? 'positive' : 'negative'}`}>
                  <TrendingUp size={12} /> {s.change}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

              {/* Weekly chart */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>QR Scans — Last 7 days</h3>
                  <Link to="/dashboard/analytics" style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    View all <ChevronRight size={14} />
                  </Link>
                </div>
                {maxWeekly === 0 ? (
                  <div style={{
                    padding: 'var(--space-6)',
                    background: 'var(--dark-surface-2)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center',
                    border: '1px dashed var(--dark-border)',
                  }}>
                    <QrCode size={28} style={{ color: 'var(--primary)', margin: '0 auto var(--space-2)', opacity: 0.8 }} />
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>No scans recorded yet</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', maxWidth: 360, margin: '0 auto' }}>
                      Once guests scan your QR code or access your digital menu, daily activity will be graphed here in real-time.
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', height: 120 }}>
                    {analytics.weeklyScans.map((v, i) => {
                      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                      const h = maxWeekly > 0 ? (v / maxWeekly) * 100 : 0
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <div style={{
                            width: '100%', height: `${Math.max(h, 4)}%`,
                            background: i === 6
                              ? 'linear-gradient(to top, var(--primary), var(--accent))'
                              : 'rgba(255,107,53,0.25)',
                            borderRadius: '4px 4px 0 0',
                            minHeight: 4,
                            transition: 'height 0.4s ease',
                          }} title={`${days[i]}: ${v} scans`} />
                          <span style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>{days[i]}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Menu Overview */}
              <div className="table-container">
                <div className="table-header">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Menu Overview</h3>
                  <Link to="/dashboard/menu" className="btn btn-primary btn-sm">
                    Edit Menu
                  </Link>
                </div>
                {categories.length === 0 ? (
                  <div style={{
                    padding: 'var(--space-8) var(--space-4)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: 'rgba(255,107,53,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--primary)',
                    }}>
                      <UtensilsCrossed size={26} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>No Menu Items Yet</h4>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', maxWidth: 360 }}>
                        Start creating categories (e.g. Appetizers, Main Course, Drinks) and dishes for your restaurant menu.
                      </p>
                    </div>
                    <Link to="/dashboard/menu" className="btn btn-primary btn-sm" style={{ marginTop: 4 }}>
                      <Plus size={14} /> Add First Item
                    </Link>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Items</th>
                        <th>Available</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(cat => {
                        const catItems = items.filter(i => i.categoryId === cat.id)
                        const avail = catItems.filter(i => i.isAvailable).length
                        return (
                          <tr key={cat.id}>
                            <td style={{ fontWeight: 500 }}>{cat.name}</td>
                            <td>{catItems.length}</td>
                            <td>
                              <span style={{ color: avail === catItems.length && catItems.length > 0 ? 'var(--success)' : 'var(--warning)', fontWeight: 500 }}>
                                {avail}/{catItems.length}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${cat.isActive ? 'badge-success' : 'badge-error'}`}>
                                {cat.isActive ? 'Active' : 'Hidden'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

              {/* Quick Actions */}
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {quickActions.map(a => (
                    <Link key={a.path} to={a.path} style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                      padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                      background: 'var(--dark-surface-2)', border: '1px solid var(--dark-border)',
                      transition: 'all 0.2s', color: 'var(--dark-text)',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = `${a.color}12` }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--dark-border)'; e.currentTarget.style.background = 'var(--dark-surface-2)' }}>
                      <span style={{ fontSize: '1.25rem' }}>{a.emoji}</span>
                      <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{a.label}</span>
                      <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--gray-500)' }} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>System Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {[
                    { label: 'Menu Published', status: menu.isPublished, icon: <Globe size={15} /> },
                    { label: 'QR Code Active', status: true, icon: <QrCode size={15} /> },
                    { label: 'Subscription Active', status: subscription.status === 'active', icon: <CheckCircle2 size={15} /> },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray-300)', fontSize: '0.875rem' }}>
                        {s.icon} {s.label}
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: '0.8rem', fontWeight: 600,
                        color: s.status ? 'var(--success)' : 'var(--error)',
                      }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: s.status ? 'var(--success)' : 'var(--error)',
                          animation: s.status ? 'pulse-dot 2s infinite' : 'none',
                        }} />
                        {s.status ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Summary */}
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Billing</h3>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: 4 }}>Current Plan</div>
                  <div style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{plan?.name}</span>
                    <span style={{ color: 'var(--primary)' }}>{formatPrice(plan?.price || 0)}/mo</span>
                  </div>
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: 4 }}>Next renewal</div>
                  <div style={{ fontWeight: 500 }}>{formatDate(subscription.currentPeriodEnd)}</div>
                </div>
                {lastPayment ? (
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: 4 }}>Last payment</div>
                    <div style={{ fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{formatDate(lastPayment.paidAt)}</span>
                      <span className="badge badge-success">{formatPrice(lastPayment.amount)}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: 'var(--space-4)' }}>
                    No prior invoices
                  </div>
                )}
                <Link to="/dashboard/billing" className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center' }}>
                  Manage Billing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
