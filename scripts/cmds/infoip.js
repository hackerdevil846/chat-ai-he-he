module.exports.config = {
	name: "infoip",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Get detailed information about any IP address",
	category: "tools",
	usages: "[ip-address]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.run = async function({ api, event, args }) {
	const axios = global.nodemodule["axios"];
	
	if (!args[0]) {
		return api.sendMessage("❓ | Please provide an IP address to check!\nExample: /infoip 8.8.8.8", event.threadID, event.messageID);
	}

	try {
		const res = await axios.get(`http://ip-api.com/json/${args.join(" ")}`);
		const data = res.data;

		if (data.status === 'fail') {
			return api.sendMessage(`❌ | Failed to get IP information: ${data.message}`, event.threadID, event.messageID);
		}

		const message = `
🌐 | IP INFORMATION
━━━━━━━━━━━━━━━━
🔹 IP Address: ${data.query}
🏳️ Country: ${data.country}
🏙️ City: ${data.city}
📍 Region: ${data.regionName}
📡 Latitude: ${data.lat}
📡 Longitude: ${data.lon}

━━━━━━━━━━━━━━━━
📍 | Location Accuracy: Approximate
⚠️ | Note: IP location may not always be precise`;

		return api.sendMessage(message, event.threadID, event.messageID);
	} catch (error) {
		console.error(error);
		return api.sendMessage("❌ | An error occurred while fetching IP information. Please check the IP address format or try again later.", event.threadID, event.messageID);
	}
};

