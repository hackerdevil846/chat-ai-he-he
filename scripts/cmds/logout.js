module.exports.config = {
    name: "logout",
    aliases: ["logoff", "signout"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 2,
    category: "𝑠𝑦𝑠𝑡𝑒𝑚",
    shortDescription: {
        en: "𝐵𝑜𝑡 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 𝑙𝑜𝑔𝑜𝑢𝑡 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    longDescription: {
        en: "𝐿𝑜𝑔𝑠 𝑜𝑢𝑡 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 𝑓𝑟𝑜𝑚 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘"
    },
    guide: {
        en: "{p}logout"
    },
    envConfig: {
        logoutTimeout: 1500
    }
};

module.exports.onStart = async function({ message, event, envConfig, api }) {
    try {
        await message.reply("🔒 | 𝐵𝑜𝑡 𝑖𝑠 𝑙𝑜𝑔𝑔𝑖𝑛𝑔 𝑜𝑢𝑡...\n\n🔄 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 𝑚𝑜𝑚𝑒𝑛𝑡𝑖𝑙𝑦...");
        
        setTimeout(() => {
            api.logout();
            console.log('✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑙𝑜𝑔𝑔𝑒𝑑 𝑜𝑢𝑡');
        }, envConfig.logoutTimeout || 1500);

    } catch (error) {
        console.log('❌ 𝐿𝑜𝑔𝑜𝑢𝑡 𝑒𝑟𝑟𝑜𝑟:', error);
        await message.reply("❌ | 𝐿𝑜𝑔𝑜𝑢𝑡 𝑓𝑎𝑖𝑙𝑒𝑑!\n\n" + error.message);
    }
};
