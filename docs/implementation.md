---
title: 功能实现原理
nav_order: 4
---

# 功能实现原理（代码与配置映射）

本文档聚焦“功能是怎么实现的”，并把你关心的四份方案文档映射到可执行配置。

## 一、菜单事件能力如何实现

来源：

- `MENU_EVENT_PLAN.md`
- `MENU_EVENT_CONF.md`

实现分三层：

1. **放通层**：通过 `inboundPolicy.eventEnabled` 与 `eventPolicy.allowedEventTypes` 决定哪些 `event` 能进入处理链路。
2. **路由层**：通过 `eventRouting.routes[].when` 做条件匹配（`eventType` / `eventKey` / `eventKeyPrefix` / `eventKeyPattern` / `changeType`）。
3. **执行层**：通过 `handler` 执行 `builtin`、`node_script`、`python_script`。

最终行为由这几个字段决定：

- `eventRouting.unmatchedAction`：未命中路由后是 `ignore` 还是 `forwardToAgent`。
- `handler.chainToAgent` 与脚本返回 `chainToAgent`：两者任意一方是 `true`，都会继续进入默认 Agent 流程。

## 二、上下游企业能力如何实现

来源：

- `UPSTREAM_PLAN.md`
- `UPSTREAM_CONFIG.md`

核心是“下游用户不能直接用主企业 Agent 发送”，所以要走下游 token：

1. 入站时通过消息 `ToUserName`（CorpID）与主企业 `corpId` 对比，识别是否上下游用户。
2. 从 `agent.upstreamCorps` 找到该下游企业映射（`corpId + agentId`）。
3. 用主企业 access_token 调 `corpgroup/corp/gettoken` 获取下游企业 access_token。
4. 出站阶段使用下游企业 access_token + 下游 `agentId` 发消息。

也就是：**识别目标企业 -> 换下游 token -> 用下游身份发送**。

## 三、你应该怎么配置

### 1) 菜单事件（最小可用）

```json
{
  "agent": {
    "inboundPolicy": {
      "eventEnabled": true,
      "eventPolicy": {
        "mode": "allowlist",
        "allowedEventTypes": ["click", "view", "scancode_push", "location_select"]
      }
    },
    "eventRouting": {
      "unmatchedAction": "forwardToAgent",
      "routes": [
        {
          "id": "menu-help",
          "when": { "eventType": "click", "eventKey": "MENU_HELP" },
          "handler": { "type": "node_script", "entry": "./scripts/wecom/menu-click-help.js" }
        }
      ]
    },
    "scriptRuntime": {
      "enabled": true,
      "allowPaths": ["./scripts/wecom"],
      "defaultTimeoutMs": 5000
    }
  }
}
```

### 2) 上下游企业（最小可用）

```json
{
  "agent": {
    "corpId": "<PRIMARY_CORP_ID>",
    "agentId": 1000001,
    "agentSecret": "<PRIMARY_AGENT_SECRET>",
    "upstreamCorps": {
      "<UPSTREAM_CORP_ID>": {
        "corpId": "<UPSTREAM_CORP_ID>",
        "agentId": 1000022
      }
    }
  }
}
```

## 四、推荐阅读顺序

1. 先看 [菜单事件实现](./menu-event)。
2. 再看 [上下游企业实现](./upstream)。
3. 回到 [配置说明](./configuration) 合并成最终生产配置。
