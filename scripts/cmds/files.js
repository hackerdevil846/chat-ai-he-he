module.exports.config = {
    name: "file",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒇𝒐𝒍𝒅𝒆𝒓 𝒆𝒓 𝒇𝒊𝒍𝒆 𝒃𝒂 𝒇𝒐𝒍𝒅𝒆𝒓 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
    commandCategory: "𝑨𝒅𝒎𝒊𝒏",
    usages: "\n𝒇𝒊𝒍𝒆 𝒔𝒕𝒂𝒓𝒕 <𝒕𝒆𝒙𝒕>\n𝒇𝒊𝒍𝒆 𝒆𝒙𝒕 <𝒕𝒆𝒙𝒕>\n𝒇𝒊𝒍𝒆 <𝒕𝒆𝒙𝒕>\n𝒇𝒊𝒍𝒆 [𝒍𝒆𝒂𝒗𝒆 𝒃𝒍𝒂𝒏𝒌]\n𝒇𝒊𝒍𝒆 𝒉𝒆𝒍𝒑\n𝑵𝒐𝒕𝒆: <𝒕𝒆𝒙𝒕> 𝒂𝒑𝒏𝒊 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒂𝒓 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓",
    cooldowns: 5
};

module.exports.handleReply = ({ api, event, args, handleReply }) => {
    if(event.senderID != handleReply.author) return; 
    const fs = require("fs-extra");
    var arrnum = event.body.split(" ");
    var msg = "";
    var nums = arrnum.map(n => parseInt(n));

    for(let num of nums) {
        var target = handleReply.files[num-1];
        var fileOrdir = fs.statSync(__dirname+'/'+target);
        if(fileOrdir.isDirectory() == true) {
            var typef = "[𝑭𝒐𝒍𝒅𝒆𝒓🗂️]";
            fs.rmdirSync(__dirname+'/'+target, {recursive: true});
        }
        else if(fileOrdir.isFile() == true) {
            var typef = "[𝑭𝒊𝒍𝒆📄]";
            fs.unlinkSync(__dirname+"/"+target);
        }
        msg += typef+' '+handleReply.files[num-1]+"\n";
    }
    api.sendMessage("⚡️𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒇𝒐𝒍𝒅𝒆𝒓 𝒆𝒓 𝒅𝒆𝒍𝒆𝒕𝒆𝒅 𝒇𝒊𝒍𝒆𝒃𝒂 𝒇𝒐𝒍𝒅𝒆𝒓:\n\n"+msg, event.threadID, event.messageID);
}

