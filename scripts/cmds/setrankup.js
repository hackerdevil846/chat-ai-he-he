const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "setrankup",
        aliases: ["rankupset", "levelup"],
        version: "1.0.5",
        role: 1,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑠𝑦𝑠𝑡𝑒𝑚",
        shortDescription: {
            en: "𝑈𝑠𝑒𝑟 𝑙𝑒𝑣𝑒𝑙 𝑢𝑝 ℎ𝑜𝑦𝑒 𝑛𝑜𝑡𝑢𝑛 𝑑𝑎𝑡𝑎 𝑠𝑒𝑡 𝑘𝑜𝑟𝑎"
        },
        longDescription: {
            en: "𝑆𝑒𝑡 𝑐𝑢𝑠𝑡𝑜𝑚 𝑟𝑎𝑛𝑘𝑢𝑝 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑎𝑛𝑑 𝐺𝐼𝐹𝑠 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟 𝑙𝑒𝑣𝑒𝑙 𝑢𝑝"
        },
        guide: {
            en: "{p}setrankup [𝑡𝑒𝑥𝑡/𝑔𝑖𝑓] [𝑇𝑒𝑥𝑡 𝑜𝑟 𝑈𝑅𝐿 𝑡𝑜 𝐺𝐼𝐹]"
        },
        countDown: 10,
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onLoad: function() {
        const dirPath = path.join(__dirname, "cache", "rankup");
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    },

    onStart: async function({ message, event, args, threadsData }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ");
            }

            const { threadID } = event;
            const msg = args.slice(1).join(" ");
            const threadData = await threadsData.get(threadID);
            const cachePath = path.join(__dirname, "cache", "rankup");
            const pathGif = path.join(cachePath, `${threadID}.gif`);

            if (!args[0]) {
                const guide = this.config.guide.en.replace(/{p}/g, this.config.name);
                return message.reply(`📝 𝑈𝑠𝑎𝑔𝑒 𝐺𝑢𝑖𝑑𝑒:\n${guide}`);
            }

            switch (args[0]) {
                case "text": {
                    if (!msg) {
                        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑐𝑜𝑛𝑡𝑒𝑛𝑡");
                    }
                    
                    threadData.data.customRankup = msg;
                    await threadsData.set(threadID, threadData);
                    
                    const preview = msg
                        .replace(/\{name}/g, "[𝑀𝑒𝑚𝑏𝑒𝑟 𝑛𝑎𝑚𝑒]")
                        .replace(/\{level}/g, "[𝑀𝑒𝑚𝑏𝑒𝑟 𝑙𝑒𝑣𝑒𝑙]");
                    
                    await message.reply("✅ 𝐴𝑝𝑛𝑎𝑟 𝑐𝑜𝑛𝑓𝑖𝑔 𝑠𝑎𝑣𝑒 ℎ𝑜𝑦𝑒𝑐ℎ𝑒, 𝑛𝑖𝑐ℎ𝑒 𝑝𝑟𝑒𝑣𝑖𝑒𝑤 𝑑𝑒𝑘ℎ𝑢𝑛:");
                    return message.reply(preview);
                }

                case "gif": {
                    if (msg.toLowerCase() === "remove") {
                        if (!fs.existsSync(pathGif)) {
                            return message.reply("❌ 𝐴𝑝𝑛𝑎𝑟 𝑡ℎ𝑟𝑒𝑎𝑑 𝑒 𝐺𝐼𝐹 𝑟𝑎𝑛𝑘𝑢𝑝 𝑠𝑒𝑡 𝑘𝑜𝑟𝑎 ℎ𝑜𝑦 𝑛𝑖");
                        }
                        fs.unlinkSync(pathGif);
                        return message.reply("✅ 𝑇ℎ𝑟𝑒𝑎𝑑 𝑒𝑟 𝐺𝐼𝐹 𝑟𝑒𝑚𝑜𝑣𝑒 𝑘𝑜𝑟𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒!");
                    } else {
                        if (!msg.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:gif|GIF)/g)) {
                            return message.reply("❌ 𝑈𝑅𝐿 𝑡𝑖 𝑠𝑜𝑡ℎ𝑖𝑘 𝑛𝑜𝑦!");
                        }

                        try {
                            await global.utils.downloadFile(msg, pathGif);
                            await message.reply("✅ 𝐺𝐼𝐹 𝑓𝑖𝑙𝑒 𝑠𝑎𝑣𝑒 𝑘𝑜𝑟𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒, 𝑛𝑖𝑐ℎ𝑒 𝑝𝑟𝑒𝑣𝑖𝑒𝑤 𝑑𝑒𝑘ℎ𝑢𝑛:");
                            return message.reply({
                                attachment: fs.createReadStream(pathGif)
                            });
                        } catch {
                            return message.reply("❌ 𝐹𝑎𝑖𝑙 𝑙𝑜𝑎𝑑 𝑘𝑜𝑟𝑎 𝑗𝑎𝑐𝑐ℎ𝑒 𝑛𝑎, 𝑈𝑅𝐿 𝑒𝑥𝑖𝑠𝑡 𝑘𝑜𝑟𝑒 𝑛𝑎 𝑏𝑎 𝑖𝑛𝑡𝑒𝑟𝑛𝑒𝑡 𝑝𝑟𝑜𝑏𝑙𝑒𝑚!");
                        }
                    }
                }

                default: {
                    const guide = this.config.guide.en.replace(/{p}/g, this.config.name);
                    return message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑝𝑡𝑖𝑜𝑛!\n📝 𝑈𝑠𝑎𝑔𝑒 𝐺𝑢𝑖𝑑𝑒:\n${guide}`);
                }
            }
        } catch (error) {
            console.error("𝑆𝑒𝑡𝑟𝑎𝑛𝑘𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
