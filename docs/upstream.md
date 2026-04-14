---
title: 上下游企业实现
nav_order: 6
---

# 上下游企业实现（识别 + 换 token + 发送）

本页基于 `UPSTREAM_PLAN.md` 与 `UPSTREAM_CONFIG.md`，说明上下游消息能力如何落地。

## 1. 为什么不能直接发

上下游企业 CorpID 不同，主企业 Agent 不能直接向下游企业用户发送消息，否则会遇到 `81013`（user & party & tag all invalid）。

## 2. 正确实现链路

1. 入站时识别用户是否来自上下游企业（比较消息 `ToUserName` 与主企业 `corpId`）。
2. 根据 `agent.upstreamCorps` 找到目标下游企业映射。
3. 使用主企业 token 调 `corpgroup/corp/gettoken` 换取下游企业 access_token。
4. 发送消息时使用下游企业 access_token + 下游企业 agentId。

## 3. 配置方法

```json
{
  "channels": {
    "wecom": {
      "accounts": {
        "default": {
          "agent": {
            "corpId": "<PRIMARY_CORP_ID>",
            "agentId": 1000001,
            "agentSecret": "<PRIMARY_AGENT_SECRET>",
            "token": "<CALLBACK_TOKEN>",
            "encodingAESKey": "<CALLBACK_AES_KEY>",
            "upstreamCorps": {
              "<UPSTREAM_CORP_ID>": {
                "corpId": "<UPSTREAM_CORP_ID>",
                "agentId": 1000022
              }
            }
          }
        }
      }
    }
  }
}
```

## 4. 如何准备下游企业映射

可以通过接口批量获取：

- `POST /cgi-bin/corpgroup/corp/list_app_share_info`
- 返回的 `corp_list[].corpid` 与 `corp_list[].agentid` 可直接转换为 `upstreamCorps`。

## 5. 排障重点

- `upstreamCorps` 是否配置了正确的 `corpId` 与 `agentId`。
- 下游企业是否已确认应用共享。
- 上游企业应用是否具备调用上下游接口权限。
- 日志里目标 corpId / agentId 是否和预期一致。
