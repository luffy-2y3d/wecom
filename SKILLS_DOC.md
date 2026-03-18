# OpenClaw 企业微信文档能力技能清单

> 本清单列出所有企业微信文档相关的 MCP Tools，按功能模块分类，方便 OpenClaw 直接调用。

## 一、文档基础操作 (Doc Basic Operations)

### 1.1 创建文档
```json
{
  "name": "wecom_doc",
  "action": "create",
  "description": "创建文档/表格/智能表格",
  "parameters": {
    "docName": "文档名称",
    "docType": "doc|spreadsheet|smart_table|3|4|10",
    "spaceId": "可选：空间 ID",
    "fatherId": "可选：父目录 fileid",
    "viewers": "可选：查看成员列表",
    "collaborators": "可选：协作者列表",
    "init_content": "可选：初始内容数组"
  },
  "returns": {
    "docId": "文档 ID",
    "url": "文档链接",
    "title": "文档标题",
    "resourceType": "资源类型"
  }
}
```

### 1.2 重命名文档
```json
{
  "name": "wecom_doc",
  "action": "rename",
  "description": "重命名文档",
  "parameters": {
    "docId": "文档 ID",
    "newName": "新名称"
  }
}
```

### 1.3 复制文档
```json
{
  "name": "wecom_doc",
  "action": "copy",
  "description": "复制文档",
  "parameters": {
    "docId": "文档 ID",
    "newName": "新文档名称",
    "spaceId": "可选：目标空间 ID",
    "fatherId": "可选：目标父目录"
  }
}
```

### 1.4 获取文档信息
```json
{
  "name": "wecom_doc",
  "action": "get_info",
  "description": "获取文档基本信息",
  "parameters": {
    "docId": "文档 ID"
  },
  "returns": {
    "doc_name": "文档名称",
    "doc_type": "文档类型"
  }
}
```

### 1.5 获取分享链接
```json
{
  "name": "wecom_doc",
  "action": "share",
  "description": "获取文档分享链接",
  "parameters": {
    "docId": "文档 ID"
  },
  "returns": {
    "shareUrl": "分享链接"
  }
}
```

### 1.6 删除文档
```json
{
  "name": "wecom_doc",
  "action": "delete",
  "description": "删除文档或收集表",
  "parameters": {
    "docId": "可选：文档 ID",
    "formId": "可选：收集表 ID"
  }
}
```

---

## 二、文档权限管理 (Doc Permission Management)

### 2.1 获取文档权限
```json
{
  "name": "wecom_doc",
  "action": "get_auth",
  "description": "获取文档权限信息",
  "parameters": {
    "docId": "文档 ID"
  },
  "returns": {
    "docMembers": "查看成员列表",
    "coAuthList": "协作者列表",
    "accessRule": "访问规则"
  }
}
```

### 2.2 诊断文档权限
```json
{
  "name": "wecom_doc",
  "action": "diagnose_auth",
  "description": "诊断文档访问权限问题",
  "parameters": {
    "docId": "文档 ID"
  },
  "returns": {
    "internalAccessEnabled": "企业内访问是否开启",
    "externalAccessEnabled": "企业外访问是否开启",
    "requesterRole": "请求人角色",
    "findings": "诊断发现",
    "recommendations": "建议"
  }
}
```

### 2.3 校验分享链接
```json
{
  "name": "wecom_doc",
  "action": "validate_share_link",
  "description": "校验分享链接可用性",
  "parameters": {
    "shareUrl": "分享链接"
  },
  "returns": {
    "httpStatus": "HTTP 状态码",
    "userType": "访问身份",
    "padType": "页面类型",
    "findings": "诊断发现"
  }
}
```

### 2.4 设置加入规则
```json
{
  "name": "wecom_doc",
  "action": "set_join_rule",
  "description": "设置文档加入规则",
  "parameters": {
    "docId": "文档 ID",
    "request": {
      "enable_corp_internal": "是否开启企业内访问",
      "corp_internal_auth": "企业内权限：1 只读 2 编辑",
      "enable_corp_external": "是否开启企业外访问",
      "ban_share_external": "是否禁止外部分享"
    }
  }
}
```

