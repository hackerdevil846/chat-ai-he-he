const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports.config = {
	name: "buttslap",
	version: "1.1",
	author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	countDown: 5,
	role: 0,
	shortDescription: "Generate buttslap image 🖐️",
	longDescription: "Create a fun buttslap image with tagged user ✨",
	category: "fun",
	guide: {
		en: "{pn} @tag"
	}
};

module.exports.languages = {
	en: {
		noTag: "⚠️ | Please tag someone to slap!"
	}
};

module.exports.run = async function ({ event, message, usersData, args, getLang }) {
	try {
		const uid1 = event.senderID;
		const uid2 = Object.keys(event.mentions)[0];
		
		if (!uid2) {
			return message.reply(getLang("noTag"));
		}

		const [avatarURL1, avatarURL2] = await Promise.all([
			usersData.getAvatarUrl(uid1),
			usersData.getAvatarUrl(uid2)
		]);

		const img = await new DIG.Spank().getImage(avatarURL1, avatarURL2);
		const pathSave = `${__dirname}/tmp/${uid1}_${uid2}spank.png`;
		
		fs.writeFileSync(pathSave, Buffer.from(img));
		
		const content = args.join(' ').replace(Object.keys(event.mentions)[0], "");
		
		message.reply({
			body: content || "💢 *slaps* 💥",
			attachment: fs.createReadStream(pathSave)
		}, () => fs.unlinkSync(pathSave));
		
	} catch (error) {
		console.error(error);
		message.reply("❌ | Failed to generate image. Please try again later.");
	}
};
