module.exports.config = {
    name: "console",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑴𝒂𝒌𝒆 𝒕𝒉𝒆 𝒄𝒐𝒏𝒔𝒐𝒍𝒆 𝒎𝒐𝒓𝒆 𝒃𝒆𝒂𝒖𝒕𝒊𝒇𝒖𝒍",
    category: "𝑨𝒅𝒎𝒊𝒏-𝒃𝒐𝒕 𝒔𝒚𝒔𝒕𝒆𝒎",
    usages: "𝒄𝒐𝒏𝒔𝒐𝒍𝒆",
    cooldowns: 0,
    dependencies: {
        "chalk": "latest",
        "moment-timezone": "latest"
    }
};

module.exports.languages = {
    "vi": {
        "on": "𝑩𝒂̣̂𝒕",
        "off": "𝑻𝒂̆́𝒕",
        "successText": "𝒄𝒐𝒏𝒔𝒐𝒍𝒆 𝒕𝒉𝒂̀𝒏𝒉 𝒄𝒐̂𝒏𝒈"
    },
    "en": {
        "on": "𝒐𝒏",
        "off": "𝒐𝒇𝒇",
        "successText": "𝒄𝒐𝒏𝒔𝒐𝒍𝒆 𝒔𝒖𝒄𝒄𝒆𝒔𝒔!"
    }
};

module.exports.onLoad = function () {
    console.log("💖 𝑨𝒔𝒊𝒇 𝑩𝒐𝒕: Console command loaded!");
};

module.exports.handleEvent = async function ({ api, event, Users, Threads }) {
    const { messageID, threadID, senderID } = event;
    if (senderID == global.data.botID) return;

    const chalk = require("chalk");
    const moment = require("moment-timezone");

    const thread = global.data.threadData.get(threadID) || {};
    if (thread.console) return;

    const nameBox = (await Threads.getInfo(threadID)).threadName || "𝑵𝒂𝒎𝒆 𝒅𝒐𝒆𝒔 𝒏𝒐𝒕 𝒆𝒙𝒊𝒔𝒕";
    const nameUser = await Users.getNameUser(senderID);
    const msg = event.body || "𝑷𝒉𝒐𝒕𝒐𝒔, 𝒗𝒊𝒅𝒆𝒐𝒔 𝒐𝒓 𝒔𝒑𝒆𝒄𝒊𝒂𝒍 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓𝒔";

    const colors = ["FF9900","FFFF33","33FFFF","FF99FF","FF3366","FFFF66","FF00FF","66FF99","00CCFF","FF0099",
                    "FF0066","7900FF","93FFD8","CFFFDC","FF5B00","3B44F6","A6D1E6","7F5283","A66CFF","F05454",
                    "FCF8E8","94B49F","47B5FF","B8FFF9","42C2FF","FF7396"];

    const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

    console.log(
        chalk.hex("#"+randomColor())(`[💓]→ 𝑮𝒓𝒐𝒖𝒑 𝒏𝒂𝒎𝒆: ${nameBox}`) + "\n" +
        chalk.hex("#"+randomColor())(`[🔎]→ 𝑮𝒓𝒐𝒖𝒑 𝑰𝑫: ${threadID}`) + "\n" +
        chalk.hex("#"+randomColor())(`[🔱]→ 𝑼𝒔𝒆𝒓 𝒏𝒂𝒎𝒆: ${nameUser}`) + "\n" +
        chalk.hex("#"+randomColor())(`[📝]→ 𝑼𝒔𝒆𝒓 𝑰𝑫: ${senderID}`) + "\n" +
        chalk.hex("#"+randomColor())(`[📩]→ 𝑪𝒐𝒏𝒕𝒆𝒏𝒕: ${msg}`) + "\n" +
        chalk.hex("#"+randomColor())(`[ ${moment.tz("Asia/Dhaka").format("LLLL")} ]`) + "\n" +
        chalk.hex("#"+randomColor())("◆━━━━━━━━━◆ 𝑨𝒔𝒊𝒇 𝑩𝒐𝒕 🐧 ◆━━━━━━━━◆\n")
    );
};

module.exports.run = async function ({ api, event, Threads, getText }) {
    const { threadID, messageID } = event;
    let data = (await Threads.getData(threadID)).data;

    data.console = typeof data.console === "undefined" || data.console ? false : true;

    await Threads.setData(threadID, { data });
    global.data.threadData.set(threadID, data);

    const status = data.console ? getText("off") : getText("on");
    const message = `${status} ${getText("successText")}`;

    // Convert message to Mathematical Bold Italic
    const boldItalicMap = {
        'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋',
        'k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝒒','r': '𝒓','s': '𝒔','t': '𝒕',
        'u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
        'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱',
        'K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻',
        'U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿','Y': '𝒀','Z': '𝒁'
    };

    const formattedMessage = message.replace(/[a-zA-Z]/g, char => boldItalicMap[char] || char);

    return api.sendMessage(formattedMessage, threadID, messageID);
};
