module.exports = {
  config: {
    name: "anhdaden",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    description: "𝑾𝒉𝒊𝒕𝒆 𝒃𝒓𝒐𝒕𝒉𝒆𝒓 𝒎𝒆𝒎𝒆 𝒄𝒓𝒆𝒂𝒕𝒐𝒓",
    category: "Edit-IMG",
    usages: "[text 1] | [text 2]",
    cooldowns: 10
  },

  wrapText: (ctx, text, maxWidth) => {
    return new Promise((resolve) => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText("W").width > maxWidth) return resolve(null);
      const words = text.split(" ");
      const lines = [];
      let line = "";
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
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth)
          line += `${words.shift()} `;
        else {
          lines.push(line.trim());
          line = "";
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  },

  onStart: async function ({ api, event, args }) { // Removed unused Users parameter
    let { threadID, messageID } = event; // Removed senderID as it's not directly used here
    const { loadImage, createCanvas, registerFont } = require("canvas"); // Destructure registerFont
    const fs = require("fs-extra"); // Use require directly
    const axios = require("axios"); // Use require directly
    let pathImg = __dirname + `/cache/anhdaden.png`;
    const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
    
    if (!text[0] || !text[1]) {
      return api.sendMessage("𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒕𝒘𝒐 𝒕𝒆𝒙𝒕𝒔 𝒔𝒆𝒑𝒂𝒓𝒂𝒕𝒆𝒅 𝒃𝒚 \"|\" 𝒔𝒚𝒎𝒃𝒐𝒍\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆: !anhdaden 𝑻𝒆𝒙𝒕 1 | 𝑻𝒆𝒙𝒕 2", threadID, messageID);
    }

    try {
      // Download the base image
      let getImage = (
        await axios.get(`https://i.imgur.com/2ggq8wM.png`, { // Exact link as requested
          responseType: "arraybuffer",
        })
      ).data;
      fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));
      
      // Download the font if it doesn't exist
      const fontPath = __dirname + '/cache/SVN-Arial 2.ttf';
      if (!fs.existsSync(fontPath)) { 
        let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download`, { // Exact link as requested
          responseType: "arraybuffer" 
        })).data;
        fs.writeFileSync(fontPath, Buffer.from(getfont, "utf-8"));
      }
      
      let baseImage = await loadImage(pathImg);
      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // Register the font
      registerFont(fontPath, { family: "SVN-Arial 2" });
      
      // Apply "metalix italic bold" style to the font
      // Note: Canvas font style uses 'italic bold [size] [family]' syntax
      ctx.font = "italic bold 35px 'SVN-Arial 2'"; // Increased font size for better visibility
      ctx.fillStyle = "#000077"; // Original color
      ctx.textAlign = "center";
      
      const line1 = await this.wrapText(ctx, text[0], 464);
      const line2 = await this.wrapText(ctx, text[1], 464);
      
      ctx.fillText(line1.join("\n"), 170, 129); // Position for text 1
      ctx.fillText(line2.join("\n"), 170, 440); // Position for text 2
      
      ctx.beginPath();
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      
      return api.sendMessage(
        { attachment: fs.createReadStream(pathImg) },
        threadID,
        () => fs.unlinkSync(pathImg),
        messageID
      );

    } catch (error) {
      console.error("Error in anhdaden command:", error);
      return api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
    }
  }
};
