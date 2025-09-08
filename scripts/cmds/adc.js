const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "adc",
    aliases: ["downloadcmd", "getcmd"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑛𝑑 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑓𝑟𝑜𝑚 𝑢𝑟𝑙𝑠"
    },
    longDescription: {
        en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑛𝑑 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑓𝑟𝑜𝑚 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑠𝑜𝑢𝑟𝑐𝑒𝑠"
    },
    guide: {
        en: "{p}adc [𝑐𝑜𝑚𝑚𝑎𝑛𝑑_𝑛𝑎𝑚𝑒] [𝑢𝑟𝑙]"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "path": ""
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        if (args.length === 0) {
            return message.reply(
                "📝 𝐴𝐷𝐶 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑎𝑔𝑒:\n\n" +
                "• {p}adc [𝑐𝑜𝑚𝑚𝑎𝑛𝑑_𝑛𝑎𝑚𝑒] - 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑\n" +
                "• {p}adc [𝑐𝑜𝑚𝑚𝑎𝑛𝑑_𝑛𝑎𝑚𝑒] [𝑢𝑟𝑙] - 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑟𝑜𝑚 𝑢𝑟𝑙\n" +
                "• 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ {p}adc [𝑐𝑜𝑚𝑚𝑎𝑛𝑑_𝑛𝑎𝑚𝑒]"
            );
        }

        const commandName = args[0];
        let fileUrl = args[1];
        let text = "";

        // Check if replying to a message
        if (event.type === "message_reply") {
            text = event.messageReply.body;
            if (text) {
                fileUrl = text;
            }
        }

        // Validate command name
        if (!commandName || !/^[a-zA-Z0-9]+$/.test(commandName)) {
            return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑛𝑎𝑚𝑒. 𝑈𝑠𝑒 𝑜𝑛𝑙𝑦 𝑙𝑒𝑡𝑡𝑒𝑟𝑠 𝑎𝑛𝑑 𝑛𝑢𝑚𝑏𝑒𝑟𝑠.");
        }

        const commandsDir = path.join(__dirname, '..');
        const filePath = path.join(commandsDir, `${commandName}.js`);

        // If no URL provided, create a backup of existing command
        if (!fileUrl) {
            if (!fs.existsSync(filePath)) {
                return message.reply(`❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 "${commandName}" 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡.`);
            }

            try {
                const commandData = await fs.readFile(filePath, "utf-8");
                const backupPath = path.join(__dirname, '..', '..', 'temp', `${commandName}_backup.js`);
                
                // Ensure temp directory exists
                const tempDir = path.dirname(backupPath);
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }
                
                await fs.writeFile(backupPath, commandData);
                
                return message.reply({
                    body: `✅ 𝐵𝑎𝑐𝑘𝑢𝑝 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑓𝑜𝑟 "${commandName}.js"`,
                    attachment: fs.createReadStream(backupPath)
                });
                
            } catch (err) {
                console.error(err);
                return message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟: ${err.message}`);
            }
        }

        // Handle URL download
        try {
            let fileContent;

            // Handle different URL types
            if (fileUrl.includes('pastebin.com')) {
                // For Pastebin raw content
                const pasteId = fileUrl.split('/').pop();
                const rawUrl = `https://pastebin.com/raw/${pasteId}`;
                const response = await axios.get(rawUrl);
                fileContent = response.data;
            }
            else if (fileUrl.includes('github.com') || fileUrl.includes('raw.githubusercontent.com')) {
                // For GitHub raw content
                const response = await axios.get(fileUrl);
                fileContent = response.data;
            }
            else if (fileUrl.includes('drive.google.com')) {
                // For Google Drive
                return message.reply("❌ 𝐺𝑜𝑜𝑔𝑙𝑒 𝐷𝑟𝑖𝑣𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑛𝑜𝑡 𝑠𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑣𝑒𝑟𝑠𝑖𝑜𝑛.");
            }
            else if (fileUrl.includes('http')) {
                // Direct file download
                const response = await axios.get(fileUrl);
                fileContent = response.data;
            }
            else {
                return message.reply("❌ 𝑈𝑛𝑠𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑑 𝑢𝑟𝑙 𝑡𝑦𝑝𝑒.");
            }

            // Validate the downloaded content
            if (!fileContent || typeof fileContent !== 'string') {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑖𝑙𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡.");
            }

            // Basic validation to ensure it's a JavaScript file
            if (!fileContent.includes('module.exports') && !fileContent.includes('onStart')) {
                return message.reply("❌ 𝑇ℎ𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑓𝑖𝑙𝑒 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑎𝑝𝑝𝑒𝑎𝑟 𝑡𝑜 𝑏𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.`);
            }

            // Write the file
            await fs.writeFile(filePath, fileContent, "utf-8");
            
            return message.reply(`✅ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 "${commandName}.js" ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑖𝑛𝑠𝑡𝑎𝑙𝑙𝑒𝑑!\n\n📋 𝑈𝑠𝑒 "${global.config.PREFIX}load ${commandName}" 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.`);

        } catch (error) {
            console.error("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            return message.reply(`❌ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟: ${error.message}`);
        }

    } catch (error) {
        console.error("𝐴𝐷𝐶 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: " + error.message);
    }
};
