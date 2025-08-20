const axios = require('axios');

module.exports = {
  config: {
    name: "history",
    aliases: ["historical"],
    version: "1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 8,
    role: 0,
    shortDescription: "Search and know about Bangladeshi history",
    longDescription: "Get short and reliable info about Bangladeshi historical events",
    category: "info",
    guide: {
      en: "{pn} [query]"
    }
  },

  onStart: async function ({ api, args, event }) {
    const query = args.join(" ").trim().toLowerCase();

    if (!query) {
      return api.sendMessage("🔍 Please provide a historical topic to search!\nExample: history bangladesh", event.threadID, event.messageID);
    }

    if (query !== "bangladesh") {
      return api.sendMessage(`❌ Sorry, I only have information about Bangladeshi history for now.`, event.threadID, event.messageID);
    }

    const message = 
`🇧🇩 𝗕𝗔𝗡𝗚𝗟𝗔𝗗𝗘𝗦𝗛 𝗛𝗜𝗦𝗧𝗢𝗥𝗬 𝗢𝗩𝗘𝗥𝗩𝗜𝗘𝗪

🏛️ 𝗔𝗻𝗰𝗶𝗲𝗻𝘁 𝗣𝗲𝗿𝗶𝗼𝗱:
The region now known as Bangladesh was historically part of Bengal. Key civilizations included:
• Maurya Dynasty (4th century BCE)
• Gupta Empire (4th-6th century CE)
• Pala Empire (9th-12th century CE)
• Mughal Rule (13th century CE)

🇬🇧 𝗖𝗼𝗹𝗼𝗻𝗶𝗮𝗹 𝗣𝗲𝗿𝗶𝗼𝗱:
• British East India Company control after Battle of Plassey (1757)
• Part of Bengal Presidency (1757-1947)
• Bengal Partition (1905) into East/West provinces

🇵🇰 𝗣𝗮𝗸𝗶𝘀𝘁𝗮𝗻 𝗘𝗿𝗮:
• Partition of British India (1947)
• East Bengal became East Pakistan
• Religious division between East/West Bengal

✨ 𝗠𝗼𝗱𝗲𝗿𝗻 𝗕𝗮𝗻𝗴𝗹𝗮𝗱𝗲𝘀𝗵:
• Bangladesh Liberation War (1971)
• Transition from military rule to democracy
• Economic growth in agriculture and manufacturing

━━━━━━━━━━━━━━━
📜 Source: Verified Historical Records
⭐ Credit: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;

    return api.sendMessage(message, event.threadID, event.messageID);
  }
};
