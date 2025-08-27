const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "ckbot",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "info",
    shortDescription: {
      en: "𝑩𝒐𝒕 𝒆𝒓 𝒊𝒏𝒇𝒐 𝒅𝒆𝒌𝒉𝒂𝒏𝒐 𝒆𝒓 𝒌𝒂𝒋"
    },
    longDescription: {
      en: "𝑺𝒉𝒐𝒘𝒔 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒂𝒃𝒐𝒖𝒕 𝒖𝒔𝒆𝒓𝒔, 𝒈𝒓𝒐𝒖𝒑𝒔, 𝒂𝒏𝒅 𝒃𝒐𝒕 𝒂𝒅𝒎𝒊𝒏"
    },
    guide: {
      en: "{p}ckbot [user|box|admin]"
    },
    cooldowns: 4
  },

  onStart: async function({ message, event, args }) {
    try {
      // Helper function to apply stylish font
      const applyStyle = (text) => {
        return text
          .split('')
          .map(char => {
            if (char >= 'A' && char <= 'Z') return String.fromCodePoint(char.charCodeAt(0) + 119937);
            if (char >= 'a' && char <= 'z') return String.fromCodePoint(char.charCodeAt(0) + 119931);
            if (char >= '0' && char <= '9') return String.fromCodePoint(char.charCodeAt(0) + 120764);
            return char;
          })
          .join('');
      };

      if (args.length === 0) {
        return message.reply(
          `${applyStyle('𝑻𝒖𝒎𝒊 𝒑𝒂𝒓𝒃𝒆:')}\n\n` +
          `${global.config.PREFIX}${this.config.name} ${applyStyle('user')} => ${applyStyle('𝑻𝒖𝒎𝒂𝒓 𝒏𝒊𝒋𝒆𝒓 𝒊𝒏𝒇𝒐 𝒅𝒆𝒌𝒉𝒂𝒃𝒆')}\n` +
          `${global.config.PREFIX}${this.config.name} ${applyStyle('user')} @[${applyStyle('𝑻𝒂𝒈')}] => ${applyStyle('𝑱𝒆 𝒍𝒐𝒌𝒌𝒆 𝒕𝒖𝒎𝒊 𝒕𝒂𝒈 𝒌𝒐𝒓𝒍𝒆 𝒕𝒂𝒓 𝒊𝒏𝒇𝒐 𝒅𝒆𝒌𝒉𝒂𝒃𝒆')}\n` +
          `${global.config.PREFIX}${this.config.name} ${applyStyle('box')} => ${applyStyle('𝑻𝒖𝒎𝒂𝒓 𝒃𝒐𝒙 𝒆𝒓 𝒊𝒏𝒇𝒐 (𝒎𝒆𝒎𝒃𝒆𝒓 𝒔𝒐𝒏𝒌𝒉𝒂, 𝒆𝒓𝒂 𝒆𝒓 𝒆𝒓 𝒅𝒋𝒕,...)')}\n` +
          `${global.config.PREFIX}${this.config.name} ${applyStyle('admin')} => ${applyStyle('𝑩𝒐𝒕 𝒆𝒓 𝑨𝒅𝒎𝒊𝒏 𝒆𝒓 𝒊𝒏𝒇𝒐')}`
        );
      }

      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const imagePath = path.join(cacheDir, 'profile.png');

      if (args[0] === "box") {
        const threadID = args[1] || event.threadID;
        
        try {
          const threadInfo = await api.getThreadInfo(threadID);
          let maleCount = 0;
          let femaleCount = 0;

          for (const user of Object.values(threadInfo.userInfo)) {
            if (user.gender === "MALE") maleCount++;
            else if (user.gender === "FEMALE") femaleCount++;
          }

          const approvalStatus = threadInfo.approvalMode ? "𝑶𝒏" : "𝑶𝒇𝒇";
          const emoji = threadInfo.emoji || "𝑵𝒐𝒏𝒆";

          let infoText = `${applyStyle('𝑮𝒓𝒐𝒖𝒑 𝒏𝒂𝒎𝒆')}: ${threadInfo.threadName}\n` +
                        `${applyStyle('𝑻𝑰𝑫')}: ${threadID}\n` +
                        `${applyStyle('𝑨𝒑𝒑𝒓𝒐𝒗𝒆𝒅')}: ${approvalStatus}\n` +
                        `${applyStyle('𝑬𝒎𝒐𝒋𝒊')}: ${emoji}\n` +
                        `${applyStyle('𝑰𝒏𝒇𝒐')}:\n` +
                        `» ${threadInfo.participantIDs.length} ${applyStyle('𝒎𝒆𝒎𝒃𝒆𝒓𝒔 𝒂𝒏𝒅')} ${threadInfo.adminIDs.length} ${applyStyle('𝒂𝒅𝒎𝒊𝒏𝒔')}\n` +
                        `» ${applyStyle('𝑰𝒏𝒄𝒍𝒖𝒅𝒊𝒏𝒈')} ${maleCount} ${applyStyle('𝒃𝒐𝒚 𝒂𝒏𝒅')} ${femaleCount} ${applyStyle('𝒈𝒊𝒓𝒍')}\n` +
                        `» ${applyStyle('𝑻𝒐𝒕𝒂𝒍 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔')}: ${threadInfo.messageCount || 0}`;

          if (threadInfo.imageSrc) {
            try {
              const imageResponse = await axios.get(threadInfo.imageSrc, {
                responseType: 'arraybuffer'
              });
              fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
              
              await message.reply({
                body: infoText,
                attachment: fs.createReadStream(imagePath)
              });
              
              fs.unlinkSync(imagePath);
            } catch (imageError) {
              await message.reply(infoText);
            }
          } else {
            await message.reply(infoText);
          }
        } catch (error) {
          console.error("Box info error:", error);
          await message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒈𝒆𝒕 𝒈𝒓𝒐𝒖𝒑 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏.");
        }
      }
      else if (args[0] === "admin") {
        try {
          const adminInfo = {
            body: `${applyStyle('———» 𝑨𝑫𝑴𝑰𝑵 𝑩𝑶𝑻 «———')}\n` +
                  `${applyStyle('❯ 𝑵𝒂𝒎𝒆')}: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 🖤\n` +
                  `${applyStyle('❯ 𝑻𝒉𝒂𝒏𝒌𝒔 𝒇𝒐𝒓 𝒖𝒔𝒊𝒏𝒈')} ${global.config.BOTNAME} ${applyStyle('𝒃𝒐𝒕')}`
          };

          try {
            const imageResponse = await axios.get(`https://graph.facebook.com/61571630409265/picture?height=720&width=720`, {
              responseType: 'arraybuffer'
            });
            fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
            adminInfo.attachment = fs.createReadStream(imagePath);
          } catch (imageError) {
            console.log("Could not load admin image:", imageError);
          }

          await message.reply(adminInfo);
          
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (error) {
          console.error("Admin info error:", error);
          await message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒈𝒆𝒕 𝒂𝒅𝒎𝒊𝒏 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏.");
        }
      }
      else if (args[0] === "user") {
        let userID;
        
        if (!args[1]) {
          userID = event.senderID;
        } else if (Object.keys(event.mentions).length > 0) {
          userID = Object.keys(event.mentions)[0];
        } else {
          userID = args[1];
        }

        try {
          const userInfo = await api.getUserInfo(userID);
          const userData = userInfo[userID];
          
          if (!userData) {
            return message.reply("❌ 𝑼𝒔𝒆𝒓 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅.");
          }

          const isFriend = userData.isFriend ? "𝒀𝒆𝒔" : "𝑵𝒐";
          const username = userData.vanity || "𝑵𝒐𝒏𝒆";
          const gender = userData.gender === 2 ? "𝑩𝒐𝒚" : userData.gender === 1 ? "𝑮𝒊𝒓𝒍" : "𝑶𝒕𝒉𝒆𝒓";

          const userText = `${applyStyle('𝑵𝒂𝒎𝒆')}: ${userData.name}\n` +
                          `${applyStyle('𝑼𝒔𝒆𝒓 𝑳𝒊𝒏𝒌')}: ${userData.profileUrl}\n` +
                          `${applyStyle('𝑼𝒔𝒆𝒓𝒏𝒂𝒎𝒆')}: ${username}\n` +
                          `${applyStyle('𝑼𝑰𝑫')}: ${userID}\n` +
                          `${applyStyle('𝑮𝒆𝒏𝒅𝒆𝒓')}: ${gender}\n` +
                          `${applyStyle('𝑩𝒐𝒕 𝒇𝒓𝒊𝒆𝒏𝒅')}? ${isFriend}`;

          try {
            const imageResponse = await axios.get(`https://graph.facebook.com/${userID}/picture?height=720&width=720`, {
              responseType: 'arraybuffer'
            });
            fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
            
            await message.reply({
              body: userText,
              attachment: fs.createReadStream(imagePath)
            });
            
            fs.unlinkSync(imagePath);
          } catch (imageError) {
            await message.reply(userText);
          }
        } catch (error) {
          console.error("User info error:", error);
          await message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒈𝒆𝒕 𝒖𝒔𝒆𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏.");
        }
      }
      else {
        await message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒐𝒑𝒕𝒊𝒐𝒏. 𝑼𝒔𝒆: user, box, 𝒐𝒓 admin");
      }

    } catch (error) {
      console.error("Ckbot command error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕.");
    }
  }
};
