const { downloadVideo } = require("priyansh-all-dl");
const axios = require("axios");
const fs = require("fs-extra");
const tempy = require("tempy");
const path = require("path");

module.exports.config = {
    name: "fbautodownload",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "✨ 𝐀𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐥𝐥𝐲 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐯𝐢𝐝𝐞𝐨𝐬 𝐟𝐫𝐨𝐦 𝐬𝐡𝐚𝐫𝐞𝐝 𝐥𝐢𝐧𝐤𝐬",
    commandCategory: "𝗠𝗘𝗗𝗜𝗔",
    usages: "[𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐯𝐢𝐝𝐞𝐨 𝐔𝐑𝐋]",
    cooldowns: 5,
    dependencies: {
        "priyansh-all-dl": "",
        "axios": "",
        "fs-extra": "",
        "tempy": ""
    },
    envConfig: {
        maxFileSize: 25 // MB
    }
};

module.exports.handleEvent = async function({ api, event }) {
    if (event.type !== "message" || !event.body) return;
    
    // Enhanced Facebook URL pattern matching
    const fbPatterns = [
        /https?:\/\/(www\.|m\.)?facebook\.com\/.*\/videos\/.*/i,
        /https?:\/\/(www\.|m\.)?facebook\.com\/share\/.*/i,
        /https?:\/\/(www\.|m\.)?facebook\.com\/reel\/.*/i,
        /https?:\/\/(www\.|m\.)?facebook\.com\/.*\/posts\/.*/i,
        /https?:\/\/(www\.|m\.)?fb\.watch\/.*/i
    ];
    
    const isFacebookLink = fbPatterns.some(pattern => pattern.test(event.body));
    
    if (isFacebookLink) {
        try {
            // Send initial reaction to indicate processing
            api.setMessageReaction("📥", event.messageID, () => {}, true);
            
            // Send processing message
            const processingMsg = await api.sendMessage("🔍 𝐃𝐞𝐭𝐞𝐜𝐭𝐞𝐝 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐥𝐢𝐧𝐤!\n📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐯𝐢𝐝𝐞𝐨...", event.threadID);
            
            const videoInfo = await downloadVideo(event.body);
            
            // Find the best available quality
            const qualityOrder = ["1080p", "720p", "480p", "360p", "hd", "sd"];
            let videoUrl = null;
            
            for (const quality of qualityOrder) {
                if (videoInfo[quality] && videoInfo[quality] !== "Not found") {
                    videoUrl = videoInfo[quality];
                    break;
                }
            }
            
            // If no specific quality found, try to get any available link
            if (!videoUrl) {
                const availableLinks = Object.values(videoInfo).filter(link => 
                    link && link !== "Not found" && link.startsWith("http")
                );
                if (availableLinks.length > 0) {
                    videoUrl = availableLinks[0];
                }
            }
            
            if (!videoUrl) {
                throw new Error("❌ 𝐍𝐨 𝐯𝐢𝐝𝐞𝐨 𝐟𝐨𝐮𝐧𝐝 𝐨𝐫 𝐯𝐢𝐝𝐞𝐨 𝐢𝐬 𝐧𝐨𝐭 𝐚𝐜𝐜𝐞𝐬𝐬𝐢𝐛𝐥𝐞");
            }
            
            // Download the video
            const response = await axios({
                method: 'GET',
                url: videoUrl,
                responseType: 'stream'
            });
            
            const tempFilePath = tempy.file({ extension: "mp4" });
            const writer = fs.createWriteStream(tempFilePath);
            
            response.data.pipe(writer);
            
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            
            // Check file size
            const stats = fs.statSync(tempFilePath);
            const fileSizeInMB = stats.size / (1024 * 1024);
            
            if (fileSizeInMB > module.exports.config.envConfig.maxFileSize) {
                fs.unlinkSync(tempFilePath);
                await api.unsendMessage(processingMsg.messageID);
                return api.sendMessage(
                    `❌ 𝐕𝐢𝐝𝐞𝐨 𝐢𝐬 𝐭𝐨𝐨 𝐥𝐚𝐫𝐠𝐞 (${fileSizeInMB.toFixed(2)}MB). 𝐌𝐚𝐱𝐢𝐦𝐮𝐦 𝐚𝐥𝐥𝐨𝐰𝐞𝐝: ${module.exports.config.envConfig.maxFileSize}MB`,
                    event.threadID,
                    event.messageID
                );
            }
            
            // Send the video
            await api.unsendMessage(processingMsg.messageID);
            await api.sendMessage({
                body: `✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝!\n📊 𝐅𝐢𝐥𝐞 𝐬𝐢𝐳𝐞: ${fileSizeInMB.toFixed(2)}MB\n✨ 𝐂𝐫𝐞𝐝𝐢𝐭𝐬: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
                attachment: fs.createReadStream(tempFilePath)
            }, event.threadID, event.messageID);
            
            // Clean up
            fs.unlinkSync(tempFilePath);
            api.setMessageReaction("✅", event.messageID, () => {}, true);
            
        } catch (error) {
            console.error("Download error:", error);
            api.setMessageReaction("❌", event.messageID, () => {}, true);
            
            let errorMessage = "❌ 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐟𝐚𝐢𝐥𝐞𝐝: ";
            
            if (error.message.includes("No video found")) {
                errorMessage += "𝐕𝐢𝐝𝐞𝐨 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝 𝐨𝐫 𝐧𝐨𝐭 𝐚𝐜𝐜𝐞𝐬𝐬𝐢𝐛𝐥𝐞";
            } else if (error.message.includes("timeout")) {
                errorMessage += "𝐑𝐞𝐪𝐮𝐞𝐬𝐭 𝐭𝐢𝐦𝐞𝐝 𝐨𝐮𝐭";
            } else {
                errorMessage += "𝐔𝐧𝐞𝐱𝐩𝐞𝐜𝐭𝐞𝐝 𝐞𝐫𝐫𝐨𝐫";
            }
            
            errorMessage += "\n\n⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫";
            
            api.sendMessage(errorMessage, event.threadID, event.messageID);
        }
    }
};

module.exports.run = async function({ api, event, args }) {
    if (args.length === 0) {
        return api.sendMessage(
            `🌟 𝐇𝐨𝐰 𝐭𝐨 𝐮𝐬𝐞 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐕𝐢𝐝𝐞𝐨 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫:\n\n` +
            `1. 𝐒𝐢𝐦𝐩𝐥𝐲 𝐬𝐞𝐧𝐝 𝐚 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐯𝐢𝐝𝐞𝐨 𝐥𝐢𝐧𝐤 𝐢𝐧 𝐭𝐡𝐞 𝐜𝐡𝐚𝐭\n` +
            `2. 𝐈'𝐥𝐥 𝐚𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐥𝐥𝐲 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐚𝐧𝐝 𝐬𝐞𝐧𝐝 𝐢𝐭 𝐛𝐚𝐜𝐤 𝐭𝐨 𝐲𝐨𝐮\n\n` +
            `🔗 𝐒𝐮𝐩𝐩𝐨𝐫𝐭𝐞𝐝 𝐥𝐢𝐧𝐤 𝐭𝐲𝐩𝐞𝐬:\n` +
            `• 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐯𝐢𝐝𝐞𝐨𝐬\n` +
            `• 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐫𝐞𝐞𝐥𝐬\n` +
            `• 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐬𝐡𝐚𝐫𝐞𝐝 𝐯𝐢𝐝𝐞𝐨𝐬\n` +
            `• 𝐅𝐁.𝐰𝐚𝐭𝐜𝐡 𝐥𝐢𝐧𝐤𝐬\n\n` +
            `📊 𝐌𝐚𝐱𝐢𝐦𝐮𝐦 𝐟𝐢𝐥𝐞 𝐬𝐢𝐳𝐞: ${module.exports.config.envConfig.maxFileSize}MB\n` +
            `✨ 𝐂𝐫𝐞𝐝𝐢𝐭𝐬: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
            event.threadID,
            event.messageID
        );
    }
    
    // Manual download via command
    const url = args[0];
    try {
        api.setMessageReaction("📥", event.messageID, () => {}, true);
        
        const processingMsg = await api.sendMessage("📥 𝐌𝐚𝐧𝐮𝐚𝐥 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐬𝐭𝐚𝐫𝐭𝐞𝐝...", event.threadID);
        
        const videoInfo = await downloadVideo(url);
        
        // Find the best available quality
        const qualityOrder = ["1080p", "720p", "480p", "360p", "hd", "sd"];
        let videoUrl = null;
        
        for (const quality of qualityOrder) {
            if (videoInfo[quality] && videoInfo[quality] !== "Not found") {
                videoUrl = videoInfo[quality];
                break;
            }
        }
        
        if (!videoUrl) {
            throw new Error("❌ 𝐍𝐨 𝐯𝐢𝐝𝐞𝐨 𝐟𝐨𝐮𝐧𝐝 𝐨𝐫 𝐯𝐢𝐝𝐞𝐨 𝐢𝐬 𝐧𝐨𝐭 𝐚𝐜𝐜𝐞𝐬𝐬𝐢𝐛𝐥𝐞");
        }
        
        const response = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream'
        });
        
        const tempFilePath = tempy.file({ extension: "mp4" });
        const writer = fs.createWriteStream(tempFilePath);
        
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
        
        // Check file size
        const stats = fs.statSync(tempFilePath);
        const fileSizeInMB = stats.size / (1024 * 1024);
        
        if (fileSizeInMB > module.exports.config.envConfig.maxFileSize) {
            fs.unlinkSync(tempFilePath);
            await api.unsendMessage(processingMsg.messageID);
            return api.sendMessage(
                `❌ 𝐕𝐢𝐝𝐞𝐨 𝐢𝐬 𝐭𝐨𝐨 𝐥𝐚𝐫𝐠𝐞 (${fileSizeInMB.toFixed(2)}MB). 𝐌𝐚𝐱𝐢𝐦𝐮𝐦 𝐚𝐥𝐥𝐨𝐰𝐞𝐝: ${module.exports.config.envConfig.maxFileSize}MB`,
                event.threadID,
                event.messageID
            );
        }
        
        await api.unsendMessage(processingMsg.messageID);
        await api.sendMessage({
            body: `✅ 𝐌𝐚𝐧𝐮𝐚𝐥 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥!\n📊 𝐅𝐢𝐥𝐞 𝐬𝐢𝐳𝐞: ${fileSizeInMB.toFixed(2)}MB\n✨ 𝐂𝐫𝐞𝐝𝐢𝐭𝐬: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
            attachment: fs.createReadStream(tempFilePath)
        }, event.threadID, event.messageID);
        
        fs.unlinkSync(tempFilePath);
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        
    } catch (error) {
        console.error("Manual download error:", error);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        api.sendMessage(
            `❌ 𝐌𝐚𝐧𝐮𝐚𝐥 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐟𝐚𝐢𝐥𝐞𝐝:\n${error.message || "Unknown error"}`,
            event.threadID,
            event.messageID
        );
    }
};
