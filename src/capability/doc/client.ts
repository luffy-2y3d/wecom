#!/usr/bin/env node
/**
 * 企业微信文档插件 - WeCom Doc Client
 * 
 * 基于企微官方文档 API 实现
 * 文档：https://developer.work.weixin.qq.com/document/path/95449
 */

import type { ResolvedAgentAccount } from "../../types/index.js";
import { getAccessToken } from "../../transport/agent-api/core.js";
import { wecomFetch } from "../../http.js";
import { resolveWecomEgressProxyUrlFromNetwork } from "../../config/index.js";
import { LIMITS } from "../../types/constants.js";
import {
    BatchUpdateDocResponse,
    GetDocContentResponse,
    UpdateRequest
} from "./types.js";

function readString(value: unknown): string {
    return String(value ?? "").trim() || "";
}

function normalizeDocType(docType: unknown): 3 | 4 | 10 {
    if (docType === 3 || docType === "3") return 3;
    if (docType === 4 || docType === "4") return 4;
    if (docType === 10 || docType === "10" || docType === "5" || docType === "5") return 10;
    const normalized = readString(docType).toLowerCase();
    if (!normalized || normalized === "doc") return 3;
    if (normalized === "spreadsheet" || normalized === "sheet" || normalized === "table") return 4;
    if (normalized === "smart_table" || normalized === "smarttable") return 10;
    throw new Error(`Unsupported WeCom docType: ${String(docType)}`);
}

