module.exports.config = {
	name: "group",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑮𝒓𝒐𝒖𝒑 𝒎𝒂𝒏𝒂𝒈𝒆𝒎𝒆𝒏𝒕 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔",
	commandCategory: "box",
	usages: "[name/emoji/admin/image/info]",
	cooldowns: 1,
	dependencies: {
		"request": "",
		"fs-extra": ""
	}
};

module.exports.run = async ({ api, event, args }) => {
	const fs = global.nodemodule["fs-extra"];
	const request = global.nodemodule["request"];
	
	if (!args[0]) return api.sendMessage(`╭───• 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨 •───╮
│
├─❏ 𝗻𝗮𝗺𝗲 ➺  𝗚𝗿𝗼𝘂𝗽 𝗻𝗮𝗺𝗲 𝗰𝗵𝗮𝗻𝗴𝗲
├─❏ 𝗲𝗺𝗼𝗷𝗶 ➺  𝗚𝗿𝗼𝘂𝗽 𝗲𝗺𝗼𝗷𝗶 𝘂𝗽𝗱𝗮𝘁𝗲
├─❏ 𝗶𝗺𝗮𝗴𝗲 ➺  𝗚𝗿𝗼𝘂𝗽 𝗶𝗺𝗮𝗴𝗲 𝘀𝗲𝘁
├─❏ 𝗮𝗱𝗺𝗶𝗻 ➺  𝗔𝗱𝗺𝗶𝗻 𝗺𝗮𝗻𝗮𝗴𝗲𝗺𝗲𝗻𝘁
├─❏ 𝗶𝗻𝗳𝗼 ➺  𝗚𝗿𝗼𝘂𝗽 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻
│
╰─────────────⧕☬⧕──────────╯`, event.threadID);

	// Group name change
	if (args[0] === "name") {
		const newName = args.slice(1).join(" ") || event.messageReply?.body;
		if (!newName) return api.sendMessage("❌ 𝗡𝗮𝗺𝗲 𝗱𝗶𝗹𝗲 𝗵𝗼𝗯𝗲𝗻", event.threadID);
		api.setTitle(newName, event.threadID, () => 
			api.sendMessage(`✅ 𝗦𝗮𝗳𝗮𝗹𝗹𝘆 𝗰𝗵𝗮𝗻𝗴𝗲𝗱 𝗴𝗿𝗼𝘂𝗽 𝗻𝗮𝗺𝗲:\n"${newName}"`, event.threadID)
		);
	}

	// Group emoji change
	else if (args[0] === "emoji") {
		const emoji = args[1] || event.messageReply?.body;
		if (!emoji) return api.sendMessage("❌ 𝗘𝗺𝗼𝗷𝗶 𝗱𝗶𝗹𝗲 𝗵𝗼𝗯𝗲𝗻", event.threadID);
		api.changeThreadEmoji(emoji, event.threadID, () => 
			api.sendMessage(`✅ 𝗘𝗺𝗼𝗷𝗶 𝗽𝗮𝗿𝗶𝗯𝗮𝗿𝘁𝗼𝗻 𝗵𝗼𝗹𝗼: ${emoji}`, event.threadID)
		);
	}

	// Admin management
	else if (args[0] === "admin") {
		const threadInfo = await api.getThreadInfo(event.threadID);
		const isBotAdmin = threadInfo.adminIDs.some(admin => admin.id === api.getCurrentUserID());
		const isUserAdmin = threadInfo.adminIDs.some(admin => admin.id === event.senderID);
		
		let targetID;
		if (Object.keys(event.mentions).length > 0) {
			targetID = Object.keys(event.mentions)[0];
		} else if (event.messageReply) {
			targetID = event.messageReply.senderID;
		} else if (args[1]) {
			targetID = args[1];
		}
		
		if (!targetID) return api.sendMessage("❌ 𝗨𝘀𝗲𝗿 𝗺𝗲𝗻𝘁𝗶𝗼𝗻 𝗼𝗿 𝗿𝗲𝗽𝗹𝘆 𝗸𝗼𝗿𝘂𝗻", event.threadID);
		if (!isUserAdmin) return api.sendMessage("❌ 𝗔𝗽𝗻𝗶 𝗴𝗿𝗼𝘂𝗽 𝗮𝗱𝗺𝗶𝗻 𝗻𝗮𝗻", event.threadID);
		if (!isBotAdmin) return api.sendMessage("❌ 𝗕𝗼𝘁𝗸𝗲 𝗮𝗱𝗺𝗶𝗻 𝗱𝗶𝗻", event.threadID);
		
		const isTargetAdmin = threadInfo.adminIDs.some(admin => admin.id === targetID);
		api.changeAdminStatus(event.threadID, targetID, !isTargetAdmin, async (err) => {
			if (err) return api.sendMessage("❌ 𝗣𝗮𝗿𝗶𝗯𝗮𝗿𝘁𝗼𝗻 𝗸𝗼𝗿𝘁𝗲 𝗯𝗵𝘂𝗹", event.threadID);
			const name = (await api.getUserInfo(targetID))[targetID].name;
			api.sendMessage(`✅ ${isTargetAdmin ? "𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗮𝗱𝗺𝗶𝗻:" : "𝗔𝗱𝗺𝗶𝗻 𝗱𝗶𝗹𝗮𝗺:"}\n╭─• ${name}\n╰─• @${targetID}`, event.threadID);
		});
	}

	// Group image change
	else if (args[0] === "image") {
		if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
			return api.sendMessage("❌ 𝗜𝗺𝗮𝗴𝗲 𝗿𝗲𝗽𝗹𝘆 𝗸𝗼𝗿𝘂𝗻", event.threadID);
		}
		
		const imageUrl = event.messageReply.attachments[0].url;
		const callback = () => {
			api.changeGroupImage(fs.createReadStream(__dirname + "/cache/grpimg.png"), event.threadID, () => {
				fs.unlinkSync(__dirname + "/cache/grpimg.png");
				api.sendMessage("✅ 𝗚𝗿𝗼𝘂𝗽 𝗶𝗺𝗮𝗴𝗲 𝘂𝗽𝗱𝗮𝘁𝗲 𝗵𝗼𝗹𝗼", event.threadID);
			});
		};
		
		request(encodeURI(imageUrl))
			.pipe(fs.createWriteStream(__dirname + "/cache/grpimg.png"))
			.on("close", callback);
	}

	// Group information
	else if (args[0] === "info") {
		const threadInfo = await api.getThreadInfo(event.threadID);
		const { threadName, participantIDs, adminIDs, imageSrc, emoji, approvalMode, messageCount } = threadInfo;
		
		// Gender count
		const genderCount = { male: 0, female: 0 };
		for (const user of Object.values(threadInfo.userInfo)) {
			user.gender === "MALE" ? genderCount.male++ : genderCount.female++;
		}
		
		// Admin list
		let adminList = "╭───• 𝗔𝗗𝗠𝗜𝗡𝗦 •───╮\n";
		for (const admin of adminIDs) {
			const name = threadInfo.userInfo[admin.id]?.name || "𝗨𝗻𝗸𝗻𝗼𝘄𝗻";
			adminList += `├─• ${name}\n`;
		}
		adminList += "╰────────────────╯";
		
		// Approval mode status
		const approvalStatus = approvalMode ? "✅ 𝗖𝗵𝗮𝗹𝘂" : "❌ 𝗕𝗮𝗻𝗱𝗵";
		
		const msg = `╭───• 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢 •───╮
├─• 𝗡𝗮𝗺𝗲: ${threadName}
├─• 𝗜𝗗: ${event.threadID}
├─• 𝗘𝗺𝗼𝗷𝗶: ${emoji || '𝗡/𝗔'}
├─• 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${participantIDs.length} 𝗷𝗼𝗻
├─• 𝗣𝘂𝗿𝘂𝘀𝗵: ${genderCount.male} 𝗷𝗼𝗻
├─• 𝗠𝗼𝗵𝗶𝗹𝗮: ${genderCount.female} 𝗷𝗼𝗻
├─• 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗠𝗼𝗱𝗲: ${approvalStatus}
├─• 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀: ${messageCount} 𝗺𝘀𝗴
${adminList}`;
		
		const callback = () => {
			api.sendMessage({
				body: msg,
				attachment: fs.createReadStream(__dirname + "/cache/grpinfo.png")
			}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/grpinfo.png"));
		};
		
		request(encodeURI(imageSrc))
			.pipe(fs.createWriteStream(__dirname + "/cache/grpinfo.png"))
			.on("close", callback);
	}
};
