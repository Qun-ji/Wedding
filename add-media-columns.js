import { neon } from '@neondatabase/serverless';

// 数据库连接配置
const databaseUrl = 'postgresql://neondb_owner:npg_BIpmCq67lMrb@ep-quiet-pine-aefsvs3p-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
const sql = neon(databaseUrl);

// 添加媒体字段到blessings表
async function addMediaColumns() {
  try {
    console.log('开始添加媒体字段...');
    
    // 直接执行ALTER TABLE语句来添加字段
    await sql`ALTER TABLE blessings ADD COLUMN IF NOT EXISTS photo_url TEXT`;
    console.log('成功添加photo_url字段');
    
    await sql`ALTER TABLE blessings ADD COLUMN IF NOT EXISTS audio_url TEXT`;
    console.log('成功添加audio_url字段');
    
    // 验证添加结果
    const updatedColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'blessings';
    `;
    console.log('更新后的表结构:', updatedColumns);
    
  } catch (error) {
    console.error('添加媒体字段失败:', error);
  }
}

addMediaColumns();