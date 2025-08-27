import QRCode from 'qrcode'
import { mkdirSync } from 'fs'

const url = process.argv[2] ?? 'https://example.com'
mkdirSync('public', { recursive: true })

QRCode.toFile('./public/qr.png', url, { width: 512 }, (err) => {
  if (err) {
    console.error('二维码生成失败：', err)
    process.exit(1)
  } else {
    console.log('二维码已生成：public/qr.png ->', url)
  }
})
