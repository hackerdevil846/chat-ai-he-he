const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "rank",
    aliases: ["level", "ranking"],
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
};

module.exports.onLoad = async function () {
    try {
        const cachePath = path.join(__dirname, "cache");
        const customPath = path.join(cachePath, "customrank");
        
        if (!fs.existsSync(cachePath)) {
            fs.mkdirSync(cachePath, { recursive: true });
        }
        
        if (!fs.existsSync(customPath)) {
            fs.mkdirSync(customPath, { recursive: true });
        }
        
        // Download required assets if they don't exist
        const assets = [
            {
                url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/regular-font.ttf",
                path: path.join(cachePath, 'regular-font.ttf')
            },
            {
                url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/bold-font.ttf",
                path: path.join(cachePath, 'bold-font.ttf')
            },
            {
                url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/rank_card/rankcard.png",
                path: path.join(cachePath, 'rankcard.png')
            }
        ];
        
        for (const asset of assets) {
            if (!fs.existsSync(asset.path)) {
                try {
                    const response = await axios.get(asset.url, { responseType: 'arraybuffer' });
                    fs.writeFileSync(asset.path, Buffer.from(response.data));
                } catch (error) {
                    console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 ${asset.path}:`, error);
                }
            }
        }
    } catch (error) {
        console.error("𝑂𝑛𝐿𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onStart = async function({ message, event, args, Users, Currencies }) {
    try {
        // Check dependencies
        let canvas, jimp;
        try {
            canvas = require("canvas");
            jimp = require("jimp");
        } catch (error) {
            return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙: 𝑐𝑎𝑛𝑣𝑎𝑠 𝑎𝑛𝑑 𝑗𝑖𝑚𝑝");
        }

        const { createCanvas, loadImage, registerFont } = canvas;

        // Helper function to convert experience points to level
        function expToLevel(point) {
            if (point < 0) return 0;
            return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
        }

        // Helper function to convert level to experience points
        function levelToExp(level) {
            if (level <= 0) return 0;
            return 3 * level * (level - 1);
        }

        // Helper function to get user's rank information
        async function getInfo(uid) {
            let point = (await Currencies.getData(uid)).exp;
            const level = expToLevel(point);
            const expCurrent = point - levelToExp(level);
            const expNextLevel = levelToExp(level + 1) - levelToExp(level);
            return { level, expCurrent, expNextLevel };
        }

        // Helper function to make an image circular
        async function circle(imageBuffer) {
            const image = await jimp.read(imageBuffer);
            image.circle();
            return await image.getBufferAsync("image/png");
        }

        // Helper function to create the rank card image
        async function makeRankCard(data) {
            const { id, name, rank, level, expCurrent, expNextLevel } = data;
            const cachePath = path.join(__dirname, "cache");
            
            // Register fonts
            registerFont(path.join(cachePath, "regular-font.ttf"), { family: "Manrope", weight: "regular" });
            registerFont(path.join(cachePath, "bold-font.ttf"), { family: "Manrope", weight: "bold" });

            const pathCustom = path.join(cachePath, "customrank");
            let dirImage = path.join(cachePath, "rankcard.png");
            
            if (fs.existsSync(pathCustom)) {
                const customDir = fs.readdirSync(pathCustom).map(item => item.replace(/\.png/g, ""));
                for (const singleLimit of customDir) {
                    let limitRate = false;
                    const split = singleLimit.split(/-/g);
                    let min = parseInt(split[0]), max = parseInt((split[1]) ? split[1] : min);
                    for (; min <= max; min++) if (level == min) { limitRate = true; break; }
                    if (limitRate) { 
                        dirImage = path.join(pathCustom, `${singleLimit}.png`); 
                        break; 
                    }
                }
            }

            let rankCard = await loadImage(dirImage);
            const pathImg = path.join(cachePath, `rank_${id}.png`);
            let expWidth = (expCurrent * 610) / expNextLevel;
            if (expWidth > 610 - 19.5) expWidth = 610 - 19.5;

            // Get user avatar
            let avatar;
            try {
                const avatarResponse = await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512`, {
                    responseType: 'arraybuffer'
                });
                avatar = await circle(avatarResponse.data);
            } catch (error) {
                // Use a default avatar if Facebook API fails
                const defaultAvatarResponse = await axios.get("https://i.imgur.com/o8S01I8.png", {
                    responseType: 'arraybuffer'
                });
                avatar = await circle(defaultAvatarResponse.data);
            }

            const canvas = createCanvas(1000, 282);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(await loadImage(avatar), 70, 75, 150, 150);

            // Draw text with styling
            ctx.font = "bold 36px Manrope";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "start";
            
            // Truncate long names
            let displayName = name;
            if (ctx.measureText(name).width > 500) {
                while (ctx.measureText(displayName + "...").width > 500 && displayName.length > 1) {
                    displayName = displayName.slice(0, -1);
                }
                displayName += "...";
            }
            ctx.fillText(displayName, 270, 164);

            ctx.font = "bold 38px Manrope";
            ctx.fillStyle = "#FF0000";
            ctx.textAlign = "end";
            ctx.fillText(level, 866, 82);
            ctx.fillText("Lv.", 793, 82);
            ctx.fillText(`#${rank}`, 700, 82);

            ctx.font = "bold 40px Manrope";
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
        let dataAll = await Currencies.getAll(["userID", "exp"]);
        dataAll = dataAll.filter(item => item.exp > 0); // Filter out users with 0 exp
        dataAll.sort((a, b) => b.exp - a.exp);

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

        // Get user rank
        const rankIndex = dataAll.findIndex(item => item.userID === targetUserID);
        if (rankIndex === -1) {
            return message.reply("❌ 𝑇ℎ𝑖𝑠 𝑢𝑠𝑒𝑟 𝑑𝑜𝑒𝑠𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑎𝑛𝑦 𝑒𝑥𝑝𝑒𝑟𝑖𝑒𝑛𝑐𝑒 𝑝𝑜𝑖𝑛𝑡𝑠 𝑦𝑒𝑡.");
        }
        
        const rank = rankIndex + 1;
        
        // Get user info
        const userInfo = await Users.getData(targetUserID);
        const name = userInfo.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
        
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
        
        // Send the rank card
        await message.reply({
            body: `🏆 𝑅𝑎𝑛𝑘: #${rank}\n⭐ 𝐿𝑒𝑣𝑒𝑙: ${pointInfo.level}\n📊 𝐸𝑋𝑃: ${pointInfo.expCurrent}/${pointInfo.expNextLevel}\n⏱ 𝑇𝑖𝑚𝑒 𝑡𝑎𝑘𝑒𝑛: ${Date.now() - startTime}𝑚𝑠`,
            attachment: fs.createReadStream(pathRankCard)
        });
        
        // Clean up
        fs.unlinkSync(pathRankCard);
        
    } catch (error) {
        console.error("𝑅𝑎𝑛𝑘 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑟𝑎𝑛𝑘 𝑐𝑎𝑟𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
