import sql from '../database';

// 创建新表和扩展字段的SQL脚本
export const initializeExtendedTables = async () => {
  try {
    // 检查blessings表是否存在照片和语音字段
    const tableInfo = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blessings' 
        AND column_name IN ('photo_url', 'audio_url', 'sticker_id');
    `;
    
    const existingColumns = tableInfo.map(row => row.column_name);
    const columnsToAdd = [];
    
    if (!existingColumns.includes('photo_url')) {
      columnsToAdd.push('ADD COLUMN photo_url TEXT');
    }
    
    if (!existingColumns.includes('audio_url')) {
      columnsToAdd.push('ADD COLUMN audio_url TEXT');
    }
    
    if (!existingColumns.includes('sticker_id')) {
      columnsToAdd.push('ADD COLUMN sticker_id INTEGER');
    }
    
    // 添加缺失的列
    if (columnsToAdd.length > 0) {
      await sql`
        ALTER TABLE blessings
        ${sql.raw(columnsToAdd.join(', '))};
      `;
      console.log('成功扩展blessings表');
    }
    
    // 检查sticker_pack表是否存在
    const stickerTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'sticker_pack'
      );
    `;
    
    // 创建sticker_pack表（如果不存在）
    if (!stickerTableExists[0].exists) {
      await sql`
        CREATE TABLE sticker_pack (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          image_url TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log('成功创建sticker_pack表');
      
      // 插入一些示例贴纸
      await insertSampleStickers();
    }
  } catch (error) {
    console.error('初始化扩展表失败:', error);
  }
};

// 插入示例贴纸
export const insertSampleStickers = async () => {
  try {
    const sampleStickers = [
      { name: '爱心', image_url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMjU2IDE3NmMzMy4xIDAgNjAtMjYuOSA2MC02MHMtMjYuOS02MC02MC02MC02MCAyNi45LTYwIDYwIDI2LjkgNjAgNjAgNjB6Ii8+PC9zdmc+' },
      { name: '祝福', image_url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMjU2IDI1NmMxMS4wNSAwIDIwLTguOTUgMjAtMjBzLTguOTUtMjAtMjAtMjAtMjAgOC45NS0yMCAyMCA4Ljk1IDIwIDIwIDIweiIvPjwvc3ZnPg==' },
      { name: '星星', image_url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNNDI3IDI1Nmw2My42NCAzNi43My0yNi41NiA3OS4xMy03OS4xMy0yNi41Ni0xLjgxIDkyLjE0LTc3LjMyLTE5Ljc4LTQzLjQ1IDU4LjQ4LTk0Ljc3LTEwLjY2LTgwLjQ0LTY2LjU2IDY0LjEyLTU0LjE5IDkxLjI0IDQ4LjIzIDY3LjI3LTEwOS45MyA0My40NS01OC40OCA2Ni41Ni0xMTIuMjkgNi4xMi05Ni40NCA2NC4xMi0xOC4wOSAxMDIuOTQtNjQuMTIgNTkuMTIgNDkuMzMgNjQuMTIgMTI0LjU0LTEwLjY2IDkyLjE0IDkwLjE0IDgwLjQ0IDY0LjEyIDgwLjQ0LTYyLjI3LTc3LjMyLTE5Ljc4LTEwMS40MyA0OC40OC0xMTIuMjkgNDguNDgtMTQuOTYgMC00My40NS00OC40OC00My40NS00OC40OFYyMDZjMC0yNy42MiAyMi4zOC01MCA1MC01MHM1MCAyMi4zOCA1MCA1MC0yMi4zOCA1MC01MCA1MCIvPjwvc3ZnPg==' },
      { name: '气球', image_url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMjU2IDE0NGMxMS4wNSAwIDIwLTguOTUgMjAtMjBzLTguOTUtMjAtMjAtMjAtMjAgOC45NS0yMCAyMCA4Ljk1IDIwIDIwIDIweiIvPjxwYXRoIGQ9Ik0yNTYgMTI0Yy0yNS40MSAwLTQ2IDIwLjU5LTQ2IDQ2czIwLjU5IDQ2IDQ2IDQ2IDQ2LTIwLjU5IDQ2LTQ2LTIwLjU5LTQ2LTQ2LTQ2em0wLTEyYzI3LjYyIDAgNTAtMjIuMzggNTAtNTBTMjgzLjYyIDAgMjU2IDAgMjA2IDIyLjM4IDIwNiA1MCA1MCA1MCA1MC0yMi4zOCA1MC01MHoiLz48L3N2Zz4=' },
      { name: '烟花', image_url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNNDI3IDI1NmwtMTEuMzEgMTkuNTctOS4yOS0yMS43Ny0yMS43Ny05LjI5IDIxLjc3LTkuMjkgOS4yOS0yMS43Ny05LjI5IDIxLjc3IDIxLjc3IDkuMjktOS4yOSAyMS43Ny05LjI5IDkuMjkgMjEuNzcgOS4yOXptLTE3MS00NmwxOS41Ny0xMS4zMS0yMS43Ny05LjI5LTkuMjkgMjEuNzcgMjEuNzcgOS4yOS05LjI5IDIxLjc3IDIxLjc3IDkuMjktMjEuNzcgOS4yOXpNMjU2IDE3M2wxOS41Ny0xMS4zMS0yMS43Ny05LjI5LTkuMjkgMjEuNzcgMjEuNzcgOS4yOS05LjI5IDIxLjc3IDIxLjc3IDkuMjktMjEuNzcgOS4yOXptMCAxNzZsMTkuNTctMTEuMzEtMjEuNzctOS4yOS05LjI5IDIxLjc3IDIxLjc3IDkuMjktOS4yOSAyMS43NyAyMS43NyA5LjI5LTIxLjc3IDkuMjl6TTQyNyAzMzRsLTExLjMxIDE5LjU3LTkuMjktMjEuNzctMjEuNzctOS4yOSAyMS43Ny05LjI5IDkuMjktMjEuNzctOS4yOSAyMS43NyAyMS43NyA5LjI5LTkuMjkgMjEuNzctOS4yOSA5LjI5IDIxLjc3IDkuMjl6Ii8+PC9zdmc+' }
    ];
    
    for (const sticker of sampleStickers) {
      await sql`
        INSERT INTO sticker_pack (name, image_url)
        VALUES (${sticker.name}, ${sticker.image_url});
      `;
    }
    
    console.log('成功插入示例贴纸');
  } catch (error) {
    console.error('插入示例贴纸失败:', error);
  }
};

// 提交带媒体的祝福
export const submitBlessingWithMedia = async (name, message, photoUrl = null, audioUrl = null, stickerId = null) => {
  try {
    const result = await sql`
      INSERT INTO blessings (name, message, avatar_url, photo_url, audio_url, sticker_id)
      VALUES (
        ${name.trim().slice(0, 20) || '匿名'},
        ${message.trim().slice(0, 240)},
        ${''},
        ${photoUrl},
        ${audioUrl},
        ${stickerId}
      )
      RETURNING id;
    `;
    
    return result[0].id;
  } catch (error) {
    console.error('提交带媒体的祝福失败:', error);
    throw error;
  }
};

// 获取所有贴纸
export const getAllStickers = async () => {
  try {
    const result = await sql`
      SELECT id, name, image_url 
      FROM sticker_pack 
      ORDER BY created_at DESC;
    `;
    
    return result;
  } catch (error) {
    console.error('获取贴纸失败:', error);
    return [];
  }
};

// 获取带媒体的祝福列表
export const getBlessingsWithMedia = async () => {
  try {
    const result = await sql`
      SELECT b.id, b.name, b.message, b.avatar_url, b.photo_url, b.audio_url, b.sticker_id, b.created_at, 
             s.name as sticker_name, s.image_url as sticker_image_url
      FROM blessings b
      LEFT JOIN sticker_pack s ON b.sticker_id = s.id
      ORDER BY b.created_at DESC;
    `;
    
    return result;
  } catch (error) {
    console.error('获取带媒体的祝福列表失败:', error);
    return [];
  }
};

// 上传照片到临时存储（由于是前端模拟，实际项目中应该使用真实的文件存储服务）
export const uploadTempPhoto = async (file) => {
  try {
    // 模拟文件上传，实际项目中应该使用真实的文件存储服务
    // 在这个示例中，我们将文件转换为Base64并返回
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('上传照片失败:', error);
    throw error;
  }
};

// 上传语音到临时存储（模拟）
export const uploadTempAudio = async (blob) => {
  try {
    // 模拟语音文件上传
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('上传语音失败:', error);
    throw error;
  }
};