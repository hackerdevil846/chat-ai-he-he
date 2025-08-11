module.exports.config = {
	name: "zalgo",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑨𝒑𝒏𝒂𝒓 𝒕𝒆𝒙𝒕 𝒌𝒆 𝒁𝒂𝒍𝒈𝒐 𝒕𝒆 𝒄𝒐𝒏𝒗𝒆𝒓𝒕 𝒌𝒐𝒓𝒆",
	commandCategory: "game",
	dependencies: {"to-zalgo":""},
	usages: "𝒛𝒂𝒍𝒈𝒐 [𝒂𝒑𝒏𝒂𝒓 𝒕𝒆𝒙𝒕]",
	cooldowns: 5
};

module.exports.run = ({ api, event, args }) => {
  if (args.length === 0) {
    return api.sendMessage("❔ | 𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒁𝒂𝒍𝒈𝒐-𝒕𝒆 𝒑𝒐𝒓𝒊𝒏𝒐𝒕𝒐 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒌𝒊𝒄𝒉𝒖 𝒕𝒆𝒙𝒕 𝒅𝒊𝒏.", event.threadID, event.messageID);
  }
  const Zalgo = require("to-zalgo");
  return api.sendMessage(Zalgo(args.join(" ")), event.threadID, event.messageID);
}