### 2.5 设置成员权限
```json
{
  "name": "wecom_doc",
  "action": "set_member_auth",
  "description": "设置文档通知范围及成员权限",
  "parameters": {
    "docId": "文档 ID",
    "request": {
      "notified_scope_type": "通知范围类型",
      "notified_member_list": "通知成员列表"
    }
  }
}
```

### 2.6 授予/撤销访问权限
```json
{
  "name": "wecom_doc",
  "action": "grant_access",
  "description": "批量授予或撤销文档访问权限",
  "parameters": {
    "docId": "文档 ID",
    "viewers": "可选：查看成员列表",
    "collaborators": "可选：协作者列表",
    "removeViewers": "可选：移除查看成员",
    "removeCollaborators": "可选：移除协作者",
    "auth": "可选：权限级别"
  }
}
```

### 2.7 添加协作者
```json
{
  "name": "wecom_doc",
  "action": "add_collaborators",
  "description": "添加文档协作者",
  "parameters": {
    "docId": "文档 ID",
    "collaborators": "协作者列表",
    "auth": "可选：权限级别"
  }
}
```

### 2.8 设置安全设置
```json
{
  "name": "wecom_doc",
  "action": "set_safety_setting",
  "description": "设置文档安全设置（水印、复制等）",
  "parameters": {
    "docId": "文档 ID",
    "request": {
      "watermark": "水印设置",
      "disable_copy": "禁止复制",
      "disable_print": "禁止打印"
    }
  }
}
```

### 2.9 获取安全设置
```json
{
  "name": "wecom_doc",
  "action": "get_doc_security_setting",
  "description": "获取文档安全设置",
  "parameters": {
    "docId": "文档 ID"
  }
}
```

---

## 三、文档内容操作 (Doc Content Operations)

### 3.1 获取文档内容
```json
{
  "name": "wecom_doc",
  "action": "get_content",
  "description": "获取文档完整内容（包含版本号和文档树）",
  "parameters": {
    "docId": "文档 ID"
  },
  "returns": {
    "version": "文档版本号",
    "document": "文档内容树（Node 结构）"
  }
}
```

### 3.2 更新文档内容
```json
{
  "name": "wecom_doc",
  "action": "update_content",
  "description": "批量更新文档内容（最多 30 个操作）",
  "parameters": {
    "docId": "文档 ID",
    "requests": [
      {
        "replace_text": { "text": "替换文本", "ranges": [{"start_index": 0, "length": 5}] }
      },
      {
        "insert_text": { "text": "插入文本", "location": { "index": 10 } }
      },
      {
        "insert_image": { "image_id": "图片 URL", "location": { "index": 20 } }
      },
      {
        "insert_table": { "rows": 3, "cols": 3, "location": { "index": 30 } }
      },
      {
        "insert_paragraph": { "location": { "index": 40 } }
      },
      {
        "update_text_property": { "text_property": { "bold": true }, "ranges": [...] }
      }
    ],
    "version": "可选：文档版本号"
  },
  "returns": {
    "batches": "分批数量（超过 30 个操作时自动分批）"
  }
}
```

### 3.3 上传图片到文档
```json
{
  "name": "wecom_doc",
  "action": "upload_doc_image",
  "description": "上传图片到文档（获取 image_id）",
  "parameters": {
    "docId": "文档 ID",
    "file_path": "本地图片路径"
  },
  "returns": {
    "url": "图片 URL",
    "width": "图片宽度",
    "height": "图片高度",
    "size": "文件大小"
  }
}
```

---

## 四、在线表格操作 (Spreadsheet Operations)

