# 婚礼网站模板

一个精美的婚礼网站模板，包含主页展示、照片画廊和祝福留言板功能。

## 功能特性

- 响应式设计，适配各种设备屏幕
- 精美动画效果，提升用户体验
- 照片画廊展示美好回忆
- 祝福留言板功能，收集亲友祝福
- 微信浏览器兼容性优化

## 快速开始

### 环境要求
- Node.js 20.x
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 二维码生成功能

本项目支持生成网站二维码和直接跳转到祝福页面的二维码。

### 生成普通网站二维码

```bash
npm run qr 您的网站URL
```

例如：
```bash
npm run qr https://your-wedding-website.com
```

### 生成祝福页面二维码

```bash
npm run qr:blessing 您的网站URL
```

例如：
```bash
npm run qr:blessing https://your-wedding-website.com
```

扫描此二维码将直接跳转到网站的祝福页面。

## 重要说明：二维码无法打开问题

如果扫描二维码后无法打开网页，可能有以下原因：

1. **使用了错误的网址**：确保在生成二维码时使用了您的真实网站URL，而不是示例URL。

2. **网站未部署或URL错误**：确保您的网站已经成功部署，并且URL是正确的。

3. **微信浏览器限制**：
   - 确保网站使用HTTPS协议（微信浏览器对HTTP网站有限制）
   - 检查网站是否被微信安全策略拦截

4. **重新生成和构建**：
   - 使用正确的URL重新生成二维码
   - 运行 `npm run build` 重新构建项目
   - 确保构建后的 `dist` 目录包含最新的二维码文件

## 微信浏览器兼容性优化

本项目已进行了多项微信浏览器兼容性优化：

1. 添加了微信专用meta标签
2. 优化了字体加载策略
3. 改进了数据库连接方式
4. 添加了微信环境检测和模拟数据

## 环境变量配置

创建 `.env.local` 文件并配置以下环境变量：

```
# 数据库连接配置
VITE_DATABASE_URL=您的PostgreSQL数据库连接字符串

# Firebase配置（如需使用Firebase功能）
VITE_FIREBASE_API_KEY=您的Firebase API密钥
VITE_FIREBASE_AUTH_DOMAIN=您的Firebase认证域名
VITE_FIREBASE_PROJECT_ID=您的Firebase项目ID
VITE_FIREBASE_STORAGE_BUCKET=您的Firebase存储桶
VITE_FIREBASE_MESSAGING_SENDER_ID=您的Firebase消息发送者ID
VITE_FIREBASE_APP_ID=您的Firebase应用ID
```

## 部署建议

1. 使用支持HTTPS的平台部署（如Vercel、Netlify、GitHub Pages等）
2. 确保数据库连接配置正确
3. 部署后使用真实URL重新生成二维码
4. 测试二维码在不同设备和浏览器中的可用性

## 开发注意事项

1. 修改内容后记得重新构建项目
2. 定期更新依赖包以确保安全性
3. 测试在不同设备和浏览器中的兼容性

祝您新婚快乐！❤️
