import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 将你的图片放在 public/photos/ 目录下，并在此登记
const photos = [
  '/photos/wd1.jpg',
  '/photos/wd2.jpg',
  '/photos/wd3.jpg',
  '/photos/wd4.jpg',
]

export default function Gallery() {
  const [current, setCurrent] = useState(0)
  const prev = () => setCurrent((p) => (p - 1 + photos.length) % photos.length)
  const next = () => setCurrent((p) => (p + 1) % photos.length)

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-xl aspect-[4/3] flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={photos[current]}
            src={photos[current]}
            alt="photo"
            className="rounded-3xl shadow-2xl object-cover w-full h-full"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.7 }}
            style={{ position: 'absolute', left: 0, top: 0 }}
          />
        </AnimatePresence>
        <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-2xl rounded-full w-10 h-10 flex items-center justify-center shadow" onClick={prev}>
          ‹
        </button>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-2xl rounded-full w-10 h-10 flex items-center justify-center shadow" onClick={next}>
          ›
        </button>
      </div>
      <div className="flex gap-2 mt-4">
        {photos.map((src, idx) => (
          <button
            key={src}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-rose-400' : 'bg-gray-300'} transition-all`}
            onClick={() => setCurrent(idx)}
            aria-label={`切换到第${idx + 1}张`}
          />
        ))}
      </div>
      <div className="mt-8 text-center text-lg text-rose-500 font-cursive select-none">
        “愿有岁月可回首，且以深情共白头。”
      </div>
    </div>
  )
}
