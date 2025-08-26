const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
    name: "fampair",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "👨‍👩‍👧‍👦 Family Pair Command for Boys",
    category: "💞 LOVE",
    usages: "fampair",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "jimp": ""
    }
};

// Custom download function to replace the problematic global.utils.downloadFile
async function downloadFile(url, filePath) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });
        
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        throw new Error(`Failed to download file: ${error.message}`);
    }
}

module.exports.onLoad = async () => {
    const { existsSync, mkdirSync } = fs;
    const dirMaterial = path.resolve(__dirname, "cache", "canvas");
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    
    const bgPath = path.resolve(dirMaterial, "araa2.jpg");
    if (!existsSync(bgPath)) {
        await downloadFile("https://imgur.com/D35mTwa.jpg", bgPath);
    }
};

async function circle(image) {
    const img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
}

async function makeImage({ one, two, three }) {
    const __root = path.resolve(__dirname, "cache", "canvas");
    const pairingImg = await jimp.read(path.resolve(__root, "araa2.jpg"));
    const pathImg = path.resolve(__root, `araa_${one}_${two}_${three}.png`);
    
    // Download and process avatars
    const avatarPaths = [];
    const users = [one, two, three];
    
    for (let i = 0; i < users.length; i++) {
        const avatarPath = path.resolve(__root, `avt_${users[i]}.png`);
        const avatarUrl = `https://graph.facebook.com/${users[i]}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const avatarData = (await axios.get(avatarUrl, { responseType: 'arraybuffer' })).data;
        
        fs.writeFileSync(avatarPath, Buffer.from(avatarData, 'utf-8'));
        avatarPaths.push(avatarPath);
    }
    
    // Create circular avatars
    const circleOne = await jimp.read(await circle(avatarPaths[0]));
    const circleTwo = await jimp.read(await circle(avatarPaths[1]));
    const circleThree = await jimp.read(await circle(avatarPaths[2]));
    
    // Composite avatars onto background
    pairingImg.composite(circleOne.resize(65, 65), 135, 260)
              .composite(circleTwo.resize(65, 65), 230, 210)
              .composite(circleThree.resize(60, 60), 193, 370);
    
    // Save final image
    const raw = await pairingImg.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, raw);
    
    // Cleanup temporary avatar files
    avatarPaths.forEach(path => fs.existsSync(path) && fs.unlinkSync(path));
    
    return pathImg;
}

module.exports.onStart = async function({ api, event, Users }) {
    try {
        const { threadID, messageID, senderID } = event;
        const tl = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
        const tle = tl[Math.floor(Math.random() * tl.length)];
        
        const info = await api.getUserInfo(senderID);
        const nameSender = info[senderID].name;
        
        const threadInfo = await api.getThreadInfo(threadID);
        const participantIDs = threadInfo.participantIDs.filter(id => id !== senderID);
        
        if (participantIDs.length < 2) {
            return api.sendMessage("👥 | Group e at least 2 jon member thakte hobe ei command use korte!", threadID, messageID);
        }
        
        // Select two random participants
        const firstIndex = Math.floor(Math.random() * participantIDs.length);
        let secondIndex;
        do {
            secondIndex = Math.floor(Math.random() * participantIDs.length);
        } while (secondIndex === firstIndex);
        
        const e = participantIDs[firstIndex];
        const r = participantIDs[secondIndex];
        
        const name1 = (await Users.getData(e)).name;
        const name2 = (await Users.getData(r)).name;
        
        api.sendMessage("🔄 | Family pair image create hocche... ⏳", threadID, messageID);
        
        const imagePath = await makeImage({ one: senderID, two: e, three: r });
        
        return api.sendMessage({ 
            body: `👨‍👩‍👧‍👦 | 𝐅𝐚𝐦𝐢𝐥𝐲 𝐏𝐚𝐢𝐫 𝐑𝐞𝐬𝐮𝐥𝐭\n\n✨ ${nameSender}, tumi successfully ${name1} ar ${name2} er sathe Family Pair hoye gecho!\n💞 Tomader Compatibility: ${tle}`,
            mentions: [
                { tag: nameSender, id: senderID },
                { tag: name1, id: e },
                { tag: name2, id: r }
            ], 
            attachment: fs.createReadStream(imagePath) 
        }, threadID, () => {
            fs.unlinkSync(imagePath);
        }, messageID);
        
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ | Kisu problem hoye geche command execute korte!", event.threadID, event.messageID);
    }
};
