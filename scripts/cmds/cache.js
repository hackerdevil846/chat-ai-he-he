module.exports.config = {
	name: "cache",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒄𝒂𝒄𝒉𝒆 𝒇𝒐𝒍𝒅𝒆𝒓 𝒆𝒓 𝒇𝒊𝒍𝒆 𝒃𝒂 𝒇𝒐𝒍𝒅𝒆𝒓 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂",
	commandCategory: "Admin-bot system",
	usages: "\ncache start <text>\ncache ext <text>\ncache <text>\ncache [blank]\ncache help\n𝑵𝑶𝑻𝑬: <𝒕𝒆𝒙𝒕> 𝒉𝒐𝒍𝒐 𝒂𝒑𝒏𝒊 𝒋𝒆 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝒆𝒏𝒕𝒆𝒓 𝒌𝒂𝒓𝒆𝒏 𝒔𝒆𝒕𝒂",
	cooldowns: 5
};

const toMBI = (str) => {
	const map = {
		'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 
		'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 
		'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 
		'y': '𝒚', 'z': '𝒛', 'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 
		'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 
		'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 
		'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
	};
	return str.split('').map(char => map[char] || char).join('');
};

module.exports.handleReply = ({ api, event, handleReply }) => {
	if (event.senderID != handleReply.author) return; 
	const fs = require("fs-extra");
	let msg = "";
	const nums = event.body.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n));

	nums.forEach(num => {
		if (num > 0 && num <= handleReply.files.length) {
			const target = handleReply.files[num - 1];
			const path = __dirname + '/cache/' + target;
			try {
				if (fs.existsSync(path)) {
					const stat = fs.statSync(path);
					let typef = "";
					if (stat.isDirectory()) {
						typef = "[𝑭𝒐𝒍𝒅𝒆𝒓🗂️]";
						fs.rmdirSync(path, { recursive: true });
					} else {
						typef = "[𝑭𝒊𝒍𝒆📄]";
						fs.unlinkSync(path);
					}
					msg += `${typef} ${target}\n`;
				}
			} catch (error) {
				console.error(error);
			}
		}
	});

	if (msg) {
		api.sendMessage(toMBI("Deleted the following files in cache folder:\n\n") + msg, event.threadID);
	} else {
		api.sendMessage(toMBI("Invalid selection. Please enter valid numbers."), event.threadID);
	}
};

