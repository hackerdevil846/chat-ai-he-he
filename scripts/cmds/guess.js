const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const cacheDir = path.join(__dirname, 'cache');
const IMAGE_NAME = 'character.jpg';

module.exports.config = {
	name: "guess",
	version: "1.2",
	author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	hasPermssion: 0,
	role: 0,
	shortDescription: "Guess the anime character",
	longDescription: "Guess the name of the anime character based on traits and tags with random images.",
	category: "game",
	usages: "[p]guess",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		startGame: "🎮 | 𝗚𝘂𝗲𝘀𝘀 𝗧𝗵𝗲 𝗔𝗻𝗶𝗺𝗲 𝗖𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿\n━━━━━━━━━━━━━━\n✨ 𝗧𝗿𝗮𝗶𝘁𝘀: %1\n🏷️ 𝗧𝗮𝗴𝘀: %2\n\n⏰ You have 15 seconds to answer!",
		correct: "✅ | Correct Answer!\n\n💰 | 𝗬𝗼𝘂𝗿 𝗪𝗮𝗹𝗹𝗲𝘁:\n━━━━━━━━━━━━━━\n💵 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: %1$\n🎁 𝗥𝗲𝘄𝗮𝗿𝗱: +%2$\n━━━━━━━━━━━━━━",
		wrong: "❌ | Wrong! The correct answer was: %1",
		error: "❌ | An error occurred while starting the game."
	},
	"bn": {
		startGame: "🎮 | অ্যানিমে চরিত্র আন্দাজ করো\n━━━━━━━━━━━━━━\n✨ লাক্ষণ: %1\n🏷️ ট্যাগ: %2\n\n⏰ তোমার কাছে আছে 15 সেকেন্ড উত্তর দেয়ার জন্য!",
		correct: "✅ | সঠিক উত্তর!\n\n💰 | তোমার ওয়ালেট:\n━━━━━━━━━━━━━━\n💵 ব্যালেন্স: %1$\n🎁 প্রাইজ: +%2$\n━━━━━━━━━━━━━━",
		wrong: "❌ | ভুল! সঠিক উত্তর ছিল: %1",
		error: "❌ | গেম শুরু করতে সমস্যা হয়েছে।"
	}
};

/**
 * Runs once when module is loaded.
 * Ensures cache folder exists and global onReply map exists.
 */
module.exports.onLoad = async function ({ configValue }) {
	try {
		await fs.ensureDir(cacheDir);
		if (!global.GoatBot) global.GoatBot = {};
		if (!global.GoatBot.onReply || typeof global.GoatBot.onReply.set !== 'function') {
			global.GoatBot.onReply = new Map();
		}
		console.log(`[Module: guess] Loaded and cacheDir ensured at: ${cacheDir}`);
	} catch (err) {
		console.error(`[Module: guess] onLoad error:`, err);
	}
};

/**
 * Some loaders expect onStart to exist — provide a safe no-op to avoid "onStart undefined" errors.
 */
module.exports.onStart = function () {
	// no-op, present to satisfy loaders that call onStart
};

/**
 * Helper: robust get/set for "money" using multiple possible interfaces.
 * We try usersData (if provided), then Currencies, then Users as fallbacks.
 */
async function getMoneyForUser(userID, context = {}) {
	try {
		if (context.usersData && typeof context.usersData.get === 'function') {
			const money = await context.usersData.get(userID, "money");
			return Number(money) || 0;
		}
		if (context.Currencies && typeof context.Currencies.getData === 'function') {
			const d = await context.Currencies.getData(userID) || {};
			return Number(d.money) || 0;
		}
		if (context.Users && typeof context.Users.getData === 'function') {
			const d = await context.Users.getData(userID) || {};
			return Number(d.money) || 0;
		}
		// fallback: try global structures if any
		if (global.GoatBot && global.GoatBot.users && global.GoatBot.users[userID]) {
			return Number(global.GoatBot.users[userID].money) || 0;
		}
	} catch (e) {
		console.error('[guess] getMoneyForUser error:', e);
	}
	return 0;
}

async function setMoneyForUser(userID, amount, context = {}) {
	try {
		if (context.usersData && typeof context.usersData.set === 'function') {
			await context.usersData.set(userID, { money: amount });
			return;
		}
		if (context.Currencies && typeof context.Currencies.setData === 'function') {
			await context.Currencies.setData(userID, { money: amount });
			return;
		}
		if (context.Users && typeof context.Users.setData === 'function') {
			const d = (await context.Users.getData(userID)) || {};
			d.money = amount;
			await context.Users.setData(userID, d);
			return;
		}
		// fallback
		if (!global.GoatBot) global.GoatBot = {};
		if (!global.GoatBot.users) global.GoatBot.users = {};
		if (!global.GoatBot.users[userID]) global.GoatBot.users[userID] = {};
		global.GoatBot.users[userID].money = amount;
	} catch (e) {
		console.error('[guess] setMoneyForUser error:', e);
	}
}

/**
 * Main run handler — starts the guessing game.
 * Accepts a flexible set of context objects so it fits many GoatBot variants.
 */
