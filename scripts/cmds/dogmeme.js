const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp');

module.exports.config = {
    name: "dogmeme",
    version: "4.0.0",
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    hasPermssion: 0,
    description: "🐕 Create personalized dog memes with beautiful formatting",
    category: "fun",
    usages: "[@mention]",
    cooldowns: 15,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "jimp": ""
    },
    envConfig: {
        dogApi: "https://dog.ceo/api/breeds/image/random"
    }
};

module.exports.languages = {
    "en": {
        "processing": "🐾 Creating a dog meme for %1...\n⏱️ Please wait 10-15 seconds...",
        "success": "🐶 %1, you've been doggo-fied! 🎉",
        "error": "😿 Woof! Something went wrong...\n• Dog API might be down\n• Try again later\n• Mention someone else"
    }
};

module.exports.run = async function ({ api, event, args, getText }) {
    const { threadID, messageID, senderID } = event;
    
    try {
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
        console.error("❌ DogMeme Error:", error);
        api.sendMessage(
            getText("error"),
            threadID,
            messageID
        );
    }
};

module.exports.getUserName = async function(api, userID) {
    try {
        const userInfo = await api.getUserInfo(userID);
        return userInfo[userID]?.name || "Friend";
    } catch {
        return "Friend";
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
        if (!dogImage) throw new Error("No dog image found");
        
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
        const titleText = `${userName} as a doggo!`;
        const subtitleText = "Created with 🐕 DogMeme Command";
        
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
        console.error("Meme creation error:", error);
        
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
