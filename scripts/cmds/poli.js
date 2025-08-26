const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
    name: "poli",
    version: "1.6.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🔍 Search and download images from Pinterest",
    category: "search",
    usages: "[search query]-[number of images]",
    cooldowns: 10,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "canvas": ""
    },
    envConfig: {
        apiUrl: "https://asif-pinterest-api.onrender.com/v1/pinterest"
    }
};

module.exports.onLoad = function() {
    const tempDir = path.join(__dirname, "poli_cache");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
};

module.exports.onStart = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const { apiUrl } = module.exports.config.envConfig;
    
    try {
        const input = args.join(" ");
        
        // Show help if no input or incorrect format
        if (!input || !input.includes("-")) {
            const helpMessage = `🖼️ 𝗣𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁 𝗜𝗺𝗮𝗴𝗲 𝗦𝗲𝗮𝗿𝗰𝗵\n\n` +
                `📝 𝗨𝘀𝗮𝗴𝗲: ${global.config.PREFIX}poli [search term]-[number of images]\n` +
                `💡 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: ${global.config.PREFIX}poli beautiful sunset-5\n\n` +
                `⚠️ 𝗡𝗼𝘁𝗲: Maximum 10 images per request`;
            return api.sendMessage(helpMessage, threadID, messageID);
        }

        const [keyword, countStr] = input.split("-").map(item => item.trim());
        let imageCount = parseInt(countStr) || 5;
        
        if (!keyword) {
            return api.sendMessage("🔍 | Please provide a search keyword", threadID, messageID);
        }

        imageCount = Math.max(1, Math.min(imageCount, 10));
        
        // Create stylish search banner
        const bannerPath = await createSearchBanner(keyword, senderID);
        
        api.sendMessage({
            body: `🔍 Searching Pinterest for: "${keyword}"...`,
            attachment: fs.createReadStream(bannerPath)
        }, threadID, async () => {
            fs.unlinkSync(bannerPath); // Delete banner after sending
            
            try {
                const response = await axios.get(apiUrl, { 
                    params: { 
                        search: encodeURIComponent(keyword) 
                    },
                    timeout: 30000
                });
                
                if (!response.data || !response.data.data || response.data.data.length === 0) {
                    return api.sendMessage(
                        `❌ No images found for "${keyword}". Try a different search term.`,
                        threadID,
                        messageID
                    );
                }
                
                const imageUrls = response.data.data.slice(0, imageCount);
                const tempDir = path.join(__dirname, "poli_cache");
                const imgPaths = [];
                
                // Clean previous files
                fs.readdirSync(tempDir)
                    .filter(file => file.startsWith(`${senderID}_`))
                    .forEach(file => fs.unlinkSync(path.join(tempDir, file)));
                
                // Download images with progress
                let downloadedCount = 0;
                for (let i = 0; i < imageUrls.length; i++) {
                    try {
                        const imagePath = path.join(tempDir, `${senderID}_${Date.now()}_${i}.jpg`);
                        const imageRes = await axios.get(imageUrls[i], {
                            responseType: 'arraybuffer',
                            timeout: 25000
                        });
                        
                        fs.writeFileSync(imagePath, imageRes.data);
                        imgPaths.push(imagePath);
                        downloadedCount++;
                    } catch (err) {
                        console.error(`Image download error: ${err.message}`);
                    }
                }
                
                if (imgPaths.length > 0) {
                    const attachments = imgPaths.map(path => fs.createReadStream(path));
                    const resultMessage = `✅ Successfully downloaded ${downloadedCount} image(s) for:\n"${keyword}"\n\n✨ Powered by 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;
                    
                    api.sendMessage({
                        body: resultMessage,
                        attachment: attachments
                    }, threadID, (err) => {
                        if (err) console.error("Send error:", err);
                        
                        // Cleanup after sending
                        imgPaths.forEach(filePath => {
                            if (fs.existsSync(filePath)) {
                                fs.unlinkSync(filePath);
                            }
                        });
                    }, messageID);
                } else {
                    api.sendMessage("❌ Failed to download any images. Please try again later.", threadID, messageID);
                }
                
            } catch (error) {
                console.error("API Error:", error);
                api.sendMessage("⚠️ Pinterest API is currently unavailable. Please try again later.", threadID, messageID);
            }
        });
        
    } catch (error) {
        console.error("Command Error:", error);
        api.sendMessage("⚠️ An unexpected error occurred. Please try again later.", threadID, messageID);
    }
};

async function createSearchBanner(keyword, userId) {
    const width = 700;
    const height = 250;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#8a2387');
    gradient.addColorStop(0.5, '#e94057');
    gradient.addColorStop(1, '#f27121');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw Pinterest logo programmatically
    const logoSize = 60;
    const logoPadding = 20;
    const logoX = logoPadding + logoSize/2;
    const logoY = height/2;
    
    // Draw red circle (Pinterest brand color)
    ctx.beginPath();
    ctx.arc(logoX, logoY, logoSize/2, 0, Math.PI * 2);
    ctx.fillStyle = '#E60023'; // Official Pinterest red
    ctx.fill();
    
    // Draw white "P" in the center
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', logoX, logoY);
    
    // Add decorative elements
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
        const size = Math.random() * 30 + 15;
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.moveTo(x, y);
        ctx.arc(x, y, size, 0, Math.PI * 2);
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fill();
    
    // Add search text
    ctx.font = 'bold 38px "Arial"';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    ctx.fillText('PINTEREST IMAGE SEARCH', width / 2, 100);
    
    // Add keyword in stylish box
    const text = `"${keyword}"`;
    ctx.font = 'italic 32px "Arial"';
    const textWidth = ctx.measureText(text).width;
    const boxWidth = textWidth + 50;
    const boxHeight = 60;
    const cornerRadius = 15;
    
    // Draw rounded rectangle
    const x = width / 2 - boxWidth / 2;
    const y = 130;
    ctx.beginPath();
    ctx.moveTo(x + cornerRadius, y);
    ctx.lineTo(x + boxWidth - cornerRadius, y);
    ctx.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + cornerRadius);
    ctx.lineTo(x + boxWidth, y + boxHeight - cornerRadius);
    ctx.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - cornerRadius, y + boxHeight);
    ctx.lineTo(x + cornerRadius, y + boxHeight);
    ctx.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - cornerRadius);
    ctx.lineTo(x, y + cornerRadius);
    ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
    ctx.closePath();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();
    
    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, width / 2, 170);
    
    // Save and return path
    const bannerPath = path.join(__dirname, "poli_cache", `${userId}_banner.png`);
    fs.writeFileSync(bannerPath, canvas.toBuffer('image/png'));
    
    return bannerPath;
}
