const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

// ✨ Helper: Convert text to Dark Stylish Font (Bold Serif)
const toStylish = (text) => {
  const map = {
    A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇", I: "𝐈", J: "𝐉", K: "𝐊", L: "𝐋", M: "𝐌",
    N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑", S: "𝐒", T: "𝐓", U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙",
    a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡", i: "𝐢", j: "𝐣", k: "𝐤", l: "𝐥", m: "𝐦",
    n: "𝐧", o: "𝐨", p: "𝐩", q: "𝐪", r: "𝐫", s: "𝐬", t: "𝐭", u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱", y: "𝐲", z: "𝐳",
    0: "𝟎", 1: "𝟏", 2: "𝟐", 3: "𝟑", 4: "𝟒", 5: "𝟓", 6: "𝟔", 7: "𝟕", 8: "𝟖", 9: "𝟗",
    "?": "❓", "!": "❗"
  };
  return text.split("").map(c => map[c] || c).join("");
};

module.exports = {
  config: {
    name: "rip",
    aliases: [],
    version: "2.5.0", // Updated version
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: toStylish("Create a RIP Tombstone")
    },
    longDescription: {
      en: toStylish("Generates a funny RIP tombstone meme with the user's profile picture.")
    },
    guide: {
      en: "{p}rip [@mention]"
    },
    dependencies: {
      "discord-image-generation": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, `rip_${Date.now()}.png`);

    try {
      // 1. Dependency Check
      try {
        require("discord-image-generation");
        require("fs-extra");
      } catch (e) {
        return api.sendMessage("❌ | Missing 'discord-image-generation'. Please install it.", threadID, messageID);
      }

      // 2. Identify Target User
      let targetID = senderID;
      if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
      }

      // 3. Get User Name for Message
      const userInfo = await api.getUserInfo(targetID);
      const name = userInfo[targetID]?.name || "User";

      // 4. Send Processing Message
      const processingMsg = await api.sendMessage(`⚰️ | ${toStylish("Engraving the tombstone...")}`, threadID);

      // 5. Ensure Cache Directory Exists
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // 6. Get Avatar URL (Using Graph API for reliability)
      // This is the FIX: Using a direct token link ensures the image generator doesn't fail.
      const avatarURL = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // 7. Generate Image
      const imgBuffer = await new DIG.Rip().getImage(avatarURL);

      // 8. Save File
      await fs.writeFile(filePath, imgBuffer);

      // 9. Send Result
      const msgBody = `🪦 ${toStylish("Rest In Peace")} ${name}...\n\n🥀 ${toStylish("You will be missed.")}`;
      
      await api.sendMessage({
        body: msgBody,
        attachment: fs.createReadStream(filePath)
      }, threadID, messageID);

      // 10. Cleanup
      api.unsendMessage(processingMsg.messageID);
      fs.unlinkSync(filePath);

    } catch (error) {
      console.error("RIP Command Error:", error);
      api.sendMessage(`❌ | ${toStylish("Failed to create tombstone. Please try again.")}`, threadID, messageID);
    }
  }
};
