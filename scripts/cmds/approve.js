module.exports.config = {
	name: "approve",
	version: "1.0.2",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒈𝒓𝒐𝒖𝒑 𝒌𝒆 𝒂𝒑𝒑𝒓𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒃𝒐𝒕 𝒅𝒊𝒚𝒆",
	commandCategory: "Admin",
    cooldowns: 5
};

const dataPath = __dirname + "/Priyanshu/approvedThreads.json";
const dataPending = __dirname + "/Priyanshu/pendingdThreads.json";
const fs = require("fs");

module.exports.onLoad = () => {
	if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
    if (!fs.existsSync(dataPending)) fs.writeFileSync(dataPending, JSON.stringify([]));
}

module.exports.handleReply = async function ({ event, api, handleReply, args }) {
    if (handleReply.author != event.senderID) return;
    const { body, threadID, messageID } = event;
    const { type } = handleReply;
    let data = JSON.parse(fs.readFileSync(dataPath));
    let dataP = JSON.parse(fs.readFileSync(dataPending));
    let idBox = (args[0]) ? args[0] : threadID;
    
    switch (type) {
        case "pending": {
            switch (body) {
                case `A`: {
                    data.push(idBox);
                    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
                    api.sendMessage(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅: ${idBox}`, threadID, () => {
                        dataP.splice(dataP.indexOf(idBox), 1;
                        fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));
                    }, messageID);
                }
            }
        }
    }
}

module.exports.run = async ({ event, api, args, Threads, Users }) => {
	const { threadID, messageID } = event;
	let data = JSON.parse(fs.readFileSync(dataPath));
    let dataP = JSON.parse(fs.readFileSync(dataPending));
    let idBox = (args[0]) ? args[0] : threadID;
  
    // Helper function for Mathematical Bold Italic
    const toBI = (text) => {
        const map = {
            'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆',
            'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
            'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐',
            'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
            'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚',
            'z': '𝒛', 'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫',
            'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰',
            'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵',
            'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺',
            'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿',
            'Y': '𝒀', 'Z': '𝒁', 
            '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
            '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
        };
        return text.split('').map(char => map[char] || char).join('');
    };

    const tst = (await Threads.getData(String(event.threadID))).data || {};
    const pb = (tst.hasOwnProperty("PREFIX")) ? tst.PREFIX : global.config.PREFIX;
    const nmdl = toBI(this.config.name);
    const cre = toBI(this.config.credits);
  
    const helpMessage = `🎭 ${toBI("APPROVE COMMANDS")} 🎭

${toBI(pb + nmdl)} ${toBI('l')}/${toBI('list')} ➺ 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝒈𝒓𝒐𝒖𝒑 𝒅𝒆𝒌𝒉𝒃𝒆𝒏
${toBI(pb + nmdl)} ${toBI('p')}/${toBI('pending')} ➺ 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒈𝒓𝒐𝒖𝒑 𝒅𝒆𝒌𝒉𝒃𝒆𝒏
${toBI(pb + nmdl)} ${toBI('d')}/${toBI('del')} [𝒊𝒅] ➺ 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝒍𝒊𝒔𝒕 𝒕𝒉𝒆𝒌𝒆 𝒎𝒖𝒄𝒉𝒃𝒆𝒏
${toBI(pb + nmdl)} [𝒊𝒅] ➺ 𝒈𝒓𝒐𝒖𝒑 𝒌𝒆 𝒂𝒑𝒑𝒓𝒐𝒗𝒆 𝒌𝒐𝒓𝒃𝒆𝒏

${toBI("Created by:")} ${cre}`;
        
    if (args[0] == "list" || args[0] == "l") {
        let msg = `${toBI("APPROVED GROUPS")} [${data.length}]:`;
        let count = 0;
        for (e of data) {
            let threadInfo = await api.getThreadInfo(e);
            let threadName = threadInfo.threadName || await Users.getNameUser(e);
            msg += `\n〘${count+=1}〙» ${threadName}\n${e}`;
        }
        api.sendMessage(msg, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "a",
            });
        }, messageID);
    }
    else if (args[0] == "pending" || args[0] == "p") {
        let msg = `${toBI("PENDING GROUPS")} [${dataP.length}]:`;
        let count = 0;
        for (e of dataP) {
            let threadInfo = await api.getThreadInfo(e);
            let threadName = threadInfo.threadName || await Users.getNameUser(e);
            msg += `\n〘${count+=1}〙» ${threadName}\n${e}`;
        }
        api.sendMessage(msg, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "pending",
            });
        }, messageID);
    }
    else if (args[0] == "help" || args[0] == "h") {
        return api.sendMessage(helpMessage, threadID, messageID);
    }
    else if (args[0] == "del" || args[0] == "d") {
        idBox = args[1] || threadID;
        if (isNaN(parseInt(idBox))) return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝑰𝑫", threadID, messageID);
        if (!data.includes(idBox)) return api.sendMessage("❌ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝒏𝒂𝒉𝒊", threadID, messageID);
        api.sendMessage(`❌ 𝑨𝒑𝒑𝒓𝒐𝒗𝒂𝒍 𝒄𝒂𝒏𝒄𝒆𝒍𝒆𝒅`, idBox);
        api.sendMessage(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒓𝒆𝒎𝒐𝒗𝒆𝒅 𝒇𝒓𝒐𝒎 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝒍𝒊𝒔𝒕`, threadID, () => {
            data.splice(data.indexOf(idBox), 1);
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        }, messageID);
    }
    else if (isNaN(parseInt(idBox))) api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝑰𝑫", threadID, messageID);
    else if (data.includes(idBox)) api.sendMessage(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅`, threadID, messageID);
    else {
        let admID = "61571630409265";
        const userName = (await api.getUserInfo(admID))[admID].name;
        
        // Beautiful approval message design
        const approvalMessage = `✨ 𝑨𝒑𝒏𝒂𝒓 𝑮𝒓𝒐𝒖𝒑 𝑨𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝑯𝒐𝒚𝒆𝒄𝒉𝒆! ✨

🖤 𝑩𝒐𝒕 𝑼𝒔𝒆 𝑲𝒐𝒓𝒆𝒏 𝑬𝒏𝒋𝒐𝒚 𝑲𝒐𝒓𝒆𝒏! 🖤

💝🥀 𝑶𝒘𝒏𝒆𝒓: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅 💫
🖤 𝑨𝒑𝒏𝒊 𝑻𝒂𝒌𝒆 𝑩𝒐𝒍𝒕𝒆 𝑷𝒂𝒓𝒆𝒏: 𝑨𝒔𝒊𝒇 🖤
😳 𝑻𝒂𝒓 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑰𝑫: https://www.facebook.com/${admID} 🤓
👋 𝑱𝒐𝒅𝒊 𝑲𝒐𝒏𝒐 𝑺𝒐𝒎𝒐𝒔𝒔𝒂 𝑯𝒐𝒊 𝑻𝒆𝒍𝒆𝒈𝒓𝒂𝒎-𝒆 𝑪𝒐𝒏𝒕𝒂𝒄𝒕 𝑲𝒐𝒓𝒖𝒏: @𝑨𝒔𝒊𝒇_𝑴𝒂𝒎𝒖𝒅 👉`;
        
        api.sendMessage(approvalMessage, idBox, async (error, info) => {
            if (error) return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 - 𝑴𝒂𝒌𝒆 𝒔𝒖𝒓𝒆 𝑰'𝒎 𝒊𝒏 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑", threadID, messageID);
            
            api.changeNickname(` 〖 ${global.config.PREFIX} 〗 ➺ ${global.config.BOTNAME || ""}`, idBox, global.data.botID);
            
            try {
                const axios = require('axios');
                const request = require('request');
                const res = await axios.get('https://anime.apibypriyansh.repl.co/img/anime');
                let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
                const path = __dirname + `/cache/approve.${ext}`;
                
                await new Promise((resolve) => {
                    request(res.data.url).pipe(fs.createWriteStream(path)).on("close", resolve);
                });
                
                // Beautiful bot activation message
                const activationMessage = `✅ 𝑩𝑶𝑻 𝑨𝑪𝑻𝑰𝑽𝑨𝑻𝑬𝑫

━━━━━━━━━━━━━━━━━━
┏━━━━ 🖤 ━━━━┓
  ✦❥⋆⃝𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅✦ 
┗━━━━ 🖤 ━━━━┛
━━━━━━━━━━━━━━━━━━
➪ 𝑩𝒐𝒕: ${global.config.BOTNAME || "N/A"}
➪ 𝑷𝒓𝒆𝒇𝒊𝒙: ${global.config.PREFIX}
➪ 𝑼𝒔𝒆𝒓𝒔: ${global.data.allUserID.length}
➪ 𝑮𝒓𝒐𝒖𝒑𝒔: ${global.data.allThreadID.length}
━━━━━━━━━━━━━━━━━━
[]---------------------------------------[]
𝑼𝒔𝒆 '${global.config.PREFIX}𝒉𝒆𝒍𝒑' 𝒕𝒐 𝒗𝒊𝒆𝒘 𝒂𝒍𝒍 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔!
[]---------------------------------------[]
⌨ 𝑴𝒂𝒅𝒆 𝒃𝒚: ${userName}`;
                
                api.sendMessage({
                    body: activationMessage,
                    mentions: [{
                        tag: userName,
                        id: admID,
                        fromIndex: 0
                    }],
                    attachment: fs.createReadStream(path)
                }, idBox, () => fs.unlinkSync(path));
            } catch (e) {
                console.error(e);
            }
            
            data.push(idBox);
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
            api.sendMessage(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅: ${idBox}`, threadID, () => {
                dataP.splice(dataP.indexOf(idBox), 1);
                fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));
            }, messageID);
        });
    }
};
