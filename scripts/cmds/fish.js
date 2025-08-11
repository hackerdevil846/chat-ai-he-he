module.exports = {
  config: {
    name: "fish",
    version: "1.2.0",
    role: 0,
    author: "Asif",
    description: "Fishing economy game - catch fish and earn money",
    category: "economy",
    cooldowns: 5,
    envConfig: {
      cooldownTime: 600000
    }
  },

  langs: {
    en: {
      cooldown: "⏱️ You've already fished today! Please wait: %1 min %2 sec",
      noFish: "🎣 You went fishing at %1 but caught nothing... Better luck next time!",
      commonCatch: "🎣 You caught a %1 at %2 and sold it for $%3!",
      rareCatch: "🌟 Wow! You caught a rare %1 at %2 worth $%3!",
      epicCatch: "💎 Incredible! An epic %1 at %2 worth $%3!",
      legendaryCatch: "🔥 LEGENDARY CATCH! %1 at %2 worth $%3!",
      fishingSpots: [
        "River", "Lake", "Ocean", "Deep Sea", "Fishing Pond", 
        "Mountain Stream", "Coral Reef", "Ice Fishing Spot"
      ],
      commonFish: [
        "Tilapia", "Catfish", "Bass", "Trout", "Carp", 
        "Perch", "Sardine", "Mackerel", "Cod", "Salmon"
      ],
      rareFish: [
        "Golden Trout", "Rainbow Bass", "Electric Eel", 
        "Glowing Tetra", "Crystal Fish"
      ],
      epicFish: [
        "Ancient Marlin", "Dragonfish", "Phantom Angler", 
        "Abyssal Leviathan", "Coral King"
      ],
      legendaryFish: [
        "Poseidon's Trident Fish", "Kraken Jr.", 
        "Mermaid's Companion", "Neptune's Prize"
      ]
    }
  },

  onStart: async function({ event, api, economy, getLang }) {
    const { threadID, messageID, senderID } = event;
    const cooldownTime = this.config.envConfig.cooldownTime;
    
    try {
      const userData = await economy.get(senderID);
      const data = userData.data || {};
      const currentBalance = userData.money || 0;
      
      if (data.fishTime && Date.now() - data.fishTime < cooldownTime) {
        const remainingTime = cooldownTime - (Date.now() - data.fishTime);
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        
        return api.sendMessage(
          getLang("cooldown", minutes, seconds), 
          threadID, 
          messageID
        );
      }

      const spots = getLang("fishingSpots");
      const location = spots[Math.floor(Math.random() * spots.length)];
      
      const rarityRoll = Math.random();
      let fishType = "";
      let fishValue = 0;
      let resultMessage = `🎣 You went fishing at ${location} and...\n━━━━━━━━━━━━━━\n`;

      if (rarityRoll < 0.5) {
        resultMessage += getLang("noFish", location);
      } else if (rarityRoll < 0.85) {
        fishType = getLang("commonFish")[Math.floor(Math.random() * getLang("commonFish").length)];
        fishValue = Math.floor(Math.random() * 900) + 100;
        resultMessage += getLang("commonCatch", fishType, location, fishValue.toLocaleString());
      } else if (rarityRoll < 0.95) {
        fishType = getLang("rareFish")[Math.floor(Math.random() * getLang("rareFish").length)];
        fishValue = Math.floor(Math.random() * 4000) + 1000;
        resultMessage += getLang("rareCatch", fishType, location, fishValue.toLocaleString());
      } else if (rarityRoll < 0.99) {
        fishType = getLang("epicFish")[Math.floor(Math.random() * getLang("epicFish").length)];
        fishValue = Math.floor(Math.random() * 10000) + 5000;
        resultMessage += getLang("epicCatch", fishType, location, fishValue.toLocaleString());
      } else {
        fishType = getLang("legendaryFish")[Math.floor(Math.random() * getLang("legendaryFish").length)];
        fishValue = Math.floor(Math.random() * 35000) + 15000;
        resultMessage += getLang("legendaryCatch", fishType, location, fishValue.toLocaleString());
      }

      if (rarityRoll >= 0.5) {
        await economy.addMoney(senderID, fishValue);
        userData.data = userData.data || {};
        userData.data.fishTime = Date.now();
        await economy.set(senderID, userData);
        resultMessage += `\n💰 Your new balance: $${(currentBalance + fishValue).toLocaleString()}`;
      }

      resultMessage += `\n\n⏳ Next fishing available in 10 minutes`;
      
      return api.sendMessage(resultMessage, threadID, messageID);
      
    } catch (error) {
      console.error("Fishing command error:", error);
      return api.sendMessage(
        "❌ An error occurred while fishing. Please try again later.", 
        threadID, 
        messageID
      );
    }
  }
};
