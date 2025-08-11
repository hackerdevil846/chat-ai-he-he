module.exports.config = {
	name: "clearcache",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑫𝒆𝒍𝒆𝒕𝒆 𝒄𝒂𝒄𝒉𝒆 𝒇𝒊𝒍𝒆/𝒇𝒐𝒍𝒅𝒆𝒓",
	commandCategory: "𝒔𝒚𝒔𝒕𝒆𝒎",
	usages: "",
	cooldowns: 2
};

module.exports.run = async function ({ event, api, Currencies, args, Threads }) {
const { writeFileSync, readdirSync, existsSync, unlinkSync } = require('fs-extra');
const permission = ["61571630409265"]; // Your specified UID
if (!permission.includes(event.senderID)) {
    return api.sendMessage("𝑪𝒉𝒐𝒓𝒖 𝒐𝒏𝒍𝒚.", event.threadID, event.messageID);
}

if(!args[0]){ 
    return api.sendMessage('𝒀𝒐𝒖 𝒉𝒂𝒗𝒆 𝒏𝒐𝒕 𝒆𝒏𝒕𝒆𝒓𝒆𝒅 𝒕𝒉𝒆 𝒇𝒊𝒍𝒆 𝒆𝒙𝒕𝒆𝒏𝒔𝒊𝒐𝒏 𝒏𝒆𝒆𝒅𝒆𝒅 𝒕𝒐 𝒃𝒆 𝒅𝒆𝒍𝒆𝒕𝒆𝒅', event.threadID, event.messageID);
}

const listFile = readdirSync(__dirname + '/cache').filter(item => item.endsWith("." + args[0]));
var msg = "";
for(i in listFile){
    msg += `${listFile[i]}\n`
}

return api.sendMessage(`${msg}\n\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒆𝒔𝒔 𝒀 𝒕𝒐 𝒅𝒆𝒍𝒆𝒕𝒆 𝒕𝒉𝒆 𝒇𝒐𝒍𝒍𝒐𝒘𝒊𝒏𝒈 𝒇𝒊𝒍𝒆𝒔`, event.threadID, (error, info) => {
    if(error) console.log(error);
    global.client.handleReply.push({
        step: 0,
        name: this.config.name,
        file_en: args[0],
        messageID: info.messageID,
        author: event.senderID,
    });
}, event.messageID);
}

module.exports.handleReply = async function ({ event, api, Currencies, handleReply, Threads }) {
if(handleReply.author !== event.senderID) return;

if(event.body == "Y" || event.body == "y"){
    const { readdirSync, unlinkSync } = require('fs-extra');
    const listFile = readdirSync(__dirname + '/cache').filter(item => item.endsWith("." + handleReply.file_en));
    for(i in listFile){
        unlinkSync(__dirname + '/cache/' + listFile[i]);
    }
    return api.sendMessage(`✅ 𝑫𝒆𝒍𝒆𝒕𝒆𝒅 ${listFile.length} 𝒇𝒊𝒍𝒆(𝒔) 𝒘𝒊𝒕𝒉 .${handleReply.file_en} 𝒆𝒙𝒕𝒆𝒏𝒔𝒊𝒐𝒏`, event.threadID);
}
else {
    api.sendMessage(`𝑶𝒑𝒆𝒓𝒂𝒕𝒊𝒐𝒏 𝒄𝒂𝒏𝒄𝒆𝒍𝒍𝒆𝒅.`, event.threadID);
}
}
