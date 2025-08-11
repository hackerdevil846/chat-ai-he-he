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

module.exports.run = async ({ api, event }) => {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  
  const links = [
    "https://i.imgur.com/meyGJvz.jpg",
    "https://i.imgur.com/2n4l5Yq.jpg",
    "https://i.imgur.com/PxngxOD.jpg",
    "https://i.imgur.com/A0fbJ6d.jpg",
    "https://i.imgur.com/sEkcx60.jpg",
    "https://i.imgur.com/PB2RoCl.jpg",
    "https://i.imgur.com/Fu4sWId.jpg",
    "https://i.imgur.com/NrReaFG.jpg",
    "https://i.imgur.com/CrdN1mS.jpg",
    "https://i.imgur.com/rGyiCqb.jpg",
    "https://i.imgur.com/wXZGi7T.jpg",
    "https://i.imgur.com/Mu92PEc.jpg",
    "https://i.imgur.com/sZMd93X.jpg",
    "https://i.imgur.com/1kXE6eJ.jpg",
    "https://i.imgur.com/CWDtOXZ.jpg",
    "https://i.imgur.com/s1W3c57.jpg",
    "https://i.imgur.com/QDlVYDW.jpg",
    "https://i.imgur.com/6APRg4d.jpg",
    "https://i.imgur.com/qitBUPy.jpg",
    "https://i.imgur.com/LwgzvVk.jpg",
    "https://i.imgur.com/PxVGoau.jpg",
    "https://i.imgur.com/Tz00ugw.jpg",
    "https://i.imgur.com/aWStCHt.jpg",
    "https://i.imgur.com/ERPxzhs.jpg",
    "https://i.imgur.com/igTYusM.jpg",
    "https://i.imgur.com/lUsHdL0.jpg",
    "https://i.imgur.com/P4MwhIi.jpg",
    "https://i.imgur.com/qP4MZJW.jpg",
    "https://i.imgur.com/XOQUPus.jpg",
    "https://i.imgur.com/uRNq4q5.jpg",
    "https://i.imgur.com/hvhj5Av.jpg",
    "https://i.imgur.com/19M5A6q.jpg",
    "https://i.imgur.com/FK16e5v.jpg"
  ];

  try {
    const randomLink = links[Math.floor(Math.random() * links.length)];
    const imagePath = __dirname + "/cache/nudegirl.jpg";
    
    const response = await axios.get(randomLink, { responseType: "arraybuffer" });
    fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));
    
    api.sendMessage({
      body: "𝑺𝒂𝒓𝒂𝒅𝒊𝒏 𝒂𝒎𝒊 𝒋𝒂𝒏𝒊 𝑩𝒖𝒔𝒄𝒖 𝑩𝒖𝒔𝒍𝒐𝒏. 😏",
      attachment: fs.createReadStream(imagePath)
    }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
    
  } catch (error) {
    console.error(error);
    api.sendMessage("❌ 𝒆𝒓𝒓𝒐𝒓: 𝒄𝒉𝒐𝒃𝒊 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒕𝒆𝒄𝒉𝒆 𝒏𝒂!", event.threadID, event.messageID);
  }
};
