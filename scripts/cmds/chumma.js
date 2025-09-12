module.exports.config = {
    name: "chumma",
    aliases: ["kiss", "chumu"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "💋 𝐾𝑖𝑠𝑠 𝑓𝑜𝑟 𝑓𝑢𝑛! 😘"
    },
    longDescription: {
        en: "💋 𝑆𝑒𝑛𝑑 𝑓𝑢𝑛 𝑘𝑖𝑠𝑠 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒𝑠! 😘"
    },
    guide: {
        en: "{p}chumma"
    },
    dependencies: {}
};

// Convert text to Mathematical Bold Italic
function toMathBoldItalic(text) {
    const map = {
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
        'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
        'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
        'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
        'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
        ' ': ' ', '!': '!', '?': '?', '.': '.', "'": "'", '"': '"', ':': ':', ';': ';', '-': '-', '_': '_'
    };
    return text.split('').map(c => map[c] || c).join('');
}

module.exports.onChat = async function({ event, api }) {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const triggers = ["😘", "kiss", "chumma", "chumu", "চুমা", "চুমু"];
    
    if (triggers.some(trigger => body.toLowerCase().includes(trigger.toLowerCase()) || body.includes("😘"))) {
        const responses = [
            "𝑈𝑚𝑚𝑚𝑚𝑚𝑚𝑚𝑎𝑎𝑎𝑎ℎℎℎℎ 😘 𝑆ℎ𝑜𝑛𝑎 😘💖",
            "𝑀𝑢𝑎𝑎𝑎𝑎𝑎𝑎𝑎ℎℎℎ 😘 𝐵𝑎𝑐ℎ𝑎 😘💞",
            "𝐶ℎ𝑢𝑚𝑚𝑎 𝑑𝑖𝑙𝑎𝑚 𝑡𝑜𝑚𝑎𝑘𝑒 😘💘",
            "𝐾𝑖𝑠𝑠 𝑘𝑜𝑟𝑒 𝑑𝑖𝑙𝑎𝑚 😘💓"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const formattedResponse = toMathBoldItalic(randomResponse);

        await api.sendMessage(formattedResponse, threadID, messageID);
        await api.setMessageReaction("😘", messageID, (err) => {}, true);
    }
};

module.exports.onStart = async function({ api, event }) {
    await api.sendMessage("💋 𝐶ℎ𝑢𝑚𝑚𝑎 𝑒𝑠𝑒𝑐ℎ𝑒! 😘", event.threadID, event.messageID);
};
