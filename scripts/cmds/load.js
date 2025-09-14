module.exports.config = {
    name: "load",
    aliases: ["reloadconfig", "refreshconfig"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 30,
    role: 2,
    category: "𝑠𝑦𝑠𝑡𝑒𝑚",
    shortDescription: {
        en: "🔄 𝐶𝑜𝑛𝑓𝑖𝑔 𝑓𝑎𝑖𝑙 𝑟𝑒𝑙𝑜𝑎𝑑 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    longDescription: {
        en: "𝑅𝑒𝑙𝑜𝑎𝑑𝑠 𝑡ℎ𝑒 𝑏𝑜𝑡'𝑠 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛 𝑓𝑖𝑙𝑒 𝑤𝑖𝑡ℎ𝑜𝑢𝑡 𝑟𝑒𝑠𝑡𝑎𝑟𝑡𝑖𝑛𝑔"
    },
    guide: {
        en: "{p}load"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, global }) {
    try {
        // Check if fs-extra is available
        if (!global.nodemodule || !global.nodemodule.fs) {
            return message.reply("❌ 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑖𝑡.");
        }

        const fs = global.nodemodule.fs;
        const configPath = global.client.configPath;
        
        // Check if config file exists
        if (!fs.existsSync(configPath)) {
            return message.reply("❌ 𝐶𝑜𝑛𝑓𝑖𝑔 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡: " + configPath);
        }

        // Clear cache and reload config
        delete require.cache[require.resolve(configPath)];
        global.config = require(configPath);
        
        return message.reply(
            "✅ | 𝐶𝑜𝑛𝑓𝑖𝑔 𝑓𝑎𝑖𝑙 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑟𝑒𝑙𝑜𝑎𝑑𝑒𝑑!\n🔄 | 𝐵𝑜𝑡 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑢𝑝𝑑𝑎𝑡𝑒𝑑!",
            event.threadID,
            event.messageID
        );
    } 
    catch (error) {
        console.error("𝑅𝑒𝑙𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        return message.reply(
            `❌ | 𝐶𝑜𝑛𝑓𝑖𝑔 𝑟𝑒𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑!\n📄 | 𝐸𝑟𝑟𝑜𝑟: ${error.message}`,
            event.threadID,
            event.messageID
        );
    }
};
