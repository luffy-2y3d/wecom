---
title: 配置说明
nav_order: 3
---

# 配置说明

本页聚焦 `channels.wecom` 的核心字段与推荐配置方式。

## 配置入口

在 OpenClaw 的主配置文件 `openclaw.json` 中设置：

```json
{
  "channels": {
    "wecom": {}
  }
}
```

## 推荐生产配置（Bot WS + Agent）

```jsonc
{
  "channels": {
    "wecom": {
      "enabled": true,
      "defaultAccount": "default",
      "accounts": {
        "default": {
          "enabled": true,
          "name": "default-wecom-account",
          "bot": {
            "primaryTransport": "ws",
            "streamPlaceholderContent": "正在处理，请稍候...",
            "ws": {
              "botId": "YOUR_BOT_ID",
              "secret": "YOUR_BOT_SECRET"
            }
          },
          "agent": {
            "corpId": "YOUR_CORP_ID",
            "agentSecret": "YOUR_AGENT_SECRET",
            "agentId": 1000001,
            "token": "YOUR_AGENT_TOKEN",
            "encodingAESKey": "YOUR_ENCODING_AES_KEY"
          }
        }
      },
      "mediaMaxMb": 50,
      "media": {
        "tempDir": "/tmp/openclaw-wecom-media",
        "localRoots": ["/srv/company-share", "/data/reports"]
      },
      "dynamicAgents": {
        "enabled": true,
        "dmCreateAgent": true,
        "groupEnabled": true,
        "adminUsers": []
      }
    }
  }
}
```

## 字段说明（高频）

- `defaultAccount`: 默认账号 ID，建议固定为 `default`
- `accounts.<id>.bot.ws.botId/secret`: Bot WS 建连凭证
- `accounts.<id>.agent.*`: 自建应用回调与主动发送凭证
- `mediaMaxMb`: 媒体大小上限，优先使用该字段
- `media.localRoots`: 允许读取的额外本地媒体目录
- `dynamicAgents.enabled`: 是否启用动态会话隔离

## dynamicAgents 何时开启

建议开启：

- 多个同事共用一个机器人
- 多群长期协作且上下文隔离要求高

可暂不开启：

- 单人 PoC 演示
- 仅验证最小链路连通性

## 上下游企业消息互通

如需给上下游企业用户发消息，可在 `agent.upstreamCorps` 追加企业映射。完整说明见仓库根目录 `UPSTREAM_CONFIG.md`。
