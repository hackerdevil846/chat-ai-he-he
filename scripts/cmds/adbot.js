module.exports.config = {
    name: "ckbot",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    description: "𝑩𝒐𝒕 𝒆𝒓 𝒊𝒏𝒇𝒐 𝒅𝒆𝒌𝒉𝒂𝒏𝒐 𝒆𝒓 𝒌𝒂𝒋",
    category: "Media",
    usages: "",
    cooldowns: 4,
    dependencies: {
        "request": "",
        "fs": ""
    }
};

module.exports.onStart = async ({ api, event, args }) => {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
    
    const applyStyle = (text) => {
        return text
            .split('')
            .map(char => {
                if (char >= 'A' && char <= 'Z') return String.fromCodePoint(char.charCodeAt(0) + 119937);
                if (char >= 'a' && char <= 'z') return String.fromCodePoint(char.charCodeAt(0) + 119931);
                if (char >= '0' && char <= '9') return String.fromCodePoint(char.charCodeAt(0) + 120764);
                return char;
            })
            .join('');
    };

    if (args.length == 0) return api.sendMessage(
        `${applyStyle('𝑻𝒖𝒎𝒊 𝒑𝒂𝒓𝒃𝒆:')}\n\n` +
        `${prefix}${this.config.name} ${applyStyle('user')} => ${applyStyle('𝑻𝒖𝒎𝒂𝒓 𝒏𝒊𝒋𝒆𝒓 𝒊𝒏𝒇𝒐 𝒅𝒆𝒌𝒉𝒂𝒃𝒆')}\n\n` +
        `${prefix}${this.config.name} ${applyStyle('user')} @[${applyStyle('𝑻𝒂𝒈')}] => ${applyStyle('𝑱𝒆 𝒍𝒐𝒌𝒌𝒆 𝒕𝒖𝒎𝒊 𝒕𝒂𝒈 𝒌𝒐𝒓𝒍𝒆 𝒕𝒂𝒓 𝒊𝒏𝒇𝒐 𝒅𝒆𝒌𝒉𝒂𝒃𝒆')}\n\n` +
        `${prefix}${this.config.name} ${applyStyle('box')} => ${applyStyle('𝑻𝒖𝒎𝒂𝒓 𝒃𝒐𝒙 𝒆𝒓 𝒊𝒏𝒇𝒐 (𝒎𝒆𝒎𝒃𝒆𝒓 𝒔𝒐𝒏𝒌𝒉𝒂, 𝒆𝒓𝒂 𝒆𝒓 𝒆𝒓 𝒅𝒋𝒕,...)')}\n\n` +
        `${prefix}${this.config.name} ${applyStyle('user box [uid || tid]')}\n\n` +
        `${prefix}${this.config.name} ${applyStyle('admin')} => ${applyStyle('𝑩𝒐𝒕 𝒆𝒓 𝑨𝒅𝒎𝒊𝒏 𝒆𝒓 𝒊𝒏𝒇𝒐')}`,
        event.threadID, event.messageID
    );
    
    if (args[0] == "box") {
        if (args[1]) {
            let threadInfo = await api.getThreadInfo(args[1]);
            let imgg = threadInfo.imageSrc;
            var gendernam = [];
            var gendernu = [];
            
            for (let z in threadInfo.userInfo) {
                var gioitinhone = threadInfo.userInfo[z].gender;
                if (gioitinhone == "MALE") {
                    gendernam.push(gioitinhone);
                } else {
                    gendernu.push(gioitinhone);
                }
            }
            
            var nam = gendernam.length;
            var nu = gendernu.length;
            let sex = threadInfo.approvalMode;
            var pd = sex == false ? applyStyle("𝑶𝒇𝒇") : sex == true ? applyStyle("𝑶𝒏") : applyStyle("𝑵𝑺");
            
            if (!imgg) {
                api.sendMessage(
                    `${applyStyle('𝑮𝒓𝒐𝒖𝒑 𝒏𝒂𝒎𝒆')}: ${threadInfo.threadName}\n` +
                    `${applyStyle('𝑻𝑰𝑫')}: ${args[1]}\n` +
                    `${applyStyle('𝑨𝒑𝒑𝒓𝒐𝒗𝒆𝒅')}: ${pd}\n` +
                    `${applyStyle('𝑬𝒎𝒐𝒋𝒊')}: ${threadInfo.emoji}\n` +
                    `${applyStyle('𝑰𝒏𝒇𝒐')}:\n` +
                    `» ${threadInfo.participantIDs.length} ${applyStyle('𝒎𝒆𝒎𝒃𝒆𝒓𝒔 𝒂𝒏𝒅')} ${threadInfo.adminIDs.length} ${applyStyle('𝒂𝒅𝒎𝒊𝒏𝒔')}\n` +
                    `» ${applyStyle('𝑰𝒏𝒄𝒍𝒖𝒅𝒊𝒏𝒈')} ${nam} ${applyStyle('𝒃𝒐𝒚 𝒂𝒏𝒅')} ${nu} ${applyStyle('𝒈𝒊𝒓𝒍')}\n` +
                    `» ${applyStyle('𝑻𝒐𝒕𝒂𝒍 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔')}: ${threadInfo.messageCount}.`,
                    event.threadID, event.messageID
                );
            } else {
                var callback = () => api.sendMessage({
                    body: `${applyStyle('𝑮𝒓𝒐𝒖𝒑 𝒏𝒂𝒎𝒆')}: ${threadInfo.threadName}\n` +
                          `${applyStyle('𝑻𝑰𝑫')}: ${args[1]}\n` +
                          `${applyStyle('𝑨𝒑𝒑𝒓𝒐𝒗𝒆𝒅')}: ${pd}\n` +
                          `${applyStyle('𝑬𝒎𝒐𝒋𝒊')}: ${threadInfo.emoji}\n` +
                          `${applyStyle('𝑰𝒏𝒇𝒐')}:\n` +
                          `» ${threadInfo.participantIDs.length} ${applyStyle('𝒎𝒆𝒎𝒃𝒆𝒓𝒔 𝒂𝒏𝒅')} ${threadInfo.adminIDs.length} ${applyStyle('𝒂𝒅𝒎𝒊𝒏𝒔')}\n` +
                          `» ${applyStyle('𝑰𝒏𝒄𝒍𝒖𝒅𝒊𝒏𝒈')} ${nam} ${applyStyle('𝒃𝒐𝒚 𝒂𝒏𝒅')} ${nu} ${applyStyle('𝒈𝒊𝒓𝒍')}\n` +
                          `» ${applyStyle('𝑻𝒐𝒕𝒂𝒍 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔')}: ${threadInfo.messageCount}.`,
                    attachment: fs.createReadStream(__dirname + "/cache/1.png")
                }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
                
                return request(encodeURI(`${threadInfo.imageSrc}`))
                    .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
                    .on('close', () => callback());
            }
        } else {
            let threadInfo = await api.getThreadInfo(event.threadID);
            let img = threadInfo.imageSrc;
            var gendernam = [];
            var gendernu = [];
            
            for (let z in threadInfo.userInfo) {
                var gioitinhone = threadInfo.userInfo[z].gender;
                if (gioitinhone == "MALE") {
                    gendernam.push(gioitinhone);
                } else {
                    gendernu.push(gioitinhone);
                }
            }
            
            var nam = gendernam.length;
            var nu = gendernu.length;
            let sex = threadInfo.approvalMode;
            var pd = sex == false ? applyStyle("𝑶𝒇𝒇") : sex == true ? applyStyle("𝑶𝒏") : applyStyle("𝑵𝑺");
            
            if (!img) {
                api.sendMessage(
                    `${applyStyle('𝑮𝒓𝒐𝒖𝒑 𝒏𝒂𝒎𝒆')}: ${threadInfo.threadName}\n` +
                    `${applyStyle('𝑻𝑰𝑫')}: ${event.threadID}\n` +
                    `${applyStyle('𝑨𝒑𝒑𝒓𝒐𝒗𝒆𝒅')}: ${pd}\n` +
                    `${applyStyle('𝑬𝒎𝒐𝒋𝒊')}: ${threadInfo.emoji}\n` +
                    `${applyStyle('𝑰𝒏𝒇𝒐')}:\n` +
                    `» ${threadInfo.participantIDs.length} ${applyStyle('𝒎𝒆𝒎𝒃𝒆𝒓𝒔 𝒂𝒏𝒅')} ${threadInfo.adminIDs.length} ${applyStyle('𝒂𝒅𝒎𝒊𝒏𝒔')}\n` +
                    `» ${applyStyle('𝑰𝒏𝒄𝒍𝒖𝒅𝒊𝒏𝒈')} ${nam} ${applyStyle('𝒃𝒐𝒚 𝒂𝒏𝒅')} ${nu} ${applyStyle('𝒈𝒊𝒓𝒍')}\n` +
                    `» ${applyStyle('𝑻𝒐𝒕𝒂𝒍 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔')}: ${threadInfo.messageCount}.`,
                    event.threadID, event.messageID
                );
            } else {
                var callback = () => api.sendMessage({
                    body: `${applyStyle('𝑮𝒓𝒐𝒖𝒑 𝒏𝒂𝒎𝒆')}: ${threadInfo.threadName}\n` +
                          `${applyStyle('𝑻𝑰𝑫')}: ${event.threadID}\n` +
                          `${applyStyle('𝑨𝒑𝒑𝒓𝒐𝒗𝒆𝒅')}: ${pd}\n` +
                          `${applyStyle('𝑬𝒎𝒐𝒋𝒊')}: ${threadInfo.emoji}\n` +
                          `${applyStyle('𝑰𝒏𝒇𝒐')}:\n` +
                          `» ${threadInfo.participantIDs.length} ${applyStyle('𝒎𝒆𝒎𝒃𝒆𝒓𝒔 𝒂𝒏𝒅')} ${threadInfo.adminIDs.length} ${applyStyle('𝒂𝒅𝒎𝒊𝒏𝒔')}\n` +
                          `» ${applyStyle('𝑰𝒏𝒄𝒍𝒖𝒅𝒊𝒏𝒈')} ${nam} ${applyStyle('𝒃𝒐𝒚 𝒂𝒏𝒅')} ${nu} ${applyStyle('𝒈𝒊𝒓𝒍')}\n` +
                          `» ${applyStyle('𝑻𝒐𝒕𝒂𝒍 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔')}: ${threadInfo.messageCount}.`,
                    attachment: fs.createReadStream(__dirname + "/cache/1.png")
                }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
                
                return request(encodeURI(`${threadInfo.imageSrc}`))
                    .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
                    .on('close', () => callback());
            }
        }
    }
    
    if (args[0] == "admin") {
        var callback = () => api.sendMessage({
            body: `${applyStyle('———» 𝑨𝑫𝑴𝑰𝑵 𝑩𝑶𝑻 «———')}\n` +
                  `${applyStyle('❯ 𝑵𝒂𝒎𝒆')}: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 🖤\n` +
                  `${applyStyle('❯ 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌')}: https://www.facebook.com/61571630409265\n` +
                  `${applyStyle('❯ 𝑻𝒉𝒂𝒏𝒌𝒔 𝒇𝒐𝒓 𝒖𝒔𝒊𝒏𝒈')} ${global.config.BOTNAME} ${applyStyle('𝒃𝒐𝒕')}`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
        
        return request(encodeURI(`https://graph.facebook.com/61571630409265/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', () => callback());
    }
    
    if (args[0] == "user") {
        let id;
        if (!args[1]) {
            if (event.type == "message_reply") {
                id = event.messageReply.senderID;
            } else {
                id = event.senderID;
            }
        } else {
            if (args.join().indexOf('@') !== -1) {
                id = Object.keys(event.mentions)[0];
            } else {
                id = args[1];
            }
        }
        
        let data = await api.getUserInfo(id);
        let userData = data[id];
        let url = userData.profileUrl;
        let b = userData.isFriend == false ? applyStyle("𝑵𝒂𝒉") : userData.isFriend == true ? applyStyle("𝒀𝒆𝒔") : applyStyle("𝑶𝒔𝒂𝒅𝒉𝒂𝒓𝒐𝒏");
        let sn = userData.vanity || applyStyle("𝑵𝒐𝒏𝒆");
        let name = userData.name;
        var sex = userData.gender;
        var gender = sex == 2 ? applyStyle("𝑩𝒐𝒚") : sex == 1 ? applyStyle("𝑮𝒊𝒓𝒍") : applyStyle("𝑶𝒕𝒉𝒆𝒓");
        
        var callback = () => api.sendMessage({
            body: `${applyStyle('𝑵𝒂𝒎𝒆')}: ${name}\n` +
                  `${applyStyle('𝑼𝒔𝒆𝒓 𝑳𝒊𝒏𝒌')}: ${url}\n` +
                  `${applyStyle('𝑼𝒔𝒆𝒓𝒏𝒂𝒎𝒆')}: ${sn}\n` +
                  `${applyStyle('𝑼𝑰𝑫')}: ${id}\n` +
                  `${applyStyle('𝑮𝒆𝒏𝒅𝒆𝒓')}: ${gender}\n` +
                  `${applyStyle('𝑩𝒐𝒕 𝒇𝒓𝒊𝒆𝒏𝒅')}? ${b}`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
        
        return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', () => callback());
    }
};
