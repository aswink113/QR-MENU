import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'

const benefits = [
  'Free 14-day trial, no credit card',
  'Beautiful QR menus in minutes',
  'Real-time menu updates',
  'Analytics dashboard included',
  'Cancel anytime',
]

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', restaurantName: '', password: '', confirm: ''
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const updateForm = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1500)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark-bg)', display: 'flex' }}>
      {/* Left panel */}
      <div style={{
        width: '42%',
        background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(123,47,190,0.08))',
        borderRight: '1px solid var(--dark-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: '10%', left: '-5%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 360 }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-5)', animation: 'float 4s ease-in-out infinite' }}>🍽️</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            Join <span className="text-gradient">5,000+</span> restaurants
          </h2>
          <p style={{ color: 'var(--gray-400)', lineHeight: 1.7, marginBottom: 'var(--space-8)' }}>
            Start your free trial today. No credit card required. Set up your digital menu in under 30 minutes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {benefits.map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(6,214,160,0.15)', border: '1px solid rgba(6,214,160,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check size={14} style={{ color: 'var(--success)' }} />
                </div>
                <span style={{ color: 'var(--gray-300)', fontSize: '0.9375rem' }}>{b}</span>
              </div>
            ))}
          </div>

          {/* Testimonial snippet */}
          <div style={{
            marginTop: 'var(--space-10)',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
          }}>
            <p style={{ color: 'var(--gray-300)', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
              "We set up our menu in 20 minutes. Customers love it!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>PP</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Priya Patel</div>
                <div style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>Café Aroma, Mumbai</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Link to="/" className="navbar-logo" style={{ marginBottom: 'var(--space-8)', display: 'inline-flex', color: 'var(--dark-text)' }}>
            <div className="logo-icon">🍽️</div>
            <span>QRMenu</span>
          </Link>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step >= s ? 'var(--primary)' : 'var(--dark-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, color: step >= s ? 'white' : 'var(--gray-500)',
                  transition: 'all 0.3s ease',
                }}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                <span style={{ fontSize: '0.8125rem', color: step >= s ? 'var(--dark-text)' : 'var(--gray-600)' }}>
                  {s === 1 ? 'Account' : 'Restaurant'}
                </span>
                {s < 2 && <div style={{ width: 40, height: 1, background: step > s ? 'var(--primary)' : 'var(--dark-border)' }} />}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Create your account</h1>
              <p style={{ color: 'var(--gray-400)', marginBottom: 'var(--space-6)' }}>Start your 14-day free trial</p>

              <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                    <input type="text" className="form-input" style={{ paddingLeft: 42 }} placeholder="Rahul Sharma"
                      value={form.name} onChange={e => updateForm('name', e.target.value)} required id="reg-name" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                    <input type="email" className="form-input" style={{ paddingLeft: 42 }} placeholder="you@restaurant.com"
                      value={form.email} onChange={e => updateForm('email', e.target.value)} required id="reg-email" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                    <input type="tel" className="form-input" style={{ paddingLeft: 42 }} placeholder="+91 98765 43210"
                      value={form.phone} onChange={e => updateForm('phone', e.target.value)} id="reg-phone" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                    <input type={showPass ? 'text' : 'password'} className="form-input" style={{ paddingLeft: 42, paddingRight: 42 }}
                      placeholder="At least 8 characters" value={form.password} onChange={e => updateForm('password', e.target.value)} required id="reg-password" />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 'var(--space-2)' }} id="reg-next">
                  Continue <ArrowRight size={16} />
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Your restaurant</h1>
              <p style={{ color: 'var(--gray-400)', marginBottom: 'var(--space-6)' }}>Tell us about your food business</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Restaurant name</label>
                  <input type="text" className="form-input" placeholder="The Spice Garden"
                    value={form.restaurantName} onChange={e => updateForm('restaurantName', e.target.value)} required id="reg-restaurant" />
                </div>

                <div className="form-group">
                  <label className="form-label">Type of cuisine</label>
                  <select className="form-input" id="reg-cuisine">
                    <option>North Indian</option>
                    <option>South Indian</option>
                    <option>Chinese</option>
                    <option>Italian</option>
                    <option>Fast Food</option>
                    <option>Café & Bakery</option>
                    <option>Multi-cuisine</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" className="form-input" placeholder="Bengaluru" id="reg-city" />
                </div>

                <div style={{ background: 'rgba(255,209,102,0.08)', border: '1px solid rgba(255,209,102,0.2)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--gray-300)' }}>
                  🎁 You'll get a <strong>14-day free trial</strong> of our Growth plan. No payment needed.
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} id="reg-submit" disabled={loading}>
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'block' }} />
                        Creating account...
                      </span>
                    ) : (
                      <>Create account <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textAlign: 'center' }}>
                  By creating an account, you agree to our{' '}
                  <a href="#" style={{ color: 'var(--primary)' }}>Terms of Service</a> and{' '}
                  <a href="#" style={{ color: 'var(--primary)' }}>Privacy Policy</a>
                </p>
              </form>
            </>
          )}

          <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.9rem', color: 'var(--gray-500)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
