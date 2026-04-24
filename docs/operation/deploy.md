---
layout: default
title: 部署与发布
parent: 部署运维
nav_order: 1
---

# 部署与发布

`wecom` 是 OpenClaw 的企业微信渠道插件，支持 `Bot WS` 与 `Agent` 双模式接入，适用于从快速试用到正式生产的多种场景。

## 一、核心价值

### 为什么选择这个插件？

| 你真正关心的事 | Bot 模式 | Agent 模式 | 本插件做法 |
|:---|:---|:---|:---|
| **先跑起来的速度** | ✅ 快，无需固定公网IP | ❌ 较重，需要正式应用配置 | ✅ 先用Bot起步，后续平滑补Agent |
| **实时聊天体验** | ✅ 最强，天然适合低延迟和流式回复 | ⚠️ 能收能发，但不是最佳对话入口 | ✅ 默认把实时交互交给Bot |
| **异步结果回推** | ✅ 可以，适合已建立会话内追发 | ✅ 可以 | ✅ 会话内追发优先Bot，必要时Agent兜底 |
| **组织级广播与冷启动触达** | ⚠️ 受会话边界约束 | ✅ 更适合 | ✅ 正式通知和广播走Agent |
| **企业微信协作能力** | ✅ 适合个人身份能力入口 | ✅ 适合应用身份能力入口 | ✅ 两种身份平面都兼容 |

## 二、部署方案

### 方案1：快速试用（推荐新手）

**适用场景**：快速验证功能、个人或小团队使用

**特点**：
- 只需配置 `Bot WS`
- 无需固定公网IP
- 5分钟内跑起来

**最低配置要求**：
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

**部署步骤**：
1. 安装OpenClaw：`npm install -g openclaw`
2. 安装插件：`openclaw plugins install @yanhaidao/wecom`
3. 启用插件：`openclaw plugins enable wecom`
4. 配置上面的最低配置
5. 启动：`openclaw start`

---

### 方案2：生产环境（推荐企业）

**适用场景**：正式生产、多人并发、需要稳定投递

**特点**：
- 同时配置 `Bot WS` + `Agent`
- 支持多人上下文隔离
- 支持组织级广播和通知
- 支持长任务不白跑

**完整配置示例**：
```jsonc
{
  "channels": {
    "wecom": {
      "enabled": true,
      "defaultAccount": "default",
      "accounts": {
        "default": {
          "enabled": true,
          "name": "production-wecom",
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

**部署步骤**：
1. 安装OpenClaw：`npm install -g openclaw`
2. 安装插件：`openclaw plugins install @yanhaidao/wecom`
3. 启用插件：`openclaw plugins enable wecom`
4. 配置完整生产配置
5. 使用PM2启动：`pm2 start openclaw -- start`
6. 配置开机自启：`pm2 startup` + `pm2 save`

---

### 方案3：高可用部署

**适用场景**：大团队、需要高可用性

**架构要求**：
- 多实例部署（建议2-4个实例）
- 负载均衡
- Redis集群（用于会话共享）
- 数据库（PostgreSQL/MySQL）

**额外配置**：
```jsonc
{
  "channels": {
    "wecom": {
      "sessionStore": {
        "type": "redis",
        "host": "your-redis-host",
        "port": 6379,
        "db": 0
      }
    }
  }
}
```

## 三、环境要求

### 软件依赖

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | v18+ | OpenClaw运行环境 |
| npm/yarn | 最新版 | 包管理器 |
| PM2 | 最新版 | 进程管理器（生产环境推荐） |

### 硬件要求

| 环境 | 内存 | CPU | 磁盘 |
|------|------|-----|------|
| 开发环境 | 1GB+ | 1核+ | 10GB+ |
| 生产环境 | 2GB+ | 2核+ | 50GB+ |

### 网络要求

- 能够访问 `qyapi.weixin.qq.com`
- 如果只用Bot WS：无需固定公网IP
- 如果需要Agent回调：需要固定公网IP + 配置防火墙

## 四、安全配置

### 1. 敏感信息管理

**推荐使用环境变量**：
```bash
export WECOM_BOT_ID="your-bot-id"
export WECOM_BOT_SECRET="your-bot-secret"
export WECOM_CORP_ID="your-corp-id"
export WECOM_AGENT_SECRET="your-agent-secret"
```

**配置引用环境变量**：
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
          }
        }
      }
    }
  }
}
```

### 2. 防火墙配置

如果使用Agent模式，需要：
- 开放80/443端口（用于接收企业微信回调）
- 配置Nginx反向代理（可选但推荐）
- 设置IP白名单（企业微信服务器IP）

### 3. 日志管理

**日志存储位置**：
- 默认：`~/.openclaw/logs/`
- 生产环境建议配置集中日志收集

**日志级别配置**：
```json
{
  "logging": {
    "level": "info",
    "format": "json",
    "destination": "/var/log/openclaw/"
  }
}
```

## 五、运维监控

### 1. 进程管理

**使用PM2管理**：
```bash
# 启动
pm2 start openclaw -- start

# 查看状态
pm2 status

# 查看日志
pm2 logs openclaw

# 重启
pm2 restart openclaw

# 开机自启
pm2 save
pm2 startup
```

### 2. 健康检查

**检查命令**：
```bash
# 检查渠道状态
openclaw channels status --probe

# 检查全局状态
openclaw status --deep

# 查看详细日志
openclaw channels logs --channel wecom --lines 200
```

### 3. 监控指标

| 指标 | 正常值 | 异常处理 |
|------|--------|----------|
| configured | true | 检查配置是否正确 |
| running | true | 重启服务 |
| connected | true | 检查网络连接 |
| authenticated | true | 检查凭证是否过期 |

## 六、升级维护

### 1. 升级插件

```bash
# 查看当前版本
openclaw plugins list

# 升级插件
openclaw plugins update @yanhaidao/wecom

# 重启服务
pm2 restart openclaw
```

### 2. 回滚版本

```bash
# 查看可用版本
openclaw plugins versions @yanhaidao/wecom

# 安装指定版本
openclaw plugins install @yanhaidao/wecom@x.x.x

# 重启服务
pm2 restart openclaw
```

### 3. 配置备份

定期备份 `openclaw.json`：
```bash
# 备份
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak.$(date +%Y%m%d)

# 恢复
cp ~/.openclaw/openclaw.json.bak.20240101 ~/.openclaw/openclaw.json
pm2 restart openclaw
```
