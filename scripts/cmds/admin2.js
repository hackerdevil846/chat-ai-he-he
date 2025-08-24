const fs = require('fs-extra');
const moment = require('moment-timezone');
const path = require('path');
const os = require('os');

module.exports.config = {
  name: "admin2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "✨ Admin Management System ✨",
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
  return `⚙️ Model: ${cpu.model}\n⚡ Speed: ${cpu.speed} MHz\n💠 Cores: ${cpus.length}`;
}

function getOSInfo() {
  return `💻 Platform: ${os.platform()}\n📀 Release: ${os.release()}\n🖥️ Arch: ${os.arch()}`;
}

function getUptime() {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
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
    console.error('Config setup error:', e);
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
🦋✨ Admin Control Panel ✨🦋
━━━━━━━━━━━━━━━━━━━━
🕰️ Time: ${formattedTime} | 📅 Date: ${formattedDate}
━━━━━━━━━━━━━━━━━━━━
📊 System Information:
${getOSInfo()}
${getCPUInfo()}
💾 RAM: ${formatBytes(process.memoryUsage().rss)}
⏱️ Uptime: ${getUptime()}
━━━━━━━━━━━━━━━━━━━━
📈 Bot Stats:
🧵 Threads: ${threadCount}
👥 Users: ${userCount}
⚙️ Commands: ${commandCount}
━━━━━━━━━━━━━━━━━━━━
🌟 Admin Commands:
• 🗃️ admin box - Manage admin boxes
• ℹ️ admin info - Show detailed system info
• 🔄 admin update - Update bot settings
• ♻️ admin reload - Reload configurations
• 🧹 admin clean - Clean temporary files
• 🔁 admin restart - Restart the bot system
━━━━━━━━━━━━━━━━━━━━
✨ Type a command to proceed (e.g., 'admin info') ✨
🦋━━━━━━━━━━━━━━━━🦋`;

    api.sendMessage(response, event.threadID);
  } catch (error) {
    console.error('Admin command error:', error);
    api.sendMessage('❌ An error occurred. Please try again later.', event.threadID);
  }
}

// Initialize
module.exports.onLoad = function () {
  setupConfig();
  console.log('🌟 Admin system initialized 🌟');
};

// FIXED: run → onStart
module.exports.onStart = async function ({ api, event }) {
  await handleCommand({ api, event });
};
