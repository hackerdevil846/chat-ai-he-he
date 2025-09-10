const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

module.exports.config = {
    name: "autolink",
    aliases: ["autodownload", "socialdl"],
    version: "3.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚, 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘, 𝑇𝑖𝑘𝑇𝑜𝑘, 𝑇𝑤𝑖𝑡𝑡𝑒𝑟, 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡, 𝑎𝑛𝑑 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑎𝑢𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑟"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑠 𝑚𝑒𝑑𝑖𝑎 𝑓𝑟𝑜𝑚 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑠𝑜𝑐𝑖𝑎𝑙 𝑚𝑒𝑑𝑖𝑎 𝑝𝑙𝑎𝑡𝑓𝑜𝑟𝑚𝑠 𝑤ℎ𝑒𝑛 𝑎 𝑙𝑖𝑛𝑘 𝑖𝑠 𝑠ℎ𝑎𝑟𝑒𝑑 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡"
    },
    category: "𝑚𝑒𝑑𝑖𝑎",
    guide: {
        en: "{p}autolink [𝑜𝑛/𝑜𝑓𝑓] - 𝑇𝑢𝑟𝑛 𝑎𝑢𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑒𝑎𝑡𝑢𝑟𝑒 𝑜𝑛 𝑜𝑟 𝑜𝑓𝑓"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "cheerio": "",
        "qs": ""
    }
};

// 𝐻𝑒𝑙𝑝𝑒𝑟 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛 𝑡𝑜 𝑐𝑜𝑛𝑣𝑒𝑟𝑡 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑀𝑎𝑡ℎ𝑒𝑚𝑎𝑡𝑖𝑐𝑎𝑙 𝐵𝑜𝑙𝑑 𝐼𝑡𝑎𝑙𝑖𝑐
function toBoldItalic(text) {
    const map = {
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
        'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
        'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛'
    };
    return text.replace(/[A-Za-z]/g, char => map[char] || char);
}

