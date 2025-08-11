module.exports.config = {
	name: "shell",
	version: "7.3.1",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝙎𝙝𝙚𝙡𝙡 𝙘𝙤𝙢𝙢𝙖𝙣𝙙 𝙘𝙝𝙖𝙡𝙖𝙣𝙤",
	commandCategory: "𝙎𝙮𝙨𝙩𝙚𝙢",
	usages: "[𝙘𝙤𝙢𝙢𝙖𝙣𝙙]",
	cooldowns: 0,
	dependencies: {
		"child_process": ""
	}
};

module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {    
    const permission = ["61571630409265"];
    if (!permission.includes(event.senderID)) {
        return api.sendMessage("❌ 𝙀𝙞 𝙠𝙤𝙢𝙖𝙣𝙙𝙩𝙞 𝙠𝙝𝙖𝙡𝙞 𝙈𝙖𝙝𝙢𝙪𝙙 �𝙖𝙧𝙩𝙝𝙚𝙣 𝙗𝙖𝙗𝙤𝙝𝙖𝙧 �𝙧𝙖𝙩𝙤", event.threadID, event.messageID);
    }

    const { exec } = require("child_process");
    let text = args.join(" ");
    
    if (!text) {
        return api.sendMessage("❌ 𝙆𝙞𝙨𝙞 𝙘𝙤𝙢𝙢𝙖𝙣𝙙 𝙚𝙣𝙩𝙚𝙧 𝙠𝙤𝙧𝙪𝙣", event.threadID, event.messageID);
    }

    exec(`${text}`, (error, stdout, stderr) => {
        if (error) {
            api.sendMessage(`❌ 𝙀𝙧𝙧𝙤𝙧:\n${error.message}`, event.threadID, event.messageID);
            return;
        }
        if (stderr) {
            api.sendMessage(`⚠️ 𝙎𝙩𝙙𝙚𝙧𝙧:\n${stderr}`, event.threadID, event.messageID);
            return;
        }
        api.sendMessage(`✅ 𝙎𝙩𝙙𝙤𝙪𝙩:\n${stdout}`, event.threadID, event.messageID);
    });
}
