import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'

function NavBar() {
  const { user, logout } = useAuth()
  return (
    <div style={{position:'sticky',top:0,zIndex:10, backdropFilter:'blur(10px)', background:'linear-gradient(90deg, #111827aa, #0b1220aa)', borderBottom:'1px solid #1f2937'}}>
      <div style={{maxWidth:1100, margin:'0 auto', padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <Link to="/" style={{fontWeight:800, letterSpacing:0.5}}>🎨 Chromafy</Link>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          {user ? (<>
            <span style={{opacity:.8, fontSize:14}}>Hi, {user.name}</span>
            <button onClick={logout} style={btn('ghost')}>Logout</button>
          </>) : (<>
            <Link to="/login" style={btn('ghost')}>Login</Link>
            <Link to="/signup" style={btn('primary')}>Create account</Link>
          </>)}
        </div>
      </div>
    </div>
  )
}

function btn(variant='primary'){
  const base = { padding:'8px 14px', borderRadius:12, fontWeight:600, border:'1px solid #374151', display:'inline-flex' }
  if(variant==='primary') return {...base, background:'linear-gradient(180deg,#22d3ee,#0ea5e9)', color:'#0b1220', border:'none'}
  if(variant==='ghost') return {...base, background:'#0b1220', color:'#e5e7eb'}
  return base
}

export default function App(){
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <footer style={{textAlign:'center', opacity:.6, fontSize:12, padding:'18px'}}>© {new Date().getFullYear()} Chromafy</footer>
    </div>
  )
}
