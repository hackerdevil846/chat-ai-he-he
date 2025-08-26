const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

// ---------- CONFIGURATION ----------
module.exports.config = {
    name: "game",
    version: "1.2.0",
    hasPermssion: 0, // 0 = all users
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🎮 Nijer Messenger e catchphrase dhorar khela! Fun with letters and pictures!",
    category: "Entertainment",
    usages: "Dui dhoroner moddhe ekta beche nin [1/2]",
    cooldowns: 5,
    dependencies: {
        "axios": "*",
        "canvas": "*",
        "fs-extra": "*"
    }
};

// ---------- LANGUAGE STRINGS ----------
module.exports.languages = {
    "en": {
        "choose_option": "✨ Please select a game mode:\n\n1️⃣ » Chase letters to find the picture\n2️⃣ » Chase pictures to find the word",
        "invalid_option": "⚠️ Invalid option! Please select 1️⃣ or 2️⃣",
        "correct_answer": "🎉 Congratulations {name}! 🎉\n✅ Correct answer: {tukhoa}\n💰 Reward: {coinsup}$",
        "wrong_answer": "❌ Wrong answer! Try again! 🔄",
        "reply_clue": "🔍 Reply with the correct answer!\n✨ Clue: {sokitu}",
        "game_load_error": "❌ Game loading failed! Please try again later. ⏳"
    }
};

// ---------- UTILITY: CREATE CLUE IMAGE ----------
async function createClueImage(imagePath, clueText, outputPath) {
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
        console.error("🖼️ Image processing error:", error);
        return false;
    }
}

// ---------- HANDLE REPLIES ----------
module.exports.handleReply = async function({ event, api, handleReply, Currencies, getText }) {
    const { tukhoa, type } = handleReply;
    const coinsup = 200;

    if (event.senderID !== handleReply.author) return;

    switch (type) {
        case "choosee":
            // User selects game mode
            if (["1", "2"].includes(event.body)) {
                api.unsendMessage(handleReply.messageID);
                return module.exports.onStart({ 
                    api, 
                    event, 
                    args: [event.body], 
                    getText,
                    Currencies
                });
            }
            return api.sendMessage(getText("invalid_option"), event.threadID);

        case "doanvan":
        case "doanhinh":
            // Check answer
            if (event.body.toLowerCase() === tukhoa.toLowerCase()) {
                await Currencies.increaseMoney(event.senderID, coinsup);
                const userName = (await api.getUserInfo(event.senderID))[event.senderID].name;
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage(
                    getText("correct_answer", { name: userName, tukhoa, coinsup }),
                    event.threadID
                );
            }
            return api.sendMessage(getText("wrong_answer"), event.threadID);
    }
};

// ---------- RUN COMMAND ----------
module.exports.onStart = async function({ api, event, args, getText, Currencies }) {
    // Ensure credits are not tampered
    if (this.config.credits !== "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅") {
        return api.sendMessage("⚠️ Credit tampering detected! ❌", event.threadID);
    }

    // If no mode selected, prompt user
    if (!args[0]) {
        return api.sendMessage(getText("choose_option"), event.threadID, (err, info) => {
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

            await createClueImage(cachePath, `🔤 Clue: ${gameData.sokitu}`, cachePath);

            return api.sendMessage({
                body: getText("reply_clue", { sokitu: gameData.sokitu }),
                attachment: fs.createReadStream(cachePath)
            }, event.threadID, (err, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    tukhoa: gameData.tukhoa,
                    type: "doanvan"
                });
            });
        } catch (error) {
            console.error("🚨 Game mode 1 error:", error);
            return api.sendMessage(getText("game_load_error"), event.threadID);
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
            await Promise.all(cachePaths.map(p => createClueImage(p, `🖼️ Clue: ${gameData.sokitu}`, p)));

            return api.sendMessage({
                body: getText("reply_clue", { sokitu: gameData.sokitu }),
                attachment: cachePaths.map(p => fs.createReadStream(p))
            }, event.threadID, (err, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    tukhoa: gameData.tukhoa,
                    type: "doanhinh"
                });
            });
        } catch (error) {
            console.error("🚨 Game mode 2 error:", error);
            return api.sendMessage(getText("game_load_error"), event.threadID);
        }
    }

    // ---------- Invalid selection ----------
    return api.sendMessage(getText("invalid_option"), event.threadID);
};
