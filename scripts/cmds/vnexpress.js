const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  config: {
    name: "vnexpress",
    aliases: ["vnex"],
    version: "1.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get latest news from VNExpress"
    },
    longDescription: {
      en: "Fetches and displays the latest news articles from VNExpress.net"
    },
    category: "utility",
    guide: {
      en: "{p}vnexpress"
    }
  },

  onStart: async function({ api, event }) {
    try {
      // Check for dependencies
      if (!axios) throw new Error("Missing axios dependency");
      if (!cheerio) throw new Error("Missing cheerio dependency");
      
      const { threadID, messageID } = event;

      // Fetch news from VNExpress
      const response = await axios.get('https://vnexpress.net/tin-tuc-24h', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.status !== 200) {
        return api.sendMessage("❌ Failed to fetch news from VNExpress", threadID, messageID);
      }

      const $ = cheerio.load(response.data);
      
      // Get multiple news articles
      const newsArticles = [];
      
      $('.item-news').slice(0, 5).each((index, element) => {
        const title = $(element).find('.title-news a').attr('title') || $(element).find('h3 a').attr('title');
        const link = $(element).find('.title-news a').attr('href') || $(element).find('h3 a').attr('href');
        const description = $(element).find('.description a').text() || $(element).find('p.description').text();
        const time = $(element).find('.time-count').text() || $(element).find('span.time').text();
        
        if (title && link) {
          newsArticles.push({
            title,
            link: link.startsWith('http') ? link : `https://vnexpress.net${link}`,
            description: description ? description.trim() : 'No description available',
            time: time ? time.trim() : 'Recent'
          });
        }
      });

      if (newsArticles.length === 0) {
        return api.sendMessage("❌ No news articles found", threadID, messageID);
      }

      // Format the news message
      let newsMessage = "📰 LATEST VNEXPRESS NEWS 📰\n\n";
      
      newsArticles.forEach((article, index) => {
        newsMessage += `📖 Article ${index + 1}:\n`;
        newsMessage += `⏰ Time: ${article.time}\n`;
        newsMessage += `📋 Title: ${article.title}\n`;
        newsMessage += `📝 Description: ${article.description}\n`;
        newsMessage += `🔗 Link: ${article.link}\n`;
        newsMessage += `──────────────────\n\n`;
      });

      newsMessage += "Stay updated with the latest news! 📡";

      api.sendMessage(newsMessage, threadID, messageID);

    } catch (error) {
      console.error("VNExpress news error:", error);
      api.sendMessage("❌ An error occurred while fetching news. Please try again later.", event.threadID, event.messageID);
    }
  }
};
