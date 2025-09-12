module.exports.config = {
    name: "emojireply",
    aliases: ["emojiauto", "autoreply"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    shortDescription: {
        en: "𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑒𝑚𝑜𝑗𝑖 𝑤𝑖𝑡ℎ 𝑟𝑎𝑛𝑑𝑜𝑚 𝑒𝑚𝑜𝑗𝑖 𝑝𝑎𝑖𝑟𝑠"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑝𝑙𝑖𝑒𝑠 𝑡𝑜 𝑎𝑛𝑦 𝑒𝑚𝑜𝑗𝑖 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑟𝑎𝑛𝑑𝑜𝑚 𝑒𝑚𝑜𝑗𝑖 𝑐𝑜𝑚𝑏𝑖𝑛𝑎𝑡𝑖𝑜𝑛𝑠"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "𝑈𝑠𝑒 '𝑒𝑚𝑜𝑗𝑖𝑟𝑒𝑝𝑙𝑦 𝑜𝑛' 𝑡𝑜 𝑒𝑛𝑎𝑏𝑙𝑒 𝑜𝑟 '𝑒𝑚𝑜𝑗𝑖𝑟𝑒𝑝𝑙𝑦 𝑜𝑓𝑓' 𝑡𝑜 𝑑𝑖𝑠𝑎𝑏𝑙𝑒. 𝐷𝑒𝑓𝑎𝑢𝑙𝑡 𝑖𝑠 𝑜𝑓𝑓."
    }
};

// Store the enabled state per thread
const threadStates = {};

module.exports.onStart = async function({ event }) {
    // Initialize as off by default
    threadStates[event.threadID] = false;
};

module.exports.onChat = async function({ api, event, args }) {
    const threadID = event.threadID;
    
    // Initialize thread state if not exists
    if (threadStates[threadID] === undefined) {
        threadStates[threadID] = false;
    }

    // Handle the command to toggle on/off
    if (event.body && event.body.toLowerCase().startsWith("emojireply")) {
        const command = event.body.split(" ")[1]?.toLowerCase();
        
        if (command === "on") {
            threadStates[threadID] = true;
            api.sendMessage("𝐸𝑚𝑜𝑗𝑖 𝑟𝑒𝑝𝑙𝑦 𝑚𝑜𝑑𝑒 𝑖𝑠 𝑛𝑜𝑤 𝑂𝑁 ✅", threadID);
            return;
        } else if (command === "off") {
            threadStates[threadID] = false;
            api.sendMessage("𝐸𝑚𝑜𝑗𝑖 𝑟𝑒𝑝𝑙𝑦 𝑚𝑜𝑑𝑒 𝑖𝑠 𝑛𝑜𝑤 𝑂𝐹𝐹 ❌", threadID);
            return;
        } else {
            // Show current status
            const status = threadStates[threadID] ? "𝑂𝑁 ✅" : "𝑂𝐹𝐹 ❌";
            api.sendMessage(`𝐸𝑚𝑜𝑗𝑖 𝑟𝑒𝑝𝑙𝑦 𝑚𝑜𝑑𝑒 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 ${status}\n𝑈𝑠𝑒: 𝑒𝑚𝑜𝑗𝑖𝑟𝑒𝑝𝑙𝑦 𝑜𝑛/𝑜𝑓𝑓`, threadID);
            return;
        }
    }

    // Check if emoji reply is enabled for this thread
    if (!threadStates[threadID]) {
        return;
    }

    // Check if the message consists only of emojis
    const emojiRegex = /^(\p{Emoji}|\p{Emoji_Presentation}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base}|\p{Emoji_Component})+$/u;
    
    if (emojiRegex.test(event.body)) {
        // Generate random emoji pairs
        const emojiPairs = [
            ["😊", "😎"],
            ["❤️", "✨"],
            ["😂", "🤣"],
            ["👍", "👌"],
            ["🐐", "🤖"],
            ["🌞", "🌝"],
            ["🍎", "🍏"],
            ["⚡", "🔥"],
            ["🙈", "🙉"],
            ["🎉", "🎊"],
            ["🤔", "🤨"],
            ["🥳", "🎂"],
            ["🍕", "🍔"],
            ["🚀", "👽"],
            ["💯", "🔥"],
            ["🧠", "💡"],
            ["👀", "👉"],
            ["🤝", "👏"],
            ["💔", "❤️‍🩹"],
            ["🤯", "😵"]
        ];

        // Select a random pair
        const randomPair = emojiPairs[Math.floor(Math.random() * emojiPairs.length)];
        
        // Reply with the emoji pair
        api.sendMessage(randomPair.join(' '), threadID, event.messageID);
    }
};
