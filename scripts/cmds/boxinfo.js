const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
    name: "groupinfo",
    aliases: ["ginfo", "group"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 1,
    category: "group",
    shortDescription: {
        en: "𝐺𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "𝑆ℎ𝑜𝑤𝑠 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝"
    },
    guide: {
        en: "{p}groupinfo"
    },
    dependencies: {
        "fs-extra": "",
        "request": ""
    }
};

module.exports.onStart = async function({ api, event, message }) {
    try {
        // Check dependencies
        if (!fs.existsSync || !request) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        function toMathBoldItalic(text) {
            const mapping = {
                'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯',
                'I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷',
                'Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿',
                'Y': '𝒀','Z': '𝒁',
                'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉',
                'i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑',
                'q': '𝒒','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙',
                'y': '𝒚','z': '𝒛',
                '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗'
            };
            return text.split('').map(c => mapping[c] || c).join('');
        }

        let threadInfo = await api.getThreadInfo(event.threadID);
        let threadMem = threadInfo.participantIDs.length;
        let males = 0, females = 0;

        for (let u of threadInfo.userInfo) {
            if (u.gender === "MALE") males++;
            else if (u.gender === "FEMALE") females++;
        }

        let admins = threadInfo.adminIDs.length;
        let totalMsg = threadInfo.messageCount;
        let icon = threadInfo.emoji || "𝑁𝑜𝑛𝑒";
        let threadName = threadInfo.threadName || "𝑈𝑛𝑛𝑎𝑚𝑒𝑑";
        let threadID = threadInfo.threadID;
        let approval = threadInfo.approvalMode ? "𝑂𝑛" : "𝑂𝑓𝑓";

        let messageText = `🆔 | 𝐺𝑟𝑜𝑢𝑝 𝐼𝐷: ${threadID}
🔖 | 𝑁𝑎𝑚𝑒: ${threadName}
👑 | 𝐴𝑑𝑚𝑖𝑛𝑠: ${admins}
👥 | 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${threadMem}
👨 | 𝑀𝑎𝑙𝑒𝑠: ${males}
👩 | 𝐹𝑒𝑚𝑎𝑙𝑒𝑠: ${females}
💬 | 𝑀𝑒𝑠𝑠𝑎𝑔𝑒𝑠: ${totalMsg}
✅ | 𝐴𝑝𝑝𝑟𝑜𝑣𝑎𝑙 𝑀𝑜𝑑𝑒: ${approval}
😀 | 𝐸𝑚𝑜𝑗𝑖: ${icon}

❤️ | 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝐵𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;

        let formattedMessage = toMathBoldItalic(messageText);

        if (threadInfo.imageSrc) {
            const callback = () => message.reply({
                body: formattedMessage,
                attachment: fs.createReadStream(__dirname + "/cache/1.png")
            }, () => fs.unlinkSync(__dirname + "/cache/1.png"));

            request(encodeURI(threadInfo.imageSrc))
                .pipe(fs.createWriteStream(__dirname + "/cache/1.png"))
                .on("close", callback);
        } else {
            await message.reply(formattedMessage);
        }

    } catch (error) {
        console.error("𝐺𝑟𝑜𝑢𝑝𝐼𝑛𝑓𝑜 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑔𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛.");
    }
};
