---
layout: default
title: 配置说明
parent: 配置说明
nav_order: 1
---

# 配置说明

本页详细说明 `channels.wecom` 的配置字段、使用场景和最佳实践。

## 准备工作

在开始配置之前，你需要先在企业微信管理后台创建应用并获取必要的信息。

### 1. 创建企业微信机器人

登录企业微信管理后台（https://work.weixin.qq.com/），进入 **应用管理** > **自建** 页面，点击 **创建应用**。

![创建企业微信机器人步骤1](/wecom/assets/configuration-images/创建机器人1.png)

![创建企业微信机器人步骤2](/wecom/assets/configuration-images/创建机器人2.png)

### 2. 获取 Bot ID 和 Secret

创建应用后，在应用详情页面获取必要信息：

![获取Bot ID和Secret](/wecom/assets/configuration-images/获取Bot%20ID和Secret.png)

需要获取以下信息：
- **AgentId**（即 Bot ID）
- **Secret**（应用密钥）

## 配置说明

在 OpenClaw 的配置文件 `openclaw.json` 中配置 wecom 渠道。

## 快速配置（Bot WS）

Bot WS 适合快速试用，无需固定公网 IP。

```json
{
  "channels": {
    "wecom": {
      "enabled": true,
      "defaultAccount": "default",
      "accounts": {
        "default": {
          "enabled": true,
          "bot": {
            "primaryTransport": "ws",
            "ws": {
              "botId": "YOUR_BOT_ID",
              "secret": "YOUR_BOT_SECRET"
            }
          }
        }
      }
    }
  }
}
```

## 完整配置（Bot WS + Agent）

推荐生产环境使用，同时配置 Bot 和 Agent。

```json
{
  "channels": {
    "wecom": {
      "enabled": true,
      "defaultAccount": "default",
      "accounts": {
        "default": {
          "enabled": true,
          "name": "wecom-bot",
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
            "agentId": 1000001,
            "agentSecret": "YOUR_AGENT_SECRET",
            "token": "YOUR_TOKEN",
            "encodingAESKey": "YOUR_AES_KEY"
          }
        }
      }
    }
  }
}
```

## 字段说明

### Bot 配置

| 字段 | 说明 |
|------|------|
| `bot.enabled` | 是否启用 Bot |
| `bot.primaryTransport` | 传输方式（ws） |
| `bot.ws.botId` | Bot ID（AgentId） |
| `bot.ws.secret` | Bot 密钥 |

### Agent 配置

| 字段 | 说明 |
|------|------|
| `agent.enabled` | 是否启用 Agent |
| `agent.corpId` | 企业 ID |
| `agent.agentId` | Agent ID |
| `agent.agentSecret` | Agent 密钥 |
| `agent.token` | 回调 Token |
| `agent.encodingAESKey` | 回调 EncodingAESKey |

## 环境变量

推荐使用环境变量管理敏感信息：

```bash
export WECOM_BOT_ID="your-bot-id"
export WECOM_BOT_SECRET="your-bot-secret"
```

配置中引用：`${WECOM_BOT_ID}`

## 验证配置

```bash
openclaw channels status --probe
```
