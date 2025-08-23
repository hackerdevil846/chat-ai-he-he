module.exports.config = {
	name: "cache",
	version: "1.1.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "📁 Manage cache folder files and directories",
	category: "system",
	usages: "[start/ext/help] [text]",
	cooldowns: 3,
	envConfig: {
		allowedUsers: ["61571630409265"]
	}
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

module.exports.handleReply = async function({ api, event, handleReply }) {
	if (event.senderID !== handleReply.author) return;
	
	const fs = require("fs-extra");
	const { promisify } = require("util");
	const unlinkAsync = promisify(fs.unlink);
	const rmdirAsync = promisify(fs.rmdir);
	
	let successList = [];
	let errorList = [];
	const nums = event.body.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n) && n > 0 && n <= handleReply.files.length);

	if (nums.length === 0) {
		return api.sendMessage("❌ Invalid selection. Please enter valid numbers separated by spaces.", event.threadID);
	}

	for (const num of nums) {
		const target = handleReply.files[num - 1];
		const path = `${__dirname}/cache/${target}`;
		
		try {
			if (fs.existsSync(path)) {
				const stat = fs.statSync(path);
				if (stat.isDirectory()) {
					await rmdirAsync(path, { recursive: true });
					successList.push(`🗂️ ${target}`);
				} else {
					await unlinkAsync(path);
					successList.push(`📄 ${target}`);
				}
			}
		} catch (error) {
			errorList.push(`❌ ${target}: ${error.message}`);
		}
	}

	let response = "";
	if (successList.length > 0) {
		response += `✅ Successfully deleted ${successList.length} item(s):\n${successList.join('\n')}\n\n`;
	}
	if (errorList.length > 0) {
		response += `❌ Errors (${errorList.length}):\n${errorList.join('\n')}`;
	}

	api.sendMessage(toMBI(response || "⚠️ No items were processed"), event.threadID);
};

module.exports.run = async function({ api, event, args }) {
	const fs = require("fs-extra");
	const cachePath = `${__dirname}/cache`;
	
	// Permission check
	if (!module.exports.config.envConfig.allowedUsers.includes(event.senderID)) {
		return api.sendMessage("⛔ Access Denied: You don't have permission to use this command", event.threadID);
	}

	// Help command
	if (args[0] === "help") {
		const helpMsg = `
🔄 𝐂𝐀𝐂𝐇𝐄 𝐌𝐀𝐍𝐀𝐆𝐄𝐌𝐄𝐍𝐓 𝐒𝐘𝐒𝐓𝐄𝐌

▸ 𝐜𝐚𝐜𝐡𝐞 𝐬𝐭𝐚𝐫𝐭 <𝐭𝐞𝐱𝐭>
   ↳ Filter files starting with text
   ↳ Example: cache start abc

▸ 𝐜𝐚𝐜𝐡𝐞 𝐞𝐱𝐭 <𝐞𝐱𝐭𝐞𝐧𝐬𝐢𝐨𝐧>
   ↳ Filter files by extension
   ↳ Example: cache ext .png

▸ 𝐜𝐚𝐜𝐡𝐞 <𝐭𝐞𝐱𝐭>
   ↳ Filter files containing text
   ↳ Example: cache test

▸ 𝐜𝐚𝐜𝐡𝐞
   ↳ List all cache files

▸ 𝐜𝐚𝐜𝐡𝐞 𝐡𝐞𝐥𝐩
   ↳ Show this help message

📝 𝐍𝐎𝐓𝐄: Reply with numbers to delete files/folders
🔒 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: Bot Admin Only
👨‍💻 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;
		return api.sendMessage(helpMsg, event.threadID);
	}

	// Read cache directory
	let files = [];
	try {
		files = fs.readdirSync(cachePath);
	} catch (error) {
		return api.sendMessage(`❌ Error reading cache folder: ${error.message}`, event.threadID);
	}

	let filterType = "";
	let filterValue = "";
	let filteredFiles = [];

	// Apply filters
	if (args[0] === "start" && args[1]) {
		filterValue = args.slice(1).join(" ");
		filteredFiles = files.filter(file => file.startsWith(filterValue));
		filterType = `starting with "${filterValue}"`;
	} else if (args[0] === "ext" && args[1]) {
		filterValue = args[1];
		filteredFiles = files.filter(file => file.endsWith(filterValue));
		filterType = `with extension "${filterValue}"`;
	} else if (args.length > 0) {
		filterValue = args.join(" ");
		filteredFiles = files.filter(file => file.includes(filterValue));
		filterType = `containing "${filterValue}"`;
	} else {
		filteredFiles = files;
		filterType = "in cache";
	}

	// Handle no results
	if (filteredFiles.length === 0) {
		return api.sendMessage(
			`📭 No files found ${filterType}\n💡 Try: cache help for usage instructions`, 
			event.threadID
		);
	}

	// Format file list
	let fileList = "";
	filteredFiles.forEach((file, index) => {
		const fullPath = `${cachePath}/${file}`;
		try {
			const stat = fs.statSync(fullPath);
			const type = stat.isDirectory() ? "🗂️" : "📄";
			const size = stat.isDirectory() ? "" : ` (${formatBytes(stat.size)})`;
			fileList += `${index + 1}. ${type} ${file}${size}\n`;
		} catch (error) {
			fileList += `${index + 1}. ❓ ${file} (inaccessible)\n`;
		}
	});

	// Send results
	const totalSize = await getTotalSize(cachePath, filteredFiles);
	const message = `
📦 𝐂𝐀𝐂𝐇𝐄 𝐌𝐀𝐍𝐀𝐆𝐄𝐑

🔍 Found ${filteredFiles.length} items ${filterType}
💾 Total size: ${formatBytes(totalSize)}

${fileList}
✨ Reply with numbers to delete (ex: 1 3 5)
📝 Multiple numbers separated by spaces
❌ Type 'cancel' to abort operation
	`;

	api.sendMessage(toMBI(message), event.threadID, (error, info) => {
		if (!error) {
			global.client.handleReply.push({
				name: this.config.name,
				messageID: info.messageID,
				author: event.senderID,
				files: filteredFiles
			});
		}
	});
};

// Helper functions
function formatBytes(bytes, decimals = 2) {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function getTotalSize(cachePath, files) {
	const fs = require("fs-extra");
	let totalSize = 0;
	
	for (const file of files) {
		try {
			const stat = fs.statSync(`${cachePath}/${file}`);
			if (!stat.isDirectory()) {
				totalSize += stat.size;
			}
		} catch (error) {
			// Skip inaccessible files
		}
	}
	
	return totalSize;
}
