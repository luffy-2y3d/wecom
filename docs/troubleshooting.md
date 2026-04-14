# 排障指南

当出现连接失败、消息不回或媒体发送异常时，建议按本页顺序排查。

## 1. 先看渠道状态

```bash
openclaw channels status --probe
```

优先确认：

- `configured=true`
- `running=true`
- `connected=true`
- `authenticated=true`

## 2. 再看全局健康

```bash
openclaw status --deep
```

用于判断问题是否来自插件外部（网关、网络、系统状态等）。

## 3. 最后看 WeCom 日志

```bash
openclaw channels logs --channel wecom --lines 200
```

常见日志命名空间：

- `[wecom-runtime]`：消息接收、分发、回发主链路
- `[wecom-ws]`：WebSocket 建连、鉴权、重连
- `[wecom-agent-delivery]`：Agent 主动发送与媒体下发

## 4. 常见问题快速判断

- `configured=false`：配置字段缺失或格式错误
- `running=false`：服务未正常启动或初始化失败
- `connected=false`：Bot WS 网络、凭证、握手问题
- 能收不能发：多为 Agent 凭证、目标路由或媒体限制问题

## 5. 媒体发送失败排查

按顺序检查：

1. 本地路径是否在 `media.localRoots` 或默认白名单内
2. 文件大小是否超过 `mediaMaxMb`
3. 企业微信侧是否允许该媒体类型与大小
4. 文件是否可读、URL 是否可访问
