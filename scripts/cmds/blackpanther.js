const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
    name: "blackpanther",
    aliases: ["bpanther", "panthertext"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝐵𝑙𝑎𝑐𝑘 𝑃𝑎𝑛𝑡ℎ𝑒𝑟 𝑚𝑒𝑚𝑒 𝑡𝑒𝑥𝑡"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑐𝑢𝑠𝑡𝑜𝑚 𝐵𝑙𝑎𝑐𝑘 𝑃𝑎𝑛𝑡ℎ𝑒𝑟 𝑠𝑡𝑦𝑙𝑒 𝑡𝑒𝑥𝑡 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑡𝑤𝑜 𝑡𝑒𝑥𝑡 𝑙𝑖𝑛𝑒𝑠"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}blackpanther 𝑡𝑒𝑥𝑡1 | 𝑡𝑒𝑥𝑡2"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function ({ message, event, args }) {
    try {
        // Check dependencies
        if (!axios || !fs.existsSync) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        const text = args.join(" ");
        if (!text.includes(' | ')) {
            return message.reply("✨ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑡ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑓𝑜𝑟𝑚𝑎𝑡: {p}blackpanther 𝑡𝑒𝑥𝑡1 | 𝑡𝑒𝑥𝑡2");
        }

        const [text1, text2] = text.split(' | ').map(t => t.trim());
        
        if (!text1 || !text2) {
            return message.reply("🌸 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑏𝑜𝑡ℎ 𝑡𝑒𝑥𝑡1 𝑎𝑛𝑑 𝑡𝑒𝑥𝑡2 𝑠𝑒𝑝𝑎𝑟𝑎𝑡𝑒𝑑 𝑏𝑦 ' | '");
        }

        // Create assets directory if it doesn't exist
        const assetsDir = __dirname + "/assets/";
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }

        const imagePath = assetsDir + "blackpanther.png";
        const encodedText1 = encodeURIComponent(text1);
        const encodedText2 = encodeURIComponent(text2);
        
        const imageUrl = `https://api.memegen.link/images/wddth/${encodedText1}/${encodedText2}.png`;

        // Download the image
        const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            message.reply({
                body: `🖤 𝐵𝑙𝑎𝑐𝑘 𝑃𝑎𝑛𝑡ℎ𝑒𝑟 𝑇𝑒𝑥𝑡 𝐶𝑟𝑒𝑎𝑡𝑒𝑑! 🐾\n\n» 𝑇𝑒𝑥𝑡 1: ${text1}\n» 𝑇𝑒𝑥𝑡 2: ${text2}`,
                attachment: fs.createReadStream(imagePath)
            }).then(() => {
                // Clean up the file after sending
                fs.unlinkSync(imagePath);
            }).catch(error => {
                console.error("𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", error);
                fs.unlinkSync(imagePath);
            });
        });

        writer.on('error', (error) => {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒:", error);
            message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒");
        });

    } catch (error) {
        console.error("𝐵𝑙𝑎𝑐𝑘 𝑃𝑎𝑛𝑡ℎ𝑒𝑟 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒");
    }
};
