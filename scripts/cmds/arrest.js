const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
    name: "arrest",
    aliases: ["jail", "handcuff"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝐴𝑟𝑟𝑒𝑠𝑡 𝑎 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒𝑖𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎𝑛 𝑎𝑟𝑟𝑒𝑠𝑡 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    guide: {
        en: "{p}arrest [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async function() {
    const cachePath = path.join(__dirname, "cache");
    const canvasPath = path.join(cachePath, "canvas");
    const templatePath = path.join(canvasPath, "arrest_template.png");
    
    try {
        if (!fs.existsSync(cachePath)) {
            fs.mkdirSync(cachePath, { recursive: true });
        }
        if (!fs.existsSync(canvasPath)) {
            fs.mkdirSync(canvasPath, { recursive: true });
        }
        
        if (!fs.existsSync(templatePath)) {
            console.log("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑎𝑟𝑟𝑒𝑠𝑡 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒...");
            const { data } = await axios.get("https://i.imgur.com/ep1gG3r.png", {
                responseType: "arraybuffer",
                timeout: 30000
            });
            fs.writeFileSync(templatePath, Buffer.from(data, "binary"));
            console.log("𝑇𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
        }
    } catch (err) {
        console.error("𝐴𝑟𝑟𝑒𝑠𝑡 𝑇𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝐼𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑎𝑡𝑖𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", err);
    }
};

module.exports.onStart = async function({ message, event, api }) {
    const { threadID, messageID, senderID } = event;
    
    try {
        const mention = Object.keys(event.mentions)[0];
        if (!mention) {
            return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑎𝑟𝑟𝑒𝑠𝑡!", threadID, messageID);
        }
        
        const targetName = event.mentions[mention];
        const canvasPath = path.join(__dirname, "cache", "canvas");
        const imagePath = await this.makeArrestImage(senderID, mention, canvasPath);
        
        await message.reply({
            body: `🚨 𝒀𝒐𝒖'𝒓𝒆 𝒖𝒏𝒅𝒆𝒓 𝒂𝒓𝒓𝒆𝒔𝒕 ${targetName}! 🚨`,
            mentions: [{ tag: targetName, id: mention }],
            attachment: fs.createReadStream(imagePath)
        }, threadID, messageID);

        // Clean up after sending
        setTimeout(() => {
            try { 
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (cleanupErr) {
                console.warn("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑙𝑒𝑎𝑛 𝑢𝑝 𝑖𝑚𝑎𝑔𝑒:", cleanupErr);
            }
        }, 5000);

    } catch (error) {
        console.error("𝐴𝑟𝑟𝑒𝑠𝑡 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎𝑟𝑟𝑒𝑠𝑡 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", threadID, messageID);
    }
};

module.exports.makeArrestImage = async function(user1, user2, cacheDir) {
    const templatePath = path.join(cacheDir, "arrest_template.png");
    const outputPath = path.join(cacheDir, `arrest_${user1}_${user2}_${Date.now()}.png`);
    
    try {
        const [avatar1, avatar2, template] = await Promise.all([
            this.getAvatar(user1),
            this.getAvatar(user2),
            jimp.read(templatePath)
        ]);
        
        template.resize(500, 500);
        avatar1.resize(100, 100);
        avatar2.resize(100, 100);
        
        template.composite(avatar1, 375, 9);
        template.composite(avatar2, 160, 92);
        
        await template.writeAsync(outputPath);
        return outputPath;
    } catch (error) {
        console.error("𝐼𝑚𝑎𝑔𝑒 𝐶𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
        throw error;
    }
};

module.exports.getAvatar = async function(userID) {
    try {
        const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const { data } = await axios.get(url, {
            responseType: "arraybuffer",
            timeout: 15000
        });
        
        const avatar = await jimp.read(data);
        return avatar.circle();
    } catch (error) {
        console.error("𝐴𝑣𝑎𝑡𝑎𝑟 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 𝐸𝑟𝑟𝑜𝑟:", error);
        // 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑏𝑙𝑎𝑛𝑘 𝑎𝑣𝑎𝑡𝑎𝑟 𝑎𝑠 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘
        return new jimp(100, 100, 0xFFFFFFFF).circle();
    }
};
