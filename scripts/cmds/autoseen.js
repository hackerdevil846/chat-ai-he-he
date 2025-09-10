const fs = require('fs-extra');
const pathFile = __dirname + '/cache/autoseen.txt';

// Create cache file if it doesn't exist
if (!fs.existsSync(pathFile)) {
    fs.writeFileSync(pathFile, 'false');
}

module.exports.config = {
    name: "autoseen",
    aliases: ["autoread"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑚𝑎𝑟𝑘 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑎𝑠 𝑠𝑒𝑒𝑛"
    },
    longDescription: {
        en: "𝑇𝑢𝑟𝑛 𝑜𝑛/𝑜𝑓𝑓 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐 𝑚𝑎𝑟𝑘𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑎𝑠 𝑠𝑒𝑒𝑛"
    },
    guide: {
        en: "{p}autoseen [on|off]"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        const [arg] = args;
        
        if (arg === 'on') {
            fs.writeFileSync(pathFile, 'true');
            await message.reply('✅ 𝐴𝑢𝑡𝑜 𝑠𝑒𝑒𝑛 𝑡𝑢𝑟𝑛𝑒𝑑 𝑜𝑛 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦');
        } 
        else if (arg === 'off') {
            fs.writeFileSync(pathFile, 'false');
            await message.reply('✅ 𝐴𝑢𝑡𝑜 𝑠𝑒𝑒𝑛 𝑡𝑢𝑟𝑛𝑒𝑑 𝑜𝑓𝑓 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦');
        } 
        else {
            const helpMessage = `❌ 𝐼𝑛𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑠𝑦𝑛𝑡𝑎𝑥!\n💡 𝑈𝑠𝑒: ${global.config.PREFIX}${this.config.name} [on|off]`;
            await message.reply(helpMessage);
        }
    } 
    catch (error) {
        console.error('🔴 𝐸𝑟𝑟𝑜𝑟:', error);
        await message.reply('❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡');
    }
};

module.exports.onChat = async function({ api }) {
    try {
        const content = fs.readFileSync(pathFile, 'utf-8');
        if (content === 'true') {
            api.markAsReadAll(() => {});
        }
    } catch (error) {
        console.error('𝐴𝑢𝑡𝑜𝑠𝑒𝑒𝑛 𝑒𝑟𝑟𝑜𝑟:', error);
    }
};
