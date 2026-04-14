---
title: 常见问题
nav_order: 10
---

# 常见问题（FAQ）

## 1. 为什么建议同时配置 Bot WS 和 Agent？

`Bot WS` 适合实时对话体验，`Agent` 适合正式通知和兜底发送。两者并存可兼顾体验与稳定性。

## 2. 启用 dynamicAgents 的意义是什么？

它会按用户/群维度做会话隔离，减少多人并发时上下文串线。

## 3. 本地文件存在，但为什么发不出去？

常见原因是路径不在允许目录中。请检查 `media.localRoots` 与 `mediaMaxMb`。

## 4. Guided Setup 无法识别 WeCom 怎么办？

先确认插件已安装并启用，再升级到兼容版本后重试 `openclaw channels add`。

## 5. 如何给上下游企业用户发消息？

在 `agent.upstreamCorps` 中配置下游企业 `corpId` 与 `agentId` 映射，详见 `UPSTREAM_CONFIG.md`。

## 6. 我只想快速试用，最少要配什么？

最少配置一个 `Bot WS` 账号（`botId` + `secret`）即可开始验证。
