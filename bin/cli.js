#!/usr/bin/env node

const { program } = require('commander');
const { getConfig, updateConfig, resetConfig } = require('../lib/config');
const { save, getSnippetById, listSnippets, updateSnippet, deleteSnippet, searchSnippets, publishSnippet, getRemoteSnippets, deleteRemoteSnippet, downloadSnippet } = require('../lib/saver');
const path = require('path');

program
  .name('snippet')
  .description('代码片段管理工具')
  .version('0.0.1');

// 在所有命令执行前自动调用 getConfig()，确保 token 生成
program.hook('preAction', () => {
  getConfig();
});

// hello 命令（测试用）
program
  .command('hello')
  .description('测试命令 - 输出 Hello World')
  .action(() => {
    console.log('\nHello, CodeBlocks!');
    console.log('CLI 工具运行正常\n');
  });

// config 命令
const configCmd = program
  .command('config')
  .description('配置管理');

// config get
configCmd
  .command('get')
  .description('查看当前配置')
  .action(() => {
    const config = getConfig();
    console.log('\n当前配置:');
    console.log(`  服务器地址：${config.server}`);
    console.log(`  用户名：${config.username || '未登录'}`);
    console.log(`  Token: ${config.token ? '已设置' : '未设置'}`);
    console.log(`  配置文件：${require('../lib/config').CONFIG_FILE}\n`);
  });

// config set
configCmd
  .command('set <key> <value>')
  .description('设置配置项 (例如：snippet config set server http://localhost:3000)')
  .action((key, value) => {
    if (key === 'server') {
      const updated = updateConfig({ server: value });
      if (updated) {
        console.log(`\n服务器地址已更新：${value}\n`);
      }
    } else if (key === 'token') {
      const updated = updateConfig({ token: value });
      if (updated) {
        console.log(`\nToken 已更新\n`);
      }
    } else {
      console.log(`\n未知的配置项：${key}\n`);
      console.log('可用配置项：server, token\n');
    }
  });

// config reset
configCmd
  .command('reset')
  .description('重置配置为默认值')
  .action(() => {
    const config = resetConfig();
    console.log('\n✅ 配置已重置为默认值\n');
    console.log('当前配置:');
    console.log(`  服务器地址：${config.server}`);
    console.log(`  Token: ${config.token ? '已生成' : '未生成'}`);
    console.log(`  配置文件：${require('../lib/config').CONFIG_FILE}\n`);
  });

program
  .command('save <path>')
  .description('保存代码片段到本地')
  .action((path) => {
    save(path);
  });

program
  .command('view <id>')
  .description('查看代码片段详细信息')
  .action((id) => {
    const snippet = getSnippetById(id);
    
    if (!snippet) {
      console.log(`\n未找到 ID 为 ${id} 的片段\n`);
      return;
    }
    
    console.log('\n📋 片段详情:');
    console.log(`  名称：${snippet.title}`);
    console.log(`  描述：${snippet.description}`);
    console.log(`  框架：${snippet.techStack.framework}`);
    console.log(`  数据库：${snippet.techStack.database}`);
    console.log(`  标签：${snippet.tags.join(', ')}`);
    console.log(`  文件数：${snippet.files.length}`);
    console.log(`  依赖数：${snippet.dependencies.length}`);
    console.log(`  创建时间：${new Date(snippet.createdAt).toLocaleString()}`);
    console.log(`  更新时间：${new Date(snippet.updatedAt).toLocaleString()}`);
    
    if (snippet.files.length > 0) {
      console.log('\n📁 文件列表:');
      snippet.files.forEach(file => {
        console.log(`  - ${file.path}`);
      });
    }
    
    console.log('\n');
  });

program
  .command('list')
  .description('列出所有代码片段')
  .action(() => {
    const snippets = listSnippets();
    
    if (snippets.length === 0) {
      console.log('\n没有找到任何代码片段\n');
      return;
    }
    
    console.log(`\n共找到 ${snippets.length} 个代码片段:\n`);
    
    snippets.forEach(snippet => {
      console.log(`  ID: ${snippet.id}`);
      console.log(`  名称: ${snippet.title}`);
      console.log(`  描述: ${snippet.description}`);
      console.log(`  框架: ${snippet.techStack.framework} | 数据库: ${snippet.techStack.database}`);
      console.log(`  标签: ${snippet.tags.join(', ')}`);
      console.log(`  创建时间: ${new Date(snippet.createdAt).toLocaleString()}`);
      console.log(`  文件数: ${snippet.files.length}`);
      console.log('');
    });
  });

