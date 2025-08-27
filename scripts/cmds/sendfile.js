const fs = require("fs-extra");
const stringSimilarity = require('string-similarity');

module.exports.config = {
	name: 'sendfile',
	version: '1.0.0',
	hasPermssion: 2,
	credits: '𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅',
	description: '𝑭𝒂𝒊𝒍 𝒑𝒂𝒕𝒉𝒂𝒏𝒐𝒓 𝒋𝒐𝒏𝒏𝒐 𝒂𝒅𝒎𝒊𝒏 𝒌𝒎𝒅',
	category: '𝑨𝒅𝒎𝒊𝒏',
	usages: '[filename.js]',
	cooldowns: 0,
	dependencies: {
		"fs-extra": "",
		"string-similarity": ""
	}
};

module.exports.onStart = async function({ api, event, args, Users }) {
	const file = args.join(" ");
	
	if (!file) 
		return api.sendMessage('🔴 | 𝑭𝒂𝒊𝒍𝒆𝒓 𝑵𝒂𝒎 𝒌𝒉𝒂𝒍𝒊 𝒓𝒂𝒌𝒉𝒂 𝒋𝒂𝒃𝒆 𝒏𝒂!', event.threadID, event.messageID);

	if (!file.endsWith('.js')) 
		return api.sendMessage('🔴 | 𝑭𝒂𝒊𝒍𝒆𝒓 𝑬𝒙𝒕𝒆𝒏𝒔𝒊𝒐𝒏 (.𝒋𝒔) 𝒉𝒐𝒕𝒆 𝒉𝒐𝒃𝒆!', event.threadID, event.messageID);

	if (event.type === "message_reply") {
		const uid = event.messageReply.senderID;
		const name = (await Users.getData(uid)).name; // Corrected: Using Users.getData to get user name
		
		if (!fs.existsSync(__dirname + "/" + file)) {
			return handleFileNotFound(api, event, file, 'user', uid, name, this.config.name); // Pass command name
		}
		
		return sendFileToUser(api, event, file, uid, name);
	} 
	else {
		if (!fs.existsSync(__dirname + "/" + file)) {
			return handleFileNotFound(api, event, file, 'thread', null, null, this.config.name); // Pass command name
		}
		
		return sendFileToThread(api, event, file);
	}
};

module.exports.handleReaction = function({ api, event, handleReaction, Users }) {
	const { file, author, type, uid, namee } = handleReaction;
	
	if (event.userID !== author) return; // Only author can react
	api.unsendMessage(handleReaction.messageID); // Remove reaction message

	const filePath = __dirname + '/' + file + '.js';
	const txtFilePath = filePath.replace('.js', '.txt');

	// Ensure the file exists before copying
	if (!fs.existsSync(filePath)) {
		return api.sendMessage(`🔴 | 𝑭𝒊𝒍𝒆 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅 𝒂𝒕 ${filePath}`, event.threadID);
	}

	fs.copyFileSync(filePath, txtFilePath);

	switch (type) {
		case "user":
			api.sendMessage({
				body: `📩 | ${file}.𝒋𝒔 𝑭𝒂𝒊𝒍𝒕𝒊 𝒕𝒐𝒎𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒍𝒄𝒄𝒉𝒆!`,
				attachment: fs.createReadStream(txtFilePath)
			}, uid, (err) => {
				if (err) {
					api.sendMessage(`❌ | 𝑬𝒓𝒓𝒐𝒓 𝒔𝒆𝒏𝒅𝒊𝒏𝒈 𝒇𝒊𝒍𝒆 𝒕𝒐 ${namee}: ${err.message}`, event.threadID);
				} else {
					api.sendMessage(`✅ | ${namee} 𝒆𝒓 𝒌𝒂𝒄𝒉𝒆 𝒇𝒂𝒊𝒍 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒍𝒆𝒄𝒄𝒉𝒆!`, event.threadID);
				}
				fs.unlinkSync(txtFilePath); // Clean up the temporary .txt file
			});
			break;

		case "thread":
			api.sendMessage({
				body: `📩 | ${file}.𝒋𝒔 𝑭𝒂𝒊𝒍𝒕𝒊 𝒆𝒊 𝒈𝒓𝒖𝒑𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒍𝒄𝒄𝒉𝒆!`,
				attachment: fs.createReadStream(txtFilePath)
			}, event.threadID, (err) => {
				if (err) {
					api.sendMessage(`❌ | 𝑬𝒓𝒓𝒐𝒓 𝒔𝒆𝒏𝒅𝒊𝒏𝒈 𝒇𝒊𝒍𝒆 𝒕𝒐 𝒕𝒉𝒓𝒆𝒂𝒅: ${err.message}`, event.threadID);
				}
				fs.unlinkSync(txtFilePath); // Clean up the temporary .txt file
			}, event.messageID);
			break;
	}
};

