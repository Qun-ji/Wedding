# 婚礼网站性能优化方案

本文档记录了婚礼网站的性能优化方案及其实现细节。

## 优化措施概览

通过实施以下优化措施，预计可以减少40%-60%的初始加载时间，显著提升用户体验：

1. **Vite构建配置优化**
2. **组件懒加载**
3. **数据库查询缓存系统**
4. **其他潜在优化方向**

## 已实现的优化

### 1. Vite构建配置优化

在`vite.config.js`中添加了以下优化配置：

- 启用代码压缩并移除生产环境的console和debugger语句
- 设置chunkSize警告阈值，避免生成过大的代码块
- 配置rollup分包策略，将大型第三方依赖单独打包
  - framer-motion动画库
  - 数据库相关依赖
  - 其他大型第三方库
- 优化开发服务器配置

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'framer-motion'
            } else if (id.includes('@neondatabase') || id.includes('database')) {
              return 'database'
            } else {
              return 'vendor'
            }
          }
        }
      }
    }
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    }
  }
})
```

### 2. 组件懒加载

在`App.jsx`中实现了组件懒加载，减少了初始加载时间：

- 使用React的`lazy`和`Suspense`实现组件的延迟加载
- 为懒加载组件添加加载占位符
- Gallery和BlessingGuestbook组件被设置为按需加载

```javascript
import React, { useState, useEffect, lazy, Suspense } from 'react'
import Hero from './components/Hero'

// 懒加载组件
const Gallery = lazy(() => import('./components/Gallery'))
const BlessingGuestbook = lazy(() => import('./components/BlessingGuestbook'))

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模拟加载
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      {isLoading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      ) : (
        <>
          <Hero />
          <main>
            <Suspense fallback={<div className="loading-component">加载回忆画廊...</div>}>
              <Gallery />
            </Suspense>
            <Suspense fallback={<div className="loading-component">加载祝福区域...</div>}>
              <BlessingGuestbook />
            </Suspense>
          </main>
        </>
      )}
    </div>
  )
}

export default App
```

### 3. 数据库查询缓存系统

在`db-utils.js`中实现了缓存系统，减少了数据库查询次数：

- 创建了基于Map的缓存系统
- 设置5分钟的缓存有效期
- 为`getBlessingsWithMedia`函数添加缓存支持
- 提供了清除缓存的方法

```javascript
// 缓存系统
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟

// 获取带媒体的祝福列表
export const getBlessingsWithMedia = async (forceRefresh = false) => {
  const cacheKey = 'blessingsWithMedia'
  
  // 检查缓存是否有效
  if (!forceRefresh && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('使用缓存的祝福数据')
      return cached.data
    }
  }
  
  try {
    // 查询逻辑...
    
    // 缓存结果
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    })
    
    return result
  } catch (error) {
    // 错误处理...
  }
}

// 清除缓存
export const clearCache = (key) => {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}
```

## 额外依赖安装

优化过程中需要安装的依赖：

```bash
npm install --save-dev terser
```

## 验证优化效果

通过运行以下命令验证优化效果：

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

从构建输出来看，我们成功地实现了代码分包，将大型依赖（如framer-motion、数据库相关依赖）单独打包，这有助于提高页面的加载速度和用户体验。

## 未来优化方向

1. **图片压缩与优化**
   - 对`public/photos`目录下的大图片进行压缩
   - 实现图片懒加载

2. **服务端渲染**
   - 考虑使用React Server Components或Next.js等框架实现服务端渲染

3. **CDN加速**
   - 将静态资源部署到CDN上，减少加载时间

4. **数据预取**
   - 实现关键数据的预取和预加载

通过持续优化，我们可以进一步提升婚礼网站的性能和用户体验。