---
layout: default
title: 部署与发布
parent: 部署运维
nav_order: 1
---

# 部署与发布

本页详细说明 `wecom` 插件的部署方法和帮助文档的发布流程，包含多种部署场景和最佳实践。

## 一、插件部署建议

### 环境建议

- **服务器环境**：
  - Linux 或 macOS 系统
  - 至少 2GB 内存
  - 50GB 磁盘空间
  - 稳定的网络连接
- **软件依赖**：
  - Node.js v18+（OpenClaw 运行环境）
  - 进程管理器（如 PM2、systemd）
  - 日志管理工具（如 ELK Stack、Graylog）
- **安全建议**：
  - 使用环境变量或密钥管理系统存储敏感凭证
  - 配置适当的防火墙规则
  - 定期更新系统和依赖

### 部署场景

#### 场景 1：开发环境

**适用场景**：本地开发、功能测试

**部署步骤**：
1. 安装 OpenClaw：`npm install -g openclaw`
2. 安装并启用 wecom 插件：
   ```bash
   openclaw plugins install @yanhaidao/wecom
   openclaw plugins enable wecom
   ```
3. 配置 `openclaw.json` 文件
4. 启动 OpenClaw：`openclaw start`
5. 验证运行状态：`openclaw channels status --probe`

#### 场景 2：生产环境（使用 PM2）

**适用场景**：正式生产环境、高可用性要求

**部署步骤**：
1. 安装 PM2：`npm install -g pm2`
2. 创建启动脚本 `start-openclaw.sh`：
   ```bash
   #!/bin/bash
   export WECOM_BOT_ID="your-bot-id"
   export WECOM_BOT_SECRET="your-bot-secret"
   export WECOM_CORP_ID="your-corp-id"
   export WECOM_AGENT_SECRET="your-agent-secret"
   
   openclaw start
   ```
3. 赋予执行权限：`chmod +x start-openclaw.sh`
4. 使用 PM2 启动：
   ```bash
   pm2 start start-openclaw.sh --name "openclaw-wecom"
   ```
5. 设置 PM2 自启动：
   ```bash
   pm2 save
   pm2 startup
   ```

#### 场景 3：容器化部署

**适用场景**：云平台部署、容器编排

**部署步骤**：
1. 创建 `Dockerfile`：
   ```Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   RUN npm install -g openclaw
   RUN openclaw plugins install @yanhaidao/wecom
   RUN openclaw plugins enable wecom
   
   COPY openclaw.json /app/
   
   EXPOSE 3000
   
   CMD ["openclaw", "start"]
   ```
2. 构建镜像：`docker build -t openclaw-wecom .`
3. 运行容器：
   ```bash
   docker run -d \
     --name openclaw-wecom \
     -p 3000:3000 \
     -v ./openclaw.json:/app/openclaw.json \
     openclaw-wecom
   ```

### 部署流程

1. **准备环境**：确保服务器满足硬件和软件要求
2. **安装插件**：
   ```bash
   openclaw plugins install @yanhaidao/wecom
   openclaw plugins enable wecom
   ```
3. **配置插件**：编辑 `openclaw.json` 文件，添加 `channels.wecom` 配置
4. **启动服务**：
   - 开发环境：`openclaw start`
   - 生产环境：使用 PM2 或容器运行
5. **验证部署**：
   ```bash
   # 检查插件状态
   openclaw channels status --probe
   
   # 检查 OpenClaw 整体状态
   openclaw status --deep
   
   # 查看插件日志
   openclaw channels logs --channel wecom --lines 200
   ```

### 监控与维护

- **健康检查**：定期执行 `openclaw channels status --probe` 检查插件状态
- **日志管理**：配置日志轮转，避免磁盘空间耗尽
- **备份策略**：定期备份 `openclaw.json` 配置文件
- **升级流程**：
  ```bash
  # 升级插件
  openclaw plugins update @yanhaidao/wecom
  
  # 重启服务
  openclaw restart
  ```

## 二、发布文档到 GitHub Pages

### 方案 A：直接从分支部署

**适用场景**：简单部署、快速发布

