const fs = require("fs");
const request = require("request");

module.exports.config = {
	name: "groupinfo",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒚𝒐𝒖𝒓 𝒈𝒓𝒐𝒖𝒑 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏",
	category: "Box",
	usages: "groupinfo",
	cooldowns: 3,
	dependencies: {}
};

module.exports.run = async function ({ api, event }) {
	// Function to convert normal text -> Math Bold Italic
	function toMathBoldItalic(text) {
		const mapping = {
			'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯',
			'I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷',
			'Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿',
			'Y': '𝒀','Z': '𝒁',
			'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉',
			'i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑',
			'q': '𝒒','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙',
			'y': '𝒚','z': '𝒛',
			'0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗'
		};
		return text.split('').map(c => mapping[c] || c).join('');
	}

	// Fetch thread info
	let threadInfo = await api.getThreadInfo(event.threadID);
	let threadMem = threadInfo.participantIDs.length;
	let males = 0, females = 0;

	for (let u of threadInfo.userInfo) {
		if (u.gender === "MALE") males++;
		else if (u.gender === "FEMALE") females++;
	}

	let admins = threadInfo.adminIDs.length;
	let totalMsg = threadInfo.messageCount;
	let icon = threadInfo.emoji || "None";
	let threadName = threadInfo.threadName || "Unnamed";
	let threadID = threadInfo.threadID;
	let approval = threadInfo.approvalMode ? "𝑶𝒏" : "𝑶𝒇𝒇";

	// Build message
	let message = `🆔 | 𝑮𝒓𝒐𝒖𝒑 𝑰𝑫: ${threadID}
🔖 | 𝑵𝒂𝒎𝒆: ${threadName}
👑 | 𝑨𝒅𝒎𝒊𝒏𝒔: ${admins}
👥 | 𝑴𝒆𝒎𝒃𝒆𝒓𝒔: ${threadMem}
👨 | 𝑴𝒂𝒍𝒆𝒔: ${males}
👩 | 𝑭𝒆𝒎𝒂𝒍𝒆𝒔: ${females}
💬 | 𝑴𝒆𝒔𝒔𝒂𝒈𝒆𝒔: ${totalMsg}
✅ | 𝑨𝒑𝒑𝒓𝒐𝒗𝒂𝒍 𝑴𝒐𝒅𝒆: ${approval}
😀 | 𝑬𝒎𝒐𝒋𝒊: ${icon}

❤️ | 𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝑩𝒚: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;

	let formattedMessage = toMathBoldItalic(message);

	// Send with group avatar if available
	let callback = () => api.sendMessage({
		body: formattedMessage,
		attachment: fs.createReadStream(__dirname + "/cache/1.png")
	}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);

	if (threadInfo.imageSrc) {
		request(encodeURI(threadInfo.imageSrc))
			.pipe(fs.createWriteStream(__dirname + "/cache/1.png"))
			.on("close", callback);
	} else {
		api.sendMessage(formattedMessage, event.threadID, event.messageID);
	}
};
