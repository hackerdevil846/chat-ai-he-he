module.exports.config = {
    name: "marry",
    version: "3.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: {
        en: "💍 Propose to someone with a marriage certificate",
        bn: "💍 কারো সাথে বিয়ের প্রস্তাব পাঠান"
    },
    category: {
        en: "Romance",
        bn: "রোমান্স"
    },
    usages: {
        en: "[@mention]",
        bn: "[@মেনশন]"
    },
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async function() {
    const path = require("path");
    const fs = require("fs-extra");
    const dirMaterial = path.resolve(__dirname, 'cache', 'canvas');
    
    if (!fs.existsSync(dirMaterial)) 
        fs.mkdirSync(dirMaterial, { recursive: true });
    
    const bgPath = path.resolve(dirMaterial, 'marry_bg.png');
    if (!fs.existsSync(bgPath)) {
        // ✅ use existing marrywi.png inside cache/canvas
        const sourcePath = path.resolve(__dirname, 'cache', 'canvas', 'marrywi.png');
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, bgPath);
        } else {
            throw new Error("❌ marrywi.png not found in cache/canvas folder!");
        }
    }
};

module.exports.onStart = async function({ event, api, args, Users }) {
    try {
        const fs = require("fs-extra");
        const path = require("path");
        const axios = require("axios");
        const jimp = require("jimp");
        const { threadID, messageID, senderID } = event;

        // Function to create circular profile images
        const circle = async (imageBuffer) => {
            const image = await jimp.read(imageBuffer);
            image.circle();
            return await image.getBufferAsync("image/png");
        };

        // Process mentions
        const mention = Object.keys(event.mentions);
        if (!mention[0]) 
            return api.sendMessage("🌸 প্রিয়জনের ট্যাগ দিন 💍", threadID, messageID);

        const targetID = mention[0];
        const bgPath = path.resolve(__dirname, 'cache', 'canvas', 'marry_bg.png');
        const outputPath = path.resolve(__dirname, 'cache', 'canvas', `marry_${senderID}_${targetID}.png`);
        
        // Get names for certificate
        const senderName = await Users.getNameUser(senderID);
        const targetName = await Users.getNameUser(targetID);

        // Download profile pictures
        const [avatar1, avatar2] = await Promise.all([
            axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
                { responseType: 'arraybuffer' }),
            axios.get(`https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
                { responseType: 'arraybuffer' })
        ]);

        // Process images
        const bgImage = await jimp.read(bgPath);
        const [circularAvatar1, circularAvatar2] = await Promise.all([
            circle(avatar1.data),
            circle(avatar2.data)
        ]);
        
        // Composite images
        bgImage
            .resize(432, 280)
            .composite(await jimp.read(circularAvatar1).then(img => img.resize(60, 60)), 200, 23)
            .composite(await jimp.read(circularAvatar2).then(img => img.resize(60, 60)), 136, 40);
        
        // Save and send
        await bgImage.writeAsync(outputPath);
        
        return api.sendMessage({
            body: `💞 ${senderName} - ${targetName} এর বিবাহ সনদপত্র\n\n"আমার জীবনের প্রতিটি মুহূর্ত তোমার সাথে কাটাতে চাই 💍"`,
            attachment: fs.createReadStream(outputPath)
        }, threadID, () => fs.unlinkSync(outputPath), messageID);

    } catch (error) {
        console.error('Marry command error:', error);
        return api.sendMessage("❌ প্রেমের প্রস্তাব পাঠাতে সমস্যা হয়েছে! পরে আবার চেষ্টা করুন", event.threadID, event.messageID);
    }
};