// 𝐿𝑜𝑎𝑑 𝑎𝑢𝑡𝑜𝑙𝑖𝑛𝑘 𝑠𝑡𝑎𝑡𝑒𝑠
function loadAutoLinkStates() {
    try {
        const data = fs.readFileSync("autolink.json", "utf8");
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

// 𝑆𝑎𝑣𝑒 𝑎𝑢𝑡𝑜𝑙𝑖𝑛𝑘 𝑠𝑡𝑎𝑡𝑒𝑠
function saveAutoLinkStates(states) {
    fs.writeFileSync("autolink.json", JSON.stringify(states, null, 2));
}

let autoLinkStates = loadAutoLinkStates();

module.exports.onStart = async function ({ api, event, message, args }) {
    const threadID = event.threadID;

    if (!autoLinkStates[threadID]) {
        autoLinkStates[threadID] = 'on';
        saveAutoLinkStates(autoLinkStates);
    }

    if (args[0] && args[0].toLowerCase() === 'off') {
        autoLinkStates[threadID] = 'off';
        saveAutoLinkStates(autoLinkStates);
        await message.reply(toBoldItalic("𝐴𝑢𝑡𝑜𝐿𝑖𝑛𝑘 𝑒𝑖 𝑐ℎ𝑎𝑡 𝑒 𝑏𝑜𝑛𝑑ℎ𝑜 𝑘𝑜𝑟𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒"));
    } else if (args[0] && args[0].toLowerCase() === 'on') {
        autoLinkStates[threadID] = 'on';
        saveAutoLinkStates(autoLinkStates);
        await message.reply(toBoldItalic("𝐴𝑢𝑡𝑜𝐿𝑖𝑛𝑘 𝑒𝑖 𝑐ℎ𝑎𝑡 𝑒 𝑐ℎ𝑎𝑙𝑢 𝑘𝑜𝑟𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒"));
    } else {
        await message.reply(toBoldItalic(`𝐴𝑢𝑡𝑜𝐿𝑖𝑛𝑘 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 ${autoLinkStates[threadID] === 'on' ? '𝑂𝑁' : '𝑂𝐹𝐹'} 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑐ℎ𝑎𝑡`));
    }
};

module.exports.onChat = async function ({ event, message, api }) {
    const threadID = event.threadID;

    if (this.checkLink(event.body)) {
        const { url } = this.checkLink(event.body);
        console.log(toBoldItalic(`𝐴𝑡𝑡𝑒𝑚𝑝𝑡𝑖𝑛𝑔 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑟𝑜𝑚 𝑈𝑅𝐿: ${url}`));
        if (autoLinkStates[threadID] === 'on' || !autoLinkStates[threadID]) {
            this.downLoad(url, message, event);
        }
        api.setMessageReaction("🫦", event.messageID, (err) => {}, true);
    }
};

module.exports.downLoad = function (url, message, event) {
    const time = Date.now();
    const path = __dirname + `/cache/${time}.mp4`;

    if (url.includes("instagram")) {
        this.downloadInstagram(url, message, event, path);
    } else if (url.includes("facebook") || url.includes("fb.watch")) {
        this.downloadFacebook(url, message, event, path);
    } else if (url.includes("tiktok")) {
        this.downloadTikTok(url, message, event, path);
    } else if (url.includes("x.com")) {
        this.downloadTwitter(url, message, event, path);
    } else if (url.includes("pin.it")) {
        this.downloadPinterest(url, message, event, path);
    } else if (url.includes("youtu")) {
        this.downloadYouTube(url, message, event, path);
    }
};

module.exports.downloadInstagram = async function (url, message, event, path) {
    try {
        const res = await this.getLink(url, message, event, path);
        const response = await axios({
            method: "GET",
            url: res,
            responseType: "arraybuffer"
        });
        fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
        if (fs.statSync(path).size / 1024 / 1024 > 25) {
            return message.reply(toBoldItalic("𝐹𝑖𝑙𝑒 𝑡𝑎 𝑜𝑛𝑒𝑘 𝑏𝑜𝑟𝑜, 𝑝𝑎𝑡ℎ𝑎𝑛𝑜 𝑗𝑎𝑏𝑒 𝑛𝑎"));
        }

        const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐿𝑖𝑛𝑘')}: ${res}`;

        await message.reply({
            body: toBoldItalic(messageBody),
            attachment: fs.createReadStream(path)
        });
        fs.unlinkSync(path);
    } catch (err) {
        console.error(err);
        await message.reply(toBoldItalic("𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟"));
    }
};

module.exports.downloadFacebook = async function (url, message, event, path) {
    try {
        const res = await fbDownloader(url);
        if (res.success && res.download && res.download.length > 0) {
            const videoUrl = res.download[0].url;
            const response = await axios({
                method: "GET",
                url: videoUrl,
                responseType: "stream"
            });
            if (response.headers['content-length'] > 87031808) {
                return message.reply(toBoldItalic("𝐹𝑖𝑙𝑒 𝑡𝑎 𝑜𝑛𝑒𝑘 𝑏𝑜𝑟𝑜, 𝑝𝑎𝑡ℎ𝑎𝑛𝑜 𝑗𝑎𝑏𝑒 𝑛𝑎"));
            }
            
            const writer = fs.createWriteStream(path);
            response.data.pipe(writer);
            
            writer.on('finish', async () => {
                const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐿𝑖𝑛𝑘')}: ${videoUrl}`;

                await message.reply({
                    body: toBoldItalic(messageBody),
                    attachment: fs.createReadStream(path)
                });
                fs.unlinkSync(path);
            });
            
            writer.on('error', (err) => {
                console.error(err);
                message.reply(toBoldItalic("𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟"));
            });
        } else {
            await message.reply(toBoldItalic("𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟"));
        }
    } catch (err) {
        console.error(err);
        await message.reply(toBoldItalic("𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟"));
    }
};

module.exports.downloadTikTok = async function (url, message, event, path) {
    try {
        const res = await this.getLink(url, message, event, path);
        const response = await axios({
            method: "GET",
            url: res,
            responseType: "arraybuffer"
        });
        fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
        if (fs.statSync(path).size / 1024 / 1024 > 25) {
            return message.reply(toBoldItalic("𝐹𝑖𝑙𝑒 𝑡𝑎 𝑜𝑛𝑒𝑘 𝑏𝑜𝑟𝑜, 𝑝𝑎𝑡ℎ𝑎𝑛𝑜 𝑗𝑎𝑏𝑒 𝑛𝑎"));
        }

        const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐿𝑖𝑛𝑘')}: ${res}`;

        await message.reply({
            body: toBoldItalic(messageBody),
            attachment: fs.createReadStream(path)
        });
        fs.unlinkSync(path);
    } catch (err) {
        console.error(err);
        await message.reply(toBoldItalic("𝑇𝑖𝑘𝑇𝑜𝑘 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟"));
    }
};

module.exports.downloadTwitter = async function (url, message, event, path) {
    try {
        const res = await axios.get(`https://xdl-twitter.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
        const videoUrl = res.data.url;

        const response = await axios({
            method: "GET",
            url: videoUrl,
            responseType: "stream"
        });

        if (response.headers['content-length'] > 87031808) {
            return message.reply(toBoldItalic("𝐹𝑖𝑙𝑒 𝑡𝑎 𝑜𝑛𝑒𝑘 𝑏𝑜𝑟𝑜, 𝑝𝑎𝑡ℎ𝑎𝑛𝑜 𝑗𝑎𝑏𝑒 𝑛𝑎"));
        }

        const writer = fs.createWriteStream(path);
        response.data.pipe(writer);
        
        writer.on('finish', async () => {
            const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐿𝑖𝑛𝑘')}: ${videoUrl}`;

            await message.reply({
                body: toBoldItalic(messageBody),
                attachment: fs.createReadStream(path)
            });
            fs.unlinkSync(path);
        });
        
        writer.on('error', (err) => {
            console.error(err);
            message.reply(toBoldItalic("𝑇𝑤𝑖𝑡𝑡𝑒𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟"));
        });
    } catch (err) {
        console.error(err);
        await message.reply(toBoldItalic("𝑇𝑤𝑖𝑡𝑡𝑒𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟"));
    }
};

module.exports.downloadPinterest = async function (url, message, event, path) {
    try {
        const res = await axios.get(`https://pindl-pinterest.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
        const videoUrl = res.data.url;

        const response = await axios({
            method: "GET",
            url: videoUrl,
            responseType: "stream"
        });

        if (response.headers['content-length'] > 87031808) {
            return message.reply(toBoldItalic("𝐹𝑖𝑙𝑒 𝑡𝑎 𝑜𝑛𝑒𝑘 𝑏𝑜𝑟𝑜, 𝑝𝑎𝑡ℎ𝑎𝑛𝑜 𝑗𝑎𝑏𝑒 𝑛𝑎"));
        }

        const writer = fs.createWriteStream(path);
        response.data.pipe(writer);
        
        writer.on('finish', async () => {
            const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐿𝑖𝑛𝑘')}: ${videoUrl}`;

            await message.reply({
                body: toBoldItalic(messageBody),
                attachment: fs.createReadStream(path)
            });
            fs.unlinkSync(path);
        });
        
        writer.on('error', (err) => {
            console.error(err);
            message.reply(toBoldItalic("𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟"));
        });
    } catch (err) {
        console.error(err);
        await message.reply(toBoldItalic("𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟"));
    }
};

