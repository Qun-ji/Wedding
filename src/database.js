import { neon } from '@neondatabase/serverless'

// 检查环境变量是否可用（在Vite环境中可用）
const isViteEnvironment = typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined';

// 根据环境获取数据库URL
let databaseUrl;
if (isViteEnvironment) {
  console.log('数据库URL配置:', import.meta.env.VITE_DATABASE_URL ? '已配置' : '未配置');
  databaseUrl = import.meta.env.VITE_DATABASE_URL || 'postgresql://neondb_owner:npg_BIpmCq67lMrb@ep-quiet-pine-aefsvs3p-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
} else {
  // 直接Node.js环境下使用硬编码的URL
  databaseUrl = 'postgresql://neondb_owner:npg_BIpmCq67lMrb@ep-quiet-pine-aefsvs3p-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
}

const sql = neon(databaseUrl)

export default sql
