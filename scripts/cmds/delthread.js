module.exports.config = {
	name: "delthread",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🧹 𝘋𝘦𝘭𝘦𝘵𝘦𝘴 𝘢𝘭𝘭 𝘨𝘳𝘰𝘶𝘱 𝘵𝘩𝘳𝘦𝘢𝘥𝘴 𝘦𝘹𝘤𝘦𝘱𝘵 𝘤𝘶𝘳𝘳𝘦𝘯𝘵 𝘰𝘯𝘦",
	commandCategory: "𝗦𝗬𝗦𝗧𝗘𝗠",
	usages: "[]",
	cooldowns: 5,
	envConfig: {
		allowBlockedThreads: false
	}
};

module.exports.run = async function({ api, event }) {
	try {
		const threadList = await api.getThreadList(100, null, ["INBOX"]);
		const currentThread = event.threadID;
		
		const deletionPromises = threadList.map(thread => {
			if (thread.isGroup && thread.threadID !== currentThread) {
				return api.deleteThread(thread.threadID);
			}
		});

		await Promise.all(deletionPromises);
		
		api.sendMessage(`✅ | 𝘚𝘶𝘤𝘤𝘦𝘴𝘴𝘧𝘶𝘭𝘭𝘺 𝘥𝘦𝘭𝘦𝘵𝘦𝘥 𝘢𝘭𝘭 𝘨𝘳𝘰𝘶𝘱 𝘵𝘩𝘳𝘦𝘢𝘥𝘴!\n╰┄➤ 𝘌𝘹𝘤𝘭𝘶𝘥𝘦𝘥 𝘤𝘶𝘳𝘳𝘦𝘯𝘵 𝘵𝘩𝘳𝘦𝘢𝘥: ${currentThread}`, event.threadID);
		
	} catch (error) {
		console.error("❌ | 𝘋𝘦𝘭𝘦𝘵𝘪𝘰𝘯 𝘦𝘳𝘳𝘰𝘳:", error);
		api.sendMessage("❌ | 𝘈𝘯 𝘦𝘳𝘳𝘰𝘳 𝘰𝘤𝘤𝘶𝘳𝘳𝘦𝘥 𝘸𝘩𝘪𝘭𝘦 𝘥𝘦𝘭𝘦𝘵𝘪𝘯𝘨 𝘵𝘩𝘳𝘦𝘢𝘥𝘴", event.threadID);
	}
};
