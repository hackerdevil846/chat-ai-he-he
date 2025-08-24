module.exports.config = {
    name: "adduser",
    version: "2.4.3",
    hasPermssion: 0,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    description: "𝑨𝒅𝒅 𝒖𝒔𝒆𝒓 𝒕𝒐 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑 𝒃𝒚 𝒍𝒊𝒏𝒌 𝒐𝒓 𝒊𝒅",
    category: "group",
    usages: "[args]",
    cooldowns: 5
};

async function getUID(url, api) {
    const isFacebookUrl = url.includes("http://facebook.com") || url.includes("https://facebook.com");
    
    if (isFacebookUrl) {
        try {
            if (!url.includes("http://") && !url.includes("https://")) {
                url = "https://" + url;
            }

            let data = await api.httpGet(url);
            const redirectRegex = /for \(;;\);{"redirect":"(.*?)"}/.exec(data);
            
            if (data.includes('"redirect":"')) {
                const cleanUrl = redirectRegex[1].replace(/\\/g, '').split('?')[0];
                data = await api.httpGet(cleanUrl);
            }

            const uidRegex = /"userID":"(\d+)"/.exec(data);
            const uid = uidRegex ? uidRegex[1] : null;

            const nameRegex = /"title":"(.*?)"/s.exec(data);
            const name = nameRegex ? nameRegex[1] : null;

            return [uid, name, false];
        } catch (error) {
            return [null, null, true];
        }
    } else {
        return ["𝑵𝒐𝒕 𝒂 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑼𝑹𝑳", null, true];
    }
}

module.exports.onStart = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const botID = api.getCurrentUserID();
    const out = msg => api.sendMessage(msg, threadID, messageID);
    
    const threadInfo = await api.getThreadInfo(threadID);
    const participantIDs = threadInfo.participantIDs.map(e => parseInt(e));
    const approvalMode = threadInfo.approvalMode;
    const adminIDs = threadInfo.adminIDs.map(e => parseInt(e.id));
    
    if (!args[0]) return out("𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒖𝒔𝒆𝒓 𝑰𝑫 𝒐𝒓 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒍𝒊𝒏𝒌");
    
    if (!isNaN(args[0])) {
        await adduser(args[0], "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒖𝒔𝒆𝒓");
    } else {
        try {
            const [id, name, fail] = await getUID(args[0], api);
            if (fail && id) return out(id);
            if (fail && !id) return out("𝑼𝒔𝒆𝒓 𝑰𝑫 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅");
            await adduser(id, name || "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒖𝒔𝒆𝒓");
        } catch (e) {
            return out(`𝑬𝒓𝒓𝒐𝒓: ${e.message}`);
        }
    }

    async function adduser(id, name) {
        id = parseInt(id);
        
        if (participantIDs.includes(id)) {
            return out(`𝑻𝒉𝒊𝒔 𝒎𝒆𝒎𝒃𝒆𝒓 𝒊𝒔 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒊𝒏 �𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑`);
        }
        
        try {
            await api.addUserToGroup(id, threadID);
        } catch {
            return out(`𝑪𝒂𝒏'𝒕 𝒂𝒅𝒅 ${name} 𝒕𝒐 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑`);
        }
        
        if (approvalMode && !adminIDs.includes(botID)) {
            return out(`𝑨𝒅𝒅𝒆𝒅 ${name} 𝒕𝒐 𝒕𝒉𝒆 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝒍𝒊𝒔𝒕`);
        } else {
            return out(`𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒂𝒅𝒅𝒆𝒅 ${name} 𝒊𝒏 �𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑`);
        }
    }
};
