const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const jimp = require("jimp");

module.exports.config = {
    name: "chor",
    aliases: ["caught", "scooby"],
    version: "1.2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "image",
    shortDescription: {
        en: "🖼️ 𝐶𝑟𝑒𝑎𝑡𝑒 𝑆𝑐𝑜𝑜𝑏𝑦-𝐷𝑜𝑜 '𝑔𝑜𝑡 𝑐𝑎𝑢𝑔ℎ𝑡' 𝑚𝑒𝑚𝑒𝑠"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑓𝑢𝑛𝑛𝑦 𝑆𝑐𝑜𝑜𝑏𝑦-𝐷𝑜𝑜 𝑠𝑡𝑦𝑙𝑒 '𝑐𝑎𝑢𝑔ℎ𝑡' 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟𝑠"
    },
    guide: {
        en: "{p}chor [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "canvas": "",
        "jimp": ""
    }
};

module.exports.languages = {
    "en": {
        "processing": "🖌️ 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 %1 𝑐𝑎𝑢𝑔ℎ𝑡 𝑚𝑒𝑚𝑒... 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡!",
        "success": "🚨 %1 𝑔𝑜𝑡 𝑐𝑎𝑢𝑔ℎ𝑡 𝑟𝑒𝑑-ℎ𝑎𝑛𝑑𝑒𝑑!",
        "error": "😿 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟 𝑜𝑟 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑒𝑙𝑠𝑒."
    }
};

module.exports.onStart = async function({ api, event, args, Users }) {
    const { threadID, messageID } = event;
    
    try {
        // Check dependencies
        if (!fs.existsSync || !axios || !createCanvas || !jimp) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        // Determine target user
        let targetID, targetName;
        
        if (Object.keys(event.mentions).length > 0) {
            targetID = Object.keys(event.mentions)[0];
            targetName = event.mentions[targetID];
        } else {
            targetID = event.senderID;
            const userInfo = await Users.getInfo(targetID);
            targetName = userInfo.name || "𝑈𝑠𝑒𝑟";
        }

        // Create cache directory
        const cacheDir = path.join(__dirname, "chor-cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        const outputPath = path.join(cacheDir, `chor_${targetID}_${Date.now()}.jpg`);
        
        // Show processing message
        const processingMsg = await api.sendMessage(
            module.exports.languages.en.processing.replace("%1", targetName),
            threadID
        );

        // Create the meme
        await createMeme(targetID, outputPath);
        
        // Send result
        await api.sendMessage({
            body: module.exports.languages.en.success.replace("%1", targetName),
            attachment: fs.createReadStream(outputPath)
        }, threadID, messageID);
        
        // Delete processing message
        api.unsendMessage(processingMsg.messageID);
        
        // Clean up generated image
        fs.unlinkSync(outputPath);

    } catch (error) {
        console.error("❌ 𝐶ℎ𝑜𝑟 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage(
            module.exports.languages.en.error,
            threadID,
            messageID
        );
    }
};

async function createMeme(userID, outputPath) {
    try {
        // Background template URL
        const templateURL = "https://i.imgur.com/ES28alv.png";
        
        // Load background
        const bgResponse = await axios.get(templateURL, { responseType: 'arraybuffer' });
        const background = await loadImage(Buffer.from(bgResponse.data));
        
        // Create canvas
        const canvas = createCanvas(background.width, background.height);
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        // Process and draw avatar
        const avatarPath = await processAvatar(userID);
        const avatar = await loadImage(avatarPath);
        
        // Draw circular avatar (position adjusted for template)
        ctx.save();
        ctx.beginPath();
        ctx.arc(103, 465, 55, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 48, 410, 111, 111);
        ctx.restore();
        
        // Add watermark
        ctx.font = "14px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillText("✨ 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑", 10, canvas.height - 10);
        
        // Save as JPEG
        const out = fs.createWriteStream(outputPath);
        const stream = canvas.createJPEGStream({ quality: 0.95 });
        stream.pipe(out);
        
        // Wait for image to finish saving
        await new Promise((resolve, reject) => {
            out.on('finish', resolve);
            out.on('error', reject);
        });
        
        // Clean up avatar
        fs.unlinkSync(avatarPath);
        
        return outputPath;
        
    } catch (error) {
        console.error("🖼️ 𝑀𝑒𝑚𝑒 𝐶𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
        throw error;
    }
}

async function processAvatar(userID) {
    const cacheDir = path.join(__dirname, "chor-cache");
    const avatarPath = path.join(cacheDir, `avt_${userID}_${Date.now()}.png`);
    
    try {
        // Download avatar
        const avatarURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const { data } = await axios.get(avatarURL, { responseType: "arraybuffer" });
        await fs.writeFile(avatarPath, Buffer.from(data));
        
        // Circle crop using Jimp
        const image = await jimp.read(avatarPath);
        await image.circle();
        await image.writeAsync(avatarPath);
        
        return avatarPath;
        
    } catch (error) {
        console.error("👤 𝐴𝑣𝑎𝑡𝑎𝑟 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝐸𝑟𝑟𝑜𝑟:", error);
        throw error;
    }
}