module.exports.run = async function({ api, event, args }) {
    const fs = require("fs-extra");
    var files = fs.readdirSync(__dirname+"/") || [];
    var msg = "", i = 1;

    if(args[0] == 'help') {
        var helpMsg = `
⚙️ 𝑯𝒐𝒘 𝒕𝒐 𝒖𝒔𝒆:
•𝒌𝒆𝒚: 𝒔𝒕𝒂𝒓𝒕 <𝒕𝒆𝒙𝒕>
•𝒆𝒇𝒇𝒆𝒄𝒕: 𝑺𝒑𝒆𝒄𝒊𝒇𝒊𝒄 𝒔𝒕𝒂𝒓𝒕𝒊𝒏𝒈 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝒅𝒊𝒚𝒆 𝒇𝒊𝒍𝒆 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂𝒓
•𝒖𝒅𝒂𝒉𝒂𝒓𝒐𝒏: 𝒇𝒊𝒍𝒆 𝒔𝒕𝒂𝒓𝒕 𝒓𝒂𝒏𝒌
•𝒌𝒆𝒚: 𝒆𝒙𝒕 <𝒕𝒆𝒙𝒕>
•𝒆𝒇𝒇𝒆𝒄𝒕: 𝑺𝒑𝒆𝒄𝒊𝒇𝒊𝒄 𝒆𝒙𝒕𝒆𝒏𝒔𝒊𝒐𝒏 𝒅𝒊𝒚𝒆 𝒇𝒊𝒍𝒆 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂𝒓
•𝒌𝒆𝒚: 𝒍𝒆𝒂𝒗𝒆 𝒃𝒍𝒂𝒏𝒌
•𝒆𝒇𝒇𝒆𝒄𝒕: 𝑺𝒐𝒃 𝒇𝒊𝒍𝒆 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂𝒓
•𝒌𝒆𝒚: 𝒉𝒆𝒍𝒑
•𝒆𝒇𝒇𝒆𝒄𝒕: 𝑯𝒆𝒍𝒑 𝒎𝒆𝒏𝒖 𝒅𝒆𝒌𝒉𝒂𝒓`;
        
        return api.sendMessage(helpMsg, event.threadID, event.messageID);
    }
    else if(args[0] == "start" && args[1]) {
        var word = args.slice(1).join(" ");
        var files = files.filter(file => file.startsWith(word));
        
        if(files.length == 0) return api.sendMessage(`⚡️𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒇𝒐𝒍𝒅𝒆𝒓 𝒆𝒓 𝒌𝒐𝒏𝒐 𝒇𝒊𝒍𝒆 𝒏𝒂𝒊 𝒋𝒆𝒈𝒖𝒍𝒐 𝒔𝒖𝒓𝒖 𝒉𝒐𝒚: ${word}`, event.threadID, event.messageID);
        var key = `⚡️${files.length} 𝒕𝒂 𝒇𝒊𝒍𝒆 𝒑𝒂𝒘𝒂 𝒈𝒆𝒄𝒉𝒆 𝒚𝒆𝒈𝒖𝒍𝒐 𝒔𝒖𝒓𝒖 𝒉𝒐𝒚: ${word}`;
    }
    else if(args[0] == "ext" && args[1]) {
        var ext = args[1];
        var files = files.filter(file => file.endsWith(ext));
        
        if(files.length == 0) return api.sendMessage(`⚡️𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒇𝒐𝒍𝒅𝒆𝒓 𝒆𝒓 𝒌𝒐𝒏𝒐 𝒇𝒊𝒍𝒆 𝒏𝒂𝒊 𝒋𝒆𝒈𝒖𝒍𝒐 𝒔𝒆𝒔 𝒉𝒐𝒚: ${ext}`, event.threadID, event.messageID);
        var key = `⚡️${files.length} 𝒕𝒂 𝒇𝒊𝒍𝒆 𝒑𝒂𝒘𝒂 𝒈𝒆𝒄𝒉𝒆 𝒚𝒆𝒈𝒖𝒍𝒐 𝒔𝒆𝒔 𝒉𝒐𝒚: ${ext}`;
    }
    else if (!args[0]) {
        if(files.length == 0) return api.sendMessage("⚡️𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒇𝒐𝒍𝒅𝒆𝒓 𝒆𝒓 𝒌𝒐𝒏𝒐 𝒇𝒊𝒍𝒆 𝒃𝒂 𝒇𝒐𝒍𝒅𝒆𝒓 𝒏𝒂𝒊", event.threadID, event.messageID);
        var key = "⚡️𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒇𝒐𝒍𝒅𝒆𝒓 𝒆𝒓 𝒔𝒐𝒃 𝒇𝒊𝒍𝒆:";
    }
    else {
        var word = args.slice(0).join(" ");
        var files = files.filter(file => file.includes(word));
        if(files.length == 0) return api.sendMessage(`⚡️𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒇𝒐𝒍𝒅𝒆𝒓 𝒆𝒓 𝒌𝒐𝒏𝒐 𝒇𝒊𝒍𝒆 𝒏𝒂𝒊 𝒏𝒂𝒎 𝒆𝒓 𝒎𝒐𝒅𝒅𝒉𝒆 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆: ${word}`, event.threadID, event.messageID);
        var key = `⚡️${files.length} 𝒕𝒂 𝒇𝒊𝒍𝒆 𝒑𝒂𝒘𝒂 𝒈𝒆𝒄𝒉𝒆 𝒏𝒂𝒎 𝒆𝒓 𝒎𝒐𝒅𝒅𝒉𝒆 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆: ${word}`;
    }

    files.forEach(file => {
        var fileOrdir = fs.statSync(__dirname+'/'+file);
        if(fileOrdir.isDirectory() == true) var typef = "[𝑭𝒐𝒍𝒅𝒆𝒓🗂️]";
        if(fileOrdir.isFile() == true) var typef = "[𝑭𝒊𝒍𝒆📄]";
        msg += (i++)+'. '+typef+' '+file+'\n';
    });
    
    api.sendMessage(`⚡️𝑵𝒖𝒎𝒃𝒆𝒓 𝒅𝒊𝒚𝒆 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒆 𝒔𝒆𝒍𝒆𝒄𝒕𝒆𝒅 𝒇𝒊𝒍𝒆 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒖𝒏, 𝒆𝒌𝒂𝒅𝒉𝒊𝒌 𝒆𝒌𝒂𝒅𝒉𝒊𝒌 𝒏𝒖𝒎𝒃𝒆𝒓 𝒔𝒑𝒂𝒄𝒆 𝒅𝒊𝒚𝒆 𝒂𝒍𝒂𝒅𝒂 𝒌𝒐𝒓𝒖𝒏\n${key}\n\n`+msg, 
    event.threadID, (e, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            files
        })
    });
}
