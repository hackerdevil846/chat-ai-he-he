const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');

// Define the toMathBoldItalic function
const toMathBoldItalic = (text) => {
  const map = {
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆',
    'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
    'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐',
    'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
    'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬',
    'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
    'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶',
    'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
    'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
  };
  return text.replace(/[a-zA-Z]/g, char => map[char] || char);
};

module.exports.config = {
    name: "banner",
    aliases: ["createbanner", "design"],
    version: "1.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "media",
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑐𝑢𝑠𝑡𝑜𝑚 𝑏𝑎𝑛𝑛𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒𝑑 𝑏𝑎𝑛𝑛𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑎𝑛𝑖𝑚𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠 𝑎𝑛𝑑 𝑡𝑒𝑥𝑡"
    },
    guide: {
        en: "{p}𝑏𝑎𝑛𝑛𝑒𝑟 [𝑛𝑢𝑚𝑏𝑒𝑟]|[𝑛𝑎𝑚𝑒1]|[𝑛𝑎𝑚𝑒2]|[𝑛𝑎𝑚𝑒3]|[𝑐𝑜𝑙𝑜𝑟]"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "canvas": "",
        "path": ""
    }
};

module.exports.onStart = async function ({ event, message, args }) {
    try {
        // Check dependencies
        try {
            if (!fs.existsSync) throw new Error("𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑛𝑜𝑡 𝑖𝑛𝑠𝑡𝑎𝑙𝑙𝑒𝑑");
            if (!axios) throw new Error("𝑎𝑥𝑖𝑜𝑠 𝑛𝑜𝑡 𝑖𝑛𝑠𝑡𝑎𝑙𝑙𝑒𝑑");
            if (!createCanvas) throw new Error("𝑐𝑎𝑛𝑣𝑎𝑠 𝑛𝑜𝑡 𝑖𝑛𝑠𝑡𝑎𝑙𝑙𝑒𝑑");
        } catch (error) {
            return message.reply(`❌ ${error.message}. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑡ℎ𝑒 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠.`);
        }

        const inputs = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
        const text1 = inputs[0] || "21";
        const text2 = inputs[1] || "";
        const text3 = inputs[2] || "";
        const text4 = inputs[3] || "";
        const color = inputs[4] || "";
        
        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache', 'banner');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        // Get character data
        let lengthchar;
        try {
            const response = await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864');
            lengthchar = response.data;
        } catch (error) {
            // Fallback data if API fails
            lengthchar = [
                { imgAnime: "https://i.imgur.com/Ch778s2.png", colorBg: "#ff0000" },
                { imgAnime: "https://i.imgur.com/Ch778s2.png", colorBg: "#00ff00" },
                { imgAnime: "https://i.imgur.com/Ch778s2.png", colorBg: "#0000ff" }
            ];
        }
        
        const charNum = parseInt(text1);
        if (isNaN(charNum) || charNum < 1 || charNum > lengthchar.length) {
            const errorMsg = toMathBoldItalic(`𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1 𝑎𝑛𝑑 ${lengthchar.length}`);
            return message.reply(errorMsg);
        }
        
        const pathImg = path.join(cacheDir, 'avatar_1.png');
        const pathAva = path.join(cacheDir, 'avatar_2.png');
        
        // Download anime avatar
        try {
            const avtAnime = await axios.get(encodeURI(lengthchar[charNum - 1].imgAnime), { responseType: "arraybuffer" });
            fs.writeFileSync(pathAva, Buffer.from(avtAnime.data, "utf-8"));
        } catch (error) {
            // Use fallback image if download fails
            const fallbackImage = await axios.get("https://i.imgur.com/Ch778s2.png", { responseType: "arraybuffer" });
            fs.writeFileSync(pathAva, Buffer.from(fallbackImage.data, "utf-8"));
        }
        
        // Download background
        try {
            const background = await axios.get(encodeURI("https://imgur.com/Ch778s2.png"), { responseType: "arraybuffer" });
            fs.writeFileSync(pathImg, Buffer.from(background.data, "utf-8"));
        } catch (error) {
            // Create a simple background if download fails
            const canvas = createCanvas(2000, 1000);
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#e6b030";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(pathImg, buffer);
        }
        
        // Download fonts
        const fontFiles = {
            'PastiOblique-7B0wK.otf': 'https://github.com/hanakuUwU/font/raw/main/PastiOblique-7B0wK.otf',
            'gantellinesignature-bw11b.ttf': 'https://github.com/hanakuUwU/font/raw/main/gantellinesignature-bw11b.ttf',
            'UTM Bebas.ttf': 'https://github.com/hanakuUwU/font/raw/main/UTM%20Bebas.ttf'
        };
        
        const fontDir = path.join(__dirname, 'cache', 'fonts');
        if (!fs.existsSync(fontDir)) {
            fs.mkdirSync(fontDir, { recursive: true });
        }
        
        for (const [fontName, fontUrl] of Object.entries(fontFiles)) {
            const fontPath = path.join(fontDir, fontName);
            if (!fs.existsSync(fontPath)) {
                try {
                    const fontData = await axios.get(fontUrl, { responseType: "arraybuffer" });
                    fs.writeFileSync(fontPath, Buffer.from(fontData.data, "utf-8"));
                } catch (error) {
                    console.log(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑜𝑛𝑡: ${fontName}`);
                }
            }
        }
        
        const color_ = (color === "no" || color === "No" || color === "") 
            ? lengthchar[charNum - 1].colorBg 
            : color;
        
        let a = await loadImage(pathImg);
        let ab = await loadImage(pathAva);
        let canvas = createCanvas(a.width, a.height);
        let ctx = canvas.getContext("2d");
        
        ctx.fillStyle = "#e6b030";
        ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(ab, 1500, -400, 1980, 1980);
        
        // Register fonts if they exist
        try {
            registerFont(path.join(fontDir, 'PastiOblique-7B0wK.otf'), { family: "Pasti" });
            registerFont(path.join(fontDir, 'gantellinesignature-bw11b.ttf'), { family: "Gantelline" });
            registerFont(path.join(fontDir, 'UTM Bebas.ttf'), { family: "Bebas" });
        } catch (error) {
            console.log("𝑆𝑜𝑚𝑒 𝑓𝑜𝑛𝑡𝑠 𝑐𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑏𝑒 𝑙𝑜𝑎𝑑𝑒𝑑, 𝑢𝑠𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑓𝑜𝑛𝑡𝑠");
        }
        
        ctx.textAlign = "start";
        ctx.fillStyle = color_;
        ctx.font = "370px Pasti, Arial";
        ctx.fillText(text2, 500, 750);
        
        ctx.textAlign = "start";
        ctx.fillStyle = "#fff";
        ctx.font = "350px Gantelline, Arial";
        ctx.fillText(text3, 500, 680);
        
        ctx.save();
        ctx.textAlign = "end";
        ctx.fillStyle = "#f56236";
        ctx.font = "145px Pasti, Arial";
        ctx.fillText(text4, 2100, 870);
        
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        
        // Send the banner
        await message.reply({
            body: toMathBoldItalic("𝑌𝑜𝑢𝑟 𝑏𝑎𝑛𝑛𝑒𝑟 𝑖𝑠 𝑟𝑒𝑎𝑑𝑦! 𝐶ℎ𝑒𝑐𝑘 𝑖𝑡 𝑜𝑢𝑡 𝑏𝑒𝑙𝑜𝑤:"),
            attachment: fs.createReadStream(pathImg)
        });
        
        // Clean up
        try {
            fs.unlinkSync(pathImg);
            fs.unlinkSync(pathAva);
        } catch (cleanupError) {
            console.log("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
        }
        
    } catch (error) {
        console.error("𝐵𝑎𝑛𝑛𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
        const errorMsg = toMathBoldItalic("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑏𝑎𝑛𝑛𝑒𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        return message.reply(errorMsg);
    }
};
