# CLI 使用指南

## 安装

```bash
npm install -g snippet
```

## 配置

### 查看当前配置

```bash
snippet config get
```

### 设置服务器地址

```bash
snippet config set server <url>
```

例如：

```bash
snippet config set server http://localhost:3000
```

## 本地管理

### 保存代码片段

```bash
snippet save <目录路径>
```

例如：

```bash
snippet save .
snippet save ./utils
```

交互式提示会引导你填写：

- 片段名称
- 描述
- 技术栈（框架、数据库）
- 标签

### 列出所有片段

```bash
snippet list
```

### 查看片段详情

```bash
snippet view <id>
```

### 更新片段

```bash
snippet update <id>
```

### 删除片段

```bash
snippet delete <id>
```

### 搜索片段

```bash
snippet search <关键词>
```

## 远程管理

### 上传片段

```bash
snippet publish
```

会提示确认是否上传。

### 列出远程片段

```bash
snippet list-remote
```

### 删除远程片段

```bash
snippet delete-remote <id>
```

## 下载管理

### 下载片段

```bash
snippet download
```

会提示选择要下载的片段，并输入保存目录。

### 列出已下载的片段

```bash
snippet list-downloaded
```

### 安装片段

```bash
snippet install <id>
```

会提示选择安装目录（默认为当前项目）。

### 卸载片段

```bash
snippet uninstall <id>
```

## 其他命令

### 查看帮助

```bash
snippet --help
```

### 查看版本

```bash
snippet --version
```

### Hello 命令

```bash
snippet hello
```

首次使用时会自动生成 Token。

## 配置文件

配置文件位于 `~/.snippet/config.json`：

```json
{
  "server": "https://snippet.dev",
  "token": "your-token",
  "username": null
}
```

## 环境变量

也可以通过环境变量配置：

```bash
export SNIPPET_SERVER=https://snippet.dev
export SNIPPET_TOKEN=your-token
```

## 示例流程

### 保存并上传片段

```bash
# 1. 保存代码片段
snippet save ./utils

# 2. 上传到服务器
snippet publish
```

### 搜索并使用片段

```bash
# 1. 搜索片段
snippet search react

# 2. 查看详情
snippet view <id>

# 3. 下载片段
snippet download

# 4. 列出已下载的片段
snippet list-downloaded

# 5. 安装片段到当前项目
snippet install <id>

# 6. 卸载已安装的片段
snippet uninstall <id>
```
