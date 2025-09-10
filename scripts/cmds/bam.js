const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
    name: "bam",
    aliases: ["slap", "hit"],
    version: "2.2.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝑆𝑙𝑎𝑝 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑓𝑢𝑛"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑓𝑢𝑛𝑛𝑦 𝑠𝑙𝑎𝑝 𝑝𝑖𝑐 𝑤𝑖𝑡ℎ 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
        en: "{p}bam @𝑡𝑎𝑔"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "jimp": "",
        "path": ""
    }
};

module.exports.onStart = async function ({ event, message, usersData, api }) {
    try {
        const { senderID, mentions } = event;
        const mention = Object.keys(mentions);
        
        if (!mention[0]) {
            return message.reply("𝑇𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 👊");
        }

        const one = senderID;
        const two = mention[0];
        
        // Use the specified local path
        const imagePath = path.resolve(__dirname, '../scripts/cmds/cache/canvas/slap.png');
        
        // Check if local slap image exists
        if (!fs.existsSync(imagePath)) {
            return message.reply("❌ 𝑆𝑙𝑎𝑝 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔!");
        }

        // Create output directory if it doesn't exist
        const outputDir = path.resolve(__dirname, '../scripts/cmds/cache/canvas');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const pathImg = path.resolve(outputDir, `slap_${one}_${two}.png`);
        
        // Helper function to create circular avatars
        async function circleAvatar(userId) {
            try {
                const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
                const avatar = await jimp.read(Buffer.from(response.data));
                avatar.circle();
                return avatar;
            } catch (error) {
                console.error("𝐴𝑣𝑎𝑡𝑎𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
                const defaultAvatar = await jimp.create(150, 150, 0x808080ff);
                defaultAvatar.circle();
                return defaultAvatar;
            }
        }

        // Create the slap image
        const slap_image = await jimp.read(imagePath);
        const circleOne = await circleAvatar(one);
        const circleTwo = await circleAvatar(two);
        
        slap_image.composite(circleOne.resize(150, 150), 745, 25)
                 .composite(circleTwo.resize(140, 140), 180, 40);
        
        await slap_image.writeAsync(pathImg);
        
        // Short English messages array
        const shortMessages = [
            "𝐵𝑎𝑚! 𝑆𝑙𝑎𝑝𝑝𝑒𝑑! 👊",
            "𝑃𝑜𝑤! 𝑅𝑖𝑔ℎ𝑡 𝑖𝑛 𝑡ℎ𝑒 𝑓𝑎𝑐𝑒! 😂",
            "𝑆𝑙𝑎𝑝 𝑡𝑖𝑚𝑒! 👋",
            "𝑂𝑜𝑓! 𝑇ℎ𝑎𝑡 ℎ𝑎𝑑 𝑡𝑜 ℎ𝑢𝑟𝑡! 💥",
            "𝑊ℎ𝑎𝑐𝑘! 𝑆𝑙𝑎𝑝𝑝𝑒𝑑 𝑎𝑤𝑎𝑦! 🖐️",
            "𝑆𝑙𝑎𝑝 𝑝𝑎𝑟𝑡𝑦! 🤚",
            "𝐸𝑝𝑖𝑐 𝑠𝑙𝑎𝑝 𝑚𝑜𝑚𝑒𝑛𝑡! 🇺🇸"
        ];
        
        const randomMessage = shortMessages[Math.floor(Math.random() * shortMessages.length)];
        
        await message.reply({
            body: randomMessage,
            attachment: fs.createReadStream(pathImg)
        });
        
        // Clean up after 5 seconds
        setTimeout(() => {
            if (fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg);
            }
        }, 5000);
        
    } catch (error) {
        console.error("𝑆𝑙𝑎𝑝 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝑆𝑙𝑎𝑝 𝑓𝑎𝑖𝑙𝑒𝑑!");
    }
};
