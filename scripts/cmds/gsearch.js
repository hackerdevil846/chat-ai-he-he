module.exports.config = {
    name: "gsearch",
    aliases: ["google", "search"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "🔍 𝑃𝑒𝑟𝑓𝑜𝑟𝑚 𝐺𝑜𝑜𝑔𝑙𝑒 𝑡𝑒𝑥𝑡 𝑠𝑒𝑎𝑟𝑐ℎ𝑒𝑠 𝑜𝑟 𝑟𝑒𝑣𝑒𝑟𝑠𝑒 𝑖𝑚𝑎𝑔𝑒 𝑠𝑒𝑎𝑟𝑐ℎ𝑒𝑠"
    },
    longDescription: {
        en: "🔍 𝑃𝑒𝑟𝑓𝑜𝑟𝑚 𝐺𝑜𝑜𝑔𝑙𝑒 𝑡𝑒𝑥𝑡 𝑠𝑒𝑎𝑟𝑐ℎ𝑒𝑠 𝑜𝑟 𝑟𝑒𝑣𝑒𝑟𝑠𝑒 𝑖𝑚𝑎𝑔𝑒 𝑠𝑒𝑎𝑟𝑐ℎ𝑒𝑠"
    },
    guide: {
        en: "{p}gsearch [𝑞𝑢𝑒𝑟𝑦] 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.languages = {
    "en": {
        "guideTitle": "𝐺𝑂𝑂𝐺𝐿𝐸 𝑆𝐸𝐴𝑅𝐶𝐻",
        "textSearch": "𝑇𝑒𝑥𝑡 𝑆𝑒𝑎𝑟𝑐ℎ",
        "imageSearch": "𝐼𝑚𝑎𝑔𝑒 𝑆𝑒𝑎𝑟𝑐ℎ (𝑅𝑒𝑣𝑒𝑟𝑠𝑒)",
        "exampleText": "𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑠𝑒𝑎𝑟𝑐ℎ ℎ𝑜𝑤 𝑡𝑜 𝑏𝑎𝑘𝑒 𝑎 𝑐𝑎𝑘𝑒",
        "exampleImage": "𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ: 𝑠𝑒𝑎𝑟𝑐ℎ",
        "invalid": "𝐼𝑁𝑉𝐴𝐿𝐼𝐷 𝑅𝐸𝑄𝑈𝐸𝑆𝑇",
        "clickToOpen": "𝐶𝑙𝑖𝑐𝑘 𝑡ℎ𝑒 𝑙𝑖𝑛𝑘 𝑎𝑏𝑜𝑣𝑒 𝑡𝑜 𝑣𝑖𝑒𝑤 𝑟𝑒𝑠𝑢𝑙𝑡𝑠",
        "failed": "𝑆𝐸𝐴𝑅𝐶𝐻 𝐹𝐴𝐼𝐿𝐸𝐷"
    }
};

module.exports.onLoad = function () {
    // 𝐼𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑎𝑡𝑖𝑜𝑛 𝑐𝑜𝑑𝑒 𝑖𝑓 𝑛𝑒𝑒𝑑𝑒𝑑
};

function createBox(text, type = "search") {
    const decor = type === "error"
        ? { left: "❌┏", right: "❌┗", midEmoji: "❌" }
        : { left: "🔍┏", right: "🔍┗", midEmoji: "🔍" };

    const line = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    const top = `${decor.left}${line}${decor.left.replace("┏", "┓")}`;
    const bottom = `${decor.right}${line}${decor.right.replace("┗", "┛")}`;

    return `${top}\n${text}\n${bottom}`;
}

module.exports.onStart = async function({ api, event, args }) {
    try {
        if ((!args || args.length === 0) && !event.messageReply) {
            const guideText =
                `🌐  𝐺𝑂𝑂𝐺𝐿𝐸 𝑆𝐸𝐴𝑅𝐶𝐻\n` +
                `🌐  𝑉𝑒𝑟𝑠𝑖𝑜𝑛: ${this.config.version}\n\n` +
                `📚  𝑈𝑠𝑎𝑔𝑒 𝐺𝑢𝑖𝑑𝑒:\n\n` +
                `  • 𝑇𝑒𝑥𝑡 𝑆𝑒𝑎𝑟𝑐ℎ:\n` +
                `    ${this.config.name} <𝑦𝑜𝑢𝑟 𝑞𝑢𝑒𝑟𝑦>\n` +
                `    𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${this.config.name} ℎ𝑜𝑤 𝑡𝑜 𝑏𝑎𝑘𝑒 𝑎 𝑐𝑎𝑘𝑒\n\n` +
                `  • 𝐼𝑚𝑎𝑔𝑒 𝑆𝑒𝑎𝑟𝑐ℎ (𝑅𝑒𝑣𝑒𝑟𝑠𝑒):\n` +
                `    𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ: ${this.config.name}\n` +
                `    𝐸𝑥𝑎𝑚𝑝𝑙𝑒: [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒] ${this.config.name}`;

            return api.sendMessage(createBox(guideText), event.threadID, event.messageID);
        }

        if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
            const attachment = event.messageReply.attachments[0];
            const imageTypes = ["photo", "animated_image", "image", "sticker"];

            if (attachment && attachment.type && imageTypes.includes(attachment.type)) {
                const imageUrl = encodeURIComponent(attachment.url);
                const searchURL = `https://www.google.com/searchbyimage?&image_url=${imageUrl}`;

                const resultText =
                    `🖼️  𝑅𝐸𝑉𝐸𝑅𝑆𝐸 𝐼𝑀𝐴𝐺𝐸 𝑆𝐸𝐴𝑅𝐶𝐻\n\n` +
                    `🌐  𝑆𝑒𝑎𝑟𝑐ℎ 𝑅𝑒𝑠𝑢𝑙𝑡𝑠:\n` +
                    `🔗 ${searchURL}\n\n` +
                    `ℹ️ ${this.languages.en.clickToOpen}`;

                return api.sendMessage(createBox(resultText), event.threadID, event.messageID);
            }
        }

        const searchQuery = args.join(" ").trim();
        if (!searchQuery) {
            const invalidText =
                `⚠️  𝐼𝑁𝑉𝐴𝐿𝐼𝐷 𝑅𝐸𝑄𝑈𝐸𝑆𝑇\n\n` +
                `𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑡𝑒𝑥𝑡 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒\n\n` +
                `ℹ️ 𝑇𝑦𝑝𝑒 "${this.config.name}" 𝑤𝑖𝑡ℎ𝑜𝑢𝑡 𝑎𝑟𝑔𝑢𝑚𝑒𝑛𝑡𝑠 𝑓𝑜𝑟 𝑢𝑠𝑎𝑔𝑒 𝑔𝑢𝑖𝑑𝑒`;

            return api.sendMessage(createBox(invalidText, "error"), event.threadID, event.messageID);
        }

        const searchURL = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

        const resultMsg =
            `🌐  𝑇𝐸𝑋𝑇 𝑆𝐸𝐴𝑅𝐶𝐻 𝑅𝐸𝑆𝑈𝐿𝑇𝑆\n\n` +
            `🔎 𝑄𝑢𝑒𝑟𝑦: "${searchQuery}"\n\n` +
            `🔗 𝑆𝑒𝑎𝑟𝑐ℎ 𝑈𝑅𝐿: ${searchURL}\n\n` +
            `ℹ️ ${this.languages.en.clickToOpen}`;

        return api.sendMessage(createBox(resultMsg), event.threadID, event.messageID);

    } catch (error) {
        console.error("𝑆𝑒𝑎𝑟𝑐ℎ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);

        const errorMsg =
            `⚠️  𝑆𝐸𝐴𝑅𝐶𝐻 𝐹𝐴𝐼𝐿𝐸𝐷!\n\n` +
            `🔧 𝐸𝑟𝑟𝑜𝑟: ${error && error.message ? error.message : "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑒𝑟𝑟𝑜𝑟"}\n\n` +
            `ℹ️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟 𝑜𝑟 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑖𝑛𝑝𝑢𝑡`;

        return api.sendMessage(createBox(errorMsg, "error"), event.threadID, event.messageID);
    }
};
