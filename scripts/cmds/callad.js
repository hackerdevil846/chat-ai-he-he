module.exports.config = {
  name: "callad",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑨𝒅𝒎𝒊𝒏 𝒌𝒆 𝒃𝒐𝒕 𝒆𝒓 𝒃𝒖𝒈 𝒓𝒆𝒑𝒐𝒓𝒕 𝒌𝒐𝒓𝒖𝒏 𝒃𝒂 𝒄𝒐𝒎𝒎𝒆𝒏𝒕",
  commandCategory: "Admin",
  usages: "[msg]",
  cooldowns: 5,
};

module.exports.handleReply = async function({ api, args, event, handleReply, Users }) {
  try {
    var name = (await Users.getData(event.senderID)).name;
    var s = [];
    var l = [];
    const fs = require('fs-extra');
    const { join } = require('path');
    const axios = require('axios');
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length || 20;
    if (event.attachments.length != 0) {
      for (var p of event.attachments) {
        var result = '';
        for (var i = 0; i < charactersLength; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
        if (p.type == 'photo') {
          var e = 'jpg';
        }
        if (p.type == 'video') {
          var e = 'mp4';
        }
        if (p.type == 'audio') {
          var e = 'mp3';
        }
        if (p.type == 'animated_image') {
          var e = 'gif';
        }
        var o = join(__dirname, 'cache', `${result}.${e}`);
        let m = (await axios.get(encodeURI(p.url), { responseType: "arraybuffer" })).data;
        fs.writeFileSync(o, Buffer.from(m, "utf-8"));
        s.push(o);
        l.push(fs.createReadStream(o));
      }
    };
    switch (handleReply.type) {
      case "reply": {
        var idad = global.config.ADMINBOT;
        if (s.length == 0) {
          for (let ad of idad) {
            api.sendMessage({
              body: "[📲] 𝑭𝒆𝒆𝒅𝒃𝒂𝒄𝒌 𝒇𝒓𝒐𝒎 " + name + " :\n[💬] 𝑪𝒐𝒏𝒕𝒆𝒏𝒕: " + (event.body) || "𝑲𝒐𝒏𝒐 𝒓𝒆𝒑𝒍𝒚 𝒏𝒂𝒊", mentions: [{
                id: event.senderID,
                tag: name
              }]
            }, ad, (e, data) => global.client.handleReply.push({
              name: this.config.name,
              messageID: data.messageID,
              messID: event.messageID,
              author: event.senderID,
              id: event.threadID,
              type: "calladmin"
            }));
          }
        }
        else {
          for (let ad of idad) {
            api.sendMessage({
              body: "[📲] 𝑭𝒆𝒆𝒅𝒃𝒂𝒄𝒌 𝒇𝒓𝒐𝒎 " + name + ":\n" + (event.body) || "𝑭𝒊𝒍𝒆 𝒏𝒊𝒚𝒆 𝒌𝒐𝒏𝒐 𝒓𝒆𝒑𝒍𝒚 𝒏𝒂𝒊 ❤️", attachment: l, mentions: [{
                id: event.senderID,
                tag: name
              }]
            }, ad, (e, data) => global.client.handleReply.push({
              name: this.config.name,
              messageID: data.messageID,
              messID: event.messageID,
              author: event.senderID,
              id: event.threadID,
              type: "calladmin"
            }));
            for (var b of s) {
              fs.unlinkSync(b);
            }
          }
        }
        break;
      }
      case "calladmin": {
        if (s.length == 0) {
          api.sendMessage({ body: `[📌] 𝑨𝒅𝒎𝒊𝒏 ${name} 𝒆𝒓 𝒇𝒆𝒆𝒅𝒃𝒂𝒄𝒌:\n\n[💬] 𝑪𝒐𝒏𝒕𝒆𝒏𝒕: ${(event.body) || "𝑲𝒐𝒏𝒐 𝒓𝒆𝒑𝒍𝒚 𝒏𝒂𝒊 🌸"}\n\n» 𝑨𝒑𝒏𝒊 𝒓𝒆𝒑𝒐𝒓𝒕 𝒄𝒐𝒏𝒕𝒊𝒏𝒖𝒆 𝒌𝒐𝒓𝒕𝒆 𝒄𝒉𝒂𝒊𝒍𝒆 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏`, mentions: [{ tag: name, id: event.senderID }] }, handleReply.id, (e, data) => global.client.handleReply.push({
            name: this.config.name,
            author: event.senderID,
            messageID: data.messageID,
            type: "reply"
          }), handleReply.messID);
        }
        else {
          api.sendMessage({ body: `[📌] 𝑨𝒅𝒎𝒊𝒏 ${name} 𝒆𝒓 𝒇𝒆𝒆𝒅𝒃𝒂𝒄𝒌:\n\n[💬] 𝑪𝒐𝒏𝒕𝒆𝒏𝒕: ${(event.body) || "𝑭𝒊𝒍𝒆 𝒏𝒊𝒚𝒆 𝒌𝒐𝒏𝒐 𝒓𝒆𝒑𝒍𝒚 𝒏𝒂𝒊 🌸"}\n[📎] 𝑨𝒅𝒎𝒊𝒏 𝒆𝒓 𝒇𝒊𝒍𝒆\n\n» 𝑨𝒑𝒏𝒊 𝒓𝒆𝒑𝒐𝒓𝒕 𝒄𝒐𝒏𝒕𝒊𝒏𝒖𝒆 𝒌𝒐𝒓𝒕𝒆 𝒄𝒉𝒂𝒊𝒍𝒆 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏`, attachment: l, mentions: [{ tag: name, id: event.senderID }] }, handleReply.id, (e, data) => global.client.handleReply.push({
            name: this.config.name,
            author: event.senderID,
            messageID: data.messageID,
            type: "reply"
          }), handleReply.messID);
          for (var b of s) {
            fs.unlinkSync(b);
          }
        }
        break;
      }
    }
  }
  catch (ex) {
    console.log(ex);
  }
};

module.exports.run = async function({ api, event, Threads, args, Users }) {
  try {
    var s = [];
    var l = [];
    const fs = require('fs-extra');
    const { join } = require('path');
    const axios = require('axios');
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length || 20;
    if (event.messageReply) {
    if (event.messageReply.attachments.length != 0) {
      for (var p of event.messageReply.attachments) {
        var result = '';
        for (var i = 0; i < charactersLength; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
        if (p.type == 'photo') {
          var e = 'jpg';
        }
        if (p.type == 'video') {
          var e = 'mp4';
        }
        if (p.type == 'audio') {
          var e = 'mp3';
        }
        if (p.type == 'animated_image') {
          var e = 'gif';
        }
        var o = join(__dirname, 'cache', `${result}.${e}`);
        let m = (await axios.get(encodeURI(p.url), { responseType: "arraybuffer" })).data;
        fs.writeFileSync(o, Buffer.from(m, "utf-8"));
        s.push(o);
        l.push(fs.createReadStream(o));
      }
    }
  }
    if (!args[0] && event.messageReply.attachments.length == 0)
      return api.sendMessage(`𝑨𝒑𝒏𝒊 𝒌𝒊 𝒓𝒆𝒑𝒐𝒓𝒕 𝒌𝒐𝒓𝒃𝒆𝒏 𝒔𝒆𝒕𝒂 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒊 𝒏𝒂𝒊 📋`,
        event.threadID,
        event.messageID
      );

    var name = (await Users.getData(event.senderID)).name;
    var idbox = event.threadID;

    var datathread = (await Threads.getData(event.threadID)).threadInfo;
    var namethread = datathread.threadName;
    var uid = event.senderID;

    const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Manila").format("HH:mm:ss D/MM/YYYY");
    var soad = global.config.ADMINBOT.length;
    api.sendMessage(`[🤖] 𝑩𝒐𝒕 𝒂𝒑𝒏𝒂𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 ${soad} 𝒋𝒐𝒏 𝒂𝒅𝒎𝒊𝒏 𝒌𝒆 𝒑𝒂𝒕𝒉𝒊𝒚𝒆𝒄𝒉𝒆 🍄\n[⏰] 𝑺𝒐𝒎𝒐𝒚: ${gio}`,
      event.threadID,
      () => {
        var idad = global.config.ADMINBOT;
        if (s.length == 0) {
          for (let ad of idad) {
            api.sendMessage({ body: `📱[ 𝑪𝑨𝑳𝑳 𝑨𝑫𝑴𝑰𝑵 ]📱\n\n\n[👤] 𝑹𝒆𝒑𝒐𝒓𝒕 𝒇𝒓𝒐𝒎: ${name}\n[❗] 𝑼𝒔𝒆𝒓 𝑰𝑫: ${uid}\n[🗣️] 𝑩𝒐𝒙: ${namethread}\n[🔰] 𝑩𝒐𝒙 𝑰𝑫: ${idbox}\n\n[💌] 𝑴𝒆𝒔𝒔𝒂𝒈𝒆: ${args.join(
              " "
            )}\n[⏰] 𝑺𝒐𝒎𝒐𝒚: ${gio}`, mentions: [{ id: event.senderID, tag: name }] },
              ad, (error, info) =>
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                messID: event.messageID,
                id: idbox,
                type: "calladmin"
              })
            );
          }
        }
        else {
          for (let ad of idad) {
            api.sendMessage({
              body: `📱[ 𝑪𝑨𝑳𝑳 𝑨𝑫𝑴𝑰𝑵 ]📱\n\n\n[👤] 𝑹𝒆𝒑𝒐𝒓𝒕 𝒇𝒓𝒐𝒎: ${name}\n[❗] 𝑼𝒔𝒆𝒓 𝑰𝑫: ${uid}\n[🗣️] 𝑩𝒐𝒙: ${namethread}\n[🔰] 𝑩𝒐𝒙 𝑰𝑫: ${idbox}\n\n[💌] 𝑴𝒆𝒔𝒔𝒂𝒈𝒆: ${(args.join(
                " "
              )) || "𝑭𝒊𝒍𝒆 𝒏𝒊𝒚𝒆 𝒌𝒐𝒏𝒐 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒏𝒂𝒊"}\n[⏰] 𝑺𝒐𝒎𝒐𝒚: ${gio}\n[📎] 𝑨𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕`, attachment: l, mentions: [{ id: event.senderID, tag: name }]
            },
              ad, (error, info) =>
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                messID: event.messageID,
                id: idbox,
                type: "calladmin"
              })
            );
          }
          for (var b of s) {
            fs.unlinkSync(b);
          }
        }
      }
      , event.messageID);
  }
  catch (ex) {
    console.log(ex);
  }
};
