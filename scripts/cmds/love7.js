const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports.config = {
  name: "love7",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Create a romantic love image with two users",
  category: "edit-img",
  usages: "[tag]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "jimp": ""
  },
  envConfig: {}
};

module.exports.languages = {
  "en": {
    "MISSING_TAG": "📍 Please tag 1 person to create a love image!",
    "CREATING": "💖 Creating your romantic love image...",
    "ERROR": "❌ Error generating the image. Please try again later."
  },
  "bn": {
    "MISSING_TAG": "📍 একজনকে tag করে তোমার প্রেমের ছবি বানাও!",
    "CREATING": "💖 তোমার romantic love image বানানো hocche...",
    "ERROR": "❌ ইমেজ বানাতে সমস্যা হয়েছে। পরে আবার চেষ্টা করো।"
  }
};

/**
 * Runs when the module is loaded by the bot (server start / reload).
 * Pre-downloads base template image into ./cache to avoid repeated downloads.
 */
module.exports.onLoad = async function () {
  try {
    const cacheDir = path.join(__dirname, "cache");
    const baseImagePath = path.join(cacheDir, "love_template.png");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Download base image if not exists (keep the same Google Drive link)
    if (!fs.existsSync(baseImagePath)) {
      const response = await axios({
        method: 'get',
        url: 'https://drive.google.com/uc?export=download&id=1m6ymMdBr4U-PccDqEQknH9QUuPsGLk8x',
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      fs.writeFileSync(baseImagePath, response.data);
      console.log("[love7] Base template downloaded to cache.");
    } else {
      console.log("[love7] Base template already exists in cache.");
    }
  } catch (error) {
    console.error("[love7] Error during onLoad:", error);
  }
};

/**
 * Main command handler when user calls the command.
 * Usage: reply or tag one person -> bot generates love image between sender and mentioned user.
 */
module.exports.onStart = async function ({ api, event, args, permssion }) {
  const { threadID, messageID, senderID } = event;
  const mentions = event.mentions || {};

  try {
    // If no mentions, ask user to tag one person
    if (Object.keys(mentions).length === 0) {
      return api.sendMessage(this.languages.en.MISSING_TAG, threadID, messageID);
    }

    // Choose the first mentioned user that is not the sender (if possible)
    let mentionId = null;
    for (const id of Object.keys(mentions)) {
      if (id !== senderID) {
        mentionId = id;
        break;
      }
    }
    // if all mentions are sender (rare), just take first key
    if (!mentionId) mentionId = Object.keys(mentions)[0];

    // Clean mention name (remove leading @ if present)
    const mentionNameRaw = mentions[mentionId] || "";
    const mentionName = mentionNameRaw.replace(/@/g, '');

    // Inform user
    api.sendMessage(this.languages.en.CREATING, threadID, messageID);

    // Generate image
    const imagePath = await this.generateLoveImage(senderID, mentionId);

    // Prepare message with mention and attachment
    const msg = {
      body: `💌 @${mentionName} — love you so much! 🥰`,
      mentions: [
        {
          tag: mentionName,
          id: mentionId
        }
      ],
      attachment: fs.createReadStream(imagePath)
    };

    // Send and then cleanup generated file
    api.sendMessage(msg, threadID, async (err, info) => {
      try {
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      } catch (e) {
        console.error("[love7] Cleanup error:", e);
      }
      if (err) console.error("[love7] sendMessage error:", err);
    }, messageID);

  } catch (error) {
    console.error("[love7] Command error:", error);
    api.sendMessage(this.languages.en.ERROR, threadID, messageID);
  }
};

/**
 * Generate the final love image by compositing two circular avatars onto the template.
 * Returns the path to the generated image.
 */
module.exports.generateLoveImage = async function (user1ID, user2ID) {
  const cacheDir = path.join(__dirname, 'cache');
  const baseImagePath = path.join(cacheDir, 'love_template.png');

  if (!fs.existsSync(baseImagePath)) {
    throw new Error("Base template missing. Make sure onLoad has run and template is downloaded.");
  }

  const baseImage = await Jimp.read(baseImagePath);

  const avatar1 = await this.processAvatar(user1ID);
  const avatar2 = await this.processAvatar(user2ID);

  avatar1.resize(200, 200);
  avatar2.resize(200, 200);

  baseImage
    .composite(avatar1, 300, 300)
    .composite(avatar2, 600, 300);

  const outputPath = path.join(cacheDir, `love7_${user1ID}_${user2ID}_${Date.now()}.png`);
  await baseImage.writeAsync(outputPath);

  return outputPath;
};

/**
 * Download and process Facebook avatar for given userId.
 */
module.exports.processAvatar = async function (userId) {
  const avatarOptions = [
    `https://graph.facebook.com/${userId}/picture?width=512&height=512`,
    `https://graph.facebook.com/${userId}/picture?type=large`,
    `https://graph.facebook.com/${userId}/picture`,
    `https://graph.facebook.com/v12.0/${userId}/picture`
  ];

  let avatarBuffer = null;

  for (const url of avatarOptions) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
      });

      if (response && response.data) {
        avatarBuffer = Buffer.from(response.data);
        break;
      }
    } catch (error) {
      continue;
    }
  }

  if (!avatarBuffer) {
    throw new Error(`Failed to download avatar for user ${userId}`);
  }

  const avatar = await Jimp.read(avatarBuffer);
  const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);
  const cropped = avatar.crop(0, 0, size, size);

  const borderSize = 5;
  const bordered = new Jimp(size + borderSize * 2, size + borderSize * 2, 0xFFFFFFFF);
  bordered.composite(cropped, borderSize, borderSize);

  return bordered
    .crop(0, 0, size + borderSize * 2, size + borderSize * 2)
    .circle();
};
