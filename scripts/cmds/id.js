const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
    name: "id",
    aliases: ["userid", "uid"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
        en: "𝑈𝑠𝑒𝑟 𝐼𝐷 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "𝑆ℎ𝑜𝑤𝑠 𝑢𝑠𝑒𝑟 𝐼𝐷 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    guide: {
        en: "{p}id [𝑟𝑒𝑝𝑙𝑦/𝑚𝑒𝑛𝑡𝑖𝑜𝑛/𝑢𝑟𝑙/𝑢𝑖𝑑]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "request": ""
    }
};

module.exports.onStart = async function({ api, event, args, usersData }) {
    try {
        const { threadID, messageID, type, messageReply, mentions } = event;
        
        let uid;
        let name;

        if (type === "message_reply") {
            uid = messageReply.senderID;
            name = await usersData.getName(uid);
        } else if (args.length === 0) {
            uid = event.senderID;
            try {
                const res = await axios.get(`https://www.nguyenmanh.name.vn/api/fbInfo?id=${uid}&apikey=LV7LWgAp`);
                name = res.data.result.name || await usersData.getName(uid);
            } catch {
                name = await usersData.getName(uid);
            }
        } else if (args[0].match(/(https?:\/\/)?(www\.)?facebook\.com\/.+/)) {
            try {
                uid = await api.getUID(args[0]);
                const userInfo = await api.getUserInfo(uid);
                name = userInfo[uid]?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
            } catch {
                return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑙𝑖𝑛𝑘", threadID, messageID);
            }
        } else if (Object.keys(mentions).length > 0) {
            uid = Object.keys(mentions)[0];
            name = mentions[uid];
        } else {
            uid = args[0];
            name = await usersData.getName(uid) || "𝑁𝑎𝑚𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑";
        }

        const callback = () => {
            api.sendMessage({
                body: `🎭 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢 𝗖𝗔𝗥𝗗\n━━━━━━━━━━━━━━\n✨ 𝗡𝗮𝗺𝗲: ${name}\n🔖 𝗨𝗜𝗗: ${uid}\n📨 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿: m.me/${uid}\n🔗 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗟𝗶𝗻𝗸: https://facebook.com/${uid}\n━━━━━━━━━━━━━━`,
                attachment: fs.createReadStream(__dirname + "/cache/1.png")
            }, threadID, () => {
                if (fs.existsSync(__dirname + "/cache/1.png")) {
                    fs.unlinkSync(__dirname + "/cache/1.png");
                }
            }, messageID);
        };

        request(encodeURI(`https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', callback)
            .on('error', (err) => {
                console.error("𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", err);
                api.sendMessage({
                    body: `🎭 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢 𝗖𝗔𝗥𝗗\n━━━━━━━━━━━━━━\n✨ 𝗡𝗮𝗺𝗲: ${name}\n🔖 𝗨𝗜𝗗: ${uid}\n📨 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿: m.me/${uid}\n🔗 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗟𝗶𝗻𝗸: https://facebook.com/${uid}\n━━━━━━━━━━━━━━\n❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑙𝑜𝑎𝑑 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒`
                }, threadID, messageID);
            });

    } catch (error) {
        console.error("𝐼𝐷 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟: " + error.message, event.threadID, event.messageID);
    }
};
