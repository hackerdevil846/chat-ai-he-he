const axios = require('axios');

module.exports = {
  config: {
    name: "history",
    aliases: ["historical"],
    version: "1.0",
    author: "Asif Mahmud",
    countDown: 8,
    role: 0,
    shortDescription: "search and know about history",
    longDescription: "Get short and reliable info about Bangladeshi history.",
    category: "info",
    guide: {
      en: "{pn}  bangladesh history"
    }
  },

  onStart: async function ({ api, args, event }) {
    const query = args.join(" ").trim().toLowerCase();

    if (!query) {
      return api.sendMessage("Please provide a topic to search! \nExample: history bangladesh war", event.threadID, event.messageID);
    }

    if (query !== "bangladesh") {
      return api.sendMessage(`Sorry, I only have information about Bangladeshi history for now.`, event.threadID, event.messageID);
    }

    // Provide static information about Bangladeshi history here   
    const message = 
`**Ancient Period:**
The region that is now Bangladesh was historically part of the larger region of Bengal. Bengal saw the rise of various civilizations and ruling empires over centuries, including the Maurya Dynasty starting in the 4th century BCE, the Gupta Empire from the 4th to 6th century CE, the Pala Empire from the 9th to 12th century CE,  and Muslim rulers like the Mughals in the 13th century CE.

**Colonial Period:**  
The British East India Company established control over Bengal following their victory at the Battle of Plassey in 1757. From 1757 to 1947, Bangladesh was part of Bengal Presidency with Dhaka serving as the capital. In 1905, the British partitioned Bengal into East and West Bengal provinces based largely on religious demographics.

**Pakistan Era:**
In 1947, Pakistan gained independence from Britain after the end of British colonial rule. As part of the partition of British India, Bengal was divided along religious lines into East Bengal, which became East Pakistan, and West Bengal, which became a state of India. 

**Modern Bangladesh:**  
In 1971, the Bangladesh Liberation War occurred, resulting in the independence of Bangladesh. Since then, Bangladesh has undergone a transition from military dictatorship to parliamentary democracy. Its economy, based largely on agriculture and garment manufacturing, has seen significant growth and development in recent decades.`;

    return api.sendMessage(message, event.threadID, event.messageID);
  }
};
