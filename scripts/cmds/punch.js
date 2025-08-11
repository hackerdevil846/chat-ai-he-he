module.exports.config = {
  name: "punch",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑬𝒊 𝒋𝒐𝒏𝒏𝒆𝒓 𝒏𝒂𝒎𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒆 𝒕𝒂𝒌𝒆 𝒎𝒂𝒓𝒂",
  commandCategory: "general",
  usages: "𝒑𝒖𝒏𝒄𝒉 [𝒀𝒂𝒓 𝒋𝒂𝒌𝒆 𝒎𝒂𝒓𝒕𝒆 𝒄𝒂𝒐 𝒕𝒂𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒖𝒏]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
    var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  
  if (!args.join("")) return out("𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒌𝒂𝒓𝒖𝒏𝒂 𝒌𝒂𝒓𝒆 𝒌𝒂𝒖𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒖𝒏");
  
  return axios.get('https://api.satou-chan.xyz/api/endpoint/punch').then(res => {
        let getURL = res.data.url;
        let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
        var mention = Object.keys(event.mentions)[0];
        let tag = event.mentions[mention].replace("@", "");    
        
        let callback = function () {
            api.setMessageReaction("✅", event.messageID, (err) => {}, true);
            api.sendMessage({
                body: "𝑶𝒓𝒂 𝒐𝒓𝒂 𝒐𝒓𝒂! " + tag,
                mentions: [{
                    tag: tag,
                    id: Object.keys(event.mentions)[0]
                }],
                attachment: fs.createReadStream(__dirname + `/cache/punch.${ext}`)
            }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/punch.${ext}`), event.messageID);
        };
        
        request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/punch.${ext}`)).on("close", callback);
    })
    .catch(err => {
        api.sendMessage("𝑮𝑰𝑭 𝒃𝒂𝒏𝒂𝒏𝒐𝒓 𝒌𝒉𝒂𝒎𝒂𝒓 𝒉𝒐𝒍𝒆𝒏𝒊, 𝒅𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒏𝒊𝒔𝒄𝒐𝒚 𝒆𝒌𝒋𝒐𝒏𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒆𝒄𝒉𝒆𝒏 𝒌𝒊 𝒏𝒂!", event.threadID, event.messageID);
        api.setMessageReaction("☹️", event.messageID, (err) => {}, true);
    });     
}
