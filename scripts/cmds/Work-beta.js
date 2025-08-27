module.exports.config = {
    name: "job",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Updated credits
    description: "𝑬𝒂𝒓𝒏 𝒄𝒐𝒊𝒏𝒔 𝒃𝒚 𝒘𝒐𝒓𝒌𝒊𝒏𝒈",
    category: "𝑬𝒄𝒐𝒏𝒐𝒎𝒚",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 5000
    }
};

// 𝑯𝒆𝒍𝒑𝒆𝒓 𝒇𝒖𝒏𝒄𝒕𝒊𝒐𝒏 𝒕𝒐 𝒄𝒐𝒏𝒗𝒆𝒓𝒕 𝒕𝒆𝒙𝒕 𝒕𝒐 𝑴𝒂𝒕𝒉𝒆𝒎𝒂𝒕𝒊𝒄𝒂𝒍 𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄
function toMathBoldItalic(text) {
    const map = {
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    };
    return text.replace(/[a-zA-Z0-9]/g, m => map[m] || m);
}

module.exports.languages = {
    "en": {
        "cooldown": toMathBoldItalic("𝑻𝒖𝒎𝒊 𝒌𝒂𝒋 𝒔𝒉𝒆𝒔𝒉 𝒌𝒐𝒓𝒆𝒄𝒉𝒉𝒐, 𝒂𝒃𝒂𝒓 𝒂𝒔𝒉𝒐: %1 𝒎𝒊𝒏𝒖𝒕𝒆(𝒔) %2 𝒔𝒆𝒄𝒐𝒏𝒅(𝒔).")
    }
}

