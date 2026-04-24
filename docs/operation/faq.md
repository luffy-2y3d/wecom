---
layout: default
title: 常见问题
parent: 部署运维
nav_order: 3
---

# 常见问题（FAQ）

## 一、部署相关

### Q1：需要什么环境才能运行？

**最低要求**：
- Node.js v18+
- 内存：1GB+
- 网络：能够访问 `qyapi.weixin.qq.com`

**快速试用**：只需Bot WS模式，无需固定公网IP
**生产环境**：建议Bot WS + Agent模式，需要固定公网IP用于接收回调

---

### Q2：Bot WS和Agent有什么区别？

| 对比项 | Bot WS | Agent |
|--------|--------|-------|
| 配置难度 | ⭐ 简单，5分钟配置 | ⭐⭐⭐ 较复杂 |
| 对话体验 | ⭐⭐⭐ 最佳，实时流式 | ⭐⭐ 良好 |
| 公网要求 | 无需固定IP | 需要固定IP+回调配置 |
| 消息发送 | 会话内追发 | 主动推送+回调 |
| 适合场景 | 实时聊天 | 组织通知+自动化 |

**推荐**：先用Bot WS跑起来，后续平滑补Agent

---

### Q3：为什么建议同时配置Bot和Agent？

本插件的核心价值在于**兼顾体验与能力**：

- **Bot WS**：负责实时对话、流式回复
- **Agent**：负责组织级通知、正式投递兜底

两者并存 = 体验好 + 能力全

---

### Q4：多人同时使用会串上下文吗？

**不会！** 本插件的核心特性之一就是**多人上下文隔离**：

- 按 `(底层账号 + 部门/群组/人员)` 动态切分运行上下文
- 同一个企业微信入口可以承接多人并发使用
- 不会出现"张三的问题让李四接上回答"的串流灾难

---

### Q5：长任务会不会白跑？

**不会！** 本插件专门处理了这个问题：

- 先保活，再流式推进
- 必要时走备用投递路径
- 把最终结果交付出去

---

## 二、配置相关

### Q6：最少要配什么？

**最低配置**：只需一个Bot WS账号
```json
{
  "bot": {
    "ws": {
      "botId": "YOUR_BOT_ID",
      "secret": "YOUR_BOT_SECRET"
    }
  }
}
```

5分钟内就能跑起来！

---

### Q7：敏感信息怎么管理？

**推荐使用环境变量**：
```bash
export WECOM_BOT_ID="your-bot-id"
export WECOM_BOT_SECRET="your-bot-secret"
```

在配置中引用：
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

---

### Q8：Bot凭证和Agent凭证有什么区别？

| 对比项 | Bot凭证 | Agent凭证 |
|--------|---------|-----------|
| 获取位置 | 企业微信应用详情 | 企业微信应用详情 |
| 用途 | Bot WS认证 | API调用认证 |
| 失效影响 | 无法收发消息 | 无法主动推送 |

---

## 三、功能相关

### Q9：如何给上下游企业用户发消息？

在配置中添加 `upstreamCorps`：
```json
{
  "agent": {
    "upstreamCorps": {
      "DOWNSTREAM_CORP_KEY": {
        "corpId": "DOWNSTREAM_CORP_ID",
        "agentId": DOWNSTREAM_AGENT_ID
      }
    }
  }
}
```

详细配置见：[上下游企业实现](../upstream/upstream)

---

### Q10：如何配置菜单事件？

在配置中添加 `eventRouting`：
```json
{
  "agent": {
    "eventRouting": {
      "unmatchedAction": "forwardToAgent",
      "routes": [
        {
          "id": "test-click",
          "when": {
            "eventType": "click",
            "eventKey": "TEST_KEY"
          },
          "handler": {
            "type": "node_script",
            "script": "console.log(event);"
          }
        }
      ]
    }
  }
}
```

详细配置见：[菜单事件实现](../functionality/menu-event)

---

### Q11：本地文件发送失败怎么办？

检查两点：
1. **路径配置**：文件路径必须在 `media.localRoots` 中
```json
{
  "media": {
    "localRoots": ["/srv/shared", "/data/reports"]
  }
}
```

2. **文件大小**：不能超过 `mediaMaxMb` 限制

---

## 四、运维相关

### Q12：服务启动失败怎么办？

**排查步骤**：
```bash
# 1. 检查配置
openclaw config validate

# 2. 查看错误日志
pm2 logs openclaw --err

# 3. 重启服务
pm2 restart openclaw
```

---

### Q13：如何升级插件？

```bash
# 查看当前版本
openclaw plugins list

# 升级
openclaw plugins update @yanhaidao/wecom

# 重启
pm2 restart openclaw
```

---

### Q14：如何备份配置？

```bash
# 备份
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak.$(date +%Y%m%d)

# 恢复
cp ~/.openclaw/openclaw.json.bak.20240101 ~/.openclaw/openclaw.json
pm2 restart openclaw
```

---

### Q15：如何监控服务状态？

```bash
# 检查状态
openclaw channels status --probe

# 查看指标
# - configured=true ✅
# - running=true ✅
# - connected=true ✅
# - authenticated=true ✅
```

---

## 五、更多帮助

### 需要技术支持？

1. **查看文档**：https://yanhaidao.github.io/wecom/
2. **GitHub Issues**：https://github.com/YanHaidao/wecom/issues
3. **提交Issue**：请附上诊断信息和复现步骤

### 收集诊断信息

```bash
# 创建诊断报告
openclaw diagnose > diagnose.txt

# 查看日志
openclaw channels logs --channel wecom --lines 500 > logs.txt
```
