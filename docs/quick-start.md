# 快速开始

本指南帮助你在最短时间内完成 `wecom` 插件接入并验证可用性。

## 前置条件

- 已安装并可使用 OpenClaw
- 拥有企业微信机器人或自建应用配置权限
- 可访问企业微信开放平台相关接口

## 1. 安装插件

```bash
openclaw plugins install @yanhaidao/wecom
openclaw plugins enable wecom
```

## 2. 通过向导快速接入（推荐）

```bash
openclaw channels add
```

在交互界面中：

1. 选择 `企业微信 (WeCom)`
2. 填写 `Bot ID` 与 `Secret`
3. 完成后等待连接建立

## 3. 验证运行状态

```bash
openclaw channels status --probe
```

重点确认：

- `configured=true`
- `running=true`
- `connected=true`
- `authenticated=true`

## 4. 最小可用配置示例（Bot WS）

将以下结构写入 `openclaw.json` 的 `channels.wecom`：

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

## 5. 生产推荐形态

- `Bot WS`：负责实时交互与流式体验
- `Agent`：负责正式通知、主动推送与兜底交付
- `dynamicAgents`：解决多用户、多群场景下的上下文串线问题

详细配置请继续阅读 [配置说明](./configuration)。
