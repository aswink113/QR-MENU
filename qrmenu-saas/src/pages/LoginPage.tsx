import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, QrCode } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1200)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark-bg)',
      display: 'flex',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
        position: 'relative',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '20%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />

        <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Link to="/" className="navbar-logo" style={{ marginBottom: 'var(--space-10)', display: 'inline-flex', color: 'var(--dark-text)' }}>
            <div className="logo-icon">🍽️</div>
            <span>QRMenu</span>
          </Link>

          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Welcome back</h1>
          <p style={{ color: 'var(--gray-400)', marginBottom: 'var(--space-8)' }}>
            Sign in to manage your digital menus
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--gray-500)',
                }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="you@restaurant.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  id="login-email"
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <a href="#" style={{ fontSize: '0.8125rem', color: 'var(--primary)' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--gray-500)',
                }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  id="login-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--gray-500)',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 'var(--space-2)' }} id="login-submit" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'block' }} />
                  Signing in...
                </span>
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ position: 'relative', margin: 'var(--space-6) 0', textAlign: 'center' }}>
            <div style={{ height: 1, background: 'var(--dark-border)' }} />
            <span style={{
              position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--dark-bg)', padding: '0 12px',
              color: 'var(--gray-500)', fontSize: '0.8125rem',
            }}>Or continue with</span>
          </div>

          <button className="btn btn-secondary w-full" style={{ justifyContent: 'center' }} id="google-signin">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.9rem', color: 'var(--gray-500)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up free</Link>
          </p>

          {/* Demo hint */}
          <div style={{
            marginTop: 'var(--space-6)',
            background: 'rgba(255,107,53,0.08)',
            border: '1px solid rgba(255,107,53,0.2)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            fontSize: '0.8125rem',
            color: 'var(--gray-400)',
          }}>
            💡 <strong>Demo:</strong> Click "Sign in" with any email/password to explore the dashboard
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        width: '45%',
        background: 'var(--dark-surface)',
        borderLeft: '1px solid var(--dark-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div style={{ textAlign: 'center', maxWidth: 340, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 100, height: 100, background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            borderRadius: 'var(--radius-2xl)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto var(--space-8)',
            boxShadow: 'var(--shadow-glow)', animation: 'float 4s ease-in-out infinite',
          }}>
            <QrCode size={48} color="white" />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            Your menu, always <span className="text-gradient">up-to-date</span>
          </h2>
          <p style={{ color: 'var(--gray-400)', lineHeight: 1.7, marginBottom: 'var(--space-8)' }}>
            Update prices, add new dishes, or mark items as unavailable — changes go live instantly on your QR menu.
          </p>

          {[
            '✓ No printing costs ever',
            '✓ Real-time menu updates',
            '✓ Analytics & insights',
            '✓ Works on any smartphone',
          ].map(item => (
            <div key={item} style={{
              textAlign: 'left', padding: 'var(--space-3) 0',
              borderBottom: '1px solid var(--dark-border)',
              color: 'var(--gray-300)', fontSize: '0.9rem', fontWeight: 500,
            }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
