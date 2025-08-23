const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
	name: "note",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑷𝒓𝒐𝒕𝒊 𝒈𝒓𝒐𝒖𝒑𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒏𝒐𝒕𝒆 𝒃𝒐𝒔𝒉𝒂𝒏𝒐",
	category: "𝑩𝒐𝒙 𝒄𝒉𝒂𝒕",
	usages: "[add/remove/list] [note]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
		"path": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"missingPermission": "⚠️ | Permission denied! Only group admins can manage notes.",
		"missingContent": "📝 | Please enter note content!",
		"addSuccess": "✅ | Note added successfully!",
		"emptyList": "📭 | No notes found for this group!",
		"invalidIndex": "❌ | Invalid note number!",
		"removeSuccess": "🗑️ | Note %1 has been removed!",
		"clearSuccess": "🧹 | All notes cleared successfully!",
		"helpText": "📝 Note Command Usage:\n\n» .note add [text] - Add new note\n» .note list - Show all notes\n» .note remove [number] - Delete specific note\n» .note remove all - Clear all notes"
	}
};

module.exports.onLoad = function() {
	const filePath = path.join(__dirname, "cache", "notes.json");
	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, "[]", "utf-8");
	}
};

module.exports.run = async function({ api, event, args, permssion }) {
	const { threadID, messageID } = event;
	const { readFileSync, writeFileSync } = fs;
	const filePath = path.join(__dirname, "cache", "notes.json");
	
	let notesData = JSON.parse(readFileSync(filePath, "utf-8"));
	let threadNotes = notesData.find(t => t.threadID === threadID) || { threadID, notes: [] };
	const action = args[0]?.toLowerCase();
	const content = args.slice(1).join(" ").trim();

	switch (action) {
		case "add":
			if (permssion < 1) return api.sendMessage(this.languages.en.missingPermission, threadID, messageID);
			if (!content) return api.sendMessage(this.languages.en.missingContent, threadID, messageID);
			
			threadNotes.notes.push({
				id: Date.now(),
				content,
				author: event.senderID,
				timestamp: new Date().toISOString()
			});
			
			api.sendMessage(this.languages.en.addSuccess, threadID, messageID);
			break;
		
		case "list":
		case "all":
			if (threadNotes.notes.length === 0) {
				return api.sendMessage(this.languages.en.emptyList, threadID, messageID);
			}
			
			let message = "📋 𝗚𝗥𝗢𝗨𝗣 𝗡𝗢𝗧𝗘𝗦 📋\n\n";
			threadNotes.notes.forEach((note, index) => {
				message += `⦿ ${index + 1}. ${note.content}\n`;
			});
			message += `\n» Total notes: ${threadNotes.notes.length} «`;
			api.sendMessage(message, threadID, messageID);
			return;
		
		case "rm":
		case "remove":
		case "delete":
			if (permssion < 1) return api.sendMessage(this.languages.en.missingPermission, threadID, messageID);
			if (threadNotes.notes.length === 0) {
				return api.sendMessage(this.languages.en.emptyList, threadID, messageID);
			}
			
			if (content === "all") {
				threadNotes.notes = [];
				api.sendMessage(this.languages.en.clearSuccess, threadID, messageID);
			} else if (!isNaN(content)) {
				const index = parseInt(content) - 1;
				if (index >= 0 && index < threadNotes.notes.length) {
					const removed = threadNotes.notes.splice(index, 1)[0];
					api.sendMessage(this.languages.en.removeSuccess.replace("%1", index + 1), threadID, messageID);
				} else {
					api.sendMessage(this.languages.en.invalidIndex, threadID, messageID);
				}
			} else {
				api.sendMessage(this.languages.en.invalidIndex, threadID, messageID);
			}
			break;
		
		default:
			api.sendMessage(this.languages.en.helpText, threadID, messageID);
			return;
	}
	
	// Update database
	if (!notesData.some(t => t.threadID === threadID)) {
		notesData.push(threadNotes);
	} else {
		notesData = notesData.map(t => 
			t.threadID === threadID ? threadNotes : t
		);
	}
	
	writeFileSync(filePath, JSON.stringify(notesData, null, 4), "utf-8");
};
