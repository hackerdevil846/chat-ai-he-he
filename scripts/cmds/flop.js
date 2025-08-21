module.exports.config = {
	name: "flop",
	version: "1.0.1",
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🔄 Remove all group members and bot leaves group",
	commandCategory: "Group",
	usages: "flop",
	cooldowns: 1,
	dependencies: {},
	envConfig: {}
};

module.exports.run = async function({ api, event, Threads, Users }) {
	const { threadID, messageID } = event;
	
	try {
		const threadInfo = await api.getThreadInfo(threadID);
		const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
		const botID = api.getCurrentUserID();

		if (!adminIDs.includes(botID)) {
			return api.sendMessage(
				`❌ Bot must be group admin to use this command!`,
				threadID,
				messageID
			);
		}

		const participantIDs = threadInfo.participantIDs;
		const botID = api.getCurrentUserID();

		api.sendMessage(
			`🌀 Starting group flop operation...`,
			threadID,
			messageID
		);

		for (const userID of participantIDs) {
			if (userID !== botID) {
				await new Promise(resolve => setTimeout(resolve, 1000));
				await api.removeUserFromGroup(userID, threadID);
			}
		}

		await api.sendMessage(
			`✅ Successfully removed all members! Bot will now leave the group.`,
			threadID
		);

		await new Promise(resolve => setTimeout(resolve, 2000));
		await api.removeUserFromGroup(botID, threadID);
		
	} catch (error) {
		console.error("Flop Error:", error);
		api.sendMessage(
			`❌ Error occurred while floping group: ${error.message}`,
			threadID,
			messageID
		);
	}
};