function mapDocTypeLabel(docType: 3 | 4 | 10): string {
    if (docType === 10) return "smart_table";
    if (docType === 4) return "spreadsheet";
    return "doc";
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readObject(value: unknown): Record<string, unknown> {
    return isRecord(value) ? value : {};
}

function readArray(value: unknown): unknown[] {
    return Array.isArray(value) ? value : [];
}

export interface DocMemberEntry {
    userid?: string;
    partyid?: string;
    tagid?: string;
    auth?: number;
}

function normalizeDocMemberEntry(value: unknown): DocMemberEntry | null {
    if (typeof value === "string" || typeof value === "number") {
        const userid = readString(value);
        return userid ? { userid } : null;
    }
    if (!isRecord(value)) return null;
    const entry: DocMemberEntry = { ...value } as DocMemberEntry;
    if (!readString(entry.userid) && readString(value.userId)) {
        entry.userid = readString(value.userId);
    }
    if (!readString(entry.userid) && !readString(entry.partyid) && !readString(entry.tagid)) {
        return null;
    }
    if (readString(entry.userid)) entry.userid = readString(entry.userid);
    if (readString(entry.partyid)) entry.partyid = readString(entry.partyid);
    if (readString(entry.tagid)) entry.tagid = readString(entry.tagid);
    if (entry.auth !== undefined) entry.auth = Number(entry.auth);
    return entry;
}

function normalizeDocMemberEntryList(values: unknown): DocMemberEntry[] {
    return readArray(values).map(normalizeDocMemberEntry).filter((v): v is DocMemberEntry => v !== null);
}

async function parseJsonResponse(res: Response, actionLabel: string): Promise<any> {
    let payload: any = null;
    try {
        payload = await res.json();
    } catch {
        if (!res.ok) throw new Error(`WeCom ${actionLabel} failed: HTTP ${res.status}`);
        throw new Error(`WeCom ${actionLabel} failed: invalid JSON`);
    }
    if (!payload || typeof payload !== "object") {
        throw new Error(`WeCom ${actionLabel} failed: empty response`);
    }
    if (!res.ok) {
        throw new Error(`WeCom ${actionLabel} failed: HTTP ${res.status}`);
    }
    if (Array.isArray(payload)) {
        const failed = payload.find((item) => Number(item?.errcode ?? 0) !== 0);
        if (failed) throw new Error(`WeCom ${actionLabel} failed: ${failed?.errmsg || "unknown"}`);
        return payload;
    }
    if (Number(payload.errcode ?? 0) !== 0) {
        throw new Error(`WeCom ${actionLabel} failed: ${payload.errmsg || "unknown"} (code: ${payload.errcode})`);
    }
    return payload;
}

export class WecomDocClient {
    private async postWecomDocApi(params: {
        path: string;
        actionLabel: string;
        agent: ResolvedAgentAccount;
        body: Record<string, unknown> | unknown[];
    }): Promise<any> {
        const { path, actionLabel, agent, body } = params;
        const token = await getAccessToken(agent);
        const url = `https://qyapi.weixin.qq.com${path}?access_token=${encodeURIComponent(token)}`;
        const proxyUrl = resolveWecomEgressProxyUrlFromNetwork(agent.network);

        let lastErr: any;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const res = await wecomFetch(url, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(body ?? {}),
                }, { proxyUrl, timeoutMs: LIMITS.REQUEST_TIMEOUT_MS });
                return await parseJsonResponse(res, actionLabel);
            } catch (err) {
                lastErr = err;
                if (attempt < 3) await new Promise(r => setTimeout(r, 1000));
            }
        }
        throw lastErr;
    }

    async createDoc(params: { 
        agent: ResolvedAgentAccount; 
        docName: string; 
        docType?: unknown; 
        spaceId?: string; 
        fatherId?: string; 
        adminUsers?: string[];
    }) {
        const { agent, docName, docType, spaceId, fatherId, adminUsers } = params;
        const normalizedDocType = normalizeDocType(docType);
        const payload: Record<string, unknown> = {
            doc_type: normalizedDocType,
            doc_name: readString(docName),
        };
        if (!payload.doc_name) throw new Error("docName required");
        if (spaceId) payload.spaceid = readString(spaceId);
        if (fatherId) payload.fatherid = readString(fatherId);
        if (adminUsers?.length) payload.admin_users = adminUsers.map(readString).filter(Boolean);
        
        const json = await this.postWecomDocApi({
            path: "/cgi-bin/wedoc/create_doc",
            actionLabel: "create_doc",
            agent,
            body: payload,
        });

        return {
            raw: json,
            docId: readString(json.docid),
            url: readString(json.url),
            docType: normalizedDocType,
            docTypeLabel: mapDocTypeLabel(normalizedDocType),
        };
    }

    async renameDoc(params: { agent: ResolvedAgentAccount; docId: string; newName: string }) {
        const { agent, docId, newName } = params;
        const payload = { docid: readString(docId), new_name: readString(newName) };
        if (!payload.docid) throw new Error("docId required");
        if (!payload.new_name) throw new Error("newName required");
        
        const json = await this.postWecomDocApi({
            path: "/cgi-bin/wedoc/rename_doc",
            actionLabel: "rename_doc",
            agent,
            body: payload,
        });
        return { raw: json, docId: payload.docid, newName: payload.new_name };
    }

    async getDocBaseInfo(params: { agent: ResolvedAgentAccount; docId: string }) {
        const { agent, docId } = params;
        const normalizedDocId = readString(docId);
        if (!normalizedDocId) throw new Error("docId required");
        
        const json = await this.postWecomDocApi({
            path: "/cgi-bin/wedoc/get_doc_base_info",
            actionLabel: "get_doc_base_info",
            agent,
            body: { docid: normalizedDocId },
        });
        return { raw: json, info: json.doc_base_info || {} };
    }

    async shareDoc(params: { agent: ResolvedAgentAccount; docId: string }) {
        const { agent, docId } = params;
        const normalizedDocId = readString(docId);
        if (!normalizedDocId) throw new Error("docId required");
        
        const json = await this.postWecomDocApi({
            path: "/cgi-bin/wedoc/doc_share",
            actionLabel: "doc_share",
            agent,
            body: { docid: normalizedDocId },
        });
        return { raw: json, shareUrl: readString(json.share_url) };
    }

    async getDocAuth(params: { agent: ResolvedAgentAccount; docId: string }) {
        const { agent, docId } = params;
        const normalizedDocId = readString(docId);
        if (!normalizedDocId) throw new Error("docId required");
        
        const json = await this.postWecomDocApi({
            path: "/cgi-bin/wedoc/doc_get_auth",
            actionLabel: "doc_get_auth",
            agent,
            body: { docid: normalizedDocId },
        });
        return {
            raw: json,
            accessRule: json.access_rule || {},
            docMembers: Array.isArray(json.doc_member_list) ? json.doc_member_list : [],
            coAuthList: Array.isArray(json.co_auth_list) ? json.co_auth_list : [],
        };
    }

    async deleteDoc(params: { agent: ResolvedAgentAccount; docId?: string; formId?: string }) {
        const { agent, docId, formId } = params;
        const payload: Record<string, string> = {};
        if (docId) payload.docid = readString(docId);
        if (formId) payload.formid = readString(formId);
        if (!payload.docid && !payload.formid) throw new Error("docId or formId required");
        
        const json = await this.postWecomDocApi({
            path: "/cgi-bin/wedoc/del_doc",
            actionLabel: "del_doc",
            agent,
            body: payload,
        });
        return { raw: json, docId: payload.docid || "", formId: payload.formid || "" };
    }

    async grantDocAccess(params: {
        agent: ResolvedAgentAccount;
        docId: string;
        viewers?: unknown;
        collaborators?: unknown;
        removeViewers?: unknown;
        removeCollaborators?: unknown;
        authLevel?: number;
    }) {
        const { agent, docId, viewers, collaborators, removeViewers, removeCollaborators, authLevel } = params;
        
        const payload: Record<string, unknown> = { docid: readString(docId) };
        if (!payload.docid) throw new Error("docId required");

        const normalizedViewers = normalizeDocMemberEntryList(viewers).map(v => ({ ...v, auth: v.auth ?? authLevel ?? 1 }));
        const normalizedCollaborators = normalizeDocMemberEntryList(collaborators).map(v => ({ ...v, auth: v.auth ?? authLevel ?? 2 }));
        const normalizedRemovedViewers = normalizeDocMemberEntryList(removeViewers);
        const normalizedRemovedCollaborators = normalizeDocMemberEntryList(removeCollaborators);

        if (normalizedViewers.length > 0) payload.update_file_member_list = normalizedViewers;
        if (normalizedCollaborators.length > 0) payload.update_co_auth_list = normalizedCollaborators;
        if (normalizedRemovedViewers.length > 0) payload.del_file_member_list = normalizedRemovedViewers;
        if (normalizedRemovedCollaborators.length > 0) payload.del_co_auth_list = normalizedRemovedCollaborators;

        const json = await this.postWecomDocApi({
            path: "/cgi-bin/wedoc/doc_grant_access",
            actionLabel: "doc_grant_access",
            agent,
            body: payload,
        });
        return { raw: json, docId: readString(docId) };
    }

    async getDocContent(params: { agent: ResolvedAgentAccount; docId: string }) {
        const { agent, docId } = params;
        const json = await this.postWecomDocApi({
            path: "/cgi-bin/wedoc/document/get",
            actionLabel: "get_doc_content",
            agent,
            body: { docid: readString(docId) },
        }) as GetDocContentResponse;
        
        return { raw: json, version: json.version, document: json.document };
    }

    /**
     * 更新文档内容
     * 
     * 企微官方 API：POST /cgi-bin/wedoc/document/batch_update
     * 
     * 核心限制：
     * - 原子性：任一操作失败则全部回滚
     * - 快照隔离：所有索引基于请求发送时的文档版本
     * - insert_text 必须指向已有 Run 元素，不能在空段落执行
     * - 最多 30 个操作/请求
     * 
     * 使用建议：
     * - 创建文档：使用 createDoc + init_content（最可靠）
     * - 更新文档：使用 batchMode=false（顺序模式，默认）
     * - 批量追加：使用 batchMode=true（仅适用于简单场景）
     */
    async updateDocContent(params: { 
        agent: ResolvedAgentAccount; 
        docId: string; 
        requests: UpdateRequest[]; 
        version?: number;
        batchMode?: boolean;
    }) {
        const { agent, docId, requests, version, batchMode = false } = params;
        const requestList = readArray(requests);
        
        if (requestList.length === 0) throw new Error("requests list cannot be empty");

        // 批量模式
        if (batchMode) {
            let currentVersion = version;
            if (currentVersion === undefined || currentVersion === null) {
                const content = await this.getDocContent({ agent, docId });
                currentVersion = content.version;
            }

            const json = await this.postWecomDocApi({
                path: "/cgi-bin/wedoc/document/batch_update",
                actionLabel: "update_doc_content",
                agent,
                body: { docid: readString(docId), requests: requestList, version: currentVersion },
            }) as BatchUpdateDocResponse;
            
            return { raw: json, batchMode: true };
        }

        // 顺序模式（默认）
        for (let i = 0; i < requestList.length; i++) {
            const content = await this.getDocContent({ agent, docId });
            await this.postWecomDocApi({
                path: "/cgi-bin/wedoc/document/batch_update",
                actionLabel: `update_doc_content (${i + 1}/${requestList.length})`,
                agent,
                body: { docid: readString(docId), requests: [requestList[i]], version: content.version },
            });
        }

        return { raw: { errcode: 0, errmsg: "ok" }, batchMode: false };
    }

    async getSheetProperties(params: { agent: ResolvedAgentAccount; docId: string }) {
        const { agent, docId } = params;
        const json = await this.postWecomDocApi({
            path: "/cgi-bin/wedoc/spreadsheet/get_sheet_properties",
            actionLabel: "get_sheet_properties",
            agent,
            body: { docid: readString(docId) },
        });
        return {
            raw: json,
            properties: json.properties || json.sheet_properties || json.sheet_list || [],
        };
    }

    async editSheetData(params: { 
        agent: ResolvedAgentAccount; 
        docId: string; 
        sheetId: string;
        startRow?: number;
        startColumn?: number;
        gridData?: any;
    }) {
        const { agent, docId, sheetId, startRow = 0, startColumn = 0, gridData } = params;
        
        const normalizedDocId = readString(docId);
        if (!normalizedDocId) throw new Error('docId required');
        
        const normalizedSheetId = readString(sheetId);
        if (!normalizedSheetId) throw new Error('sheetId required');
        
        const rows = (gridData?.rows || []).map((row: any) => ({
            values: (row.values || []).map((cell: any) => {
                if (cell && typeof cell === 'object' && cell.cell_value) return cell;
                return { cell_value: { text: String(cell ?? '') } };
            })
        }));
        
        const json = await this.postWecomDocApi({
            path: "/cgi-bin/wedoc/spreadsheet/batch_update",
            actionLabel: "spreadsheet_batch_update",
            agent,
            body: {
                docid: normalizedDocId,
                requests: [{
                    update_range_request: {
                        sheet_id: normalizedSheetId,
                        grid_data: { start_row: startRow, start_column: startColumn, rows }
                    }
                }]
            },
        });
        
        return { 
            raw: json, 
            docId: normalizedDocId,
            updatedCells: json.data?.responses?.[0]?.update_range_response?.updated_cells || 0
        };
    }

    async uploadDocImage(params: { 
        agent: ResolvedAgentAccount; 
        docId: string; 
        filePath?: string;
        base64_content?: string;
    }) {
        const { agent, docId, filePath, base64_content } = params;
        const fs = await import("node:fs");
        
        const normalizedDocId = readString(docId);
        if (!normalizedDocId) throw new Error("docId required");
        
        // Support both file path and base64 content
        let fileData: Buffer;
        let fileName = 'image.png';
        
        if (base64_content) {
            fileData = Buffer.from(base64_content, 'base64');
        } else if (filePath) {
            fileData = await fs.promises.readFile(filePath);
            fileName = filePath.split('/').pop() || 'image.png';
        } else {
            throw new Error("Either filePath or base64_content must be provided");
        }
        
        const token = await getAccessToken(agent);
        const url = `https://qyapi.weixin.qq.com/cgi-bin/wedoc/upload_doc_image?access_token=${encodeURIComponent(token)}`;
        const proxyUrl = resolveWecomEgressProxyUrlFromNetwork(agent.network);
        
        const formData = new FormData();
        formData.append('docid', normalizedDocId);
        formData.append('media', new Blob([fileData], { type: 'image/png' }), fileName);
        
        const res = await wecomFetch(url, { method: 'POST', body: formData }, { proxyUrl, timeoutMs: LIMITS.REQUEST_TIMEOUT_MS });
        const json = await parseJsonResponse(res, 'upload_doc_image');
        
        return {
            raw: json,
            url: readString(json.url),
            width: Number(json.width) || 0,
            height: Number(json.height) || 0,
            size: Number(json.size) || 0,
        };
    }
}
