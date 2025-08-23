module.exports.config = {
  name: "altar",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑨𝒍𝒕𝒂𝒓 𝒊𝒎𝒂𝒈𝒆 𝒄𝒓𝒆𝒂𝒕𝒊𝒐𝒏 [𝒎𝒆𝒏𝒕𝒊𝒐𝒏𝒆𝒅]",
  category: "𝒆𝒅𝒊𝒕-𝒊𝒎𝒂𝒈𝒆",
  usages: "[@𝒕𝒂𝒈]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "canvas": "",
    "jimp": "",
    "node-superfetch": ""
  }
};

module.exports.circle = async (image) => {
  const jimp = global.nodemodule['jimp'];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
};

module.exports.run = async ({ event, api, args, Users }) => {
  try {
    const Canvas = global.nodemodule['canvas'];
    const request = global.nodemodule["node-superfetch"];
    const fs = global.nodemodule["fs-extra"];
    const path_toilet = __dirname + '/cache/bantho.png';
    
    const id = Object.keys(event.mentions)[0] || event.senderID;
    const canvas = Canvas.createCanvas(960, 634);
    const ctx = canvas.getContext('2d');
    
    // Load background image
    const background = await Canvas.loadImage('https://i.imgur.com/brK0Hbb.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Get and process avatar
    const avatarResponse = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    const circledAvatar = await this.circle(avatarResponse.body);
    
    // Draw avatar on background
    ctx.drawImage(await Canvas.loadImage(circledAvatar), 353, 158, 205, 205);
    
    // Save and send image
    fs.writeFileSync(path_toilet, canvas.toBuffer());
    api.sendMessage({
      body: "𝑯𝒆𝒚, 𝒉𝒐𝒘 𝒂𝒓𝒆 𝒚𝒐𝒖? :))",
      attachment: fs.createReadStream(path_toilet)
    }, event.threadID, () => fs.unlinkSync(path_toilet), event.messageID);
  }
  catch (e) {
    console.error(e);
    api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒕𝒉𝒆 𝒊𝒎𝒂𝒈𝒆", event.threadID);
  }
};
