const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "grouptag",
    aliases: ["gtag", "alltag"],
    version: "0.0.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 80,
    role: 1,
    category: "group",
    shortDescription: {
      en: "𝐺𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟 𝑡𝑎𝑔𝑔𝑖𝑛𝑔 𝑤𝑖𝑡ℎ 𝑠𝑡𝑦𝑙𝑖𝑠ℎ ℎ𝑒𝑎𝑑𝑒𝑟"
    },
    longDescription: {
      en: "𝑇𝑎𝑔 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑎 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑐𝑢𝑠𝑡𝑜𝑚 ℎ𝑒𝑎𝑑𝑒𝑟"
    },
    guide: {
      en: "{𝑝}𝑔𝑟𝑜𝑢𝑝𝑡𝑎𝑔 [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": ""
    }
  },

  onStart: async function({ api, event, args, threadsData }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!axios || !fs || !createCanvas || !loadImage) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return api.sendMessage("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑐𝑎𝑛𝑣𝑎𝑠.", event.threadID, event.messageID);
      }

      // 𝐺𝑒𝑡 𝑝𝑎𝑟𝑡𝑖𝑐𝑖𝑝𝑎𝑛𝑡 𝐼𝐷𝑠
      const threadInfo = await threadsData.getInfo(event.threadID);
      let all = threadInfo.participantIDs;
      all = all.filter(id => id !== api.getCurrentUserID() && id !== event.senderID);
      
      // 𝐶𝑟𝑒𝑎𝑡𝑒 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑐𝑎𝑛𝑣𝑎𝑠 ℎ𝑒𝑎𝑑𝑒𝑟
      const width = 1000;
      const height = 300;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // 𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑔𝑟𝑎𝑑𝑖𝑒𝑛𝑡
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "#8A2BE2");
      gradient.addColorStop(1, "#1E90FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 𝐴𝑑𝑑 𝑑𝑒𝑐𝑜𝑟𝑎𝑡𝑖𝑣𝑒 𝑒𝑙𝑒𝑚𝑒𝑛𝑡𝑠
      ctx.fillStyle = "𝑟𝑔𝑏𝑎(255, 255, 255, 0.1)";
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 30 + 10,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // 𝑆𝑡𝑦𝑙𝑒𝑑 𝑡𝑒𝑥𝑡
      ctx.font = "𝑏𝑜𝑙𝑑 60𝑝𝑥 𝐴𝑟𝑖𝑎𝑙";
      ctx.fillStyle = "#𝑊ℎ𝑖𝑡𝑒";
      ctx.textAlign = "𝑐𝑒𝑛𝑡𝑒𝑟";
      ctx.textBaseline = "𝑚𝑖𝑑𝑑𝑙𝑒";
      ctx.shadowColor = "𝑟𝑔𝑏𝑎(0, 0, 0, 0.5)";
      ctx.shadowBlur = 10;
      ctx.fillText("📢 𝐺𝑅𝑂𝑈𝑃 𝑀𝐸𝑁𝑇𝐼𝑂𝑁 📢", width / 2, height / 2);

      // 𝑆𝑎𝑣𝑒 𝑖𝑚𝑎𝑔𝑒
      const pathImg = __dirname + '/cache/pingv2_header.png';
      const buffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, buffer);

      // 𝑃𝑟𝑒𝑝𝑎𝑟𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑏𝑜𝑑𝑦
      const defaultMsg = "✨ 𝐴𝑑𝑚𝑖𝑛 𝑡𝑢𝑚𝑎𝑘𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑘𝑜𝑟𝑒𝑐ℎ𝑒 ✨";
      const customMsg = args.join(" ");
      const body = customMsg || defaultMsg;
      
      // 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑠
      const mentions = [];
      for (let i = 0; i < all.length; i++) {
        if (i === body.length) body += body.charAt(body.length - 1);
        mentions.push({
          tag: body[i],
          id: all[i],
          fromIndex: i
        });
      }

      // 𝑆𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑠𝑡𝑦𝑙𝑒𝑑 ℎ𝑒𝑎𝑑𝑒𝑟
      return api.sendMessage({
        body: `🎯 ${body}\n\n${all.length} 𝑗𝑎𝑛 𝑚𝑒𝑚𝑏𝑎𝑟 𝑘𝑒 𝑡𝑎𝑔 𝑘𝑜𝑟𝑎 ℎ𝑜𝑙𝑜! 💫`,
        attachment: fs.createReadStream(pathImg),
        mentions
      }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);

    } catch (e) {
      console.error(e);
      return api.sendMessage(`❌ 𝑇𝑎𝑔 𝑘𝑜𝑟𝑡𝑒 𝑠𝑜𝑚𝑜𝑠𝑠𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒:\n${e.message}`, event.threadID);
    }
  }
};
