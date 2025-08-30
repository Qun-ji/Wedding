import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const skyGradients = {
  dusk: 'linear-gradient(180deg, #F7D6E0 0%, #BFC9FF 100%)',
  night: 'linear-gradient(180deg, #0B0C2B 0%, #BFC9FF 100%)',
}

function Clouds({ opacity = 0.2 }) {
  // 简单云朵SVG，可扩展为动画
  return (
    <>
      <svg className="absolute left-10 top-20" width="120" height="60" style={{opacity}}><ellipse cx="60" cy="30" rx="60" ry="30" fill="#FFF8F5" /></svg>
      <svg className="absolute right-20 top-32" width="100" height="50" style={{opacity}}><ellipse cx="50" cy="25" rx="50" ry="25" fill="#FFF8F5" /></svg>
      <svg className="absolute left-1/3 bottom-10" width="140" height="70" style={{opacity}}><ellipse cx="70" cy="35" rx="70" ry="35" fill="#FFF8F5" /></svg>
    </>
  )
}

export default function Hero({ names = '贾玉洁 & 张鑫', date = '2025-10-01', photo = '/hero.jpg' }) {
  const [isNight, setIsNight] = useState(false)
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden select-none">
      {/* 天空渐变背景 */}
      <motion.div
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={{ background: isNight ? skyGradients.night : skyGradients.dusk }}
        animate={{ background: isNight ? skyGradients.night : skyGradients.dusk }}
      />
      {/* 漂浮云朵 */}
      <Clouds opacity={isNight ? 0.1 : 0.2} />
      {/* 星轨 */}
      <AnimatePresence>
        {isNight && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            {/* 简化星轨 */}
            <svg width="100%" height="100%" style={{position:'absolute',top:0,left:0}}>
              <g>
                {[...Array(18)].map((_,i)=>(
                  <ellipse key={i} cx={100+30*i} cy={60+8*i} rx={60} ry={1.2} fill="#fff" opacity={0.08+0.04*(i%3)} />
                ))}
              </g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 悬浮新人合照 */}
      <motion.div
        className="relative z-20 flex flex-col items-center"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="shadow-2xl rounded-2xl border-2 border-white/80 bg-white/30 backdrop-blur-md overflow-hidden"
          style={{ width: 260, height: 340, boxShadow: '0 8px 32px #BFC9FF55', marginBottom: 24 }}
          initial={{ rotate: -4 }}
          animate={{ rotate: [ -4, 2, -2, 0 ] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
        >
          <img src={photo} alt="新人合照" className="object-cover w-full h-full" />
        </motion.div>
        <div className="mt-2 text-center">
          <h1 className="font-cormorant text-4xl md:text-5xl text-[#F9C784] drop-shadow font-light tracking-wide">{names}</h1>
          <div className="mt-2 text-xs text-white/80 tracking-widest">{date}</div>
          <div className="mt-4 text-base md:text-lg font-cursive text-white/90 drop-shadow-sm">From this day forward, you will never walk alone.</div>
        </div>
      </motion.div>
      {/* 心跳按钮 */}
      <motion.button
        className="absolute right-8 bottom-8 z-30 bg-[#F9C784] hover:bg-[#A8C3A4] text-[#0B0C2B] rounded-full shadow-lg p-4 flex items-center justify-center transition"
        whileTap={{ scale: 0.9 }}
        onClick={()=>setIsNight(v=>!v)}
        aria-label="切换夜幕"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 29s-13-8.35-13-16.5A7.5 7.5 0 0 1 16 7a7.5 7.5 0 0 1 13 5.5C29 20.65 16 29 16 29Z" fill="#F7D6E0" stroke="#0B0C2B" strokeWidth="2"/><animate attributeName="opacity" values="1;0.7;1" dur="1s" repeatCount="indefinite"/></svg>
      </motion.button>
    </section>
  )
}
