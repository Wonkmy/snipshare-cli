const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class FileStorage {
  constructor(dataDir) {
    this.dataDir = dataDir || path.join(__dirname, '../../data');
    this.snippetsDir = path.join(this.dataDir, 'snippets');
    
    this.ensureDirExists(this.dataDir);
    this.ensureDirExists(this.snippetsDir);
  }

  ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  generateId() {
    return 'sn_' + crypto.randomBytes(8).toString('hex');
  }

  getAllSnippets() {
    const files = fs.readdirSync(this.snippetsDir);
    const snippets = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(this.snippetsDir, file);
          const data = fs.readFileSync(filePath, 'utf-8');
          snippets.push(JSON.parse(data));
        } catch (error) {
          console.error(`读取片段失败: ${file}`, error.message);
        }
      }
    }
    
    return snippets;
  }

  getSnippetById(id) {
    const filePath = path.join(this.snippetsDir, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`读取片段失败: ${id}`, error.message);
      return null;
    }
  }

  saveSnippet(snippetData) {
    const id = snippetData.id || this.generateId();
    const filePath = path.join(this.snippetsDir, `${id}.json`);
    
    const snippet = {
      ...snippetData,
      id,
      createdAt: snippetData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(snippet, null, 2));
      return { success: true, data: snippet };
    } catch (error) {
      console.error('保存片段失败', error.message);
      return { success: false, error: '保存失败' };
    }
  }

  deleteSnippet(id) {
    const filePath = path.join(this.snippetsDir, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return { success: false, error: '片段不存在' };
    }
    
    try {
      fs.unlinkSync(filePath);
      return { success: true };
    } catch (error) {
      console.error('删除片段失败', error.message);
      return { success: false, error: '删除失败' };
    }
  }

  updateSnippet(id, updates) {
    const snippet = this.getSnippetById(id);
    
    if (!snippet) {
      return { success: false, error: '片段不存在' };
    }
    
    const updatedSnippet = {
      ...snippet,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    const filePath = path.join(this.snippetsDir, `${id}.json`);
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(updatedSnippet, null, 2));
      return { success: true, data: updatedSnippet };
    } catch (error) {
      console.error('更新片段失败', error.message);
      return { success: false, error: '更新失败' };
    }
  }
}

module.exports = FileStorage;
