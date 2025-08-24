module.exports.config = {
	name: "user",
	version: "1.0.5",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Ban or unblock users",
	category: "system",
	usages: "[unban/ban/search/banCommand/unbanCommand/list/info] [ID or mention]",
	cooldowns: 5
};

module.exports.languages = {
	"vi": {
		"reason": "Lý do",
		"at": "vào lúc",
		"allCommand": "toàn bộ lệnh",
		"commandList": "những lệnh",
		"banSuccess": "[ Ban User ] Đã xử lý thành công yêu cầu cấm người dùng: %1",
		"unbanSuccess": "[ Unban User ] Đã xử lý thành công yêu cầu gỡ cấm người dùng %1",
		"banCommandSuccess": "[ banCommand User ] Đã xử lý thành công yêu cầu cấm lệnh đối với người dùng: %1",
		"unbanCommandSuccess": "[ UnbanCommand User ] Đã xử lý thành công yêu cầu gỡ cấm %1 đối với người dùng: %2",
		"errorReponse": "%1 Không thể hoàn tất công việc bạn yêu cầu",
		"IDNotFound": "%1 ID người dùng bạn nhập không tồn tại trong cơ sở dữ liệu",
		"existBan": "[ Ban User ] Người dùng %1 đã bị ban từ trước %2 %3",
		"notExistBan": "[ Unban User ] Người dùng bạn nhập chưa từng bị cấm sử dụng bot",
		"missingCommandInput": "%1 Phần command cần cấm không được để trống!",
		"notExistBanCommand": "[ UnbanCommand User ] Hiện tại ID người dùng bạn nhập chưa từng bị cấm sử dụng lệnh",

		"returnBan": "[ Ban User ] Hiện tại bạn đang yêu cầu cấm người dùng:\n- ID và tên người dùng cần cấm: %1%2\n\n❮ Reaction tin nhắn này để xác thực ❯",
		"returnUnban": "[ Unban User ] Hiện tại bạn đang yêu cầu gỡ cấm người dùng:\n- ID và tên người dùng cần gỡ cấm: %1\n\n❮ Reaction tin nhắn này để xác thực ❯",
		"returnBanCommand": "[ banCommand User ] Hiện tại bạn đang yêu cầu cấm sử dụng lệnh đối với người dùng:\n - ID và tên người dùng cần cấm: %1\n- Các lệnh cần cấm: %2\n\n❮ Reaction tin nhắn này để xác thực ❯",
		"returnUnbanCommand": "[ UnbanCommand User ] Hiện tại bạn đang yêu cầu gỡ cấm sử dụng lệnh đối với với người dùng:\n - ID và tên người dùng cần gỡ cấm lệnh: %1\n- Các lệnh cần gỡ cấm: %2\n\n❮ Reaction tin nhắn này để xác thực ❯",
	
		"returnResult": "Đây là kết quả phù hợp: \n",
		"returnNull": "Không tìm thấy kết quả dựa vào tìm kiếm của bạn!",
		"returnList": "[ User List ]\nHiện tại đang có %1 người dùng bị ban, dưới đây là %2 người dùng\n\n%3",
		"returnInfo": "[ Info User ] Đây là một số thông tin về người dùng bạn cần tìm:\n- ID và tên của người dùng: %1\n- Có bị ban?: %2 %3 %4\n- Bị ban lệnh?: %5"
	},
	"en": {
		"reason": "Reason",
		"at": "at",
		"allCommand": "all commands",
		"commandList": "Commands",
		"banSuccess": "[ Ban User ] Successfully banned user: %1",
		"unbanSuccess": "[ Unban User ] Successfully unbanned user %1",
		"banCommandSuccess": "[ banCommand User ] Successfully banned commands for user: %1",
		"unbanCommandSuccess": "[ UnbanCommand User ] Successfully unbanned %1 for user: %2",
		"errorReponse": "%1 Could not complete your request",
		"IDNotFound": "%1 The user ID you entered does not exist in the database",
		"existBan": "[ Ban User ] User %1 has been banned before %2 %3",
		"notExistBan": "[ Unban User ] The user you entered has never been banned from using the bot",
		"missingCommandInput": "%1 The command field to ban cannot be empty!",
		"notExistBanCommand": "[ UnbanCommand User ] The user ID you entered has never been command-banned",

		"returnBan": "[ Ban User ] You are requesting to ban a user:\n- ID and name of the user to ban: %1%2\n\n❮ React to this message to confirm ❯",
		"returnUnban": "[ Unban User ] You are requesting to unban a user:\n- ID and name of the user to unban: %1\n\n❮ React to this message to confirm ❯",
		"returnBanCommand": "[ banCommand User ] You are requesting to ban commands for a user:\n - ID and name of the user: %1\n- Commands to ban: %2\n\n❮ React to this message to confirm ❯",
		"returnUnbanCommand": "[ UnbanCommand User ] You are requesting to unban commands for a user:\n - ID and name of the user: %1\n- Commands to unban: %2\n\n❮ React to this message to confirm ❯",
	
		"returnResult": "Here are the matching results: \n",
		"returnNull": "No results found based on your search!",
		"returnList": "[ User List ]\nThere are currently %1 banned users, here are %2 of them:\n\n%3",
		"returnInfo": "[ Info User ] Here is some information about the user you are looking for:\n- User ID and name: %1\n- Is banned?: %2 %3 %4\n- Command banned?: %5"
	}
};

