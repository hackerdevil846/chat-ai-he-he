const fs = require("fs");
module.exports.config = {
	name: "RuleBot",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 
	description: "𝑩𝒐𝒕 𝒆𝒓 𝒃𝒆𝒃𝒐𝒉𝒂𝒓 𝒆𝒓 𝒏𝒊𝒚𝒐𝒎𝒎𝒂𝒍𝒊",
	commandCategory: "𝑮𝒓𝒐𝒖𝒑",
	usages: "RuleBot",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	const triggers = ["RuleBot", "rulebot", "Bot Rules", "rules"];
	
	if (triggers.some(trigger => event.body.toLowerCase().includes(trigger.toLowerCase()))) {
		var msg = {
				body: "𝑪𝒉𝒂𝒕𝒃𝒐𝒕 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒌𝒐𝒓𝒂𝒓 𝒔𝒐𝒎𝒐𝒚 𝒖𝒔𝒆𝒓𝒅𝒆𝒓 𝒏𝒊𝒎𝒏𝒐𝒍𝒊𝒌𝒉𝒊𝒕𝒐 𝒑𝒂𝒍𝒐𝒏 𝒌𝒐𝒓𝒕𝒆 𝒉𝒐𝒃𝒆:\n\n" +
                      "▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n" +
                      "❯ 𝑺𝒐𝒖𝒓𝒄𝒆𝒄𝒐𝒅𝒆 𝑪𝒉𝒂𝒕𝒃𝒐𝒕 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝒅𝒂𝒓𝒂 𝒃𝒂𝒏𝒂𝒏𝒐\n" +
                      "❯ 𝑼𝒔𝒆𝒓𝒅𝒆𝒓𝒂 𝒃𝒐𝒕 𝒌𝒆 20 𝒃𝒂𝒓/𝒅𝒊𝒏𝒆𝒓 𝒄𝒆𝒚𝒆 𝒃𝒆𝒔𝒊 𝒔𝒑𝒂𝒎 𝒌𝒐𝒓𝒃𝒆𝒏 𝒏𝒂\n" +
                      "▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n" +
                      "💖 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅"
			}
			api.sendMessage(msg, threadID, messageID);
		}
	}
	
module.exports.run = function({ api, event, client, __GLOBAL }) {
  // 𝒌𝒐𝒏𝒐 𝒂𝒄𝒕𝒊𝒐𝒏 𝒅𝒐𝒓𝒌𝒂𝒓 𝒏𝒂𝒊
}
