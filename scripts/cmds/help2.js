module.exports.config = {
    name: "help2",
    aliases: ["cmd", "command"],
    version: "1.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 1,
    role: 0,
    category: "𝑠𝑦𝑠𝑡𝑒𝑚",
    shortDescription: {
        en: "𝑁𝑖𝑗𝑒𝑟 𝐵𝑜𝑡 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐿𝑖𝑠𝑡"
    },
    longDescription: {
        en: "𝑆ℎ𝑜𝑤𝑠 𝑎𝑙𝑙 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑜𝑟 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑎 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"
    },
    guide: {
        en: "{p}help2 [𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑛𝑎𝑚𝑒]"
    },
    envConfig: {
        autoUnsend: true,
        delayUnsend: 300
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": "╭───────────⭓\n│ ✦ %1\n│ ✦ %2\n│✦\n│ ❯ 𝑈𝑠𝑎𝑔𝑒: %3\n│ ❯ 𝐶𝑎𝑡𝑒𝑔𝑜𝑟𝑦: %4\n│ ❯ 𝐶𝑜𝑜𝑙𝑑𝑜𝑤𝑛: %5𝑠\n│ ❯ 𝑃𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛: %6\n╰─────────────⭓\n\n✦ 𝑀𝑜𝑑𝑢𝑙𝑒 𝑐𝑜𝑑𝑒 𝑏𝑦 %7 ✦",
        "helpList": "╭───────⭓\n│ ✦ 𝑇𝑜𝑡𝑎𝑙 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠: %1\n│ ✦ 𝑃𝑎𝑔𝑒: %2/%3\n╰─────────⭓\n\n%4\n\n✦ 𝑈𝑠𝑒 \"%5help2 <𝑐𝑚𝑑>\" 𝑓𝑜𝑟 𝑑𝑒𝑡𝑎𝑖𝑙𝑠! ✦",
        "user": "👤 𝑈𝑠𝑒𝑟",
        "adminGroup": "👥 𝐴𝑑𝑚𝑖𝑛 𝐺𝑟𝑜𝑢𝑝",
        "adminBot": "🤖 𝐵𝑜𝑡 𝐴𝑑𝑚𝑖𝑛"
    }
};

module.exports.onChat = function ({ event, api, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || body.indexOf("help2") !== 0) return;
    const splitBody = body.slice(body.indexOf("help2")).trim().split(/\s+/);
    if (splitBody.length === 1 || !commands.has(splitBody[1].toLowerCase())) return;
    
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const command = commands.get(splitBody[1].toLowerCase());
    const prefix = threadSetting.PREFIX || global.config.PREFIX;
    
    return api.sendMessage(
        getText(
            "moduleInfo",
            command.config.name,
            command.config.description,
            `${prefix}${command.config.name} ${command.config.guide?.en?.replace(/\{p\}/g, prefix) || command.config.usages || ""}`.trim(),
            command.config.category,
            command.config.countDown,
            command.config.role === 0 ? getText("user") : 
            command.config.role === 1 ? getText("adminGroup") : getText("adminBot"),
            command.config.author
        ),
        threadID,
        messageID
    );
}

module.exports.onStart = async function({ api, event, args, getText }) {
    try {
        const { commands } = global.client;
        const { threadID, messageID } = event;
        const command = commands.get((args[0] || "").toLowerCase());
        const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
        const { autoUnsend, delayUnsend } = global.configModule[this.config.name]?.envConfig || {};
        const prefix = threadSetting.PREFIX || global.config.PREFIX;

        if (!command) {
            const arrayInfo = Array.from(commands.keys());
            const page = parseInt(args[0]) || 1;
            const numberOfOnePage = 20;
            const totalPages = Math.ceil(arrayInfo.length / numberOfOnePage);
            
            if (page < 1 || page > totalPages) {
                return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑎𝑔𝑒 𝑛𝑢𝑚𝑏𝑒𝑟!", threadID, messageID);
            }

            const startSlice = (page - 1) * numberOfOnePage;
            const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);
            
            let msg = returnArray.map((item, index) => 
                `${startSlice + index + 1}. ${prefix}${item}`
            ).join("\n");

            const helpMessage = getText("helpList", arrayInfo.length, page, totalPages, msg, prefix);
            
            const sentMessage = await api.sendMessage(helpMessage, threadID);
            
            if (autoUnsend) {
                setTimeout(async () => {
                    try {
                        await api.unsendMessage(sentMessage.messageID);
                    } catch (error) {
                        console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑢𝑛𝑠𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", error);
                    }
                }, delayUnsend * 1000);
            }
            return;
        }

        return api.sendMessage(
            getText(
                "moduleInfo",
                command.config.name,
                command.config.description,
                `${prefix}${command.config.name} ${command.config.guide?.en?.replace(/\{p\}/g, prefix) || command.config.usages || ""}`.trim(),
                command.config.category,
                command.config.countDown,
                command.config.role === 0 ? getText("user") : 
                command.config.role === 1 ? getText("adminGroup") : getText("adminBot"),
                command.config.author
            ),
            threadID,
            messageID
        );

    } catch (error) {
        console.error("𝐻𝑒𝑙𝑝 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 ℎ𝑒𝑙𝑝 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.", event.threadID, event.messageID);
    }
};
