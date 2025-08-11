const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "pooh",
    version: "1.2.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Generate Winnie the Pooh memes with custom text",
    category: "image",
    usages: "[text 1] | [text 2]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

// Added the required onStart function
module.exports.onStart = function() {
    console.log("[!] Pooh meme command initialized");
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID, senderID } = event;
    const cacheDir = path.join(__dirname, 'cache', 'pooh_memes');
    
    try {
        // Create cache directory
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // Clean up previous files from this user
        const oldFiles = fs.readdirSync(cacheDir).filter(file => 
            file.startsWith(`pooh_${senderID}_`)
        );
        oldFiles.forEach(file => fs.unlinkSync(path.join(cacheDir, file)));

        // Process input text
        const inputText = args.join(" ");
        if (!inputText.includes("|") || args.length === 0) {
            return api.sendMessage(
                `🧸 Winnie the Pooh Meme Generator\n\n` +
                `Usage: pooh [text 1] | [text 2]\n` +
                `Example: pooh I love honey | Me too Pooh\n\n` +
                `Note: Maximum 50 characters per text field`,
                threadID,
                messageID
            );
        }

        const [text1, text2] = inputText.split("|").map(t => t.trim());
        if (!text1 || !text2) {
            return api.sendMessage(
                "🧸 | Please provide both text fields separated by |",
                threadID,
                messageID
            );
        }

        // Validate text length
        if (text1.length > 50 || text2.length > 50) {
            return api.sendMessage(
                "⚠️ | Text is too long! Maximum 50 characters per field.",
                threadID,
                messageID
            );
        }

        // Generate image path
        const imagePath = path.join(cacheDir, `pooh_${senderID}_${Date.now()}.png`);

        // Send processing message
        const processingMsg = await api.sendMessage(
            `🧸 Creating your Pooh meme...\n"${text1}" | "${text2}"`,
            threadID
        );

        // Fetch image from API
        const apiUrl = `https://api.popcat.xyz/pooh?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`;
        const response = await axios({
            url: apiUrl,
            method: 'GET',
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });

        // Save image to cache
        fs.writeFileSync(imagePath, response.data);

        // Send result
        await api.sendMessage({
            body: `🧸 Your Pooh meme is ready!\n"${text1}" | "${text2}"`,
            attachment: fs.createReadStream(imagePath)
        }, threadID, () => {
            // Clean up after sending
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
                api.unsendMessage(processingMsg.messageID);
            } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError);
            }
        }, messageID);

    } catch (error) {
        console.error('Pooh Command Error:', error);
        api.sendMessage(
            "❌ Failed to generate Pooh image. Please try again later with different text.",
            threadID,
            messageID
        );
    }
};
