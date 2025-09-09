const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "nsfw",
    aliases: ["ns"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    category: "admin",
    role: 2,
    shortDescription: {
        en: "𝑁𝑆𝐹𝑊 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡 𝑓𝑜𝑟 𝑡ℎ𝑟𝑒𝑎𝑑𝑠"
    },
    longDescription: {
        en: "𝐴𝑝𝑝𝑟𝑜𝑣𝑒, 𝑟𝑒𝑚𝑜𝑣𝑒, 𝑜𝑟 𝑐ℎ𝑒𝑐𝑘 𝑁𝑆𝐹𝑊 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠 𝑓𝑜𝑟 𝑡ℎ𝑟𝑒𝑎𝑑𝑠"
    },
    guide: {
        en: "{p}nsfw 𝑎𝑝𝑝𝑟𝑜𝑣𝑒/𝑟𝑒𝑚𝑜𝑣𝑒/𝑑𝑖𝑠𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑/𝑐ℎ𝑒𝑐𝑘 [𝑡ℎ𝑟𝑒𝑎𝑑𝐼𝐷] [𝑟𝑒𝑎𝑠𝑜𝑛/𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ api, args, message, event }) {
    try {
        const { getPrefix } = global.utils;
        const p = getPrefix(event.threadID);
        const threadID = event.threadID;
        const approvedIDsPath = path.join(__dirname, "assist_json", "approved_ids.json");
        const pendingIDsPath = path.join(__dirname, "assist_json", "pending_ids.json");

        // 𝐸𝑛𝑠𝑢𝑟𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑖𝑒𝑠 𝑒𝑥𝑖𝑠𝑡
        if (!fs.existsSync(path.dirname(approvedIDsPath))) {
            fs.mkdirSync(path.dirname(approvedIDsPath), { recursive: true });
        }
        if (!fs.existsSync(approvedIDsPath)) {
            fs.writeFileSync(approvedIDsPath, JSON.stringify([]));
        }
        if (!fs.existsSync(pendingIDsPath)) {
            fs.writeFileSync(pendingIDsPath, JSON.stringify([]));
        }

        if (args[0] === "approve" && args[1]) {
            const id = args[1];
            const messageFromAdmin = args.slice(2).join(" ");

            let approvedIDs = JSON.parse(fs.readFileSync(approvedIDsPath));
            if (approvedIDs.includes(id)) {
                await message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n𝑇ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑 𝐼𝐷 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑\n\n╚════ஜ۩۞۩ஜ═══╝");
            } else {
                approvedIDs.push(id);
                fs.writeFileSync(approvedIDsPath, JSON.stringify(approvedIDs));
                api.sendMessage(`╔════ஜ۩۞۩ஜ═══╗\n\n📌 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝐴𝑐𝑐𝑒𝑝𝑡𝑒𝑑📌\n𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑 𝑏𝑦 𝐵𝑜𝑡𝐴𝑑𝑚𝑖𝑛\n𝑁𝑜𝑤 𝑎𝑙𝑙 𝑁𝑆𝐹𝑊 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑤𝑖𝑙𝑙 𝑤𝑜𝑟𝑘 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑.\n\n𝑀𝑒𝑠𝑠𝑎𝑔𝑒 𝑓𝑟𝑜𝑚 𝑎𝑑𝑚𝑖𝑛: ${messageFromAdmin}\n\n╚════ஜ۩۞۩ஜ═══╝`, id);
                await message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n𝑇ℎ𝑖𝑠 𝑇ℎ𝑟𝑒𝑎𝑑 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑 𝑛𝑜𝑤 𝑡𝑜 𝑢𝑠𝑒 𝑁𝑆𝐹𝑊 𝑐𝑜𝑚𝑚𝑎𝑛𝑑\n\n𝐼𝑓 𝑦𝑜𝑢 𝑑𝑜𝑛'𝑡 𝑘𝑛𝑜𝑤 ℎ𝑜𝑤 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑏𝑜𝑡 𝑡ℎ𝑒𝑛 𝑗𝑜𝑖𝑛 𝑡ℎ𝑒 𝑠𝑢𝑝𝑝𝑜𝑟𝑡 𝐵𝑜𝑥 \n𝑇𝑦𝑝𝑒 : ${p}𝑠𝑢𝑝𝑝𝑜𝑟𝑡\nto join.\n\n╚════ஜ۩۞۩ஜ═══╝`);

                // 𝑅𝑒𝑚𝑜𝑣𝑒 𝑓𝑟𝑜𝑚 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝐼𝐷𝑠 𝑙𝑖𝑠𝑡
                let pendingIDs = JSON.parse(fs.readFileSync(pendingIDsPath));
                if (pendingIDs.includes(id)) {
                    pendingIDs.splice(pendingIDs.indexOf(id), 1);
                    fs.writeFileSync(pendingIDsPath, JSON.stringify(pendingIDs));
                }
            }
        } else if (args[0] === "remove" && args[1]) {
            const id = args[1];
            const reason = args.slice(2).join(" ");

            let approvedIDs = JSON.parse(fs.readFileSync(approvedIDsPath));
            if (!approvedIDs.includes(id)) {
                await message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑 𝑖𝑑 𝑖𝑠 𝑛𝑜𝑡 𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑, 𝑠𝑜 𝑛𝑜 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 \n\n╚════ஜ۩۞۩ஜ═══╝");
            } else {
                approvedIDs.splice(approvedIDs.indexOf(id), 1);
                fs.writeFileSync(approvedIDsPath, JSON.stringify(approvedIDs));
                api.sendMessage(`╔════ஜ۩۞۩ஜ═══╗\n\n⚠️𝑊𝑎𝑟𝑛𝑖𝑛𝑔 ⚠️\n𝑁𝑜𝑤 𝑡ℎ𝑖𝑠 𝑇ℎ𝑟𝑒𝑎𝑑 𝐼𝐷'𝑠 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑑𝑖𝑠𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑 𝑜𝑟 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑡𝑜 𝑢𝑠𝑒 𝑁𝑆𝐹𝑊 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑏𝑦 𝐵𝑜𝑡𝐴𝑑𝑚𝑖𝑛.\n\n𝑅𝑒𝑎𝑠𝑜𝑛: ${reason}\n𝐶𝑜𝑛𝑡𝑎𝑐𝑡: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 𝑓𝑜𝑟 𝑚𝑜𝑟𝑒 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛.\n𝐹𝐵: https://www.facebook.com/share/15yVioQQyq/\n\n╚════ஜ۩۞۩ஜ═══╝`, id);
                await message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n𝑇ℎ𝑒 𝑡ℎ𝑟𝑒𝑎𝑑 𝐼𝐷 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝑢𝑠𝑖𝑛𝑔 𝑁𝑆𝐹𝑊 𝑐𝑜𝑚𝑚𝑎𝑛𝑑\n\n╚════ஜ۩۞۩ஜ═══╝");
            }
        } else if (args[0] === "disapproved" && args[1] && args[2]) {
            const id = args[1];
            const reason = args.slice(2).join(" ");

            let pendingIDs = JSON.parse(fs.readFileSync(pendingIDsPath));
            if (!pendingIDs.includes(id)) {
                await message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n𝑇ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑 𝐼𝐷 𝑖𝑠 𝑛𝑜𝑡 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝑎𝑝𝑝𝑟𝑜𝑣𝑎𝑙.\n\n╚════ஜ۩۞۩ஜ═══╝");
            } else {
                // 𝑅𝑒𝑚𝑜𝑣𝑒 𝑓𝑟𝑜𝑚 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝐼𝐷𝑠 𝑙𝑖𝑠𝑡
                pendingIDs.splice(pendingIDs.indexOf(id), 1);
                fs.writeFileSync(pendingIDsPath, JSON.stringify(pendingIDs));
                api.sendMessage(`╔════ஜ۩۞۩ஜ═══╗\n\n⚠️ 𝑊𝑎𝑟𝑛𝑖𝑛𝑔 ⚠️\n𝑌𝑜𝑢𝑟 𝑡ℎ𝑟𝑒𝑎𝑑 𝐼𝐷'𝑠 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑢𝑠𝑒 𝑁𝑆𝐹𝑊 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑑𝑖𝑠𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑 𝑏𝑦 𝐵𝑜𝑡𝐴𝑑𝑚𝑖𝑛.\n\n𝑅𝑒𝑎𝑠𝑜𝑛: ${reason}\n𝐶𝑜𝑛𝑡𝑎𝑐𝑡: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 𝑓𝑜𝑟 𝑚𝑜𝑟𝑒 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛.\n𝐹𝐵: https://www.facebook.com/share/15yVioQQyq/\n\n𝑗𝑜𝑖𝑛 𝑡ℎ𝑒 𝑠𝑢𝑝𝑝𝑜𝑟𝑡 𝐵𝑜𝑥 𝑓𝑜𝑟 𝑓𝑎𝑠𝑡 𝑟𝑒𝑝𝑙𝑦\n𝑇𝑦𝑝𝑒 : ${p}𝑠𝑢𝑝𝑝𝑜𝑟𝑡 \nto join.\n\n╚════ஜ۩۞۩ஜ═══╝`, id);
                await message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n𝑇ℎ𝑒 𝑡ℎ𝑟𝑒𝑎𝑑 𝐼𝐷 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑑𝑖𝑠𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑 𝑓𝑜𝑟 𝑢𝑠𝑖𝑛𝑔 𝑁𝑆𝐹𝑊 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠.\n\n╚════ஜ۩۞۩ஜ═══╝");
            }
        } else if (args[0] === "check") {
            let approvedIDs = JSON.parse(fs.readFileSync(approvedIDsPath));
            if (approvedIDs.includes(threadID)) {
                await message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n𝑁𝑆𝐹𝑊 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑜𝑛 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑.\n\n╚════ஜ۩۞۩ஜ═══╝");
            } else {
                await message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n𝑁𝑆𝐹𝑊 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑜𝑓𝑓 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑.\n\n╚════ஜ۩۞۩ஜ═══╝");
            }
        } else {
            await message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑢𝑠𝑎𝑔𝑒. 𝑈𝑠𝑒 "${p}ℎ𝑒𝑙𝑝 𝑛𝑠𝑓𝑤" 𝑡𝑜 𝑠𝑒𝑒 ℎ𝑜𝑤 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.\n\n╚════ஜ۩۞۩ஜ═══╝`);
        }
    } catch (error) {
        console.error("𝑁𝑆𝐹𝑊 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.");
    }
};
