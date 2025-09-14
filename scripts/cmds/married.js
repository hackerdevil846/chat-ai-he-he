const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "married",
        aliases: ["marry", "wedding"],
        version: "3.1.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑒𝑑𝑖𝑡-𝑖𝑚𝑎𝑔𝑒",
        shortDescription: {
            en: "💍 𝐶𝑟𝑒𝑎𝑡𝑒 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑎𝑛𝑛𝑜𝑢𝑛𝑐𝑒𝑚𝑒𝑛𝑡 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
        },
        guide: {
            en: "{p}married [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: function() {
        const dirMaterial = __dirname + `/cache/canvas/`;
        if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    },

    onStart: async function({ message, event }) {
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

            const { threadID, messageID, senderID } = event;
            const mention = Object.keys(event.mentions);

            if (!mention[0]) {
                return message.reply("💍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑚𝑎𝑟𝑟𝑦!");
            }

            const one = senderID;
            const two = mention[0];
            
            // Circle crop function
            async function circle(image) {
                image = await jimp.read(image);
                image.circle();
                return await image.getBufferAsync("image/png");
            }

            const __root = path.resolve(__dirname, "cache", "canvas");
            const bgPath = path.join(__root, "married.png");

            // Check if background exists
            if (!fs.existsSync(bgPath)) {
                throw new Error("𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑖𝑚𝑎𝑔𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑠𝑢𝑟𝑒 𝑚𝑎𝑟𝑟𝑖𝑒𝑑.𝑝𝑛𝑔 𝑒𝑥𝑖𝑠𝑡𝑠 𝑖𝑛 𝑐𝑎𝑐ℎ𝑒/𝑐𝑎𝑛𝑣𝑎𝑠");
            }

            let pathImg = path.join(__root, `married_${one}_${two}.png`);
            let avatarOne = path.join(__root, `avt_${one}.png`);
            let avatarTwo = path.join(__root, `avt_${two}.png`);

            // Get Avatars
            let [avatar1, avatar2] = await Promise.all([
                axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
                axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })
            ]);

            fs.writeFileSync(avatarOne, Buffer.from(avatar1.data));
            fs.writeFileSync(avatarTwo, Buffer.from(avatar2.data));

            // Process images
            const [bg, circleOne, circleTwo] = await Promise.all([
                jimp.read(bgPath),
                jimp.read(await circle(avatarOne)),
                jimp.read(await circle(avatarTwo))
            ]);

            // Composite on background
            bg.composite(circleOne.resize(170, 170), 1520, 210)
              .composite(circleTwo.resize(170, 170), 980, 300);

            await bg.writeAsync(pathImg);

            // Cleanup temp avatars
            fs.unlinkSync(avatarOne);
            fs.unlinkSync(avatarTwo);

            await message.reply({
                body: `💖 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒! 💑\n━━━━━━━━━━━━━━━━\n💐 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
                attachment: fs.createReadStream(pathImg)
            });

            // Cleanup final image
            fs.unlinkSync(pathImg);
            
        } catch (error) {
            console.error("𝑀𝑎𝑟𝑟𝑖𝑒𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒: ${error.message}`);
        }
    }
};
