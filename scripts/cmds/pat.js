module.exports.config = {
  name: "pat",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑷𝒂𝒕 𝒌𝒂𝒓𝒖𝒏 𝒆𝒌𝒋𝒐𝒏 𝒃𝒂𝒏𝒅𝒉𝒖𝒌𝒆",
  commandCategory: "anime",
  usages: "𝒑𝒂𝒕 [𝑻𝒂𝒈 𝒌𝒂𝒓𝒖𝒏 𝒕𝒖𝒎𝒊 𝒚𝒂𝒓 𝒑𝒂𝒕 𝒌𝒂𝒓𝒕𝒆 𝒄𝒂𝒐]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
    var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  if (!args.join("")) return out("𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒌𝒂𝒓𝒖𝒏 𝒆𝒌𝒋𝒐𝒏𝒌𝒆 𝒕𝒂𝒈 𝒌𝒂𝒓𝒖𝒏");
  else
  return axios.get('https://api.satou-chan.xyz/api/endpoint/pat').then(res => {
        let getURL = res.data.url;
        let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
        var mention = Object.keys(event.mentions)[0];
        let tag = event.mentions[mention].replace("@", "");    
        
        let callback = function () {
            api.setMessageReaction("✅", event.messageID, (err) => {}, true);
            api.sendMessage({
                body: `𝑷𝒂𝒕𝒔, ${tag}. 𝑨𝒓𝒆 𝒂𝒓𝒆 𝒃𝒉𝒂𝒍𝒐 𝒂𝒄𝒉𝒐!`,
                mentions: [{
                    tag: tag,
                    id: Object.keys(event.mentions)[0]
                }],
                attachment: fs.createReadStream(__dirname + `/cache/pat.${ext}`)
            }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/pat.${ext}`), event.messageID);
        };
        request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/pat.${ext}`)).on("close", callback);
    })
    .catch(err => {
        api.sendMessage("𝑮𝒊𝒇 𝒕𝒐𝒊𝒓𝒊 𝒌𝒂𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊 𝒏𝒂, 𝒆𝒌𝒋𝒐𝒏𝒌𝒆 𝒕𝒂𝒈 𝒌𝒂𝒓𝒆𝒏 𝒏𝒊𝒔𝒄𝒊𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
    });     
}
