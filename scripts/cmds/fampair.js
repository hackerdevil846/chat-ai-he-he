const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
    name: "fampair",
    aliases: ["familypair", "fpair"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑙𝑜𝑣𝑒",
    shortDescription: {
        en: "👨‍👩‍👧‍👦 𝐹𝑎𝑚𝑖𝑙𝑦 𝑃𝑎𝑖𝑟 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑜𝑟 𝐵𝑜𝑦𝑠"
    },
    longDescription: {
        en: "👨‍👩‍👧‍👦 𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑓𝑎𝑚𝑖𝑙𝑦 𝑝𝑎𝑖𝑟 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠"
    },
    guide: {
        en: "{p}fampair"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "jimp": ""
    }
};

// Custom download function with retry logic
async function downloadFile(url, filePath, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'stream',
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            
            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            if (attempt === maxRetries) {
                throw new Error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑖𝑙𝑒 𝑎𝑓𝑡𝑒𝑟 ${maxRetries} 𝑎𝑡𝑡𝑒𝑚𝑝𝑡𝑠: ${error.message}`);
            }
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        }
    }
}

module.exports.onLoad = async () => {
    const dirMaterial = path.resolve(__dirname, "cache", "canvas");
    
    if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
    }
    
    const bgPath = path.resolve(dirMaterial, "araa2.jpg");
    if (!fs.existsSync(bgPath)) {
        try {
            await downloadFile("https://imgur.com/D35mTwa.jpg", bgPath);
        } catch (error) {
            console.log("𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑖𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑤𝑖𝑙𝑙 𝑢𝑠𝑒 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑑𝑢𝑟𝑖𝑛𝑔 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑜𝑛");
        }
    }
};

async function circle(image) {
    const img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
}

async function makeImage({ one, two, three }) {
    const __root = path.resolve(__dirname, "cache", "canvas");
    let pairingImg;
    
    // Try to load background image, create fallback if not available
    const bgPath = path.resolve(__root, "araa2.jpg");
    try {
        if (fs.existsSync(bgPath)) {
            pairingImg = await jimp.read(bgPath);
        } else {
            // Create a simple fallback background
            pairingImg = new jimp(400, 600, '#f0f0f0');
        }
    } catch (error) {
        // Create fallback background if image is corrupted
        pairingImg = new jimp(400, 600, '#f0f0f0');
    }
    
    const pathImg = path.resolve(__root, `araa_${one}_${two}_${three}.png`);
    
    // Download and process avatars with retry logic
    const avatarPaths = [];
    const users = [one, two, three];
    
    for (let i = 0; i < users.length; i++) {
        const avatarPath = path.resolve(__root, `avt_${users[i]}.png`);
        const avatarUrl = `https://graph.facebook.com/${users[i]}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        
        try {
            const avatarData = (await axios.get(avatarUrl, { 
                responseType: 'arraybuffer',
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            })).data;
            
            fs.writeFileSync(avatarPath, Buffer.from(avatarData, 'utf-8'));
            avatarPaths.push(avatarPath);
        } catch (error) {
            // Create a fallback avatar if download fails
            const fallbackAvatar = new jimp(512, 512, '#cccccc');
            await fallbackAvatar.writeAsync(avatarPath);
            avatarPaths.push(avatarPath);
        }
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
            return api.sendMessage("👥 | 𝐺𝑟𝑜𝑢𝑝 𝑒 𝑎𝑡 𝑙𝑒𝑎𝑠𝑡 2 𝑗𝑜𝑛 𝑚𝑒𝑚𝑏𝑒𝑟 𝑡ℎ𝑎𝑘𝑡𝑒 ℎ𝑜𝑏𝑒 𝑒𝑖 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑢𝑠𝑒 𝑘𝑜𝑟𝑡𝑒!", threadID, messageID);
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
        
        api.sendMessage("🔄 | 𝐹𝑎𝑚𝑖𝑙𝑦 𝑝𝑎𝑖𝑟 𝑖𝑚𝑎𝑔𝑒 𝑐𝑟𝑒𝑎𝑡𝑒 ℎ𝑜𝑐𝑐ℎ𝑒... ⏳", threadID, messageID);
        
        const imagePath = await makeImage({ one: senderID, two: e, three: r });
        
        return api.sendMessage({ 
            body: `👨‍👩‍👧‍👦 | 𝐹𝑎𝑚𝑖𝑙𝑦 𝑃𝑎𝑖𝑟 𝑅𝑒𝑠𝑢𝑙𝑡\n\n✨ ${nameSender}, 𝑡𝑢𝑚𝑖 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 ${name1} 𝑎𝑟 ${name2} 𝑒𝑟 𝑠𝑎𝑡ℎ𝑒 𝐹𝑎𝑚𝑖𝑙𝑦 𝑃𝑎𝑖𝑟 ℎ𝑜𝑦𝑒 𝑔𝑒𝑐ℎ𝑜!\n💞 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝐶𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦: ${tle}`,
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
        api.sendMessage("❌ | 𝐾𝑖𝑠𝑢 𝑝𝑟𝑜𝑏𝑙𝑒𝑚 ℎ𝑜𝑦𝑒 𝑔𝑒𝑐ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑥𝑒𝑐𝑢𝑡𝑒 𝑘𝑜𝑟𝑡𝑒!", event.threadID, event.messageID);
    }
};
