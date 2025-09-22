const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "crush",
    aliases: ["lovematch", "romanticpair"], // ← CHANGED TO UNIQUE ALIASES
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "love",
    shortDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑝𝑎𝑖𝑟 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑟𝑢𝑠ℎ"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑖𝑚𝑎𝑔𝑒 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑦𝑜𝑢 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑟𝑢𝑠ℎ"
    },
    guide: {
      en: "{p}crush [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

module.exports.onLoad = async () => {
    const { existsSync, mkdirSync } = fs;
    const dirMaterial = path.join(__dirname, 'cache', 'canvas');
    const filePath = path.join(dirMaterial, 'crush.png');
    
    if (!existsSync(dirMaterial)) {
        mkdirSync(dirMaterial, { recursive: true });
    }
    
    if (!existsSync(filePath)) {
        try {
            const imageData = await axios.get("https://i.imgur.com/PlVBaM1.jpg", { 
                responseType: 'arraybuffer' 
            });
            await fs.writeFile(filePath, Buffer.from(imageData.data));
        } catch (error) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑐𝑟𝑢𝑠ℎ 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒:", error);
        }
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        const { threadID, messageID, senderID } = event;
        const mention = Object.keys(event.mentions);
        
        if (!mention[0]) {
            return message.reply("💖 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑝𝑎𝑖𝑟!", threadID, messageID);
        }

        const one = senderID;
        const two = mention[0];
        
        // Get user info using global utils
        const userInfo = await global.utils.getUserInfo(two);
        const userName = userInfo[two]?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";

        const makeImage = async ({ one, two }) => {
            const __root = path.join(__dirname, "cache", "canvas");
            const crushImgPath = path.join(__root, "crush.png");
            const resultPath = path.join(__root, `crush_${one}_${two}.png`);
            const avatarOnePath = path.join(__root, `avt_${one}.png`);
            const avatarTwoPath = path.join(__root, `avt_${two}.png`);

            // Download avatars
            const getAvatar = async (uid, avatarPath) => {
                try {
                    const avatarData = await axios.get(
                        `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
                        { responseType: 'arraybuffer' }
                    );
                    await fs.writeFile(avatarPath, Buffer.from(avatarData.data));
                } catch (error) {
                    console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 ${uid}:`, error);
                    throw error;
                }
            };

            await getAvatar(one, avatarOnePath);
            await getAvatar(two, avatarTwoPath);

            // Create circular avatars
            const createCircularAvatar = async (inputPath) => {
                const image = await jimp.read(inputPath);
                const size = Math.min(image.bitmap.width, image.bitmap.height);
                
                return new Promise((resolve) => {
                    image.circle();
                    image.getBuffer(jimp.MIME_PNG, (err, buffer) => {
                        if (err) throw err;
                        resolve(buffer);
                    });
                });
            };

            // Process the main image
            const crushImage = await jimp.read(crushImgPath);
            const circleOneBuffer = await createCircularAvatar(avatarOnePath);
            const circleTwoBuffer = await createCircularAvatar(avatarTwoPath);
            
            const circleOne = await jimp.read(circleOneBuffer);
            const circleTwo = await jimp.read(circleTwoBuffer);

            // Composite the avatars onto the main image
            crushImage.composite(circleOne.resize(191, 191), 93, 111);
            crushImage.composite(circleTwo.resize(190, 190), 434, 107);

            // Save the result
            await new Promise((resolve, reject) => {
                crushImage.write(resultPath, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Clean up temporary files
            await fs.remove(avatarOnePath);
            await fs.remove(avatarTwoPath);

            return resultPath;
        };

        const resultPath = await makeImage({ one, two });
        
        await message.reply({
            body: `💘 𝐿𝑜𝑣𝑒 𝐶𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛 💘\n\n╔═════❖•❁❖═════╗\n\n   🫶 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙 𝑃𝑎𝑖𝑟𝑖𝑛𝑔 🫶\n\n╚═════❖•❁❖═════╝\n\n✨ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑐𝑟𝑢𝑠ℎ 𝑤𝑖𝑡ℎ ${userName}!\n💌 𝐺𝑟𝑎𝑏 𝑡ℎ𝑒𝑚 𝑎𝑛𝑑 𝑚𝑎𝑘𝑒 𝑖𝑡 𝑜𝑓𝑓𝑖𝑐𝑖𝑎𝑙! 💕\n\n🔮 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
            attachment: fs.createReadStream(resultPath)
        }, threadID, async () => {
            try {
                await fs.remove(resultPath);
            } catch (cleanupError) {
                console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑙𝑒𝑎𝑛 𝑢𝑝 𝑡𝑒𝑚𝑝 𝑓𝑖𝑙𝑒:", cleanupError);
            }
        }, messageID);

    } catch (error) {
        console.error("𝐶𝑟𝑢𝑠ℎ 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", event.threadID, event.messageID);
    }
};