program
  .command('update <id>')
  .description('更新代码片段信息')
  .action(async (id) => {
    const result = getSnippetById(id);
    
    if (!result) {
      console.log(`\n未找到 ID 为 ${id} 的片段\n`);
      return;
    }
    
    const { data } = result;
    
    const answers = await prompt([
      {
        type: 'input',
        name: 'title',
        message: '请输入新的标题:',
        default: data.title
      },
      {
        type: 'input',
        name: 'description',
        message: '请输入新的描述:',
        default: data.description
      },
      {
        type: 'input',
        name: 'tags',
        message: '请输入新的标签（逗号分隔）:',
        default: data.tags.join(', ')
      }
    ]);
    
    const updated = updateSnippet(id, {
      title: answers.title,
      description: answers.description,
      tags: answers.tags.split(',').map(tag => tag.trim())
    });
    
    console.log('\n✅ 片段更新成功！');
    console.log(`📝 名称：${updated.title}`);
    console.log(`📝 描述：${updated.description}`);
    console.log(`🏷️  标签：${updated.tags.join(', ')}\n`);
  });

program
  .command('delete <id>')
  .description('删除代码片段')
  .action((id) => {
    const result = getSnippetById(id);
    
    if (!result) {
      console.log(`\n未找到 ID 为 ${id} 的片段\n`);
      return;
    }
    
    const success = deleteSnippet(id);
    
    if (success) {
      console.log(`\n✅ 片段 ${id} 已删除\n`);
    } else {
      console.log(`\n❌ 删除失败\n`);
    }
  });

program
  .command('search <keyword>')
  .description('搜索代码片段')
  .action((keyword) => {
    const snippets = searchSnippets(keyword);
    
    if (snippets.length === 0) {
      console.log(`\n未找到匹配的代码片段\n`);
      return;
    }
    
    console.log(`\n共找到 ${snippets.length} 个匹配的代码片段:\n`);
    
    snippets.forEach(snippet => {
      console.log(`  ID: ${snippet.id}`);
      console.log(`  名称: ${snippet.title}`);
      console.log(`  描述: ${snippet.description}`);
      console.log(`  框架: ${snippet.techStack.framework} | 数据库: ${snippet.techStack.database}`);
      console.log(`  标签: ${snippet.tags.join(', ')}`);
      console.log(`  创建时间: ${new Date(snippet.createdAt).toLocaleString()}`);
      console.log(`  文件数: ${snippet.files.length}`);
      console.log('');
    });
  });

program
  .command('publish')
  .description('上传代码片段到服务器')
  .action(async () => {
    const snippets = listSnippets();
    
    if (snippets.length === 0) {
      console.log('\n没有找到任何代码片段\n');
      return;
    }
    
    console.log(`\n共找到 ${snippets.length} 个代码片段:\n`);
    
    snippets.forEach((snippet, index) => {
      console.log(`  ${index + 1}. ${snippet.title} (ID: ${snippet.id})`);
      console.log(`     描述: ${snippet.description}`);
      console.log(`     文件数: ${snippet.files.length}`);
      console.log('');
    });
    
    const inquirer = require('inquirer');
    const prompt = inquirer.createPromptModule();
    
    const answers = await prompt([
      {
        type: 'number',
        name: 'snippetIndex',
        message: '请选择要上传的片段编号:',
        default: 1,
        min: 1,
        max: snippets.length
      }
    ]);
    
    const selectedSnippet = snippets[answers.snippetIndex - 1];
    
    console.log('\n📋 选中片段详情:');
    console.log(`  名称: ${selectedSnippet.title}`);
    console.log(`  描述: ${selectedSnippet.description}`);
    console.log(`  框架: ${selectedSnippet.techStack.framework}`);
    console.log(`  数据库: ${selectedSnippet.techStack.database}`);
    console.log(`  标签: ${selectedSnippet.tags.join(', ')}`);
    console.log(`  文件数: ${selectedSnippet.files.length}`);
    console.log(`  依赖数: ${selectedSnippet.dependencies.length}`);
    
    const confirmAnswers = await prompt([
      {
        type: 'confirm',
        name: 'shouldPublish',
        message: '是否上传？(y/n)',
        default: false
      }
    ]);
    
    if (!confirmAnswers.shouldPublish) {
      console.log('\n已取消上传\n');
      return;
    }
    
    console.log('\n正在上传...');
    
    const result = await publishSnippet(selectedSnippet.id);
    
    if (result.success) {
      console.log('\n片段上传成功！\n');
    } else {
      console.log(`\n上传失败: ${result.error}\n`);
    }
  });

