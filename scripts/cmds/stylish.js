const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const fetch = require('node-fetch');

module.exports.config = {
  name: "stylish", // command name (call with: {prefix}stylish)
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Create a cool stylish banner from text (optional avatar). ✨",
  commandCategory: "random-img",
  usages: "[text] | reply_with_image OR [image_url]",
  cooldowns: 5,
  dependencies: {
    "canvas": "latest",
    "discord-image-generation": "latest",
    "node-fetch": "latest",
    "fs-extra": "latest"
  },
  envConfig: {
    // if you want to force using discord-image-generation effects later, set USE_DIG: true
    USE_DIG: false
  }
};

module.exports.languages = {
  "en": {
    "no_text": "❗ Please provide text for the banner. Usage: %prefix%stylish <your text> (or reply to an image) ✍️",
    "generating": "🎨 Generating your stylish banner — hang tight! 🪄",
    "done": "✅ Done — here's your stylish banner!",
    "error": "⚠️ Something went wrong while generating the image."
  },
  "bn": {
    "no_text": "❗ টেক্সট দিন। ব্যবহার: %prefix%stylish <text> (বা ছবিতে reply) ✍️",
    "generating": "🎨 বানাচ্ছি... 🪄",
    "done": "✅ হয়ে গেল — ছবি নিচে!",
    "error": "⚠️ ছবি তৈরিতে সমস্যা হয়েছে।"
  }
};

module.exports.onLoad = function () {
  // Ensure cache dir exists
  const cacheDir = path.join(__dirname, 'cache', 'stylish');
  if (!fs.existsSync(cacheDir)) fs.mkdirpSync(cacheDir);
};

async function fetchImageBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * drawBanner
 * - Creates a stylish banner using canvas.
 * - text: main text (string)
 * - avatarBuffer: optional Buffer of avatar image (or null)
 * - options: { width, height }
 * returns Buffer (PNG)
 */
async function drawBanner(text, avatarBuffer = null, options = {}) {
  const width = options.width || 1200;
  const height = options.height || 480;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background: soft angled gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#0f172a'); // slate-900
  grad.addColorStop(0.45, '#0ea5e9'); // sky-400
  grad.addColorStop(1, '#7c3aed'); // violet-600
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle overlay texture (semi-transparent stripes)
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  for (let i = -height; i < width; i += 40) {
    ctx.fillRect(i, 0, 20, height);
  }

  // Glow / blurred rounded rectangle (backdrop)
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  roundRect(ctx, 40, 40, width - 80, height - 80, 24);
  ctx.fill();
  ctx.restore();

  // If avatar provided, draw a circular avatar on left
  const avatarSize = 320;
  const avatarX = 84;
  const avatarY = (height - avatarSize) / 2;
  if (avatarBuffer) {
    try {
      const avatarImg = await loadImage(avatarBuffer);
      // circle clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 4, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fill();
      ctx.clip();
      ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();

      // ring
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 8, 0, Math.PI * 2);
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.stroke();
    } catch (err) {
      // ignore avatar draw errors
    }
  }

  // Main text (big, wrapped if needed)
  ctx.save();
  // Drop shadow
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 6;
  ctx.shadowBlur = 18;

  // Choose font - do not require custom font files so it's portable
  let fontSize = 72;
  ctx.font = `bold ${fontSize}px Sans`;
  const maxTextWidth = avatarBuffer ? width - avatarSize - 220 : width - 160;

  // Auto reduce font size until it fits into max width (simple loop)
  while (ctx.measureText(text).width > maxTextWidth && fontSize > 28) {
    fontSize -= 4;
    ctx.font = `bold ${fontSize}px Sans`;
  }

  // Gradient for text
  const tGrad = ctx.createLinearGradient(0, 0, maxTextWidth, 0);
  tGrad.addColorStop(0, '#ffffff');
  tGrad.addColorStop(1, '#ffd700'); // gold-ish
  ctx.fillStyle = tGrad;

  const tx = avatarBuffer ? avatarX + avatarSize + 48 : 96;
  const ty = height / 2 + fontSize / 3;
  ctx.fillText(text, tx, ty);

  ctx.restore();

  // Footer credit
  ctx.save();
  ctx.font = '16px Sans';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  const credit = `𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 • GoatBot`;
  ctx.fillText(credit, width - ctx.measureText(credit).width - 40, height - 28);
  ctx.restore();

  return canvas.toBuffer('image/png');
}

