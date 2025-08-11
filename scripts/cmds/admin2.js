const fs = require('fs-extra');
const moment = require('moment-timezone');
const path = require('path');
const os = require('os');

// Configuration
const config = {
  name: "admin2",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Asif",
  description: "✨ 𝓐𝓭𝓶𝓲𝓷 𝓜𝓪𝓷𝓪𝓰𝓮𝓶𝓮𝓷𝓽 𝓢𝔂𝓼𝓽𝓮𝓶 ✨",
  category: "admin",
  usages: "admin",
  cooldowns: 0
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
  return `𝗠𝗼𝗱𝗲𝗹: ${cpu.model}\n𝗦𝗽𝗲𝗲𝗱: ${cpu.speed} MHz\n𝗖𝗼𝗿𝗲𝘀: ${cpus.length}`;
}

function getOSInfo() {
  return `𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺: ${os.platform()}\n𝗥𝗲𝗹𝗲𝗮𝘀𝗲: ${os.release()}\n𝗔𝗿𝗰𝗵: ${os.arch()}`;
}

function getUptime() {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Core Functions
function setupConfig() {
  const configPath = path.resolve(__dirname, '..', '..', 'app', 'data.json');
  
  if (!fs.existsSync(configPath)) {
    const defaultConfig = { adminbox: {} };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  } else {
    try {
      const currentConfig = JSON.parse(fs.readFileSync(configPath));
      if (!currentConfig.hasOwnProperty('adminbox')) {
        currentConfig.adminbox = {};
        fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2));
      }
    } catch (e) {
      console.error('Config setup error:', e);
    }
  }
}

async function handleCommand({ api, event }) {
  try {
    const time = moment.tz('Asia/Dhaka');
    const formattedTime = time.format('HH:mm:ss');
    const formattedDate = time.format('YYYY-MM-DD');
    
    const threadCount = global.data?.allThreadID?.length || 'N/A';
    const userCount = global.data?.allUserID?.length || 'N/A';
    const commandCount = global.client?.commands?.size || 'N/A';
    
    const response = `
🦋✨ 𝓐𝓭𝓶𝓲𝓷𝓫𝓸𝓽 𝓒𝓸𝓷𝓽𝓻𝓸𝓵 𝓟𝓪𝓷𝓮𝓵 ✨🦋
━━━━━━━━━━━━━━━━━━━━
🕰️ 𝗧𝗶𝗺𝗲: ${formattedTime} | 📅 𝗗𝗮𝘁𝗲: ${formattedDate}
━━━━━━━━━━━━━━━━━━━━
💠 𝗦𝘆𝘀𝘁𝗲𝗺 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻:
${getOSInfo()}
${getCPUInfo()}
💾 𝗥𝗔𝗠: ${formatBytes(process.memoryUsage().rss)}
⏱️ 𝗨𝗽𝘁𝗶𝗺𝗲: ${getUptime()}
━━━━━━━━━━━━━━━━━━━━
📈 𝗕𝗼𝘁 𝗦𝘁𝗮𝘁𝘀:
🧵 𝗧𝗵𝗿𝗲𝗮𝗱𝘀: ${threadCount} 
👥 𝗨𝘀𝗲𝗿𝘀: ${userCount}
⚙️ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${commandCount}
━━━━━━━━━━━━━━━━━━━━
🌟 𝗔𝗱𝗺𝗶𝗻 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:
• 🗃️ admin box - Manage admin boxes
• ℹ️ admin info - Show detailed system info
• 🔄 admin update - Update bot settings
• ♻️ admin reload - Reload configurations
• 🧹 admin clean - Clean temporary files
• 🔁 admin restart - Restart the bot system
━━━━━━━━━━━━━━━━━━━━
✨ 𝗧𝘆𝗽𝗲 𝗮 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝘁𝗼 𝗽𝗿𝗼𝗰𝗲𝗲𝗱 (𝗲.𝗴., '𝗮𝗱𝗺𝗶𝗻 𝗶𝗻𝗳𝗼') ✨
🦋━━━━━━━━━━━━━━━━🦋`;

    api.sendMessage(response, event.threadID);
  } catch (error) {
    console.error('Admin command error:', error);
    api.sendMessage('❌ 𝓐𝓷 𝓮𝓻𝓻𝓸𝓻 𝓸𝓬𝓬𝓾𝓻𝓻𝓮𝓭. 𝓟𝓵𝓮𝓪𝓼𝓮 𝓽𝓻𝔂 𝓪𝓰𝓪𝓲𝓷 𝓵𝓪𝓽𝓮𝓻.', event.threadID);
  }
}

// Initialize
module.exports = {
  config,
  onLoad: function() {
    setupConfig();
    console.log('🌟 𝓐𝓭𝓶𝓲𝓷 𝓼𝔂𝓼𝓽𝓮𝓶 𝓲𝓷𝓲𝓽𝓲𝓪𝓵𝓲𝔃𝓮𝓭 🌟');
  },
  onStart: async function({ api, event }) {
    api.sendMessage("🌟 𝓐𝓭𝓜𝓘𝓝 𝓢𝓨𝓢𝓣𝓔𝓜 𝓡𝓔𝓐𝓓𝓨! 𝓤𝓼𝓮 '𝓪𝓭𝓶𝓲𝓷' 𝓽𝓸 𝓪𝓬𝓬𝓮𝓼𝓼 𝓬𝓸𝓷𝓽𝓻𝓸𝓵 𝓹𝓪𝓷𝓮𝓵 🌟", event.threadID);
  },
  run: async function({ api, event }) {
    await handleCommand({ api, event });
  }
};
