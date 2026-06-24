
          

          
根据 OnlyOffice 官方文档和项目代码，`config` 对象是 OnlyOffice Document Editor 的核心配置参数，用于初始化文档编辑器。以下是完整的配置属性整理：

---

## Config 配置属性详解

### 一、文档配置 (`document`)

| 属性 | 类型 | 必填 | 作用 |
|------|------|------|------|
| `url` | `string` | 是 | 文档文件的下载地址 |
| `title` | `string` | 否 | 文档显示标题 |
| `fileType` | `string` | 否 | 文件类型（doc, docx, pdf, xlsx 等） |
| `key` | `string` | 是 | 文档唯一标识符，用于版本控制 |
| `permissions` | `object` | 否 | 文档级别的权限设置 |

**document.permissions 子属性：**
| 属性 | 类型 | 默认值 | 作用 |
|------|------|--------|------|
| `edit` | `boolean` | `true` | 是否允许编辑 |
| `download` | `boolean` | `true` | 是否允许下载 |
| `print` | `boolean` | `true` | 是否允许打印 |
| `copy` | `boolean` | `true` | 是否允许复制内容 |
| `comment` | `boolean` | `true` | 是否允许添加评论 |
| `review` | `boolean` | `true` | 是否允许审阅模式 |

---

### 二、编辑器配置 (`editorConfig`)

| 属性 | 类型 | 必填 | 作用 |
|------|------|------|------|
| `mode` | `string` | 否 | 编辑器模式：`view`(预览)、`edit`(编辑)、`review`(审阅)、`comment`(评论) |
| `lang` | `string` | 否 | 界面语言，如 `zh-CN`、`en` |
| `callbackUrl` | `string` | 是 | 文档保存回调地址 |
| `user` | `object` | 否 | 当前用户信息 |
| `customization` | `object` | 否 | 自定义编辑器界面 |

**editorConfig.user 子属性：**
| 属性 | 类型 | 作用 |
|------|------|------|
| `id` | `string/number` | 用户唯一标识 |
| `name` | `string` | 用户显示名称 |

**editorConfig.customization 子属性：**
| 属性 | 类型 | 默认值 | 作用 |
|------|------|--------|------|
| `logo` | `object` | - | 自定义 Logo |
| `showHeader` | `boolean` | `true` | 是否显示顶部工具栏 |
| `showToolbar` | `boolean` | `true` | 是否显示编辑工具栏 |
| `showRuler` | `boolean` | `true` | 是否显示标尺 |
| `autoSave` | `boolean` | `true` | 是否自动保存 |
| `forceSave` | `boolean` | `false` | 是否强制保存 |

---

### 三、权限配置 (`permissions`)

全局权限设置，覆盖文档级权限：

| 属性 | 类型 | 默认值 | 作用 |
|------|------|--------|------|
| `edit` | `boolean` | `true` | 允许编辑文档 |
| `download` | `boolean` | `true` | 允许下载文档 |
| `print` | `boolean` | `true` | 允许打印文档 |
| `review` | `boolean` | `true` | 允许审阅文档 |
| `comment` | `boolean` | `true` | 允许添加评论 |

---

### 四、其他配置

| 属性 | 类型 | 必填 | 作用 |
|------|------|------|------|
| `documentType` | `string` | 是 | 文档类型：`text`(文本文档)、`spreadsheet`(表格)、`presentation`(演示) |
| `height` | `string/number` | 否 | 编辑器高度，如 `"100%"` 或 `600` |
| `width` | `string/number` | 否 | 编辑器宽度，如 `"100%"` 或 `800` |
| `type` | `string` | 否 | 编辑器类型：`desktop`(桌面)、`mobile`(移动端)、`embedded`(嵌入) |
| `token` | `string` | 否 | 用于身份验证的 JWT 令牌 |
| `saveUrl` | `string` | 否 | 文档保存地址（替代 callbackUrl） |
| `history` | `object` | 否 | 文档历史版本配置 |

---

### 五、完整配置示例

```javascript
const config = {
// 文档信息
document: {
    url: "https://example.com/documents/document.docx",
    title: "我的文档",
    fileType: "docx",
    key: "unique-document-key-123",
    permissions: {
    edit: true,
    download: true,
    print: false
    }
},

// 编辑器配置
editorConfig: {
    mode: "edit",           // view / edit / review / comment
    lang: "zh-CN",
    callbackUrl: "https://example.com/api/documents/save",
    user: {
    id: "123",
    name: "张三"
    },
    customization: {
    showHeader: true,
    showToolbar: true,
    autoSave: true
    }
},

// 全局权限
permissions: {
    edit: true,
    download: true,
    print: true
},

// 其他配置
documentType: "text",      // text / spreadsheet / presentation
height: "100vh",
width: "100%",
type: "desktop",           // desktop / mobile / embedded
token: "your-jwt-token"
}
```

---

### 六、与项目代码的对应关系

在你的项目中，后端返回的 HTML 模板会动态生成配置：

```javascript
const config = {
height: 300,
token: token,
document: officeConfig.document,
documentType: officeConfig.documentType,
editorConfig: officeConfig.editorConfig,
permissions: officeConfig.permissions,
};

const docEditor = new DocsAPI.DocEditor("placeholder", config);
```

这个配置对象会传递给 OnlyOffice 的 `DocsAPI.DocEditor` 构造函数，用于初始化文档编辑器实例。

