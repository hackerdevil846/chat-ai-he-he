module.exports.config = {
  name: "siteinf",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑾𝒆𝒃𝒔𝒊𝒕𝒆 𝒆𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒅𝒆𝒌𝒉𝒖𝒏",
  commandCategory: "𝑰𝒏𝒇𝒐",
  usages: "[𝒔𝒊𝒕𝒆 𝒖𝒓𝒍]",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const fs = require("fs");
  
  const url = args[0];
  if (!url) return api.sendMessage("❗ 𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒕𝒊 𝒘𝒆𝒃𝒔𝒊𝒕𝒆 𝒆𝒓 𝑼𝑹𝑳 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
  
  try {
    api.sendMessage("🔍 𝑺𝒊𝒕𝒆 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒌𝒉𝒖𝒏𝒄𝒉𝒊...", event.threadID, event.messageID);
    
    const response = await axios.get(`https://list.ly/api/v4/meta?url=${encodeURIComponent(url)}`);
    const data = response.data;
    
    if (!data.name || !data.description) {
      return api.sendMessage("⚠️ 𝑨𝒑𝒏𝒂𝒓 𝒅𝒊𝒚𝒆 𝒋𝒂𝒐𝒚𝒂 𝑼𝑹𝑳 𝒆𝒓 𝒌𝒐𝒏𝒐 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒑𝒂𝒘𝒂 𝒋𝒂𝒊𝒏𝒊 𝒏𝒂𝒊", event.threadID, event.messageID);
    }
    
    const imagePath = __dirname + `/cache/siteinf_${event.senderID}.png`;
    
    if (data.image) {
      const imageResponse = await axios.get(data.image, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));
    }
    
    const message = `🌐 𝑾𝒆𝒃𝒔𝒊𝒕𝒆 𝑰𝒏𝒇𝒐\n━━━━━━━━━━━━━━\n🔹 𝑵𝒂𝒎𝒆: ${data.name}\n\n🔹 𝑫𝒆𝒔𝒄𝒓𝒊𝒑𝒕𝒊𝒐𝒏: ${data.description}\n\n🔗 𝑼𝑹𝑳: ${data.url}`;
    
    if (fs.existsSync(imagePath)) {
      api.sendMessage({
        body: message,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
    } else {
      api.sendMessage(message, event.threadID, event.messageID);
    }
    
  } catch (error) {
    console.error(error);
    api.sendMessage("⚠️ 𝑺𝒊𝒕𝒆 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒂𝒏𝒕𝒆 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒄𝒄𝒉𝒆! 𝑷𝒐𝒓𝒆 𝒂𝒃𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
  }
};
