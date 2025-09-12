module.exports.config = {
    name: "fact",
    aliases: ["randomfact", "funfact"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑓𝑎𝑐𝑡𝑠"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡𝑖𝑛𝑔 𝑓𝑎𝑐𝑡𝑠"
    },
    guide: {
        en: "{p}fact"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        const axios = require("axios");
        const response = await axios.get('https://api.popcat.xyz/fact');
        const fact = response.data.fact;
        
        await message.reply(`🔮 | 𝑅𝑎𝑛𝑑𝑜𝑚 𝐹𝑎𝑐𝑡 𝐹𝑜𝑟 𝑌𝑜𝑢\n\n✨ | 𝐹𝑎𝑐𝑡: ${fact}\n\n💫 | 𝐶𝑟𝑒𝑎𝑡𝑜𝑟: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`);
        
    } catch (error) {
        console.error("𝐹𝑎𝑐𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑓𝑎𝑐𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
