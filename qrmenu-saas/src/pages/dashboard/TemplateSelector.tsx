import { useState, useMemo } from 'react'
import {
  Check, Search, Filter, Sparkles, Layers, Sliders,
  Eye, RefreshCw, X, ChevronDown, CheckCircle2,
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import {
  ALL_TEMPLATES,
  TEMPLATE_CATEGORIES,
  LAYOUT_MODELS,
  MenuTemplate,
  LayoutModel,
  searchTemplates,
} from '../../data/templates'
import TemplateDishPreview from '../../components/TemplateDishPreview'
import { mockMenu } from '../../data/mockData'

export default function TemplateSelector() {
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('qrmenu_active_template') || 'tpl-luxury-01'
    }
    return 'tpl-luxury-01'
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedLayout, setSelectedLayout] = useState<LayoutModel | undefined>(undefined)
  const [saved, setSaved] = useState(false)
  const [previewTab, setPreviewTab] = useState<'preview' | 'customize'>('preview')

  // Theme customizer state
  const selectedTemplate = useMemo(() => {
    return ALL_TEMPLATES.find(t => t.id === selectedId) || ALL_TEMPLATES[0]
  }, [selectedId])

  const [customBrand, setCustomBrand] = useState({
    primary: selectedTemplate.primaryColor,
    background: selectedTemplate.backgroundColor,
    cardBg: selectedTemplate.cardBackground,
    fontHeading: selectedTemplate.fontHeading,
    fontBody: selectedTemplate.fontBody,
  })

  // Filter templates based on search, category, and layout
  const filteredTemplates = useMemo(() => {
    return searchTemplates(searchQuery, selectedCategory, selectedLayout)
  }, [searchQuery, selectedCategory, selectedLayout])

  const handleSelectTemplate = (tpl: MenuTemplate) => {
    setSelectedId(tpl.id)
    setCustomBrand({
      primary: tpl.primaryColor,
      background: tpl.backgroundColor,
      cardBg: tpl.cardBackground,
      fontHeading: tpl.fontHeading,
      fontBody: tpl.fontBody,
    })
  }

  const handleApplyTemplate = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('qrmenu_active_template', selectedId)
      window.localStorage.setItem('qrmenu_active_template_code', selectedTemplate.code)
      window.dispatchEvent(new CustomEvent('qrmenu_template_changed', { detail: selectedTemplate }))
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader title="Templates & Design Engine" />

        <div className="dashboard-content">
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-6)',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="badge badge-primary" style={{ padding: '3px 10px', fontSize: '0.8rem', fontWeight: 700 }}>
                  105+ Premium Templates
                </span>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                  Complete typography, model layouts & color systems
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>
                Choose Your Restaurant Template
              </h2>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--dark-surface)',
                border: '1px solid var(--dark-border)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
              }}>
                <span style={{ color: 'var(--gray-400)' }}>Active:</span>
                <strong style={{ color: selectedTemplate.primaryColor, fontFamily: selectedTemplate.fontHeading }}>
                  {selectedTemplate.name}
                </strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>({selectedTemplate.layoutModel})</span>
              </div>

              <button
                className={`btn ${saved ? 'btn-success' : 'btn-primary'} btn-sm`}
                onClick={handleApplyTemplate}
                id="apply-template-btn"
                style={{ minWidth: 140 }}
              >
                {saved ? <><Check size={15} /> Applied to Menu!</> : <><Sparkles size={15} /> Apply Template</>}
              </button>
            </div>
          </div>

          {/* Search, Dropdown & Filter Controls */}
          <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4) var(--space-5)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1.2fr auto',
              gap: 'var(--space-4)',
              alignItems: 'center',
              marginBottom: 'var(--space-4)',
            }}>
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--gray-500)',
                  }}
                />
                <input
                  className="form-input"
                  style={{ paddingLeft: 36, height: 42, width: '100%', fontSize: '0.9rem' }}
                  placeholder="Search 100+ templates by cuisine, vibe, font (e.g. Sushi, Noir, Bodoni, Bento)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  id="template-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: 'var(--gray-500)', cursor: 'pointer',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Quick Jump Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>
                  Jump to:
                </label>
                <select
                  className="form-input"
                  style={{ height: 42, fontSize: '0.875rem' }}
                  value={selectedId}
                  onChange={e => {
                    const tpl = ALL_TEMPLATES.find(t => t.id === e.target.value)
                    if (tpl) handleSelectTemplate(tpl)
                  }}
                  id="template-quick-dropdown"
                >
                  {TEMPLATE_CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <optgroup key={cat} label={cat}>
                      {ALL_TEMPLATES.filter(t => t.category === cat).map(tpl => (
                        <option key={tpl.id} value={tpl.id}>
                          {tpl.name} ({tpl.vibe}) — {tpl.fontHeading}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Results counter */}
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--gray-400)',
                background: 'var(--dark-surface-2)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                whiteSpace: 'nowrap',
              }}>
                Showing <strong>{filteredTemplates.length}</strong> of {ALL_TEMPLATES.length} templates
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div style={{
              display: 'flex',
              gap: 'var(--space-2)',
              overflowX: 'auto',
              paddingBottom: 6,
              marginBottom: 'var(--space-3)',
            }}>
              {TEMPLATE_CATEGORIES.map(cat => {
                const count = cat === 'All'
                  ? ALL_TEMPLATES.length
                  : ALL_TEMPLATES.filter(t => t.category === cat).length
                const active = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: active ? '1px solid var(--primary)' : '1px solid var(--dark-border)',
                      background: active ? 'rgba(255,107,53,0.15)' : 'var(--dark-surface-2)',
                      color: active ? 'var(--primary)' : 'var(--gray-300)',
                      fontSize: '0.8125rem',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat} ({count})
                  </button>
                )
              })}
            </div>

            {/* Layout Models Filter Bar */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginRight: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Layout Model:
              </span>
              <button
                onClick={() => setSelectedLayout(undefined)}
                style={{
                  padding: '3px 10px',
                  borderRadius: 6,
                  border: !selectedLayout ? '1px solid var(--primary)' : '1px solid var(--dark-border)',
                  background: !selectedLayout ? 'rgba(255,107,53,0.12)' : 'transparent',
                  color: !selectedLayout ? 'var(--primary)' : 'var(--gray-400)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                All Models
              </button>
              {LAYOUT_MODELS.map(m => {
                const active = selectedLayout === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedLayout(m.id)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: 6,
                      border: active ? '1px solid var(--primary)' : '1px solid var(--dark-border)',
                      background: active ? 'rgba(255,107,53,0.12)' : 'transparent',
                      color: active ? 'var(--primary)' : 'var(--gray-400)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{m.icon}</span>
                    <span>{m.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main 2-Column Showcase */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
            {/* Left Column: Template Cards Grid */}
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--space-4)',
                maxHeight: 'calc(100vh - 280px)',
                overflowY: 'auto',
                paddingRight: 6,
              }}>
                {filteredTemplates.map(tpl => {
                  const isSelected = selectedId === tpl.id
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      style={{
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--dark-border)',
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        background: isSelected ? 'rgba(255,107,53,0.06)' : 'var(--dark-surface)',
                        position: 'relative',
                        boxShadow: isSelected ? '0 0 20px rgba(255,107,53,0.2)' : 'none',
                      }}
                      id={`template-card-${tpl.code}`}
                    >
                      {/* Active Check Badge */}
                      {isSelected && (
                        <div style={{
                          position: 'absolute', top: 10, right: 10, zIndex: 3,
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'var(--primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        }}>
                          <Check size={16} color="white" />
                        </div>
                      )}

                      {/* Preview Image with Model Badge */}
                      <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                        <img
                          src={tpl.previewImage}
                          alt={tpl.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          background: 'rgba(0,0,0,0.75)',
                          backdropFilter: 'blur(4px)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          textTransform: 'uppercase',
                        }}>
                          {tpl.layoutModel.replace('-', ' ')}
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                          <h4 style={{
                            fontWeight: 800,
                            fontFamily: tpl.fontHeading,
                            fontSize: '1.05rem',
                            color: isSelected ? 'var(--primary)' : 'var(--dark-text)',
                            margin: 0,
                          }}>
                            {tpl.name}
                          </h4>
                          <span style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>
                            {tpl.category.split('&')[0].trim()}
                          </span>
                        </div>

                        <p style={{
                          fontSize: '0.78rem',
                          color: 'var(--gray-400)',
                          margin: '0 0 10px',
                          lineHeight: 1.35,
                        }}>
                          {tpl.vibe}
                        </p>

                        {/* Font Pairing Pill */}
                        <div style={{
                          background: 'var(--dark-surface-2)',
                          padding: '4px 8px',
                          borderRadius: 6,
                          fontSize: '0.72rem',
                          color: 'var(--gray-300)',
                          marginBottom: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <span>Font: <strong style={{ color: tpl.primaryColor }}>{tpl.fontHeading}</strong></span>
                          <span style={{ color: 'var(--gray-500)' }}>+ {tpl.fontBody}</span>
                        </div>

                        {/* Swatches & Tag */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: 5 }}>
                            {[tpl.primaryColor, tpl.secondaryColor, tpl.backgroundColor, tpl.cardBackground].map((c, i) => (
                              <div
                                key={i}
                                style={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: 4,
                                  background: c,
                                  border: '1px solid rgba(255,255,255,0.2)',
                                }}
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>
                            {tpl.badgeStyle} badge
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Live Interactive Preview & Customizer */}
            <div style={{ position: 'sticky', top: 80 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-3)',
              }}>
                <div className="tabs">
                  <button
                    className={`tab ${previewTab === 'preview' ? 'active' : ''}`}
                    onClick={() => setPreviewTab('preview')}
                  >
                    <Eye size={14} /> Live Menu Preview
                  </button>
                  <button
                    className={`tab ${previewTab === 'customize' ? 'active' : ''}`}
                    onClick={() => setPreviewTab('customize')}
                  >
                    <Sliders size={14} /> Fine-Tune Style
                  </button>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleApplyTemplate}
                >
                  {saved ? <Check size={14} /> : <CheckCircle2 size={14} />} Apply This Template
                </button>
              </div>

              {previewTab === 'preview' ? (
                <div>
                  <TemplateDishPreview template={selectedTemplate} />
                </div>
              ) : (
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <h4 style={{ fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>
                    Customizing: {selectedTemplate.name}
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Primary Brand Accent</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="color"
                          value={customBrand.primary}
                          onChange={e => setCustomBrand(p => ({ ...p, primary: e.target.value }))}
                          style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer' }}
                        />
                        <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{customBrand.primary}</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Background Color</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="color"
                          value={customBrand.background}
                          onChange={e => setCustomBrand(p => ({ ...p, background: e.target.value }))}
                          style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer' }}
                        />
                        <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{customBrand.background}</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Heading Typography</label>
                      <select
                        className="form-input"
                        value={customBrand.fontHeading}
                        onChange={e => setCustomBrand(p => ({ ...p, fontHeading: e.target.value }))}
                      >
                        {[
                          'Cinzel', 'Playfair Display', 'Bodoni Moda', 'Italiana',
                          'Cormorant Garamond', 'Syne', 'Space Grotesk', 'Outfit',
                          'Bebas Neue', 'Righteous', 'Pacifico', 'Caveat', 'Share Tech Mono'
                        ].map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Body Typography</label>
                      <select
                        className="form-input"
                        value={customBrand.fontBody}
                        onChange={e => setCustomBrand(p => ({ ...p, fontBody: e.target.value }))}
                      >
                        {[
                          'Inter', 'Outfit', 'DM Sans', 'Plus Jakarta Sans',
                          'Space Grotesk', 'Cormorant Garamond', 'Share Tech Mono'
                        ].map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{
                    padding: 'var(--space-3)',
                    background: 'var(--dark-surface-2)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--dark-border)',
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                      Selected Layout Model: <strong>{selectedTemplate.layoutModel}</strong> with <strong>{selectedTemplate.badgeStyle}</strong> badges and <strong>{selectedTemplate.priceStyle}</strong> price tags.
                    </span>
                  </div>

                  <button className="btn btn-primary" onClick={handleApplyTemplate}>
                    Save Customizations
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
