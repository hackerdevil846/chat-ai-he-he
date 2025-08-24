const axios = require("axios");
const fs = require("fs");
const path = require("path");

const userCache = new Map();

function deleteAfterTimeout(filePath, timeout = 5000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }, timeout);
}

function formatSeconds(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}𝒎 ${s}𝒔`;
}

function toBI(text) {
  const map = {
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆',
    'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
    'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐',
    'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
    'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚',
    'z': '𝒛', 'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫',
    'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰',
    'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵',
    'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺',
    'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿',
    'Y': '𝒀', 'Z': '𝒁', 
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
}

module.exports = {
  config: {
    name: "archive",
    version: "2.0",
    hasPermission: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: toBI("Search and download videos, music, documents, APKs, and images from archive.org"),
    category: toBI("media"),
    usages: toBI("<type> <query>"),
    cooldowns: 5,
  },

  // Added onStart to satisfy the loader and create cache dir if missing
  onStart: async function () {
    try {
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    } catch (e) {
      console.error("archive.js onStart error:", e);
    }
  },

  run: async function ({ api, event, args }) {
    const type = args[0]?.toLowerCase();
    const query = args.slice(1).join(" ");
    const validTypes = ["video", "music", "doc", "apk", "image"];

    if (!validTypes.includes(type) || !query)
      return api.sendMessage(toBI("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒖𝒔𝒂𝒈𝒆: 𝒂𝒓𝒄𝒉𝒊𝒗𝒆 <𝒗𝒊𝒅𝒆𝒐|𝒎𝒖𝒔𝒊𝒄|𝒅𝒐𝒄|𝒂𝒑𝒌|𝒊𝒎𝒂𝒈𝒆> <𝒒𝒖𝒆𝒓𝒚>"), event.threadID);

    const typeMap = {
      video: "movies",
      music: "audio",
      doc: "texts",
      apk: "software",
      image: "image",
    };

    const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
      query
    )}+AND+mediatype:${typeMap[type]}&fl[]=identifier,title,description,downloads&rows=5&page=1&output=json`;

    try {
      const res = await axios.get(searchUrl);
      const items = res.data.response.docs;

      if (!items.length) return api.sendMessage(toBI("❌ 𝑵𝒐 𝒓𝒆𝒔𝒖𝒍𝒕𝒔 𝒇𝒐𝒖𝒏𝒅!"), event.threadID);

      userCache.set(event.senderID, { type, results: items });

      const list = items.map((item, i) => `${i + 1}. ${item.title}`).join("\n");

      api.sendMessage(
        toBI(`📦 𝑻𝒐𝒑 5 ${type} 𝒓𝒆𝒔𝒖𝒍𝒕𝒔 𝒇𝒐𝒓 "${query}":\n\n${list}\n\n👉 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 1–5 𝒕𝒐 𝒔𝒆𝒍𝒆𝒄𝒕`),
        event.threadID,
        (err, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            type: "select",
            author: event.senderID,
            messageID: info.messageID,
          });
        }
      );
    } catch (e) {
      console.error(e);
      api.sendMessage(toBI("❌ 𝑬𝒓𝒓𝒐𝒓 𝒔𝒆𝒂𝒓𝒄𝒉𝒊𝒏𝒈 𝒂𝒓𝒄𝒉𝒊𝒗𝒆.𝒐𝒓𝒈"), event.threadID);
    }
  },

  handleReply: async function ({ api, event, handleReply }) {
    if (event.senderID !== handleReply.author) return;

    const choice = event.body.trim();
    if (!/^[1-5]$/.test(choice)) return api.sendMessage(toBI("⚠️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒂 𝒏𝒖𝒎𝒃𝒆𝒓 𝒃𝒆𝒕𝒘𝒆𝒆𝒏 1–5"), event.threadID);

    const index = parseInt(choice) - 1;
    const { type, results } = userCache.get(event.senderID) || {};
    if (!results || !results[index]) return api.sendMessage(toBI("❌ 𝑫𝒂𝒕𝒂 𝒆𝒙𝒑𝒊𝒓𝒆𝒅 𝒐𝒓 𝒊𝒏𝒗𝒂𝒍𝒊𝒅 𝒔𝒆𝒍𝒆𝒄𝒕𝒊𝒐𝒏"), event.threadID);

    const item = results[index];
    const metaUrl = `https://archive.org/metadata/${item.identifier}`;

    try {
      const metaRes = await axios.get(metaUrl);
      const files = metaRes.data.files;
      let file, fileUrl, duration = 0;

      if (type === "video") {
        file = files.find(f => f.format?.includes("MPEG4"));
        duration = parseFloat(file?.length || 0);
      } else if (type === "music") {
        file = files.find(f => f.format?.includes("MP3"));
        duration = parseFloat(file?.length || 0);
      } else if (type === "doc") {
        const docFiles = files.filter(f => /\.(pdf|zip|docx?|epub)$/i.test(f.name));
        if (!docFiles.length) return api.sendMessage(toBI("❌ 𝑵𝒐 𝒅𝒐𝒄𝒖𝒎𝒆𝒏𝒕 𝒇𝒊𝒍𝒆𝒔 𝒇𝒐𝒖𝒏𝒅"), event.threadID);
        const links = docFiles.map(f => toBI(`📄 ${f.name}\n🔗 https://archive.org/download/${item.identifier}/${f.name}`));
        return api.sendMessage(toBI(`📚 𝑫𝒐𝒄𝒖𝒎𝒆𝒏𝒕𝒔:\n\n${links.join("\n\n")}`), event.threadID);
      } else if (type === "apk") {
        file = files.find(f => /\.apk$/i.test(f.name));
        if (!file) return api.sendMessage(toBI("❌ 𝑵𝒐 𝑨𝑷𝑲 𝒇𝒊𝒍𝒆𝒔 𝒇𝒐𝒖𝒏𝒅"), event.threadID);
        fileUrl = `https://archive.org/download/${item.identifier}/${file.name}`;
        return api.sendMessage(toBI(`📱 𝑨𝑷𝑲 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅:\n${item.title}\n🔗 ${fileUrl}`), event.threadID);
      } else if (type === "image") {
        file = files.find(f => /\.(jpe?g|png)$/i.test(f.name));
        if (!file) return api.sendMessage(toBI("❌ 𝑵𝒐 𝒊𝒎𝒂𝒈𝒆 𝒇𝒊𝒍𝒆𝒔 𝒇𝒐𝒖𝒏𝒅"), event.threadID);
        fileUrl = `https://archive.org/download/${item.identifier}/${file.name}`;
        const ext = file.name.split(".").pop();
        const filePath = path.join(__dirname, "cache", `img_${Date.now()}.${ext}`);
        const res = await axios({ url: fileUrl, responseType: "stream" });
        const writer = fs.createWriteStream(filePath);
        await new Promise((resolve, reject) => {
          res.data.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
        await api.sendMessage({ 
          body: toBI("✅ 𝑰𝒎𝒂𝒈𝒆 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒅:"),
          attachment: fs.createReadStream(filePath) 
        }, event.threadID);
        return deleteAfterTimeout(filePath);
      }

      if (!file) return api.sendMessage(toBI("❌ 𝑵𝒐 𝒄𝒐𝒎𝒑𝒂𝒕𝒊𝒃𝒍𝒆 𝒇𝒊𝒍𝒆 𝒇𝒐𝒖𝒏𝒅"), event.threadID);

      fileUrl = `https://archive.org/download/${item.identifier}/${file.name}`;
      const ext = file.name.split(".").pop();
      const fileName = `archive_${Date.now()}.${ext}`;
      const filePath = path.join(__dirname, "cache", fileName);

      if (
        (type === "video" && duration <= 900) ||
        (type === "music" && duration <= 900)
      ) {
        const stream = await axios({ url: fileUrl, responseType: "stream" });
        const writer = fs.createWriteStream(filePath);
        await new Promise((resolve, reject) => {
          stream.data.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        await api.sendMessage({
          body: toBI(`📥 ${item.title}\n🕒 ${formatSeconds(duration)}\n✅ 𝑭𝒊𝒍𝒆 𝒂𝒕𝒕𝒂𝒄𝒉𝒆𝒅`),
          attachment: fs.createReadStream(filePath)
        }, event.threadID);

        deleteAfterTimeout(filePath);
      } else {
        await api.sendMessage(
          toBI(`📦 ${item.title}\n🕒 ${formatSeconds(duration)}\n🔗 ${fileUrl}`),
          event.threadID
        );
      }
    } catch (err) {
      console.error(err);
      api.sendMessage(toBI("❌ 𝑬𝒓𝒓𝒐𝒓 𝒍𝒐𝒂𝒅𝒊𝒏𝒈 𝒇𝒊𝒍𝒆 𝒅𝒂𝒕𝒂"), event.threadID);
    }
  }
};
