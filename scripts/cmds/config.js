const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "config",
    aliases: ["botconfig", "configure"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "𝐶𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑒 𝑏𝑜𝑡 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠"
    },
    longDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑏𝑜𝑡 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑎𝑑𝑚𝑖𝑛 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠"
    },
    guide: {
        en: "{p}config\n{p}config <𝑜𝑝𝑡𝑖𝑜𝑛> <𝑣𝑎𝑙𝑢𝑒>"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "moment-timezone": ""
    }
};

// 𝑲𝒆𝒆𝒑 𝒐𝒓𝒊𝒈𝒊𝒏𝒂𝒍 𝒂𝒑𝒑𝒔𝒕𝒂𝒕𝒆 𝒑𝒂𝒕𝒉 𝒂𝒔 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒆𝒅 (𝒅𝒐 𝑵𝑶𝑻 𝒄𝒉𝒂𝒏𝒈𝒆)
const appStatePath = path.join(__dirname, "../../appstate.json");

let appState = null;
let cookie = "";

// 𝑻𝒓𝒚 𝒕𝒐 𝒍𝒐𝒂𝒅 𝒕𝒉𝒆 𝒂𝒑𝒑𝒔𝒕𝒂𝒕𝒆.𝒋𝒔𝒐𝒏 𝒃𝒖𝒕 𝒅𝒐𝒏'𝒕 𝒕𝒉𝒓𝒐𝒘 𝒊𝒇 𝒎𝒊𝒔𝒔𝒊𝒏𝒈 — 𝒇𝒂𝒊𝒍 𝒈𝒓𝒂𝒄𝒆𝒇𝒖𝒍𝒍𝒚.
try {
    if (fs.existsSync(appStatePath)) {
        appState = require(appStatePath);
        if (Array.isArray(appState)) {
            cookie = appState.map(item => `${item.key}=${item.value}`).join(";");
        }
    } else {
        appState = null;
        cookie = process.env.FB_COOKIE || "";
    }
} catch (err) {
    // 𝑰𝒏 𝒄𝒂𝒔𝒆 𝒓𝒆𝒒𝒖𝒊𝒓𝒆 𝒄𝒂𝒄𝒉𝒊𝒏𝒈 𝒐𝒓 𝒑𝒂𝒓𝒔𝒆 𝒆𝒓𝒓𝒐𝒓, 𝒇𝒂𝒍𝒍𝒃𝒂𝒄𝒌 𝒕𝒐 𝒆𝒏𝒗 𝒗𝒂𝒓 𝒊𝒇 𝒑𝒓𝒆𝒔𝒆𝒏𝒕
    appState = null;
    cookie = process.env.FB_COOKIE || "";
}

const headers = {
    "Host": "mbasic.facebook.com",
    "user-agent": "Mozilla/5.0 (Linux; Android 11; M2101K7BG Build/RP1A.200720.011;) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4692.98 Mobile Safari/537.36",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "navigate",
    "sec-fetch-user": "?1",
    "sec-fetch-dest": "document",
    "referer": "https://mbasic.facebook.com/?refsrc=deprecated&_rdr",
    "accept-encoding": "gzip, deflate",
    "accept-language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cookie": cookie
};

// 𝑭𝒐𝒓𝒎𝒂𝒕 𝑻𝒆𝒙𝒕 𝑪𝒐𝒏𝒗𝒆𝒓𝒔𝒊𝒐𝒏 (𝒌𝒆𝒆𝒑𝒔 𝒕𝒉𝒆 𝒆𝒙𝒊𝒔𝒕𝒊𝒏𝒈 𝒔𝒕𝒚𝒍𝒊𝒛𝒆𝒅 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓𝒔)
function formatText(str) {
    const map = {
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
        'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
        'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
        'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
        'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛'
    };
    return String(str).replace(/[A-Za-z]/g, char => map[char] || char);
}

function getGUID() {
    const key = `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`;
    let timeNow = Date.now();
    return key.replace(/[xy]/g, function (info) {
        let a = Math.floor((timeNow + Math.random() * 16) % 16);
        timeNow = Math.floor(timeNow / 16);
        let b = (info == 'x' ? a : a & 7 | 8).toString(16);
        return b;
    });
}

