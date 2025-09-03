import sql, { isDatabaseConfigured } from '../database.js';

<<<<<<< HEAD
// 缓存系统
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟

// 检查数据库配置状态
const checkDatabaseStatus = () => {
  if (!isDatabaseConfigured) {
    console.warn('数据库未正确配置，将使用本地缓存或模拟数据');
    return false;
  }
  return true;
};

// 初始化扩展表 - 优化版
=======
// 创建新表和扩展字段的SQL脚本
>>>>>>> parent of 47df125 (e)
export const initializeExtendedTables = async () => {
  // 检查数据库配置状态
  if (!checkDatabaseStatus()) {
    console.log('数据库未配置，跳过表初始化');
    return false;
  }
  
  // 添加重试机制
  const MAX_RETRIES = 3;
  let retries = 0;
  
  while (retries <= MAX_RETRIES) {
    try {
      // 确保blessings表存在
      await sql`
        CREATE TABLE IF NOT EXISTS blessings (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          message TEXT NOT NULL,
          photo_url TEXT,
          audio_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      console.log('成功初始化扩展表');
      return true;
    } catch (error) {
      retries++;
      console.error(`初始化扩展表失败 (尝试 ${retries}/${MAX_RETRIES + 1}):`, error);
      
      if (retries > MAX_RETRIES) {
        console.error('所有重试都失败，无法初始化扩展表');
        return false;
      }
      
      // 等待一段时间后重试，使用指数退避策略
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
    }
  }
  
  return false;
};



// 提交带媒体的祝福 - 优化版
export const submitBlessingWithMedia = async (name, message, photoUrl = null, audioUrl = null) => {
  // 输入验证
  if (!message || message.trim() === '') {
    throw new Error('消息内容不能为空');
  }
  
  // 准备数据 - 防止XSS和数据过长
  const sanitizedName = (name || '').trim().slice(0, 20) || '匿名';
  const sanitizedMessage = message.trim().slice(0, 240);
  
  // 检查数据库配置状态
  if (!checkDatabaseStatus()) {
    console.warn('数据库未配置，无法保存祝福');
    // 返回模拟ID，让用户体验不中断
    return `local-${Date.now()}`;
  }
  
  // 添加重试机制
  const MAX_RETRIES = 2;
  let retries = 0;
  let lastError = null;
  
  while (retries <= MAX_RETRIES) {
    try {
      // 插入祝福
      const result = await sql`
        INSERT INTO blessings (name, message, photo_url, audio_url)
        VALUES (${sanitizedName}, ${sanitizedMessage}, ${photoUrl}, ${audioUrl})
        RETURNING id;
      `;
      
      // 清除缓存以确保数据新鲜度
      clearCache('blessingsWithMedia');
      
      return result[0].id;
    } catch (error) {
      retries++;
      lastError = error;
      console.error(`提交带媒体的祝福失败 (尝试 ${retries}/${MAX_RETRIES + 1}):`, error);
      
      if (retries > MAX_RETRIES) {
        break;
      }
      
      // 等待一段时间后重试，使用指数退避策略
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
    }
  }
  
  // 所有重试都失败
  console.error('所有重试都失败，无法提交祝福');
  throw lastError || new Error('提交祝福失败，请稍后再试');
};

<<<<<<< HEAD


// 获取带媒体的祝福列表 - 优化版
export const getBlessingsWithMedia = async (forceRefresh = false) => {
  const cacheKey = 'blessingsWithMedia';
  
  // 检查缓存是否有效
  if (!forceRefresh && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('使用缓存的祝福数据');
      return cached.data;
    }
  }
  
  // 检查数据库配置状态
  if (!checkDatabaseStatus()) {
    console.log('数据库未配置，返回模拟数据');
    // 返回模拟数据
    const mockData = [
      {
        id: 'mock-1',
        name: '张三',
        message: '祝福你们幸福美满！',
        photo_url: null,
        audio_url: null,
        created_at: new Date().toISOString()
      },
      {
        id: 'mock-2',
        name: '李四',
        message: '祝你们百年好合！',
        photo_url: null,
        audio_url: null,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    
    // 缓存模拟数据
    cache.set(cacheKey, {
      data: mockData,
      timestamp: Date.now()
    });
    
    return mockData;
  }
  
  // 添加重试机制
  const MAX_RETRIES = 2;
  let retries = 0;
  
  while (retries <= MAX_RETRIES) {
=======
// 获取带媒体的祝福列表
export const getBlessingsWithMedia = async () => {
  try {
    // 直接尝试执行JOIN查询，这是最高效的方式
>>>>>>> parent of 47df125 (e)
    try {
      // 执行基础查询
      const result = await sql`
        SELECT id, name, message, created_at, photo_url, audio_url
        FROM blessings 
        ORDER BY created_at DESC
        LIMIT 100; -- 限制返回数量，提高性能
      `;
      
<<<<<<< HEAD
      // 缓存结果
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
=======
      // 如果JOIN查询成功，直接返回结果
>>>>>>> parent of 47df125 (e)
      return result;
    } catch (error) {
      retries++;
      console.error(`获取带媒体的祝福列表失败 (尝试 ${retries}/${MAX_RETRIES + 1}):`, error);
      
      if (retries > MAX_RETRIES) {
        // 所有重试都失败，返回空数组或缓存数据（如果有）
        if (cache.has(cacheKey)) {
          console.log('使用过期的缓存数据作为备用');
          return cache.get(cacheKey).data;
        }
        return [];
      }
      
<<<<<<< HEAD
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
=======
      // 补全缺失的贴纸相关字段
      return basicResult.map(item => ({
        ...item,
        sticker_id: null,
        sticker_name: null,
        sticker_image_url: null
      }));
>>>>>>> parent of 47df125 (e)
    }
  }
  
  return []; // 防止意外情况
};

// 从缓存获取数据
export const getFromCache = (key) => {
  if (cache.has(key)) {
    const cached = cache.get(key);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }
  return null;
};

// 设置缓存
export const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// 上传照片到临时存储（由于是前端模拟，实际项目中应该使用真实的文件存储服务）
export const uploadTempPhoto = async (file) => {
  // 文件大小限制检查 (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`照片大小超过限制 (${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB)`);
  }
  
  // 文件类型检查
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validImageTypes.includes(file.type)) {
    throw new Error('不支持的图片格式，请使用JPG、PNG、GIF或WEBP格式');
  }
  
  try {
    // 模拟文件上传，实际项目中应该使用真实的文件存储服务
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = (e) => {
        console.error('读取照片文件失败:', e);
        reject(new Error('读取照片文件失败'));
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('上传照片失败:', error);
    throw new Error('上传照片失败: ' + (error.message || '未知错误'));
  }
};

// 上传语音到临时存储（模拟）
export const uploadTempAudio = async (blob) => {
  // 文件大小限制检查 (2MB)
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  if (blob.size > MAX_FILE_SIZE) {
    throw new Error(`语音大小超过限制 (${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB)`);
  }
  
  try {
    // 模拟语音文件上传
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = (e) => {
        console.error('读取语音文件失败:', e);
        reject(new Error('读取语音文件失败'));
      };
      
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('上传语音失败:', error);
    throw new Error('上传语音失败: ' + (error.message || '未知错误'));
  }
};