const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "setalias",
    version: "3.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    description: {
        en: "𝑀𝒂𝒏𝒂𝒈𝒆 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒂𝒍𝒊𝒂𝒔𝒆𝒔 𝒊𝒏 𝒈𝒓𝒐𝒖𝒑 𝒐𝒓 𝒈𝒍𝒐𝒃𝒂𝒍𝒍𝒚"
    },
    category: "𝒄𝒐𝒏𝒇𝒊𝒈",
    guide: {
        en: `🔹 𝑨𝒅𝒅 𝒈𝒓𝒐𝒖𝒑 𝒂𝒍𝒊𝒂𝒔: {pn} 𝒂𝒅𝒅 <𝒂𝒍𝒊𝒂𝒔> <𝒄𝒐𝒎𝒎𝒂𝒏𝒅>
🔹 𝑨𝒅𝒅 𝒈𝒍𝒐𝒃𝒂𝒍 𝒂𝒍𝒊𝒂𝒔 (𝒂𝒅𝒎𝒊𝒏 𝒐𝒏𝒍𝒚): {pn} 𝒂𝒅𝒅 <𝒂𝒍𝒊𝒂𝒔> <𝒄𝒐𝒎𝒎𝒂𝒏𝒅> -𝒈
🔹 𝑹𝒆𝒎𝒐𝒗𝒆 𝒈𝒓𝒐𝒖𝒑 𝒂𝒍𝒊𝒂𝒔: {pn} 𝒓𝒆𝒎𝒐𝒗𝒆 <𝒂𝒍𝒊𝒂𝒔> <𝒄𝒐𝒎𝒎𝒂𝒏𝒅>
🔹 𝑹𝒆𝒎𝒐𝒗𝒆 𝒈𝒍𝒐𝒃𝒂𝒍 𝒂𝒍𝒊𝒂𝒔 (𝒂𝒅𝒎𝒊𝒏 𝒐𝒏𝒍𝒚): {pn} 𝒓𝒆𝒎𝒐𝒗𝒆 <𝒂𝒍𝒊𝒂𝒔> <𝒄𝒐𝒎𝒎𝒂𝒏𝒅> -𝒈
🔹 𝑳𝒊𝒔𝒕 𝒈𝒓𝒐𝒖𝒑 𝒂𝒍𝒊𝒂𝒔𝒆𝒔: {pn} 𝒍𝒊𝒔𝒕
🔹 𝑳𝒊𝒔𝒕 𝒈𝒍𝒐𝒃𝒂𝒍 𝒂𝒍𝒊𝒂𝒔𝒆𝒔: {pn} 𝒍𝒊𝒔𝒕 -𝒈
🔹 𝑰𝒏𝒇𝒐 𝒂𝒃𝒐𝒖𝒕 𝒂𝒍𝒊𝒂𝒔: {pn} 𝒊𝒏𝒇𝒐 <𝒂𝒍𝒊𝒂𝒔>
🔹 𝑬𝒙𝒂𝒎𝒑𝒍𝒆: {pn} 𝒂𝒅𝒅 𝒄𝒕𝒓𝒌 𝒄𝒖𝒔𝒕𝒐𝒎𝒓𝒂𝒏𝒌𝒄𝒂𝒓𝒅`
    }
};

