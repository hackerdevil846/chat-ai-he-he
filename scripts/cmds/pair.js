const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "pair",
        aliases: ["juti"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "💘 𝐸𝑡𝑎 𝑒𝑘𝑡𝑖 𝑗𝑢𝑡𝑖 𝑏𝑎𝑛𝑑ℎ𝑎𝑟 𝑘ℎ𝑒𝑙𝑎"
        },
        longDescription: {
            en: "𝑅𝑎𝑛𝑑𝑜𝑚𝑙𝑦 𝑝𝑎𝑖𝑟𝑠 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠 𝑖𝑛 𝑎 𝑔𝑟𝑜𝑢𝑝 𝑤𝑖𝑡ℎ 𝑎 𝑚𝑎𝑡𝑐ℎ 𝑝𝑒𝑟𝑐𝑒𝑛𝑡𝑎𝑔𝑒 𝑎𝑛𝑑 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑖𝑚𝑎𝑔𝑒"
        },
        category: "𝑓𝑢𝑛",
        guide: {
            en: "{p}pair"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": ""
        }
    },

    onLoad: function () {
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    },

    onStart: async function ({ message, event, usersData, threadsData }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑐𝑎𝑛𝑣𝑎𝑠.");
            }

            const { loadImage, createCanvas } = require('canvas');
            const cachePath = path.join(__dirname, 'cache');
            const pathImg = path.join(cachePath, 'background.png');
            const pathAvt1 = path.join(cachePath, 'Avtmot.png');
            const pathAvt2 = path.join(cachePath, 'Avthai.png');

            const id1 = event.senderID;
            const name1 = await usersData.getName(id1);

            const threadInfo = await threadsData.get(event.threadID);
            const all = threadInfo.members || [];
            const botID = global.utils.getBotID();
            const ungvien = [];

            // Get user gender if available
            let gender1 = null;
            for (const u of all) {
                if (u.userID == id1) {
                    gender1 = u.gender;
                    break;
                }
            }

            if (gender1 === 'FEMALE') {
                for (const u of all) if (u.gender === 'MALE' && u.userID !== id1 && u.userID !== botID) ungvien.push(u.userID);
            } else if (gender1 === 'MALE') {
                for (const u of all) if (u.gender === 'FEMALE' && u.userID !== id1 && u.userID !== botID) ungvien.push(u.userID);
            } else {
                for (const u of all) if (u.userID !== id1 && u.userID !== botID) ungvien.push(u.userID);
            }

            if (!ungvien.length) {
                return message.reply("❌ 𝐶𝑜𝑢𝑙𝑑𝑛'𝑡 𝑓𝑖𝑛𝑑 𝑎 𝑝𝑎𝑟𝑡𝑛𝑒𝑟 𝑡𝑜 𝑝𝑎𝑖𝑟 𝑤𝑖𝑡ℎ 𝑟𝑖𝑔ℎ𝑡 𝑛𝑜𝑤. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!");
            }

            const id2 = ungvien[Math.floor(Math.random() * ungvien.length)];
            const name2 = await usersData.getName(id2);

            // Percentage logic
            const rd1 = Math.floor(Math.random() * 100) + 1;
            const cc = ["0", "-1", "99,99", "-99", "-100", "101", "0,01"];
            const rd2 = cc[Math.floor(Math.random() * cc.length)];
            const djtme = [`${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd2}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`];
            const tile = djtme[Math.floor(Math.random() * djtme.length)];

            // Backgrounds list
            const backgrounds = [
                "https://i.postimg.cc/wjJ29HRB/background1.png",
                "https://i.postimg.cc/zf4Pnshv/background2.png",
                "https://i.postimg.cc/5tXRQ46D/background3.png"
            ];
            const rd = backgrounds[Math.floor(Math.random() * backgrounds.length)];

            // Fetch avatars and background
            const fbToken = '6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';

            const getAvtBuffer = async (uid) => {
                const res = await axios.get(`https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=${fbToken}`, { responseType: 'arraybuffer' });
                return Buffer.from(res.data);
            };

            const [bufAvt1, bufAvt2, bufBg] = await Promise.all([
                getAvtBuffer(id1),
                getAvtBuffer(id2),
                axios.get(rd, { responseType: 'arraybuffer' }).then(res => Buffer.from(res.data))
            ]);

            fs.writeFileSync(pathAvt1, bufAvt1);
            fs.writeFileSync(pathAvt2, bufAvt2);
            fs.writeFileSync(pathImg, bufBg);

            // Create canvas image
            const baseImage = await loadImage(pathImg);
            const baseAvt1 = await loadImage(pathAvt1);
            const baseAvt2 = await loadImage(pathAvt2);

            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext('2d');

            // Base background
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            // Circular avatars with border
            const drawCircular = (image, x, y, size) => {
                const radius = size / 2;
                ctx.save();
                ctx.beginPath();
                ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(image, x, y, size, size);
                ctx.restore();
                // Border
                ctx.beginPath();
                ctx.arc(x + radius, y + radius, radius + 4, 0, Math.PI * 2, true);
                ctx.lineWidth = 8;
                ctx.strokeStyle = 'rgba(255,255,255,0.9)';
                ctx.stroke();
            };

            drawCircular(baseAvt1, 100, 150, 300);
            drawCircular(baseAvt2, canvas.width - 400, 150, 300);

            // Text styling
            ctx.font = 'bold 48px Sans';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255,255,255,0.95)';

            // Names
            ctx.fillText(name1, 250, 500);
            ctx.fillText(name2, canvas.width - 250, 500);

            // Center love text
            ctx.font = 'bold 72px Sans';
            ctx.fillText('💖 𝐽𝑢𝑡𝑖 𝑀𝑎𝑡𝑐ℎ 💖', canvas.width / 2, 420);

            // Percentage box
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            const boxW = 420, boxH = 110;
            ctx.fillRect(canvas.width / 2 - boxW / 2, canvas.height - 200, boxW, boxH);
            ctx.font = 'bold 60px Sans';
            ctx.fillStyle = 'rgba(255,255,255,0.95)';
            ctx.fillText(`${tile}%`, canvas.width / 2, canvas.height - 120);

            // Export
            const imageBuffer = canvas.toBuffer('image/png');
            fs.writeFileSync(pathImg, imageBuffer);

            // Prepare mentions
            const mentions = [
                { tag: name1, id: id1 },
                { tag: name2, id: id2 }
            ];

            const body = `💘 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛 ${name1} tumi ${name2} er sathe juti bandhlo!\n✨ 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝑠ℎ𝑜𝑚𝑝𝑎𝑑: ${tile}%`;

            await message.reply({ 
                body, 
                mentions, 
                attachment: fs.createReadStream(pathImg) 
            });

            // Clean up
            fs.unlinkSync(pathImg);
            fs.unlinkSync(pathAvt1);
            fs.unlinkSync(pathAvt2);

        } catch (err) {
            console.error("𝑃𝑎𝑖𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", err);
            await message.reply("❌ 𝑂𝑜𝑝𝑠! 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
