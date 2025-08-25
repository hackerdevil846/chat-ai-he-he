// customrankcard.js
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { uploadImgbb } = global.utils || {};

const checkUrlRegex = /https?:\/\/.*\.(?:png|jpg|jpeg|gif)/gi;
const regExColor = /#([0-9a-f]{6})|rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)|rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+\.?\d*)\)/gi;

module.exports.config = {
  name: "customrankcard",
  aliases: ["crc", "customrank", "rankcard"],
  version: "1.12",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: {
    vi: "Thiết kế thẻ rank theo ý bạn",
    en: "✨ Design your own stylish rank card with custom colors and backgrounds"
  },
  category: "rank",
  usages: "[option] [value]",
  cooldowns: 5,
  dependencies: {
    "canvas": "*",
    "fs-extra": "*"
  },
  guide: {
    en: {
      body:
        "🎨 customrankcard [maincolor | subcolor | linecolor | expbarcolor | progresscolor | alphasubcolor | textcolor | namecolor | expcolor | rankcolor | levelcolor | reset] <value>\n\n" +
        "🌈 Available options:\n" +
        "  • maincolor | background <value> - Main background (gradient/image)\n" +
        "  • subcolor <value> - Sub background\n" +
        "  • linecolor <value> - Line between backgrounds\n" +
        "  • expbarcolor <value> - Experience bar color\n" +
        "  • progresscolor <value> - Current progress color\n" +
        "  • alphasubcolor <value> - Sub background opacity (0-1)\n" +
        "  • textcolor <value> - Text color\n" +
        "  • namecolor <value> - Name color\n" +
        "  • expcolor <value> - EXP text color\n" +
        "  • rankcolor <value> - Rank text color\n" +
        "  • levelcolor <value> - Level text color\n\n" +
        "💡 Value can be: hex code, rgb, rgba, gradient (multiple colors separated by space), or image URL\n" +
        "📸 You can also send an image as attachment\n\n" +
        "🔄 customrankcard reset - Reset all settings to default\n\n" +
        "🎯 Examples:\n" +
        "  • customrankcard maincolor #fff000\n" +
        "  • customrankcard maincolor #0093E9 #80D0C7\n" +
        "  • customrankcard subcolor rgba(255,136,86,0.4)\n" +
        "  • customrankcard reset",
      attachment: {
        // Keep the original asset paths (unchanged)
        [`${__dirname}/assets/guide/customrankcard_1.jpg`]: "https://i.ibb.co/BZ2Qgs1/image.png",
        [`${__dirname}/assets/guide/customrankcard_2.png`]: "https://i.ibb.co/wy1ZHHL/image.png"
      }
    }
  }
};

module.exports.languages = {
  en: {
    invalidImage: "❌ Invalid image URL. Please provide a direct image link (jpg, jpeg, png, gif). You can upload to imgbb.com and use the direct link.",
    invalidAttachment: "❌ Please attach a valid image file",
    invalidColor: "❌ Invalid color code. Please use hex (#RRGGBB) or rgba format",
    notSupportImage: "❌ Image URLs are not supported for \"%1\" option",
    success: "✅ Your custom rank card settings have been saved!\n\n🎉 Preview:",
    reseted: "🔄 All rank card settings have been reset to default",
    invalidAlpha: "❌ Please choose an opacity value between 0 and 1"
  }
};

module.exports.onStart = function () {
  // Nothing needed here for now — placeholder to satisfy loader.
};

module.exports.onLoad = function () {
  // Ensure cache directory exists for previews
  const cacheDir = path.join(__dirname, 'cache');
  try {
    fs.ensureDirSync(cacheDir);
  } catch (e) {
    // ignore
  }
};

