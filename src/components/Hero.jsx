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
          className="text-4xl md:text-6xl font-bold drop-shadow font-cursive tracking-wide"
        >
          {names}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-4 text-xl md:text-2xl font-cursive"
        >
          {date}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-lg md:text-2xl text-pink-100 font-cursive drop-shadow select-none"
        >
          “与你共度的每一天，都是浪漫的纪念。”
        </motion.div>
      </div>

      {/* 浮动的爱心（更多更浪漫） */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: -60, opacity: 0.85 }}
            transition={{ duration: 7 + i * 0.25, repeat: Infinity, repeatType: 'reverse', delay: i * 0.3 }}
            className="absolute text-pink-200"
            style={{ left: `${(i * 5 + (i % 3) * 7) % 100}%`, top: `${(i * 11) % 100}%`, fontSize: `${22 + (i % 4) * 8}px` }}
          >
            <span>❤</span>
          </motion.div>
        ))}
      </div>
    </header>
  )
}
