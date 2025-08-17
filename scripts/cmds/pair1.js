const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

// Define paths
const dirMaterial = path.join(__dirname, "cache", "canvas");
const bgPath = path.join(dirMaterial, "pairing.jpg");

module.exports.config = {
	name: "pair1",
	version: "1.0.3",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "💖 Pair with people in the group",
	category: "love",
	usages: "pair1",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": "",
		"jimp": ""
	},
	envConfig: {}
};

module.exports.onLoad = async function() {
	try {
		// Initialize cache directory
		if (!fs.existsSync(dirMaterial)) {
			fs.mkdirSync(dirMaterial, { recursive: true });
		}

		// Download background image if not exists
		if (!fs.existsSync(bgPath)) {
			const response = await axios.get("https://i.pinimg.com/736x/15/fa/9d/15fa9d71cdd07486bb6f728dae2fb264.jpg", {
				responseType: "arraybuffer",
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
				}
			});
			fs.writeFileSync(bgPath, Buffer.from(response.data, "utf-8"));
			console.log("✅ Pairing background image downloaded successfully!");
		}
	} catch (error) {
		console.error("❌ Error initializing pairing command:", error);
	}
};

module.exports.run = async function({ api, event, Threads, Users }) {
	try {
		const { threadID, messageID, senderID } = event;
		const tl = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
		const tle = tl[Math.floor(Math.random() * tl.length)];
		
		// Get sender info
		const senderInfo = await Users.getInfo(senderID);
		const namee = senderInfo.name;
		
		// Get thread info
		const threadInfo = await Threads.getInfo(threadID);
		const participants = threadInfo.participantIDs;
		
		// Filter out sender and bots
		const eligibleParticipants = participants.filter(id => 
			id !== senderID && 
			!id.includes("100000") && 
			!id.includes("bot") &&
			id !== api.getCurrentUserID()
		);
		
		if (eligibleParticipants.length === 0) {
			return api.sendMessage("😢 No eligible participants found for pairing!", threadID, messageID);
		}
		
		const randomID = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
		const userInfo = await Users.getInfo(randomID);
		const name = userInfo.name;
		
		// Create image
		const imgPath = await makePairImage(senderID, randomID);
		
		// Prepare message
		const arraytag = [
			{ id: senderID, tag: namee },
			{ id: randomID, tag: name }
		];
		
		const messageText = `💖 Congratulations ${namee} was paired with ${name}\n✨ Pair odds are: ${tle}`;
		
		api.sendMessage({
			body: messageText,
			mentions: arraytag,
			attachment: fs.createReadStream(imgPath)
		}, threadID, () => {
			try {
				if (fs.existsSync(imgPath)) {
					fs.unlinkSync(imgPath);
				}
			} catch (cleanupError) {
				console.error("🧹 Cleanup error:", cleanupError);
			}
		}, messageID);
		
	} catch (error) {
		console.error("❌ Pair command error:", error);
		api.sendMessage("❌ An error occurred while processing the pairing command. Please try again later!", event.threadID, event.messageID);
	}
};

async function makePairImage(one, two) {
	try {
		const outputPath = path.join(dirMaterial, `pairing_${one}_${two}.png`);
		const avatarOnePath = path.join(dirMaterial, `avt_${one}.png`);
		const avatarTwoPath = path.join(dirMaterial, `avt_${two}.png`);
		
		// Download avatars in parallel
		const [avatarOne, avatarTwo] = await Promise.all([
			axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512`, { 
				responseType: "arraybuffer",
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
				}
			}),
			axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512`, { 
				responseType: "arraybuffer",
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
				}
			})
		]);
		
		fs.writeFileSync(avatarOnePath, Buffer.from(avatarOne.data, "utf-8"));
		fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwo.data, "utf-8"));
		
		// Process images
		const [pairingImg, circleOne, circleTwo] = await Promise.all([
			jimp.read(bgPath),
			createCircle(avatarOnePath),
			createCircle(avatarTwoPath)
		]);
		
		// Position avatars on background
		pairingImg.composite(circleOne.resize(85, 85), 355, 100);   // Right position
		pairingImg.composite(circleTwo.resize(75, 75), 250, 140);   // Left position
		
		// Save processed image
		await pairingImg.writeAsync(outputPath);
		
		// Cleanup temp avatar files
		[avatarOnePath, avatarTwoPath].forEach(path => {
			if (fs.existsSync(path)) fs.unlinkSync(path);
		});
		
		return outputPath;
		
	} catch (error) {
		console.error("❌ Error creating pair image:", error);
		throw error;
	}
}

async function createCircle(imagePath) {
	try {
		const image = await jimp.read(imagePath);
		return image.circle();
	} catch (error) {
		console.error("❌ Error creating circle avatar:", error);
		throw error;
	}
}
