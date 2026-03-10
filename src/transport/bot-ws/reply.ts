import { generateReqId, type WsFrame, type BaseMessage, type EventMessage, type WSClient } from "@wecom/aibot-node-sdk";

import type { ReplyHandle, ReplyPayload } from "../../types/index.js";

export function createBotWsReplyHandle(params: {
  client: WSClient;
  frame: WsFrame<BaseMessage | EventMessage>;
  accountId: string;
  onDeliver?: () => void;
  onFail?: (error: unknown) => void;
}): ReplyHandle {
  let streamId: string | undefined;
  const resolveStreamId = () => {
    streamId ||= generateReqId("stream");
    return streamId;
  };

  let ackSent = false;
  const ackTimer = setTimeout(() => {
    if (ackSent) return;
    ackSent = true;
    params.client.replyStream(params.frame, resolveStreamId(), "⏳ 正在思考中...\n\n", false)
      .catch(() => { /* ignore */ });
  }, 4000);

  const cleanupTimer = () => clearTimeout(ackTimer);

  return {
    context: {
      transport: "bot-ws",
      accountId: params.accountId,
      reqId: params.frame.headers.req_id,
      raw: {
        transport: "bot-ws",
        command: params.frame.cmd,
        headers: params.frame.headers,
        body: params.frame.body,
        envelopeType: "ws",
      },
    },
    deliver: async (payload: ReplyPayload, info) => {
      if (payload.isReasoning) return;
      
      const text = payload.text?.trim();
      if (!text) return;

      if (!ackSent) {
        cleanupTimer();
        ackSent = true;
      }
      
      await params.client.replyStream(params.frame, resolveStreamId(), text, info.kind === "final");
      params.onDeliver?.();
    },
    fail: async (error: unknown) => {
      cleanupTimer();
      ackSent = true;
      const message = error instanceof Error ? error.message : String(error);
      await params.client.replyStream(params.frame, resolveStreamId(), `WeCom WS reply failed: ${message}`, true);
      params.onFail?.(error);
    },
  };
}
