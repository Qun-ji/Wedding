import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const skyGradients = {
  dusk: 'linear-gradient(180deg, #F7D6E0 0%, #BFC9FF 100%)',
  night: 'linear-gradient(180deg, #0B0C2B 0%, #BFC9FF 100%)',
}

function Clouds({ opacity = 0.2 }) {
  return (
    <>
      {/* 动画云朵 */}
      <motion.svg 
        className="absolute left-10 top-20" 
        width="120" 
        height="60" 
        style={{opacity}}
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
      >
        <ellipse cx="60" cy="30" rx="60" ry="30" fill="#FFF8F5" />
      </motion.svg>
      <motion.svg 
        className="absolute right-20 top-32" 
        width="100" 
        height="50" 
        style={{opacity}}
        animate={{ x: [0, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
      >
        <ellipse cx="50" cy="25" rx="50" ry="25" fill="#FFF8F5" />
      </motion.svg>
      <motion.svg 
        className="absolute left-1/3 bottom-10" 
        width="140" 
        height="70" 
        style={{opacity}}
        animate={{ x: [0, 12, 0] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse' }}
      >
        <ellipse cx="70" cy="35" rx="70" ry="35" fill="#FFF8F5" />
      </motion.svg>
    </>
  )
}

// 婚礼装饰元素 - 漂浮的花瓣
function FloatingPetals() {
  // 创建多个花瓣位置
  const petals = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 15 + 10,
    delay: Math.random() * 5,
    duration: Math.random() * 20 + 15
  }))
  
  return (
    <>
      {petals.map(petal => (
        <motion.div
          key={petal.id}
          className="absolute opacity-40 pointer-events-none"
          style={{ left: `${petal.x}%`, top: `-50px` }}
          initial={{ y: -50, opacity: 0, rotate: 0 }}
          animate={{ 
            y: `${petal.y + 100}%`, 
            opacity: [0, 0.6, 0.4, 0], 
            rotate: 360 
          }}
          transition={{ 
            duration: petal.duration, 
            delay: petal.delay, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 100 100">
            <path d="M50 0 C77.6 0 100 22.4 100 50 C100 77.6 77.6 100 50 100 C22.4 100 0 77.6 0 50 C0 22.4 22.4 0 50 0 Z M50 25 C43.375 25 37.5 30.875 37.5 37.5 C37.5 44.125 43.375 50 50 50 C56.625 50 62.5 44.125 62.5 37.5 C62.5 30.875 56.625 25 50 25 Z M25 50 C18.375 50 12.5 55.875 12.5 62.5 C12.5 69.125 18.375 75 25 75 C31.625 75 37.5 69.125 37.5 62.5 C37.5 55.875 31.625 50 25 50 Z M75 50 C68.375 50 62.5 55.875 62.5 62.5 C62.5 69.125 68.375 75 75 75 C81.625 75 87.5 69.125 87.5 62.5 C87.5 55.875 81.625 50 75 50 Z M50 75 C43.375 75 37.5 80.875 37.5 87.5 C37.5 94.125 43.375 100 50 100 C56.625 100 62.5 94.125 62.5 87.5 C62.5 80.875 56.625 75 50 75 Z" 
                  fill={['#F9C784', '#F7D6E0', '#FFF8F5'][Math.floor(Math.random() * 3)]} />
          </svg>
        </motion.div>
      ))}
    </>
  )
}

// 婚礼装饰元素 - 闪光星星
function SparklingStars() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  }))
  
  return (
    <>
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{ 
            left: `${star.x}%`, 
            top: `${star.y}%`, 
            width: `${star.size}px`, 
            height: `${star.size}px` 
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ 
            duration: star.duration, 
            delay: star.delay, 
            repeat: Infinity 
          }}
        />
      ))}
    </>
  )
}

