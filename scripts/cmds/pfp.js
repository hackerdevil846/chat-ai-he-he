"use strict";

const fs = require("fs-extra");
const path = require("path");
const Canvas = require("canvas");
const axios = require("axios");
const moment = require("moment-timezone");

const TMP_DIR = path.join(__dirname, "cache");

module.exports.config = {
  name: "pfp",
  version: "3.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Ultra-stylish, colorful profile card generate kore",
  commandCategory: "random-img",
  usages: "[@mention|UID]",
  cooldowns: 5,
  dependencies: {
    "canvas": "latest",
    "fs-extra": "latest",
    "axios": "latest",
    "moment-timezone": "latest"
  }
};

module.exports.languages = {
  bn: {
    processing: "🔍 Profile data neya hocche...",
    error: "⚠️ Kichu vul hoyeche, abar cheshta korun"
  }
};

module.exports.onLoad = async function() {
  await fs.ensureDir(TMP_DIR);
};

// Generate random gradient for background
function randomGradient(ctx, width, height) {
  const colors = [
    ["#ff416c", "#ff4b2b"],
    ["#6a11cb", "#2575fc"],
    ["#00c6ff", "#0072ff"],
    ["#f7971e", "#ffd200"],
    ["#ff9966", "#ff5e62"]
  ];
  const pick = colors[Math.floor(Math.random() * colors.length)];
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, pick[0]);
  gradient.addColorStop(1, pick[1]);
  return gradient;
}

// Draw glowing text
function drawGlowText(ctx, text, x, y, fontSize = 40, color = "#fff") {
  ctx.save();
  ctx.font = `${fontSize}px Arial Black`;
  ctx.shadowColor = color;
  ctx.shadowBlur = 25;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

module.exports.run = async function({ api, event, args, Users }) {
  const { senderID, threadID, mentions, messageReply } = event;
  const lang = module.exports.languages.bn;

  const send = async (body, attachment = null) => {
    return api.sendMessage({ body, attachment }, threadID);
  };

  let targetID = senderID;
  if (mentions && Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
  else if (messageReply && messageReply.senderID) targetID = messageReply.senderID;
  else if (args && args.length > 0 && args[0].match(/\d+/)) targetID = args[0].replace(/[^0-9]/g, "");

  try {
    const userInfo = await api.getUserInfo(targetID);
    if (!userInfo || !userInfo[targetID]) return send(lang.error);
    const user = userInfo[targetID];

    // Download avatar
    const avatarURL = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatarPath = path.join(TMP_DIR, `avatar_${targetID}.jpg`);
    const resp = await axios.get(avatarURL, { responseType: "arraybuffer" });
    await fs.writeFile(avatarPath, Buffer.from(resp.data, "binary"));

    // User Data
    let userData = {};
    try { userData = (Users && Users.getData) ? await Users.getData(targetID) : {}; } catch(e){}

    const joinDate = userData && userData.createdAt ? moment(userData.createdAt).format("DD/MM/YYYY") : "N/A";
    const lastActive = userData && (userData.lastUpdated || userData.updatedAt) ? moment(userData.lastUpdated || userData.updatedAt).fromNow() : "N/A";
    const genderMap = {1: "👨 Male", 2: "👩 Female", 3: "⚧️ Custom"};
    const genderText = (userData && userData.gender) ? (genderMap[userData.gender] || userData.gender) : "❓ Unknown";
    const followers = (user && user.follow) ? user.follow : (userData && (userData.followers || userData.follow)) || "N/A";
    const relationship = (user && user.relationship_status) ? user.relationship_status : (userData && userData.relationship_status) || "❓ Unknown";

    // Canvas
    const canvas = Canvas.createCanvas(700, 350);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = randomGradient(ctx, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Avatar with glow
    const avatarImg = await Canvas.loadImage(avatarPath);
    const avatarX = 50, avatarY = 70, avatarSize = 200;

    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2 + 10, 0, Math.PI*2);
    ctx.fillStyle = "#ffffff22";
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI*2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    // Username with glow
    drawGlowText(ctx, user.name, 270, 100, 36, "#ffcc00");

    // Other info
    ctx.font = "22px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`UID: ${targetID}`, 270, 140);
    ctx.fillText(`Gender: ${genderText}`, 270, 170);
    ctx.fillText(`Followers: ${followers}`, 270, 200);
    ctx.fillText(`Relationship: ${relationship}`, 270, 230);
    ctx.fillText(`Last Active: ${lastActive}`, 270, 260);

    // Border panel
    ctx.strokeStyle = "#ffffff66";
    ctx.lineWidth = 2;
    ctx.strokeRect(260, 80, 420, 200);

    // Sparkle effect
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random()})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 700, Math.random() * 350, Math.random() * 3 + 1, 0, Math.PI*2);
      ctx.fill();
    }

    const outputPath = path.join(TMP_DIR, `pfp_card_${targetID}.png`);
    await fs.writeFile(outputPath, canvas.toBuffer());

    return send(`🌟 Ultra-stylish Profile Card for ${user.name}`, fs.createReadStream(outputPath));

  } catch (err) {
    console.error(err);
    return send(lang.error + `\n${err.message}`);
  }
};
