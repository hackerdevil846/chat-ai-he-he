module.exports.config = {
    name: "fistfight",
    aliases: ["punch", "fight"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝑃𝑢𝑛𝑐ℎ 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑖𝑛 𝑎 𝑓𝑖𝑠𝑡𝑓𝑖𝑔ℎ𝑡"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑 𝑎 𝑝𝑢𝑛𝑐ℎ 𝑎𝑛𝑖𝑚𝑎𝑡𝑖𝑜𝑛 𝑡𝑜 𝑎 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
        en: "{p}fistfight [𝑡𝑎𝑔]"
    },
    dependencies: {
        "request": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ api, event, message }) {
    try {
        const request = global.nodemodule["request"];
        const fs = global.nodemodule["fs-extra"];
    } catch (e) {
        return message.reply("❌ | 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
    }

    const request = global.nodemodule["request"];
    const fs = global.nodemodule["fs-extra"];

    var link = [    
        "https://i.postimg.cc/SNX8pD8Z/13126.gif",
        "https://i.postimg.cc/TYZb2gJT/1467506881-1016b5fd386cf30488508cf6f0a2bee5.gif",
        "https://i.postimg.cc/fyV3DR33/anime-punch.gif",
        "https://i.postimg.cc/P5sLnhdx/onehit-30-5-2016-3.gif",
    ];

    var mention = Object.keys(event.mentions);
    if (!mention[0]) return message.reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 1 𝑝𝑒𝑟𝑠𝑜𝑛");

    let tag = event.mentions[mention[0]].replace("@", "");
    
    var callback = () => api.sendMessage({
        body: `${tag}` + ` 𝑇𝑎𝑘𝑒 𝑡ℎ𝑖𝑠 𝑝𝑢𝑛𝑐ℎ 𝑟𝑖𝑔ℎ𝑡 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑓𝑎𝑐𝑒! 𝑆𝑡𝑜𝑝 𝑡𝑎𝑙𝑘𝑖𝑛𝑔 𝑛𝑜𝑛𝑠𝑒𝑛𝑠𝑒! 👿`,
        mentions: [{ tag: tag, id: Object.keys(event.mentions)[0] }],
        attachment: fs.createReadStream(__dirname + "/cache/puch.gif")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/puch.gif"));  

    return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/puch.gif")).on("close", () => callback());
};
