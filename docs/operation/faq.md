---
title: 常见问题
parent: 部署运维
nav_order: 3
---

# 常见问题（FAQ）

## 配置相关问题

### 1. 为什么建议同时配置 Bot WS 和 Agent？

`Bot WS` 适合实时对话体验，`Agent` 适合正式通知和兜底发送。两者并存可兼顾体验与稳定性。

### 2. 启用 dynamicAgents 的意义是什么？

它会按用户/群维度做会话隔离，减少多人并发时上下文串线。

### 3. 我只想快速试用，最少要配什么？

最少配置一个 `Bot WS` 账号（`botId` + `secret`）即可开始验证。

## 功能使用问题

### 4. 本地文件存在，但为什么发不出去？

常见原因是路径不在允许目录中。请检查 `media.localRoots` 与 `mediaMaxMb`。

### 5. 如何给上下游企业用户发消息？

在 `agent.upstreamCorps` 中配置下游企业 `corpId` 与 `agentId` 映射，详见 [上下游企业实现](./upstream)。

### 6. 如何配置菜单事件？

在 `agent.eventRouting` 中配置路由规则，详见 [菜单事件实现](./menu-event)。

## 安装与部署问题

### 7. Guided Setup 无法识别 WeCom 怎么办？

先确认插件已安装并启用，再升级到兼容版本后重试 `openclaw channels add`。

### 8. 插件安装失败怎么办？

- 检查网络连接
- 确保 OpenClaw 版本兼容
- 尝试使用 `openclaw plugins install --force @yanhaidao/wecom` 强制安装

### 9. 如何升级插件？

```bash
openclaw plugins update @yanhaidao/wecom
openclaw restart
```

## 故障排查问题

### 10. 消息发送失败怎么办？

- 检查企业微信凭证是否正确
- 确认目标用户/群聊在应用可见范围内
- 查看 OpenClaw 日志获取详细错误信息

### 11. 机器人不回复消息怎么办？

- 检查 Bot WS 连接状态
- 确认 AI 模型配置正确
- 查看 `openclaw logs` 中的错误信息

### 12. 如何查看插件运行状态？

```bash
openclaw channels status --probe
```

## 性能与安全问题

### 13. 如何提高插件性能？

- 启用消息缓存
- 合理配置 `dynamicAgents`
- 优化脚本执行时间

### 14. 如何保证凭证安全？

- 使用环境变量存储敏感信息
- 定期更新企业微信应用密钥
- 限制应用权限范围

### 15. 如何处理高并发场景？

- 配置多个账号
- 启用动态会话隔离
- 使用负载均衡

## 其他问题

### 16. 插件支持哪些企业微信版本？

支持企业微信 3.0 及以上版本。

### 17. 如何获取企业微信的 CorpID 和 AgentId？

登录企业微信管理后台，进入应用管理页面查看。

### 18. 插件是否支持多语言？

当前版本主要支持中文，后续版本将增加英文支持。
