import { useState } from 'react'
import {
  Download, Link, QrCode as QrIcon, RefreshCw, Smartphone,
  Globe, Copy, Check, Share2,
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import { useRestaurantStore } from '../../data/restaurantStore'

// Simple QR pattern visualizer (fake but visually convincing)
function FakeQRCode({ url, size = 200, primaryColor = '#000' }: { url: string; size?: number; primaryColor?: string }) {
  const cells = 25
  // Deterministic seed from url
  const hash = url.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${cells} ${cells}`} style={{ display: 'block' }}>
      <rect width={cells} height={cells} fill="white" />
      {Array.from({ length: cells * cells }).map((_, idx) => {
        const row = Math.floor(idx / cells)
        const col = idx % cells
        // Corner finder patterns
        const inTopLeft = (row < 8 && col < 8)
        const inTopRight = (row < 8 && col >= cells - 8)
        const inBottomLeft = (row >= cells - 8 && col < 8)
        const isFinderBorder = (
          (inTopLeft && (row === 0 || row === 6 || col === 0 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4))) ||
          (inTopRight && (row === 0 || row === 6 || col === cells - 1 || col === cells - 7 || (row >= 2 && row <= 4 && col >= cells - 5 && col <= cells - 3))) ||
          (inBottomLeft && (row === cells - 1 || row === cells - 7 || col === 0 || col === 6 || (row >= cells - 5 && row <= cells - 3 && col >= 2 && col <= 4)))
        )
        // Data area
        const isData = !inTopLeft && !inTopRight && !inBottomLeft && !isFinderBorder
        const isDark = isFinderBorder || (isData && ((idx * 7 + hash * 13 + row * 3 + col * 5) % 3 !== 0))
        
        return isDark ? (
          <rect key={idx} x={col} y={row} width={1} height={1} fill={isData ? primaryColor : '#000'} />
        ) : null
      })}
    </svg>
  )
}

const qrFormats = [
  { id: 'png', label: 'PNG Image', desc: 'For digital use', icon: '🖼️' },
  { id: 'svg', label: 'SVG Vector', desc: 'For print, scalable', icon: '📐' },
  { id: 'pdf', label: 'PDF', desc: 'Print-ready file', icon: '📄' },
]

export default function QRCodePage() {
  const { restaurant } = useRestaurantStore()
  const [copied, setCopied] = useState(false)
  const [qrColor, setQrColor] = useState('#FF6B35')
  const [qrBg, setQrBg] = useState('#FFFFFF')
  const [selectedFormat, setSelectedFormat] = useState('png')
  const [qrSize, setQrSize] = useState(300)
  const [showLogo, setShowLogo] = useState(true)

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qrmenu.app'
  const menuUrl = `${origin}/menu/${restaurant.slug}`

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    // In real app, this would generate actual QR file
    alert(`Downloading QR code as ${selectedFormat.toUpperCase()}...`)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader title="QR Code" />

        <div className="dashboard-content">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
            {/* QR Preview */}
            <div>
              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Your QR Code</h3>

                {/* QR display */}
                <div style={{
                  display: 'inline-block',
                  background: qrBg,
                  padding: 24,
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)',
                  position: 'relative',
                }}>
                  <FakeQRCode url={menuUrl} size={qrSize > 300 ? 240 : 180} primaryColor={qrColor} />
                  {showLogo && (
                    <div style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 40, height: 40,
                      background: qrColor,
                      borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `3px solid ${qrBg}`,
                      fontSize: '1.25rem',
                    }}>
                      🍽️
                    </div>
                  )}
                </div>

                <p style={{ color: 'var(--gray-500)', fontSize: '0.8125rem', marginTop: 'var(--space-4)', fontFamily: 'monospace' }}>
                  {menuUrl}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={handleDownload} id="download-qr">
                    <Download size={16} /> Download {selectedFormat.toUpperCase()}
                  </button>
                  <button className="btn btn-secondary" onClick={handleCopy} id="copy-link">
                    {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Link</>}
                  </button>
                  <button className="btn btn-ghost" id="share-qr">
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>

              {/* URL Display */}
              <div className="card" style={{ marginTop: 'var(--space-4)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-3)', fontFamily: 'var(--font-display)' }}>Your Menu URL</h4>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <input
                    readOnly
                    value={menuUrl}
                    className="form-input"
                    style={{ flex: 1, fontSize: '0.875rem', background: 'var(--dark-bg)' }}
                    id="menu-url"
                  />
                  <button className="btn btn-primary btn-sm" onClick={handleCopy} id="copy-url-btn">
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--success)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s infinite', display: 'block' }} />
                    Menu is live
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                    <Globe size={14} /> Permanent URL — never changes
                  </div>
                </div>
              </div>
            </div>

            {/* Settings panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

              {/* Format selector */}
              <div className="card">
                <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-4)', fontFamily: 'var(--font-display)' }}>Download Format</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {qrFormats.map(f => (
                    <div key={f.id}
                      onClick={() => setSelectedFormat(f.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        border: selectedFormat === f.id ? '2px solid var(--primary)' : '1px solid var(--dark-border)',
                        background: selectedFormat === f.id ? 'rgba(255,107,53,0.08)' : 'var(--dark-surface-2)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      id={`format-${f.id}`}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{f.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{f.desc}</div>
                      </div>
                      {selectedFormat === f.id && <Check size={16} style={{ color: 'var(--primary)' }} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Color customization */}
              <div className="card">
                <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-4)', fontFamily: 'var(--font-display)' }}>Style</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ margin: 0 }}>QR Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontFamily: 'monospace' }}>{qrColor}</span>
                      <input type="color" value={qrColor} onChange={e => setQrColor(e.target.value)}
                        style={{ width: 40, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', padding: 0 }} id="qr-color" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ margin: 0 }}>Background</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontFamily: 'monospace' }}>{qrBg}</span>
                      <input type="color" value={qrBg} onChange={e => setQrBg(e.target.value)}
                        style={{ width: 40, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', padding: 0 }} id="qr-bg" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ margin: 0 }}>Size (px)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="range" min={200} max={500} step={50} value={qrSize} onChange={e => setQrSize(+e.target.value)}
                        style={{ width: 100 }} id="qr-size" />
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', minWidth: 40 }}>{qrSize}px</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ margin: 0 }}>Logo in center</label>
                    <label className="toggle" onClick={() => setShowLogo(!showLogo)}>
                      <input type="checkbox" checked={showLogo} readOnly />
                      <span className="toggle-slider" />
                    </label>
                  </div>

                  {/* Presets */}
                  <div>
                    <label className="form-label" style={{ marginBottom: 8 }}>Color Presets</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {[
                        { fg: '#FF6B35', bg: '#FFFFFF' },
                        { fg: '#1A1A2E', bg: '#FFFFFF' },
                        { fg: '#06D6A0', bg: '#FFFFFF' },
                        { fg: '#7B2FBE', bg: '#FFFFFF' },
                        { fg: '#FFD166', bg: '#1A1A1A' },
                        { fg: '#EF233C', bg: '#FFFFFF' },
                      ].map(p => (
                        <div key={p.fg}
                          onClick={() => { setQrColor(p.fg); setQrBg(p.bg) }}
                          style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: p.fg, cursor: 'pointer',
                            border: qrColor === p.fg ? '3px solid white' : '2px solid rgba(255,255,255,0.1)',
                            transition: 'transform 0.2s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scan stats */}
              <div className="card">
                <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-4)', fontFamily: 'var(--font-display)' }}>QR Scan Stats</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  {[
                    { label: 'Total Scans', value: '1,842' },
                    { label: 'This Week', value: '143' },
                    { label: 'Mobile', value: '78%' },
                    { label: 'Avg / day', value: '61' },
                  ].map(s => (
                    <div key={s.label} style={{
                      background: 'var(--dark-surface-2)',
                      borderRadius: 'var(--radius-md)', padding: 'var(--space-4)',
                      border: '1px solid var(--dark-border)',
                    }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>{s.value}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* How to use */}
          <div className="card" style={{ marginTop: 'var(--space-6)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>How to use your QR code</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)' }}>
              {[
                { emoji: '⬇️', title: 'Download', desc: 'Download your QR code in PNG, SVG or PDF format' },
                { emoji: '🖨️', title: 'Print', desc: 'Print on table cards, posters, receipts or stickers' },
                { emoji: '📲', title: 'Scan', desc: 'Customers scan with any smartphone camera app' },
                { emoji: '🔄', title: 'Update anytime', desc: 'Menu changes go live instantly — no new QR needed!' },
              ].map(step => (
                <div key={step.title} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{step.emoji}</div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>{step.title}</div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
