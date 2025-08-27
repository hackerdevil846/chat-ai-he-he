const fs = require("fs-extra");
const axios = require("axios");

const ARYAN_API = "ArYANAHMEDRUDRO";

module.exports = {
  config: {
    name: "4k",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑬𝒏𝒉𝒂𝒏𝒄𝒆 𝒑𝒉𝒐𝒕𝒐𝒔 𝒕𝒐 𝒔𝒕𝒖𝒏𝒏𝒊𝒏𝒈 4𝑲 𝒓𝒆𝒔𝒐𝒍𝒖𝒕𝒊𝒐𝒏",
    category: "edit-img",
    usages: "𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 𝒐𝒓 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒊𝒎𝒂𝒈𝒆 𝑼𝑹𝑳",
    cooldowns: 10,
    dependencies: {
      axios: "",
      "fs-extra": ""
    },
    envConfig: {
      ARYAN_API_KEY: ARYAN_API
    }
  },

  onStart: async function({ api, event, args, message }) {
    const { threadID, messageID, senderID, messageReply } = event;
    const tempPath = __dirname + `/cache/4k_${Date.now()}_${senderID}.jpg`;

    try {
      let imageUrl;
      
      if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
        const attachment = messageReply.attachments[0];
        if (["photo", "sticker"].includes(attachment.type)) {
          imageUrl = attachment.url;
        } else {
          return message.reply("⚠️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒊𝒎𝒂𝒈𝒆 𝒐𝒓 𝒔𝒕𝒊𝒄𝒌𝒆𝒓.");
        }
      } else if (args[0] && /^https?:\/\//.test(args[0])) {
        imageUrl = args[0];
      } else {
        return message.reply(
          `📸 𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 𝒐𝒓 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒊𝒎𝒂𝒈𝒆 𝑼𝑹𝑳.\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆: ${global.config.PREFIX}4k [𝒊𝒎𝒂𝒈𝒆_𝒖𝒓𝒍]`
        );
      }

      const waitMsg = await message.reply("🖼️ 𝑬𝒏𝒉𝒂𝒏𝒄𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒊𝒎𝒂𝒈𝒆 𝒕𝒐 4𝑲... 𝑷𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕.");

      const enhancementUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/upscale-image?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${ARYAN_API}`;
      const { data } = await axios.get(enhancementUrl, { timeout: 60000 });

      if (!data || !data.resultImageUrl) throw new Error("𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝑨𝑷𝑰 𝒓𝒆𝒔𝒑𝒐𝒏𝒔𝒆: 𝑵𝒐 𝒓𝒆𝒔𝒖𝒍𝒕 𝒊𝒎𝒂𝒈𝒆 𝑼𝑹𝑳");

      const imageResponse = await axios.get(data.resultImageUrl, {
        responseType: "arraybuffer",
        timeout: 120000
      });

      fs.writeFileSync(tempPath, imageResponse.data);

      await message.reply({
        body: "✅ 𝑰𝒎𝒂𝒈𝒆 𝒆𝒏𝒉𝒂𝒏𝒄𝒆𝒅 𝒕𝒐 4𝑲 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!",
        attachment: fs.createReadStream(tempPath)
      });

      api.unsendMessage(waitMsg.messageID);
      fs.unlinkSync(tempPath);

    } catch (error) {
      console.error("4𝑲 𝑬𝒓𝒓𝒐𝒓:", error);
      let errorText = "❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒆𝒏𝒉𝒂𝒏𝒄𝒆 𝒊𝒎𝒂𝒈𝒆. ";

      if (error.message.includes("timeout")) {
        errorText += "𝑻𝒉𝒆 𝒓𝒆𝒒𝒖𝒆𝒔𝒕 𝒕𝒊𝒎𝒆𝒅 𝒐𝒖𝒕. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.";
      } else if (error.message.includes("resultImageUrl")) {
        errorText += "𝑨𝑷𝑰 𝒅𝒊𝒅 𝒏𝒐𝒕 𝒓𝒆𝒕𝒖𝒓𝒏 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒊𝒎𝒂𝒈𝒆 𝑼𝑹𝑳.";
      } else {
        errorText += `𝑬𝒓𝒓𝒐𝒓: ${error.message}`;
      }

      await message.reply(errorText);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
};
