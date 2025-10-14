const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { URL } = require("url");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "fruitmachine",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "game",
    shortDescription: {
      en: "🎰 𝐹𝑟𝑢𝑖𝑡 𝑠𝑙𝑜𝑡 𝑚𝑎𝑐ℎ𝑖𝑛𝑒 𝑔𝑎𝑚𝑒"
    },
    longDescription: {
      en: "𝑃𝑙𝑎𝑦 𝑓𝑟𝑢𝑖𝑡 𝑠𝑙𝑜𝑡 𝑚𝑎𝑐ℎ𝑖𝑛𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑏𝑒𝑡𝑡𝑖𝑛𝑔"
    },
    guide: {
      en: "{p}fruitmachine [𝑓𝑟𝑢𝑖𝑡 𝑛𝑎𝑚𝑒] [𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "moment-timezone": ""
    }
  },

  // Helper: wait
  __wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  },

  // Robust download with retry/backoff and Retry-After handling
  async __downloadWithRetry(url, destPath, opts = {}) {
    const maxRetries = typeof opts.maxRetries === "number" ? opts.maxRetries : 4;
    const timeout = typeof opts.timeout === "number" ? opts.timeout : 10000;
    const userAgent = opts.userAgent || "chat-ai-he-he/fruitmachine";
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await axios.get(url, {
          responseType: "stream",
          timeout,
          headers: { "User-Agent": userAgent, Accept: "*/*" }
        });

        // If dest directory doesn't exist, create it
        await fs.ensureDir(path.dirname(destPath));

        // If extension was not determined before, try derive from headers
        let finalDest = destPath;
        if (!path.extname(destPath)) {
          const ct = (res.headers["content-type"] || "").toLowerCase();
          const ext = ct.includes("gif") ? ".gif" : ct.includes("png") ? ".png" : ct.includes("jpeg") || ct.includes("jpg") ? ".jpg" : "";
          finalDest = destPath + ext;
        }

        const writer = fs.createWriteStream(finalDest);
        res.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
          res.data.on("error", reject);
        });

        return finalDest; // success, return actual saved path
      } catch (err) {
        const status = err.response?.status;
        // Respect Retry-After if provided on 429
        if (status === 429) {
          const ra = parseInt(err.response?.headers?.["retry-after"] || "0", 10);
          const waitSeconds = ra > 0 ? ra : Math.min(2 ** attempt, 30);
          console.warn(`[fruitmachine] received 429 from ${url}. retrying after ${waitSeconds}s (attempt ${attempt + 1}/${maxRetries})`);
          await this.__wait(waitSeconds * 1000);
          continue;
        }
        // For network-ish errors use exponential backoff
        if (attempt < maxRetries - 1) {
          const backoff = Math.min(1000 * 2 ** attempt, 10000);
          console.warn(`[fruitmachine] download error for ${url} (attempt ${attempt + 1}/${maxRetries}). backing off ${backoff}ms. error:`, err.message || err);
          await this.__wait(backoff);
          continue;
        }
        // Last attempt failed -> throw
        throw err;
      }
    } // end attempts
  },

  onLoad: async function () {
    // Map key => remote URL
    const imageUrls = {
      nho: "https://i.imgur.com/tmKK6Yj.jpg",
      dua: "https://i.imgur.com/mBTKhUW.jpg",
      dao: "https://i.imgur.com/2qgYuDr.jpg",
      tao: "https://i.imgur.com/tXG56lV.jpg",
      dau: "https://i.imgur.com/PLQkfy3.jpg",
      bay: "https://i.imgur.com/1UBI1nc.jpg",
      slot: "https://i.imgur.com/QP7xZz4.gif"
    };

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    // iterate sequentially to avoid hammering the remote host
    for (const [key, url] of Object.entries(imageUrls)) {
      try {
        // derive extension from URL path
        const urlPath = new URL(url).pathname;
        let ext = path.extname(urlPath).toLowerCase();
        // fallback to .jpg if no ext
        if (!ext) ext = ".jpg";
        const desiredPathWithoutExt = path.join(cacheDir, key); // we'll let download decide ext if necessary
        // download with retry; this returns the actual path saved (including ext)
        const savedPath = await this.__downloadWithRetry(url, desiredPathWithoutExt, { maxRetries: 4, timeout: 12000 });
        console.info(`[fruitmachine] saved ${key} -> ${savedPath}`);
      } catch (error) {
        // Log but DO NOT throw — onLoad should not crash the whole bot.
        console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 ${key} 𝑖𝑚𝑎𝑔𝑒:`, error && (error.message || error.toString ? error.toString() : error));
        // Optionally, you could copy a local fallback image into cache here.
        // Example: if you have ./assets/slot-fallback.gif bundled, copy it:
        // if (key === 'slot') await fs.copy(path.join(__dirname,'..','assets','slot-fallback.gif'), path.join(cacheDir,'slot.gif')).catch(()=>{});
      }
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    try {
      const slotItems = ["nho", "dua", "dao", "tao", "dau", "bay"];
      const userData = (await usersData.get(event.senderID)) || {};
      const userMoney = typeof userData.money === "number" ? userData.money : 0;

      if (!args[0] || !args[1]) {
        return message.reply("𝑈𝑠𝑒: {p}fruitmachine [𝑔𝑟𝑎𝑝𝑒/𝑚𝑒𝑙𝑜𝑛/𝑝𝑒𝑎𝑐ℎ/𝑎𝑝𝑝𝑙𝑒/𝑠𝑡𝑟𝑎𝑤𝑏𝑒𝑟𝑟𝑦/𝑠𝑒𝑣𝑒𝑛] [𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡]");
      }

      const fruitChoice = args[0].toLowerCase();
      const betAmount = parseInt(args[1]);
      if (isNaN(betAmount) || betAmount <= 0) {
        return message.reply("𝐵𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑎 𝑝𝑜𝑠𝑖𝑡𝑖𝑣𝑒 𝑛𝑢𝑚𝑏𝑒𝑟");
      }
      if (betAmount > userMoney) {
        return message.reply("𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑒𝑛𝑜𝑢𝑔ℎ 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑏𝑒𝑡 𝑡ℎ𝑎𝑡 𝑎𝑚𝑜𝑢𝑛𝑡");
      }
      if (betAmount < 10000) {
        return message.reply("𝑀𝑖𝑛𝑖𝑚𝑢𝑚 𝑏𝑒𝑡 𝑖𝑠 10000");
      }

      const fruitIcons = {
        nho: "🍇",
        dua: "🍉",
        dao: "🍑",
        tao: "🍎",
        dau: "🍓",
        bay: "➐"
      };

      if (!fruitIcons[fruitChoice]) {
        return message.reply("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑟𝑢𝑖𝑡 𝑐ℎ𝑜𝑖𝑐𝑒. 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒: 𝑔𝑟𝑎𝑝𝑒, 𝑚𝑒𝑙𝑜𝑛, 𝑝𝑒𝑎𝑐ℎ, 𝑎𝑝𝑝𝑙𝑒, 𝑠𝑡𝑟𝑎𝑤𝑏𝑒𝑟𝑟𝑦, 𝑠𝑒𝑣𝑒𝑛");
      }

      // generate results
      const results = [];
      for (let i = 0; i < 3; i++) {
        results[i] = slotItems[Math.floor(Math.random() * slotItems.length)];
      }

      const resultIcons = results.map((fruit) => fruitIcons[fruit] || "❓");

      // prepare image attachments (only include those present in cache)
      const cacheDir = path.join(__dirname, "cache");
      const resultImages = [];
      for (const fruit of results) {
        // find any matching file for this fruit key in cache (extensions may vary)
        const jpg = path.join(cacheDir, `${fruit}.jpg`);
        const png = path.join(cacheDir, `${fruit}.png`);
        const gif = path.join(cacheDir, `${fruit}.gif`);
        let chosen = null;
        if (await fs.pathExists(jpg)) chosen = jpg;
        else if (await fs.pathExists(png)) chosen = png;
        else if (await fs.pathExists(gif)) chosen = gif;
        // push readable stream only if file exists
        if (chosen) resultImages.push(fs.createReadStream(chosen));
      }

      // choose slot animation path for spinning message
      let slotAnimPath = null;
      const g1 = path.join(cacheDir, "slot.gif");
      const g2 = path.join(cacheDir, "slot.jpg");
      if (await fs.pathExists(g1)) slotAnimPath = g1;
      else if (await fs.pathExists(g2)) slotAnimPath = g2;

      // Send spinning message (with animation if available)
      const spinningMsgPayload = { body: "𝑆𝑝𝑖𝑛𝑛𝑖𝑛𝑔..." };
      if (slotAnimPath) spinningMsgPayload.attachment = fs.createReadStream(slotAnimPath);
      const spinningMessage = await message.reply(spinningMsgPayload);

      // simulate spin time
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // compute win/loss
      const matchCount = results.filter((r) => r === fruitChoice).length;
      let winAmount = 0;
      let resultMessage = "";

      if (matchCount > 0) {
        winAmount = betAmount * matchCount;
        await usersData.set(event.senderID, {
          money: userMoney + winAmount,
          data: userData.data || {}
        });
        resultMessage = `[ 𝐹𝑅𝑈𝐼𝑇 𝑀𝐴𝐶𝐻𝐼𝑁𝐸 ]\n━━━━━━━━━━━━━━━━━━\n${resultIcons.join(" | ")}\n\n𝑌𝑜𝑢 𝑔𝑜𝑡 ${matchCount} ${fruitIcons[fruitChoice]}\n𝑌𝑜𝑢 𝑤𝑜𝑛: ${winAmount}\n𝑁𝑒𝑤 𝑏𝑎𝑙𝑎𝑛𝑐𝑒: ${userMoney + winAmount}`;
      } else {
        await usersData.set(event.senderID, {
          money: userMoney - betAmount,
          data: userData.data || {}
        });
        resultMessage = `[ 𝐹𝑅𝑈𝐼𝑇 𝑀𝐴𝐶𝐻𝐼𝑁𝐸 ]\n━━━━━━━━━━━━━━━━━━\n${resultIcons.join(" | ")}\n\n𝑁𝑜 ${fruitIcons[fruitChoice]} 𝑓𝑜𝑢𝑛𝑑\n𝑌𝑜𝑢 𝑙𝑜𝑠𝑡: ${betAmount}\n𝑁𝑒𝑤 𝑏𝑎𝑙𝑎𝑛𝑐𝑒: ${userMoney - betAmount}`;
      }

      // send result message with any available images (attachments optional)
      const replyPayload = { body: resultMessage };
      if (resultImages.length > 0) replyPayload.attachment = resultImages;
      await message.reply(replyPayload);
    } catch (error) {
      console.error("𝐹𝑟𝑢𝑖𝑡 𝑀𝑎𝑐ℎ𝑖𝑛𝑒 𝐸𝑟𝑟𝑜𝑟:", error && (error.stack || error.message || error));
      try {
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑙𝑎𝑦𝑖𝑛𝑔 𝑡𝑕𝑒 𝑓𝑟𝑢𝑖𝑡 𝑚𝑎𝑐ℎ𝑖𝑛𝑒.");
      } catch (e) {
        console.error("[fruitmachine] failed to send error reply:", e);
      }
    }
  }
};
