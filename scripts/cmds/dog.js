const axios = require('axios');
const request = require('request');
const fs = require("fs-extra");

module.exports.config = {
    name: "dog",
    aliases: ["puppy", "doggie"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 1,
    role: 0,
    category: "𝑚𝑒𝑑𝑖𝑎",
    shortDescription: {
        en: "🐶 𝐵𝑜𝑠𝑠 𝑘𝑒 𝑑𝑒𝑘ℎ𝑎𝑟 𝑗𝑜𝑛𝑛𝑜"
    },
    longDescription: {
        en: "🐾 𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑑𝑜𝑔 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    guide: {
        en: "{p}dog"
    },
    dependencies: {
        "axios": "",
        "request": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event }) {
    try {
        const response = await axios.get('https://nekos.life/api/v2/img/woof');
        const ext = response.data.url.substring(response.data.url.lastIndexOf(".") + 1);
        const path = __dirname + `/cache/dog.${ext}`;
        
        request(response.data.url).pipe(fs.createWriteStream(path)).on("close", () => {
            message.reply({
                body: `🐕‍🦺 | 𝐷𝑜𝑔 𝑃𝑖𝑐 𝑓𝑜𝑟 𝑦𝑜𝑢 𝑏𝑜𝑠𝑠!`,
                attachment: fs.createReadStream(path)
            }, (err) => {
                if (!err) fs.unlinkSync(path);
            });
        });
    } catch (error) {
        console.error("𝐷𝑜𝑔 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ | 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑑𝑜𝑔 𝑖𝑚𝑎𝑔𝑒!");
    }
};
