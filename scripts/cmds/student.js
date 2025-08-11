const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "student",
    version: "3.2.0",
    author: "Asif Developer",
    category: "Memes",
    shortDescription: "Create classroom board memes",
    longDescription: "Generate classroom-style memes with custom text on a chalkboard",
    guide: "{prefix}student [text]",
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    try {
      const { threadID, messageID } = event;
      const text = args.join(" ");
      
      if (!text) {
        return api.sendMessage("📝 Please enter text to display on the classroom board", threadID, messageID);
      }

      const pathImg = `${__dirname}/../cache/student_${event.senderID}_${Date.now()}.png`;
      
      // Download board image template
      const boardUrl = "https://i.ibb.co/yf4yCVh/Picsart-22-08-14-01-57-26-461.jpg";
      const { data } = await axios.get(boardUrl, { responseType: 'arraybuffer' });
      await fs.writeFile(pathImg, Buffer.from(data, 'binary'));
      
      // Process image
      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // Configure text styling
      ctx.fillStyle = "#000000";
      ctx.textAlign = "left";
      ctx.rotate(-11 * Math.PI / 180);
      
      // Dynamic font sizing
      let fontSize = 45;
      ctx.font = `bold ${fontSize}px Arial`;
      
      // Adjust font size for long text
      while (ctx.measureText(text).width > 2250 && fontSize > 15) {
        fontSize--;
        ctx.font = `bold ${fontSize}px Arial`;
      }
      
      // Text wrapping function
      const wrapText = (text, maxWidth) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
          let wordToAdd = word;
          // Break long words
          while (ctx.measureText(wordToAdd).width >= maxWidth) {
            const part = wordToAdd.slice(0, wordToAdd.length - 1);
            wordToAdd = wordToAdd.slice(wordToAdd.length - 1);
            
            if (currentLine) {
              lines.push(currentLine.trim());
              currentLine = '';
            }
            lines.push(part);
          }
          
          // Test if word fits
          const testLine = currentLine ? `${currentLine} ${wordToAdd}` : wordToAdd;
          if (ctx.measureText(testLine).width < maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) lines.push(currentLine.trim());
            currentLine = wordToAdd;
          }
        }
        if (currentLine) lines.push(currentLine.trim());
        return lines;
      };

      // Render wrapped text
      const wrappedText = wrapText(text, 420);
      const lineHeight = fontSize * 1.2;
      const startY = 580;
      
      wrappedText.forEach((line, index) => {
        ctx.fillText(line, 50, startY + (index * lineHeight));
      });
      
      // Save and send result
      const imageBuffer = canvas.toBuffer();
      await fs.writeFile(pathImg, imageBuffer);
      
      api.sendMessage({
        attachment: fs.createReadStream(pathImg)
      }, threadID, () => fs.unlinkSync(pathImg), messageID);
      
    } catch (error) {
      console.error("Classroom board error:", error);
      api.sendMessage("❌ Failed to create classroom board. Please try again later.", threadID, messageID);
    }
  }
};
