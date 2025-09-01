import { neon } from '@neondatabase/serverless'

console.log('数据库URL配置:', import.meta.env.VITE_DATABASE_URL ? '已配置' : '未配置')
console.log('数据库URL值:', import.meta.env.VITE_DATABASE_URL)

// 临时硬编码用于测试
const databaseUrl = import.meta.env.VITE_DATABASE_URL || 'postgresql://neondb_owner:npg_BIpmCq67lMrb@ep-quiet-pine-aefsvs3p-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require'

const sql = neon(databaseUrl)

export default sql