// small helper: rounded rectangle path
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

module.exports.run = async function ({ api, event, args, Threads, Users, Currencies, handleReply, handleReaction, models }) {
  try {
    const lang = (this.languages && this.languages.en) ? this.languages.en : module.exports.languages.en;
    const text = args && args.length ? args.join(' ') : (event.messageReply && event.messageReply.body ? event.messageReply.body : null);
    if (!text) {
      const msg = lang.no_text.replace('%prefix%', (global.config && global.config.PREFIX) ? global.config.PREFIX : '');
      return api.sendMessage(msg, event.threadID, event.messageID);
    }

    // Notify user
    await api.sendMessage(lang.generating + " ⏳", event.threadID);

    // Determine avatar source:
    // 1) If user replied to a message that has attachments and first is image -> use that
    // 2) Else if message includes an image URL as first arg -> use that
    // 3) Else try to fetch sender's avatar via event.senderID (best-effort)
    let avatarBuffer = null;

    try {
      // 1) reply attachment
      if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length) {
        const att = event.messageReply.attachments.find(a => a.type && a.type.startsWith('image')) || event.messageReply.attachments[0];
        if (att && att.url) avatarBuffer = await fetchImageBuffer(att.url);
      }

      // 2) first arg might be image url (if provided and args length > 0)
      if (!avatarBuffer && args && args.length) {
        const maybeUrl = args[0];
        if (maybeUrl && (maybeUrl.startsWith('http://') || maybeUrl.startsWith('https://')) && (maybeUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) || maybeUrl.includes('googleusercontent') || maybeUrl.includes('fbcdn'))) {
          try {
            avatarBuffer = await fetchImageBuffer(maybeUrl);
            // remove that URL from text (so banner text doesn't include it)
            // (only if it was included explicitly as the first arg)
            if (avatarBuffer) args.shift();
          } catch (e) {
            avatarBuffer = null;
          }
        }
      }

      // 3) best-effort: try to get user's avatar via Users module if available
      if (!avatarBuffer) {
        try {
          // Many GoatBot setups store user data in Users module with method getData
          if (Users && typeof Users.getData === 'function') {
            const userData = await Users.getData(event.senderID) || {};
            if (userData && userData.avatar) {
              avatarBuffer = await fetchImageBuffer(userData.avatar);
            }
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore avatar fetch errors
      avatarBuffer = null;
    }

    // Draw banner
    const bannerBuffer = await drawBanner(text, avatarBuffer, { width: 1200, height: 480 });

    // Save to cache (unique filename)
    const cacheDir = path.join(__dirname, 'cache', 'stylish');
    if (!fs.existsSync(cacheDir)) fs.mkdirpSync(cacheDir);
    const filePath = path.join(cacheDir, `stylish_${Date.now()}.png`);
    await fs.writeFile(filePath, bannerBuffer);

    // Final message with emoji
    const messageBody = `✨ Result ready! • ${text}\n\n${this.languages.en.done}`;

    // send with attachment and cleanup after send
    return api.sendMessage({
      body: messageBody,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, (err, info) => {
      // delete cached file after send (best-effort)
      try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) { }
      if (err) {
        return api.sendMessage(this.languages.en.error + "\n" + err.message, event.threadID);
      }
    }, event.messageID);

  } catch (error) {
    console.error("stylish command error:", error);
    return api.sendMessage((this.languages && this.languages.en && this.languages.en.error) ? this.languages.en.error : "Error", event.threadID, event.messageID);
  }
};
