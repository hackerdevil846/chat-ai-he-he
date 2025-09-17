const { getStreamFromURL, getExtFromUrl, getTime } = global.utils;

module.exports = {
  config: {
    name: "setwelcome",
    aliases: ["setwc", "welcome"],
    version: "1.7",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 1,
    category: "group",
    shortDescription: {
      en: "🎉 𝑆𝑒𝑡 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑓𝑜𝑟 𝑛𝑒𝑤 𝑚𝑒𝑚𝑏𝑒𝑟𝑠"
    },
    longDescription: {
      en: "𝐶𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑤ℎ𝑒𝑛 𝑛𝑒𝑤 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑗𝑜𝑖𝑛 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝"
    },
    guide: {
      en: "{p}setwelcome text [𝑚𝑒𝑠𝑠𝑎𝑔𝑒] - 𝑆𝑒𝑡 𝑡𝑒𝑥𝑡 𝑚𝑒𝑠𝑠𝑎𝑔𝑒\n{p}setwelcome file - 𝐴𝑑𝑑 𝑓𝑖𝑙𝑒 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡\n{p}setwelcome on/off - 𝑇𝑢𝑟𝑛 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑜𝑛/𝑜𝑓𝑓"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": ""
    }
  },

  langs: {
    "en": {
      "turnedOn": "✅ 𝑇𝑢𝑟𝑛𝑒𝑑 𝑜𝑛 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒",
      "turnedOff": "✅ 𝑇𝑢𝑟𝑛𝑒𝑑 𝑜𝑓𝑓 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒",
      "missingContent": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡",
      "edited": "✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑡 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜:\n%1",
      "reseted": "✅ 𝑅𝑒𝑠𝑒𝑡 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑑𝑒𝑓𝑎𝑢𝑙𝑡",
      "noFile": "❌ 𝑁𝑜 𝑓𝑖𝑙𝑒 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡𝑠 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒",
      "resetedFile": "✅ 𝑅𝑒𝑚𝑜𝑣𝑒𝑑 𝑎𝑙𝑙 𝑓𝑖𝑙𝑒 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡𝑠",
      "missingFile": "📎 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒, 𝑣𝑖𝑑𝑒𝑜, 𝑜𝑟 𝑎𝑢𝑑𝑖𝑜 𝑓𝑖𝑙𝑒",
      "addedFile": "✅ 𝐴𝑑𝑑𝑒𝑑 %1 𝑓𝑖𝑙𝑒(𝑠) 𝑡𝑜 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"
    }
  },

  onStart: async function ({ api, event, args, threadsData, message, getText }) {
    try {
      const { threadID, senderID, body } = event;
      const threadData = await threadsData.get(threadID);
      
      if (!threadData.data) threadData.data = {};
      if (!threadData.settings) threadData.settings = {};

      switch (args[0]) {
        case "text": {
          if (!args[1]) {
            return message.reply(getText("missingContent"));
          } else if (args[1] === "reset") {
            delete threadData.data.welcomeMessage;
          } else {
            threadData.data.welcomeMessage = body.slice(body.indexOf(args[0]) + args[0].length).trim();
          }
          await threadsData.set(threadID, threadData);
          message.reply(threadData.data.welcomeMessage ? 
            getText("edited", threadData.data.welcomeMessage) : 
            getText("reseted"));
          break;
        }

        case "file": {
          if (args[1] === "reset") {
            if (!threadData.data.welcomeAttachment) {
              return message.reply(getText("noFile"));
            }
            delete threadData.data.welcomeAttachment;
            await threadsData.set(threadID, threadData);
            return message.reply(getText("resetedFile"));
          }

          if (event.attachments.length === 0 && (!event.messageReply || event.messageReply.attachments.length === 0)) {
            return message.reply(getText("missingFile"));
          }

          const attachments = [...event.attachments, ...(event.messageReply?.attachments || [])].filter(item => 
            ["photo", "png", "animated_image", "video", "audio"].includes(item.type)
          );

          if (!threadData.data.welcomeAttachment) {
            threadData.data.welcomeAttachment = [];
          }

          for (const attachment of attachments) {
            const { url } = attachment;
            const ext = getExtFromUrl(url);
            const fileName = `${getTime()}.${ext}`;
            const stream = await getStreamFromURL(url);
            // Simulate file storage (adjust based on your bot's file storage system)
            threadData.data.welcomeAttachment.push({
              url: url,
              fileName: fileName,
              type: attachment.type
            });
          }

          await threadsData.set(threadID, threadData);
          message.reply(getText("addedFile", attachments.length));
          break;
        }

        case "on":
        case "off": {
          threadData.settings.sendWelcomeMessage = args[0] === "on";
          await threadsData.set(threadID, threadData);
          message.reply(threadData.settings.sendWelcomeMessage ? 
            getText("turnedOn") : 
            getText("turnedOff"));
          break;
        }

        default: {
          const guideText = `🎯 𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑀𝑒𝑠𝑠𝑎𝑔𝑒 𝑆𝑒𝑡𝑢𝑝 𝐺𝑢𝑖𝑑𝑒:\n\n` +
            `📝 {p}setwelcome text [𝑚𝑒𝑠𝑠𝑎𝑔𝑒] - 𝑆𝑒𝑡 𝑡𝑒𝑥𝑡 𝑚𝑒𝑠𝑠𝑎𝑔𝑒\n` +
            `📎 {p}setwelcome file - 𝐴𝑑𝑑 𝑓𝑖𝑙𝑒 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡 (𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑓𝑖𝑙𝑒)\n` +
            `⚡ {p}setwelcome on/off - 𝑇𝑢𝑟𝑛 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑜𝑛/𝑜𝑓𝑓\n\n` +
            `✨ 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑝𝑙𝑎𝑐𝑒ℎ𝑜𝑙𝑑𝑒𝑟𝑠:\n` +
            `• {userName} - 𝑀𝑒𝑚𝑏𝑒𝑟'𝑠 𝑛𝑎𝑚𝑒\n` +
            `• {boxName} - 𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒\n` +
            `• {multiple} - 𝑌𝑜𝑢/𝑌𝑜𝑢 𝑔𝑢𝑦𝑠\n` +
            `• {session} - 𝑇𝑖𝑚𝑒 𝑜𝑓 𝑑𝑎𝑦`;
          
          message.reply(guideText);
          break;
        }
      }
    } catch (error) {
      console.error("SetWelcome Error:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
