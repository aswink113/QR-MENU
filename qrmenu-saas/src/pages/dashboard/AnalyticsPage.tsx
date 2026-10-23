import { useState } from 'react'
import {
  TrendingUp, Smartphone, Globe, Clock, Star, Eye,
  BarChart2, PieChart, ArrowUp, ArrowDown, QrCode,
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import { useRestaurantStore } from '../../data/restaurantStore'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7d')
  const { analytics, items, categories } = useRestaurantStore()

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const maxMonthly = Math.max(...analytics.monthlyScans, 0)

  const topItems = [...items].slice(0, 5)

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader title="Analytics" />

        <div className="dashboard-content">
          {/* Period selector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <p style={{ color: 'var(--gray-400)' }}>Track your real-time menu performance and customer engagement</p>
            <div className="tabs">
              {['24h', '7d', '30d', '90d', '1y'].map(p => (
                <button key={p} className={`tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)} id={`period-${p}`}>{p}</button>
              ))}
            </div>
          </div>

          {/* Top stats */}
          <div className="stats-grid">
            {[
              {
                label: 'Total Scans', value: analytics.totalScans.toLocaleString(),
                change: analytics.totalScans > 0 ? '+100%' : '0 scans', up: analytics.totalScans > 0, icon: <Eye size={22} />, color: '#FF6B35',
              },
              {
                label: 'Unique Visitors', value: analytics.uniqueVisitors.toLocaleString(),
                change: analytics.uniqueVisitors > 0 ? '+100%' : '0 visitors', up: analytics.uniqueVisitors > 0, icon: <Globe size={22} />, color: '#4CC9F0',
              },
              {
                label: 'Avg. Session', value: analytics.avgSessionTime,
                change: analytics.totalScans > 0 ? 'active' : 'no data', up: analytics.totalScans > 0, icon: <Clock size={22} />, color: '#06D6A0',
              },
              {
                label: 'Total Menu Items', value: items.length.toString(),
                change: `${items.filter(i => i.isAvailable).length} available`, up: items.length > 0, icon: <Star size={22} />, color: '#FFD166',
              },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
                <div className={`stat-change ${s.up ? 'positive' : 'negative'}`}>
                  {s.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {s.change}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
            {/* Monthly chart */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Scans Over Time</h3>
                <span className={`badge ${analytics.totalScans > 0 ? 'badge-success' : 'badge-primary'}`}>
                  <TrendingUp size={12} /> {analytics.totalScans > 0 ? `${analytics.totalScans} Total Scans` : 'Awaiting Scans'}
                </span>
              </div>
              {maxMonthly === 0 ? (
                <div style={{
                  padding: 'var(--space-10) var(--space-4)',
                  textAlign: 'center',
                  background: 'var(--dark-surface-2)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--dark-border)',
                }}>
                  <BarChart2 size={32} style={{ color: 'var(--primary)', margin: '0 auto var(--space-2)', opacity: 0.8 }} />
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>No Scan History Yet</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', maxWidth: 360, margin: '0 auto' }}>
                    When visitors scan your QR code or access your menu link, monthly historical analytics will be generated automatically.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', height: 160 }}>
                  {analytics.monthlyScans.map((v, i) => {
                    const h = maxMonthly > 0 ? (v / maxMonthly) * 100 : 0
                    const isLast = i === analytics.monthlyScans.length - 1
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--gray-500)', fontWeight: 600 }}>{v}</div>
                        <div style={{
                          width: '100%', height: `${Math.max(h, 4)}%`,
                          background: isLast
                            ? 'linear-gradient(to top, var(--primary), var(--accent))'
                            : 'rgba(255,107,53,0.2)',
                          borderRadius: '4px 4px 0 0',
                          minHeight: 4,
                          transition: 'height 0.4s ease',
                          cursor: 'pointer',
                        }} title={`${monthNames[i]}: ${v}`} />
                        <span style={{ fontSize: '0.65rem', color: 'var(--gray-500)' }}>{monthNames[i]}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Device breakdown */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>Device Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {[
                  { device: 'Mobile', icon: '📱', pct: analytics.scansByDevice.mobile, color: '#FF6B35' },
                  { device: 'Desktop', icon: '💻', pct: analytics.scansByDevice.desktop, color: '#4CC9F0' },
                  { device: 'Tablet', icon: '📱', pct: analytics.scansByDevice.tablet, color: '#7B2FBE' },
                ].map(d => (
                  <div key={d.device}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.875rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-300)' }}>{d.icon} {d.device}</span>
                      <strong style={{ color: d.color }}>{d.pct}%</strong>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${d.pct}%`, background: d.color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Hourly peak */}
              <div style={{ marginTop: 'var(--space-6)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--gray-300)' }}>Peak Scan Hours</h4>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 50 }}>
                  {analytics.scansByHour.filter((_, i) => i % 2 === 0).map((h, i) => {
                    const max = Math.max(...analytics.scansByHour.map(x => x.scans), 1)
                    const height = (h.scans / max) * 100
                    return (
                      <div key={i} style={{
                        flex: 1, height: `${Math.max(height, 4)}%`, minHeight: 2,
                        background: h.scans > 0 ? 'var(--primary)' : 'rgba(255,107,53,0.15)',
                        borderRadius: '2px 2px 0 0',
                      }} title={`${h.hour}:00 - ${h.scans} scans`} />
                    )
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.65rem', color: 'var(--gray-600)' }}>
                  <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>12am</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 'var(--space-2)' }}>
                  {analytics.totalScans > 0 ? '📊 Traffic dynamically tracked per hour' : 'Awaiting customer QR scans'}
                </p>
              </div>
            </div>
          </div>

          {/* Top items */}
          <div className="table-container" style={{ marginTop: 'var(--space-6)' }}>
            <div className="table-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Menu Items Performance</h3>
              <span className="badge badge-info">Active Inventory</span>
            </div>
            {topItems.length === 0 ? (
              <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--gray-500)' }}>
                No dishes created yet in Menu Editor. Once you add dishes, individual view counts will appear here.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, idx) => {
                    const cat = categories.find(c => c.id === item.categoryId)
                    return (
                      <tr key={item.id}>
                        <td style={{ color: 'var(--gray-500)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                          #{idx + 1}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <img src={item.image} alt={item.name} style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                            <span style={{ fontWeight: 500 }}>{item.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>{cat?.name || 'General'}</td>
                        <td style={{ fontWeight: 600 }}>
                          <span className={`badge ${item.isAvailable ? 'badge-success' : 'badge-error'}`}>
                            {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>
                            Active on Digital Menu
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
      </main>
    </div>
  )
}