program
  .command('list-remote')
  .description('列出服务器上的代码片段')
  .action(async () => {
    console.log('\n正在获取服务器片段列表...\n');
    
    const result = await getRemoteSnippets();
    
    if (!result.success) {
      console.log(`获取失败: ${result.error}\n`);
      return;
    }
    
    const snippets = result.data;
    
    if (!snippets || snippets.length === 0) {
      console.log('没有找到任何代码片段\n');
      return;
    }
    
    console.log(`共找到 ${snippets.length} 个代码片段:\n`);
    
    snippets.forEach(snippet => {
      console.log(`ID: ${snippet.id}`);
      console.log(`名称: ${snippet.title}`);
      console.log(`描述: ${snippet.description}`);
      console.log(`框架: ${snippet.techStack.framework} | 数据库: ${snippet.techStack.database}`);
      console.log(`标签: ${snippet.tags.join(', ')}`);
      console.log(`创建时间: ${new Date(snippet.createdAt).toLocaleString()}`);
      console.log(`文件数: ${snippet.files.length}`);
      console.log('');
    });
  });

program
  .command('delete-remote <id>')
  .description('从服务器删除代码片段')
  .action(async (id) => {
    console.log(`\n正在删除 ID 为 ${id} 的片段...\n`);
    
    const result = await deleteRemoteSnippet(id);
    
    if (result.success) {
      console.log(`片段 ${id} 已成功删除\n`);
    } else {
      console.log(`删除失败: ${result.error}\n`);
    }
  });

program
  .command('download')
  .description('从服务器下载代码片段')
  .action(async () => {
    const { getRemoteSnippets, downloadSnippet } = require('../lib/api');
    const { saveSnippetToLocal, getDownloadDir } = require('../lib/downloader');
    const inquirer = require('inquirer');
    const prompt = inquirer.createPromptModule();
    
    console.log('\n正在获取服务器片段列表...\n');
    
    const result = await getRemoteSnippets();
    
    if (!result.success) {
      console.log(`获取失败: ${result.error}\n`);
      return;
    }
    
    const snippets = result.data;
    
    if (!snippets || snippets.length === 0) {
      console.log('没有找到任何代码片段\n');
      return;
    }
    
    console.log(`共找到 ${snippets.length} 个代码片段:\n`);
    
    const choices = snippets.map((snippet, index) => ({
      name: `${index + 1}. ${snippet.title} (ID: ${snippet.id})`,
      value: snippet
    }));
    
    const answers = await prompt([
      {
        type: 'list',
        name: 'selectedSnippet',
        message: '请选择要下载的片段:',
        choices: choices
      }
    ]);
    
    const selectedSnippet = answers.selectedSnippet;
    
    console.log(`\n正在下载片段: ${selectedSnippet.title}...\n`);
    
    const downloadDir = getDownloadDir();
    
    const downloadAnswers = await prompt([
      {
        type: 'input',
        name: 'targetDir',
        message: '请输入保存目录 (回车默认: .snippet/downloaded):',
        default: downloadDir
      }
    ]);
    
    let targetDir = downloadAnswers.targetDir.trim();
    
    if (targetDir === '.') {
      targetDir = process.cwd();
    } else if (!path.isAbsolute(targetDir)) {
      targetDir = path.join(process.cwd(), targetDir);
    }
    
    const snippetResult = await downloadSnippet(selectedSnippet.id);
    
    if (!snippetResult.success) {
      console.log(`下载失败: ${snippetResult.error}\n`);
      return;
    }
    
    const saveResult = saveSnippetToLocal(snippetResult.data, targetDir);
    
    if (saveResult.success) {
      console.log(`\n片段已保存到: ${saveResult.data.path}\n`);
    } else {
      console.log(`保存失败: ${saveResult.error}\n`);
    }
  });

