const fs = require("fs-extra");

module.exports.config = {
    name: "levelup",
    aliases: ["lvlalert", "levelalert"],
    version: "0.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "system",
    shortDescription: {
        en: "𝐿𝑒𝑣𝑒𝑙 𝑢𝑝 𝑎𝑙𝑒𝑟𝑡𝑠"
    },
    longDescription: {
        en: "𝑁𝑜𝑡𝑖𝑓𝑖𝑒𝑠 𝑤ℎ𝑒𝑛 𝑢𝑠𝑒𝑟𝑠 𝑙𝑒𝑣𝑒𝑙 𝑢𝑝"
    },
    guide: {
        en: "{p}levelup on/off"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, args, threadsData }) {
    const { threadID, messageID } = event;

    if (args[0] === "on" || args[0] === "off") {
        const data = await threadsData.get(event.threadID) || {};
        
        if (args[0] === "on") {
            data.levelup = true;
            await threadsData.set(event.threadID, data);
            await message.reply("✅ 𝐿𝑒𝑣𝑒𝑙 𝑎𝑙𝑒𝑟𝑡𝑠 𝑜𝑛!");
        } else {
            data.levelup = false;
            await threadsData.set(event.threadID, data);
            await message.reply("✅ 𝐿𝑒𝑣𝑒𝑙 𝑎𝑙𝑒𝑟𝑡𝑠 𝑜𝑓𝑓!");
        }
    } else {
        await message.reply("❌ 𝑈𝑠𝑒: {p}levelup on/off");
    }
};

module.exports.onChat = async function({ event, message, usersData, threadsData }) {
    const { threadID, senderID } = event;
    
    // Get thread data
    const threadData = await threadsData.get(threadID) || {};
    
    // If levelup alerts are disabled for this thread, return
    if (threadData.levelup === false) {
        const userExp = (await usersData.get(senderID)).exp || 0;
        await usersData.set(senderID, { exp: userExp + 1 });
        return;
    }

    let userData = await usersData.get(senderID);
    let exp = parseInt(userData.exp) || 0;
    exp += 1;

    if (isNaN(exp)) return;

    const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
    const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

    if (level > curLevel && level != 1) {
        let userInfo;
        try {
            userInfo = await api.getUserInfo(senderID);
        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜:", error);
            userInfo = { [senderID]: { name: "𝑈𝑠𝑒𝑟" } };
        }
        
        const name = userInfo[senderID]?.name || "𝑈𝑠𝑒𝑟";
        
        let msg = threadData.customLevelup || "{𝑛𝑎𝑚𝑒} 𝑟𝑒𝑎𝑐ℎ𝑒𝑑 𝑙𝑒𝑣𝑒𝑙 {𝑙𝑒𝑣𝑒𝑙}!";
        
        msg = msg
            .replace(/\{𝑛𝑎𝑚𝑒}/g, name)
            .replace(/\{𝑙𝑒𝑣𝑒𝑙}/g, level);

        let attachment = null;
        
        // Check if levelup GIF exists
        const gifPath = __dirname + "/cache/levelup/levelup.gif";
        if (fs.existsSync(gifPath)) {
            if (!fs.existsSync(__dirname + "/cache/levelup/")) {
                fs.mkdirSync(__dirname + "/cache/levelup/", { recursive: true });
            }
            attachment = fs.createReadStream(gifPath);
        }

        try {
            if (attachment) {
                await message.reply({
                    body: msg,
                    attachment: attachment,
                    mentions: [{ tag: name, id: senderID }]
                });
            } else {
                await message.reply({
                    body: msg,
                    mentions: [{ tag: name, id: senderID }]
                });
            }
        } catch (error) {
            console.error("𝐿𝑒𝑣𝑒𝑙𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", error);
        }
    }

    await usersData.set(senderID, { exp });
};
