import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PaperPlaneLoading({ onFinish }) {
  // 控制阶段：0-纸飞机飞行，1-解体为光点，2-结束
  const stage = useRef(0)
  useEffect(() => {
    // 3.5秒后解体，0.8秒后结束
    const t1 = setTimeout(() => { stage.current = 1; setShowDots(true) }, 3500)
    const t2 = setTimeout(() => { onFinish && onFinish() }, 4300)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onFinish])
  const [showDots, setShowDots] = useState(false)
  // 生成光点
  const dots = Array.from({ length: 32 }).map((_, i) => ({
    x: 50 + 120 * Math.cos((i / 32) * 2 * Math.PI),
    y: 0 + 60 * Math.sin((i / 32) * 2 * Math.PI),
    delay: 0.1 + 0.8 * Math.random(),
  }))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#F7D6E0] via-[#BFC9FF] to-[#FFF8F5]">
      {/* 纸飞机飞行动画 */}
      <AnimatePresence>
        {!showDots && (
          <motion.div
            initial={{ y: 200, opacity: 0, scale: 0.7 }}
            animate={{ y: -120, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 18 }}
            transition={{ duration: 3.2, ease: 'easeInOut' }}
            className="relative"
          >
            <svg width="120" height="60" viewBox="0 0 120 60">
              <defs>
                <linearGradient id="planeTail" x1="0" y1="60" x2="120" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F7D6E0" />
                  <stop offset="0.5" stopColor="#BFC9FF" />
                  <stop offset="1" stopColor="#FFF8F5" />
                </linearGradient>
              </defs>
              {/* 尾迹 */}
              <path d="M10,55 Q60,40 110,10" stroke="url(#planeTail)" strokeWidth="8" fill="none" opacity="0.5" />
              {/* 纸飞机主体 */}
              <polygon points="10,55 60,30 110,10 60,40" fill="#fff" stroke="#BFC9FF" strokeWidth="2" />
              <polygon points="60,30 60,40 110,10" fill="#F7D6E0" opacity="0.7" />
              <polygon points="10,55 60,30 60,40" fill="#BFC9FF" opacity="0.5" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 解体为光点动画 */}
      <AnimatePresence>
        {showDots && (
          <motion.div
            className="absolute left-1/2 top-1/2"
            style={{ transform: 'translate(-50%,-50%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {dots.map((dot, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: dot.x, y: dot.y, opacity: [1, 0.7, 0] }}
                transition={{ duration: 0.7, delay: dot.delay, ease: 'easeOut' }}
                style={{ position: 'absolute', width: 10, height: 10, borderRadius: 8, background: 'radial-gradient(circle,#fff 60%,#F7D6E0 100%)', boxShadow: '0 0 12px #fff8' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
