const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
    name: "hubble",
    aliases: ["nasaimage", "spacepic"],
    version: "1.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝑉𝑖𝑒𝑤 𝐻𝑢𝑏𝑏𝑙𝑒 𝑡𝑒𝑙𝑒𝑠𝑐𝑜𝑝𝑒 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑎𝑠𝑡𝑜𝑛𝑜𝑚𝑖𝑐𝑎𝑙 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑁𝐴𝑆𝐴'𝑠 𝐻𝑢𝑏𝑏𝑙𝑒 𝑡𝑒𝑙𝑒𝑠𝑐𝑜𝑝𝑒 𝑏𝑦 𝑑𝑎𝑡𝑒"
    },
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    guide: {
        en: "{p}hubble <𝑑𝑎𝑡𝑒 (𝑚𝑚-𝑑𝑑)>"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.langs = {
    en: {
        invalidDate: "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑑𝑎𝑡𝑒 𝑓𝑜𝑟𝑚𝑎𝑡! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑚𝑚-𝑑𝑑 𝑓𝑜𝑟𝑚𝑎𝑡",
        noImage: "🌌 𝑁𝑜 𝐻𝑢𝑏𝑏𝑙𝑒 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑑𝑎𝑡𝑒"
    }
};

module.exports.onLoad = async function () {
    const pathData = __dirname + '/assets/hubble/nasa.json';
    
    if (!fs.existsSync(__dirname + '/assets/hubble')) {
        fs.mkdirSync(__dirname + '/assets/hubble', { recursive: true });
    }
    
    if (!fs.existsSync(pathData)) {
        try {
            const res = await axios.get('https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/scripts/cmds/assets/hubble/nasa.json');
            fs.writeFileSync(pathData, JSON.stringify(res.data, null, 2));
        } catch (error) {
            console.error('𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑁𝐴𝑆𝐴 𝑑𝑎𝑡𝑎:', error);
        }
    }
};

module.exports.onStart = async function ({ message, args, getLang }) {
    try {
        const date = args[0] || "";
        const dateText = checkValidDate(date);
        
        if (!date || !dateText) {
            return message.reply(getLang('invalidDate'));
        }

        const pathData = __dirname + '/assets/hubble/nasa.json';
        if (!fs.existsSync(pathData)) {
            return message.reply("🔴 𝐷𝑎𝑡𝑎 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟");
        }

        const hubbleData = JSON.parse(fs.readFileSync(pathData));
        const data = hubbleData.find(e => e.date.startsWith(dateText));
        
        if (!data) {
            return message.reply(getLang('noImage'));
        }

        const { image, name, caption, url } = data;
        const imageUrl = 'https://imagine.gsfc.nasa.gov/hst_bday/images/' + image;
        
        const imageStream = await global.utils.getStreamFromURL(imageUrl);
        
        const msg = `✨𝗛𝗨𝗕𝗕𝗟𝗘 𝗧𝗘𝗟𝗘𝗦𝗖𝗢𝗣𝗘 𝗜𝗠𝗔𝗚𝗘✨\n
📅 𝗗𝗮𝘁𝗲: ${dateText}
🌠 𝗡𝗮𝗺𝗲: ${name}
📝 𝗖𝗮𝗽𝘁𝗶𝗼𝗻: ${caption}
🔗 𝗦𝗼𝘂𝗿𝗰𝗲: ${url}`;

        await message.reply({
            body: msg,
            attachment: imageStream
        });

    } catch (error) {
        console.error(error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
    }
};

const monthText = ['𝐽𝑎𝑛𝑢𝑎𝑟𝑦', '𝐹𝑒𝑏𝑟𝑢𝑎𝑟𝑦', '𝑀𝑎𝑟𝑐ℎ', '𝐴𝑝𝑟𝑖𝑙', '𝑀𝑎𝑦', '𝐽𝑢𝑛𝑒', '𝐽𝑢𝑙𝑦', '𝐴𝑢𝑔𝑢𝑠𝑡', '𝑆𝑒𝑝𝑡𝑒𝑚𝑏𝑒𝑟', '𝑂𝑐𝑡𝑜𝑏𝑒𝑟', '𝑁𝑜𝑣𝑒𝑚𝑏𝑒𝑟', '𝐷𝑒𝑐𝑒𝑚𝑏𝑒𝑟'];

function checkValidDate(date) {
    const dateArr = date.split(/[-/]/);
    if (dateArr.length !== 2) return false;
    
    let [month, day] = dateArr.map(Number);
    
    if (month > 12) {
        [day, month] = [month, day];
    }
    
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;
    if (month === 2 && day > 29) return false;
    if ([4, 6, 9, 11].includes(month) && day > 30) return false;
    
    return `${monthText[month - 1]} ${day}`;
}
