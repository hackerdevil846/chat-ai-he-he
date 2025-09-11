const axios = require('axios');
const fs = require('fs-extra');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

// Define the toBI function for bold italic text
const toBI = (text) => {
  const map = {
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆',
    f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
    k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐',
    p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
    u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚',
    z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫',
    E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰',
    J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵',
    O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺',
    T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿',
    Y: '𝒀', Z: '𝒁', 
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
};

module.exports.config = {
    name: "banner2",
    aliases: ["animebanner", "custombanner"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "media",
    shortDescription: {
        en: "𝐵𝑎𝑛𝑛𝑒𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑡𝑜𝑜𝑙"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑐𝑢𝑠𝑡𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑏𝑎𝑛𝑛𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑛𝑎𝑚𝑒"
    },
    guide: {
        en: "{p}banner2 [find/list] 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑢𝑠𝑒"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "canvas": "",
        "path": ""
    }
};

module.exports.onStart = async function ({ event, message, args, api }) {
    try {
        const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
        
        if (args[0] == "find" || args[0] == "tìm") {
            if (!args[1]) {
                return message.reply(toBI("❎ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝐼𝐷. 𝑈𝑠𝑒 '𝑏𝑎𝑛𝑛𝑒𝑟2 𝑙𝑖𝑠𝑡' 𝑡𝑜 𝑠𝑒𝑒 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠"));
            }
            
            const character = lengthchar[args[1]];
            if (!character) {
                return message.reply(toBI("❎ 𝐶ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑈𝑠𝑒 '𝑏𝑎𝑛𝑛𝑒𝑟2 𝑙𝑖𝑠𝑡' 𝑡𝑜 𝑠𝑒𝑒 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠"));
            }
            
            const imageStream = (await axios.get(character.imgAnime, { responseType: "stream" })).data;
            const msg = {
                body: toBI(`𝐶ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝐼𝐷: ${args[1]}, 𝐷𝑒𝑓𝑎𝑢𝑙𝑡 𝐶𝑜𝑙𝑜𝑟: ${character.colorBg}`),
                attachment: imageStream
            };
            return message.reply(msg);
        }
        else if (args[0] == "list") {
            const alime = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
            const count = alime.listAnime.length;
            const data = alime.listAnime;
            let page = parseInt(args[1]) || 1;
            page = page < 1 ? 1 : page;
            
            const limit = 20;
            const numPage = Math.ceil(count / limit);
            
            if (page > numPage) {
                return message.reply(toBI(`❎ 𝑃𝑎𝑔𝑒 ${page} 𝑑𝑜𝑒𝑠𝑛'𝑡 𝑒𝑥𝑖𝑠𝑡. 𝑇ℎ𝑒𝑟𝑒 𝑎𝑟𝑒 𝑜𝑛𝑙𝑦 ${numPage} 𝑝𝑎𝑔𝑒𝑠`));
            }
            
            let msg = toBI("𝐴𝑛𝑖𝑚𝑒 𝐿𝑖𝑠𝑡:\n\n");
            const startIndex = limit * (page - 1);
            const endIndex = Math.min(startIndex + limit, count);
            
            for (let i = startIndex; i < endIndex; i++) {
                msg += `[ ${i + 1} ] - ${data[i].ID} | ${data[i].name}\n`;
            }
            
            msg += toBI(`\n𝑃𝑎𝑔𝑒 (${page}/${numPage})\n𝑈𝑠𝑒 ${global.config.PREFIX}𝑏𝑎𝑛𝑛𝑒𝑟2 𝑙𝑖𝑠𝑡 <𝑝𝑎𝑔𝑒 𝑛𝑢𝑚𝑏𝑒𝑟>`);
            return message.reply(msg);
        } 
        else {
            return message.reply(toBI("𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝐼𝐷"), (err, info) => {
                global.client.handleReply.push({
                    step: 1,
                    name: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID
                });
            });
        }
    } catch (error) {
        console.error("𝐵𝑎𝑛𝑛𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
        return message.reply(toBI("❎ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟"));
    }
};

module.exports.onReply = async function({ event, message, Reply, api }) {
    try {
        if (event.senderID !== Reply.author) {
            return message.reply(toBI("❎ 𝐴𝑐𝑐𝑒𝑠𝑠 𝑑𝑒𝑛𝑖𝑒𝑑"));
        }

        const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;

        if (Reply.step === 1) {
            const characterId = event.body.trim();
            const character = lengthchar[characterId];
            
            if (!character) {
                return message.reply(toBI("❎ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝐼𝐷. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛"), (err, info) => {
                    global.client.handleReply.push({
                        step: 1,
                        name: this.config.name,
                        author: event.senderID,
                        messageID: info.messageID
                    });
                });
            }

            message.unsend(Reply.messageID);
            return message.reply(toBI(`𝑌𝑜𝑢 𝑠𝑒𝑙𝑒𝑐𝑡𝑒𝑑: ${characterId}\n𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑛𝑎𝑚𝑒`), (err, info) => {
                global.client.handleReply.push({
                    step: 2,
                    name: this.config.name,
                    chartid: characterId,
                    author: event.senderID,
                    messageID: info.messageID
                });
            });
        } 
        else if (Reply.step === 2) {
            message.unsend(Reply.messageID);
            return message.reply(toBI(`𝑌𝑜𝑢𝑟 𝑛𝑎𝑚𝑒: ${event.body}\n𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑐𝑜𝑙𝑜𝑟 𝑛𝑎𝑚𝑒 𝑜𝑟 ℎ𝑒𝑥 𝑐𝑜𝑑𝑒 (𝑜𝑟 𝑡𝑦𝑝𝑒 '𝑛𝑜' 𝑓𝑜𝑟 𝑑𝑒𝑓𝑎𝑢𝑙𝑡)`), (err, info) => {
                global.client.handleReply.push({
                    step: 3,
                    name: this.config.name,
                    chartid: Reply.chartid,
                    ten: event.body,
                    author: event.senderID,
                    messageID: info.messageID
                });
            });
        } 
        else if (Reply.step === 3) {
            message.unsend(Reply.messageID);
            
            const color = event.body.trim();
            const id = Reply.chartid;
            const title = Reply.ten;
            const character = lengthchar[id];
            
            if (!character) {
                return message.reply(toBI("❎ 𝐶ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑑𝑎𝑡𝑎 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑"));
            }
            
            const color_ = (!color || color.toLowerCase() === "no") ? character.colorBg : color;
            
            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            // Define paths
            const pathImg = path.join(cacheDir, 'banner_output.png');
            const pathAva = path.join(cacheDir, 'character.png');
            const fontPath = path.join(cacheDir, 'MTOJamai.ttf');
            
            try {
                // Download font if missing
                if (!fs.existsSync(fontPath)) {
                    const fontData = (await axios.get('https://github.com/hanakuUwU/font/raw/main/MTOJamai.ttf', { 
                        responseType: 'arraybuffer' 
                    })).data;
                    fs.writeFileSync(fontPath, Buffer.from(fontData));
                }
                
                // Download character image
                const avtAnime = (await axios.get(character.imgAnime, { responseType: 'arraybuffer' })).data;
                fs.writeFileSync(pathAva, Buffer.from(avtAnime));
                
                // Download assets
                const assetUrls = [
                    'https://lh3.googleusercontent.com/-tZ8DTN-bXEY/YhScBI5VuSI/AAAAAAAA5QI/8OxatfQvJU8q4TWk8vo9OWawDRn0aQhOACNcBGAsYHQ/s0/a1.png',
                    'https://lh3.googleusercontent.com/-_GlhDWCWQLA/YhScA7so4UI/AAAAAAAA5QA/4NqayceKTTkbQrPT0Cu5TQCuEp-V95T3ACNcBGAsYHQ/s0/a2.png',
                    'https://lh3.googleusercontent.com/-IiDSkRdLuK4/YhScA1Xd7WI/AAAAAAAA5QE/KlFoQuZpFc8W31A2C8-uUmXkpvLbmL6JQCNcBGAsYHQ/s0/a3.png',
                    'https://lh3.googleusercontent.com/-jagDZ8l1rwc/YhSbpTKubAI/AAAAAAAA5P4/GYy2WICTkHAM0AoJvYhsLc6asVsnbAR2wCNcBGAsYHQ/s0/l1.png',
                    'https://lh3.googleusercontent.com/-EE6U5xmi_QY/YhScRCT94XI/AAAAAAAA5QY/6WJM0j7URsgjisGTEN-tgOJ6NVx_Ql5-ACNcBGAsYHQ/s0/l2.png',
                    'https://lh3.googleusercontent.com/-hkTkESFE1OU/YhSdWD3kR_I/AAAAAAAA5Qk/Fw4rwDc5CxEaLacLatZJLT6FAnm5dNYYACNcBGAsYHQ/s0/b1.png',
                    'https://lh3.googleusercontent.com/-U-P92f1nTfk/YhSdVnqbEFI/AAAAAAAA5Qg/UgA37F2XTCY0u_Cu0fghfppITmPZIokFwCNcBGAsYHQ/s0/b2.png'
                ];
                
                const assetPaths = [];
                for (let i = 0; i < assetUrls.length; i++) {
                    const assetPath = path.join(cacheDir, `asset_${i}.png`);
                    const assetData = (await axios.get(assetUrls[i], { responseType: 'arraybuffer' })).data;
                    fs.writeFileSync(assetPath, Buffer.from(assetData));
                    assetPaths.push(assetPath);
                }
                
                // Create banner
                const canvas = createCanvas(1080, 1920);
                const ctx = canvas.getContext('2d');
                
                // Load all images
                const [
                    characterImage,
                    ...assetImages
                ] = await Promise.all([
                    loadImage(pathAva),
                    ...assetPaths.map(path => loadImage(path))
                ]);
                
                // Draw background
                ctx.fillStyle = color_;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw assets
                ctx.drawImage(assetImages[0], 0, 0, canvas.width, canvas.height); // a1.png
                ctx.drawImage(characterImage, -100, -1000, 1700, 1700);
                ctx.drawImage(assetImages[3], 0, 0, canvas.width, canvas.height); // l1.png
                ctx.drawImage(assetImages[4], 0, 0, canvas.width, canvas.height); // l2.png
                ctx.drawImage(assetImages[1], 0, 0, canvas.width, canvas.height); // a2.png
                ctx.drawImage(assetImages[5], -50, 130, 800, 800); // b1.png
                ctx.drawImage(assetImages[6], 0, 0, canvas.width, canvas.height); // b2.png
                
                // Draw text
                registerFont(fontPath, { family: 'MTOJamai' });
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 80px MTOJamai';
                ctx.setTransform(1, -0.1, 0, 1, 0, 0);
                ctx.textAlign = 'center';
                ctx.shadowColor = '#000';
                ctx.shadowBlur = 10;
                
                for (let i = 0; i < 5; i++) {
                    ctx.fillText(title, 370, 580);
                }
                
                // Reset transform
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                
                // Save image
                const buffer = canvas.toBuffer();
                fs.writeFileSync(pathImg, buffer);
                
                // Send result
                return message.reply({
                    body: toBI("𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑏𝑎𝑛𝑛𝑒𝑟:"),
                    attachment: fs.createReadStream(pathImg)
                }, async () => {
                    // Cleanup files
                    try {
                        fs.unlinkSync(pathImg);
                        fs.unlinkSync(pathAva);
                        assetPaths.forEach(assetPath => fs.unlinkSync(assetPath));
                    } catch (cleanupError) {
                        console.error('𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:', cleanupError);
                    }
                });
            } catch (error) {
                console.error('𝐵𝑎𝑛𝑛𝑒𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:', error);
                return message.reply(toBI("❎ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑏𝑎𝑛𝑛𝑒𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟"));
            }
        }
    } catch (error) {
        console.error('𝑅𝑒𝑝𝑙𝑦 ℎ𝑎𝑛𝑑𝑙𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:', error);
        return message.reply(toBI("❎ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛"));
    }
};
