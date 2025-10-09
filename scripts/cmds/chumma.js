module.exports = {
    config: {
        name: "chumma",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "💋 𝐾𝑖𝑠𝑠 𝑓𝑜𝑟 𝑓𝑢𝑛! 😘"
        },
        longDescription: {
            en: "💋 𝑆𝑒𝑛𝑑 𝑓𝑢𝑛 𝑘𝑖𝑠𝑠 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒𝑠! 😘"
        },
        guide: {
            en: "{p}chumma"
        },
        dependencies: {}
    },

    onStart: async function({ message, event, api }) {
        await message.reply("💋 𝐶ℎ𝑢𝑚𝑚𝑎 𝑒𝑠𝑒𝑐ℎ𝑒! 😘");
    },

    onChat: async function({ event, message, api }) {
        try {
            const { threadID, body } = event;
            if (!body) return;

            const triggers = ["😘", "kiss", "chumma", "chumu", "চুমা", "চুমু"];
            
            if (triggers.some(trigger => body.toLowerCase().includes(trigger.toLowerCase()) || body.includes("😘"))) {
                const responses = [
                    "𝑈𝑚𝑚𝑚𝑚𝑚𝑚𝑚𝑎𝑎𝑎𝑎ℎℎℎℎ 😘 𝑆ℎ𝑜𝑛𝑎 😘💖",
                    "𝑀𝑢𝑎𝑎𝑎𝑎𝑎𝑎𝑎ℎℎℎ 😘 𝐵𝑎𝑐ℎ𝑎 😘💞",
                    "𝐶ℎ𝑢𝑚𝑚𝑎 𝑑𝑖𝑙𝑎𝑚 𝑡𝑜𝑚𝑎𝑘𝑒 😘💘",
                    "𝐾𝑖𝑠𝑠 𝑘𝑜𝑟𝑒 𝑑𝑖𝑙𝑎𝑚 😘💓"
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                await message.reply(randomResponse);
                await api.setMessageReaction("😘", event.messageID, () => {}, true);
            }
        } catch (error) {
            console.error("𝐶ℎ𝑢𝑚𝑚𝑎 𝐸𝑟𝑟𝑜𝑟:", error);
            // Don't send error message to avoid spam
        }
    }
};
