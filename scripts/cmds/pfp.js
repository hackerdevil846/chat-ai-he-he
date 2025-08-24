"use strict";

const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const TMP_DIR = path.join(__dirname, "cache");

const EMOJI = {
  SUCCESS: "✅",
  ERROR: "❌",
  PROCESS: "⏳",
  PROFILE: "👤",
  INFO: "📝",
  WARN: "⚠️"
};

function generateProgressBar(percentage) {
  const blocks = 15;
  const completed = Math.round(blocks * (percentage / 100));
  return `▰`.repeat(completed) + `▱`.repeat(blocks - completed);
}

module.exports.config = {
  name: "profile",
  version: "5.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "User profile dekhai — avatar, join date, last active.",
  category: "info",
  usages: "profile [@mention|reply|uid]",
  cooldowns: 5,
  dependencies: {
    "axios": "latest",
    "fs-extra": "latest",
    "moment-timezone": "latest",
    "canvas": "latest"
  }
};

module.exports.languages = {
  bn: {
    processing: "🔍 Profile data neya hocche...",
    accessData: "📡 User data access kortesi...",
    loadingImage: "🖼️ Profile image load kortesi...",
    success: "👤 Profile pawa gelo!",
    noAvatar: "⚠️ Avatar pawa jaay nai",
    invalidUser: "⚠️ User pawa jaay nai",
    error: "⚠️ System e kono error hoyeche",
    tryAgain: "💡 Poroborti te abar cheshta korun"
  }
};

module.exports.onLoad = async function () {
  try {
    await fs.ensureDir(TMP_DIR);
  } catch {}
};

module.exports.run = async function ({ api, event, args, Users, models }) {
  const lang = module.exports.languages.bn;
  const { threadID, senderID, mentions, messageReply } = event;

  const send = async (body, attachment = null) => {
    return api.sendMessage({ body, attachment }, threadID);
  };

  await fs.ensureDir(TMP_DIR).catch(() => {});
  let processingMsg;

  try {
    processingMsg = await send(`${EMOJI.PROCESS} ${lang.processing}\n${generateProgressBar(30)} 30%`);
    await send(`${EMOJI.PROCESS} ${lang.accessData}\n${generateProgressBar(60)} 60%`);

    let targetID = senderID;
    if (mentions && Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (messageReply?.senderID) {
      targetID = messageReply.senderID;
    } else if (args?.length > 0) {
      const maybeId = args[0].replace(/[^0-9]/g, "");
      if (maybeId.length >= 5) targetID = maybeId;
    }

    const userInfo = await api.getUserInfo(targetID);
    if (!userInfo || !userInfo[targetID]) {
      if (processingMsg?.messageID) await api.unsendMessage(processingMsg.messageID).catch(() => {});
      return send(`${EMOJI.ERROR} ${lang.invalidUser}`);
    }
    const user = userInfo[targetID];

    const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    let avatarBuffer;
    try {
      const resp = await axios.get(avatarUrl, { responseType: "arraybuffer", timeout: 15000 });
      avatarBuffer = Buffer.from(resp.data, "binary");
    } catch {
      avatarBuffer = null;
    }

    let userData = {};
    try {
      if (Users?.getData) {
        userData = (await Users.getData(targetID)) || {};
      } else if (models?.Users?.findOne) {
        const dbUser = await models.Users.findOne({ where: { userID: targetID } });
        userData = dbUser?.dataValues || {};
      }
    } catch {}

    const joinDate = userData?.createdAt ? moment(userData.createdAt).format("DD/MM/YYYY") : "N/A";
    const lastActive = userData?.lastUpdated ? moment(userData.lastUpdated).fromNow() : "N/A";

    const genderMap = { 1: "👨 Male", 2: "👩 Female", 3: "⚧️ Custom" };
    const genderText = userData?.gender ? (genderMap[userData.gender] || userData.gender) : "❓ Unknown";

    const followers = user?.follow || userData?.followers || "N/A";
    const relationship = user?.relationship_status || userData?.relationship_status || "❓ Unknown";

    const time = moment().tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");

    const info = [];
    info.push(`${EMOJI.PROFILE} *${user.name}* er Profile`);
    info.push(`——————————————`);
    info.push(`${EMOJI.INFO} Name: ${user.name}`);
    info.push(`🆔 UID: ${targetID}`);
    info.push(`📅 Join Date: ${joinDate}`);
    info.push(`🕒 Last Active: ${lastActive}`);
    info.push(`——————————————`);
    info.push(`🔎 Additional Info:`);
    info.push(`• Gender: ${genderText}`);
    info.push(`• Followers: ${followers}`);
    info.push(`• Relationship: ${relationship}`);
    info.push(`——————————————`);
    info.push(`⏱️ Retrieved: ${time}`);
    const finalMessage = info.join("\n");

    if (processingMsg?.messageID) await api.unsendMessage(processingMsg.messageID).catch(() => {});

    if (avatarBuffer) {
      const avatar = await loadImage(avatarBuffer);
      const canvas = createCanvas(800, 450);
      const ctx = canvas.getContext("2d");

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 800, 450);
      gradient.addColorStop(0, "#1e1e2e");
      gradient.addColorStop(1, "#6c2bd9");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Shadow glow circle for avatar
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(180, 225, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Avatar circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(180, 225, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 80, 125, 200, 200);
      ctx.restore();

      // Text with shadow
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 6;
      ctx.font = "bold 32px Sans";
      ctx.fillText(user.name, 320, 160);
      ctx.font = "22px Sans";
      ctx.fillText(`UID: ${targetID}`, 320, 200);
      ctx.fillText(`Gender: ${genderText}`, 320, 240);
      ctx.fillText(`Followers: ${followers}`, 320, 280);
      ctx.fillText(`Relationship: ${relationship}`, 320, 320);
      ctx.fillText(`Last Active: ${lastActive}`, 320, 360);

      const cardPath = path.join(TMP_DIR, `card_${targetID}_${Date.now()}.png`);
      fs.writeFileSync(cardPath, canvas.toBuffer("image/png"));

      return send(`${EMOJI.SUCCESS} ${lang.success}\n\n${finalMessage}`, fs.createReadStream(cardPath));
    } else {
      return send(`${EMOJI.WARN} ${lang.noAvatar}\n\n${finalMessage}`);
    }

  } catch (err) {
    console.error("Profile command error:", err);
    if (processingMsg?.messageID) await api.unsendMessage(processingMsg.messageID).catch(() => {});
    return send(`${EMOJI.ERROR} ${lang.error}\n🔧 ${err.message || ""}\n\n${lang.tryAgain}`);
  }
};