**步骤**：
1. 确保 `docs` 目录包含完整的文档内容
2. 提交并推送 `docs` 目录到 `main` 分支：
   ```bash
   git add docs/
   git commit -m "Update documentation"
   git push origin main
   ```
3. 打开 GitHub 仓库的 `Settings` -> `Pages`
4. 在 `Build and deployment` 部分：
   - **Source** 选择 `Deploy from a branch`
   - **Branch** 选择 `main`
   - **Folder** 选择 `/docs`
5. 点击 **Save** 按钮
6. 等待 GitHub 自动构建和部署

### 方案 B：使用 GitHub Actions 部署

**适用场景**：自动化部署、持续集成

**步骤**：
1. 创建 GitHub Actions 工作流文件 `.github/workflows/gh-pages.yml`：
   ```yaml
   name: Deploy GitHub Pages
   
   on:
     push:
       branches:
         - main
     workflow_dispatch:
   
   permissions:
     contents: write
     pages: write
     id-token: write
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout code
           uses: actions/checkout@v4
         
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
         
         - name: Install dependencies
           run: npm install --legacy-peer-deps || npm install
         
         - name: Setup Pages
           uses: actions/configure-pages@v5
         
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: './docs'
         
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```
2. 提交并推送工作流文件：
   ```bash
   git add .github/workflows/gh-pages.yml
   git commit -m "Add GitHub Pages deployment workflow"
   git push origin main
   ```
3. 打开 GitHub 仓库的 `Settings` -> `Pages`
4. 在 `Build and deployment` 部分，**Source** 选择 `GitHub Actions`
5. 触发工作流：
   - 推送代码到 `main` 分支，工作流会自动运行
   - 或在 GitHub Actions 页面手动触发

### 文档站点访问

发布完成后，文档站点地址通常为：

`https://<github用户名>.github.io/<仓库名>/`

例如：`https://luffy-2y3d.github.io/wecom/`

### 发布后检查清单

- **页面访问**：
  - 首页可正常访问（`index.md`）
  - 所有导航链接无 404 错误
  - 移动端可正常阅读
- **内容检查**：
  - 代码块显示正常
  - 图片加载正常
  - 表格格式正确
- **功能验证**：
  - 搜索功能正常
  - 锚点链接正常
  - 响应式布局正常

### 故障排查

#### 部署失败

- **检查 GitHub Actions 日志**：查看工作流运行状态和错误信息
- **检查文档结构**：确保 `docs` 目录结构正确，包含 `_config.yml` 文件
- **检查分支设置**：确保选择了正确的分支和目录

#### 页面显示异常

- **清除浏览器缓存**：强制刷新页面
- **检查 CSS/JS 加载**：查看浏览器开发者工具的网络请求
- **检查配置文件**：确认 `_config.yml` 中的设置正确

## 三、最佳实践

### 插件部署

1. **环境隔离**：为不同环境（开发、测试、生产）使用不同的配置
2. **安全管理**：使用环境变量存储敏感信息，避免硬编码
3. **监控告警**：设置监控系统，及时发现和处理问题
4. **自动化部署**：使用 CI/CD 工具实现自动化部署

### 文档管理

1. **版本控制**：将文档纳入版本控制，与代码同步更新
2. **定期更新**：及时更新文档，反映功能变化
3. **用户反馈**：收集用户反馈，持续改进文档质量
4. **多格式支持**：考虑提供 PDF 或其他格式的文档下载

## 四、常见问题

### 插件部署

**Q: 插件启动失败怎么办？**
A: 检查日志输出，确认错误信息。常见问题包括：网络连接问题、凭证错误、权限不足。

**Q: 如何提高插件的稳定性？**
A: 使用进程管理器（如 PM2）确保服务持续运行，配置合理的超时和重试机制。

### 文档发布

**Q: GitHub Pages 部署后页面空白怎么办？**
A: 检查 `_config.yml` 配置，确保 `baseurl` 设置正确。如果仓库是组织或用户页面，`baseurl` 应该为空。

**Q: 如何自定义文档主题？**
A: 在 `_config.yml` 中修改 `remote_theme` 配置，或在 `docs/assets` 目录中添加自定义 CSS。
