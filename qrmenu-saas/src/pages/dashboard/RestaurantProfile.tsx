import { useState } from 'react'
import { Camera, MapPin, Phone, Mail, Globe, Clock, Check, Save } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import { useRestaurantStore } from '../../data/restaurantStore'
import { CURRENCY_MAP, setStoredCurrency, getStoredCurrency } from '../../data/currency'

export default function RestaurantProfile() {
  const { restaurant, updateRestaurant } = useRestaurantStore()
  const [profile, setProfile] = useState({
    name: restaurant.name || 'My Restaurant',
    cuisine: restaurant.cuisine || '',
    phone: restaurant.phone || '',
    email: restaurant.email || '',
    address: restaurant.address || '',
    website: '',
    timezone: restaurant.timezone || 'Asia/Kolkata',
    currency: getStoredCurrency(),
    description: '',
    openHours: {
      mon_fri: '11:00 AM – 11:00 PM',
      sat_sun: '10:00 AM – 11:30 PM',
    },
    socialLinks: {
      instagram: '',
      facebook: '',
      zomato: '',
    },
  })
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'hours' | 'social' | 'account'>('general')

  const update = (key: string, val: string) => setProfile(p => ({ ...p, [key]: val }))

  const handleSave = () => {
    updateRestaurant({
      name: profile.name,
      cuisine: profile.cuisine,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      timezone: profile.timezone,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader title="Restaurant Profile" />

        <div className="dashboard-content">
          {/* Profile hero */}
          <div style={{
            background: 'var(--dark-surface)',
            border: '1px solid var(--dark-border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: 'var(--space-6)',
          }}>
            {/* Cover */}
            <div style={{ height: 160, background: 'linear-gradient(135deg, rgba(255,107,53,0.3), rgba(123,47,190,0.3))', position: 'relative', overflow: 'hidden' }}>
              {restaurant.coverImage && (
                <img src={restaurant.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
              )}
              <button className="btn btn-ghost btn-sm" style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.5)' }} id="change-cover">
                <Camera size={14} /> Change Cover
              </button>
            </div>

            {/* Logo & info */}
            <div style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'flex-end', gap: 'var(--space-5)', marginTop: -40 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  border: '4px solid var(--dark-surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem',
                }}>
                  🍽️
                </div>
                <button style={{
                  position: 'absolute', bottom: -6, right: -6,
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'var(--primary)', border: '2px solid var(--dark-surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }} id="change-logo">
                  <Camera size={12} color="white" />
                </button>
              </div>
              <div style={{ flex: 1, paddingBottom: 4 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{profile.name}</h2>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                  {profile.cuisine || 'Digital Restaurant Menu'} {profile.address ? `· ${profile.address}` : ''}
                </p>
              </div>
              <button className={`btn ${saved ? 'btn-success' : 'btn-primary'} btn-sm`} onClick={handleSave} id="save-profile">
                {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Profile</>}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
            {(['general', 'hours', 'social', 'account'] as const).map(tab => (
              <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)} id={`tab-${tab}`}
                style={{ textTransform: 'capitalize' }}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'general' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="card">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Basic Info</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Restaurant Name *</label>
                      <input className="form-input" value={profile.name} onChange={e => update('name', e.target.value)} id="profile-name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cuisine Type</label>
                      <select className="form-input" value={profile.cuisine} onChange={e => update('cuisine', e.target.value)} id="profile-cuisine">
                        {['North Indian', 'South Indian', 'Chinese', 'Italian', 'Fast Food', 'Café & Bakery', 'Multi-cuisine', 'Other'].map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-input form-textarea" value={profile.description}
                        onChange={e => update('description', e.target.value)} id="profile-desc" rows={3} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Timezone</label>
                      <select className="form-input" value={profile.timezone} onChange={e => update('timezone', e.target.value)} id="profile-tz">
                        {['Asia/Kolkata', 'Asia/Dubai', 'Europe/London', 'America/New_York'].map(tz => (
                          <option key={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Currency & Pricing Setting */}
                <div className="card" style={{ border: '1px solid rgba(255,107,53,0.3)', background: 'linear-gradient(135deg, rgba(255,107,53,0.05), transparent)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, margin: 0 }}>
                      Pricing Currency & Symbol
                    </h3>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Global Pricing</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
                    Select the currency used for all menu dishes, bills, invoices and reports. The symbol and logo will change dynamically across your digital menu.
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    <select
                      className="form-input"
                      value={profile.currency}
                      onChange={e => {
                        const val = e.target.value
                        update('currency', val)
                        setStoredCurrency(val)
                      }}
                      id="profile-currency"
                      style={{ height: 42, fontWeight: 700, fontSize: '0.9rem' }}
                    >
                      <option value="INR">🇮🇳 ₹ - Indian Rupee (INR) - Default</option>
                      <option value="USD">🇺🇸 $ - US Dollar (USD)</option>
                      <option value="EUR">🇪🇺 € - Euro (EUR)</option>
                      <option value="GBP">🇬🇧 £ - British Pound (GBP)</option>
                      <option value="AED">🇦🇪 د.إ - UAE Dirham (AED)</option>
                      <option value="SAR">🇸🇦 ﷼ - Saudi Riyal (SAR)</option>
                      <option value="CAD">🇨🇦 CA$ - Canadian Dollar (CAD)</option>
                      <option value="AUD">🇦🇺 AU$ - Australian Dollar (AUD)</option>
                      <option value="JPY">🇯🇵 ¥ - Japanese Yen (JPY)</option>
                    </select>

                    <div style={{
                      padding: '8px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--dark-border)',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                      <span style={{ color: 'var(--gray-400)' }}>Live Preview:</span>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>
                        {CURRENCY_MAP[profile.currency]?.format(480) || `₹480`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="card">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Contact Details</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {[
                      { key: 'phone', label: 'Phone', icon: <Phone size={14} />, type: 'tel' },
                      { key: 'email', label: 'Email', icon: <Mail size={14} />, type: 'email' },
                      { key: 'website', label: 'Website', icon: <Globe size={14} />, type: 'url' },
                    ].map(f => (
                      <div key={f.key} className="form-group">
                        <label className="form-label">{f.label}</label>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }}>{f.icon}</span>
                          <input
                            type={f.type}
                            className="form-input"
                            style={{ paddingLeft: 36 }}
                            value={(profile as any)[f.key]}
                            onChange={e => update(f.key, e.target.value)}
                            id={`profile-${f.key}`}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <div style={{ position: 'relative' }}>
                        <MapPin size={14} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--gray-500)' }} />
                        <textarea className="form-input form-textarea" style={{ paddingLeft: 36 }} rows={2}
                          value={profile.address} onChange={e => update('address', e.target.value)} id="profile-address" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slug */}
                <div className="card">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Menu URL</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--dark-surface-2)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--dark-border)' }}>
                    <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>qrmenu.app/menu/</span>
                    <input className="form-input" defaultValue={restaurant.slug} onChange={e => updateRestaurant({ slug: e.target.value })} style={{ border: 'none', padding: 0, background: 'transparent', flex: 1 }} id="profile-slug" />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 'var(--space-2)' }}>
                    ⚠️ Changing your slug won't break your existing QR codes — they always point to your menu.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="card" style={{ maxWidth: 560 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>Operating Hours</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                  <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <span style={{ width: 90, fontWeight: 500, fontSize: '0.9rem', color: 'var(--gray-300)' }}>{day}</span>
                    <select className="form-input" style={{ height: 36, flex: 1 }} id={`hours-open-${i}`} defaultValue="11:00">
                      {Array.from({ length: 24 }, (_, h) => `${h.toString().padStart(2, '0')}:00`).map(t => <option key={t}>{t}</option>)}
                    </select>
                    <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>to</span>
                    <select className="form-input" style={{ height: 36, flex: 1 }} id={`hours-close-${i}`} defaultValue={i >= 5 ? "23:30" : "23:00"}>
                      {Array.from({ length: 24 }, (_, h) => `${h.toString().padStart(2, '0')}:00`).map(t => <option key={t}>{t}</option>)}
                    </select>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked={true} />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="card" style={{ maxWidth: 560 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>Social & Delivery Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {[
                  { label: 'Instagram', icon: '📸', placeholder: '@yourrestaurant', key: 'instagram' },
                  { label: 'Facebook', icon: '👥', placeholder: 'facebook.com/yourpage', key: 'facebook' },
                  { label: 'Zomato', icon: '🍕', placeholder: 'zomato.com/your-restaurant', key: 'zomato' },
                  { label: 'Swiggy', icon: '🛵', placeholder: 'Link to Swiggy page', key: 'swiggy' },
                  { label: 'Google Maps', icon: '🗺️', placeholder: 'Google Maps URL', key: 'gmaps' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.icon} {f.label}</label>
                    <input
                      className="form-input"
                      placeholder={f.placeholder}
                      defaultValue={(profile.socialLinks as any)[f.key] || ''}
                      id={`social-${f.key}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Change Password</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-input" placeholder="••••••••" id="curr-pass" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" placeholder="••••••••" id="new-pass" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-input" placeholder="••••••••" id="confirm-pass" />
                  </div>
                  <button className="btn btn-primary btn-sm" id="update-password">Update Password</button>
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Staff Members</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>
                  Add team members who can manage your menu
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  {[{ name: profile.name || 'Restaurant Owner', role: 'Owner', email: profile.email || 'owner@restaurant.com' }].map(m => (
                    <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--dark-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--dark-border)' }}>
                      <div className="avatar">{(m.name || 'RO').slice(0, 2).toUpperCase()}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{m.email}</div>
                      </div>
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{m.role}</span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center' }} id="invite-staff">
                  + Invite Staff Member
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
