const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "game",
        aliases: ["guessgame", "wordgame"],
        version: "1.2.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑒𝑛𝑡𝑒𝑟𝑡𝑎𝑖𝑛𝑚𝑒𝑛𝑡",
        shortDescription: {
            en: "🎮 𝑁𝑖𝑗𝑒𝑟 𝑀𝑒𝑠𝑠𝑒𝑛𝑔𝑒𝑟 𝑒 𝑐𝑎𝑡𝑐ℎ𝑝ℎ𝑟𝑎𝑠𝑒 𝑑ℎ𝑜𝑟𝑎𝑟 𝑘ℎ𝑒𝑙𝑎!"
        },
        longDescription: {
            en: "𝐹𝑢𝑛 𝑤𝑖𝑡ℎ 𝑙𝑒𝑡𝑡𝑒𝑟𝑠 𝑎𝑛𝑑 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠!"
        },
        guide: {
            en: "{p}game [1/2]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "canvas": "",
            "fs-extra": ""
        }
    },

    // ---------- UTILITY: CREATE CLUE IMAGE ----------
    createClueImage: async function(imagePath, clueText, outputPath) {
        try {
            const image = await loadImage(imagePath);
            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext("2d");

            // Draw original image
            ctx.drawImage(image, 0, 0);

            // Overlay stylish text
            ctx.font = "bold 48px 'Arial Rounded MT Bold'";
            ctx.fillStyle = "#FFD700"; // Gold
            ctx.strokeStyle = "#8B0000"; // Dark red
            ctx.lineWidth = 5;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            const textX = canvas.width / 2;
            const textY = canvas.height - 30;

            ctx.strokeText(clueText, textX, textY);
            ctx.fillText(clueText, textX, textY);

            // Save processed image
            const buffer = canvas.toBuffer("image/png");
            await fs.writeFile(outputPath, buffer);

            return true;
        } catch (error) {
            console.error("🖼️ 𝐼𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
            return false;
        }
    },

    // ---------- HANDLE REPLIES ----------
    onReply: async function({ message, event, handleReply, usersData }) {
        const { tukhoa, type } = handleReply;
        const coinsup = 200;

        if (event.senderID !== handleReply.author) return;

        switch (type) {
            case "choosee":
                // User selects game mode
                if (["1", "2"].includes(event.body)) {
                    message.unsend(handleReply.messageID);
                    return this.onStart({ 
                        message, 
                        event, 
                        args: [event.body], 
                        usersData
                    });
                }
                return message.reply("⚠️ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑝𝑡𝑖𝑜𝑛! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑒𝑙𝑒𝑐𝑡 1️⃣ 𝑜𝑟 2️⃣");

            case "doanvan":
            case "doanhinh":
                // Check answer
                if (event.body.toLowerCase() === tukhoa.toLowerCase()) {
                    const userData = await usersData.get(event.senderID);
                    await usersData.set(event.senderID, {
                        money: (userData.money || 0) + coinsup,
                        data: userData.data
                    });
                    
                    const userInfo = await global.utils.getUserInfo(event.senderID);
                    const userName = userInfo[event.senderID]?.name || "𝑈𝑠𝑒𝑟";
                    
                    message.unsend(handleReply.messageID);
                    return message.reply(`🎉 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠 ${userName}! 🎉\n✅ 𝐶𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟: ${tukhoa}\n💰 𝑅𝑒𝑤𝑎𝑟𝑑: ${coinsup}$`);
                }
                return message.reply("❌ 𝑊𝑟𝑜𝑛𝑔 𝑎𝑛𝑠𝑤𝑒𝑟! 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛! 🔄");
        }
    },

    // ---------- RUN COMMAND ----------
    onStart: async function({ message, event, args, usersData }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("canvas");
                require("fs-extra");
                require("path");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ.");
            }

            // If no mode selected, prompt user
            if (!args[0]) {
                return message.reply("✨ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑒𝑙𝑒𝑐𝑡 𝑎 𝑔𝑎𝑚𝑒 𝑚𝑜𝑑𝑒:\n\n1️⃣ » 𝐶ℎ𝑎𝑠𝑒 𝑙𝑒𝑡𝑡𝑒𝑟𝑠 𝑡𝑜 𝑓𝑖𝑛𝑑 𝑡ℎ𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒\n2️⃣ » 𝐶ℎ𝑎𝑠𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠 𝑡𝑜 𝑓𝑖𝑛𝑑 𝑡ℎ𝑒 𝑤𝑜𝑟𝑑", (err, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "choosee"
                    });
                });
            }

            // ---------- GAME MODE 1: Guess picture from letters ----------
            if (args[0] === "1") {
                try {
                    const res = await axios.get(`https://raw.githubusercontent.com/J-JRT/Judas-Bot-dep/main/data/data.json`);
                    const games = res.data.tukhoa;
                    const gameData = games[Math.floor(Math.random() * games.length)];

                    const imageResponse = await axios.get(gameData.link1, { responseType: "arraybuffer" });
                    const cachePath = path.join(__dirname, `cache/game_${Date.now()}.png`);
                    await fs.ensureDir(path.dirname(cachePath));
                    await fs.writeFile(cachePath, imageResponse.data);

                    await this.createClueImage(cachePath, `🔤 𝐶𝑙𝑢𝑒: ${gameData.sokitu}`, cachePath);

                    return message.reply({
                        body: `🔍 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟!\n✨ 𝐶𝑙𝑢𝑒: ${gameData.sokitu}`,
                        attachment: fs.createReadStream(cachePath)
                    }, (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            tukhoa: gameData.tukhoa,
                            type: "doanvan"
                        });
                    });
                } catch (error) {
                    console.error("🚨 𝐺𝑎𝑚𝑒 𝑚𝑜𝑑𝑒 1 𝑒𝑟𝑟𝑜𝑟:", error);
                    return message.reply("❌ 𝐺𝑎𝑚𝑒 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑓𝑎𝑖𝑙𝑒𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟. ⏳");
                }
            }

            // ---------- GAME MODE 2: Guess word from pictures ----------
            if (args[0] === "2") {
                try {
                    const res = await axios.get(`https://raw.githubusercontent.com/J-JRT/Judas-Bot-dep/main/data/anh.json`);
                    const games = res.data.doanhinh;
                    const gameData = games[Math.floor(Math.random() * games.length)];

                    const imageTasks = [
                        axios.get(gameData.link1, { responseType: "arraybuffer" }),
                        axios.get(gameData.link2, { responseType: "arraybuffer" })
                    ];

                    const images = await Promise.all(imageTasks);
                    const cachePaths = images.map((_, i) => path.join(__dirname, `cache/game_${Date.now()}_${i}.png`));

                    await Promise.all(images.map((img, i) => {
                        fs.ensureDir(path.dirname(cachePaths[i]));
                        return fs.writeFile(cachePaths[i], img.data);
                    }));
                    
                    await Promise.all(cachePaths.map(p => this.createClueImage(p, `🖼️ 𝐶𝑙𝑢𝑒: ${gameData.sokitu}`, p)));

                    return message.reply({
                        body: `🔍 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟!\n✨ 𝐶𝑙𝑢𝑒: ${gameData.sokitu}`,
                        attachment: cachePaths.map(p => fs.createReadStream(p))
                    }, (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            tukhoa: gameData.tukhoa,
                            type: "doanhinh"
                        });
                    });
                } catch (error) {
                    console.error("🚨 𝐺𝑎𝑚𝑒 𝑚𝑜𝑑𝑒 2 𝑒𝑟𝑟𝑜𝑟:", error);
                    return message.reply("❌ 𝐺𝑎𝑚𝑒 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑓𝑎𝑖𝑙𝑒𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟. ⏳");
                }
            }

            // ---------- Invalid selection ----------
            return message.reply("⚠️ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑝𝑡𝑖𝑜𝑛! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑒𝑙𝑒𝑐𝑡 1️⃣ 𝑜𝑟 2️⃣");

        } catch (error) {
            console.error("🎮 𝐺𝑎𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
            return message.reply("❌ 𝐺𝑎𝑚𝑒 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑓𝑎𝑖𝑙𝑒𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟. ⏳");
        }
    }
};
