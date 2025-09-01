import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  submitBlessingWithMedia,
  getBlessingsWithMedia,
  uploadTempPhoto,
  uploadTempAudio
} from '../utils/db-utils'

function Clouds({ opacity = 0.1 }) {
  return (
    <>
      <svg className="absolute left-10 top-10" width="120" height="60" style={{opacity}}><ellipse cx="60" cy="30" rx="60" ry="30" fill="#FFF8F5" /></svg>
      <svg className="absolute right-20 top-24" width="100" height="50" style={{opacity}}><ellipse cx="50" cy="25" rx="50" ry="25" fill="#FFF8F5" /></svg>
      <svg className="absolute left-1/3 bottom-10" width="140" height="70" style={{opacity}}><ellipse cx="70" cy="35" rx="70" ry="35" fill="#FFF8F5" /></svg>
    </>
  )
}

function Mailbox() {
  return (
    <motion.div
      className="relative mx-auto mt-8 mb-12"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ width: 120, height: 180 }}
    >
      {/* 邮筒主体 */}
      <svg width="120" height="180" viewBox="0 0 120 180">
        <ellipse cx="60" cy="30" rx="50" ry="20" fill="#b87333" />
        <rect x="10" y="30" width="100" height="120" rx="20" fill="#b87333" />
        <ellipse cx="60" cy="150" rx="50" ry="20" fill="#a05a2c" />
        <rect x="35" y="60" width="50" height="20" rx="6" fill="#fff" />
        <rect x="45" y="65" width="30" height="10" rx="3" fill="#b87333" />
      </svg>
      {/* 邮筒口动画信封 */}
      <motion.div
        className="absolute left-1/2 top-16"
        style={{ transform: 'translate(-50%,0)' }}
        animate={{ y: [0, -30, 0], opacity: [1, 0.7, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <svg width="40" height="28" viewBox="0 0 40 28">
          <rect x="2" y="4" width="36" height="20" rx="4" fill="#fff" stroke="#b87333" strokeWidth="2" />
          <polyline points="2,4 20,18 38,4" fill="none" stroke="#b87333" strokeWidth="2" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

function Envelope({ b, onClick }) {
  return (
    <motion.div
      className="relative cursor-pointer group"
      whileHover={{ scale: 1.12, zIndex: 10 }}
      onClick={onClick}
      style={{ width: 60, height: 42 }}
    >
      <svg width="60" height="42" viewBox="0 0 60 42">
        <rect x="2" y="6" width="56" height="30" rx="7" fill="#fff" stroke="#b87333" strokeWidth="2" />
        <polyline points="2,6 30,30 58,6" fill="none" stroke="#b87333" strokeWidth="2" />
      </svg>
      {/* 头像+预览 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#BFC9FF] border-2 border-white flex items-center justify-center overflow-hidden shadow">
        {b.avatar_url ? <img src={b.avatar_url} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-lg text-white">{b.name?.[0]||'匿'}</span>}
      </div>
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 text-xs text-[#b87333] bg-white/80 px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition">
        {b.message.slice(0, 8)}{b.message.length>8?'...':''}
      </div>
    </motion.div>
  )
}

// 流星雨组件
function MeteorShower({ blessings }) {
  const [meteors, setMeteors] = useState([])
  useEffect(() => {
    // 生成流星
    const arr = Array.from({ length: 8 }).map((_, i) => ({
      left: 5 + Math.random() * 90,
      delay: 0.2 + i * 0.3,
      text: blessings[i % blessings.length]?.message?.slice(0, 10) || '',
    }))
    setMeteors(arr)
    // 3秒后自动消失
    const t = setTimeout(() => setMeteors([]), 3200)
    return () => clearTimeout(t)
  }, [blessings])
  if (!meteors.length) return null
  return (
    <div className="pointer-events-none fixed left-0 top-0 w-full h-40 z-50">
      {meteors.map((m, i) => (
        <motion.div
          key={i}
          initial={{ x: `${m.left}vw`, y: -40, opacity: 0 }}
          animate={{ x: `${m.left+10}vw`, y: 120, opacity: [0, 1, 0.7, 0] }}
          transition={{ duration: 1.8, delay: m.delay }}
          className="absolute"
        >
          <div className="w-32 flex items-center gap-2">
            <div className="h-1 w-16 bg-gradient-to-r from-white via-[#F7D6E0] to-transparent rounded-full" />
            <span className="text-xs text-white drop-shadow font-cursive">{m.text}</span>
          </div>
        </motion.div>
      ))}
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
    
    // 设置初始模拟数据
    setList(mockData);
    
    const fetchBlessings = async () => {
      try {
        const result = await getBlessingsWithMedia();
        console.log('通过getBlessingsWithMedia获取到的祝福数据:', result);
        
        // 如果获取到真实数据，则更新列表
        if (result && result.length > 0) {
          setList(result);
        }
        setLoading(false);
      } catch (error) {
        console.error('获取祝福列表失败:', error);
        setLoading(false);
      }
    };
    
    fetchBlessings();
    // 每30秒刷新一次
    const interval = setInterval(fetchBlessings, 30000);
    return () => clearInterval(interval);
  }, [])

  // 流星雨彩蛋
  useEffect(() => {
    const t = setTimeout(() => setShowMeteor(true), 30000)
    return () => clearTimeout(t)
  }, [])

  // 处理照片上传
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      setLoading(true)
      const uploadedUrl = await uploadTempPhoto(file)
      setPhotoUrl(uploadedUrl)
    } catch (error) {
      console.error('上传照片失败:', error)
      alert('上传照片失败，请重试')
    } finally {
      setLoading(false)
    }
  };
  
  // 开始录音
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
          const uploadedUrl = await uploadTempAudio(audioBlob)
          setAudioUrl(uploadedUrl)
        } catch (error) {
          console.error('上传录音失败:', error)
          alert('上传录音失败，请重试')
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

  return (
    <div className="relative min-h-[600px] bg-gradient-to-b from-[#0B0C2B] via-[#BFC9FF]/30 to-[#0B0C2B] rounded-3xl overflow-hidden shadow-xl py-12">
      {/* 夜空云朵 */}
      <Clouds opacity={0.12} />
      {/* 流星雨彩蛋 */}
      {showMeteor && <MeteorShower blessings={list} />}
      {/* 邮筒 */}
      <Mailbox />
      {/* 信封瀑布流 */}
      <div className="relative flex flex-wrap justify-center gap-6 px-4 mt-2 min-h-[180px]">
        {loading ? <div className="text-white/80">加载中…</div> :
          list.map((b, i) => (
            <Envelope key={b.id} b={b} onClick={()=>setShowLetter(b)} />
          ))}
      </div>
      {/* 写祝福按钮 */}
      <button
        className="fixed md:absolute right-4 md:right-8 bottom-4 md:bottom-8 z-30 bg-[#A8C3A4] hover:bg-[#F9C784] text-[#0B0C2B] rounded-full shadow-lg px-4 md:px-6 py-2 md:py-3 font-cursive text-base md:text-lg transition-all duration-200 hover:scale-105"
        onClick={()=>setShowForm(true)}
      >
        <span className="hidden md:inline">写一封新的祝福</span>
        <span className="md:hidden">写祝福</span>
      </button>
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
              <button className="absolute right-4 top-4 text-2xl text-[#b87333] hover:text-[#F9C784]" onClick={()=>setShowLetter(null)}>✕</button>
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
              
              {/* 功能按钮 */}
              <div className="flex gap-2 mt-2">
                <label 
                  htmlFor="photo-upload" 
                  className="px-4 py-2 rounded-xl bg-[#BFC9FF] text-white font-cursive cursor-pointer hover:bg-opacity-90 transition"
                >
                  上传照片
                </label>
                {isRecording ? (
                  <button 
                    type="button" 
                    className="px-4 py-2 rounded-xl bg-[#ff6b6b] text-white font-cursive hover:bg-opacity-90 transition"
                    onClick={stopRecording}
                  >
                    停止录音
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="px-4 py-2 rounded-xl bg-[#F9C784] text-white font-cursive hover:bg-opacity-90 transition"
                    onClick={startRecording}
                  >
                    录制语音
                  </button>
                )}
              </div>
              <div className="flex justify-end mt-4 gap-4">
                <button type="button" className="px-4 py-2 rounded-xl bg-gray-200 text-gray-600 font-cursive" onClick={()=>setShowForm(false)}>取消</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#A8C3A4] text-[#0B0C2B] font-cursive">寄出祝福</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
