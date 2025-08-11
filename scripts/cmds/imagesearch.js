module.exports.config = {
  name: "imagesearch",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑰𝒎𝒂𝒈𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒌𝒐𝒓𝒖𝒏",
  commandCategory: "𝑰𝒎𝒂𝒈𝒆",
  usages: "𝒊𝒎𝒂𝒈𝒆𝒔𝒆𝒂𝒓𝒄𝒉 [𝒕𝒆𝒙𝒕]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "googlethis": "",
    "cloudscraper": ""
  }
};

module.exports.run = async ({ event, api, args }) => {
  const axios = global.nodemodule['axios'];
  const google = global.nodemodule["googlethis"];
  const cloudscraper = global.nodemodule["cloudscraper"];
  const fs = global.nodemodule["fs-extra"];
  
  try {
    let query = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
    if (!query) return api.sendMessage("𝑰𝒎𝒂𝒈𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒌𝒐𝒓𝒕𝒆 𝒌𝒊𝒔𝒖 𝒏𝒂𝒎 𝒅𝒊𝒚𝒆𝒏? 🔍", event.threadID, event.messageID);
    
    api.sendMessage(`🔍 "${query}" 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒊𝒎𝒂𝒈𝒆 𝒌𝒉𝒖𝒏𝒄𝒉𝒊...`, event.threadID, event.messageID);

    let result = await google.image(query, { safe: false });
    if (result.length === 0) {
      api.sendMessage(`⚠️ "${query}" 𝒆𝒓 𝒌𝒐𝒏𝒐 𝒊𝒎𝒂𝒈𝒆 𝒑𝒂𝒘𝒂 𝒋𝒂𝒊𝒏𝒊 𝒏𝒂𝒊`, event.threadID, event.messageID);
      return;
    }

    let streams = [];
    let counter = 0;

    for (let image of result) {
      if (counter >= 6) break;

      let url = image.url;
      if (!url.endsWith(".jpg") && !url.endsWith(".png") && !url.endsWith(".jpeg")) continue;

      let path = __dirname + `/cache/search-image-${counter}.jpg`;
      let hasError = false;
      
      await cloudscraper.get({ uri: url, encoding: null })
        .then((buffer) => fs.writeFileSync(path, buffer))
        .catch((error) => {
          console.log(error);
          hasError = true;
        });

      if (hasError) continue;

      streams.push(fs.createReadStream(path).on("end", async () => {
        if (fs.existsSync(path)) {
          fs.unlink(path, (err) => {
            if (err) console.log(`𝑭𝒂𝒊𝒍 𝒕𝒐 𝒅𝒆𝒍𝒆𝒕𝒆: ${path}`, err);
          });
        }
      }));

      counter += 1;
    }

    if (streams.length === 0) {
      return api.sendMessage("⚠️ 𝑲𝒐𝒏𝒐 𝒊𝒎𝒂𝒈𝒆 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊", event.threadID, event.messageID);
    }

    api.sendMessage("⏳ 𝑰𝒎𝒂𝒈𝒆 𝒈𝒖𝒍𝒊 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒄𝒄𝒉𝒆...", event.threadID, event.messageID);

    let msg = {
      body: `══════════════════\n🖼️ 𝑰𝒎𝒂𝒈𝒆 𝑺𝒆𝒂𝒓𝒄𝒉 𝑹𝒆𝒔𝒖𝒍𝒕\n"${query}"\n\n𝑭𝒐𝒖𝒏𝒅: ${result.length} 𝒊𝒎𝒂𝒈𝒆${result.length > 1 ? '𝒔' : ''}\n𝑺𝒉𝒐𝒘𝒊𝒏𝒈: ${streams.length} 𝒊𝒎𝒂𝒈𝒆𝒔\n══════════════════`,
      attachment: streams
    };

    api.sendMessage(msg, event.threadID, event.messageID);
  } catch (e) {
    console.log("𝑬𝑹𝑹𝑶𝑹: " + e);
    api.sendMessage("⚠️ 𝑬𝒓𝒓𝒐𝒓: " + e.message, event.threadID, event.messageID);
  }
};
