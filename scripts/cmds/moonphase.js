const moment = require("moment-timezone");
const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false
});

module.exports = {
  config: {
    name: "moonphase",
    version: "1.0.0",
    role: 0,
    author: "Asif Mahmud",
    category: "utility",
    shortDescription: {
      en: "View moon image on your birthday"
    },
    longDescription: {
      en: "See what the moon looked like on your birth date with detailed information"
    },
    guide: {
      en: "moonphase [DD/MM/YYYY] or follow interactive prompts"
    },
    countDown: 5,
    dependencies: {
      "moment-timezone": "",
      "axios": "",
      "cheerio": ""
    }
  },

  onStart: async function ({ message, event }) {
    try {
      await message.reply("Reply to this message and enter the day of your birth", event.threadID, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "replyDay",
          date: {}
        });
      });
    } catch (error) {
      console.error(error);
      message.reply("An error occurred, please try again later.");
    }
  },

  handleReply: async function ({ event, handleReply, message }) {
    try {
      if (handleReply.author !== event.senderID) return;

      switch (handleReply.type) {
        case 'replyDay': {
          const day = parseInt(event.body);
          if (day < 1 || day > 31) {
            return message.reply("The day you entered is invalid");
          }
          handleReply.date.day = day;
          return message.reply("Reply to this message and enter the month", event.threadID, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: 'replyMonth',
              date: handleReply.date
            });
          });
        }

        case 'replyMonth': {
          const month = parseInt(event.body);
          if (month < 1 || month > 12) {
            return message.reply("The month you entered is invalid");
          }
          handleReply.date.month = month;
          return message.reply("Reply to this message and enter the year", event.threadID, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: 'done',
              date: handleReply.date
            });
          });
        }

        case 'done': {
          const year = parseInt(event.body);
          const dateStr = `${handleReply.date.day}/${handleReply.date.month}/${year}`;
          
          if (!moment(dateStr, 'DD/MM/YYYY', true).isValid()) {
            return message.reply("Please enter a valid date in DD/MM/YYYY format");
          }

          const linkCrawl = `https://lunaf.com/lunar-calendar/${year}/${handleReply.date.month}/${handleReply.date.day}/`;

          try {
            const html = await axios.get(linkCrawl, { httpsAgent: agent });
            const $ = cheerio.load(html.data);
            const href = $("figure.mimg img").attr("src");
            
            if (!href) {
              return message.reply(`Could not retrieve moon image for date ${dateStr}`);
            }

            const moonImages = [
              'https://i.ibb.co/9shyYH1/moon-0.png',
              'https://i.ibb.co/vBXLL37/moon-1.png',
              'https://i.ibb.co/0QCKK9D/moon-2.png',
              'https://i.ibb.co/Dp62X2j/moon-3.png',
              'https://i.ibb.co/xFKCtfd/moon-4.png',
              'https://i.ibb.co/m4L533L/moon-5.png',
              'https://i.ibb.co/VmshdMN/moon-6.png',
              'https://i.ibb.co/4N7R2B2/moon-7.png',
              'https://i.ibb.co/C2k4YB8/moon-8.png',
              'https://i.ibb.co/F62wHxP/moon-9.png',
              'https://i.ibb.co/Gv6R1mk/moon-10.png',
              'https://i.ibb.co/0ZYY7Kk/moon-11.png',
              'https://i.ibb.co/KqXC5F5/moon-12.png',
              'https://i.ibb.co/BGtLpRJ/moon-13.png',
              'https://i.ibb.co/jDn7pPx/moon-14.png',
              'https://i.ibb.co/kykn60t/moon-15.png',
              'https://i.ibb.co/qD4LFLs/moon-16.png',
              'https://i.ibb.co/qJm9gcQ/moon-17.png',
              'https://i.ibb.co/yYFYZx9/moon-18.png',
              'https://i.ibb.co/8bc7vpZ/moon-19.png',
              'https://i.ibb.co/jHG7DKs/moon-20.png',
              'https://i.ibb.co/5WD18Rn/moon-21.png',
              'https://i.ibb.co/3Y06yHM/moon-22.png',
              'https://i.ibb.co/4T8Zdfy/moon-23.png',
              'https://i.ibb.co/n1CJyP4/moon-24.png',
              'https://i.ibb.co/zFwJRqz/moon-25.png',
              'https://i.ibb.co/gVBmMCW/moon-26.png',
              'https://i.ibb.co/hRY89Hn/moon-27.png',
              'https://i.ibb.co/7C13s7Z/moon-28.png',
              'https://i.ibb.co/2hDTwB4/moon-29.png',
              'https://i.ibb.co/Rgj9vpj/moon-30.png',
              'https://i.ibb.co/s5z0w9R/moon-31.png'
            ];

            const moonIndex = Number(href.match(/\d+/)[0]);
            const imgSrc = moonImages[moonIndex];

            const msg = `- Moon image on the night of ${dateStr}`
              + `\n- ${$($('h3').get()[0]).text()}`
              + `\n- ${$("#phimg > small").text()}`
              + `\n- ${linkCrawl}`
              + `\n- https://lunaf.com/img/moon/h-${href.slice(href.lastIndexOf("/") + 1)}`;

            const streamImg = await global.utils.getStreamFromURL(imgSrc);
            message.reply({
              body: msg,
              attachment: streamImg
            });
          } catch (error) {
            console.error(error);
            message.reply(`An error occurred while retrieving the moon image for date ${dateStr}`);
          }
          break;
        }
      }
    } catch (error) {
      console.error(error);
      message.reply("An error occurred, please try again later.");
    }
  }
};
