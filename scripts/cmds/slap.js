module.exports.config = {
  name: "slap",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑱𝒂𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒂 𝒉𝒂𝒍𝒂𝒌 𝒌𝒆 𝒔𝒍𝒂𝒑 𝒎𝒂𝒓𝒂",
  category: "general",
  usages: "slap [@tag]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "request": "",
    "fs-extra": ""
  }
};

module.exports.onLoad = function () {
  const fs = global.nodemodule && global.nodemodule["fs-extra"] ? global.nodemodule["fs-extra"] : require("fs");
  const path = __dirname + "/cache";
  try {
    if (!fs.existsSync(path)) fs.mkdirSync(path);
  } catch (e) {
    // ignore - best effort to ensure cache exists
  }
};

module.exports.run = async function ({ api, event, args }) {
  const axios = global.nodemodule && global.nodemodule["axios"] ? global.nodemodule["axios"] : require("axios");
  const request = global.nodemodule && global.nodemodule["request"] ? global.nodemodule["request"] : require("request");
  const fs = global.nodemodule && global.nodemodule["fs-extra"] ? global.nodemodule["fs-extra"] : require("fs");
  const threadID = event.threadID;
  const messageID = event.messageID;

  // validation: need args (but we prefer mention check)
  if (!args.join("").length) {
    return api.sendMessage("❌ দয়া করে একজনকে ট্যাগ করে বলুন — কে স্ল্যাপ মারতে চান তা ট্যাগ দিন!", threadID, messageID);
  }

  const mentionIds = Object.keys(event.mentions || {});
  if (!mentionIds.length) {
    return api.sendMessage("❌ ট্যাগ পাওয়া যায়নি! দয়া করে যে ব্যক্তিকে স্ল্যাপ দেবেন, তাঁকে মেনশন করে পাঠান.", threadID, messageID);
  }

  const mentionId = mentionIds[0];
  // event.mentions[mentionId] is usually the name string
  let tagName = event.mentions[mentionId] || "user";
  try {
    // fetch slap gif/url from waifu.pics (kept link unchanged)
    const res = await axios.get("https://api.waifu.pics/sfw/slap");
    const getURL = res.data && res.data.url ? res.data.url : null;
    if (!getURL) throw new Error("No URL returned from API.");

    const ext = getURL.substring(getURL.lastIndexOf(".") + 1).split(/\?|\#/)[0] || "gif";
    const cachePath = __dirname + `/cache/slap.${ext}`;

    const download = () =>
      new Promise((resolve, reject) => {
        try {
          const stream = request(getURL).pipe(fs.createWriteStream(cachePath));
          stream.on("close", () => resolve());
          stream.on("error", (err) => reject(err));
        } catch (err) {
          reject(err);
        }
      });

    await download();

    // reaction + send
    try {
      api.setMessageReaction("✅", messageID, (err) => {}, true);
    } catch (e) {
      // ignore reaction failure
    }

    const bodyText = `𝑺𝒍𝒂𝒑𝒑𝒆𝒅! ${tagName}\n\n"𝒎𝒂𝒇 𝒌𝒐𝒓𝒃𝒐, 𝒂𝒎𝒊 𝒃𝒉𝒂𝒃𝒊 𝒎𝒂𝒔𝒌𝒂𝒓𝒂 𝒄𝒉𝒊𝒍"`;

    api.sendMessage(
      {
        body: bodyText,
        mentions: [
          {
            tag: tagName,
            id: mentionId
          }
        ],
        attachment: fs.createReadStream(cachePath)
      },
      threadID,
      (err) => {
        // cleanup file after send (best effort)
        try {
          if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        } catch (e) {
          // ignore cleanup errors
        }
        if (err) {
          try {
            api.setMessageReaction("☹️", messageID, (err) => {}, true);
          } catch (e) {}
        }
      },
      messageID
    );
  } catch (error) {
    // API/download failed
    try {
      api.sendMessage("𝑺𝒍𝒂𝒑 𝒈𝒊𝒇 তৈরী করতে সমস্যা হয়েছে! দয়া করে পরে আবার চেষ্টা করুন এবং মেনশন ঠিক আছে কিনা দেখে নিন।", threadID, messageID);
      api.setMessageReaction("☹️", messageID, (err) => {}, true);
    } catch (e) {
      // ignore
    }
  }
};
