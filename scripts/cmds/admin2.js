const fs = require('fs-extra');
const moment = require('moment-timezone');
const path = require('path');
const os = require('os');

module.exports.config = {
  name: "admin2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "✨ 𝑨𝒅𝒎𝒊𝒏 𝑴𝒂𝒏𝒂𝒈𝒆𝒎𝒆𝒏𝒕 𝑺𝒚𝒔𝒕𝒆𝒎 ✨",
  category: "system",
  usages: "admin2",
  cooldowns: 0,
  dependencies: {
    "fs-extra": "",
    "moment-timezone": ""
  }
};

// Utility Functions
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

function getCPUInfo() {
  const cpus = os.cpus();
  if (!cpus || cpus.length === 0) return 'N/A';
  const cpu = cpus[0];
  return `⚙️ 𝑴𝒐𝒅𝒆𝒍: ${cpu.model}\n⚡ 𝑺𝒑𝒆𝒆𝒅: ${cpu.speed} 𝑴𝑯𝒛\n💠 𝑪𝒐𝒓𝒆𝒔: ${cpus.length}`;
}

function getOSInfo() {
  return `💻 𝑷𝒍𝒂𝒕𝒇𝒐𝒓𝒎: ${os.platform()}\n📀 𝑹𝒆𝒍𝒆𝒂𝒔𝒆: ${os.release()}\n🖥️ 𝑨𝒓𝒄𝒉: ${os.arch()}`;
}

function getUptime() {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  return `${days}𝒅 ${hours}𝒉 ${minutes}𝒎 ${seconds}𝒔`;
}

// Config Setup
function setupConfig() {
  const configPath = path.resolve(__dirname, '..', '..', 'app', 'data.json');
  try {
    if (!fs.existsSync(path.dirname(configPath))) {
      fs.mkdirSync(path.dirname(configPath), { recursive: true });
    }
    if (!fs.existsSync(configPath)) {
      const defaultConfig = { adminbox: {} };
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    } else {
      const currentConfig = JSON.parse(fs.readFileSync(configPath));
      if (!currentConfig.hasOwnProperty('adminbox')) {
        currentConfig.adminbox = {};
        fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2));
      }
    }
  } catch (e) {
    console.error('𝑪𝒐𝒏𝒇𝒊𝒈 𝒔𝒆𝒕𝒖𝒑 𝒆𝒓𝒓𝒐𝒓:', e);
  }
}

// Core Command
async function handleCommand({ api, event }) {
  try {
    const time = moment.tz('Asia/Dhaka');
    const formattedTime = time.format('HH:mm:ss');
    const formattedDate = time.format('YYYY-MM-DD');

    const threadCount = global.data?.allThreadID?.length || 'N/A';
    const userCount = global.data?.allUserID?.length || 'N/A';
    const commandCount = global.client?.commands?.size || 'N/A';

    const response = `
🦋✨ 𝑨𝒅𝒎𝒊𝒏 𝑪𝒐𝒏𝒕𝒓𝒐𝒍 𝑷𝒂𝒏𝒆𝒍 ✨🦋
━━━━━━━━━━━━━━━━━━━━
🕰️ 𝑻𝒊𝒎𝒆: ${formattedTime} | 📅 𝑫𝒂𝒕𝒆: ${formattedDate}
━━━━━━━━━━━━━━━━━━━━
📊 𝑺𝒚𝒔𝒕𝒆𝒎 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏:
${getOSInfo()}
${getCPUInfo()}
💾 𝑹𝑨𝑴: ${formatBytes(process.memoryUsage().rss)}
⏱️ 𝑼𝒑𝒕𝒊𝒎𝒆: ${getUptime()}
━━━━━━━━━━━━━━━━━━━━
📈 𝑩𝒐𝒕 𝑺𝒕𝒂𝒕𝒔:
🧵 𝑻𝒉𝒓𝒆𝒂𝒅𝒔: ${threadCount}
👥 𝑼𝒔𝒆𝒓𝒔: ${userCount}
⚙️ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔: ${commandCount}
━━━━━━━━━━━━━━━━━━━━
🌟 𝑨𝒅𝒎𝒊𝒏 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔:
• 🗃️ 𝒂𝒅𝒎𝒊𝒏 𝒃𝒐𝒙 - 𝑴𝒂𝒏𝒂𝒈𝒆 𝒂𝒅𝒎𝒊𝒏 𝒃𝒐𝒙𝒆𝒔
• ℹ️ 𝒂𝒅𝒎𝒊𝒏 𝒊𝒏𝒇𝒐 - 𝑺𝒉𝒐𝒘 𝒅𝒆𝒕𝒂𝒊𝒍𝒆𝒅 𝒔𝒚𝒔𝒕𝒆𝒎 𝒊𝒏𝒇𝒐
• 🔄 𝒂𝒅𝒎𝒊𝒏 𝒖𝒑𝒅𝒂𝒕𝒆 - 𝑼𝒑𝒅𝒂𝒕𝒆 𝒃𝒐𝒕 𝒔𝒆𝒕𝒕𝒊𝒏𝒈𝒔
• ♻️ 𝒂𝒅𝒎𝒊𝒏 𝒓𝒆𝒍𝒐𝒂𝒅 - 𝑹𝒆𝒍𝒐𝒂𝒅 𝒄𝒐𝒏𝒇𝒊𝒈𝒖𝒓𝒂𝒕𝒊𝒐𝒏𝒔
• 🧹 𝒂𝒅𝒎𝒊𝒏 𝒄𝒍𝒆𝒂𝒏 - 𝑪𝒍𝒆𝒂𝒏 𝒕𝒆𝒎𝒑𝒐𝒓𝒂𝒓𝒚 𝒇𝒊𝒍𝒆𝒔
• 🔁 𝒂𝒅𝒎𝒊𝒏 𝒓𝒆𝒔𝒕𝒂𝒓𝒕 - 𝑹𝒆𝒔𝒕𝒂𝒓𝒕 𝒕𝒉𝒆 𝒃𝒐𝒕 𝒔𝒚𝒔𝒕𝒆𝒎
━━━━━━━━━━━━━━━━━━━━
✨ 𝑻𝒚𝒑𝒆 𝒂 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒕𝒐 𝒑𝒓𝒐𝒄𝒆𝒆𝒅 (𝒆.𝒈., '𝒂𝒅𝒎𝒊𝒏 𝒊𝒏𝒇𝒐') ✨
🦋━━━━━━━━━━━━━━━━🦋`;

    api.sendMessage(response, event.threadID);
  } catch (error) {
    console.error('𝑨𝒅𝒎𝒊𝒏 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒆𝒓𝒓𝒐𝒓:', error);
    api.sendMessage('❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.', event.threadID);
  }
}

// Initialize
module.exports.onLoad = function () {
  setupConfig();
  console.log('🌟 𝑨𝒅𝒎𝒊𝒏 𝒔𝒚𝒔𝒕𝒆𝒎 𝒊𝒏𝒊𝒕𝒊𝒂𝒍𝒊𝒛𝒆𝒅 🌟');
};

module.exports.run = async function ({ api, event }) {
  await handleCommand({ api, event });
};
