const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
    name: "brother",
    aliases: ["sibling", "sister"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "👫 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑠𝑖𝑏𝑙𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑠𝑖𝑏𝑙𝑖𝑛𝑔 𝑝𝑎𝑖𝑟 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
        en: "{p}brother [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async function () {
    try {
        const canvasPath = path.join(__dirname, "cache", "canvas");
        if (!fs.existsSync(canvasPath)) {
            fs.mkdirSync(canvasPath, { recursive: true });
        }

        const templatePath = path.join(canvasPath, "sibling_template.jpg");
        if (!fs.existsSync(templatePath)) {
            const { data } = await axios.get("https://i.imgur.com/n2FGJFe.jpg", {
                responseType: "arraybuffer"
            });
            fs.writeFileSync(templatePath, Buffer.from(data, "binary"));
            console.log("✅ 𝐵𝑟𝑜𝑡ℎ𝑒𝑟.𝑗𝑠 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
        }
    } catch (error) {
        console.error("❌ 𝐵𝑟𝑜𝑡ℎ𝑒𝑟.𝑗𝑠 𝑇𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 𝐸𝑟𝑟𝑜𝑟:", error);
        
        // 𝐹𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑡𝑜 𝑙𝑜𝑐𝑎𝑙 𝑓𝑖𝑙𝑒 𝑖𝑓 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑠
        const canvasPath = path.join(__dirname, "cache", "canvas");
        const templatePath = path.join(canvasPath, "sibling_template.jpg");
        
        // 𝐶ℎ𝑒𝑐𝑘 𝑖𝑓 𝑤𝑒 ℎ𝑎𝑣𝑒 𝑎 𝑙𝑜𝑐𝑎𝑙 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘
        const localTemplate = path.join(__dirname, "sibling_template.jpg");
        if (fs.existsSync(localTemplate) && !fs.existsSync(templatePath)) {
            fs.copySync(localTemplate, templatePath);
            console.log("✅ 𝑈𝑠𝑖𝑛𝑔 𝑙𝑜𝑐𝑎𝑙 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑎𝑠 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘");
        }
    }
};

module.exports.onStart = async function ({ event, api, message }) {
    const { threadID, messageID, senderID } = event;
    try {
        const mention = Object.keys(event.mentions)[0];
        if (!mention) {
            return message.reply("🔹 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑠𝑖𝑏𝑙𝑖𝑛𝑔 𝑝𝑎𝑖𝑟");
        }

        const targetName = event.mentions[mention].replace("@", "");
        const cachePath = path.join(__dirname, "cache", "canvas");
        const imagePath = await makeSiblingImage(senderID, mention, cachePath);

        await message.reply({
            body: `👫 𝑆𝑖𝑏𝑙𝑖𝑛𝑔 𝑝𝑎𝑖𝑟 𝑐𝑟𝑒𝑎𝑡𝑒𝑑!\n\n✨ 𝑌𝑜𝑢 𝑎𝑛𝑑 ${targetName} 𝑙𝑜𝑜𝑘 𝑎𝑤𝑒𝑠𝑜𝑚𝑒 𝑡𝑜𝑔𝑒𝑡ℎ𝑒𝑟!`,
            mentions: [{ tag: targetName, id: mention }],
            attachment: fs.createReadStream(imagePath)
        });

        fs.unlinkSync(imagePath);

    } catch (error) {
        console.error("❌ 𝐵𝑟𝑜𝑡ℎ𝑒𝑟.𝑗𝑠 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑠𝑖𝑏𝑙𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};

// ========== 𝐻𝑒𝑙𝑝𝑒𝑟 𝐹𝑢𝑛𝑐𝑡𝑖𝑜𝑛𝑠 ==========

async function makeSiblingImage(user1, user2, cacheDir) {
    const templatePath = path.join(cacheDir, "sibling_template.jpg");
    const outputPath = path.join(cacheDir, `siblings_${user1}_${user2}_${Date.now()}.png`);

    try {
        const [avatar1, avatar2] = await Promise.all([
            processAvatar(user1, cacheDir),
            processAvatar(user2, cacheDir)
        ]);

        const template = await jimp.read(templatePath);

        template.composite(avatar1.resize(191, 191), 93, 111)
            .composite(avatar2.resize(190, 190), 434, 107);

        await template.writeAsync(outputPath);
        return outputPath;
    } catch (error) {
        console.error("❌ 𝐵𝑟𝑜𝑡ℎ𝑒𝑟.𝑗𝑠 𝐼𝑚𝑎𝑔𝑒 𝐶𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
        throw error;
    }
}

async function processAvatar(userID, cacheDir) {
    const avatarPath = path.join(cacheDir, `avt_${userID}_${Date.now()}.png`);
    try {
        const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const { data } = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(avatarPath, Buffer.from(data, "binary"));

        const avatar = await jimp.read(avatarPath);
        avatar.circle();

        fs.unlinkSync(avatarPath);
        return avatar;
    } catch (error) {
        console.error("❌ 𝐵𝑟𝑜𝑡ℎ𝑒𝑟.𝑗𝑠 𝐴𝑣𝑎𝑡𝑎𝑟 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝐸𝑟𝑟𝑜𝑟:", error);
        throw error;
    }
}
