---
layout: default
title: 排障指南
parent: 部署运维
nav_order: 2
---

# 排障指南

当出现连接失败、消息不回或媒体发送异常时，建议按本页顺序排查。

## 1. 检查渠道状态

### 1.1 查看详细状态

```bash
openclaw channels status --probe
```

### 1.2 重点检查字段

优先确认：

- `configured=true`：配置是否正确
- `running=true`：服务是否正常运行
- `connected=true`：是否成功连接到企业微信
- `authenticated=true`：身份验证是否成功

## 2. 检查全局健康状态

### 2.1 查看整体状态

```bash
openclaw status --deep
```

### 2.2 分析目的

用于判断问题是否来自插件外部（网关、网络、系统状态等）。

## 3. 查看 WeCom 日志

### 3.1 查看日志命令

```bash
openclaw channels logs --channel wecom --lines 200
```

### 3.2 常见日志命名空间

- `[wecom-runtime]`：消息接收、分发、回发主链路
- `[wecom-ws]`：WebSocket 建连、鉴权、重连
- `[wecom-agent-delivery]`：Agent 主动发送与媒体下发

### 3.3 日志分析要点

- 查找 `ERROR` 或 `WARN` 级别日志
- 关注错误码和错误信息
- 检查时间戳，确定问题发生的时间点

## 4. 常见问题快速判断

### 4.1 状态字段分析

| 状态字段 | 可能原因 | 解决方法 |
|---------|---------|----------|
| `configured=false` | 配置字段缺失或格式错误 | 检查配置文件，确保所有必填字段都已正确设置 |
| `running=false` | 服务未正常启动或初始化失败 | 检查启动日志，查看具体错误信息 |
| `connected=false` | Bot WS 网络、凭证、握手问题 | 检查网络连接，确认 Bot ID 和 Secret 正确 |
| `authenticated=false` | 身份验证失败 | 检查企业微信凭证是否有效 |

### 4.2 功能问题分析

- **能收不能发**：多为 Agent 凭证、目标路由或媒体限制问题
- **消息延迟**：可能是网络延迟或处理队列积压
- **消息丢失**：检查企业微信消息限制和网络稳定性

## 5. 媒体发送失败排查

### 5.1 排查步骤

按顺序检查：

1. 本地路径是否在 `media.localRoots` 或默认白名单内
2. 文件大小是否超过 `mediaMaxMb`
3. 企业微信侧是否允许该媒体类型与大小
4. 文件是否可读、URL 是否可访问

### 5.2 常见媒体问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 媒体文件过大 | 超过企业微信限制或配置的 `mediaMaxMb` | 减小文件大小或调整配置 |
| 媒体类型不支持 | 企业微信不支持该类型的媒体文件 | 转换为支持的格式 |
| 本地路径不可访问 | 文件不在允许的目录内 | 将文件移动到 `media.localRoots` 配置的目录 |
| 网络访问失败 | 外部 URL 无法访问 | 检查网络连接和 URL 有效性 |

## 6. 网络问题排查

### 6.1 网络连通性检查

```bash
# 检查企业微信 API 访问
ping qyapi.weixin.qq.com

# 检查网络延迟
curl -I https://qyapi.weixin.qq.com
```

### 6.2 代理设置检查

如果使用代理，确保代理配置正确，并且能够访问企业微信 API。

## 7. 配置问题排查

### 7.1 配置文件检查

- 确保 `openclaw.json` 格式正确
- 检查所有必填字段是否已设置
- 验证凭证信息是否正确

### 7.2 配置验证

```bash
# 验证配置文件格式
openclaw config validate
```

## 8. 企业微信权限问题

### 8.1 检查应用权限

1. 登录企业微信管理后台
2. 进入应用管理页面
3. 检查应用权限设置
4. 确保开启必要的权限（如消息推送、读取消息等）

### 8.2 常见权限错误

- **48001**：api unauthorized - 应用未获得对应接口的调用权限
- **40013**：invalid corpid - CorpID 不合法
- **40001**：invalid credential - 凭证无效

## 9. 高级排障

### 9.1 启用调试模式

```bash
# 启用调试日志
openclaw config set --debug true

# 重启服务
openclaw restart
```

### 9.2 抓包分析

对于复杂的网络问题，可以使用抓包工具（如 Wireshark、tcpdump）分析网络流量。

### 9.3 联系支持

如果问题无法解决，可以：
1. 查看 [常见问题](./faq) 文档
2. 检查 OpenClaw 官方文档
3. 联系技术支持
