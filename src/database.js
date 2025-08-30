import { neon } from '@neondatabase/serverless'

console.log('数据库URL配置:', import.meta.env.VITE_DATABASE_URL ? '已配置' : '未配置')

const sql = neon(import.meta.env.VITE_DATABASE_URL)

export default sql