module.exports.onReply = async function({ api, event, handleReply }) {
    try {
        const botID = api.getCurrentUserID();
        const { type, author } = handleReply;
        const { threadID, messageID, senderID } = event;
        let body = (event && event.body) ? event.body : "";

        // 𝑷𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒄𝒉𝒆𝒄𝒌 - 𝒌𝒆𝒑𝒕 𝒂𝒔 𝒐𝒓𝒊𝒈𝒊𝒏𝒂𝒍 𝒂𝒍𝒍𝒐𝒘𝒆𝒅𝑼𝑰𝑫
        const allowedUID = "61571630409265";
        if (senderID !== allowedUID) {
            return api.sendMessage(formatText("𝑃𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑑𝑒𝑛𝑖𝑒𝑑. 𝑂𝑛𝑙𝑦 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑢𝑠𝑒𝑟𝑠 𝑐𝑎𝑛 𝑎𝑐𝑐𝑒𝑠𝑠 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"), threadID, messageID);
        }

        // 𝑬𝒏𝒔𝒖𝒓𝒆 𝒂𝒑𝒑𝒔𝒕𝒂𝒕𝒆 / 𝒄𝒐𝒐𝒌𝒊𝒆 𝒆𝒙𝒊𝒔𝒕𝒔 𝒃𝒆𝒇𝒐𝒓𝒆 𝒎𝒂𝒌𝒊𝒏𝒈 𝒂𝒏𝒚 𝒏𝒆𝒕𝒘𝒐𝒓𝒌 𝒄𝒂𝒍𝒍𝒔 𝒕𝒉𝒂𝒕 𝒏𝒆𝒆𝒅 𝒊𝒕.
        if (!cookie || cookie.length < 5) {
            return api.sendMessage(formatText("⚠️ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝐴𝑝𝑝𝑠𝑡𝑎𝑡𝑒: 𝑃𝑙𝑎𝑐𝑒 𝑦𝑜𝑢𝑟 𝑎𝑝𝑝𝑠𝑡𝑎𝑡𝑒.𝑗𝑠𝑜𝑛 𝑎𝑡 ../../𝑎𝑝𝑝𝑠𝑡𝑎𝑡𝑒.𝑗𝑠𝑜𝑛 𝑜𝑟 𝑠𝑒𝑡 𝐹𝐵_𝐶𝑂𝑂𝐾𝐼𝐸 𝑒𝑛𝑣 𝑣𝑎𝑟 𝑡𝑜 𝑒𝑛𝑎𝑏𝑙𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑."), threadID, messageID);
        }

        const args = body.split(" ");

        const reply = function(msg, callback) {
            const formattedMsg = formatText(msg);
            if (callback) api.sendMessage(formattedMsg, threadID, callback, messageID);
            else api.sendMessage(formattedMsg, threadID, messageID);
        };

        // --- 𝑴𝑬𝑵𝑼 𝒂𝒄𝒕𝒊𝒐𝒏𝒔 ---
        if (type == 'menu') {
            if (["01", "1", "02", "2"].includes(args[0])) {
                reply(`📝 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ ${["01", "1"].includes(args[0]) ? "𝑏𝑖𝑜" : "𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒"} 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑜𝑟 '𝑑𝑒𝑙𝑒𝑡𝑒' 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 ${["01", "1"].includes(args[0]) ? "𝑏𝑖𝑜" : "𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒"}`, (err, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: ["01", "1"].includes(args[0]) ?  "changeBio" : "changeNickname"
                    });
                });
            }
            else if (["03", "3"].includes(args[0])) {
                const messagePending = await api.getThreadList(500, null, ["PENDING"]);
                const msg = (messagePending || []).reduce((a, b) => a + `» ${b.name} | ${b.threadID} | 𝑀𝑒𝑠𝑠𝑎𝑔𝑒: ${b.snippet}\n`, "");
                return reply(`📭 𝐵𝑜𝑡 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑎𝑖𝑡𝑖𝑛𝑔 𝑙𝑖𝑠𝑡:\n\n${msg || "𝑁𝑜 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"}`);
            }
            else if (["04", "4"].includes(args[0])) {
                const messagePending = await api.getThreadList(500, null, ["unread"]);
                const msg = (messagePending || []).reduce((a, b) => a + `» ${b.name} | ${b.threadID} | 𝑀𝑒𝑠𝑠𝑎𝑔𝑒: ${b.snippet}\n`, "");
                return reply(`📨 𝐵𝑜𝑡 𝑢𝑛𝑟𝑒𝑎𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠:\n\n${msg || "𝑁𝑜 𝑢𝑛𝑟𝑒𝑎𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"}`);
            }
            else if (["05", "5"].includes(args[0])) {
                const messagePending = await api.getThreadList(500, null, ["OTHER"]);
                const msg = (messagePending || []).reduce((a, b) => a + `» ${b.name} | ${b.threadID} | 𝑀𝑒𝑠𝑠𝑎𝑔𝑒: ${b.snippet}\n`, "");
                return reply(`⚠️ 𝐵𝑜𝑡 𝑠𝑝𝑎𝑚 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠:\n\n${msg || "𝑁𝑜 𝑠𝑝𝑎𝑚 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"}`);
            }
            else if (["06", "6"].includes(args[0])) {
                reply(`🖼️ 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑎 𝑝ℎ𝑜𝑡𝑜 𝑜𝑟 𝑖𝑚𝑎𝑔𝑒 𝑙𝑖𝑛𝑘 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑏𝑜𝑡 𝑎𝑣𝑎𝑡𝑎𝑟`, (err, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "changeAvatar"
                    });
                });
            }
            else if (["07", "7"].includes(args[0])) {
                if (!args[1] || !["on", "off"].includes(args[1])) return reply('🔒 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑒𝑙𝑒𝑐𝑡 𝑜𝑛/𝑜𝑓𝑓');
                const form = {
                    av: botID,
                    variables: JSON.stringify({
                        "0": {
                            is_shielded: args[1] == 'on' ? true : false,
                            actor_id: botID,
                            client_mutation_id: Math.round(Math.random()*19)
                        }
                    }),
                    doc_id: "100017985245260"
                };
                api.httpPost("https://www.facebook.com/api/graphql/", form, (err, data) => {
                    if (err || JSON.parse(data).errors) reply("❌ 𝐸𝑟𝑟𝑜𝑟, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛");
                    else reply(`🛡️ 𝐴𝑣𝑎𝑡𝑎𝑟 𝑠ℎ𝑖𝑒𝑙𝑑 ${args[1] == 'on' ? '𝑒𝑛𝑎𝑏𝑙𝑒𝑑' : '𝑑𝑖𝑠𝑎𝑏𝑙𝑒𝑑'}`);
                });
            }
            else if (["08", "8"].includes(args[0])) {
                return reply(`🔒 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝐼𝐷𝑠 𝑡𝑜 𝑏𝑙𝑜𝑐𝑘 (𝑠𝑝𝑎𝑐𝑒 𝑠𝑒𝑝𝑎𝑟𝑎𝑡𝑒𝑑)`, (e, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "blockUser"
                    });
                });
            }
            else if (["09", "9"].includes(args[0])) {
                return reply(`🔓 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝐼𝐷𝑠 𝑡𝑜 𝑢𝑛𝑏𝑙𝑜𝑐𝑘 (𝑠𝑝𝑎𝑐𝑒 𝑠𝑒𝑝𝑎𝑟𝑎𝑡𝑒𝑑)`, (e, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "unBlockUser"
                    });
                });
            }
            else if (["10"].includes(args[0])) {
                return reply(`📝 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑝𝑜𝑠𝑡 𝑐𝑜𝑛𝑡𝑒𝑛𝑡`, (e, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "createPost"
                    });
                });
            }
            else if (["11"].includes(args[0])) {
                return reply(`🗑️ 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑝𝑜𝑠𝑡 𝐼𝑑𝑠 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒 (𝑠𝑝𝑎𝑐𝑒 𝑠𝑒𝑝𝑎𝑟𝑎𝑡𝑒𝑑)`, (e, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "deletePost"
                    });
                });
            }
            else if (["12", "13"].includes(args[0])) {
                return reply(`💬 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑝𝑜𝑠𝑡𝐼𝐷 𝑡𝑜 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 ${args[0] == "12" ? "(𝑢𝑠𝑒𝑟)" : "(𝑔𝑟𝑜𝑢𝑝)"}`, (e, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "choiceIdCommentPost",
                        isGroup: args[0] == "12" ? false : true
                    });
                });
            }
            else if (["14", "15", "16", "17", "18", "19"].includes(args[0])) {
                reply(`🔢 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝐼𝐷𝑠 ${args[0]  == "13" ? "𝑓𝑜𝑟 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛𝑠" : args[0] == "14" ? "𝑓𝑜𝑟 𝑓𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠" : args[0] == "15" ? "𝑡𝑜 𝑎𝑐𝑐𝑒𝑝𝑡" : args[0] == "16" ? "𝑡𝑜 𝑑𝑒𝑐𝑙𝑖𝑛𝑒" : args[0] == "17" ? "𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒" : args[0] == "18" ? "𝑡𝑜 𝑚𝑒𝑠𝑠𝑎𝑔𝑒" : "𝑡𝑜 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"}`, (e, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: args[0] == "14" ? "choiceIdReactionPost" : args[0] == "15" ? "addFiends" : args[0] == "16" ? "acceptFriendRequest" : args[0] == "17" ? "deleteFriendRequest" : args[0] == "18" ? "unFriends" : "choiceIdSendMessage"
                    });
                });
            }
            else if (["20"].includes(args[0])) {
                reply('📝 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑐𝑜𝑑𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑛𝑜𝑡𝑒', (e, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "noteCode"
                    });
                });
            }
            else if (["21"].includes(args[0])) {
                api.logout((e) => {
                    if (e) return reply('❌ 𝐸𝑟𝑟𝑜𝑟 𝑙𝑜𝑔𝑔𝑖𝑛𝑔 𝑜𝑢𝑡');
                    else reply('👋 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑙𝑜𝑔𝑔𝑒𝑑 𝑜𝑢𝑡');
                });
            }
        } // 𝑒𝑛𝑑 𝑚𝑒𝑛𝑢

        // --- 𝑪𝒉𝒂𝒏𝒈𝒆𝑩𝒊𝒐 ---
        else if (type == 'changeBio') {
            const bio = body.toLowerCase() == 'delete' ? '' : body;
            api.changeBio(bio, false, (err) => {
                if (err) return reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐ℎ𝑎𝑛𝑔𝑖𝑛𝑔 𝑏𝑖𝑜");
                else return reply(`✅ ${!bio ? "𝐵𝑖𝑜 𝑑𝑒𝑙𝑒𝑡𝑒𝑑" : `𝐵𝑖𝑜 𝑢𝑝𝑑𝑎𝑡𝑒𝑑: ${bio}`}`);
            });
        }

        // --- 𝑪𝒉𝒂𝒏𝒈𝒆𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆 ---
        else if (type == 'changeNickname') {
            const nickname = body.toLowerCase() == 'delete' ? '' : body;
            let res;
            try {
                res = (await axios.get('https://mbasic.facebook.com/' + botID + '/about', {
                    headers,
                    params: {
                        nocollections: "1",
                        lst: `${botID}:${botID}:${Date.now().toString().slice(0, 10)}`,
                        refid: "17"
                    }
                })).data;
            } catch (e) {
                return reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑑𝑎𝑡𝑎");
            }

            let form;
            if (nickname) {
                const name_id = res.includes('href="/profile/edit/info/nicknames/?entid=') ? res.split('href="/profile/edit/info/nicknames/?entid=')[1].split("&amp;")[0] : null;

                const variables = {
                    collectionToken: Buffer.from("app_collection:" + botID + ":2327158227:206").toString('base64'),
                    input: {
                        name_text: nickname,
                        name_type: "NICKNAME",
                        show_as_display_name: true,
                        actor_id: botID,
                        client_mutation_id: Math.round(Math.random()*19).toString()
                    },
                    scale: 3,
                    sectionToken: Buffer.from("app_section:" + botID + ":2327158227").toString('base64')
                };

                if (name_id) variables.input.name_id = name_id;

                form = {
                    av: botID,
                    fb_api_req_friendly_name: "ProfileCometNicknameSaveMutation",
                    fb_api_caller_class: "RelayModern",
                    doc_id: "100017985245260",
                    variables: JSON.stringify(variables)
                };
            } else {
                if (!res.includes('href="/profile/edit/info/nicknames/?entid=')) return reply('❌ 𝑁𝑜 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑠𝑒𝑡');
                const name_id = res.split('href="/profile/edit/info/nicknames/?entid=')[1].split("&amp;")[0];
                form = {
                    av: botID,
                    fb_api_req_friendly_name: "ProfileCometAboutFieldItemDeleteMutation",
                    fb_api_caller_class: "RelayModern",
                    doc_id: "100037743553265",
                    variables: JSON.stringify({
                        collectionToken: Buffer.from("app_collection:" + botID + ":2327158227:206").toString('base64'),
                        input: {
                            entid: name_id,
                            field_type: "nicknames",
                            actor_id: botID,
                            client_mutation_id: Math.round(Math.random()*19).toString()
                        },
                        scale: 3,
                        sectionToken: Buffer.from("app_section:" + botID + ":2327158227").toString('base64'),
                        isNicknameField: true,
                        useDefaultActor: false
                    })
                };
            }

            api.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
                if (e) return reply(`❌ 𝐸𝑟𝑟𝑜𝑟 𝑢𝑝𝑑𝑎𝑡𝑖𝑛𝑔`);
                else if (JSON.parse(i).errors) reply(`❌ 𝐸𝑟𝑟𝑜𝑟: ${JSON.parse(i).errors[0].summary}`);
                else reply(`✅ ${!nickname ? "𝑁𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑑𝑒𝑙𝑒𝑡𝑒𝑑" : `𝑁𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑢𝑝𝑑𝑎𝑡𝑒𝑑: ${nickname}`}`);
            });
        }

        // --- 𝑪𝒉𝒂𝒏𝒈𝒆𝑨𝒗𝒂𝒕𝒂𝒓 ---
        else if (type == 'changeAvatar') {
            let imgUrl;
            if (body && body.match(/^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/g)) imgUrl = body;
            else if (event.attachments && event.attachments[0] && event.attachments[0].type == "photo") imgUrl = event.attachments[0].url;
            else return reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑙𝑖𝑛𝑘 𝑜𝑟 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡`, (err, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "changeAvatar"
                });
            });

            try {
                const imgBuffer = (await axios.get(imgUrl, {
                    responseType: "stream"
                })).data;
                const form0 = { file: imgBuffer };
                let uploadImageToFb = await api.httpPostFormData(`https://www.facebook.com/profile/picture/upload/?profile_id=${botID}&photo_source=57&av=${botID}`, form0);
                uploadImageToFb = JSON.parse(uploadImageToFb.split("for (;;);")[1]);
                if (uploadImageToFb.error) return reply("❌ " + uploadImageToFb.error.errorDescription);
                const idPhoto = uploadImageToFb.payload.fbid;
                const form = {
                    av: botID,
                    fb_api_req_friendly_name: "ProfileCometProfilePictureSetMutation",
                    fb_api_caller_class: "RelayModern",
                    doc_id: "100037743553265",
                    variables: JSON.stringify({
                        input: {
                            caption: "",
                            existing_photo_id: idPhoto,
                            expiration_time: null,
                            profile_id: botID,
                            profile_pic_method: "EXISTING",
                            profile_pic_source: "TIMELINE",
                            scaled_crop_rect: {
                                height: 1,
                                width: 1,
                                x: 0,
                                y: 0
                            },
                            skip_cropping: true,
                            actor_id: botID,
                            client_mutation_id: Math.round(Math.random() * 19).toString()
                        },
                        isPage: false,
                        isProfile: true,
                        scale: 3
                    })
                };
                api.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
                    if (e) reply(`❌ 𝐸𝑟𝑟𝑜𝑟 𝑢𝑝𝑑𝑎𝑡𝑖𝑛𝑔 𝑎𝑣𝑎𝑡𝑎𝑟`);
                    else if (JSON.parse(i).errors) reply(`❌ ${JSON.parse(i).errors[0].description}`);
                    else reply(`🖼️ 𝐴𝑣𝑎𝑡𝑎𝑟 𝑢𝑝𝑑𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦`);
                });
            } catch(err) {
                reply(`❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒`);
            }
        }

        // --- 𝑩𝒍𝒐𝒄𝒌𝑼𝒔𝒆𝒓 ---
        else if (type == 'blockUser') {
            if (!body) return reply("🔒 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝐼𝐷𝑠 𝑡𝑜 𝑏𝑙𝑜𝑐𝑘", (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: 'blockUser'
                });
            });
            const uids = body.replace(/\s+/g, " ").split(" ");
            const success = [];
            const failed = [];
            for (const uid of uids) {
                try {
                    await api.changeBlockedStatus(uid, true);
                    success.push(uid);
                }
                catch(err) {
                    failed.push(uid);
                }
            }
            reply(`✅ 𝐵𝑙𝑜𝑐𝑘𝑒𝑑 ${success.length} 𝑢𝑠𝑒𝑟𝑠${failed.length > 0 ? `\n❌ 𝐹𝑎𝑖𝑙𝑒𝑑: ${failed.join(" ")}` : ""}`);
        }

        // --- 𝑼𝒏𝑩𝒍𝒐𝒄𝒌𝑼𝒔𝒆𝒓 ---
        else if (type == 'unBlockUser') {
            if (!body) return reply("🔓 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝐼𝐷𝑠 𝑡𝑜 𝑢𝑛𝑏𝑙𝑜𝑐𝑘", (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: 'unBlockUser'
                });
            });
            const uids = body.replace(/\s+/g, " ").split(" ");
            const success = [];
            const failed = [];
            for (const uid of uids) {
                try {
                    await api.changeBlockedStatus(uid, false);
                    success.push(uid);
                }
                catch(err) {
                    failed.push(uid);
                }
            }
            reply(`✅ 𝑈𝑛𝑏𝑙𝑜𝑐𝑘𝑒𝑑 ${success.length} 𝑢𝑠𝑒𝑟𝑠${failed.length > 0 ? `\n❌ 𝐹𝑎𝑖𝑙𝑒𝑑: ${failed.join(" ")}` : ""}`);
        }

        // --- 𝑪𝒓𝒆𝒂𝒕𝒆𝑷𝒐𝒔𝒕 ---
        else if (type == 'createPost') {
            if (!body) return reply("📝 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑝𝑜𝑠𝑡 𝑐𝑜𝑛𝑡𝑒𝑛𝑡", (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: 'createPost'
                });
            });

            const session_id = getGUID();
            const form = {
                av: botID,
                fb_api_req_friendly_name: "ComposerStoryCreateMutation",
                fb_api_caller_class: "RelayModern",
                doc_id: "100017985245260",
                variables: JSON.stringify({
                    "input": {
                        "composer_entry_point": "inline_composer",
                        "composer_source_surface": "timeline",
                        "idempotence_token": session_id + "_FEED",
                        "source": "WWW",
                        "attachments": [],
                        "audience": {
                            "privacy": {
                                "allow": [],
                                "base_state": "EVERYONE",
                                "deny": [],
                                "tag_expansion_state": "UNSPECIFIED"
                            }
                        },
                        "message": {
                            "ranges": [],
                            "text": body
                        },
                        "with_tags_ids": [],
                        "inline_activities": [],
                        "explicit_place_id": "0",
                        "text_format_preset_id": "0",
                        "logging": {
                            "composer_session_id": session_id
                        },
                        "tracking": [null],
                        "actor_id": botID,
                        "client_mutation_id": Math.round(Math.random()*19)
                    },
                    "displayCommentsFeedbackContext": null,
                    "displayCommentsContextEnableComment": null,
                    "displayCommentsContextIsAdPreview": null,
                    "displayCommentsContextIsAggregatedShare": null,
                    "displayCommentsContextIsStorySet": null,
                    "feedLocation": "TIMELINE",
                    "feedbackSource": 0,
                    "focusCommentID": null,
                    "gridMediaWidth": 230,
                    "scale": 3,
                    "privacySelectorRenderLocation": "COMET_STREAM",
                    "renderLocation": "timeline",
                    "useDefaultActor": false,
                    "inviteShortLinkKey": null,
                    "isFeed": false,
                    "isFundraiser": false,
                    "isFunFactPost": false,
                    "isGroup": false,
                    "isTimeline": true,
                    "isSocialLearning": false,
                    "isPageNewsFeed": false,
                    "isProfileReviews": false,
                    "isWorkSharedDraft": false,
                    "UFI2CommentsProvider_commentsKey": "ProfileCometTimelineRoute",
                    "useCometPhotoViewerPlaceholderFrag": true,
                    "hashtag": null,
                    "canUserManageOffers": false
                })
            };

            api.httpPost('https://www.facebook.com/api/graphql/', form, (e, i) => {
                if (e || JSON.parse(i).errors) return reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑝𝑜𝑠𝑡`);
                const postData = JSON.parse(i);
                const postID = postData.data.story_create.story.legacy_story_hideable_id;
                const urlPost = postData.data.story_create.story.url;
                return reply(`✅ 𝑃𝑜𝑠𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑\n🆔 𝑃𝑜𝑠𝑡𝐼𝐷: ${postID}\n🔗 𝑈𝑅𝐿: ${urlPost}`);
            });
        }

        // --- 𝑪𝒐𝒎𝒎𝒆𝒏𝒕𝑷𝒐𝒔𝒕 ---
        else if (type == 'commentPost') {
            const { postIDs, isGroup } = handleReply;

            if (!body) return reply('📝 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑐𝑜𝑛𝑡𝑒𝑛𝑡', (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "commentPost",
                    postIDs: handleReply.postIDs,
                    isGroup: handleReply.isGroup
                });
            });
            const success = [];
            const failed = [];

            for (let id of postIDs) {
                const postID = Buffer.from('feedback:' + id).toString('base64');
                const ss1 = getGUID();
                const ss2 = getGUID();

                const form = {
                    av: botID,
                    fb_api_req_friendly_name: "CometUFICreateCommentMutation",
                    fb_api_caller_class: "RelayModern",
                    doc_id: "4744517358977326",
                    variables: JSON.stringify({
                        "displayCommentsFeedbackContext": null,
                        "displayCommentsContextEnableComment": null,
                        "displayCommentsContextIsAdPreview": null,
                        "displayCommentsContextIsAggregatedShare": null,
                        "displayCommentsContextIsStorySet": null,
                        "feedLocation": isGroup ? "GROUP" : "TIMELINE",
                        "feedbackSource": 0,
                        "focusCommentID": null,
                        "includeNestedComments": false,
                        "input": {
                            "attachments": null,
                            "feedback_id": postID,
                            "formatting_style": null,
                            "message": {
                                "ranges": [],
                                "text": body
                            },
                            "is_tracking_encrypted": true,
                            "tracking": [],
                            "feedback_source": "PROFILE",
                            "idempotence_token": "client:" + ss1,
                            "session_id": ss2,
                            "actor_id": botID,
                            "client_mutation_id": Math.round(Math.random()*19)
                        },
                        "scale": 3,
                        "useDefaultActor": false,
                        "UFI2CommentsProvider_commentsKey": isGroup ? "CometGroupDiscussionRootSuccessQuery" : "ProfileCometTimelineRoute"
                    })
                };

                try {
                    const res = await api.httpPost('https://www.facebook.com/api/graphql/', form);
                    if (JSON.parse(res).errors) failed.push(id);
                    else success.push(id);
                }
                catch(err) {
                    failed.push(id);
                }
            }
            reply(`✅ 𝐶𝑜𝑚𝑚𝑒𝑛𝑡𝑒𝑑 𝑜𝑛 ${success.length} 𝑝𝑜𝑠𝑡𝑠${failed.length > 0 ? `\n❌ 𝐹𝑎𝑖𝑙𝑒𝑑: ${failed.join(" ")}` : ""}`);
        }

        // --- 𝑫𝒆𝒍𝒆𝒕𝒆𝑷𝒐𝒔𝒕 ---
        else if (type == 'deletePost') {
            const postIDs = body.replace(/\s+/g, " ").split(" ");
            const success = [];
            const failed = [];

            for (const postID of postIDs) {
                let res;
                try {
                    res = (await axios.get('https://mbasic.facebook.com/story.php?story_fbid='+postID+'&id='+botID, {
                        headers
                    })).data;
                }
                catch (err) {
                    reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑜𝑠𝑡 𝐼𝐷");
                    continue;
                }

                try {
                    const session_ID = decodeURIComponent(res.split('session_id%22%3A%22')[1].split('%22%2C%22')[0]);
                    const story_permalink_token = decodeURIComponent(res.split('story_permalink_token=')[1].split('&amp;')[0]);
                    const hideable_token = decodeURIComponent(res.split('%22%2C%22hideable_token%22%3A%')[1].split('%22%2C%22')[0]);

                    let URl = 'https://mbasic.facebook.com/nfx/basic/direct_actions/?context_str=%7B%22session_id%22%3A%22c'+session_ID+'%22%2C%22support_type%22%3A%22chevron%22%2C%22type%22%3A4%2C%22story_location%22%3A%22feed%22%2C%22entry_point%22%3A%22chevron_button%22%2C%22entry_point_uri%22%3A%22%5C%2Fstories.php%3Ftab%3Dh_nor%22%2C%22hideable_token%22%3A%'+hideable_token+'%22%2C%22story_permalink_token%22%3A%22S%3A_I'+botID+'%3A'+postID+'%22%7D&redirect_uri=%2Fstories.php%3Ftab%3Dh_nor&refid=8&__tn__=%2AW-R';

                    res = (await axios.get(URl, { headers })).data;

                    URl = res.split('method="post" action="/nfx/basic/handle_action/?')[1].split('"')[0];
                    URl = "https://mbasic.facebook.com/nfx/basic/handle_action/?" + URl
                        .replace(/&amp;/g, '&')
                        .replace("%5C%2Fstories.php%3Ftab%3Dh_nor", 'https%3A%2F%2Fmbasic.facebook.com%2Fprofile.php%3Fv%3Dfeed')
                        .replace("%2Fstories.php%3Ftab%3Dh_nor", 'https%3A%2F%2Fmbasic.facebook.com%2Fprofile.php%3Fv%3Dfeed');
                    const fb_dtsg = res.split('type="hidden" name="fb_dtsg" value="')[1].split('" autocomplete="off" /><input')[0];
                    const jazoest = res.split('type="hidden" name="jazoest" value="')[1].split('" autocomplete="off" />')[0];

                    const data = "fb_dtsg=" + encodeURIComponent(fb_dtsg) +"&jazoest=" + encodeURIComponent(jazoest) + "&action_key=DELETE&submit=G%E1%BB%ADi";

                    const dt = await axios({
                        url: URl,
                        method: 'post',
                        headers,
                        data
                    });
                    if (dt.data.includes("Sorry, an error has occurred")) throw new Error();
                    success.push(postID);
                } catch (err) {
                    failed.push(postID);
                }
            }
            reply(`✅ 𝐷𝑒𝑙𝑒𝑡𝑒𝑑 ${success.length} 𝑝𝑜𝑠𝑡𝑠${failed.length > 0 ? `\n❌ 𝐹𝑎𝑖𝑙𝑒𝑑: ${failed.join(" ")}` : ""}`);
        }

        // --- 𝑹𝒆𝒂𝒄𝒕𝒊𝒐𝒏𝑷𝒐𝒔𝒕 ---
        else if (type == 'reactionPost') {
            const success = [];
            const failed = [];
            const postIDs = handleReply.listID;
            const feeling = body.toLowerCase();
            if (!'unlike/like/love/heart/haha/wow/sad/angry'.split('/').includes(feeling)) return reply('❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛', (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    listID,
                    type: "reactionPost"
                })
            });
            for (const postID of postIDs) {
                try {
                    await api.setPostReaction(Number(postID), feeling);
                    success.push(postID);
                }
                catch(err) {
                    failed.push(postID);
                }
            }
            reply(`✅ 𝑅𝑒𝑎𝑐𝑡𝑒𝑑 "${feeling}" 𝑡𝑜 ${success.length} 𝑝𝑜𝑠𝑡𝑠${failed.length > 0 ? `\n❌ 𝐹𝑎𝑖𝑙𝑒𝑑: ${failed.join(" ")}` : ''}`);
        }

        // --- 𝑨𝒅𝒅𝑭𝒓𝒊𝒆𝒏𝒅𝒔 ---
        else if (type == 'addFiends') {
            const listID = body.replace(/\s+/g, " ").split(" ");
            const success = [];
            const failed = [];

            for (const uid of listID) {
                const form = {
                    av: botID,
                    fb_api_caller_class: "RelayModern",
                    fb_api_req_friendly_name: "FriendingCometFriendRequestSendMutation",
                    doc_id: "5090693304332268",
                    variables: JSON.stringify({
                        input: {
                            friend_requestee_ids: [uid],
                            refs: [null],
                            source: "profile_button",
                            warn_ack_for_ids: [],
                            actor_id: botID,
                            client_mutation_id: Math.round(Math.random() * 19).toString()
                        },
                        scale: 3
                    })
                };
                try {
                    const sendAdd = await api.httpPost('https://www.facebook.com/api/graphql/', form);
                    if (JSON.parse(sendAdd).errors) failed.push(uid);
                    else success.push(uid)
                }
                catch(e) {
                    failed.push(uid);
                };
            }
            reply(`✅ 𝐹𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠 𝑠𝑒𝑛𝑡: ${success.length}${failed.length > 0 ? `\n❌ 𝐹𝑎𝑖𝑙𝑒𝑑: ${failed.join(" ")}` : ""}`);
        }

        // --- 𝑺𝒆𝒏𝒅𝑴𝒆𝒔𝒔𝒂𝒈𝒆 ---
        else if (type == 'sendMessage') {
            const listID = handleReply.listID;
            const success = [];
            const failed = [];
            for (const uid of listID) {
                try {
                    const sendMsg = await api.sendMessage(body, uid);
                    if (!sendMsg.messageID) failed.push(uid);
                    else success.push(uid);
                }
                catch(e) {
                    failed.push(uid);
                }
            }
            reply(`✅ 𝑀𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑠𝑒𝑛𝑡: ${success.length}${failed.length > 0 ? `\n❌ 𝐹𝑎𝑖𝑙𝑒𝑑: ${failed.join(" ")}` : ""}`);
        }

        // --- 𝑨𝒄𝒄𝒆𝒑𝒕/𝑫𝒆𝒍𝒆𝒕𝒆 𝑭𝒓𝒊𝒆𝒏𝒅 𝑹𝒆𝒒𝒖𝒆𝒔𝒕 ---
        else if (type == 'acceptFriendRequest' || type == 'deleteFriendRequest') {
            const listID = body.replace(/\s+/g, " ").split(" ");

            const success = [];
            const failed = [];

            for (const uid of listID) {
                const form = {
                    av: botID,
                    fb_api_req_friendly_name: type == 'acceptFriendRequest' ? "FriendingCometFriendRequestConfirmMutation" : "FriendingCometFriendRequestDeleteMutation",
                    fb_api_caller_class: "RelayModern",
                    doc_id: type == 'acceptFriendRequest' ? "3147613905362928" : "4108254489275063",
                    variables: JSON.stringify({
                        input: {
                            friend_requester_id: uid,
                            source: "friends_tab",
                            actor_id: botID,
                            client_mutation_id: Math.round(Math.random() * 19).toString()
                        },
                        scale: 3,
                        refresh_num: 0
                    })
                };
                try {
                    const friendRequest = await api.httpPost("https://www.facebook.com/api/graphql/", form);
                    if (JSON.parse(friendRequest).errors) failed.push(uid);
                    else success.push(uid);
                }
                catch(e) {
                    failed.push(uid);
                }
            }
            reply(`✅ ${type == 'acceptFriendRequest' ? '𝐴𝑐𝑐𝑒𝑝𝑡𝑒𝑑' : '𝐷𝑒𝑐𝑙𝑖𝑛𝑒𝑑'} ${success.length} 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠${failed.length > 0 ? `\n❌ 𝐹𝑎𝑖𝑙𝑒𝑑: ${failed.join(" ")}` : ""}`);
        }

        // --- 𝑵𝒐𝒕𝒆𝑪𝒐𝒅𝒆 ---
        else if (type == 'noteCode') {
            axios({
                url: 'https://buildtool.dev/verification',
                method: 'post',
                data: `content=${encodeURIComponent(body)}&code_class=language${encodeURIComponent('-')}javascript`
            })
            .then(response => {
                const href = response.data.split('<a href="code-viewer.php?')[1].split('">Permanent link</a>')[0];
                reply(`📝 𝑁𝑜𝑡𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑: https://buildtool.dev/code-viewer.php?${href}`)
            })
            .catch(err => {
                reply('❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑛𝑜𝑡𝑒');
            })
        }

    } catch (err) {
        // 𝒇𝒂𝒍𝒍𝒃𝒂𝒄𝒌 𝒆𝒓𝒓𝒐𝒓 𝒉𝒂𝒏𝒅𝒍𝒊𝒏𝒈 𝒕𝒐 𝒂𝒗𝒐𝒊𝒅 𝒔𝒊𝒍𝒆𝒏𝒕 𝒇𝒂𝒊𝒍𝒖𝒓𝒆𝒔
        try {
            const { threadID } = event;
            api.sendMessage(formatText("❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑 𝑏𝑢𝑡 𝑎𝑐𝑡𝑖𝑜𝑛 𝑤𝑎𝑠 𝑛𝑜𝑡 𝑎𝑐𝑘𝑛𝑜𝑤𝑙𝑒𝑑𝑔𝑒𝑑"), threadID);
        } catch (e) { /* 𝒊𝒈𝒏𝒐𝒓𝒆 */ }
        console.error(err);
    }
};

