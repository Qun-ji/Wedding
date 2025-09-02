import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 为ES模块获取__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 设置服务器端口
const PORT = 8080;
const DIST_DIR = path.join(__dirname, 'dist');

// 创建HTTP服务器
const server = http.createServer(async (req, res) => {
  console.log(`接收到请求: ${req.url}`);
  
  try {
    // 获取请求的文件路径
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    
    try {
      // 尝试读取文件
      const content = await fs.readFile(filePath);
      
      // 根据文件扩展名设置正确的Content-Type
      const extname = path.extname(filePath);
      let contentType = 'text/html';
      
      switch (extname) {
        case '.js':
          contentType = 'application/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        case '.svg':
          contentType = 'image/svg+xml';
          break;
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
      console.log(`返回文件: ${filePath}`);
    } catch (fileError) {
      // 文件不存在或无法读取，返回index.html以支持SPA路由
      try {
        const indexContent = await fs.readFile(path.join(DIST_DIR, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexContent);
        console.log(`文件不存在，返回index.html (SPA路由支持)`);
      } catch (indexError) {
        res.writeHead(500);
        res.end('服务器错误');
        console.error('无法读取index.html:', indexError);
      }
    }
  } catch (error) {
    res.writeHead(500);
    res.end('服务器错误');
    console.error('请求处理错误:', error);
  }
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`\n测试SPA路由的简易服务器已启动!`);
  console.log(`请访问: http://localhost:${PORT}/`);
  console.log(`\n测试步骤:`);
  console.log(`1. 访问首页`);
  console.log(`2. 导航到"我们的回忆"或"祝福"页面`);
  console.log(`3. 刷新浏览器`);
  console.log(`4. 确认页面能正常加载`);
  console.log(`\n服务器日志将显示每个请求的处理情况:`);
  console.log(`- 存在的文件会直接返回`);
  console.log(`- 不存在的路径会返回index.html (SPA路由支持)`);
  console.log(`\n按 Ctrl+C 停止服务器`);
});