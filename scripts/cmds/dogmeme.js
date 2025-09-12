const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp');

module.exports.config = {
    name: "dogmeme",
    aliases: ["doggo", "puppymeme"],
    version: "4.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "🐕 𝐶𝑟𝑒𝑎𝑡𝑒 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑙𝑖𝑧𝑒𝑑 𝑑𝑜𝑔 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑓𝑜𝑟𝑚𝑎𝑡𝑡𝑖𝑛𝑔"
    },
    longDescription: {
        en: "🐶 𝐶𝑟𝑒𝑎𝑡𝑒 𝑓𝑢𝑛𝑛𝑦 𝑑𝑜𝑔 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟 𝑛𝑎𝑚𝑒𝑠 𝑎𝑛𝑑 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
        en: "{p}dogmeme [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "jimp": "",
        "moment-timezone": ""
    },
    envConfig: {
        dogApi: "https://dog.ceo/api/breeds/image/random"
    }
};

module.exports.languages = {
    "en": {
        "processing": "🐾 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑎 𝑑𝑜𝑔 𝑚𝑒𝑚𝑒 𝑓𝑜𝑟 %1...\n⏱️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 10-15 𝑠𝑒𝑐𝑜𝑛𝑑𝑠...",
        "success": "🐶 %1, 𝑦𝑜𝑢'𝑣𝑒 𝑏𝑒𝑒𝑛 𝑑𝑜𝑔𝑔𝑜-𝑓𝑖𝑒𝑑! 🎉",
        "error": "😿 𝑊𝑜𝑜𝑓! 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔...\n• 𝐷𝑜𝑔 𝐴𝑃𝐼 𝑚𝑖𝑔ℎ𝑡 𝑏𝑒 𝑑𝑜𝑤𝑛\n• 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟\n• 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑒𝑙𝑠𝑒"
    }
};

module.exports.onStart = async function ({ api, event, args, getText }) {
    try {
        const { threadID, messageID, senderID } = event;
        
        // Get target user
        const targetID = Object.keys(event.mentions)[0] || senderID;
        const userName = await this.getUserName(api, targetID);
        
        // Show processing message
        const processingMsg = await api.sendMessage(
            getText("processing", userName), 
            threadID
        );

        // Create meme
        const memePath = await this.createDogMeme(targetID, userName);
        
        // Send result
        await api.sendMessage({
            body: getText("success", userName),
            mentions: [{
                tag: userName,
                id: targetID
            }],
            attachment: fs.createReadStream(memePath)
        }, threadID, messageID);
        
        // Clean up
        fs.unlinkSync(memePath);
        api.unsendMessage(processingMsg.messageID);
        
    } catch (error) {
        console.error("❌ 𝐷𝑜𝑔𝑀𝑒𝑚𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage(
            getText("error"),
            event.threadID,
            event.messageID
        );
    }
};

module.exports.getUserName = async function(api, userID) {
    try {
        const userInfo = await api.getUserInfo(userID);
        return userInfo[userID]?.name || "𝐹𝑟𝑖𝑒𝑛𝑑";
    } catch {
        return "𝐹𝑟𝑖𝑒𝑛𝑑";
    }
};

module.exports.createDogMeme = async function(userID, userName) {
    const cacheDir = path.join(__dirname, 'cache', 'dogmeme');
    
    // Ensure cache directory exists
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    const memePath = path.join(cacheDir, `dogmeme_${userID}_${Date.now()}.jpg`);
    
    try {
        // Get random dog image from API
        const dogResponse = await axios.get(this.config.envConfig.dogApi, {
            timeout: 15000
        });
        
        const dogImage = dogResponse.data.message;
        if (!dogImage) throw new Error("𝑁𝑜 𝑑𝑜𝑔 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑢𝑛𝑑");
        
        // Download dog image
        const dogPath = path.join(cacheDir, `dog_temp_${Date.now()}.jpg`);
        const imageResponse = await axios.get(dogImage, {
            responseType: 'arraybuffer',
            timeout: 15000
        });
        
        await fs.writeFile(dogPath, Buffer.from(imageResponse.data, 'binary'));
        
        // Process image with Jimp
        const image = await jimp.read(dogPath);
        
        // Load fonts
        const titleFont = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
        const subtitleFont = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);
        
        // Prepare text
        const titleText = `${userName} 𝑎𝑠 𝑎 𝑑𝑜𝑔𝑔𝑜!`;
        const subtitleText = "𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑤𝑖𝑡ℎ 🐕 𝐷𝑜𝑔𝑀𝑒𝑚𝑒 𝐶𝑜𝑚𝑚𝑎𝑛𝑑";
        
        // Calculate positions
        const titleWidth = jimp.measureText(titleFont, titleText);
        const titleX = Math.max(20, image.bitmap.width / 2 - titleWidth / 2);
        const titleY = image.bitmap.height - 80;
        
        // Add text background for better readability
        const textBgHeight = 60;
        const textBg = new jimp(image.bitmap.width, textBgHeight, 0xFFFFFFFF);
        
        // Add title text
        textBg.print(
            titleFont, 
            titleX, 
            10, 
            {
                text: titleText,
                alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
            },
            image.bitmap.width,
            textBgHeight
        );
        
        // Add subtitle
        textBg.print(
            subtitleFont, 
            image.bitmap.width - 250, 
            textBgHeight - 25, 
            subtitleText
        );
        
        // Composite text background onto image
        image.composite(textBg, 0, image.bitmap.height - textBgHeight);
        
        // Add rounded corners for better aesthetics
        image.roundCorners(20);
        
        // Save final meme
        await image.quality(90).writeAsync(memePath);
        
        // Clean up temporary files
        fs.unlinkSync(dogPath);
        
        return memePath;
        
    } catch (error) {
        console.error("𝑀𝑒𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
        
        // Fallback to local dog image if available
        const fallbackPath = path.join(__dirname, 'assets', 'dog_fallback.jpg');
        if (fs.existsSync(fallbackPath)) {
            const fallbackCopy = path.join(cacheDir, `fallback_${Date.now()}.jpg`);
            fs.copyFileSync(fallbackPath, fallbackCopy);
            return fallbackCopy;
        }
        
        throw error;
    }
};
