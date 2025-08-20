const axios = require('axios');

module.exports = {
	config: {
		name: "imgur",
		version: "1.0.0",
		hasPermssion: 0,
		credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
		description: "🖼️ Upload images to imgur",
		commandCategory: "media",
		usages: "[reply to image] or type 'imgur' with attachment",
		cooldowns: 5,
		dependencies: {
			"axios": ""
		}
	},

	onStart: async function ({ api, event }) {
		await this.uploadImage(api, event);
	},

	handleEvent: async function ({ api, event }) {
		if (event.body && event.body.toLowerCase() === "imgur") {
			await this.uploadImage(api, event);
		}
	},

	uploadImage: async function (api, event) {
		const csbApi = async () => {
			const base = await axios.get(
				"https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
			);
			return base.data.csb;
		};

		let link2;
		if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
			link2 = event.messageReply.attachments[0].url;
		} else if (event.attachments.length > 0) {
			link2 = event.attachments[0].url;
		} else {
			return api.sendMessage('❌ Please reply to an image or attach an image!', event.threadID, event.messageID);
		}

		try {
			const res = await axios.get(`${await csbApi()}/nazrul/imgur?link=${encodeURIComponent(link2)}`);
			const link = res.data.uploaded.image;
			return api.sendMessage(`✅ Image uploaded successfully!\n🖼️ Download link: ${link}`, event.threadID, event.messageID);
		} catch (error) {
			console.error("Error:", error);
			return api.sendMessage("❌ Failed to upload image to Imgur.", event.threadID, event.messageID);
		}
	}
};
