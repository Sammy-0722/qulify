import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin, registerAdmin } from '../services/api'
import './Login.css'

const Login = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        await registerAdmin(email, password)
        setSuccess('Admin registered! You can now login.')
        setIsRegister(false)  // switch back to login after register
      } else {
        await adminLogin(email, password)
        navigate('/admin')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-body">
      <div className="login-card">
        <div className="login-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Qulify" style={{ height: '32px', width: 'auto' }} />
          Quli<span>fy</span>
        </div>
        <div className="login-sub">Queue Management System</div>
        <div className="login-badge">{isRegister ? 'Create Admin' : 'Admin Portal'}</div>

        <form onSubmit={handleSubmit}>
          <label className="login-label">Email</label>
          <input
            className="login-input"
            type="email"
            placeholder="admin@qulify.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">{success}</p>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register →' : 'Sign In →'}
          </button>
        </form>

        <hr className="login-divider" />

        <p className="login-toggle">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess('') }}>
            {isRegister ? ' Sign In' : ' Register'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login