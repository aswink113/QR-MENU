import { useState, useEffect } from 'react'

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rateFromINR: number; // approximate conversion for preview when toggling
  format: (amount: number) => string;
}

export const CURRENCY_MAP: Record<string, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee (INR)',
    flag: '🇮🇳',
    rateFromINR: 1,
    format: (amt: number) => `₹${Math.round(amt).toLocaleString('en-IN')}`,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar (USD)',
    flag: '🇺🇸',
    rateFromINR: 0.012,
    format: (amt: number) => `$${amt.toFixed(2)}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EUR)',
    flag: '🇪🇺',
    rateFromINR: 0.011,
    format: (amt: number) => `€${amt.toFixed(2)}`,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound (GBP)',
    flag: '🇬🇧',
    rateFromINR: 0.0095,
    format: (amt: number) => `£${amt.toFixed(2)}`,
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham (AED)',
    flag: '🇦🇪',
    rateFromINR: 0.044,
    format: (amt: number) => `${amt.toFixed(2)} د.إ`,
  },
  SAR: {
    code: 'SAR',
    symbol: '﷼',
    name: 'Saudi Riyal (SAR)',
    flag: '🇸🇦',
    rateFromINR: 0.045,
    format: (amt: number) => `${amt.toFixed(2)} ﷼`,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar (CAD)',
    flag: '🇨🇦',
    rateFromINR: 0.016,
    format: (amt: number) => `CA$${amt.toFixed(2)}`,
  },
  AUD: {
    code: 'AUD',
    symbol: 'AU$',
    name: 'Australian Dollar (AUD)',
    flag: '🇦🇺',
    rateFromINR: 0.018,
    format: (amt: number) => `AU$${amt.toFixed(2)}`,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen (JPY)',
    flag: '🇯🇵',
    rateFromINR: 1.85,
    format: (amt: number) => `¥${Math.round(amt).toLocaleString()}`,
  },
}

export const CURRENCY_LIST = Object.values(CURRENCY_MAP)

export function getStoredCurrency(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem('qrmenu_currency') || 'INR'
  }
  return 'INR'
}

export function setStoredCurrency(code: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('qrmenu_currency', code)
    window.dispatchEvent(new CustomEvent('qrmenu_currency_changed', { detail: code }))
  }
}

export function formatPriceWithCurrency(amount: number, currencyCode?: string): string {
  const code = currencyCode || getStoredCurrency()
  const config = CURRENCY_MAP[code] || CURRENCY_MAP.INR
  return config.format(amount)
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState<string>(getStoredCurrency())

  useEffect(() => {
    const handleStorage = (e: CustomEvent | StorageEvent) => {
      const newCurr = getStoredCurrency()
      setCurrencyState(newCurr)
    }

    window.addEventListener('qrmenu_currency_changed' as any, handleStorage)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('qrmenu_currency_changed' as any, handleStorage)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const setCurrency = (code: string) => {
    setStoredCurrency(code)
    setCurrencyState(code)
  }

  const activeConfig = CURRENCY_MAP[currency] || CURRENCY_MAP.INR

  const formatPrice = (amount: number, customCode?: string) => {
    const targetCode = customCode || currency
    const cfg = CURRENCY_MAP[targetCode] || CURRENCY_MAP.INR
    return cfg.format(amount)
  }

  return {
    currency,
    currencyConfig: activeConfig,
    setCurrency,
    formatPrice,
    currencyList: CURRENCY_LIST,
  }
}
