const request = require("request");

module.exports = {
  config: {
    name: "tr",
    aliases: ["trans"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🌍 𝑇𝑒𝑥𝑡 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"
    },
    longDescription: {
      en: "𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑡𝑒𝑥𝑡 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝐺𝑜𝑜𝑔𝑙𝑒 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒"
    },
    guide: {
      en: "{p}translate [𝑡𝑒𝑥𝑡 -> 𝑙𝑎𝑛𝑔] 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡𝑒𝑥𝑡"
    },
    countDown: 5,
    dependencies: {
      "request": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      let content = args.join(" ");
      
      if (content.length === 0 && event.type !== "message_reply") {
        return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒.\n\n📝 𝐸𝑥𝑎𝑚𝑝𝑙𝑒:\ntranslate 𝐻𝑒𝑙𝑙𝑜 -> 𝑏𝑛");
      }

      let translateThis, lang;

      // If it's a reply
      if (event.type === "message_reply") {
        translateThis = event.messageReply.body;
        if (content.includes("->")) {
          lang = content.split("->")[1].trim();
        } else {
          lang = "en"; // default English
        }
      }
      // Normal input
      else {
        if (content.includes("->")) {
          translateThis = content.split("->")[0].trim();
          lang = content.split("->")[1].trim();
        } else {
          translateThis = content;
          lang = "en";
        }
      }

      // API call
      request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`), (err, response, body) => {
        if (err) {
          return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        }
        
        try {
          let retrieve = JSON.parse(body);
          let text = '';
          retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
          let fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];

          message.reply(
            `📜 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛:\n\n${text}\n\n🌍 ${fromLang} ➝ ${lang}`
          );
        } catch (error) {
          console.error(error);
          message.reply("❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑡𝑒𝑥𝑡, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        }
      });
    } catch (e) {
      console.error(e);
      message.reply("⚠️ 𝑈𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑!");
    }
  }
};
