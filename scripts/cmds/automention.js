module.exports.config = {
    name: "automention",
    aliases: ["autotag", "mention"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑢𝑠𝑒𝑟𝑠"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑠 𝑢𝑠𝑒𝑟𝑠 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡"
    },
    guide: {
        en: "{p}automention"
    }
};

module.exports.onStart = async function({ message, event, api }) {
    try {
        if (Object.keys(event.mentions).length === 0) {
            await message.reply(`𝐴𝑝𝑛𝑎𝑘𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛: @[${event.senderID}:0]`);
        } else {
            for (let i = 0; i < Object.keys(event.mentions).length; i++) {
                const name = Object.values(event.mentions)[i].replace('@', '');
                const uid = Object.keys(event.mentions)[i];
                await message.reply(`𝑀𝑒𝑛𝑡𝑖𝑜𝑛𝑖𝑛𝑔: ${name}\n➺ @[${uid}:0]`);
            }
        }
    } catch (error) {
        console.error("𝐴𝑢𝑡𝑜𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔!");
    }
};
