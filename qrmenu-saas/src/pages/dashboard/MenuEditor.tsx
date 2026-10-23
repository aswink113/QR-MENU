import { useState, useEffect } from 'react'
import {
  Plus, Trash2, Edit3, GripVertical, ChevronDown, ChevronUp,
  ImagePlus, Check, X, ToggleLeft, ToggleRight, Search, Filter,
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import { Category, MenuItem } from '../../data/mockData'
import { useRestaurantStore } from '../../data/restaurantStore'
import { useCurrency } from '../../data/currency'

export default function MenuEditor() {
  const { currencyConfig, formatPrice } = useCurrency()
  const { categories, items, updateCategories, updateItems, menu, updateMenu } = useRestaurantStore()
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [addCatMode, setAddCatMode] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    dietaryLabel: [] as string[],
  })
  const [saved, setSaved] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [isPublished, setIsPublished] = useState(menu.isPublished)

  useEffect(() => {
    if (!newItem.categoryId && categories.length > 0) {
      setNewItem(prev => ({ ...prev, categoryId: categories[0].id }))
    }
  }, [categories])

  const filteredItems = items.filter(i => {
    const matchesCat = selectedCat ? i.categoryId === selectedCat : true
    const matchesSearch = i.name.toLowerCase().includes(searchQ.toLowerCase())
    return matchesCat && matchesSearch
  })

  const handleAddCategory = () => {
    if (!newCatName.trim()) return
    const newCat: Category = {
      id: `cat-${Date.now()}`, restaurantId: 'rest-1', menuId: 'menu-1',
      name: newCatName.trim(), sortOrder: categories.length + 1, isActive: true,
    }
    const nextCats = [...categories, newCat]
    updateCategories(nextCats)
    if (!newItem.categoryId) {
      setNewItem(prev => ({ ...prev, categoryId: newCat.id }))
    }
    setNewCatName('')
    setAddCatMode(false)
  }

  const handleDeleteCat = (id: string) => {
    updateCategories(categories.filter(c => c.id !== id))
    updateItems(items.filter(i => i.categoryId !== id))
    if (selectedCat === id) setSelectedCat(null)
  }

  const handleToggleItem = (id: string) => {
    updateItems(items.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i))
  }

  const handleDeleteItem = (id: string) => {
    updateItems(items.filter(i => i.id !== id))
  }

  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.price) return
    let catId = newItem.categoryId
    let currentCats = [...categories]
    if (!catId) {
      if (currentCats.length === 0) {
        const defCat: Category = {
          id: `cat-${Date.now()}`,
          restaurantId: 'rest-1',
          menuId: 'menu-1',
          name: 'Main Menu',
          sortOrder: 1,
          isActive: true,
        }
        currentCats.push(defCat)
        updateCategories(currentCats)
        catId = defCat.id
      } else {
        catId = currentCats[0].id
      }
    }
    const item: MenuItem = {
      id: `item-${Date.now()}`,
      restaurantId: 'rest-1',
      categoryId: catId,
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      price: parseFloat(newItem.price) || 0,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
      dietaryLabel: newItem.dietaryLabel,
      isAvailable: true,
      sortOrder: items.filter(i => i.categoryId === catId).length + 1,
    }
    updateItems([...items, item])
    setShowAddItem(false)
    setNewItem({ name: '', description: '', price: '', categoryId: catId, dietaryLabel: [] })
  }

  const handleSave = () => {
    updateMenu({ isPublished })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader title="Menu Editor" />

        <div className="dashboard-content">
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: 32, width: 220, height: 38 }}
                  placeholder="Search items..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  id="menu-search"
                />
              </div>
              <select className="form-input" style={{ height: 38, width: 160 }} value={selectedCat || ''} onChange={e => setSelectedCat(e.target.value || null)} id="cat-filter">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.25)',
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600,
              }}>
                <span>{currencyConfig.flag}</span>
                <span>{currencyConfig.code} ({currencyConfig.symbol})</span>
              </div>
              {/* Publish toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--dark-surface)', border: '1px solid var(--dark-border)', padding: '6px 14px', borderRadius: 'var(--radius-full)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Published</span>
                <label className="toggle" onClick={() => setIsPublished(!isPublished)}>
                  <input type="checkbox" checked={isPublished} readOnly />
                  <span className="toggle-slider" />
                </label>
                <span style={{ fontSize: '0.8rem', color: isPublished ? 'var(--success)' : 'var(--gray-500)', fontWeight: 600 }}>
                  {isPublished ? 'Live' : 'Off'}
                </span>
              </div>
              <button className={`btn ${saved ? 'btn-success' : 'btn-primary'} btn-sm`} onClick={handleSave} id="save-menu-btn">
                {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 'var(--space-6)' }}>
            {/* Categories Panel */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Categories</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setAddCatMode(true)} id="add-cat-btn" style={{ padding: '4px 10px' }}>
                  <Plus size={14} />
                </button>
              </div>

              {addCatMode && (
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <input
                    className="form-input"
                    style={{ flex: 1, height: 36 }}
                    placeholder="Category name"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    autoFocus
                    id="new-cat-input"
                    onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                  />
                  <button className="btn btn-success btn-sm" onClick={handleAddCategory} style={{ padding: '4px 10px' }}>
                    <Check size={14} />
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setAddCatMode(false)} style={{ padding: '4px 10px' }}>
                    <X size={14} />
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <div
                  className={`sidebar-item ${!selectedCat ? 'active' : ''}`}
                  onClick={() => setSelectedCat(null)}
                  style={{ cursor: 'pointer' }}
                >
                  All Items ({items.length})
                </div>
                {categories.map(cat => {
                  const count = items.filter(i => i.categoryId === cat.id).length
                  return (
                    <div
                      key={cat.id}
                      className={`sidebar-item ${selectedCat === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCat(cat.id)}
                      style={{ cursor: 'pointer', justifyContent: 'space-between' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <GripVertical size={14} style={{ color: 'var(--gray-600)' }} />
                        {cat.name}
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>{count}</span>
                      </span>
                      <button onClick={e => { e.stopPropagation(); handleDeleteCat(cat.id) }} style={{ background: 'none', border: 'none', color: 'var(--gray-600)', cursor: 'pointer', padding: 2, borderRadius: 4 }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-600)')}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Items Panel */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  {selectedCat ? categories.find(c => c.id === selectedCat)?.name : 'All Items'}
                  <span style={{ color: 'var(--gray-500)', fontWeight: 400, fontSize: '0.9rem', marginLeft: 8 }}>({filteredItems.length})</span>
                </h3>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddItem(true)} id="add-item-btn">
                  <Plus size={14} /> Add Item
                </button>
              </div>

              {/* Add Item Form */}
              {showAddItem && (
                <div className="card" style={{ marginBottom: 'var(--space-4)', border: '1px solid rgba(255,107,53,0.3)' }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>New Menu Item</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Item Name *</label>
                      <input className="form-input" placeholder="e.g. Paneer Tikka" value={newItem.name}
                        onChange={e => setNewItem({ ...newItem, name: e.target.value })} id="new-item-name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price ({currencyConfig.symbol}) *</label>
                      <input className="form-input" type="number" placeholder="250" value={newItem.price}
                        onChange={e => setNewItem({ ...newItem, price: e.target.value })} id="new-item-price" />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Description</label>
                      <input className="form-input" placeholder="Describe this dish..." value={newItem.description}
                        onChange={e => setNewItem({ ...newItem, description: e.target.value })} id="new-item-desc" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-input" value={newItem.categoryId}
                        onChange={e => setNewItem({ ...newItem, categoryId: e.target.value })} id="new-item-cat">
                        {categories.length === 0 && <option value="">Main Menu (Default)</option>}
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Dietary Labels</label>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                        {['veg', 'vegan', 'gluten-free', 'spicy'].map(tag => {
                          const active = newItem.dietaryLabel.includes(tag)
                          return (
                            <button key={tag} type="button"
                              className={`badge ${active ? 'badge-success' : ''}`}
                              style={{ cursor: 'pointer', border: active ? undefined : '1px solid var(--dark-border)', color: active ? undefined : 'var(--gray-500)' }}
                              onClick={() => setNewItem(p => ({
                                ...p,
                                dietaryLabel: active ? p.dietaryLabel.filter(d => d !== tag) : [...p.dietaryLabel, tag],
                              }))}>
                              {tag}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                    <button className="btn btn-primary btn-sm" onClick={handleAddItem} id="confirm-add-item">
                      <Check size={14} /> Add Item
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowAddItem(false)}>
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Items list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {filteredItems.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--gray-500)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>🍽️</div>
                    <p>No items yet. Add your first menu item!</p>
                  </div>
                )}
                {filteredItems.map(item => (
                  <div key={item.id} className="card" style={{
                    display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start',
                    opacity: item.isAvailable ? 1 : 0.6,
                    padding: 'var(--space-4)',
                  }}>
                    <GripVertical size={16} style={{ color: 'var(--gray-600)', marginTop: 4, flexShrink: 0, cursor: 'grab' }} />
                    <img src={item.image} alt={item.name} style={{
                      width: 72, height: 72, borderRadius: 'var(--radius-md)',
                      objectFit: 'cover', flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div>
                          <span style={{ fontWeight: 600, marginRight: 8 }}>{item.name}</span>
                          {item.dietaryLabel.map(d => (
                            <span key={d} className={`dietary-badge ${d}`} style={{ marginRight: 4 }}>{d}</span>
                          ))}
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', lineHeight: 1.4, marginBottom: 'var(--space-3)' }}>
                        {item.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Available</span>
                          <label className="toggle" onClick={() => handleToggleItem(item.id)}>
                            <input type="checkbox" checked={item.isAvailable} readOnly />
                            <span className="toggle-slider" />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: 6 }} title="Edit">
                        <Edit3 size={15} />
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: 6, color: 'var(--error)' }}
                        onClick={() => handleDeleteItem(item.id)} title="Delete" id={`del-${item.id}`}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
