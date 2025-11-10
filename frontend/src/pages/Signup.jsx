import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup(){
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      await signup(form.name, form.email, form.password)
      navigate('/')
    }catch(err){
      setError(err?.response?.data?.message || 'Signup failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Create your account" subtitle="Join Chromafy to generate beautiful palettes">
      <form onSubmit={handleSubmit} style={{display:'grid', gap:12}}>
        <Input label="Name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
        <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required />
        {error && <div style={{color:'#fecaca', background:'#7f1d1d', padding:'8px 12px', borderRadius:10, border:'1px solid #ef4444'}}>{error}</div>}
        <button disabled={loading} style={primaryBtn()}>{loading ? 'Creating...' : 'Create account'}</button>
        <p style={{opacity:.8, fontSize:14}}>Already have an account? <Link to="/login" style={{textDecoration:'underline'}}>Log in</Link></p>
      </form>
    </AuthCard>
  )
}

function Input({ label, ...props }){
  return (
    <label style={{display:'grid', gap:6, fontSize:14}}>
      <span style={{opacity:.8}}>{label}</span>
      <input {...props} style={{padding:'12px 14px', borderRadius:12, border:'1px solid #334155', background:'#0b1220', color:'#e5e7eb', outline:'none'}} />
    </label>
  )
}

function AuthCard({ title, subtitle, children }){
  return (
    <div style={{display:'grid', placeItems:'center', minHeight:'calc(100vh - 120px)'}}>
      <div style={{width:440, maxWidth:'92vw', padding:24, borderRadius:20, border:'1px solid #1f2937', background:'linear-gradient(180deg,#0b1220cc,#0b1220aa)', boxShadow:'0 10px 30px #0006'}}>
        <h1 style={{margin:0, fontSize:28, fontWeight:800}}>✨ {title}</h1>
        <p style={{margin:'4px 0 16px', opacity:.75}}>{subtitle}</p>
        {children}
      </div>
    </div>
  )
}

function primaryBtn(){
  return { padding:'12px 14px', borderRadius:12, border:'none', fontWeight:700, background:'linear-gradient(180deg,#22d3ee,#0ea5e9)', color:'#0b1220' }
}
