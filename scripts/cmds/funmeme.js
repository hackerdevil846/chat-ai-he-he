const fs = require('fs');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  config: {
    name: "funmeme",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Asif Developer",
    description: "Create meme with user's profile picture",
    category: "image",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
      'axios': '',
      'canvas': ''
    }
  },

  // Added onStart function
  onStart: function() {
    console.log("[!] Fun Meme command initialized");
  },

  run: async function ({ event, api }) {
    const { threadID, messageID, senderID } = event;
    const mentions = Object.keys(event.mentions);
    const targetID = mentions[0] || senderID;
    
    try {
      // Send processing message
      api.sendMessage("Creating your meme...", threadID, messageID);
      
      // Create canvas
      const canvas = createCanvas(700, 500);
      const ctx = canvas.getContext('2d');
      
      // Load template image
      const template = await loadImage('https://i.imgur.com/jHrYZ5Y.jpg');
      ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
      
      // Get user avatar
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512`;
      const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
      const avatar = await loadImage(Buffer.from(avatarResponse.data));
      
      // Draw circular avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(350, 250, 100, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 250, 150, 200, 200);
      ctx.restore();
      
      // Save image
      const path = __dirname + '/cache/islamic_meme_' + Date.now() + '.png';
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(path, buffer);
      
      // Send result
      api.sendMessage({
        body: '😂 Meme Created!',
        attachment: fs.createReadStream(path)
      }, threadID, () => {
        // Clean up temporary file
        try {
          fs.unlinkSync(path);
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      }, messageID);
      
    } catch (error) {
      console.error("meme error:", error);
      api.sendMessage("❌ Failed to create meme. Please try again later.", threadID, messageID);
    }
  }
};
