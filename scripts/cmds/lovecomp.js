const fs = require("fs-extra");
const { loadImage, createCanvas, registerFont } = require("canvas");
const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "lovecomp",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "love",
    shortDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑠ℎ𝑜𝑤𝑖𝑛𝑔 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑡𝑤𝑜 𝑝𝑒𝑜𝑝𝑙𝑒"
    },
    guide: {
      en: "{p}lovecomp [@𝑡𝑎𝑔] | [𝑖𝑛𝑓𝑜] | [𝑓𝑎𝑘𝑒]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": "",
      "moment-timezone": ""
    }
  },

  onLoad: async function() {
    const D = __dirname + "/cache/rela/";
    const bg = D + "bg.png";
    const dicon = D + "icon.png";
    const font = D + "AmaticSC.ttf";
    
    const bglink = "https://blogger.googleusercontent.com/img/a/AVvXsEgiT494Po7Onhcft4jFS2cTSb2-7wbRYaoCCGFH09X53RtuI3YABGgYfMJsCAmsDs8hfpMU2k28PKwImiP6Go9LiOquM0CYR4bEgzH8yXIfsJ8CJHdnRcogIOef0tgdzIjTBsGROv-12T60AI2njz0p_N9ipS5T4_KMatV8Erl6GYJ6PLou2HeIRWrA=s1278";
    const iconlink = "https://blogger.googleusercontent.com/img/a/AVvXsEgQpVe6Q9RLyMZolNU3K7PqmAyKbIz53aIcAux5P9X7gbXydjEbkbZSKHxiwTLrY_XmgSeJJgrTi8-jh6g8RuWvq8h4mfQOA470attJaNuHWI9AP28SVUiTF8gaggPUeeQ4zq7OT5kgO4qvQsloqIVxJue7cFZmDwaxHNI8UVHqxrCsA_BXwvEYskq9=s45";
    const fontlink = "https://drive.google.com/u/0/uc?id=1ZzgC7nyGaBw-zP3V2GKK0azoFgF5aXup&export=download";

    if (!fs.existsSync(D)) fs.mkdirSync(D, { recursive: true });
    if (!fs.existsSync(bg)) await global.utils.downloadFile(bglink, bg);
    if (!fs.existsSync(dicon)) await global.utils.downloadFile(iconlink, dicon);
    if (!fs.existsSync(font)) await global.utils.downloadFile(fontlink, font);
  },

  onStart: async function({ api, event, args, usersData }) {
    const D = __dirname + "/cache/rela/";
    const expole = D + "rela.png";
    const bg = D + "bg.png";
    const dicon = D + "icon.png";
    const font = D + "AmaticSC.ttf";
    
    const token = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
    
    const data = [
      "𝐵𝑙𝑎𝑚𝑒 𝑓𝑎𝑡𝑒 𝑓𝑜𝑟 𝑏𝑒𝑖𝑛𝑔 𝑢𝑛𝑙𝑢𝑐𝑘𝑦...",
      "𝑎 𝑏𝑖𝑡 𝑙𝑜𝑤 𝑏𝑢𝑡 𝑖𝑡'𝑠 𝑜𝑘𝑎𝑦. 𝑇𝑟𝑦 ℎ𝑎𝑟𝑑𝑒𝑟!",
      "3 𝑝𝑎𝑟𝑡𝑠 𝑓𝑎𝑡𝑒, 7 𝑝𝑎𝑟𝑡𝑠 𝑒𝑓𝑓𝑜𝑟𝑡",
      "𝑇ℎ𝑒 𝑐ℎ𝑎𝑛𝑐𝑒 𝑡ℎ𝑎𝑡 𝑡ℎ𝑖𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑐𝑎𝑛 𝑤𝑜𝑟𝑘 𝑖𝑠 𝑞𝑢𝑖𝑡𝑒 𝑠𝑚𝑎𝑙𝑙! 𝑀𝑢𝑠𝑡 𝑡𝑟𝑦 ℎ𝑎𝑟𝑑𝑒𝑟",
      "𝐷𝑎𝑡𝑒 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟. 𝑆𝑜 𝑡ℎ𝑎𝑡 𝑡ℎ𝑖𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑐𝑎𝑛 𝑔𝑜 𝑓𝑢𝑟𝑡ℎ𝑒𝑟",
      "𝐵𝑒 𝑚𝑜𝑟𝑒 𝑝𝑟𝑜𝑎𝑐𝑡𝑖𝑣𝑒 𝑖𝑛 𝑠𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛𝑠. 𝑌𝑜𝑢 𝑡𝑤𝑜 𝑎𝑟𝑒 𝑞𝑢𝑖𝑡𝑒 𝑎 𝑚𝑎𝑡𝑐ℎ",
      "𝐵𝑒𝑙𝑖𝑒𝑣𝑒 𝑖𝑛 𝑓𝑎𝑡𝑒, 𝑏𝑒𝑐𝑎𝑢𝑠𝑒 𝑖𝑡'𝑠 𝑟𝑒𝑎𝑙!",
      "𝑉𝑒𝑟𝑦 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑙𝑒. 𝑇𝑎𝑘𝑒 𝑐𝑎𝑟𝑒 𝑜𝑓 𝑡ℎ𝑖𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑚𝑜𝑟𝑒!",
      "𝑆𝑎𝑣𝑒 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟'𝑠 𝑛𝑢𝑚𝑏𝑒𝑟𝑠, 𝑤ℎ𝑒𝑛 𝑦𝑜𝑢 𝑔𝑒𝑡 𝑚𝑎𝑟𝑟𝑖𝑒𝑑, 𝑐𝑎𝑙𝑙 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟 𝑡𝑜 𝑡ℎ𝑒 𝑤𝑒𝑑𝑑𝑖𝑛𝑔!",
      "𝐽𝑢𝑠𝑡 𝑔𝑒𝑡 𝑚𝑎𝑟𝑟𝑖𝑒𝑑, 𝑤ℎ𝑦 𝑤𝑎𝑖𝑡!"
    ];

    const mentions1 = event.mentions[Object.keys(event.mentions)[0]];
    if (!mentions1) {
      if (args[0] == "info") {
        return api.sendMessage(`©𝐶𝑜𝑑𝑒 𝐵𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n©𝐷𝑒𝑠𝑖𝑔𝑛 𝐵𝑦 𝐷𝑉𝐵 𝐷𝑒𝑠𝑖𝑔𝑛\n\n=============\n- 𝑆𝑢𝑝𝑝𝑜𝑟𝑡: 𝑁𝑔𝑢𝑦𝑒𝑛 𝑇ℎ𝑎𝑖 𝐻𝑎𝑜\n- 𝐼𝑑𝑒𝑎: 𝐿𝑒 𝐷𝑖𝑛ℎ\n\n=============\n𝐹𝑜𝑟 𝑓𝑒𝑒𝑑𝑏𝑎𝑐𝑘 𝑝𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑏𝑜𝑥 https://m.me/bangprocode`, event.threadID, event.messageID);
      } else {
        return api.sendMessage(`1: 𝑈𝑠𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 + 𝑡𝑎𝑔\n2: 𝑈𝑠𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 + 𝑖𝑛𝑓𝑜 𝑜𝑟 𝑓𝑎𝑘𝑒\n\n𝐼𝑛𝑓𝑜: 𝑣𝑖𝑒𝑤 𝑐𝑟𝑒𝑑𝑖𝑡𝑠 𝑎𝑛𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛\n𝐹𝑎𝑘𝑒: 𝑐𝑟𝑒𝑎𝑡𝑒 𝑓𝑎𝑘𝑒 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑏𝑎𝑛𝑛𝑒𝑟`, event.threadID, event.messageID);
      }
    }

    const name1 = await usersData.getName(event.senderID);
    const name2 = mentions1.replace("@", "");
    const uid2 = Object.keys(event.mentions)[0];

    if (args[0] == "fake") {
      return api.sendMessage(`𝐸𝑛𝑡𝑒𝑟 ℎ𝑒𝑎𝑟𝑡 𝑣𝑎𝑙𝑢𝑒𝑠 𝑒.𝑔. 8|8|8|8|8`, event.threadID, (err, info) => {
        global.client.handleReply.push({
          type: "create",
          name: this.config.name,
          author: event.senderID,
          messageID: info.messageID,
          uid2: uid2,
          name1: name1,
          name2: name2
        });
      }, event.messageID);
    }

    const MissionC = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
    const allmath = (MissionC[0] + MissionC[1] + MissionC[2] + MissionC[3] + MissionC[4]) * 3.75;
    const message = this.sosanh(allmath, data);

    const background = await loadImage(bg);
    const icon = await loadImage(dicon);
    const getboyavt = await loadImage(await this.getavt(event.senderID, token));
    const getgirlavt = await loadImage(await this.getavt(uid2, token));

    const render = await this.irender(allmath, message, name1, name2, getboyavt, getgirlavt, background, icon, font, MissionC);
    fs.writeFileSync(expole, render);

    api.sendMessage({
      body: `[⚜️] 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠 ${name1} & ${name2}\n[❤️] ${message}`,
      attachment: fs.createReadStream(expole)
    }, event.threadID, () => fs.unlinkSync(expole), event.messageID);
  },

  handleReply: async function({ api, event, handleReply, usersData }) {
    if (handleReply.author != event.senderID) return;
    
    const D = __dirname + "/cache/rela/";
    const expole = D + "rela.png";
    const bg = D + "bg.png";
    const dicon = D + "icon.png";
    const font = D + "AmaticSC.ttf";
    const token = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
    
    const data = [
      "𝐵𝑙𝑎𝑚𝑒 𝑓𝑎𝑡𝑒 𝑓𝑜𝑟 𝑏𝑒𝑖𝑛𝑔 𝑢𝑛𝑙𝑢𝑐𝑘𝑦...",
      "𝑎 𝑏𝑖𝑡 𝑙𝑜𝑤 𝑏𝑢𝑡 𝑖𝑡'𝑠 𝑜𝑘𝑎𝑦. 𝑇𝑟𝑦 ℎ𝑎𝑟𝑑𝑒𝑟!",
      "3 𝑝𝑎𝑟𝑡𝑠 𝑓𝑎𝑡𝑒, 7 𝑝𝑎𝑟𝑡𝑠 𝑒𝑓𝑓𝑜𝑟𝑡",
      "𝑇ℎ𝑒 𝑐ℎ𝑎𝑛𝑐𝑒 𝑡ℎ𝑎𝑡 𝑡ℎ𝑖𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑐𝑎𝑛 𝑤𝑜𝑟𝑘 𝑖𝑠 𝑞𝑢𝑖𝑡𝑒 𝑠𝑚𝑎𝑙𝑙! 𝑀𝑢𝑠𝑡 𝑡𝑟𝑦 ℎ𝑎𝑟𝑑𝑒𝑟",
      "𝐷𝑎𝑡𝑒 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟. 𝑆𝑜 𝑡ℎ𝑎𝑡 𝑡ℎ𝑖𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑐𝑎𝑛 𝑔𝑜 𝑓𝑢𝑟𝑡ℎ𝑒𝑟",
      "𝐵𝑒 𝑚𝑜𝑟𝑒 𝑝𝑟𝑜𝑎𝑐𝑡𝑖𝑣𝑒 𝑖𝑛 𝑠𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛𝑠. 𝑌𝑜𝑢 𝑡𝑤𝑜 𝑎𝑟𝑒 𝑞𝑢𝑖𝑡𝑒 𝑎 𝑚𝑎𝑡𝑐ℎ",
      "𝐵𝑒𝑙𝑖𝑒𝑣𝑒 𝑖𝑛 𝑓𝑎𝑡𝑒, 𝑏𝑒𝑐𝑎𝑢𝑠𝑒 𝑖𝑡'𝑠 𝑟𝑒𝑎𝑙!",
      "𝑉𝑒𝑟𝑦 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑙𝑒. 𝑇𝑎𝑘𝑒 𝑐𝑎𝑟𝑒 𝑜𝑓 𝑡ℎ𝑖𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑚𝑜𝑟𝑒!",
      "𝑆𝑎𝑣𝑒 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟'𝑠 𝑛𝑢𝑚𝑏𝑒𝑟𝑠, 𝑤ℎ𝑒𝑛 𝑦𝑜𝑢 𝑔𝑒𝑡 𝑚𝑎𝑟𝑟𝑖𝑒𝑑, 𝑐𝑎𝑙𝑙 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟 𝑡𝑜 𝑡ℎ𝑒 𝑤𝑒𝑑𝑑𝑖𝑛𝑔!",
      "𝐽𝑢𝑠𝑡 𝑔𝑒𝑡 𝑚𝑎𝑟𝑟𝑖𝑒𝑑, 𝑤ℎ𝑦 𝑤𝑎𝑖𝑡!"
    ];

    switch (handleReply.type) {
      case "create": {
        const tym = event.body;
        const MissionC = tym.split("|").map(Number);
        
        if (MissionC.length !== 5 || MissionC.some(isNaN)) {
          return api.sendMessage(`𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑜𝑟𝑚𝑎𝑡. 𝑈𝑠𝑒: 8|8|8|8|8`, event.threadID, event.messageID);
        }

        const allmath = (MissionC[0] + MissionC[1] + MissionC[2] + MissionC[3] + MissionC[4]) * 2.5;
        const message = this.sosanh(allmath, data);

        const background = await loadImage(bg);
        const icon = await loadImage(dicon);
        const getboyavt = await loadImage(await this.getavt(event.senderID, token));
        const getgirlavt = await loadImage(await this.getavt(handleReply.uid2, token));

        const render = await this.irender(allmath, message, handleReply.name1, handleReply.name2, getboyavt, getgirlavt, background, icon, font, MissionC);
        fs.writeFileSync(expole, render);

        api.sendMessage({
          body: `𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠 ${handleReply.name1} & ${handleReply.name2}\n${message}\n${MissionC.join("|")}`,
          attachment: fs.createReadStream(expole)
        }, event.threadID, () => fs.unlinkSync(expole), event.messageID);
        break;
      }
    }
  },

  sosanh: function(rd, data) {
    if (rd < 10) return data[0];
    else if (rd < 20) return data[1];
    else if (rd < 30) return data[2];
    else if (rd < 40) return data[3];
    else if (rd < 50) return data[4];
    else if (rd < 60) return data[5];
    else if (rd < 70) return data[6];
    else if (rd < 80) return data[7];
    else if (rd < 90) return data[8];
    else return data[9];
  },

  getavt: async function(uid, token) {
    const { data } = await axios.get(`https://graph.facebook.com/v12.0/${uid}/picture?height=240&width=240&access_token=${token}`, { responseType: "arraybuffer" });
    return data;
  },

  irender: async function(tile, msg, boyname, girlname, getboyavt, getgirlavt, background, icon, font, MissionC) {
    registerFont(font, { family: "AmaticSCbold" });
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(getboyavt, 114, 581, 98, 98);
    ctx.drawImage(getgirlavt, 509, 581, 98, 98);
    ctx.drawImage(background, 0, 0);

    ctx.font = "150px AmaticSCbold";
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFE";
    ctx.fillText(tile + "%", 360, 340);

    let math = 806;
    math -= 50;
    for (let i = 0; i < 5; i += 1) {
      let leftmath = 170;
      math += 50;
      for (let ii = 0; ii < MissionC[i]; ii += 1) {
        leftmath += 55;
        ctx.drawImage(icon, leftmath, math);
      }
    }

    ctx.font = "50px AmaticSCbold";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.fillText(boyname, 163, 746);
    ctx.fillText(girlname, 557, 746);

    ctx.font = "45px AmaticSCbold";
    ctx.textAlign = "start";
    ctx.fillStyle = "#000000";
    const xuongdong = this.wrapText(ctx, msg, 640);
    ctx.fillText(xuongdong.join("\n"), 60, 1145);

    return canvas.toBuffer("image/png");
  },

  wrapText: function(ctx, text, max) {
    const lines = [];
    if (ctx.measureText(text).width > max) {
      const words = text.split(" ");
      let line = "";
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= max) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) words[1] = temp.slice(-1) + words[1];
          else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(line + words[0]).width < max) line += words.shift() + " ";
        else {
          lines.push(line.trim());
          line = "";
        }
        if (words.length === 0) lines.push(line.trim());
      }
    } else lines.push(text);
    return lines;
  }
};
