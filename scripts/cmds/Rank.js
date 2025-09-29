const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "rank",
        aliases: [],
        version: "2.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑔𝑟𝑜𝑢𝑝",
        shortDescription: {
            en: "𝑀𝑒𝑚𝑏𝑒𝑟 𝑅𝑎𝑛𝑘𝑖𝑛𝑔𝑠 💫"
        },
        longDescription: {
            en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑡ℎ𝑒 𝑟𝑎𝑛𝑘 𝑐𝑎𝑟𝑑 𝑓𝑜𝑟 𝑎 𝑢𝑠𝑒𝑟, 𝑠ℎ𝑜𝑤𝑖𝑛𝑔 𝑡ℎ𝑒𝑖𝑟 𝑙𝑒𝑣𝑒𝑙, 𝑒𝑥𝑝𝑒𝑟𝑖𝑒𝑛𝑐𝑒, 𝑎𝑛𝑑 𝑔𝑙𝑜𝑏𝑎𝑙 𝑟𝑎𝑛𝑘𝑖𝑛𝑔."
        },
        guide: {
            en: "{p}rank 𝑜𝑟 {p}rank @𝑢𝑠𝑒𝑟"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "canvas": "",
            "jimp": ""
        }
    },

    onLoad: async function () {
        try {
            console.log("🔄 𝐼𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑖𝑛𝑔 𝑟𝑎𝑛𝑘 𝑐𝑜𝑚𝑚𝑎𝑛𝑑...");
            
            const cachePath = path.join(__dirname, "cache");
            const customPath = path.join(cachePath, "customrank");
            
            // Create directories if they don't exist
            if (!fs.existsSync(cachePath)) {
                fs.mkdirSync(cachePath, { recursive: true });
                console.log("✅ 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦");
            }
            
            if (!fs.existsSync(customPath)) {
                fs.mkdirSync(customPath, { recursive: true });
                console.log("✅ 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑐𝑢𝑠𝑡𝑜𝑚 𝑟𝑎𝑛𝑘 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦");
            }
            
            // Download required assets if they don't exist
            const assets = [
                {
                    url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/regular-font.ttf",
                    path: path.join(cachePath, 'regular-font.ttf'),
                    name: "𝑅𝑒𝑔𝑢𝑙𝑎𝑟 𝐹𝑜𝑛𝑡"
                },
                {
                    url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/bold-font.ttf",
                    path: path.join(cachePath, 'bold-font.ttf'),
                    name: "𝐵𝑜𝑙𝑑 𝐹𝑜𝑛𝑡"
                },
                {
                    url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/rank_card/rankcard.png",
                    path: path.join(cachePath, 'rankcard.png'),
                    name: "𝑅𝑎𝑛𝑘 𝐶𝑎𝑟𝑑 𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑"
                }
            ];
            
            let downloadedCount = 0;
            for (const asset of assets) {
                if (!fs.existsSync(asset.path)) {
                    try {
                        console.log(`📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 ${asset.name}...`);
                        const response = await axios.get(asset.url, { 
                            responseType: 'arraybuffer',
                            timeout: 30000 
                        });
                        fs.writeFileSync(asset.path, Buffer.from(response.data));
                        downloadedCount++;
                        console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 ${asset.name}`);
                    } catch (error) {
                        console.error(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 ${asset.name}:`, error.message);
                    }
                } else {
                    console.log(`✅ ${asset.name} 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑥𝑖𝑠𝑡𝑠`);
                }
            }
            
            console.log(`🎯 𝑅𝑎𝑛𝑘 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑎𝑡𝑖𝑜𝑛 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒. 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 ${downloadedCount} 𝑎𝑠𝑠𝑒𝑡𝑠.`);
            
        } catch (error) {
            console.error("💥 𝑂𝑛𝐿𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        }
    },

    onStart: async function({ message, event, args, Users, Currencies }) {
        try {
            // Dependency check
            let canvas, jimp;
            try {
                canvas = require("canvas");
                jimp = require("jimp");
            } catch (error) {
                console.error("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠:", error);
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙: 𝑐𝑎𝑛𝑣𝑎𝑠 𝑎𝑛𝑑 𝑗𝑖𝑚𝑝");
            }

            const { createCanvas, loadImage, registerFont } = canvas;

            // Helper function to convert experience points to level
            function expToLevel(point) {
                if (!point || point < 0) return 0;
                return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
            }

            // Helper function to convert level to experience points
            function levelToExp(level) {
                if (!level || level <= 0) return 0;
                return 3 * level * (level - 1);
            }

            // Helper function to get user's rank information
            async function getInfo(uid) {
                try {
                    let userData = await Currencies.getData(uid);
                    if (!userData || typeof userData.exp === 'undefined') {
                        return { level: 0, expCurrent: 0, expNextLevel: 100 };
                    }
                    
                    let point = userData.exp || 0;
                    const level = expToLevel(point);
                    const expCurrent = point - levelToExp(level);
                    const expNextLevel = levelToExp(level + 1) - levelToExp(level);
                    return { level, expCurrent, expNextLevel };
                } catch (error) {
                    console.error("𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜:", error);
                    return { level: 0, expCurrent: 0, expNextLevel: 100 };
                }
            }

            // Helper function to make an image circular
            async function circle(imageBuffer) {
                try {
                    const image = await jimp.read(imageBuffer);
                    image.circle();
                    return await image.getBufferAsync("image/png");
                } catch (error) {
                    console.error("𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑖𝑚𝑎𝑔𝑒:", error);
                    throw error;
                }
            }

            // List of valid fallback avatar URLs
            const fallbackAvatars = [
                "https://i.imgur.com/uXWLBeC.jpeg",
                "https://i.imgur.com/7Dc9GrN.jpeg",
                "https://i.imgur.com/IaAVMFK.jpeg",
                "https://i.imgur.com/WceNH2z.jpeg",
                "https://i.imgur.com/1XosaEA.jpeg",
                "https://i.imgur.com/M58fVe6.jpeg",
                "https://i.imgur.com/czaXZ3a.jpeg",
                "https://i.imgur.com/xsu6v2I.jpeg",
                "https://i.imgur.com/f17dCCM.jpeg",
                "https://i.imgur.com/opquSuU.jpeg"
            ];

            // Helper function to get a random fallback avatar
            function getRandomFallbackAvatar() {
                const randomIndex = Math.floor(Math.random() * fallbackAvatars.length);
                return fallbackAvatars[randomIndex];
            }

            // Helper function to create the rank card image
            async function makeRankCard(data) {
                const { id, name, rank, level, expCurrent, expNextLevel } = data;
                const cachePath = path.join(__dirname, "cache");
                
                // Register fonts with error handling
                try {
                    registerFont(path.join(cachePath, "regular-font.ttf"), { family: "Manrope", weight: "regular" });
                    registerFont(path.join(cachePath, "bold-font.ttf"), { family: "Manrope", weight: "bold" });
                } catch (fontError) {
                    console.warn("𝐹𝑜𝑛𝑡 𝑟𝑒𝑔𝑖𝑠𝑡𝑟𝑎𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑢𝑠𝑖𝑛𝑔 𝑑𝑒𝑓𝑎𝑢𝑙𝑡 𝑓𝑜𝑛𝑡𝑠:", fontError);
                }

                const pathCustom = path.join(cachePath, "customrank");
                let dirImage = path.join(cachePath, "rankcard.png");
                
                // Check for custom rank cards
                if (fs.existsSync(pathCustom)) {
                    try {
                        const customDir = fs.readdirSync(pathCustom).map(item => item.replace(/\.png/g, ""));
                        for (const singleLimit of customDir) {
                            let limitRate = false;
                            const split = singleLimit.split(/-/g);
                            let min = parseInt(split[0]) || 0;
                            let max = parseInt(split[1]) || min;
                            for (; min <= max; min++) {
                                if (level == min) { 
                                    limitRate = true; 
                                    break; 
                                }
                            }
                            if (limitRate) { 
                                dirImage = path.join(pathCustom, `${singleLimit}.png`); 
                                break; 
                            }
                        }
                    } catch (error) {
                        console.warn("𝐸𝑟𝑟𝑜𝑟 𝑟𝑒𝑎𝑑𝑖𝑛𝑔 𝑐𝑢𝑠𝑡𝑜𝑚 𝑟𝑎𝑛𝑘 𝑐𝑎𝑟𝑑𝑠:", error);
                    }
                }

                // Load rank card background
                let rankCard;
                try {
                    rankCard = await loadImage(dirImage);
                } catch (error) {
                    console.error("𝐸𝑟𝑟𝑜𝑟 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑟𝑎𝑛𝑘 𝑐𝑎𝑟𝑑 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑:", error);
                    // Create a simple fallback background
                    const fallbackCanvas = createCanvas(1000, 282);
                    const fallbackCtx = fallbackCanvas.getContext("2d");
                    fallbackCtx.fillStyle = "#2C3E50";
                    fallbackCtx.fillRect(0, 0, 1000, 282);
                    fallbackCtx.fillStyle = "#FFFFFF";
                    fallbackCtx.font = "30px Arial";
                    fallbackCtx.fillText("𝑅𝑎𝑛𝑘 𝐶𝑎𝑟𝑑", 400, 150);
                    rankCard = fallbackCanvas;
                }

                const pathImg = path.join(cachePath, `rank_${id}_${Date.now()}.png`);
                let expWidth = (expCurrent * 610) / expNextLevel;
                if (expWidth > 610 - 19.5) expWidth = 610 - 19.5;
                if (expWidth < 0) expWidth = 0;

                // Get user avatar with multiple fallback options
                let avatar;
                let avatarSuccess = false;
                
                try {
                    // Try Facebook API first
                    const avatarResponse = await axios.get(
                        `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                        { responseType: 'arraybuffer', timeout: 10000 }
                    );
                    avatar = await circle(avatarResponse.data);
                    avatarSuccess = true;
                    console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑙𝑜𝑎𝑑𝑒𝑑 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟 ${id}`);
                } catch (facebookError) {
                    console.warn(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 ${id}:`, facebookError.message);
                    
                    // Try random fallback avatars
                    let fallbackAttempts = 0;
                    const maxFallbackAttempts = 3;
                    
                    while (!avatarSuccess && fallbackAttempts < maxFallbackAttempts) {
                        try {
                            const randomAvatarUrl = getRandomFallbackAvatar();
                            console.log(`🔄 𝑇𝑟𝑦𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑎𝑣𝑎𝑡𝑎𝑟 ${fallbackAttempts + 1}: ${randomAvatarUrl}`);
                            
                            const defaultAvatarResponse = await axios.get(
                                randomAvatarUrl, 
                                { responseType: 'arraybuffer', timeout: 10000 }
                            );
                            avatar = await circle(defaultAvatarResponse.data);
                            avatarSuccess = true;
                            console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑙𝑜𝑎𝑑𝑒𝑑 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑎𝑣𝑎𝑡𝑎𝑟`);
                        } catch (fallbackError) {
                            fallbackAttempts++;
                            console.warn(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑎𝑣𝑎𝑡𝑎𝑟 𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${fallbackAttempts}:`, fallbackError.message);
                        }
                    }
                    
                    // Final fallback - create a colored circle
                    if (!avatarSuccess) {
                        console.log("🎨 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑓𝑖𝑛𝑎𝑙 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑎𝑣𝑎𝑡𝑎𝑟");
                        const simpleCanvas = createCanvas(512, 512);
                        const simpleCtx = simpleCanvas.getContext("2d");
                        const colors = ["#3498DB", "#E74C3C", "#2ECC71", "#F39C12", "#9B59B6", "#1ABC9C"];
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                        
                        simpleCtx.fillStyle = randomColor;
                        simpleCtx.arc(256, 256, 256, 0, 2 * Math.PI);
                        simpleCtx.fill();
                        simpleCtx.fillStyle = "#FFFFFF";
                        simpleCtx.font = "bold 100px Arial";
                        simpleCtx.textAlign = "center";
                        simpleCtx.textBaseline = "middle";
                        simpleCtx.fillText("?", 256, 256);
                        
                        avatar = simpleCanvas.toBuffer();
                        avatarSuccess = true;
                    }
                }

                const canvas = createCanvas(1000, 282);
                const ctx = canvas.getContext("2d");
                ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);
                
                // Draw avatar
                try {
                    const avatarImage = await loadImage(avatar);
                    ctx.drawImage(avatarImage, 70, 75, 150, 150);
                } catch (avatarError) {
                    console.error("𝐸𝑟𝑟𝑜𝑟 𝑑𝑟𝑎𝑤𝑖𝑛𝑔 𝑎𝑣𝑎𝑡𝑎𝑟:", avatarError);
                }

                // Set font properties
                ctx.font = "bold 36px Manrope, Arial, sans-serif";
                ctx.fillStyle = "#FFFFFF";
                ctx.textAlign = "start";
                
                // Truncate long names
                let displayName = name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
                const maxNameWidth = 500;
                if (ctx.measureText(displayName).width > maxNameWidth) {
                    while (ctx.measureText(displayName + "...").width > maxNameWidth && displayName.length > 1) {
                        displayName = displayName.slice(0, -1);
                    }
                    displayName += "...";
                }
                ctx.fillText(displayName, 270, 164);

                // Draw level and rank
                ctx.font = "bold 38px Manrope, Arial, sans-serif";
                ctx.fillStyle = "#FF0000";
                ctx.textAlign = "end";
                ctx.fillText(level, 866, 82);
                ctx.fillText("Lv.", 793, 82);
                ctx.fillText(`#${rank}`, 700, 82);

                // Draw experience
                ctx.font = "bold 40px Manrope, Arial, sans-serif";
                ctx.fillStyle = "#00BFFF";
                ctx.fillText(expCurrent, 710, 164);
                ctx.fillStyle = "#1874CD";
                ctx.fillText(`/ ${expNextLevel}`, 710 + ctx.measureText(expCurrent).width + 10, 164);

                // Draw experience bar
                ctx.beginPath();
                ctx.fillStyle = "#FFB90F";
                ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
                ctx.fill();
                ctx.fillRect(257 + 18.5, 147.5 + 36.25, expWidth, 37.5);
                ctx.arc(257 + 18.5 + expWidth, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
                ctx.fill();

                const imageBuffer = canvas.toBuffer();
                fs.writeFileSync(pathImg, imageBuffer);
                return pathImg;
            }

            // Get all user data for ranking
            let dataAll;
            try {
                dataAll = await Currencies.getAll(["userID", "exp"]);
                dataAll = dataAll.filter(item => item && item.exp > 0);
                dataAll.sort((a, b) => b.exp - a.exp);
            } catch (error) {
                console.error("𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑑𝑎𝑡𝑎:", error);
                return message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑎𝑐𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            }

            if (dataAll.length === 0) {
                return message.reply("❌ 𝑁𝑜 𝑢𝑠𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑒𝑥𝑝𝑒𝑟𝑖𝑒𝑛𝑐𝑒 𝑝𝑜𝑖𝑛𝑡𝑠 𝑓𝑜𝑢𝑛𝑑.");
            }

            // Determine which user to show rank for
            let targetUserID;
            if (args.length === 0) {
                targetUserID = event.senderID;
            } else if (Object.keys(event.mentions).length > 0) {
                targetUserID = Object.keys(event.mentions)[0];
            } else if (!isNaN(args[0])) {
                targetUserID = args[0];
            } else {
                targetUserID = event.senderID;
            }

            // Validate target user ID
            if (!targetUserID || isNaN(targetUserID)) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑒𝑟 𝐼𝐷.");
            }

            // Get user rank
            const rankIndex = dataAll.findIndex(item => item.userID === targetUserID);
            if (rankIndex === -1) {
                return message.reply("❌ 𝑇ℎ𝑖𝑠 𝑢𝑠𝑒𝑟 𝑑𝑜𝑒𝑠𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑎𝑛𝑦 𝑒𝑥𝑝𝑒𝑟𝑖𝑒𝑛𝑐𝑒 𝑝𝑜𝑖𝑛𝑡𝑠 𝑦𝑒𝑡.");
            }
            
            const rank = rankIndex + 1;
            
            // Get user info
            let userInfo;
            try {
                userInfo = await Users.getData(targetUserID);
            } catch (error) {
                console.error("𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜:", error);
                return message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛.");
            }
            
            const name = userInfo?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
            
            // Get level info
            const pointInfo = await getInfo(targetUserID);
            
            // Generate rank card
            const startTime = Date.now();
            const pathRankCard = await makeRankCard({
                id: targetUserID,
                name,
                rank,
                ...pointInfo
            });
            
            const timeTaken = Date.now() - startTime;
            
            // Send the rank card
            await message.reply({
                body: `🏆 𝑅𝑎𝑛𝑘: #${rank}\n⭐ 𝐿𝑒𝑣𝑒𝑙: ${pointInfo.level}\n📊 𝐸𝑋𝑃: ${pointInfo.expCurrent}/${pointInfo.expNextLevel}\n⏱ 𝑇𝑖𝑚𝑒 𝑡𝑎𝑘𝑒𝑛: ${timeTaken}𝑚𝑠`,
                attachment: fs.createReadStream(pathRankCard)
            });
            
            // Clean up
            try {
                if (fs.existsSync(pathRankCard)) {
                    fs.unlinkSync(pathRankCard);
                }
            } catch (cleanupError) {
                console.warn("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
            }
            
        } catch (error) {
            console.error("💥 𝑅𝑎𝑛𝑘 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑟𝑎𝑛𝑘 𝑐𝑎𝑟𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
