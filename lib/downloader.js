const fs = require('fs');
const path = require('path');

function getDownloadDir() {
  const configDir = path.join(process.env.HOME || process.env.USERPROFILE, '.snippet');
  return path.join(configDir, 'downloaded');
}

function ensureDownloadDir() {
  const downloadDir = getDownloadDir();
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
}

function saveSnippetToLocal(snippetData, targetDir) {
  ensureDownloadDir();
  
  const snippetDir = path.join(targetDir, snippetData.id);
  if (!fs.existsSync(snippetDir)) {
    fs.mkdirSync(snippetDir, { recursive: true });
  }
  
  const snippetFilePath = path.join(snippetDir, 'snippet.json');
  fs.writeFileSync(snippetFilePath, JSON.stringify(snippetData, null, 2));
  
  return {
    success: true,
    data: {
      id: snippetData.id,
      title: snippetData.title,
      path: snippetDir
    }
  };
}

function installSnippet(snippetData, targetDir) {
  const files = snippetData.files || [];
  
  if (files.length === 0) {
    return {
      success: false,
      error: '片段中没有文件可以安装'
    };
  }
  
  for (const file of files) {
    const filePath = path.join(targetDir, file.path);
    const dirPath = path.dirname(filePath);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(filePath, file.content);
  }
  
  return {
    success: true,
    data: {
      filesInstalled: files.length
    }
  };
}

module.exports = { getDownloadDir, ensureDownloadDir, saveSnippetToLocal, installSnippet };
