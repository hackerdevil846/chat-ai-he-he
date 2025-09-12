const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "dogfact",
    aliases: ["dog", "puppyfact"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "🐕 𝑅𝑎𝑛𝑑𝑜𝑚 𝑑𝑜𝑔 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡𝑖𝑛𝑔 𝑓𝑎𝑐𝑡𝑠"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑑𝑜𝑔 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡𝑖𝑛𝑔 𝑓𝑎𝑐𝑡𝑠 𝑎𝑏𝑜𝑢𝑡 𝑑𝑜𝑔𝑠"
    },
    guide: {
        en: "{p}dogfact"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event }) {
    try {
        const { threadID, messageID } = event;

        const res = await axios.get(`https://some-random-api.com/animal/dog`);
        const data = res.data;

        const imageResponse = await axios.get(data.image, { 
            responseType: 'arraybuffer' 
        });
        
        const imagePath = __dirname + '/cache/dog_image.png';
        await fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));

        await message.reply({
            body: `🐶 | 𝐷𝑜𝑔 𝐹𝑎𝑐𝑡:\n${data.fact}`,
            attachment: fs.createReadStream(imagePath)
        });

        fs.unlinkSync(imagePath);
            
    } catch (error) {
        console.error("𝐷𝑜𝑔𝐹𝑎𝑐𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑑𝑜𝑔 𝑓𝑎𝑐𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
