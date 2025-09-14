module.exports.config = {
    name: "log",
    aliases: ["settings", "systemlog"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 0,
    category: "system",
    shortDescription: {
        en: "𝑆𝑦𝑠𝑡𝑒𝑚 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 𝑣𝑖𝑒𝑤𝑒𝑟"
    },
    longDescription: {
        en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑠𝑦𝑠𝑡𝑒𝑚 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 𝑎𝑛𝑑 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛"
    },
    guide: {
        en: "{p}log"
    },
    dependencies: {}
};

module.exports.onStart = async function({ message, event, threadsData }) {
    const { threadID, messageID } = event;

    try {
        // Use the threadsData parameter directly (Mirai/TBot standard)
        const dataThread = await threadsData.get(threadID);
        const data = (dataThread && dataThread.data) ? dataThread.data : {};

        // Default settings
        const settingsRaw = {
            log: data.log ?? 'true',
            rankup: data.rankup ?? 'false',
            resend: data.resend ?? 'false',
            tagadmin: data.tagadmin ?? 'true',
            guard: data.guard ?? 'true',
            antiout: data.antiout ?? 'true'
        };

        // Convert to friendly status text
        const toStatus = (v) => {
            if (v === true || v === 'true' || String(v).toLowerCase() === 'true') return '✅ 𝐸𝑛𝑎𝑏𝑙𝑒𝑑';
            if (v === false || v === 'false' || String(v).toLowerCase() === 'false') return '❌ 𝐷𝑖𝑠𝑎𝑏𝑙𝑒𝑑';
            return String(v);
        };

        const messageText = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃   🧾  𝑆𝑌𝑆𝑇𝐸𝑀 𝐿𝑂𝐺𝑆   ┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭───────────────────────
│ 📝 𝐿𝑜𝑔: ${toStatus(settingsRaw.log)}
│ ⬆️ 𝑅𝑎𝑛𝑘𝑢𝑝: ${toStatus(settingsRaw.rankup)}
│ 🔁 𝑅𝑒𝑠𝑒𝑛𝑑: ${toStatus(settingsRaw.resend)}
│ 👨‍💼 𝑇𝑎𝑔 𝐴𝑑𝑚𝑖𝑛: ${toStatus(settingsRaw.tagadmin)}
│ 🛡️ 𝐴𝑛𝑡𝑖𝑟𝑜𝑏𝑏𝑒𝑟𝑦: ${toStatus(settingsRaw.guard)}
│ 🚪 𝐴𝑛𝑡𝑖𝑜𝑢𝑡: ${toStatus(settingsRaw.antiout)}
╰───────────────────────

© 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
        `.trim();

        await message.reply(messageText);

    } catch (error) {
        console.error('𝐿𝑜𝑔 𝑒𝑟𝑟𝑜𝑟:', error);
        await message.reply(
            '⚠️ 𝐿𝑜𝑔 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 𝑐𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑏𝑒 𝑑𝑖𝑠𝑝𝑙𝑎𝑦𝑒𝑑',
            threadID,
            messageID
        );
    }
};
