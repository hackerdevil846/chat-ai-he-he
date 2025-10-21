const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

module.exports = {
    config: {
        name: "pair5",
        aliases: [],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "💞 𝐸𝑡𝑎 𝑒𝑘𝑡𝑖 𝑗𝑢𝑡𝑖 𝑏𝑎𝑛𝑑ℎ𝑎𝑟 𝑘ℎ𝑒𝑙𝑎"
        },
        longDescription: {
            en: "𝑃𝑙𝑎𝑦 𝑎 𝑓𝑢𝑛 𝑔𝑎𝑚𝑒 𝑡𝑜 𝑝𝑎𝑖𝑟 𝑢𝑝 𝑤𝑖𝑡ℎ 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝"
        },
        category: "𝑓𝑢𝑛",
        guide: {
            en: "{p}pair5"
        },
        countDown: 15,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, usersData, threadsData }) {
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

            // Path setup
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            const pathImg = path.join(cacheDir, "background.png");
            const pathAvt1 = path.join(cacheDir, "Avtmot.png");
            const pathAvt2 = path.join(cacheDir, "Avthai.png");
            
            // Get sender info
            const id1 = event.senderID;
            const name1 = await usersData.getName(id1);
            
            // Get thread members
            const threadInfo = await threadsData.get(event.threadID);
            const allUsers = threadInfo.members || [];
            const botID = global.utils.getBotID();
            
            // Find sender's info
            const senderInfo = allUsers.find(user => user.userID === id1);
            const gender1 = senderInfo?.gender || "UNKNOWN";
            
            // Filter potential matches
            let ungvien = [];
            if (gender1 === "FEMALE") {
                ungvien = allUsers.filter(u => 
                    u.gender === "MALE" && u.userID !== id1 && u.userID !== botID
                );
            } else if (gender1 === "MALE") {
                ungvien = allUsers.filter(u => 
                    u.gender === "FEMALE" && u.userID !== id1 && u.userID !== botID
                );
            } else {
                ungvien = allUsers.filter(u => 
                    u.userID !== id1 && u.userID !== botID
                );
            }
            
            if (ungvien.length === 0) {
                return message.reply("😔 𝑁𝑜 𝑠𝑢𝑖𝑡𝑎𝑏𝑙𝑒 𝑚𝑎𝑡𝑐ℎ𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!");
            }
            
            // Random selection
            const randomIndex = Math.floor(Math.random() * ungvien.length);
            const id2 = ungvien[randomIndex].userID;
            const name2 = await usersData.getName(id2);
            
            // Compatibility calculation
            const rd1 = Math.floor(Math.random() * 100) + 1;
            const specialCases = ["0", "-1", "99.99", "-99", "-100", "101", "0.01"];
            const tileOptions = [...Array(9).fill(rd1), ...specialCases];
            const tile = tileOptions[Math.floor(Math.random() * tileOptions.length)];
            
            // Background selection
            const backgrounds = [
                "https://i.postimg.cc/wjJ29HRB/background1.png",
                "https://i.postimg.cc/zf4Pnshv/background2.png",
                "https://i.postimg.cc/5tXRQ46D/background3.png"
            ];
            const backgroundUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            
            // Download images
            const downloadImage = async (url, filePath) => {
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                fs.writeFileSync(filePath, Buffer.from(response.data, 'utf-8'));
            };
            
            await Promise.all([
                downloadImage(`https://graph.facebook.com/${id1}/picture?width=720&height=720`, pathAvt1),
                downloadImage(`https://graph.facebook.com/${id2}/picture?width=720&height=720`, pathAvt2),
                downloadImage(backgroundUrl, pathImg)
            ]);
            
            // Process images
            const [baseImage, baseAvt1, baseAvt2] = await Promise.all([
                loadImage(pathImg),
                loadImage(pathAvt1),
                loadImage(pathAvt2)
            ]);
            
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");
            
            // Draw composition
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(baseAvt1, 100, 150, 300, 300);
            ctx.drawImage(baseAvt2, 900, 150, 300, 300);
            
            // Save result
            fs.writeFileSync(pathImg, canvas.toBuffer());
            
            // Clean up temp files
            fs.unlinkSync(pathAvt1);
            fs.unlinkSync(pathAvt2);
            
            // Send result
            await message.reply({
                body: `💞✨ 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛 ${name1}, 𝑡𝑢𝑚𝑖 𝑠𝑎𝑝ℎ𝑎𝑙𝑏ℎ𝑎𝑏𝑒 ${name2} 𝑒𝑟 𝑠𝑎𝑡ℎ𝑒 𝑗𝑢𝑡𝑖 𝑏𝑎𝑛𝑑ℎ𝑙𝑒!\n\n🔥💯 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝑠𝑎𝑚𝑎𝑛𝑛𝑗𝑜𝑠𝑦𝑎: ${tile}%`,
                mentions: [{ tag: name2, id: id2 }],
                attachment: fs.createReadStream(pathImg)
            });
            
            // Clean up final image
            fs.unlinkSync(pathImg);
            
        } catch (error) {
            console.error("❌ 𝑃𝑎𝑖𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("🥺 𝐵𝑜𝑛𝑑ℎ𝑢, 𝑗𝑢𝑡𝑖 𝑏𝑎𝑛𝑑ℎ𝑡𝑒 𝑔𝑖𝑦𝑒 𝑠𝑜𝑚𝑜𝑠𝑠𝑦𝑎 ℎ𝑜𝑙𝑜! 𝐴𝑏𝑎𝑟 𝑐𝑒𝑠𝑡𝑎 𝑘𝑜𝑟𝑜...");
        }
    }
};
