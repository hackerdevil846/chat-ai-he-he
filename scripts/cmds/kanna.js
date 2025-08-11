module.exports.config = {
  name: "kanna",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑲𝒂𝒏𝒏𝒂 𝒄𝒉𝒂𝒏 𝒆𝒓 𝒊𝒎𝒂𝒈𝒆 𝒅𝒆𝒌𝒉𝒖𝒏",
  commandCategory: "𝑹𝒂𝒏𝒅𝒐𝒎-𝑰𝒎𝒂𝒈𝒆𝒔",
  usages: "𝒌𝒂𝒏𝒏𝒂",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const axios = require('axios');
  const fs = require("fs");
  const path = require("path");
  
  try {
    const response = await axios.get('https://apikanna.khoahoang2.repl.co');
    const imageUrl = response.data.data;
    const count = response.data.count;
    const ext = path.extname(imageUrl) || '.jpg';
    
    const cachePath = path.join(__dirname, 'cache', `kanna_${Date.now()}${ext}`);
    const writer = fs.createWriteStream(cachePath);
    
    const imageResponse = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream'
    });

    imageResponse.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    api.sendMessage({
      body: `🌸 𝑲𝒂𝒏𝒏𝒂 𝒄𝒉𝒂𝒏 𝒆𝒓 𝒊𝒎𝒂𝒈𝒆! <3\n🌸 𝑻𝒐𝒕𝒂𝒍 𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆: ${count} 𝒊𝒎𝒂𝒈𝒆𝒔`,
      attachment: fs.createReadStream(cachePath)
    }, event.threadID, () => {
      fs.unlinkSync(cachePath);
    }, event.messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("🌸 𝑲𝒂𝒏𝒏𝒂 𝒆𝒓 𝒊𝒎𝒂𝒈𝒆 𝒑𝒂𝒕𝒉𝒂𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊! 𝑷𝒖𝒏𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
  }
}
