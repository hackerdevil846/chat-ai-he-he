module.exports.config = {
	name: "group",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑮𝒓𝒐𝒖𝒑 𝒎𝒂𝒏𝒂𝒈𝒆𝒎𝒆𝒏𝒕 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔",
	category: "box",
	usages: "[name/emoji/admin/image/info]",
	cooldowns: 1,
	dependencies: {
		"request": "",
		"fs-extra": ""
	}
};

module.exports.onLoad = async function () {
	const fs = global.nodemodule["fs-extra"];
	const dir = __dirname + "/cache";
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

module.exports.run = async function ({ api, event, args, permssion }) {
	const fs = global.nodemodule["fs-extra"];
	const request = global.nodemodule["request"];

	try {
		// help menu shown when no args
		if (!args[0]) {
			const helpMsg =
`╭───• 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨 •───╮
│
├─❏ 𝗻𝗮𝗺𝗲 ➺  𝗚𝗿𝗼𝘂𝗽 𝗻𝗮𝗺𝗲 𝗰𝗵𝗮𝗻𝗴𝗲
├─❏ 𝗲𝗺𝗼𝗷𝗶 ➺  𝗚𝗿𝗼𝘂𝗽 𝗲𝗺𝗼𝗷𝗶 𝘂𝗽𝗱𝗮𝘁𝗲
├─❏ 𝗶𝗺𝗮𝗴𝗲 ➺  𝗚𝗿𝗼𝘂𝗽 𝗶𝗺𝗮𝗴𝗲 𝘀𝗲𝘁
├─❏ 𝗮𝗱𝗺𝗶𝗻 ➺  𝗔𝗱𝗺𝗶𝗻 𝗺𝗮𝗻𝗮𝗴𝗲𝗺𝗲𝗻𝘁
├─❏ 𝗶𝗻𝗳𝗼 ➺  𝗚𝗿𝗼𝘂𝗽 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻
│
╰─────────────⧕☬⧕──────────╯`;
			return api.sendMessage(helpMsg, event.threadID);
		}

		// ---------- group name ----------
		if (args[0].toLowerCase() === "name") {
			const newName = args.slice(1).join(" ") || (event.messageReply && event.messageReply.body);
			if (!newName) return api.sendMessage("❌ 𝗡𝗮𝗺𝗲 𝗱𝗶𝗹𝗲 𝗵𝗼𝗯𝗲𝗻", event.threadID);
			return api.setTitle(newName, event.threadID, () => {
				return api.sendMessage(`✅ 𝗦𝗮𝗳𝗮𝗹𝗹𝘆 𝗰𝗵𝗮𝗻𝗴𝗲𝗱 𝗴𝗿𝗼𝘂𝗽 𝗻𝗮𝗺𝗲:\n"${newName}"`, event.threadID);
			});
		}

		// ---------- group emoji ----------
		else if (args[0].toLowerCase() === "emoji") {
			const emoji = args[1] || (event.messageReply && event.messageReply.body);
			if (!emoji) return api.sendMessage("❌ 𝗘𝗺𝗼𝗷𝗶 𝗱𝗶𝗹𝗲 𝗵𝗼𝗯𝗲𝗻", event.threadID);
			return api.changeThreadEmoji(emoji, event.threadID, () => {
				return api.sendMessage(`✅ 𝗘𝗺𝗼𝗷𝗶 𝗽𝗮𝗿𝗶𝗯𝗮𝗿𝘁𝗼𝗻 𝗵𝗼𝗹𝗼: ${emoji}`, event.threadID);
			});
		}

		// ---------- admin management ----------
		else if (args[0].toLowerCase() === "admin") {
			const threadInfo = await api.getThreadInfo(event.threadID);
			const adminIDs = threadInfo.adminIDs || [];
			const botID = api.getCurrentUserID();
			const isBotAdmin = adminIDs.some(ad => ad.id == botID);
			const isUserAdmin = adminIDs.some(ad => ad.id == event.senderID);

			// resolve target ID: mention > reply > arg
			let targetID;
			const mentions = event.mentions || {};
			if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
			else if (event.messageReply) targetID = event.messageReply.senderID;
			else if (args[1]) targetID = args[1];

			if (!targetID) return api.sendMessage("❌ 𝗨𝘀𝗲𝗿 𝗺𝗲𝗻𝘁𝗶𝗼𝗻 𝗼𝗿 𝗿𝗲𝗽𝗹𝘆 𝗸𝗼𝗿𝘂𝗻", event.threadID);
			if (!isUserAdmin) return api.sendMessage("❌ 𝗔𝗽𝗻𝗶 𝗴𝗿𝗼𝘂𝗽 𝗮𝗱𝗺𝗶𝗻 𝗻𝗮𝗻", event.threadID);
			if (!isBotAdmin) return api.sendMessage("❌ 𝗕𝗼𝘁𝗸𝗲 𝗮𝗱𝗺𝗶𝗻 𝗱𝗶𝗻", event.threadID);

			const isTargetAdmin = adminIDs.some(ad => ad.id == targetID);
			return api.changeAdminStatus(event.threadID, targetID, !isTargetAdmin, async (err) => {
				if (err) {
					console.error(err);
					return api.sendMessage("❌ 𝗣𝗮𝗿𝗶𝗯𝗮𝗿𝘁𝗼𝗻 𝗸𝗼𝗿𝘁𝗲 𝗯𝗵𝘂𝗹", event.threadID);
				}
				const userInfo = await api.getUserInfo(targetID);
				const name = (userInfo && userInfo[targetID] && userInfo[targetID].name) ? userInfo[targetID].name : "𝗨𝗻𝗸𝗻𝗼𝘄𝗻";
				const actionText = isTargetAdmin ? "𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗮𝗱𝗺𝗶𝗻:" : "𝗔𝗱𝗺𝗶𝗻 𝗱𝗶𝗹𝗮𝗮𝗺:";
				return api.sendMessage(`✅ ${actionText}\n╭─• ${name}\n╰─• @${targetID}`, event.threadID);
			});
		}

		// ---------- group image ----------
		else if (args[0].toLowerCase() === "image") {
			if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
				return api.sendMessage("❌ 𝗜𝗺𝗮𝗴𝗲 𝗿𝗲𝗽𝗹𝘆 𝗸𝗼𝗿𝘂𝗻", event.threadID);
			}

			const imageUrl = event.messageReply.attachments[0].url;
			const cachePath = __dirname + "/cache/grpimg.png";

			const downloadAndChange = () => {
				request(encodeURI(imageUrl))
					.pipe(fs.createWriteStream(cachePath))
					.on("close", () => {
						api.changeGroupImage(fs.createReadStream(cachePath), event.threadID, (err) => {
							try { if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath); } catch (e) { /* ignore */ }
							if (err) {
								console.error(err);
								return api.sendMessage("❌ 𝗜𝗺𝗮𝗴𝗲 𝗽𝗮𝗿𝗶𝗯𝗮𝗿𝘁𝗼𝗻 𝗵𝗼𝗹𝗼𝗻𝗮", event.threadID);
							}
							return api.sendMessage("✅ 𝗚𝗿𝗼𝘂𝗽 𝗶𝗺𝗮𝗴𝗲 𝘂𝗽𝗱𝗮𝘁𝗲 𝗵𝗼𝗹𝗼", event.threadID);
						});
					})
					.on("error", (err) => {
						console.error(err);
						return api.sendMessage("❌ 𝗜𝗺𝗮𝗴𝗲 𝗱𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗲𝗿𝗿𝗼𝗿", event.threadID);
					});
			};

			return downloadAndChange();
		}

		// ---------- group info ----------
		else if (args[0].toLowerCase() === "info") {
			const threadInfo = await api.getThreadInfo(event.threadID);
			const threadName = threadInfo.threadName || "𝗡/𝗔";
			const participantIDs = threadInfo.participantIDs || [];
			const adminIDs = threadInfo.adminIDs || [];
			const imageSrc = threadInfo.imageSrc || "";
			const emoji = threadInfo.emoji || "𝗡/𝗔";
			const approvalMode = threadInfo.approvalMode || false;
			const messageCount = threadInfo.messageCount || 0;

			// Gender count (best-effort; some frameworks don't provide gender)
			let genderCount = { male: 0, female: 0 };
			if (threadInfo.userInfo) {
				for (const uid in threadInfo.userInfo) {
					const user = threadInfo.userInfo[uid];
					if (user && user.gender) {
						if (user.gender === "MALE") genderCount.male++;
						else if (user.gender === "FEMALE") genderCount.female++;
					}
				}
			}

			// Admin list display
			let adminList = "╭───• 𝗔𝗗𝗠𝗜𝗡𝗦 •───╮\n";
			for (const admin of adminIDs) {
				const name = (threadInfo.userInfo && threadInfo.userInfo[admin.id] && threadInfo.userInfo[admin.id].name) ? threadInfo.userInfo[admin.id].name : "𝗨𝗻𝗸𝗻𝗼𝘄𝗻";
				adminList += `├─• ${name}\n`;
			}
			adminList += "╰────────────────╯";

			const approvalStatus = approvalMode ? "✅ 𝗖𝗵𝗮𝗹𝘂" : "❌ 𝗕𝗮𝗻𝗱𝗵";

			const msg =
`╭───• 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢 •───╮
├─• 𝗡𝗮𝗺𝗲: ${threadName}
├─• 𝗜𝗗: ${event.threadID}
├─• 𝗘𝗺𝗼𝗷𝗶: ${emoji}
├─• 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${participantIDs.length} 𝗜𝗧
├─• 𝗣𝘂𝗿𝘂𝘀𝗵: ${genderCount.male}
├─• 𝗠𝗼𝗵𝗶𝗹𝗮: ${genderCount.female}
├─• 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗠𝗼𝗱𝗲: ${approvalStatus}
├─• 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀: ${messageCount}
${adminList}`;

			// try to fetch group image and send with it (if exists)
			const cachePath = __dirname + "/cache/grpinfo.png";
			if (imageSrc) {
				return request(encodeURI(imageSrc))
					.pipe(fs.createWriteStream(cachePath))
					.on("close", () => {
						api.sendMessage({ body: msg, attachment: fs.createReadStream(cachePath) }, event.threadID, () => {
							try { if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath); } catch (e) { /* ignore */ }
						});
					})
					.on("error", () => {
						// if image download fails, just send text info
						return api.sendMessage(msg, event.threadID);
					});
			} else {
				return api.sendMessage(msg, event.threadID);
			}
		}

		// unknown subcommand
		else {
			return api.sendMessage("❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗼𝗽𝘁𝗶𝗼𝗻। 𝗗𝗼𝗻'𝘁 𝗳𝗼𝗿𝗴𝗲𝘁: name | emoji | admin | image | info", event.threadID);
		}
	} catch (error) {
		console.error("Error in group command:", error);
		return api.sendMessage("❌ 𝗘𝗿𝗿𝗼𝗿: 𝗘𝗯𝗮𝗿 𝗮𝗽𝗻𝗮 𝗰𝗵𝗲𝗸 𝗸𝗼𝗿𝗲 𝗱𝗲𝗸𝗵𝗶𝗻", event.threadID);
	}
};
