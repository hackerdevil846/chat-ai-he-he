const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "bestie",
    aliases: ["bestfriend", "bfpair"],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "image",
    shortDescription: {
        en: "𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑦𝑜𝑢𝑟 𝑏𝑒𝑠𝑡𝑓𝑟𝑖𝑒𝑛𝑑 𝑝𝑎𝑖𝑟"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑏𝑒𝑠𝑡𝑓𝑟𝑖𝑒𝑛𝑑 𝑝𝑎𝑖𝑟 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
        en: "{p}bestie [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async function() {
    try {
        const dirMaterial = path.join(__dirname, 'cache', 'canvas');
        const imagePath = path.join(dirMaterial, 'bestu.png');
        
        if (!fs.existsSync(dirMaterial)) {
            fs.mkdirSync(dirMaterial, { recursive: true });
        }
        
        if (!fs.existsSync(imagePath)) {
            const response = await axios({
                method: 'GET',
                url: "https://i.imgur.com/RloX16v.jpg",
                responseType: 'stream'
            });
            
            const writer = fs.createWriteStream(imagePath);
            response.data.pipe(writer);
            
            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        }
    } catch (error) {
        console.error("𝐵𝑒𝑠𝑡𝑖𝑒 𝑜𝑛𝐿𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onStart = async function({ event, api, args }) {
    try {
        const { threadID, messageID, senderID } = event;
        const mention = Object.keys(event.mentions);
        
        if (!mention[0]) {
            return api.sendMessage("✨ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑎 𝑢𝑠𝑒𝑟 𝑡𝑜 𝑝𝑎𝑖𝑟 𝑤𝑖𝑡ℎ!", threadID, messageID);
        }
        
        const one = senderID;
        const two = mention[0];
        
        const makeImage = async ({ one, two }) => {
            const __root = path.join(__dirname, "cache", "canvas");
            
            const circle = async (image) => {
                const img = await jimp.read(image);
                img.circle();
                return await img.getBufferAsync("image/png");
            }
            
            const batgiam_img = await jimp.read(path.join(__root, "bestu.png"));
            const pathImg = path.join(__root, `bestie_${one}_${two}.png`);
            const avatarOne = path.join(__root, `avt_${one}.png`);
            const avatarTwo = path.join(__root, `avt_${two}.png`);
            
            // Download first avatar
            const getAvatarOne = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                responseType: 'arraybuffer'
            });
            fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne.data, 'utf-8'));
            
            // Download second avatar
            const getAvatarTwo = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                responseType: 'arraybuffer'
            });
            fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data, 'utf-8'));
            
            // Create circular avatars and composite onto base image
            const circleOne = await jimp.read(await circle(avatarOne));
            const circleTwo = await jimp.read(await circle(avatarTwo));
            
            batgiam_img.composite(circleOne.resize(191, 191), 93, 111)
                      .composite(circleTwo.resize(190, 190), 434, 107);
            
            const raw = await batgiam_img.getBufferAsync("image/png");
            fs.writeFileSync(pathImg, raw);
            
            // Clean up temporary files
            fs.unlinkSync(avatarOne);
            fs.unlinkSync(avatarTwo);
            
            return pathImg;
        }
        
        const imagePath = await makeImage({ one, two });
        
        await api.sendMessage({
            body: `🌸┋ 𝐵 𝐸 𝑆 𝑇 𝐼 𝐸 ┋🌸\n\n❖︎ 𝑌𝑜𝑢 𝑔𝑢𝑦𝑠 𝑎𝑟𝑒 𝑚𝑎𝑑𝑒 𝑓𝑜𝑟 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟 💖\n\n❖︎ 𝑇ℎ𝑖𝑠 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑏𝑒𝑠𝑡𝑓𝑟𝑖𝑒𝑛𝑑 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 ✨`,
            attachment: fs.createReadStream(imagePath)
        }, threadID, () => {
            fs.unlinkSync(imagePath);
        }, messageID);
        
    } catch (error) {
        console.error("𝐵𝑒𝑠𝑡𝑖𝑒 𝑜𝑛𝑆𝑡𝑎𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑏𝑒𝑠𝑡𝑓𝑟𝑖𝑒𝑛𝑑 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", threadID, messageID);
    }
};
