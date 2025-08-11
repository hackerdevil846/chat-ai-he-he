module.exports.config = {
	name: "giveaway",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒎𝒂𝒏𝒂𝒈𝒆𝒎𝒆𝒏𝒕 𝒔𝒚𝒔𝒕𝒆𝒎",
	commandCategory: "𝑶𝒕𝒉𝒆𝒓",
	usages: "[𝒄𝒓𝒆𝒂𝒕𝒆/𝒅𝒆𝒕𝒂𝒊𝒍𝒔/𝒋𝒐𝒊𝒏/𝒓𝒐𝒍𝒍/𝒆𝒏𝒅] [𝑰𝑫𝑮𝒊𝒗𝒆𝑨𝒘𝒂𝒚]",
	cooldowns: 5
};

module.exports.handleReaction = async ({ api, event, Users, handleReaction }) => {
	let data = global.data.GiveAway.get(handleReaction.ID);
	if (data.status == "close" || data.status == "ended") return;
	
	if (event.reaction == undefined) {
		data.joined.splice(data.joined.indexOf(event.userID), 1);
		global.data.GiveAway.set(handleReaction.ID, data);
		let userInfo = await api.getThreadInfo(event.threadID);
		let userName = userInfo.nicknames?.[event.userID] || (await Users.getInfo(event.userID)).name;
		return api.sendMessage(`❌ ${userName} 𝒈𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒓𝒊𝒆 𝒈𝒆𝒄𝒉𝒆 (𝑰𝑫: #${handleReaction.ID})`, event.threadID);
	}
	
	data.joined.push(event.userID);
	global.data.GiveAway.set(handleReaction.ID, data);
	let userInfo = await api.getThreadInfo(event.threadID);
	let userName = userInfo.nicknames?.[event.userID] || (await Users.getInfo(event.userID)).name;
	return api.sendMessage(`✅ ${userName} 𝒈𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒆 𝒋𝒖𝒈𝒈𝒆𝒔𝒆𝒄𝒉𝒆 (𝑰𝑫: #${handleReaction.ID})`, event.threadID);
}

