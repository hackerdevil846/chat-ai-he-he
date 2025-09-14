const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "marriedv2",
        aliases: ["marry", "wedding"],
        version: "3.1.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑖𝑚𝑎𝑔𝑒",
        shortDescription: {
            en: "💍 𝐶𝑟𝑒𝑎𝑡𝑒 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑐𝑒𝑟𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑒 𝑤𝑖𝑡ℎ 𝑎𝑛𝑜𝑡ℎ𝑒𝑟 𝑢𝑠𝑒𝑟"
        },
        guide: {
            en: "{p}marriedv2 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
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
            const dirMaterial = path.join(__dirname, "cache", "canvas");
            const filePath = path.join(dirMaterial, "marriedv02.png");

            if (!fs.existsSync(dirMaterial)) {
                fs.mkdirSync(dirMaterial, { recursive: true });
            }

            if (!fs.existsSync(filePath)) {
                const imageData = await axios.get("https://i.ibb.co/mc9KNm1/1619885987-21-pibig-info-p-anime-romantika-svadba-anime-krasivo-24.jpg", {
                    responseType: "arraybuffer"
                });
                fs.writeFileSync(filePath, Buffer.from(imageData.data));
            }
        } catch (error) {
            console.error("𝑀𝑎𝑟𝑟𝑖𝑒𝑑 𝑂𝑛𝐿𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        }
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

            const { senderID } = event;
            const mention = Object.keys(event.mentions);

            if (!mention[0]) {
                return message.reply("💍 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑎𝑛𝑜𝑡ℎ𝑒𝑟 𝑢𝑠𝑒𝑟 𝑡𝑜 𝑚𝑎𝑟𝑟𝑦!");
            }

            const one = senderID;
            const two = mention[0];
            
            // Circular crop function
            async function circle(image) {
                const img = await jimp.read(image);
                img.circle();
                return await img.getBufferAsync("image/png");
            }

            const __root = path.join(__dirname, "cache", "canvas");

            let married_img = await jimp.read(path.join(__root, "marriedv02.png"));
            let pathImg = path.join(__root, `married_${one}_${two}.png`);
            let avatarOne = path.join(__root, `avt_${one}.png`);
            let avatarTwo = path.join(__root, `avt_${two}.png`);

            // Get Avatars
            let getAvatarOne = (await axios.get(
                `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                { responseType: "arraybuffer" }
            )).data;
            fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, "utf-8"));

            let getAvatarTwo = (await axios.get(
                `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                { responseType: "arraybuffer" }
            )).data;
            fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, "utf-8"));

            // Make circular & composite
            let circleOne = await jimp.read(await circle(avatarOne));
            let circleTwo = await jimp.read(await circle(avatarTwo));
            married_img
                .composite(circleOne.resize(100, 100), 55, 48)
                .composite(circleTwo.resize(100, 100), 190, 40);

            let raw = await married_img.getBufferAsync("image/png");

            fs.writeFileSync(pathImg, raw);
            fs.unlinkSync(avatarOne);
            fs.unlinkSync(avatarTwo);

            await message.reply({
                body: "💕 | 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠! 𝑀𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑐𝑒𝑟𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑!\n━━━━━━━━━━━━━━\n𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
                attachment: fs.createReadStream(pathImg)
            });

            fs.unlinkSync(pathImg);
            
        } catch (error) {
            console.error("𝑀𝑎𝑟𝑟𝑖𝑒𝑑 𝑂𝑛𝑆𝑡𝑎𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒");
        }
    }
};