module.exports.languages = {
    en: {
        commandNotExist: "❌ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 \"%1\" 𝒅𝒐𝒆𝒔 𝒏𝒐𝒕 𝒆𝒙𝒊𝒔𝒕",
        aliasExist: "❌ 𝑨𝒍𝒊𝒂𝒔 \"%1\" 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒆𝒙𝒊𝒔𝒕𝒔 𝒇𝒐𝒓 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 \"%2\"",
        aliasIsCommand: "❌ 𝑨𝒍𝒊𝒂𝒔 \"%1\" 𝒄𝒐𝒏𝒇𝒍𝒊𝒄𝒕𝒔 𝒘𝒊𝒕𝒉 𝒂𝒏 𝒆𝒙𝒊𝒔𝒕𝒊𝒏𝒈 𝒄𝒐𝒎𝒎𝒂𝒏𝒅",
        addAliasSuccess: "✅ 𝑨𝒅𝒅𝒆𝒅 𝒈𝒍𝒐𝒃𝒂𝒍 𝒂𝒍𝒊𝒂𝒔 \"%1\" 𝒇𝒐𝒓 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 \"%2\"",
        addAliasToGroupSuccess: "✨ 𝑨𝒅𝒅𝒆𝒅 𝒈𝒓𝒐𝒖𝒑 𝒂𝒍𝒊𝒂𝒔 \"%1\" 𝒇𝒐𝒓 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 \"%2\"",
        removeAliasSuccess: "🗑️ 𝑹𝒆𝒎𝒐𝒗𝒆𝒅 𝒈𝒍𝒐𝒃𝒂𝒍 𝒂𝒍𝒊𝒂𝒔 \"%1\" 𝒇𝒐𝒓 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 \"%2\"",
        removeAliasInGroupSuccess: "🗑️ 𝑹𝒆𝒎𝒐𝒗𝒆𝒅 𝒈𝒓𝒐𝒖𝒑 𝒂𝒍𝒊𝒂𝒔 \"%1\" 𝒇𝒐𝒓 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 \"%2\"",
        noPermissionAdd: "❌ 𝒀𝒐𝒖 𝒅𝒐𝒏'𝒕 𝒉𝒂𝒗𝒆 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒕𝒐 𝒂𝒅𝒅 𝒈𝒍𝒐𝒃𝒂𝒍 𝒂𝒍𝒊𝒂𝒔𝒆𝒔",
        noPermissionDelete: "❌ 𝒀𝒐𝒖 𝒅𝒐𝒏'𝒕 𝒉𝒂𝒗𝒆 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒕𝒐 𝒓𝒆𝒎𝒐𝒗𝒆 𝒈𝒍𝒐𝒃𝒂𝒍 𝒂𝒍𝒊𝒂𝒔𝒆𝒔",
        noAliasInSystem: "ℹ️ 𝑵𝒐 𝒈𝒍𝒐𝒃𝒂𝒍 𝒂𝒍𝒊𝒂𝒔𝒆𝒔 𝒆𝒙𝒊𝒔𝒕",
        notExistAliasInGroup: "ℹ️ 𝑵𝒐 𝒈𝒓𝒐𝒖𝒑 𝒂𝒍𝒊𝒂𝒔𝒆𝒔 𝒆𝒙𝒊𝒔𝒕",
        noAliasInGroup: "❌ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 \"%1\" 𝒉𝒂𝒔 𝒏𝒐 𝒂𝒍𝒊𝒂𝒔𝒆𝒔 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑",
        aliasExistInGroup: "❌ 𝑨𝒍𝒊𝒂𝒔 \"%1\" 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒆𝒙𝒊𝒔𝒕𝒔 𝒇𝒐𝒓 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 \"%2\" 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑",
        aliasNotExist: "❌ 𝑨𝒍𝒊𝒂𝒔 \"%1\" 𝒅𝒐𝒆𝒔 𝒏𝒐𝒕 𝒆𝒙𝒊𝒔𝒕 𝒇𝒐𝒓 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 \"%2\"",
        aliasList: "📜 𝑮𝒍𝒐𝒃𝒂𝒍 𝒂𝒍𝒊𝒂𝒔𝒆𝒔:\n%1",
        aliasListInGroup: "📜 𝑮𝒓𝒐𝒖𝒑 𝒂𝒍𝒊𝒂𝒔𝒆𝒔:\n%1",
        aliasInfo: "ℹ️ 𝑨𝒍𝒊𝒂𝒔 \"%1\" 𝒊𝒔 𝒎𝒂𝒑𝒑𝒆𝒅 𝒕𝒐 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 \"%2\"\n𝑮𝒍𝒐𝒃𝒂𝒍: %3\n𝑮𝒓𝒐𝒖𝒑 𝑰𝑫: %4",
        invalidSyntax: "❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒔𝒚𝒏𝒕𝒂𝒙! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒇𝒐𝒍𝒍𝒐𝒘 𝒕𝒉𝒆 𝒈𝒖𝒊𝒅𝒆:\n%1"
    }
};

