# 📚Snippet - 代码片段管理工具官方文档

Snippet 是一个专为开发者设计的代码片段管理工具，帮助你轻松保存、分享和复用代码片段。

## 🎯 核心特性

- ✅ **本地管理** - 完全离线工作，无需网络
- ✅ **团队共享** - 与团队成员无缝协作
- ✅ **官方服务器** - 无需部署，立即使用
- ✅ **私有部署** - 完全掌控数据，支持本地部署
- ✅ **智能搜索** - 快速找到需要的代码片段
- ✅ **一键同步** - 自动同步本地和远程片段

## 📦 组件

Snippet 由两部分组成：

1. **CLI 工具** - 命令行界面，用于管理代码片段
2. **服务器** - 存储和共享代码片段

## 🚀 快速开始

### 安装 CLI 工具

```bash
npm install -g snippet
```

### 首次使用

```bash
snippet hello
```

首次运行会自动生成 Token，无需手动配置。

### 使用官方服务器

默认使用官方服务器，直接上传片段：

```bash
snippet publish
```

### 私有部署

如果你想完全掌控数据，可以部署自己的服务器：

```bash
# 部署服务器
cd snippet-server
npm install
cp .env.example .env
npm start

# 配置 CLI 指向私有服务器
snippet config set server http://localhost:3000
```

## 📖 文档目录

- [CLI 使用指南](./cli.md) - 完整的 CLI 命令说明
- [服务器部署指南](./server.md) - 官方服务器和私有部署
- [API 文档](./api.md) - 服务器 API 详细说明
- [常见问题](./faq.md) - 常见问题解答

## 💡 使用场景

### 个人使用

保存常用的代码片段，跨项目复用：

```bash
# 1. 保存代码片段
snippet save ./utils

# 2. 上传到服务器
snippet publish

# 3. 下载片段
snippet download

# 4. 安装到当前项目
snippet install <id>
```

### 团队协作

与团队共享代码片段：

```bash
snippet publish
snippet list-remote
snippet search react
```

### 企业部署

在内网部署私有服务器：

```bash
# 部署服务器
cd snippet-server
npm install
cp .env.example .env
npm start

# 配置团队成员使用
snippet config set server http://internal-server:3000
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT
