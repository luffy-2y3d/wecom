---
layout: default
title: 排障指南
parent: 部署运维
nav_order: 2
---

# 排障指南

当出现连接失败、消息不回等问题时，按以下顺序排查。

## 1. 检查渠道状态

```bash
openclaw channels status --probe
```

重点检查：
- `configured=true` ✅
- `running=true` ✅
- `connected=true` ✅
- `authenticated=true` ✅

## 2. 查看日志

```bash
openclaw channels logs --channel wecom --lines 200
```

## 3. 常见问题

### 问题1：configured=false

检查配置文件是否正确：

```bash
cat ~/.openclaw/openclaw.json | jq .
```

### 问题2：connected=false

检查网络连接：

```bash
curl -I https://qyapi.weixin.qq.com
```

### 问题3：消息发送失败

查看发送日志：

```bash
openclaw channels logs --channel wecom --lines 100 | grep send
```

常见错误码：
- `40014` - 无效的access_token
- `40058` - 参数错误
- `40068` - 无效的agentid
- `81013` - 用户不在应用可见范围

## 4. 获取帮助

收集诊断信息：

```bash
openclaw diagnose > diagnose.txt
openclaw channels logs --channel wecom --lines 500 > logs.txt
```