module.exports.onStart = async function () {};

module.exports.run = async function ({ api, event, args, threadsData, globalData, permssion, getLang }) {
    const { threadID, messageID, senderID } = event;
    const send = (msg) => api.sendMessage(msg, threadID, messageID);
    const aliasesData = await threadsData.get(threadID, "data.aliases", {});
    const now = moment().tz("Asia/Dhaka").format("YYYY-MM-DD HH:mm:ss");

    if (!args[0]) {
        const guide = this.config.guide.en.replace(/{pn}/g, this.config.name);
        return send(getLang("invalidSyntax", guide));
    }

    const command = args[0].toLowerCase();

    if (command === "add") {
        if (args.length < 3) return send(getLang("invalidSyntax", this.config.guide.en));

        const alias = args[1].toLowerCase();
        const targetCommand = args[2].toLowerCase();
        const isGlobal = args.includes("-g");

        if (!global.GoatBot.commands.has(targetCommand))
            return send(getLang("commandNotExist", targetCommand));

        if (isGlobal) {
            if (permssion < 2) return send(getLang("noPermissionAdd"));

            const globalAliases = await globalData.get("setalias", "data", []);
            const existing = globalAliases.find(a => a.aliases.includes(alias));
            if (existing) return send(getLang("aliasExist", alias, existing.commandName));
            if (global.GoatBot.commands.has(alias)) return send(getLang("aliasIsCommand", alias));

            const cmdEntry = globalAliases.find(a => a.commandName === targetCommand) || { commandName: targetCommand, aliases: [] };
            if (!cmdEntry.aliases.includes(alias)) cmdEntry.aliases.push(alias);
            if (!globalAliases.some(a => a.commandName === targetCommand)) globalAliases.push(cmdEntry);

            await globalData.set("setalias", globalAliases, "data");
            global.GoatBot.aliases.set(alias, targetCommand);

            return send(`✅ [${now}] 𝑨𝒅𝒅𝒆𝒅 𝑮𝑳𝑶𝑩𝑨𝑳 𝒂𝒍𝒊𝒂𝒔 \"${alias}\" ➔ 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 \"${targetCommand}\"\n𝑻𝒊𝒑: 𝑼𝒔𝒆 \"${this.config.name} 𝒍𝒊𝒔𝒕 -𝒈\" 𝒕𝒐 𝒗𝒊𝒆𝒘 𝒂𝒍𝒍 𝒈𝒍𝒐𝒃𝒂𝒍 𝒂𝒍𝒊𝒂𝒔𝒆𝒔.`);
        }

        if (global.GoatBot.commands.has(alias)) return send(getLang("aliasIsCommand", alias));
        if (global.GoatBot.aliases.has(alias)) return send(getLang("aliasExist", alias, global.GoatBot.aliases.get(alias)));
        for (const cmd in aliasesData) if (aliasesData[cmd].includes(alias)) return send(getLang("aliasExistInGroup", alias, cmd));

        aliasesData[targetCommand] = aliasesData[targetCommand] || [];
        if (!aliasesData[targetCommand].includes(alias)) aliasesData[targetCommand].push(alias);
        await threadsData.set(threadID, aliasesData, "data.aliases");

        return send(`✨ [${now}] 𝑨𝒅𝒅𝒆𝒅 𝑮𝑹𝑶𝑼𝑷 𝒂𝒍𝒊𝒂𝒔 \"${alias}\" ➔ 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 \"${targetCommand}\"\n𝑻𝒊𝒑: 𝑼𝒔𝒆 \"${this.config.name} 𝒍𝒊𝒔𝒕\" 𝒕𝒐 𝒔𝒆𝒆 𝒂𝒍𝒍 𝒈𝒓𝒐𝒖𝒑 𝒂𝒍𝒊𝒂𝒔𝒆𝒔.`);
    }

    if (command === "remove" || command === "rm") {
        if (args.length < 3) return send(getLang("invalidSyntax", this.config.guide.en));

        const alias = args[1].toLowerCase();
        const targetCommand = args[2].toLowerCase();
        const isGlobal = args.includes("-g");

        if (!global.GoatBot.commands.has(targetCommand))
            return send(getLang("commandNotExist", targetCommand));

        if (isGlobal) {
            if (permssion < 2) return send(getLang("noPermissionDelete"));
            const globalAliases = await globalData.get("setalias", "data", []);
            const cmdEntry = globalAliases.find(a => a.commandName === targetCommand);
            if (!cmdEntry || !cmdEntry.aliases.includes(alias)) return send(getLang("aliasNotExist", alias, targetCommand));

            cmdEntry.aliases = cmdEntry.aliases.filter(a => a !== alias);
            if (!cmdEntry.aliases.length) globalAliases.splice(globalAliases.indexOf(cmdEntry), 1);
            await globalData.set("setalias", globalAliases, "data");
            global.GoatBot.aliases.delete(alias);

            return send(`🗑️ [${now}] 𝑹𝒆𝒎𝒐𝒗𝒆𝒅 𝑮𝑳𝑶𝑩𝑨𝑳 𝒂𝒍𝒊𝒂𝒔 \"${alias}\" 𝒇𝒓𝒐𝒎 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 \"${targetCommand}\"`);
        }

        if (!aliasesData[targetCommand]) return send(getLang("noAliasInGroup", targetCommand));
        if (!aliasesData[targetCommand].includes(alias)) return send(getLang("aliasNotExist", alias, targetCommand));

        aliasesData[targetCommand] = aliasesData[targetCommand].filter(a => a !== alias);
        if (!aliasesData[targetCommand].length) delete aliasesData[targetCommand];
        await threadsData.set(threadID, aliasesData, "data.aliases");

        return send(`🗑️ [${now}] 𝑹𝒆𝒎𝒐𝒗𝒆𝒅 𝑮𝑹𝑶𝑼𝑷 𝒂𝒍𝒊𝒂𝒔 \"${alias}\" 𝒇𝒓𝒐𝒎 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 \"${targetCommand}\"`);
    }

    if (command === "list") {
        const isGlobal = args.includes("-g");

        if (isGlobal) {
            const globalAliases = await globalData.get("setalias", "data", []);
            if (!globalAliases.length) return send(getLang("noAliasInSystem"));
            const list = globalAliases.map(cmd => `🔹 ${cmd.commandName}: ${cmd.aliases.join(', ') || 'None'}`).join('\n');
            return send(`📜 [${now}] 𝑮𝒍𝒐𝒃𝒂𝒍 𝑨𝒍𝒊𝒂𝒔𝒆𝒔:\n${list}`);
        }

        if (!Object.keys(aliasesData).length) return send(getLang("notExistAliasInGroup"));
        const list = Object.entries(aliasesData).map(([cmd, aliases]) => `🔹 ${cmd}: ${aliases.join(', ') || 'None'}`).join('\n');
        return send(`📜 [${now}] 𝑮𝒓𝒐𝒖𝒑 𝑨𝒍𝒊𝒂𝒔𝒆𝒔:\n${list}`);
    }

    if (command === "info") {
        const alias = args[1]?.toLowerCase();
        if (!alias) return send(getLang("invalidSyntax", `${this.config.name} 𝒊𝒏𝒇𝒐 <𝒂𝒍𝒊𝒂𝒔>`));

        const globalAliases = await globalData.get("setalias", "data", []);
        let found = globalAliases.find(a => a.aliases.includes(alias));
        let isGlobal = true;
        let groupId = "N/A";

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

        if (!found) return send(`❌ [${now}] 𝑨𝒍𝒊𝒂𝒔 \"${alias}\" 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅`);
        return send(getLang("aliasInfo", alias, found.commandName, isGlobal ? "𝒀𝒆𝒔" : "𝑵𝒐", groupId));
    }

    const guide = this.config.guide.en.replace(/{pn}/g, this.config.name);
    return send(`📝 [${now}] 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑮𝒖𝒊𝒅𝒆:\n${guide}`);
};
