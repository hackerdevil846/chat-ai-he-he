const fs = require("fs-extra");

module.exports.config = {
    name: "getfbstate",
    aliases: ["getstate", "fbstate"],
    version: "1.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "system",
    shortDescription: {
        en: "𝐺𝑒𝑡 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑓𝑏𝑠𝑡𝑎𝑡𝑒 𝑖𝑛 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑓𝑜𝑟𝑚𝑎𝑡𝑠"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑠𝑡𝑎𝑡𝑒 𝑖𝑛 𝑐𝑜𝑜𝑘𝑖𝑒𝑠, 𝑠𝑡𝑟𝑖𝑛𝑔, 𝑜𝑟 𝑑𝑒𝑓𝑎𝑢𝑙𝑡 𝑓𝑜𝑟𝑚𝑎𝑡"
    },
    guide: {
        en: "{p}getfbstate [𝑐𝑜𝑜𝑘𝑖𝑒𝑠/𝑠𝑡𝑟𝑖𝑛𝑔]"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "success": "✨ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑛𝑡 𝑓𝑏𝑠𝑡𝑎𝑡𝑒 𝑡𝑜 𝑦𝑜𝑢𝑟 𝑃𝑀!\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑝𝑟𝑖𝑣𝑎𝑡𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
    }
};

module.exports.onStart = async function ({ api, event, args, getText }) {
    try {
        // Check if fs-extra is available
        if (!fs.outputFile || !fs.createReadStream || !fs.unlinkSync) {
            throw new Error("𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑝𝑟𝑜𝑝𝑒𝑟𝑙𝑦 𝑖𝑛𝑠𝑡𝑎𝑙𝑙𝑒𝑑");
        }

        let fbstate;
        let fileName;
        let message;

        const formatType = args[0]?.toLowerCase();

        if (["cookie", "cookies", "c"].includes(formatType)) {
            fbstate = JSON.stringify(api.getAppState().map(e => ({
                name: e.key,
                value: e.value
            })), null, 2);
            fileName = "𝑐𝑜𝑜𝑘𝑖𝑒𝑠.json";
            message = "🍪 𝐶𝑜𝑜𝑘𝑖𝑒𝑠 𝐹𝑜𝑟𝑚𝑎𝑡";
        }
        else if (["string", "str", "s"].includes(formatType)) {
            fbstate = api.getAppState().map(e => `${e.key}=${e.value}`).join("; ");
            fileName = "𝑐𝑜𝑜𝑘𝑖𝑒𝑠_𝑠𝑡𝑟𝑖𝑛𝑔.txt";
            message = "📝 𝑆𝑡𝑟𝑖𝑛𝑔 𝐹𝑜𝑟𝑚𝑎𝑡";
        }
        else {
            fbstate = JSON.stringify(api.getAppState(), null, 2);
            fileName = "𝑎𝑝𝑝𝑆𝑡𝑎𝑡𝑒.json";
            message = "🔐 𝐷𝑒𝑓𝑎𝑢𝑙𝑡 𝐴𝑝𝑝𝑆𝑡𝑎𝑡𝑒";
        }

        const pathSave = `${__dirname}/tmp/${fileName}`;
        
        // Ensure tmp directory exists
        await fs.ensureDir(`${__dirname}/tmp`);
        await fs.outputFile(pathSave, fbstate);

        if (event.senderID !== event.threadID) {
            api.sendMessage(getText("success"), event.threadID);
        }

        api.sendMessage({
            body: `🪪 𝐹𝐵𝑆𝑇𝐴𝑇𝐸 𝐸𝑋𝑇𝑅𝐴𝐶𝑇𝐸𝐷\n━━━━━━━━━━━━━━\n${message}\n📦 𝐹𝑖𝑙𝑒𝑛𝑎𝑚𝑒: ${fileName}\n⏳ 𝑇𝑖𝑚𝑒: ${new Date().toLocaleString()}`,
            attachment: fs.createReadStream(pathSave)
        }, event.senderID, () => {
            try {
                fs.unlinkSync(pathSave);
            } catch (e) {
                console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", e);
            }
        });

    } catch (error) {
        console.error("𝐹𝐵𝑆𝑡𝑎𝑡𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟: 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑓𝑏𝑠𝑡𝑎𝑡𝑒 𝑓𝑖𝑙𝑒", event.threadID, event.messageID);
    }
};
