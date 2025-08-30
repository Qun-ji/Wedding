import { neon } from '@neondatabase/serverless'

// 只使用环境变量配置数据库连接，确保安全性
const databaseUrl = import.meta.env.VITE_DATABASE_URL

if (!databaseUrl) {
  console.warn('警告: 数据库URL未配置，部分功能可能无法使用')
}

const sql = neon(databaseUrl)

export default sql
