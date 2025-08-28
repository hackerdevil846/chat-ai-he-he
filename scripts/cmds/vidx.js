const axios = require("axios");

// Helper function to convert text into bold italic math font (𝑴𝒆𝒕𝒂𝒍𝒊𝒙 style)
function toFancy(text) {
  const normal = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const fancy = '𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿';
  return text.split("").map(c => {
    const i = normal.indexOf(c);
    return i !== -1 ? fancy[i] : c;
  }).join("");
}

module.exports = {
  config: {
    name: "vidx",
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: toFancy("Search 18+ videos")
    },
    longDescription: {
      en: toFancy("Search and display adult videos using a search keyword")
    },
    category: toFancy("media"),
    guide: {
      en: toFancy("+vidx [search term]\nExample: +vidx teen")
    }
  },

  onStart: async function ({ message, args, event, commandName }) {
    const query = args.join(" ");
    if (!query) return message.reply(toFancy("❌ | Please provide a search term.\nExample: +vidx teen"));

    const apiUrl = `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(query)}&format=json`;

    try {
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data?.videos?.length) {
        return message.reply(toFancy(`❌ | No videos found for: ${query}`));
      }

      const topVideos = data.videos.slice(0, 10);
      let output = toFancy(`🔍 Results for: ${query}\n\n`);
      const attachments = [];

      for (let i = 0; i < Math.min(5, topVideos.length); i++) {
        const video = topVideos[i];
        output += toFancy(
          `📼 ${i + 1}. ${video.title}\n⏱️ ${video.length_min} min | 👍 ${video.rating}/5\n🌐 Url: https://www.eporner.com/video-${video.id}/${video.slug}/\n\n`
        );

        try {
          const thumbResponse = await axios.get(video.default_thumb.src, { responseType: "stream" });
          attachments.push(thumbResponse.data);
        } catch {
          console.error(`Failed to get thumbnail for video ${i + 1}`);
        }
      }

      output += toFancy(`\nReply with the number (1-${Math.min(5, topVideos.length)}) to get the video URL.`);

      await message.reply({
        body: output,
        attachment: attachments
      });

      global.GoatBot.onReply.set(event.messageID, {
        commandName,
        author: event.senderID,
        messageID: event.messageID,
        videos: topVideos
      });

    } catch (e) {
      console.error(e);
      return message.reply(toFancy("❌ | Failed to fetch video data. Please try again later."));
    }
  },

  onReply: async function ({ message, Reply, event }) {
    const { author, commandName, videos } = Reply;
    if (event.senderID !== author) return;

    const selectedNum = parseInt(event.body);
    if (isNaN(selectedNum)) {
      return message.reply(toFancy("❌ | Please reply with a number from the list."));
    }

    const videoIndex = selectedNum - 1;
    if (videoIndex < 0 || videoIndex >= Math.min(5, videos.length)) {
      return message.reply(toFancy("❌ | Invalid selection. Please choose a number from the list."));
    }

    const selectedVideo = videos[videoIndex];

    try {
      const embedUrl = `https://www.eporner.com/embed/${selectedVideo.id}`;
      const embedResponse = await axios.get(embedUrl);
      const embedHtml = embedResponse.data;

      const videoUrlMatch = embedHtml.match(/src="(https:\/\/[^"]+\.mp4)"/i);
      const videoUrl = videoUrlMatch ? videoUrlMatch[1] : null;

      if (!videoUrl) throw new Error("Could not extract video URL");

      await message.reply({
        body: toFancy(
          `🎥 ${selectedVideo.title}\n⏱️ ${selectedVideo.length_min} min | 👍 ${selectedVideo.rating}/5\n\n🔗 Direct video URL:\n${videoUrl}`
        ),
        attachment: await global.utils.getStreamFromURL(selectedVideo.default_thumb.src)
      });

    } catch (e) {
      console.error(e);
      const fallbackUrl = `https://www.eporner.com/video-${selectedVideo.id}/${selectedVideo.slug}/`;
      await message.reply({
        body: toFancy(
          `🎥 ${selectedVideo.title}\n⏱️ ${selectedVideo.length_min} min | 👍 ${selectedVideo.rating}/5\n\n❌ Couldn't get direct video URL. Here's the page link:\n${fallbackUrl}`
        ),
        attachment: await global.utils.getStreamFromURL(selectedVideo.default_thumb.src)
      });
    }

    global.GoatBot.onReply.delete(event.messageID);
  }
};
