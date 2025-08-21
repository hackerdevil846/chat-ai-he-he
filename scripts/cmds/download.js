module.exports.config = {
  name: "download",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "📥 Download files from links",
  commandCategory: "⚙️ System",
  usages: "[path] <link>",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "request": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const rq = global.nodemodule["request"];
  
  try {
    let path, link;
    
    if (args.length < 1) {
      return api.sendMessage("❌ Invalid usage! Please provide a download link", event.threadID, event.messageID);
    }

    if (args.length === 1) {
      path = __dirname;
      link = args[0];
    } else {
      path = __dirname + '/' + args[0];
      link = args.slice(1).join(" ");
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    const format = rq.get(link);
    const namefile = format.uri.pathname;
    const fullPath = path + '/' + namefile.slice(namefile.lastIndexOf("/") + 1);

    api.sendMessage("⏳ Downloading file...", event.threadID, event.messageID);

    const response = await axios.get(link, { responseType: "arraybuffer" });
    fs.writeFileSync(fullPath, Buffer.from(response.data, "utf-8"));

    return api.sendMessage(`✅ File successfully downloaded to:\n📁 ${fullPath}`, event.threadID, event.messageID);
    
  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ Download failed! Please check the link and try again", event.threadID, event.messageID);
  }
};
