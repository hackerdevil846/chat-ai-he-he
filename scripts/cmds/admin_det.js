const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "admin2backup",
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "info",
    shortDescription: {
      en: "𝑺𝒉𝒐𝒘𝒔 𝒃𝒐𝒕 𝒂𝒅𝒎𝒊𝒏 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏"
    },
    longDescription: {
      en: "𝑫𝒊𝒔𝒑𝒍𝒂𝒚𝒔 𝒕𝒉𝒆 𝒃𝒐𝒕 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒐𝒓'𝒔 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏"
    },
    guide: {
      en: "{p}admininfo"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event }) {
    try {
      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const profileImagePath = path.join(cacheDir, 'profile.png');
      
      // Try to download admin profile image if it doesn't exist
      if (!fs.existsSync(profileImagePath)) {
        try {
          const axios = require('axios');
          const imageResponse = await axios.get('https://graph.facebook.com/61571630409265/picture?width=720&height=720', {
            responseType: 'arraybuffer'
          });
          fs.writeFileSync(profileImagePath, Buffer.from(imageResponse.data));
        } catch (imageError) {
          console.log("Could not download profile image:", imageError);
          // Continue without image if download fails
        }
      }

      const msg = {
        body: `╔════ஜ۞۞ஜ═══╗

🥀 𝑵𝒂𝒂𝒎 : 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅
⚜️ 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 : https://www.facebook.com/share/15yVioQQyq/
📱 𝑷𝒉𝒐𝒏 𝒏𝒖𝒎𝒃𝒆𝒓 : 01586400590

╚════ஜ۞۞ஜ═══╝

»»————-　★　————-««
🥀 𝑩𝒐𝒕 𝒆𝒓 𝑴𝒂𝒍𝒊𝒌 : 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅
»»————-　★　————-««`
      };

      // Add attachment only if image exists
      if (fs.existsSync(profileImagePath)) {
        msg.attachment = fs.createReadStream(profileImagePath);
      }

      await message.reply(msg);
      
    } catch (error) {
      console.error("Admin info error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒔𝒉𝒐𝒘𝒊𝒏𝒈 𝒂𝒅𝒎𝒊𝒏 𝒊𝒏𝒇𝒐.");
    }
  },

  onChat: async function({ message, event }) {
    try {
      const triggers = ["admin", "Admin", "/Admin", "#admin", "owner", "malik"];
      
      if (event.body && triggers.some(trigger => 
          event.body.toLowerCase().includes(trigger.toLowerCase())
      )) {
        await this.onStart({ message, event });
      }
    } catch (error) {
      console.error("Chat handler error:", error);
    }
  }
};
