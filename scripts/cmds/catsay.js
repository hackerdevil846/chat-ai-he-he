module.exports.config = {
    name: "catsay",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🐱 Cat image generator with your custom text",
    category: "edit-img",
    usages: "[text]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "request": ""
    }
};

module.exports.languages = {
    "en": {
        errorText: "❌ Please enter text to display on the cat image!",
        successText: "🐱 Here's your cat with your message!"
    },
    "bn": {
        errorText: "❌ দয়া করে একটি টেক্সট লিখুন যা বিড়াল ছবিতে দেখাতে চান!",
        successText: "🐱 এখানে আপনার বার্তা সহ বিড়াল!"
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

module.exports.onStart = async function({ api, event, args, Users, Threads, Currencies }) {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const { threadID, messageID } = event;

    if (!args[0]) {
        return api.sendMessage(toMathBoldItalic(module.exports.languages.en.errorText), threadID, messageID);
    }

    const text = args.join(" ");
    const filePath = __dirname + "/cache/cat.png";

    const callback = () => {
        api.sendMessage({
            body: toMathBoldItalic(module.exports.languages.en.successText),
            attachment: fs.createReadStream(filePath)
        }, threadID, () => fs.unlinkSync(filePath), messageID);
    };

    // Fetch cat image with your custom text
    request(encodeURI(`https://cataas.com/cat/cute/says/${text}?fontSize=50&fontColor=white`))
        .pipe(fs.createWriteStream(filePath))
        .on('close', callback);
};
