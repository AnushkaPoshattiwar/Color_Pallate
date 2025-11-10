import { useEffect, useMemo, useState } from 'react'

const modes = ['Random','Monochrome','Analogous','Complementary','Triadic','Tetradic']

export default function Home(){
  const [base, setBase] = useState('#7c3aed')
  const [count, setCount] = useState(5)
  const [mode, setMode] = useState('Random')
  const [palettes, setPalettes] = useState(() => {
    const s = localStorage.getItem('palettes')
    return s ? JSON.parse(s) : []
  })

  const colors = useMemo(() => generatePalette(base, mode, count), [base, mode, count])

  useEffect(() => {
    const handle = (e) => {
      if(e.key === 'r') setBase(randomHex())
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])

  const savePalette = () => {
    const item = { id: Date.now(), name: humanName(), mode, colors }
    const next = [item, ...palettes].slice(0, 12)
    setPalettes(next)
    localStorage.setItem('palettes', JSON.stringify(next))
  }

  const deletePalette = (id) => {
    const next = palettes.filter(p => p.id !== id)
    setPalettes(next)
    localStorage.setItem('palettes', JSON.stringify(next))
  }

  return (
    <div style={{maxWidth:1100, margin:'24px auto', padding:'0 18px'}}>
      <Hero />
      <Controls base={base} setBase={setBase} count={count} setCount={setCount} mode={mode} setMode={setMode} onSave={savePalette} />
      <PaletteGrid colors={colors} />
      <SavedPalettes list={palettes} onDelete={deletePalette} />
      <Hints />
    </div>
  )
}

function Hero(){
  return (
    <div style={{display:'grid', gap:8, marginBottom:16}}>
      <h1 style={{margin:0, fontSize:36, fontWeight:800}}>🎨 Chromafy — Color Palette Generator</h1>
      <p style={{margin:0, opacity:.75}}>Generate beautiful color schemes with one click. Copy hex, check contrast, and save your favorites.</p>
    </div>
  )
}

function Controls({ base, setBase, count, setCount, mode, setMode, onSave }){
  return (
    <div style={{display:'flex', flexWrap:'wrap', gap:12, alignItems:'center', background:'linear-gradient(180deg,#0b1220dd,#0b1220aa)', border:'1px solid #223049', padding:16, borderRadius:16}}>
      <label style={lab()}>
        <span>Base</span>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <input type="color" value={base} onChange={e=>setBase(e.target.value)} style={{width:44,height:34,border:'none',background:'transparent'}}/>
          <input value={base} onChange={e=>setBase(normalizeHex(e.target.value))} style={input()}/>
          <button onClick={()=>setBase(randomHex())} style={btn()}>Random</button>
        </div>
      </label>

      <label style={lab()}>
        <span>Mode</span>
        <select value={mode} onChange={e=>setMode(e.target.value)} style={{...input(), background:'#0b1220'}}>
          {modes.map(m => <option key={m}>{m}</option>)}
        </select>
      </label>

      <label style={lab()}>
        <span>Colors</span>
        <input type="range" min="3" max="8" value={count} onChange={e=>setCount(+e.target.value)} />
      </label>

      <div style={{marginLeft:'auto', display:'flex', gap:10}}>
        <button onClick={onSave} style={btn('primary')}>Save palette</button>
      </div>
    </div>
  )
}

function PaletteGrid({ colors }){
  return (
    <div style={{display:'grid', gridTemplateColumns:`repeat(${colors.length},1fr)`, gap:12, marginTop:16}}>
      {colors.map((hex, idx) => <Swatch key={idx} hex={hex} />)}
    </div>
  )
}

function Swatch({ hex }){
  const [copied, setCopied] = useState(false)
  const text = getReadableText(hex)
  const ratio = contrastRatio(hex, text === '#000000' ? '#000000' : '#ffffff').toFixed(2)
  const aa = +ratio >= 4.5 ? 'AA' : (+ratio >= 3 ? 'AA Large' : 'Fail')

  const copy = async () => {
    await navigator.clipboard.writeText(hex.toUpperCase())
    setCopied(true)
    setTimeout(()=>setCopied(false), 1200)
  }

  return (
    <div style={{background:hex, borderRadius:16, overflow:'hidden', border:'1px solid #1f2937', display:'grid', gridTemplateRows:'1fr auto', height:160}}>
      <div />
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', background:'#0005', color:text}}>
        <div style={{display:'grid', gap:2}}>
          <strong>{hex.toUpperCase()}</strong>
          <span style={{opacity:.9, fontSize:12}}>Contrast: {ratio} · {aa}</span>
        </div>
        <button onClick={copy} style={{padding:'8px 10px', borderRadius:10, border:'none', background:'#0008', color:text}}>{copied ? 'Copied!' : 'Copy'}</button>
      </div>
    </div>
  )
}

function SavedPalettes({ list, onDelete }){
  if (!list.length) return null
  return (
    <div style={{marginTop:28}}>
      <h3 style={{margin:'8px 0 12px'}}>⭐ Saved palettes</h3>
      <div style={{display:'grid', gap:12}}>
        {list.map(p => (
          <div key={p.id} style={{display:'grid', gap:8, border:'1px solid #223049', padding:12, borderRadius:12, background:'#0b1220aa'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <strong>{p.name}</strong> <span style={{opacity:.7}}>· {p.mode}</span>
              </div>
              <button onClick={()=>onDelete(p.id)} style={{padding:'6px 10px', borderRadius:8, border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb'}}>Delete</button>
            </div>
            <div style={{display:'grid', gridTemplateColumns:`repeat(${p.colors.length}, 1fr)`, gap:8}}>
              {p.colors.map((c,i)=>(<div key={i} style={{height:40, borderRadius:8, border:'1px solid #1f2937', background:c}}/>))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Hints(){
  return (
    <p style={{opacity:.7, fontSize:13, marginTop:18}}>Tip: Press <kbd style={kbd()}>R</kbd> to randomize base color. Click "Copy" to copy hex. Palettes are saved locally.</p>
  )
}

function kbd(){ return { background:'#0b1220', border:'1px solid #223049', borderRadius:6, padding:'2px 6px', fontFamily:'monospace' } }

function lab(){ return { display:'grid', gap:6, fontSize:14 } }
function input(){ return { padding:'10px 12px', borderRadius:12, border:'1px solid #334155', background:'#0b1220', color:'#e5e7eb', outline:'none' } }
function btn(variant){ 
  if(variant==='primary') return { padding:'10px 14px', borderRadius:12, border:'none', fontWeight:700, background:'linear-gradient(180deg,#34d399,#10b981)', color:'#06221b' }
  return { padding:'10px 14px', borderRadius:12, border:'1px solid #334155', background:'#0b1220', color:'#e5e7eb' }
}

// --------- Color utils ---------
function normalizeHex(v){
  v = v.trim().replace(/^#?/, '#')
  if(/^#[0-9a-fA-F]{6}$/.test(v)) return v.toLowerCase()
  return '#'+v.replace('#','').slice(0,6).padEnd(6,'0').toLowerCase()
}

function randomHex(){
  const n = Math.floor(Math.random()*0xffffff)
  return '#' + n.toString(16).padStart(6,'0')
}

function hexToRgb(hex){
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : {r:0,g:0,b:0}
}

function rgbToHex({r,g,b}){
  return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('')
}

function clamp(v, min=0, max=255){ return Math.max(min, Math.min(max, v)) }

function rotateHue(hex, deg){
  // convert to HSL, rotate hue, convert back
  let { r, g, b } = hexToRgb(hex)
  r/=255; g/=255; b/=255
  const max = Math.max(r,g,b), min = Math.min(r,g,b)
  let h, s, l = (max+min)/2
  if(max===min){ h = s = 0 }
  else{
    const d = max-min
    s = l>0.5 ? d/(2-max-min) : d/(max+min)
    switch(max){
      case r: h = (g-b)/d + (g<b ? 6 : 0); break;
      case g: h = (b-r)/d + 2; break;
      case b: h = (r-g)/d + 4; break;
    }
    h/=6
  }
  h = (h*360 + deg) % 360; if(h<0) h+=360
  // hsl->rgb
  const c = (1 - Math.abs(2*l-1)) * s
  const x = c * (1 - Math.abs((h/60)%2 - 1))
  const m = l - c/2
  let r1=0,g1=0,b1=0
  if(h<60){ r1=c; g1=x; b1=0 }
  else if(h<120){ r1=x; g1=c; b1=0 }
  else if(h<180){ r1=0; g1=c; b1=x }
  else if(h<240){ r1=0; g1=x; b1=c }
  else if(h<300){ r1=x; g1=0; b1=c }
  else { r1=c; g1=0; b1=x }
  return rgbToHex({ r: Math.round((r1+m)*255), g: Math.round((g1+m)*255), b: Math.round((b1+m)*255) })
}

function lighten(hex, amount){ // amount 0..1
  const {r,g,b} = hexToRgb(hex)
  return rgbToHex({ r: clamp(r + 255*amount), g: clamp(g + 255*amount), b: clamp(b + 255*amount) })
}

function darken(hex, amount){
  const {r,g,b} = hexToRgb(hex)
  return rgbToHex({ r: clamp(r - 255*amount), g: clamp(g - 255*amount), b: clamp(b - 255*amount) })
}

function generatePalette(base, mode, count){
  const arr = []
  if (mode === 'Random'){
    for(let i=0;i<count;i++) arr.push(randomHex())
    return arr
  }
  if (mode === 'Monochrome'){
    const steps = count
    for(let i=0;i<steps;i++){
      const t = i/(steps-1)
      arr.push(i%2===0 ? lighten(base, t*0.35) : darken(base, t*0.25))
    }
    return uniqueTrim(arr, count)
  }
  if (mode === 'Analogous'){
    const delta = 20
    const start = -Math.floor(count/2)*delta
    for(let i=0;i<count;i++) arr.push(rotateHue(base, start + i*delta))
    return arr
  }
  if (mode === 'Complementary'){
    const comp = rotateHue(base, 180)
    const half = Math.ceil(count/2)
    const monoA = generatePalette(base,'Monochrome',half)
    const monoB = generatePalette(comp,'Monochrome',count-half)
    return [...monoA, ...monoB]
  }
  if (mode === 'Triadic'){
    const a = rotateHue(base, 0)
    const b = rotateHue(base, 120)
    const c = rotateHue(base, 240)
    const seeds = [a,b,c]
    while(arr.length < count){
      const s = seeds[arr.length % seeds.length]
      arr.push(generatePalette(s,'Monochrome',2)[0])
    }
    return arr.slice(0,count)
  }
  if (mode === 'Tetradic'){
    const seeds = [0,90,180,270].map(d => rotateHue(base, d))
    while(arr.length < count){
      const s = seeds[arr.length % seeds.length]
      arr.push(generatePalette(s,'Monochrome',2)[0])
    }
    return arr.slice(0,count)
  }
  return Array(count).fill(base)
}

function uniqueTrim(arr, n){
  const seen = new Set()
  const out = []
  for(const x of arr){
    const y = x.toLowerCase()
    if(!seen.has(y)){ out.push(x); seen.add(y) }
    if(out.length===n) break
  }
  while(out.length<n) out.push(randomHex())
  return out
}

function luminance(hex){
  const {r,g,b} = hexToRgb(hex)
  const a = [r,g,b].map(v => {
    v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4)
  })
  return 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2]
}

function contrastRatio(h1, h2){
  const L1 = luminance(h1) + 0.05
  const L2 = luminance(h2) + 0.05
  return L1>L2 ? (L1/L2) : (L2/L1)
}

function getReadableText(bg){
  return luminance(bg) > 0.35 ? '#000000' : '#ffffff'
}

function humanName(){
  const adj = ['Vivid','Calm','Moody','Fresh','Neon','Warm','Ocean','Aurora','Sunset','Misty','Retro','Jazzy']
  const noun = ['Dream','Blend','Harmony','Storm','Sand','Forest','Candy','Glow','Pop','Twilight','Spectrum','Pulse']
  return adj[Math.floor(Math.random()*adj.length)] + ' ' + noun[Math.floor(Math.random()*noun.length)]
}
