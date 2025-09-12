const axios = require("axios");

module.exports.config = {
    name: "cmdstore",
    aliases: ["cmds", "commands"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "system",
    shortDescription: {
        en: "𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑆𝑡𝑜𝑟𝑒 𝑜𝑓 𝐷𝑖𝑝𝑡𝑜 - 𝐵𝑟𝑜𝑤𝑠𝑒 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠"
    },
    longDescription: {
        en: "𝐵𝑟𝑜𝑤𝑠𝑒 𝑎𝑛𝑑 𝑠𝑒𝑎𝑟𝑐ℎ 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑖𝑛 𝑡ℎ𝑒 𝑠𝑡𝑜𝑟𝑒"
    },
    guide: {
        en: "{p}cmdstore [𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑛𝑎𝑚𝑒 | 𝑠𝑖𝑛𝑔𝑙𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 | 𝑝𝑎𝑔𝑒 𝑛𝑢𝑚𝑏𝑒𝑟]"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    const availableCmdsUrl = "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/availableCmds.json";
    const cmdUrlsJson = "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/cmdUrls.json";
    const ITEMS_PER_PAGE = 10;

    const query = args.join(" ").trim().toLowerCase();
    
    try {
        const response = await axios.get(availableCmdsUrl);
        let cmds = response.data.cmdName;
        let finalArray = cmds;
        let page = 1;

        if (query) {
            if (!isNaN(query)) {
                page = parseInt(query);
            } else if (query.length === 1) {
                finalArray = cmds.filter(cmd => cmd.cmd.toLowerCase().startsWith(query));
                if (finalArray.length === 0) {
                    return message.reply(`❌ 𝑁𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑓𝑜𝑢𝑛𝑑 𝑠𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑤𝑖𝑡ℎ "${query}"`);
                }
            } else {
                finalArray = cmds.filter(cmd => cmd.cmd.toLowerCase().includes(query));
                if (finalArray.length === 0) {
                    return message.reply(`❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 "${query}" 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑`);
                }
            }
        }

        const totalPages = Math.ceil(finalArray.length / ITEMS_PER_PAGE);
        if (page < 1 || page > totalPages) {
            return message.reply(
                `📄 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑎𝑔𝑒 𝑛𝑢𝑚𝑏𝑒𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1 𝑎𝑛𝑑 ${totalPages}.`
            );
        }

        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const cmdsToShow = finalArray.slice(startIndex, endIndex);
        
        let msg = `╔═════〖 📦 𝐶𝑀𝐷 𝑆𝑇𝑂𝑅𝐸 〗═════╗\n`;
        msg += `📑 𝑃𝑎𝑔𝑒: ${page}/${totalPages}\n`;
        msg += `📊 𝑇𝑜𝑡𝑎𝑙: ${finalArray.length} 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠\n`;
        msg += `╟─────────────────────────╢\n`;

        cmdsToShow.forEach((cmd, index) => {
            msg += `🔹 ${startIndex + index + 1}. ${cmd.cmd}\n`;
            msg += `👤 𝐴𝑢𝑡ℎ𝑜𝑟: ${cmd.author}\n`;
            msg += `🔄 𝑈𝑝𝑑𝑎𝑡𝑒: ${cmd.update || '𝑁/𝐴'}\n`;
            msg += `╰─────────────────────────╯\n`;
        });

        if (page < totalPages) {
            msg += `\n📩 𝑇𝑦𝑝𝑒 "${this.config.name} ${page + 1}" 𝑓𝑜𝑟 𝑛𝑒𝑥𝑡 𝑝𝑎𝑔𝑒`;
        }

        message.reply(msg, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                cmdName: finalArray,
                page: page
            });
        });
    } catch (error) {
        message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠");
        console.error(error);
    }
};

module.exports.onReply = async function({ event, message, handleReply }) {
    if (handleReply.author !== event.senderID) {
        return message.reply("🚫 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑛𝑜𝑡 𝑎𝑙𝑙𝑜𝑤𝑒𝑑 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
    }

    const { cmdName, page } = handleReply;
    const reply = parseInt(event.body);
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;

    if (isNaN(reply) || reply < startIndex + 1 || reply > endIndex) {
        return message.reply(
            `❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 ${startIndex + 1} 𝑎𝑛𝑑 ${Math.min(endIndex, cmdName.length)}`
        );
    }

    try {
        const cmdNameSelected = cmdName[reply - 1].cmd;
        const { status } = cmdName[reply - 1];
        const response = await axios.get(cmdUrlsJson);
        const selectedCmdUrl = response.data[cmdNameSelected];

        if (!selectedCmdUrl) {
            return message.reply("❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑅𝐿 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }

        message.unsend(handleReply.messageID);
        
        const msg = 
            `╔═════〖 🔍 𝐶𝑂𝑀𝑀𝐴𝑁𝐷 𝐼𝑁𝐹𝑂 〗════╗\n` +
            `📛 𝐶𝑜𝑚𝑚𝑎𝑛𝑑: ${cmdNameSelected}\n` +
            `📊 𝑆𝑡𝑎𝑡𝑢𝑠: ${status || '𝑁/𝐴'}\n` +
            `🔗 𝑈𝑅𝐿: ${selectedCmdUrl}\n` +
            `╚══════════════════════════════╝`;
        
        message.reply(msg);
    } catch (error) {
        message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛");
        console.error(error);
    }
};
