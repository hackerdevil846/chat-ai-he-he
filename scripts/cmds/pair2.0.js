const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

module.exports = {
    config: {
        name: "pair2.0",
        aliases: ["couple2.0", "match2.0"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "💑 𝐸𝑡𝑎 𝑒𝑘𝑡𝑖 𝑗𝑜𝑑𝑖 𝑏𝑎𝑛𝑑ℎ𝑎𝑟 𝑘ℎ𝑒𝑙𝑎"
        },
        longDescription: {
            en: "𝑀𝑎𝑡𝑐ℎ𝑚𝑎𝑘𝑖𝑛𝑔 𝑔𝑎𝑚𝑒 𝑡ℎ𝑎𝑡 𝑝𝑎𝑖𝑟𝑠 𝑦𝑜𝑢 𝑤𝑖𝑡ℎ 𝑎𝑛𝑜𝑡ℎ𝑒𝑟 𝑢𝑠𝑒𝑟 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝"
        },
        category: "𝑓𝑢𝑛",
        guide: {
            en: "{p}pair2.0"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": "",
            "path": ""
        }
    },

    onStart: async function ({ message, event, usersData, threadsData }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
                require("path");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ.");
            }

            // Define paths
            const cacheDir = path.join(__dirname, "cache");
            const pathImg = path.join(cacheDir, "pair_background.png");
            const pathAvt1 = path.join(cacheDir, "pair_avt1.png");
            const pathAvt2 = path.join(cacheDir, "pair_avt2.png");
            
            // Create cache directory if it doesn't exist
            await fs.ensureDir(cacheDir);
            
            // Get sender info
            const id1 = event.senderID;
            const name1 = await usersData.getName(id1);
            
            // Get thread info
            const ThreadInfo = await threadsData.get(event.threadID);
            const allUsers = ThreadInfo.members || [];
            
            // Determine sender's gender
            const senderInfo = allUsers.find(u => u.userID === id1);
            const gender1 = senderInfo ? (senderInfo.gender || "UNKNOWN") : "UNKNOWN";
            
            // Filter potential matches
            const botID = global.utils.getBotID();
            let candidates = [];
            
            if (gender1 === "FEMALE") {
                candidates = allUsers.filter(u => 
                    u.gender === "MALE" && u.userID !== id1 && u.userID !== botID
                );
            } else if (gender1 === "MALE") {
                candidates = allUsers.filter(u => 
                    u.gender === "FEMALE" && u.userID !== id1 && u.userID !== botID
                );
            } else {
                candidates = allUsers.filter(u => 
                    u.userID !== id1 && u.userID !== botID
                );
            }
            
            // Select random match
            if (candidates.length === 0) {
                return message.reply("😢 𝑁𝑎𝑘ℎ𝑎𝑏𝑒 𝑗𝑜𝑑𝑖 𝑘𝑜𝑟𝑎𝑟 𝑚𝑜𝑡𝑜 𝑝𝑎𝑖𝑙𝑎𝑚 𝑛𝑎𝑖!");
            }
            
            const selected = candidates[Math.floor(Math.random() * candidates.length)];
            const id2 = selected.userID;
            const name2 = selected.name || await usersData.getName(id2);
            
            // Generate match percentage
            const percentage = Math.random() > 0.9 
                ? ["0", "-1", "99.99", "-99", "-100", "101", "0.01"][Math.floor(Math.random() * 7)]
                : Math.floor(Math.random() * 100) + 1;
            
            // Background images
            const backgrounds = [
                "https://i.postimg.cc/wjJ29HRB/background1.png",
                "https://i.postimg.cc/zf4Pnshv/background2.png",
                "https://i.postimg.cc/5tXRQ46D/background3.png"
            ];
            const bgUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            
            // Download images
            const downloadImage = async (url, filePath) => {
                const response = await axios.get(url, { responseType: "arraybuffer" });
                await fs.writeFile(filePath, Buffer.from(response.data));
            };
            
            await Promise.all([
                downloadImage(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, pathAvt1),
                downloadImage(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, pathAvt2),
                downloadImage(bgUrl, pathImg)
            ]);
            
            // Process images
            const baseImage = await loadImage(pathImg);
            const avt1 = await loadImage(pathAvt1);
            const avt2 = await loadImage(pathAvt2);
            
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");
            
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(avt1, 100, 150, 300, 300);
            ctx.drawImage(avt2, 900, 150, 300, 300);
            
            // Add names
            ctx.font = "bold 40px 'Arial', sans-serif";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
            ctx.shadowBlur = 8;
            ctx.fillText(name1, 250, 500);
            ctx.fillText(name2, 1050, 500);
            
            // Add percentage
            ctx.font = "bold 80px 'Arial', sans-serif";
            ctx.fillStyle = "#FF1493";
            ctx.fillText(`${percentage}%`, 650, 350);
            
            // Save result
            const resultPath = path.join(cacheDir, "pair_result.png");
            const out = fs.createWriteStream(resultPath);
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            
            await new Promise((resolve) => out.on("finish", resolve));
            
            // Send message
            await message.reply({
                body: `🎊 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛 ${name1}! 𝑡𝑢𝑚𝑖 𝑗𝑜𝑑𝑖 ℎ𝑜𝑙𝑒𝑐ℎ𝑜 ${name2} 𝑒𝑟 𝑠𝑎𝑡ℎ𝑒\n💝 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝑠𝑎𝑚𝑎𝑛𝑛𝑗𝑜𝑠𝑦𝑎: ${percentage}%`,
                mentions: [{ tag: name2, id: id2 }],
                attachment: fs.createReadStream(resultPath)
            });
            
            // Clean up files
            [pathImg, pathAvt1, pathAvt2, resultPath].forEach(filePath => {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            });
            
        } catch (error) {
            console.error("𝑃𝑎𝑖𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑟𝑒 𝑒𝑟𝑟𝑜𝑟 ℎ𝑜𝑖𝑒𝑔𝑒𝑐ℎ𝑒, 𝑝𝑢𝑛𝑜𝑟𝑎𝑏𝑎𝑟 𝑐ℎ𝑒𝑠𝑡𝑎 𝑘𝑜𝑟𝑢𝑛!");
        }
    }
};
