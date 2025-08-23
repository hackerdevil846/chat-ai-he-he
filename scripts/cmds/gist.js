const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports.config = {
	name: "gist", 
	version: "7.0.0", 
	hasPermssion: 2, 
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 
	description: "Convert code into a beautiful GitHub Gist link for easy sharing & usage.", 
	category: "developer", 
	usages: "[filename] (reply to code message)", 
	cooldowns: 5, 
	dependencies: { "axios": "" }
};

module.exports.languages = {
	"en": {
		"missingFileName": "📝 Please specify a filename.\nUsage: gist <filename> (reply to code message)\nExample: gist help",
		"noTextReply": "❌ The replied message doesn't contain any text/code.",
		"fileNotFound": "❌ File \"%1.js\" not found inside commands folder.",
		"fileEmpty": "⚠️ The file \"%1.js\" is empty. Nothing to upload.",
		"success": `
✅ Gist created successfully!
━━━━━━━━━━━━━━━
📝 Filename: %1.js
📂 Source: %2
🔗 Gist URL: %3
🔗 Raw URL: %4
━━━━━━━━━━━━━━━
💡 Tip: Use the raw URL for direct access to clean code.
		`.trim(),
		"timeout": "⚠️ Request timed out. Please try again later.",
		"notFound": "❌ Gist API endpoint not found.",
		"unavailable": "❌ Gist API is currently unavailable. Try again later.",
		"invalidResponse": "⚠️ Received invalid response from Gist API.",
		"unknownError": "❌ An unexpected error occurred while processing your request."
	}
};

module.exports.run = async function ({ api, event, args }) {
	const { threadID, messageID, messageReply } = event;
	const lang = module.exports.languages["en"];

	try {
		// Ensure filename provided
		if (!args[0]) {
			return api.sendMessage(lang.missingFileName, threadID, messageID);
		}

		const fileName = args[0].replace(/\.js$/i, "");
		let codeContent = "";

		// If user replies to a message (with code)
		if (messageReply) {
			codeContent = messageReply.body || "";
			if (!codeContent.trim()) {
				return api.sendMessage(lang.noTextReply, threadID, messageID);
			}
		} 
		// If user specifies a file from commands folder
		else {
			const commandsDir = path.join(__dirname, "..", "commands");
			const filePath = path.join(commandsDir, `${fileName}.js`);

			if (!fs.existsSync(filePath)) {
				return api.sendMessage(
					lang.fileNotFound.replace("%1", fileName),
					threadID,
					messageID
				);
			}

			codeContent = await fs.promises.readFile(filePath, "utf-8");

			if (!codeContent.trim()) {
				return api.sendMessage(
					lang.fileEmpty.replace("%1", fileName),
					threadID,
					messageID
				);
			}
		}

		// Call external API to create gist
		const gistAPI = "https://noobs-api-sable.vercel.app/gist";
		const response = await axios.get(gistAPI, {
			params: {
				filename: `${fileName}.js`,
				code: codeContent,
				description: "Uploaded via Goat Bot",
				isPublic: true
			},
			timeout: 20000
		});

		// Handle invalid response
		if (!response.data?.success || !response.data?.raw_url) {
			throw new Error("Invalid API response");
		}

		// Extract gist details
		const rawUrl = response.data.raw_url;
		const gistUrl = rawUrl.replace("/raw/", "/");
		const sourceType = messageReply ? "Message Reply" : "Command File";

		// Success message with rich formatting
		const successMsg = lang.success
			.replace("%1", fileName)
			.replace("%2", sourceType)
			.replace("%3", gistUrl)
			.replace("%4", rawUrl);

		return api.sendMessage(successMsg, threadID, messageID);

	} catch (error) {
		console.error("[Gist Command] Error:", error);

		let errorMessage = lang.unknownError;

		if (error.code === "ECONNABORTED") {
			errorMessage = lang.timeout;
		} 
		else if (error.response) {
			if (error.response.status === 404) {
				errorMessage = lang.notFound;
			} else {
				errorMessage = lang.unavailable;
			}
		} 
		else if (error.message.includes("ENOENT")) {
			errorMessage = lang.fileNotFound.replace("%1", args[0] || "unknown");
		} 
		else if (error.message.includes("Invalid API response")) {
			errorMessage = lang.invalidResponse;
		}

		return api.sendMessage(errorMessage, threadID, messageID);
	}
};
