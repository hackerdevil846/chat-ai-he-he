const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "gist",
    aliases: ["githubgist", "codeupload"],
    version: "7.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "developer",
    shortDescription: {
        en: "𝐶𝑜𝑛𝑣𝑒𝑟𝑡 𝑐𝑜𝑑𝑒 𝑖𝑛𝑡𝑜 𝑎 𝐺𝑖𝑡𝐻𝑢𝑏 𝐺𝑖𝑠𝑡 𝑙𝑖𝑛𝑘"
    },
    longDescription: {
        en: "𝐶𝑜𝑛𝑣𝑒𝑟𝑡 𝑐𝑜𝑑𝑒 𝑖𝑛𝑡𝑜 𝑎 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝐺𝑖𝑡𝐻𝑢𝑏 𝐺𝑖𝑠𝑡 𝑙𝑖𝑛𝑘 𝑓𝑜𝑟 𝑒𝑎𝑠𝑦 𝑠ℎ𝑎𝑟𝑖𝑛𝑔 & 𝑢𝑠𝑎𝑔𝑒"
    },
    guide: {
        en: "{p}gist [𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒] (𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑐𝑜𝑑𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒)"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "missingFileName": "📝 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑎 𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒.\n𝑈𝑠𝑎𝑔𝑒: 𝑔𝑖𝑠𝑡 <𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒> (𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑐𝑜𝑑𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒)\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑔𝑖𝑠𝑡 ℎ𝑒𝑙𝑝",
        "noTextReply": "❌ 𝑇ℎ𝑒 𝑟𝑒𝑝𝑙𝑖𝑒𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑑𝑜𝑒𝑠𝑛'𝑡 𝑐𝑜𝑛𝑡𝑎𝑖𝑛 𝑎𝑛𝑦 𝑡𝑒𝑥𝑡/𝑐𝑜𝑑𝑒.",
        "fileNotFound": "❌ 𝐹𝑖𝑙𝑒 \"%1.𝑗𝑠\" 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛𝑠𝑖𝑑𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑓𝑜𝑙𝑑𝑒𝑟.",
        "fileEmpty": "⚠️ 𝑇ℎ𝑒 𝑓𝑖𝑙𝑒 \"%1.𝑗𝑠\" 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦. 𝑁𝑜𝑡ℎ𝑖𝑛𝑔 𝑡𝑜 𝑢𝑝𝑙𝑜𝑎𝑑.",
        "success": `
✅ 𝐺𝑖𝑠𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!
━━━━━━━━━━━━━━━
📝 𝐹𝑖𝑙𝑒𝑛𝑎𝑚𝑒: %1.𝑗𝑠
📂 𝑆𝑜𝑢𝑟𝑐𝑒: %2
🔗 𝐺𝑖𝑠𝑡 𝑈𝑅𝐿: %3
🔗 𝑅𝑎𝑤 𝑈𝑅𝐿: %4
━━━━━━━━━━━━━━━
💡 𝑇𝑖𝑝: 𝑈𝑠𝑒 𝑡ℎ𝑒 𝑟𝑎𝑤 𝑈𝑅𝐿 𝑓𝑜𝑟 𝑑𝑖𝑟𝑒𝑐𝑡 𝑎𝑐𝑐𝑒𝑠𝑠 𝑡𝑜 𝑐𝑙𝑒𝑎𝑛 𝑐𝑜𝑑𝑒.
        `.trim(),
        "timeout": "⚠️ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.",
        "notFound": "❌ 𝐺𝑖𝑠𝑡 𝐴𝑃𝐼 𝑒𝑛𝑑𝑝𝑜𝑖𝑛𝑡 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑.",
        "unavailable": "❌ 𝐺𝑖𝑠𝑡 𝐴𝑃𝐼 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.",
        "invalidResponse": "⚠️ 𝑅𝑒𝑐𝑒𝑖𝑣𝑒𝑑 𝑖𝑛𝑣𝑎𝑙𝑖𝑑 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑓𝑟𝑜𝑚 𝐺𝑖𝑠𝑡 𝐴𝑃𝐼.",
        "unknownError": "❌ 𝐴𝑛 𝑢𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡."
    }
};

module.exports.onStart = async function({ message, event, args }) {
    const { threadID, messageID, messageReply } = event;
    const lang = module.exports.languages["en"];

    try {
        // Check dependencies
        if (!axios) throw new Error("𝑎𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        if (!fs.existsSync) throw new Error("𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");

        // Ensure filename provided
        if (!args[0]) {
            return message.reply(lang.missingFileName);
        }

        const fileName = args[0].replace(/\.js$/i, "");
        let codeContent = "";

        // If user replies to a message (with code)
        if (messageReply) {
            codeContent = messageReply.body || "";
            if (!codeContent.trim()) {
                return message.reply(lang.noTextReply);
            }
        } 
        // If user specifies a file from commands folder
        else {
            const commandsDir = path.join(__dirname, "..", "commands");
            const filePath = path.join(commandsDir, `${fileName}.js`);

            if (!fs.existsSync(filePath)) {
                return message.reply(
                    lang.fileNotFound.replace("%1", fileName)
                );
            }

            codeContent = await fs.readFile(filePath, "utf-8");

            if (!codeContent.trim()) {
                return message.reply(
                    lang.fileEmpty.replace("%1", fileName)
                );
            }
        }

        // Call external API to create gist
        const gistAPI = "https://noobs-api-sable.vercel.app/gist";
        const response = await axios.get(gistAPI, {
            params: {
                filename: `${fileName}.js`,
                code: codeContent,
                description: "𝑈𝑝𝑙𝑜𝑎𝑑𝑒𝑑 𝑣𝑖𝑎 𝐵𝑜𝑡",
                isPublic: true
            },
            timeout: 20000
        });

        // Handle invalid response
        if (!response.data?.success || !response.data?.raw_url) {
            throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
        }

        // Extract gist details
        const rawUrl = response.data.raw_url;
        const gistUrl = rawUrl.replace("/raw/", "/");
        const sourceType = messageReply ? "𝑀𝑒𝑠𝑠𝑎𝑔𝑒 𝑅𝑒𝑝𝑙𝑦" : "𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐹𝑖𝑙𝑒";

        // Success message with rich formatting
        const successMsg = lang.success
            .replace("%1", fileName)
            .replace("%2", sourceType)
            .replace("%3", gistUrl)
            .replace("%4", rawUrl);

        return message.reply(successMsg);

    } catch (error) {
        console.error("[𝐺𝑖𝑠𝑡 𝐶𝑜𝑚𝑚𝑎𝑛𝑑] 𝐸𝑟𝑟𝑜𝑟:", error);

        let errorMessage = lang.unknownError;

        if (error.code === "ECONNABORTED") {
            errorMessage = lang.timeout;
        } 
        else if (error.response) {
            if (error.response.status === 404) {
                errorMessage = lang.notFound;
            } else {
                errorMessage = lang.unavailable;
            }
        } 
        else if (error.message.includes("ENOENT")) {
            errorMessage = lang.fileNotFound.replace("%1", args[0] || "𝑢𝑛𝑘𝑛𝑜𝑤𝑛");
        } 
        else if (error.message.includes("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒")) {
            errorMessage = lang.invalidResponse;
        }
        else if (error.message.includes("𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑")) {
            errorMessage = `❌ ${error.message}`;
        }

        return message.reply(errorMessage);
    }
};
