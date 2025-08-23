module.exports.config = {
  name: "neymar",
  aliases: ["njr"],
  version: "1.2",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "⚽ Send random high-quality Neymar Jr. photos with automatic error recovery",
  category: "football",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function({ api, event }) {
  const axios = global.nodemodule["axios"];
  
  const allLinks = [
      "https://i.imgur.com/arWjsNg.jpg",
      "https://i.imgur.com/uJYvMR0.jpg",
      "https://i.imgur.com/A3MktQ4.jpg",
      "https://i.imgur.com/wV8YHHp.jpg",
      "https://i.imgur.com/14sAFjM.jpg",
      "https://i.imgur.com/EeAi2G6.jpg",
      "https://i.imgur.com/fUZbzhJ.jpg",
      "https://i.imgur.com/bUjGSCX.jpg",
      "https://i.imgur.com/4KZvLbO.jpg",
      "https://i.imgur.com/gBEAsYZ.jpg",
      "https://i.imgur.com/baKOat0.jpg",
      "https://i.imgur.com/4Z0ERpD.jpg",
      "https://i.imgur.com/h2ReDUe.jpg",
      "https://i.imgur.com/KQPalvi.jpg",
      "https://i.imgur.com/VRALDic.jpg",
      "https://i.imgur.com/Z3qGkZa.jpg",
      "https://i.imgur.com/etyPi7B.jpg",
      "https://i.imgur.com/tMxLEwl.jpg",
      "https://i.imgur.com/OwEdlZo.jpg",
      "https://i.imgur.com/UHAo39t.jpg",
      "https://i.imgur.com/aV4EVT9.jpg",
      "https://i.imgur.com/zdC8yiG.jpg",
      "https://i.imgur.com/JI7tjsr.jpg",
      "https://i.imgur.com/fFuPCrM.jpg",
      "https://i.imgur.com/XIaAXju.jpg",
      "https://i.imgur.com/yyIJwPH.jpg",
      "https://i.imgur.com/MyGcsJM.jpg",
      "https://i.imgur.com/UXjh4R1.jpg",
      "https://i.imgur.com/QGrvMZL.jpg"
    ].filter(link => link.startsWith('https'));

  // Fisher-Yates shuffle algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const maxRetries = 4;
  let retryCount = 0;
  let shuffledLinks = shuffleArray([...allLinks]);

  while (retryCount <= maxRetries) {
    try {
      if (shuffledLinks.length === 0) {
        shuffledLinks = shuffleArray([...allLinks]);
      }

      const imgUrl = shuffledLinks.pop();
      const response = await axios.get(imgUrl, { 
        responseType: 'stream' 
      });

      return api.sendMessage({
        body: `✨🇧🇷 𝗛𝗘𝗥𝗘 𝗖𝗢𝗠𝗘𝗦 𝗧𝗛𝗘 𝗠𝗔𝗚𝗜𝗖𝗜𝗔𝗡! 🔥\n\n💫 Experience the magic of Neymar Jr!`,
        attachment: response.data
      }, event.threadID, event.messageID);
    } 
    catch (error) {
      retryCount++;
      if (retryCount > maxRetries) {
        console.error("Neymar command error:", error);
        return api.sendMessage(`⚠️ 𝗦𝗘𝗥𝗩𝗘𝗥 𝗕𝗨𝗦𝗬!\nToo many requests for Neymar magic right now!\nPlease try again later... 🌙`, event.threadID);
      }
      await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
    }
  }
};
