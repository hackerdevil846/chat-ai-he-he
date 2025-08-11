module.exports.config = {
	name: "tid",	
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝙂𝙧𝙪𝙥𝙚𝙧 𝙞𝙙 𝙟𝙖𝙣𝙩𝙚 𝙘𝙝𝙖𝙞", 
	commandCategory: "𝙂𝙧𝙪𝙥",
	usages: "tid",
	cooldowns: 5, 
	dependencies: '',
};

module.exports.run = async function({ api, event }) {
  api.sendMessage(`𝙀𝙞 𝙜𝙧𝙪𝙥𝙚𝙧 𝙞𝙙: ${event.threadID}`, event.threadID, event.messageID);
};
