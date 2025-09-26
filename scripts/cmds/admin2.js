const os = require('os');
const moment = require('moment-timezone');

module.exports = {
    config: {
        name: "admin2",
        aliases: ["adminpanel", "sysinfo"],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 0,
        role: 2,
        category: "system",
        shortDescription: {
            en: "✨ 𝐴𝑑𝑚𝑖𝑛 𝑆𝑦𝑠𝑡𝑒𝑚 𝐼𝑛𝑓𝑜 ✨"
        },
        longDescription: {
            en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑟𝑒𝑎𝑙 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑏𝑜𝑡 𝑠𝑡𝑎𝑡𝑠"
        },
        guide: {
            en: "{p}admin2"
        },
        dependencies: {
            "moment-timezone": ""
        }
    },

    onStart: async function({ message, usersData, threadsData, api }) {
        try {
            // Dependency check
            try {
                require("moment-timezone");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑚𝑜𝑚𝑒𝑛𝑡-𝑡𝑖𝑚𝑒𝑧𝑜𝑛𝑒");
            }

            // Utility Functions
            const formatBytes = (bytes) => {
                if (bytes === 0) return '0 𝐵';
                const k = 1024;
                const sizes = ['𝐵', '𝐾𝐵', '𝑀𝐵', '𝐺𝐵', '𝑇𝐵'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            };

            const getCPUInfo = () => {
                const cpus = os.cpus();
                if (!cpus || cpus.length === 0) return '𝑁/𝐴';
                const cpu = cpus[0];
                return `${cpu.model} | ${cpus.length} 𝑐𝑜𝑟𝑒𝑠`;
            };

            const getOSInfo = () => {
                return `${os.platform()} ${os.release()} | ${os.arch()}`;
            };

            const getUptime = () => {
                const uptime = process.uptime();
                const days = Math.floor(uptime / 86400);
                const hours = Math.floor((uptime % 86400) / 3600);
                const minutes = Math.floor((uptime % 3600) / 60);
                const seconds = Math.floor(uptime % 60);
                return `${days}𝑑 ${hours}ℎ ${minutes}𝑚 ${seconds}𝑠`;
            };

            // Get real time and date
            const now = moment().tz('Asia/Dhaka');
            const formattedTime = now.format('HH:mm:ss');
            const formattedDate = now.format('YYYY-MM-DD');
            const dayName = now.format('dddd');

            // Get real system information
            const totalMem = formatBytes(os.totalmem());
            const freeMem = formatBytes(os.freemem());
            const usedMem = formatBytes(os.totalmem() - os.freemem());
            const memoryUsage = formatBytes(process.memoryUsage().rss);

            // Get real bot statistics
            let threadCount = '𝑁/𝐴';
            let userCount = '𝑁/𝐴';
            
            try {
                // Try to get real thread count
                const allThreads = await threadsData.getAll();
                threadCount = Array.isArray(allThreads) ? allThreads.length : '𝑁/𝐴';
            } catch (e) {
                threadCount = '𝑁/𝐴';
            }

            try {
                // Try to get real user count
                const allUsers = await usersData.getAll();
                userCount = Array.isArray(allUsers) ? allUsers.length : '𝑁/𝐴';
            } catch (e) {
                userCount = '𝑁/𝐴';
            }

            // Get command count from global client
            const commandCount = global.client && global.client.commands ? 
                global.client.commands.size : '𝑁/𝐴';

            // Get Node.js version
            const nodeVersion = process.version;

            const response = `
🦋✨ 𝑨𝒅𝒎𝒊𝒏 𝑺𝒚𝒔𝒕𝒆𝒎 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 ✨🦋
━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 𝐷𝑎𝑡𝑒: ${formattedDate} (${dayName})
🕰️ 𝑇𝑖𝑚𝑒: ${formattedTime} (𝐵𝐷𝑇)
━━━━━━━━━━━━━━━━━━━━━━━━━━
💻 𝑺𝒚𝒔𝒕𝒆𝒎 𝑰𝒏𝒇𝒐:
• 𝐹𝑟𝑒𝑒 𝑅𝐴𝑀: ${freeMem}
• 𝑈𝑠𝑒𝑑 𝑅𝐴𝑀: ${usedMem} 
• 𝑇𝑜𝑡𝑎𝑙 𝑅𝐴𝑀: ${totalMem}
• 𝐵𝑜𝑡 𝑅𝐴𝑀: ${memoryUsage}
• 𝐶𝑃𝑈: ${getCPUInfo()}
• 𝑂𝑆: ${getOSInfo()}
• 𝑁𝑜𝑑𝑒.𝑗𝑠: ${nodeVersion}
• 𝑈𝑝𝑡𝑖𝑚𝑒: ${getUptime()}
━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 𝑩𝒐𝒕 𝑺𝒕𝒂𝒕𝒔:
• 𝑇ℎ𝑟𝑒𝑎𝑑𝑠: ${threadCount}
• 𝑈𝑠𝑒𝑟𝑠: ${userCount} 
• 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠: ${commandCount}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💫 𝑺𝒚𝒔𝒕𝒆𝒎 𝑯𝒆𝒂𝒍𝒕𝒉: ✅ 𝑂𝑝𝑒𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙
🦋━━━━━━━━━━━━━━━━━━━━🦋`;

            await message.reply(response);

        } catch (error) {
            console.error('𝐴𝑑𝑚𝑖𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:', error);
            await message.reply('❌ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.');
        }
    }
};
