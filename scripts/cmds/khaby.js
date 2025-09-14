const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
    name: "khaby",
    aliases: ["khaby-meme", "meme"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "✨ 𝐶𝑟𝑒𝑎𝑡𝑒 𝐾ℎ𝑎𝑏𝑦 𝐿𝑎𝑚𝑒 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    longDescription: {
        en: "✨ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝐾ℎ𝑎𝑏𝑦 𝐿𝑎𝑚𝑒 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
        en: "{p}khaby <𝑡𝑒𝑥𝑡1> | <𝑡𝑒𝑥𝑡2>\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}khaby 𝐶𝑎𝑛'𝑡 𝑏𝑒𝑙𝑖𝑒𝑣𝑒 | 𝐼𝑡'𝑠 𝑡ℎ𝑎𝑡 𝑒𝑎𝑠𝑦"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "missingInput": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑡ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑓𝑜𝑟𝑚𝑎𝑡: {p}%1 <𝑡𝑒𝑥𝑡1> | <𝑡𝑒𝑥𝑡2>\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}%1 𝐶𝑎𝑛'𝑡 𝑏𝑒𝑙𝑖𝑒𝑣𝑒 | 𝐼𝑡'𝑠 𝑡ℎ𝑎𝑡 𝑒𝑎𝑠𝑦"
    }
};

module.exports.onStart = async function ({ api, event, args, getText }) {
    try {
        const { threadID, messageID } = event;
        const content = args.join(" ");

        if (!content || !content.includes("|")) {
            return api.sendMessage(getText("missingInput", this.config.name), threadID, messageID);
        }

        const [text1, text2] = content.split("|").map(text => text.trim());
        
        if (!text1 || !text2) {
            return api.sendMessage(getText("missingInput", this.config.name), threadID, messageID);
        }

        const memeUrl = `https://api.memegen.link/images/khaby-lame/${encodeURIComponent(text1)}/${encodeURIComponent(text2)}.png`;
        const cachePath = __dirname + "/cache/khaby_meme.png";

        const response = await axios({
            method: 'GET',
            url: memeUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(cachePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            api.sendMessage({
                body: "✅ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝐾ℎ𝑎𝑏𝑦 𝑚𝑒𝑚𝑒!",
                attachment: fs.createReadStream(cachePath)
            }, threadID, () => {
                fs.unlinkSync(cachePath);
            }, messageID);
        });

        writer.on('error', (error) => {
            console.error("𝑀𝑒𝑚𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
            api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", threadID, messageID);
        });

    } catch (error) {
        console.error("𝐾ℎ𝑎𝑏𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", event.threadID, event.messageID);
    }
};
