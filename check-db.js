import { neon } from '@neondatabase/serverless';

// 直接使用硬编码的数据库URL
const databaseUrl = 'postgresql://neondb_owner:npg_BIpmCq67lMrb@ep-quiet-pine-aefsvs3p-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
const sql = neon(databaseUrl);

// 检查数据库连接和祝福表状态
async function checkDatabase() {
  try {
    console.log('正在连接数据库...');
    
    // 检查数据库连接
    const result = await sql`SELECT 1`;
    console.log('数据库连接成功:', result);
    
    // 检查blessings表是否存在
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'blessings'
      );
    `;
    console.log('blessings表存在:', tableExists[0].exists);
    
    // 如果表存在，查询数据行数
    if (tableExists[0].exists) {
      const count = await sql`SELECT COUNT(*) as count FROM blessings`;
      console.log('祝福数据行数:', count[0].count);
      
      // 查询最新的5条数据
      const recentBlessings = await sql`
        SELECT id, name, message, created_at 
        FROM blessings 
        ORDER BY created_at DESC 
        LIMIT 5;
      `;
      console.log('最新的5条祝福数据:', recentBlessings);
    }
    
    // 检查表结构
    if (tableExists[0].exists) {
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'blessings';
      `;
      console.log('blessings表结构:', columns);
    }
    
  } catch (error) {
    console.error('数据库检查失败:', error);
  }
}

checkDatabase();