program
  .command('install <id>')
  .description('安装已下载的代码片段到当前项目')
  .action(async (id) => {
    const { installSnippet } = require('../lib/downloader');
    const fs = require('fs');
    const path = require('path');
    const inquirer = require('inquirer');
    const prompt = inquirer.createPromptModule();
    
    const downloadedDir = path.join(process.env.HOME || process.env.USERPROFILE, '.snippet', 'downloaded');
    const snippetDir = path.join(downloadedDir, id);
    
    if (!fs.existsSync(snippetDir)) {
      console.log(`\n未找到 ID 为 ${id} 的已下载片段\n`);
      return;
    }
    
    const snippetFilePath = path.join(snippetDir, 'snippet.json');
    const snippetData = JSON.parse(fs.readFileSync(snippetFilePath, 'utf-8'));
    
    const answers = await prompt([
      {
        type: 'input',
        name: 'targetDir',
        message: '请输入安装目录 (回车默认: 当前项目):',
        default: '.'
      }
    ]);
    
    let targetDir = answers.targetDir.trim();
    
    if (targetDir === '.') {
      targetDir = process.cwd();
    } else if (!path.isAbsolute(targetDir)) {
      targetDir = path.join(process.cwd(), targetDir);
    }
    
    console.log(`\n正在安装片段: ${snippetData.title}...\n`);
    
    const result = installSnippet(snippetData, targetDir);
    
    if (result.success) {
      console.log(`\n成功安装 ${result.data.filesInstalled} 个文件到: ${targetDir}\n`);
    } else {
      console.log(`安装失败: ${result.error}\n`);
    }
  });

program
  .command('list-downloaded')
  .description('列出已下载的代码片段')
  .action(async () => {
    const fs = require('fs');
    const path = require('path');
    
    const downloadedDir = path.join(process.env.HOME || process.env.USERPROFILE, '.snippet', 'downloaded');
    
    if (!fs.existsSync(downloadedDir)) {
      console.log('\n没有已下载的片段\n');
      return;
    }
    
    const dirs = fs.readdirSync(downloadedDir);
    const snippets = [];
    
    for (const dir of dirs) {
      const snippetDir = path.join(downloadedDir, dir);
      const snippetFilePath = path.join(snippetDir, 'snippet.json');
      
      if (fs.existsSync(snippetFilePath)) {
        try {
          const snippetData = JSON.parse(fs.readFileSync(snippetFilePath, 'utf-8'));
          snippets.push(snippetData);
        } catch (error) {
          console.error(`读取片段失败: ${dir}`, error.message);
        }
      }
    }
    
    if (snippets.length === 0) {
      console.log('\n没有已下载的片段\n');
      return;
    }
    
    console.log(`\n共找到 ${snippets.length} 个已下载的片段:\n`);
    
    snippets.forEach(snippet => {
      console.log(`ID: ${snippet.id}`);
      console.log(`名称: ${snippet.title}`);
      console.log(`描述: ${snippet.description}`);
      console.log(`文件数: ${snippet.files.length}`);
      console.log('');
    });
  });

program
  .command('uninstall <id>')
  .description('卸载已安装的代码片段')
  .action(async (id) => {
    const fs = require('fs');
    const path = require('path');
    
    const downloadedDir = path.join(process.env.HOME || process.env.USERPROFILE, '.snippet', 'downloaded');
    const snippetDir = path.join(downloadedDir, id);
    
    if (!fs.existsSync(snippetDir)) {
      console.log(`\n未找到 ID 为 ${id} 的已下载片段\n`);
      return;
    }
    
    const snippetFilePath = path.join(snippetDir, 'snippet.json');
    const snippetData = JSON.parse(fs.readFileSync(snippetFilePath, 'utf-8'));
    
    const files = snippetData.files || [];
    
    for (const file of files) {
      const filePath = path.join(process.cwd(), file.path);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    console.log(`\n片段 ${snippetData.title} 已卸载\n`);
  });

  program.parse();
