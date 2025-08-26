const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
	name: "rip",
	version: "2.0",
	author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🪦 Create RIP tombstone with user's avatar",
	category: "fun",
	usages: "[@mention]",
	cooldowns: 5,
	dependencies: {
		"discord-image-generation": "",
		"fs-extra": ""
	}
};

module.exports.onStart = async function ({ api, event, args, usersData }) {
	try {
		const { threadID, messageID, senderID, mentions } = event;
		const mentionID = Object.keys(mentions)[0] || senderID;
		const targetName = mentions[mentionID] || "you";

		const avatarURL = await usersData.getAvatarUrl(mentionID);
		if (!avatarURL) {
			return api.sendMessage("❌ | Failed to fetch profile picture!", threadID, messageID);
		}

		const imgBuffer = await new DIG.Rip().getImage(avatarURL);
		const tmpDir = path.join(__dirname, "tmp");
		const filePath = path.join(tmpDir, `${mentionID}_rip.png`);

		await fs.ensureDir(tmpDir);
		await fs.writeFile(filePath, imgBuffer);

		api.sendMessage({
			body: `🪦 Rest in peace ${targetName}...\n\n✨ Created by ${this.config.author}`,
			attachment: fs.createReadStream(filePath)
		}, threadID, () => fs.unlinkSync(filePath), messageID);
		
	} catch (err) {
		console.error("[RIP Command Error]", err);
		return api.sendMessage("⚠️ | Failed to generate image! Please try again later.", threadID, messageID);
	}
};
