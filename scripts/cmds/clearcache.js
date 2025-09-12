const fs = require("fs-extra");

module.exports.config = {
    name: "clearcache",
    aliases: ["cacheclear", "clearc"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 2,
    category: "system",
    shortDescription: {
        en: "🗑️ 𝐷𝑒𝑙𝑒𝑡𝑒 𝑐𝑎𝑐ℎ𝑒 𝑓𝑖𝑙𝑒(𝑠) 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑠𝑎𝑓𝑒𝑙𝑦"
    },
    longDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒𝑠 𝑎𝑛𝑑 𝑐𝑙𝑒𝑎𝑛𝑠 𝑐𝑎𝑐ℎ𝑒 𝑓𝑖𝑙𝑒𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑏𝑜𝑡'𝑠 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦"
    },
    guide: {
        en: "{p}clearcache [𝑓𝑖𝑙𝑒 𝑒𝑥𝑡𝑒𝑛𝑠𝑖𝑜𝑛]"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "noPermission": "❌ 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑛𝑜𝑡 𝑎𝑙𝑙𝑜𝑤𝑒𝑑 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.",
        "noExtension": "⚠️ 𝑌𝑜𝑢 𝑑𝑖𝑑𝑛'𝑡 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑡ℎ𝑒 𝑓𝑖𝑙𝑒 𝑒𝑥𝑡𝑒𝑛𝑠𝑖𝑜𝑛 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒!",
        "confirmDelete": "🗑️ 𝑇ℎ𝑒 𝑓𝑜𝑙𝑙𝑜𝑤𝑖𝑛𝑔 𝑓𝑖𝑙𝑒𝑠 𝑤𝑖𝑙𝑙 𝑏𝑒 𝑑𝑒𝑙𝑒𝑡𝑒𝑑:\n%s\n\n𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ `𝑌` 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚.",
        "deleteSuccess": "✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑒𝑙𝑒𝑡𝑒𝑑 %𝑑 𝑓𝑖𝑙𝑒(𝑠) 𝑤𝑖𝑡ℎ .%𝑠 𝑒𝑥𝑡𝑒𝑛𝑠𝑖𝑜𝑛.",
        "deleteCancel": "❌ 𝑂𝑝𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑛𝑐𝑒𝑙𝑙𝑒𝑑.",
        "noFilesFound": "ℹ️ 𝑁𝑜 𝑓𝑖𝑙𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑤𝑖𝑡ℎ .%𝑠 𝑒𝑥𝑡𝑒𝑛𝑠𝑖𝑜𝑛."
    }
};

module.exports.onStart = async function({ message, args, event, usersData }) {
    try {
        const path = __dirname + "/cache";
        const allowedUIDs = ["61571630409265"];

        // Check permission using usersData instead of hardcoded UID
        const userData = await usersData.get(event.senderID);
        if (userData.role < 2 && !allowedUIDs.includes(event.senderID)) {
            return message.reply(module.exports.languages.en.noPermission);
        }

        if (!args[0]) {
            return message.reply(module.exports.languages.en.noExtension);
        }

        const extension = args[0];
        
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
            return message.reply(module.exports.languages.en.noFilesFound.replace("%s", extension));
        }

        const listFile = fs.readdirSync(path).filter(file => file.endsWith("." + extension));
        
        if (listFile.length === 0) {
            return message.reply(module.exports.languages.en.noFilesFound.replace("%s", extension));
        }

        let fileListText = listFile.slice(0, 20).join("\n");
        if (listFile.length > 20) {
            fileListText += `\n...𝑎𝑛𝑑 ${listFile.length - 20} 𝑚𝑜𝑟𝑒 𝑓𝑖𝑙𝑒𝑠`;
        }

        await message.reply(module.exports.languages.en.confirmDelete.replace("%s", fileListText), 
            (error, info) => {
                if (error) {
                    console.error("𝐸𝑟𝑟𝑜𝑟:", error);
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑐𝑜𝑛𝑓𝑖𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑚𝑒𝑠𝑠𝑎𝑔𝑒.");
                }
                
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    extension: extension,
                    files: listFile
                });
            }
        );

    } catch (error) {
        console.error("𝐶𝑙𝑒𝑎𝑟𝐶𝑎𝑐ℎ𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.");
    }
};

module.exports.onReply = async function({ event, message, handleReply }) {
    try {
        if (event.senderID !== handleReply.author) return;

        const path = __dirname + "/cache";

        if (event.body.toLowerCase() === "y") {
            let deletedCount = 0;
            
            for (const file of handleReply.files) {
                try {
                    if (fs.existsSync(`${path}/${file}`)) {
                        fs.unlinkSync(`${path}/${file}`);
                        deletedCount++;
                    }
                } catch (error) {
                    console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒 ${file}:`, error);
                }
            }

            await message.reply(
                module.exports.languages.en.deleteSuccess
                    .replace("%d", deletedCount)
                    .replace("%s", handleReply.extension)
            );
        } else {
            await message.reply(module.exports.languages.en.deleteCancel);
        }

    } catch (error) {
        console.error("𝑅𝑒𝑝𝑙𝑦 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.");
    }
};
