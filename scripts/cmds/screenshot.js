module.exports.config = {
	name: "screenshot",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "📸 Ekti website-er fullpage screenshot nie (NSFW page gulo block kora ache)",
	commandCategory: "Any",
	usages: "[url]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
		"path": "",
		"url": ""
	}
};

module.exports.onLoad = async () => {
	const fs = global.nodemodule["fs-extra"];
	const { resolve } = global.nodemodule["path"];

	try {
		// Ensure cache dir exists
		const cacheDir = resolve(__dirname, "cache");
		await fs.ensureDir(cacheDir);

		// Path to porn list in cache
		const pornListPath = resolve(cacheDir, "pornlist.txt");

		// If pornlist not present, download it (keeps same remote link as requested)
		if (!fs.existsSync(pornListPath)) {
			await global.utils.downloadFile(
				"https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt",
				pornListPath
			);
		}
	}
	catch (err) {
		// Do not crash bot on load failure; just log
		console.error("❗[screenshot:onLoad] error:", err);
	}
};

module.exports.run = async ({ api, event, args }) => {
	const fs = global.nodemodule["fs-extra"];
	const path = global.nodemodule["path"];
	const url = global.nodemodule["url"];
	const { readFileSync, createReadStream, unlinkSync } = fs;

	// Prepare cache and pornlist loading
	try {
		const cacheDir = path.resolve(__dirname, "cache");
		await fs.ensureDir(cacheDir);
		const pornListFile = path.resolve(cacheDir, "pornlist.txt");

		if (!global.moduleData) global.moduleData = {};
		// Load porn list into memory once
		if (!global.moduleData.pornList) {
			const raw = readFileSync(pornListFile, "utf-8");
			global.moduleData.pornList = raw
				.split(/\r?\n/)
				.map(line => line.trim())
				.filter(line => line && !line.startsWith('#'))
				.map(site => site.replace(/^(0\.0\.0\.0\s*)/, ''))
				.map(site => site.replace(/\/.*$/, '')); // remove any trailing paths in list entries
		}
	}
	catch (err) {
		// If pornlist missing or unreadable, log but continue (we'll allow screenshot)
		console.warn("⚠️ [screenshot] could not load pornlist:", err && err.message ? err.message : err);
		global.moduleData = global.moduleData || {};
		global.moduleData.pornList = global.moduleData.pornList || [];
	}

	// Validate argument
	if (!args || !args[0]) {
		return api.sendMessage(
			"❌ URL deya hoyni.\n\nUsage: screenshot [url]\nตัวอย่าง: screenshot https://example.com\n\n✳️ Tip: URL e http/https diye dile bhalo output paben.",
			event.threadID,
			event.messageID
		);
	}

	// Normalize input URL for parsing (do NOT change the original target link used for thumbnail service)
	let input = args[0].trim();

	// If user provided only domain without protocol, prepend http:// for parsing (we won't change the actual image generator url)
	if (!/^[a-zA-Z]+:\/\//.test(input)) input = "http://" + input;

	let parsed;
	try {
		parsed = url.parse(input);
	}
	catch (err) {
		return api.sendMessage("❌ URL parse korte pari nai. Thik format dao (e.g. https://example.com).", event.threadID, event.messageID);
	}

	// If host is missing after parse, return error
	if (!parsed.host) {
		return api.sendMessage("❌ URL te host pai nai. Thik format dao (e.g. https://example.com).", event.threadID, event.messageID);
	}

	// Check pornlist (block NSFW domains)
	try {
		const host = parsed.host.replace(/^www\./, "").toLowerCase();
		const pornList = global.moduleData.pornList || [];

		const isPorn = pornList.some(pornURL => {
			const normalizedPorn = String(pornURL).replace(/^www\./, "").toLowerCase();
			// exact match or subdomain match
			return host === normalizedPorn || host.endsWith(`.${normalizedPorn}`);
		});

		if (isPorn) {
			return api.sendMessage("🚫 Ei website-ta NSFW category-te paoa geche — screenshot nite parbona.", event.threadID, event.messageID);
		}
	}
	catch (err) {
		// If porn check fails for any reason, log and continue (fail open)
		console.warn("⚠️ [screenshot] pornlist check failed:", err && err.message ? err.message : err);
	}

	// Build thum.io URL (keeps the exact same service/path as requested)
	// We pass the original user-supplied string (args[0]) into the thum.io call so we don't mutate user's link.
	const targetForThumb = args[0].trim();
	const outPath = path.resolve(__dirname, "cache", `${event.threadID}-${event.senderID}s.png`);
	const thumUrl = `https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${targetForThumb}`;

	// Download screenshot and send
	try {
		await global.utils.downloadFile(thumUrl, outPath);

		// Send a friendly message with emoji + attachment
		return api.sendMessage(
			{
				body: `✅ Screenshot ready! — ${targetForThumb}\n📎 Sent by: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n\n✨ Enjoy!`,
				attachment: createReadStream(outPath)
			},
			event.threadID,
			(err) => {
				// cleanup file regardless of send success
				try { unlinkSync(outPath); } catch (e) { /* ignore */ }
				if (err) {
					console.error("❗[screenshot] send error:", err);
				}
			},
			event.messageID
		);
	}
	catch (err) {
		// If any error occurs, provide helpful message (keeps same guidance as original but prettier)
		console.error("❗[screenshot] error:", err && err.stack ? err.stack : err);
		return api.sendMessage(
			"❌ Screenshot nite problem hoise. Probable karon: invalid URL ba thum.io service response dibe na.\n\nTry: `screenshot https://example.com`",
			event.threadID,
			event.messageID
		);
	}
};
