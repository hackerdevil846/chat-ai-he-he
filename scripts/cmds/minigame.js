const axios = global.nodemodule["axios"];
const { createCanvas, loadImage } = global.nodemodule["canvas"];
const fs = global.nodemodule["fs-extra"];

module.exports.config = {
    name: "game",
    version: "1.2.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🎮 𝑵𝒊𝒋𝒆𝒓 𝒎𝒆𝒔𝒔𝒆𝒏𝒈𝒆𝒓 𝒆 𝒄𝒂𝒕𝒄𝒉𝒑𝒉𝒓𝒂𝒔𝒆 𝒅𝒉𝒐𝒓𝒂𝒓 𝒌𝒉𝒆𝒍𝒂!",
    commandCategory: "Entertainment",
    usages: "𝑫𝒖𝒊 𝒅𝒉𝒐𝒓𝒐𝒏𝒆𝒓 𝒎𝒐𝒅𝒅𝒉𝒆 𝒆𝒌𝒕𝒂 𝒃𝒆𝒄𝒉𝒆 𝒏𝒊𝒏 [1/2]",
    cooldowns: 5,
    dependencies: {
        "axios": "*",
        "fs-extra": "*",
        "canvas": "*"
    }
};

module.exports.languages = {
    "en": {
        "choose_option": "✨ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒔𝒆𝒍𝒆𝒄𝒕 𝒂 𝒈𝒂𝒎𝒆 𝒎𝒐𝒅𝒆:\n\n1️⃣ » 𝑪𝒉𝒂𝒔𝒆 𝒍𝒆𝒕𝒕𝒆𝒓𝒔 𝒕𝒐 𝒇𝒊𝒏𝒅 𝒕𝒉𝒆 𝒑𝒊𝒄𝒕𝒖𝒓𝒆\n2️⃣ » 𝑪𝒉𝒂𝒔𝒆 𝒑𝒊𝒄𝒕𝒖𝒓𝒆𝒔 𝒕𝒐 𝒇𝒊𝒏𝒅 𝒕𝒉𝒆 𝒘𝒐𝒓𝒅",
        "invalid_option": "⚠️ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒐𝒑𝒕𝒊𝒐𝒏! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒔𝒆𝒍𝒆𝒄𝒕 1 𝒐𝒓 2",
        "correct_answer": "🎉 𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒖𝒍𝒂𝒕𝒊𝒐𝒏𝒔 {name}! 🎉\n✅ 𝑪𝒐𝒓𝒓𝒆𝒄𝒕 𝒂𝒏𝒔𝒘𝒆𝒓: {tukhoa}\n💰 𝑹𝒆𝒘𝒂𝒓𝒅: {coinsup}$",
        "wrong_answer": "❌ 𝑾𝒓𝒐𝒏𝒈 𝒂𝒏𝒔𝒘𝒆𝒓! 𝑻𝒓𝒚 𝒂𝒈𝒂𝒊𝒏",
        "reply_clue": "🔍 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒕𝒉𝒆 𝒄𝒐𝒓𝒓𝒆𝒄𝒕 𝒂𝒏𝒔𝒘𝒆𝒓!\n✨ 𝑪𝒍𝒖𝒆: {sokitu}"
    }
};

async function createClueImage(imagePath, clueText, outputPath) {
    try {
        const image = await loadImage(imagePath);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        
        ctx.drawImage(image, 0, 0);
        
        // Stylish text overlay
        ctx.font = "bold 42px 'Arial Rounded MT Bold'";
        ctx.fillStyle = "#FFD700";
        ctx.strokeStyle = "#8B0000";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        
        const textX = canvas.width / 2;
        const textY = canvas.height - 30;
        
        ctx.strokeText(clueText, textX, textY);
        ctx.fillText(clueText, textX, textY);
        
        const buffer = canvas.toBuffer("image/png");
        await fs.writeFile(outputPath, buffer);
        return true;
    } catch (error) {
        console.error("🖼️ 𝑰𝒎𝒂𝒈𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒆𝒓𝒓𝒐𝒓:", error);
        return false;
    }
}

module.exports.handleReply = async function({ event, api, handleReply, Currencies, getText }) {
    const { tukhoa, type } = handleReply;
    const coinsup = 200;
    
    if (event.senderID !== handleReply.author) return;
    
    switch (type) {
        case "choosee":
            if (["1", "2"].includes(event.body)) {
                api.unsendMessage(handleReply.messageID);
                return this.run({ 
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
            if (event.body.toLowerCase() === tukhoa.toLowerCase()) {
                await Currencies.increaseMoney(event.senderID, coinsup);
                const name = (await api.getUserInfo(event.senderID))[event.senderID].name;
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage(
                    getText("correct_answer", { 
                        name: name,
                        tukhoa: tukhoa,
                        coinsup: coinsup
                    }), 
                    event.threadID
                );
            } 
            return api.sendMessage(getText("wrong_answer"), event.threadID);
    }
};

module.exports.run = async function({ api, event, args, getText, Currencies }) {
    // Credit protection
    if (this.config.credits !== "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅") {
        return api.sendMessage("⚠️ 𝑪𝒓𝒆𝒅𝒊𝒕 𝒕𝒂𝒎𝒑𝒆𝒓𝒊𝒏𝒈 𝒅𝒆𝒕𝒆𝒄𝒕𝒆𝒅!", event.threadID);
    }

    // Game mode selection
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

    // Game mode 1: Guess picture from letters
    if (args[0] === "1") {
        try {
            const res = await axios.get(`https://raw.githubusercontent.com/J-JRT/Judas-Bot-dep/main/data/data.json`);
            const games = res.data.tukhoa;
            const gameData = games[Math.floor(Math.random() * games.length)];
            
            const imageResponse = await axios.get(gameData.link1, { responseType: "arraybuffer" });
            const cachePath = __dirname + `/cache/game_${Date.now()}.png`;
            await fs.writeFile(cachePath, imageResponse.data);
            
            await createClueImage(cachePath, `🔤 𝑪𝒍𝒖𝒆: ${gameData.sokitu}`, cachePath);
            
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
            console.error("🚨 𝑮𝒂𝒎𝒆 𝒆𝒓𝒓𝒐𝒓:", error);
            return api.sendMessage("❌ 𝑮𝒂𝒎𝒆 𝒍𝒐𝒂𝒅𝒊𝒏𝒈 𝒇𝒂𝒊𝒍𝒆𝒅! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.", event.threadID);
        }
    }

    // Game mode 2: Guess word from pictures
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
            const cachePaths = images.map((_, i) => __dirname + `/cache/game_${Date.now()}_${i}.png`);
            
            await Promise.all(images.map((img, i) => fs.writeFile(cachePaths[i], img.data)));
            await Promise.all(cachePaths.map(path => createClueImage(path, `🖼️ 𝑪𝒍𝒖𝒆: ${gameData.sokitu}`, path)));
            
            return api.sendMessage({
                body: getText("reply_clue", { sokitu: gameData.sokitu }),
                attachment: cachePaths.map(path => fs.createReadStream(path))
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
            console.error("🚨 𝑮𝒂𝒎𝒆 𝒆𝒓𝒓𝒐𝒓:", error);
            return api.sendMessage("❌ 𝑮𝒂𝒎𝒆 𝒍𝒐𝒂𝒅𝒊𝒏𝒈 𝒇𝒂𝒊𝒍𝒆𝒅! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.", event.threadID);
        }
    }
    
    return api.sendMessage(getText("invalid_option"), event.threadID);
};
