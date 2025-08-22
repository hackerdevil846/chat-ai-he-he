const axios = require('axios');

module.exports = {
  config: {
    name: "dance",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Changed to specified format
    countDown: 5,
    role: 0,
    category: "anime",
    shortDescription: "💃 Anime dance gif/video",
    longDescription: "Sends a random anime dance gif or short video from multiple sources",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    const fallbackDances = [
      "https://i.waifu.pics/PCTp3I3.gif",
      "https://media.tenor.com/WNVZq-4Z1JAAAAAd/anime-dance-dancer-girl.gif",
      "https://media.tenor.com/2W1xuNxH0QwAAAAC/pocketmine-chika.gif",
      "https://media.tenor.com/3f4nB0ZQ9YQAAAAd/zero-two-dance.gif",
      "https://media.tenor.com/6zFqRw6eBvQAAAAC/anime-dance.gif",
      "https://media.tenor.com/4UJ5y7Zjw4kAAAAd/miku-hatsune-dance.gif",
      "https://media.tenor.com/rJd6rQY0Q5kAAAAC/kakashi-dance.gif",
      "https://media.tenor.com/9fYg1L0X1lUAAAAC/anime-dance.gif",
      "https://media.tenor.com/7Xb3h3j3J3IAAAAC/madoka-magica.gif",
      "https://media.tenor.com/5j7zWzWZw9AAAAAC/dance-anime.gif",
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWw0aWQxaWdweW82NHU0Ymg2c2ppMGU3OTU0cnhiZmsxZndjaXlxaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a6pzK009rlCak/giphy.gif",
      "https://tenor.com/bKLpp.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHYxMzNvcHd5OTA1dm5yZmVrZnA3dG50djFoMTJ6cjBxZ2EwaHBmNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FRxHnTUBxQysLAV2eA/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3enhoMWk0ODRhcGd3aDV2amphOGJhbjExaDZsdGF4OWQ3emtjeTNzZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VP4BM5r8ZdQfrxIZX2/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3enhoMWk0ODRhcGd3aDV2amphOGJhbjExaDZsdGF4OWQ3emtjeTNzZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/v0kDG3nsYWnbz4mTWN/giphy.gif"
    ];

    try {
      const apiResponse = await axios.get('https://api.waifu.pics/sfw/dance');
      const danceUrl = apiResponse.data?.url;

      if (!danceUrl) throw new Error('No URL from API');

      const form = {
        body: `✨💃 𝐃𝐀𝐍𝐂𝐄 𝐓𝐈𝐌𝐄! 🕺✨\n\n» 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 «`,
        attachment: await global.utils.getStreamFromURL(danceUrl)
      };

      return message.reply(form);
    } 
    catch (err) {
      console.error("Dance API Error:", err);
      
      const randomDance = fallbackDances[Math.floor(Math.random() * fallbackDances.length)];
      const fallbackForm = {
        body: `✨💃 𝐃𝐀𝐍𝐂𝐄 𝐓𝐈𝐌𝐄! 🕺✨\n\n» 𝐅𝐚𝐥𝐥𝐛𝐚𝐜𝐤 𝐆𝐈𝐅 «\n» 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 «`,
        attachment: await global.utils.getStreamFromURL(randomDance)
      };

      return message.reply(fallbackForm);
    }
  }
};
