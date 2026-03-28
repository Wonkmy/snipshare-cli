const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 配置文件路径（用户家目录）
const CONFIG_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.snippet');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// 默认配置
const defaultConfig = {
  server: null,
  token: null,
  username: null
};

// 重置配置
function resetConfig() {
  const config = { ...defaultConfig };
  config.token = generateToken();
  saveConfig(config);
  return config;
}

// 确保配置目录存在
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

// 生成唯一 token
function generateToken() {
  return 'user_' + crypto.randomBytes(16).toString('hex');
}

// 读取配置
function getConfig() {
  ensureConfigDir();
  
  if (!fs.existsSync(CONFIG_FILE)) {
    const config = { ...defaultConfig };
    config.token = generateToken();
    saveConfig(config);
    return config;
  }
  
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(data);
    
    // 如果 token 不存在，自动生成
    if (!config.token) {
      config.token = generateToken();
      saveConfig(config);
    }
    
    return config;
  } catch (error) {
    console.error('读取配置文件失败:', error.message);
    const config = { ...defaultConfig };
    config.token = generateToken();
    saveConfig(config);
    return config;
  }
}

// 保存配置
function saveConfig(config) {
  ensureConfigDir();
  
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('保存配置文件失败:', error.message);
    return false;
  }
}

// 更新配置
function updateConfig(updates) {
  const config = getConfig();
  const updatedConfig = { ...config, ...updates };
  
  if (saveConfig(updatedConfig)) {
    return updatedConfig;
  }
  return null;
}

module.exports = {
  getConfig,
  saveConfig,
  updateConfig,
  resetConfig,
  CONFIG_FILE
};
