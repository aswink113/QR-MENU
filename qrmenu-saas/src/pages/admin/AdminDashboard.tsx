import { useState } from 'react'
import {
  Users, DollarSign, TrendingUp, QrCode, Search, Eye,
  AlertCircle, CheckCircle, XCircle, MoreVertical, Shield,
  BarChart2, RefreshCw,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockAdminRestaurants, formatDate } from '../../data/mockData'

const statusColors: Record<string, string> = {
  active: 'var(--success)',
  past_due: 'var(--warning)',
  canceled: 'var(--error)',
  trialing: 'var(--info)',
}

export default function AdminDashboard() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('restaurants')

  const filtered = mockAdminRestaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalMRR = mockAdminRestaurants
    .filter(r => r.status === 'active')
    .reduce((acc, r) => acc + (r.plan === 'Pro' ? 2999 : r.plan === 'Growth' ? 1299 : 499), 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
      {/* Admin top bar */}
      <div style={{
        background: 'var(--dark-surface)',
        borderBottom: '1px solid var(--dark-border)',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--space-8)',
        justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <Link to="/" className="navbar-logo" style={{ color: 'var(--dark-text)', fontSize: '1.1rem' }}>
            <div className="logo-icon">🍽️</div>
            <span>QRMenu</span>
          </Link>
          <span style={{
            background: 'rgba(239,35,60,0.15)', color: 'var(--error)',
            border: '1px solid rgba(239,35,60,0.3)',
            padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700,
          }}>
            ADMIN
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link to="/dashboard" className="btn btn-secondary btn-sm">Owner View</Link>
          <div className="avatar">A</div>
        </div>
      </div>

      <div style={{ padding: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: 'var(--gray-400)', marginTop: 4 }}>Platform overview and restaurant management</p>
          </div>
          <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
          {[
            { label: 'Total Restaurants', value: mockAdminRestaurants.length, icon: <Users size={22} />, color: '#FF6B35', change: '+3 this week' },
            { label: 'Monthly Revenue (MRR)', value: `₹${totalMRR.toLocaleString('en-IN')}`, icon: <DollarSign size={22} />, color: '#06D6A0', change: '+₹4,596 vs last mo' },
            { label: 'Active Subscriptions', value: mockAdminRestaurants.filter(r => r.status === 'active').length, icon: <CheckCircle size={22} />, color: '#4CC9F0', change: '83% retention' },
            { label: 'Total Menu Scans', value: mockAdminRestaurants.reduce((a, r) => a + r.scans, 0).toLocaleString(), icon: <QrCode size={22} />, color: '#7B2FBE', change: '+12% this month' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-change positive">
                <TrendingUp size={12} /> {s.change}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
          {['restaurants', 'billing', 'audit log'].map(t => (
            <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)} id={`admin-tab-${t}`}
              style={{ textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'restaurants' && (
          <div className="table-container">
            <div className="table-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Restaurants</h3>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                  <input className="form-input" style={{ paddingLeft: 30, width: 200, height: 36, fontSize: '0.875rem' }}
                    placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} id="admin-search" />
                </div>
                <select className="form-input" style={{ height: 36, width: 130 }} value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)} id="admin-filter">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="past_due">Past Due</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Owner</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Scans</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--gray-500)' }}>
                      No restaurants found. Registered tenants will appear here.
                    </td>
                  </tr>
                ) : (
                  filtered.map(r => (
                    <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedRestaurant(r.id === selectedRestaurant ? null : r.id)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem', background: `hsl(${r.name.charCodeAt(0) * 7 % 360}, 60%, 50%)` }}>
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{r.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontFamily: 'monospace' }}>/{r.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--gray-300)' }}>{r.owner}</td>
                    <td>
                      <span className={`badge ${r.plan === 'Pro' ? 'badge-warning' : r.plan === 'Growth' ? 'badge-primary' : 'badge-info'}`}>
                        {r.plan}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', fontWeight: 500, color: statusColors[r.status] }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColors[r.status], display: 'block' }} />
                        {r.status === 'past_due' ? 'Past Due' : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>{r.scans.toLocaleString()}</td>
                    <td style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>{formatDate(r.joinedAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: '0.8rem' }} id={`view-${r.id}`}>
                          <Eye size={13} />
                        </button>
                        {r.status === 'past_due' && (
                          <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--warning)' }} id={`fix-billing-${r.id}`}>
                            <AlertCircle size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))) }
              </tbody>
            </table>

            {/* Expanded restaurant detail */}
            {selectedRestaurant && (
              <div style={{
                margin: 'var(--space-4) var(--space-6)',
                background: 'var(--dark-surface-2)',
                border: '1px solid var(--dark-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
              }}>
                {(() => {
                  const r = mockAdminRestaurants.find(x => x.id === selectedRestaurant)!
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: 2 }}>Restaurant</div>
                        <div style={{ fontWeight: 600 }}>{r.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>/{r.slug}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: 2 }}>Gateway Sub ID</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>sub_NMfz{r.id}123</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: 2 }}>Revenue</div>
                        <div style={{ fontWeight: 700, color: 'var(--success)' }}>
                          ₹{(r.plan === 'Pro' ? 2999 : r.plan === 'Growth' ? 1299 : 499).toLocaleString('en-IN')}/mo
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <button className="btn btn-secondary btn-sm" id="admin-impersonate">
                          <Eye size={13} /> View as Owner
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} id="admin-suspend">
                          <Shield size={13} /> Suspend
                        </button>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>Revenue Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
              {[
                { plan: 'Starter', count: mockAdminRestaurants.filter(r => r.plan === 'Starter').length, price: 499 },
                { plan: 'Growth', count: mockAdminRestaurants.filter(r => r.plan === 'Growth').length, price: 1299 },
                { plan: 'Pro', count: mockAdminRestaurants.filter(r => r.plan === 'Pro').length, price: 2999 },
              ].map(p => (
                <div key={p.plan} style={{ background: 'var(--dark-surface-2)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)', marginBottom: 4 }}>{p.plan} Plan</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
                    {p.count} <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 400 }}>restaurants</span>
                  </div>
                  <div style={{ color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>
                    ₹{(p.count * p.price).toLocaleString('en-IN')}/mo
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)',
              borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>Total MRR</span>
              <span style={{ fontWeight: 800, fontSize: '1.75rem', fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
                ₹{totalMRR.toLocaleString('en-IN')}/month
              </span>
            </div>
          </div>
        )}

        {activeTab === 'audit log' && (
          <div className="table-container">
            <div className="table-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Audit Log</h3>
              <button className="btn btn-secondary btn-sm" id="refresh-logs"><RefreshCw size={14} /> Refresh</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Restaurant</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--gray-500)' }}>
                    No audit log events recorded yet. System webhooks and actions will be tracked here.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
