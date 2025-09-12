const fs = require("fs-extra");
const axios = require("axios");
const request = require("request");

module.exports.config = {
    name: "download",
    aliases: ["dl", "getfile"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "𝑠𝑦𝑠𝑡𝑒𝑚",
    shortDescription: {
        en: "📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑖𝑙𝑒𝑠 𝑓𝑟𝑜𝑚 𝑙𝑖𝑛𝑘𝑠"
    },
    longDescription: {
        en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑖𝑙𝑒𝑠 𝑓𝑟𝑜𝑚 𝑒𝑥𝑡𝑒𝑟𝑛𝑎𝑙 𝑙𝑖𝑛𝑘𝑠 𝑡𝑜 𝑡ℎ𝑒 𝑏𝑜𝑡'𝑠 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    guide: {
        en: "{p}download [𝑝𝑎𝑡ℎ] <𝑙𝑖𝑛𝑘>"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "request": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        // Check dependencies
        if (!fs.existsSync || !axios || !request) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        let path, link;
        
        if (args.length < 1) {
            return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑎𝑔𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑙𝑖𝑛𝑘");
        }

        if (args.length === 1) {
            path = __dirname;
            link = args[0];
        } else {
            path = __dirname + '/' + args[0];
            link = args.slice(1).join(" ");
        }

        // Validate link
        if (!link.startsWith('http')) {
            return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑙𝑖𝑛𝑘! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝐻𝑇𝑇𝑃/𝐻𝑇𝑇𝑃𝑆 𝑙𝑖𝑛𝑘");
        }

        // Create directory if it doesn't exist
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }

        // Get filename from URL
        const format = request.get(link);
        const namefile = format.uri.pathname;
        const fileName = namefile.slice(namefile.lastIndexOf("/") + 1);
        const fullPath = path + '/' + fileName;

        await message.reply("⏳ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑓𝑖𝑙𝑒...");

        const response = await axios.get(link, { 
            responseType: "arraybuffer",
            timeout: 30000
        });
        
        fs.writeFileSync(fullPath, Buffer.from(response.data, "utf-8"));

        return message.reply(`✅ 𝐹𝑖𝑙𝑒 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑡𝑜:\n📁 ${fullPath}`);
        
    } catch (error) {
        console.error("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        
        if (error.code === 'ENOTFOUND') {
            return message.reply("❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑟𝑒𝑠𝑜𝑙𝑣𝑒 𝑡ℎ𝑒 𝑑𝑜𝑚𝑎𝑖𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑙𝑖𝑛𝑘.");
        } else if (error.response && error.response.status === 404) {
            return message.reply("❌ 𝐹𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡 𝑡ℎ𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑 𝑙𝑖𝑛𝑘.");
        } else if (error.code === 'ECONNABORTED') {
            return message.reply("❌ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        }
        
        return message.reply("❌ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑙𝑖𝑛𝑘 𝑎𝑛𝑑 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛");
    }
};
