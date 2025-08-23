const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports.config = {
	name: "cry", // Command name
	version: "1.0", // Version
	hasPermssion: 0, // 0 = all members can use
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Author
	description: "Cry meme effect with mentioned/replied user avatar 😭", 
	category: "meme", // Category
	usages: "{pn} [tag/reply]", // Usage
	cooldowns: 3, // Cooldown in seconds
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

module.exports.run = async function ({ api, event, args, Users, getText }) {
	try {
		let mention = Object.keys(event.mentions);
		let uid;

		// যদি reply করা হয়
		if (event.type === "message_reply") {
			uid = event.messageReply.senderID;
		}
		// যদি mention থাকে
		else if (mention[0]) {
			uid = mention[0];
		}
		// না থাকলে নিজের UID
		else {
			uid = event.senderID;
		}

		// ইউজারের avatar আনবে
		let url = await Users.getAvatarUrl(uid);

		// DIG effect apply করবে
		let img = await new DIG.Mikkelsen().getImage(url);

		// Path এ save করবে
		const pathSave = `${__dirname}/tmp/cry.png`;
		fs.writeFileSync(pathSave, Buffer.from(img));

		// Body message বানাবে
		let body;
		if (!mention[0] && event.type !== "message_reply") {
			body = getText("selfCry");
		} else {
			body = getText("success");
		}

		// Send reply with image
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
