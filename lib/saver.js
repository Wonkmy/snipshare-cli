const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const { getConfig } = require('./config');

const SNIPPETS_DIR = path.join(process.cwd(), 'snippets');

// 检查服务器配置
function checkServerConfig() {
  const config = getConfig();
  
  if (!config.server) {
    return {
      success: false,
      error: '未配置服务器地址\n\n请先配置服务器地址：\n  snippet config set server <服务器地址>\n\n例如：\n  snippet config set server http://localhost:3000\n  snippet config set server https://your-server.com\n',
      config
    };
  }
  
  return {
    success: true,
    config
  };
}

function ensureDir() {
  if (!fs.existsSync(SNIPPETS_DIR)) {
    fs.mkdirSync(SNIPPETS_DIR, { recursive: true });
  }
}

function saveSnippet(snippet) {
  ensureDir();
  
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  const filePath = path.join(SNIPPETS_DIR, `${id}.json`);
  
  const data = {
    ...snippet,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return data;
}

function getSnippetById(id) {
  const filePath = path.join(SNIPPETS_DIR, `${id}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return { data: JSON.parse(data), filePath };
  } catch (error) {
    return null;
  }
}

function updateSnippet(id, updates) {
  const result = getSnippetById(id);
  
  if (!result) {
    return null;
  }
  
  const { data, filePath } = result;
  
  const updatedData = {
    ...data,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
  return updatedData;
}

function scanDirectory(dirPath) {
  const files = [];
  const packageJsonPath = path.join(dirPath, 'package.json');
  let dependencies = [];
  
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      dependencies = [
        ...(pkg.dependencies ? Object.keys(pkg.dependencies).map(dep => ({ name: dep, version: pkg.dependencies[dep] })) : []),
        ...(pkg.devDependencies ? Object.keys(pkg.devDependencies).map(dep => ({ name: dep, version: pkg.devDependencies[dep] })) : [])
      ];
    } catch (error) {}
  }
  
  function scan(dir, baseDir = dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules') return;
        scan(fullPath, baseDir);
      } else if (entry.isFile()) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          files.push({ path: relativePath, content });
        } catch (error) {}
      }
    }
  }
  
  scan(dirPath);
  
  return { files, dependencies };
}

async function save(dirPath) {
  const scanResult = scanDirectory(dirPath);
  
  const answers = await prompt([
    {
      type: 'input',
      name: 'title',
      message: '请输入片段名称:',
      default: path.basename(dirPath)
    },
    {
      type: 'input',
      name: 'description',
      message: '请输入描述:',
      default: '代码片段'
    },
    {
      type: 'list',
      name: 'framework',
      message: '请选择框架:',
      choices: ['Express', 'NestJS', 'Koa', 'Fastify', '其他']
    },
    {
      type: 'list',
      name: 'database',
      message: '请选择数据库:',
      choices: ['MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', '无数据库']
    },
    {
      type: 'input',
      name: 'tags',
      message: '请输入标签（逗号分隔）:',
      default: '通用'
    }
  ]);
  
  const snippet = {
    title: answers.title,
    description: answers.description,
    techStack: {
      language: 'javascript',
      framework: answers.framework === '其他' ? '其他' : answers.framework.toLowerCase(),
      database: answers.database === '无数据库' ? 'none' : answers.database.toLowerCase()
    },
    dependencies: scanResult.dependencies,
    files: scanResult.files,
    tags: answers.tags.split(',').map(tag => tag.trim())
  };
  
  const saved = saveSnippet(snippet);
  
  console.log('\n✅ 片段保存成功！');
  console.log(`📝 名称：${saved.title}`);
  console.log(`📁 文件数：${saved.files.length}`);
  console.log(`📦 依赖数：${saved.dependencies.length}`);
  console.log(`🔗 ID：${saved.id}\n`);
  
  return saved;
}

function listSnippets() {
  if (!fs.existsSync(SNIPPETS_DIR)) {
    return [];
  }
  
  const files = fs.readdirSync(SNIPPETS_DIR);
  const snippets = [];
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      try {
        const filePath = path.join(SNIPPETS_DIR, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        snippets.push(data);
      } catch (error) {}
    }
  }
  
  return snippets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function deleteSnippet(id) {
  const result = getSnippetById(id);
  
  if (!result) {
    return false;
  }
  
  try {
    fs.unlinkSync(result.filePath);
    return true;
  } catch (error) {
    return false;
  }
}

function searchSnippets(keyword) {
  const snippets = listSnippets();
  
  if (!keyword) {
    return snippets;
  }
  
  const lowerKeyword = keyword.toLowerCase();
  
  return snippets.filter(snippet => {
    const titleMatch = snippet.title.toLowerCase().includes(lowerKeyword);
    const descMatch = snippet.description.toLowerCase().includes(lowerKeyword);
    const tagsMatch = snippet.tags.some(tag => tag.toLowerCase().includes(lowerKeyword));
    const frameworkMatch = snippet.techStack.framework.toLowerCase().includes(lowerKeyword);
    const databaseMatch = snippet.techStack.database.toLowerCase().includes(lowerKeyword);
    
    return titleMatch || descMatch || tagsMatch || frameworkMatch || databaseMatch;
  });
}

async function publishSnippet(id) {
  const result = getSnippetById(id);
  
  if (!result) {
    return {
      success: false,
      error: '未找到该片段'
    };
  }
  
  const { data } = result;
  
  // 检查服务器配置
  const serverCheck = checkServerConfig();
  if (!serverCheck.success) {
    return {
      success: false,
      error: serverCheck.error
    };
  }
  
  const { uploadSnippet } = require('./api');
  
  return await uploadSnippet(data);
}

async function getRemoteSnippets() {
  const { getRemoteSnippets: apiGetRemoteSnippets } = require('./api');
  
  return await apiGetRemoteSnippets();
}

async function deleteRemoteSnippet(id) {
  const { deleteRemoteSnippet: apiDeleteRemoteSnippet } = require('./api');
  
  return await apiDeleteRemoteSnippet(id);
}

async function downloadSnippet(id) {
  const { downloadSnippet: apiDownloadSnippet } = require('./api');
  
  return await apiDownloadSnippet(id);
}

module.exports = { save, getSnippetById, listSnippets, updateSnippet, deleteSnippet, searchSnippets, publishSnippet, getRemoteSnippets, deleteRemoteSnippet, downloadSnippet };
