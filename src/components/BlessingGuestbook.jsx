import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import sql from '../database'

function Clouds({ opacity = 0.1 }) {
  return (
    <>
      <svg className="absolute left-10 top-10" width="120" height="60" style={{opacity}}><ellipse cx="60" cy="30" rx="60" ry="30" fill="#FFF8F5" /></svg>
      <svg className="absolute right-20 top-24" width="100" height="50" style={{opacity}}><ellipse cx="50" cy="25" rx="50" ry="25" fill="#FFF8F5" /></svg>
      <svg className="absolute left-1/3 bottom-10" width="140" height="70" style={{opacity}}><ellipse cx="70" cy="35" rx="70" ry="35" fill="#FFF8F5" /></svg>
    </>
  )
}

function Mailbox() {
  return (
    <motion.div
      className="relative mx-auto mt-8 mb-12"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ width: 120, height: 180 }}
    >
      {/* 邮筒主体 */}
      <svg width="120" height="180" viewBox="0 0 120 180">
        <ellipse cx="60" cy="30" rx="50" ry="20" fill="#b87333" />
        <rect x="10" y="30" width="100" height="120" rx="20" fill="#b87333" />
        <ellipse cx="60" cy="150" rx="50" ry="20" fill="#a05a2c" />
        <rect x="35" y="60" width="50" height="20" rx="6" fill="#fff" />
        <rect x="45" y="65" width="30" height="10" rx="3" fill="#b87333" />
      </svg>
      {/* 邮筒口动画信封 */}
      <motion.div
        className="absolute left-1/2 top-16"
        style={{ transform: 'translate(-50%,0)' }}
        animate={{ y: [0, -30, 0], opacity: [1, 0.7, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <svg width="40" height="28" viewBox="0 0 40 28">
          <rect x="2" y="4" width="36" height="20" rx="4" fill="#fff" stroke="#b87333" strokeWidth="2" />
          <polyline points="2,4 20,18 38,4" fill="none" stroke="#b87333" strokeWidth="2" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

function Envelope({ b, onClick }) {
  return (
    <motion.div
      className="relative cursor-pointer group"
      whileHover={{ scale: 1.12, zIndex: 10 }}
      onClick={onClick}
      style={{ width: 60, height: 42 }}
    >
      <svg width="60" height="42" viewBox="0 0 60 42">
        <rect x="2" y="6" width="56" height="30" rx="7" fill="#fff" stroke="#b87333" strokeWidth="2" />
        <polyline points="2,6 30,30 58,6" fill="none" stroke="#b87333" strokeWidth="2" />
      </svg>
      {/* 头像+预览 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#BFC9FF] border-2 border-white flex items-center justify-center overflow-hidden shadow">
        {b.avatar_url ? <img src={b.avatar_url} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-lg text-white">{b.name?.[0]||'匿'}</span>}
      </div>
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 text-xs text-[#b87333] bg-white/80 px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition">
        {b.message.slice(0, 8)}{b.message.length>8?'...':''}
      </div>
    </motion.div>
  )
}

// 流星雨组件
function MeteorShower({ blessings }) {
  const [meteors, setMeteors] = useState([])
  useEffect(() => {
    // 生成流星
    const arr = Array.from({ length: 8 }).map((_, i) => ({
      left: 5 + Math.random() * 90,
      delay: 0.2 + i * 0.3,
      text: blessings[i % blessings.length]?.message?.slice(0, 10) || '',
    }))
    setMeteors(arr)
    // 3秒后自动消失
    const t = setTimeout(() => setMeteors([]), 3200)
    return () => clearTimeout(t)
  }, [blessings])
  if (!meteors.length) return null
  return (
    <div className="pointer-events-none fixed left-0 top-0 w-full h-40 z-50">
      {meteors.map((m, i) => (
        <motion.div
          key={i}
          initial={{ x: `${m.left}vw`, y: -40, opacity: 0 }}
          animate={{ x: `${m.left+10}vw`, y: 120, opacity: [0, 1, 0.7, 0] }}
          transition={{ duration: 1.8, delay: m.delay }}
          className="absolute"
        >
          <div className="w-32 flex items-center gap-2">
            <div className="h-1 w-16 bg-gradient-to-r from-white via-[#F7D6E0] to-transparent rounded-full" />
            <span className="text-xs text-white drop-shadow font-cursive">{m.text}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default function BlessingGuestbook() {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showLetter, setShowLetter] = useState(null)
  const [showMeteor, setShowMeteor] = useState(false)

  // 获取留言列表
  useEffect(() => {
    const fetchBlessings = async () => {
      try {
        const result = await sql`
          SELECT id, name, message, avatar_url, created_at 
          FROM blessings 
          ORDER BY created_at DESC
        `
        setList(result)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching blessings:', error)
        setLoading(false)
      }
    }
    
    fetchBlessings()
    // 每30秒刷新一次
    const interval = setInterval(fetchBlessings, 30000)
    return () => clearInterval(interval)
  }, [])

  // 流星雨彩蛋
  useEffect(() => {
    const t = setTimeout(() => setShowMeteor(true), 30000)
    return () => clearTimeout(t)
  }, [])

  // 提交留言
  const submit = async (e) => {
    e.preventDefault()
    const trimmed = msg.trim()
    if (!trimmed) return
    
    try {
      await sql`
        INSERT INTO blessings (name, message, avatar_url)
        VALUES (${name.trim().slice(0, 20) || '匿名'}, ${trimmed.slice(0, 240)}, ${''})
      `
      setMsg('')
      setShowForm(false)
      
      // 重新获取列表
      const result = await sql`
        SELECT id, name, message, avatar_url, created_at 
        FROM blessings 
        ORDER BY created_at DESC
      `
      setList(result)
    } catch (error) {
      console.error('Error submitting blessing:', error)
      alert('提交失败，请重试')
    }
  }

  return (
    <div className="relative min-h-[600px] bg-gradient-to-b from-[#0B0C2B] via-[#BFC9FF]/30 to-[#0B0C2B] rounded-3xl overflow-hidden shadow-xl py-12">
      {/* 夜空云朵 */}
      <Clouds opacity={0.12} />
      {/* 流星雨彩蛋 */}
      {showMeteor && <MeteorShower blessings={list} />}
      {/* 邮筒 */}
      <Mailbox />
      {/* 信封瀑布流 */}
      <div className="relative flex flex-wrap justify-center gap-6 px-4 mt-2 min-h-[180px]">
        {loading ? <div className="text-white/80">加载中…</div> :
          list.map((b, i) => (
            <Envelope key={b.id} b={b} onClick={()=>setShowLetter(b)} />
          ))}
      </div>
      {/* 写祝福按钮 */}
      <button
        className="fixed md:absolute right-8 bottom-8 z-30 bg-[#A8C3A4] hover:bg-[#F9C784] text-[#0B0C2B] rounded-full shadow-lg px-6 py-3 font-cursive text-lg"
        onClick={()=>setShowForm(true)}
      >写一封新的祝福</button>
      {/* 信纸弹窗 */}
      <AnimatePresence>
        {showLetter && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-[#FFF8F5]/95 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative flex flex-col md:flex-row gap-6" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#BFC9FF] border-2 border-white flex items-center justify-center overflow-hidden shadow mb-2">
                  {showLetter.avatar_url ? <img src={showLetter.avatar_url} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-lg text-white">{showLetter.name?.[0]||'匿'}</span>}
                </div>
                <div className="font-cursive text-lg text-[#b87333] mb-2">{showLetter.name||'匿名'}</div>
                <div className="text-xs text-gray-400">{new Date(showLetter.created_at).toLocaleString()}</div>
              </div>
              <div className="flex-[2] text-[#0B0C2B] font-inter text-base whitespace-pre-line leading-relaxed border-l-2 border-[#F7D6E0]/40 pl-6">
                {showLetter.message}
              </div>
              <button className="absolute right-4 top-4 text-2xl text-[#b87333] hover:text-[#F9C784]" onClick={()=>setShowLetter(null)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 写信抽屉 */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.form onSubmit={submit} className="bg-[#FFF8F5]/95 rounded-t-2xl md:rounded-2xl shadow-2xl p-8 w-full max-w-lg flex flex-col gap-4" initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}>
              <div className="flex gap-2">
                <input className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-cursive" placeholder="你的名字（可留空）" value={name} onChange={e=>setName(e.target.value)} />
              </div>
              <textarea className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 font-inter" rows={3} placeholder="写下你的祝福（最多 240 字）" value={msg} onChange={e=>setMsg(e.target.value)} />
              {/* 可扩展：上传照片、录音、贴纸 */}
              <div className="flex gap-2 mt-2">
                <button type="button" className="px-4 py-2 rounded-xl bg-[#BFC9FF] text-white font-cursive" disabled>上传照片</button>
                <button type="button" className="px-4 py-2 rounded-xl bg-[#F9C784] text-white font-cursive" disabled>录制语音</button>
                <button type="button" className="px-4 py-2 rounded-xl bg-[#A8C3A4] text-white font-cursive" disabled>贴纸</button>
              </div>
              <div className="flex justify-end mt-4 gap-4">
                <button type="button" className="px-4 py-2 rounded-xl bg-gray-200 text-gray-600 font-cursive" onClick={()=>setShowForm(false)}>取消</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#A8C3A4] text-[#0B0C2B] font-cursive">寄出祝福</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
