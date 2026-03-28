# 服务器部署指南

## 官方服务器

默认情况下，CLI 工具会使用官方服务器：

```
https://snippet.dev
```

你无需任何配置，直接使用：

```bash
snippet publish
snippet list-remote
```

## 私有部署

如果你想完全掌控数据，可以部署自己的服务器。

### 系统要求

- Node.js 18+
- npm 9+

### 快速开始

```bash
# 克隆项目
git clone https://github.com/your-username/snippet-server.git
cd snippet-server

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件（可选）
```

### 环境变量

`.env` 文件示例：

```env
PORT=3000
DATA_DIR=./data
```

| 变量 | 说明 | 默认值 |
|------|------|--------|
| PORT | 服务器端口 | 3000 |
| DATA_DIR | 数据存储目录 | ./data |

### 本地运行

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务器启动后，访问：

```
http://localhost:3000/health
```

### 配置 CLI 使用私有服务器

```bash
snippet config set server http://localhost:3000
```

## 部署到生产环境

### VPS 部署（Ubuntu/Debian）

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

### Docker 部署

```bash
# 构建镜像
docker build -t snippet-server .

# 运行容器
docker run -d -p 3000:3000 -v ./data:/app/data snippet-server
```

### 云平台部署

#### Vercel

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

#### Render

1. 推送代码到 GitHub
2. 在 Render 中创建新 Web Service
3. 连接 GitHub 仓库
4. 配置环境变量
5. 部署

## 数据备份

数据存储在 `DATA_DIR` 目录中：

```
<data_dir>/
└── snippets/
    ├── sn_abc123.json
    └── sn_def456.json
```

定期备份此目录即可。

## 更新服务器

```bash
# 拉取最新代码
git pull

# 重启服务
pm2 restart snippet-server
```

## 故障排查

### 端口已被占用

修改 `.env` 中的 `PORT`：

```env
PORT=3001
```

### 数据权限问题

确保运行用户有写入 `DATA_DIR` 的权限：

```bash
sudo chown -R nodeuser:nodgroup ./data
```

### 查看日志

```bash
pm2 logs snippet-server
```
