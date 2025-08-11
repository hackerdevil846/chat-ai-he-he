module.exports = {
  config: {
    name: "messi",
    aliases: ["lm10"],
    version: "1.2",
    author: "Asif👾😉",
    countDown: 5,
    role: 0,
    shortDescription: "Send random Lionel Messi photos",
    longDescription: "Sends high-quality random images of Lionel Messi with automatic error recovery",
    category: "football",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
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

    // Fisher-Yates shuffle algorithm
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

    while (retryCount <= maxRetries) {
      try {
        if (shuffledLinks.length === 0) {
          shuffledLinks = shuffleArray([...allLinks]); // Refill pool when empty
        }

        const imgUrl = shuffledLinks.pop();
        const imageStream = await global.utils.getStreamFromURL(imgUrl);
        
        return message.send({
          body: '「 The GOAT Has Arrived! 🐐 」',
          attachment: imageStream
        });
      } 
      catch (error) {
        retryCount++;
        if (retryCount > maxRetries) {
          console.error("Messi command failed after retries:", error);
          return message.send("⚠️ Server overload! Too many GOAT requests. Try again in a minute.");
        }
        
        // Progressive backoff: 1s, 2s, 3s, 4s, 5s
        await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
      }
    }
  }
};
