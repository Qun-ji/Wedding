import { motion } from 'framer-motion'

export default function Hero({ names = 'Alice & Bob', date = '2025-10-01' }) {
  return (
    <header className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden">
      {/* 背景图：若 public/hero.jpg 不存在，会仅显示渐变背景 */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white" />

      <div className="relative z-10 text-center text-white px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold drop-shadow"
        >
          {names}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-4 text-xl md:text-2xl"
        >
          {date}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex gap-4 justify-center"
        >
          <a href="#timeline" className="px-6 py-3 rounded-2xl bg-white/90 text-gray-800 shadow hover:shadow-md">
            我们的故事
          </a>
          <a href="#gallery" className="px-6 py-3 rounded-2xl bg-white/90 text-gray-800 shadow hover:shadow-md">
            看照片
          </a>
        </motion.div>
      </div>

      {/* 浮动的小爱心（装饰） */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: -50, opacity: 0.9 }}
            transition={{ duration: 6 + i * 0.3, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute text-white/70"
            style={{ left: `${(i * 10) % 100}%`, top: `${(i * 7) % 100}%` }}
          >
            <span className="text-2xl">❤</span>
          </motion.div>
        ))}
      </div>
    </header>
  )
}
