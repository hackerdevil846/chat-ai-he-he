module.exports = {
  config: {
    name: "googlebar",
    version: "1.0.1", // Incremented version for the fix
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Using the requested font
    description: "𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒂 𝑮𝒐𝒐𝒈𝒍𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒃𝒂𝒓 𝒊𝒎𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒕𝒆𝒙𝒕 ✨", // Metalic italic bold
    category: "edit-img",
    usages: "𝒈𝒐𝒐𝒈𝒍𝒆𝒃𝒂𝒓 [𝒕𝒆𝒙𝒕]", // Metalic italic bold
    cooldowns: 10,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    },
    // Adding shortDescription, longDescription, guide for GoatBot structure
    shortDescription: {
      en: "𝑪𝒓𝒆𝒂𝒕𝒆𝒔 𝒂 𝑮𝒐𝒐𝒈𝒍𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒃𝒂𝒓 𝒊𝒎𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝒑𝒓𝒐𝒗𝒊𝒅𝒆𝒅 𝒕𝒆𝒙𝒕." // Metalic italic bold
    },
    longDescription: {
      en: "𝑻𝒂𝒌𝒆𝒔 𝒕𝒉𝒆 𝒊𝒏𝒑𝒖𝒕 𝒕𝒆𝒙𝒕 𝒂𝒏𝒅 𝒓𝒆𝒏𝒅𝒆𝒓𝒔 𝒊𝒕 𝒐𝒏𝒕𝒐 𝒂 𝑮𝒐𝒐𝒈𝒍𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒃𝒂𝒓 𝒕𝒆𝒎𝒑𝒍𝒂𝒕𝒆 𝒂𝒔 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 𝒂𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕." // Metalic italic bold
    },
    guide: {
      en: "{p}googlebar 𝑯𝒆𝒍𝒍𝒐 𝑾𝒐𝒓𝒍𝒅" // Metalic italic bold
    },
    priority: 0
  },

  // The onStart function will now contain the main command logic
  onStart: async function({
    message, // For sending messages (REQUIRED)
    args,    // Command arguments array (REQUIRED)
    event,   // Event data (userID, threadID, etc.)
    api,     // Facebook API functions (if you need direct api functions)
    global   // Global data and functions (for global.utils)
  }) {
    const { loadImage, createCanvas } = require("canvas");
    const fs = require("fs-extra");
    const axios = require("axios");

    // Preserve original path
    const pathImg = __dirname + '/cache/google.png';
    const text = args.join(" ");

    if (!text) {
      return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒔𝒐𝒎𝒆 𝒕𝒆𝒙𝒕 𝒕𝒐 𝒑𝒖𝒕 𝒐𝒏 𝒕𝒉𝒆 𝑮𝒐𝒐𝒈𝒍𝒆 𝒃𝒂𝒓."); // Metalic italic bold
    }

    try {
      // Preserve original image URL
      const getGoogleBar = (await axios.get(`https://i.imgur.com/GXPQYtT.png`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(pathImg, Buffer.from(getGoogleBar, 'utf-8'));

      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.font = "400 30px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "start";

      let fontSize = 50;
      // Adjusted the width to fit the Google bar better,
      // the original was too large for typical Google search bar text area.
      // This might need fine-tuning based on the exact template.
      const maxWidth = 470; // Original text width constraint

      // Dynamic font size adjustment based on the text length
      while (ctx.measureText(text).width > maxWidth && fontSize > 10) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial`;
      }
      
      // Use the provided wrapText function
      const lines = await this.wrapText(ctx, text, maxWidth);
      
      // Adjusted Y coordinate for multi-line text to start from the top of the bar.
      // The original 646 might be for single line.
      // Let's assume a starting Y that is suitable for a single line and adjust for multiple.
      const initialY = 646; // Original Y-coordinate for text
      const lineHeight = fontSize + 5; // Approximate line height

      lines.forEach((line, index) => {
        ctx.fillText(line, 580, initialY + (index * lineHeight));
      });
      
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      return message.reply({ // Use message.reply for sending with GoatBot
        body: `✅ 𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝑮𝒐𝒐𝒈𝒍𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒃𝒂𝒓 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒕𝒆𝒙𝒕! 🌟`, // Metalic italic bold
        attachment: fs.createReadStream(pathImg)
      }, () => fs.unlinkSync(pathImg)); // Callback for unlink
    } catch (error) {
      console.error("❌ 𝑬𝒓𝒓𝒐𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝑮𝒐𝒐𝒈𝒍𝒆 𝒃𝒂𝒓 𝒊𝒎𝒂𝒈𝒆:", error); // Metalic italic bold
      return message.reply("❌ 𝑬𝒓𝒓𝒐𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝑮𝒐𝒐𝒈𝒍𝒆 𝒃𝒂𝒓 𝒊𝒎𝒂𝒈𝒆."); // Metalic italic bold
    }
  },

  // Keep wrapText as a module export so `this.wrapText` can access it.
  wrapText: function(ctx, text, maxWidth) {
    return new Promise(resolve => {
        if (ctx.measureText(text).width < maxWidth) return resolve([text]);
        if (ctx.measureText('W').width > maxWidth) return resolve(null);
        const words = text.split(' ');
        const lines = [];
        let line = '';
        while (words.length > 0) {
            let split = false;
            while (ctx.measureText(words[0]).width >= maxWidth) {
                const temp = words[0];
                words[0] = temp.slice(0, -1);
                if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
                else {
                    split = true;
                    words.splice(1, 0, temp.slice(-1));
                }
            }
            if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
            else {
                lines.push(line.trim());
                line = '';
            }
            if (words.length === 0) lines.push(line.trim());
        }
        return resolve(lines);
    });
  }
};
