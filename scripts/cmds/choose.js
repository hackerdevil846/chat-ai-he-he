module.exports.config = {
    name: "choose",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Apnar poschand ekti option bacher korte sahayyo kore 🤔",
    commandCategory: "utilities",
    usages: "[Option 1] | [Option 2]",
    cooldowns: 5
};

function toMathBoldItalic(text) {
    const map = {
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
        'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
        'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
        ' ': ' ', '!': '!', '?': '?', '.': '.', ',': ',', "'": "'", '"': '"', ':': ':', ';': ';', '-': '-', '_': '_'
    };
    return text.split('').map(char => map[char] || char).join('');
}

module.exports.languages = {
    "vi": {
        "return": toMathBoldItalic("%1 apnar sathe beshi mil kore, amar mote 🤔")
    },
    "en": {
        "return": toMathBoldItalic("%1 apnar sathe beshi mil kore, amar mote 🤔")
    }
};

module.exports.run = async function({ api, event, args, getText }) {
    const { threadID, messageID } = event;

    let input = args.join(" ").trim();
    if (!input) {
        const errorMsg = toMathBoldItalic("❌ Kichu option din! Usage: choose option1 | option2");
        return global.utils.throwError(this.config.name, threadID, messageID, errorMsg);
    }

    let array = input.split(" | ");
    if (array.length < 2) {
        const errorMsg = toMathBoldItalic("❌ Dui ba tar beshi option din! Usage: choose option1 | option2");
        return api.sendMessage(errorMsg, threadID, messageID);
    }

    const selected = array[Math.floor(Math.random() * array.length)];
    const result = getText("return", selected);

    return api.sendMessage(`🎯 Result: ${result}`, threadID, messageID);
};
