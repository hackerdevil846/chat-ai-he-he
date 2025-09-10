const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
    name: "art",
    aliases: ["animefy", "animeart"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑒𝑑𝑖𝑡𝑖𝑛𝑔",
    shortDescription: {
        en: "𝐴𝑛𝑖𝑚𝑒 𝑒𝑓𝑓𝑒𝑐𝑡 𝑎𝑑𝑑"
    },
    longDescription: {
        en: "𝐴𝑑𝑑𝑠 𝑎𝑛𝑖𝑚𝑒 𝑒𝑓𝑓𝑒𝑐𝑡𝑠 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    guide: {
        en: "{p}art (𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒)"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    try {
        // Check dependencies
        if (!axios || !fs.existsSync) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        let pathie = __dirname + `/cache/animefied.jpg`;
        const { threadID, messageID } = event;

        if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
            return api.sendMessage("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒", threadID, messageID);
        }

        var imageUrl = event.messageReply.attachments[0].url;

        const lim = await axios.get(`https://animeify.shinoyama.repl.co/convert-to-anime?imageUrl=${encodeURIComponent(imageUrl)}`);
        const image = lim.data.urls[1];
        const img = (await axios.get(`https://www.drawever.com${image}`, { responseType: "arraybuffer" })).data;
        
        fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

        await api.sendMessage({
            body: "✅ 𝐴𝑛𝑖𝑚𝑒𝑓𝑖𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑟𝑒𝑎𝑑𝑦!\n𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑚𝑎𝑦 𝑡𝑎𝑘𝑒 𝑎 𝑚𝑜𝑚𝑒𝑛𝑡...",
            attachment: fs.createReadStream(pathie)
        }, threadID, messageID);

        fs.unlinkSync(pathie);

    } catch (e) {
        console.error("𝐴𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", e);
        await api.sendMessage(`❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑:\n${e.message}`, event.threadID, event.messageID);
    }
};
