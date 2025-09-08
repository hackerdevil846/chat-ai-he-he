const fs = require('fs-extra');
const moment = require('moment-timezone');
const os = require('os');

module.exports.config = {
    name: "admin2",
    aliases: ["adminpanel", "sysinfo"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 2,
    category: "system",
    shortDescription: {
        en: "✨ 𝐴𝑑𝑚𝑖𝑛 𝑀𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡 𝑆𝑦𝑠𝑡𝑒𝑚 ✨"
    },
    longDescription: {
        en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑏𝑜𝑡 𝑠𝑡𝑎𝑡𝑠"
    },
    guide: {
        en: "{p}admin2"
    },
    dependencies: {
        "fs-extra": "",
        "moment-timezone": ""
    }
};

module.exports.onStart = async function({ message }) {
    try {
        // Utility Functions
        const formatBytes = (bytes) => {
            if (bytes === 0) return '0 𝐵';
            const k = 1024;
            const sizes = ['𝐵', '𝐾𝐵', '𝑀𝐵', '𝐺𝐵', '𝑇𝐵', '𝑃𝐵', '𝐸𝐵', '𝑍𝐵', '𝑌𝐵'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
        };

        const getCPUInfo = () => {
            const cpus = os.cpus();
            if (!cpus || cpus.length === 0) return '𝑁/𝐴';
            const cpu = cpus[0];
            return `⚙️ 𝑀𝑜𝑑𝑒𝑙: ${cpu.model}\n⚡ 𝑆𝑝𝑒𝑒𝑑: ${cpu.speed} 𝑀𝐻𝑧\n💠 𝐶𝑜𝑟𝑒𝑠: ${cpus.length}`;
        };

        const getOSInfo = () => {
            return `💻 𝑃𝑙𝑎𝑡𝑓𝑜𝑟𝑚: ${os.platform()}\n📀 𝑅𝑒𝑙𝑒𝑎𝑠𝑒: ${os.release()}\n🖥️ 𝐴𝑟𝑐ℎ: ${os.arch()}`;
        };

        const getUptime = () => {
            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            return `${days}𝑑 ${hours}ℎ ${minutes}𝑚 ${seconds}𝑠`;
        };

        const time = moment.tz('𝐴𝑠𝑖𝑎/𝐷ℎ𝑎𝑘𝑎');
        const formattedTime = time.format('𝐻𝐻:𝑚𝑚:𝑠𝑠');
        const formattedDate = time.format('𝑌𝑌𝑌𝑌-𝑀𝑀-𝐷𝐷');

        // Get bot stats (simplified for GoatBot compatibility)
        const threadCount = global.data?.allThreadID?.length || '𝑁/𝐴';
        const userCount = global.data?.allUserID?.length || '𝑁/𝐴';
        const commandCount = global.client?.commands?.size || '𝑁/𝐴';

        const response = `
🦋✨ 𝐴𝑑𝑚𝑖𝑛 𝐶𝑜𝑛𝑡𝑟𝑜𝑙 𝑃𝑎𝑛𝑒𝑙 ✨🦋
━━━━━━━━━━━━━━━━━━━━
🕰️ 𝑇𝑖𝑚𝑒: ${formattedTime} | 📅 𝐷𝑎𝑡𝑒: ${formattedDate}
━━━━━━━━━━━━━━━━━━━━
📊 𝑆𝑦𝑠𝑡𝑒𝑚 𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛:
${getOSInfo()}
${getCPUInfo()}
💾 𝑅𝐴𝑀: ${formatBytes(process.memoryUsage().rss)}
⏱️ 𝑈𝑝𝑡𝑖𝑚𝑒: ${getUptime()}
━━━━━━━━━━━━━━━━━━━━
📈 𝐵𝑜𝑡 𝑆𝑡𝑎𝑡𝑠:
🧵 𝑇ℎ𝑟𝑒𝑎𝑑𝑠: ${threadCount}
👥 𝑈𝑠𝑒𝑟𝑠: ${userCount}
⚙️ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠: ${commandCount}
━━━━━━━━━━━━━━━━━━━━
🌟 𝐴𝑑𝑚𝑖𝑛 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠:
• 🗃️ 𝑎𝑑𝑚𝑖𝑛 𝑏𝑜𝑥 - 𝑀𝑎𝑛𝑎𝑔𝑒 𝑎𝑑𝑚𝑖𝑛 𝑏𝑜𝑥𝑒𝑠
• ℹ️ 𝑎𝑑𝑚𝑖𝑛 𝑖𝑛𝑓𝑜 - 𝑆ℎ𝑜𝑤 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑛𝑓𝑜
• 🔄 𝑎𝑑𝑚𝑖𝑛 𝑢𝑝𝑑𝑎𝑡𝑒 - 𝑈𝑝𝑑𝑎𝑡𝑒 𝑏𝑜𝑡 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠
• ♻️ 𝑎𝑑𝑚𝑖𝑛 𝑟𝑒𝑙𝑜𝑎𝑑 - 𝑅𝑒𝑙𝑜𝑎𝑑 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛𝑠
• 🧹 𝑎𝑑𝑚𝑖𝑛 𝑐𝑙𝑒𝑎𝑛 - 𝐶𝑙𝑒𝑎𝑛 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑓𝑖𝑙𝑒𝑠
• 🔁 𝑎𝑑𝑚𝑖𝑛 𝑟𝑒𝑠𝑡𝑎𝑟𝑡 - 𝑅𝑒𝑠𝑡𝑎𝑟𝑡 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑠𝑦𝑠𝑡𝑒𝑚
━━━━━━━━━━━━━━━━━━━━
✨ 𝑇𝑦𝑝𝑒 𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑒𝑑 (𝑒.𝑔., '𝑎𝑑𝑚𝑖𝑛 𝑖𝑛𝑓𝑜') ✨
🦋━━━━━━━━━━━━━━━━🦋`;

        await message.reply(response);

    } catch (error) {
        console.error('𝐴𝑑𝑚𝑖𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:', error);
        await message.reply('❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.');
    }
};
