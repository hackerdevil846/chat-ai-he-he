const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");
const jimp = require("jimp");
const superfetch = require("node-superfetch");
const chalk = require("chalk");

module.exports = {
  config: {
    name: "family",
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "image",
    shortDescription: {
      en: "𝑪𝒓𝒆𝒂𝒕𝒆 𝒂 𝒇𝒂𝒎𝒊𝒍𝒚 𝒊𝒎𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝒈𝒓𝒐𝒖𝒑 𝒎𝒆𝒎𝒃𝒆𝒓𝒔"
    },
    longDescription: {
      en: "𝑪𝒓𝒆𝒂𝒕𝒆𝒔 𝒂 𝒄𝒐𝒍𝒍𝒂𝒈𝒆 𝒊𝒎𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝒂𝒍𝒍 𝒈𝒓𝒐𝒖𝒑 𝒎𝒆𝒎𝒃𝒆𝒓𝒔' 𝒂𝒗𝒂𝒕𝒂𝒓𝒔"
    },
    guide: {
      en: "{p}family [size] [color] [title]"
    },
    cooldowns: 10,
    dependencies: {
      "fs-extra": "", 
      "axios": "", 
      "canvas": "", 
      "jimp": "", 
      "node-superfetch": "",
      "chalk": ""
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      const { threadID } = event;
      
      // Show help if no arguments or help requested
      if (!args[0] || isNaN(args[0]) || args[0] === "help") {
        const helpMessage = `🎨 𝑭𝒂𝒎𝒊𝒍𝒚 𝑰𝒎𝒂𝒈𝒆 𝑪𝒓𝒆𝒂𝒕𝒐𝒓\n\n` +
                          `𝑼𝒔𝒂𝒈𝒆: ${global.config.PREFIX}family [size] [color] [title]\n\n` +
                          `• 𝒔𝒊𝒛𝒆: 𝑺𝒊𝒛𝒆 𝒐𝒇 𝒆𝒂𝒄𝒉 𝒂𝒗𝒂𝒕𝒂𝒓 (𝒅𝒆𝒇𝒂𝒖𝒍𝒕: 100)\n` +
                          `• 𝒄𝒐𝒍𝒐𝒓: 𝑯𝒆𝒙 𝒄𝒐𝒍𝒐𝒓 𝒄𝒐𝒅𝒆 (𝒅𝒆𝒇𝒂𝒖𝒍𝒕: #000000)\n` +
                          `• 𝒕𝒊𝒕𝒍𝒆: 𝑰𝒎𝒂𝒈𝒆 𝒕𝒊𝒕𝒍𝒆 (𝒅𝒆𝒇𝒂𝒖𝒍𝒕: 𝒈𝒓𝒐𝒖𝒑 𝒏𝒂𝒎𝒆)\n\n` +
                          `𝑬𝒙𝒂𝒎𝒑𝒍𝒆: ${global.config.PREFIX}family 150 #ffffff 𝑶𝒖𝒓 𝑭𝒂𝒎𝒊𝒍𝒚`;
        
        return message.reply(helpMessage);
      }

      // Get thread info
      const threadInfo = await api.getThreadInfo(threadID);
      const participantIDs = threadInfo.participantIDs;
      const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
      
      // Default values
      const size = parseInt(args[0]) || 100;
      const color = args[1] && args[1].startsWith('#') ? args[1] : "#000000";
      const title = args.slice(args[1] && args[1].startsWith('#') ? 2 : 1).join(" ") || threadInfo.name;

      // Create cache directory
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Download font if not exists
      const fontPath = path.join(cacheDir, 'fontfamily.ttf');
      if (!fs.existsSync(fontPath)) {
        try {
          const fontResponse = await superfetch.get("https://drive.google.com/u/0/uc?id=1HOnwKqsW_1CamOnFsmrRW1wvefFF5YpF&export=download");
          fs.writeFileSync(fontPath, fontResponse.body);
        } catch (error) {
          console.error("Failed to download font:", error);
        }
      }

      // Background image
      const backgroundUrl = "https://i.ibb.co/xqrFW4N/Pics-Art-06-26-12-07-26.jpg";
      const frameUrl = "https://i.ibb.co/H41cdDM/1624768781720.png";
      
      // Show processing message
      await message.reply(`🔄 𝑪𝒓𝒆𝒂𝒕𝒊𝒏𝒈 𝒇𝒂𝒎𝒊𝒍𝒚 𝒊𝒎𝒂𝒈𝒆...\n📊 𝑴𝒆𝒎𝒃𝒆𝒓𝒔: ${participantIDs.length}\n🎨 𝑺𝒊𝒛𝒆: ${size}px\n🌈 𝑪𝒐𝒍𝒐𝒓: ${color}`);

      // Load background and frame
      const background = await loadImage(backgroundUrl);
      const frame = await loadImage(frameUrl);
      
      const canvas = createCanvas(background.width, background.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Draw avatars
      let x = 10;
      let y = 200;
      const spacing = 10;
      let drawnCount = 0;
      let deadAccounts = 0;

      for (const userID of participantIDs) {
        if (drawnCount >= 100) break; // Limit to 100 avatars
        
        try {
          let avatarResponse;
          try {
            avatarResponse = await superfetch.get(`https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
            if (avatarResponse.url.includes("static.xx.fbcdn.net/rsrc.php/v3/yo/r/UlIqmHJn-SK.gif")) {
              throw new Error("Default avatar");
            }
          } catch (e) {
            // Fallback to alternative API
            avatarResponse = await superfetch.get(`https://api.apkvips.com/api/avatar.php?id=${userID}`);
            if (avatarResponse.body.length === 390) {
              deadAccounts++;
              continue;
            }
          }

          const avatar = await loadImage(avatarResponse.body);
          ctx.drawImage(avatar, x, y, size, size);

          // Add frame for admins
          if (adminIDs.includes(userID)) {
            ctx.drawImage(frame, x, y, size, size);
          }
          
          x += size + spacing;
          if (x + size > canvas.width) {
            x = 10;
            y += size + spacing;
          }
          
          drawnCount++;
          console.log(chalk.green("Family: ") + `Drawn ${drawnCount} avatars`);
          
        } catch (error) {
          console.error(`Failed to load avatar for ${userID}:`, error);
          deadAccounts++;
        }
      }

      // Add title
      if (fs.existsSync(fontPath)) {
        registerFont(fontPath, { family: "Manrope" });
        ctx.font = "bold 60px Manrope";
      } else {
        ctx.font = "bold 60px Arial";
      }
      
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(title, canvas.width / 2, 100);

      // Save and optimize image with jimp
      const buffer = canvas.toBuffer();
      const image = await jimp.read(buffer);
      const outputPath = path.join(cacheDir, `family_${threadID}_${Date.now()}.png`);
      
      await image.writeAsync(outputPath);
      console.log(chalk.blue("Image saved and optimized"));

      // Send result
      await message.reply({
        body: `✅ 𝑭𝒂𝒎𝒊𝒍𝒚 𝑰𝒎𝒂𝒈𝒆 𝑪𝒓𝒆𝒂𝒕𝒆𝒅\n👥 𝑴𝒆𝒎𝒃𝒆𝒓𝒔: ${drawnCount}/${participantIDs.length}\n💀 𝑫𝒆𝒂𝒅 𝑨𝒄𝒄𝒐𝒖𝒏𝒕𝒔: ${deadAccounts}\n📏 𝑺𝒊𝒛𝒆: ${size}px\n🎨 𝑪𝒐𝒍𝒐𝒓: ${color}`,
        attachment: fs.createReadStream(outputPath)
      });

      // Clean up
      fs.unlinkSync(outputPath);

    } catch (error) {
      console.error("Family command error:", error);
      await message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒄𝒓𝒆𝒂𝒕𝒆 𝒇𝒂𝒎𝒊𝒍𝒚 𝒊𝒎𝒂𝒈𝒆. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
