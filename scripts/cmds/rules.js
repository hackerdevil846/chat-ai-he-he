const { getPrefix } = global.utils;

module.exports.config = {
	name: "rules",
	version: "1.6",
	author: "NTKhang",
	countDown: 5,
	role: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: {
		bn: "Tomar group er rule banano/dekha/add/edit/position change/remove kora",
		en: "Create/view/add/edit/change position/delete group rules of you"
	},
	category: "box chat",
	usages: "[add|edit|move|delete|remove|<number>]",
	cooldowns: 5
};

module.exports.languages = {
	bn: {
		yourRules: "📜 আপনার গ্রুপের নিয়মাবলী:\n%1",
		noRules: "❗ বর্তমানে আপনার গ্রুপে কোনো নিয়মাবলী নেই। যোগ করতে লিখুন: `%1rules add <নিয়ম>`",
		noPermissionAdd: "🔒 শুধুমাত্র অ্যাডমিনরা গ্রুপে নিয়ম যোগ করতে পারবেন",
		noContent: "✏️ অনুগ্রহ করে আপনি যে নিয়ম যোগ করতে চান তার বিষয়বস্তু লিখুন",
		success: "✅ গ্রুপে নতুন নিয়ম সফলভাবে যোগ করা হয়েছে",
		noPermissionEdit: "🔒 শুধুমাত্র অ্যাডমিনরা গ্রুপের নিয়ম সম্পাদনা করতে পারবেন",
		invalidNumber: "🔢 অনুগ্রহ করে আপনি যে নিয়মটি সম্পাদনা করতে চান তার বৈধ সিরিয়াল নম্বর লিখুন",
		rulesNotExist: "⚠️ %1 নম্বর নিয়ম বিদ্যমান নয়",
		numberRules: "ℹ️ বর্তমানে আপনার গ্রুপে %1 টি নিয়ম রয়েছে",
		noContentEdit: "✏️ অনুগ্রহ করে %1 নম্বর নিয়মের জন্য নতুন বিষয়বস্তু লিখুন",
		successEdit: "✅ %1 নম্বর নিয়মটি সফলভাবে সম্পাদনা হয়েছে: %2",
		noPermissionMove: "🔒 শুধুমাত্র অ্যাডমিনরা নিয়মের অবস্থান পরিবর্তন করতে পারবেন",
		invalidNumberMove: "🔢 অনুগ্রহ করে আপনি যে দুটি নিয়ম অদলবদল করতে চান তাদের বৈধ সিরিয়াল নম্বর লিখুন",
		sameNumberMove: "❗ দুটি একই নম্বরের নিয়ম অদলবদল করা সম্ভব নয়",
		rulesNotExistMove: "⚠️ %1 নম্বর নিয়ম বিদ্যমান নয়",
		rulesNotExistMove2: "⚠️ %1 এবং %2 নম্বর নিয়ম বিদ্যমান নয়",
		successMove: "✅ %1 এবং %2 নম্বর নিয়ম সফলভাবে অদলবদল হয়েছে",
		noPermissionDelete: "🔒 শুধুমাত্র অ্যাডমিনরা গ্রুপের নিয়ম মুছতে পারবেন",
		invalidNumberDelete: "🔢 অনুগ্রহ করে আপনি যে নিয়মটি মুছতে চান তার সিরিয়াল নম্বর লিখুন",
		rulesNotExistDelete: "⚠️ %1 নম্বর নিয়ম বিদ্যমান নয়",
		successDelete: "🗑️ %1 নম্বর নিয়মটি মুছে ফেলা হয়েছে, বিষয়বস্তু: %2",
		noPermissionRemove: "🔒 শুধুমাত্র গ্রুপ অ্যাডমিনরা সব নিয়ম মুছতে পারবেন",
		confirmRemove: "⚠️ এই বার্তায় যেকোনো প্রতিক্রিয়া দিন **সব নিয়ম মুছে ফেলার জন্য** নিশ্চিত করতে",
		successRemove: "✅ গ্রুপের সব নিয়ম সফলভাবে মুছে ফেলা হয়েছে",
		invalidNumberView: "🔢 অনুগ্রহ করে আপনি যে নিয়মটি দেখতে চান তার সিরিয়াল নম্বর লিখুন"
	},
	en: {
		yourRules: "📜 Your group rules:\n%1",
		noRules: "❗ Your group has no rules. To add one use: `%1rules add <rule>`",
		noPermissionAdd: "🔒 Only admins can add rules for the group",
		noContent: "✏️ Please enter the content for the rule you want to add",
		success: "✅ Added new rule for the group successfully",
		noPermissionEdit: "🔒 Only admins can edit group rules",
		invalidNumber: "🔢 Please enter a valid rule number to edit",
		rulesNotExist: "⚠️ Rule number %1 does not exist",
		numberRules: "ℹ️ Your group has %1 rules",
		noContentEdit: "✏️ Please enter the content you want to set for rule number %1",
		successEdit: "✅ Edited rule number %1 to: %2",
		noPermissionMove: "🔒 Only admins can move group rules",
		invalidNumberMove: "🔢 Please enter two valid rule numbers to swap",
		sameNumberMove: "❗ Cannot swap positions of the same rule",
		rulesNotExistMove: "⚠️ Rule number %1 does not exist",
		rulesNotExistMove2: "⚠️ Rule number %1 and %2 do not exist",
		successMove: "✅ Swapped position of rule number %1 and %2 successfully",
		noPermissionDelete: "🔒 Only admins can delete group rules",
		invalidNumberDelete: "🔢 Please enter the number of the rule you want to delete",
		rulesNotExistDelete: "⚠️ Rule number %1 does not exist",
		successDelete: "🗑️ Deleted rule number %1, content: %2",
		noPermissionRemove: "🔒 Only group admins can remove all group rules",
		confirmRemove: "⚠️ React to this message with any emoji to confirm **remove all group rules**",
		successRemove: "✅ Removed all group rules successfully",
		invalidNumberView: "🔢 Please enter the number of the rule you want to view"
	}
};

