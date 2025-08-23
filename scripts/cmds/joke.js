const axios = require("axios");

module.exports.config = {
	name: "joke",
	version: "2.0",
	author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Get random jokes from official API",
	category: "fun",
	usages: "",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"error": "❌ Sorry, couldn't fetch jokes at the moment. Please try again later."
	}
}

module.exports.run = async function ({ api, event, getText }) {
	try {
		const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
		const { setup, punchline } = response.data;
		
		const message = `🤡 | ${setup}\n\n💥 | ${punchline}\n\n✨ Credit: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;
		
		return api.sendMessage(message, event.threadID, event.messageID);
	} 
	catch (error) {
		console.error("Joke API Error:", error);
		return api.sendMessage(getText("error"), event.threadID, event.messageID);
	}
};