export default function Hero({ names = '贾玉洁 & 张鑫', date = '2025-10-01', photo = '/hero.jpg' }) {
  const [isNight, setIsNight] = useState(false)
  
  // 格式化日期为更美观的显示形式
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', options)
  }
  
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
      
      {/* 装饰元素 */}
      <FloatingPetals />
      
      {/* 星轨和闪光星星 */}
      <AnimatePresence>
        {isNight && (
          <>
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
            >
              {/* 星轨 */}
              <svg width="100%" height="100%" style={{position:'absolute',top:0,left:0}}>
                <g>
                  {[...Array(18)].map((_,i)=>(
                    <ellipse key={i} cx={100+30*i} cy={60+8*i} rx={60} ry={1.2} fill="#fff" opacity={0.08+0.04*(i%3)} />
                  ))}
                </g>
              </svg>
            </motion.div>
            
            {/* 闪光星星 */}
            <SparklingStars />
          </>
        )}
      </AnimatePresence>
      
      {/* 悬浮新人合照 */}
      <motion.div
        className="relative z-20 flex flex-col items-center"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* 照片装饰边框 */}
        <div className="relative">
          <motion.div
            className="absolute -inset-4 rounded-2xl border border-[#F9C784]/30 bg-gradient-to-br from-[#F9C784]/20 to-transparent blur-lg"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* 照片容器 */}
          <motion.div
            className="relative shadow-2xl rounded-2xl border-4 border-white/80 bg-white/30 backdrop-blur-md overflow-hidden"
            style={{ width: 280, height: 360, boxShadow: '0 12px 40px rgba(191, 201, 255, 0.4)' }}
            initial={{ rotate: -3 }}
            animate={{ 
              rotate: [ -3, 1, -1, 0 ],
              y: [0, -5, 0] 
            }}
            transition={{ 
              rotate: { duration: 10, repeat: Infinity, repeatType: 'reverse' },
              y: { duration: 4, repeat: Infinity, repeatType: 'reverse' }
            }}
          >
            {/* 照片覆盖层 - 添加温暖光晕效果 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F9C784]/20 to-transparent pointer-events-none" />
            <img 
              src={photo} 
              alt="新人合照" 
              className="object-cover w-full h-full transition-transform duration-3000 hover:scale-105" 
            />
          </motion.div>
        </div>
        
        {/* 文字信息 */}
        <div className="mt-6 text-center px-4">
          <motion.h1 
            className="font-cormorant text-4xl md:text-6xl text-[#F9C784] drop-shadow-lg font-light tracking-wide"
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {names}
          </motion.h1>
          
          {/* 婚礼日期装饰 */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#F9C784]/60" />
            <motion.div 
              className="text-sm text-white/90 tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {formatDate(date)}
            </motion.div>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#F9C784]/60" />
          </div>
          
          {/* 婚礼格言 */}
          <motion.div 
            className="mt-6 text-lg md:text-xl font-cursive text-white/90 drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            执子之手，与子偕老
          </motion.div>
        </div>
      </motion.div>
      
      {/* 美化的切换按钮 */}
      <motion.button
        className="absolute right-8 bottom-8 z-30 bg-white/80 hover:bg-white text-[#F9C784] rounded-full shadow-lg p-4 flex items-center justify-center transition-all backdrop-blur-sm"
        whileTap={{ scale: 0.9 }}
        onClick={()=>setIsNight(v=>!v)}
        aria-label={isNight ? "切换到白天" : "切换到夜晚"}
        whileHover={{ boxShadow: '0 0 20px rgba(249, 199, 132, 0.5)' }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <motion.path 
            d="M16 29s-13-8.35-13-16.5A7.5 7.5 0 0 1 16 7a7.5 7.5 0 0 1 13 5.5C29 20.65 16 29 16 29Z" 
            fill="#F7D6E0" 
            stroke="#F9C784" 
            strokeWidth="2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </motion.button>
      
      {/* 底部装饰 */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F9C784]/10 to-transparent z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1, duration: 1.5 }}
      />
    </section>
  )
}