/**
 * Helper: send a message, support both message.reply(...) and api.sendMessage(...)
 */
function _send(api, messageObj, threadID, text) {
	return new Promise((resolve, reject) => {
		if (messageObj && typeof messageObj.reply === "function") {
			messageObj.reply(text, (err, info) => err ? reject(err) : resolve(info));
		}
		else {
			api.sendMessage(text, threadID, (err, info) => err ? reject(err) : resolve(info));
		}
	});
}

/**
 * Main run function — behaves like your old onStart
 */
module.exports.run = async function ({ api, event, args, permssion, role, message, threadsData, getLang, commandName }) {
	try {
		const threadID = event.threadID;
		const senderID = event.senderID;
		const userRole = (typeof permssion !== "undefined") ? permssion : role;
		const type = args[0];
		const rulesOfThread = await threadsData.get(threadID, "data.rules", []);
		const totalRules = rulesOfThread.length;

		// VIEW all rules (no args)
		if (!type) {
			let i = 1;
			const msg = rulesOfThread.reduce((text, rule) => text + `${i++}. ${rule}\n`, "");
			const content = msg ? getLang("yourRules", msg) : getLang("noRules", getPrefix(threadID));
			const info = await _send(api, message, threadID, content);
			// set reply handler mapping so user can reply with a number to view a specific rule
			global.GoatBot.onReply.set(info.messageID, {
				commandName,
				author: senderID,
				rulesOfThread,
				messageID: info.messageID
			});
			return;
		}

		// ADD
		if (["add", "-a"].includes(type)) {
			if (userRole < 1) return _send(api, message, threadID, getLang("noPermissionAdd"));
			if (!args[1]) return _send(api, message, threadID, getLang("noContent"));
			rulesOfThread.push(args.slice(1).join(" "));
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				return _send(api, message, threadID, getLang("success"));
			}
			catch (err) {
				console.error(err);
				return _send(api, message, threadID, "❌ Error: " + err.message);
			}
		}

		// EDIT
		if (["edit", "-e"].includes(type)) {
			if (userRole < 1) return _send(api, message, threadID, getLang("noPermissionEdit"));
			const stt = parseInt(args[1]);
			if (isNaN(stt)) return _send(api, message, threadID, getLang("invalidNumber"));
			if (!rulesOfThread[stt - 1]) return _send(api, message, threadID, `${getLang("rulesNotExist", stt)}, ${totalRules === 0 ? getLang("noRules", getPrefix(threadID)) : getLang("numberRules", totalRules)}`);
			if (!args[2]) return _send(api, message, threadID, getLang("noContentEdit", stt));
			const newContent = args.slice(2).join(" ");
			rulesOfThread[stt - 1] = newContent;
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				return _send(api, message, threadID, getLang("successEdit", stt, newContent));
			}
			catch (err) {
				console.error(err);
				return _send(api, message, threadID, "❌ Error: " + err.message);
			}
		}

		// MOVE / SWAP
		if (["move", "-m"].includes(type)) {
			if (userRole < 1) return _send(api, message, threadID, getLang("noPermissionMove"));
			const num1 = parseInt(args[1]);
			const num2 = parseInt(args[2]);
			if (isNaN(num1) || isNaN(num2)) return _send(api, message, threadID, getLang("invalidNumberMove"));
			if (num1 === num2) return _send(api, message, threadID, getLang("sameNumberMove"));

			const exist1 = !!rulesOfThread[num1 - 1];
			const exist2 = !!rulesOfThread[num2 - 1];

			if (!exist1 && !exist2) {
				return _send(api, message, threadID, `${getLang("rulesNotExistMove2", num1, num2)}, ${totalRules === 0 ? getLang("noRules", getPrefix(threadID)) : getLang("numberRules", totalRules)}`);
			}
			if (!exist1) {
				return _send(api, message, threadID, `${getLang("rulesNotExistMove", num1)}, ${totalRules === 0 ? getLang("noRules", getPrefix(threadID)) : getLang("numberRules", totalRules)}`);
			}
			if (!exist2) {
				return _send(api, message, threadID, `${getLang("rulesNotExistMove", num2)}, ${totalRules === 0 ? getLang("noRules", getPrefix(threadID)) : getLang("numberRules", totalRules)}`);
			}

			// swap
			[rulesOfThread[num1 - 1], rulesOfThread[num2 - 1]] = [rulesOfThread[num2 - 1], rulesOfThread[num1 - 1]];
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				return _send(api, message, threadID, getLang("successMove", num1, num2));
			}
			catch (err) {
				console.error(err);
				return _send(api, message, threadID, "❌ Error: " + err.message);
			}
		}

		// DELETE single
		if (["delete", "del", "-d"].includes(type)) {
			if (userRole < 1) return _send(api, message, threadID, getLang("noPermissionDelete"));
			if (!args[1] || isNaN(args[1])) return _send(api, message, threadID, getLang("invalidNumberDelete"));
			const index = parseInt(args[1]) - 1;
			const rulesDel = rulesOfThread[index];
			if (!rulesDel) return _send(api, message, threadID, `${getLang("rulesNotExistDelete", args[1])}, ${totalRules === 0 ? getLang("noRules", getPrefix(threadID)) : getLang("numberRules", totalRules)}`);
			rulesOfThread.splice(index, 1);
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				return _send(api, message, threadID, getLang("successDelete", args[1], rulesDel));
			}
			catch (err) {
				console.error(err);
				return _send(api, message, threadID, "❌ Error: " + err.message);
			}
		}

		// REMOVE all (confirm via reaction)
		if (["remove", "reset", "-r", "-rm"].includes(type)) {
			if (userRole < 1) return _send(api, message, threadID, getLang("noPermissionRemove"));
			const info = await _send(api, message, threadID, getLang("confirmRemove"));
			// save mapping for reaction handler
			global.GoatBot.onReaction.set(info.messageID, {
				commandName: "rules",
				messageID: info.messageID,
				author: senderID
			});
			return;
		}

		// VIEW specific numbers: e.g., "rules 1 3"
		if (!isNaN(type)) {
			let msg = "";
			for (const stt of args) {
				const idx = parseInt(stt) - 1;
				const rule = rulesOfThread[idx];
				if (rule) msg += `${parseInt(stt)}. ${rule}\n`;
			}
			if (msg === "") return _send(api, message, threadID, `${getLang("rulesNotExist", type)}, ${totalRules === 0 ? getLang("noRules", getPrefix(threadID)) : getLang("numberRules", totalRules)}`);
			return _send(api, message, threadID, msg);
		}

		// Unknown syntax
		return _send(api, message, threadID, (getLang || (() => "Syntax error"))("invalidNumber"));
	}
	catch (err) {
		console.error(err);
		try { if (message && typeof message.reply === "function") return message.reply("❌ Unexpected error: " + err.message); } catch {}
		return api.sendMessage("❌ Unexpected error: " + err.message, event.threadID);
	}
};

