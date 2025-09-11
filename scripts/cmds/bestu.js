const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "bestu",
    aliases: ["couple", "pair"],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "image",
    shortDescription: {
        en: "𝐵𝑒𝑠𝑡𝑢 𝑝𝑎𝑖𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑐𝑜𝑢𝑝𝑙𝑒 𝑝𝑎𝑖𝑟 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
        en: "{p}bestu [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const fs = require("fs-extra");
    const path = require("path");
    const dirMaterial = __dirname + `/cache/canvas/`;
    const pathFile = path.resolve(__dirname, 'cache/canvas', 'bestu.png');
    
    if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
    }
    
    if (!fs.existsSync(pathFile)) {
        try {
            const imageData = await axios.get("https://i.imgur.com/RloX16v.jpg", { 
                responseType: 'arraybuffer' 
            });
            fs.writeFileSync(pathFile, Buffer.from(imageData.data));
        } catch (error) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑏𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒:", error);
        }
    }
};

async function makeImage({ one, two }) {
    const fs = require("fs-extra");
    const path = require("path");
    const __root = path.resolve(__dirname, "cache", "canvas");

    const baseImage = await jimp.read(__root + "/bestu.png");
    const pathImg = __root + `/bestu_${one}_${two}.png`;
    const avatarOnePath = __root + `/avt_${one}.png`;
    const avatarTwoPath = __root + `/avt_${two}.png`;

    try {
        // Download avatars
        const getAvatarOne = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
            responseType: 'arraybuffer' 
        });
        fs.writeFileSync(avatarOnePath, Buffer.from(getAvatarOne.data, 'utf-8'));

        const getAvatarTwo = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
            responseType: 'arraybuffer' 
        });
        fs.writeFileSync(avatarTwoPath, Buffer.from(getAvatarTwo.data, 'utf-8'));

        // Create circular avatars
        const circleOne = await jimp.read(await circle(avatarOnePath));
        const circleTwo = await jimp.read(await circle(avatarTwoPath));

        // Composite avatars on base image
        baseImage.composite(circleOne.resize(191, 191), 93, 111)
                 .composite(circleTwo.resize(190, 190), 434, 107);

        // Save final image
        const buffer = await baseImage.getBufferAsync("image/png");
        fs.writeFileSync(pathImg, buffer);

        return pathImg;
    } finally {
        // Cleanup temporary files
        if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath);
        if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath);
    }
}

async function circle(imagePath) {
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
}

function toMathBoldItalic(text) {
    const map = {
        'A':'𝑨','B':'𝑩','C':'𝑪','D':'𝑫','E':'𝑬','F':'𝑭','G':'𝑮','H':'𝑯','I':'𝑰','J':'𝑱',
        'K':'𝑲','L':'𝑳','M':'𝑴','N':'𝑵','O':'𝑶','P':'𝑷','Q':'𝑸','R':'𝑹','S':'𝑺','T':'𝑻',
        'U':'𝑼','V':'𝑽','W':'𝑾','X':'𝑿','Y':'𝒀','Z':'𝒁',
        'a':'𝒂','b':'𝒃','c':'𝒄','d':'𝒅','e':'𝒆','f':'𝒇','g':'𝒈','h':'𝒉','i':'𝒊','j':'𝒋',
        'k':'𝒌','l':'𝒍','m':'𝒎','n':'𝒏','o':'𝒐','p':'𝒑','q':'𝒒','r':'𝒓','s':'𝒔','t':'𝒕',
        'u':'𝒖','v':'𝒗','w':'𝒘','x':'𝒙','y':'𝒚','z':'𝒛'
    };
    return text.split('').map(char => map[char] || char).join('');
}

module.exports.onStart = async function ({ api, event, args }) {
    try {
        const { threadID, messageID, senderID } = event;
        const mention = Object.keys(event.mentions);

        if (!mention[0]) {
            const msg = toMathBoldItalic("𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑝𝑎𝑖𝑟 😅");
            return api.sendMessage(msg, threadID, messageID);
        }

        const one = senderID, two = mention[0];
        const imagePath = await makeImage({ one, two });
        
        const bodyMsg = toMathBoldItalic(`✧•❁𝐵𝑎𝑛𝑑ℎ𝑢𝑡𝑡𝑜❁•✧

╔═══❖••° °••❖═══╗

   𝑆𝑜𝑓𝑜𝑙 𝑃𝑎𝑖𝑟𝑖𝑛𝑔

╚═══❖••° °••❖═══╝

   ✶⊶⊷⊷❍⊶⊷⊷✶

       👑𝑁𝑖𝑦𝑒 𝑁𝑎𝑜 𝐵𝑎𝑛𝑑ℎ𝑢 ❤

𝑇𝑜𝑚𝑎𝑟 𝐵𝑒𝑠𝑡𝑢 🩷

   ✶⊶⊷⊷❍⊶⊷⊷✶`);

        await api.sendMessage({
            body: bodyMsg,
            attachment: fs.createReadStream(imagePath)
        }, threadID, () => {
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }, messageID);

    } catch (error) {
        console.error("𝐵𝑒𝑠𝑡𝑢 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑝𝑎𝑖𝑟 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", event.threadID, event.messageID);
    }
};
