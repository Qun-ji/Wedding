import { neon } from '@neondatabase/serverless'

// 创建模拟的SQL对象
function createMockSql() {
  const mockSql = {
    // 模拟查询函数，返回空数组
    query: async () => {
      return []
    },
    // 模拟所有可能的SQL操作
    valueOf: function() {
      return async () => []
    }
  }
  // 让mockSql可以作为函数调用
  const mockSqlFunction = async () => []
  Object.assign(mockSqlFunction, mockSql)
  return mockSqlFunction
}

let sql

// 检查是否在浏览器环境中
if (typeof window !== 'undefined') {
  // 在浏览器环境中检测是否是微信
  const isWeChat = /MicroMessenger/.test(navigator.userAgent)
  
  if (isWeChat) {
    console.log('微信环境检测到，使用模拟数据库连接')
    sql = createMockSql()
  } else {
    // 非微信浏览器环境下正常连接数据库
    const databaseUrl = import.meta.env.VITE_DATABASE_URL
    
    if (!databaseUrl) {
      console.warn('警告: 数据库URL未配置，部分功能可能无法使用')
      sql = createMockSql()
    } else {
      sql = neon(databaseUrl)
    }
  }
} else {
  // 服务端环境下正常连接数据库
  const databaseUrl = import.meta.env.VITE_DATABASE_URL
  
  if (!databaseUrl) {
    console.warn('警告: 数据库URL未配置，部分功能可能无法使用')
    sql = createMockSql()
  } else {
    sql = neon(databaseUrl)
  }
}

export default sql
