const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "marriedv4",
        aliases: ["couplev4", "weddingv4"], // Changed to unique aliases
        version: "3.1.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "image",
        shortDescription: {
            en: "💍 𝐶𝑟𝑒𝑎𝑡𝑒 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑟 𝑐𝑜𝑢𝑝𝑙𝑒𝑠"
        },
        longDescription: {
            en: "💑 𝐶𝑟𝑒𝑎𝑡𝑒 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑟 𝑐𝑜𝑢𝑝𝑙𝑒𝑠"
        },
        guide: {
            en: "{p}marriedv4 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            const { threadID, messageID, senderID } = event;
            const mention = Object.keys(event.mentions);

            if (!mention[0]) {
                return message.reply("💍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒!");
            }

            // Helper function to create circular image
            const circleImage = async (imagePath) => {
                try {
                    const image = await jimp.read(imagePath);
                    image.circle();
                    return await image.getBufferAsync(jimp.MIME_PNG);
                } catch (error) {
                    console.error("𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑖𝑚𝑎𝑔𝑒:", error);
                    return null;
                }
            };

            const one = senderID;
            const two = mention[0];
            const __root = path.join(__dirname, "cache", "canvas");
            const marriedImgPath = path.join(__root, `married_${one}_${two}.png`);
            
            // Ensure cache directory exists
            if (!fs.existsSync(__root)) {
                fs.mkdirSync(__root, { recursive: true });
            }

            // Download background image if not exists
            const bgPath = path.join(__root, 'marriedv4.png');
            if (!fs.existsSync(bgPath)) {
                const { data } = await axios.get("https://i.ibb.co/9ZZCSzR/ba6abadae46b5bdaa29cf6a64d762874.jpg", {
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync(bgPath, Buffer.from(data, 'binary'));
            }

            // Download avatars
            const avatarOnePath = path.join(__root, `avt_${one}.png`);
            const avatarTwoPath = path.join(__root, `avt_${two}.png`);
            
            const avatarOneUrl = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const avatarTwoUrl = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            
            const [avatarOneRes, avatarTwoRes] = await Promise.all([
                axios.get(avatarOneUrl, { responseType: 'arraybuffer' }),
                axios.get(avatarTwoUrl, { responseType: 'arraybuffer' })
            ]);
            
            fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneRes.data, 'binary'));
            fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoRes.data, 'binary'));
            
            // Create circular avatars
            const circleOne = await circleImage(avatarOnePath);
            const circleTwo = await circleImage(avatarTwoPath);
            
            if (!circleOne || !circleTwo) {
                throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑎𝑣𝑎𝑡𝑎𝑟𝑠");
            }
            
            // Composite image
            const marriedImg = await jimp.read(bgPath);
            const circleOneImg = await jimp.read(circleOne);
            const circleTwoImg = await jimp.read(circleTwo);
            
            circleOneImg.resize(130, 130);
            circleTwoImg.resize(130, 130);
            
            marriedImg.composite(circleOneImg, 200, 70);
            marriedImg.composite(circleTwoImg, 350, 150);
            
            // Save final image
            const buffer = await marriedImg.getBufferAsync(jimp.MIME_PNG);
            fs.writeFileSync(marriedImgPath, buffer);
            
            // Cleanup temp files
            [avatarOnePath, avatarTwoPath].forEach(path => {
                if (fs.existsSync(path)) fs.unlinkSync(path);
            });
            
            // Get user names
            const userOneInfo = await usersData.get(one);
            const userTwoInfo = await usersData.get(two);
            const userNameOne = userOneInfo.name || "User 1";
            const userNameTwo = userTwoInfo.name || "User 2";
            
            await message.reply({
                body: `💑 ${userNameOne} 𝑎𝑛𝑑 ${userNameTwo}'𝑠 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒!\n━━━━━━━━━━━━━━━\n💍 𝐷𝑒𝑣𝑒𝑙𝑜𝑝𝑒𝑟: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
                attachment: fs.createReadStream(marriedImgPath)
            });

            // Cleanup final image
            if (fs.existsSync(marriedImgPath)) {
                fs.unlinkSync(marriedImgPath);
            }
            
        } catch (error) {
            console.error("𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑛𝑔 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!");
        }
    }
};
