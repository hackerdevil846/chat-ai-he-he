const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
	name: "hd",
	version: "3.5",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "✨ Enhance image quality to Ultra HD using AI technology",
	category: "media",
	usages: "[reply to image]",
	cooldowns: 15,
	dependencies: {
		"axios": "",
		"fs-extra": "",
		"path": ""
	},
	envConfig: {
		"MAX_FILE_SIZE": 25 // MB
	}
};

module.exports.run = async function ({ api, event }) {
	const { threadID, messageID, messageReply } = event;
	const cacheDir = path.join(__dirname, 'cache', 'hd-images');
	const imagePath = path.join(cacheDir, `enhanced_${Date.now()}.jpg`);
	
	// Create cache directory if needed
	if (!fs.existsSync(cacheDir)) {
		await fs.mkdirp(cacheDir);
	}

	try {
		// Validate message reply
		if (!messageReply || !messageReply.attachments || !messageReply.attachments[0] || 
			!['photo', 'sticker'].includes(messageReply.attachments[0].type)) {
			return api.sendMessage({
				body: "🖼️ 𝗛𝗗 𝗜𝗠𝗔𝗚𝗘 𝗘𝗡𝗛𝗔𝗡𝗖𝗘𝗠𝗘𝗡𝗧\n" +
					"━━━━━━━━━━━━━━━━━━\n" +
					"📝 𝗛𝗼𝘄 𝘁𝗼 𝘂𝘀𝗲:\n" +
					"❶ Reply to an image with 'hd'\n" +
					"❷ Wait for processing\n" +
					"❸ Receive enhanced HD version\n\n" +
					"✨ 𝗡𝗼𝘁𝗲: Works best with clear images\n" +
					"⏳ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗧𝗶𝗺𝗲: 10-30 seconds",
				attachment: fs.createReadStream(path.join(__dirname, 'assets', 'hd-demo.jpg')) // You can add a demo image in assets folder
			}, threadID, messageID);
		}

		const attachment = messageReply.attachments[0];
		const photoUrl = attachment.url;
		
		// Check file size if available
		if (attachment.size && attachment.size > this.config.envConfig.MAX_FILE_SIZE * 1024 * 1024) {
			return api.sendMessage(
				`❌ 𝗙𝗶𝗹𝗲 𝗧𝗼𝗼 𝗟𝗮𝗿𝗴𝗲\n\n` +
				`The image exceeds the maximum size of ${this.config.envConfig.MAX_FILE_SIZE}MB.\n` +
				`Please use a smaller image for enhancement.`,
				threadID,
				messageID
			);
		}

		// Send processing message with reaction
		api.sendMessage({
			body: "🔮 𝗘𝗡𝗛𝗔𝗡𝗖𝗜𝗡𝗚 𝗜𝗠𝗔𝗚𝗘\n" +
				"━━━━━━━━━━━━━━━━━━\n" +
				"⏳ Status: Processing...\n" +
				"✨ Using: AI Enhancement Technology\n" +
				"🕒 Estimated: 10-30 seconds\n\n" +
				"Please wait while we enhance your image to Ultra HD quality...",
		}, threadID, async (err, info) => {
			if (err) return console.error(err);
			
			// Add reaction to indicate processing
			api.setMessageReaction("⏳", info.messageID, () => {}, true);
			
			try {
				// Enhance image using API
				const enhanceResponse = await axios.get(
					`https://code-merge-api-hazeyy01.replit.app/api/try/remini?url=${encodeURIComponent(photoUrl)}`,
					{ timeout: 60000 }
				);
				
				if (!enhanceResponse.data || !enhanceResponse.data.image_data) {
					throw new Error("API didn't return enhanced image data");
				}

				// Download the enhanced image
				const imageResponse = await axios.get(enhanceResponse.data.image_data, {
					responseType: 'arraybuffer',
					timeout: 60000
				});

				// Save the image
				await fs.writeFile(imagePath, Buffer.from(imageResponse.data, 'binary'));
				
				// Update reaction to completed
				api.setMessageReaction("✅", info.messageID, () => {}, true);
				
				// Send the enhanced image
				api.sendMessage({
					body: "✅ 𝗘𝗡𝗛𝗔𝗡𝗖𝗘𝗠𝗘𝗡𝗧 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟\n" +
						"━━━━━━━━━━━━━━━━━━\n" +
						"✨ Image successfully enhanced to Ultra HD!\n" +
						"📊 Quality: 4K Resolution\n" +
						"🎯 Enhanced with AI Technology\n\n" +
						"𝗖𝗿𝗲𝗱𝗶𝘁𝘀: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
					attachment: fs.createReadStream(imagePath)
				}, threadID, () => {
					// Clean up after sending
					try {
						fs.unlinkSync(imagePath);
					} catch (cleanupErr) {
						console.error("Cleanup error:", cleanupErr);
					}
				}, messageID);
				
			} catch (error) {
				console.error("HD Command Error:", error);
				
				// Update reaction to error
				api.setMessageReaction("❌", info.messageID, () => {}, true);
				
				let errorMessage = "❌ 𝗘𝗡𝗛𝗔𝗡𝗖𝗘𝗠𝗘𝗡𝗧 𝗙𝗔𝗜𝗟𝗘𝗗\n" +
					"━━━━━━━━━━━━━━━━━━\n";
				
				if (error.response) {
					errorMessage += `🔧 API Error (Status: ${error.response.status})\n`;
				} else if (error.code === 'ECONNABORTED') {
					errorMessage += "⏰ Request timed out. Please try again.\n";
				} else if (error.message.includes('image_data')) {
					errorMessage += "🔌 Enhancement API is temporarily unavailable\n";
				} else {
					errorMessage += `📛 Error: ${error.message}\n`;
				}
				
				errorMessage += "\nPlease try again with a different image.";
				
				// Clean up if file exists
				if (fs.existsSync(imagePath)) {
					try {
						fs.unlinkSync(imagePath);
					} catch (cleanupErr) {
						console.error("Cleanup error:", cleanupErr);
					}
				}
				
				api.sendMessage(errorMessage, threadID, messageID);
			}
		});

	} catch (error) {
		console.error("HD Command Initial Error:", error);
		return api.sendMessage(
			"❌ 𝗜𝗡𝗜𝗧𝗜𝗔𝗟𝗜𝗭𝗔𝗧𝗜𝗢𝗡 𝗘𝗥𝗥𝗢𝗥\n\n" +
			"An error occurred while processing your request.\n" +
			"Please try again later.",
			threadID,
			messageID
		);
	}
};
