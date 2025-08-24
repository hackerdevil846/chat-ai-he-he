module.exports.config = {
	name: "approve",
	version: "1.0.2",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒈𝒓𝒐𝒖𝒑 𝒌𝒆 𝒂𝒑𝒑𝒓𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒃𝒐𝒕 𝒅𝒊𝒚𝒆",
	category: "Admin",
	cooldowns: 5
};

const fs = require("fs");
const dataPath = __dirname + "/Priyanshu/approvedThreads.json";
const dataPending = __dirname + "/Priyanshu/pendingdThreads.json";

/**
 * onStart
 * - Added as a no-op to prevent "onStart of command undefined" loader error.
 */
module.exports.onStart = async function () {
	// no initialization required for this command at start,
	// this function exists only to satisfy loaders that call onStart.
	return;
};

module.exports.onLoad = () => {
	// Ensure data files exist
	if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
	if (!fs.existsSync(dataPending)) fs.writeFileSync(dataPending, JSON.stringify([]));
};

/**
 * handleReply
 * - Admins can reply to the "PENDING GROUPS" message with an index number to approve.
 * - Admins can reply to the "APPROVED GROUPS" message with an index number to remove (delete).
 */
module.exports.handleReply = async function ({ event, api, handleReply, args }) {
	try {
		// Only the author who requested the list can interact with the replies
		if (handleReply.author != event.senderID) return;

		const { body, threadID, messageID } = event;
		const type = handleReply.type;

		// load current data
		let approved = JSON.parse(fs.readFileSync(dataPath));
		let pending = JSON.parse(fs.readFileSync(dataPending));

		// Helper: parse integer index from reply body
		const idx = parseInt(body);
		if (isNaN(idx)) {
			// Accept shorthand 'A'/'a' for approving the first pending item (if exists)
			if ((body === 'A' || body === 'a') && type === "pending") {
				if (!pending.length) return api.sendMessage("❌ 𝙉𝙤 𝙥𝙚𝙣𝙙𝙞𝙣𝙜 𝙜𝙧𝙤𝙪𝙥𝙨 𝙩𝙤 𝙖𝙥𝙥𝙧𝙤𝙫𝙚.", threadID, messageID);
				const idBox = pending[0];
				if (!approved.includes(idBox)) approved.push(idBox);
				fs.writeFileSync(dataPath, JSON.stringify(approved, null, 2));
				// remove from pending
				const pIndex = pending.indexOf(idBox);
				if (pIndex > -1) {
					pending.splice(pIndex, 1);
					fs.writeFileSync(dataPending, JSON.stringify(pending, null, 2));
				}
				return api.sendMessage(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅: ${idBox}`, threadID, messageID);
			}
			return api.sendMessage("❌ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙬𝙞𝙩𝙝 𝙖 𝙣𝙪𝙢𝙗𝙚𝙧 𝙞𝙣𝙙𝙚𝙭 (e.g., 1) or 'A' to approve first pending.", threadID, messageID);
		}

		// handle based on type of list the admin replied to
		if (type === "pending") {
			// approve pending at index
			if (idx < 1 || idx > pending.length) return api.sendMessage("❌ 𝙸𝙣𝙫𝙖𝙡𝙞𝙙 𝙞𝙣𝙙𝙚𝙭.", threadID, messageID);
			const idBox = pending[idx - 1];
			if (!approved.includes(idBox)) approved.push(idBox);
			fs.writeFileSync(dataPath, JSON.stringify(approved, null, 2));
			// remove from pending
			pending.splice(idx - 1, 1);
			fs.writeFileSync(dataPending, JSON.stringify(pending, null, 2));
			return api.sendMessage(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅: ${idBox}`, threadID, messageID);
		} else if (type === "a") {
			// delete from approved at index
			if (idx < 1 || idx > approved.length) return api.sendMessage("❌ 𝙸𝙣𝙫𝙖𝙡𝙞𝙙 𝙞𝙣𝙙𝙚𝙭.", threadID, messageID);
			const idBox = approved[idx - 1];
			approved.splice(idx - 1, 1);
			fs.writeFileSync(dataPath, JSON.stringify(approved, null, 2));
			// inform the group that approval was canceled (best-effort)
			try {
				api.sendMessage(`❌ 𝑨𝒑𝒑𝒓𝒐𝒗𝒂𝒍 𝒄𝒂𝒏𝒄𝒆𝒍𝒆𝒅`, idBox);
			} catch (e) { /* ignore send error */ }
			return api.sendMessage(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒓𝒆𝒎𝒐𝒗𝒆𝒅 𝒇𝒓𝒐𝒎 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝒍𝒊𝒔𝒕: ${idBox}`, threadID, messageID);
		} else {
			return api.sendMessage("❌ 𝙐𝙣𝙠𝙣𝙤𝙬𝙣 𝙖𝙘𝙩𝙞𝙤𝙣.", threadID, messageID);
		}
	} catch (err) {
		console.error(err);
		api.sendMessage("❌ 𝙀𝙧𝙧𝙤𝙧 𝙝𝙖𝙥𝙥𝙚𝙣𝙚𝙙 𝙬𝙝𝙞𝙡𝙚 𝙥𝙧𝙤𝙘𝙚𝙨𝙨𝙞𝙣𝙜.", event.threadID, event.messageID);
	}
};

/**
 * run - main command entry
 */
module.exports.run = async function ({ event, api, args, Threads, Users }) {
	try {
		const { threadID, messageID } = event;
		let approved = JSON.parse(fs.readFileSync(dataPath));
		let pending = JSON.parse(fs.readFileSync(dataPending));
		let idBox = (args[0]) ? args[0] : threadID;

		// Helper function for Mathematical Bold Italic
		const toBI = (text) => {
			const map = {
				'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋',
				'k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝒒','r': '𝒓','s': '𝒔','t': '𝒕',
				'u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
				'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱',
				'K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻',
				'U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿','Y': '𝒀','Z': '𝒁',
				'0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗'
			};
			return text.split('').map(char => map[char] || char).join('');
		};

		const tst = (await Threads.getData(String(event.threadID))).data || {};
		const pb = (tst.hasOwnProperty("PREFIX")) ? tst.PREFIX : global.config.PREFIX;
		const nmdl = toBI(this.config.name);
		const cre = toBI(this.config.credits);

		const helpMessage = `🎭 ${toBI("APPROVE COMMANDS")} 🎭

${toBI(pb + nmdl)} ${toBI('l')}/${toBI('list')} ➺ 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝒈𝒓𝒐𝒖𝒑 𝒅𝒆𝒌𝒉𝒃𝒆𝒏
${toBI(pb + nmdl)} ${toBI('p')}/${toBI('pending')} ➺ 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒈𝒓𝒐𝒖𝒑 𝒅𝒆𝒌𝒉𝒃𝒆𝒏
${toBI(pb + nmdl)} ${toBI('d')}/${toBI('del')} [𝒊𝒅] ➺ 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝒍𝒊𝒔𝒕 𝒕𝒉𝒆𝒌𝒆 𝒎𝒖𝒄𝒉𝒃𝒆𝒏
${toBI(pb + nmdl)} [𝒊𝒅] ➺ 𝒈𝒓𝒐𝒖𝒑 𝒌𝒆 𝒂𝒑𝒑𝒓𝒐𝒗𝒆 𝒌𝒐𝒓𝒃𝒆𝒏

${toBI("Created by:")} ${cre}`;

		// LIST APPROVED
		if (args[0] == "list" || args[0] == "l") {
			let msg = `${toBI("APPROVED GROUPS")} [${approved.length}]:\n\n`;
			let count = 0;
			for (let e of approved) {
				try {
					let threadInfo = await api.getThreadInfo(e);
					let threadName = threadInfo.threadName || (await Users.getNameUser(e)) || "Unknown";
					msg += `〘${++count}〙 » ${threadName}\n${e}\n\n`;
				} catch {
					msg += `〘${++count}〙 » Unknown\n${e}\n\n`;
				}
			}
			msg += "📌 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒂𝒏 𝒊𝒏𝒅𝒆𝒙 𝒕𝒐 𝒓𝒆𝒎𝒐𝒗𝒆 𝒂 𝒈𝒓𝒐𝒖𝒑 (e.g., 1).";
			return api.sendMessage(msg, threadID, (error, info) => {
				global.client.handleReply.push({
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					type: "a" // reply type 'a' => remove from approved
				});
			}, messageID);
		}

		// LIST PENDING
		else if (args[0] == "pending" || args[0] == "p") {
			let msg = `${toBI("PENDING GROUPS")} [${pending.length}]:\n\n`;
			let count = 0;
			for (let e of pending) {
				try {
					let threadInfo = await api.getThreadInfo(e);
					let threadName = threadInfo.threadName || (await Users.getNameUser(e)) || "Unknown";
					msg += `〘${++count}〙 » ${threadName}\n${e}\n\n`;
				} catch {
					msg += `〘${++count}〙 » Unknown\n${e}\n\n`;
				}
			}
			msg += "📌 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒂𝒏 𝒊𝒏𝒅𝒆𝒙 𝒕𝒐 𝒂𝒑𝒑𝒓𝒐𝒗𝒆 𝒂 𝒈𝒓𝒐𝒖𝒑 (e.g., 1) or reply 'A' to approve the first one.";
			return api.sendMessage(msg, threadID, (error, info) => {
				global.client.handleReply.push({
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					type: "pending" // reply type 'pending' => approve pending
				});
			}, messageID);
		}

		// HELP
		else if (args[0] == "help" || args[0] == "h") {
			return api.sendMessage(helpMessage, threadID, messageID);
		}

		// DELETE (del) approved by id or current thread
		else if (args[0] == "del" || args[0] == "d") {
			idBox = args[1] || threadID;
			if (isNaN(parseInt(idBox))) return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝑰𝑫", threadID, messageID);
			if (!approved.includes(idBox)) return api.sendMessage("❌ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝒏𝒂𝒉𝒊", threadID, messageID);
			// notify the group (best-effort)
			try { api.sendMessage(`❌ 𝑨𝒑𝒑𝒓𝒐𝒗𝒂𝒍 𝒄𝒂𝒏𝒄𝒆𝒍𝒆𝒅`, idBox); } catch (e) { /* ignore */ }
			api.sendMessage(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒓𝒆𝒎𝒐𝒗𝒆𝒅 𝒇𝒓𝒐𝒎 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝒍𝒊𝒔𝒕`, threadID, () => {
				approved.splice(approved.indexOf(idBox), 1);
				fs.writeFileSync(dataPath, JSON.stringify(approved, null, 2));
			}, messageID);
		}

		// If provided id is invalid
		else if (isNaN(parseInt(idBox))) {
			return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝑰𝑫", threadID, messageID);
		}

		// If already approved
		else if (approved.includes(idBox)) {
			return api.sendMessage(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅`, threadID, messageID);
		}

		// OTHERWISE - Approve this group (manual approval through command)
		else {
			// admin id shown in original code (kept)
			let admID = "61571630409265";
			const userInfo = (await api.getUserInfo(admID))[admID] || {};
			const userName = userInfo.name || "Admin";

			// Beautiful approval message (sent to group)
			const approvalMessage = `✨ 𝑨𝒑𝒏𝒂𝒓 𝑮𝒓𝒐𝒖𝒑 𝑨𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝑯𝒐𝒚𝒆𝒄𝒉𝒆! ✨

🖤 𝑩𝒐𝒕 𝑼𝒔𝒆 𝑲𝒐𝒓𝒆𝒏 𝑬𝒏𝒋𝒐𝒚 𝑲𝒐𝒓𝒆𝒏! 🖤

💝🥀 𝑶𝒘𝒏𝒆𝒓: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅 💫
🖤 𝑨𝒑𝒏𝒊 𝑻𝒂𝒌𝒆 𝑩𝒐𝒍𝒕𝒆 𝑷𝒂𝒓𝒆𝒏: 𝑨𝒔𝒊𝒇 🖤
😳 𝑻𝒂𝒓 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑰𝑫: https://www.facebook.com/${admID} 🤓
👋 𝑱𝒐𝒅𝒊 𝑲𝒐𝒏𝒐 𝑺𝒐𝒎𝒐𝒔𝒔𝒂 𝑯𝒐𝒊 𝑻𝒆𝒍𝒆𝒈𝒓𝒂𝒎-𝒆 𝑪𝒐𝒏𝒕𝒂𝒄𝒕 𝑲𝒐𝒓𝒖𝒏: @𝑨𝒔𝒊𝒇_𝑴𝒂𝒎𝒖𝒅 👉`;

			// send approval message to target group (idBox)
			api.sendMessage(approvalMessage, idBox, async (error, info) => {
				if (error) return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 - 𝑴𝒂𝒌𝒆 𝒔𝒖𝒓𝒆 𝑰'𝒎 𝒊𝒏 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑", threadID, messageID);

				// change bot nickname in group (best-effort)
				try {
					api.changeNickname(` 〖 ${global.config.PREFIX} 〗 ➺ ${global.config.BOTNAME || ""}`, idBox, global.data.botID);
				} catch (e) { /* ignore */ }

				// attempt to fetch an image and send activation message (best-effort)
				try {
					const axios = require('axios');
					const request = require('request');
					const res = await axios.get('https://anime.apibypriyansh.repl.co/img/anime');
					let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
					const filePath = __dirname + `/cache/approve.${ext}`;

					await new Promise((resolve, reject) => {
						request(res.data.url)
						.pipe(fs.createWriteStream(filePath))
						.on("close", resolve)
						.on("error", reject);
					});

					const activationMessage = `✅ 𝑩𝑶𝑻 𝑨𝑪𝑻𝑰𝑽𝑨𝑻𝑬𝑫

━━━━━━━━━━━━━━━━━━
┏━━━━ 🖤 ━━━━┓
  ✦❥⋆⃝𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅✦ 
┗━━━━ 🖤 ━━━━┛
━━━━━━━━━━━━━━━━━━
➪ 𝑩𝒐𝒕: ${global.config.BOTNAME || "N/A"}
➪ 𝑷𝒓𝒆𝒇𝒊𝒙: ${global.config.PREFIX}
➪ 𝑼𝒔𝒆𝒓𝒔: ${global.data.allUserID ? global.data.allUserID.length : "N/A"}
➪ 𝑮𝒓𝒐𝒖𝒑𝒔: ${global.data.allThreadID ? global.data.allThreadID.length : "N/A"}
━━━━━━━━━━━━━━━━━━
[]---------------------------------------[]
𝑼𝒔𝒆 '${global.config.PREFIX}𝒉𝒆𝒍𝒑' 𝒕𝒐 𝒗𝒊𝒆𝒘 𝒂𝒍𝒍 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔!
[]---------------------------------------[]
⌨ 𝑴𝒂𝒅𝒆 𝒃𝒚: ${userName}`;

					api.sendMessage({
						body: activationMessage,
						mentions: [{
							tag: userName,
							id: admID,
							fromIndex: 0
						}],
						attachment: fs.createReadStream(filePath)
					}, idBox, () => {
						try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
					});
				} catch (e) {
					// if image sending fails, ignore but log
					console.error(e);
				}

				// finally add to approved list and remove from pending if exists
				approved.push(idBox);
				fs.writeFileSync(dataPath, JSON.stringify(approved, null, 2));
				const pIdx = pending.indexOf(idBox);
				if (pIdx > -1) {
					pending.splice(pIdx, 1);
					fs.writeFileSync(dataPending, JSON.stringify(pending, null, 2));
				}

				// Inform the admin (command caller)
				api.sendMessage(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅: ${idBox}`, threadID, messageID);
			});
		}
	} catch (err) {
		console.error(err);
		return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅.", event.threadID, event.messageID);
	}
};