module.exports.run = async ({ api, event, args, Users }) => {
	if (!global.data.GiveAway) global.data.GiveAway = new Map();
	
	if (args[0] == "create") {
		let reward = args.slice(1).join(" ");
		let randomID = Math.floor(10000 + Math.random() * 90000);
		let userInfo = await api.getThreadInfo(event.threadID);
		let userName = userInfo.nicknames?.[event.senderID] || (await Users.getInfo(event.senderID)).name;
		
		api.sendMessage(
			"🎉====== 𝑮𝒊𝒗𝒆 𝑨𝒘𝒂𝒚 ======🎉" +
			"\n🛠️ 𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝒃𝒚: " + userName +
			"\n🎁 𝑹𝒆𝒘𝒂𝒓𝒅: " + reward +
			"\n🆔 𝑰𝑫: #" + randomID +
			"\n\n💬 𝑹𝑬𝑨𝑪𝑻𝑰𝑶𝑵 𝑲𝑶𝑹𝑼𝑵 𝑱𝑶𝑰𝑵 𝑯𝑶𝑻𝑬!"
			, event.threadID, (err, info) => {
				let giveawayData = {
					ID: randomID,
					author: userName,
					authorID: event.senderID,
					messageID: info.messageID,
					reward: reward,
					joined: [],
					status: "open"
				}
				global.data.GiveAway.set(randomID, giveawayData);
				client.handleReaction.push({
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					ID: randomID
				})
			}
		)
	}
	
	else if (args[0] == "details") {
		if (!args[1]) return api.sendMessage("❌ 𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝑰𝑫 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
		let ID = args[1].replace("#", "");
		let data = global.data.GiveAway.get(ID);
		if (!data) return api.sendMessage("❌ 𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒑𝒂𝒚𝒂 𝒋𝒂𝒚 𝒏𝒊", event.threadID, event.messageID);
		
		return api.sendMessage(
			"📊====== 𝑮𝒊𝒗𝒆 𝑨𝒘𝒂𝒚 𝑫𝒆𝒕𝒂𝒊𝒍𝒔 ======📊" +
			"\n👤 𝑪𝒓𝒆𝒂𝒕𝒐𝒓: " + data.author + " (ID: " + data.authorID + ")" +
			"\n🎁 𝑹𝒆𝒘𝒂𝒓𝒅: " + data.reward +
			"\n🆔 𝑰𝑫: #" + data.ID +
			"\n👥 𝑷𝒂𝒓𝒕𝒊𝒄𝒊𝒑𝒂𝒏𝒕𝒔: " + data.joined.length + " 𝒋𝒂𝒏" +
			"\n📌 𝑺𝒕𝒂𝒕𝒖𝒔: " + (data.status == "open" ? "𝑶𝒑𝒆𝒏" : "𝑪𝒍𝒐𝒔𝒆𝒅")
			, event.threadID, data.messageID
		);
	}
	
	else if (args[0] == "join") {
		if (!args[1]) return api.sendMessage("❌ 𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝑰𝑫 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
		let ID = args[1].replace("#", "");
		let data = global.data.GiveAway.get(ID);
		if (!data) return api.sendMessage("❌ 𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒑𝒂𝒚𝒂 𝒋𝒂𝒚 𝒏𝒊", event.threadID, event.messageID);
		if (data.joined.includes(event.senderID)) return api.sendMessage("❌ 𝑨𝒑𝒏𝒊 𝒂𝒈𝒆 𝒋𝒐𝒊𝒏 𝒌𝒐𝒓𝒆𝒄𝒉𝒆𝒏", event.threadID);
		
		data.joined.push(event.senderID);
		global.data.GiveAway.set(ID, data);
		let userInfo = await api.getThreadInfo(event.threadID);
		let userName = userInfo.nicknames?.[event.senderID] || (await Users.getInfo(event.senderID)).name;
		return api.sendMessage(`✅ ${userName} 𝒈𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒆 𝒋𝒖𝒈𝒈𝒆𝒔𝒆𝒄𝒉𝒆 (𝑰𝑫: #${ID})`, event.senderID);
	}
	
	else if (args[0] == "roll") {
		if (!args[1]) return api.sendMessage("❌ 𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝑰𝑫 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
		let ID = args[1].replace("#", "");
		let data = global.data.GiveAway.get(ID);
		if (!data) return api.sendMessage("❌ 𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒑𝒂𝒚𝒂 𝒋𝒂𝒚 𝒏𝒊", event.threadID, event.messageID);
		if (data.authorID !== event.senderID) return api.sendMessage("❌ 𝑨𝒑𝒏𝒊 𝒆𝒊 𝒈𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒆𝒓 𝒎𝒂𝒍𝒊𝒌 𝒏𝒂𝒏", event.threadID, event.messageID);
		
		if (data.joined.length === 0) return api.sendMessage("❌ 𝑲𝒆𝒖 𝒋𝒐𝒊𝒏 𝒌𝒐𝒓𝒊𝒏𝒊", event.threadID, event.messageID);
		
		let winner = data.joined[Math.floor(Math.random() * data.joined.length)];
		let userInfo = await Users.getInfo(winner);
		return api.sendMessage({
			body: `🎉 𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒖𝒍𝒂𝒕𝒊𝒐𝒏𝒔 ${userInfo.name}! 𝑨𝒑𝒏𝒊 𝒈𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒋𝒊𝒕𝒆𝒄𝒉𝒆𝒏 (𝑰𝑫: #${data.ID})\n📩 𝑪𝒐𝒏𝒕𝒂𝒄𝒕: ${data.author} (𝒎𝒆.𝒎𝒆/${data.authorID})`,
			mentions: [{
				tag: userInfo.name,
				id: winner
			}]
		}, event.threadID, event.messageID);
	}
	
	else if (args[0] == "end") {
		if (!args[1]) return api.sendMessage("❌ 𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝑰𝑫 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
		let ID = args[1].replace("#", "");
		let data = global.data.GiveAway.get(ID);
		if (!data) return api.sendMessage("❌ 𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒑𝒂𝒚𝒂 𝒋𝒂𝒚 𝒏𝒊", event.threadID, event.messageID);
		if (data.authorID !== event.senderID) return api.sendMessage("❌ 𝑨𝒑𝒏𝒊 𝒆𝒊 𝒈𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒆𝒓 𝒎𝒂𝒍𝒊𝒌 𝒏𝒂𝒏", event.threadID, event.messageID);
		
		data.status = "ended";
		global.data.GiveAway.set(ID, data);
		api.unsendMessage(data.messageID);
		return api.sendMessage(`🔚 #${data.ID} 𝒈𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒔𝒆𝒔 𝒉𝒐𝒍𝒆 𝒈𝒆𝒄𝒉𝒆 (𝒃𝒚 ${data.author})`, event.threadID, event.messageID);
	}
	
	else {
		return api.sendMessage(
			"⚙️ 𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝑺𝒚𝒔𝒕𝒆𝒎\n" +
			"𝒄𝒓𝒆𝒂𝒕𝒆 - 𝑵𝒆𝒘 𝒈𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒃𝒂𝒏𝒂𝒐\n" +
			"𝒅𝒆𝒕𝒂𝒊𝒍𝒔 - 𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒅𝒆𝒕𝒂𝒊𝒍𝒔\n" +
			"𝒋𝒐𝒊𝒏 - 𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒆 𝒋𝒐𝒊𝒏 𝒌𝒐𝒓𝒐\n" +
			"𝒓𝒐𝒍𝒍 - 𝑾𝒊𝒏𝒏𝒆𝒓 𝒔𝒆𝒍𝒆𝒄𝒕 𝒌𝒐𝒓𝒐\n" +
			"𝒆𝒏𝒅 - 𝑮𝒊𝒗𝒆𝒂𝒘𝒂𝒚 𝒔𝒆𝒔 𝒌𝒐𝒓𝒐",
			event.threadID, event.messageID
		);
	}
}
