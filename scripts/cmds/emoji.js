module.exports.config = {
    name: "emoji",
    aliases: ["emojicode", "emojicipher"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "tool",
    shortDescription: {
        en: "𝐸𝑚𝑜𝑗𝑖 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑒𝑛𝑐𝑟𝑦𝑝𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑑𝑒𝑐𝑟𝑦𝑝𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "𝐸𝑛𝑐𝑜𝑑𝑒 𝑎𝑛𝑑 𝑑𝑒𝑐𝑜𝑑𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝑒𝑚𝑜𝑗𝑖𝑠"
    },
    guide: {
        en: "{p}emoji 𝑒𝑛 <𝑡𝑒𝑥𝑡>\n{p}emoji 𝑑𝑒 <𝑡𝑒𝑥𝑡>"
    }
};

module.exports.onStart = async function({ message, args, event }) {
    const { threadID, messageID } = event;
    
    if (args.length < 2) {
        return message.reply(`✨ 𝑈𝑠𝑎𝑔𝑒:\n${this.config.guide.en}`, threadID, messageID);
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

        return message.reply(`🔐 𝐸𝑛𝑐𝑜𝑑𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 ✨\n━━━━━━━━━━━━━━\n${encoded}\n━━━━━━━━━━━━━━`, threadID, messageID);
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

        return message.reply(`🔓 𝐷𝑒𝑐𝑜𝑑𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 ✨\n━━━━━━━━━━━━━━\n${decoded}\n━━━━━━━━━━━━━━`, threadID, messageID);
    } 
    else {
        return message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑂𝑝𝑒𝑟𝑎𝑡𝑖𝑜𝑛\n✨ 𝑈𝑠𝑎𝑔𝑒:\n${this.config.guide.en}`, threadID, messageID);
    }
};