### 4.1 获取表格属性
```json
{
  "name": "wecom_doc",
  "action": "get_sheet_properties",
  "description": "获取在线表格所有工作表属性",
  "parameters": {
    "docId": "文档 ID"
  },
  "returns": {
    "properties": [
      {
        "sheet_id": "工作表 ID",
        "title": "工作表标题",
        "row_count": "行数",
        "column_count": "列数"
      }
    ]
  }
}
```

### 4.2 获取表格数据
```json
{
  "name": "wecom_doc",
  "action": "get_sheet_data",
  "description": "获取指定范围内的单元格数据",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "工作表 ID",
    "range": "A1 表示法范围，如 A1:B5"
  },
  "returns": {
    "data": {
      "start_row": "起始行",
      "start_column": "起始列",
      "rows": [{ "values": [{ "cell_value": {...}, "cell_format": {...} }] }]"
    }
  }
}
```

### 4.3 编辑表格数据
```json
{
  "name": "wecom_doc",
  "action": "edit_sheet_data",
  "description": "编辑表格单元格数据（最多 5 个操作）",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "工作表 ID",
    "startRow": "可选：起始行（从 0 开始）",
    "startColumn": "可选：起始列（从 0 开始）",
    "gridData": {
      "rows": [
        { "values": [{ "cell_value": { "text": "内容" } }] }
      ]
    }
  }
}
```

### 4.4 修改表格属性
```json
{
  "name": "wecom_doc",
  "action": "modify_sheet_properties",
  "description": "修改工作表属性（添加/删除/重命名）",
  "parameters": {
    "docId": "文档 ID",
    "requests": [
      {
        "add_sheet_request": { "title": "新工作表", "row_count": 10, "column_count": 10 }
      },
      {
        "delete_sheet_request": { "sheet_id": "要删除的工作表 ID" }
      },
      {
        "update_range_request": { "sheet_id": "...", "grid_data": {...} }
      },
      {
        "delete_dimension_request": { "sheet_id": "...", "dimension": "ROW|COLUMN", "start_index": 1, "end_index": 5 }
      }
    ]
  }
}
```

---

## 五、智能表格操作 (Smart Table Operations)

### 5.1 查询子表
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_get_sheets",
  "description": "查询智能表格所有子表信息",
  "parameters": {
    "docId": "文档 ID",
    "sheet_id": "可选：指定子表 ID 查询",
    "need_all_type_sheet": "可选：获取所有类型子表（包含仪表盘和说明页）"
  },
  "returns": {
    "sheet_list": [
      {
        "sheet_id": "子表 ID",
        "title": "子表名称",
        "is_visible": "是否可见",
        "type": "smartsheet|dashboard|external"
      }
    ]
  }
}
```

### 5.2 添加子表
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_add_sheet",
  "description": "添加智能表格子表",
  "parameters": {
    "docId": "文档 ID",
    "title": "子表标题",
    "index": "可选：子表下标"
  },
  "returns": {
    "properties": {
      "sheet_id": "生成的子表 ID",
      "title": "子表标题",
      "index": "子表下标"
    }
  }
}
```

### 5.3 删除子表
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_del_sheet",
  "description": "删除智能表格子表",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID"
  }
}
```

### 5.4 更新子表
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_update_sheet",
  "description": "修改子表标题",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "title": "新标题"
  }
}
```

### 5.5 添加视图
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_add_view",
  "description": "在子表中添加新视图",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "view_title": "视图标题",
    "view_type": "VIEW_TYPE_GRID|VIEW_TYPE_KANBAN|VIEW_TYPE_GALLERY|VIEW_TYPE_GANTT|VIEW_TYPE_CALENDAR",
    "property": "可选：视图属性（sort_spec, filter_spec, group_spec 等）"
  },
  "returns": {
    "view": {
      "view_id": "视图 ID",
      "view_title": "视图标题",
      "view_type": "视图类型"
    }
  }
}
```

### 5.6 更新视图
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_update_view",
  "description": "更新视图属性",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "view_id": "视图 ID",
    "view_title": "可选：新视图标题",
    "property": "可选：视图属性（sort_spec, filter_spec, group_spec, color_config 等）"
  }
}
```

