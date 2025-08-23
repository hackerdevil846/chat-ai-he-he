module.exports.config = {
	name: "ban",
	version: "2.0.5",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅",
	description: "𝑮𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒎𝒆𝒎𝒃𝒆𝒓 𝒅𝒆𝒓 𝒑𝒆𝒓𝒎𝒂𝒏𝒆𝒏𝒕𝒍𝒚 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 (𝑸𝑻𝑽 𝒃𝒐𝒕 𝒔𝒆𝒕 𝒌𝒐𝒓𝒂 𝒓𝒂𝒌𝒉𝒖𝒏)",
	category: "𝒈𝒓𝒐𝒖𝒑",
	usages: "[𝒌𝒆𝒚]",
	cooldowns: 5,
	info: [
		{
			key: '[𝒕𝒂𝒈] 𝒃𝒂 [𝒓𝒆𝒑𝒍𝒚 𝒎𝒆𝒔𝒔𝒂𝒈𝒆] "𝒓𝒆𝒂𝒔𝒐𝒏"',
			prompt: '𝒖𝒔𝒆𝒓 𝒌𝒆 1 𝒃𝒂𝒓 𝒂𝒓 𝒘𝒂𝒓𝒏 𝒌𝒐𝒓𝒂',
			type: '',
			example: '𝒃𝒂𝒏 [𝒕𝒂𝒈] "𝒘𝒂𝒓𝒏 𝒌𝒐𝒓𝒂𝒓 𝒓𝒆𝒂𝒔𝒐𝒏"'
  		},
		{
			key: '𝒍𝒊𝒔𝒕𝒃𝒂𝒏',
			prompt: '𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒖𝒔𝒆𝒓 𝒅𝒆𝒓 𝒍𝒊𝒔𝒕 𝒅𝒆𝒌𝒉𝒕𝒆',
			type: '',
			example: '𝒃𝒂𝒏 𝒍𝒊𝒔𝒕𝒃𝒂𝒏'
  		},
		{
			key: '𝒖𝒃𝒂𝒏',
			prompt: '𝒃𝒂𝒏 𝒍𝒊𝒔𝒕 𝒕𝒉𝒆𝒌𝒆 𝒖𝒔𝒆𝒓 𝒌𝒆 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒂',
			type: '',
			example: '𝒃𝒂𝒏 𝒖𝒃𝒂𝒏 [𝒖𝒔𝒆𝒓 𝒊𝒅]'
  		},
		{
			key: '𝒗𝒊𝒆𝒘',
			prompt: '"𝒕𝒂𝒈" 𝒃𝒂 "𝒃𝒍𝒂𝒏𝒌" 𝒃𝒂 "𝒗𝒊𝒆𝒘 𝒂𝒍𝒍", 𝒋𝒆𝒌𝒉𝒂𝒏𝒆 𝒕𝒂𝒈 𝒅𝒆𝒚𝒂 𝒖𝒔𝒆𝒓 𝒆𝒓 𝒘𝒂𝒓𝒏 𝒅𝒆𝒌𝒉𝒂 𝒋𝒂𝒃𝒆',
			type: '',
			example: '𝒃𝒂𝒏 𝒗𝒊𝒆𝒘 [@𝒕𝒂𝒈] / 𝒃𝒂𝒏 𝒗𝒊𝒆𝒘'
  		},
		{
			key: '𝒓𝒆𝒔𝒆𝒕',
			prompt: '𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒔𝒉𝒐𝒃 𝒅𝒂𝒕𝒂 𝒓𝒆𝒔𝒆𝒕 𝒌𝒐𝒓𝒂',
			type: '',
			example: '𝒃𝒂𝒏 𝒓𝒆𝒔𝒆𝒕'
  		}
  	]
};

