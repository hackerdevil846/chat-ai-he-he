const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
    name: "catsay",
    aliases: ["cattext", "catmessage"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "🐱 𝐶𝑎𝑡 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    longDescription: {
        en: "🐱 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑐𝑢𝑡𝑒 𝑐𝑎𝑡 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"
    },
    guide: {
        en: "{p}catsay [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.languages = {
    "en": {
        "errorText": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑑𝑖𝑠𝑝𝑙𝑎𝑦 𝑜𝑛 𝑡ℎ𝑒 𝑐𝑎𝑡 𝑖𝑚𝑎𝑔𝑒!",
        "successText": "🐱 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑐𝑎𝑡 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒!"
    }
};

function toMathBoldItalic(text) {
    const map = {
        'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴',
        'N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿','Y': '𝒀','Z': '𝒁',
        'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎',
        'n': '𝒏','o': '𝒐','p': '𝒑','q': '𝒒','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
        ' ': ' ','!': '!','?': '?','.': '.','\'': '\'','"': '"',':': ':',';': ';','-': '-'
    };
    return text.split('').map(char => map[char] || char).join('');
}

module.exports.onStart = async function({ message, args }) {
    try {
        // Check dependencies
        if (!fs.existsSync || !axios) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        if (!args[0]) {
            return message.reply(toMathBoldItalic(module.exports.languages.en.errorText));
        }

        const text = args.join(" ");
        const filePath = __dirname + "/cache/cat.png";

        // Create cache directory if it doesn't exist
        if (!fs.existsSync(__dirname + "/cache")) {
            fs.mkdirSync(__dirname + "/cache", { recursive: true });
        }

        // Fetch cat image with custom text
        const imageUrl = `https://cataas.com/cat/cute/says/${encodeURIComponent(text)}?fontSize=50&fontColor=white`;
        
        const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            message.reply({
                body: toMathBoldItalic(module.exports.languages.en.successText),
                attachment: fs.createReadStream(filePath)
            }).then(() => {
                // Clean up file after sending
                fs.unlinkSync(filePath);
            }).catch(error => {
                console.error("𝑆𝑒𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
                fs.unlinkSync(filePath);
            });
        });

        writer.on('error', (error) => {
            console.error("𝑊𝑟𝑖𝑡𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
            message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐𝑎𝑡 𝑖𝑚𝑎𝑔𝑒");
        });

    } catch (error) {
        console.error("𝐶𝑎𝑡𝑠𝑎𝑦 𝑒𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
    }
};
