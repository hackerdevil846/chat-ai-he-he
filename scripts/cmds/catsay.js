module.exports.config = {
    name: "catsay",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑪𝒂𝒕 𝒊𝒎𝒂𝒈𝒆 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒐𝒓 𝒘𝒊𝒕𝒉 𝒕𝒆𝒙𝒕",
    commandCategory: "𝒆𝒅𝒊𝒕-𝒊𝒎𝒈",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "request": ""
    }
};

function toMathBoldItalic(text) {
    const map = {
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
        'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
        'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
        ' ': ' ', '!': '!', '?': '?', '.': '.', ',': ',', "'": "'", '"': '"', ':': ':', ';': ';', '-': '-'
    };
    return text.split('').map(char => map[char] || char).join('');
}

module.exports.run = async ({ api, event, args }) => {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const { threadID, messageID } = event;
    
    if (!args[0]) {
        const errorMessage = toMathBoldItalic("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒕𝒆𝒙𝒕 𝒕𝒐 𝒅𝒊𝒔𝒑𝒍𝒂𝒚 𝒐𝒏 𝒕𝒉𝒆 𝒄𝒂𝒕 𝒊𝒎𝒂𝒈𝒆");
        return api.sendMessage(errorMessage, threadID, messageID);
    }
    
    const text = args.join(" ");
    const filePath = __dirname + "/cache/cat.png";
    const successMessage = toMathBoldItalic("🐱 𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝒄𝒂𝒕 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆!");

    const callback = () => {
        api.sendMessage({
            body: successMessage,
            attachment: fs.createReadStream(filePath)
        }, threadID, () => fs.unlinkSync(filePath), messageID);
    };

    request(encodeURI(`https://cataas.com/cat/cute/says/${text}?fontSize=50&fontColor=white`))
        .pipe(fs.createWriteStream(filePath))
        .on('close', callback);
};
