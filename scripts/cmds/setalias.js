const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "setalias",
        aliases: ["alias", "customcmd"],
        version: "3.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑐𝑜𝑛𝑓𝑖𝑔",
        shortDescription: {
            en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑎𝑙𝑖𝑎𝑠𝑒𝑠 𝑖𝑛 𝑔𝑟𝑜𝑢𝑝 𝑜𝑟 𝑔𝑙𝑜𝑏𝑎𝑙𝑙𝑦"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎𝑛𝑑 𝑚𝑎𝑛𝑎𝑔𝑒 𝑐𝑢𝑠𝑡𝑜𝑚 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑎𝑙𝑖𝑎𝑠𝑒𝑠 𝑓𝑜𝑟 𝑏𝑜𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠"
        },
        guide: {
            en: `🔹 𝐴𝑑𝑑 𝑔𝑟𝑜𝑢𝑝 𝑎𝑙𝑖𝑎𝑠: {p} 𝑎𝑑𝑑 <𝑎𝑙𝑖𝑎𝑠> <𝑐𝑜𝑚𝑚𝑎𝑛𝑑>
🔹 𝐴𝑑𝑑 𝑔𝑙𝑜𝑏𝑎𝑙 𝑎𝑙𝑖𝑎𝑠 (𝑎𝑑𝑚𝑖𝑛 𝑜𝑛𝑙𝑦): {p} 𝑎𝑑𝑑 <𝑎𝑙𝑖𝑎𝑠> <𝑐𝑜𝑚𝑚𝑎𝑛𝑑> -𝑔
🔹 𝑅𝑒𝑚𝑜𝑣𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑙𝑖𝑎𝑠: {p} 𝑟𝑒𝑚𝑜𝑣𝑒 <𝑎𝑙𝑖𝑎𝑠> <𝑐𝑜𝑚𝑚𝑎𝑛𝑑>
🔹 𝑅𝑒𝑚𝑜𝑣𝑒 𝑔𝑙𝑜𝑏𝑎𝑙 𝑎𝑙𝑖𝑎𝑠 (𝑎𝑑𝑚𝑖𝑛 𝑜𝑛𝑙𝑦): {p} 𝑟𝑒𝑚𝑜𝑣𝑒 <𝑎𝑙𝑖𝑎𝑠> <𝑐𝑜𝑚𝑚𝑎𝑛𝑑> -𝑔
🔹 𝐿𝑖𝑠𝑡 𝑔𝑟𝑜𝑢𝑝 𝑎𝑙𝑖𝑎𝑠𝑒𝑠: {p} 𝑙𝑖𝑠𝑡
🔹 𝐿𝑖𝑠𝑡 𝑔𝑙𝑜𝑏𝑎𝑙 𝑎𝑙𝑖𝑎𝑠𝑒𝑠: {p} 𝑙𝑖𝑠𝑡 -𝑔
🔹 𝐼𝑛𝑓𝑜 𝑎𝑏𝑜𝑢𝑡 𝑎𝑙𝑖𝑎𝑠: {p} 𝑖𝑛𝑓𝑜 <𝑎𝑙𝑖𝑎𝑠>
🔹 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p} 𝑎𝑑𝑑 𝑐𝑡𝑟𝑘 𝑐𝑢𝑠𝑡𝑜𝑚𝑟𝑎𝑛𝑘𝑐𝑎𝑟𝑑`
        },
        dependencies: {
            "fs-extra": "",
            "moment-timezone": ""
        }
    },

    onStart: async function({ message, event, args, usersData, threadsData, globalData }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
                require("moment-timezone");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑎𝑛𝑑 𝑚𝑜𝑚𝑒𝑛𝑡-𝑡𝑖𝑚𝑒𝑧𝑜𝑛𝑒");
            }

            const { threadID, senderID } = event;
            const aliasesData = await threadsData.get(threadID, "data.aliases", {});
            const now = moment().tz("Asia/Dhaka").format("YYYY-MM-DD HH:mm:ss");

            if (!args[0]) {
                const guide = this.config.guide.en.replace(/{p}/g, this.config.name);
                return message.reply(`📝 [${now}] 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐺𝑢𝑖𝑑𝑒:\n${guide}`);
            }

            const command = args[0].toLowerCase();

            // Check admin permissions
            const threadInfo = await threadsData.get(threadID);
            const isAdmin = threadInfo.adminIDs.includes(senderID);
            const userInfo = await usersData.get(senderID);
            const isBotAdmin = userInfo.role > 0;

            if (command === "add") {
                if (args.length < 3) {
                    return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑦𝑛𝑡𝑎𝑥! 𝑈𝑠𝑒: 𝑎𝑑𝑑 <𝑎𝑙𝑖𝑎𝑠> <𝑐𝑜𝑚𝑚𝑎𝑛𝑑>");
                }

                const alias = args[1].toLowerCase();
                const targetCommand = args[2].toLowerCase();
                const isGlobal = args.includes("-g");

                if (!global.GoatBot.commands.has(targetCommand)) {
                    return message.reply(`❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 "${targetCommand}" 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡`);
                }

                if (isGlobal) {
                    if (!isBotAdmin) {
                        return message.reply("❌ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑎𝑑𝑑 𝑔𝑙𝑜𝑏𝑎𝑙 𝑎𝑙𝑖𝑎𝑠𝑒𝑠");
                    }

                    const globalAliases = await globalData.get("setalias", "data", []);
                    const existing = globalAliases.find(a => a.aliases.includes(alias));
                    if (existing) {
                        return message.reply(`❌ 𝐴𝑙𝑖𝑎𝑠 "${alias}" 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑥𝑖𝑠𝑡𝑠 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${existing.commandName}"`);
                    }
                    if (global.GoatBot.commands.has(alias)) {
                        return message.reply(`❌ 𝐴𝑙𝑖𝑎𝑠 "${alias}" 𝑐𝑜𝑛𝑓𝑙𝑖𝑐𝑡𝑠 𝑤𝑖𝑡ℎ 𝑎𝑛 𝑒𝑥𝑖𝑠𝑡𝑖𝑛𝑔 𝑐𝑜𝑚𝑚𝑎𝑛𝑑`);
                    }

                    const cmdEntry = globalAliases.find(a => a.commandName === targetCommand) || { commandName: targetCommand, aliases: [] };
                    if (!cmdEntry.aliases.includes(alias)) cmdEntry.aliases.push(alias);
                    if (!globalAliases.some(a => a.commandName === targetCommand)) globalAliases.push(cmdEntry);

                    await globalData.set("setalias", globalAliases, "data");
                    global.GoatBot.aliases.set(alias, targetCommand);

                    return message.reply(`✅ [${now}] 𝐴𝑑𝑑𝑒𝑑 𝐺𝐿𝑂𝐵𝐴𝐿 𝑎𝑙𝑖𝑎𝑠 "${alias}" ➔ 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${targetCommand}"`);
                }

                if (global.GoatBot.commands.has(alias)) {
                    return message.reply(`❌ 𝐴𝑙𝑖𝑎𝑠 "${alias}" 𝑐𝑜𝑛𝑓𝑙𝑖𝑐𝑡𝑠 𝑤𝑖𝑡ℎ 𝑎𝑛 𝑒𝑥𝑖𝑠𝑡𝑖𝑛𝑔 𝑐𝑜𝑚𝑚𝑎𝑛𝑑`);
                }
                if (global.GoatBot.aliases.has(alias)) {
                    return message.reply(`❌ 𝐴𝑙𝑖𝑎𝑠 "${alias}" 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑥𝑖𝑠𝑡𝑠 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${global.GoatBot.aliases.get(alias)}"`);
                }

                for (const cmd in aliasesData) {
                    if (aliasesData[cmd].includes(alias)) {
                        return message.reply(`❌ 𝐴𝑙𝑖𝑎𝑠 "${alias}" 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑥𝑖𝑠𝑡𝑠 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${cmd}" 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝`);
                    }
                }

                aliasesData[targetCommand] = aliasesData[targetCommand] || [];
                if (!aliasesData[targetCommand].includes(alias)) aliasesData[targetCommand].push(alias);
                await threadsData.set(threadID, aliasesData, "data.aliases");

                return message.reply(`✨ [${now}] 𝐴𝑑𝑑𝑒𝑑 𝐺𝑅𝑂𝑈𝑃 𝑎𝑙𝑖𝑎𝑠 "${alias}" ➔ 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${targetCommand}"`);
            }

            if (command === "remove" || command === "rm") {
                if (args.length < 3) {
                    return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑦𝑛𝑡𝑎𝑥! 𝑈𝑠𝑒: 𝑟𝑒𝑚𝑜𝑣𝑒 <𝑎𝑙𝑖𝑎𝑠> <𝑐𝑜𝑚𝑚𝑎𝑛𝑑>");
                }

                const alias = args[1].toLowerCase();
                const targetCommand = args[2].toLowerCase();
                const isGlobal = args.includes("-g");

                if (!global.GoatBot.commands.has(targetCommand)) {
                    return message.reply(`❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 "${targetCommand}" 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡`);
                }

                if (isGlobal) {
                    if (!isBotAdmin) {
                        return message.reply("❌ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 𝑔𝑙𝑜𝑏𝑎𝑙 𝑎𝑙𝑖𝑎𝑠𝑒𝑠");
                    }

                    const globalAliases = await globalData.get("setalias", "data", []);
                    const cmdEntry = globalAliases.find(a => a.commandName === targetCommand);
                    if (!cmdEntry || !cmdEntry.aliases.includes(alias)) {
                        return message.reply(`❌ 𝐴𝑙𝑖𝑎𝑠 "${alias}" 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${targetCommand}"`);
                    }

                    cmdEntry.aliases = cmdEntry.aliases.filter(a => a !== alias);
                    if (!cmdEntry.aliases.length) globalAliases.splice(globalAliases.indexOf(cmdEntry), 1);
                    await globalData.set("setalias", globalAliases, "data");
                    global.GoatBot.aliases.delete(alias);

                    return message.reply(`🗑️ [${now}] 𝑅𝑒𝑚𝑜𝑣𝑒𝑑 𝐺𝐿𝑂𝐵𝐴𝐿 𝑎𝑙𝑖𝑎𝑠 "${alias}" 𝑓𝑟𝑜𝑚 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${targetCommand}"`);
                }

                if (!aliasesData[targetCommand]) {
                    return message.reply(`❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 "${targetCommand}" ℎ𝑎𝑠 𝑛𝑜 𝑎𝑙𝑖𝑎𝑠𝑒𝑠 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝`);
                }
                if (!aliasesData[targetCommand].includes(alias)) {
                    return message.reply(`❌ 𝐴𝑙𝑖𝑎𝑠 "${alias}" 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${targetCommand}"`);
                }

                aliasesData[targetCommand] = aliasesData[targetCommand].filter(a => a !== alias);
                if (!aliasesData[targetCommand].length) delete aliasesData[targetCommand];
                await threadsData.set(threadID, aliasesData, "data.aliases");

                return message.reply(`🗑️ [${now}] 𝑅𝑒𝑚𝑜𝑣𝑒𝑑 𝐺𝑅𝑂𝑈𝑃 𝑎𝑙𝑖𝑎𝑠 "${alias}" 𝑓𝑟𝑜𝑚 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${targetCommand}"`);
            }

            if (command === "list") {
                const isGlobal = args.includes("-g");

                if (isGlobal) {
                    const globalAliases = await globalData.get("setalias", "data", []);
                    if (!globalAliases.length) {
                        return message.reply("ℹ️ 𝑁𝑜 𝑔𝑙𝑜𝑏𝑎𝑙 𝑎𝑙𝑖𝑎𝑠𝑒𝑠 𝑒𝑥𝑖𝑠𝑡");
                    }
                    const list = globalAliases.map(cmd => `🔹 ${cmd.commandName}: ${cmd.aliases.join(', ') || '𝑁𝑜𝑛𝑒'}`).join('\n');
                    return message.reply(`📜 [${now}] 𝐺𝑙𝑜𝑏𝑎𝑙 𝐴𝑙𝑖𝑎𝑠𝑒𝑠:\n${list}`);
                }

                if (!Object.keys(aliasesData).length) {
                    return message.reply("ℹ️ 𝑁𝑜 𝑔𝑟𝑜𝑢𝑝 𝑎𝑙𝑖𝑎𝑠𝑒𝑠 𝑒𝑥𝑖𝑠𝑡");
                }
                const list = Object.entries(aliasesData).map(([cmd, aliases]) => `🔹 ${cmd}: ${aliases.join(', ') || '𝑁𝑜𝑛𝑒'}`).join('\n');
                return message.reply(`📜 [${now}] 𝐺𝑟𝑜𝑢𝑝 𝐴𝑙𝑖𝑎𝑠𝑒𝑠:\n${list}`);
            }

            if (command === "info") {
                const alias = args[1]?.toLowerCase();
                if (!alias) {
                    return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑦𝑛𝑡𝑎𝑥! 𝑈𝑠𝑒: 𝑖𝑛𝑓𝑜 <𝑎𝑙𝑖𝑎𝑠>");
                }

                const globalAliases = await globalData.get("setalias", "data", []);
                let found = globalAliases.find(a => a.aliases.includes(alias));
                let isGlobal = true;
                let groupId = "𝑁/𝐴";

                if (!found) {
                    for (const cmd in aliasesData) {
                        if (aliasesData[cmd].includes(alias)) {
                            found = { commandName: cmd };
                            isGlobal = false;
                            groupId = threadID;
                            break;
                        }
                    }
                }

                if (!found) {
                    return message.reply(`❌ [${now}] 𝐴𝑙𝑖𝑎𝑠 "${alias}" 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑`);
                }
                return message.reply(`ℹ️ [${now}] 𝐴𝑙𝑖𝑎𝑠 "${alias}" 𝑖𝑠 𝑚𝑎𝑝𝑝𝑒𝑑 𝑡𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${found.commandName}"\n𝐺𝑙𝑜𝑏𝑎𝑙: ${isGlobal ? "𝑌𝑒𝑠" : "𝑁𝑜"}\n𝐺𝑟𝑜𝑢𝑝 𝐼𝐷: ${groupId}`);
            }

            const guide = this.config.guide.en.replace(/{p}/g, this.config.name);
            return message.reply(`📝 [${now}] 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐺𝑢𝑖𝑑𝑒:\n${guide}`);

        } catch (error) {
            console.error("𝑆𝑒𝑡𝑎𝑙𝑖𝑎𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