module.exports.downloadYouTube = async function (url, message, event, path) {
    try {
        const res = await axios.get(`https://yt-downloader-eta.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
        const videoUrl = res.data['480p'];

        const response = await axios({
            method: "GET",
            url: videoUrl,
            responseType: "stream"
        });

        if (response.headers['content-length'] > 87031808) {
            return message.reply(toBoldItalic("𝐹𝑖𝑙𝑒 𝑡𝑎 𝑜𝑛𝑒𝑘 𝑏𝑜𝑟𝑜, 𝑝𝑎𝑡ℎ𝑎𝑛𝑜 𝑗𝑎𝑏𝑒 𝑛𝑎"));
        }

        const writer = fs.createWriteStream(path);
        response.data.pipe(writer);
        
        writer.on('finish', async () => {
            const messageBody = `╔════ஜ۩۞۩ஜ═══╗\n          𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n╚════ஜ۩۞۩ஜ═══╝\n\n🔗${toBoldItalic('𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐿𝑖𝑛𝑘')}: ${videoUrl}`;

            await message.reply({
                body: toBoldItalic(messageBody),
                attachment: fs.createReadStream(path)
            });
            fs.unlinkSync(path);
        });
        
        writer.on('error', (err) => {
            console.error(err);
            message.reply(toBoldItalic("𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟"));
        });
    } catch (err) {
        console.error(err);
        await message.reply(toBoldItalic("𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟"));
    }
};

module.exports.getLink = function (url, message, event, path) {
    return new Promise((resolve, reject) => {
        if (url.includes("instagram")) {
            axios({
                method: "GET",
                url: `https://insta-downloader-ten.vercel.app/insta?url=${encodeURIComponent(url)}`
            })
            .then(res => {
                if (res.data.url) {
                    resolve(res.data.url);
                } else {
                    reject(new Error(toBoldItalic("𝐸𝑟𝑟𝑜𝑟: 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑖𝑛𝑣𝑎𝑙𝑖𝑑")));
                }
            })
            .catch(err => reject(err));
        } else if (url.includes("facebook") || url.includes("fb.watch")) {
            fbDownloader(url).then(res => {
                if (res.success && res.download && res.download.length > 0) {
                    const videoUrl = res.download[0].url;
                    resolve(videoUrl);
                } else {
                    reject(new Error(toBoldItalic("𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟")));
                }
            }).catch(err => reject(err));
        } else if (url.includes("tiktok")) {
            this.queryTikTok(url).then(res => {
                resolve(res.downloadUrls);
            }).catch(err => reject(err));
        } else {
            reject(new Error(toBoldItalic("𝑈𝑛𝑠𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑑 𝑝𝑙𝑎𝑡𝑓𝑜𝑟𝑚")));
        }
    });
};