module.exports.handleReaction = async ({ event, api, Users, handleReaction, getText }) => {
	if (parseInt(event.userID) !== parseInt(handleReaction.author)) return;
	const moment = require("moment-timezone");
	const { threadID } = event;
	const { messageID, type, targetID, reason, commandNeedBan, nameTarget } = handleReaction;
	
	const time = moment.tz("Asia/Kolkata").format("HH:mm:ss L");
	
	switch (type) {
		case "ban": {
			try {
				let data = (await Users.getData(targetID)).data || {};
				data.banned = true;
				data.reason = reason || null;
				data.dateAdded = time;
				await Users.setData(targetID, { data });
				global.data.userBanned.set(targetID, { reason: data.reason, dateAdded: data.dateAdded });
				api.unsendMessage(messageID);
				return api.sendMessage(getText("banSuccess", `${targetID} - ${nameTarget}`), threadID);
			} catch { return api.sendMessage(getText("errorReponse", "[ Ban User ]"), threadID) };
		}

		case "unban": {
			try {
				let data = (await Users.getData(targetID)).data || {};
				data.banned = false;
				data.reason = null;
				data.dateAdded = null;
				await Users.setData(targetID, { data });
				global.data.userBanned.delete(targetID);
				api.unsendMessage(messageID);
				return api.sendMessage(getText("unbanSuccess", `${targetID} - ${nameTarget}`), threadID);
			} catch { return api.sendMessage(getText("errorReponse", "[ Unban User ]"), threadID) };
		}

		case "banCommand": {
			try {	
				let data = (await Users.getData(targetID)).data || {};
				data.commandBanned = [...(data.commandBanned || []), ...commandNeedBan];
				await Users.setData(targetID, { data });
				global.data.commandBanned.set(targetID, data.commandBanned);
				api.unsendMessage(messageID);
				return api.sendMessage(getText("banCommandSuccess", `${targetID} - ${nameTarget}`), threadID);
			} catch (e) { return api.sendMessage(getText("errorReponse", "[ banCommand User ]"), threadID) };
		}

		case "unbanCommand": {
			try {
				let data = (await Users.getData(targetID)).data || {};
				data.commandBanned = (data.commandBanned || []).filter(item => !commandNeedBan.includes(item));
				await Users.setData(targetID, { data });
				global.data.commandBanned.set(targetID, data.commandBanned);
				if(data.commandBanned.length == 0) global.data.commandBanned.delete(targetID);
				api.unsendMessage(messageID);
				return api.sendMessage(getText("unbanCommandSuccess", ((data.commandBanned.length == 0) ? getText("allCommand") : `${getText("commandList")}: ${commandNeedBan.join(", ")}`), `${targetID} - ${nameTarget}`), threadID);
			} catch (e) { return api.sendMessage(getText("errorReponse", "[ UnbanCommand User ]"), threadID) };
		}
	}
};

