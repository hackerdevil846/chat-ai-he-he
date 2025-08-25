module.exports.config = {
    name: "family",
    version: "2.0.0",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Create beautiful family photos with group members' avatars",
    category: "𝑭𝒐𝒕𝒐 𝒆𝒅𝒊𝒕",
    usages: "family [size] [#color] [title text]",
    cooldowns: 15,
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "canvas": "",
        "jimp": "",
        "node-superfetch": "",
        "chalk": ""
    },
    envConfig: {
        maxParticipants: 100,
        defaultBackground: "https://i.ibb.co/QvG4LTw/image.png",
        frameImage: "https://i.ibb.co/H41cdDM/1624768781720.png",
        fontUrl: "https://drive.google.com/uc?id=1q0FPVuJ-Lq7-tvOYH0ILgbjrX1boW7KW&export=download",
        helpImage: "https://i.ibb.co/m9R36Pp/image.png"
    }
};

module.exports.onStart = async function({ api, event, args, Threads }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const Canvas = global.nodemodule["canvas"];
    const jimp = global.nodemodule["jimp"];
    const superfetch = global.nodemodule["node-superfetch"];
    const chalk = global.nodemodule["chalk"];
    
    const { threadID, messageID } = event;
    const TOKEN = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
    
    try {
        // Check if command is already running
        if (global.client.family) {
            return api.sendMessage("🔄 Another family request is being processed. Please wait...", threadID, messageID);
        }
        global.client.family = true;
        
        const timestart = Date.now();
        
        // Ensure cache directory exists
        if (!fs.existsSync(__dirname + '/cache')) {
            fs.mkdirSync(__dirname + '/cache');
        }
        
        // Download font if not exists
        if (!fs.existsSync(__dirname + '/cache/VNCORSI.ttf')) {
            api.sendMessage("📥 Downloading required font...", threadID, messageID);
            const fontData = await axios.get(module.exports.envConfig.fontUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(__dirname + "/cache/VNCORSI.ttf", Buffer.from(fontData.data));
        }
        
        // Show help if no arguments or help requested
        if (!args[0] || isNaN(args[0]) || args[0].toLowerCase() === "help") {
            if (!fs.existsSync(__dirname + "/cache/help_family.png")) {
                const helpImg = await axios.get(module.exports.envConfig.helpImage, { responseType: "arraybuffer" });
                fs.writeFileSync(__dirname + "/cache/help_family.png", Buffer.from(helpImg.data));
            }
            global.client.family = false;
            
            return api.sendMessage({
                body: "🎨 𝗙𝗔𝗠𝗜𝗟𝗬 𝗣𝗛𝗢𝗧𝗢 𝗖𝗥𝗘𝗔𝗧𝗢𝗥\n\n" +
                      "📝 𝗨𝘀𝗮𝗴𝗲: family <size> [#color] <title>\n\n" +
                      "• 𝗦𝗶𝘇𝗲: Avatar size in pixels (0 for auto-size)\n" +
                      "• 𝗖𝗼𝗹𝗼𝗿: Hex color code for title (e.g. #FF0000)\n" +
                      "• 𝗧𝗶𝘁𝗹𝗲: Custom title text (optional)\n\n" +
                      "📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀:\n" +
                      "• family 200 #FFFFFF My Family\n" +
                      "• family 0 #FFD700 Best Friends Forever",
                attachment: fs.createReadStream(__dirname + "/cache/help_family.png")
            }, threadID, messageID);
        }
        
        // Get thread information
        const threadInfo = await Threads.getInfo(threadID);
        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
        const participantIDs = threadInfo.participantIDs;
        
        // Validate participant count
        if (participantIDs.length > module.exports.envConfig.maxParticipants) {
            global.client.family = false;
            return api.sendMessage(`❌ This group has too many members (${participantIDs.length}). Maximum allowed is ${module.exports.envConfig.maxParticipants}.`, threadID, messageID);
        }
        
        // Load background image
        const background = await Canvas.loadImage(module.exports.envConfig.defaultBackground);
        const xbground = background.width;
        const ybground = background.height;
        
        // Parse arguments
        let size = parseInt(args[0]);
        let mode = "";
        
        // Auto-size calculation
        if (size === 0) {
            const area = xbground * (ybground - 200);
            const areaPerUser = Math.floor(area / participantIDs.length);
            size = Math.floor(Math.sqrt(areaPerUser));
            mode = " (Auto-size)";
        }
        
        const spacing = parseInt(size / 15);
        let x = spacing;
        let y = 200;
        let xcrop = participantIDs.length * size;
        let ycrop = 200 + size;
        
        // Parse color and title
        let color = "#FFFFFF";
        let title = threadInfo.threadName;
        let colorIndex = -1;
        
        // Find color argument
        for (let i = 1; i < args.length; i++) {
            if (args[i].startsWith('#')) {
                color = args[i];
                colorIndex = i;
                break;
            }
        }
        
        // Extract title (everything after color or after size if no color)
        if (colorIndex !== -1 && args.length > colorIndex + 1) {
            title = args.slice(colorIndex + 1).join(" ");
        } else if (colorIndex === -1 && args.length > 1) {
            title = args.slice(1).join(" ");
        }
        
        // Validate size
        if (size > Math.min(xbground, ybground)) {
            global.client.family = false;
            return api.sendMessage(
                `❌ Avatar size is too large for the background!\n` +
                `📐 Background size: ${xbground}x${ybground} pixels\n` +
                `📏 Maximum allowed size: ${Math.min(xbground, ybground)} pixels`,
                threadID, messageID
            );
        }
        
        // Send processing message
        const processingMsg = await api.sendMessage(
            `🔄 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗙𝗮𝗺𝗶𝗹𝘆 𝗣𝗵𝗼𝘁𝗼...\n\n` +
            `👥 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${participantIDs.length}\n` +
            `📐 𝗔𝘃𝗮𝘁𝗮𝗿 𝗦𝗶𝘇𝗲: ${size}px${mode}\n` +
            `🎨 𝗧𝗶𝘁𝗹𝗲 𝗖𝗼𝗹𝗼𝗿: ${color}\n` +
            `📝 𝗧𝗶𝘁𝗹𝗲: ${title}\n\n` +
            `⏳ Please wait, this may take a while...`,
            threadID
        );
        
        // Create canvas
        const canvas = Canvas.createCanvas(xbground, ybground);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        let processedCount = 0;
        let filteredUsers = 0;
        const frame = await Canvas.loadImage(module.exports.envConfig.frameImage);
        
        // Process each participant
        for (const id of participantIDs) {
            try {
                // Fetch avatar
                const avatar = await superfetch.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=${TOKEN}`);
                if (avatar.url.includes(".gif")) throw new Error("GIF avatars not supported");
                
                // Handle positioning
                if (x + size > xbground) {
                    xcrop = x;
                    x = spacing;
                    y += size + spacing;
                    ycrop += size + spacing;
                }
                
                // Check if we exceed background height
                if (y + size > ybground) {
                    api.sendMessage("⚠️ Not all avatars could fit in the image due to size constraints", threadID);
                    break;
                }
                
                // Draw avatar
                const avatarImg = await Canvas.loadImage(avatar.body);
                ctx.drawImage(avatarImg, x, y, size, size);
                
                // Add frame for admins
                if (adminIDs.includes(id)) {
                    ctx.drawImage(frame, x, y, size, size);
                }
                
                processedCount++;
                x += size + spacing;
            } catch (error) {
                filteredUsers++;
                console.error(`Error processing user ${id}:`, error.message);
            }
        }
        
        // Add title text
        Canvas.registerFont(__dirname + "/cache/VNCORSI.ttf", { family: "Dancing Script" });
        ctx.font = `110px Dancing Script`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(title, xcrop / 2, 133);
        
        // Remove shadow for clean output
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Save and crop image
        const outputPath = __dirname + `/cache/family_${threadID}_${Date.now()}.png`;
        const image = await jimp.read(canvas.toBuffer());
        image.crop(0, 0, xcrop, ycrop + spacing - 30).write(outputPath);
        
        // Calculate processing time
        const processingTime = Math.floor((Date.now() - timestart) / 1000);
        
        // Send result
        await api.sendMessage({
            body: `✅ 𝗙𝗔𝗠𝗜𝗟𝗬 𝗣𝗛𝗢𝗧𝗢 𝗖𝗥𝗘𝗔𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬!\n\n` +
                  `👥 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗲𝗱: ${processedCount} members\n` +
                  `🚫 𝗙𝗶𝗹𝘁𝗲𝗿𝗲𝗱: ${filteredUsers} members\n` +
                  `📐 𝗔𝘃𝗮𝘁𝗮𝗿 𝗦𝗶𝘇𝗲: ${size}px${mode}\n` +
                  `🎨 𝗧𝗶𝘁𝗹𝗲 𝗖𝗼𝗹𝗼𝗿: ${color}\n` +
                  `⏱️ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗧𝗶𝗺𝗲: ${processingTime} seconds`,
            attachment: fs.createReadStream(outputPath)
        }, threadID, async (err) => {
            // Clean up
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
            }
            
            // Delete processing message
            try {
                await api.unsendMessage(processingMsg.messageID);
            } catch (e) {}
            
            global.client.family = false;
        });
        
    } catch (error) {
        console.error("Family command error:", error);
        global.client.family = false;
        
        api.sendMessage(
            `❌ 𝗘𝗥𝗥𝗢𝗥: Failed to create family photo\n` +
            `📝 𝗗𝗲𝘁𝗮𝗶𝗹𝘀: ${error.message}\n\n` +
            `Please try again later or use a smaller size.`,
            threadID, messageID
        );
    }
};
