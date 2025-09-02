import { createServer } from 'http';
import { stat, readFile } from 'fs/promises';
import { join, extname } from 'path';

// 获取当前工作目录
const __dirname = process.cwd();
const DIST_DIR = join(__dirname, 'dist');
const PORT = 8080;

// MIME类型映射
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.ico': 'image/x-icon',
  '.map': 'application/json'
};

const server = createServer(async (req, res) => {
  console.log(`接收到请求: ${req.method} ${req.url}`);
  
  try {
    // 构建请求的文件路径
    let filePath = join(DIST_DIR, req.url === '/' ? '/index.html' : req.url);
    
    // 移除查询参数和哈希值
    const queryIndex = filePath.indexOf('?');
    const hashIndex = filePath.indexOf('#');
    if (queryIndex !== -1) filePath = filePath.slice(0, queryIndex);
    if (hashIndex !== -1) filePath = filePath.slice(0, hashIndex);
    
    // 检查文件是否存在
    try {
      await stat(filePath);
      console.log(`文件存在: ${filePath}`);
    } catch (error) {
      // 文件不存在，返回index.html以支持SPA路由
      console.log(`文件不存在: ${filePath}`);
      console.log('启用SPA路由回退: 返回index.html');
      filePath = join(DIST_DIR, 'index.html');
    }
    
    // 读取文件内容
    const content = await readFile(filePath);
    
    // 显示文件内容的前100个字符，用于调试
    const preview = content.toString('utf8', 0, 100);
    console.log(`文件内容预览: ${preview}...`);
    
    // 设置MIME类型
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // 发送响应
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
    
    console.log(`响应发送成功: ${req.url} -> ${filePath}`);
    console.log(`响应内容长度: ${content.length} 字节`);
  } catch (error) {
    console.error(`处理请求时出错: ${error.message}`);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('服务器内部错误');
  }
});

server.listen(PORT, () => {
  console.log(`\n=== 简化版SPA路由测试服务器 ===`);
  console.log(`服务器已启动，监听端口: ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}/`);
  console.log(`\n测试步骤:`);
  console.log(`1. 在浏览器中打开 http://localhost:${PORT}/`);
  console.log(`2. 导航到其他页面 (/gallery 或 /blessing)`);
  console.log(`3. 刷新浏览器页面`);
  console.log(`4. 检查页面是否正常加载`);
  console.log(`\n服务器将显示详细的请求日志，包括:`);
  console.log(`- 每个请求的URL`);
  console.log(`- 文件查找结果`);
  console.log(`- 是否触发SPA路由回退`);
  console.log(`\n按 Ctrl+C 停止服务器`);
});