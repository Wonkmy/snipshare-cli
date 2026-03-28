# 常见问题

## CLI 工具

### Q: 如何查看当前配置？

```bash
snippet config get
```

### Q: 如何切换到私有服务器？

```bash
snippet config set server http://localhost:3000
```

### Q: Token 从哪里来？

首次运行任意命令时会自动生成 Token，存储在 `~/.snippet/config.json`。

### Q: 片段保存在哪里？

片段保存在当前目录的 `.snippet/snippets/` 目录下。

### Q: 如何删除本地片段？

```bash
snippet delete <id>
```

### Q: 上传前可以预览吗？

目前上传前会显示片段详情并要求确认：

```bash
snippet publish
```

## 服务器

### Q: 如何确认服务器正常运行？

访问健康检查端点：

```
http://localhost:3000/health
```

### Q: 数据存储在哪里？

数据存储在 `DATA_DIR/snippets/` 目录下，默认为 `./data/snippets/`。

### Q: 如何备份数据？

备份 `DATA_DIR` 目录即可：

```bash
cp -r ./data ./data-backup
```

### Q: 如何更新服务器？

```bash
git pull
pm2 restart snippet-server
```

## 认证

### Q: Token 如何获取？

首次运行 CLI 命令时自动生成，无需手动获取。

### Q: Token 安全吗？

Token 存储在本地配置文件中，建议保护好 `~/.snippet/config.json` 文件。

## 问题排查

### Q: 上传失败，提示连接服务器失败？

检查：

1. 服务器是否运行
2. 网络连接是否正常
3. 服务器地址是否正确

### Q: Token 丢失了怎么办？

重新运行任意命令会生成新的 Token，但之前的片段可能无法访问。

### Q: 如何重置配置？

删除配置文件：

```bash
rm ~/.snippet/config.json
```

然后重新运行任意命令会生成新的配置。

## 其他

### Q: 支持 Windows/macOS/Linux 吗？

支持所有主流操作系统。

### Q: 可以离线使用吗？

可以，本地管理功能完全离线。

### Q: 片段大小有限制吗？

目前没有限制，建议单个片段不超过 10MB。
