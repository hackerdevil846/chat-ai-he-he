module.exports.config = {
    name: "choose",
    aliases: ["select", "pick"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utilities",
    shortDescription: {
        en: "𝐻𝑒𝑙𝑝𝑠 𝑦𝑜𝑢 𝑐ℎ𝑜𝑜𝑠𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑜𝑝𝑡𝑖𝑜𝑛𝑠"
    },
    longDescription: {
        en: "𝐴𝑠𝑠𝑖𝑠𝑡𝑠 𝑖𝑛 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑛𝑔 𝑎𝑛 𝑜𝑝𝑡𝑖𝑜𝑛 𝑓𝑟𝑜𝑚 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑐ℎ𝑜𝑖𝑐𝑒𝑠"
    },
    guide: {
        en: "{p}choose [𝑂𝑝𝑡𝑖𝑜𝑛 1] | [𝑂𝑝𝑡𝑖𝑜𝑛 2]"
    }
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
    "en": {
        "return": toMathBoldItalic("%1 𝑖𝑠 𝑡ℎ𝑒 𝑏𝑒𝑠𝑡 𝑐ℎ𝑜𝑖𝑐𝑒 𝑓𝑜𝑟 𝑦𝑜𝑢, 𝑖𝑛 𝑚𝑦 𝑜𝑝𝑖𝑛𝑖𝑜𝑛 🤔")
    }
};

module.exports.onStart = async function({ message, event, args, getText }) {
    try {
        const { threadID, messageID } = event;

        let input = args.join(" ").trim();
        if (!input) {
            const errorMsg = toMathBoldItalic("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑠𝑜𝑚𝑒 𝑜𝑝𝑡𝑖𝑜𝑛𝑠! 𝑈𝑠𝑎𝑔𝑒: 𝑐ℎ𝑜𝑜𝑠𝑒 𝑜𝑝𝑡𝑖𝑜𝑛1 | 𝑜𝑝𝑡𝑖𝑜𝑛2");
            return message.reply(errorMsg);
        }

        let array = input.split(" | ");
        if (array.length < 2) {
            const errorMsg = toMathBoldItalic("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎𝑡 𝑙𝑒𝑎𝑠𝑡 2 𝑜𝑝𝑡𝑖𝑜𝑛𝑠! 𝑈𝑠𝑎𝑔𝑒: 𝑐ℎ𝑜𝑜𝑠𝑒 𝑜𝑝𝑡𝑖𝑜𝑛1 | 𝑜𝑝𝑡𝑖𝑜𝑛2");
            return message.reply(errorMsg);
        }

        const selected = array[Math.floor(Math.random() * array.length)];
        const result = getText("return", selected);

        return message.reply(`🎯 𝑅𝑒𝑠𝑢𝑙𝑡: ${result}`);

    } catch (error) {
        console.error("𝐶ℎ𝑜𝑜𝑠𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        const errorMsg = toMathBoldItalic("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
        return message.reply(errorMsg);
    }
};
