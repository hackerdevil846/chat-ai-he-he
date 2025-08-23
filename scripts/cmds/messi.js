module.exports.config = {
  name: "messi",                        // command name
  version: "1.2",
  hasPermssion: 0,                      // 0 = all members
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",       // updated credits (Mathematical Bold Italic)
  description: "Send random Lionel Messi photos",
  category: "random-img",
  usages: "{pn}",
  cooldowns: 5
};

module.exports.languages = {
  "en": {
    "arrive": "「 The GOAT Has Arrived! 🐐 」",
    "err_retry": "⚠️ Server overload! Too many GOAT requests. Try again in a minute."
  },
  "bn": {
    "arrive": "「 GOAT এসে গেছে! 🐐 」",
    "err_retry": "⚠️ সার্ভারে অতিরিক্ত চাপ! কিছুক্ষণের মধ্যে চেষ্টা করুন।"
  }
};

module.exports.onLoad = function() {
  // No special onLoad actions required for this module.
};

module.exports.run = async function({ api, event, args, Users, Threads, Currencies, permssion }) {
  // List of image URLs (UNCHANGED)
  const allLinks = [
    "https://i.imgur.com/ahKcoO3.jpg",
    "https://i.imgur.com/Vsf4rM3.jpg",
    "https://i.imgur.com/ximEjww.jpg",
    "https://i.imgur.com/ukYhm0D.jpg",
    "https://i.imgur.com/Poice6v.jpg",
    "https://i.imgur.com/5yMvy5Z.jpg",
    "https://i.imgur.com/ndyprcd.jpg",
    "https://i.imgur.com/Pm2gC6I.jpg",
    "https://i.imgur.com/wxxHuAG.jpg",
    "https://i.imgur.com/GwOCq59.jpg",
    "https://i.imgur.com/oM0jc4i.jpg",
    "https://i.imgur.com/dJ0OUef.jpg",
    "https://i.imgur.com/iurRGPT.jpg",
    "https://i.imgur.com/jogjche.jpg",
    "https://i.imgur.com/TiyhKjG.jpg",
    "https://i.imgur.com/AwlBM23.jpg",
    "https://i.imgur.com/9OLSXZD.jpg",
    "https://i.imgur.com/itscmiy.jpg",
    "https://i.imgur.com/FsnCelU.jpg",
    "https://i.imgur.com/c7BCwDF.jpg",
    "https://i.imgur.com/3cnR6xh.jpg",
    "https://i.imgur.com/TZqepnU.jpg",
    "https://i.imgur.com/kYxEPrD.jpg",
    "https://i.imgur.com/9ZjD5nX.jpg",
    "https://i.imgur.com/YWyI4hP.jpg"
  ].filter(link => link.startsWith('https')); // Security filter

  // Fisher-Yates shuffle
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const maxRetries = 5;
  let retryCount = 0;
  let shuffledLinks = shuffleArray([...allLinks]);

  // Helper to send message with attachment
  const sendMessageWithAttachment = async (body, attachment) => {
    return api.sendMessage(
      { body, attachment },
      event.threadID,
      event.messageID
    );
  };

  while (retryCount <= maxRetries) {
    try {
      if (shuffledLinks.length === 0) {
        shuffledLinks = shuffleArray([...allLinks]); // refill when empty
      }

      const imgUrl = shuffledLinks.pop();

      // global.utils.getStreamFromURL is used by other GoatBot modules in this environment.
      // It should return a readable stream or buffer suitable for api.sendMessage attachment.
      const imageStream = await global.utils.getStreamFromURL(imgUrl);

      return await sendMessageWithAttachment(this.languages.en.arrive, imageStream);
    } catch (error) {
      retryCount++;
      // If maximum retries exceeded -> show friendly error message and log
      if (retryCount > maxRetries) {
        console.error("Messi command failed after retries:", error);
        return api.sendMessage(
          { body: this.languages.en.err_retry },
          event.threadID,
          event.messageID
        );
      }
      // Progressive backoff: wait retryCount * 1000 ms (1s, 2s, 3s, ...)
      await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
    }
  }
};
