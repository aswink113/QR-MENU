import { useState } from 'react'
import {
  CreditCard, Check, AlertCircle, Download, X, ChevronRight,
  Shield, RefreshCw, ArrowUpCircle,
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import { mockPlans, formatDate } from '../../data/mockData'
import { useRestaurantStore } from '../../data/restaurantStore'
import { useCurrency } from '../../data/currency'

export default function BillingPage() {
  const { formatPrice } = useCurrency()
  const { subscription, payments } = useRestaurantStore()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(subscription.planId)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly')

  const currentPlan = mockPlans.find(p => p.id === subscription.planId) || mockPlans[0]
  const statusColors: Record<string, string> = {
    succeeded: 'var(--success)',
    failed: 'var(--error)',
    pending: 'var(--warning)',
    refunded: 'var(--info)',
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader title="Billing & Subscription" />

        <div className="dashboard-content">
          {/* Current Subscription */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div className="card" style={{
              background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(123,47,190,0.08))',
              border: '1px solid rgba(255,107,53,0.25)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: 4 }}>Current Plan</div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>
                    {currentPlan?.name}
                  </h2>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <span className="badge badge-success">● Active</span>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                      via Razorpay · {subscription.gatewaySubscriptionId}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: 2 }}>Current period</div>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                        {formatDate(subscription.currentPeriodStart)} – {formatDate(subscription.currentPeriodEnd)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: 2 }}>Monthly cost</div>
                      <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>
                        {formatPrice(currentPlan?.price || 0)}<span style={{ fontSize: '0.875rem', color: 'var(--gray-400)', fontWeight: 400 }}>/mo</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 8 }}>⭐</div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Most Popular</span>
                </div>
              </div>

              <div className="divider" />

              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-sm" onClick={() => setShowUpgrade(true)} id="upgrade-btn">
                  <ArrowUpCircle size={14} /> Upgrade Plan
                </button>
                <button className="btn btn-secondary btn-sm" id="update-payment">
                  <CreditCard size={14} /> Update Payment
                </button>
                {!cancelConfirm ? (
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}
                    onClick={() => setCancelConfirm(true)} id="cancel-sub">
                    Cancel subscription
                  </button>
                ) : (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.3)',
                    borderRadius: 'var(--radius-md)', padding: '6px 12px',
                  }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--error)' }}>Confirm cancel?</span>
                    <button className="btn btn-danger btn-sm" style={{ padding: '3px 10px', fontSize: '0.8rem' }}
                      onClick={() => setCancelConfirm(false)} id="confirm-cancel">Yes</button>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '3px 10px', fontSize: '0.8rem' }}
                      onClick={() => setCancelConfirm(false)} id="abort-cancel">No</button>
                  </div>
                )}
              </div>
            </div>

            {/* Plan features */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Plan Features</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {currentPlan?.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--gray-300)' }}>
                    <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-3)', background: 'rgba(6,214,160,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6,214,160,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600 }}>
                  <Shield size={14} /> Secured by Razorpay
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade modal */}
          {showUpgrade && (
            <div className="modal-overlay" onClick={() => setShowUpgrade(false)}>
              <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
                <div className="modal-header">
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Change Plan</h2>
                  <button onClick={() => setShowUpgrade(false)} className="btn btn-ghost btn-sm" style={{ padding: 6 }}>
                    <X size={18} />
                  </button>
                </div>

                {/* Billing toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                  <span style={{ fontSize: '0.875rem', color: billingInterval === 'monthly' ? 'var(--dark-text)' : 'var(--gray-500)' }}>Monthly</span>
                  <label className="toggle" onClick={() => setBillingInterval(p => p === 'monthly' ? 'annual' : 'monthly')}>
                    <input type="checkbox" checked={billingInterval === 'annual'} readOnly />
                    <span className="toggle-slider" />
                  </label>
                  <span style={{ fontSize: '0.875rem', color: billingInterval === 'annual' ? 'var(--dark-text)' : 'var(--gray-500)' }}>
                    Annual <span style={{ color: 'var(--success)', fontSize: '0.75rem' }}>Save 17%</span>
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                  {mockPlans.map(plan => {
                    const isCurrentPlan = plan.id === subscription.planId
                    const price = billingInterval === 'annual' ? Math.round(plan.price * 10 / 12) : plan.price
                    return (
                      <div key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        style={{
                          border: selectedPlan === plan.id ? '2px solid var(--primary)' : '1px solid var(--dark-border)',
                          borderRadius: 'var(--radius-lg)',
                          padding: 'var(--space-4)',
                          cursor: 'pointer',
                          background: selectedPlan === plan.id ? 'rgba(255,107,53,0.06)' : 'var(--dark-surface-2)',
                          transition: 'all 0.2s', position: 'relative',
                        }}
                        id={`plan-option-${plan.code}`}
                      >
                        {isCurrentPlan && (
                          <span style={{
                            position: 'absolute', top: -10, left: 10,
                            background: 'var(--dark-border)', color: 'var(--gray-400)',
                            padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700,
                          }}>Current</span>
                        )}
                        <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 4 }}>{plan.name}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: selectedPlan === plan.id ? 'var(--primary)' : 'var(--dark-text)', marginBottom: 8 }}>
                          {formatPrice(price)}<span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 400 }}>/mo</span>
                        </div>
                        {plan.features.slice(0, 3).map(f => (
                          <div key={f} style={{ fontSize: '0.75rem', color: 'var(--gray-400)', display: 'flex', gap: 5, marginBottom: 3 }}>
                            <Check size={11} style={{ color: 'var(--success)', marginTop: 1, flexShrink: 0 }} />
                            {f}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={() => setShowUpgrade(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={() => setShowUpgrade(false)} id="confirm-upgrade">
                    Confirm Change <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment History */}
          <div className="table-container">
            <div className="table-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Payment History</h3>
              <button className="btn btn-secondary btn-sm" id="export-invoices">
                <Download size={14} /> Export CSV
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--gray-500)' }}>
                      No payment records found yet. Invoices will automatically appear here upon renewal.
                    </td>
                  </tr>
                ) : (
                  payments.map(pay => (
                    <tr key={pay.id}>
                      <td style={{ color: 'var(--gray-300)' }}>{formatDate(pay.paidAt)}</td>
                      <td style={{ fontWeight: 500 }}>QRMenu {currentPlan?.name} Plan</td>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>{formatPrice(pay.amount)}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '3px 10px', borderRadius: 'var(--radius-full)',
                          background: `${statusColors[pay.status]}20`,
                          color: statusColors[pay.status],
                          border: `1px solid ${statusColors[pay.status]}40`,
                          fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize',
                        }}>
                          {pay.status === 'succeeded' && <Check size={11} />}
                          {pay.status === 'failed' && <X size={11} />}
                          {pay.status}
                        </span>
                      </td>
                      <td>
                        {pay.status === 'succeeded' ? (
                          <button className="btn btn-ghost btn-sm" style={{ padding: '3px 10px', fontSize: '0.8rem' }} id={`receipt-${pay.id}`}>
                            <Download size={12} /> Receipt
                          </button>
                        ) : (
                          <span style={{ color: 'var(--gray-600)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Autopay notice */}
          <div style={{
            marginTop: 'var(--space-6)',
            background: 'rgba(76,201,240,0.08)',
            border: '1px solid rgba(76,201,240,0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start',
          }}>
            <Shield size={20} style={{ color: 'var(--info)', marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--info)' }}>Autopay Mandate Active</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>
                Your subscription renews automatically on <strong>Nov 1, 2026</strong> for{' '}
                <strong>{formatPrice(currentPlan?.price || 0)}</strong>. You authorized recurring payments via Razorpay.
                You can cancel anytime before the renewal date. Pre-debit notification will be sent 3 days before.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
