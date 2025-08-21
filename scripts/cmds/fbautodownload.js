const { downloadVideo } = require("priyansh-all-dl");
const axios = require("axios");
const fs = require("fs-extra");
const tempy = require("tempy");

module.exports.config = {
  name: "fbautodownload",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒆𝒓 𝒗𝒊𝒅𝒆𝒐 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒆",
  commandCategory: "𝑼𝒕𝒊𝒍𝒊𝒕𝒚",
  usages: "[𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒗𝒊𝒅𝒆𝒐 𝑼𝑹𝑳]",
  cooldowns: 5,
  dependencies: {
    "priyansh-all-dl": "2.0.0",
    axios: "0.21.1",
    "fs-extra": "10.0.0",
    tempy: "0.4.0",
  },
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.type === "message" && event.body) {
    if (
      event.body.startsWith("https://www.facebook.com/share/") ||
      event.body.startsWith("https://www.facebook.com/reel/")
    ) {
      try {
        const videoInfo = await downloadVideo(event.body);

        // 𝑺𝒆𝒍𝒆𝒄𝒕 𝒃𝒆𝒔𝒕 𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆 𝒒𝒖𝒂𝒍𝒊𝒕𝒚
        let hdLink = null;
        if (videoInfo["360p"] && videoInfo["360p"] !== "Not found") {
          hdLink = videoInfo["360p"];
        } else if (videoInfo["720p"] && videoInfo["720p"] !== "Not found") {
          hdLink = videoInfo["720p"];
        }

        if (!hdLink) {
          await api.sendMessage(
            "𝑫𝒖𝒌𝒌𝒉𝒊𝒕𝒐, 360𝒑 𝒚𝒂 720𝒑 𝒒𝒖𝒂𝒍𝒊𝒕𝒚 𝒆𝒓 𝒗𝒊𝒅𝒆𝒐 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂 😞",
            event.threadID,
            event.messageID
          );
          return;
        }
        
        const response = await axios.get(hdLink, { responseType: "stream" });
        const tempFilePath = tempy.file({ extension: "mp4" });
        const writer = fs.createWriteStream(tempFilePath);
        response.data.pipe(writer);

        writer.on("finish", async () => {
          const attachment = fs.createReadStream(tempFilePath);
          await api.sendMessage(
            {
              attachment,
              body: "𝑨𝒑𝒏𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒗𝒊𝒅𝒆𝒐 𝒏𝒊𝒋𝒆 𝒓𝒂𝒌𝒉𝒂 𝒉𝒐𝒍𝒐:",
            },
            event.threadID,
            (err) => {
              if (err) console.error("𝑬𝒓𝒓𝒐𝒓 𝒔𝒆𝒏𝒅𝒊𝒏𝒈 𝒎𝒆𝒔𝒔𝒂𝒈𝒆:", err);
            }
          );
          fs.unlinkSync(tempFilePath);
        });

        writer.on("error", (err) => {
          console.error("𝑬𝒓𝒓𝒐𝒓 𝒘𝒓𝒊𝒕𝒊𝒏𝒈 𝒇𝒊𝒍𝒆:", err);
          api.sendMessage(
            "𝑽𝒊𝒅𝒆𝒐 𝒑𝒓𝒐𝒄𝒆𝒔𝒔 𝒌𝒐𝒓𝒕𝒆 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒄𝒄𝒉𝒆. 𝑫𝒆𝒓𝒊 𝒌𝒉𝒖𝒏 𝒂𝒂𝒃𝒂𝒓 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏",
            event.threadID,
            event.messageID
          );
        });
      } catch (error) {
        console.error("𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒗𝒊𝒅𝒆𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓:", error);
        api.sendMessage(
          "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒗𝒊𝒅𝒆𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒄𝒄𝒉𝒆. 𝑫𝒆𝒓𝒊 𝒌𝒉𝒖𝒏 𝒂𝒂𝒃𝒂𝒓 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏",
          event.threadID,
          event.messageID
        );
      }
    }
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    `𝑨𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒕𝒊 𝒅𝒊𝒓𝒆𝒄𝒕 𝒄𝒉𝒂𝒍𝒂𝒏𝒐 𝒋𝒂𝒚 𝒏𝒂. 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒗𝒊𝒅𝒆𝒐 𝒍𝒊𝒏𝒌 𝒑𝒂𝒕𝒉𝒂𝒏`,
    event.threadID,
    event.messageID
  );
};
