const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "brother",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "👫 Mention দিয়ে ভাই-বোন (Sibling) image বানাও",
  category: "edit-img",
  usages: "[@mention]",
  cooldowns: 5,
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
      console.log("✅ Brother.js template downloaded successfully");
    }
  } catch (error) {
    console.error("❌ Brother.js Template Loading Error:", error);
  }
};

module.exports.onStart = async function ({ event, api }) {
  const { threadID, messageID, senderID } = event;
  try {
    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
      return api.sendMessage("🔹 Please mention someone to create a sibling pair", threadID, messageID);
    }

    const targetName = event.mentions[mention].replace("@", "");
    const cachePath = path.join(__dirname, "cache", "canvas");
    const imagePath = await makeSiblingImage(senderID, mention, cachePath);

    api.sendMessage({
      body: `👫 Sibling pair created!\n\n✨ You and ${targetName} look awesome together!`,
      mentions: [{ tag: targetName, id: mention }],
      attachment: fs.createReadStream(imagePath)
    }, threadID, () => {
      fs.unlinkSync(imagePath);
    }, messageID);

  } catch (error) {
    console.error("❌ Brother.js Command Error:", error);
    api.sendMessage("❌ Failed to create sibling image. Please try again later.", threadID, messageID);
  }
};

// ========== Helper Functions ==========

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
    console.error("❌ Brother.js Image Creation Error:", error);
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
    console.error("❌ Brother.js Avatar Processing Error:", error);
    throw error;
  }
}
