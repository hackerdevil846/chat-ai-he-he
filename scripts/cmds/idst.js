module.exports.config = {
  name: "idst",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🆔 Get sticker ID or send sticker by ID",
  category: "sticker",
  usages: "[reply|stickerID]",
  cooldowns: 5,
  dependencies: {}
};

module.exports.run = async function({ api, event, args }) {
  try {
    if (event.type === "message_reply") {
      if (event.messageReply.attachments[0]?.type === "sticker") {
        const stickerInfo = event.messageReply.attachments[0];
        return api.sendMessage({
          body: `🎟️ 𝗦𝘁𝗶𝗰𝗸𝗲𝗿 𝗜𝗗: ${stickerInfo.ID}\n📝 𝗖𝗮𝗽𝘁𝗶𝗼𝗻: ${stickerInfo.description || '𝗡𝗼 𝗰𝗮𝗽𝘁𝗶𝗼𝗻 𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲'}`,
          mentions: []
        }, event.threadID, event.messageID);
      }
      return api.sendMessage("❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝘀𝘁𝗶𝗰𝗸𝗲𝗿 𝗺𝗲𝘀𝘀𝗮𝗴𝗲", event.threadID, event.messageID);
    }

    if (args[0]) {
      return api.sendMessage({
        body: "✨ 𝗛𝗲𝗿𝗲'𝘀 𝘆𝗼𝘂𝗿 𝘀𝘁𝗶𝗰𝗸𝗲𝗿:",
        sticker: args[0]
      }, event.threadID, event.messageID);
    }

    return api.sendMessage("❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝘂𝘀𝗮𝗴𝗲!\n💡 𝗨𝘀𝗮𝗴𝗲:\n• 𝗥𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝘀𝘁𝗶𝗰𝗸𝗲𝗿 𝘁𝗼 𝗴𝗲𝘁 𝗜𝗗\n• 𝗣𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘀𝘁𝗶𝗰𝗸𝗲𝗿 𝗜𝗗 𝘁𝗼 𝘀𝗲𝗻𝗱", event.threadID, event.messageID);

  } catch (error) {
    console.log(error);
    return api.sendMessage("❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱", event.threadID);
  }
};
