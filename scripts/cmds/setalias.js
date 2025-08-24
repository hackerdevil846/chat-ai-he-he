const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "setalias",
    version: "3.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    description: {
        vi: "Quản lý biệt danh lệnh trong nhóm hoặc toàn hệ thống",
        en: "Manage command aliases in group or globally"
    },
    category: "config",
    guide: {
        en:
`🔹 Add group alias: {pn} add <alias> <command>
🔹 Add global alias (admin only): {pn} add <alias> <command> -g
🔹 Remove group alias: {pn} remove <alias> <command>
🔹 Remove global alias (admin only): {pn} remove <alias> <command> -g
🔹 List group aliases: {pn} list
🔹 List global aliases: {pn} list -g
🔹 Info about alias: {pn} info <alias>
🔹 Example: {pn} add ctrk customrankcard`
    }
};

module.exports.languages = {
    en: {
        commandNotExist: "❌ Command \"%1\" does not exist",
        aliasExist: "❌ Alias \"%1\" already exists for command \"%2\"",
        aliasIsCommand: "❌ Alias \"%1\" conflicts with an existing command",
        addAliasSuccess: "✅ Added global alias \"%1\" for command \"%2\"",
        addAliasToGroupSuccess: "✨ Added group alias \"%1\" for command \"%2\"",
        removeAliasSuccess: "🗑️ Removed global alias \"%1\" for command \"%2\"",
        removeAliasInGroupSuccess: "🗑️ Removed group alias \"%1\" for command \"%2\"",
        noPermissionAdd: "❌ You don't have permission to add global aliases",
        noPermissionDelete: "❌ You don't have permission to remove global aliases",
        noAliasInSystem: "ℹ️ No global aliases exist",
        notExistAliasInGroup: "ℹ️ No group aliases exist",
        noAliasInGroup: "❌ Command \"%1\" has no aliases in this group",
        aliasExistInGroup: "❌ Alias \"%1\" already exists for command \"%2\" in this group",
        aliasNotExist: "❌ Alias \"%1\" does not exist for command \"%2\"",
        aliasList: "📜 Global aliases:\n%1",
        aliasListInGroup: "📜 Group aliases:\n%1",
        aliasInfo: "ℹ️ Alias \"%1\" is mapped to command \"%2\"\nGlobal: %3\nGroup ID: %4",
        invalidSyntax: "❌ Invalid syntax! Please follow the guide:\n%1"
    }
};

module.exports.onStart = async function () {
    // Loader safe
};

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

    /**
     * ────────────── ADD ALIAS ──────────────
     */
    if (command === "add") {
        if (args.length < 3) return send(getLang("invalidSyntax", this.config.guide.en));

        const alias = args[1].toLowerCase();
        const targetCommand = args[2].toLowerCase();
        const isGlobal = args.includes("-g");

        // Check if command exists
        if (!global.GoatBot.commands.has(targetCommand))
            return send(getLang("commandNotExist", targetCommand));

        // Global alias handling
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

            return send(`✅ [${now}] Added GLOBAL alias "${alias}" ➔ command "${targetCommand}"\nTip: Use "${this.config.name} list -g" to view all global aliases.`);
        }

        // Group alias handling
        if (global.GoatBot.commands.has(alias)) return send(getLang("aliasIsCommand", alias));
        if (global.GoatBot.aliases.has(alias)) return send(getLang("aliasExist", alias, global.GoatBot.aliases.get(alias)));
        for (const cmd in aliasesData) if (aliasesData[cmd].includes(alias)) return send(getLang("aliasExistInGroup", alias, cmd));

        aliasesData[targetCommand] = aliasesData[targetCommand] || [];
        if (!aliasesData[targetCommand].includes(alias)) aliasesData[targetCommand].push(alias);
        await threadsData.set(threadID, aliasesData, "data.aliases");

        return send(`✨ [${now}] Added GROUP alias "${alias}" ➔ command "${targetCommand}"\nTip: Use "${this.config.name} list" to see all group aliases.`);
    }

    /**
     * ────────────── REMOVE ALIAS ──────────────
     */
    if (command === "remove" || command === "rm") {
        if (args.length < 3) return send(getLang("invalidSyntax", this.config.guide.en));

        const alias = args[1].toLowerCase();
        const targetCommand = args[2].toLowerCase();
        const isGlobal = args.includes("-g");

        if (!global.GoatBot.commands.has(targetCommand))
            return send(getLang("commandNotExist", targetCommand));

        // Global removal
        if (isGlobal) {
            if (permssion < 2) return send(getLang("noPermissionDelete"));
            const globalAliases = await globalData.get("setalias", "data", []);
            const cmdEntry = globalAliases.find(a => a.commandName === targetCommand);
            if (!cmdEntry || !cmdEntry.aliases.includes(alias)) return send(getLang("aliasNotExist", alias, targetCommand));

            cmdEntry.aliases = cmdEntry.aliases.filter(a => a !== alias);
            if (!cmdEntry.aliases.length) globalAliases.splice(globalAliases.indexOf(cmdEntry), 1);
            await globalData.set("setalias", globalAliases, "data");
            global.GoatBot.aliases.delete(alias);

            return send(`🗑️ [${now}] Removed GLOBAL alias "${alias}" from command "${targetCommand}"`);
        }

        // Group removal
        if (!aliasesData[targetCommand]) return send(getLang("noAliasInGroup", targetCommand));
        if (!aliasesData[targetCommand].includes(alias)) return send(getLang("aliasNotExist", alias, targetCommand));

        aliasesData[targetCommand] = aliasesData[targetCommand].filter(a => a !== alias);
        if (!aliasesData[targetCommand].length) delete aliasesData[targetCommand];
        await threadsData.set(threadID, aliasesData, "data.aliases");

        return send(`🗑️ [${now}] Removed GROUP alias "${alias}" from command "${targetCommand}"`);
    }

    /**
     * ────────────── LIST ALIASES ──────────────
     */
    if (command === "list") {
        const isGlobal = args.includes("-g");

        if (isGlobal) {
            const globalAliases = await globalData.get("setalias", "data", []);
            if (!globalAliases.length) return send(getLang("noAliasInSystem"));
            const list = globalAliases.map(cmd => `🔹 ${cmd.commandName}: ${cmd.aliases.join(', ') || 'None'}`).join('\n');
            return send(`📜 [${now}] Global Aliases:\n${list}`);
        }

        if (!Object.keys(aliasesData).length) return send(getLang("notExistAliasInGroup"));
        const list = Object.entries(aliasesData).map(([cmd, aliases]) => `🔹 ${cmd}: ${aliases.join(', ') || 'None'}`).join('\n');
        return send(`📜 [${now}] Group Aliases:\n${list}`);
    }

    /**
     * ────────────── ALIAS INFO ──────────────
     */
    if (command === "info") {
        const alias = args[1]?.toLowerCase();
        if (!alias) return send(getLang("invalidSyntax", `${this.config.name} info <alias>`));

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

        if (!found) return send(`❌ [${now}] Alias "${alias}" not found`);
        return send(getLang("aliasInfo", alias, found.commandName, isGlobal ? "Yes" : "No", groupId));
    }

    // Default: guide
    const guide = this.config.guide.en.replace(/{pn}/g, this.config.name);
    return send(`📝 [${now}] Command Guide:\n${guide}`);
};
