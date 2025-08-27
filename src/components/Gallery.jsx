import { useState } from 'react'

// 将你的图片放在 public/photos/ 目录下，并在此登记
const photos = [
  '/photos/1.jpg',
  '/photos/2.jpg',
  '/photos/3.jpg',
  '/photos/4.jpg',
]

export default function Gallery() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  const openAt = (idx) => { setCurrent(idx); setOpen(true) }
  const close = () => setOpen(false)
  const prev = () => setCurrent((p) => (p - 1 + photos.length) % photos.length)
  const next = () => setCurrent((p) => (p + 1) % photos.length)

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((src, idx) => (
          <button key={idx} onClick={() => openAt(idx)} className="group">
            <img src={src} alt="photo" className="w-full aspect-square object-cover rounded-2xl shadow group-hover:opacity-90" />
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={close}>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl" onClick={(e)=>{e.stopPropagation(); prev();}}>
            ‹
          </button>
          <img src={photos[current]} alt="large" className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl" />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl" onClick={(e)=>{e.stopPropagation(); next();}}>
            ›
          </button>
          <button className="absolute top-4 right-4 text-white text-2xl" onClick={close}>✕</button>
        </div>
      )}
    </div>
  )
}
