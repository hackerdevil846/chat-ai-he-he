module.exports.config = {
  name: "nude",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝒏𝒖𝒅𝒆 𝒄𝒉𝒐𝒃𝒊 𝒑𝒂𝒕𝒉𝒂𝒏𝒐",
  commandCategory: "𝟏𝟖+",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ event, api }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  
  try {
    const response = await axios.get(`https://api-milo.herokuapp.com/nude`);
    const { url, stt, length } = response.data;
    
    const imgResponse = await axios.get(url, {
      responseType: "arraybuffer"
    });
    
    const imgPath = __dirname + `/cache/nude_${event.senderID}_${event.threadID}.png`;
    fs.writeFileSync(imgPath, Buffer.from(imgResponse.data, "binary"));
    
    await api.sendMessage({
      body: `📸 𝒄𝒉𝒐𝒃𝒊 𝒔𝒐𝒏𝒌𝒉𝒂: (${stt}/${length})`,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ 𝒆𝒓𝒓𝒐𝒓: 𝒄𝒉𝒐𝒃𝒊 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂", event.threadID, event.messageID);
  }
};
