---
layout: default
title: 快速开始
parent: 快速开始
nav_order: 1
---

# 快速开始

本指南帮助你在最短时间内完成 `wecom` 插件接入并验证可用性，包含详细的步骤说明和常见问题处理。

## 前置条件

- **OpenClaw 环境**：已安装并可使用 OpenClaw v2026.3.23-2 或更高版本
- **企业微信权限**：拥有企业微信机器人创建或自建应用配置权限
- **网络访问**：可访问企业微信开放平台相关接口（确保网络环境可访问 `qyapi.weixin.qq.com`）
- **基本工具**：终端或命令行工具，用于执行 OpenClaw 命令

## 1. 安装插件

打开终端，执行以下命令：

```bash
# 安装 wecom 插件
openclaw plugins install @yanhaidao/wecom

# 启用插件
openclaw plugins enable wecom
```

安装完成后，你应该会看到插件安装成功的提示信息。

## 2. 准备企业微信机器人

### 2.1 创建企业微信机器人

1. 登录企业微信管理后台（https://work.weixin.qq.com/）
2. 进入 **应用管理** > **自建** 页面
3. 点击 **创建应用** 按钮
4. 填写应用信息：
   - 应用名称：例如 "OpenClaw AI 助手"
   - 应用描述：例如 "基于 OpenClaw 的企业微信 AI 助手"
   - 可选：上传应用图标
5. 点击 **创建** 按钮

### 2.2 获取 Bot ID 和 Secret

创建应用后，在应用详情页面：

1. 记录 **AgentId**（即 Bot ID）
2. 点击 **查看** 按钮获取 **Secret**
3. 复制这些信息，稍后配置时会用到

### 2.3 配置应用权限

在应用详情页面：

1. 点击 **权限管理** 选项卡
2. 确保开启以下权限：
   - 消息推送权限
   - 读取消息权限（如果需要接收消息）
   - 发送消息权限（如果需要主动发送消息）

## 3. 通过向导快速接入（推荐）

执行以下命令启动配置向导：

```bash
openclaw channels add
```

在交互界面中按照提示操作：

1. **选择渠道**：使用上下箭头选择 `企业微信 (WeCom)`，然后按 Enter
2. **填写 Bot ID**：输入刚才获取的 AgentId
3. **填写 Secret**：输入刚才获取的 Secret
4. **确认配置**：检查信息无误后，按 Enter 确认
5. **等待连接**：系统会自动建立连接并验证配置

连接成功后，你会看到 "Channel added successfully" 的提示。

## 4. 验证运行状态

执行以下命令验证插件运行状态：

```bash
openclaw channels status --probe
```

系统会返回详细的状态信息，重点确认以下字段：

- `configured=true`：配置已生效
- `running=true`：插件正在运行
- `connected=true`：已成功连接到企业微信
- `authenticated=true`：身份验证成功

如果任何字段显示为 `false`，请检查配置是否正确，网络连接是否正常。

## 5. 手动配置示例

### 5.1 最小可用配置（Bot WS）

如果不使用向导，你可以手动编辑 `openclaw.json` 文件，添加以下配置：

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
              "botId": "YOUR_BOT_ID",  // 替换为你的 AgentId
              "secret": "YOUR_BOT_SECRET"  // 替换为你的 Secret
            }
          }
        }
      }
    }
  }
}
```

### 5.2 包含 Agent 的完整配置

对于生产环境，建议同时配置 Bot 和 Agent：

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
          },
          "agent": {
            "enabled": true,
            "corpId": "YOUR_CORP_ID",  // 企业微信企业 ID
            "agentId": 1000001,  // 与 Bot ID 相同
            "agentSecret": "YOUR_AGENT_SECRET"  // 与 Bot Secret 相同
          }
        }
      }
    }
  }
}
```

## 6. 测试消息收发

配置完成后，你可以通过以下方式测试消息收发功能：

1. **在企业微信中向机器人发送消息**：打开企业微信，找到你创建的应用，发送一条测试消息
2. **检查 OpenClaw 日志**：执行 `openclaw logs` 命令，查看消息是否被正确接收
3. **测试机器人回复**：如果配置了 AI 模型，机器人应该会回复你的消息

## 7. 常见问题处理

### 7.1 连接失败

- **检查网络**：确保服务器可以访问企业微信 API
- **检查凭证**：确认 Bot ID 和 Secret 填写正确
- **检查权限**：确保应用有足够的权限

### 7.2 消息不回

- **检查 OpenClaw 配置**：确保已配置 AI 模型
- **检查日志**：查看 `openclaw logs` 中的错误信息
- **检查网络延迟**：网络延迟可能导致消息处理超时

### 7.3 权限错误

- **检查应用权限**：确保应用已开启必要的权限
- **检查企业微信管理后台**：确认应用已正确配置

## 8. 生产环境建议

- **双模式部署**：同时使用 Bot WS 和 Agent，兼顾实时性和可靠性
- **多账号配置**：对于大型企业，考虑配置多个账号以提高并发处理能力
- **监控配置**：设置适当的监控，及时发现和处理问题
- **定期备份**：定期备份配置文件，以防配置丢失

详细配置请继续阅读 [配置说明](./configuration)。