module.exports.run = async ({ event, api, args, Users, getText, client }) => {
	const { threadID, messageID } = event;
	const type = args[0];
	var targetID = String(args[1]);
	var reason = (args.slice(2, args.length)).join(" ") || null;

	if (!targetID) {
		const mention = Object.keys(event.mentions);
		if (mention.length > 0) {
			targetID = String(mention[0]);
			reason = args.slice(1).join(" ").replace(event.mentions[mention[0]], "").trim() || null;
		}
	} else if (isNaN(targetID)) {
        const mention = Object.keys(event.mentions);
		if (mention.length > 0) {
			const mentionedUserID = mention[0];
			const fullArg = args.join(" ");
			targetID = String(mentionedUserID);
			reason = fullArg.slice(fullArg.indexOf(event.mentions[mentionedUserID]) + event.mentions[mentionedUserID].length).trim();
		}
    }


	switch (type) {
		case "ban":
		case "-b": {
			if (!targetID) return api.sendMessage(getText("IDNotFound", "[ Ban User ]"), threadID, messageID);
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Ban User ]"), threadID, messageID);
			if (global.data.userBanned.has(targetID)) {
				const { reason: r, dateAdded: d } = global.data.userBanned.get(targetID) || {};
				return api.sendMessage(getText("existBan", targetID, ((r) ? `${getText("reason")}: "${r}"` : ""), ((d) ? `${getText("at")} ${d}` : "")), threadID, messageID);
			}
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnBan", `${targetID} - ${nameTarget}`, ((reason) ? `\n- ${getText("reason")}: ${reason}` : "")), threadID, (error, info) => {
				client.handleReaction.push({
					type: "ban",
					targetID,
					reason,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
				});
			}, messageID);
		}

		case "unban":
		case "-ub": {
			if (!targetID) return api.sendMessage(getText("IDNotFound", "[ Unban User ]"), threadID, messageID);
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Unban User ]"), threadID, messageID);
			if (!global.data.userBanned.has(targetID)) return api.sendMessage(getText("notExistBan"), threadID, messageID);
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnUnban", `${targetID} - ${nameTarget}`), threadID, (error, info) => {
				client.handleReaction.push({
					type: "unban",
					targetID,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
				});
			}, messageID);
		}

		case "search":
		case "-s": {
			const contentJoin = args.slice(1).join(" ");
			if (!contentJoin) return api.sendMessage("Please enter a name to search.", threadID, messageID);
			const getUsers = (await Users.getAll(['userID', 'name'])).filter(item => !!item.name);
			var matchUsers = [], a = '', b = 0;
			getUsers.forEach(i => {
				if (i.name.toLowerCase().includes(contentJoin.toLowerCase())) {
					matchUsers.push({
						name: i.name,
						id: i.userID
					});
				}
			});
			if (matchUsers.length > 0) {
				matchUsers.forEach(i => a += `\n${b += 1}. ${i.name} - ${i.id}`);
				api.sendMessage(getText("returnResult", a), threadID);
			} else {
				api.sendMessage(getText("returnNull"), threadID);
			}
			return;
		}
		
		case "banCommand":
		case "-bc": {
			if (!targetID) return api.sendMessage(getText("IDNotFound", "[ banCommand User ]"), threadID, messageID);
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ banCommand User ]"), threadID, messageID);
			if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", "[ banCommand User ]"), threadID, messageID);
			
			let commandNeedBan = reason.split(" ").map(cmd => cmd.trim());
			if (commandNeedBan[0] == "all") {
				const commandValues = client.commands.keys();
				commandNeedBan = Array.from(commandValues);
			}

			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnBanCommand", `${targetID} - ${nameTarget}`, ((commandNeedBan.length === client.commands.size) ? getText("allCommand") : commandNeedBan.join(", "))), threadID, (error, info) => {
				client.handleReaction.push({
					type: "banCommand",
					targetID,
					commandNeedBan,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
				});
			}, messageID);
		}

		case "unbanCommand":
		case "-ubc": {
			if (!targetID) return api.sendMessage(getText("IDNotFound", "[ UnbanCommand User ]"), threadID, messageID);
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ UnbanCommand User ]"), threadID, messageID);
			if (!global.data.commandBanned.has(targetID)) return api.sendMessage(getText("notExistBanCommand"), threadID, messageID);
			if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", "[ UnbanCommand User ]"), threadID, messageID);
			
			let commandNeedBan = reason.split(" ").map(cmd => cmd.trim());
			const userBannedCommands = global.data.commandBanned.get(targetID) || [];
			if (commandNeedBan[0] == "all") {
				commandNeedBan = [...userBannedCommands];
			}
			
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnUnbanCommand", `${targetID} - ${nameTarget}`, ((commandNeedBan.length == userBannedCommands.length) ? getText("allCommand") : commandNeedBan.join(", "))), threadID, (error, info) => {
				client.handleReaction.push({
					type: "unbanCommand",
					targetID,
					commandNeedBan,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
				});
			}, messageID);
		}

		case "list":
		case "-l": {
			var listBan = [], i = 0;
			const bannedUsers = Array.from(global.data.userBanned.keys());
			const limit = parseInt(args[1]) || 10;

			for (const idUser of bannedUsers) {
				const userName = (await Users.getNameUser(idUser)) || "Unknown User";
				listBan.push(`${i+=1}. ${idUser} - ${userName}`);
				if (i >= limit) break;
			}
			return api.sendMessage(getText("returnList", (global.data.userBanned.size || 0), listBan.length, listBan.join("\n")), threadID, messageID);
		}

		case "info":
		case "-i": {
			if (!targetID) return api.sendMessage(getText("IDNotFound", "[ Info User ]"), threadID, messageID);
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Info User ]"), threadID, messageID);
			
			const commandBannedData = global.data.commandBanned.get(targetID);
			const userBannedData = global.data.userBanned.get(targetID);

			const isBanned = userBannedData ? "Yes" : "No";
			const reasonText = userBannedData?.reason ? `${getText("reason")}: "${userBannedData.reason}"` : "";
			const dateAddedText = userBannedData?.dateAdded ? `${getText("at")}: ${userBannedData.dateAdded}` : "";
			
			let commandBannedText = "No";
			if (commandBannedData && commandBannedData.length > 0) {
				const allCommandsBanned = commandBannedData.length === client.commands.size;
				commandBannedText = `Yes: ${allCommandsBanned ? getText("allCommand") : commandBannedData.join(", ")}`;
			}

			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnInfo", `${targetID} - ${nameTarget}`, isBanned, reasonText, dateAddedText, commandBannedText), threadID, messageID);
		}
		
		default: {
			return api.sendMessage(this.config.usages, threadID, messageID);
		}
	}
}
