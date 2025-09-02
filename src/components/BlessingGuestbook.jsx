import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  submitBlessingWithMedia,
  getBlessingsWithMedia,
  uploadTempPhoto,
  uploadTempAudio,
  initializeExtendedTables
} from '../utils/db-utils'

// 云朵装饰组件
function Clouds({ opacity = 0.1 }) {
  return (
    <>
      <motion.svg 
        className="absolute left-10 top-10" 
        width="120" 
        height="60" 
        style={{opacity}} 
        initial={{ x: -20, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: opacity, 
          y: [0, -5, 0] 
        }}
        transition={{ 
          duration: 1, 
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" } 
        }}
      >
        <ellipse cx="60" cy="30" rx="60" ry="30" fill="#FFF8F5" />
      </motion.svg>
      
      <motion.svg 
        className="absolute right-20 top-24" 
        width="100" 
        height="50" 
        style={{opacity}} 
        initial={{ x: 20, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: opacity, 
          y: [0, 8, 0] 
        }}
        transition={{ 
          duration: 1.2, 
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" } 
        }}
      >
        <ellipse cx="50" cy="25" rx="50" ry="25" fill="#FFF8F5" />
      </motion.svg>
      
      <motion.svg 
        className="absolute left-1/3 bottom-10" 
        width="140" 
        height="70" 
        style={{opacity}} 
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: opacity, 
          x: [0, 10, 0] 
        }}
        transition={{ 
          duration: 1.5, 
          x: { duration: 8, repeat: Infinity, ease: "easeInOut" } 
        }}
      >
        <ellipse cx="70" cy="35" rx="70" ry="35" fill="#FFF8F5" />
      </motion.svg>
    </>
  )
}