### 5.7 删除视图
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_del_view",
  "description": "删除一个或多个视图",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "view_ids": ["视图 ID 列表"]
  }
}
```

### 5.8 查询视图
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_get_views",
  "description": "获取子表下所有视图信息",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "view_ids": "可选：指定视图 ID 列表",
    "offset": "可选：偏移量",
    "limit": "可选：分页大小（最大 1000）"
  },
  "returns": {
    "views": [...],
    "total": "视图总数",
    "has_more": "是否还有更多",
    "next": "下次查询的偏移量"
  }
}
```

### 5.9 添加字段
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_add_fields",
  "description": "在子表中添加一个或多个字段",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "fields": [
      {
        "field_title": "字段标题",
        "field_type": "FIELD_TYPE_TEXT|FIELD_TYPE_NUMBER|...",
        "property_number": "可选：数字类型属性",
        "property_select": "可选：多选类型属性"
      }
    ]
  },
  "returns": {
    "fields": [
      {
        "field_id": "生成的字段 ID",
        "field_title": "字段标题",
        "field_type": "字段类型"
      }
    ]
  }
}
```

### 5.10 删除字段
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_del_fields",
  "description": "删除一个或多个字段",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "field_ids": ["字段 ID 列表"]
  }
}
```

### 5.11 更新字段
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_update_fields",
  "description": "更新字段标题或属性",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "fields": [
      {
        "field_id": "字段 ID",
        "field_title": "可选：新字段标题",
        "field_type": "字段类型（必须为原类型）",
        "property_number": "可选：数字类型属性"
      }
    ]
  }
}
```

### 5.12 查询字段
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_get_fields",
  "description": "获取子表下字段信息",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "view_id": "可选：视图 ID",
    "offset": "可选：偏移量",
    "limit": "可选：分页大小（最大 1000）"
  },
  "returns": {
    "fields": [...],
    "total": "字段总数"
  }
}
```

### 5.13 添加编组
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_add_group",
  "description": "添加字段编组",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "name": "编组名称",
    "children": ["可选：字段 ID 列表"]
  }
}
```

### 5.14 删除编组
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_del_group",
  "description": "删除编组",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "field_group_id": "编组 ID"
  }
}
```

### 5.15 更新编组
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_update_group",
  "description": "更新编组",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "field_group_id": "编组 ID",
    "name": "可选：新编组名称",
    "children": ["可选：字段 ID 列表"]
  }
}
```

### 5.16 获取编组
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_get_groups",
  "description": "获取编组列表",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID"
  }
}
```

### 5.17 添加记录
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_add_records",
  "description": "添加一行或多行记录",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "records": [
      {
        "values": {
          "字段标题或字段 ID": [
            { "type": "text", "text": "文本内容" }
          ]
        }
      }
    ]
  }
}
```

### 5.18 更新记录
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_update_records",
  "description": "更新一行或多行记录",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "records": [
      {
        "record_id": "记录 ID",
        "values": {
          "字段标题或字段 ID": [...]
        }
      }
    ]
  }
}
```

### 5.19 删除记录
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_del_records",
  "description": "删除一行或多行记录",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "record_ids": ["记录 ID 列表"]
  }
}
```

### 5.20 查询记录
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_get_records",
  "description": "获取记录列表（支持筛选、排序、分页）",
  "parameters": {
    "docId": "文档 ID",
    "sheetId": "子表 ID",
    "view_id": "可选：视图 ID",
    "record_ids": "可选：指定记录 ID 列表",
    "key_type": "可选：CELL_VALUE_KEY_TYPE_FIELD_TITLE|CELL_VALUE_KEY_TYPE_FIELD_ID",
    "field_titles": "可选：返回指定列（字段标题）",
    "field_ids": "可选：返回指定列（字段 ID）",
    "sort": "可选：排序设置 [{field_title: "...", desc: false}]",
    "offset": "可选：偏移量",
    "limit": "可选：分页大小（最大 1000）",
    "ver": "可选：版本号",
    "filter_spec": "可选：过滤设置"
  },
  "returns": {
    "records": [...],
    "total": "记录总数",
    "has_more": "是否还有更多",
    "next": "下次查询的偏移量",
    "ver": "版本号"
  }
}
```