module.exports.run = async function ({ api, event, args = [], Users, Threads, Currencies, usersData, permssion }) {
	try {
		// fetch characters data from the provided API (unchanged)
		const resp = await axios.get('https://global-prime-mahis-apis.vercel.app');
		if (!resp || !resp.data) throw new Error('Invalid API response');

		const characters = resp.data.data;
		const charactersArray = Array.isArray(characters) ? characters : [characters];
		if (!charactersArray.length) throw new Error('No character data returned from API');

		const randomIndex = Math.floor(Math.random() * charactersArray.length);
		const pick = charactersArray[randomIndex];

		// Ensure properties exist (keep original names)
		const image = pick.image || pick.img || pick.url;
		const traits = pick.traits || pick.description || pick.trait || "Unknown";
		const tags = pick.tags || pick.tag || "Unknown";
		const fullName = pick.fullName || pick.full_name || pick.name || "";
		const firstName = pick.firstName || pick.first_name || (typeof fullName === 'string' ? fullName.split(" ")[0] : "");

		if (!image) throw new Error('No image URL for selected character');

		// prepare image
		await fs.ensureDir(cacheDir);
		const imagePath = path.join(cacheDir, IMAGE_NAME);
		const imageRes = await axios.get(image, { responseType: 'arraybuffer' });
		await fs.writeFile(imagePath, imageRes.data);

		// message body (use english by default; translator can be extended)
		const body = this.languages && this.languages.en && this.languages.en.startGame
			? this.languages.en.startGame.replace('%1', traits).replace('%2', tags)
			: `🎮 | Guess the character\nTraits: ${traits}\nTags: ${tags}\n\n⏰ You have 15 seconds to answer!`;

		// send message with attachment and register reply handler
		api.sendMessage({
			body,
			attachment: fs.createReadStream(imagePath)
		}, event.threadID, async (err, info) => {
			if (err) {
				console.error('[guess] sendMessage error:', err);
				api.sendMessage(this.languages.en.error, event.threadID);
				await fs.unlink(imagePath).catch(() => {});
				return;
			}

			// ensure global map for onReply exists
			if (!global.GoatBot) global.GoatBot = {};
			if (!global.GoatBot.onReply || typeof global.GoatBot.onReply.set !== 'function') {
				global.GoatBot.onReply = new Map();
			}

			// Register the reply (store answers in array)
			global.GoatBot.onReply.set(info.messageID, {
				commandName: this.config.name,
				messageID: info.messageID,
				correctAnswer: [String(fullName || "").trim(), String(firstName || "").trim()].filter(Boolean),
				senderID: event.senderID,
				_created: Date.now()
			});

			// cleanup after 15 seconds: remove message and file, and unregister reply
			setTimeout(async () => {
				try {
					// unsend may throw if already removed — ignore errors
					await api.unsendMessage(info.messageID).catch(() => {});
				} catch (e) { /* ignore */ }
				try {
					global.GoatBot.onReply.delete(info.messageID);
				} catch (e) {}
				await fs.unlink(imagePath).catch(() => {});
			}, 15000);
		});

	} catch (err) {
		console.error('[guess] run error:', err);
		try { api.sendMessage(this.languages.en.error, event.threadID); } catch (e) {}
	}
};

/**
 * handleReply — called when someone replies to the message sent by run().
 * Signature supports different loader styles by accepting a context object.
 */
module.exports.handleReply = async function ({ api, event, handleReply, Users, Threads, Currencies, usersData }) {
	try {
		// If handleReply object not provided, try to find it in global map by repliedTo message id
		if (!handleReply) {
			const repliedTo = event.messageReply ? event.messageReply.messageID : event.messageID;
			if (global.GoatBot && global.GoatBot.onReply) {
				handleReply = global.GoatBot.onReply.get(repliedTo) || null;
			}
		}

		if (!handleReply) return; // nothing to handle

		// Only the original player can answer
		if (event.senderID !== handleReply.senderID) return;

		const userAnswer = (event.body || "").trim().toLowerCase();
		const correctAnswers = (handleReply.correctAnswer || []).map(a => String(a).toLowerCase());

		// If any of the stored correct answers is empty, treat as reveal (fail-safe)
		if (correctAnswers.length === 0) {
			await api.sendMessage(this.languages.en.error, event.threadID);
			return;
		}

		// Check correctness
		if (correctAnswers.includes(userAnswer)) {
			const reward = 1000;
			const currentMoney = await getMoneyForUser(event.senderID, { usersData, Users, Currencies });
			const newBalance = Number(currentMoney) + Number(reward);
			await setMoneyForUser(event.senderID, newBalance, { usersData, Users, Currencies });

			const successMsg = this.languages.en.correct.replace('%1', newBalance).replace('%2', reward);
			await api.sendMessage(successMsg, event.threadID);
		} else {
			const wrongMsg = this.languages.en.wrong.replace('%1', (handleReply.correctAnswer || []).join(" or "));
			await api.sendMessage(wrongMsg, event.threadID);
		}

		// cleanup: try to unsend both the original game message and the user's reply
		try { await api.unsendMessage(handleReply.messageID).catch(() => {}); } catch (e) {}
		try { await api.unsendMessage(event.messageID).catch(() => {}); } catch (e) {}

		// unregister reply handler
		try { global.GoatBot.onReply.delete(handleReply.messageID); } catch (e) {}

	} catch (err) {
		console.error('[guess] handleReply error:', err);
	}
};
