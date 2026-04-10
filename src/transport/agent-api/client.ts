import type { ResolvedAgentAccount } from "../../types/index.js";
import { LIMITS } from "../../types/constants.js";
import {
  downloadMedia as downloadLegacyMedia,
  getAccessToken as getLegacyAccessToken,
  getUpstreamAccessToken as getLegacyUpstreamAccessToken,
  sendMedia as sendLegacyMedia,
  sendText as sendLegacyText,
} from "./core.js";

export async function getAgentApiAccessToken(agent: ResolvedAgentAccount): Promise<string> {
  return getLegacyAccessToken(agent);
}

export async function getUpstreamAgentApiAccessToken(params: {
  primaryAgent: ResolvedAgentAccount;
  upstreamCorpId: string;
  upstreamAgentId: number;
}): Promise<string> {
  return getLegacyUpstreamAccessToken(params);
}

export async function sendAgentApiText(params: {
  agent: ResolvedAgentAccount;
  toUser?: string;
  toParty?: string;
  toTag?: string;
  chatId?: string;
  text: string;
}): Promise<void> {
  await sendLegacyText(params);
}

export async function sendAgentApiMedia(params: {
  agent: ResolvedAgentAccount;
  toUser?: string;
  toParty?: string;
  toTag?: string;
  chatId?: string;
  mediaId: string;
  mediaType: "image" | "voice" | "video" | "file";
  title?: string;
  description?: string;
}): Promise<void> {
  await sendLegacyMedia(params);
}

export async function downloadAgentApiMedia(params: {
  agent: ResolvedAgentAccount;
  mediaId: string;
  maxBytes?: number;
}): Promise<{ buffer: Buffer; contentType: string; filename?: string }> {
  return downloadLegacyMedia(params);
}

/**
 * 发送文本消息给上下游用户
 * 使用下游企业的 access_token 和 agentId
 */
export async function sendUpstreamAgentApiText(params: {
  upstreamAgent: ResolvedAgentAccount;
  primaryAgent: ResolvedAgentAccount;
  toUser?: string;
  toParty?: string;
  toTag?: string;
  chatId?: string;
  text: string;
}): Promise<void> {
  const { upstreamAgent, primaryAgent, toUser, toParty, toTag, chatId, text } = params;

  // 获取下游企业的 access_token
  const token = await getUpstreamAgentApiAccessToken({
    primaryAgent,
    upstreamCorpId: upstreamAgent.corpId,
    upstreamAgentId: upstreamAgent.agentId!,
  });

  const useChat = Boolean(chatId);
  const url = useChat
    ? `https://qyapi.weixin.qq.com/cgi-bin/appchat/send?access_token=${encodeURIComponent(token)}`
    : `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${encodeURIComponent(token)}`;

  const body = useChat
    ? { chatid: chatId, msgtype: "text", text: { content: text } }
    : {
        touser: toUser,
        toparty: toParty,
        totag: toTag,
        msgtype: "text",
        agentid: upstreamAgent.agentId,
        text: { content: text },
      };

  const { wecomFetch } = await import("../../http.js");
  const { resolveWecomEgressProxyUrlFromNetwork } = await import("../../config/index.js");
  
  const res = await wecomFetch(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    {
      proxyUrl: resolveWecomEgressProxyUrlFromNetwork(upstreamAgent.network),
      timeoutMs: LIMITS.REQUEST_TIMEOUT_MS,
    },
  );
  
  const json = (await res.json()) as {
    errcode?: number;
    errmsg?: string;
    invaliduser?: string;
    invalidparty?: string;
    invalidtag?: string;
  };

  if (json?.errcode !== 0) {
    throw new Error(`send failed: ${json?.errcode} ${json?.errmsg}`);
  }

  if (json?.invaliduser || json?.invalidparty || json?.invalidtag) {
    const details = [
      json.invaliduser ? `invaliduser=${json.invaliduser}` : "",
      json.invalidparty ? `invalidparty=${json.invalidparty}` : "",
      json.invalidtag ? `invalidtag=${json.invalidtag}` : "",
    ]
      .filter(Boolean)
      .join(", ");
    throw new Error(`send partial failure: ${details}`);
  }
}

/**
 * 发送媒体消息给上下游用户
 * 使用下游企业的 access_token 和 agentId
 */
export async function sendUpstreamAgentApiMedia(params: {
  upstreamAgent: ResolvedAgentAccount;
  primaryAgent: ResolvedAgentAccount;
  toUser?: string;
  toParty?: string;
  toTag?: string;
  chatId?: string;
  mediaId: string;
  mediaType: "image" | "voice" | "video" | "file";
  title?: string;
  description?: string;
}): Promise<void> {
  const { upstreamAgent, primaryAgent, toUser, toParty, toTag, chatId, mediaId, mediaType, title, description } = params;
  
  // 获取下游企业的 access_token
  const token = await getUpstreamAgentApiAccessToken({
    primaryAgent,
    upstreamCorpId: upstreamAgent.corpId,
    upstreamAgentId: upstreamAgent.agentId!,
  });

  console.log(
    `[wecom-upstream-api] sendMedia corpId=${upstreamAgent.corpId} agentId=${upstreamAgent.agentId} ` +
      `toUser=${toUser ?? ""} mediaType=${mediaType}`,
  );

  const useChat = Boolean(chatId);
  const url = useChat
    ? `https://qyapi.weixin.qq.com/cgi-bin/appchat/send?access_token=${encodeURIComponent(token)}`
    : `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${encodeURIComponent(token)}`;

  const mediaPayload = mediaType === "video" 
    ? { media_id: mediaId, title: title ?? "Video", description: description ?? "" } 
    : { media_id: mediaId };
    
  const body = useChat
    ? { chatid: chatId, msgtype: mediaType, [mediaType]: mediaPayload }
    : {
        touser: toUser,
        toparty: toParty,
        totag: toTag,
        msgtype: mediaType,
        agentid: upstreamAgent.agentId,
        [mediaType]: mediaPayload,
      };

  const { wecomFetch } = await import("../../http.js");
  const { resolveWecomEgressProxyUrlFromNetwork } = await import("../../config/index.js");
  
  const res = await wecomFetch(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    {
      proxyUrl: resolveWecomEgressProxyUrlFromNetwork(upstreamAgent.network),
      timeoutMs: LIMITS.REQUEST_TIMEOUT_MS,
    },
  );
  
  const json = (await res.json()) as {
    errcode?: number;
    errmsg?: string;
    invaliduser?: string;
    invalidparty?: string;
    invalidtag?: string;
  };

  if (json?.errcode !== 0) {
    throw new Error(`send ${mediaType} failed: ${json?.errcode} ${json?.errmsg}`);
  }

  if (json?.invaliduser || json?.invalidparty || json?.invalidtag) {
    const details = [
      json.invaliduser ? `invaliduser=${json.invaliduser}` : "",
      json.invalidparty ? `invalidparty=${json.invalidparty}` : "",
      json.invalidtag ? `invalidtag=${json.invalidtag}` : "",
    ]
      .filter(Boolean)
      .join(", ");
    throw new Error(`send ${mediaType} partial failure: ${details}`);
  }
}