module.exports.run = async function ({ api, event, args, models, Users, Threads, Currencies, permssion }) {
  const threadID = event.threadID;
  const senderID = event.senderID;
  const lang = this.languages.en;

  const reply = (msg, attach) => {
    if (attach) {
      return api.sendMessage({ body: msg, attachment: attach }, threadID, (err) => {
        if (err) api.sendMessage("❌ Failed to send preview: " + err.message, threadID);
      });
    } else return api.sendMessage(msg, threadID);
  };

  if (!args || !args[0]) {
    return reply("⚠️ Usage: customrankcard [option] [value]\nType `customrankcard` for more details.");
  }

  let customRankCard = (await Threads.getData(threadID, "data.customRankCard")) || {};
  const key = args[0].toLowerCase();
  let value = args.slice(1).join(" ").trim();

  const supportImage = ["maincolor", "background", "bg", "subcolor", "expbarcolor", "progresscolor", "linecolor"];
  const notSupportImage = ["textcolor", "namecolor", "expcolor", "rankcolor", "levelcolor", "lvcolor"];

  try {
    // Collect attachments if any (photo, animated_image)
    const attachmentsReply = event.messageReply?.attachments || [];
    const attachments = [
      ...(event.attachments || []).filter(a => ["photo", "animated_image"].includes(a.type)),
      ...attachmentsReply.filter(a => ["photo", "animated_image"].includes(a.type))
    ];

    if (value === 'reset' || key === 'reset') {
      await Threads.setData(threadID, { customRankCard: {} }, "data");
      return reply("🔄 All rank card settings have been reset to default");
    }

    if ([...notSupportImage, ...supportImage].includes(key)) {
      // Handle image URL input
      if (value.match(/^https?:\/\//)) {
        const matchUrl = value.match(checkUrlRegex);
        if (!matchUrl) return reply(lang.invalidImage);
        if (!uploadImgbb) {
          // If uploadImgbb is not available, accept the direct image as-is
          value = matchUrl[0];
        } else {
          const infoFile = await uploadImgbb(matchUrl[0], 'url');
          value = infoFile.image.url;
        }
      } else if (attachments.length > 0) {
        if (!["photo", "animated_image"].includes(attachments[0].type))
          return reply(lang.invalidAttachment);
        const url = attachments[0].url;
        if (!uploadImgbb) {
          value = url;
        } else {
          const infoFile = await uploadImgbb(url, 'url');
          value = infoFile.image.url;
        }
      } else {
        // Color(s)
        const colors = value.match(regExColor);
        if (!colors) return reply(lang.invalidColor);
        value = colors.length === 1 ? colors[0] : colors;
      }

      if (value !== "reset" && notSupportImage.includes(key) && String(value).startsWith?.("http")) {
        return reply(lang.notSupportImage.replace("%1", key));
      }

      // Map keys to internal storage
      switch (key) {
        case "maincolor":
        case "background":
        case "bg":
          value === "reset" ? delete customRankCard.main_color : customRankCard.main_color = value;
          break;
        case "subcolor":
          value === "reset" ? delete customRankCard.sub_color : customRankCard.sub_color = value;
          break;
        case "linecolor":
          value === "reset" ? delete customRankCard.line_color : customRankCard.line_color = value;
          break;
        case "progresscolor":
          value === "reset" ? delete customRankCard.exp_color : customRankCard.exp_color = value;
          break;
        case "expbarcolor":
          value === "reset" ? delete customRankCard.expNextLevel_color : customRankCard.expNextLevel_color = value;
          break;
        case "textcolor":
          value === "reset" ? delete customRankCard.text_color : customRankCard.text_color = value;
          break;
        case "namecolor":
          value === "reset" ? delete customRankCard.name_color : customRankCard.name_color = value;
          break;
        case "rankcolor":
          value === "reset" ? delete customRankCard.rank_color : customRankCard.rank_color = value;
          break;
        case "levelcolor":
        case "lvcolor":
          value === "reset" ? delete customRankCard.level_color : customRankCard.level_color = value;
          break;
        case "expcolor":
          value === "reset" ? delete customRankCard.exp_text_color : customRankCard.exp_text_color = value;
          break;
      }

      await Threads.setData(threadID, { customRankCard }, "data");
      // Generate preview
      const userData = await Users.getData(senderID) || {};
      const rankCardPreviewBuffer = await generateRankCardPreview(userData, customRankCard);

      // Save to temp file and send
      const cacheDir = path.join(__dirname, 'cache');
      fs.ensureDirSync(cacheDir);
      const tmpPath = path.join(cacheDir, `crc_preview_${senderID}_${Date.now()}.png`);
      fs.writeFileSync(tmpPath, rankCardPreviewBuffer);

      await reply(lang.success, fs.createReadStream(tmpPath));
      // remove temp file after a short delay to ensure send completed
      setTimeout(() => {
        try { fs.unlinkSync(tmpPath); } catch (e) { /* ignore */ }
      }, 15000);

    } else if (["alphasubcolor", "alphasubcard"].includes(key)) {
      const alphaValue = parseFloat(value);
      if (isNaN(alphaValue) || alphaValue < 0 || alphaValue > 1)
        return reply(lang.invalidAlpha);
      customRankCard.alpha_subcard = alphaValue;
      await Threads.setData(threadID, { customRankCard }, "data");

      const userData = await Users.getData(senderID) || {};
      const rankCardPreviewBuffer = await generateRankCardPreview(userData, customRankCard);

      const cacheDir = path.join(__dirname, 'cache');
      fs.ensureDirSync(cacheDir);
      const tmpPath = path.join(cacheDir, `crc_preview_${senderID}_${Date.now()}.png`);
      fs.writeFileSync(tmpPath, rankCardPreviewBuffer);

      await reply(lang.success, fs.createReadStream(tmpPath));
      setTimeout(() => {
        try { fs.unlinkSync(tmpPath); } catch (e) { /* ignore */ }
      }, 15000);

    } else if (key === "reset") {
      await Threads.setData(threadID, { customRankCard: {} }, "data");
      return reply(lang.reseted);
    } else {
      return reply("⚠️ Unknown option. Use `customrankcard` to see available options.");
    }
  } catch (err) {
    console.error(err);
    return reply("❌ An error occurred: " + (err.message || err));
  }
};

// Helper to create a preview image (returns Buffer)
async function generateRankCardPreview(userData = {}, customRankCard = {}) {
  const canvas = createCanvas(800, 300);
  const ctx = canvas.getContext('2d');

  // Background - main color / gradient / image
  if (customRankCard.main_color) {
    if (Array.isArray(customRankCard.main_color)) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      customRankCard.main_color.forEach((color, i) => {
        gradient.addColorStop(i / (customRankCard.main_color.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (String(customRankCard.main_color).startsWith('http')) {
      try {
        const img = await loadImage(customRankCard.main_color);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } catch (e) {
        ctx.fillStyle = '#36393f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } else {
      ctx.fillStyle = customRankCard.main_color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    ctx.fillStyle = '#36393f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Sub background with alpha
  const alpha = typeof customRankCard.alpha_subcard === 'number' ? customRankCard.alpha_subcard : 0.5;
  const subColor = customRankCard.sub_color ? adjustAlpha(customRankCard.sub_color, alpha) : `rgba(0, 0, 0, ${alpha})`;
  ctx.fillStyle = subColor;
  ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Line color
  if (customRankCard.line_color) {
    ctx.strokeStyle = customRankCard.line_color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 60);
    ctx.lineTo(canvas.width - 20, 60);
    ctx.stroke();
  }

  // User name
  ctx.fillStyle = customRankCard.name_color || '#ffffff';
  ctx.font = 'bold 28px Arial';
  const displayName = userData.name || 'User';
  ctx.fillText(displayName, 150, 80);

  // Level and rank
  ctx.fillStyle = customRankCard.level_color || '#f1c40f';
  ctx.font = '20px Arial';
  ctx.fillText('Level: 25', 150, 120);

  ctx.fillStyle = customRankCard.rank_color || '#e74c3c';
  ctx.fillText('Rank: #15', 300, 120);

  // Experience bar background
  ctx.fillStyle = customRankCard.expNextLevel_color || '#2c3e50';
  ctx.fillRect(150, 160, 500, 20);

  // Experience progress (example 70%)
  ctx.fillStyle = customRankCard.exp_color || '#3498db';
  ctx.fillRect(150, 160, 350, 20); // 70% filled

  // Experience text
  ctx.fillStyle = customRankCard.exp_text_color || '#ecf0f1';
  ctx.font = '16px Arial';
  ctx.fillText('3500/5000 XP', 150, 200);

  // Avatar placeholder (circle)
  ctx.save();
  ctx.beginPath();
  ctx.arc(80, 150, 60, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  // If user has avatarUrl in userData use it
  if (userData.avatar) {
    try {
      const av = await loadImage(userData.avatar);
      ctx.drawImage(av, 20, 90, 120, 120);
    } catch (e) {
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(20, 90, 120, 120);
    }
  } else {
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(20, 90, 120, 120);
  }
  ctx.restore();

  return canvas.toBuffer();
}

// Helper function to adjust alpha for colors
function adjustAlpha(color, alpha) {
  try {
    if (String(color).startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else if (String(color).startsWith('rgb')) {
      const match = color.match(/(\d+),\s*(\d+),\s*(\d+)(,\s*[\d.]+)?/);
      if (match) {
        return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
      }
    }
  } catch (e) {
    // fallback
  }
  return color;
}
