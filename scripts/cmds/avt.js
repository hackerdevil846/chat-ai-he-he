const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "avt",
    aliases: ["avatar", "profilepic"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "tools",
    shortDescription: {
        en: "𝑈𝑠𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟 𝑖𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑟"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑢𝑠𝑒𝑟 𝑜𝑟 𝑔𝑟𝑜𝑢𝑝 𝑎𝑣𝑎𝑡𝑎𝑟 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    guide: {
        en: "{p}avt [𝑏𝑜𝑥|𝑖𝑑|𝑢𝑠𝑒𝑟]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, args, api }) {
    try {
        // Check dependencies
        if (!axios || !fs.existsSync) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        if (!args[0]) {
            const helpMessage = `🎭=== 𝐹𝐴𝐶𝐸𝐵𝑂𝑂𝐾 𝐴𝑉𝐴𝑇𝐴𝑅 ===🎭

🎭→ ${global.config.PREFIX}avt 𝑏𝑜𝑥 - 𝐺𝑒𝑡 𝑔𝑟𝑜𝑢𝑝 𝑎𝑣𝑎𝑡𝑎𝑟
🎭→ ${global.config.PREFIX}avt 𝑖𝑑 [𝑖𝑑] - 𝐺𝑒𝑡 𝑎𝑣𝑎𝑡𝑎𝑟 𝑏𝑦 𝐼𝐷
🎭→ ${global.config.PREFIX}avt 𝑢𝑠𝑒𝑟 - 𝐺𝑒𝑡 𝑦𝑜𝑢𝑟 𝑎𝑣𝑎𝑡𝑎𝑟
🎭→ ${global.config.PREFIX}avt 𝑢𝑠𝑒𝑟 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛] - 𝐺𝑒𝑡 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟

𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;
            return message.reply(helpMessage);
        }

        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const imagePath = path.join(cacheDir, `avt_${Date.now()}.png`);

        if (args[0] === "box") {
            try {
                let threadID = event.threadID;
                let threadName = "𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝";
                
                if (args[1]) {
                    threadID = args[1];
                    try {
                        const threadInfo = await api.getThreadInfo(threadID);
                        threadName = threadInfo.threadName || "𝑢𝑛𝑘𝑛𝑜𝑤𝑛 𝑔𝑟𝑜𝑢𝑝";
                    } catch {
                        threadName = "𝑢𝑛𝑘𝑛𝑜𝑤𝑛 𝑔𝑟𝑜𝑢𝑝";
                    }
                } else {
                    const threadInfo = await api.getThreadInfo(threadID);
                    threadName = threadInfo.threadName || "𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝";
                }
                
                // Download group avatar
                const response = await axios.get(`https://graph.facebook.com/${threadID}/picture?width=720&height=720`, {
                    responseType: 'arraybuffer'
                });
                
                fs.writeFileSync(imagePath, Buffer.from(response.data));
                
                await message.reply({
                    body: `✅ 𝐺𝑟𝑜𝑢𝑝 𝑎𝑣𝑎𝑡𝑎𝑟: ${threadName}`,
                    attachment: fs.createReadStream(imagePath)
                });
                
                // Clean up
                fs.unlinkSync(imagePath);
                
            } catch (e) {
                await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑔𝑟𝑜𝑢𝑝 𝑎𝑣𝑎𝑡𝑎𝑟");
            }
        }
        else if (args[0] === "id") {
            try {
                const id = args[1];
                if (!id) return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑢𝑠𝑒𝑟 𝐼𝐷");
                
                // Download user avatar
                const response = await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720`, {
                    responseType: 'arraybuffer'
                });
                
                fs.writeFileSync(imagePath, Buffer.from(response.data));
                
                await message.reply({
                    body: `✅ 𝑈𝑠𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟: ${id}`,
                    attachment: fs.createReadStream(imagePath)
                });
                
                // Clean up
                fs.unlinkSync(imagePath);
                
            } catch (e) {
                await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑢𝑠𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟");
            }
        }
        else if (args[0] === "user") {
            try {
                let id = event.senderID;
                let name = "𝑌𝑜𝑢𝑟";
                
                if (args[1] && event.mentions) {
                    id = Object.keys(event.mentions)[0];
                    const userInfo = await api.getUserInfo(id);
                    name = userInfo[id]?.name || "𝑈𝑠𝑒𝑟";
                }
                
                // Download user avatar
                const response = await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720`, {
                    responseType: 'arraybuffer'
                });
                
                fs.writeFileSync(imagePath, Buffer.from(response.data));
                
                await message.reply({
                    body: `✅ ${name} 𝑎𝑣𝑎𝑡𝑎𝑟`,
                    attachment: fs.createReadStream(imagePath)
                });
                
                // Clean up
                fs.unlinkSync(imagePath);
                
            } catch (e) {
                await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑎𝑣𝑎𝑡𝑎𝑟");
            }
        }
        else {
            await message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑝𝑡𝑖𝑜𝑛. 𝑈𝑠𝑒 ${global.config.PREFIX}avt 𝑓𝑜𝑟 ℎ𝑒𝑙𝑝`);
        }

    } catch (error) {
        console.error("𝐴𝑣𝑎𝑡𝑎𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
