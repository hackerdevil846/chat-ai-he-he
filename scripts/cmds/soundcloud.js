const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const moment = require('moment-timezone');

async function soundcloudDownload(url) {
  const res = await axios.get('https://soundcloudmp3.org/id');
  const $ = cheerio.load(res.data);
  const _token = $('form#conversionForm > input[type=hidden]').attr('value');

  const conver = await axios.post('https://soundcloudmp3.org/converter',
    new URLSearchParams(Object.entries({ _token, url })),
    {
      headers: {
        cookie: res.headers['set-cookie'],
        accept: 'UTF-8',
      },
    }
  );

  const $$ = cheerio.load(conver.data);
  const datadl = {
    thumb: $$('div.info.clearfix > img').attr('src'),
    title: $$('div.info.clearfix > p:nth-child(2)').text().replace('Title:', '').trim(),
    duration: $$('div.info.clearfix > p:nth-child(3)').text().replace(/Length:|Minutes/gi, '').trim(),
    quality: $$('div.info.clearfix > p:nth-child(4)').text().replace('Quality:', '').trim(),
    url: $$('a#download-btn').attr('href'),
  };

  return datadl;
}

module.exports = {
  config: {
    name: "soundcloud",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑚𝑢𝑠𝑖𝑐 𝑓𝑟𝑜𝑚 𝑆𝑜𝑢𝑛𝑑𝐶𝑙𝑜𝑢𝑑"
    },
    longDescription: {
      en: "𝐹𝑖𝑛𝑑 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑚𝑢𝑠𝑖𝑐 𝑓𝑟𝑜𝑚 𝑆𝑜𝑢𝑛𝑑𝐶𝑙𝑜𝑢𝑑"
    },
    guide: {
      en: "{p}soundcloud [𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "cheerio": "",
      "fs-extra": "",
      "moment-timezone": ""
    }
  },

  onStart: async function({ message, event, args }) {
    const query = args.join(" ").trim();
    const linkURL = `https://soundcloud.com`;
    const headers = {
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
    };

    if (!query) {
      return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦");
    }

    try {
      const response = await axios.get(`https://m.soundcloud.com/search?q=${encodeURIComponent(query)}`, {
        headers
      });
      const htmlContent = response.data;

      const $ = cheerio.load(htmlContent);
      const searchResults = [];

      $("div > ul > li > div").each(function (index, element) {
        if (index < 5) {
          const title = $(element).find("a").attr("aria-label")?.trim() || "";
          const url = linkURL + ($(element).find("a").attr("href") || "").trim();
          const thumb = $(element).find("a > div > div > div > picture > img").attr("src")?.trim() || "";
          const artist = $(element).find("a > div > div > div").eq(1).text()?.trim() || "";
          const views = $(element).find("a > div > div > div > div > div").eq(0).text()?.trim() || "";
          const timestamp = $(element).find("a > div > div > div > div > div").eq(1).text()?.trim() || "";
          const release = $(element).find("a > div > div > div > div > div").eq(2).text()?.trim() || "";

          searchResults.push({
            title,
            url,
            thumb,
            artist,
            views,
            release,
            timestamp,
          });
        }
      });

      if (searchResults.length === 0) {
        return message.reply(`❎ 𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟: "${query}"`);
      }

      const messages = searchResults.map((item, index) => {
        return `\n${index + 1}. 👤 𝐴𝑟𝑡𝑖𝑠𝑡: ${item.artist}\n📜 𝑇𝑖𝑡𝑙𝑒: ${item.title}\n⏳ 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${item.timestamp} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠`;
      });

      const listMessage = `📝 𝑆𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑟: ${query}\n${messages.join("\n")}\n\n📌 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑`;

      message.reply(listMessage, (error, info) => {
        global.client.handleReply.push({
          type: "choose",
          name: this.config.name,
          author: info.senderID,
          messageID: info.messageID,
          searchResults: searchResults,
        });
      });
    } catch (error) {
      console.error("❎ 𝑆𝑒𝑎𝑟𝑐ℎ 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❎ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔");
    }
  },

  handleReply: async function({ event, api, handleReply }) {
    const { threadID, messageID, body } = event;

    switch (handleReply.type) {
      case 'choose':
        const choice = parseInt(body);
        api.unsendMessage(handleReply.messageID);

        if (isNaN(choice)) {
          return api.sendMessage('⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟', threadID, messageID);
        }

        if (choice > 5 || choice < 1) {
          return api.sendMessage('❎ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛', threadID, messageID);
        }

        const chosenItem = handleReply.searchResults[choice - 1];
        const audioURL = chosenItem.url;
        
        try {
          const data = await soundcloudDownload(audioURL);
          const bit = data.quality;
          const downloadURL = data.url;
          const stream = (await axios.get(downloadURL, { responseType: 'arraybuffer' })).data;
          const path = __dirname + `/cache/${Date.now()}.mp3`;

          fs.writeFileSync(path, Buffer.from(stream, 'binary'));

          api.sendMessage({
            body: `[ 𝑆𝑂𝑈𝑁𝐷𝐶𝐿𝑂𝑈𝐷 - 𝑀𝑃3 ]\n────────────────────\n😀 → 𝐴𝑟𝑡𝑖𝑠𝑡: ${chosenItem.artist}\n🐸 → 𝑇𝑖𝑡𝑙𝑒: ${chosenItem.title}\n🥨 → 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${chosenItem.timestamp} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠\n🐧 → 𝑉𝑖𝑒𝑤𝑠: ${chosenItem.views}\n🙃 → 𝑅𝑒𝑙𝑒𝑎𝑠𝑒: ${chosenItem.release}\n📶 → 𝐵𝑖𝑡𝑟𝑎𝑡𝑒: ${bit}\n────────────────────\n🚀 → 𝑇𝑖𝑚𝑒: ${moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss")} (𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ 𝑇𝑖𝑚𝑒)`,
            attachment: fs.createReadStream(path)
          }, threadID, () => {
            setTimeout(() => {
              fs.unlinkSync(path);
            }, 2 * 60 * 1000);
          });
        } catch (error) {
          console.error(error);
          api.sendMessage("❎ 𝐸𝑟𝑟𝑜𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑎𝑢𝑑𝑖𝑜", threadID, messageID);
        }
        break;
      default:
    }
  }
};
