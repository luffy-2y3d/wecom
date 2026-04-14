---
title: 菜单事件实现
nav_order: 6
---

# 菜单事件实现（配置 + 路由 + 脚本）

本页基于 `MENU_EVENT_PLAN.md` 与 `MENU_EVENT_CONF.md`，描述菜单事件从“收到回调”到“执行处理器”的完整流程。

## 1. 处理链路

1. 企业微信回调到 Agent。
2. 入站策略先判定：`eventEnabled` + `allowedEventTypes`。
3. 路由规则按顺序匹配 `routes`（首条命中即执行）。
4. handler 执行（内置/Node/Python）。
5. 根据 `action` 与 `chainToAgent` 决定回复与是否继续默认 AI 流程。

## 2. 路由匹配字段

`eventRouting.routes[].when` 支持：

- `eventType`
- `eventKey`
- `eventKeyPrefix`
- `eventKeyPattern`
- `changeType`

典型做法：

- 菜单按钮：`eventType=click + eventKey=某个固定值`
- 通讯录变更：`eventType=change_contact + changeType=create_user`

## 3. 脚本输入输出协议

脚本通过 `stdin` 收到完整 envelope（含 `message.raw`），通过 `stdout` 返回 JSON。

输入重点字段：

- `message.eventType`
- `message.eventKey`
- `message.fromUser`
- `message.raw`（原始解析字段全量透传）

输出重点字段：

- `action`: `none | reply_text`
- `reply.text`
- `chainToAgent`

## 4. 常见配置模板

```json
{
  "agent": {
    "inboundPolicy": {
      "eventEnabled": true,
      "eventPolicy": {
        "mode": "allowlist",
        "allowedEventTypes": ["click", "view", "scancode_push"]
      }
    },
    "eventRouting": {
      "unmatchedAction": "forwardToAgent",
      "routes": [
        {
          "id": "menu-help",
          "when": { "eventType": "click", "eventKey": "MENU_HELP" },
          "handler": { "type": "python_script", "entry": "./scripts/wecom/menu-click-help.py" }
        }
      ]
    },
    "scriptRuntime": {
      "enabled": true,
      "allowPaths": ["./scripts/wecom"],
      "defaultTimeoutMs": 5000,
      "pythonCommand": "python3",
      "nodeCommand": "node"
    }
  }
}
```

## 5. 与规划文档的对应关系

- 放通策略：对应 `MENU_EVENT_PLAN.md` 的 `inboundPolicy` 设计。
- 路由器与 handler：对应 `MENU_EVENT_PLAN.md` 的 `eventRouting` 与执行模型。
- 配置示例与脚本协议：对应 `MENU_EVENT_CONF.md` 的完整示例与输入输出格式。
