module.exports.config = {
  name: "slap",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑱𝒂𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒂 𝒉𝒂𝒍𝒂𝒌 𝒌𝒆 𝒔𝒍𝒂𝒑 𝒎𝒂𝒓𝒂",
  commandCategory: "𝒈𝒆𝒏𝒆𝒓𝒂𝒍",
  usages: "𝑺𝒍𝒂𝒑 [@𝒕𝒂𝒈]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
    var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  if (!args.join("")) return out("𝑫𝒐𝒓𝒌𝒂𝒓 𝒌𝒂𝒓𝒖𝒏𝒂 𝒋𝒂𝒌𝒆 𝒔𝒍𝒂𝒑 𝒎𝒂𝒓𝒕𝒆 𝒄𝒉𝒂𝒏 𝒕𝒂𝒈 𝒌𝒐𝒓𝒖𝒏");
  else
  return axios.get('https://api.waifu.pics/sfw/slap').then(res => {
        let getURL = res.data.url;
        let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
        var mention = Object.keys(event.mentions)[0];
        let tag = event.mentions[mention].replace("@", "");    
        
        let callback = function () {
            api.setMessageReaction("✅", event.messageID, (err) => {}, true);
            api.sendMessage({
                body: `𝑺𝒍𝒂𝒑𝒑𝒆𝒅! ${tag}\n\n"𝒎𝒂𝒇 𝒌𝒐𝒓𝒃𝒐, 𝒂𝒎𝒊 𝒃𝒉𝒂𝒃𝒊 𝒎𝒂𝒔𝒌𝒂𝒓𝒂 𝒄𝒉𝒊𝒍"`,
                mentions: [{
                    tag: tag,
                    id: Object.keys(event.mentions)[0]
                }],
                attachment: fs.createReadStream(__dirname + `/cache/slap.${ext}`)
            }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/slap.${ext}`), event.messageID)
        };
        request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/slap.${ext}`)).on("close", callback);
    })
    .catch(err => {
        api.sendMessage("𝑺𝒍𝒂𝒑 𝒈𝒊𝒇 𝒃𝒂𝒏𝒂𝒏𝒐 𝒃𝒊𝒔𝒕𝒓𝒊𝒕𝒐 𝒇𝒆𝒍𝒆𝒄𝒉𝒆! 𝒅𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝑵𝒊𝒔𝒄𝒉𝒐𝒚 𝒋𝒂𝒌𝒆 𝒔𝒍𝒂𝒑 𝒎𝒂𝒓𝒕𝒆 𝒄𝒉𝒂𝒏 𝒕𝒂𝒈 𝒌𝒐𝒓𝒖𝒏", event.threadID);
        api.setMessageReaction("☹️", event.messageID, (err) => {}, true);
    });     
}
