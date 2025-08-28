module.exports = {
  config: {
    name: "autoreact",
    version: "1.1.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "𝒏𝒐-𝒑𝒓𝒆𝒇𝒊𝒙",
    shortDescription: {
      en: "𝑩𝒐𝒕 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏"
    },
    longDescription: {
      en: "𝑨𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒓𝒆𝒂𝒄𝒕𝒔 𝒕𝒐 𝒔𝒑𝒆𝒄𝒊𝒇𝒊𝒄 𝒌𝒆𝒚𝒘𝒐𝒓𝒅𝒔 𝒊𝒏 𝒄𝒉𝒂𝒕"
    },
    guide: {
      en: ""
    }
  },

  onChat: async function({ api, event }) {
    try {
      if (!event.body) return;
      
      let react = event.body.toLowerCase();
      const { threadID, messageID } = event;

      // 𝑺𝒐𝒖𝒍 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏
      if (react.includes("atma") || react.includes("roh")) {
        api.setMessageReaction("🖤", messageID, (err) => {}, true);
      }

      // 𝑳𝒐𝒗𝒆/𝑨𝒇𝒇𝒆𝒄𝒕𝒊𝒐𝒏 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏
      else if (react.includes("bhalobasha") || react.includes("prem") || react.includes("maya") || 
               react.includes("ador") || react.includes("kiss") || react.includes("chumma") || 
               react.includes("shona") || react.includes("jaan") || react.includes("priyo")) {
        api.setMessageReaction("❤️", messageID, (err) => {}, true);
      }

      // 𝑺𝒂𝒅𝒏𝒆𝒔𝒔 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏
      else if (react.includes("dukkho") || react.includes("kanna") || react.includes("kando") || 
               react.includes("ashru") || react.includes("mon kharap") || react.includes("bedona")) {
        api.setMessageReaction("😢", messageID, (err) => {}, true);
      }

      // 𝑩𝒂𝒏𝒈𝒍𝒂𝒅𝒆𝒔𝒉 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏
      else if (react.includes("bangladesh") || react.includes("bd") || react.includes("sonar bangla") || 
               react.includes("desh")) {
        api.setMessageReaction("🇧🇩", messageID, (err) => {}, true);
      }

      // 𝑮𝒓𝒆𝒆𝒕𝒊𝒏𝒈𝒔/𝑻𝒊𝒎𝒆 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏
      else if (react.includes("shokal") || react.includes("bikal") || react.includes("sha") || 
               react.includes("rat") || react.includes("khabar") || react.includes("ghum")) {
        api.setMessageReaction("❤", messageID, (err) => {}, true);
      }

      // 𝑺𝒖𝒓𝒑𝒓𝒊𝒔𝒆 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏
      else if (react.includes("wah") || react.includes("oshadharon") || react.includes("roboter")) {
        api.setMessageReaction("😮", messageID, (err) => {}, true);
      }

    } catch (error) {
      console.error("𝑨𝒖𝒕𝒐𝒓𝒆𝒂𝒄𝒕 𝑬𝒓𝒓𝒐𝒓:", error);
    }
  },

  onStart: async function() {
    // 𝑵𝒐 𝒊𝒏𝒊𝒕𝒊𝒂𝒍 𝒂𝒄𝒕𝒊𝒐𝒏 𝒏𝒆𝒆𝒅𝒆𝒅
  }
};
