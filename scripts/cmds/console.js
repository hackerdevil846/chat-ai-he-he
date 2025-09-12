const chalk = require("chalk");
const moment = require("moment-timezone");

module.exports.config = {
    name: "console",
    aliases: ["consolex", "logstyle"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 3,
    category: "admin",
    shortDescription: {
        en: "𝑀𝑎𝑘𝑒 𝑡ℎ𝑒 𝑐𝑜𝑛𝑠𝑜𝑙𝑒 𝑚𝑜𝑟𝑒 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙"
    },
    longDescription: {
        en: "𝐵𝑒𝑎𝑢𝑡𝑖𝑓𝑖𝑒𝑠 𝑡ℎ𝑒 𝑐𝑜𝑛𝑠𝑜𝑙𝑒 𝑜𝑢𝑡𝑝𝑢𝑡 𝑤𝑖𝑡ℎ 𝑐𝑜𝑙𝑜𝑟𝑠 𝑎𝑛𝑑 𝑓𝑜𝑟𝑚𝑎𝑡𝑡𝑖𝑛𝑔"
    },
    guide: {
        en: "{p}console"
    },
    dependencies: {
        "chalk": "",
        "moment-timezone": ""
    }
};

module.exports.languages = {
    "en": {
        "on": "𝑜𝑛",
        "off": "𝑜𝑓𝑓",
        "successText": "𝑐𝑜𝑛𝑠𝑜𝑙𝑒 𝑠𝑢𝑐𝑐𝑒𝑠𝑠!"
    }
};

module.exports.onLoad = function () {
    console.log("💖 𝐴𝑠𝑖𝑓 𝐵𝑜𝑡: 𝐶𝑜𝑛𝑠𝑜𝑙𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑙𝑜𝑎𝑑𝑒𝑑!");
};

module.exports.onChat = async function ({ event, api, Users, Threads }) {
    const { threadID, senderID } = event;
    if (senderID == global.botID) return;
    
    const thread = global.data.threadData.get(threadID) || {};
    if (thread.console) return;
    
    try {
        const nameBox = (await Threads.getInfo(threadID)).threadName || "𝑁𝑎𝑚𝑒 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡";
        const nameUser = await Users.getNameUser(senderID);
        const msg = event.body || "𝑃ℎ𝑜𝑡𝑜𝑠, 𝑣𝑖𝑑𝑒𝑜𝑠 𝑜𝑟 𝑠𝑝𝑒𝑐𝑖𝑎𝑙 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠";
        
        const colors = [
            "FF9900", "FFFF33", "33FFFF", "FF99FF", "FF3366", "FFFF66", "FF00FF", "66FF99", "00CCFF", "FF0099",
            "FF0066", "7900FF", "93FFD8", "CFFFDC", "FF5B00", "3B44F6", "A6D1E6", "7F5283", "A66CFF", "F05454",
            "FCF8E8", "94B49F", "47B5FF", "B8FFF9", "42C2FF", "FF7396"
        ];
        
        const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
        
        console.log(
            chalk.hex("#" + randomColor())(`[💓]→ 𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒: ${nameBox}`) + "\n" +
            chalk.hex("#" + randomColor())(`[🔎]→ 𝐺𝑟𝑜𝑢𝑝 𝐼𝐷: ${threadID}`) + "\n" +
            chalk.hex("#" + randomColor())(`[🔱]→ 𝑈𝑠𝑒𝑟 𝑛𝑎𝑚𝑒: ${nameUser}`) + "\n" +
            chalk.hex("#" + randomColor())(`[📝]→ 𝑈𝑠𝑒𝑟 𝐼𝐷: ${senderID}`) + "\n" +
            chalk.hex("#" + randomColor())(`[📩]→ 𝐶𝑜𝑛𝑡𝑒𝑛𝑡: ${msg}`) + "\n" +
            chalk.hex("#" + randomColor())(`[ ${moment.tz("𝐴𝑠𝑖𝑎/𝐷ℎ𝑎𝑘𝑎").format("𝐿𝐿𝐿𝐿")} ]`) + "\n" +
            chalk.hex("#" + randomColor())("◆━━━━━━━━━◆ 𝐴𝑠𝑖𝑓 𝐵𝑜𝑡 🐧 ◆━━━━━━━━◆\n")
        );
    } catch (error) {
        console.error("𝐶𝑜𝑛𝑠𝑜𝑙𝑒 𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onStart = async function ({ message, event, Threads, getText }) {
    const { threadID, messageID } = event;
    
    try {
        let data = (await Threads.getData(threadID)).data;
        data.console = typeof data.console === "undefined" || data.console ? false : true;
        await Threads.setData(threadID, { data });
        global.data.threadData.set(threadID, data);
        
        const status = data.console ? getText("off") : getText("on");
        const messageText = `${status} ${getText("successText")}`;
        
        const boldItalicMap = {
            'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
            'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
            'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
            'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
            'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
            'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
        };
        
        const formattedMessage = messageText.replace(/[a-zA-Z]/g, char => boldItalicMap[char] || char);
        
        await message.reply(formattedMessage);
    } catch (error) {
        console.error("𝐶𝑜𝑛𝑠𝑜𝑙𝑒 𝑆𝑡𝑎𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑡𝑜𝑔𝑔𝑙𝑖𝑛𝑔 𝑐𝑜𝑛𝑠𝑜𝑙𝑒 𝑓𝑒𝑎𝑡𝑢𝑟𝑒.");
    }
};
