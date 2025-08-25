module.exports.config = {
  name: "mentionbot",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "⚡️ Bot admin mention detection & auto-response system",
  category: "system",
  usages: "",
  cooldowns: 1,
  envConfig: {}
};

module.exports.onLoad = function() {
  // Initialization placeholder
};

module.exports.handleEvent = function({ api, event }) {
  try {
    const botAdmin = "61571630409265";
    const allowedIDs = ["61571630409265", ""];
    
    if (event.senderID === botAdmin) return;
    
    const mentionedIDs = Object.keys(event.mentions);
    const trigger = mentionedIDs.some(id => allowedIDs.includes(id));
    
    if (trigger) {
      const responses = [
        "🙄 Amake disturb korona",
        "🙈 Amake dakish na, ami jaanu er sathe busy",
        "🫡 Bola nai mention korish na, dur theko",
        "😒 Ki hoyeche, keno dakchish?",
        "💢 Hayre, amar sharam lagche evabe dakish na",
        "🤫 Chup kor",
        "💌 Bolo na jaanu",
        "🐣 Haa jaan, dakchish keno?",
        "👑 Bolen mere sarkar"
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      api.sendMessage({
        body: `⛔️ ${selectedResponse}`
      }, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("⚠️ MentionBot Error:", error);
  }
};

module.exports.onStart = function() {};