module.exports.run = async function({ api, args, Users, event, Threads, utils, client }) {
	let {messageID, threadID, senderID} = event;
	var info = await api.getThreadInfo(threadID);
	if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
		return api.sendMessage('❌ 𝑩𝒐𝒕𝒌𝒆 𝒈𝒓𝒐𝒖𝒑 𝒂𝒅𝒎𝒊𝒏 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆 𝒆𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒄𝒉𝒂𝒍𝒂𝒏𝒐𝒓 𝒋𝒐𝒏𝒏𝒐\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒆 𝒂𝒃𝒂𝒓 𝒕𝒓𝒚 𝒌𝒐𝒓𝒖𝒏!', threadID, messageID);
	
	var fs = require("fs-extra");
	
	if (!fs.existsSync(__dirname + `/cache/bans.json`)) {
		const dataaa = {warns: {}, banned: {}};
		fs.writeFileSync(__dirname + `/cache/bans.json`, JSON.stringify(dataaa));
	}
	
	var bans = JSON.parse(fs.readFileSync(__dirname + `/cache/bans.json`));
	
	if(!bans.warns.hasOwnProperty(threadID)) {
		bans.warns[threadID] = {}; 
		fs.writeFileSync(__dirname + `/cache/bans.json`, JSON.stringify(bans, null, 2));
	}
	
	if(args[0] == "view") {
		if(!args[1]) {
			var mywarn = bans.warns[threadID][senderID];
			if(!mywarn) return api.sendMessage('✅ 𝑨𝒑𝒏𝒂𝒌𝒆 𝒌𝒐𝒌𝒉𝒐𝒏𝒐 𝒘𝒂𝒓𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒏𝒊', threadID, messageID);
			var msg = "";
			for(let reasonwarn of mywarn) {
				msg += `• ${reasonwarn}\n`;
			}
			api.sendMessage(`❎ 𝑨𝒑𝒏𝒂𝒌𝒆 𝒘𝒂𝒓𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆:\n${msg}`, threadID, messageID);
		}
		else if(Object.keys(event.mentions).length != 0) {
			var message = "";
			var mentions = Object.keys(event.mentions);
			for(let id of mentions) {
				var name = (await api.getUserInfo(id))[id].name;
				var msg = "";
				var reasonarr = bans.warns[threadID][id];
				if(typeof reasonarr != "object") {
					msg += "𝑲𝒐𝒌𝒉𝒐𝒏𝒐 𝒘𝒂𝒓𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒏𝒊\n"
				} else {
					for(let reason of reasonarr) {
						msg += `• ${reason}\n`;
					}
				}
				message += `⭐️ ${name}:\n${msg}\n`;
			}
			api.sendMessage(message, threadID, messageID);
		}
		else if(args[1] == "all") {
			var dtwbox = bans.warns[threadID];
			var allwarn = "";
			for(let idtvw in dtwbox) {
				var name = (await api.getUserInfo(idtvw))[idtvw].name, msg = "";
				for(let reasonwtv of dtwbox[idtvw]) {
					msg += `• ${reasonwtv}\n`;
				}
				allwarn += `${name}:\n${msg}\n`;
			}
			allwarn == "" ? api.sendMessage("✅ 𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒐𝒖𝒑 𝒆 𝒂𝒋 𝒑𝒐𝒓𝒋𝒐𝒏𝒕𝒐 𝒌𝒆𝒖 𝒘𝒂𝒓𝒏 𝒉𝒐𝒚𝒏𝒊", threadID, messageID) : 
			api.sendMessage("❎ 𝑾𝒂𝒓𝒏 𝒉𝒐𝒚𝒆𝒄𝒉𝒆 𝒆𝒎𝒐𝒏 𝒎𝒆𝒎𝒃𝒆𝒓𝒓𝒂:\n" + allwarn, threadID, messageID);
		}
	}
	else if(args[0] == "unban") {
		var id = parseInt(args[1]), mybox = bans.banned[threadID];
		var info = await api.getThreadInfo(threadID);
		if (!info.adminIDs.some(item => item.id == senderID) && !(global.config.ADMINBOT).includes(senderID)) 
			return api.sendMessage('❎ 𝑷𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒅𝒆𝒏𝒊𝒆𝒅! 𝑺𝒉𝒖𝒅𝒉𝒖 𝒈𝒓𝒐𝒖𝒑 𝒂𝒅𝒎𝒊𝒏𝒓𝒂 𝒆𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒖𝒔𝒆 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒆𝒏', threadID, messageID);
		
		if(!id) return api.sendMessage("❎ 𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒃𝒂𝒏 𝒍𝒊𝒔𝒕 𝒕𝒉𝒆𝒌𝒆 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒖𝒔𝒆𝒓 𝒆𝒓 𝒊𝒅 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆", threadID, messageID);
		bans.banned;
		if(!mybox.includes(id)) return api.sendMessage("✅ 𝑬𝒊 𝒖𝒔𝒆𝒓 𝒌𝒆 𝒂𝒑𝒏𝒂𝒓 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒏𝒊", threadID, messageID);
		api.sendMessage(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒃𝒂𝒏 𝒍𝒊𝒔𝒕 𝒕𝒉𝒆𝒌𝒆 𝒊𝒅 ${id} 𝒘𝒂𝒍𝒂 𝒎𝒆𝒎𝒃𝒆𝒓 𝒌𝒆 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐`, threadID, messageID);
		mybox.splice(mybox.indexOf(id), 1);
		delete bans.warns[threadID][id]
		fs.writeFileSync(__dirname + `/cache/bans.json`, JSON.stringify(bans, null, 2));
	}
	else if(args[0] == "listban") {
		var mybox = bans.banned[threadID] || [];
		var msg = "";
		for(let iduser of mybox) {
			var name = (await api.getUserInfo(iduser))[iduser].name;
			msg += `╔ 𝑵𝒂𝒎𝒆: ${name}\n╚ 𝑰𝑫: ${iduser}\n\n`;
		}
		msg == "" ? api.sendMessage("✅ 𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒐𝒖𝒑 𝒆 𝒂𝒋 𝒑𝒐𝒓𝒋𝒐𝒏𝒕𝒐 𝒌𝒆𝒖 𝒃𝒂𝒏 𝒉𝒐𝒚𝒏𝒊", threadID, messageID) : 
		api.sendMessage("❎ 𝑮𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆 𝒆𝒎𝒐𝒏 𝒎𝒆𝒎𝒃𝒆𝒓𝒓𝒂:\n" + msg, threadID, messageID);
	}
	else if(args[0] == "reset") {
		var info = await api.getThreadInfo(threadID);
		if (!info.adminIDs.some(item => item.id == senderID) && !(global.config.ADMINBOT).includes(senderID)) 
			return api.sendMessage('❎ 𝑷𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒅𝒆𝒏𝒊𝒆𝒅! 𝑺𝒉𝒖𝒅𝒉𝒖 𝒈𝒓𝒐𝒖𝒑 𝒂𝒅𝒎𝒊𝒏𝒓𝒂 𝒆𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒖𝒔𝒆 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒆𝒏', threadID, messageID);
		
		bans.warns[threadID] = {};
		bans.banned[threadID] = [];
		fs.writeFileSync(__dirname + `/cache/bans.json`, JSON.stringify(bans, null, 2));
		api.sendMessage("✅ 𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒔𝒉𝒐𝒃 𝒅𝒂𝒕𝒂 𝒓𝒆𝒔𝒆𝒕 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐", threadID, messageID);
	}
	else { 
		if (event.type != "message_reply" && Object.keys(event.mentions).length == 0)	
			return utils.throwError(this.config.name, threadID, messageID);
		
		var info = await api.getThreadInfo(threadID);
		if (!info.adminIDs.some(item => item.id == senderID) && !(global.config.ADMINBOT).includes(senderID)) 
			return api.sendMessage('❎ 𝑷𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒅𝒆𝒏𝒊𝒆𝒅! 𝑺𝒉𝒖𝒅𝒉𝒖 𝒈𝒓𝒐𝒖𝒑 𝒂𝒅𝒎𝒊𝒏𝒓𝒂 𝒆𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒖𝒔𝒆 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒆𝒏', threadID, messageID);
		
		var reason = "";
		if (event.type == "message_reply") {
			var iduser = [];
			iduser.push(event.messageReply.senderID);
			reason = (args.join(" ")).trim();
		}
		else if (Object.keys(event.mentions).length != 0) {
			var iduser = Object.keys(event.mentions);
			var stringname = "";
			var nametaglength = (Object.values(event.mentions)).length;
			var namearr = Object.values(event.mentions);
			for(let i = 0; i < nametaglength; i++) {
				stringname += (Object.values(event.mentions))[i];
			}
			var message = args.join(" ");
			for(let valuemention of namearr) {
				message = message.replace(valuemention,"");
			}
			var reason = message.replace(/\s+/g, ' ');
		}
		
		var arraytag = [];
		var arrayname = [];
		
		for(let iid of iduser) {
			var id = parseInt(iid);
			var nametag = (await api.getUserInfo(id))[id].name;
			arraytag.push({id: id, tag: nametag});
			
			if(!reason) reason = "𝑲𝒐𝒏𝒐 𝒓𝒆𝒂𝒔𝒐𝒏 𝒅𝒆𝒘𝒂 𝒉𝒐𝒚𝒏𝒊";
			
			var dtwmybox = bans.warns[threadID];
			if(!dtwmybox.hasOwnProperty(id)) { 
				dtwmybox[id] = [];
			}
			
			arrayname.push(nametag);
			var pushreason = bans.warns[threadID][id];
			pushreason.push(reason);
			
			if(!bans.banned[threadID]) {
				bans.banned[threadID] = [];
			}
			
			if((bans.warns[threadID][id]).length > 0) {
				api.removeUserFromGroup(parseInt(id), threadID)
				var banned = bans.banned[threadID];
				banned.push(parseInt(id));
				fs.writeFileSync(__dirname + `/cache/bans.json`, JSON.stringify(bans, null, 2));
			}
		}
		
		api.sendMessage({body: `❎ 𝑩𝒂𝒏𝒏𝒆𝒅 𝒎𝒆𝒎𝒃𝒆𝒓𝒔 ${arrayname.join(", ")} 𝒓𝒆𝒂𝒔𝒐𝒏: ${reason} 𝒅𝒊𝒚𝒆 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒑𝒆𝒓𝒎𝒂𝒏𝒆𝒏𝒕𝒍𝒚 𝒃𝒆𝒓 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐`, mentions: arraytag}, threadID, messageID);
		fs.writeFileSync(__dirname + `/cache/bans.json`, JSON.stringify(bans, null, 2));
	}
};
