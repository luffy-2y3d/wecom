---
layout: default
title: 排障指南
parent: 部署运维
nav_order: 2
---

# 排障指南

当出现连接失败、消息不回或媒体发送异常时，建议按本页顺序排查。

## 1. 快速诊断

### 1.1 一键诊断

执行以下命令快速诊断问题：

```bash
openclaw channels status --probe
```

### 1.2 查看详细状态

```bash
openclaw status --deep
```

### 1.3 查看实时日志

```bash
# 查看最近200行日志
openclaw channels logs --channel wecom --lines 200

# 实时查看日志
openclaw channels logs --channel wecom --follow
```

---

## 2. 常见问题及解决方案

### 问题1：configured=false

**原因**：配置未正确加载

**排查步骤**：
1. 检查配置文件是否存在：`cat ~/.openclaw/openclaw.json`
2. 检查JSON格式是否正确：`jq . ~/.openclaw/openclaw.json`
3. 检查渠道名称是否匹配（应为 `wecom`）

**解决方案**：
```bash
# 验证配置
openclaw config validate

# 重启服务
pm2 restart openclaw
```

---

### 问题2：running=false

**原因**：服务未正常启动

**排查步骤**：
1. 检查进程状态：`pm2 status`
2. 查看启动日志：`pm2 logs openclaw --err`

**解决方案**：
```bash
# 重启服务
pm2 restart openclaw

# 如果启动失败，查看详细错误
pm2 logs openclaw --err --lines 100
```

---

### 问题3：connected=false

**原因**：无法连接到企业微信服务器

**排查步骤**：
1. 检查网络连接：`curl -I https://qyapi.weixin.qq.com`
2. 检查防火墙规则
3. 检查DNS解析：`nslookup qyapi.weixin.qq.com`

**解决方案**：
```bash
# 测试网络连通性
curl -v https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=YOUR_CORP_ID&corpsecret=YOUR_SECRET

# 检查端口
telnet qyapi.weixin.qq.com 443
```

**常见原因**：
- 网络不通或DNS解析失败
- 防火墙阻止了出站连接
- 企业微信API域名被DNS污染

---

### 问题4：authenticated=false

**原因**：身份验证失败

**排查步骤**：
1. 检查Bot凭证：`openclaw channels status --probe | grep botId`
2. 检查Secret是否正确
3. 检查Bot是否已启用

**解决方案**：
```bash
# 手动验证凭证
curl "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=YOUR_CORP_ID&corpsecret=YOUR_SECRET"

# 检查返回码是否为0，access_token是否有效
```

---

## 3. 消息相关问题

### 问题5：消息发送失败

**排查步骤**：
1. 查看发送日志：`openclaw channels logs --channel wecom --lines 100 | grep send`
2. 检查错误码

**常见错误码**：

| 错误码 | 含义 | 解决方案 |
|--------|------|----------|
| 40014 | 无效的access_token | 重新获取token |
| 40058 | 参数错误 | 检查消息格式 |
| 40068 | 无效的agentid | 检查agentId配置 |
| 41004 | secret错误 | 检查secret配置 |
| 81013 | 用户不可见 | 用户不在应用可见范围 |

---

### 问题6：消息发送延迟

**原因**：
- 网络延迟
- 消息队列积压
- Token刷新频繁

**排查步骤**：
```bash
# 检查消息队列
openclaw status | grep queue

# 检查Token刷新频率
openclaw channels logs --channel wecom --lines 100 | grep token
```

**解决方案**：
```json
{
  "channels": {
    "wecom": {
      "accounts": {
        "default": {
          "tokenCache": {
            "enabled": true,
            "ttl": 7200
          }
        }
      }
    }
  }
}
```

---

## 4. 媒体文件问题

### 问题7：图片发送失败

**原因**：
- 文件不存在
- 文件路径配置错误
- 文件大小超限

**排查步骤**：
```bash
# 检查文件是否存在
ls -lh /path/to/image.png

# 检查media配置
openclaw channels status --probe | grep media
```

**解决方案**：
```json
{
  "channels": {
    "wecom": {
      "mediaMaxMb": 50,
      "media": {
        "tempDir": "/tmp/openclaw-wecom-media",
        "localRoots": ["/srv/shared", "/data/reports"]
      }
    }
  }
}
```

---

### 问题8：文件路径不可访问

**原因**：`localRoots` 未包含文件所在目录

**排查步骤**：
```bash
# 检查文件实际路径
openclaw channels logs --channel wecom --lines 100 | grep "file not in allowed"
```

**解决方案**：在 `media.localRoots` 中添加文件目录：
```json
{
  "media": {
    "localRoots": [
      "/srv/shared",
      "/data/reports",
      "/your/file/path"
    ]
  }
}
```

---

## 5. 多人使用问题

### 问题9：上下文串线

**原因**：会话隔离未正确配置

**排查步骤**：
```bash
# 检查dynamicAgents配置
openclaw channels status --probe | grep dynamicAgents

# 检查会话隔离状态
openclaw status | grep session
```

**解决方案**：
```json
{
  "dynamicAgents": {
    "enabled": true,
    "dmCreateAgent": true,
    "groupEnabled": true,
    "adminUsers": ["admin_user_1", "admin_user_2"]
  }
}
```

---

### 问题10：长任务失败

**原因**：连接超时

**排查步骤**：
```bash
# 查看任务超时日志
openclaw channels logs --channel wecom --lines 100 | grep timeout
```

**解决方案**：
```json
{
  "channels": {
    "wecom": {
      "accounts": {
        "default": {
          "taskTimeout": 300,
          "streamPlaceholderContent": "正在思考中，请稍候..."
        }
      }
    }
  }
}
```

---

## 6. 获取帮助

### 6.1 收集诊断信息

执行以下命令收集完整诊断信息：

```bash
# 创建诊断报告
openclaw diagnose > diagnose.txt

# 查看完整配置（脱敏）
openclaw config show --mask > config_masked.txt
```

### 6.2 联系支持

将以下信息发送给技术支持：
1. 诊断报告：`diagnose.txt`
2. 脱敏配置：`config_masked.txt`
3. 最近日志：`openclaw channels logs --channel wecom --lines 500 > logs.txt`

### 6.3 GitHub Issues

如遇到Bug，请在GitHub提交Issue：
- 仓库地址：https://github.com/YanHaidao/wecom
- 请附上诊断信息和复现步骤
