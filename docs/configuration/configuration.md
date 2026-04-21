---
title: 配置详解
parent: 配置说明
nav_order: 1
---

# 配置说明

本页详细说明 `channels.wecom` 的配置字段、使用场景和最佳实践，帮助你根据实际需求进行合理配置。

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
| `agent.enabled` | boolean | 是否启用 Agent | `false` |
| `agent.corpId` | string | 企业微信企业 ID | - |
| `agent.agentId` | number | 企业微信应用 AgentId | - |
| `agent.agentSecret` | string | 企业微信应用密钥 | - |
| `agent.token` | string | 回调验证 token | - |
| `agent.encodingAESKey` | string | 消息加密密钥 | - |

### 3. 媒体配置

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `mediaMaxMb` | number | 媒体文件大小上限（MB） | 50 |
| `media.tempDir` | string | 临时媒体文件存储目录 | "/tmp/openclaw-wecom-media" |
| `media.localRoots` | array | 允许读取的本地媒体目录列表 | [] |

### 4. 动态会话隔离

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `dynamicAgents.enabled` | boolean | 是否启用动态会话隔离 | `false` |
| `dynamicAgents.dmCreateAgent` | boolean | 是否为单聊创建独立 Agent | `true` |
| `dynamicAgents.groupEnabled` | boolean | 是否为群聊启用动态隔离 | `true` |
| `dynamicAgents.adminUsers` | array | 管理员用户列表（企业微信用户 ID） | [] |

## 配置场景与最佳实践

### 场景 1：快速试用（最小配置）

**适用场景**：个人测试、功能验证

**配置要点**：
- 仅配置 Bot WS
- 不启用动态会话隔离
- 最小化配置项

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

### 场景 2：团队协作（标准配置）

**适用场景**：小团队日常使用、部门内部协作

**配置要点**：
- 同时配置 Bot WS 和 Agent
- 启用动态会话隔离
- 配置媒体支持

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
          },
          "agent": {
            "enabled": true,
            "corpId": "YOUR_CORP_ID",
            "agentId": 1000001,
            "agentSecret": "YOUR_AGENT_SECRET"
          }
        }
      },
      "dynamicAgents": {
        "enabled": true
      }
    }
  }
}
```

### 场景 3：企业级部署（完整配置）

**适用场景**：大型企业、多部门使用

**配置要点**：
- 完整配置 Bot WS 和 Agent
- 启用动态会话隔离
- 配置媒体支持和安全设置
- 考虑多账号配置

```json
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
            "enabled": true,
            "corpId": "YOUR_CORP_ID",
            "agentId": 1000001,
            "agentSecret": "YOUR_AGENT_SECRET",
            "token": "YOUR_AGENT_TOKEN",
            "encodingAESKey": "YOUR_ENCODING_AES_KEY"
          }
        }
      },
      "mediaMaxMb": 50,
      "media": {
        "tempDir": "/tmp/openclaw-wecom-media",
        "localRoots": ["/srv/company-share"]
      },
      "dynamicAgents": {
        "enabled": true,
        "dmCreateAgent": true,
        "groupEnabled": true,
        "adminUsers": ["user1", "user2"]
      }
    }
  }
}
```

## dynamicAgents 配置详解

### 什么是动态会话隔离

动态会话隔离是一种机制，它为每个用户或群聊创建独立的会话上下文，避免不同用户之间的上下文串扰。

### 何时开启 dynamicAgents

**建议开启**：
- 多个同事共用一个机器人
- 多群长期协作且上下文隔离要求高
- 企业级部署，需要严格的会话管理

**可暂不开启**：
- 单人 PoC 演示
- 仅验证最小链路连通性
- 资源受限的环境

### 配置参数说明

- `dmCreateAgent`：是否为单聊创建独立 Agent，建议开启
- `groupEnabled`：是否为群聊启用动态隔离，建议开启
- `adminUsers`：管理员用户列表，这些用户可以管理所有会话

## 媒体配置详解

### 媒体文件处理

- `mediaMaxMb`：设置媒体文件大小上限，根据企业微信限制，建议不超过 50MB
- `media.tempDir`：临时存储媒体文件的目录，确保该目录有足够的磁盘空间
- `media.localRoots`：允许机器人访问的本地文件目录列表，用于读取本地媒体文件

### 安全建议

- 不要将敏感目录添加到 `localRoots`
- 定期清理 `tempDir` 中的临时文件
- 合理设置 `mediaMaxMb`，避免占用过多磁盘空间

## 上下游企业消息互通

如需给上下游企业用户发消息，可在 `agent.upstreamCorps` 追加企业映射：

```json
{
  "agent": {
    "upstreamCorps": {
      "UPSTREAM_CORP_ID": {
        "corpId": "UPSTREAM_CORP_ID",
        "agentId": 1000022
      }
    }
  }
}
```

完整说明见仓库根目录 `UPSTREAM_CONFIG.md`。

## 配置验证

配置完成后，使用以下命令验证配置是否正确：

```bash
openclaw channels status --probe
```

确保所有状态字段都显示为 `true`，特别是 `configured`、`running`、`connected` 和 `authenticated`。

## 故障排查

### 常见配置问题

1. **Bot ID 和 Secret 错误**：检查企业微信应用的 AgentId 和 Secret 是否正确
2. **Agent 配置错误**：确保 `corpId`、`agentId` 和 `agentSecret` 匹配企业微信后台配置
3. **权限不足**：检查企业微信应用是否有足够的权限
4. **网络问题**：确保服务器可以访问企业微信 API

### 日志查看

遇到配置问题时，查看 OpenClaw 日志以获取详细信息：

```bash
openclaw logs
```

## 最佳实践总结

1. **循序渐进**：从最小配置开始，逐步添加功能
2. **双模式部署**：同时使用 Bot WS 和 Agent，兼顾实时性和可靠性
3. **会话隔离**：对于多用户场景，启用动态会话隔离
4. **安全配置**：合理设置媒体目录和权限
5. **定期备份**：定期备份配置文件，以防配置丢失
6. **监控告警**：设置适当的监控，及时发现和处理问题
