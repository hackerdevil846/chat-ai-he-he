const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
    name: "fact2",
    aliases: ["factimg", "factimage"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑓𝑎𝑐𝑡𝑠 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑓𝑎𝑐𝑡 𝑡𝑒𝑥𝑡 𝑢𝑠𝑖𝑛𝑔 𝑃𝑜𝑝𝑐𝑎𝑡 𝐴𝑃𝐼"
    },
    guide: {
        en: "{p}fact2 [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onStart = async function({ message, args, event }) {
    try {
        if (!args[0]) {
            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑓𝑎𝑐𝑡 𝑖𝑚𝑎𝑔𝑒!");
        }

        const text = args.join(" ");
        const path = __dirname + '/cache/facts.png';

        const response = await axios.get(encodeURI(`https://api.popcat.xyz/facts?text=${text}`), {
            responseType: 'arraybuffer'
        });

        await fs.writeFileSync(path, Buffer.from(response.data, 'binary'));

        await message.reply({
            body: `✨ 𝐹𝑎𝑐𝑡 𝐼𝑚𝑎𝑔𝑒 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n\n📝 𝑇𝑒𝑥𝑡: "${text}"`,
            attachment: fs.createReadStream(path)
        });

        fs.unlinkSync(path);

    } catch (error) {
        console.error("𝐹𝑎𝑐𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!");
    }
};
