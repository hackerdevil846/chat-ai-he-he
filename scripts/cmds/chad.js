const jimp = require("jimp");
const fs = require("fs");

module.exports = {
	config: {
		name: "chad",
		aliases: ["chad"],
		version: "1.0",
		author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
		countDown: 5,
		role: 0,
		shortDescription: "😎 Create Giga Chad meme with profile pictures",
		longDescription: "🖼️ Generate a Chad meme using tagged users' profile pictures",
		category: "image",
		guide: {
			vi: "{pn} [@tag]",
			en: "{pn} [@tag]"
		}
	},

	onStart: async function ({ message, event, args }) {
		try {
			const mention = Object.keys(event.mentions);
			if (mention.length === 0) {
				return message.reply("❌ Please tag someone to create Chad meme!");
			}

			const one = mention.length === 1 ? event.senderID : mention[1];
			const two = mention[0];

			const imagePath = await createChadImage(one, two);
			
			message.reply({
				body: "😎 Here's your Chad creation!",
				attachment: fs.createReadStream(imagePath)
			});
		} catch (error) {
			console.error(error);
			message.reply("❌ Error generating image. Please try again later.");
		}
	}
};

async function createChadImage(one, two) {
	const [avone, avtwo, template] = await Promise.all([
		jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
		jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
		jimp.read("https://i.postimg.cc/5y4vNVG9/desktop-wallpaper-giga-chad-ideas-chad-memes-muscle-men-thumbnail.jpg")
	]);

	avone.circle();
	avtwo.circle();

	template.resize(1080, 1350);
	template.composite(avone.resize(360, 360), 180, 380); // Adjusted positions
	template.composite(avtwo.resize(300, 300), 475, 180);

	const imagePath = "chad.png";
	await template.writeAsync(imagePath);
	return imagePath;
}
