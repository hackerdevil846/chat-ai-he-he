module.exports.config = {
	name: "cave",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑺𝒆𝒍𝒍 𝒚𝒐𝒖𝒓 𝒐𝒘𝒏 𝒄𝒂𝒑𝒊𝒕𝒂𝒍",
	commandCategory: "𝑴𝒂𝒌𝒆 𝒎𝒐𝒏𝒆𝒚",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 1000000
    }
};

function toMathBoldItalic(text) {
    const map = {
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
        'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
        'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
        ' ': ' ', ':': ':', '>': '>', '<': '<', '(': '(', ')': ')', '[': '[', ']': ']', '{': '{', '}': '}', ',': ',', '.': '.', ';': ';', 
        '!': '!', '?': '?', "'": "'", '"': '"', '-': '-', '_': '_', '=': '=', '+': '+', '*': '*', '/': '/', '\\': '\\', '|': '|', '&': '&', 
        '^': '^', '%': '%', '$': '$', '#': '#', '@': '@'
    };
    return text.split('').map(char => map[char] || char).join('');
}

module.exports.languages = {
    "vi": {
        "cooldown": toMathBoldItalic("Apni aaj kaj korechen, shramer khata theke bachte paren pratyagamne esho: %1 minute(s) %2 second(s) 🛏"),
        "rewarded": toMathBoldItalic("Apni kaj ta korechen: Cave ar peyechen: %2$ 💸"),
        "job1": toMathBoldItalic("Cave"),
    },
    "en": {
        "cooldown": toMathBoldItalic("Apni aaj kaj korechen, shramer khata theke bachte paren pratyagamne esho: %1 minute(s) %2 second(s) 🛏"),
        "rewarded": toMathBoldItalic("Apni kaj ta korechen: Cave ar peyechen: %2$ 💸"),
        "job1": toMathBoldItalic("Cave"),
    }
}

module.exports.run = async ({ event, api, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};
    if (typeof data !== "undefined" && cooldown - (Date.now() - data.workTime) > 0) {
        var time = cooldown - (Date.now() - data.workTime),
            minutes = Math.floor(time / 20000),
            seconds = ((time % 20000) / 500).toFixed(0);
        
        return api.sendMessage(
            getText("cooldown", 
                toMathBoldItalic(minutes.toString()), 
                toMathBoldItalic((seconds < 10 ? "0" + seconds : seconds).toString())
            ), 
            threadID, 
            messageID
        );
    }
    else {
        const job = [getText("job1")];
        const amount = Math.floor(Math.random() * 10000);
        const amountText = toMathBoldItalic(amount.toString());
        
        return api.sendMessage(
            getText("rewarded", job[Math.floor(Math.random() * job.length)], amountText), 
            threadID, 
            async () => {
                await Currencies.increaseMoney(senderID, parseInt(amount));
                data.workTime = Date.now();
                await Currencies.setData(senderID, { data });
            }, 
            messageID
        );
    }     
};
