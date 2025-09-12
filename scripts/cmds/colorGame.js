module.exports.config = {
    name: "colorGame",
    aliases: ["colorbet", "cgame"],
    version: "1.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    category: "game",
    shortDescription: {
        en: "𝐶𝑜𝑙𝑜𝑟 𝑏𝑒𝑡𝑡𝑖𝑛𝑔 𝑔𝑎𝑚𝑒"
    },
    longDescription: {
        en: "𝐵𝑒𝑡 𝑚𝑜𝑛𝑒𝑦 𝑜𝑛 𝑐𝑜𝑙𝑜𝑟𝑠 𝑡𝑜 𝑤𝑖𝑛 𝑝𝑟𝑖𝑧𝑒𝑠"
    },
    guide: {
        en: "{p}colorGame [𝑐𝑜𝑙𝑜𝑟] - 𝐶ℎ𝑜𝑜𝑠𝑒 𝑓𝑟𝑜𝑚: 𝑏𝑙𝑢𝑒, 𝑟𝑒𝑑, 𝑔𝑟𝑒𝑒𝑛, 𝑦𝑒𝑙𝑙𝑜𝑤, 𝑣𝑖𝑜𝑙𝑒𝑡, 𝑏𝑙𝑎𝑐𝑘"
    },
    dependencies: {}
};

module.exports.onStart = async function({ message, args, usersData, event, api }) {
    try {
        const { senderID, threadID, messageID } = event;
        const userData = await usersData.get(senderID);
        const moneyUser = userData.money;

        if (moneyUser < 100000) {
            return message.reply("𝑁𝑜𝑡 𝑒𝑛𝑜𝑢𝑔ℎ 𝑚𝑜𝑛𝑒𝑦! 𝑌𝑜𝑢 𝑛𝑒𝑒𝑑 𝑎𝑡 𝑙𝑒𝑎𝑠𝑡 100000$");
        }

        const colorArg = args[0]?.toLowerCase();
        let colorCode;

        if (colorArg === "e" || colorArg === "blue") colorCode = 0;
        else if (colorArg === "r" || colorArg === "red") colorCode = 1;
        else if (colorArg === "g" || colorArg === "green") colorCode = 2;
        else if (colorArg === "y" || colorArg === "yellow") colorCode = 3;
        else if (colorArg === "v" || colorArg === "violet") colorCode = 4;
        else if (colorArg === "b" || colorArg === "black") colorCode = 5;
        else {
            return message.reply("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑏𝑒𝑡! 𝐶ℎ𝑜𝑜𝑠𝑒 𝑓𝑟𝑜𝑚: 𝑏𝑙𝑢𝑒 [180], 𝑟𝑒𝑑 [200], 𝑔𝑟𝑒𝑒𝑛 [70], 𝑦𝑒𝑙𝑙𝑜𝑤 [50], 𝑣𝑖𝑜𝑙𝑒𝑡 [150], 𝑏𝑙𝑎𝑐𝑘 [100]");
        }

        const check = (num) => {
            if (num === 0) return '💙';
            if (num % 2 === 0 && num % 6 !== 0 && num % 10 !== 0) return '♥️';
            if (num % 3 === 0 && num % 6 !== 0) return '💚';
            if (num % 5 === 0 && num % 10 !== 0) return '💛';
            if (num % 10 === 0) return '💜';
            return '🖤️';
        };

        const random = Math.floor(Math.random() * 50);
        const resultColor = check(random);

        if (colorCode === 0 && resultColor === '💙') {
            await usersData.set(senderID, { money: moneyUser + 180000 });
            message.reply(`𝑌𝑜𝑢 𝑐ℎ𝑜𝑠𝑒 𝑏𝑙𝑢𝑒 💙, 𝑦𝑜𝑢 𝑤𝑜𝑛 𝑎𝑛𝑑 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 +180000$\n𝑌𝑜𝑢𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑚𝑜𝑛𝑒𝑦: ${moneyUser + 180000}$`);
        } else if (colorCode === 1 && resultColor === '♥️') {
            await usersData.set(senderID, { money: moneyUser + 200000 });
            message.reply(`𝑌𝑜𝑢 𝑐ℎ𝑜𝑠𝑒 𝑟𝑒𝑑 ♥️, 𝑦𝑜𝑢 𝑤𝑜𝑛 𝑎𝑛𝑑 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 +200000$\n𝑌𝑜𝑢𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑚𝑜𝑛𝑒𝑦: ${moneyUser + 200000}$`);
        } else if (colorCode === 2 && resultColor === '💚') {
            await usersData.set(senderID, { money: moneyUser + 700000 });
            message.reply(`𝑌𝑜𝑢 𝑐ℎ𝑜𝑠𝑒 𝑔𝑟𝑒𝑒𝑛 💚, 𝑦𝑜𝑢 𝑤𝑜𝑛 𝑎𝑛𝑑 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 +700000$\n𝑌𝑜𝑢𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑚𝑜𝑛𝑒𝑦: ${moneyUser + 700000}$`);
        } else if (colorCode === 3 && resultColor === '💛') {
            await usersData.set(senderID, { money: moneyUser + 500000 });
            message.reply(`𝑌𝑜𝑢 𝑐ℎ𝑜𝑠𝑒 𝑦𝑒𝑙𝑙𝑜𝑤 💛, 𝑦𝑜𝑢 𝑤𝑜𝑛 𝑎𝑛𝑑 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 +500000$\n𝑌𝑜𝑢𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑚𝑜𝑛𝑒𝑦: ${moneyUser + 500000}$`);
        } else if (colorCode === 4 && resultColor === '💜') {
            await usersData.set(senderID, { money: moneyUser + 1500000 });
            message.reply(`𝑌𝑜𝑢 𝑐ℎ𝑜𝑠𝑒 𝑣𝑖𝑜𝑙𝑒𝑡 💜, 𝑦𝑜𝑢 𝑤𝑜𝑛 𝑎𝑛𝑑 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 +1500000$\n𝑌𝑜𝑢𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑚𝑜𝑛𝑒𝑦: ${moneyUser + 1500000}$`);
        } else if (colorCode === 5 && resultColor === '🖤️') {
            await usersData.set(senderID, { money: moneyUser + 100000 });
            message.reply(`𝑌𝑜𝑢 𝑐ℎ𝑜𝑠𝑒 𝑏𝑙𝑎𝑐𝑘 🖤️, 𝑦𝑜𝑢 𝑤𝑜𝑛 𝑎𝑛𝑑 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 +100000$\n𝑌𝑜𝑢𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑚𝑜𝑛𝑒𝑦: ${moneyUser + 100000}$`);
        } else {
            await usersData.set(senderID, { money: moneyUser - 100000 });
            message.reply(`𝐶𝑜𝑙𝑜𝑟 ${resultColor}\n𝑌𝑜𝑢 𝑙𝑜𝑠𝑡 𝑎𝑛𝑑 𝑙𝑜𝑠𝑡 100000$\n𝑌𝑜𝑢𝑟 𝑟𝑒𝑚𝑎𝑖𝑛𝑖𝑛𝑔 𝑚𝑜𝑛𝑒𝑦: ${moneyUser - 100000}$`);
        }
    } catch (error) {
        console.error("𝐶𝑜𝑙𝑜𝑟 𝐺𝑎𝑚𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
    }
};
