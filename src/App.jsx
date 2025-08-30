import { useEffect } from 'react'
import Hero from './components/Hero'
// import Timeline from './components/Timeline'
import Gallery from './components/Gallery'
// import BlessingStatic from './components/BlessingStatic'
import BlessingGuestbook from './components/BlessingGuestbook'
// 若要启用在线留言板，把上一行注释掉，并取消下一行注释：

export default function App() {
  useEffect(() => {
    if ('scrollBehavior' in document.documentElement.style) return
  }, [])

  return (
    <div className="min-h-screen text-gray-800 bg-gradient-to-b from-pink-100 via-rose-50 to-white relative overflow-x-hidden">
      <Hero names="贾玉洁 & 张鑫" date="2025-10-01" />

      {/* 浪漫元素后续加入 */}

      <main className="max-w-5xl mx-auto px-4 md:px-6">
        {/* <section id="timeline" className="py-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">我们的故事</h2>
          <Timeline />
        </section> */}

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
    </div>
  )
}
