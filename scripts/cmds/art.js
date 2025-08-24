module.exports.config = {
  name: "art",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑨𝒏𝒊𝒎𝒆 𝒆𝒇𝒇𝒆𝒄𝒕 𝒂𝒅𝒅 𝒌𝒐𝒓𝒂",
  category: "𝑬𝒅𝒊𝒕𝒊𝒏𝒈",
  usages: "𝒊𝒎𝒂𝒈𝒆 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏",
  cooldowns: 5
};

// Added onStart to prevent "onStart of command undefined" error in loader
module.exports.onStart = async () => {
  // noop — intentionally empty to satisfy loader that expects an onStart export
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const fs = require('fs-extra');
  let pathie = __dirname + `/cache/animefied.jpg`;
  const { threadID, messageID } = event;

  if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
    return api.sendMessage("❌ 𝑰𝒎𝒂𝒈𝒆 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏 𝒑𝒍𝒆𝒂𝒔𝒆", threadID, messageID);
  }

  var imageUrl = event.messageReply.attachments[0].url;

  try {
    const lim = await axios.get(`https://animeify.shinoyama.repl.co/convert-to-anime?imageUrl=${encodeURIComponent(imageUrl)}`);
    const image = lim.data.urls[1];
    const img = (await axios.get(`https://www.drawever.com${image}`, { responseType: "arraybuffer" })).data;
    
    fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

    api.sendMessage({
      body: "✅ 𝑨𝒏𝒊𝒎𝒆𝒇𝒊𝒆𝒅 𝒊𝒎𝒂𝒈𝒆 𝒓𝒆𝒂𝒅𝒚!\n𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒊𝒏𝒈 𝒎𝒂𝒚 𝒕𝒂𝒌𝒆 𝒂 𝒎𝒐𝒎𝒆𝒏𝒕...",
      attachment: fs.createReadStream(pathie)
    }, threadID, () => fs.unlinkSync(pathie), messageID);

  } catch (e) {
    console.error(e);
    api.sendMessage(`❌ 𝑬𝒓𝒓𝒐𝒓 𝒉𝒐𝒚𝒆𝒄𝒉𝒆:\n${e.message}`, threadID, messageID);
  }
};
