import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

// 将你的图片放在 public/photos/ 目录下，并在此登记
const photos = [
  '/photos/wd1.jpg',
  '/photos/wd2.jpg',
  '/photos/wd3.jpg',
  '/photos/wd4.jpg',
]

// 获取照片的alt描述
const getPhotoAlt = (index) => {
  const altTexts = [
    '美好时光',
    '甜蜜回忆',
    '幸福瞬间',
    '永恒爱情'
  ]
  return altTexts[index] || `婚礼照片 ${index + 1}`
}

// 画廊装饰元素 - 浮动爱心
function FloatingHearts() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          initial={{ 
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            scale: Math.random() * 0.5 + 0.5,
            opacity: 0.3 + Math.random() * 0.3
          }}
          animate={{ 
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            scale: Math.random() * 0.5 + 0.5,
          }}
          transition={{ 
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#f9c784" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.div>
      ))}
    </>
  )
}

export default function Gallery() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const galleryRef = useRef(null)
  const { scrollYProgress } = useScroll()
  
  // 滚动时的视差效果
  const parallaxY = useTransform(scrollYProgress, [0, 0.5], [50, -50])
  
  const prev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrent((p) => (p - 1 + photos.length) % photos.length)
      setTimeout(() => setIsTransitioning(false), 700)
    }
  }
  
  const next = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrent((p) => (p + 1) % photos.length)
      setTimeout(() => setIsTransitioning(false), 700)
    }
  }
  
  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) next()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [current, isTransitioning])
  
  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isTransitioning])
  
  return (
    <div className="py-16 px-4" ref={galleryRef}>
      <motion.div 
        className="flex flex-col items-center"
        style={{ y: parallaxY }}
      >
        {/* 画廊标题 */}
        <motion.h2 
          className="text-3xl md:text-4xl font-cormorant text-[#f9c784] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          美好回忆
        </motion.h2>
        
        {/* 照片展示区域 */}
        <div className="relative w-full max-w-3xl aspect-[4/3] flex items-center justify-center">
          {/* 装饰性背景 */}
          <motion.div 
            className="absolute w-full h-full rounded-full bg-gradient-to-br from-[#f9c784]/20 to-[#f7d6e0]/10 blur-xl"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
          
          {/* 照片框架 */}
          <div className="relative z-10 w-full max-w-2xl h-full">
            {/* 装饰元素 */}
            <FloatingHearts />
            
            {/* 照片切换 */}
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={photos[current]}
                className="w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, rotateY: 30 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -30 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                {/* 照片容器 */}
                <div className="relative w-full h-full">
                  {/* 照片 */}
                  <motion.img
                    src={photos[current]}
                    alt={getPhotoAlt(current)}
                    className="object-cover w-full h-full"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    loading="lazy"
                  />
                  
                  {/* 照片渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
                  
                  {/* 照片编号指示器 */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <motion.div 
                      className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-sm text-[#f9c784] font-medium"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {current + 1} / {photos.length}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* 导航按钮 - 左侧 */}
            <motion.button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-[#f9c784] rounded-full w-12 h-12 flex items-center justify-center shadow-lg backdrop-blur-sm"
              onClick={prev}
              aria-label="上一张"
              whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(249, 199, 132, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </motion.button>
            
            {/* 导航按钮 - 右侧 */}
            <motion.button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-[#f9c784] rounded-full w-12 h-12 flex items-center justify-center shadow-lg backdrop-blur-sm"
              onClick={next}
              aria-label="下一张"
              whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(249, 199, 132, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </motion.button>
          </div>
        </div>
        
        {/* 缩略图指示器 */}
        <div className="flex gap-2 mt-8">
          {photos.map((src, idx) => (
            <motion.button
              key={src}
              className={`rounded-full transition-all duration-300 ${idx === current ? 'bg-[#f9c784] w-10' : 'bg-gray-200 w-3'}`}
              style={{ height: 3 }}
              onClick={() => {
                if (!isTransitioning) setCurrent(idx)
              }}
              aria-label={`切换到第${idx + 1}张`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
        
        {/* 爱情格言 */}
        <motion.div 
          className="mt-12 text-center text-xl md:text-2xl text-[#f9c784] font-cursive select-none max-w-md px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          animate={{ 
            opacity: [0.8, 1, 0.8],
            transition: { duration: 4, repeat: Infinity, delay: 1.3 }
          }}
        >
          “愿有岁月可回首，且以深情共白头。”
        </motion.div>
      </motion.div>
    </div>
  )
}
