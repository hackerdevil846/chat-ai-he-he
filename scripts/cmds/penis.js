module.exports.config = {
	name: "penis",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑷𝒆𝒏𝒊𝒔 𝒔𝒊𝒛𝒆 𝒄𝒉𝒆𝒄𝒌𝒆𝒓 𝒌𝒉𝒆𝒍𝒂 ( ͡° ͜ʖ ͡°)",
	commandCategory: "random-text",
	cooldowns: 1
};

module.exports.run = ({ event, api }) => 
	api.sendMessage(`𝑨𝒂𝒋𝒌𝒆 𝒂𝒂𝒑𝒏𝒂𝒓 𝒑𝒆𝒏𝒊𝒔: 8${'='.repeat(Math.floor(Math.random() * 10))}D`, event.threadID, event.messageID);
