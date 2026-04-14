# 部署与发布

本页说明两部分内容：

1. 如何部署 `wecom` 到你的运行环境
2. 如何把本帮助文档发布为 GitHub Pages 网站

## 一、插件部署建议

## 环境建议

- 使用稳定网络与长期运行进程管理器
- 将敏感凭证通过环境管理系统托管
- 对日志进行分级和归档

## 部署流程

1. 安装并启用插件
2. 写入 `channels.wecom` 配置
3. 启动 OpenClaw 服务
4. 执行状态与日志检查

```bash
openclaw channels status --probe
openclaw status --deep
openclaw channels logs --channel wecom --lines 200
```

## 二、发布文档到 GitHub Pages（方案 A）

当前仓库采用 `docs/` 目录发布文档。

1. 提交并推送 `docs` 目录到 `main`
2. 打开仓库 `Settings` -> `Pages`
3. `Build and deployment` 选择 `Deploy from a branch`
4. Branch 选择 `main`，Folder 选择 `/docs`
5. 保存并等待发布

发布完成后，文档站点地址通常为：

`https://<github用户名>.github.io/<仓库名>/`

## 发布后检查清单

- 首页可访问（`index`）
- 导航链接无 404
- 移动端可正常阅读
- 关键命令代码块显示正常
