# 婚礼网站部署指南

本指南将帮助您成功部署婚礼网站，并解决SPA（单页应用）路由导致的非首页刷新404问题。

## 问题说明

单页应用（SPA）使用客户端路由，当用户刷新非首页URL时，如果服务器没有正确配置，会导致404错误。

## 本地开发环境

### 开发服务器 (npm run dev)
- 默认端口：5173
- 如果端口被占用，Vite会自动分配可用端口（如3341等）
- 配置已自动处理SPA路由问题

### 预览服务器 (npm run preview)
- 默认端口：4173
- 如果端口被占用，Vite会自动分配可用端口
- 配置已自动处理SPA路由问题

## 生产环境部署配置

### 1. Nginx服务器配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist;
    index index.html;
    
    # 关键配置：解决SPA路由刷新404问题
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|jpg|jpeg|png|gif|ico)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

### 2. Apache服务器配置

在网站根目录创建或修改 `.htaccess` 文件：

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 3. Netlify配置

在项目根目录创建 `netlify.toml` 文件：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. Vercel配置

在项目根目录创建 `vercel.json` 文件：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 5. GitHub Pages配置

GitHub Pages不直接支持SPA路由。解决方法：

1. 确保 `vite.config.js` 中设置了 `base: './'`
2. 在 `public` 目录创建 `404.html` 文件，内容与 `index.html` 相同
3. 这是一个回退方案，可能会导致URL显示不准确

## 验证方法

部署后，请按以下步骤验证SPA路由是否正常工作：

1. 访问网站首页
2. 导航到其他页面（如"我们的回忆"或"祝福"页面）
3. 刷新浏览器
4. 确认页面能正常加载，而不是显示404错误

## 常见问题排查

1. **端口被占用**：
   - 可以手动指定端口：`npm run dev -- --port 8080` 或 `npm run preview -- --port 8081`
   - 或者关闭占用端口的程序

2. **路由仍然无法正常工作**：
   - 确认服务器配置正确应用
   - 检查控制台是否有其他错误
   - 尝试清除浏览器缓存后重试

3. **图片或资源加载失败**：
   - 确保 `vite.config.js` 中设置了 `base: './'`
   - 检查资源路径是否正确

## 项目配置说明

项目已在 `vite.config.js` 中配置了开发和预览服务器的SPA路由支持：

```javascript
// 开发服务器配置
server: {
  historyApiFallback: {
    index: '/index.html',
    verbose: true
  },
  // 其他配置...
},

// 预览服务器配置
preview: {
  historyApiFallback: {
    index: '/index.html',
    verbose: true
  },
  // 其他配置...
}
```

这样配置确保了在本地开发和预览环境中，SPA路由都能正常工作。

## 最后提示

- 部署前务必运行 `npm run build` 确保项目能正常构建
- 如果使用自定义域名，请确保DNS设置正确
- 定期备份您的数据和代码