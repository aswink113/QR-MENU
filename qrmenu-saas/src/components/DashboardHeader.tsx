import { Link, useNavigate } from 'react-router-dom'
import { Bell, Globe, ExternalLink, Search } from 'lucide-react'
import { useRestaurantStore } from '../data/restaurantStore'
import CurrencySelector from './CurrencySelector'

export default function DashboardHeader({ title }: { title: string }) {
  const navigate = useNavigate()
  const { restaurant } = useRestaurantStore()

  const getInitials = (name: string) => {
    if (!name) return 'MR'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <header className="dashboard-header">
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Search size={15} style={{ position: 'absolute', left: 10, color: 'var(--gray-500)' }} />
          <input
            type="text"
            placeholder="Search..."
            className="form-input"
            style={{ paddingLeft: 32, height: 36, width: 180, fontSize: '0.875rem' }}
            id="dashboard-search"
          />
        </div>

        {/* Currency Switcher */}
        <CurrencySelector />

        {/* View live menu */}
        <Link to={`/menu/${restaurant.slug}`} target="_blank"
          className="btn btn-outline btn-sm" style={{ gap: 6 }}>
          <Globe size={14} />
          View Menu
          <ExternalLink size={12} />
        </Link>

        {/* Notifications */}
        <button className="btn btn-ghost btn-sm" style={{ position: 'relative', padding: 8 }} id="notif-btn">
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--primary)', border: '2px solid var(--dark-surface)',
          }} />
        </button>

        {/* Avatar */}
        <div className="avatar" style={{ cursor: 'pointer' }}>{getInitials(restaurant.name)}</div>
      </div>
    </header>
  )
}
