import React, { useState, useEffect } from 'react'
import Hero from './components/Hero'
// import Timeline from './components/Timeline'
import Gallery from './components/Gallery'
// import BlessingStatic from './components/BlessingStatic'
import BlessingGuestbook from './components/BlessingGuestbook'
import PaperPlaneLoading from './components/PaperPlaneLoading'

export default function App() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if ('scrollBehavior' in document.documentElement.style) return
  }, [])

  return (
    <div className="min-h-screen text-gray-800 bg-gradient-to-b from-pink-100 via-rose-50 to-white relative overflow-x-hidden">
      {loading && <PaperPlaneLoading onFinish={()=>setLoading(false)} />}
      {!loading && <>
        <Hero names="贾玉洁 & 张鑫" date="2025-10-01" />
        <main className="max-w-5xl mx-auto px-4 md:px-6">
          <section id="gallery" className="py-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10 font-cursive">我们的回忆</h2>
            <Gallery />
          </section>
          <section id="blessing" className="py-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">祝福</h2>
            {/* <BlessingStatic /> */}
            <BlessingGuestbook />
          </section>
        </main>
        <footer className="py-10 text-center text-sm text-gray-500">
          Made with ❤️ by You · {new Date().getFullYear()}
        </footer>
      </>}
    </div>
  )
}
