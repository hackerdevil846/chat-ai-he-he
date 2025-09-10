module.exports.config = {
    name: "autoadder",
    aliases: ["autoadd", "autojoin"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 0,
    category: "group",
    shortDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑎𝑑𝑑 𝑢𝑠𝑒𝑟𝑠 𝑡𝑜 𝑔𝑟𝑜𝑢𝑝 𝑤ℎ𝑒𝑛 𝑈𝐼𝐷 𝑜𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑙𝑖𝑛𝑘 𝑖𝑠 𝑠𝑒𝑛𝑡"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑎𝑑𝑑𝑠 𝑢𝑠𝑒𝑟𝑠 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 𝑤ℎ𝑒𝑛 𝑎 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑈𝐼𝐷 𝑜𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘 𝑖𝑠 𝑑𝑒𝑡𝑒𝑐𝑡𝑒𝑑 𝑖𝑛 𝑐ℎ𝑎𝑡"
    },
    guide: {
        en: "{p}autoadder\n𝑆𝑒𝑛𝑑 𝑎𝑛𝑦 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑈𝐼𝐷 𝑜𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝"
    }
};

module.exports.onStart = async function({ message }) {
    await message.reply("🤖 𝐴𝑢𝑡𝑜 𝐴𝑑𝑑𝑒𝑟 𝑖𝑠 𝑎𝑐𝑡𝑖𝑣𝑒! 𝐼 𝑤𝑖𝑙𝑙 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑎𝑑𝑑 𝑢𝑠𝑒𝑟𝑠 𝑤ℎ𝑒𝑛 𝑦𝑜𝑢 𝑠𝑒𝑛𝑑 𝑎 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑈𝐼𝐷 𝑜𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘.");
};

module.exports.onChat = async function({ event, api }) {
    const { threadID, body, senderID } = event;
    
    // 𝑃𝑟𝑒𝑣𝑒𝑛𝑡 𝑏𝑜𝑡 𝑓𝑟𝑜𝑚 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑖𝑛𝑔 𝑡𝑜 𝑖𝑡𝑠𝑒𝑙𝑓
    if (senderID === api.getCurrentUserID()) return;
    
    if (!body) return;

    const fbLinkRegex = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com\/(?:profile\.php\?id=)?|fb\.me\/|fb\.com\/)?([0-9]{9,})/gi;
    const matches = [...body.matchAll(fbLinkRegex)];

    for (const match of matches) {
        const uid = match[1];

        try {
            await api.addUserToGroup(uid, threadID);
            api.sendMessage(`✅ 𝑀𝑒𝑚𝑏𝑒𝑟 𝑎𝑑𝑑𝑒𝑑 𝑡𝑜 𝑔𝑟𝑜𝑢𝑝: ${uid}`, threadID);
        } catch (e) {
            if (e && e.message && e.message.includes("approval")) {
                api.sendMessage(`⚠️ 𝐴𝑑𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑠𝑒𝑛𝑡 𝑓𝑜𝑟 𝑈𝐼𝐷: ${uid}. 𝑊𝑎𝑖𝑡𝑖𝑛𝑔 𝑓𝑜𝑟 𝑎𝑑𝑚𝑖𝑛 𝑎𝑝𝑝𝑟𝑜𝑣𝑎𝑙.`, threadID);
            } else {
                api.sendMessage(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑎𝑑𝑑 ${uid}: ${e && e.message ? e.message : "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑒𝑟𝑟𝑜𝑟"}`, threadID);
            }
        }
    }
};
