const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
	name: "note",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑷𝒓𝒐𝒕𝒊 𝒈𝒓𝒐𝒖𝒑𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒏𝒐𝒕𝒆 𝒃𝒐𝒔𝒉𝒂𝒏𝒐",
	commandCategory: "𝑩𝒐𝒙 𝒄𝒉𝒂𝒕",
	usages: "[𝒂𝒅𝒅/𝒓𝒆𝒎𝒐𝒗𝒆/𝒂𝒍𝒍] [𝒏𝒐𝒕𝒆]",
	cooldowns: 5,
	dependencies: {
        "fs-extra": "",
        "path": ""
    }
}

module.exports.onLoad = () => {
    const { existsSync, writeFileSync } = fs;
    const pathData = path.join(__dirname, "cache", "notes.json");
    if (!existsSync(pathData)) writeFileSync(pathData, "[]", "utf-8"); 
}

module.exports.run = async ({ event, api, args, permssion }) => {
    const { threadID, messageID, senderID } = event;
    const { readFileSync, writeFileSync } = fs;
    const pathData = path.join(__dirname, "cache", "notes.json");
    
    let dataJson = [];
    try {
        dataJson = JSON.parse(readFileSync(pathData, "utf-8")) || [];
    } catch (e) {
        dataJson = [];
    }
    
    const thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };
    const content = args.slice(1).join(" ");

    switch (args[0]?.toLowerCase()) {
        case "add": {
            if (permssion !== 2) return api.sendMessage("𝑵𝒐𝒕𝒆: 𝑨𝒑𝒏𝒂𝒓 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒏𝒆𝒊, 𝒔𝒖𝒅𝒉𝒖 𝒂𝒅𝒎𝒊𝒏𝒓𝒂 𝒆𝒊 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒃𝒆𝒏", threadID, messageID);
            if (!content) return api.sendMessage("𝑵𝒐𝒕𝒆: 𝑵𝒐𝒕𝒆𝒓 𝒊𝒏𝒇𝒐 𝒌𝒉𝒂𝒍𝒊 𝒓𝒂𝒌𝒉𝒂 𝒋𝒂𝒃𝒆 𝒏𝒂", threadID, messageID);
            
            content.split("\n").forEach(line => {
                if (line.trim()) thisThread.listRule.push(line.trim());
            });
            
            api.sendMessage('𝑵𝒐𝒕𝒆: 𝑵𝒐𝒕𝒆𝒕𝒊 𝒔𝒐𝒎𝒖𝒉𝒐𝒔𝒔𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐! ✨📝', threadID, messageID);
            break;
        }
        
        case "list":
        case "all": {
            if (!thisThread.listRule.length) return api.sendMessage("𝑵𝒐𝒕𝒆: 𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒐𝒖𝒑𝒆𝒓 𝒌𝒐𝒏𝒐 𝒏𝒐𝒕𝒆 𝒏𝒆𝒊", threadID, messageID);
            
            let msg = "𝑮𝒓𝒐𝒖𝒑𝒆𝒓 𝒏𝒐𝒕𝒆𝒓 𝒍𝒊𝒔𝒕: 📋\n\n";
            thisThread.listRule.forEach((item, index) => {
                msg += `${index + 1}. ${item}\n`;
            });
            api.sendMessage(msg, threadID, messageID);
            break;
        }
        
        case "rm":
        case "remove":
        case "delete": {
            if (permssion !== 2) return api.sendMessage("𝑵𝒐𝒕𝒆: 𝑨𝒑𝒏𝒂𝒓 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒏𝒆𝒊, 𝒔𝒖𝒅𝒉𝒖 𝒂𝒅𝒎𝒊𝒏𝒓𝒂 𝒏𝒐𝒕𝒆 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒃𝒆", threadID, messageID);
            if (!thisThread.listRule.length) return api.sendMessage("𝑵𝒐𝒕𝒆: 𝑫𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒌𝒐𝒏𝒐 𝒏𝒐𝒕𝒆 𝒏𝒆𝒊", threadID, messageID);
            
            if (content === "all") {
                thisThread.listRule = [];
                api.sendMessage("𝑵𝒐𝒕𝒆: 𝑺𝒐𝒃 𝒏𝒐𝒕𝒆 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐! 🗑️", threadID, messageID);
            } else if (!isNaN(content) && content > 0) {
                const index = parseInt(content) - 1;
                if (index >= 0 && index < thisThread.listRule.length) {
                    const removed = thisThread.listRule.splice(index, 1);
                    api.sendMessage(`𝑵𝒐𝒕𝒆: ${index + 1} 𝒏𝒐𝒎𝒃𝒐𝒓 𝒏𝒐𝒕𝒆 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐! 🗑️`, threadID, messageID);
                } else {
                    api.sendMessage("𝑵𝒐𝒕𝒆: 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒏𝒐𝒕𝒆 𝒏𝒖𝒎𝒃𝒆𝒓", threadID, messageID);
                }
            } else {
                api.sendMessage("𝑵𝒐𝒕𝒆: 𝑼𝒔𝒆: .𝒏𝒐𝒕𝒆 𝒓𝒆𝒎𝒐𝒗𝒆 [𝒏𝒖𝒎𝒃𝒆𝒓] 𝒐𝒓 .𝒏𝒐𝒕𝒆 𝒓𝒆𝒎𝒐𝒗𝒆 𝒂𝒍𝒍", threadID, messageID);
            }
            break;
        }
        
        default: {
            if (thisThread.listRule.length) {
                let msg = "𝑮𝒓𝒐𝒖𝒑𝒆𝒓 𝒏𝒐𝒕𝒆𝒓 𝒍𝒊𝒔𝒕: 📋\n\n";
                thisThread.listRule.forEach((item, index) => {
                    msg += `${index + 1}. ${item}\n`;
                });
                api.sendMessage(msg, threadID, messageID);
            } else {
                api.sendMessage("𝑵𝒐𝒕𝒆: 𝑬𝒊 𝒈𝒓𝒐𝒖𝒑𝒆 𝒌𝒐𝒏𝒐 𝒏𝒐𝒕𝒆 𝒏𝒆𝒊", threadID, messageID);
            }
            return;
        }
    }

    if (!dataJson.some(item => item.threadID == threadID)) {
        dataJson.push(thisThread);
    } else {
        dataJson = dataJson.map(item => 
            item.threadID === threadID ? thisThread : item
        );
    }
    
    writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
}
