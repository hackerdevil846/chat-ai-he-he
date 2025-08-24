module.exports.config = {
	name: "sleep",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑨𝒑𝒏𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒑𝒖𝒓𝒐𝒏𝒐 𝑩𝒆𝒅𝒕𝒊𝒎𝒆 𝑯𝒊𝒔𝒂𝒃 𝑲𝒐𝒓𝒂",
	category: "𝑯𝒆𝒂𝒍𝒕𝒉",
	usages: "[𝑺𝒉𝒖𝒎𝒂𝒏𝒐𝒓 𝑺𝒐𝒎𝒐𝒚]",
	cooldowns: 5,
	dependencies: {
		"moment-timezone": ""
	}
};

module.exports.languages = {
	"en": {
		"returnTimeNow": "𝑱𝒐𝒅𝒊 𝒂𝒑𝒏𝒊 𝑬𝒌𝒉𝒐𝒏𝒊 𝑮𝒉𝒖𝒎𝒂𝒕𝒆 𝑱𝒂𝒏, 𝑼𝒕𝒉𝒂𝒓 𝑼𝒑𝒐𝒚𝒖𝒌𝒕𝒐 𝑺𝒐𝒎𝒐𝒚 𝑯𝒐𝒃𝒆:\n%1",
		"returnTimeSet": "𝑱𝒐𝒅𝒊 𝒂𝒑𝒏𝒊 %1 𝒕𝒂𝒚 𝑮𝒉𝒖𝒎𝒂𝒕𝒆 𝑱𝒂𝒏, 𝑼𝒕𝒉𝒂𝒓 𝑼𝒑𝒐𝒚𝒖𝒌𝒕𝒐 𝑺𝒐𝒎𝒐𝒚 𝑯𝒐𝒃𝒆:\n%2"
	}
};

module.exports.run = function({ api, event, args, getText }) {
	const { threadID, messageID } = event;
	const { throwError } = global.utils;
	const moment = global.nodemodule["moment-timezone"];

	try {
		// Collect wake up times
		let wakeTime = [];
		const content = args.join(" ").trim();

		// If no time provided -> return suggested wake times based on now
		if (!content) {
			// produce 6 wake times: add (90*i + 15) minutes for i = 1..6
			for (let i = 1; i < 7; i++) {
				wakeTime.push(moment().tz("Asia/Dhaka").add(90 * i + 15, 'm').format("HH:mm"));
			}
			return api.sendMessage(getText("returnTimeNow", wakeTime.join(', ')), threadID, messageID);
		}

		// If user provided a time, validate it (expects HH:MM with two digits each)
		if (content.indexOf(":") === -1) return throwError(this.config.name, threadID, messageID);

		const parts = content.split(":");
		const contentHour = parts[0];
		const contentMinute = parts[1];

		// Validate numeric and ranges and exact two-digit format (keeps original behavior)
		if (
			isNaN(contentHour) ||
			isNaN(contentMinute) ||
			Number(contentHour) > 23 ||
			Number(contentMinute) > 59 ||
			Number(contentHour) < 0 ||
			Number(contentMinute) < 0 ||
			contentHour.length !== 2 ||
			contentMinute.length !== 2
		) {
			return global.utils.throwError(this.config.name, threadID, messageID);
		}

		// Build sleep time based on today's date in Asia/Dhaka, replacing current hour/minute with provided ones.
		// Keep original approach so behavior is identical to your prior implementation.
		const getTime = moment().tz("Asia/Dhaka").format(); // ISO-like string with timezone
		const timePortion = getTime.slice(getTime.indexOf("T") + 1, getTime.indexOf("+"));
		const hour = timePortion.split(":")[0];
		const minute = timePortion.split(":")[1];

		// Replace hour and minute in the ISO string to create a datetime for the requested sleep time.
		const sleepTime = getTime.replace(hour + ":", contentHour + ":").replace(minute + ":", contentMinute + ":");

		for (let i = 1; i < 7; i++) {
			wakeTime.push(moment(sleepTime).tz("Asia/Dhaka").add(90 * i + 15, 'm').format("HH:mm"));
		}

		return api.sendMessage(getText("returnTimeSet", content, wakeTime.join(', ')), threadID, messageID);
	} catch (err) {
		// Fallback error handling: use framework's throwError if available, otherwise send a message
		try {
			return global.utils.throwError(this.config.name, threadID, messageID);
		} catch (e) {
			console.error(err);
			return api.sendMessage("An error occurred while calculating sleep/wake times.", threadID, messageID);
		}
	}
};
