module.exports.config = {
	name: "thread",
	version: "0.0.3",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑮𝒓𝒐𝒖𝒑 𝒌𝒆 𝑩𝒂𝒏 𝒃𝒂 𝑼𝒏𝒃𝒂𝒏 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒄𝒐𝒎𝒎𝒂𝒏𝒅",
	category: "𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "[𝒖𝒏𝒃𝒂𝒏/𝒃𝒂𝒏/𝒔𝒆𝒂𝒓𝒄𝒉] [𝑰𝑫 𝒃𝒂 𝒕𝒆𝒙𝒕]",
	cooldowns: 5
};

module.exports.handleReaction = async ({ event, api, Threads, handleReaction }) => {
	try {
		// Ensure only the original author can confirm by reaction
		if (String(event.userID) !== String(handleReaction.author)) return;

		switch (handleReaction.type) {
			case "ban": {
				const threadObj = (await Threads.getData(String(handleReaction.target))) || {};
				const data = threadObj.data || {};
				data.banned = 1;
				await Threads.setData(handleReaction.target, { data });
				if (!global.data) global.data = {};
				if (!global.data.threadBanned) global.data.threadBanned = new Map();
				global.data.threadBanned.set(parseInt(handleReaction.target), 1);
				api.sendMessage(`[${handleReaction.target}] 𝑺𝒂𝒇𝒂𝒍𝒍𝒚 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!`, event.threadID, () => {
					try { api.unsendMessage(handleReaction.messageID); } catch(e) {}
				});
				break;
			}
			case "unban": {
				const threadObj = (await Threads.getData(String(handleReaction.target))) || {};
				const data = threadObj.data || {};
				data.banned = 0;
				await Threads.setData(handleReaction.target, { data });
				if (global.data && global.data.threadBanned) global.data.threadBanned.delete(parseInt(handleReaction.target));
				api.sendMessage(`[${handleReaction.target}] 𝑺𝒂𝒇𝒂𝒍𝒍𝒚 𝒖𝒏𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆`, event.threadID, () => {
					try { api.unsendMessage(handleReaction.messageID); } catch(e) {}
				});
				break;
			}
			default:
				break;
		}
	} catch (err) {
		console.error(err);
	}
};

