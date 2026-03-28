const express = require('express');
const router = express.Router();
const FileStorage = require('../storage/fileStorage');

const storage = new FileStorage();

// 获取所有片段
router.get('/', (req, res) => {
  try {
    const snippets = storage.getAllSnippets();
    res.json({ success: true, data: snippets });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取片段失败' });
  }
});

// 上传新片段
router.post('/', (req, res) => {
  const snippetData = req.body;
  
  if (!snippetData) {
    return res.status(400).json({ success: false, error: '请求体不能为空' });
  }
  
  // 检查是否已存在
  const existingSnippets = storage.getAllSnippets();
  const exists = existingSnippets.some(s => s.id === snippetData.id);
  
  if (exists) {
    return res.status(409).json({ success: false, error: '片段已存在' });
  }
  
  const result = storage.saveSnippet(snippetData);
  
  if (result.success) {
    res.status(201).json({ success: true, data: result.data });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

// 删除片段
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const result = storage.deleteSnippet(id);
  
  if (result.success) {
    res.json({ success: true, message: '删除成功' });
  } else {
    res.status(404).json({ success: false, error: result.error });
  }
});

module.exports = router;
