module.exports.config = {
    name: "autoreact",
    aliases: ["autoreaction", "autoemoji"],
    version: "1.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    category: "𝑛𝑜-𝑝𝑟𝑒𝑓𝑖𝑥",
    shortDescription: {
        en: "𝐵𝑜𝑡 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑎𝑐𝑡𝑠 𝑡𝑜 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠 𝑖𝑛 𝑐ℎ𝑎𝑡"
    },
    guide: {
        en: ""
    },
    dependencies: {}
};

module.exports.onChat = async function({ api, event }) {
    try {
        if (!event.body) return;
        
        let react = event.body.toLowerCase();
        const { threadID, messageID } = event;

        // 𝑆𝑜𝑢𝑙 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛
        if (react.includes("atma") || react.includes("roh")) {
            api.setMessageReaction("🖤", messageID, (err) => {}, true);
        }

        // 𝐿𝑜𝑣𝑒/𝐴𝑓𝑓𝑒𝑐𝑡𝑖𝑜𝑛 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛
        else if (react.includes("bhalobasha") || react.includes("prem") || react.includes("maya") || 
                 react.includes("ador") || react.includes("kiss") || react.includes("chumma") || 
                 react.includes("shona") || react.includes("jaan") || react.includes("priyo")) {
            api.setMessageReaction("❤️", messageID, (err) => {}, true);
        }

        // 𝑆𝑎𝑑𝑛𝑒𝑠𝑠 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛
        else if (react.includes("dukkho") || react.includes("kanna") || react.includes("kando") || 
                 react.includes("ashru") || react.includes("mon kharap") || react.includes("bedona")) {
            api.setMessageReaction("😢", messageID, (err) => {}, true);
        }

        // 𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛
        else if (react.includes("bangladesh") || react.includes("bd") || react.includes("sonar bangla") || 
                 react.includes("desh")) {
            api.setMessageReaction("🇧🇩", messageID, (err) => {}, true);
        }

        // 𝐺𝑟𝑒𝑒𝑡𝑖𝑛𝑔𝑠/𝑇𝑖𝑚𝑒 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛
        else if (react.includes("shokal") || react.includes("bikal") || react.includes("sha") || 
                 react.includes("rat") || react.includes("khabar") || react.includes("ghum")) {
            api.setMessageReaction("❤", messageID, (err) => {}, true);
        }

        // 𝑆𝑢𝑟𝑝𝑟𝑖𝑠𝑒 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛
        else if (react.includes("wah") || react.includes("oshadharon") || react.includes("roboter")) {
            api.setMessageReaction("😮", messageID, (err) => {}, true);
        }

    } catch (error) {
        console.error("𝐴𝑢𝑡𝑜𝑟𝑒𝑎𝑐𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onStart = async function() {
    // 𝑁𝑜 𝑖𝑛𝑖𝑡𝑖𝑎𝑙 𝑎𝑐𝑡𝑖𝑜𝑛 𝑛𝑒𝑒𝑑𝑒𝑑
};
