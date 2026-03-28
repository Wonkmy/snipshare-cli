# snippet-server - 代码片段管理服务器

代码片段管理工具的服务器端，支持本地部署和官方部署。

## 🚀 功能特点

- ✅ 上传代码片段
- ✅ 获取所有代码片段
- ✅ 删除代码片段
- ✅ JSON 文件存储（无需数据库）
- ✅ 支持本地部署和云部署

## 📦 安装

```bash
cd snippet-server
npm install
```

## 🛠️ 配置

复制 `.env.example` 到 `.env` 并根据需要修改：

```bash
cp .env.example .env
```

环境变量说明：

- `PORT` - 服务器端口（默认 3000）
- `DATA_DIR` - 数据存储目录（默认 `./data`）

## 🚀 运行

### 开发模式（自动重启）

```bash
npm run dev
```

### 生产模式

```bash
npm start
```

## 📡 API 端点

### 获取所有片段

```
GET /api/snippets
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
      "files": [...],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 上传新片段

```
POST /api/snippets
Content-Type: application/json
Authorization: Bearer <token>
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
  "files": [...],
  "dependencies": [...]
}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "id": "sn_abc123",
    "title": "示例片段",
    ...
  }
}
```

### 删除片段

```
DELETE /api/snippets/:id
Authorization: Bearer <token>
```

**响应：**

```json
{
  "success": true,
  "message": "删除成功"
}
```

## 📝 数据存储

所有片段数据存储在 JSON 文件中，路径为：

```
<data_dir>/snippets/<id>.json
```

例如：

```
./data/snippets/sn_abc123.json
```

## 🌐 部署

### 本地部署

```bash
npm install
cp .env.example .env
npm start
```

### 云部署（示例：Vercel）

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 云部署（示例：VPS）

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 克隆项目
git clone https://github.com/your-username/snippet-server.git
cd snippet-server

# 安装依赖
npm install
cp .env.example .env
# 编辑 .env 文件

# 使用 PM2 运行
sudo npm install -g pm2
pm2 start src/server.js --name snippet-server
pm2 save
pm2 startup
```

## 📄 许可证

MIT
