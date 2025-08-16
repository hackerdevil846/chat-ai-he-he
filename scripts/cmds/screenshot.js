const fs = require("fs-extra");
const path = require("path");
const url = require("url");

module.exports.config = {
	name: "screenshot", // Command name
	version: "1.0.0", // Module version
	hasPermssion: 0, // 0 = all users
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Author credit
	description: "📸 Ekṭi website er screenshot niya ashe (❌ NSFW Page allow nei)", 
	commandCategory: "📂 Anyā", // Category
	usages: "[url site]", // Usage
	cooldowns: 5, // Cooldown
	dependencies: {
		"fs-extra": "",
		"path": "",
		"url": ""
	}
};

module.exports.onLoad = async () => {
	const { existsSync } = fs;
	const { resolve } = path;

	const pornPath = resolve(__dirname, "cache", "pornlist.txt");

	// যদি cache file না থাকে তাহলে download হবে
	if (!existsSync(pornPath)) {
		await global.utils.downloadFile(
			"https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt",
			pornPath
		);
	}
	return;
};

module.exports.run = async ({ api, event, args }) => {
	const { readFileSync, createReadStream, unlinkSync } = fs;

	// যদি URL দেওয়া না হয়
	if (!args[0]) {
		return api.sendMessage(
			"⚠️ Doya kore ekṭi website link din!\n\n👉 Usage: screenshot [url]",
			event.threadID,
			event.messageID
		);
	}

	// Load porn blocklist
	if (!global.moduleData.pornList) {
		global.moduleData.pornList = readFileSync(
			__dirname + "/cache/pornlist.txt",
			"utf-8"
		)
			.split("\n")
			.filter(site => site && !site.startsWith("#"))
			.map(site => site.replace(/^(0.0.0.0 )/, ""));
	}

	const urlParsed = url.parse(args[0]);

	// যদি NSFW site পাওয়া যায়
	if (global.moduleData.pornList.some(pornURL => urlParsed.host == pornURL)) {
		return api.sendMessage(
			"🚫 Apni dākhanor siteṭi nirapad na! (❌ NSFW PAGE block kora)",
			event.threadID,
			event.messageID
		);
	}

	try {
		const imgPath = __dirname + `/cache/${event.threadID}-${event.senderID}s.png`;

		// Screenshot download
		await global.utils.downloadFile(
			`https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${args[0]}`,
			imgPath
		);

		// পাঠানো হচ্ছে
		api.sendMessage(
			{
				body: `✅ Screenshot ready!\n🌐 URL: ${args[0]}`,
				attachment: createReadStream(imgPath)
			},
			event.threadID,
			() => unlinkSync(imgPath)
		);
	} catch (e) {
		return api.sendMessage(
			"❌ Ei URLṭi screenshot nite somvob holo na!\n🔎 Format thik ache kina check korun.\n\n👉 Example: screenshot https://example.com",
			event.threadID,
			event.messageID
		);
	}
};