module.exports.onStart = async function({ api, event }) {
    const { threadID, messageID, senderID } = event;

    // 𝑷𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒄𝒉𝒆𝒄𝒌 - 𝒌𝒆𝒑𝒕 𝒐𝒓𝒊𝒈𝒊𝒏𝒂𝒍 𝒂𝒍𝒍𝒐𝒘𝒆𝒅𝑼𝑰𝑫
    const allowedUID = "61571630409265";
    if (senderID !== allowedUID) {
        return api.sendMessage(formatText("𝑃𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑑𝑒𝑛𝑖𝑒𝑑. 𝑂𝑛𝑙𝑦 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑢𝑠𝑒𝑟𝑠 𝑐𝑎𝑛 𝑎𝑐𝑐𝑒𝑠𝑠 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"), threadID, messageID);
    }

    // 𝑰𝒇 𝒂𝒑𝒑𝒔𝒕𝒂𝒕𝒆 𝒊𝒔 𝒎𝒊𝒔𝒔𝒊𝒏𝒈, 𝒘𝒂𝒓𝒏 𝒂𝒅𝒎𝒊𝒏 — 𝒅𝒐 𝒏𝒐𝒕 𝒄𝒓𝒂𝒔𝒉.
    if (!cookie || cookie.length < 5) {
        return api.sendMessage(formatText("⚠️ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝐴𝑝𝑝𝑠𝑡𝑎𝑡𝑒: 𝑃𝑙𝑎𝑐𝑒 𝑦𝑜𝑢𝑟 𝑎𝑝𝑝𝑠𝑡𝑎𝑡𝑒.𝑗𝑠𝑜𝑛 𝑎𝑡 ../../𝑎𝑝𝑝𝑠𝑡𝑎𝑡𝑒.𝑗𝑠𝑜𝑛 𝑜𝑟 𝑠𝑒𝑡 𝐹𝐵_𝐶𝑂𝑂𝐾𝐼𝐸 𝑒𝑛𝑣 𝑣𝑎𝑟 𝑡𝑜 𝑒𝑛𝑎𝑏𝑙𝑒 𝑓𝑢𝑙𝑙 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛𝑎𝑙𝑖𝑡𝑦."), threadID, messageID);
    }

    const menuMessage = "⚙️⚙️ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐿𝑖𝑠𝑡 ⚙️⚙️"
        + "\n[𝟬𝟭] 𝐸𝑑𝑖𝑡 𝑏𝑜𝑡 𝑏𝑖𝑜"
        + "\n[𝟬𝟮] 𝐸𝑑𝑖𝑡 𝑏𝑜𝑡 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒𝑠"
        + "\n[𝟬𝟯] 𝑉𝑖𝑒𝑤 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
        + "\n[𝟬𝟰] 𝑉𝑖𝑒𝑤 𝑢𝑛𝑟𝑒𝑎𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
        + "\n[𝟬𝟱] 𝑉𝑖𝑒𝑤 𝑠𝑝𝑎𝑚 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
        + "\n[𝟬𝟲] 𝐶ℎ𝑎𝑛𝑔𝑒 𝑏𝑜𝑡 𝑎𝑣𝑎𝑡𝑎𝑟"
        + "\n[𝟬𝟳] 𝑇𝑢𝑟𝑛 𝑜𝑛/𝑜𝑓𝑓 𝑏𝑜𝑡 𝑎𝑣𝑎𝑡𝑎𝑟 𝑠ℎ𝑖𝑒𝑙𝑑"
        + "\n[𝟬𝟴] 𝐵𝑙𝑜𝑐𝑘 𝑢𝑠𝑒𝑟𝑠 (𝑚𝑒𝑠𝑠𝑒𝑛𝑔𝑒𝑟)"
        + "\n[𝟬𝟵] 𝑈𝑛𝑏𝑙𝑜𝑐𝑘 𝑢𝑠𝑒𝑟𝑠 (𝑚𝑒𝑠𝑠𝑒𝑛𝑔𝑒𝑟)"
        + "\n[𝟭𝟬] 𝐶𝑟𝑒𝑎𝑡𝑒 𝑝𝑜𝑠𝑡"
        + "\n[𝟭𝟭] 𝐷𝑒𝑙𝑒𝑡𝑒 𝑝𝑜𝑠𝑡"
        + "\n[𝟭𝟮] 𝐶𝑜𝑚𝑦𝑒𝑛𝑡 𝑜𝑛 𝑝𝑜𝑠𝑡 (𝑢𝑠𝑒𝑟)"
        + "\n[𝟭𝟯] 𝐶𝑜𝑚𝑦𝑒𝑛𝑡 𝑜𝑛 𝑝𝑜𝑠𝑡 (𝑔𝑟𝑜𝑢𝑝)"
        + "\n[𝟭𝟰] 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑝𝑜𝑠𝑡"
        + "\n[𝟭𝟱] 𝑆𝑒𝑛𝑑 𝑓𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡"
        + "\n[𝟭𝟲] 𝐴𝑐𝑐𝑒𝑝𝑡 𝑓𝑟𝑖𝑒𝑛𝑝 𝑟𝑒𝑞𝑢𝑒𝑠𝑡"
        + "\n[𝟭𝟳] 𝐷𝑒𝑐𝑙𝑖𝑛𝑒 𝑓𝑟𝑖𝑒𝑛𝑝 𝑟𝑒𝑞𝑢𝑒𝑠𝑡"
        + "\n[𝟭𝟴] 𝑅𝑒𝑚𝑜𝑣𝑒 𝑓𝑟𝑖𝑒𝑛𝑑𝑠"
        + "\n[𝟭𝟵] 𝑆𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑏𝑦 𝐼𝐷"
        + "\n[𝟮𝟬] 𝐶𝑟𝑒𝑎𝑡𝑒 𝑛𝑜𝑡𝑒"
        + "\n[𝟮𝟭] 𝐿𝑜𝑔 𝑜𝑢𝑡"
        + "\n══════════════════════"
        + `\n» 𝐴𝑑𝑚𝑖𝑛 𝐼𝐷: ${global.config.ADMINBOT.join("\n")}`
        + `\n» 𝐵𝑜𝑡 𝐼𝐷: ${api.getCurrentUserID()}`
        + `\n» 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑠𝑒𝑙𝑒𝑐𝑡`
        + "\n══════════════════════";

    api.sendMessage(menuMessage, threadID, (err, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "menu"
        });
    }, messageID);
};
