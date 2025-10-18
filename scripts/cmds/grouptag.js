module.exports = {
	config: {
		name: "grouptag",
		aliases: ["grtag"],
		version: "1.5",
		author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
		countDown: 5,
		role: 0,
		description: {
			en: "𝖳𝖺𝗀 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝖻𝗒 𝗀𝗋𝗈𝗎𝗉"
		},
		category: "𝗶𝗻𝗳𝗼",
		guide: {
			en: "   {pn} 𝖺𝖽𝖽 <𝗀𝗋𝗈𝗎𝗉𝖳𝖺𝗀𝖭𝖺𝗆𝖾> <@𝗍𝖺𝗀𝗌>: 𝗎𝗌𝖾 𝗍𝗈 𝖺𝖽𝖽 𝗇𝖾𝗐 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 𝗈𝗋 𝖺𝖽𝖽 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗍𝗈 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀"
				+ "\n   𝖤𝗑𝖺𝗆𝗉𝗅𝖾:"
				+ "\n    {pn} 𝖺𝖽𝖽 𝖳𝖤𝖠𝖬𝟣 @𝗍𝖺𝗀𝟣 @𝗍𝖺𝗀𝟤"
				+ "\n\n   {pn} 𝖽𝖾𝗅 <𝗀𝗋𝗈𝗎𝗉𝖳𝖺𝗀𝖭𝖺𝗆𝖾> <@𝗍𝖺𝗀𝗌>: 𝗎𝗌𝖾 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝖿𝗋𝗈𝗆 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀"
				+ "\n   𝖤𝗑𝖺𝗆𝗉𝗅𝖾:"
				+ "\n    {pn} 𝖽𝖾𝗅 𝖳𝖤𝖠𝖬𝟣 @𝗍𝖺𝗀𝟣 @𝗍𝖺𝗀𝟤"
				+ "\n\n   {pn} 𝗋𝖾𝗆𝗈𝗏𝖾 <𝗀𝗋𝗈𝗎𝗉𝖳𝖺𝗀𝖭𝖺𝗆𝖾>: 𝗎𝗌𝖾 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀"
				+ "\n   𝖤𝗑𝖺𝗆𝗉𝗅𝖾:"
				+ "\n    {pn} 𝗋𝖾𝗆𝗈𝗏𝖾 𝖳𝖤𝖠𝖬𝟣"
				+ "\n\n	 {pn} 𝗍𝖺𝗀 <𝗀𝗋𝗈𝗎𝗉𝖳𝖺𝗀𝖭𝖺𝗆𝖾>: 𝗎𝗌𝖾 𝗍𝗈 𝗍𝖺𝗀 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀"
				+ "\n\n   {pn} 𝗋𝖾𝗇𝖺𝗆𝖾 <𝗀𝗋𝗈𝗎𝗉𝖳𝖺𝗀𝖭𝖺𝗆𝖾> | <𝗇𝖾𝗐𝖦𝗋𝗈𝗎𝗉𝖳𝖺𝗀𝖭𝖺𝗆𝖾>: 𝗎𝗌𝖾 𝗍𝗈 𝗋𝖾𝗇𝖺𝗆𝖾 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀"
				+ "\n\n   {pn} [𝗅𝗂𝗌𝗍 | 𝖺𝗅𝗅]: 𝗎𝗌𝖾 𝗍𝗈 𝗏𝗂𝖾𝗐 𝗅𝗂𝗌𝗍 𝗈𝖿 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 𝗂𝗇 𝗒𝗈𝗎𝗋 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍"
				+ "\n\n   {pn} 𝗂𝗇𝖿𝗈 <𝗀𝗋𝗈𝗎𝗉𝖳𝖺𝗀𝖭𝖺𝗆𝖾>: 𝗎𝗌𝖾 𝗍𝗈 𝗏𝗂𝖾𝗐 𝗂𝗇𝖿𝗈 𝗈𝖿 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀"
		},
		dependencies: {
			"fs-extra": ""
		}
	},

	langs: {
		en: {
			noGroupTagName: "❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 𝗇𝖺𝗆𝖾",
			noMention: "❌ 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾𝗇'𝗍 𝗍𝖺𝗀𝗀𝖾𝖽 𝖺𝗇𝗒 𝗆𝖾𝗆𝖻𝖾𝗋 𝗍𝗈 𝖺𝖽𝖽 𝗍𝗈 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀",
			addedSuccess: "✅ 𝖠𝖽𝖽𝖾𝖽 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗍𝗈 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 \"%1\":\n%2",
			addedSuccess2: "✅ 𝖠𝖽𝖽𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 \"%1\" 𝗐𝗂𝗍𝗁 𝗆𝖾𝗆𝖻𝖾𝗋𝗌:\n%2",
			existedInGroupTag: "⚠️ 𝖬𝖾𝗆𝖻𝖾𝗋𝗌:\n%1\n𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖾𝗑𝗂𝗌𝗍𝖾𝖽 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 \"%2\"",
			notExistedInGroupTag: "❌ 𝖬𝖾𝗆𝖻𝖾𝗋𝗌:\n%1\n𝖽𝗈𝖾𝗌𝗇'𝗍 𝖾𝗑𝗂𝗌𝗍 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 \"%2\"",
			noExistedGroupTag: "❌ 𝖦𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 \"%1\" 𝖽𝗈𝖾𝗌𝗇'𝗍 𝖾𝗑𝗂𝗌𝗍 𝗂𝗇 𝗒𝗈𝗎𝗋 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍",
			noExistedGroupTag2: "❌ 𝖸𝗈𝗎𝗋 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍 𝗁𝖺𝗌𝗇'𝗍 𝖺𝖽𝖽𝖾𝖽 𝖺𝗇𝗒 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀",
			noMentionDel: "❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝖺𝗀 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾 𝖿𝗋𝗈𝗆 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 \"%1\"",
			deletedSuccess: "✅ 𝖣𝖾𝗅𝖾𝗍𝖾𝖽 𝗆𝖾𝗆𝖻𝖾𝗋𝗌:\n%1\n𝖿𝗋𝗈𝗆 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 \"%2\"",
			deletedSuccess2: "✅ 𝖣𝖾𝗅𝖾𝗍𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 \"%1\"",
			tagged: "🔔 𝖳𝖺𝗀 𝗀𝗋𝗈𝗎𝗉 \"%1\":\n%2",
			noGroupTagName2: "❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗈𝗅𝖽 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 𝗇𝖺𝗆𝖾 𝖺𝗇𝖽 𝗇𝖾𝗐 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 𝗇𝖺𝗆𝖾, 𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾𝖽 𝖻𝗒 \"|\"",
			renamedSuccess: "✅ 𝖱𝖾𝗇𝖺𝗆𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀 \"%1\" 𝗍𝗈 \"%2\"",
			infoGroupTag: "📑 | 𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾: %1\n👥 | 𝖭𝗎𝗆𝖻𝖾𝗋 𝗈𝖿 𝗆𝖾𝗆𝖻𝖾𝗋𝗌: %2\n👨‍👩‍👧‍👦 | 𝖫𝗂𝗌𝗍 𝗈𝖿 𝗆𝖾𝗆𝖻𝖾𝗋𝗌:\n %3",
			dataError: "❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.",
			noPermissions: "❌ 𝖨𝗇𝗌𝗎𝖿𝖿𝗂𝖼𝗂𝖾𝗇𝗍 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌."
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang, api }) {
		try {
			// Dependency check
			let fsAvailable = true;
			try {
				require("fs-extra");
			} catch (e) {
				fsAvailable = false;
			}

			if (!fsAvailable) {
				return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒: 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺");
			}

			const { threadID, mentions, senderID } = event;
			
			// Clean mentions data
			const cleanedMentions = {};
			for (const uid in mentions) {
				if (uid && mentions[uid]) {
					cleanedMentions[uid] = mentions[uid].replace("@", "").trim();
				}
			}

			// Get group tags with error handling
			let groupTags;
			try {
				groupTags = await threadsData.get(threadID, "data.groupTags") || [];
				if (!Array.isArray(groupTags)) {
					groupTags = [];
				}
			} catch (dataError) {
				console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀𝗌:", dataError);
				return message.reply(getLang("dataError"));
			}

			const command = args[0]?.toLowerCase() || "tag";

			switch (command) {
				case "add": {
					if (args.length < 2) {
						return message.reply(getLang("noGroupTagName"));
					}

					const mentionsID = Object.keys(cleanedMentions);
					if (mentionsID.length === 0) {
						return message.reply(getLang("noMention"));
					}

					// Extract group tag name (everything before the first mention)
					const content = args.slice(1).join(" ");
					let groupTagName = content;
					
					// Find the position of the first mention in the content
					for (const uid of mentionsID) {
						const mentionText = cleanedMentions[uid];
						const mentionIndex = content.indexOf(mentionText);
						if (mentionIndex !== -1) {
							groupTagName = content.substring(0, mentionIndex).trim();
							break;
						}
					}

					if (!groupTagName) {
						return message.reply(getLang("noGroupTagName"));
					}

					const existingGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
					
					if (existingGroupTag) {
						const usersExist = [];
						const usersToAdd = [];
						
						for (const uid in cleanedMentions) {
							if (existingGroupTag.users[uid]) {
								usersExist.push(cleanedMentions[uid]);
							} else {
								existingGroupTag.users[uid] = cleanedMentions[uid];
								usersToAdd.push(cleanedMentions[uid]);
							}
						}

						try {
							await threadsData.set(threadID, groupTags, "data.groupTags");
						} catch (saveError) {
							console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀𝗌:", saveError);
							return message.reply(getLang("dataError"));
						}

						let response = "";
						if (usersToAdd.length > 0) {
							response += getLang("addedSuccess", existingGroupTag.name, usersToAdd.join("\n")) + "\n";
						}
						if (usersExist.length > 0) {
							response += getLang("existedInGroupTag", usersExist.join("\n"), existingGroupTag.name);
						}
						return message.reply(response);
					} else {
						const newGroupTag = {
							name: groupTagName,
							users: { ...cleanedMentions }
						};
						groupTags.push(newGroupTag);
						
						try {
							await threadsData.set(threadID, groupTags, "data.groupTags");
						} catch (saveError) {
							console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀𝗌:", saveError);
							return message.reply(getLang("dataError"));
						}
						
						return message.reply(getLang("addedSuccess2", groupTagName, Object.values(cleanedMentions).join("\n")));
					}
				}

				case "list":
				case "all": {
					if (groupTags.length === 0) {
						return message.reply(getLang("noExistedGroupTag2"));
					}

					if (args[1]) {
						const groupTagName = args.slice(1).join(" ");
						const groupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
						if (!groupTag) {
							return message.reply(getLang("noExistedGroupTag", groupTagName));
						}
						return showInfoGroupTag(message, groupTag, getLang);
					}

					const groupList = groupTags.map(group => 
						`\n\n📌 ${group.name}:\n ${Object.values(group.users).join("\n ")}`
					).join("");
					
					return message.reply(`📋 𝖦𝗋𝗈𝗎𝗉 𝖳𝖺𝗀𝗌 𝖫𝗂𝗌𝗍:${groupList}`);
				}

				case "info": {
					if (args.length < 2) {
						return message.reply(getLang("noGroupTagName"));
					}
					
					const groupTagName = args.slice(1).join(" ");
					const groupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
					if (!groupTag) {
						return message.reply(getLang("noExistedGroupTag", groupTagName));
					}
					return showInfoGroupTag(message, groupTag, getLang);
				}

				case "del": {
					if (args.length < 2) {
						return message.reply(getLang("noGroupTagName"));
					}

					const mentionsID = Object.keys(cleanedMentions);
					if (mentionsID.length === 0) {
						const groupTagName = args.slice(1).join(" ");
						return message.reply(getLang("noMentionDel", groupTagName));
					}

					const content = args.slice(1).join(" ");
					let groupTagName = content;
					
					for (const uid of mentionsID) {
						const mentionText = cleanedMentions[uid];
						const mentionIndex = content.indexOf(mentionText);
						if (mentionIndex !== -1) {
							groupTagName = content.substring(0, mentionIndex).trim();
							break;
						}
					}

					if (!groupTagName) {
						return message.reply(getLang("noGroupTagName"));
					}

					const existingGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
					if (!existingGroupTag) {
						return message.reply(getLang("noExistedGroupTag", groupTagName));
					}

					const usersRemoved = [];
					const usersNotFound = [];
					
					for (const uid in cleanedMentions) {
						if (existingGroupTag.users[uid]) {
							delete existingGroupTag.users[uid];
							usersRemoved.push(cleanedMentions[uid]);
						} else {
							usersNotFound.push(cleanedMentions[uid]);
						}
					}

					// Remove group tag if no members left
					if (Object.keys(existingGroupTag.users).length === 0) {
						const index = groupTags.indexOf(existingGroupTag);
						if (index !== -1) {
							groupTags.splice(index, 1);
						}
					}

					try {
						await threadsData.set(threadID, groupTags, "data.groupTags");
					} catch (saveError) {
						console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀𝗌:", saveError);
						return message.reply(getLang("dataError"));
					}

					let response = "";
					if (usersRemoved.length > 0) {
						response += getLang("deletedSuccess", usersRemoved.join("\n"), groupTagName) + "\n";
					}
					if (usersNotFound.length > 0) {
						response += getLang("notExistedInGroupTag", usersNotFound.join("\n"), groupTagName);
					}
					return message.reply(response);
				}

				case "remove":
				case "rm": {
					if (args.length < 2) {
						return message.reply(getLang("noGroupTagName"));
					}

					const groupTagName = args.slice(1).join(" ").trim();
					const index = groupTags.findIndex(group => group.name.toLowerCase() === groupTagName.toLowerCase());
					
					if (index === -1) {
						return message.reply(getLang("noExistedGroupTag", groupTagName));
					}

					groupTags.splice(index, 1);
					
					try {
						await threadsData.set(threadID, groupTags, "data.groupTags");
					} catch (saveError) {
						console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀𝗌:", saveError);
						return message.reply(getLang("dataError"));
					}

					return message.reply(getLang("deletedSuccess2", groupTagName));
				}

				case "rename": {
					if (args.length < 2) {
						return message.reply(getLang("noGroupTagName2"));
					}

					const content = args.slice(1).join(" ");
					const parts = content.split("|").map(part => part.trim());
					
					if (parts.length < 2) {
						return message.reply(getLang("noGroupTagName2"));
					}

					const [oldName, newName] = parts;
					const existingGroupTag = groupTags.find(tag => tag.name.toLowerCase() === oldName.toLowerCase());
					
					if (!existingGroupTag) {
						return message.reply(getLang("noExistedGroupTag", oldName));
					}

					existingGroupTag.name = newName;
					
					try {
						await threadsData.set(threadID, groupTags, "data.groupTags");
					} catch (saveError) {
						console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗍𝖺𝗀𝗌:", saveError);
						return message.reply(getLang("dataError"));
					}

					return message.reply(getLang("renamedSuccess", oldName, newName));
				}

				case "tag":
				default: {
					if (args.length < (command === "tag" ? 2 : 1)) {
						return message.reply(getLang("noGroupTagName"));
					}

					const startIndex = command === "tag" ? 1 : 0;
					const groupTagName = args.slice(startIndex).join(" ").trim();
					const existingGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
					
					if (!existingGroupTag) {
						return message.reply(getLang("noExistedGroupTag", groupTagName));
					}

					const { users } = existingGroupTag;
					const mentionsList = [];
					let messageText = "";
					
					for (const uid in users) {
						const userName = users[uid];
						mentionsList.push({
							id: uid,
							tag: userName
						});
						messageText += `• ${userName}\n`;
					}

					return message.reply({
						body: getLang("tagged", existingGroupTag.name, messageText),
						mentions: mentionsList
					});
				}
			}

		} catch (error) {
			console.error("💥 𝖦𝗋𝗈𝗎𝗉𝖳𝖺𝗀 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
			return message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
		}
	}
};

function showInfoGroupTag(message, groupTag, getLang) {
	const memberList = Object.values(groupTag.users).map(name => `• ${name}`).join("\n ");
	return message.reply(getLang("infoGroupTag", groupTag.name, Object.keys(groupTag.users).length, memberList));
}
