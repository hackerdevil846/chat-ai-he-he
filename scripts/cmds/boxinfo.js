const fs = require("fs");
const request = require("request");
module.exports.config = {
	name: "groupinfo",
	version: "1.0.0", 
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒚𝒐𝒖𝒓 𝒈𝒓𝒐𝒖𝒑 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏",
	commandCategory: "𝑩𝒐𝒙", 
	usages: "groupinfo", 
	cooldowns: 0,
	dependencies: [] 
};

module.exports.run = async function({ api, event, args }) {
	function 𝒕𝒐𝑴𝒂𝒕𝒉𝑩𝒐𝒍𝒅𝑰𝒕𝒂𝒍𝒊𝒄(𝒕𝒆𝒙𝒕) {
		const 𝑴𝒂𝒑𝒑𝒊𝒏𝒈 = {
			'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯',
			'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷',
			'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿',
			'Y': '𝒀', 'Z': '𝒁',
			'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉',
			'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑',
			'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙',
			'y': '𝒚', 'z': '𝒛',
			'0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
		};
		return 𝒕𝒆𝒙𝒕.split('').map(𝒄𝒉𝒂𝒓 => 𝑴𝒂𝒑𝒑𝒊𝒏𝒈[𝒄𝒉𝒂𝒓] || 𝒄𝒉𝒂𝒓).join('');
	}
	
	let threadInfo = await api.getThreadInfo(event.threadID);
	let threadMem = threadInfo.participantIDs.length;
	let nam = 0, nu = 0;
	
	for (let z in threadInfo.userInfo) {
		if (threadInfo.userInfo[z].gender === "MALE") nam++;
		else if (threadInfo.userInfo[z].gender === "FEMALE") nu++;
	}
	
	let qtv = threadInfo.adminIDs.length;
	let sl = threadInfo.messageCount;
	let icon = threadInfo.emoji;
	let threadName = threadInfo.threadName;
	let id = threadInfo.threadID;
	let sex = threadInfo.approvalMode;
	let pd = sex ? '𝑶𝒏' : '𝑶𝒇𝒇';
	
	let 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 = `🆔 | 𝑮𝒓𝒐𝒖𝒑 𝑰𝑫: ${id}
🔖 | 𝑵𝒂𝒎𝒆: ${threadName}
👑 | 𝑨𝒅𝒎𝒊𝒏𝒔: ${qtv} 
👥 | 𝑴𝒆𝒎𝒃𝒆𝒓𝒔: ${threadMem}
👨 | 𝑴𝒂𝒍𝒆𝒔: ${nam}
👩 | 𝑭𝒆𝒎𝒂𝒍𝒆𝒔: ${nu}
💬 | 𝑴𝒆𝒔𝒔𝒂𝒈𝒆𝒔: ${sl}
✅ | 𝑨𝒑𝒑𝒓𝒐𝒗𝒂𝒍 𝑴𝒐𝒅𝒆: ${pd}
😀 | 𝑬𝒎𝒐𝒋𝒊: ${icon || '𝑵𝒐𝒏𝒆'}

❤️ | 𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝑩𝒚: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;
	
	let 𝒇𝒐𝒓𝒎𝒂𝒕𝒕𝒆𝒅𝑴𝒆𝒔𝒔𝒂𝒈𝒆 = 𝒕𝒐𝑴𝒂𝒕𝒉𝑩𝒐𝒍𝒅𝑰𝒕𝒂𝒍𝒊𝒄(𝒎𝒆𝒔𝒔𝒂𝒈𝒆);
	
	let callback = () => api.sendMessage({
		body: 𝒇𝒐𝒓𝒎𝒂𝒕𝒕𝒆𝒅𝑴𝒆𝒔𝒔𝒂𝒈𝒆,
		attachment: fs.createReadStream(__dirname + '/cache/1.png')
	}, event.threadID, () => fs.unlinkSync(__dirname + '/cache/1.png'), event.messageID);
	
	if (threadInfo.imageSrc) {
		request(encodeURI(threadInfo.imageSrc))
			.pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
			.on('close', callback);
	} else {
		api.sendMessage(𝒇𝒐𝒓𝒎𝒂𝒕𝒕𝒆𝒅𝑴𝒆𝒔𝒔𝒂𝒈𝒆, event.threadID, event.messageID);
	}
};