module.exports.run = async function({ api, event, args }) {
	const fs = require("fs-extra");
	const permission = ["61571630409265"];
	if (!permission.includes(event.senderID)) {
		return api.sendMessage(toMBI("You don't have permission to use this command"), event.threadID);
	}

	const cachePath = __dirname + "/cache";
	const files = fs.readdirSync(cachePath) || [];
	let msg = "", key = "", i = 1;

	if (args[0] === 'help') {
		const helpMsg = `
👉𝑴𝒐𝒅𝒖𝒍𝒆 𝒄𝒐𝒅𝒆 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅👈
		
𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝒖𝒔𝒂𝒈𝒆:
• 𝑲𝒆𝒚: 𝒔𝒕𝒂𝒓𝒕 <𝒕𝒆𝒙𝒕>
• 𝑬𝒇𝒇𝒆𝒄𝒕: 𝑭𝒊𝒍𝒕𝒆𝒓 𝒇𝒊𝒍𝒆𝒔 𝒔𝒕𝒂𝒓𝒕𝒊𝒏𝒈 𝒘𝒊𝒕𝒉 𝒕𝒆𝒙𝒕
• 𝑬𝒙𝒂𝒎𝒑𝒍𝒆: 𝒄𝒂𝒄𝒉𝒆 𝒔𝒕𝒂𝒓𝒕 𝒂𝒃𝒄
		
• 𝑲𝒆𝒚: 𝒆𝒙𝒕 <𝒕𝒆𝒙𝒕>
• 𝑬𝒇𝒇𝒆𝒄𝒕: 𝑭𝒊𝒍𝒕𝒆𝒓 𝒇𝒊𝒍𝒆𝒔 𝒘𝒊𝒕𝒉 𝒆𝒙𝒕𝒆𝒏𝒔𝒊𝒐𝒏
• 𝑬𝒙𝒂𝒎𝒑𝒍𝒆: 𝒄𝒂𝒄𝒉𝒆 𝒆𝒙𝒕 𝒑𝒏𝒈
		
• 𝑲𝒆𝒚: <𝒕𝒆𝒙𝒕>
• 𝑬𝒇𝒇𝒆𝒄𝒕: 𝑭𝒊𝒍𝒕𝒆𝒓 𝒇𝒊𝒍𝒆𝒔 𝒄𝒐𝒏𝒕𝒂𝒊𝒏𝒊𝒏𝒈 𝒕𝒆𝒙𝒕
• 𝑬𝒙𝒂𝒎𝒑𝒍𝒆: 𝒄𝒂𝒄𝒉𝒆 𝒕𝒆𝒔𝒕
		
• 𝑲𝒆𝒚: [𝒃𝒍𝒂𝒏𝒌]
• 𝑬𝒇𝒇𝒆𝒄𝒕: 𝑳𝒊𝒔𝒕 𝒂𝒍𝒍 𝒄𝒂𝒄𝒉𝒆 𝒇𝒊𝒍𝒆𝒔
• 𝑬𝒙𝒂𝒎𝒑𝒍𝒆: 𝒄𝒂𝒄𝒉𝒆
		
• 𝑲𝒆𝒚: 𝒉𝒆𝒍𝒑
• 𝑬𝒇𝒇𝒆𝒄𝒕: 𝑺𝒉𝒐𝒘 𝒕𝒉𝒊𝒔 𝒉𝒆𝒍𝒑 𝒎𝒆𝒔𝒔𝒂𝒈𝒆
• 𝑬𝒙𝒂𝒎𝒑𝒍𝒆: 𝒄𝒂𝒄𝒉𝒆 𝒉𝒆𝒍𝒑`;
		return api.sendMessage(helpMsg, event.threadID);
	}

	if (args[0] === "start" && args[1]) {
		const word = args.slice(1).join(" ");
		const filtered = files.filter(file => file.startsWith(word));
		if (filtered.length === 0) {
			return api.sendMessage(toMBI(`No files starting with: ${word}`), event.threadID);
		}
		files = filtered;
		key = toMBI(`Found ${files.length} file(s) starting with: ${word}`);
	}
	else if (args[0] === "ext" && args[1]) {
		const ext = args[1];
		const filtered = files.filter(file => file.endsWith(ext));
		if (filtered.length === 0) {
			return api.sendMessage(toMBI(`No files with extension: ${ext}`), event.threadID);
		}
		files = filtered;
		key = toMBI(`Found ${files.length} file(s) with extension: ${ext}`);
	}
	else if (!args[0]) {
		if (files.length === 0) {
			return api.sendMessage(toMBI("Cache folder is empty"), event.threadID);
		}
		key = toMBI("All files in cache:");
	}
	else {
		const word = args.join(" ");
		const filtered = files.filter(file => file.includes(word));
		if (filtered.length === 0) {
			return api.sendMessage(toMBI(`No files containing: ${word}`), event.threadID);
		}
		files = filtered;
		key = toMBI(`Found ${files.length} file(s) containing: ${word}`);
	}

	files.forEach(file => {
		const fullPath = `${cachePath}/${file}`;
		try {
			const stat = fs.statSync(fullPath);
			const type = stat.isDirectory() ? "𝑭𝒐𝒍𝒅𝒆𝒓🗂️" : "𝑭𝒊𝒍𝒆📄";
			msg += `${i++}. ${type} ${file}\n`;
		} catch (e) {
			console.error(e);
		}
	});

	api.sendMessage(
		toMBI("Reply with numbers to delete (multiple numbers separated by space):\n") + 
		key + "\n\n" + msg,
		event.threadID,
		(error, info) => {
			if (!error) {
				global.client.handleReply.push({
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					files
				});
			}
		}
	);
};
