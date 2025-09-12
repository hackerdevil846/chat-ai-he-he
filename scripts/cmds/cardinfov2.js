const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#000000";

module.exports.config = {
    name: "cardinfov2",
    aliases: ["infocard", "profilecard"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: {
        en: "𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟 𝑑𝑒𝑡𝑎𝑖𝑙𝑠"
    },
    guide: {
        en: "{p}cardinfov2 [𝑢𝑠𝑒𝑟𝐼𝐷] 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": "",
        "jimp": "",
        "moment-timezone": ""
    }
};

module.exports.onLoad = function () {
    try {
        const fs = require('fs-extra');
        if (fs) {
            fs.ensureDirSync(__dirname + "/cache");
        }
    } catch (e) { 
        try {
            const fs = require('fs');
            if (!fs.existsSync(__dirname + "/cache")) {
                fs.mkdirSync(__dirname + "/cache", { recursive: true });
            }
        } catch (err) { 
            console.log("𝐶𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑠𝑘𝑖𝑝𝑝𝑒𝑑");
        }
    }
};

module.exports.circle = async (image) => {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
};

function toMathBoldItalic(text) {
    const map = {
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
        'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
        'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
        ' ': ' ', ':': ':', '>': '>', '-': '-', '_': '_', '/': '/', '.': '.', '(': '(', ')': ')', '[': '[', ']': ']', '{': '{', '}': '}'
    };
    return String(text).split('').map(char => map[char] || char).join('');
}

module.exports.onStart = async function ({ api, event, args }) {
    try {
        if ((this.config.author) !== "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑") {
            return api.sendMessage(`⚠️ 𝐶𝑟𝑒𝑑𝑖𝑡 𝑐𝑎𝑛𝑛𝑜𝑡 𝑏𝑒 𝑐ℎ𝑎𝑛𝑔𝑒𝑑!`, event.threadID, event.messageID);
        }

        const { senderID, threadID, messageID } = event;
        const Canvas = require("canvas");
        const { loadImage, createCanvas } = Canvas;
        const axios = require("axios");
        const fs = require("fs-extra");

        let pathImg = __dirname + `/cache/${senderID}123${threadID}.png`;
        let pathAvata = __dirname + `/cache/avtuserrd.png`;

        let uid;
        if (event.type == "message_reply" && event.messageReply && event.messageReply.senderID) {
            uid = event.messageReply.senderID;
        } else if (args[0]) {
            uid = args[0];
        } else {
            uid = event.senderID;
        }

        const res = await api.getUserInfoV2(uid);
        const getAvatarOne = (await axios.get(`https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
        const bg = (await axios.get(encodeURI(`https://i.imgur.com/C8yIgMZ.png`), { responseType: "arraybuffer" })).data;

        fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne));
        fs.writeFileSync(pathImg, Buffer.from(bg));

        const avataruser = await this.circle(pathAvata);

        if (!fs.existsSync(__dirname + `${fonts}`)) {
            let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont));
        }

        let baseImage = await loadImage(pathImg);
        let baseAvata = await loadImage(avataruser);
        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");

        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseAvata, 610, 83, 255, 255);

        const notFoundText = toMathBoldItalic("𝐷𝑎𝑡𝑎 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        const maleText = toMathBoldItalic("𝑀𝑎𝑙𝑒");
        const femaleText = toMathBoldItalic("𝐹𝑒𝑚𝑎𝑙𝑒");
        const secretText = toMathBoldItalic("𝑃𝑟𝑖𝑣𝑎𝑡𝑒");
        const unknownText = toMathBoldItalic("𝑈𝑛𝑘𝑛𝑜𝑤𝑛");

        if (!res.location || res.location === "𝐾ℎ𝑜𝑛𝑔 𝐶𝑜 𝐷𝑢 𝑙𝑖𝑒𝑢") res.location = notFoundText;
        if (!res.birthday || res.birthday === "𝐾ℎ𝑜𝑛𝑔 𝐶𝑜 𝐷𝑢 𝑙𝑖𝑒𝑢") res.birthday = notFoundText;
        if (!res.relationship_status || res.relationship_status === "𝐾ℎ𝑜𝑛𝑔 𝐶𝑜 𝐷𝑢 𝑙𝑖𝑒𝑢") res.relationship_status = notFoundText;
        if (!res.follow || res.follow === "𝐾ℎ𝑜𝑛𝑔 𝐶𝑜 𝐷𝑢 𝑙𝑖𝑒𝑢") res.follow = notFoundText;

        var gender = res.gender == 'male' ? maleText : res.gender == 'female' ? femaleText : secretText;
        var birthday = res.birthday ? toMathBoldItalic(res.birthday) : unknownText;
        var love = res.relationship_status ? toMathBoldItalic(res.relationship_status) : unknownText;
        var location = res.location ? toMathBoldItalic(res.location) : unknownText;
        const nameText = toMathBoldItalic(res.name || notFoundText);
        const uidText = toMathBoldItalic(uid.toString());
        const linkText = toMathBoldItalic(res.link || notFoundText);

        try {
            Canvas.registerFont(__dirname + `${fonts}`, { family: "Play-Bold" });
        } catch (e) { }

        const nameLabel = toMathBoldItalic("» 𝑁𝑎𝑚𝑒:");
        const genderLabel = toMathBoldItalic("» 𝐺𝑒𝑛𝑑𝑒𝑟:");
        const followLabel = toMathBoldItalic("» 𝐹𝑜𝑙𝑙𝑜𝑤𝑒𝑟𝑠:");
        const loveLabel = toMathBoldItalic("» 𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝:");
        const bdayLabel = toMathBoldItalic("» 𝐵𝑖𝑟𝑡ℎ𝑑𝑎𝑦:");
        const locationLabel = toMathBoldItalic("» 𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛:");

        ctx.font = `${fontsInfo}px Play-Bold`;
        ctx.fillStyle = colorName;
        ctx.textAlign = "start";

        ctx.fillText(`${nameLabel} ${nameText}`, 111, 160);
        ctx.fillText(`${genderLabel} ${gender}`, 111, 200);
        ctx.fillText(`${followLabel} ${toMathBoldItalic(String(res.follow || notFoundText))}`, 111, 240);
        ctx.fillText(`${loveLabel} ${love}`, 111, 280);
        ctx.fillText(`${bdayLabel} ${birthday}`, 111, 320);
        ctx.fillText(`${locationLabel} ${location}`, 111, 360);
        ctx.fillText(uidText, 1010, 466);

        ctx.font = `${fontsLink}px Play-Bold`;
        ctx.fillText(linkText, 145, 47);

        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        try { fs.removeSync(pathAvata); } catch (e) { }

        const doneMessage = toMathBoldItalic("✅ 𝑌𝑜𝑢𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑 𝑖𝑠 𝑟𝑒𝑎𝑑𝑦! 🎉✨");

        return api.sendMessage(
            {
                body: doneMessage,
                attachment: fs.createReadStream(pathImg)
            },
            threadID,
            () => {
                try { fs.unlinkSync(pathImg); } catch (e) { }
            },
            messageID
        );

    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟:", error);
        return api.sendMessage(`❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: ${error.message}`, event.threadID, event.messageID);
    }
};
