module.exports = {
  config: {
    name: "vtuber",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑹𝒂𝒏𝒅𝒐𝒎 𝑽𝑻𝒖𝒃𝒆𝒓 𝒆𝒓 𝒄𝒉𝒉𝒐𝒃𝒊 𝒕𝒐𝒊𝒓𝒊 𝒌𝒐𝒓𝒖𝒏",
    category: "vtuber",
    usages: "[gura/marine/rushia/pekora/coco/korone/amelia/fubuki/okayu/watame/uto/chloe/ayame/polka/botan/aloe]",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs");
    const path = require("path");

    const { threadID, messageID } = event;

    // normalize input
    const input = args && args[0] ? args[0].toString().toLowerCase() : "";

    // map synonyms to canonical types
    let type;
    switch (input) {
      case "rushia":
        type = "rushia";
        break;
      case "pekora":
      case "peko":
        type = "pekora";
        break;
      case "coco":
        type = "coco";
        break;
      case "gura":
      case "gawr":
        type = "gura";
        break;
      case "marine":
      case "marin":
        type = "marine";
        break;
      case "korone":
        type = "korone";
        break;
      case "amelia":
      case "ame":
        type = "amelia";
        break;
      case "fubuki":
        type = "fubuki";
        break;
      case "okayu":
        type = "okayu";
        break;
      case "watame":
        type = "watame";
        break;
      case "uto":
        type = "uto";
        break;
      case "chloe":
        type = "chloe";
        break;
      case "ayame":
        type = "ayame";
        break;
      case "polka":
        type = "polka";
        break;
      case "botan":
        type = "botan";
        break;
      case "aloe":
        type = "aloe";
        break;
      default:
        return api.sendMessage(
          `𝑪𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝒆𝒓 𝒍𝒊𝒔𝒕:\n[gura/marine/rushia/pekora/coco/korone/amelia/fubuki/okayu/watame/uto/chloe/ayame/polka/botan/aloe]\n\n𝑼𝒅𝒂𝒉𝒐𝒓𝒐𝒏:\n${global.config && global.config.PREFIX ? global.config.PREFIX : ""}vtuber gura`,
          threadID,
          messageID
        );
    }

    // 𝑩𝒂𝒄𝒌𝒖𝒑 𝑨𝑷𝑰 𝒍𝒊𝒔𝒕 (DO NOT CHANGE)
    const apis = [
      `https://api.randvtuber-saikidesu.ml?character=${type}`,
      `https://api.waifu.pics/sfw/waifu`,
      `https://nekos.life/api/v2/img/neko`,
      `https://api.nekosapi.com/v2/images/neko`
    ];

    // ensure cache folder exists
    const cacheDir = path.join(__dirname, "cache");
    try {
      fs.mkdirSync(cacheDir, { recursive: true });
    } catch (e) {
      // ignore
    }

    let success = false;

    for (let i = 0; i < apis.length; i++) {
      try {
        const res = await axios.get(apis[i]);
        let imageUrl = null;
        let name = type;
        let count = "𝑵/𝑨";
        let author = "𝑽𝒂𝒓𝒊𝒐𝒖𝒔";

        // Primary API assumed structure (keeps original behavior)
        if (i === 0 && res.data) {
          // some APIs use 'url' field, some may return differently
          if (res.data.url) imageUrl = res.data.url;
          else if (res.data.image) imageUrl = res.data.image;
          else if (res.data.data && res.data.data.url) imageUrl = res.data.data.url;

          name = res.data.name || res.data.title || name;
          count = res.data.count || count;
          author = res.data.author || author;
        } else if (res.data) {
          // backup APIs handling common response shapes
          if (res.data.url) imageUrl = res.data.url;
          else if (res.data.message) imageUrl = res.data.message; // nekos.life sometimes returns { message: url }
          else if (res.data.file) imageUrl = res.data.file;
          else if (typeof res.data === "string" && res.data.startsWith("http")) imageUrl = res.data;
        }

        if (!imageUrl) {
          // try to parse JSON with nested properties (defensive)
          // skip to next API if none found
          continue;
        }

        // determine extension safely
        let ext = imageUrl.split("?")[0].split(".").pop();
        if (!ext || ext.length > 5) ext = "jpg";

        const filePath = path.join(cacheDir, `${type}.${ext}`);

        // download with axios stream
        const imageResp = await axios({
          url: imageUrl,
          method: "GET",
          responseType: "stream",
          timeout: 15000
        });

        const writer = fs.createWriteStream(filePath);

        // pipe and wait for finish
        await new Promise((resolve, reject) => {
          imageResp.data.pipe(writer);
          let error = null;
          writer.on("error", err => {
            error = err;
            writer.close();
            reject(err);
          });
          writer.on("close", () => {
            if (!error) resolve();
          });
        });

        // send message with attachment
        const msgBody = `=== ${name} ===\n𝑼𝒑𝒂𝒍𝒐𝒃𝒅𝒉𝒐: ${count}\n𝑳𝒆𝒌𝒉𝒐𝒌: ${author}\n\n𝑪𝒓𝒆𝒅𝒊𝒕𝒔: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;

        api.sendMessage(
          {
            body: msgBody,
            attachment: fs.createReadStream(filePath)
          },
          threadID,
          (err) => {
            // cleanup file after sending (safe)
            try {
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (e) {}
            // react if possible
            try {
              api.setMessageReaction("✅", messageID, () => {}, true);
            } catch (e) {}
            if (err) console.error(err);
          },
          messageID
        );

        success = true;
        break;
      } catch (err) {
        // log and continue to next API
        console.error(`API ${apis[i]} error:`, err && err.message ? err.message : err);
        continue;
      }
    } // end for

    if (!success) {
      api.sendMessage(
        "𝑪𝒉𝒉𝒐𝒃𝒊 𝒕𝒐𝒊𝒓𝒊 𝒌𝒐𝒓𝒕𝒆 𝒔𝒐𝒎𝒐𝒔𝒔𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆, 𝒂𝒃𝒂𝒓 𝒄𝒉𝒆𝒔𝒉𝒕𝒂 𝒌𝒐𝒓𝒖𝒏!",
        threadID,
        messageID
      );
      try {
        api.setMessageReaction("☹️", messageID, () => {}, true);
      } catch (e) {}
    }
  }
};
