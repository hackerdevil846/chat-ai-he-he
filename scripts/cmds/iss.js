const axios = require("axios");

module.exports.config = {
    name: "iss",
    aliases: ["spacestation", "isslocation"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "tool",
    shortDescription: {
        en: "𝐼𝑛𝑡𝑒𝑟𝑛𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑆𝑝𝑎𝑐𝑒 𝑆𝑡𝑎𝑡𝑖𝑜𝑛 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑙𝑜𝑐𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "𝑆𝑒𝑒 𝑡ℎ𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑙𝑜𝑐𝑎𝑡𝑖𝑜𝑛 𝑜𝑓 𝑡ℎ𝑒 𝐼𝑛𝑡𝑒𝑟𝑛𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑆𝑝𝑎𝑐𝑒 𝑆𝑡𝑎𝑡𝑖𝑜𝑛"
    },
    guide: {
        en: "{p}iss"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onStart = async function({ message }) {
    try {
        const response = await axios.get("http://api.open-notify.org/iss-now.json");
        const jsonData = response.data;
        
        await message.reply(
            `🌌 ━━━━━━━━━━━━━━━━━━━━ 🌌\n` +
            `        𝐼𝑁𝑇𝐸𝑅𝑁𝐴𝑇𝐼𝑂𝑁𝐴𝐿 𝑆𝑃𝐴𝐶𝐸 𝑆𝑇𝐴𝑇𝐼𝑂𝑁\n` +
            `🌌 ━━━━━━━━━━━━━━━━━━━━ 🌌\n\n` +
            `📍 𝐿𝑎𝑡𝑖𝑡𝑢𝑑𝑒: ${jsonData.iss_position.latitude}\n` +
            `📍 𝐿𝑜𝑛𝑔𝑖𝑡𝑢𝑑𝑒: ${jsonData.iss_position.longitude}\n\n` +
            `🔭 𝑅𝑒𝑎𝑙-𝑡𝑖𝑚𝑒 𝑡𝑟𝑎𝑐𝑘𝑖𝑛𝑔:\n` +
            `https://spotthestation.nasa.gov/tracking_map.cfm\n\n` +
            `🛰️ 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑠𝑝𝑒𝑒𝑑: 28,000 𝑘𝑚/ℎ\n` +
            `🌎 𝑂𝑟𝑏𝑖𝑡 𝑡𝑖𝑚𝑒: 90 𝑚𝑖𝑛𝑢𝑡𝑒𝑠`
        );

    } catch (error) {
        console.error("𝐼𝑆𝑆 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐼𝑆𝑆 𝑙𝑜𝑐𝑎𝑡𝑖𝑜𝑛 𝑓𝑒𝑡𝑐ℎ 𝑓𝑎𝑖𝑙𝑒𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
