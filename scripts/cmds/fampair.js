const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "fampair",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "love",
        shortDescription: {
            en: "👨‍👩‍👧‍👦 𝖥𝖺𝗆𝗂𝗅𝗒 𝖯𝖺𝗂𝗋 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖿𝗈𝗋 𝖡𝗈𝗒𝗌"
        },
        longDescription: {
            en: "👨‍👩‍👧‍👦 𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺 𝖿𝖺𝗆𝗂𝗅𝗒 𝗉𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗀𝗋𝗈𝗎𝗉 𝗆𝖾𝗆𝖻𝖾𝗋𝗌"
        },
        guide: {
            en: "{p}fampair"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("jimp");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗃𝗂𝗆𝗉.");
                return;
            }

            const dirMaterial = path.resolve(__dirname, "cache", "canvas");
            
            if (!fs.existsSync(dirMaterial)) {
                fs.mkdirSync(dirMaterial, { recursive: true });
            }
            
            const bgPath = path.resolve(dirMaterial, "araa2.jpg");
            if (!fs.existsSync(bgPath)) {
                try {
                    console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾...");
                    const response = await axios.get("https://imgur.com/D35mTwa.jpg", {
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    fs.writeFileSync(bgPath, Buffer.from(response.data));
                    console.log("✅ 𝖡𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                } catch (error) {
                    console.log("❌ 𝖡𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽, 𝗐𝗂𝗅𝗅 𝗎𝗌𝖾 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖽𝗎𝗋𝗂𝗇𝗀 𝖾𝗑𝖾𝖼𝗎𝗍𝗂𝗈𝗇");
                }
            }
        } catch (error) {
            console.error("💥 𝖥𝖺𝗆𝗉𝖺𝗂𝗋 𝗈𝗇𝖫𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function({ api, event, usersData, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("jimp");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗃𝗂𝗆𝗉.");
            }

            const { threadID, senderID } = event;
            const tl = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
            const tle = tl[Math.floor(Math.random() * tl.length)];
            
            let userInfo;
            try {
                userInfo = await api.getUserInfo(senderID);
            } catch (userError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈:", userError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }
            
            const nameSender = userInfo[senderID]?.name || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";

            let threadInfo;
            try {
                threadInfo = await api.getThreadInfo(threadID);
            } catch (threadError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }
            
            const participantIDs = threadInfo.participantIDs?.filter(id => id !== senderID) || [];
            
            if (participantIDs.length < 2) {
                return message.reply("👥 | 𝖦𝗋𝗈𝗎𝗉 𝖾 𝖺𝗍 𝗅𝖾𝖺𝗌𝗍 2 𝗃𝗈𝗇 𝗆𝖾𝗆𝖻𝖾𝗋 𝗍𝗁𝖺𝗄𝗍𝖾 𝗁𝗈𝖻𝖾 𝖾𝗂 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗎𝗌𝖾 𝖼𝗈𝗋𝗍𝖾!");
            }
            
            // Select two random participants
            const firstIndex = Math.floor(Math.random() * participantIDs.length);
            let secondIndex;
            do {
                secondIndex = Math.floor(Math.random() * participantIDs.length);
            } while (secondIndex === firstIndex);
            
            const e = participantIDs[firstIndex];
            const r = participantIDs[secondIndex];
            
            let name1, name2;
            try {
                name1 = (await usersData.get(e))?.name || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
                name2 = (await usersData.get(r))?.name || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
            } catch (nameError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗇𝖺𝗆𝖾𝗌:", nameError);
                name1 = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
                name2 = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
            }
            
            const processingMsg = await message.reply("🔄 | 𝖥𝖺𝗆𝗂𝗅𝗒 𝗉𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝖾 𝗁𝗈𝖼𝖼𝗁𝖾... ⏳");
            
            let imagePath;
            try {
                imagePath = await this.makeImage({ one: senderID, two: e, three: r });
            } catch (imageError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾:", imageError);
                await message.unsendMessage(processingMsg.messageID);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖿𝖺𝗆𝗂𝗅𝗒 𝗉𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }
            
            await message.reply({ 
                body: `👨‍👩‍👧‍👦 | 𝖥𝖺𝗆𝗂𝗅𝗒 𝖯𝖺𝗂𝗋 𝖱𝖾𝗌𝗎𝗅𝗍\n\n✨ ${nameSender}, 𝗍𝗎𝗆𝗂 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 ${name1} 𝖺𝗋 ${name2} 𝖾𝗋 𝗌𝖺𝗍𝗁𝖾 𝖥𝖺𝗆𝗂𝗅𝗒 𝖯𝖺𝗂𝗋 𝗁𝗈𝗒𝖾 𝗀𝖾𝖼𝗁𝗈!\n💞 𝖳𝗈𝗆𝖺𝖽𝖾𝗋 𝖢𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒: ${tle}`,
                mentions: [
                    { tag: nameSender, id: senderID },
                    { tag: name1, id: e },
                    { tag: name2, id: r }
                ], 
                attachment: fs.createReadStream(imagePath) 
            });

            await message.unsendMessage(processingMsg.messageID);
            
            // Cleanup image file
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (cleanupError) {
                console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾:", cleanupError.message);
            }
            
        } catch (error) {
            console.error("💥 𝖥𝖺𝗆𝗉𝖺𝗂𝗋 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    makeImage: async function({ one, two, three }) {
        const __root = path.resolve(__dirname, "cache", "canvas");
        let pairingImg;
        
        // Try to load background image, create fallback if not available
        const bgPath = path.resolve(__root, "araa2.jpg");
        try {
            if (fs.existsSync(bgPath)) {
                pairingImg = await jimp.read(bgPath);
            } else {
                // Create a simple fallback background
                pairingImg = await jimp.create(400, 600, 0xf0f0f0ff);
                console.log("⚠️ 𝖴𝗌𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽");
            }
        } catch (error) {
            // Create fallback background if image is corrupted
            pairingImg = await jimp.create(400, 600, 0xf0f0f0ff);
            console.log("⚠️ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝖽𝗎𝖾 𝗍𝗈 𝖾𝗋𝗋𝗈𝗋");
        }
        
        const pathImg = path.resolve(__root, `araa_${one}_${two}_${three}_${Date.now()}.png`);
        
        // Download and process avatars
        const avatarPaths = [];
        const users = [one, two, three];
        
        for (let i = 0; i < users.length; i++) {
            const avatarPath = path.resolve(__root, `avt_${users[i]}_${Date.now()}.png`);
            const avatarUrl = `https://graph.facebook.com/${users[i]}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            
            try {
                console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${users[i]}`);
                const response = await axios.get(avatarUrl, { 
                    responseType: 'arraybuffer',
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                fs.writeFileSync(avatarPath, Buffer.from(response.data));
                avatarPaths.push(avatarPath);
            } catch (error) {
                console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 ${users[i]}:`, error.message);
                // Create a fallback avatar if download fails
                try {
                    const fallbackAvatar = await jimp.create(512, 512, 0xccccccff);
                    await fallbackAvatar.writeAsync(avatarPath);
                    avatarPaths.push(avatarPath);
                } catch (fallbackError) {
                    console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖺𝗏𝖺𝗍𝖺𝗋:`, fallbackError.message);
                }
            }
        }
        
        // Create circular avatars
        try {
            const circleOne = await this.circle(avatarPaths[0]);
            const circleTwo = await this.circle(avatarPaths[1]);
            const circleThree = await this.circle(avatarPaths[2]);
            
            // Composite avatars onto background
            const circleOneImg = await jimp.read(circleOne);
            const circleTwoImg = await jimp.read(circleTwo);
            const circleThreeImg = await jimp.read(circleThree);
            
            pairingImg.composite(circleOneImg.resize(65, 65), 135, 260)
                      .composite(circleTwoImg.resize(65, 65), 230, 210)
                      .composite(circleThreeImg.resize(60, 60), 193, 370);
            
            // Save final image
            await pairingImg.writeAsync(pathImg);
            console.log("✅ 𝖥𝖺𝗆𝗂𝗅𝗒 𝗉𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
            
        } catch (compositeError) {
            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗈𝗆𝗉𝗈𝗌𝗂𝗍𝖾 𝗂𝗆𝖺𝗀𝖾𝗌:", compositeError);
            throw compositeError;
        }
        
        // Cleanup temporary avatar files
        avatarPaths.forEach(path => {
            try {
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path);
                }
            } catch (cleanupError) {
                console.warn(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗂𝗅𝖾 ${path}:`, cleanupError.message);
            }
        });
        
        return pathImg;
    },

    circle: async function(imagePath) {
        try {
            const img = await jimp.read(imagePath);
            const size = Math.min(img.getWidth(), img.getHeight());
            img.crop(0, 0, size, size);
            
            const circle = await jimp.create(size, size, 0x00000000);
            for (let x = 0; x < size; x++) {
                for (let y = 0; y < size; y++) {
                    const dx = x - size / 2;
                    const dy = y - size / 2;
                    if (dx * dx + dy * dy <= (size / 2) * (size / 2)) {
                        circle.setPixelColor(img.getPixelColor(x, y), x, y);
                    }
                }
            }
            
            return await circle.getBufferAsync("image/png");
        } catch (error) {
            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝖺𝗏𝖺𝗍𝖺𝗋:", error);
            throw error;
        }
    }
};
