const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const { getStreamFromURL, shortenURL, randomString } = global.utils;

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
  threadStates: {},
  config: {
    name: 'autolink',
    version: '3.0',
    author: '𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅',
    countDown: 5,
    role: 0,
    shortDescription: toBoldItalic('𝙄𝙣𝙨𝙩𝙖𝙜𝙧𝙖𝙢, 𝙁𝙖𝙘𝙚𝙗𝙤𝙤𝙠, 𝙏𝙞𝙠𝙏𝙤𝙠, 𝙏𝙬𝙞𝙩𝙩𝙚𝙧, 𝙋𝙞𝙣𝙩𝙚𝙧𝙚𝙨𝙩, 𝙖𝙣𝙙 𝙔𝙤𝙪𝙏𝙪𝙗𝙚 𝙖𝙪𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙𝙚𝙧'),
    longDescription: '',
    category: '𝙈𝙚𝙙𝙞𝙖',
    guide: {
      en: '{p}{n}',
    }
  },
  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    if (!autoLinkStates[threadID]) {
      autoLinkStates[threadID] = 'on';
      saveAutoLinkStates(autoLinkStates);
    }

    if (!this.threadStates[threadID]) {
      this.threadStates[threadID] = {};
    }

    if (event.body.toLowerCase().includes('autolink off')) {
      autoLinkStates[threadID] = 'off';
      saveAutoLinkStates(autoLinkStates);
      api.sendMessage(toBoldItalic("𝘼𝙪𝙩𝙤𝙇𝙞𝙣𝙠 𝙚𝙞 𝙘𝙝𝙖𝙩 𝙚 𝙗𝙤𝙣𝙙𝙝𝙤 𝙠𝙤𝙧𝙖 𝙝𝙤𝙮𝙚𝙘𝙝𝙚"), event.threadID, event.messageID);
    } else if (event.body.toLowerCase().includes('autolink on')) {
      autoLinkStates[threadID] = 'on';
      saveAutoLinkStates(autoLinkStates);
      api.sendMessage(toBoldItalic("𝘼𝙪𝙩𝙤𝙇𝙞𝙣𝙠 𝙚𝙞 𝙘𝙝𝙖𝙩 𝙚 𝙘𝙝𝙖𝙡𝙪 𝙠𝙤𝙧𝙖 �𝙝𝙤𝙮𝙚𝙘𝙝𝙚"), event.threadID, event.messageID);
    }
  },
  onChat: async function ({ api, event }) {
    const threadID = event.threadID;

    if (this.checkLink(event.body)) {
      const { url } = this.checkLink(event.body);
      console.log(`𝙰𝚝𝚝𝚎𝚖𝚙𝚝𝚒𝚗𝚐 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚏𝚛𝚘𝚖 𝚄𝚁𝙻: ${url}`);
      if (autoLinkStates[threadID] === 'on' || !autoLinkStates[threadID]) {
        this.downLoad(url, api, event);
      } else {
        api.sendMessage("", event.threadID, event.messageID);
      }
      api.setMessageReaction("🫦", event.messageID, (err) => {}, true);
    }
  },
  downLoad: function (url, api, event) {
    const time = Date.now();
    const path = __dirname + `/cache/${time}.mp4`;

    if (url.includes("instagram")) {
      this.downloadInstagram(url, api, event, path);
    } else if (url.includes("facebook") || url.includes("fb.watch")) {
      this.downloadFacebook(url, api, event, path);
    } else if (url.includes("tiktok")) {
      this.downloadTikTok(url, api, event, path);
    } else if (url.includes("x.com")) {
      this.downloadTwitter(url, api, event, path);
    } else if (url.includes("pin.it")) {
      this.downloadPinterest(url, api, event, path);
    } else if (url.includes("youtu")) {
      this.downloadYouTube(url, api, event, path);
    }
  },
  downloadInstagram: async function (url, api, event, path) {
    try {
      const res = await this.getLink(url, api, event, path);
      const response = await axios({
        method: "GET",
        url: res,
        responseType: "arraybuffer"
      });
      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
      if (fs.statSync(path).size / 1024 / 1024 > 25) {
        return api.sendMessage(toBoldItalic("𝙁𝙞𝙡𝙚 𝙩𝙖 𝙤𝙣𝙚𝙠 𝙗𝙤𝙧𝙤, 𝙥𝙖𝙩𝙝𝙖𝙣𝙤 𝙟𝙖𝙗𝙚 𝙣𝙖"), event.threadID, () => fs.unlinkSync(path), event.messageID);
      }

      const shortUrl = await shortenURL(res);
      const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n ╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('Download Link')}: ${shortUrl}`;

      api.sendMessage({
        body: toBoldItalic(messageBody),
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    } catch (err) {
      console.error(err);
    }
  },
  downloadFacebook: async function (url, api, event, path) {
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
          return api.sendMessage(toBoldItalic("𝙁𝙞𝙡𝙚 �𝙖 𝙤𝙣𝙚𝙠 �𝙗𝙤𝙧𝙤, 𝙥𝙖𝙩𝙝𝙖𝙣𝙤 𝙟𝙖𝙗𝙚 𝙣𝙖"), event.threadID, () => fs.unlinkSync(path), event.messageID);
        }
        response.data.pipe(fs.createWriteStream(path));
        response.data.on('end', async () => {
          const shortUrl = await shortenURL(videoUrl);
          const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n ╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('Download Link')}: ${shortUrl}`;

          api.sendMessage({
            body: toBoldItalic(messageBody),
            attachment: fs.createReadStream(path)
          }, event.threadID, () => fs.unlinkSync(path), event.messageID);
        });
      } else {
        api.sendMessage("", event.threadID, event.messageID);
      }
    } catch (err) {
      console.error(err);
    }
  },
  downloadTikTok: async function (url, api, event, path) {
    try {
      const res = await this.getLink(url, api, event, path);
      const response = await axios({
        method: "GET",
        url: res,
        responseType: "arraybuffer"
      });
      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
      if (fs.statSync(path).size / 1024 / 1024 > 25) {
        return api.sendMessage(toBoldItalic("𝙁𝙞𝙡𝙚 𝙩𝙖 𝙤𝙣𝙚𝙠 𝙗𝙤𝙧𝙤, 𝙥𝙖𝙩𝙝𝙖𝙣𝙤 𝙟𝙖𝙗𝙚 𝙣𝙖"), event.threadID, () => fs.unlinkSync(path), event.messageID);
      }

      const shortUrl = await shortenURL(res);
      const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n ╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('Download Link')}: ${shortUrl}`;

      api.sendMessage({
        body: toBoldItalic(messageBody),
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    } catch (err) {
      console.error(err);
    }
  },
  downloadTwitter: async function (url, api, event, path) {
    try {
      const res = await axios.get(`https://xdl-twitter.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
      const videoUrl = res.data.url;

      const response = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream"
      });

      if (response.headers['content-length'] > 87031808) {
        return api.sendMessage(toBoldItalic("𝙁𝙞𝙡𝙚 𝙩𝙖 𝙤𝙣𝙚𝙠 𝙗𝙤𝙧𝙤, 𝙥𝙖𝙩𝙝𝙖𝙣𝙤 𝙟𝙖𝙗𝙚 𝙣𝙖"), event.threadID, () => fs.unlinkSync(path), event.messageID);
      }

      response.data.pipe(fs.createWriteStream(path));
      response.data.on('end', async () => {
        const shortUrl = await shortenURL(videoUrl);
        const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n ╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('Download Link')}: ${shortUrl}`;

        api.sendMessage({
          body: toBoldItalic(messageBody),
          attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
      });
    } catch (err) {
      console.error(err);
    }
  },
  downloadPinterest: async function (url, api, event, path) {
    try {
      const res = await axios.get(`https://pindl-pinterest.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
      const videoUrl = res.data.url;

      const response = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream"
      });

      if (response.headers['content-length'] > 87031808) {
        return api.sendMessage(toBoldItalic("𝙁𝙞𝙡𝙚 𝙩𝙖 𝙤𝙣𝙚𝙠 𝙗𝙤𝙧𝙤, 𝙥𝙖𝙩𝙝𝙖𝙣𝙤 𝙟𝙖𝙗𝙚 𝙣𝙖"), event.threadID, () => fs.unlinkSync(path), event.messageID);
      }

      response.data.pipe(fs.createWriteStream(path));
      response.data.on('end', async () => {
        const shortUrl = await shortenURL(videoUrl);
        const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n ╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('Download Link')}: ${shortUrl}`;

        api.sendMessage({
          body: toBoldItalic(messageBody),
          attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
      });
    } catch (err) {
      console.error(err);
    }
  },
  downloadYouTube: async function (url, api, event, path) {
    try {
      const res = await axios.get(`https://yt-downloader-eta.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
      const videoUrl = res.data['480p'];

      const response = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream"
      });

      if (response.headers['content-length'] > 87031808) {
        return api.sendMessage(toBoldItalic("𝙁𝙞𝙡𝙚 𝙩𝙖 𝙤𝙣𝙚𝙠 𝙗𝙤𝙧𝙤, 𝙥𝙖𝙩𝙝𝙖𝙣𝙤 𝙟𝙖𝙗𝙚 𝙣𝙖"), event.threadID, () => fs.unlinkSync(path), event.messageID);
      }

      response.data.pipe(fs.createWriteStream(path));
      response.data.on('end', async () => {
        const shortUrl = await shortenURL(videoUrl);
        const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n ╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('Download Link')}: ${shortUrl}`;

        api.sendMessage({
          body: toBoldItalic(messageBody),
          attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
      });
    } catch (err) {
      console.error(err);
    }
  },

  getLink: function (url, api, event, path) {
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
            reject(new Error(toBoldItalic("𝙀𝙧𝙧𝙤𝙧: 𝘼𝙋𝙄 𝙧𝙚𝙨𝙥𝙤𝙣𝙨𝙚 𝙞𝙣𝙫𝙖𝙡𝙞𝙙")));
          }
        })
        .catch(err => reject(err));
      } else if (url.includes("facebook") || url.includes("fb.watch")) {
        fbDownloader(url).then(res => {
          if (res.success && res.download && res.download.length > 0) {
            const videoUrl = res.download[0].url;
            resolve(videoUrl);
          } else {
            reject(new Error(toBoldItalic("𝙁𝙖𝙘𝙚𝙗𝙤𝙤𝙠 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙚𝙧𝙧𝙤𝙧")));
          }
        }).catch(err => reject(err));
      } else if (url.includes("tiktok")) {
        this.queryTikTok(url).then(res => {
          resolve(res.downloadUrls);
        }).catch(err => reject(err));
      } else {
        reject(new Error(toBoldItalic("𝙐𝙣𝙨𝙪𝙥𝙥𝙤𝙧𝙩𝙚𝙙 𝙥𝙡𝙖𝙩𝙛𝙤𝙧𝙢")));
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
      console.error(toBoldItalic('𝙏𝙞𝙠𝙏𝙤𝙠 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙚𝙧𝙧𝙤𝙧:'), err);
      return {
        status: "error",
        message: toBoldItalic("𝙏𝙞𝙠𝙏𝙤𝙠 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙥𝙧𝙤𝙗𝙡𝙚𝙢")
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
    console.error(toBoldItalic('𝙁𝙖𝙘𝙚𝙗𝙤𝙤𝙠 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙚𝙧𝙧𝙤𝙧:'), err);
    return {
      success: false
    };
  }
}