module.exports.handleReply = async ({ event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    let data = (await Currencies.getData(senderID)).data || {};
    
    // 𝑹𝒂𝒏𝒅𝒐𝒎 𝒄𝒐𝒊𝒏𝒔 𝒂𝒎𝒐𝒖𝒏𝒕𝒔
    const coinscn = Math.floor(Math.random() * 401) + 200;
    const coinsdv = Math.floor(Math.random() * 801) + 200;
    const coinsmd = Math.floor(Math.random() * 401) + 200;
    const coinsq = Math.floor(Math.random() * 601) + 200;
    const coinsdd = Math.floor(Math.random() * 201) + 200;
    const coinsdd1 = Math.floor(Math.random() * 801) + 200;

    // 𝑱𝒐𝒃 𝒂𝒓𝒓𝒂𝒚𝒔 𝒘𝒊𝒕𝒉 𝑩𝒂𝒏𝒈𝒍𝒊𝒔𝒉 𝒕𝒓𝒂𝒏𝒔𝒍𝒂𝒕𝒊𝒐𝒏𝒔
    const rdcn = [
        toMathBoldItalic('𝒔𝒕𝒂𝒇𝒇 𝒉𝒊𝒓𝒆 𝒌𝒐𝒓𝒕𝒆𝒄𝒉𝒊'),
        toMathBoldItalic('𝒉𝒐𝒕𝒆𝒍 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒐𝒓'),
        toMathBoldItalic('𝒑𝒐𝒘𝒆𝒓 𝒑𝒍𝒂𝒏𝒕 𝒂 𝒌𝒂𝒋 𝒌𝒐𝒓𝒕𝒆𝒄𝒉𝒊'),
        toMathBoldItalic('𝒓𝒆𝒔𝒕𝒂𝒖𝒓𝒂𝒏𝒕 𝒄𝒉𝒆𝒇'),
        toMathBoldItalic('𝒘𝒐𝒓𝒌𝒆𝒓')
    ];
    
    const rddv = [
        toMathBoldItalic('𝒑𝒍𝒖𝒎𝒃𝒆𝒓'),
        toMathBoldItalic('𝒏𝒆𝒊𝒈𝒉𝒃𝒐𝒓 𝒆𝒓 𝑨𝑪 𝒓𝒆𝒑𝒂𝒊𝒓'),
        toMathBoldItalic('𝒎𝒖𝒍𝒕𝒊-𝒍𝒆𝒗𝒆𝒍 𝒔𝒂𝒍𝒆 𝒌𝒐𝒓𝒕𝒆𝒄𝒉𝒊'),
        toMathBoldItalic('𝒇𝒍𝒚𝒆𝒓 𝒅𝒊𝒔𝒕𝒓𝒊𝒃𝒖𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒕𝒆𝒄𝒉𝒊'),
        toMathBoldItalic('𝒔𝒉𝒊𝒑𝒑𝒆𝒓'),
        toMathBoldItalic('𝒄𝒐𝒎𝒑𝒖𝒕𝒆𝒓 𝒓𝒆𝒑𝒂𝒊𝒓 𝒌𝒐𝒓𝒕𝒆𝒄𝒉𝒊'),
        toMathBoldItalic('𝒕𝒐𝒖𝒓 𝒈𝒖𝒊𝒅𝒆'),
        toMathBoldItalic('𝒃𝒖𝒂 𝒆𝒓 𝒌𝒂𝒋')
    ];
    
    const rdmd = [
        toMathBoldItalic('13 𝒃𝒂𝒓𝒓𝒆𝒍 𝒐𝒊𝒍 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒆𝒄𝒉𝒉𝒊'),
        toMathBoldItalic('8 𝒃𝒂𝒓𝒓𝒆𝒍 𝒐𝒊𝒍 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒆𝒄𝒉𝒉𝒊'),
        toMathBoldItalic('9 𝒃𝒂𝒓𝒓𝒆𝒍 𝒐𝒊𝒍 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒆𝒄𝒉𝒉𝒊'),
        toMathBoldItalic('𝒐𝒊𝒍 𝒄𝒉𝒖𝒓𝒊 𝒌𝒐𝒓𝒕𝒆𝒄𝒉𝒊'),
        toMathBoldItalic('𝒐𝒊𝒍 𝒆 𝒑𝒂𝒏𝒊 𝒎𝒊𝒍𝒊𝒚𝒆 𝒔𝒆𝒍𝒍 𝒌𝒐𝒓𝒆𝒄𝒉𝒉𝒊')
    ];
    
    const rdq = [
        toMathBoldItalic('𝒊𝒓𝒐𝒏 𝒐𝒓𝒆'),
        toMathBoldItalic('𝒈𝒐𝒍𝒅 𝒐𝒓𝒆'),
        toMathBoldItalic('𝒄𝒐𝒂𝒍 𝒐𝒓𝒆'),
        toMathBoldItalic('𝒍𝒆𝒂𝒅 𝒐𝒓𝒆'),
        toMathBoldItalic('𝒄𝒐𝒑𝒑𝒆𝒓 𝒐𝒓𝒆'),
        toMathBoldItalic('𝒐𝒊𝒍 𝒐𝒓𝒆')
    ];
    
    const rddd = [
        toMathBoldItalic('𝒅𝒊𝒂𝒎𝒐𝒏𝒅'),
        toMathBoldItalic('𝒈𝒐𝒍𝒅'),
        toMathBoldItalic('𝒄𝒐𝒂𝒍'),
        toMathBoldItalic('𝒆𝒎𝒆𝒓𝒂𝒍𝒅'),
        toMathBoldItalic('𝒊𝒓𝒐𝒏'),
        toMathBoldItalic('𝒐𝒓𝒅𝒊𝒏𝒂𝒓𝒚 𝒔𝒕𝒐𝒏𝒆'),
        toMathBoldItalic('𝒍𝒂𝒛𝒚'),
        toMathBoldItalic('𝒃𝒍𝒖𝒆𝒔𝒕𝒐𝒏𝒆')
    ];
    
    const rddd1 = [
        toMathBoldItalic('𝒗𝒊𝒑 𝒂𝒕𝒊𝒕𝒉𝒊'),
        toMathBoldItalic('𝒑𝒂𝒕𝒆𝒏𝒕'),
        toMathBoldItalic('𝒐𝒔𝒕𝒓𝒊𝒄𝒉'),
        toMathBoldItalic('23 𝒃𝒐𝒄𝒉𝒐𝒓𝒆𝒓 𝒇𝒐𝒐𝒍'),
        toMathBoldItalic('𝒑𝒂𝒕𝒓𝒐𝒏'),
        toMathBoldItalic('92 𝒃𝒐𝒄𝒉𝒐𝒓𝒆𝒓 𝒕𝒚𝒄𝒐𝒐𝒏'),
        toMathBoldItalic('12 𝒃𝒐𝒄𝒉𝒐𝒓𝒆𝒓 𝒃𝒐𝒚𝒊')
    ];

    const work1 = rdcn[Math.floor(Math.random() * rdcn.length)];
    const work2 = rddv[Math.floor(Math.random() * rddv.length)];
    const work3 = rdmd[Math.floor(Math.random() * rdmd.length)];
    const work4 = rdq[Math.floor(Math.random() * rdq.length)];
    const work5 = rddd[Math.floor(Math.random() * rddd.length)];
    const work6 = rddd1[Math.floor(Math.random() * rddd1.length)];

    var msg = "";
    switch(handleReply.type) {
        case "choosee": {
            switch(event.body) {
                case "1": 
                    msg = toMathBoldItalic(`⚡️𝑻𝒖𝒎𝒊 𝒊𝒏𝒅𝒖𝒔𝒕𝒓𝒊𝒂𝒍 𝒛𝒐𝒏𝒆 𝒆 ${work1} 𝒌𝒂𝒋 𝒌𝒐𝒓𝒆 ${coinscn}$ 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒄𝒉𝒐.`);
                    Currencies.increaseMoney(event.senderID, coinscn); 
                    break;
                case "2": 
                    msg = toMathBoldItalic(`⚡️𝑻𝒖𝒎𝒊 𝒔𝒆𝒓𝒗𝒊𝒄𝒆 𝒂𝒓𝒆𝒂 𝒕𝒆 ${work2} 𝒌𝒂𝒋 𝒌𝒐𝒓𝒆 ${coinsdv}$ 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒄𝒉𝒐.`);
                    Currencies.increaseMoney(event.senderID, coinsdv); 
                    break;
                case "3": 
                    msg = toMathBoldItalic(`⚡️𝑻𝒖𝒎𝒊 𝒐𝒑𝒆𝒏 𝒐𝒊𝒍 𝒆 ${work3} 𝒌𝒐𝒓𝒆 ${coinsmd}$ 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒄𝒉𝒐.`);
                    Currencies.increaseMoney(event.senderID, coinsmd); 
                    break;
                case "4": 
                    msg = toMathBoldItalic(`⚡️𝑻𝒖𝒎𝒊 ${work4} 𝒎𝒊𝒏𝒆 𝒌𝒐𝒓𝒆 ${coinsq}$ 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒄𝒉𝒐.`);
                    Currencies.increaseMoney(event.senderID, coinsq); 
                    break;
                case "5": 
                    msg = toMathBoldItalic(`⚡️𝑻𝒖𝒎𝒊 ${work5} 𝒅𝒊𝒈 𝒌𝒐𝒓𝒆 ${coinsdd}$ 𝒆𝒂𝒓𝒏 𝒌𝒐𝒓𝒄𝒉𝒐.`);
                    Currencies.increaseMoney(event.senderID, coinsdd); 
                    break;
                case "6": 
                    msg = toMathBoldItalic(`⚡️𝑻𝒖𝒎𝒊 ${work6} 𝒌𝒆 𝒄𝒉𝒐𝒐𝒔𝒆 𝒌𝒐𝒓𝒍𝒆 𝒂𝒏𝒅 ${coinsdd1}$ 𝒅𝒆𝒘𝒂 𝒉𝒐𝒍𝒐, 𝒋𝒐𝒅𝒊 𝒙𝒙𝒙 1 𝒏𝒊𝒈𝒉𝒕, 𝒕𝒂𝒉𝒐𝒍𝒆 𝒕𝒖𝒎𝒊 𝒓𝒊𝒈𝒉𝒕 𝒂𝒘𝒂𝒚 𝒂𝒈𝒓𝒆𝒆 𝒌𝒐𝒓𝒍𝒆 :)))`);
                    Currencies.increaseMoney(event.senderID, coinsdd1); 
                    break;
                case "7": 
                    msg = toMathBoldItalic("⚡️ 𝑼𝒑𝒅𝒂𝒕𝒆 𝒔𝒐𝒐𝒏..."); 
                    break;
                default: 
                    break;
            };
            
            const choose = parseInt(event.body);
            if (isNaN(event.body)) return api.sendMessage(toMathBoldItalic("⚡️𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 1𝒕𝒂 𝒏𝒖𝒎𝒃𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏"), event.threadID, event.messageID);
            if (choose > 7 || choose < 1) return api.sendMessage(toMathBoldItalic("⚡️𝑶𝒊 𝒏𝒖𝒎𝒃𝒆𝒓 𝒍𝒊𝒔𝒕 𝒆 𝒏𝒂𝒊"), event.threadID, event.messageID);
            
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(msg, threadID, async () => {
                data.work2Time = Date.now();
                await Currencies.setData(senderID, { data });
            });
        }
    }
}

module.exports.onStart = async ({ event, api, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};
    
    if (typeof data !== "undefined" && cooldown - (Date.now() - data.work2Time) > 0) {
        var time = cooldown - (Date.now() - data.work2Time),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0);
        return api.sendMessage(
            toMathBoldItalic(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds))), 
            event.threadID, 
            event.messageID
        );
    }
    else {
        const menu = toMathBoldItalic(
            "𝑪𝒐𝒊𝒏 𝑬𝒂𝒓𝒏 𝑱𝒐𝒃 𝑪𝒆𝒏𝒕𝒆𝒓" +
            "\n\n1. 𝑰𝒏𝒅𝒖𝒔𝒕𝒓𝒊𝒂𝒍 𝒛𝒐𝒏𝒆 𝒌𝒂𝒋" +
            "\n2. 𝑺𝒆𝒓𝒗𝒊𝒄𝒆 𝒂𝒓𝒆𝒂 𝒌𝒂𝒋" +
            "\n3. 𝑶𝒊𝒍 𝒇𝒊𝒆𝒍𝒅 𝒌𝒂𝒋" +
            "\n4. 𝑴𝒊𝒏𝒊𝒏𝒈 𝒌𝒂𝒋" +
            "\n5. 𝑫𝒊𝒈𝒈𝒊𝒏𝒈 𝒌𝒂𝒋" +
            "\n6. 𝑺𝒑𝒆𝒄𝒊𝒂𝒍 𝒋𝒐𝒃" +
            "\n7. 𝑼𝒑𝒅𝒂𝒕𝒆 𝒔𝒐𝒐𝒏..." +
            "\n\n⚡️𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒆 𝒏𝒖𝒎𝒃𝒆𝒓 𝒄𝒉𝒐𝒐𝒔𝒆 𝒌𝒐𝒓𝒖𝒏"
        );
        
        return api.sendMessage(menu, event.threadID, (error, info) => {
            data.work2Time = Date.now();
            global.client.handleReply.push({
                type: "choosee",
                name: this.config.name,
                author: event.senderID,
                messageID: info.messageID
            });
        });
    }
}
