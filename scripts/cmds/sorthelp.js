module.exports = {
	config: {
		name: "sorthelp",
		version: "1.2",
		author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "Sort help list",
			bn: "হেল্প লিস্ট সাজাও"
		},
		longDescription: {
			en: "Sort help list by name or category",
			bn: "হেল্প লিস্ট নাম বা ক্যাটাগরি দিয়ে সাজানো"
		},
		category: "image",
		guide: {
			en: "{pn} [name | category]",
			bn: "{pn} [name | category] — নাম বা ক্যাটাগরি দিয়ে সাজাতে"
		}
	},

	langs: {
		en: {
			savedName: "Saved sort help list by name ✅",
			savedCategory: "Saved sort help list by category ✅"
		},
		bn: {
			savedName: "হেল্প লিস্ট নাম দিয়ে সাজানোর সেটিং সংরক্ষণ করা হয়েছে ✅",
			savedCategory: "হেল্প লিস্ট ক্যাটাগরি দিয়ে সাজানোর সেটিং সংরক্ষণ করা হয়েছে ✅"
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang }) {
		if (!args[0]) {
			return message.SyntaxError();
		}

		if (args[0].toLowerCase() === "name") {
			await threadsData.set(event.threadID, "name", "settings.sortHelp");
			return message.reply(getLang("savedName"));
		}
		else if (args[0].toLowerCase() === "category") {
			await threadsData.set(event.threadID, "category", "settings.sortHelp");
			return message.reply(getLang("savedCategory"));
		}
		else {
			return message.SyntaxError();
		}
	}
};