/**
 * handleReply — invoked when user replies to the bot's message listing rules
 * (keeps the old onReply behavior)
 */
module.exports.handleReply = async function ({ api, event, Reply, getLang }) {
	try {
		// If Reply not passed, try to get from global mapping by messageID
		if (!Reply) Reply = global.GoatBot.onReply.get(event.messageID) || null;
		if (!Reply) return;

		const { author, rulesOfThread, messageID } = Reply;
		if (author != event.senderID) return; // only the original author can use the reply flow

		const num = parseInt(event.body || "");
		if (isNaN(num) || num < 1) {
			return api.sendMessage(getLang("invalidNumberView"), event.threadID);
		}

		const totalRules = rulesOfThread.length;
		if (num > totalRules) {
			return api.sendMessage(`${getLang("rulesNotExist", num)}, ${totalRules === 0 ? getLang("noRules", getPrefix(event.threadID)) : getLang("numberRules", totalRules)}`, event.threadID);
		}

		await api.sendMessage(`${num}. ${rulesOfThread[num - 1]}`, event.threadID);
		// try to unsend the bot's list message to keep chat clean
		try { if (api.unsend) await api.unsend(messageID); } catch (e) { /* ignore */ }

		// cleanup mapping
		try { global.GoatBot.onReply.delete(messageID); } catch (e) { /* ignore */ }
	}
	catch (err) {
		console.error(err);
	}
};

/**
 * handleReaction — invoked when someone reacts to the confirm-remove message
 * We rely on the mapping saved in run (global.GoatBot.onReaction)
 */
module.exports.handleReaction = async function ({ api, event, threadsData, getLang }) {
	try {
		const reactionData = global.GoatBot.onReaction.get(event.messageID);
		if (!reactionData) return;
		const { author } = reactionData;

		// only the original command author can confirm by reacting
		if (author != event.userID) return;

		const threadID = event.threadID;
		await threadsData.set(threadID, [], "data.rules");
		await api.sendMessage(getLang("successRemove"), threadID);

		// cleanup mapping
		try { global.GoatBot.onReaction.delete(event.messageID); } catch (e) { /* ignore */ }
	}
	catch (err) {
		console.error(err);
	}
};

// Backwards compatibility: keep original names if framework expects them
module.exports.onStart = module.exports.run;
module.exports.onReply = module.exports.handleReply;
module.exports.onReaction = module.exports.handleReaction;
