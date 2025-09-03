import { neon } from '@neondatabase/serverless'

// 检查环境变量是否可用（在Vite环境中可用）
const isViteEnvironment = typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined';

// 根据环境获取数据库URL
let databaseUrl;
let isDatabaseConfigured = true;

if (isViteEnvironment) {
  // 使用环境变量，避免硬编码凭据
  databaseUrl = import.meta.env.VITE_DATABASE_URL;
  if (!databaseUrl) {
    console.warn('警告: 未配置数据库URL环境变量(VITE_DATABASE_URL)，请在.env.local文件中配置');
    isDatabaseConfigured = false;
    // 使用一个占位符，确保开发时能够识别问题
    databaseUrl = 'postgresql://user:password@localhost:5432/db?sslmode=require';
  }
} else {
  // 在非Vite环境中，应该使用环境变量
  databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('错误: 未配置数据库URL环境变量');
    isDatabaseConfigured = false;
    // 使用一个占位符，确保能够识别问题
    databaseUrl = 'postgresql://user:password@localhost:5432/db?sslmode=require';
  }
}

// 创建数据库连接
let sql;
try {
  sql = neon(databaseUrl);
} catch (error) {
  console.error('数据库连接初始化失败:', error);
  // 创建一个模拟的sql函数，避免应用崩溃
  sql = async () => {
    throw new Error('数据库未正确配置或连接失败');
  };
}

export default sql;
export { isDatabaseConfigured };
