module.exports.config = {
	name: 'sendfile',
	version: '1.0.0',
	hasPermssion: 2,
	credits: '𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅',
	description: '𝑭𝒂𝒊𝒍 𝒑𝒂𝒕𝒉𝒂𝒏𝒐𝒓 𝒋𝒐𝒏𝒏𝒐 𝒂𝒅𝒎𝒊𝒏 𝒌𝒎𝒅',
	commandCategory: '𝑨𝒅𝒎𝒊𝒏',
	usages: '𝑭𝒂𝒊𝒍𝒆𝒓 𝑵𝒂𝒎',
	cooldowns: 0
}; 

module.exports.run = async ({ args, api, event, Users }) => {
const fs = require("fs-extra")
	const stringSimilarity = require('string-similarity');
	const file = args.join(" ");
	if(!file) return api.sendMessage('𝑭𝒂𝒊𝒍𝒆𝒓 𝑵𝒂𝒎 𝒌𝒉𝒂𝒍𝒊 𝒓𝒂𝒌𝒉𝒂 𝒋𝒂𝒃𝒆 𝒏𝒂', event.threadID, event.messageID);
	if (!file.endsWith('.js')) return api.sendMessage('𝑭𝒂𝒊𝒍𝒆𝒓 𝑬𝒙𝒕𝒆𝒏𝒔𝒊𝒐𝒏 .𝒋𝒔 𝒉𝒐𝒕𝒆 𝒉𝒐𝒃𝒆', event.threadID, event.messageID);
	if(event.type == "message_reply") {
		var uid = event.messageReply.senderID
		var name = (await Users.getData(uid)).name
		if(!fs.existsSync(__dirname+"/"+file)) { 
			var mdl = args.splice(1, args.length);
		  	mdl = fs.readdirSync(__dirname).filter((file) => file.endsWith(".js"))
		  	mdl = mdl.map(item => item.replace(/\.js/g, ""));
			var checker = stringSimilarity.findBestMatch(file, mdl)
		    if (checker.bestMatch.rating >= 1) var search = checker.bestMatch.target;
        	if(search == undefined) return api.sendMessage('🔎 ' + file + ' 𝑵𝒂𝒎𝒆𝒓 𝑭𝒂𝒊𝒍 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂', event.threadID, event.messageID); 
			return api.sendMessage('🔎 ' + file + ' 𝑵𝒂𝒎𝒆𝒓 𝑭𝒂𝒊𝒍 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂\n🔎 ' + search + '.𝒋𝒔 𝑵𝒂𝒎𝒆𝒓 𝑭𝒂𝒊𝒍 𝒑𝒂𝒐𝒘𝒂 𝒈𝒆𝒄𝒉𝒆\n» 𝑬𝒊 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒕𝒆 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏 𝒅𝒊𝒍𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒂𝒃𝒆', event.threadID, (error, info) => {
	        global.client.handleReaction.push({
	        	type: 'user',
	            name: this.config.name,
	            author: event.senderID,
	            messageID: info.messageID,
	            file: search,
	            uid: uid,
	            namee: name
	        })}, event.messageID);
		}
		fs.copyFile(__dirname + '/'+file, __dirname + '/'+ file.replace(".js",".txt"));
		return api.sendMessage({
			body: '» ' + file + ' 𝑭𝒂𝒊𝒍𝒕𝒊 𝒕𝒐𝒎𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒍𝒐', 
			attachment: fs.createReadStream(__dirname + '/' + file.replace('.js', '.txt'))
		}, uid, () => fs.unlinkSync(__dirname + '/' + file.replace('.js', '.txt'))).then(
            api.sendMessage('» ' + name + ' 𝒆𝒓 𝒌𝒂𝒄𝒉𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒅𝒆𝒌𝒉𝒐', event.threadID, (error, info) => {
            	if(error) return api.sendMessage('» ' + name + ' 𝒌𝒆 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒕𝒆 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒄𝒄𝒉𝒆', event.threadID, event.messageID);
            }, event.messageID));
	}
	else {
		if(!fs.existsSync(__dirname+"/"+file)) { 
			var mdl = args.splice(1, args.length);
		  	mdl = fs.readdirSync(__dirname).filter((file) => file.endsWith(".js"))
		  	mdl = mdl.map(item => item.replace(/\.js/g, ""));
			var checker = stringSimilarity.findBestMatch(file, mdl)
		    if (checker.bestMatch.rating >= 0.5) var search = checker.bestMatch.target;
       		if(search == undefined) return api.sendMessage('🔎 ' + file + ' 𝑵𝒂𝒎𝒆𝒓 𝑭𝒂𝒊𝒍 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂', event.threadID, event.messageID); 
			return api.sendMessage('🔎 ' + file + ' 𝑵𝒂𝒎𝒆𝒓 𝑭𝒂𝒊𝒍 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂\n🔎 ' + search + '.𝒋𝒔 𝑵𝒂𝒎𝒆𝒓 𝑭𝒂𝒊𝒍 𝒑𝒂𝒐𝒘𝒂 𝒈𝒆𝒄𝒉𝒆\n» 𝑬𝒊 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒕𝒆 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏 𝒅𝒊𝒍𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒂𝒃𝒆', event.threadID, (error, info) => {
	        global.client.handleReaction.push({
	        	type: 'thread',
	            name: this.config.name,
	            author: event.senderID,
	            messageID: info.messageID,
	            file: search
	        })}, event.messageID);
		}
		fs.copyFile(__dirname + '/'+file, __dirname + '/'+ file.replace(".js",".txt"));
		return api.sendMessage({
			body: '» ' + file + ' 𝑭𝒂𝒊𝒍𝒕𝒊 𝒆𝒊 𝒈𝒓𝒖𝒑𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒍𝒐', 
			attachment: fs.createReadStream(__dirname + '/' + file.replace('.js', '.txt'))
		}, event.threadID, () => fs.unlinkSync(__dirname + '/' + file.replace('.js', '.txt')), event.messageID);
	}
}
module.exports.handleReaction = ({ Users, api, event, handleReaction,  }) => {
    var { file, author, type, uid, namee } = handleReaction;
    if (event.userID != handleReaction.author) return;
    const fs = require("fs-extra")
    var fileSend = file + '.js'
    switch (type) {
    	case "user": {
		    fs.copyFile(__dirname + '/'+fileSend, __dirname + '/'+ fileSend.replace(".js",".txt"));
		    api.unsendMessage(handleReaction.messageID)
			return api.sendMessage({
				body: '» ' + file + ' 𝑭𝒂𝒊𝒍𝒕𝒊 𝒕𝒐𝒎𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒍𝒐', 
				attachment: fs.createReadStream(__dirname + '/' + fileSend.replace('.js', '.txt'))
			}, uid, () => fs.unlinkSync(__dirname + '/' + fileSend.replace('.js', '.txt'))).then(
            api.sendMessage('» ' + namee + ' 𝒆𝒓 𝒌𝒂𝒄𝒉𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒅𝒆𝒌𝒉𝒐', event.threadID, (error, info) => {
            	if(error) return api.sendMessage('» ' + namee + ' 𝒌𝒆 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒕𝒆 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒄𝒄𝒉𝒆', event.threadID, event.messageID);
            }, event.messageID));;
		}
		case "thread": {
			fs.copyFile(__dirname + '/'+fileSend, __dirname + '/'+ fileSend.replace(".js",".txt"));
		    api.unsendMessage(handleReaction.messageID)
			return api.sendMessage({
				body: '» ' + file + ' 𝑭𝒂𝒊𝒍𝒕𝒊 𝒆𝒊 𝒈𝒓𝒖𝒑𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒍𝒐', 
				attachment: fs.createReadStream(__dirname + '/' + fileSend.replace('.js', '.txt'))
			}, event.threadID, () => fs.unlinkSync(__dirname + '/' + fileSend.replace('.js', '.txt')), event.messageID);
		}
	}
    }
