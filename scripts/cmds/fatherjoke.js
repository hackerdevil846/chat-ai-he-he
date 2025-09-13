const axios = require("axios");

module.exports.config = {
    name: "fatherjoke",
    aliases: ["dadjoke", "dad"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐷𝑎𝑑 𝑗𝑜𝑘𝑒"
    },
    longDescription: {
        en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑑𝑎𝑑 𝑗𝑜𝑘𝑒"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}fatherjoke"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onStart = async function({ message }) {
    try {
        const res = await axios.get("https://icanhazdadjoke.com/", {
            headers: { 
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });
        
        message.reply(`👨‍🦳 𝗗𝗮𝗱 𝗝𝗼𝗸𝗲:\n"${res.data.joke}"`);
    } catch (error) {
        console.error("𝐷𝑎𝑑 𝐽𝑜𝑘𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑗𝑜𝑘𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
