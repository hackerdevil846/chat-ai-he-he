const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
  name: "mia",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Create a custom image with text",
  commandCategory: "edit-img",
  usages: "[text]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "canvas": ""
  },
  envConfig: {}
};

module.exports.languages = {
  "en": {
    "no_text": "Please enter the content for the board comment ✍️",
    "error": "Failed to generate the image. Please try again later. ❌",
    "done": "Here you go — made with love ❤️"
  },
  "bn": {
    "no_text": "Board-e lekha din, bhai/sis ✍️",
    "error": "Chobi toyri korte parini. Poroborti te abar try korun. ❌",
    "done": "Niche apnar chobi — bhalobashay toyri ❤️"
  }
};

/**
 * onLoad runs when module loads — ensure cache dir exists
 */
module.exports.onLoad = function() {
  try {
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  } catch (e) {
    console.error('mia onLoad error:', e);
  }
};

/**
 * Helper: wrap text into lines that fit maxWidth
 * Returns array of lines.
 */
module.exports.wrapText = function(ctx, text, maxWidth) {
  // synchronous operation — returns promise to keep compatibility with previous code
  return new Promise((resolve) => {
    if (!text) return resolve([]);
    const words = text.split(' ');
    const lines = [];
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line ? line + ' ' + words[n] : words[n];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && line) {
        lines.push(line);
        line = words[n];
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);
    resolve(lines);
  });
};

module.exports.run = async function({ api, event, args, Threads, Users, Currencies, permssion }) {
  const { threadID, messageID, senderID } = event;
  const lang = (this.languages && this.languages.en) ? this.languages.en : { no_text: "Enter text", error: "Error", done: "Done" };
  let text = args.join(' ').trim();

  if (!text) {
    return api.sendMessage(lang.no_text, threadID, messageID);
  }

  // keep same image link and same path pattern as requested
  const BASE_IMAGE_URL = 'https://i.postimg.cc/Jh86TFLn/Pics-Art-08-14-10-45-31.jpg';

  // ensure cache folder exists
  const cacheDir = path.join(__dirname, 'cache');
  try {
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  } catch (e) {
    console.error('Cannot create cache dir:', e);
  }

  const outPath = path.join(cacheDir, `mia_${Date.now()}.png`);

  try {
    // download base image (arraybuffer)
    const res = await axios.get(BASE_IMAGE_URL, { responseType: 'arraybuffer' });
    fs.writeFileSync(outPath, Buffer.from(res.data, 'binary'));

    // load base image
    const baseImage = await loadImage(outPath);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext('2d');

    // draw base image to canvas
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // initial font setup (we will dynamically adjust)
    let fontSize = 250; // starting large (kept from original)
    const minFont = 45; // smallest allowed (kept from original)
    const maxTotalWidth = 2600; // kept as original threshold
    const wrapMaxWidth = 1160; // kept as original wrapping width

    // set a font for measurement & wrapping; we'll reduce until the text measure fits threshold
    ctx.textBaseline = 'top';
    ctx.textAlign = 'start';

    while (fontSize >= minFont) {
      ctx.font = `${fontSize}px Arial`;
      const measured = ctx.measureText(text).width;
      if (measured <= maxTotalWidth) break;
      fontSize--;
    }
    if (fontSize < minFont) fontSize = minFont;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = '#000000';

    // get wrapped lines
    const lines = await this.wrapText(ctx, text, wrapMaxWidth);

    // draw lines one by one at coordinates same as original (x:60, y start:165)
    const startX = 60;
    let startY = 165;
    const lineHeight = Math.round(fontSize * 1.15); // small spacing
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], startX, startY + (i * lineHeight));
    }

    // save canvas to file (overwrite outPath)
    fs.writeFileSync(outPath, canvas.toBuffer());

    // send message with emoji & cleanup
    return api.sendMessage(
      {
        body: `${this.languages.en.done} ✨`,
        attachment: fs.createReadStream(outPath)
      },
      threadID,
      (err) => {
        try {
          if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
        } catch (e) {
          console.error('Error deleting temp file:', e);
        }
        if (err) console.error('Send message error in mia:', err);
      },
      messageID
    );

  } catch (error) {
    console.error('Error in mia command:', error);
    try {
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    } catch (e) {
      console.error('Error deleting on-failure file:', e);
    }
    return api.sendMessage(this.languages.en.error + ' ❌', threadID, messageID);
  }
};
