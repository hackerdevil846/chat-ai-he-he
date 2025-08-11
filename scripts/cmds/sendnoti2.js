module.exports.config = {
	name: "sendnoti2",
	version: "1.0.2",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑮𝒓𝒐𝒖𝒑 𝒈𝒖𝒍𝒐 𝒕𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 (𝒑𝒉𝒐𝒕𝒐/𝒗𝒊𝒅𝒆𝒐 𝒂𝒕𝒕𝒂𝒄𝒉 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒐)! 𝑺𝒆𝒏𝒅𝒏𝒐𝒕𝒊𝑼𝒘𝑼 𝒆𝒓 𝒃𝒆𝒕𝒕𝒆𝒓 𝒗𝒆𝒓𝒔𝒊𝒐𝒏",
	commandCategory: "system",
	usages: "[𝑻𝒆𝒙𝒕]",
	cooldowns: 5
};

module.exports.languages = {
	"vi": {
		"sendSuccess": "Đã gửi tin nhắn đến %1 nhóm!",
		"sendFail": "[!] Không thể gửi thông báo tới %1 nhóm"
	},
	"en": {
		"sendSuccess": "𝑺𝒂𝒕𝒉𝒆𝒌𝒂𝒓𝒎𝒐𝒕𝒆 %1 𝒕𝒊 𝒕𝒉𝒓𝒆𝒂𝒅𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒍𝒐",
		"sendFail": "[!] %1 𝒕𝒊 𝒕𝒉𝒓𝒆𝒂𝒅𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒂𝒏𝒐 𝒋𝒂𝒚𝒏𝒊"
	}
}

module.exports.run = async ({ api, event, args, getText }) => {
if (event.type == "message_reply") {
const request = global.nodemodule["request"];
const fs = require('fs')
const axios = require('axios')

var path = __dirname + `/cache/snoti.png`;
var path = __dirname + `/cache/snoti.mp3`;
var path = __dirname + `/cache/snoti.jpeg`;
var path = __dirname + `/cache/snoti.jpg`;

var abc = event.messageReply.attachments[0].url;
    let getdata = (await axios.get(`${abc}`, { responseType: 'arraybuffer' })).data;

  fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'));

	var allThread = global.data.allThreadID || [];
	var count = 1,
		cantSend = [];
	for (const idThread of allThread) {
		if (isNaN(parseInt(idThread)) || idThread == event.threadID) ""
		else {
			api.sendMessage({body:" »✦𝑨𝒅𝒎𝒊𝒏 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝒆𝒓 𝒕𝒂𝒓𝒂𝒇 𝒕𝒉𝒆𝒌𝒆 𝒆𝒌𝒕𝒊 𝒔𝒂𝒎𝒃𝒂𝒅𝒉𝒂𝒏✦«\n\n" + args.join(` `),attachment: fs.createReadStream(path) }, idThread, (error, info) => {
				if (error) cantSend.push(idThread);
			});
			count++;
			await new Promise(resolve => setTimeout(resolve, 500));
		}
	}
	return api.sendMessage(getText("sendSuccess", count), event.threadID, () => (cantSend.length > 0 ) ? api.sendMessage(getText("sendFail", cantSend.length), event.threadID, event.messageID) : "", event.messageID);

}
else {
	var allThread = global.data.allThreadID || [];
	var count = 1,
		cantSend = [];
	for (const idThread of allThread) {
		if (isNaN(parseInt(idThread)) || idThread == event.threadID) ""
		else {
			api.sendMessage(" »✦𝑨𝒅𝒎𝒊𝒏 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝒆𝒓 𝒕𝒂𝒓𝒂𝒇 𝒕𝒉𝒆𝒌𝒆 𝒆𝒌𝒕𝒊 𝒔𝒂𝒎𝒃𝒂𝒅𝒉𝒂𝒏✦«\n\n" + args.join(` `), idThread, (error, info) => {
				if (error) cantSend.push(idThread);
			});
			count++;
			await new Promise(resolve => setTimeout(resolve, 500));
		}
	}
	return api.sendMessage(getText("sendSuccess", count), event.threadID, () => (cantSend.length > 0 ) ? api.sendMessage(getText("sendFail", cantSend.length), event.threadID, event.messageID) : "", event.messageID); }
  }
