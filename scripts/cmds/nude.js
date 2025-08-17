module.exports.config = {
	name: "nude",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🔞 𝒏𝒖𝒅𝒆 𝒄𝒉𝒐𝒃𝒊 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 📸",
	commandCategory: "🔞 18+",
	usages: "",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.languages = {
	"bn": {
		// Translations for bangladeshi users (if needed)
	},
	"en": {
		// Translations for English users (if needed)
	}
}

module.exports.onLoad = function ({ configValue }) {
	// Code here runs when the command is loaded
}

module.exports.handleReaction = function({ api, event, models, Users, Threads, Currencies, handleReaction }) {
	// Handle when someone reacts to a bot message
}

module.exports.handleReply = function({ api, event, models, Users, Threads, Currencies, handleReply }) {
	// Handle when someone replies to a bot message
}

module.exports.handleEvent = function({ event, api, models, Users, Threads, Currencies }) {
	// Handle global events (like messages, joins, leaves)
}

module.exports.handleSchedule = function({ event, api, models, Users, Threads, Currencies, scheduleItem }) {
	// Handle scheduled tasks (cron jobs, timers, etc.)
}

module.exports.run = async function({ api, event, args, models, Users, Threads, Currencies, permssion, message }) {
	const axios = require("axios");
	const fs = require("fs-extra");
	
	try {
		// Define categories for image search
		const categories = ["boobs", "ass", "pussy", "feet"];
		// Select a random category
		const randomCategory = categories[Math.floor(Math.random() * categories.length)];
		
		// Configuration for the primary RapidAPI endpoint
		const primaryOptions = {
			method: "GET",
			url: "https://girls-nude-image.p.rapidapi.com/",
			params: { type: randomCategory },
			headers: {
				"x-rapidapi-key": "44a0d41bb0msh7963185219ba506p117328jsned41eee4c796",
				"x-rapidapi-host": "girls-nude-image.p.rapidapi.com"
			}
		};

		let imageUrl;
		let imageList;

		try {
			// Attempt to fetch image from primary API
			const response = await axios.request(primaryOptions);
			imageList = response.data;
		} catch (primaryError) {
			console.error("Primary API failed, trying backup: ", primaryError);
			// Configuration for the backup RapidAPI endpoint
			const backupOptions = {
				method: "GET",
				url: "https://porn-image1.p.rapidapi.com/",
				params: { type: randomCategory },
				headers: {
					"x-rapidapi-key": "44a0d41bb0msh7963185219ba506p117328jsned41eee4c796",
					"x-rapidapi-host": "porn-image1.p.rapidapi.com"
				}
			};
			// Attempt to fetch image from backup API
			const backupResponse = await axios.request(backupOptions);
			imageList = backupResponse.data;
		}
		
		// Check if any images were found
		if (!imageList || imageList.length === 0) {
			throw new Error("No images found in API response 😔");
		}

		// Select a random image from the list
		const randomIndex = Math.floor(Math.random() * imageList.length);
		imageUrl = imageList[randomIndex];
		
		// Download the image
		const imgResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
		const imgPath = __dirname + `/cache/nude_${event.senderID}_${event.threadID}.jpg`;
		fs.writeFileSync(imgPath, Buffer.from(imgResponse.data, "binary"));
		
		// Send the image with a success message
		await api.sendMessage({
			body: `📸 𝒄𝒉𝒐𝒃𝒊 𝒔𝒐𝒏𝒌𝒉𝒂: (${randomIndex + 1}/${imageList.length}) ✨`,
			attachment: fs.createReadStream(imgPath)
		}, event.threadID, () => fs.unlinkSync(imgPath));

	} catch (error) {
		console.error("Error in nude command: ", error);
		// Send an error message to the user
		api.sendMessage("❌ 𝒆𝒓𝒓𝒐𝒓: 𝒄𝒉𝒐𝒃𝒊 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂 😔", event.threadID, event.messageID);
	}
}
