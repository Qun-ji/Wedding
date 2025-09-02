# Netlify部署详细指南

本指南将帮助您将婚礼网站部署到Netlify平台，并确保SPA路由功能正常工作，解决刷新页面404的问题。

## 前提条件

在开始部署前，请确保您已完成以下准备：

1. 拥有一个[Netlify](https://www.netlify.com/)账户
2. 项目已提交到GitHub/GitLab/Bitbucket等Git仓库
3. 本地已成功运行`npm run build`构建项目

## 第一步：创建netlify.toml配置文件

我们已经为您创建了完整的`netlify.toml`配置文件，内容如下：

```toml
[build]
  publish = "dist"
  command = "npm run build"
  environment = {
    NODE_ENV = "production"
  }

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  conditions = {
    Query = { path = "!.*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2|woff|ttf|eot)$" }
  }

[[headers]]
  for = "/*.{js,css,svg,png,jpg,jpeg,gif,ico,woff2,woff,ttf,eot}"
  [headers.values]
    Cache-Control = "public, max-age=2592000, immutable"

[functions]
  node_bundler = "esbuild"

[dev]
  port = 3000
  autoLaunch = true

[context.production]
  command = "npm run build"

[context.deploy-preview]
  command = "npm run build"

[context.branch-deploy]
  command = "npm run build"
```

这个配置文件的关键功能：
- 设置正确的构建命令和输出目录
- 配置Node.js版本
- 解决SPA路由刷新404问题（最重要的部分）
- 设置静态资源缓存策略
- 优化构建过程

## 第二步：通过Git仓库部署到Netlify

### 方法1：通过Netlify网站部署

1. 登录到您的[Netlify](https://app.netlify.com/)账户
2. 点击"New site from Git"按钮
3. 选择您的Git提供商（GitHub/GitLab/Bitbucket）
4. 授权Netlify访问您的仓库
5. 选择您的婚礼网站仓库
6. 在配置页面：
   - **Branch to deploy**: 选择您要部署的分支（通常是main或master）
   - **Build command**: 应该自动填充为`npm run build`
   - **Publish directory**: 应该自动填充为`dist`
7. 点击"Deploy site"按钮开始部署

### 方法2：使用Netlify CLI部署

1. 安装Netlify CLI：
   ```bash
   npm install -g netlify-cli
   ```

2. 登录到Netlify：
   ```bash
   netlify login
   ```

3. 在项目根目录初始化Netlify：
   ```bash
   netlify init
   ```

4. 按照提示完成设置，包括：
   - 选择"Create & configure a new site"
   - 选择您的团队
   - 为您的网站命名
   - 确认构建命令和发布目录

5. 部署网站：
   ```bash
   netlify deploy --prod
   ```

## 第三步：配置环境变量（可选）

如果您的网站使用了环境变量（如API密钥等），请在Netlify中配置：

1. 登录Netlify，进入您的网站仪表板
2. 点击"Site settings" > "Build & deploy" > "Environment"
3. 点击"Edit variables"按钮
4. 添加您的环境变量（与`.env.local`中的变量对应）
5. 点击"Save"
6. 重新部署网站以应用新的环境变量

## 第四步：验证部署是否成功

部署完成后，您需要验证SPA路由功能是否正常工作：

1. 打开Netlify提供的网站URL（通常是`https://[your-site-name].netlify.app/`）
2. 导航到"我们的回忆"页面 (`/gallery`)
3. 导航到"祝福"页面 (`/blessing`)
4. 刷新浏览器页面 - 页面应该能正常加载，而不是显示404错误
5. 直接在地址栏输入非首页URL并访问，确认能正常加载

## 常见问题及解决方案

### 问题1：部署失败，出现构建错误

**解决方案**：
- 检查构建日志，查看具体错误信息
- 确保您的`package.json`中有正确的`build`脚本
- 确保所有依赖项都已正确安装
- 检查Node.js版本是否符合要求（我们配置的是Node.js 20）

### 问题2：网站可以访问，但刷新非首页时出现404错误

**解决方案**：
- 确认`netlify.toml`文件已正确提交到仓库
- 检查重定向规则是否正确配置
- 重新部署网站以确保最新的配置生效

### 问题3：静态资源加载缓慢

**解决方案**：
- 我们的配置文件已经包含了静态资源缓存策略
- 可以考虑使用Netlify的CDN功能进一步优化

### 问题4：环境变量不生效

**解决方案**：
- 确认在Netlify中正确配置了环境变量
- 确保变量名称与代码中的名称完全匹配
- 重新部署网站以应用环境变量

## 高级配置选项

### 自定义域名

要为您的婚礼网站设置自定义域名：

1. 在Netlify仪表板中，点击"Domain settings"
2. 点击"Add custom domain"
3. 输入您的域名，然后点击"Save"
4. 按照提示更新您的DNS设置
5. 配置SSL证书以启用HTTPS

### 部署预览

Netlify会自动为您的每个Pull Request/合并请求创建部署预览，方便您在合并前预览更改。

### 持续部署

Netlify会自动监控您的Git仓库，每当您推送到配置的分支时，都会触发自动部署。

## 额外提示

1. **测试本地构建**：在部署前，始终在本地运行`npm run build`确保构建成功
2. **清除缓存**：如果遇到奇怪的问题，可以尝试在Netlify中清除构建缓存并重新部署
3. **监控性能**：使用Netlify的性能分析工具监控您网站的加载速度和性能
4. **设置密码保护**（可选）：如果您希望婚礼网站暂时保密，可以在Netlify中设置密码保护

## 联系方式

如果您在部署过程中遇到任何问题，请随时联系我们获取帮助！

祝您的婚礼网站部署顺利！❤️