### 5.21 获取子表权限
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_get_sheet_priv",
  "description": "获取智能表格子表权限规则",
  "parameters": {
    "docId": "文档 ID",
    "type": "1(全员权限)|2(额外权限)",
    "rule_id_list": "可选：规则 ID 列表"
  }
}
```

### 5.22 更新子表权限
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_update_sheet_priv",
  "description": "更新子表权限规则",
  "parameters": {
    "docId": "文档 ID",
    "type": "1(全员权限)|2(额外权限)",
    "rule_id": "可选：规则 ID",
    "name": "可选：规则名称",
    "priv_list": "权限列表"
  }
}
```

### 5.23 创建权限规则
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_create_rule",
  "description": "创建成员额外权限规则",
  "parameters": {
    "docId": "文档 ID",
    "name": "规则名称"
  },
  "returns": {
    "rule_id": "生成的规则 ID"
  }
}
```

### 5.24 修改规则成员
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_mod_rule_member",
  "description": "修改权限规则的成员范围",
  "parameters": {
    "docId": "文档 ID",
    "rule_id": "规则 ID",
    "add_member_range": "可选：添加成员范围",
    "del_member_range": "可选：删除成员范围"
  }
}
```

### 5.25 删除规则
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_delete_rule",
  "description": "删除权限规则",
  "parameters": {
    "docId": "文档 ID",
    "rule_id_list": ["规则 ID 列表"]
  }
}
```

---

## 六、收集表操作 (Form/Collect Operations)

### 6.1 创建收集表
```json
{
  "name": "wecom_doc",
  "action": "create_form",
  "description": "创建收集表（表单）",
  "parameters": {
    "formInfo": {
      "form_title": "收集表标题（必填）",
      "form_desc": "可选：收集表描述",
      "form_header": "可选：背景图链接",
      "form_question": {
        "items": [
          {
            "question_id": 1,
            "title": "问题标题",
            "pos": 1,
            "status": 1,
            "reply_type": 1,
            "must_reply": true,
            "option_item": [{"key": 1, "value": "选项", "status": 1}]
          }
        ]
      },
      "form_setting": {
        "fill_out_auth": 0,
        "allow_multi_fill": false,
        "can_anonymous": false
      }
    },
    "spaceId": "可选：空间 ID",
    "fatherId": "可选：父目录 fileid"
  },
  "returns": {
    "formId": "收集表 ID",
    "title": "收集表标题"
  }
}
```

### 6.2 编辑收集表
```json
{
  "name": "wecom_doc",
  "action": "modify_form",
  "description": "编辑收集表（全量修改问题或设置）",
  "parameters": {
    "oper": "1(全量修改问题)|2(全量修改设置)",
    "formId": "收集表 ID",
    "formInfo": {
      "form_title": "可选：新标题",
      "form_question": { "items": [...] },
      "form_setting": {...}
    }
  }
}
```

### 6.3 获取收集表信息
```json
{
  "name": "wecom_doc",
  "action": "get_form_info",
  "description": "获取收集表详细信息",
  "parameters": {
    "formId": "收集表 ID"
  },
  "returns": {
    "form_info": {
      "formid": "收集表 ID",
      "form_title": "标题",
      "form_question": { "items": [...] },
      "form_setting": {...},
      "repeated_id": ["周期 ID 列表"]
    }
  }
}
```

### 6.4 获取收集表答案
```json
{
  "name": "wecom_doc",
  "action": "get_form_answer",
  "description": "获取收集表提交的答案（最多 100 个）",
  "parameters": {
    "repeatedId": "收集表周期 ID",
    "answerIds": "可选：答案 ID 列表（最多 100 个）"
  },
  "returns": {
    "answer_list": [
      {
        "answer_id": 15,
        "user_name": "张三",
        "reply": {
          "items": [
            { "question_id": 1, "text_reply": "答案" }
          ]
        }
      }
    ]
  }
}
```

### 6.5 获取收集表统计
```json
{
  "name": "wecom_doc",
  "action": "get_form_statistic",
  "description": "获取收集表统计信息",
  "parameters": {
    "requests": [
      {
        "repeated_id": "周期 ID",
        "req_type": 1,
        "start_time": 1667395287,
        "end_time": 1668418369,
        "limit": 20,
        "cursor": 1
      }
    ]
  },
  "returns": {
    "fill_cnt": 10,
    "fill_user_cnt": 8,
    "unfill_user_cnt": 5,
    "submit_users": [...],
    "unfill_users": [...]
  }
}
```

---

## 七、高级账号管理 (Advanced Account Management)

### 7.1 分配高级功能账号
```json
{
  "name": "wecom_doc",
  "action": "doc_assign_advanced_account",
  "description": "分配文档高级功能账号",
  "parameters": {
    "userid_list": ["成员 ID 列表"]
  },
  "returns": {
    "jobid": "任务 ID"
  }
}
```

### 7.2 取消高级功能账号
```json
{
  "name": "wecom_doc",
  "action": "doc_cancel_advanced_account",
  "description": "取消文档高级功能账号",
  "parameters": {
    "userid_list": ["成员 ID 列表"]
  },
  "returns": {
    "jobid": "任务 ID"
  }
}
```

### 7.3 获取高级账号列表
```json
{
  "name": "wecom_doc",
  "action": "doc_get_advanced_account_list",
  "description": "获取高级功能账号列表",
  "parameters": {
    "cursor": "可选：分页游标",
    "limit": "可选：每页数量"
  },
  "returns": {
    "user_list": [...],
    "has_more": "是否还有更多"
  }
}
```

---

## 八、字段类型对照表 (Field Type Reference)

### 智能表格字段类型 (FieldType)

| 类型值 | 说明 | 对应 property |
|--------|------|--------------|
| FIELD_TYPE_TEXT | 文本 | - |
| FIELD_TYPE_NUMBER | 数字 | property_number |
| FIELD_TYPE_CHECKBOX | 复选框 | property_checkbox |
| FIELD_TYPE_DATE_TIME | 日期 | property_date_time |
| FIELD_TYPE_IMAGE | 图片 | - |
| FIELD_TYPE_ATTACHMENT | 文件 | property_attachment |
| FIELD_TYPE_USER | 成员 | property_user |
| FIELD_TYPE_URL | 超链接 | property_url |
| FIELD_TYPE_SELECT | 多选 | property_select |
| FIELD_TYPE_SINGLE_SELECT | 单选 | property_single_select |
| FIELD_TYPE_CREATED_USER | 创建人 | - |
| FIELD_TYPE_MODIFIED_USER | 最后编辑人 | - |
| FIELD_TYPE_CREATED_TIME | 创建时间 | property_created_time |
| FIELD_TYPE_MODIFIED_TIME | 最后编辑时间 | property_modified_time |
| FIELD_TYPE_PROGRESS | 进度 | property_progress |
| FIELD_TYPE_PHONE_NUMBER | 电话 | - |
| FIELD_TYPE_EMAIL | 邮件 | - |
| FIELD_TYPE_REFERENCE | 关联 | property_reference |
| FIELD_TYPE_LOCATION | 地理位置 | property_location |
| FIELD_TYPE_CURRENCY | 货币 | property_currency |
| FIELD_TYPE_WWGROUP | 群 | property_ww_group |
| FIELD_TYPE_AUTONUMBER | 自动编号 | property_auto_number |
| FIELD_TYPE_PERCENTAGE | 百分数 | property_percentage |
| FIELD_TYPE_BARCODE | 条码 | property_barcode |

### 收集表问题类型 (reply_type)

| 类型值 | 说明 |
|--------|------|
| 1 | 文本 |
| 2 | 单选 |
| 3 | 多选 |
| 5 | 位置 |
| 9 | 图片 |
| 10 | 文件 |
| 11 | 日期 |
| 14 | 时间 |
| 15 | 下拉列表 |
| 16 | 体温 |
| 17 | 签名 |
| 18 | 部门 |
| 19 | 成员 |
| 22 | 时长 |

---

## 九、使用示例 (Usage Examples)

### 示例 1：创建文档并添加协作者
```json
{
  "name": "wecom_doc",
  "action": "create",
  "parameters": {
    "docName": "项目计划",
    "docType": "doc",
    "collaborators": [{"userid": "zhangsan"}, {"userid": "lisi"}],
    "init_content": [
      {"type": "text", "content": "项目计划文档"},
      {"type": "text", "content": "一、项目目标"},
      {"type": "text", "content": "二、项目进度"}
    ]
  }
}
```

### 示例 2：批量更新文档内容
```json
{
  "name": "wecom_doc",
  "action": "update_content",
  "parameters": {
    "docId": "DOCID123",
    "requests": [
      {"replace_text": {"text": "新标题", "ranges": [{"start_index": 0, "length": 5}]}},
      {"insert_text": {"text": "新增段落", "location": {"index": 10}}},
      {"insert_image": {"image_id": "https://...", "location": {"index": 20}}}
    ]
  }
}
```

### 示例 3：智能表格添加记录
```json
{
  "name": "wecom_doc",
  "action": "smartsheet_add_records",
  "parameters": {
    "docId": "DOCID456",
    "sheetId": "SHEET789",
    "records": [
      {
        "values": {
          "姓名": [{"type": "text", "text": "张三"}],
          "年龄": [25],
          "部门": [{"type": "text", "text": "技术部"}]
        }
      }
    ]
  }
}
```

### 示例 4：创建收集表
```json
{
  "name": "wecom_doc",
  "action": "create_form",
  "parameters": {
    "formInfo": {
      "form_title": "员工满意度调查",
      "form_question": {
        "items": [
          {
            "question_id": 1,
            "title": "您的部门",
            "pos": 1,
            "reply_type": 15,
            "must_reply": true,
            "option_item": [
              {"key": 1, "value": "技术部"},
              {"key": 2, "value": "产品部"},
              {"key": 3, "value": "市场部"}
            ]
          },
          {
            "question_id": 2,
            "title": "满意度评分",
            "pos": 2,
            "reply_type": 2,
            "must_reply": true,
            "option_item": [
              {"key": 1, "value": "非常满意"},
              {"key": 2, "value": "满意"},
              {"key": 3, "value": "一般"},
              {"key": 4, "value": "不满意"}
            ]
          }
        ]
      }
    }
  }
}
```

---

## 十、注意事项 (Important Notes)

1. **批量操作限制**：
   - 文档批量更新：最多 30 个操作
   - 表格批量更新：最多 5 个操作
   - 收集表答案查询：最多 100 个答案 ID

2. **版本控制**：
   - 更新文档内容时，version 与最新版差值不能超过 100
   - 建议每次更新前获取最新文档内容

3. **权限说明**：
   - 自建应用需配置到"可调用应用"列表
   - 第三方应用需具有"文档"权限
   - 只能操作该应用创建的文档

4. **字段类型匹配**：
   - 添加/更新字段时，field_type 必须与 property_* 属性匹配
   - 更新字段时不能修改字段类型

5. **记录操作限制**：
   - 智能表格单表最多 100000 行记录
   - 单表最多 1500000 个单元格
   - 单次添加/更新建议在 500 行内

---

**文档版本**: 2026-03-17  
**适用版本**: OpenClaw WeChat Plugin v2.3.16+  
**官方文档**: 企业微信开放平台 - 文档 API
