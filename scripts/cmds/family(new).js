const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");
const jimp = require("jimp");

module.exports.config = {
    name: "family",
    aliases: ["groupimage", "familyphoto"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "image",
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑓𝑎𝑚𝑖𝑙𝑦 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑐𝑜𝑙𝑙𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠' 𝑎𝑣𝑎𝑡𝑎𝑟𝑠"
    },
    guide: {
        en: "{p}family [𝑠𝑖𝑧𝑒] [𝑐𝑜𝑙𝑜𝑟] [𝑡𝑖𝑡𝑙𝑒]"
    },
    dependencies: {
        "fs-extra": "", 
        "axios": "", 
        "canvas": "", 
        "jimp": "", 
        "node-superfetch": ""
    }
};

module.exports.onStart = async function({ message, event, args, api }) {
    try {
        const { threadID } = event;
        
        // Show help if no arguments or help requested
        if (!args[0] || isNaN(args[0]) || args[0] === "help") {
            const helpMessage = `🎨 𝐹𝑎𝑚𝑖𝑙𝑦 𝐼𝑚𝑎𝑔𝑒 𝐶𝑟𝑒𝑎𝑡𝑜𝑟\n\n` +
                              `𝑈𝑠𝑎𝑔𝑒: ${global.config.PREFIX}family [𝑠𝑖𝑧𝑒] [𝑐𝑜𝑙𝑜𝑟] [𝑡𝑖𝑡𝑙𝑒]\n\n` +
                              `• 𝑠𝑖𝑧𝑒: 𝑆𝑖𝑧𝑒 𝑜𝑓 𝑒𝑎𝑐ℎ 𝑎𝑣𝑎𝑡𝑎𝑟 (𝑑𝑒𝑓𝑎𝑢𝑙𝑡: 100)\n` +
                              `• 𝑐𝑜𝑙𝑜𝑟: 𝐻𝑒𝑥 𝑐𝑜𝑙𝑜𝑟 𝑐𝑜𝑑𝑒 (𝑑𝑒𝑓𝑎𝑢𝑙𝑡: #000000)\n` +
                              `• 𝑡𝑖𝑡𝑙𝑒: 𝐼𝑚𝑎𝑔𝑒 𝑡𝑖𝑡𝑙𝑒 (𝑑𝑒𝑓𝑎𝑢𝑙𝑡: 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒)\n\n` +
                              `𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${global.config.PREFIX}family 150 #ffffff 𝑂𝑢𝑟 𝐹𝑎𝑚𝑖𝑙𝑦`;
            
            return message.reply(helpMessage);
        }

        // Get thread info
        const threadInfo = await api.getThreadInfo(threadID);
        const participantIDs = threadInfo.participantIDs;
        const adminIDs = threadInfo.adminIDs ? threadInfo.adminIDs.map(admin => admin.id) : [];
        
        // Default values
        const size = parseInt(args[0]) || 100;
        const color = args[1] && args[1].startsWith('#') ? args[1] : "#000000";
        const title = args.slice(args[1] && args[1].startsWith('#') ? 2 : 1).join(" ") || threadInfo.threadName;

        // Create cache directory
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // Show processing message
        await message.reply(`🔄 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑓𝑎𝑚𝑖𝑙𝑦 𝑖𝑚𝑎𝑔𝑒...\n📊 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${participantIDs.length}\n🎨 𝑆𝑖𝑧𝑒: ${size}𝑝𝑥\n🌈 𝐶𝑜𝑙𝑜𝑟: ${color}`);

        // Background image
        const backgroundUrl = "https://i.ibb.co/xqrFW4N/Pics-Art-06-26-12-07-26.jpg";
        const frameUrl = "https://i.ibb.co/H41cdDM/1624768781720.png";
        
        // Load background and frame
        const [background, frame] = await Promise.all([
            loadImage(backgroundUrl),
            loadImage(frameUrl)
        ]);

        const canvas = createCanvas(background.width, background.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Draw avatars
        let x = 10;
        let y = 200;
        const spacing = 10;
        let drawnCount = 0;
        let deadAccounts = 0;

        for (const userID of participantIDs) {
            if (drawnCount >= 100) break; // Limit to 100 avatars
            
            try {
                let avatarBuffer;
                try {
                    // Try Facebook Graph API first
                    const avatarResponse = await axios.get(`https://graph.facebook.com/${userID}/picture?width=512&height=512`, {
                        responseType: 'arraybuffer'
                    });
                    avatarBuffer = Buffer.from(avatarResponse.data);
                    
                    // Check if it's default avatar
                    if (avatarResponse.request.res.responseUrl.includes("static.xx.fbcdn.net")) {
                        throw new Error("Default avatar");
                    }
                } catch (e) {
                    // Fallback to alternative API
                    try {
                        const fallbackResponse = await axios.get(`https://api.apkvips.com/api/avatar.php?id=${userID}`, {
                            responseType: 'arraybuffer'
                        });
                        avatarBuffer = Buffer.from(fallbackResponse.data);
                        
                        if (avatarBuffer.length <= 400) {
                            deadAccounts++;
                            continue;
                        }
                    } catch (fallbackError) {
                        deadAccounts++;
                        continue;
                    }
                }

                const avatar = await loadImage(avatarBuffer);
                ctx.drawImage(avatar, x, y, size, size);

                // Add frame for admins
                if (adminIDs.includes(userID)) {
                    ctx.drawImage(frame, x, y, size, size);
                }
                
                x += size + spacing;
                if (x + size > canvas.width) {
                    x = 10;
                    y += size + spacing;
                }
                
                drawnCount++;
                
            } catch (error) {
                console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 ${userID}:`, error);
                deadAccounts++;
            }
        }

        // Add title
        ctx.font = "𝑏𝑜𝑙𝑑 60𝑝𝑥 𝐴𝑟𝑖𝑎𝑙";
        ctx.fillStyle = color;
        ctx.textAlign = "𝑐𝑒𝑛𝑡𝑒𝑟";
        ctx.fillText(title, canvas.width / 2, 100);

        // Save and optimize image with jimp
        const buffer = canvas.toBuffer();
        const image = await jimp.read(buffer);
        const outputPath = path.join(cacheDir, `𝑓𝑎𝑚𝑖𝑙𝑦_${threadID}_${𝐷𝑎𝑡𝑒.𝑛𝑜𝑤()}.𝑝𝑛𝑔`);
        
        await image.writeAsync(outputPath);

        // Send result
        await message.reply({
            body: `✅ 𝐹𝑎𝑚𝑖𝑙𝑦 𝐼𝑚𝑎𝑔𝑒 𝐶𝑟𝑒𝑎𝑡𝑒𝑑\n👥 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${drawnCount}/${participantIDs.length}\n💀 𝐷𝑒𝑎𝑑 𝐴𝑐𝑐𝑜𝑢𝑛𝑡𝑠: ${deadAccounts}\n📏 𝑆𝑖𝑧𝑒: ${size}𝑝𝑥\n🎨 𝐶𝑜𝑙𝑜𝑟: ${color}`,
            attachment: fs.createReadStream(outputPath)
        });

        // Clean up
        fs.unlinkSync(outputPath);

    } catch (error) {
        console.error("𝐹𝑎𝑚𝑖𝑙𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑓𝑎𝑚𝑖𝑙𝑦 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
