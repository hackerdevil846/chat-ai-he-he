module.exports.config = {
	name: "commandName",
	version: "1.1",
	hasPermssion: 0, // 0: all users, 1: admins, 2: bot owners
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Updated credits
	description: "👋 Greeting command with personalized responses",
	commandCategory: "utility",
	usages: "[name]",
	cooldowns: 5,
	dependencies: {},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"hello": "👋 Hello world!",
		"helloWithName": "🌟 Hello! Your Facebook ID is: %1"
	},
	"vi": {
		"hello": "👋 Xin chào thế giới!",
		"helloWithName": "🌟 Xin chào! ID Facebook của bạn là: %1"
	},
	"bn": {
		"hello": "👋 হ্যালো ওয়ার্ল্ড!",
		"helloWithName": "🌟 হ্যালো! আপনার ফেসবুক আইডি হলো: %1"
	}
};

module.exports.run = async function({ api, event, args, Threads }) {
	try {
		const { threadID, messageID, senderID } = event;
		
		// Get thread language preference
		const threadData = await Threads.getData(threadID);
		const langCode = threadData.data.language || "en";
		const langData = this.languages[langCode];
		
		// Language helper function
		const getLang = (key, ...values) => {
			let text = langData[key] || key;
			values.forEach((value, i) => {
				text = text.replace(new RegExp(`%${i+1}`, 'g'), value);
			});
			return text;
		};

		// Send beautiful formatted response
		if (args.length > 0) {
			const name = args.join(" ");
			api.sendMessage(`💫 ${getLang("helloWithName", senderID)}\n📝 Name: ${name}`, threadID, messageID);
		} else {
			api.sendMessage(`🌍 ${getLang("hello")}\n✨ Powered by 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`, threadID, messageID);
		}
		
	} catch (error) {
		console.error("❌ Command error:", error);
		api.sendMessage("⚠️ An error occurred while processing your request", event.threadID);
	}
};
