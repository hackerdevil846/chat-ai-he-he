const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

// 𝙃𝙚𝙡𝙥𝙚𝙧 𝙛𝙪𝙣𝙘𝙩𝙞𝙤𝙣 𝙩𝙤 𝙘𝙤𝙣𝙫𝙚𝙧𝙩 𝙩𝙚𝙭𝙩 𝙩𝙤 𝙈𝙖𝙩𝙝𝙚𝙢𝙖𝙩𝙞𝙘𝙖𝙡 𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘
function toBoldItalic(text) {
  const map = {
    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
    'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
    'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛'
  };
  return text.replace(/[A-Za-z]/g, char => map[char] || char);
}

// 𝙇𝙤𝙖𝙙 𝙖𝙪𝙩𝙤𝙡𝙞𝙣𝙠 𝙨𝙩𝙖𝙩𝙚𝙨
function loadAutoLinkStates() {
  try {
    const data = fs.readFileSync("autolink.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

// 𝙎𝙖𝙫𝙚 𝙖𝙪𝙩𝙤𝙡𝙞𝙣𝙠 𝙨𝙩𝙖𝙩𝙚𝙨
function saveAutoLinkStates(states) {
  fs.writeFileSync("autolink.json", JSON.stringify(states, null, 2));
}

let autoLinkStates = loadAutoLinkStates();

module.exports = {
  config: {
    name: "autolink",
    version: "3.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝑰𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎, 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌, 𝑻𝒊𝒌𝑻𝒐𝒌, 𝑻𝒘𝒊𝒕𝒕𝒆𝒓, 𝑷𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕, 𝒂𝒏𝒅 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝒂𝒖𝒕𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒓"
    },
    longDescription: {
      en: "𝑨𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒔 𝒎𝒆𝒅𝒊𝒂 𝒇𝒓𝒐𝒎 𝒗𝒂𝒓𝒊𝒐𝒖𝒔 𝒔𝒐𝒄𝒊𝒂𝒍 𝒎𝒆𝒅𝒊𝒂 𝒑𝒍𝒂𝒕𝒇𝒐𝒓𝒎𝒔 𝒘𝒉𝒆𝒏 𝒂 𝒍𝒊𝒏𝒌 𝒊𝒔 𝒔𝒉𝒂𝒓𝒆𝒅 𝒊𝒏 𝒕𝒉𝒆 𝒄𝒉𝒂𝒕"
    },
    category: "𝒎𝒆𝒅𝒊𝒂",
    guide: {
      en: "{p}autolink [on/off] - 𝑻𝒖𝒓𝒏 𝒂𝒖𝒕𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒇𝒆𝒂𝒕𝒖𝒓𝒆 𝒐𝒏 𝒐𝒓 𝒐𝒇𝒇"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "cheerio": "",
      "qs": ""
    }
  },

  threadStates: {},
  
  onStart: async function ({ api, event, message, args }) {
    const threadID = event.threadID;

    if (!autoLinkStates[threadID]) {
      autoLinkStates[threadID] = 'on';
      saveAutoLinkStates(autoLinkStates);
    }

    if (!this.threadStates[threadID]) {
      this.threadStates[threadID] = {};
    }

    if (args[0] && args[0].toLowerCase() === 'off') {
      autoLinkStates[threadID] = 'off';
      saveAutoLinkStates(autoLinkStates);
      await message.reply(toBoldItalic("𝑨𝒖𝒕𝒐𝑳𝒊𝒏𝒌 𝒆𝒊 𝒄𝒉𝒂𝒕 𝒆 𝒃𝒐𝒏𝒅𝒉𝒐 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆"));
    } else if (args[0] && args[0].toLowerCase() === 'on') {
      autoLinkStates[threadID] = 'on';
      saveAutoLinkStates(autoLinkStates);
      await message.reply(toBoldItalic("𝑨𝒖𝒕𝒐𝑳𝒊𝒏𝒌 𝒆𝒊 𝒄𝒉𝒂𝒕 𝒆 𝒄𝒉𝒂𝒍𝒖 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆"));
    } else {
      await message.reply(toBoldItalic(`𝑨𝒖𝒕𝒐𝑳𝒊𝒏𝒌 𝒊𝒔 𝒄𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 ${autoLinkStates[threadID] === 'on' ? '𝑶𝑵' : '𝑶𝑭𝑭'} 𝒇𝒐𝒓 𝒕𝒉𝒊𝒔 𝒄𝒉𝒂𝒕`));
    }
  },
  
  onChat: async function ({ event, message, api }) {
    const threadID = event.threadID;

    if (this.checkLink(event.body)) {
      const { url } = this.checkLink(event.body);
      console.log(toBoldItalic(`𝑨𝒕𝒕𝒆𝒎𝒑𝒕𝒊𝒏𝒈 𝒕𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒇𝒓𝒐𝒎 𝑼𝑹𝑳: ${url}`));
      if (autoLinkStates[threadID] === 'on' || !autoLinkStates[threadID]) {
        this.downLoad(url, message, event);
      }
      api.setMessageReaction("🫦", event.messageID, (err) => {}, true);
    }
  },
  
  downLoad: function (url, message, event) {
    const time = Date.now();
    const path = __dirname + `/cache/${time}.mp4`;

    if (url.includes("instagram")) {
      this.downloadInstagram(url, message, event, path);
    } else if (url.includes("facebook") || url.includes("fb.watch")) {
      this.downloadFacebook(url, message, event, path);
    } else if (url.includes("tiktok")) {
      this.downloadTikTok(url, message, event, path);
    } else if (url.includes("x.com")) {
      this.downloadTwitter(url, message, event, path);
    } else if (url.includes("pin.it")) {
      this.downloadPinterest(url, message, event, path);
    } else if (url.includes("youtu")) {
      this.downloadYouTube(url, message, event, path);
    }
  },
  
  downloadInstagram: async function (url, message, event, path) {
    try {
      const res = await this.getLink(url, message, event, path);
      const response = await axios({
        method: "GET",
        url: res,
        responseType: "arraybuffer"
      });
      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
      if (fs.statSync(path).size / 1024 / 1024 > 25) {
        return message.reply(toBoldItalic("𝑭𝒊𝒍𝒆 𝒕𝒂 𝒐𝒏𝒆𝒌 𝒃𝒐𝒓𝒐, 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒃𝒆 𝒏𝒂"));
      }

      const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑳𝒊𝒏𝒌')}: ${res}`;

      await message.reply({
        body: toBoldItalic(messageBody),
        attachment: fs.createReadStream(path)
      });
      fs.unlinkSync(path);
    } catch (err) {
      console.error(err);
      await message.reply(toBoldItalic("𝑰𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓"));
    }
  },
  
  downloadFacebook: async function (url, message, event, path) {
    try {
      const res = await fbDownloader(url);
      if (res.success && res.download && res.download.length > 0) {
        const videoUrl = res.download[0].url;
        const response = await axios({
          method: "GET",
          url: videoUrl,
          responseType: "stream"
        });
        if (response.headers['content-length'] > 87031808) {
          return message.reply(toBoldItalic("𝑭𝒊𝒍𝒆 𝒕𝒂 𝒐𝒏𝒆𝒌 𝒃𝒐𝒓𝒐, 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒃𝒆 𝒏𝒂"));
        }
        
        const writer = fs.createWriteStream(path);
        response.data.pipe(writer);
        
        writer.on('finish', async () => {
          const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑳𝒊𝒏𝒌')}: ${videoUrl}`;

          await message.reply({
            body: toBoldItalic(messageBody),
            attachment: fs.createReadStream(path)
          });
          fs.unlinkSync(path);
        });
        
        writer.on('error', (err) => {
          console.error(err);
          message.reply(toBoldItalic("𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓"));
        });
      } else {
        await message.reply(toBoldItalic("𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓"));
      }
    } catch (err) {
      console.error(err);
      await message.reply(toBoldItalic("𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓"));
    }
  },
  
  downloadTikTok: async function (url, message, event, path) {
    try {
      const res = await this.getLink(url, message, event, path);
      const response = await axios({
        method: "GET",
        url: res,
        responseType: "arraybuffer"
      });
      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
      if (fs.statSync(path).size / 1024 / 1024 > 25) {
        return message.reply(toBoldItalic("𝑭𝒊𝒍𝒆 𝒕𝒂 𝒐𝒏𝒆𝒌 𝒃𝒐𝒓𝒐, 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒃𝒆 𝒏𝒂"));
      }

      const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑳𝒊𝒏𝒌')}: ${res}`;

      await message.reply({
        body: toBoldItalic(messageBody),
        attachment: fs.createReadStream(path)
      });
      fs.unlinkSync(path);
    } catch (err) {
      console.error(err);
      await message.reply(toBoldItalic("𝑻𝒊𝒌𝑻𝒐𝒌 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓"));
    }
  },
  
  downloadTwitter: async function (url, message, event, path) {
    try {
      const res = await axios.get(`https://xdl-twitter.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
      const videoUrl = res.data.url;

      const response = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream"
      });

      if (response.headers['content-length'] > 87031808) {
        return message.reply(toBoldItalic("𝑭𝒊𝒍𝒆 𝒕𝒂 𝒐𝒏𝒆𝒌 𝒃𝒐𝒓𝒐, 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒃𝒆 𝒏𝒂"));
      }

      const writer = fs.createWriteStream(path);
      response.data.pipe(writer);
      
      writer.on('finish', async () => {
        const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑳𝒊𝒏𝒌')}: ${videoUrl}`;

        await message.reply({
          body: toBoldItalic(messageBody),
          attachment: fs.createReadStream(path)
        });
        fs.unlinkSync(path);
      });
      
      writer.on('error', (err) => {
        console.error(err);
        message.reply(toBoldItalic("𝑻𝒘𝒊𝒕𝒕𝒆𝒓 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓"));
      });
    } catch (err) {
      console.error(err);
      await message.reply(toBoldItalic("𝑻𝒘𝒊𝒕𝒕𝒆𝒓 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓"));
    }
  },
  
  downloadPinterest: async function (url, message, event, path) {
    try {
      const res = await axios.get(`https://pindl-pinterest.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
      const videoUrl = res.data.url;

      const response = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream"
      });

      if (response.headers['content-length'] > 87031808) {
        return message.reply(toBoldItalic("𝑭𝒊𝒍𝒆 𝒕𝒂 𝒐𝒏𝒆𝒌 𝒃𝒐𝒓𝒐, 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒃𝒆 𝒏𝒂"));
      }

      const writer = fs.createWriteStream(path);
      response.data.pipe(writer);
      
      writer.on('finish', async () => {
        const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑳𝒊𝒏𝒌')}: ${videoUrl}`;

        await message.reply({
          body: toBoldItalic(messageBody),
          attachment: fs.createReadStream(path)
        });
        fs.unlinkSync(path);
      });
      
      writer.on('error', (err) => {
        console.error(err);
        message.reply(toBoldItalic("𝑷𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓"));
      });
    } catch (err) {
      console.error(err);
      await message.reply(toBoldItalic("𝑷𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓"));
    }
  },
  
  downloadYouTube: async function (url, message, event, path) {
    try {
      const res = await axios.get(`https://yt-downloader-eta.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
      const videoUrl = res.data['480p'];

      const response = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream"
      });

      if (response.headers['content-length'] > 87031808) {
        return message.reply(toBoldItalic("𝑭𝒊𝒍𝒆 𝒕𝒂 𝒐𝒏𝒆𝒌 𝒃𝒐𝒓𝒐, 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒃𝒆 𝒏𝒂"));
      }

      const writer = fs.createWriteStream(path);
      response.data.pipe(writer);
      
      writer.on('finish', async () => {
        const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑳𝒊𝒏𝒌')}: ${videoUrl}`;

        await message.reply({
          body: toBoldItalic(messageBody),
          attachment: fs.createReadStream(path)
        });
        fs.unlinkSync(path);
      });
      
      writer.on('error', (err) => {
        console.error(err);
        message.reply(toBoldItalic("𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓"));
      });
    } catch (err) {
      console.error(err);
      await message.reply(toBoldItalic("𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓"));
    }
  },

  getLink: function (url, message, event, path) {
    return new Promise((resolve, reject) => {
      if (url.includes("instagram")) {
        axios({
          method: "GET",
          url: `https://insta-downloader-ten.vercel.app/insta?url=${encodeURIComponent(url)}`
        })
        .then(res => {
          if (res.data.url) {
            resolve(res.data.url);
          } else {
            reject(new Error(toBoldItalic("𝑬𝒓𝒓𝒐𝒓: 𝑨𝑷𝑰 𝒓𝒆𝒔𝒑𝒐𝒏𝒔𝒆 𝒊𝒏𝒗𝒂𝒍𝒊𝒅")));
          }
        })
        .catch(err => reject(err));
      } else if (url.includes("facebook") || url.includes("fb.watch")) {
        fbDownloader(url).then(res => {
          if (res.success && res.download && res.download.length > 0) {
            const videoUrl = res.download[0].url;
            resolve(videoUrl);
          } else {
            reject(new Error(toBoldItalic("𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓")));
          }
        }).catch(err => reject(err));
      } else if (url.includes("tiktok")) {
        this.queryTikTok(url).then(res => {
          resolve(res.downloadUrls);
        }).catch(err => reject(err));
      } else {
        reject(new Error(toBoldItalic("𝑼𝒏𝒔𝒖𝒑𝒑𝒐𝒓𝒕𝒆𝒅 𝒑𝒍𝒂𝒕𝒇𝒐𝒓𝒎")));
      }
    });
  },
  
  queryTikTok: async function (url) {
    try {
      const res = await axios.get("https://ssstik.io/en");
      const s_tt = res.data.split('s_tt = ')[1].split(',')[0];
      const { data: result } = await axios({
        url: "https://ssstik.io/abc?url=dl",
        method: "POST",
        data: qs.stringify({
          id: url,
          locale: 'en',
          tt: s_tt
        }),
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33"
        }
      });

      const $ = cheerio.load(result);
      if (result.includes('<div class="is-icon b-box warning">')) {
        throw {
          status: "error",
          message: $('p').text()
        };
      }

      const allUrls = $('.result_overlay_buttons > a');
      const format = {
        status: 'success',
        title: $('.maintext').text()
      };

      const slide = $(".slide");
      if (slide.length !== 0) {
        const url = [];
        slide.each((index, element) => {
          url.push($(element).attr('href'));
        });
        format.downloadUrls = url;
        return format;
      }

      format.downloadUrls = $(allUrls[0]).attr('href');
      return format;
    } catch (err) {
      console.error(toBoldItalic('𝑻𝒊𝒌𝑻𝒐𝒌 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓:'), err);
      return {
        status: "error",
        message: toBoldItalic("𝑻𝒊𝒌𝑻𝒐𝒌 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒑𝒓𝒐𝒃𝒍𝒆𝒎")
      };
    }
  },
  
  checkLink: function (url) {
    if (
      url.includes("instagram") ||
      url.includes("facebook") ||
      url.includes("fb.watch") ||
      url.includes("tiktok") ||
      url.includes("x.com") ||
      url.includes("pin.it") ||
      url.includes("youtu")
    ) {
      return {
        url: url
      };
    }

    const fbWatchRegex = /fb\.watch\/[a-zA-Z0-9_-]+/i;
    if (fbWatchRegex.test(url)) {
      return {
        url: url
      };
    }

    return null;
  }
};

async function fbDownloader(url) {
  try {
    const response1 = await axios({
      method: 'POST',
      url: 'https://snapsave.app/action.php?lang=vn',
      headers: {
        "accept": "*/*",
        "accept-language": "vi,en-US;q=0.9,en;q=0.8",
        "content-type": "multipart/form-data",
        "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "Referer": "https://snapsave.app/vn",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      data: {
        url
      }
    });

    let html;
    const evalCode = response1.data.replace('return decodeURIComponent', 'html = decodeURIComponent');
    eval(evalCode);
    html = html.split('innerHTML = "')[1].split('";\n')[0].replace(/\\"/g, '"');

    const $ = cheerio.load(html);
    const download = [];

    const tbody = $('table').find('tbody');
    const trs = tbody.find('tr');

    trs.each(function (i, elem) {
      const trElement = $(elem);
      const tds = trElement.children();
      const quality = $(tds[0]).text().trim();
      const url = $(tds[2]).children('a').attr('href');
      if (url != undefined) {
        download.push({
          quality,
          url
        });
      }
    });

    return {
      success: true,
      video_length: $("div.clearfix > p").text().trim(),
      download
    };
  } catch (err) {
    console.error(toBoldItalic('𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓:'), err);
    return {
      success: false
    };
  }
}