module.exports.run = async ({ event, api, args, Threads }) => {
	const name = module.exports.config.name;
	try {
		if (!args || args.length === 0) return global.utils.throwError(name, event.threadID, event.messageID);

		const action = String(args[0]).toLowerCase();
		const content = args.slice(1);

		switch (action) {
			case "ban": {
				if (content.length == 0) return api.sendMessage("𝑨𝒑𝒏𝒊 𝒃𝒂𝒏 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒐𝒏 𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝑰𝑫 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆!", event.threadID);

				for (let idThreadRaw of content) {
					const idThread = parseInt(idThreadRaw);
					if (isNaN(idThread)) {
						await api.sendMessage(`[${idThreadRaw}] 𝑰𝑫𝒕𝒉𝒓𝒆𝒂𝒅 𝒏𝒐𝒚!`, event.threadID);
						continue;
					}

					const threadObj = await Threads.getData(String(idThread));
					if (!threadObj) {
						await api.sendMessage(`[${idThread}] 𝑫𝒂𝒕𝒂𝒃𝒂𝒔𝒆 𝒆 𝒆𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒏𝒆𝒊!`, event.threadID);
						continue;
					}

					const data = threadObj.data || {};
					if (data.banned) {
						await api.sendMessage(`[${idThread}] 𝑨𝒈𝒆𝒊 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆`, event.threadID);
						continue;
					}

					// Ask for reaction confirmation to ban
					await api.sendMessage(
						`[${idThread}] 𝑨𝒑𝒏𝒊 𝒌𝒊 𝒆𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒕𝒂 𝒃𝒂𝒏 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒐𝒏?\n\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒂𝒄𝒕 𝒌𝒐𝒓𝒆 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐!`,
						event.threadID,
						(error, info) => {
							try {
								if (!global.client) global.client = {};
								if (!global.client.handleReaction) global.client.handleReaction = [];
								global.client.handleReaction.push({
									name: name,
									messageID: info.messageID,
									author: event.senderID,
									type: "ban",
									target: idThread
								});
							} catch (e) { console.error(e); }
						}
					);
				}
				break;
			}
			case "unban": {
				if (content.length == 0) return api.sendMessage("𝑨𝒑𝒏𝒊 𝒖𝒏𝒃𝒂𝒏 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒐𝒏 𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝑰𝑫 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆!", event.threadID);

				for (let idThreadRaw of content) {
					const idThread = parseInt(idThreadRaw);
					if (isNaN(idThread)) {
						await api.sendMessage(`[${idThreadRaw}] 𝑰𝑫𝒕𝒉𝒓𝒆𝒂𝒅 𝒏𝒐𝒚!`, event.threadID);
						continue;
					}

					const threadObj = await Threads.getData(String(idThread));
					if (!threadObj) {
						await api.sendMessage(`[${idThread}] 𝑫𝒂𝒕𝒂𝒃𝒂𝒔𝒆 𝒆 𝒆𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒏𝒆𝒊!`, event.threadID);
						continue;
					}

					const data = threadObj.data || {};
					if (data.banned != 1) {
						await api.sendMessage(`[${idThread}] 𝑨𝒈𝒆 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒏𝒊`, event.threadID);
						continue;
					}

					// Ask for reaction confirmation to unban
					await api.sendMessage(
						`[${idThread}] 𝑨𝒑𝒏𝒊 𝒌𝒊 𝒆𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒕𝒂 𝒖𝒏𝒃𝒂𝒏 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒐𝒏?\n\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒂𝒄𝒕 𝒌𝒐𝒓𝒆 𝒖𝒏𝒃𝒂𝒏 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐!`,
						event.threadID,
						(error, info) => {
							try {
								if (!global.client) global.client = {};
								if (!global.client.handleReaction) global.client.handleReaction = [];
								global.client.handleReaction.push({
									name: name,
									messageID: info.messageID,
									author: event.senderID,
									type: "unban",
									target: idThread
								});
							} catch (e) { console.error(e); }
						}
					);
				}
				break;
			}
			case "search": {
				if (content.length === 0) return api.sendMessage("𝑨𝒑𝒏𝒂𝒓 𝒔𝒆𝒂𝒓𝒄𝒉 𝒕𝒆𝒙𝒕 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆!", event.threadID);
				const contentJoin = content.join(" ");
				const all = await Threads.getAll(['threadID', 'name']);
				const getThreads = (all || []).filter(item => !!item.name);
				let matchThreads = [];
				getThreads.forEach(i => {
					if (i.name && i.name.toLowerCase().includes(contentJoin.toLowerCase())) {
						matchThreads.push({
							name: i.name,
							id: i.threadID
						});
					}
				});
				if (matchThreads.length === 0) return api.sendMessage("𝑨𝒑𝒏𝒂𝒓 𝒔𝒆𝒂𝒓𝒄𝒉 𝒆𝒓 𝒌𝒐𝒏𝒐 𝒓𝒆𝒔𝒖𝒍𝒕 𝒏𝒆𝒊!", event.threadID);
				let a = "", b = 0;
				matchThreads.forEach(i => a += `\n${++b}. ${i.name} - ${i.id}`);
				return api.sendMessage(`𝒀𝒐𝒖𝒓 𝒔𝒆𝒂𝒓𝒄𝒉 𝒓𝒆𝒔𝒖𝒍𝒕: \n${a}`, event.threadID);
			}
			default: {
				return global.utils.throwError(name, event.threadID, event.messageID);
			}
		}
	} catch (err) {
		console.error(err);
		return api.sendMessage(`Error: ${err.message || err}`, event.threadID);
	}
};
