const axios = require("axios");
const fs = require("fs-extra");

async function baseApiUrl() {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
}

module.exports.config = {
  name: "alldl",
  aliases: ["download", "dl"],
  version: "1.0.5",
  author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
  countDown: 2,
  role: 0,
  shortDescription: {
    en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜 𝑓𝑟𝑜𝑚 𝑇𝑖𝑘𝑇𝑜𝑘, 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘, 𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚, 𝑌𝑜𝑢𝑇𝑢𝑏𝑒, 𝑎𝑛𝑑 𝑚𝑜𝑟𝑒"
  },
  longDescription: {
    en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑠𝑜𝑐𝑖𝑎𝑙 𝑚𝑒𝑑𝑖𝑎 𝑝𝑙𝑎𝑡𝑓𝑜𝑟𝑚𝑠"
  },
  category: "𝑚𝑒𝑑𝑖𝑎",
  guide: {
    en: "{p}alldl [𝑣𝑖𝑑𝑒𝑜_𝑙𝑖𝑛𝑘]"
  },
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.onStart = async function ({ api, event, args }) {
  try {
    // Check dependencies
    if (!axios) throw new Error("𝑎𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
    if (!fs.existsSync) throw new Error("𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");

    const dipto = event.messageReply?.body || args[0];
    
    if (!dipto) {
      api.setMessageReaction("❌", event.messageID, (err) => {}, true);
      return api.sendMessage("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑖𝑑𝑒𝑜 𝑙𝑖𝑛𝑘 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑙𝑖𝑛𝑘", event.threadID, event.messageID);
    }

    try {
      api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
      
      const apiUrl = await baseApiUrl();
      const { data } = await axios.get(`${apiUrl}/alldl?url=${encodeURIComponent(dipto)}`);
      
      const filePath = __dirname + `/cache/vid.mp4`;
      
      // Create cache directory if it doesn't exist
      if (!fs.existsSync(__dirname + '/cache')) {
        fs.mkdirSync(__dirname + '/cache', { recursive: true });
      }

      const vid = (await axios.get(data.result, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(filePath, Buffer.from(vid, "utf-8"));

      // Shorten URL if available
      let shortenedUrl = data.result;
      if (global.utils && global.utils.shortenURL) {
        shortenedUrl = await global.utils.shortenURL(data.result);
      }

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      
      await api.sendMessage({
        body: `${data.cp || ""}\n𝐿𝑖𝑛𝑘 = ${shortenedUrl || data.result}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, event.messageID);

      // Clean up file
      fs.unlinkSync(filePath);

      // Handle imgur links separately
      if (dipto.startsWith("https://i.imgur.com")) {
        const dipto3 = dipto.substring(dipto.lastIndexOf("."));
        const response = await axios.get(dipto, { responseType: "arraybuffer" });
        const filename = __dirname + `/cache/dipto${dipto3}`;
        fs.writeFileSync(filename, Buffer.from(response.data, "binary"));
        
        await api.sendMessage({
          body: `✅ | 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑓𝑟𝑜𝑚 𝑙𝑖𝑛𝑘`,
          attachment: fs.createReadStream(filename)
        }, event.threadID);
        
        fs.unlinkSync(filename);
      }

    } catch (error) {
      console.error("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      api.setMessageReaction("❎", event.messageID, (err) => {}, true);
      api.sendMessage(`❌ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑: ${error.message}`, event.threadID, event.messageID);
    }

  } catch (error) {
    console.error("𝑀𝑎𝑖𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
    api.sendMessage(`❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: ${error.message}`, event.threadID, event.messageID);
  }
};
