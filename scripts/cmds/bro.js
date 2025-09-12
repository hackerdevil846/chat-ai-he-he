const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "bro",
    aliases: ["brother", "juti"],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "image-edit",
    shortDescription: {
        en: "𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑡ℎ𝑒𝑘𝑒 𝐽𝑢𝑡𝑖 𝑃𝑎𝑤𝑎 👬"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑏𝑟𝑜𝑡ℎ𝑒𝑟-𝑡ℎ𝑒𝑚𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
        en: "{p}bro [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.languages = {
    "en": {
        "missingMention": "❌ | 𝐸𝑘𝑗𝑜𝑛𝑘𝑒 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝐾𝑎𝑟𝑜, 𝑅𝑒 𝐵𝑜𝑘𝑎 😅"
    }
};

module.exports.onLoad = async function() {
    const { existsSync, mkdirSync } = fs;
    const dirMaterial = path.join(__dirname, 'cache', 'canvas');
    const filePath = path.join(dirMaterial, 'sis.png');
    
    if (!existsSync(dirMaterial)) {
        mkdirSync(dirMaterial, { recursive: true });
    }
    
    if (!existsSync(filePath)) {
        try {
            const imageData = await axios.get("https://i.imgur.com/n2FGJFe.jpg", { 
                responseType: 'arraybuffer' 
            });
            await fs.writeFile(filePath, imageData.data);
        } catch (error) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑏𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒:", error);
        }
    }
};

async function makeImage({ one, two }) {
    const __root = path.join(__dirname, "cache", "canvas");
    const batgiamPath = path.join(__root, "sis.png");
    const outputPath = path.join(__root, `batman${one}_${two}.png`);
    const avatarOnePath = path.join(__root, `avt_${one}.png`);
    const avatarTwoPath = path.join(__root, `avt_${two}.png`);

    try {
        // Download and process first avatar
        const avatarOneData = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
            responseType: 'arraybuffer'
        });
        await fs.writeFile(avatarOnePath, avatarOneData.data);

        // Download and process second avatar
        const avatarTwoData = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
            responseType: 'arraybuffer'
        });
        await fs.writeFile(avatarTwoPath, avatarTwoData.data);

        // Load base image
        const batgiamImg = await jimp.read(batgiamPath);
        
        // Create circular avatars
        const circleOne = await jimp.read(await createCircleImage(avatarOnePath));
        const circleTwo = await jimp.read(await createCircleImage(avatarTwoPath));
        
        // Composite avatars onto base image
        batgiamImg.composite(circleOne.resize(191, 191), 93, 111)
                 .composite(circleTwo.resize(190, 190), 434, 107);

        // Save the final image
        const imageBuffer = await batgiamImg.getBufferAsync("image/png");
        await fs.writeFile(outputPath, imageBuffer);

        // Clean up temporary files
        await fs.remove(avatarOnePath);
        await fs.remove(avatarTwoPath);

        return outputPath;

    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑚𝑎𝑘𝑒𝐼𝑚𝑎𝑔𝑒:", error);
        throw error;
    }
}

async function createCircleImage(imagePath) {
    try {
        const image = await jimp.read(imagePath);
        image.circle();
        return await image.getBufferAsync("image/png");
    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑖𝑚𝑎𝑔𝑒:", error);
        throw error;
    }
}

module.exports.onStart = async function({ message, event, args }) {
    try {
        const { threadID, messageID, senderID } = event;
        const mention = Object.keys(event.mentions);
        
        if (!mention[0]) {
            return message.reply(this.languages.en.missingMention);
        }
        
        const one = senderID;
        const two = mention[0];
        
        const imagePath = await makeImage({ one, two });
        
        const body = `✧•❁𝐵ℎ𝑎𝑖-𝐵𝑜𝑛❁•✧

╔═══❖••° °••❖═══╗
   𝑆𝑎𝑝ℎ𝑎𝑙𝑎𝑏𝑎𝑠𝑎 𝐽𝑢𝑡𝑖
╚═══❖••° °••❖═══╝

   ✶⊶⊷⊷❍⊶⊷⊷✶
       👑𝑁𝑖𝑦𝑒 𝑃𝑒𝑙𝑒𝑛 𝐵𝑟𝑜❤
𝑇𝑜𝑚𝑎𝑟 𝐽𝑒𝑛𝑜 𝐵ℎ𝑎𝑖 🩷
   ✶⊶⊷⊷❍⊶⊷⊷✶`;
        
        await message.reply({
            body: body,
            attachment: fs.createReadStream(imagePath)
        });

        // Clean up the generated image
        setTimeout(() => {
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }, 5000);

    } catch (error) {
        console.error("𝑀𝑎𝑖𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒.");
    }
};