// Helper functions (moved outside module.exports.onStart to be accessible by handleReaction)
function handleFileNotFound(api, event, file, type, uid, name, commandName) {
	const allJsFiles = fs.readdirSync(__dirname).filter(f => f.endsWith(".js"));
	const fileNames = allJsFiles.map(f => f.replace('.js', ''));
	const matches = stringSimilarity.findBestMatch(file, fileNames);
	
	if (matches.bestMatch.rating < 0.5) {
		return api.sendMessage(`🔍 | "${file}" 𝑵𝒂𝒎𝒆𝒓 𝑭𝒂𝒊𝒍 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂!`, event.threadID);
	}

	const closestMatch = matches.bestMatch.target;
	const message = `🔍 | "${file}" 𝑵𝒂𝒎𝒆𝒓 𝑭𝒂𝒊𝒍 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂!\n✨ | 𝑪𝒍𝒐𝒔𝒆𝒔𝒕 𝑴𝒂𝒕𝒄𝒉: ${closestMatch}.𝒋𝒔\n` + 
				   `🔰 | 𝑹𝒆𝒂𝒄𝒕 𝒕𝒐 𝒕𝒉𝒊𝒔 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒕𝒐 𝒔𝒆𝒏𝒅 ${type === 'user' ? `to ${name}` : 'in this group'}`;

	return api.sendMessage(message, event.threadID, (err, info) => {
		if (err) {
			console.error("Error sending reaction message:", err);
			return;
		}
		global.client.handleReaction.push({
			type,
			name: commandName, // Use the passed commandName here
			author: event.senderID,
			messageID: info.messageID,
			file: closestMatch,
			uid: uid || null,
			namee: name || null
		});
	});
}

async function sendFileToUser(api, event, file, uid, name) {
	const txtFile = file.replace('.js', '.txt');
	const sourcePath = __dirname + '/' + file;
	const tempPath = __dirname + '/' + txtFile;

	if (!fs.existsSync(sourcePath)) {
		return api.sendMessage(`🔴 | 𝑭𝒊𝒍𝒆 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅 𝒂𝒕 ${sourcePath}`, event.threadID);
	}
	
	fs.copyFileSync(sourcePath, tempPath);
	
	api.sendMessage({
		body: `📩 | ${file} 𝑭𝒂𝒊𝒍𝒕𝒊 𝒕𝒐𝒎𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒍𝒄𝒄𝒉𝒆!`,
		attachment: fs.createReadStream(tempPath)
	}, uid, async (err) => {
		if (err) {
			api.sendMessage(`❌ | 𝑬𝒓𝒓𝒐𝒓 𝒔𝒆𝒏𝒅𝒊𝒏𝒈 𝒇𝒊𝒍𝒆 𝒕𝒐 ${name}: ${err.message}`, event.threadID);
		} else {
			api.sendMessage(`✅ | ${name} 𝒆𝒓 𝒌𝒂𝒄𝒉𝒆 ${file} 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒍𝒆𝒄𝒄𝒉𝒆!`, event.threadID);
		}
		fs.unlinkSync(tempPath); // Clean up the temporary .txt file
	});
}

function sendFileToThread(api, event, file) {
	const txtFile = file.replace('.js', '.txt');
	const sourcePath = __dirname + '/' + file;
	const tempPath = __dirname + '/' + txtFile;

	if (!fs.existsSync(sourcePath)) {
		return api.sendMessage(`🔴 | 𝑭𝒊𝒍𝒆 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅 𝒂𝒕 ${sourcePath}`, event.threadID);
	}
	
	fs.copyFileSync(sourcePath, tempPath);
	
	api.sendMessage({
		body: `📩 | ${file} 𝑭𝒂𝒊𝒍𝒕𝒊 𝒆𝒊 𝒈𝒓𝒖𝒑𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒍𝒄𝒄𝒉𝒆!`,
		attachment: fs.createReadStream(tempPath)
	}, event.threadID, (err) => {
		if (err) {
			api.sendMessage(`❌ | 𝑬𝒓𝒓𝒐𝒓 𝒔𝒆𝒏𝒅𝒊𝒏𝒈 𝒇𝒊𝒍𝒆 𝒕𝒐 𝒕𝒉𝒓𝒆𝒂𝒅: ${err.message}`, event.threadID);
		}
		fs.unlinkSync(tempPath); // Clean up the temporary .txt file
	}, event.messageID);
}
