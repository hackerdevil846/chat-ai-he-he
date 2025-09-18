const axios = require('axios');
const defaultEmojiTranslate = "🌐";

module.exports = {
  config: {
    name: "translator",
    aliases: ["trans", "translate"],
    version: "1.5",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🌍 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑑𝑒𝑠𝑖𝑟𝑒𝑑 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒"
    },
    longDescription: {
      en: "𝐴𝑑𝑣𝑎𝑛𝑐𝑒𝑑 𝑡𝑒𝑥𝑡 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛 𝑓𝑒𝑎𝑡𝑢𝑟𝑒𝑠"
    },
    guide: {
      en: 
        "   {p}translator <𝑡𝑒𝑥𝑡>: 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑡𝑜 𝑏𝑜𝑡'𝑠 𝑑𝑒𝑓𝑎𝑢𝑙𝑡 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒\n" +
        "   {p}translator <𝑡𝑒𝑥𝑡> -> <𝑙𝑎𝑛𝑔>: 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑡𝑜 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒\n" +
        "   {p}translator -𝑟 𝑜𝑛/𝑜𝑓𝑓: 𝑇𝑜𝑔𝑔𝑙𝑒 𝑎𝑢𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑜𝑛 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛\n" +
        "   {p}translator -𝑟 𝑠𝑒𝑡 <𝑒𝑚𝑜𝑗𝑖>: 𝑆𝑒𝑡 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑒𝑚𝑜𝑗𝑖"
    },
    dependencies: {
      "axios": ""
    }
  },

  langs: {
    en: {
      translateTo: "🌐 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒𝑑 𝑓𝑟𝑜𝑚 %1 𝑡𝑜 %2",
      invalidArgument: "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑎𝑟𝑔𝑢𝑚𝑒𝑛𝑡, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑜𝑛 𝑜𝑟 𝑜𝑓𝑓",
      turnOnTransWhenReaction: `✅ 𝑇𝑢𝑟𝑛𝑒𝑑 𝑜𝑛 𝑎𝑢𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒. 𝑅𝑒𝑎𝑐𝑡 \"${defaultEmojiTranslate}\" 𝑡𝑜 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒`,
      turnOffTransWhenReaction: "✅ 𝑇𝑢𝑟𝑛𝑒𝑑 𝑜𝑓𝑓 𝑎𝑢𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒",
      inputEmoji: "🌀 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑠𝑒𝑡 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑒𝑚𝑜𝑗𝑖",
      emojiSet: "✅ 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑒𝑚𝑜𝑗𝑖 𝑠𝑒𝑡 𝑡𝑜 %1"
    }
  },

  onStart: async function ({ message, event, args, threadsData, getLang }) {
    if (["-r", "-react", "-reaction"].includes(args[0])) {
      if (args[1] == "set") {
        return message.reply(getLang("inputEmoji"), (err, info) => {
          global.translatorReactions = global.translatorReactions || {};
          global.translatorReactions[info.messageID] = {
            type: "setEmoji",
            authorID: event.senderID,
            threadID: event.threadID
          };
        });
      }
      
      const isEnable = args[1] == "on" ? true : args[1] == "off" ? false : null;
      if (isEnable == null) {
        return message.reply(getLang("invalidArgument"));
      }
      
      await threadsData.set(event.threadID, isEnable, "settings.autoTranslate");
      return message.reply(isEnable ? getLang("turnOnTransWhenReaction") : getLang("turnOffTransWhenReaction"));
    }

    const { body } = event;
    let content;
    let targetLang;

    // Handle message replies
    if (event.messageReply) {
      content = event.messageReply.body;
      const langMatch = body.match(/->\s*(\w{2,3})$/);
      targetLang = langMatch ? langMatch[1] : global.GoatBot.config.language;
    } else {
      const langMatch = body.match(/(.*?)\s*->\s*(\w{2,3})$/);
      if (langMatch) {
        content = langMatch[1].trim();
        targetLang = langMatch[2];
      } else {
        content = body.replace(/^\.?translator\s*/i, '').trim();
        targetLang = global.GoatBot.config.language;
      }
    }

    if (!content) {
      return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒");
    }

    try {
      const { text, lang } = await translate(content, targetLang);
      await message.reply(`${text}\n\n${getLang("translateTo", lang, targetLang)}`);
    } catch (error) {
      console.error("Translation error:", error);
      message.reply("❌ 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
    }
  },

  onEvent: async function ({ event, threadsData }) {
    // Handle reaction events for auto-translate
    if (event.type === "message_reaction" && global.translatorReactions) {
      const reactionData = global.translatorReactions[event.messageID];
      if (reactionData && event.userID === reactionData.authorID) {
        await threadsData.set(reactionData.threadID, event.reaction, "settings.translateEmoji");
        delete global.translatorReactions[event.messageID];
        
        const messageAPI = require('../utils/message');
        await messageAPI.sendMessage(`✅ 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑒𝑚𝑜𝑗𝑖 𝑠𝑒𝑡 𝑡𝑜 ${event.reaction}`, event.threadID);
      }
    }
  }
};

async function translate(text, targetLang) {
  try {
    const response = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    
    return {
      text: response.data[0].map(item => item[0]).join(''),
      lang: response.data[2]
    };
  } catch (error) {
    throw new Error("Translation API error");
  }
}
