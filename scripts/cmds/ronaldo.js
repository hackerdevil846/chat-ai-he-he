module.exports = {
  config: {
    name: "ronaldo",
    aliases: ["cr7"],
    version: "1.2",
    author: "Asif👾😉",
    countDown: 5,
    role: 0,
    shortDescription: "Send random Cristiano Ronaldo photos",
    longDescription: "Sends high-quality random images of Cristiano Ronaldo with automatic error recovery",
    category: "football",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    const allLinks = [
      "https://i.imgur.com/gwAuLMT.jpg",
      "https://i.imgur.com/MuuhaJ4.jpg",
      "https://i.imgur.com/6t0R8fs.jpg",
      "https://i.imgur.com/7RTC4W5.jpg",
      "https://i.imgur.com/VTi2dTP.jpg",
      "https://i.imgur.com/gdXJaK9.jpg",
      "https://i.imgur.com/VqZp7IU.jpg",
      "https://i.imgur.com/9pio8Lb.jpg",
      "https://i.imgur.com/iw714Ym.jpg",
      "https://i.imgur.com/zFbcrjs.jpg",
      "https://i.imgur.com/e0td0K9.jpg",
      "https://i.imgur.com/gsJWOmA.jpg",
      "https://i.imgur.com/lU8CaT0.jpg",
      "https://i.imgur.com/mmZXEYl.jpg",
      "https://i.imgur.com/d2Ot9pW.jpg",
      "https://i.imgur.com/iJ1ZGwZ.jpg",
      "https://i.imgur.com/isqQhNQ.jpg",
      "https://i.imgur.com/GoKEy4g.jpg",
      "https://i.imgur.com/TjxTUsl.jpg",
      "https://i.imgur.com/VwPPL03.jpg",
      "https://i.imgur.com/45zAhI7.jpg",
      "https://i.imgur.com/n3agkNi.jpg",
      "https://i.imgur.com/F2mynhI.jpg",
      "https://i.imgur.com/XekHaDO.jpg"
    ].filter(link => link.startsWith('https')); // Filter valid HTTPS links

    // Advanced Fisher-Yates shuffle algorithm
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
        const imageStream = await global.utils.getStreamFromURL(imgUrl);
        
        return message.send({
          body: '「 Here Comes The GOAT! 🐐 」',
          attachment: imageStream
        });
      } 
      catch (error) {
        retryCount++;
        if (retryCount > maxRetries) {
          console.error("Ronaldo command failed after retries:", error);
          return message.send("⚠️ Server overload! Too many requests. Please try again in a minute.");
        }
        
        // Add progressive delay: 1s, 2s, 3s, etc.
        await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
      }
    }
  }
};
