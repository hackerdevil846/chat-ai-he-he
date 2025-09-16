const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

module.exports = {
    config: {
        name: "pair3",
        aliases: ["pair3", "couple3"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "✨ 𝑃𝑎𝑖𝑟 𝑢𝑝 𝑢𝑠𝑒𝑟𝑠 𝑎𝑛𝑑 𝑠ℎ𝑜𝑤 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 ✨"
        },
        longDescription: {
            en: "𝑅𝑎𝑛𝑑𝑜𝑚𝑙𝑦 𝑝𝑎𝑖𝑟 𝑢𝑠𝑒𝑟𝑠 𝑎𝑛𝑑 𝑑𝑖𝑠𝑝𝑙𝑎𝑦 𝑡ℎ𝑒𝑖𝑟 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑤𝑖𝑡ℎ 𝑎 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑖𝑚𝑎𝑔𝑒"
        },
        category: "𝑓𝑢𝑛",
        guide: {
            en: "{p}pair3"
        },
        countDown: 5,
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

            // 🖼️ Path setup
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            const pathImg = path.join(cacheDir, "pair_background.png");
            const pathAvt1 = path.join(cacheDir, "pair_avt1.png");
            const pathAvt2 = path.join(cacheDir, "pair_avt2.png");
            
            const id1 = event.senderID;
            const user1 = await usersData.get(id1);
            const name1 = user1.name;
            
            const threadInfo = await threadsData.get(event.threadID);
            const allUsers = threadInfo.members || [];
            
            const botID = global.utils.getBotID();
            const ungvien = [];
            
            // 🔍 Find potential matches
            for (const member of allUsers) {
                if (member.userID !== id1 && member.userID !== botID) {
                    ungvien.push(member.userID);
                }
            }
            
            if (ungvien.length === 0) {
                return message.reply("😢 𝑁𝑜 𝑒𝑙𝑖𝑔𝑖𝑏𝑙𝑒 𝑝𝑎𝑟𝑡𝑛𝑒𝑟𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!");
            }
            
            // 🎲 Random selection
            const id2 = ungvien[Math.floor(Math.random() * ungvien.length)];
            const user2 = await usersData.get(id2);
            const name2 = user2.name;
            
            // 💖 Compatibility calculation
            const tileOptions = ["0", "-1", "99.99", "-99", "-100", "101", "0.01"];
            const randomPercent = Math.random() < 0.8
                ? Math.floor(Math.random() * 100) + 1
                : tileOptions[Math.floor(Math.random() * tileOptions.length)];
            
            // 🎨 Background selection
            const backgrounds = [
                "https://i.postimg.cc/wjJ29HRB/background1.png",
                "https://i.postimg.cc/zf4Pnshv/background2.png",
                "https://i.postimg.cc/5tXRQ46D/background3.png"
            ];
            const selectedBG = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            
            // 📥 Download images
            const [avt1Response, avt2Response, bgResponse] = await Promise.all([
                axios.get(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
                axios.get(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
                axios.get(selectedBG, { responseType: "arraybuffer" })
            ]);
            
            fs.writeFileSync(pathAvt1, Buffer.from(avt1Response.data));
            fs.writeFileSync(pathAvt2, Buffer.from(avt2Response.data));
            fs.writeFileSync(pathImg, Buffer.from(bgResponse.data));
            
            // 🎭 Create canvas
            const baseImage = await loadImage(pathImg);
            const baseAvt1 = await loadImage(pathAvt1);
            const baseAvt2 = await loadImage(pathAvt2);
            
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");
            
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(baseAvt1, 100, 150, 300, 300);
            ctx.drawImage(baseAvt2, 900, 150, 300, 300);
            
            // ✍️ Add names
            ctx.font = "bold 35px 'Arial'";
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.fillText(name1, 250, 500);
            ctx.fillText(name2, 1050, 500);
            
            // 🔥 Add compatibility text
            ctx.font = "bold 40px 'Arial'";
            ctx.fillStyle = "#FF1493";
            ctx.fillText(`💝 𝐶𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦: ${randomPercent}% 💝`, 700, 600);
            
            const imageBuffer = canvas.toBuffer();
            fs.writeFileSync(pathImg, imageBuffer);
            
            // 📤 Send result
            await message.reply({
                body: `💌 𝑃𝑎𝑖𝑟𝑖𝑛𝑔 𝐴𝑙𝑒𝑟𝑡 💌\n━━━━━━━━━━━━━━\n\n${name1}, 𝑦𝑜𝑢 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑝𝑎𝑖𝑟𝑒𝑑 𝑤𝑖𝑡ℎ ${name2}!\n\n💘 𝑌𝑜𝑢𝑟 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑖𝑠: ${randomPercent}% 💘\n\n𝑀𝑎𝑦 𝑦𝑜𝑢 ℎ𝑎𝑣𝑒 𝑎 𝑏𝑙𝑒𝑠𝑠𝑒𝑑 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝! 💑`,
                mentions: [{
                    tag: name2,
                    id: id2
                }],
                attachment: fs.createReadStream(pathImg)
            });
            
            // 🧹 Cleanup
            [pathImg, pathAvt1, pathAvt2].forEach(filePath => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
            
        } catch (error) {
            console.error("𝑃𝑎𝑖𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑎𝑖𝑟𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!");
        }
    }
};
