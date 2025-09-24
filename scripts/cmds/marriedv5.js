const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "marriedv5",
        aliases: ["weddingv5", "couplev5"],
        version: "3.1.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑖𝑚𝑎𝑔𝑒",
        shortDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑐𝑒𝑟𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
        },
        guide: {
            en: "{p}marriedv5 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        try {
            const dirMaterial = path.join(__dirname, 'cache', 'canvas');
            const pathFile = path.join(dirMaterial, 'marriedv5.png');
            
            if (!fs.existsSync(dirMaterial)) {
                fs.mkdirSync(dirMaterial, { recursive: true });
            }
            
            if (!fs.existsSync(pathFile)) {
                const { data } = await axios.get("https://i.ibb.co/mhxtgwm/49be174dafdc259030f70b1c57fa1c13.jpg", {
                    responseType: 'arraybuffer'
                });
                await fs.writeFile(pathFile, Buffer.from(data, 'binary'));
            }
        } catch (error) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑏𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒:", error);
        }
    },

    onStart: async function({ message, event, api }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("path");
                require("jimp");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑝𝑎𝑡ℎ, 𝑎𝑛𝑑 𝑗𝑖𝑚𝑝.");
            }

            const { senderID } = event;
            const mention = Object.keys(event.mentions);
            
            if (!mention[0]) {
                return message.reply("💍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑚𝑎𝑟𝑟𝑦!");
            }

            const one = senderID;
            const two = mention[0];
            
            const __root = path.join(__dirname, "cache", "canvas");
            const married_img = await jimp.read(path.join(__root, "marriedv5.png"));
            const pathImg = path.join(__root, `married_${one}_${two}.png`);
            const avatarOne = path.join(__root, `avt_${one}.png`);
            const avatarTwo = path.join(__root, `avt_${two}.png`);
            
            // Helper functions
            const circle = async (image) => {
                const img = await jimp.read(image);
                img.circle();
                return await img.getBufferAsync("image/png");
            };
            
            const getAvatar = async (uid) => {
                const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                const { data } = await axios.get(url, { responseType: 'arraybuffer' });
                return Buffer.from(data, 'utf-8');
            };
            
            await fs.writeFile(avatarOne, await getAvatar(one));
            await fs.writeFile(avatarTwo, await getAvatar(two));
            
            // Create final image
            const circleOne = await jimp.read(await circle(avatarOne));
            const circleTwo = await jimp.read(await circle(avatarTwo));
            
            married_img.composite(circleOne.resize(130, 130), 300, 150)
                      .composite(circleTwo.resize(130, 130), 170, 230);
            
            const buffer = await married_img.getBufferAsync("image/png");
            await fs.writeFile(pathImg, buffer);
            
            // Send result
            const userInfo = await api.getUserInfo([one, two]);
            const name1 = userInfo[one]?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
            const name2 = userInfo[two]?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
            
            const msg = one === two 
                ? `🤔 ${name1}, 𝑎𝑟𝑒 𝑦𝑜𝑢 𝑚𝑎𝑟𝑟𝑦𝑖𝑛𝑔 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓? 💍` 
                : `💒 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠! ${name1} 𝑎𝑛𝑑 ${name2} 𝑎𝑟𝑒 𝑛𝑜𝑤 𝑚𝑎𝑟𝑟𝑖𝑒𝑑! 💖\n━━━━━━━━━━━━━━━\n💕 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;
            
            await message.reply({
                body: msg,
                attachment: fs.createReadStream(pathImg)
            });
            
            // Cleanup
            [avatarOne, avatarTwo, pathImg].forEach(file => {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            });

        } catch (error) {
            console.error("𝑀𝑎𝑟𝑟𝑖𝑒𝑑 𝑣5 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒.");
        }
    }
};
