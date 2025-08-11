const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// 🔒 Enhanced security with immutable credits
const lockedCredits = Object.freeze("𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅");
const lockedTagline = Object.freeze("💚 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅");

// 🔐 Tamper-proof verification
function verifyTagline(text) {
  if (!text.includes(lockedTagline)) {
    throw new Error("🚫 𝑼𝒏𝒂𝒖𝒕𝒉𝒐𝒓𝒊𝒛𝒆𝒅 𝒎𝒐𝒅𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒅𝒆𝒕𝒆𝒄𝒕𝒆𝒅: '𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅' 𝒘𝒂𝒔 𝒓𝒆𝒎𝒐𝒗𝒆𝒅 𝒐𝒓 𝒂𝒍𝒕𝒆𝒓𝒆𝒅.");
  }
}

module.exports.config = {
  name: "pintrest",
  version: "2.0.0",
  hasPermssion: 0,
  get credits() {
    return lockedCredits;
  },
  set credits(_) {
    throw new Error("❌ 𝑪𝒓𝒆𝒅𝒊𝒕𝒔 𝒂𝒓𝒆 𝒍𝒐𝒄𝒌𝒆𝒅 𝒂𝒏𝒅 𝒄𝒂𝒏𝒏𝒐𝒕 𝒃𝒆 𝒎𝒐𝒅𝒊𝒇𝒊𝒆𝒅.");
  },
  description: "𝑭𝒆𝒕𝒄𝒉 𝒄𝒐𝒖𝒑𝒍𝒆 𝒅𝒑 𝒊𝒎𝒂𝒈𝒆𝒔 𝒇𝒓𝒐𝒎 𝑷𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 𝑨𝑷𝑰 𝒔𝒆𝒓𝒗𝒆𝒓",
  commandCategory: "𝒇𝒖𝒏",
  usages: "+𝒄𝒐𝒖𝒑𝒍𝒆𝒅𝒑 𝒚𝒐𝒖𝒓 𝒒𝒖𝒆𝒓𝒚 - 𝒏𝒖𝒎𝒃𝒆𝒓",
  cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const q = args.join(" ");
    if (!q.includes("-")) {
      return api.sendMessage("⚠️ 𝑼𝒔𝒂𝒈𝒆: +𝒄𝒐𝒖𝒑𝒍𝒆𝒅𝒑 𝒚𝒐𝒖𝒓 𝒒𝒖𝒆𝒓𝒚 - 𝒏𝒖𝒎𝒃𝒆𝒓\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆: +𝒄𝒐𝒖𝒑𝒍𝒆𝒅𝒑 𝒎𝒐𝒉𝒊𝒕 𝒓𝒊𝒚𝒂 - 𝟐", event.threadID);
    }

    const query = q.substring(0, q.indexOf("-")).trim();
    const count = parseInt(q.split("-").pop().trim()) || 1;

    const cachePath = path.join(__dirname, "cache");
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

    // 🔒 Original server URL maintained
    const url = `https://rudra-pintrest-server-wg55.onrender.com/dp?q=${encodeURIComponent(query)}&n=${count}`;
    const res = await axios.get(url, { timeout: 10000 });

    if (!res.data || res.data.status !== "success" || !res.data.data.length) {
      return api.sendMessage("❌ 𝑪𝒐𝒖𝒍𝒅𝒏'𝒕 𝒇𝒆𝒕𝒄𝒉 𝑫𝑷𝒔. 𝑻𝒓𝒚 𝒂𝒏𝒐𝒕𝒉𝒆𝒓 𝒌𝒆𝒚𝒘𝒐𝒓𝒅.", event.threadID);
    }

    const images = res.data.data;
    const attachments = [];

    for (let i = 0; i < images.length; i++) {
      const imgPath = path.join(cachePath, `dp_${Date.now()}_${i}.jpg`);
      const imgBuffer = (await axios.get(images[i], { 
        responseType: "arraybuffer",
        timeout: 15000 
      })).data;
      
      fs.writeFileSync(imgPath, imgBuffer);
      attachments.push(fs.createReadStream(imgPath));
    }

    // 🔒 Protected caption with verified tagline
    const caption = `📸 𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 *${count}* 𝒔𝒕𝒚𝒍𝒊𝒔𝒉 𝑫𝑷 (${query})\n${lockedTagline}`;
    verifyTagline(caption);

    api.sendMessage({
      body: caption,
      attachment: attachments
    }, event.threadID, () => {
      attachments.forEach(stream => {
        const filePath = stream.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }, event.messageID);

  } catch (err) {
    console.error("[𝑷𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 𝑬𝑹𝑹𝑶𝑹]", err.message);
    api.sendMessage("🚫 𝑺𝒐𝒎𝒆𝒕𝒉𝒊𝒏𝒈 𝒘𝒆𝒏𝒕 𝒘𝒓𝒐𝒏𝒈 𝒘𝒉𝒊𝒍𝒆 𝒇𝒆𝒕𝒄𝒉𝒊𝒏𝒈 𝑪𝒐𝒖𝒑𝒍𝒆 𝑫𝑷𝒔. 𝑻𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.", event.threadID, event.messageID);
  }
};
