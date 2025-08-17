module.exports.config = {
  name: "nudegirl",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝒂𝒏𝒊𝒎𝒆 𝒎𝒆𝒚𝒆𝒅𝒆𝒓 𝒆𝒓 𝒏𝒖𝒅𝒆 𝒄𝒉𝒐𝒃𝒊",
  commandCategory: "𝒏𝒔𝒇𝒘",
  usages: "nudegirl",
  cooldowns: 3,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  const path = __dirname + "/cache/nudegirl.jpg";

  try {
    api.sendMessage("🔄 𝒄𝒉𝒐𝒃𝒊 𝒆𝒓 𝒑𝒊𝒄 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒉𝒐𝒄𝒄𝒉𝒆...", event.threadID);

    const response = await axios.get("https://api.nekosapi.com/v4/images/random?rating=explicit");
    const imageUrl = response.data.url;
    
    const imageResponse = await axios.get(imageUrl, { 
      responseType: "arraybuffer",
      headers: { "Cache-Control": "no-cache" }
    });
    
    fs.writeFileSync(path, Buffer.from(imageResponse.data, 'binary'));
    
    return api.sendMessage({
      body: `𝑬𝒊 𝑵𝒂𝒐 𝑬𝒙𝒄𝒍𝒖𝒔𝒊𝒗 𝑵𝒖𝒅𝒆 𝑨𝒏𝒊𝒎𝒆 𝑮𝒂𝒓𝒍! 😏\n`,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    
  } catch (error) {
    console.error("❌ 𝑵𝒖𝒅𝒆 𝑮𝒊𝒓𝒍 𝑬𝒓𝒓𝒐𝒓:", error);
    return api.sendMessage("❌ 𝒆𝒓𝒓𝒐𝒓: 𝒄𝒉𝒐𝒃𝒊 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒕𝒆𝒄𝒉𝒆 𝒏𝒂! 😢", event.threadID, event.messageID);
  }
};
