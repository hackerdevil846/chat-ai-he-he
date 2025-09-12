const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "embrace",
    aliases: ["hug", "cuddle"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "love",
    shortDescription: {
        en: "𝐸𝑚𝑏𝑟𝑎𝑐𝑒 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑 𝑎𝑛 𝑒𝑚𝑏𝑟𝑎𝑐𝑒 𝑡𝑜 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑦𝑜𝑢 𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
    },
    guide: {
        en: "{p}embrace @𝑡𝑎𝑔"
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

        const mention = Object.keys(event.mentions)[0];
        if (!mention) {
            return api.sendMessage("𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑒𝑚𝑏𝑟𝑎𝑐𝑒!", event.threadID, event.messageID);
        }

        const tag = event.mentions[mention].replace("@", "");
        const links = [
            "https://genk.mediacdn.vn/2016/04-1483112033497.gif",
            "https://i.pinimg.com/originals/85/72/a1/8572a1d1ebaa45fae290e6760b59caac.gif",
            "https://media1.tenor.com/m/5UynzQqlOp0AAAAC/hug-anime.gif",
            "https://media1.tenor.com/m/7SKkE4eWqjMAAAAC/hug-love.gif",
            "https://media1.tenor.com/m/7SKkE4eWqjMAAAAC/hug-love.gif"
        ];
        
        const url = links[Math.floor(Math.random() * links.length)];
        const path = __dirname + "/cache/embrace.gif";

        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(path);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            await api.sendMessage({
                body: `${tag} 💖, 𝐼 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑒𝑚𝑏𝑟𝑎𝑐𝑒 𝑦𝑜𝑢!`,
                mentions: [{
                    tag: tag,
                    id: mention
                }],
                attachment: fs.createReadStream(path)
            }, event.threadID, () => {
                fs.unlinkSync(path);
            }, event.messageID);
        });

        writer.on('error', (error) => {
            console.error(error);
            api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑒𝑚𝑏𝑟𝑎𝑐𝑒 𝑔𝑖𝑓", event.threadID, event.messageID);
        });

    } catch (error) {
        console.error("𝐸𝑚𝑏𝑟𝑎𝑐𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑒𝑚𝑏𝑟𝑎𝑐𝑒", event.threadID, event.messageID);
    }
};
