const { createCanvas } = require("canvas");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "tagall",
    aliases: ["pingall", "mentionall"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 80,
    role: 0,
    category: "system",
    shortDescription: {
      en: "🌟 𝑆𝑜𝑏𝑎𝑖𝑘𝑒 𝑡𝑎𝑔 𝑘𝑜𝑟𝑎 𝑤𝑖𝑡ℎ 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑑𝑒𝑠𝑖𝑔𝑛"
    },
    longDescription: {
      en: "🌟 𝑆𝑜𝑏𝑎𝑖𝑘𝑒 𝑡𝑎𝑔 𝑘𝑜𝑟𝑎 𝑤𝑖𝑡ℎ 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑑𝑒𝑠𝑖𝑔𝑛 𝑎𝑛𝑑 𝑐𝑢𝑠𝑡𝑜𝑚 𝑐𝑎𝑛𝑣𝑎𝑠"
    },
    guide: {
      en: "{𝑝}𝑡𝑎𝑔𝑎𝑙𝑙 [𝑇𝑒𝑥𝑡]"
    },
    dependencies: {
      "canvas": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!createCanvas || !fs) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return api.sendMessage("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.", event.threadID, event.messageID);
      }

      const botID = api.getCurrentUserID();
      
      // 𝐺𝑒𝑡 𝐴𝐹𝐾 𝑢𝑠𝑒𝑟𝑠
      const listAFK = global.moduleData?.["afk"]?.afkList 
        ? Object.keys(global.moduleData["afk"].afkList) 
        : [];

      // 𝐹𝑖𝑙𝑡𝑒𝑟 𝑝𝑎𝑟𝑡𝑖𝑐𝑖𝑝𝑎𝑛𝑡𝑠
      const allUsers = event.participantIDs.filter(id => 
        id !== botID && 
        id !== event.senderID &&
        !listAFK.includes(id)
      );

      // 𝐶𝑎𝑛𝑣𝑎𝑠 𝑠𝑒𝑡𝑢𝑝
      const canvas = createCanvas(1200, 600);
      const ctx = canvas.getContext('2d');
      
      // 𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑔𝑟𝑎𝑑𝑖𝑒𝑛𝑡
      const gradient = ctx.createLinearGradient(0, 0, 1200, 600);
      gradient.addColorStop(0, "#8A2BE2");
      gradient.addColorStop(1, "#1E90FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 600);

      // 𝐷𝑒𝑐𝑜𝑟𝑎𝑡𝑖𝑣𝑒 𝑒𝑙𝑒𝑚𝑒𝑛𝑡𝑠
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(600, 300, 250, 0, Math.PI * 2);
      ctx.stroke();

      // 𝑀𝑎𝑖𝑛 𝑡𝑒𝑥𝑡
      ctx.font = "𝑏𝑜𝑙𝑑 80𝑝𝑥 𝐴𝑟𝑖𝑎𝑙";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "𝑐𝑒𝑛𝑡𝑒𝑟";
      ctx.fillText("💫 𝑃𝐼𝑁𝐺 𝐶𝑂𝑀𝑀𝐴𝑁𝐷 💫", 600, 180);

      // 𝑈𝑠𝑒𝑟 𝑐𝑜𝑢𝑛𝑡 𝑑𝑖𝑠𝑝𝑙𝑎𝑦
      ctx.font = "𝑏𝑜𝑙𝑑 60𝑝𝑥 𝐴𝑟𝑖𝑎𝑙";
      ctx.fillText(`👥 𝑇𝑂𝑇𝐴𝐿 𝑈𝑆𝐸𝑅𝑆: ${allUsers.length}`, 600, 300);

      // 𝐷𝑒𝑐𝑜𝑟𝑎𝑡𝑖𝑣𝑒 𝑒𝑚𝑜𝑗𝑖𝑠
      ctx.font = "𝑏𝑜𝑙𝑑 90𝑝𝑥 𝐴𝑟𝑖𝑎𝑙";
      ctx.fillText("✨🌟⚡🎯", 600, 420);

      // 𝑆𝑎𝑣𝑒 𝑖𝑚𝑎𝑔𝑒
      const path = __dirname + `/cache/ping_${event.threadID}.png`;
      const buffer = canvas.toBuffer();
      fs.writeFileSync(path, buffer);

      // 𝑃𝑟𝑒𝑝𝑎𝑟𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒
      const body = args.join(" ") || "💖 𝑆𝑈𝑆𝐻𝐼 𝐷𝐴𝑅𝑈𝑁 𝐴𝑀𝐴𝐼𝐾𝐸 𝑇𝐴𝐺 𝐾𝑂𝑅𝐴 💖";
      const mentions = allUsers.map(id => ({
        id,
        tag: "‎",
        fromIndex: 0
      }));

      // 𝑆𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡 𝑎𝑛𝑑 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑠
      return api.sendMessage({
        body: `🎯 ${body}\n\n` + 
               "=".repeat(20) + "\n" +
               `🔔 𝑁𝑂𝑇𝐼𝐹𝐸: ${allUsers.length} 𝑢𝑠𝑒𝑟𝑠 𝑡𝑎𝑔𝑔𝑒𝑑!\n` +
               "=".repeat(20),
        attachment: fs.createReadStream(path),
        mentions
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    }
    catch (e) {
      console.error("✨ 𝐸𝑟𝑟𝑜𝑟:", e);
      const botID = api.getCurrentUserID();
      const allUsers = event.participantIDs.filter(id => 
        id !== botID && id !== event.senderID
      );
      
      const body = args.join(" ") || "💫 𝑆𝑜𝑏𝑎𝑖𝑘𝑒 𝑡𝑎𝑔 𝑘𝑜𝑟𝑎 ℎ𝑜𝑙𝑜!";
      const mentions = allUsers.map(id => ({
        id,
        tag: "‎",
        fromIndex: 0
      }));

      return api.sendMessage({
        body: `⚠️ 𝐶𝑎𝑛𝑣𝑎𝑠 𝑒𝑟𝑟𝑜𝑟! 𝑈𝑠𝑖𝑛𝑔 𝑡𝑒𝑥𝑡-𝑜𝑛𝑙𝑦 𝑣𝑒𝑟𝑠𝑖𝑜𝑛:\n\n${body}`,
        mentions
      }, event.threadID, event.messageID);
    }
  }
};
