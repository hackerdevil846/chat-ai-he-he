module.exports.config = {
    name: "job",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑", // Updated credits
    description: "𝑬𝒂𝒓𝒏 𝒄𝒐𝒊𝒏𝒔 𝒃𝒚 𝒘𝒐𝒓𝒌𝒊𝒏𝒈",
    category: "Economy",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 5000
    }
};

// Helper function to convert text to Mathematical Bold Italic
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
        "cooldown": toMathBoldItalic("Tumi kaj shesh korechho, abar asho: %1 minute(s) %2 second(s).")
    }
}

module.exports.handleReply = async ({ event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    let data = (await Currencies.getData(senderID)).data || {};
    
    // Random coins amounts
    const coinscn = Math.floor(Math.random() * 401) + 200;
    const coinsdv = Math.floor(Math.random() * 801) + 200;
    const coinsmd = Math.floor(Math.random() * 401) + 200;
    const coinsq = Math.floor(Math.random() * 601) + 200;
    const coinsdd = Math.floor(Math.random() * 201) + 200;
    const coinsdd1 = Math.floor(Math.random() * 801) + 200;

    // Job arrays with Banglish translations
    const rdcn = [
        toMathBoldItalic('staff hire kortechi'),
        toMathBoldItalic('hotel administrator'),
        toMathBoldItalic('power plant a kaj kortechi'),
        toMathBoldItalic('restaurant chef'),
        toMathBoldItalic('worker')
    ];
    
    const rddv = [
        toMathBoldItalic('plumber'),
        toMathBoldItalic('neighbor er AC repair'),
        toMathBoldItalic('multi-level sale kortechi'),
        toMathBoldItalic('flyer distribution kortechi'),
        toMathBoldItalic('shipper'),
        toMathBoldItalic('computer repair kortechi'),
        toMathBoldItalic('tour guide'),
        toMathBoldItalic('bua er kaj')
    ];
    
    const rdmd = [
        toMathBoldItalic('13 barrel oil earn korechhi'),
        toMathBoldItalic('8 barrel oil earn korechhi'),
        toMathBoldItalic('9 barrel oil earn korechhi'),
        toMathBoldItalic('oil churi kortechi'),
        toMathBoldItalic('oil e pani miliye sell korechhi')
    ];
    
    const rdq = [
        toMathBoldItalic('iron ore'),
        toMathBoldItalic('gold ore'),
        toMathBoldItalic('coal ore'),
        toMathBoldItalic('lead ore'),
        toMathBoldItalic('copper ore'),
        toMathBoldItalic('oil ore')
    ];
    
    const rddd = [
        toMathBoldItalic('diamond'),
        toMathBoldItalic('gold'),
        toMathBoldItalic('coal'),
        toMathBoldItalic('emerald'),
        toMathBoldItalic('iron'),
        toMathBoldItalic('ordinary stone'),
        toMathBoldItalic('lazy'),
        toMathBoldItalic('bluestone')
    ];
    
    const rddd1 = [
        toMathBoldItalic('vip atithi'),
        toMathBoldItalic('patent'),
        toMathBoldItalic('ostrich'),
        toMathBoldItalic('23 bochorer fool'),
        toMathBoldItalic('patron'),
        toMathBoldItalic('92 bochorer tycoon'),
        toMathBoldItalic('12 bochorer boyi')
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
                    msg = toMathBoldItalic(`⚡️Tumi industrial zone e ${work1} kaj kore ${coinscn}$ earn korcho.`);
                    Currencies.increaseMoney(event.senderID, coinscn); 
                    break;
                case "2": 
                    msg = toMathBoldItalic(`⚡️Tumi service area te ${work2} kaj kore ${coinsdv}$ earn korcho.`);
                    Currencies.increaseMoney(event.senderID, coinsdv); 
                    break;
                case "3": 
                    msg = toMathBoldItalic(`⚡️Tumi open oil e ${work3} kore ${coinsmd}$ earn korcho.`);
                    Currencies.increaseMoney(event.senderID, coinsmd); 
                    break;
                case "4": 
                    msg = toMathBoldItalic(`⚡️Tumi ${work4} mine kore ${coinsq}$ earn korcho.`);
                    Currencies.increaseMoney(event.senderID, coinsq); 
                    break;
                case "5": 
                    msg = toMathBoldItalic(`⚡️Tumi ${work5} dig kore ${coinsdd}$ earn korcho.`);
                    Currencies.increaseMoney(event.senderID, coinsdd); 
                    break;
                case "6": 
                    msg = toMathBoldItalic(`⚡️Tumi ${work6} ke choose korle and ${coinsdd1}$ dewa holo, jodi xxx 1 night, tahole tumi right away agree korle :)))`);
                    Currencies.increaseMoney(event.senderID, coinsdd1); 
                    break;
                case "7": 
                    msg = toMathBoldItalic("⚡️ Update soon..."); 
                    break;
                default: 
                    break;
            };
            
            const choose = parseInt(event.body);
            if (isNaN(event.body)) return api.sendMessage(toMathBoldItalic("⚡️Doya kore 1ta number reply korun"), event.threadID, event.messageID);
            if (choose > 7 || choose < 1) return api.sendMessage(toMathBoldItalic("⚡️Oi number list e nai"), event.threadID, event.messageID);
            
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(msg, threadID, async () => {
                data.work2Time = Date.now();
                await Currencies.setData(senderID, { data });
            });
        }
    }
}

module.exports.run = async ({ event, api, Currencies, getText }) => {
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
/*
@credit P-SeverTeam
@Vui lòng không đổi credit!
*/
