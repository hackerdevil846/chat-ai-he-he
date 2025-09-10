const axios = require("axios");
const fs = require("fs-extra");
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

module.exports.config = {
    name: "archive",
    aliases: ["arc"],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: {
        en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑟𝑜𝑚 𝑎𝑟𝑐ℎ𝑖𝑣𝑒.𝑜𝑟𝑔"
    },
    longDescription: {
        en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜𝑠, 𝑚𝑢𝑠𝑖𝑐, 𝑑𝑜𝑐𝑢𝑚𝑒𝑛𝑡𝑠, 𝐴𝑃𝐾𝑠, 𝑎𝑛𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑎𝑟𝑐ℎ𝑖𝑣𝑒.𝑜𝑟𝑔"
    },
    guide: {
        en: "{p}𝑎𝑟𝑐ℎ𝑖𝑣𝑒 <𝑣𝑖𝑑𝑒𝑜|𝑚𝑢𝑠𝑖𝑐|𝑑𝑜𝑐|𝑎𝑝𝑘|𝑖𝑚𝑎𝑔𝑒> <𝑞𝑢𝑒𝑟𝑦>"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ api, event, args, message }) {
    try {
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
        
        const type = args[0]?.toLowerCase();
        const query = args.slice(1).join(" ");
        const validTypes = ["video", "music", "doc", "apk", "image"];

        if (!validTypes.includes(type) || !query) {
            return message.reply(toBI("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑎𝑔𝑒: 𝑎𝑟𝑐ℎ𝑖𝑣𝑒 <𝑣𝑖𝑑𝑒𝑜|𝑚𝑢𝑠𝑖𝑐|𝑑𝑜𝑐|𝑎𝑝𝑘|𝑖𝑚𝑎𝑔𝑒> <𝑞𝑢𝑒𝑟𝑦>"));
        }

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

        const res = await axios.get(searchUrl);
        const items = res.data.response.docs;

        if (!items.length) return message.reply(toBI("❌ 𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑!"));

        userCache.set(event.senderID, { type, results: items });

        const list = items.map((item, i) => `${i + 1}. ${item.title}`).join("\n");

        message.reply(
            toBI(`📦 𝑇𝑜𝑝 5 ${type} 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑟 "${query}":\n\n${list}\n\n👉 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 1–5 𝑡𝑜 𝑠𝑒𝑙𝑒𝑐𝑡`),
            (err, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "select"
                });
            }
        );
    } catch (e) {
        console.error("Archive command error:", e);
        message.reply(toBI("❌ 𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑎𝑟𝑐ℎ𝑖𝑣𝑒.𝑜𝑟𝑔"));
    }
};

module.exports.onReply = async function({ api, event, Reply, message }) {
    try {
        if (event.senderID !== Reply.author) return;

        const choice = event.body.trim();
        if (!/^[1-5]$/.test(choice)) return message.reply(toBI("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1–5"));

        const index = parseInt(choice) - 1;
        const { type, results } = userCache.get(event.senderID) || {};
        if (!results || !results[index]) return message.reply(toBI("❌ 𝐷𝑎𝑡𝑎 𝑒𝑥𝑝𝑖𝑟𝑒𝑑 𝑜𝑟 𝑖𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛"));

        const item = results[index];
        const metaUrl = `https://archive.org/metadata/${item.identifier}`;

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
            if (!docFiles.length) return message.reply(toBI("❌ 𝑁𝑜 𝑑𝑜𝑐𝑢𝑚𝑒𝑛𝑡 𝑓𝑖𝑙𝑒𝑠 𝑓𝑜𝑢𝑛𝑑"));
            const links = docFiles.map(f => toBI(`📄 ${f.name}\n🔗 https://archive.org/download/${item.identifier}/${f.name}`));
            return message.reply(toBI(`📚 𝐷𝑜𝑐𝑢𝑚𝑒𝑛𝑡𝑠:\n\n${links.join("\n\n")}`));
        } else if (type === "apk") {
            file = files.find(f => /\.apk$/i.test(f.name));
            if (!file) return message.reply(toBI("❌ 𝑁𝑜 𝐴𝑃𝐾 𝑓𝑖𝑙𝑒𝑠 𝑓𝑜𝑢𝑛𝑑"));
            fileUrl = `https://archive.org/download/${item.identifier}/${file.name}`;
            return message.reply(toBI(`📱 𝐴𝑃𝐾 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑:\n${item.title}\n🔗 ${fileUrl}`));
        } else if (type === "image") {
            file = files.find(f => /\.(jpe?g|png)$/i.test(f.name));
            if (!file) return message.reply(toBI("❌ 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑓𝑖𝑙𝑒𝑠 𝑓𝑜𝑢𝑛𝑑"));
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
            await message.reply({ 
                body: toBI("✅ 𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑:"),
                attachment: fs.createReadStream(filePath) 
            });
            return deleteAfterTimeout(filePath);
        }

        if (!file) return message.reply(toBI("❌ 𝑁𝑜 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑙𝑒 𝑓𝑖𝑙𝑒 𝑓𝑜𝑢𝑛𝑑"));

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

            await message.reply({
                body: toBI(`📥 ${item.title}\n🕒 ${formatSeconds(duration)}\n✅ 𝐹𝑖𝑙𝑒 𝑎𝑡𝑡𝑎𝑐ℎ𝑒𝑑`),
                attachment: fs.createReadStream(filePath)
            });

            deleteAfterTimeout(filePath);
        } else {
            await message.reply(
                toBI(`📦 ${item.title}\n🕒 ${formatSeconds(duration)}\n🔗 ${fileUrl}`)
            );
        }
    } catch (err) {
        console.error("Archive reply error:", err);
        message.reply(toBI("❌ 𝐸𝑟𝑟𝑜𝑟 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑓𝑖𝑙𝑒 𝑑𝑎𝑡𝑎"));
    }
};
