const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "buttslap",
    aliases: ["slap", "spank"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑏𝑢𝑡𝑡𝑠𝑙𝑎𝑝 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟 🖐️🍑"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑠𝑙𝑎𝑝 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    guide: {
        en: "{p}buttslap @𝑡𝑎𝑔 [𝑜𝑝𝑡𝑖𝑜𝑛𝑎𝑙 𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "discord-image-generation": "",
        "fs-extra": "",
        "path": ""
    }
};

module.exports.languages = {
    en: {
        noTag: "⚠️ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑠𝑙𝑎𝑝! (𝑈𝑠𝑒: {p}𝑏𝑢𝑡𝑡𝑠𝑙𝑎𝑝 @𝑡𝑎𝑔)",
        error: "❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.",
        successFallback: "💢 *𝑠𝑙𝑎𝑝𝑠* 💥"
    }
};

module.exports.onStart = function() {
    try {
        const tmpDir = path.join(__dirname, "tmp");
        fs.ensureDirSync(tmpDir);
    } catch (err) {
        console.error("𝑏𝑢𝑡𝑡𝑠𝑙𝑎𝑝 𝑜𝑛𝑆𝑡𝑎𝑟𝑡 𝑒𝑟𝑟𝑜𝑟:", err);
    }
};

async function resolveAvatarUrl(uid, api) {
    try {
        if (api && typeof api.getUserInfo === "function") {
            const info = await api.getUserInfo(uid);
            if (info && info[uid]) {
                return info[uid].profileUrl || info[uid].avatar || info[uid].profile_pic || info[uid].photoURL;
            }
        }
        return `https://graph.facebook.com/${uid}/picture?type=large`;
    } catch (e) {
        return `https://graph.facebook.com/${uid}/picture?type=large`;
    }
}

module.exports.onStart = async function({ api, event, args, message }) {
    try {
        const _getLang = (key) => module.exports.languages.en[key] || "";
        
        if (!event) {
            return message ? message.reply(_getLang("noTag")) : null;
        }

        const uid1 = event.senderID;
        let uid2 = null;

        if (event.mentions && typeof event.mentions === "object") {
            const mentionKeys = Object.keys(event.mentions);
            if (mentionKeys.length > 0) uid2 = mentionKeys[0];
        }

        if (!uid2 && args.length > 0) {
            const possible = args[0].replace(/[^0-9]/g, "");
            if (possible && possible.length >= 5) uid2 = possible;
        }

        if (!uid2) {
            const noTagMsg = _getLang("noTag").replace("{p}", this.config.name);
            return message ? message.reply(noTagMsg) : api.sendMessage(noTagMsg, event.threadID);
        }

        const avatarURL1 = await resolveAvatarUrl(uid1, api);
        const avatarURL2 = await resolveAvatarUrl(uid2, api);

        const imgBuffer = await new DIG.Spank().getImage(avatarURL1, avatarURL2);

        const pathSave = `${__dirname}/tmp/${uid1}_${uid2}spank.png`;
        fs.writeFileSync(pathSave, Buffer.from(imgBuffer));

        let content = "";
        try {
            if (event.mentions && typeof event.mentions === "object") {
                const mentionKeys = Object.keys(event.mentions);
                const mentionRegexes = mentionKeys.map(k => new RegExp(k, "g"));
                content = args.join(" ");
                mentionRegexes.forEach(r => content = content.replace(r, ""));
                content = content.replace(/@/g, "").trim();
            } else {
                content = args.join(" ").trim();
            }
        } catch (e) {
            content = args.join(" ").trim();
        }

        if (!content) content = _getLang("successFallback");

        const sendPayload = {
            body: content,
            attachment: fs.createReadStream(pathSave)
        };

        if (message && typeof message.reply === "function") {
            message.reply(sendPayload, () => {
                try { fs.unlinkSync(pathSave); } catch (e) {}
            });
        } else {
            api.sendMessage(sendPayload, event.threadID, (err, info) => {
                try { fs.unlinkSync(pathSave); } catch (e) {}
            }, event.messageID);
        }

    } catch (error) {
        console.error("𝑏𝑢𝑡𝑡𝑠𝑙𝑎𝑝 𝑒𝑟𝑟𝑜𝑟:", error);
        const errMsg = module.exports.languages.en.error;
        if (message && typeof message.reply === "function") {
            message.reply(errMsg);
        } else {
            api.sendMessage(errMsg, event.threadID);
        }
    }
};
