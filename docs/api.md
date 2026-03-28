# API 文档

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token

## 端点

### 健康检查

#### GET `/health`

检查服务器是否正常运行。

**响应：**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 获取所有片段

#### GET `/snippets`

获取所有代码片段。

**Headers:**

```
Authorization: Bearer <token>
```

**响应：**

```json
{
  "success": true,
  "data": [
    {
      "id": "sn_abc123",
      "title": "示例片段",
      "description": "这是一个示例片段",
      "techStack": {
        "framework": "Express",
        "database": "MongoDB"
      },
      "tags": ["nodejs", "express"],
      "files": [...],
      "dependencies": [...],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 上传新片段

#### POST `/snippets`

上传新的代码片段。

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体：**

```json
{
  "title": "示例片段",
  "description": "这是一个示例片段",
  "techStack": {
    "framework": "Express",
    "database": "MongoDB"
  },
  "tags": ["nodejs", "express"],
  "files": [
    {
      "path": "utils/index.js",
      "content": "console.log('hello')"
    }
  ],
  "dependencies": ["express"]
}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "id": "sn_abc123",
    "title": "示例片段",
    "description": "这是一个示例片段",
    "techStack": {
      "framework": "Express",
      "database": "MongoDB"
    },
    "tags": ["nodejs", "express"],
    "files": [...],
    "dependencies": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**错误响应：**

```json
{
  "success": false,
  "error": "片段已存在"
}
```

### 删除片段

#### DELETE `/snippets/:id`

删除指定的代码片段。

**Headers:**

```
Authorization: Bearer <token>
```

**响应：**

```json
{
  "success": true,
  "message": "删除成功"
}
```

**错误响应：**

```json
{
  "success": false,
  "error": "片段不存在"
}
```

## 错误码

| 状态码 | 错误码 | 说明 |
|--------|--------|------|
| 400 | - | 请求参数错误 |
| 401 | - | 认证失败 |
| 404 | - | 资源不存在 |
| 409 | - | 片段已存在 |
| 500 | - | 服务器内部错误 |

## 示例

### 使用 cURL

```bash
# 上传片段
curl -X POST http://localhost:3000/api/snippets \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "示例片段",
    "description": "这是一个示例片段",
    "techStack": {
      "framework": "Express",
      "database": "MongoDB"
    },
    "tags": ["nodejs", "express"],
    "files": [],
    "dependencies": []
  }'

# 获取所有片段
curl -X GET http://localhost:3000/api/snippets \
  -H "Authorization: Bearer your-token"

# 删除片段
curl -X DELETE http://localhost:3000/api/snippets/sn_abc123 \
  -H "Authorization: Bearer your-token"
```

### 使用 axios

```javascript
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';
const token = 'your-token';

// 上传片段
async function uploadSnippet(snippetData) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/snippets`,
      snippetData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.response.data);
  }
}

// 获取所有片段
async function getSnippets() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/snippets`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.response.data);
  }
}

// 删除片段
async function deleteSnippet(id) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/snippets/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.response.data);
  }
}
```
