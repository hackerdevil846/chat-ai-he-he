const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ✨ 1. HIGH QUALITY IMAGE LIST
const images = [
  "https://i.ibb.co/KxBqKCMD/1755944202493-0-5154647769363978.jpg",
  "https://i.ibb.co/nMp3sVqB/1755944203527-0-6844357499391724.jpg",
  "https://i.ibb.co/9mybjRXR/1755944204633-0-8237185596125263.jpg",
  "https://i.ibb.co/CqDK9tp/1755944205593-0-15451265481144683.jpg",
  "https://i.ibb.co/NgvhwTHb/1755944206713-0-9248399418413817.jpg",
  "https://i.ibb.co/1fJVfkW0/1755944207548-0-8771376215258824.jpg",
  "https://i.ibb.co/ZR11HLYW/1755944208450-0-8410728131461191.jpg",
  "https://i.ibb.co/xqx5dYHz/1755944209281-0-09026138149100027.jpg",
  "https://i.ibb.co/zWQ1XnjB/image.jpg"
];

// ✨ 2. LOCAL BACKUP SHAYARI (In case API fails)
const localShayaris = [
  "Tum mile to laga mujhe, ki mil gayi hai har khushi.",
  "Zindagi mein har pal nayi umeed rakho, bas chalta rahe ye karwan.",
  "Dil ki baat chupati ho, humse kyun sharmati ho?",
  "Ishq wo nahi jo duniya ko dikhaya jaye, ishq wo hai jo dil se nibhaya jaye.",
  "Tere bina zindagi adhoori si lagti hai, tu hai to har kami poori si lagti hai.",
  "Koshish karne walon ki kabhi haar nahi hoti.",
  "Mohabbat barsa dena tu, sawan aaya hai.",
  "Phoolon ki tarah muskurana seekho, kaanton mein bhi khilkhilana seekho.",
  "Dosti wo nahi jo jaan deti hai, dosti wo hai jo muskaan deti hai.",
  "Waqt badalta hai zindagi ke saath, zindagi badalti hai waqt ke saath."
];

// ✨ Helper: Dark Font Converter
const toDarkFont = (text) => {
  const map = {
    A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇", I: "𝐈", J: "𝐉", K: "𝐊", L: "𝐋", M: "𝐌",
    N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑", S: "𝐒", T: "𝐓", U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙",
    a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡", i: "𝐢", j: "𝐣", k: "𝐤", l: "𝐥", m: "𝐦",
    n: "𝐧", o: "𝐨", p: "𝐩", q: "𝐪", r: "𝐫", s: "𝐬", t: "𝐭", u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱", y: "𝐲", z: "𝐳"
  };
  return text.split("").map(c => map[c] || c).join("");
};

// ✨ Helper: Language Detection & Translation
async function translateToBengali(text) {
  if (/[\u0980-\u09FF]/.test(text)) return text; // Already Bengali
  try {
    const res = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|bn`);
    return res.data?.responseData?.translatedText || text;
  } catch (e) {
    return text; // Return original if translation fails
  }
}

// ✨ Helper: Reliable Image Stream
async function getStream(url) {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  });
  return response.data;
}

module.exports = {
  config: {
    name: "shayari",
    aliases: [],
    version: "3.0.0", // Upgraded
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: toDarkFont("Random Shayari with Bengali Translation")
    },
    longDescription: {
      en: toDarkFont("Fetches premium Shayari, translates to Bengali, and supports reply interaction.")
    },
    guide: {
      en: "{p}shayari"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  // 🔄 3. REPLY FUNCTION (Interactive Mode)
  handleReply: async function({ api, event, handleReply }) {
    const { body, threadID, messageID, senderID } = event;
    if (senderID !== handleReply.author) return;

    const cmd = body.toLowerCase();
    if (["next", "more", "aro", "abar", "new"].includes(cmd)) {
      // Re-trigger the main logic
      this.onStart({ api, event, message: { reply: api.sendMessage }, args: [] });
    }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID, senderID } = event;
    
    // Send Loading Message
    const loadingMsg = await api.sendMessage("⏳ | 𝑺𝒉𝒂𝒚𝒂𝒓𝒊 𝒂𝒏𝒂𝒚𝒐𝒏 𝒄𝒉𝒖𝒕𝒆𝒄𝒉𝒊...", threadID);

    try {
      // A. GET SHAYARI (Multi-Source Strategy)
      let rawShayari = "";
      
      try {
        // Source 1: Primary API
        const res1 = await axios.get("https://api.princetechn.com/api/fun/shayari?apikey=prince", { timeout: 5000 });
        if (res1.data?.result) rawShayari = res1.data.result;
        else throw new Error("API 1 Failed");
      } catch (e1) {
        try {
          // Source 2: Secondary API (Backup)
          const res2 = await axios.get("https://shayari-api-eta.vercel.app/api/shayari", { timeout: 5000 });
          if (res2.data) rawShayari = res2.data; // Adjust based on API response structure
          else throw new Error("API 2 Failed");
        } catch (e2) {
          // Source 3: Local Backup (Guaranteed to work)
          rawShayari = localShayaris[Math.floor(Math.random() * localShayaris.length)];
        }
      }

      // B. TRANSLATE
      let finalShayari = await translateToBengali(rawShayari);

      // C. STYLING
      const heading = toDarkFont("💌 𝖠𝗉𝗇𝖺𝗋 𝗃𝗈𝗇𝗒𝗈 𝗌𝗁𝖺𝗒𝖺𝗋𝗂");
      const darkShayari = toDarkFont(finalShayari);
      const footer = "💡 𝑹𝒆𝒑𝒍𝒚 '𝒏𝒆𝒙𝒕' 𝒇𝒐𝒓 𝒎𝒐𝒓𝒆!";

      // D. GET IMAGE
      const randomImage = images[Math.floor(Math.random() * images.length)];
      const imageStream = await getStream(randomImage);

      // E. SEND RESULT
      const msgData = {
        body: `${heading}\n\n${darkShayari}\n\n━━━━━━━━━━━━━━━━━━\n${footer}`,
        attachment: imageStream
      };

      api.sendMessage(msgData, threadID, (err, info) => {
        if (!err) {
          // Register Reply Handler
          global.client.handleReply.push({
            name: "shayari",
            messageID: info.messageID,
            author: senderID
          });
        }
      });

      // Cleanup Loading Message
      api.unsendMessage(loadingMsg.messageID);

    } catch (error) {
      console.error("Shayari Error:", error);
      api.unsendMessage(loadingMsg.messageID);
      api.sendMessage("❌ | 𝑺𝒐𝒎𝒆𝒕𝒉𝒊𝒏𝒈 𝒘𝒆𝒏𝒕 𝒘𝒓𝒐𝒏𝒈. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏.", threadID, messageID);
    }
  }
};
