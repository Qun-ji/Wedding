import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  base: '/',
  // 优化配置
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 将大型依赖分包
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('pg') || id.includes('neon')) return 'database';
            return 'vendor';
          }
        },
      },
    },
  },
  // 开发服务器优化 - 确保SPA路由在开发环境正常工作
  server: {
    port: 5173,
    https: false,
    cors: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    // 解决SPA路由刷新404问题
    historyApiFallback: {
      // 所有未知路径都重定向到index.html
      index: '/index.html',
      // 启用日志以帮助调试
      verbose: true
    },
  },
  
  // 预览服务器配置 - 确保SPA路由在预览环境正常工作
  preview: {
    https: false,
    historyApiFallback: {
      // 所有未知路径都重定向到index.html
      index: '/index.html',
      // 启用日志以帮助调试
      verbose: true
    },
  },
=======
  base: './',
>>>>>>> parent of 47df125 (e)
})
