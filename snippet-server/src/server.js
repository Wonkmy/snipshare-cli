const express = require('express');
const path = require('path');

require('dotenv').config();

const snippetsRouter = require('./routes/snippets');

const app = express();
const PORT = process.env.PORT || 5001;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 路由
app.use('/api/snippets', snippetsRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ success: false, error: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
  console.log(`API 地址: http://localhost:${PORT}/api/snippets`);
});

module.exports = app;
