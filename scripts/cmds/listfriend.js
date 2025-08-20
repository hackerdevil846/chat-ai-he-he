module.exports.config = {
	name: "listfriend",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑩𝒂𝒏𝒅𝒉𝒖𝒅𝒆𝒓 𝒅𝒆𝒓 𝒊𝒏𝒇𝒐 𝒅𝒆𝒌𝒉𝒂𝒓 𝒂𝒓 𝒓𝒆𝒑𝒍𝒚 𝒅𝒊𝒚𝒆 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
	commandCategory: "system",
	usages: "[page]",
	cooldowns: 5,
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"listTitle": "🎭 𝗬𝗼𝘂𝗿 𝗙𝗿𝗶𝗲𝗻𝗱 𝗟𝗶𝘀𝘁: %1 𝗙𝗿𝗶𝗲𝗻𝗱𝘀  🎭",
		"listFormat": "┏⊰ 𝗡𝗼.%1\n┣⊰ 𝗡𝗮𝗺𝗲: %2\n┣⊰ 𝗨𝗜𝗗: %3\n┣⊰ 𝗚𝗲𝗻𝗱𝗲𝗿: %4\n┣⊰ 𝗩𝗮𝗻𝗶𝘁𝘆: %5\n┗⊰ 𝗣𝗿𝗼𝗳𝗶𝗹𝗲: %6",
		"pageInfo": "📄 𝗣𝗮𝗴𝗲 %1/%2",
		"instructions": "🎭 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗻𝘂𝗺𝗯𝗲𝗿𝘀 (𝟭-𝟭𝟬) 𝘁𝗼 𝗱𝗲𝗹𝗲𝘁𝗲 𝗳𝗿𝗶𝗲𝗻𝗱𝘀\n🔢 𝗠𝘂𝗹𝘁𝗶𝗽𝗹𝗲 𝗻𝘂𝗺𝗯𝗲𝗿𝘀 𝘀𝗲𝗽𝗮𝗿𝗮𝘁𝗲𝗱 𝗯𝘆 𝘀𝗽𝗮𝗰𝗲",
		"deleteSuccess": "🗑️ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗙𝗿𝗶𝗲𝗻𝗱𝘀 🗑️\n\n%1"
	}
};

module.exports.handleReply = async function({ api, event, handleReply, Users, Threads }) {
	if (event.senderID != handleReply.author) return;
	const { threadID, messageID } = event;
	
	const { listFriend, nameUser, urlUser, uidUser, messageID: replyID } = handleReply;
	const numbers = event.body.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n) && n > 0 && n <= listFriend.length);
	
	if (numbers.length === 0) return api.sendMessage("❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗻𝘂𝗺𝗯𝗲𝗿𝘀 𝗽𝗿𝗼𝘃𝗶𝗱𝗲𝗱", threadID, messageID);
	
	let deleteReport = "";
	for (const num of numbers) {
		const index = num - 1;
		try {
			await api.removeFriend(uidUser[index]);
			deleteReport += `❌ 𝗗𝗲𝗹𝗲𝘁𝗲𝗱: ${nameUser[index]}\n🔗 𝗟𝗶𝗻𝗸: ${urlUser[index]}\n\n`;
		} catch (error) {
			deleteReport += `⚠️ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗱𝗲𝗹𝗲𝘁𝗲: ${nameUser[index]}\n`;
		}
	}
	
	api.sendMessage(deleteReport, threadID, () => 
		api.unsendMessage(replyID), messageID
	);
};

module.exports.run = async function({ api, event, args, Users, Threads }) {
	const { threadID, messageID, senderID } = event;
	try {
		const listFriend = (await api.getFriendsList()).map(friend => ({
			name: friend.fullName || "❌ 𝗡𝗮𝗺𝗲 𝗡𝗼𝘁 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲",
			uid: friend.userID,
			gender: friend.gender == 1 ? "♀️ 𝗙𝗲𝗺𝗮𝗹𝗲" : "♂️ 𝗠𝗮𝗹𝗲",
			vanity: friend.vanity || "❌ 𝗡𝗼 𝗩𝗮𝗻𝗶𝘁𝘆",
			profileUrl: friend.profileUrl
		}));

		const page = Math.max(parseInt(args[0]) || 1, 1);
		const limit = 10;
		const numPage = Math.ceil(listFriend.length / limit);
		const startIdx = limit * (page - 1);
		
		let msg = `╔═══════╗\n`;
		msg += `║ 𝗙𝗥𝗜𝗘𝗡𝗗 𝗟𝗜𝗦𝗧 ║\n`;
		msg += `╚═══════╝\n`;
		msg += `✦ 𝗧𝗼𝘁𝗮𝗹 𝗙𝗿𝗶𝗲𝗻𝗱𝘀: ${listFriend.length} ✦\n\n`;
		
		for (let i = startIdx; i < Math.min(startIdx + limit, listFriend.length); i++) {
			const friend = listFriend[i];
			msg += this.languages.en.listFormat
				.replace("%1", i+1)
				.replace("%2", friend.name)
				.replace("%3", friend.uid)
				.replace("%4", friend.gender)
				.replace("%5", friend.vanity)
				.replace("%6", friend.profileUrl) + "\n\n";
		}
		
		msg += `✦ ${this.languages.en.pageInfo.replace("%1", page).replace("%2", numPage)} ✦\n`;
		msg += `✦ ${this.languages.en.instructions} ✦`;

		return api.sendMessage(msg, threadID, (err, info) => {
			global.client.handleReply.push({
				name: this.config.name,
				messageID: info.messageID,
				author: senderID,
				listFriend,
				nameUser: listFriend.map(f => f.name),
				urlUser: listFriend.map(f => f.profileUrl),
				uidUser: listFriend.map(f => f.uid)
			});
		}, messageID);
	} catch (error) {
		console.error(error);
		return api.sendMessage("❌ 𝗘𝗿𝗿𝗼𝗿 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗳𝗿𝗶𝗲𝗻𝗱 𝗹𝗶𝘀𝘁", threadID, messageID);
	}
};
