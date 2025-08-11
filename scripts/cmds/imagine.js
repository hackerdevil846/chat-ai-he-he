module.exports.config = {
  name: "imagine",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑰𝒎𝒂𝒈𝒆 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒌𝒐𝒓𝒖𝒏 𝒑𝒐𝒍𝒍𝒊𝒏𝒂𝒕𝒊𝒐𝒏 𝒅𝒊𝒚𝒆",
  commandCategory: "𝑰𝒎𝒂𝒈𝒆",
  usages: "𝒒𝒖𝒆𝒓𝒚",
  cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const fs = require('fs-extra');
  let { threadID, messageID } = event;
  
  let query = args.join(" ");
  if (!query) return api.sendMessage("𝑰𝒎𝒂𝒈𝒆 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒌𝒐𝒓𝒕𝒆 𝒌𝒊𝒔𝒖 𝒏𝒂𝒎 𝒅𝒊𝒚𝒆𝒏? 🎨", threadID, messageID);
  
  let path = __dirname + `/cache/imagine_${event.senderID}.png`;
  
  try {
    api.sendMessage("🖌️ 𝑰𝒎𝒂𝒈𝒆 𝒃𝒂𝒏𝒂𝒏𝒐 𝒉𝒐𝒄𝒄𝒉𝒆...", threadID, messageID);
    
    const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(query)}`, {
      responseType: "arraybuffer",
    });
    
    fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
    
    api.sendMessage({
      body: `🎨 "${query}"\n━━━━━━━━━━━━━━\n𝑨𝒑𝒏𝒂𝒓 𝑰𝒎𝒂𝒈𝒆 𝑹𝒆𝒂𝒅𝒚!`,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
    
  } catch (error) {
    console.error(error);
    api.sendMessage("⚠️ 𝑰𝒎𝒂𝒈𝒆 𝒃𝒂𝒏𝒂𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊, 𝒑𝒖𝒏𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏 😢", threadID, messageID);
  }
};