module.exports.queryTikTok = async function (url) {
    try {
        const res = await axios.get("https://ssstik.io/en");
        const s_tt = res.data.split('s_tt = ')[1].split(',')[0];
        const { data: result } = await axios({
            url: "https://ssstik.io/abc?url=dl",
            method: "POST",
            data: qs.stringify({
                id: url,
                locale: 'en',
                tt: s_tt
            }),
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33"
            }
        });

        const $ = cheerio.load(result);
        if (result.includes('<div class="is-icon b-box warning">')) {
            throw {
                status: "error",
                message: $('p').text()
            };
        }

        const allUrls = $('.result_overlay_buttons > a');
        const format = {
            status: 'success',
            title: $('.maintext').text()
        };

        const slide = $(".slide");
        if (slide.length !== 0) {
            const url = [];
            slide.each((index, element) => {
                url.push($(element).attr('href'));
            });
            format.downloadUrls = url;
            return format;
        }

        format.downloadUrls = $(allUrls[0]).attr('href');
        return format;
    } catch (err) {
        console.error(toBoldItalic('𝑇𝑖𝑘𝑇𝑜𝑘 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:'), err);
        return {
            status: "error",
            message: toBoldItalic("𝑇𝑖𝑘𝑇𝑜𝑘 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑝𝑟𝑜𝑏𝑙𝑒𝑚")
        };
    }
};

module.exports.checkLink = function (url) {
    if (
        url.includes("instagram") ||
        url.includes("facebook") ||
        url.includes("fb.watch") ||
        url.includes("tiktok") ||
        url.includes("x.com") ||
        url.includes("pin.it") ||
        url.includes("youtu")
    ) {
        return {
            url: url
        };
    }

    const fbWatchRegex = /fb\.watch\/[a-zA-Z0-9_-]+/i;
    if (fbWatchRegex.test(url)) {
        return {
            url: url
        };
    }

    return null;
};

async function fbDownloader(url) {
    try {
        const response1 = await axios({
            method: 'POST',
            url: 'https://snapsave.app/action.php?lang=vn',
            headers: {
                "accept": "*/*",
                "accept-language": "vi,en-US;q=0.9,en;q=0.8",
                "content-type": "multipart/form-data",
                "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "Referer": "https://snapsave.app/vn",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            data: {
                url
            }
        });

        let html;
        const evalCode = response1.data.replace('return decodeURIComponent', 'html = decodeURIComponent');
        eval(evalCode);
        html = html.split('innerHTML = "')[1].split('";\n')[0].replace(/\\"/g, '"');

        const $ = cheerio.load(html);
        const download = [];

        const tbody = $('table').find('tbody');
        const trs = tbody.find('tr');

        trs.each(function (i, elem) {
            const trElement = $(elem);
            const tds = trElement.children();
            const quality = $(tds[0]).text().trim();
            const url = $(tds[2]).children('a').attr('href');
            if (url != undefined) {
                download.push({
                    quality,
                    url
                });
            }
        });

        return {
            success: true,
            video_length: $("div.clearfix > p").text().trim(),
            download
        };
    } catch (err) {
        console.error(toBoldItalic('𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:'), err);
        return {
            success: false
        };
    }
}
