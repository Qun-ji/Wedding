import QRCode from 'qrcode'
import { mkdirSync } from 'fs'

// 获取用户输入的URL，如果没有则使用示例URL
const baseUrl = process.argv[2] ?? 'https://example.com'
// 添加祝福页面的哈希路径
const fullUrl = `${baseUrl}/#blessing`

mkdirSync('public', { recursive: true })

console.log('正在生成祝福页面二维码...')
console.log('目标URL:', fullUrl)

QRCode.toFile('./public/blessing-qr.png', fullUrl, { 
  width: 512,
  margin: 1,
  color: {
    dark: '#333333',
    light: '#ffffff'
  }
}, (err) => {
  if (err) {
    console.error('祝福页面二维码生成失败：', err)
    process.exit(1)
  } else {
    console.log('祝福页面二维码已生成：public/blessing-qr.png')
    console.log('扫描此二维码将直接跳转到祝福页面')
  }
})