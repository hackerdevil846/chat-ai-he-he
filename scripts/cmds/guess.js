const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const cacheDir = path.join(__dirname, 'cache');

module.exports.config = {
	name: "guess",
	version: "1.2",
	author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	role: 0,
	shortDescription: "Guess the anime character",
	longDescription: "Guess the name of the anime character based on traits and tags with random images.",
	category: "game",
	usages: "[p]guess",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.run = async function ({ api, event, usersData }) {
	try {
		const response = await axios.get('https://global-prime-mahis-apis.vercel.app');
		const characters = response.data.data;
		const charactersArray = Array.isArray(characters) ? characters : [characters];
		
		const randomIndex = Math.floor(Math.random() * charactersArray.length);
		const { image, traits, tags, fullName, firstName } = charactersArray[randomIndex];

		const imagePath = path.join(cacheDir, "character.jpg");
		const imageRes = await axios.get(image, { responseType: 'arraybuffer' });
		await fs.ensureDir(cacheDir);
		await fs.writeFile(imagePath, imageRes.data);

		const gameMsg = `🎮 | 𝗚𝘂𝗲𝘀𝘀 𝗧𝗵𝗲 𝗔𝗻𝗶𝗺𝗲 𝗖𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿\n━━━━━━━━━━━━━━\n✨ 𝗧𝗿𝗮𝗶𝘁𝘀: ${traits}\n🏷️ 𝗧𝗮𝗴𝘀: ${tags}\n\n⏰ You have 15 seconds to answer!`;
		
		api.sendMessage({ 
			body: gameMsg, 
			attachment: fs.createReadStream(imagePath) 
		}, event.threadID, (err, info) => {
			global.GoatBot.onReply.set(info.messageID, {
				commandName: this.config.name,
				messageID: info.messageID,
				correctAnswer: [fullName, firstName],
				senderID: event.senderID
			});
			
			setTimeout(async () => {
				api.unsendMessage(info.messageID);
				await fs.unlink(imagePath).catch(() => {});
			}, 15000);
		});

	} catch (err) {
		console.error("Error:", err);
		api.sendMessage("❌ | An error occurred while starting the game.", event.threadID);
	}
};

module.exports.handleReply = async function ({ api, event, handleReply, usersData }) {
	try {
		if (event.senderID !== handleReply.senderID) return;
		
		const userAnswer = event.body.trim().toLowerCase();
		const correctAnswers = handleReply.correctAnswer.map(ans => ans.toLowerCase());

		if (correctAnswers.includes(userAnswer)) {
			const reward = 1000;
			const currentMoney = await usersData.get(event.senderID, "money");
			await usersData.set(event.senderID, { money: currentMoney + reward });

			api.sendMessage(
				`✅ | Correct Answer!\n\n` +
				`💰 | 𝗬𝗼𝘂𝗿 𝗪𝗮𝗹𝗹𝗲𝘁:\n` +
				`━━━━━━━━━━━━━━\n` +
				`💵 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: ${currentMoney + reward}$\n` +
				`🎁 𝗥𝗲𝘄𝗮𝗿𝗱: +${reward}$\n` +
				`━━━━━━━━━━━━━━`,
				event.threadID
			);
		} else {
			api.sendMessage(
				`❌ | Wrong! The correct answer was: ${handleReply.correctAnswer.join(" or ")}`,
				event.threadID
			);
		}

		api.unsendMessage(handleReply.messageID);
		api.unsendMessage(event.messageID);

	} catch (err) {
		console.error("HandleReply Error:", err);
	}
};
