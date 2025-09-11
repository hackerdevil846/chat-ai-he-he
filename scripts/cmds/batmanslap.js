const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp');

// Define the toBI function for bold italic text
const toBI = (text) => {
  const map = {
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆',
    f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
    k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐',
    p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
    u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚',
    z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫',
    E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰',
    J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵',
    O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺',
    T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿',
    Y: '𝒀', Z: '𝒁', 
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
};

module.exports.config = {
    name: "batmanslap",
    aliases: ["batman", "slap"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: toBI("🦇 𝐵𝑎𝑡𝑠𝑙𝑎𝑝 𝑚𝑒𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑜𝑟")
    },
    longDescription: {
        en: toBI("𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝐵𝑎𝑡𝑚𝑎𝑛 𝑠𝑙𝑎𝑝𝑝𝑖𝑛𝑔 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟")
    },
    guide: {
        en: toBI("{p}batslap [𝑡𝑎𝑔]")
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "jimp": "",
        "path": ""
    }
};

module.exports.onStart = async function ({ message, event, args }) {
    try {
        // Check dependencies
        if (!axios || !fs || !jimp || !path) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        const { threadID, messageID, senderID, mentions } = event;

        if (!mentions || Object.keys(mentions).length === 0) {
            return message.reply(toBI("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒!"));
        }

        const mentionID = Object.keys(mentions)[0];
        const tagName = mentions[mentionID].replace("@", "");
        const one = senderID;
        const two = mentionID;

        // Create cache directory
        const cacheDir = path.join(__dirname, 'cache', 'batslap');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // Use the local template file
        const templatePath = path.join(__dirname, 'cache', 'canvas', 'batmanslap.jpg');
        
        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            return message.reply(toBI("❌ 𝐵𝑎𝑡𝑚𝑎𝑛 𝑠𝑙𝑎𝑝 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑎𝑘𝑒 𝑠𝑢𝑟𝑒 𝑡ℎ𝑒 𝑓𝑖𝑙𝑒 𝑒𝑥𝑖𝑠𝑡𝑠"));
        }

        // Circle function
        async function circle(imagePath) {
            const image = await jimp.read(imagePath);
            image.circle();
            return await image.getBufferAsync("image/png");
        }

        // Make the image
        const pathImg = path.join(cacheDir, `batslap_${one}_${two}.png`);
        const avatarOnePath = path.join(cacheDir, `avt_${one}.png`);
        const avatarTwoPath = path.join(cacheDir, `avt_${two}.png`);

        try {
            // Download avatars
            const avatarOneBuffer = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512`, { 
                responseType: 'arraybuffer' 
            })).data;
            fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneBuffer));

            const avatarTwoBuffer = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512`, { 
                responseType: 'arraybuffer' 
            })).data;
            fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoBuffer));

            // Make circular avatars
            const circleOneBuffer = await circle(avatarOnePath);
            const circleTwoBuffer = await circle(avatarTwoPath);

            // Load template and avatars
            const template = await jimp.read(templatePath);
            const avatarOne = await jimp.read(circleOneBuffer);
            const avatarTwo = await jimp.read(circleTwoBuffer);

            // Composite avatars onto template - adjusted coordinates
            template
                .composite(avatarOne.resize(160, 160), 370, 70)   // Batman's face position
                .composite(avatarTwo.resize(230, 230), 140, 150); // Person being slapped position

            // Save final image
            const finalBuffer = await template.getBufferAsync("image/png");
            fs.writeFileSync(pathImg, finalBuffer);

            // Send the result
            return message.reply({
                body: toBI(`🦇 𝑆ℎ𝑢𝑡 𝑢𝑝, 𝑏𝑎𝑙! @${tagName}`),
                mentions: [{
                    tag: `@${tagName}`,
                    id: mentionID
                }],
                attachment: fs.createReadStream(pathImg)
            }, async () => {
                // Cleanup files
                try {
                    if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath);
                    if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath);
                    if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
                } catch (cleanupError) {
                    console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
                }
            });

        } catch (error) {
            console.error("𝐼𝑚𝑎𝑔𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
            // Cleanup on error
            try {
                if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath);
                if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath);
                if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
            } catch (cleanupError) {
                console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
            }
            return message.reply(toBI("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑏𝑎𝑡𝑠𝑙𝑎𝑝 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛."));
        }

    } catch (error) {
        console.error("𝐵𝑎𝑡𝑠𝑙𝑎𝑝 𝑒𝑟𝑟𝑜𝑟:", error);
        return message.reply(toBI("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."));
    }
};
