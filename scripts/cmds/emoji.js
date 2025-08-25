module.exports.config = {
    name: "emoji",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑬𝒎𝒐𝒋𝒊 𝒅𝒊𝒚𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒆𝒏𝒄𝒓𝒚𝒑𝒕 𝒂𝒓 𝒅𝒆𝒄𝒓𝒚𝒑𝒕 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
    category: "𝑻𝒐𝒐𝒍",
    usages: "𝒆𝒎𝒐𝒋𝒊 𝒆𝒏 <𝒕𝒆𝒙𝒕>\n𝒆𝒎𝒐𝒋𝒊 𝒅𝒆 <𝒕𝒆𝒙𝒕>",
    cooldowns: 5
};

module.exports.onStart = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    
    if (args.length < 2) {
        return api.sendMessage(`✨ 𝑼𝒔𝒂𝒈𝒆:\n${this.config.usages}`, threadID, messageID);
    }

    const type = args[0].toLowerCase();
    const text = args.slice(1).join(" ").toLowerCase();

    if (type === 'encode' || type === 'en') {
        const mapping = {
            'à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|a': '😀',
            'b': '😃',
            'c': '😁',
            'đ|d': '😅',
            'è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|e': '🥰',
            'f': '🤣',
            'g': '🥲',
            'h': '☺️',
            'ì|í|ị|ỉ|ĩ|i': '😊',
            'k': '😇',
            'l': '😉',
            'm': '😒',
            'n': '😞',
            'ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|o': '😙',
            'p': '😟',
            'q': '😕',
            'r': '🙂',
            's': '🙃',
            't': '☹️',
            'ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|u': '😡',
            'v': '😍',
            'x': '😩',
            'ỳ|ý|ỵ|ỷ|ỹ|y': '😭',
            'w': '😳',
            'z': '😠',
            ' ': '.'
        };

        let encoded = text;
        for (const [key, emoji] of Object.entries(mapping)) {
            const regex = new RegExp(key, 'g');
            encoded = encoded.replace(regex, emoji);
        }
        encoded = encoded.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "")
                         .replace(/\u02C6|\u0306|\u031B/g, "");

        return api.sendMessage(`🔐 𝐄𝐧𝐜𝐨𝐝𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 ✨\n━━━━━━━━━━━━━━\n${encoded}\n━━━━━━━━━━━━━━`, threadID, messageID);
    } 
    else if (type === 'decode' || type === 'de') {
        const mapping = {
            '😀': 'a',
            '😃': 'b',
            '😁': 'c',
            '😅': 'd',
            '🥰': 'e',
            '🤣': 'f',
            '🥲': 'g',
            '☺️': 'h',
            '😊': 'i',
            '😇': 'k',
            '😉': 'l',
            '😒': 'm',
            '😞': 'n',
            '😙': 'o',
            '😟': 'p',
            '😕': 'q',
            '🙂': 'r',
            '🙃': 's',
            '☹️': 't',
            '😡': 'u',
            '😍': 'v',
            '😩': 'x',
            '😭': 'y',
            '😳': 'w',
            '😠': 'z',
            '\\.': ' '
        };

        let decoded = text;
        for (const [emoji, char] of Object.entries(mapping)) {
            const regex = new RegExp(emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            decoded = decoded.replace(regex, char);
        }

        return api.sendMessage(`🔓 𝐃𝐞𝐜𝐨𝐝𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 ✨\n━━━━━━━━━━━━━━\n${decoded}\n━━━━━━━━━━━━━━`, threadID, messageID);
    } 
    else {
        return api.sendMessage(`❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝑶𝒑𝒆𝒓𝒂𝒕𝒊𝒐𝒏\n✨ 𝑼𝒔𝒂𝒈𝒆:\n${this.config.usages}`, threadID, messageID);
    }
};
