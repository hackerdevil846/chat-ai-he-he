const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "setallbox",
    aliases: ["groupconfig", "gconfig"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "𝐶ℎ𝑎𝑛𝑔𝑒 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑔𝑟𝑜𝑢𝑝 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠"
    },
    longDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 𝑙𝑖𝑘𝑒 𝑒𝑚𝑜𝑗𝑖, 𝑛𝑎𝑚𝑒, 𝑎𝑣𝑎𝑡𝑎𝑟, 𝑐𝑜𝑙𝑜𝑟, 𝑒𝑡𝑐."
    },
    guide: {
        en: "{p}setallbox [𝑒𝑚𝑜𝑗𝑖/𝐵𝑛𝑎𝑚𝑒/𝑟𝑐𝑜𝑙𝑜𝑟/𝑛𝑎𝑚𝑒/𝑎𝑣𝑡/𝑝𝑜𝑙𝑙/𝑄𝑇𝑉] [𝑎𝑟𝑔𝑠]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onStart = async function({ message, event, args, api }) {
    try {
        // Check dependencies
        if (!axios) throw new Error("𝑎𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        if (!fs.existsSync) throw new Error("𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        if (!path) throw new Error("𝑝𝑎𝑡ℎ 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");

        if (!args[0]) {
            const helpMessage = `🎭 𝑆𝑒𝑡𝑎𝑙𝑙𝑏𝑜𝑥 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠 🎭

🔹 ${global.config.PREFIX}setallbox 𝑒𝑚𝑜𝑗𝑖 [𝑒𝑚𝑜𝑗𝑖] - 𝐶ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑒𝑚𝑜𝑗𝑖
🔹 ${global.config.PREFIX}setallbox 𝐵𝑛𝑎𝑚𝑒 [𝑛𝑎𝑚𝑒] - 𝐶ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒
🔹 ${global.config.PREFIX}setallbox 𝑟𝑐𝑜𝑙𝑜𝑟 - 𝑅𝑎𝑛𝑑𝑜𝑚 𝑔𝑟𝑜𝑢𝑝 𝑐𝑜𝑙𝑜𝑟
🔹 ${global.config.PREFIX}setallbox 𝑛𝑎𝑚𝑒 [𝑛𝑎𝑚𝑒] - 𝐶ℎ𝑎𝑛𝑔𝑒 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒
🔹 ${global.config.PREFIX}setallbox 𝑎𝑣𝑡 - 𝐶ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑣𝑎𝑡𝑎𝑟 (𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒)
🔹 ${global.config.PREFIX}setallbox 𝑝𝑜𝑙𝑙 <𝑡𝑖𝑡𝑙𝑒> => <𝑜𝑝𝑡1> | <𝑜𝑝𝑡2> - 𝐶𝑟𝑒𝑎𝑡𝑒 𝑝𝑜𝑙𝑙

𝐶𝑟𝑒𝑑𝑖𝑡𝑠: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;
            return message.reply(helpMessage);
        }

        switch (args[0]) {
            case "emoji":
                try {
                    if (!args[1]) {
                        const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇"];
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await api.changeThreadEmoji(randomEmoji, event.threadID);
                        return message.reply(`✅ 𝑅𝑎𝑛𝑑𝑜𝑚 𝑒𝑚𝑜𝑗𝑖 𝑠𝑒𝑡: ${randomEmoji}`);
                    } else {
                        await api.changeThreadEmoji(args[1], event.threadID);
                        return message.reply(`✅ 𝐸𝑚𝑜𝑗𝑖 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑡𝑜: ${args[1]}`);
                    }
                } catch (error) {
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑒𝑚𝑜𝑗𝑖");
                }

            case "Bname":
                try {
                    const newName = args.slice(1).join(" ");
                    if (!newName) return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑎 𝑛𝑒𝑤 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒");
                    await api.setTitle(newName, event.threadID);
                    return message.reply(`✅ 𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑡𝑜: ${newName}`);
                } catch (error) {
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒");
                }

            case "rcolor":
                try {
                    const colors = [
                        '196241301102133', '169463077092846', '2442142322678320',
                        '234137870477637', '980963458735625', '175615189761153'
                    ];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    await api.changeThreadColor(randomColor, event.threadID);
                    return message.reply("✅ 𝐺𝑟𝑜𝑢𝑝 𝑐𝑜𝑙𝑜𝑟 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
                } catch (error) {
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑐𝑜𝑙𝑜𝑟");
                }

            case "name":
                try {
                    const name = args.slice(1).join(" ");
                    if (!name) return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑎 𝑛𝑒𝑤 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒");
                    
                    // For TBot/Mirai, nickname changes might require different handling
                    return message.reply("❌ 𝑁𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑐ℎ𝑎𝑛𝑔𝑒 𝑛𝑜𝑡 𝑠𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑣𝑒𝑟𝑠𝑖𝑜𝑛");
                } catch (error) {
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒");
                }

            case "avt":
                try {
                    if (!event.messageReply || !event.messageReply.attachments?.[0]?.type?.includes("image")) {
                        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒");
                    }

                    const imgURL = event.messageReply.attachments[0].url;
                    
                    // Create cache directory
                    const cacheDir = path.join(__dirname, 'cache');
                    if (!fs.existsSync(cacheDir)) {
                        fs.mkdirSync(cacheDir, { recursive: true });
                    }
                    
                    const imagePath = path.join(cacheDir, `avt_${event.threadID}.jpg`);
                    
                    // Download image
                    const response = await axios.get(imgURL, {
                        responseType: 'arraybuffer'
                    });
                    
                    fs.writeFileSync(imagePath, Buffer.from(response.data));
                    
                    // Change group image
                    await api.changeGroupImage(fs.createReadStream(imagePath), event.threadID);
                    
                    // Clean up
                    fs.unlinkSync(imagePath);
                    
                    return message.reply("✅ 𝐺𝑟𝑜𝑢𝑝 𝑎𝑣𝑎𝑡𝑎𝑟 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
                } catch (error) {
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑣𝑎𝑡𝑎𝑟");
                }

            case "poll":
                try {
                    const content = args.slice(1).join(" ");
                    const separatorIndex = content.indexOf(" => ");
                    
                    if (separatorIndex === -1) {
                        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑜𝑟𝑚𝑎𝑡! 𝑈𝑠𝑒: 𝑝𝑜𝑙𝑙 <𝑡𝑖𝑡𝑙𝑒> => <𝑜𝑝𝑡𝑖𝑜𝑛1> | <𝑜𝑝𝑡𝑖𝑜𝑛2>");
                    }
                    
                    const title = content.substring(0, separatorIndex);
                    const options = content.substring(separatorIndex + 4).split("|").map(opt => opt.trim());
                    
                    if (!title || options.length < 2) {
                        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑜𝑙𝑙 𝑓𝑜𝑟𝑚𝑎𝑡! 𝑀𝑖𝑛𝑖𝑚𝑢𝑚 2 𝑜𝑝𝑡𝑖𝑜𝑛𝑠 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑");
                    }
                    
                    // For TBot/Mirai, poll creation might require different handling
                    return message.reply("❌ 𝑃𝑜𝑙𝑙 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑛𝑜𝑡 𝑠𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑣𝑒𝑟𝑠𝑖𝑜𝑛");
                } catch (error) {
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑝𝑜𝑙𝑙");
                }

            default:
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑝𝑡𝑖𝑜𝑛. 𝑈𝑠𝑒 '𝑠𝑒𝑡𝑎𝑙𝑙𝑏𝑜𝑥' 𝑤𝑖𝑡ℎ𝑜𝑢𝑡 𝑎𝑟𝑔𝑢𝑚𝑒𝑛𝑡𝑠 𝑓𝑜𝑟 ℎ𝑒𝑙𝑝.");
        }

    } catch (error) {
        console.error("𝑆𝑒𝑡𝑎𝑙𝑙𝑏𝑜𝑥 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
