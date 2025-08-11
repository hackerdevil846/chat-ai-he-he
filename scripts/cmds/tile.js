module.exports.config = {
  name: "match", 
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "2 jon er moddhe match koto dekhte paren",
  commandCategory: "𝑮𝒂𝒎𝒆",
  usages: "[tag]",
  cooldowns: 5,
  dependencies: {
      "fs-extra": "",
      "axios": ""
  }
}

module.exports.run = async function({ api, args, Users, event}) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  
  var mention = Object.keys(event.mentions)[0];
  if(!mention) return api.sendMessage("𝑨𝒑𝒏𝒂𝒌𝒆 1 𝒋𝒐𝒏 𝒇𝒓𝒊𝒆𝒏𝒅 𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒕𝒆 𝒉𝒐𝒃𝒆 𝒋𝒂𝒅𝒆𝒓 𝒎𝒂𝒕𝒄𝒉 𝒓𝒂𝒕𝒊𝒐 𝒅𝒆𝒌𝒉𝒕𝒆 𝒄𝒉𝒂𝒏", event.threadID, event.messageID);
  
  var name = (await Users.getData(mention)).name
  var namee = (await Users.getData(event.senderID)).name
  var tle = Math.floor(Math.random() * 101);

  var arraytag = [];
  arraytag.push({id: mention, tag: name});
  arraytag.push({id: event.senderID, tag: namee});
  
  var mentions = Object.keys(event.mentions)

  let Avatar = (await axios.get( 
    `https://graph.facebook.com/${mentions}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
    { responseType: "arraybuffer" } 
  )).data;
  
  fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));
  
  let Avatar2 = (await axios.get( 
    `https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
    { responseType: "arraybuffer" } 
  )).data;
  
  fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));        

  var imglove = [];
  imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));
  imglove.push(fs.createReadStream(__dirname + "/cache/avt.png"));
  
  var msg = {
    body: `⚡️${namee} 𝒆𝒃𝒐𝒏𝒈 ${name} 𝒆𝒓 𝒎𝒐𝒅𝒅𝒉𝒆 𝒎𝒂𝒕𝒄𝒉 𝒓𝒂𝒕𝒊𝒐 ${tle}% 🥰`, 
    mentions: arraytag, 
    attachment: imglove
  }
  
  return api.sendMessage(msg, event.threadID, event.messageID)
}
