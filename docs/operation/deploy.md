---
layout: default
title: 部署与发布
parent: 部署运维
nav_order: 1
---

# 部署与发布

`wecom` 是 OpenClaw 的企业微信渠道插件，支持 `Bot WS` 与 `Agent` 双模式接入。

## 一、插件部署

### 1.1 安装插件

```bash
# 安装 wecom 插件
openclaw plugins install @yanhaidao/wecom

# 启用插件
openclaw plugins enable wecom
```

### 1.2 配置渠道

在 OpenClaw 的配置文件 `openclaw.json` 中添加 wecom 渠道配置：

```json
{
  "channels": {
    "wecom": {
      "enabled": true,
      "defaultAccount": "default",
      "accounts": {
        "default": {
          "enabled": true,
          "name": "default-wecom",
          "bot": {
            "primaryTransport": "ws",
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

### 1.3 启动服务

```bash
# 启动 OpenClaw
openclaw start

# 或使用 PM2（生产环境推荐）
pm2 start openclaw -- start
```

### 1.4 验证状态

```bash
# 检查渠道状态
openclaw channels status --probe
```

---

## 二、配置详解

### 2.1 Bot WS 配置

Bot WS 适合快速试用，无需固定公网 IP。

```json
{
  "bot": {
    "primaryTransport": "ws",
    "ws": {
      "botId": "YOUR_BOT_ID",
      "secret": "YOUR_BOT_SECRET"
    }
  }
}
```

### 2.2 Agent 配置

Agent 需要配置回调，适合正式生产环境。

```json
{
  "agent": {
    "corpId": "YOUR_CORP_ID",
    "agentId": 1000001,
    "agentSecret": "YOUR_AGENT_SECRET",
    "token": "YOUR_CALLBACK_TOKEN",
    "encodingAESKey": "YOUR_AES_KEY"
  }
}
```

### 2.3 推荐生产配置

同时使用 Bot + Agent，兼顾体验与能力：

```json
{
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
```

---

## 三、环境要求

| 要求 | 说明 |
|------|------|
| Node.js | v18+ |
| 网络 | 能够访问 qyapi.weixin.qq.com |
| Bot WS | 无需固定公网 IP |
| Agent | 需要固定公网 IP 用于接收回调 |

---

## 四、安全配置

### 4.1 使用环境变量

```bash
export WECOM_BOT_ID="your-bot-id"
export WECOM_BOT_SECRET="your-bot-secret"
```

配置中引用：
```json
{
  "bot": {
    "ws": {
      "botId": "${WECOM_BOT_ID}",
      "secret": "${WECOM_BOT_SECRET}"
    }
  }
}
```

### 4.2 防火墙配置（Agent 模式）

如果使用 Agent 模式接收回调，需要：
- 开放 80/443 端口
- 配置企业微信回调地址

---

## 五、运维命令

```bash
# 查看状态
openclaw channels status --probe

# 查看日志
openclaw channels logs --channel wecom --lines 200

# 重启渠道
openclaw channels restart wecom

# 升级插件
openclaw plugins update @yanhaidao/wecom
```

---

## 六、完整配置示例

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
            "streamPlaceholderContent": "正在思考中...",
            "ws": {
              "botId": "${WECOM_BOT_ID}",
              "secret": "${WECOM_BOT_SECRET}"
            }
          },
          "agent": {
            "corpId": "${WECOM_CORP_ID}",
            "agentId": 1000001,
            "agentSecret": "${WECOM_AGENT_SECRET}",
            "token": "${WECOM_TOKEN}",
            "encodingAESKey": "${WECOM_AES_KEY}"
          }
        }
      }
    }
  }
}
```
