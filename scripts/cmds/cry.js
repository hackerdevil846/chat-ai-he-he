const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports.config = {
	name: "cry",
	version: "1.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Cry meme effect with mentioned/replied user avatar 😭",
	category: "meme",
	usages: "{pn} [tag/reply]",
	cooldowns: 3,
	dependencies: {
		"discord-image-generation": ""
	},
	envConfig: {
		deltaNext: 5
	}
};

module.exports.languages = {
	"en": {
		noTag: "⚠️ You must tag or reply to the person you want to cry with!",
		selfCry: "😂 Lol, you made yourself cry!\n👉 Remember to reply or mention someone.",
		success: "😭 This person always makes me cry..."
	},
	"bn": {
		noTag: "⚠️ অবশ্যই কাউকে ট্যাগ বা রিপ্লাই করতে হবে cry effect দেওয়ার জন্য!",
		selfCry: "😂 তুমি নিজেই নিজেকে কাঁদালে!\n👉 কারো রিপ্লাই দাও বা mention করো।",
		success: "😭 এই মানুষটা আমাকে সবসময় কাঁদায়..."
	}
};

module.exports.onStart = async function ({ api, event, args, Users, getText }) {
	try {
		let mention = Object.keys(event.mentions);
		let uid;

		if (event.type === "message_reply") {
			uid = event.messageReply.senderID;
		}
		else if (mention[0]) {
			uid = mention[0];
		}
		else {
			uid = event.senderID;
		}

		let url = await Users.getAvatarUrl(uid);
		let img = await new DIG.Mikkelsen().getImage(url);
		const pathSave = `${__dirname}/tmp/cry.png`;
		fs.writeFileSync(pathSave, Buffer.from(img));

		let body;
		if (!mention[0] && event.type !== "message_reply") {
			body = getText("selfCry");
		} else {
			body = getText("success");
		}

		api.sendMessage(
			{
				body: body,
				attachment: fs.createReadStream(pathSave)
			},
			event.threadID,
			() => fs.unlinkSync(pathSave),
			event.messageID
		);
	} catch (err) {
		api.sendMessage("❌ An error occurred while generating the cry image.", event.threadID, event.messageID);
		console.error(err);
	}
};
