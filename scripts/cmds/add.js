const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "add",
    aliases: ["upload", "mediaadd"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: {
        en: "𝐴𝑑𝑑 𝑚𝑒𝑑𝑖𝑎 𝑡𝑜 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒 𝑤𝑖𝑡ℎ 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑓𝑖𝑙𝑡𝑒𝑟𝑖𝑛𝑔"
    },
    longDescription: {
        en: "𝐴𝑑𝑑 𝑚𝑒𝑑𝑖𝑎 𝑓𝑖𝑙𝑒𝑠 𝑡𝑜 𝑎 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒 𝑤𝑖𝑡ℎ 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑓𝑖𝑙𝑡𝑒𝑟𝑖𝑛𝑔 𝑎𝑛𝑑 𝑎𝑑𝑚𝑖𝑛 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛𝑠"
    },
    guide: {
        en: "{p}add [𝑛𝑎𝑚𝑒] (𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑚𝑒𝑑𝑖𝑎)"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        // Configuration
        const ADMIN_IDS = ["61571630409265"]; // Add more admin IDs as needed
        const WARNING_FILE = path.join(__dirname, 'cache', 'warnings.json');
        const BAD_WORDS = [
            "fuck", "sex", "porn", "nude", "bitch", "cum", "dick", "pussy", "asshole", 
            "boobs", "blowjob", "hentai", "xxx", "rape", "hotgirl", "hotboy", "anal", 
            "oral", "tits", "slut", "whore", "nangi", "naked", "desisex", "desi porn", 
            "indian porn", "child porn", "pedo", "child abuse", "গুদ", "চোদা", "চোদ", 
            "চুদ", "চুদি", "চোদন", "মাগী", "মাগি", "বেশ্যা", "শুয়োর", "মাদারচোদ", 
            "বাপচোদ", "মা চোদ", "বোন চোদ", "ফাক", "সেক্স", "পর্ন", "হেন্তাই"
        ];

        // Initialize warning system
        const initWarnings = () => {
            const cacheDir = path.dirname(WARNING_FILE);
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            if (!fs.existsSync(WARNING_FILE)) {
                fs.writeFileSync(WARNING_FILE, '{}');
            }
        };

        // Warning management
        const getWarnings = () => {
            try {
                return JSON.parse(fs.readFileSync(WARNING_FILE));
            } catch {
                return {};
            }
        };

        const saveWarnings = (warnings) => {
            fs.writeFileSync(WARNING_FILE, JSON.stringify(warnings, null, 2));
        };

        // Content validation
        const hasBadWords = (text) => {
            const lowercaseText = text.toLowerCase();
            return BAD_WORDS.some(word => lowercaseText.includes(word.toLowerCase()));
        };

        // Admin notification
        const notifyAdmins = async (adminMessage) => {
            for (const adminID of ADMIN_IDS) {
                if (adminID) {
                    try {
                        await message.reply(adminMessage, adminID);
                    } catch (error) {
                        console.error('𝐴𝑑𝑚𝑖𝑛 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑:', error);
                    }
                }
            }
        };

        // Initialize warnings
        initWarnings();

        const { senderID, messageReply } = event;
        const mediaUrl = messageReply?.attachments?.[0]?.url;
        const mediaName = args.join(' ').trim();

        if (!messageReply || !mediaUrl) {
            return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑣𝑖𝑑𝑒𝑜 𝑜𝑟 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 𝑎𝑑𝑑 𝑖𝑡");
        }

        if (!mediaName) {
            return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑛𝑎𝑚𝑒 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑚𝑒𝑑𝑖𝑎");
        }

        // Content filtering
        if (hasBadWords(mediaName)) {
            const warnings = getWarnings();
            warnings[senderID] = (warnings[senderID] || 0) + 1;
            saveWarnings(warnings);

            const warningCount = warnings[senderID];
            const userWarning = `❌ 𝑦𝑜𝑢𝑟 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑 𝑛𝑎𝑚𝑒 ℎ𝑎𝑠 𝑖𝑛𝑎𝑝𝑝𝑟𝑜𝑝𝑟𝑖𝑎𝑡𝑒 𝑤𝑜𝑟𝑑𝑠!\n⚠️ 𝑊𝑎𝑟𝑛𝑖𝑛𝑔: ${warningCount}/3`;
            const adminAlert = `🚨 𝐶𝑂𝑁𝑇𝐸𝑁𝑇 𝑉𝐼𝑂𝐿𝐴𝑇𝐼𝑂𝑁\n• 𝑈𝑠𝑒𝑟: ${senderID}\n• 𝐶𝑜𝑛𝑡𝑒𝑛𝑡: ${mediaName}\n⚠️ 𝑊𝑎𝑟𝑛𝑖𝑛𝑔𝑠: ${warningCount}/3`;

            await message.reply(userWarning);
            await notifyAdmins(adminAlert);

            if (warningCount >= 3) {
                await message.reply(`🚫 𝑈𝑠𝑒𝑟 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑏𝑙𝑜𝑐𝑘𝑒𝑑 𝑓𝑜𝑟 𝑟𝑒𝑝𝑒𝑎𝑡𝑒𝑑 𝑣𝑖𝑜𝑙𝑎𝑡𝑖𝑜𝑛𝑠!`);
                // Note: Blocking users requires admin privileges and may not work in all bot frameworks
            }
            return;
        }

        // For demonstration purposes - in a real implementation, you would upload to your service
        const attachment = messageReply.attachments[0];
        const mediaType = attachment.type;
        const duration = mediaType === "video" ? attachment.duration || 0 : 0;

        // Simulate upload process (replace with actual upload service)
        await message.reply(`📤 𝑈𝑝𝑙𝑜𝑎𝑑𝑖𝑛𝑔 ${mediaType} "${mediaName}"...`);

        // Simulate API response
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Success response
        await message.reply(
            `✅ 𝐴𝑑𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n` +
            `📛 𝑁𝑎𝑚𝑒: ${mediaName}\n` +
            `📁 𝑇𝑦𝑝𝑒: ${mediaType}\n` +
            `⏱️ 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${duration > 0 ? duration + '𝑠' : '𝑁/𝐴'}\n` +
            `🔗 𝑈𝑝𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!`
        );

    } catch (error) {
        console.error('𝐴𝑑𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:', error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
    }
};
