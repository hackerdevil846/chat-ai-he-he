const axios = require("axios");
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "sing",
    aliases: ["play", "song"],
    version: "3.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "🎵 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 ℎ𝑖𝑔ℎ-𝑞𝑢𝑎𝑙𝑖𝑡𝑦 𝑎𝑢𝑑𝑖𝑜 𝑓𝑟𝑜𝑚 𝑌𝑜𝑢𝑇𝑢𝑏𝑒"
    },
    longDescription: {
      en: "𝑃𝑙𝑎𝑦 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑚𝑢𝑠𝑖𝑐 𝑓𝑟𝑜𝑚 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑏𝑦 𝑛𝑎𝑚𝑒 𝑜𝑟 𝑙𝑖𝑛𝑘"
    },
    guide: {
      en: "{p}sing [𝑠𝑜𝑛𝑔 𝑛𝑎𝑚𝑒 | 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑙𝑖𝑛𝑘]"
    },
    countDown: 20,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const youtubeRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
      const query = args.join(" ").trim();

      if (!query) {
        const helpMessage = "🎵 𝑀𝑢𝑠𝑖𝑐 𝑃𝑙𝑎𝑦𝑒𝑟 𝐻𝑒𝑙𝑝:\n\n" +
          "• 𝑃𝑙𝑎𝑦 𝑏𝑦 𝑛𝑎𝑚𝑒: 𝑠𝑖𝑛𝑔 <𝑠𝑜𝑛𝑔 𝑛𝑎𝑚𝑒>\n" +
          "• 𝑃𝑙𝑎𝑦 𝑏𝑦 𝑙𝑖𝑛𝑘: 𝑠𝑖𝑛𝑔 <𝑦𝑜𝑢𝑡𝑢𝑏𝑒 𝑙𝑖𝑛𝑘>\n\n" +
          "𝐸𝑥𝑎𝑚𝑝𝑙𝑒𝑠:\n" +
          "  𝑠𝑖𝑛𝑔 𝑐ℎ𝑖𝑝𝑖 𝑐ℎ𝑖𝑝𝑖 𝑐ℎ𝑎𝑝𝑎 𝑐ℎ𝑎𝑝𝑎\n" +
          "  𝑠𝑖𝑛𝑔 ℎ𝑡𝑡𝑝𝑠://𝑦𝑜𝑢𝑡𝑢.𝑏𝑒/𝑑𝑄𝑤4𝑤9𝑊𝑔𝑋𝑐𝑄\n\n" +
          "⏱️ 𝐶𝑜𝑜𝑙𝑑𝑜𝑤𝑛: 20 𝑠𝑒𝑐𝑜𝑛𝑑𝑠";
        return message.reply(helpMessage);
      }

      if (youtubeRegex.test(query)) {
        const videoID = query.match(youtubeRegex)[1];
        return await this._handleDirectLink(api, event, videoID, message);
      }

      await this._handleSearch(api, event, query, message);
    } catch (error) {
      console.error("𝑆𝑖𝑛𝑔 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: " + (error.message || "𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟"));
    }
  },

  _handleDirectLink: async function(api, event, videoID, message) {
    try {
      await message.reply("⬇️ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑎𝑢𝑑𝑖𝑜... 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 10-30 𝑠𝑒𝑐𝑜𝑛𝑑𝑠!");

      const apiUrl = "https://api--dipto.repl.co";
      const { data } = await axios.get(`${apiUrl}/ytDl3?link=${videoID}&format=mp3`, {
        timeout: 30000
      });

      if (!data || !data.downloadLink) {
        throw new Error("𝑁𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑙𝑖𝑛𝑘 𝑓𝑜𝑢𝑛𝑑");
      }

      const cacheDir = path.join(__dirname, 'cache');
      fs.ensureDirSync(cacheDir);

      const audioPath = path.join(cacheDir, `audio_${Date.now()}.mp3`);
      await this._downloadFile(data.downloadLink, audioPath);

      const fileSize = fs.statSync(audioPath).size;
      if (fileSize > 25 * 1024 * 1024) {
        try { fs.unlinkSync(audioPath); } catch (e) { }
        throw new Error("𝐹𝑖𝑙𝑒 𝑠𝑖𝑧𝑒 𝑒𝑥𝑐𝑒𝑒𝑑𝑠 25𝑀𝐵 𝑙𝑖𝑚𝑖𝑡");
      }

      const messageBody = `🎵 𝑁𝑜𝑤 𝑃𝑙𝑎𝑦𝑖𝑛𝑔: ${data.title || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑇𝑖𝑡𝑙𝑒"}\n🎚️ 𝑄𝑢𝑎𝑙𝑖𝑡𝑦: ${data.quality || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛"}\n⏱️ 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${data.duration || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛"}`;

      await message.reply({
        body: messageBody,
        attachment: fs.createReadStream(audioPath)
      });

      try {
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      } catch (cleanError) {
        console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanError);
      }

    } catch (error) {
      console.error("𝐷𝑖𝑟𝑒𝑐𝑡 𝐿𝑖𝑛𝑘 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑢𝑑𝑖𝑜: ${error.message || "𝑆𝑒𝑟𝑣𝑒𝑟 𝑚𝑖𝑔ℎ𝑡 𝑏𝑒 𝑏𝑢𝑠𝑦"}`);
    }
  },

  _handleSearch: async function(api, event, query, message) {
    try {
      await message.reply(`🔍 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑓𝑜𝑟 "${query}"...`);

      const apiUrl = "https://api--dipto.repl.co";
      const response = await axios.get(`${apiUrl}/ytFullSearch?songName=${encodeURIComponent(query)}`, {
        timeout: 20000
      });

      const results = Array.isArray(response.data) ? response.data.slice(0, 6) : (response.data && response.data.items ? response.data.items.slice(0,6) : []);

      if (!results || results.length === 0) {
        return message.reply(`🔍 𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟: "${query}"`);
      }

      let messageBody = "🎵 𝑆𝑒𝑎𝑟𝑐ℎ 𝑅𝑒𝑠𝑢𝑙𝑡𝑠:\n\n";
      const choices = [];

      for (const [index, result] of results.entries()) {
        const title = result.title || result.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑇𝑖𝑡𝑙𝑒";
        const time = result.time || result.duration || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";
        const channelName = (result.channel && result.channel.name) ? result.channel.name : (result.channelName || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝐶ℎ𝑎𝑛𝑛𝑒𝑙");
        const id = result.id || result.videoId || result.link || result.url || null;

        messageBody += `${index + 1}. ${title}\n⏱️ ${time} | 👤 ${channelName}\n\n`;
        choices.push({
          title,
          id,
          duration: time
        });
      }

      messageBody += "𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 (1-6) 𝑡𝑜 𝑝𝑙𝑎𝑦 𝑡ℎ𝑒 𝑠𝑜𝑛𝑔";

      const searchMsg = await message.reply(messageBody);

      global.GoatBot.onReply.set(searchMsg.messageID, {
        commandName: this.config.name,
        messageID: searchMsg.messageID,
        author: event.senderID,
        choices
      });

    } catch (error) {
      console.error("𝑆𝑒𝑎𝑟𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑎𝑟𝑐ℎ 𝑓𝑜𝑟 𝑠𝑜𝑛𝑔𝑠. 𝑇ℎ𝑒 𝑠𝑒𝑟𝑣𝑖𝑐𝑒 𝑚𝑖𝑔ℎ𝑡 𝑏𝑒 𝑑𝑜𝑤𝑛 𝑜𝑟 𝑦𝑜𝑢'𝑟𝑒 𝑜𝑓𝑓𝑙𝑖𝑛𝑒.");
    }
  },

  handleReply: async function({ api, event, Reply, message }) {
    try {
      const choice = parseInt(event.body);
      const { choices, messageID } = Reply;

      if (isNaN(choice) || choice < 1 || choice > (choices ? choices.length : 0)) {
        return message.reply("🔢 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1 𝑎𝑛𝑑 " + (choices ? choices.length : 6));
      }

      try { api.unsendMessage(messageID); } catch (e) { }

      const selected = choices[choice - 1];
      await message.reply(`⏳ 𝑃𝑟𝑒𝑝𝑎𝑟𝑖𝑛𝑔: ${selected.title}\n⏱️ 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${selected.duration || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛"}`);

      return await this._handleDirectLink(api, event, selected.id, message);
    } catch (error) {
      console.error("𝑅𝑒𝑝𝑙𝑦 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑦𝑜𝑢𝑟 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛. 𝑇ℎ𝑒 𝑎𝑢𝑑𝑖𝑜 𝑚𝑖𝑔ℎ𝑡 𝑏𝑒 𝑡𝑜𝑜 𝑙𝑎𝑟𝑔𝑒 (𝑚𝑎𝑥 25𝑀𝐵) 𝑜𝑟 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒.");
    }
  },

  _downloadFile: async function(url, outputPath) {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      timeout: 60000
    });

    await fs.writeFile(outputPath, response.data);
    return outputPath;
  }
};
