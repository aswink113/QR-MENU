import React, { useState } from 'react'
import { Coins, ChevronDown, Check } from 'lucide-react'
import { useCurrency, CURRENCY_LIST } from '../data/currency'

interface CurrencySelectorProps {
  compact?: boolean;
  onSelect?: (code: string) => void;
  style?: React.CSSProperties;
}

export default function CurrencySelector({ compact = false, onSelect, style }: CurrencySelectorProps) {
  const { currency, currencyConfig, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)

  const handleChoose = (code: string) => {
    setCurrency(code)
    onSelect?.(code)
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn btn-outline btn-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: compact ? '4px 8px' : '6px 12px',
          fontSize: compact ? '0.75rem' : '0.85rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: 'var(--dark-text)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontWeight: 700,
        }}
      >
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{currencyConfig.flag}</span>
        <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{currencyConfig.symbol}</span>
        {!compact && <span>{currencyConfig.code}</span>}
        <ChevronDown size={12} style={{ opacity: 0.7, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 90 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              zIndex: 95,
              minWidth: 200,
              background: 'var(--dark-surface)',
              border: '1px solid var(--dark-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              overflow: 'hidden',
              padding: 6,
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{
              fontSize: '0.7rem',
              color: 'var(--gray-500)',
              padding: '6px 10px',
              textTransform: 'uppercase',
              fontWeight: 800,
              letterSpacing: '0.05em',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              Select Pricing Currency
            </div>

            <div style={{ maxHeight: 260, overflowY: 'auto' }}>
              {CURRENCY_LIST.map(curr => {
                const isSelected = curr.code === currency
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleChoose(curr.code)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      background: isSelected ? 'rgba(255,107,53,0.15)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      color: isSelected ? 'var(--primary)' : 'var(--dark-text)',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1.1rem' }}>{curr.flag}</span>
                      <span style={{ fontWeight: 700 }}>{curr.symbol}</span>
                      <span style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>{curr.code}</span>
                    </div>
                    {isSelected && <Check size={14} style={{ color: 'var(--primary)' }} />}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
