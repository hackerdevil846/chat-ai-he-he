const sleep = (ms) => new Promise(res => setTimeout(res, ms));

module.exports.config = {
	name: "filteruser",
	version: "1.6",
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Filter group members by message count or locked accounts",
	category: "box chat",
	usages: "[<number> | die]",
	cooldowns: 5
};

module.exports.languages = {
	vi: {
		needAdmin: "⚠️ | Vui lòng thêm bot làm quản trị viên của box để sử dụng lệnh này",
		confirm: "⚠️ | Bạn có chắc chắn muốn xóa thành viên nhóm có số tin nhắn nhỏ hơn %1 không?\nThả cảm xúc bất kì vào tin nhắn này để xác nhận",
		kickByBlock: "✅ | Đã xóa thành công %1 thành viên bị khóa acc 🔒",
		kickByMsg: "✅ | Đã xóa thành công %1 thành viên có số tin nhắn nhỏ hơn %2 📊",
		kickError: "❌ | Đã xảy ra lỗi không thể kick %1 thành viên:\n%2",
		noBlock: "✅ | Không có thành viên nào bị khóa acc 🔍",
		noMsg: "✅ | Không có thành viên nào có số tin nhắn nhỏ hơn %1 📊",
		usage: "❗️ | Cách dùng: {pn} [<số tin nhắn> | die]"
	},
	en: {
		needAdmin: "⚠️ | Please add the bot as a group admin to use this command",
		confirm: "⚠️ | Are you sure you want to delete group members with less than %1 messages?\nReact to this message to confirm",
		kickByBlock: "✅ | Successfully removed %1 members with locked accounts 🔒",
		kickByMsg: "✅ | Successfully removed %1 members with less than %2 messages 📊",
		kickError: "❌ | Failed to remove %1 members:\n%2",
		noBlock: "✅ | No members with locked accounts found 🔍",
		noMsg: "✅ | No members with less than %1 messages found 📊",
		usage: "❗️ | Usage: {pn} [<number> | die]"
	}
};

// ensure loader happy
module.exports.onStart = async function () {
	if (!global.GoatBot) global.GoatBot = {};
	if (!global.GoatBot.onReaction) global.GoatBot.onReaction = new Map();
};

module.exports.run = async function ({ api, event, args, Threads, message, getLang }) {
	const threadID = event.threadID;
	const threadData = await Threads.get(threadID);
	// require bot admin in thread
	if (!threadData.adminIDs.includes(api.getCurrentUserID()))
		return (message && message.reply) ? message.reply(getLang("needAdmin")) : api.sendMessage(getLang("needAdmin"), threadID);

	// helper to send messages compatible with different frameworks
	const reply = (text, cb) => {
		if (message && typeof message.reply === "function") return message.reply(text, cb);
		return api.sendMessage(text, threadID, cb);
	};

	if (!args[0]) return reply(getLang("usage"));

	// confirm removal by message count
	if (!isNaN(args[0])) {
		return reply(getLang("confirm", args[0]), (err, info) => {
			global.GoatBot.onReaction.set(info.messageID, {
				author: event.senderID,
				messageID: info.messageID,
				minimum: Number(args[0]),
				commandName: this.config.name
			});
		});
	}

	// remove blocked (die)
	if (args[0] === "die") {
		const threadInfo = await api.getThreadInfo(threadID);
		const membersBlocked = threadInfo.userInfo.filter(u => u.type !== "User");
		const errors = [], success = [];

		for (const user of membersBlocked) {
			if (user.type !== "User" && !threadData.adminIDs.some(id => id == user.id)) {
				try {
					await api.removeUserFromGroup(user.id, threadID);
					success.push(user.id);
				} catch (e) {
					errors.push(user.name || user.id);
				}
				await sleep(700);
			}
		}

		let msg = "";
		if (success.length) msg += `${getLang("kickByBlock", success.length)}\n`;
		if (errors.length) msg += `${getLang("kickError", errors.length, errors.join("\n"))}\n`;
		if (!msg) msg = getLang("noBlock");
		return reply(msg);
	}

	// fallback
	return reply(getLang("usage"));
};

module.exports.handleReaction = async function ({ api, event, Reaction, Threads, message, getLang }) {
	try {
		const { minimum = 1, author } = Reaction;
		if (event.userID != author) return;

		const threadID = event.threadID;
		const threadData = await Threads.get(threadID);
		const botID = api.getCurrentUserID();

		const membersCountLess = (threadData.members || []).filter(m =>
			(m.count || 0) < minimum &&
			m.inGroup === true &&
			m.userID != botID &&
			!threadData.adminIDs.some(id => id == m.userID)
		);

		const errors = [], success = [];
		for (const member of membersCountLess) {
			try {
				await api.removeUserFromGroup(member.userID, threadID);
				success.push(member.userID);
			} catch (e) {
				errors.push(member.name || member.userID);
			}
			await sleep(700);
		}

		const reply = (text) => {
			if (message && typeof message.reply === "function") return message.reply(text);
			return api.sendMessage(text, threadID);
		};

		let msg = "";
		if (success.length) msg += `${getLang("kickByMsg", success.length, minimum)}\n`;
		if (errors.length) msg += `${getLang("kickError", errors.length, errors.join("\n"))}\n`;
		if (!msg) msg = getLang("noMsg", minimum);
		return reply(msg);
	} catch (err) {
		// silent fail to avoid breaking loader
		console.error(err);
	}
};
