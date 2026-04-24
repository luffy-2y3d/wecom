---
layout: default
title: 配置详解
parent: 配置说明
nav_order: 1
---

# 配置说明

本页详细说明 `channels.wecom` 的配置字段、使用场景和最佳实践，帮助你根据实际需求进行合理配置。

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

## 配置入口

在 OpenClaw 的主配置文件 `openclaw.json` 中设置：

```json
{
  "channels": {
    "wecom": {
      // 配置内容
    }
  }
}
```

## 推荐生产配置（Bot WS + Agent）

以下是一个完整的生产环境配置示例，包含了大多数常用功能：

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

## 详细字段说明

### 1. 基础配置

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `enabled` | boolean | 是否启用 wecom 插件 | `false` |
| `defaultAccount` | string | 默认账号 ID，建议固定为 `default` | - |
| `accounts` | object | 账号配置集合 | - |

### 2. 账号配置

每个账号可以同时配置 Bot 和 Agent：

#### 2.1 Bot 配置

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `bot.enabled` | boolean | 是否启用 Bot | `true` |
| `bot.primaryTransport` | string | 主要传输方式，可选 `ws` | `ws` |
| `bot.streamPlaceholderContent` | string | 流式回复的占位文本 | "正在处理，请稍候..." |
| `bot.ws.botId` | string | Bot ID（即企业微信 AgentId） | - |
| `bot.ws.secret` | string | Bot 密钥 | - |

#### 2.2 Agent 配置

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `agent.enabled` | boolean | 是否启用 Agent | `true` |
| `agent.corpId` | string | 企业 ID（可在企业信息页面获取） | - |
| `agent.agentId` | number | Agent ID | - |
| `agent.agentSecret` | string | Agent 密钥 | - |
| `agent.token` | string | 设置用于接收消息的 Token | - |
| `agent.encodingAESKey` | string | 设置用于消息加解密的 AES Key | - |

## 完整配置示例

```jsonc
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
            "streamPlaceholderContent": "正在思考中...",
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

## 最佳实践

### 1. 安全配置

- 不要将敏感信息（如 Secret、AES Key）直接写在配置文件中
- 建议使用环境变量或密钥管理服务
- 示例使用环境变量：

```jsonc
{
  "channels": {
    "wecom": {
      "accounts": {
        "default": {
          "bot": {
            "ws": {
              "botId": "${WECOM_BOT_ID}",
              "secret": "${WECOM_BOT_SECRET}"
            }
          },
          "agent": {
            "corpId": "${WECOM_CORP_ID}",
            "agentSecret": "${WECOM_AGENT_SECRET}"
          }
        }
      }
    }
  }
}
```

### 2. 媒体配置

根据实际需求调整媒体文件大小限制：

```jsonc
{
  "channels": {
    "wecom": {
      "mediaMaxMb": 100,
      "media": {
        "tempDir": "/var/tmp/openclaw-wecom-media",
        "localRoots": ["/data/shared-files"]
      }
    }
  }
}
```

### 3. 多个账号配置

支持配置多个企业微信账号：

```jsonc
{
  "channels": {
    "wecom": {
      "enabled": true,
      "defaultAccount": "account1",
      "accounts": {
        "account1": {
          "name": "主账号",
          "bot": {
            "ws": {
              "botId": "BOT_ID_1",
              "secret": "SECRET_1"
            }
          }
        },
        "account2": {
          "name": "备用账号",
          "bot": {
            "ws": {
              "botId": "BOT_ID_2",
              "secret": "SECRET_2"
            }
          }
        }
      }
    }
  }
}
```
