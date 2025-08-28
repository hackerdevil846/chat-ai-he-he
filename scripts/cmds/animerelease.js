const axios = require('axios');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "animerelease",
    aliases: ["release", "newepisode"],
    version: "7.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "anime",
    shortDescription: {
      en: "𝑆ℎ𝑎𝑟𝑒𝑠 𝑡ℎ𝑒 𝑙𝑎𝑡𝑒𝑠𝑡 𝑎𝑛𝑖𝑚𝑒 𝑟𝑒𝑙𝑒𝑎𝑠𝑒𝑠."
    },
    longDescription: {
      en: "𝑆ℎ𝑎𝑟𝑒𝑠 𝑡ℎ𝑒 𝑙𝑎𝑡𝑒𝑠𝑡 𝑎𝑛𝑖𝑚𝑒 𝑟𝑒𝑙𝑒𝑎𝑠𝑒𝑠 𝑓𝑒𝑡𝑐ℎ𝑒𝑑 𝑓𝑟𝑜𝑚 𝑎𝑛 𝐴𝑃𝐼."
    },
    guide: {
      en: "{𝑝}𝑎𝑛𝑖𝑚𝑒𝑟𝑒𝑙𝑒𝑎𝑠𝑒"
    }
  },

  onStart: async function({ message, event }) {
    try {
      const Timezone = 'Asia/Dhaka'; // Changed to Asia/Dhaka
      const API_URL = `https://anisched--marok85067.repl.co/?timezone=${Timezone}`;

      const response = await axios.get(API_URL);
      if (response.status !== 200 || !response.data || !Array.isArray(response.data)) {
        throw new Error('𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑟 𝑚𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝐴𝑃𝐼.');
      }

      const releases = response.data;
      const currentTime = moment().tz(Timezone);
      let upcomingAnime = [];
      let updatedAnime = [];

      for (const release of releases) {
        if (!release.animeTitle || !release.episode || !release.time || !release.status) {
          throw new Error('𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑟 𝑚𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑎𝑡𝑎 𝑖𝑛 𝑡ℎ𝑒 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝐴𝑃𝐼.');
        }

        const releaseDateTime = moment(release.time, 'h:mma', Timezone);
        const releaseTime = moment(releaseDateTime).tz(Timezone);

        if (release.status === 'upcoming') {
          upcomingAnime.push(release);
        } else if (release.status === 'already updated') {
          updatedAnime.push(release);
        }
      }

      let messageText = `𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑇𝑖𝑚𝑒 (𝐴𝑠𝑖𝑎/𝐷𝑕𝑎𝑘𝑎): ${currentTime.format('h:mma')}\n\n`;

      if (upcomingAnime.length > 0) {
        messageText += '≡⊆ 𝐴𝑁𝐼𝑀𝐸 𝑈𝑃𝐶𝑂𝑀𝐼𝑁𝐺 𝑇𝐻𝐼𝑆 𝐹𝐸𝑊 𝐻𝑂𝑈𝑅𝑆 ⊇≡\n\n';
        upcomingAnime.sort((a, b) => moment(a.time, 'h:mma').diff(moment(b.time, 'h:mma')));
        for (const anime of upcomingAnime) {
          messageText += `𝐴𝑛𝑖𝑚𝑒: ${anime.animeTitle}\n𝐸𝑝𝑖𝑠𝑜𝑑𝑒: ${anime.episode}\n𝑇𝑖𝑚𝑒: ${anime.time}\n\n`;
        }
      }

      if (updatedAnime.length > 0) {
        messageText += '≡⊆ 𝐴𝑁𝐼𝑀𝐸 𝐴𝐿𝑅𝐸𝐴𝐷𝑌 𝑈𝑃𝐷𝐴𝑇𝐸𝐷 ⊇≡\n\n';
        updatedAnime.sort((a, b) => moment(a.time, 'h:mma').diff(moment(b.time, 'h:mma')));
        for (const anime of updatedAnime) {
          messageText += `𝐴𝑛𝑖𝑚𝑒: ${anime.animeTitle}\n𝐸𝑝𝑖𝑠𝑜𝑑𝑒: ${anime.episode}\n𝑇𝑖𝑚𝑒: ${anime.time}\n\n`;
        }
      }

      if (messageText === `𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑇𝑖𝑚𝑒 (𝐴𝑠𝑖𝑎/𝐷𝑕𝑎𝑘𝑎): ${currentTime.format('h:mma')}\n\n`) {
        messageText += '𝑁𝑜 𝑎𝑛𝑖𝑚𝑒 𝑟𝑒𝑙𝑒𝑎𝑠𝑒𝑠 𝑓𝑜𝑟 𝑡𝑜𝑑𝑎𝑦.';
      }

      await message.reply(messageText.trim());
    } catch (error) {
      console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑎𝑛𝑖𝑚𝑒 𝑟𝑒𝑙𝑒𝑎𝑠𝑒𝑠: ${error.message}`);
      message.reply('❌ 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔 𝑤ℎ𝑖𝑙𝑒 𝑡𝑟𝑦𝑖𝑛𝑔 𝑡𝑜 𝑠ℎ𝑎𝑟𝑒 𝑡ℎ𝑒 𝑙𝑎𝑡𝑒𝑠𝑡 𝑎𝑛𝑖𝑚𝑒 𝑟𝑒𝑙𝑒𝑎𝑠𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.');
    }
  }
};