// 邮筒组件
function Mailbox() {
  return (
    <motion.div
      className="relative mx-auto mt-8 mb-12"
      initial={{ y: 60, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        scale: [0.9, 1.02, 1] 
      }}
      transition={{ 
        duration: 1,
        scale: { duration: 0.5, delay: 0.5 } 
      }}
      style={{ width: 120, height: 180 }}
    >
      {/* 邮筒底座阴影 */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-36 h-4 bg-black/20 rounded-full blur-md"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* 邮筒主体 */}
      <motion.svg 
        width="120" 
        height="180" 
        viewBox="0 0 120 180"
        animate={{ 
          boxShadow: ['0 10px 30px rgba(184, 115, 51, 0.1)', '0 15px 35px rgba(184, 115, 51, 0.2)', '0 10px 30px rgba(184, 115, 51, 0.1)'] 
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {/* 金色渐变邮筒顶部 */}
        <ellipse cx="60" cy="30" rx="50" ry="20">
          <motion.animate attributeName="fill" values="#c99b57;#d4ad6f;#c99b57" dur="5s" repeatCount="indefinite" />
        </ellipse>
        
        {/* 邮筒主体 */}
        <rect x="10" y="30" width="100" height="120" rx="20">
          <motion.animate attributeName="fill" values="#b87333;#c99b57;#b87333" dur="5s" repeatCount="indefinite" />
        </rect>
        
        {/* 邮筒底部 */}
        <ellipse cx="60" cy="150" rx="50" ry="20">
          <motion.animate attributeName="fill" values="#a05a2c;#b87333;#a05a2c" dur="5s" repeatCount="indefinite" />
        </ellipse>
        
        {/* 邮筒投信口 */}
        <rect x="35" y="60" width="50" height="20" rx="6" fill="#fff" />
        
        {/* 邮筒装饰条 */}
        <rect x="45" y="65" width="30" height="10" rx="3">
          <motion.animate attributeName="fill" values="#b87333;#c99b57;#b87333" dur="5s" repeatCount="indefinite" />
        </rect>
        
        {/* 邮筒装饰元素 - 金色星星 */}
        <motion.g 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <path d="M60 30 L63 40 L75 40 L65 48 L68 60 L60 52 L52 60 L55 48 L45 40 L57 40 Z" fill="#FFF5CC" />
        </motion.g>
      </motion.svg>
      
      {/* 邮筒口动画信封 - 带闪光效果 */}
      <motion.div
        className="absolute left-1/2 top-16"
        style={{ transform: 'translate(-50%,0)' }}
        animate={{ y: [0, -30, 0], opacity: [1, 0.7, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <svg width="40" height="28" viewBox="0 0 40 28">
          <rect x="2" y="4" width="36" height="20" rx="4" fill="#fff" stroke="#b87333" strokeWidth="2" />
          <polyline points="2,4 20,18 38,4" fill="none" stroke="#b87333" strokeWidth="2" />
          {/* 信封上的装饰图案 */}
          <path d="M15 12 L18 12 L18 15 L15 15 Z" fill="#f9c784" />
        </svg>
      </motion.div>
      
      {/* 闪光效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        <svg width="120" height="180" viewBox="0 0 120 180">
          <linearGradient id="shine" x1="-50%" y1="-50%" x2="150%" y2="150%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <ellipse cx="60" cy="30" rx="50" ry="20" fill="url(#shine)" />
          <rect x="10" y="30" width="100" height="120" rx="20" fill="url(#shine)" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

// 信封组件
function Envelope({ b, onClick }) {
  // 根据祝福内容选择不同的背景色调
  const getEnvelopeColor = () => {
    const colors = [
      '#fff',          // 白色
      '#FFF8F5',       // 浅粉色
      '#FFF5CC',       // 浅黄色
      '#F0F7FF',       // 浅蓝色
      '#F5FFF8'        // 浅绿色
    ];
    return colors[b.id?.length % colors.length || 0];
  };
  
  // 根据祝福内容选择不同的边框颜色
  const getBorderColor = () => {
    const colors = [
      '#b87333',       // 棕色
      '#f9c784',       // 金色
      '#F7D6E0',       // 粉色
      '#BFC9FF',       // 蓝色
      '#A8C3A4'        // 绿色
    ];
    return colors[(b.id?.length + 1) % colors.length || 0];
  };
  
  return (
    <motion.div
      className="relative cursor-pointer group"
      whileHover={{ scale: 1.12, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      style={{ width: 60, height: 42 }}
    >
      {/* 信封阴影 */}
      <motion.div
        className="absolute inset-1 rounded-lg bg-black/10 blur-sm"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* 信封主体 */}
      <svg width="60" height="42" viewBox="0 0 60 42">
        <rect 
          x="2" 
          y="6" 
          width="56" 
          height="30" 
          rx="7" 
          fill={getEnvelopeColor()} 
          stroke={getBorderColor()} 
          strokeWidth="2" 
        />
        <polyline 
          points="2,6 30,30 58,6" 
          fill="none" 
          stroke={getBorderColor()} 
          strokeWidth="2" 
        />
        {/* 信封装饰图案 */}
        <circle cx="30" cy="20" r="4" fill={`${getBorderColor()}30`} />
        <path 
          d="M25 20 L35 20 M30 15 L30 25" 
          stroke={getBorderColor()} 
          strokeWidth="1" 
          strokeLinecap="round" 
        />
      </svg>
      
      {/* 头像+预览 */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-white flex items-center justify-center overflow-hidden shadow"
        style={{ 
          background: b.avatar_url ? 'transparent' : `linear-gradient(135deg, ${getBorderColor()}, ${getBorderColor()}99)` 
        }}
        whileHover={{ scale: 1.2, rotate: 5 }}
      >
        {b.avatar_url ? (
          <motion.img 
            src={b.avatar_url} 
            alt="avatar" 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }} 
          />
        ) : (
          <span className="text-lg text-white font-medium">{b.name?.[0]||'匿'}</span>
        )}
      </motion.div>
      
      {/* 留言预览 */}
      <motion.div 
        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 text-xs text-white bg-black/60 px-2 py-0.5 rounded shadow whitespace-nowrap"
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {b.message.slice(0, 8)}{b.message.length>8?'...':''}
      </motion.div>
      
      {/* 闪光效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          delay: Math.random() * 3 
        }}
      >
        <svg width="60" height="42" viewBox="0 0 60 42">
          <linearGradient id={`shine-${b.id}`} x1="-50%" y1="-50%" x2="150%" y2="150%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <rect x="2" y="6" width="56" height="30" rx="7" fill={`url(#shine-${b.id})`} />
        </svg>
      </motion.div>
    </motion.div>
  )
}

// 流星雨组件 - 增强版
function MeteorShower({ blessings }) {
  const [meteors, setMeteors] = useState([]);
  
  useEffect(() => {
    // 生成流星 - 增加数量和多样性
    const arr = Array.from({ length: 12 }).map((_, i) => {
      const colors = ['#ffffff', '#f9c784', '#F7D6E0', '#BFC9FF'];
      const speed = 1.5 + Math.random() * 1;
      const length = 10 + Math.random() * 20;
      const thickness = 0.5 + Math.random() * 1;
      const size = 8 + Math.random() * 10;
      const textSize = 8 + Math.random() * 4;
      
      return ({
        id: i,
        left: 5 + Math.random() * 90,
        delay: 0.1 + i * 0.25,
        text: blessings[i % blessings.length]?.message?.slice(0, 12) || '',
        color: colors[Math.floor(Math.random() * colors.length)],
        speed,
        length,
        thickness,
        size,
        textSize
      });
    });
    
    setMeteors(arr);
    
    // 3.5秒后自动消失（稍微延长持续时间）
    const t = setTimeout(() => setMeteors([]), 3500);
    return () => clearTimeout(t);
  }, [blessings]);
  
  if (!meteors.length) return null;
  
  return (
    <div className="pointer-events-none fixed inset-0 w-full h-full z-50">
      {/* 流星群组 */}
      {meteors.map((m) => (
        <motion.div
          key={m.id}
          className="absolute"
          initial={{ 
            x: `${m.left}vw`, 
            y: -50, 
            opacity: 0, 
            rotate: -15 
          }}
          animate={{ 
            x: `${m.left + 25}vw`, 
            y: 300, 
            opacity: [0, 1, 0.8, 0],
            rotate: -15 
          }}
          transition={{ 
            duration: 2.5 / m.speed, 
            delay: m.delay,
            ease: "easeOut"
          }}
        >
          <div className="flex items-center gap-1">
            {/* 流星拖尾 */}
            <motion.div 
              className="h-1 rounded-full"
              style={{
                width: `${m.length}px`,
                background: `linear-gradient(to right, ${m.color}, transparent)`,
                boxShadow: `0 0 ${m.thickness * 5}px ${m.thickness * 2}px ${m.color}80`
              }}
              animate={{ opacity: [1, 0.5, 0] }}
              transition={{ duration: 2 / m.speed }}
            />
            {/* 流星头部 */}
            <motion.div 
              className="rounded-full"
              style={{
                width: `${m.size}px`,
                height: `${m.size}px`,
                background: m.color,
                boxShadow: `0 0 ${m.size}px ${m.size / 2}px ${m.color}80`
              }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 0]
              }}
              transition={{ duration: 2 / m.speed }}
            />
          </div>
          
          {/* 流星附带文字 */}
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            style={{ fontSize: `${m.textSize}px` }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 0.9, 0.3, 0], y: [10, 0, 5, 15] }}
            transition={{ duration: 2 / m.speed, delay: m.delay + 0.2 }}
          >
            <span className="text-white drop-shadow-lg font-cursive">{m.text}</span>
          </motion.div>
          
          {/* 流星粒子效果 */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`particle-${m.id}-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                width: `${0.5 + Math.random()}px`,
                height: `${0.5 + Math.random()}px`,
              }}
              initial={{ 
                x: Math.random() * m.length,
                opacity: 0.8,
                y: 0
              }}
              animate={{ 
                x: Math.random() * m.length,
                y: -10 - Math.random() * 20,
                opacity: [0.8, 0]
              }}
              transition={{ 
                duration: 1 / m.speed,
                delay: m.delay + Math.random() * 0.5
              }}
            />
          ))}
        </motion.div>
      ))}
      
      {/* 整体光晕效果 */}
      <motion.div
        className="absolute inset-0 bg-[#F9C784]/5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 3.5 }}
      />
    </div>
  )
}



export default function BlessingGuestbook() {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showLetter, setShowLetter] = useState(null)
  const [showMeteor, setShowMeteor] = useState(false)
  // 媒体相关状态
  const [photoUrl, setPhotoUrl] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // 简化初始化过程，只关注获取祝福列表
  
  // 获取留言列表（包含媒体）
  useEffect(() => {
    // 添加一些模拟数据，确保页面不会空白
    const mockData = [
      {
        id: 'mock1',
        name: '匿名祝福者',
        message: '新婚快乐，百年好合！',
        created_at: new Date().toISOString(),
        avatar_url: null,
        photo_url: null,
        audio_url: null,
        sticker_id: null,
        sticker_name: null,
        sticker_image_url: null
      },
      {
        id: 'mock2',
        name: '亲友团',
        message: '永结同心，幸福美满！',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        avatar_url: null,
        photo_url: null,
        audio_url: null,
        sticker_id: null,
        sticker_name: null,
        sticker_image_url: null
      }
    ];
    
    // 设置初始模拟数据，立即显示给用户
    setList(mockData);
    
    // 检查本地存储，看是否已经初始化过数据库表结构
    const hasInitializedTables = localStorage.getItem('hasInitializedTables');
    
    // 将初始化和数据获取分离
    const fetchBlessingsData = async () => {
      try {
        // 只获取祝福数据
        const result = await getBlessingsWithMedia();
        
        // 如果获取到真实数据，则更新列表
        if (result && result.length > 0) {
          setList(result);
        }
      } catch (error) {
        console.error('获取祝福列表失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // 初始化数据库表结构（只在第一次访问或强制刷新时执行）
    const initializeTables = async () => {
      try {
        if (!hasInitializedTables) {
          await initializeExtendedTables();
          console.log('数据库表初始化成功');
          localStorage.setItem('hasInitializedTables', 'true');
        }
      } catch (error) {
        console.error('初始化数据库表结构失败:', error);
        // 即使初始化失败也继续获取数据
      }
    };
    
    // 并行执行初始化和数据获取，减少等待时间
    Promise.all([
      initializeTables(),
      fetchBlessingsData()
    ]);
    
    // 优化自动刷新间隔，从30秒改为5分钟，减少性能消耗
    const interval = setInterval(fetchBlessingsData, 300000); // 5分钟 = 300,000毫秒
    return () => clearInterval(interval);
  }, [])

  // 流星雨彩蛋
  useEffect(() => {
    const t = setTimeout(() => setShowMeteor(true), 30000)
    return () => clearTimeout(t)
  }, [])

  // 处理照片上传 - 修复版
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      // 文件大小限制，防止过大的文件影响性能
      if (file.size > 5 * 1024 * 1024) { // 5MB限制
        alert('文件过大，请选择小于5MB的图片')
        return
      }
      
      setLoading(true)
      // 先显示本地预览，提高用户体验
      const localPreviewUrl = URL.createObjectURL(file)
      setPhotoUrl(localPreviewUrl)
      
      // 异步上传文件，获取实际的Data URL
      const uploadedDataUrl = await uploadTempPhoto(file)
      // 使用上传后的Data URL替换本地预览URL，确保提交时使用持久化的URL
      setPhotoUrl(uploadedDataUrl)
    } catch (error) {
      console.error('上传照片失败:', error)
      alert('上传照片失败，请重试')
      setPhotoUrl(null)
    } finally {
      setLoading(false)
      // 重置文件输入，允许用户再次选择同一个文件
      e.target.value = ''
    }
  };
  
  // 开始录音 - 修复版
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      audioChunksRef.current = []
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        try {
          // 先创建本地预览URL
          const localPreviewUrl = URL.createObjectURL(audioBlob)
          setAudioUrl(localPreviewUrl)
          
          // 异步上传文件，获取实际的Data URL
          const uploadedDataUrl = await uploadTempAudio(audioBlob)
          // 使用上传后的Data URL替换本地预览URL，确保提交时使用持久化的URL
          setAudioUrl(uploadedDataUrl)
        } catch (error) {
          console.error('上传录音失败:', error)
          alert('上传录音失败，请重试')
          setAudioUrl(null)
        }
        
        // 停止所有音轨
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('开始录音失败:', error)
      alert('请授予麦克风权限并确保设备正常')
    }
  };
  
  // 清理函数 - 防止内存泄漏
  useEffect(() => {
    return () => {
      // 清理URL对象，防止内存泄漏
      if (photoUrl && photoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl)
      }
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl)
      }
      
      // 清理录音状态
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [photoUrl, audioUrl, isRecording])
  
  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  };
  
  // 移除媒体
  const removeMedia = (type) => {
    if (type === 'photo') {
      setPhotoUrl(null)
    } else if (type === 'audio') {
      setAudioUrl(null)
    }
  };
  
  // 提交留言（带媒体功能）
  const submit = async (e) => {
    e.preventDefault();
    const trimmed = msg.trim();
    if (!trimmed) return;
    
    try {
      setLoading(true)
      // 提交祝福（包含媒体信息）
      await submitBlessingWithMedia(
        name, 
        trimmed,
        photoUrl,
        audioUrl
      );
      
      // 重置表单
      setName('')
      setMsg('')
      setPhotoUrl(null)
      setAudioUrl(null)
      setShowForm(false)
      
      // 重新获取列表
      const updatedList = await getBlessingsWithMedia()
      setList(updatedList)
      
      // 显示流星雨效果
      setShowMeteor(true)
      setTimeout(() => setShowMeteor(false), 3200)
    } catch (error) {
      alert(`提交失败: ${error.message}`)
      console.error('提交祝福失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.7, 0.5])
  
  // 装饰星光效果
  const [stars, setStars] = useState([])
  
  useEffect(() => {
    // 创建随机星光
    const starArray = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3
    }))
    setStars(starArray)
  }, [])
  
  return (
    <div className="relative min-h-[600px] bg-gradient-to-b from-[#0B0C2B] via-[#BFC9FF]/30 to-[#0B0C2B] rounded-3xl overflow-hidden shadow-xl py-12">
      {/* 动态背景效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY, opacity: backgroundOpacity }}
      >
        {/* 装饰星光 */}
        {stars.map(star => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white blur-sm"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.5, star.opacity],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* 背景渐变装饰 */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/3 bg-[#F9C784]/10 blur-3xl"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#BFC9FF]/10 blur-3xl"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </motion.div>
      {/* 夜空云朵 */}
      <Clouds opacity={0.12} />
      {/* 流星雨彩蛋 */}
      {showMeteor && <MeteorShower blessings={list} />}
      {/* 邮筒 */}
      <Mailbox />
      {/* 信封瀑布流 */}
      <div className="relative flex flex-wrap justify-center gap-8 px-6 mt-2 min-h-[180px] transition-all duration-500">
        {loading ? (
          <motion.div 
            className="text-white/80 text-lg font-cursive"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            加载祝福中…
          </motion.div>
        ) :
          list.length > 0 ? (
            list.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Envelope key={b.id} b={b} onClick={() => setShowLetter(b)} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="text-white/80 text-center p-8 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-4xl mb-4">💌</div>
              <div className="text-lg font-cursive mb-2">暂无祝福哦~</div>
              <div className="text-sm opacity-80">成为第一个写下祝福的人吧！</div>
            </motion.div>
          )}
      </div>
      {/* 写祝福按钮 - 美化和动画增强 */}
      <motion.button
        className="fixed md:absolute right-4 md:right-8 bottom-4 md:bottom-8 z-30 bg-[#A8C3A4] hover:bg-[#F9C784] text-[#0B0C2B] rounded-full shadow-lg px-4 md:px-6 py-2 md:py-3 font-cursive text-base md:text-lg transition-all duration-300"
        onClick={() => setShowForm(true)}
        whileHover={{ 
          scale: 1.05, 
          boxShadow: '0 10px 25px -5px rgba(168, 195, 164, 0.5)',
          rotate: 2
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          boxShadow: ['0 4px 10px rgba(168, 195, 164, 0.3)', '0 6px 15px rgba(168, 195, 164, 0.4)', '0 4px 10px rgba(168, 195, 164, 0.3)']
        }}
        transition={{ 
          duration: 0.5,
          boxShadow: { duration: 3, repeat: Infinity }
        }}
      >
        <span className="hidden md:inline">写一封新的祝福</span>
        <span className="md:hidden">写祝福</span>
        <motion.span
          className="inline-block ml-1 md:ml-2"
          animate={{ rotate: [0, 15, 0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.span>
      </motion.button>
      {/* 信纸弹窗 */}
      <AnimatePresence>
        {showLetter && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-[#FFF8F5]/95 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative flex flex-col md:flex-row gap-6" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#BFC9FF] border-2 border-white flex items-center justify-center overflow-hidden shadow mb-2">
                  {showLetter.avatar_url ? <img src={showLetter.avatar_url} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-lg text-white">{showLetter.name?.[0]||'匿'}</span>}
                </div>
                <div className="font-cursive text-lg text-[#b87333] mb-2">{showLetter.name||'匿名'}</div>
                <div className="text-xs text-gray-400">{new Date(showLetter.created_at).toLocaleString()}</div>
              </div>
              <div className="flex-[2] flex flex-col gap-4">
                <div className="text-[#0B0C2B] font-inter text-base whitespace-pre-line leading-relaxed border-l-2 border-[#F7D6E0]/40 pl-6 space-y-3">
                  {/* 祝福内容 */}
                  {showLetter.message}
                </div>
                
                {/* 媒体内容显示 */}
                <div className="space-y-4">
                  {showLetter.photo_url && (
                    <div className="rounded-xl overflow-hidden border-2 border-[#BFC9FF]">
                      <img 
                        src={showLetter.photo_url} 
                        alt="祝福照片" 
                        className="w-full h-auto object-contain max-h-64"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {showLetter.audio_url && (
                    <div className="bg-[#F7D6E0]/20 p-3 rounded-xl">
                      <p className="text-sm text-gray-600 mb-2 font-cursive">语音祝福：</p>
                      <audio controls src={showLetter.audio_url} className="w-full" />
                    </div>
                  )}
                </div>
              </div>
              <motion.button 
                className="absolute right-4 top-4 text-2xl text-[#b87333] hover:text-[#F9C784]"
                onClick={() => setShowLetter(null)}
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 写信抽屉 */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.form onSubmit={submit} className="bg-[#FFF8F5]/95 rounded-t-2xl md:rounded-2xl shadow-2xl p-8 w-full max-w-lg flex flex-col gap-4" initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}>
              <div className="flex gap-2">
                <input className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-cursive" placeholder="你的名字（可留空）" value={name} onChange={e=>setName(e.target.value)} />
              </div>
              <textarea className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 font-inter" rows={3} placeholder="写下你的祝福（最多 240 字）" value={msg} onChange={e=>setMsg(e.target.value)} />
              {/* 文件上传隐藏input */}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              
              {/* 媒体预览 */}
              <div className="mt-2 space-y-2">
                {photoUrl && (
                  <div className="relative w-full max-h-48 rounded-xl overflow-hidden border-2 border-[#BFC9FF]">
                    <img src={photoUrl} alt="预览" className="w-full h-full object-contain" />
                    <button
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
                      onClick={() => removeMedia('photo')}
                    >
                      ✕
                    </button>
                  </div>
                )}
                {audioUrl && (
                  <div className="relative flex items-center gap-2 p-2 bg-[#F7D6E0]/20 rounded-xl">
                    <audio controls src={audioUrl} className="w-full" />
                    <button
                      className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center flex-shrink-0"
                      onClick={() => removeMedia('audio')}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              
              {/* 功能按钮 - 美化和动画增强 */}
              <div className="flex gap-2 mt-2">
                <motion.label 
                  htmlFor="photo-upload" 
                  className="px-4 py-2 rounded-xl bg-[#BFC9FF] text-white font-cursive cursor-pointer hover:bg-opacity-90 transition"
                  whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(191, 201, 255, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="inline-block mr-1">🖼️</span>上传照片
                </motion.label>
                {isRecording ? (
                  <motion.button 
                    type="button" 
                    className="px-4 py-2 rounded-xl bg-[#ff6b6b] text-white font-cursive hover:bg-opacity-90 transition"
                    onClick={stopRecording}
                    whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(255, 107, 107, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="inline-block mr-1 animate-pulse">🔴</span>停止录音
                  </motion.button>
                ) : (
                  <motion.button 
                    type="button" 
                    className="px-4 py-2 rounded-xl bg-[#F9C784] text-white font-cursive hover:bg-opacity-90 transition"
                    onClick={startRecording}
                    whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(249, 199, 132, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="inline-block mr-1">🎤</span>录制语音
                  </motion.button>
                )}
              </div>
              <div className="flex justify-end mt-4 gap-4">
                <motion.button 
                  type="button" 
                  className="px-4 py-2 rounded-xl bg-gray-200 text-gray-600 font-cursive"
                  onClick={() => setShowForm(false)}
                  whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  取消
                </motion.button>
                <motion.button 
                  type="submit" 
                  className="px-6 py-2 rounded-xl bg-[#A8C3A4] text-[#0B0C2B] font-cursive"
                  whileHover={{ 
                    scale: 1.03, 
                    backgroundColor: '#F9C784',
                    boxShadow: '0 4px 12px rgba(168, 195, 164, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="inline-block mr-1">💌</span>寄出祝福
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 底部装饰条 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F9C784] via-[#BFC9FF] to-[#A8C3A4]"
        animate={{ 
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}
