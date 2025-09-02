import React, { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from './components/Hero'
// import Timeline from './components/Timeline'
import PaperPlaneLoading from './components/PaperPlaneLoading'

// 懒加载组件
const Gallery = lazy(() => import('./components/Gallery'))
const BlessingGuestbook = lazy(() => import('./components/BlessingGuestbook'))

// 页面过渡动画组件
function PageTransition({ children }) {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center">
      <PaperPlaneLoading size="small" />
    </div>}>
      <div className="w-full transition-opacity duration-700 opacity-100">
        {children}
      </div>
    </Suspense>
  )
}

// 导航栏组件
function Navbar() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const isHome = location.pathname === '/'
  
  // 监听滚动事件，添加滚动时的导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // 导航栏容器的动态样式
  const navbarClass = `fixed top-0 w-full z-50 transition-all duration-700 ${isHome 
    ? (isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5') 
    : 'bg-white/90 backdrop-blur-md shadow-sm py-3'}`
  
  return (
    <nav className={navbarClass}>
      <div className="max-w-5xl mx-auto px-4 flex justify-center space-x-8">
        <NavLink to="/" isActive={location.pathname === '/'} isHome={isHome && !isScrolled}>
          首页
        </NavLink>
        <NavLink to="/gallery" isActive={location.pathname === '/gallery'} isHome={isHome && !isScrolled}>
          我们的回忆
        </NavLink>
        <NavLink to="/blessing" isActive={location.pathname === '/blessing'} isHome={isHome && !isScrolled}>
          祝福
        </NavLink>
      </div>
    </nav>
  )
}

// 导航链接组件
function NavLink({ to, children, isActive, isHome }) {
  return (
    <Link
      to={to}
      className={`text-lg font-medium transition-all duration-300 py-2 px-1 relative ${isActive 
        ? (isHome ? 'text-white' : 'text-pink-500') 
        : (isHome ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-pink-500')}`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 transform scale-x-0 ${isActive 
        ? (isHome ? 'bg-white scale-x-100' : 'bg-pink-500 scale-x-100') 
        : 'group-hover:scale-x-100'}`}></span>
    </Link>
  )
}

// 平滑过渡按钮组件
function SmoothButton({ to, children, primary = false, className = '' }) {
  const navigate = useNavigate()
  const buttonRef = useRef(null)
  
  const handleClick = (e) => {
    e.preventDefault()
    
    // 添加点击波纹效果
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const ripple = document.createElement('span')
      ripple.className = 'absolute w-24 h-24 rounded-full bg-white/30 transform -translate-x-1/2 -translate-y-1/2 scale-0 transition-transform duration-1000 ease-out'
      ripple.style.top = `${e.clientY - rect.top}px`
      ripple.style.left = `${e.clientX - rect.left}px`
      buttonRef.current.appendChild(ripple)
      
      setTimeout(() => {
        ripple.classList.add('scale-100')
      }, 10)
      
      setTimeout(() => {
        ripple.remove()
      }, 1000)
    }
    
    // 延迟导航以显示动画
    setTimeout(() => {
      navigate(to)
    }, 300)
  }
  
  const baseClasses = "relative overflow-hidden rounded-full px-8 py-3 transition-all duration-500 ease-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
  const colorClasses = primary
    ? "bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-500"
    : "bg-pink-100 text-pink-700 hover:bg-pink-200 focus:ring-pink-300"
  
  return (
    <a
      href={to}
      onClick={handleClick}
      ref={buttonRef}
      className={`${baseClasses} ${colorClasses} ${className}`}
    >
      {children}
    </a>
  )
}

// 页脚组件
function Footer() {
  return (
    <footer className="py-10 text-center text-sm text-gray-500">
      Made with ❤️ by You · {new Date().getFullYear()}
    </footer>
  )
}

// 主页组件
function HomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Hero names="贾玉洁 & 张鑫" date="2025-10-01" />
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            欢迎来到我们的婚礼网站，在这里记录着我们美好的爱情故事和珍贵的回忆。
            感谢您的到来，愿我们的幸福也能传递给您。
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row justify-center gap-6"
          >
            <SmoothButton to="/gallery">
              查看我们的回忆
            </SmoothButton>
            <SmoothButton to="/blessing" primary>
              写下祝福
            </SmoothButton>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

// 回忆画廊页面组件
function GalleryPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto px-4"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-center mb-10 font-cursive">我们的回忆</h1>
          <Suspense fallback={<div className="w-full h-96 flex items-center justify-center">
            <PaperPlaneLoading size="small" />
          </div>}>
            <Gallery />
          </Suspense>
        </motion.div>
      </div>
    </PageTransition>
  )
}

// 祝福页面组件
function BlessingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto px-4"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-center mb-10">祝福</h1>
          <Suspense fallback={<div className="w-full h-96 flex items-center justify-center">
            <PaperPlaneLoading size="small" />
          </div>}>
            <BlessingGuestbook />
          </Suspense>
        </motion.div>
      </div>
    </PageTransition>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // 设置一个较短的加载时间，提供良好的初始体验
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen text-gray-800 bg-gradient-to-b from-pink-100 via-rose-50 to-white relative overflow-x-hidden">
      {loading && <PaperPlaneLoading onFinish={() => setLoading(false)} />}
      {!loading && (
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blessing" element={<BlessingPage />} />
          </Routes>
          <Footer />
        </Router>
      )}
    </div>
  )
}
