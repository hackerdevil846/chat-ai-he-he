module.exports.config = {
	name: "thread",
	version: "0.0.3",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑮𝒓𝒐𝒖𝒑 𝒌𝒆 𝑩𝒂𝒏 𝒃𝒂 𝑼𝒏𝒃𝒂𝒏 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒄𝒐𝒎𝒎𝒂𝒏𝒅",
	commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "[𝒖𝒏𝒃𝒂𝒏/𝒃𝒂𝒏/𝒔𝒆𝒂𝒓𝒄𝒉] [𝑰𝑫 𝒃𝒂 𝒕𝒆𝒙𝒕]",
	cooldowns: 5
};

module.exports.handleReaction = async ({ event, api, Threads, handleReaction }) => {
	if (parseInt(event.userID) !== parseInt(handleReaction.author)) return;
	switch (handleReaction.type) {
		case "ban": {
			const data = (await Threads.getData(handleReaction.target)).data || {};
			data.banned = 1;
			await Threads.setData(handleReaction.target, { data });
			global.data.threadBanned.set(parseInt(handleReaction.target), 1);
			api.sendMessage(`[${handleReaction.target}] 𝑺𝒂𝒇𝒂𝒍𝒍𝒚 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!`, event.threadID, () => api.unsendMessage(handleReaction.messageID));
			break;
		}
		case "unban": {
			const data = (await Threads.getData(handleReaction.target)).data || {};
			data.banned = 0;
			await Threads.setData(handleReaction.target, { data });
			global.data.threadBanned.delete(parseInt(handleReaction.target), 1);
			api.sendMessage(`[${handleReaction.target}] 𝑺𝒂𝒇𝒂𝒍𝒍𝒚 𝒖𝒏𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆`, event.threadID, () => api.unsendMessage(handleReaction.messageID));
			break;
		}
		default:
			break;
	}
}

module.exports.run = async ({ event, api, args, Threads }) => {
    let content = args.slice(1, args.length);
	switch (args[0]) {
		case "ban": {
			if (content.length == 0) return api.sendMessage("𝑨𝒑𝒏𝒊 𝒃𝒂𝒏 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒐𝒏 𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝑰𝑫 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆!", event.threadID);
			for (let idThread of content) {
				idThread = parseInt(idThread);
				if (isNaN(idThread)) return api.sendMessage(`[${idThread}] 𝑰𝑫𝒕𝒉𝒓𝒆𝒂𝒅 𝒏𝒐𝒚!`, event.threadID);
				let dataThread = (await Threads.getData(idThread.toString()));
				if (!dataThread) return api.sendMessage(`[${idThread}] 𝑫𝒂𝒕𝒂𝒃𝒂𝒔𝒆 𝒆 𝒆𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒏𝒆𝒊!`, event.threadID);
				if (dataThread.banned) return api.sendMessage(`[${idThread}] 𝑨𝒈𝒆𝒊 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆`, event.threadID);
				return api.sendMessage(`[${idThread}] 𝑨𝒑𝒏𝒊 𝒌𝒊 𝒆𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒕𝒂 𝒃𝒂𝒏 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒐𝒏?\n\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒂𝒄𝒕 𝒌𝒐𝒓𝒆 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐!`, event.threadID, (error, info) => {
					global.client.handleReaction.push({
						name: this.config.name,
						messageID: info.messageID,
						author: event.senderID,
						type: "ban",
						target: idThread
					});
				})
			}
			break;
		}
		case "unban": {
			if (content.length == 0) return api.sendMessage("𝑨𝒑𝒏𝒊 𝒖𝒏𝒃𝒂𝒏 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒐𝒏 𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝑰𝑫 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆!", event.threadID);
			for (let idThread of content) {
				idThread = parseInt(idThread);
				if (isNaN(idThread)) return api.sendMessage(`[${idThread}] 𝑰𝑫𝒕𝒉𝒓𝒆𝒂𝒅 𝒏𝒐𝒚!`, event.threadID);
				let dataThread = (await Threads.getData(idThread)).data;
				if (!dataThread) return api.sendMessage(`[${idThread}] 𝑫𝒂𝒕𝒂𝒃𝒂𝒔𝒆 𝒆 𝒆𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒏𝒆𝒊!`, event.threadID);
				if (dataThread.banned != 1) return api.sendMessage(`[${idThread}] 𝑨𝒈𝒆 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒏𝒊`, event.threadID);
				return api.sendMessage(`[${idThread}] 𝑨𝒑𝒏𝒊 𝒌𝒊 𝒆𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒕𝒂 𝒖𝒏𝒃𝒂𝒏 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒐𝒏?\n\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒂𝒄𝒕 𝒌𝒐𝒓𝒆 𝒖𝒏𝒃𝒂𝒏 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐!`, event.threadID, (error, info) => {
					global.client.handleReaction.push({
						name: this.config.name,
						messageID: info.messageID,
						author: event.senderID,
						type: "unban",
						target: idThread
					});
				})
			}
			break;
		}
		case "search": {
			let contentJoin = content.join(" ");
			let getThreads =  (await Threads.getAll(['threadID', 'name'])).filter(item => !!item.name);
			let matchThreads = [], a = '', b = 0;
			getThreads.forEach(i => {
				if (i.name.toLowerCase().includes(contentJoin.toLowerCase())) {
					matchThreads.push({
						name: i.name,
						id: i.threadID
					});
				}
			});
			matchThreads.forEach(i => a += `\n${b += 1}. ${i.name} - ${i.id}`);
			(matchThreads.length > 0) ? api.sendMessage(`𝒀𝒐𝒖𝒓 𝒔𝒆𝒂𝒓𝒄𝒉 𝒓𝒆𝒔𝒖𝒍𝒕: \n${a}`, event.threadID) : api.sendMessage("𝑨𝒑𝒏𝒂𝒓 𝒔𝒆𝒂𝒓𝒄𝒉 𝒆𝒓 𝒌𝒐𝒏𝒐 𝒓𝒆𝒔𝒖𝒍𝒕 𝒏𝒆𝒊!", event.threadID);
			break;
		}
		default: {
			return global.utils.throwError(this.config.name, event.threadID, event.messageID)
		}
	}
}
