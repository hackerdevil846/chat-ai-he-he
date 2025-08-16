module.exports.config = {
    name: "setalias",
    version: "1.8",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    description: {
        vi: "Thêm tên gọi khác cho 1 lệnh bất kỳ trong nhóm của bạn",
        en: "Add an alias for any command in your group"
    },
    category: "config",
    guide: {
        en: "  🔹 Use this command to add/remove aliases for commands\n"
            + "  🔹 Add group alias: {pn} add <alias> <command>\n"
            + "  🔹 Add global alias (admin only): {pn} add <alias> <command> -g\n"
            + "  🔹 Example: {pn} add ctrk customrankcard\n\n"
            + "  🔹 Remove group alias: {pn} [remove|rm] <alias> <command>\n"
            + "  🔹 Remove global alias (admin only): {pn} [remove|rm] <alias> <command> -g\n"
            + "  🔹 Example: {pn} rm ctrk customrankcard\n\n"
            + "  🔹 List group aliases: {pn} list\n"
            + "  🔹 List global aliases: {pn} list -g"
    }
};

module.exports.languages = {
    en: {
        commandNotExist: "❌ Command \"%1\" does not exist",
        aliasExist: "❌ Alias \"%1\" already exists for command \"%2\" in the system",
        addAliasSuccess: "✅ Added global alias \"%1\" for command \"%2\"",
        noPermissionAdd: "❌ You don't have permission to add global aliases",
        aliasIsCommand: "❌ Alias \"%1\" conflicts with existing command names",
        aliasExistInGroup: "❌ Alias \"%1\" already exists for command \"%2\" in this group",
        addAliasToGroupSuccess: "✨ Added group alias \"%1\" for command \"%2\"",
        aliasNotExist: "❌ Alias \"%1\" does not exist for command \"%2\"",
        removeAliasSuccess: "🗑️ Removed global alias \"%1\" for command \"%2\"",
        noPermissionDelete: "❌ You don't have permission to remove global aliases",
        noAliasInGroup: "❌ Command \"%1\" has no aliases in this group",
        removeAliasInGroupSuccess: "🗑️ Removed group alias \"%1\" for command \"%2\"",
        aliasList: "📜 Global aliases:\n%1",
        noAliasInSystem: "ℹ️ No global aliases exist",
        notExistAliasInGroup: "ℹ️ This group has no custom aliases",
        aliasListInGroup: "📜 Group aliases:\n%1"
    }
};

module.exports.run = async function ({ api, event, args, threadsData, globalData, permssion, getLang }) {
    const { threadID, messageID } = event;
    const aliasesData = await threadsData.get(threadID, "data.aliases", {});
    const command = args[0]?.toLowerCase();

    switch (command) {
        case "add": {
            if (args.length < 3) return api.sendMessage("❌ Invalid syntax! Usage: setalias add <alias> <command>", threadID, messageID);
            
            const alias = args[1].toLowerCase();
            const targetCommand = args[2].toLowerCase();
            const isGlobal = args[3] === "-g";

            if (!global.GoatBot.commands.has(targetCommand)) {
                return api.sendMessage(getLang("commandNotExist", targetCommand), threadID, messageID);
            }

            if (isGlobal) {
                if (permssion < 2) return api.sendMessage(getLang("noPermissionAdd"), threadID, messageID);
                
                const globalAliases = await globalData.get("setalias", "data", []);
                const existing = globalAliases.find(a => a.aliases.includes(alias));
                
                if (existing) {
                    return api.sendMessage(getLang("aliasExist", alias, existing.commandName), threadID, messageID);
                }
                if (global.GoatBot.commands.has(alias)) {
                    return api.sendMessage(getLang("aliasIsCommand", alias), threadID, messageID);
                }

                const cmdEntry = globalAliases.find(a => a.commandName === targetCommand) || 
                                { commandName: targetCommand, aliases: [] };
                if (!cmdEntry.aliases.includes(alias)) {
                    cmdEntry.aliases.push(alias);
                }
                
                if (!globalAliases.some(a => a.commandName === targetCommand)) {
                    globalAliases.push(cmdEntry);
                }
                
                await globalData.set("setalias", globalAliases, "data");
                global.GoatBot.aliases.set(alias, targetCommand);
                return api.sendMessage(getLang("addAliasSuccess", alias, targetCommand), threadID, messageID);
            }

            if (global.GoatBot.commands.has(alias)) {
                return api.sendMessage(getLang("aliasIsCommand", alias), threadID, messageID);
            }
            if (global.GoatBot.aliases.has(alias)) {
                return api.sendMessage(getLang("aliasExist", alias, global.GoatBot.aliases.get(alias)), threadID, messageID);
            }

            for (const cmd in aliasesData) {
                if (aliasesData[cmd].includes(alias)) {
                    return api.sendMessage(getLang("aliasExistInGroup", alias, cmd), threadID, messageID);
                }
            }

            aliasesData[targetCommand] = aliasesData[targetCommand] || [];
            if (!aliasesData[targetCommand].includes(alias)) {
                aliasesData[targetCommand].push(alias);
                await threadsData.set(threadID, aliasesData, "data.aliases");
            }
            return api.sendMessage(getLang("addAliasToGroupSuccess", alias, targetCommand), threadID, messageID);
        }

        case "remove":
        case "rm": {
            if (args.length < 3) return api.sendMessage("❌ Invalid syntax! Usage: setalias remove <alias> <command>", threadID, messageID);
            
            const alias = args[1].toLowerCase();
            const targetCommand = args[2].toLowerCase();
            const isGlobal = args[3] === "-g";

            if (!global.GoatBot.commands.has(targetCommand)) {
                return api.sendMessage(getLang("commandNotExist", targetCommand), threadID, messageID);
            }

            if (isGlobal) {
                if (permssion < 2) return api.sendMessage(getLang("noPermissionDelete"), threadID, messageID);
                
                const globalAliases = await globalData.get("setalias", "data", []);
                const cmdEntry = globalAliases.find(a => a.commandName === targetCommand);
                
                if (!cmdEntry || !cmdEntry.aliases.includes(alias)) {
                    return api.sendMessage(getLang("aliasNotExist", alias, targetCommand), threadID, messageID);
                }
                
                cmdEntry.aliases = cmdEntry.aliases.filter(a => a !== alias);
                if (cmdEntry.aliases.length === 0) {
                    globalAliases.splice(globalAliases.indexOf(cmdEntry), 1);
                }
                
                await globalData.set("setalias", globalAliases, "data");
                global.GoatBot.aliases.delete(alias);
                return api.sendMessage(getLang("removeAliasSuccess", alias, targetCommand), threadID, messageID);
            }

            if (!aliasesData[targetCommand]) {
                return api.sendMessage(getLang("noAliasInGroup", targetCommand), threadID, messageID);
            }
            if (!aliasesData[targetCommand].includes(alias)) {
                return api.sendMessage(getLang("aliasNotExist", alias, targetCommand), threadID, messageID);
            }
            
            aliasesData[targetCommand] = aliasesData[targetCommand].filter(a => a !== alias);
            if (aliasesData[targetCommand].length === 0) {
                delete aliasesData[targetCommand];
            }
            
            await threadsData.set(threadID, aliasesData, "data.aliases");
            return api.sendMessage(getLang("removeAliasInGroupSuccess", alias, targetCommand), threadID, messageID);
        }

        case "list": {
            const isGlobal = args[1] === "-g";
            
            if (isGlobal) {
                const globalAliases = await globalData.get("setalias", "data", []);
                if (globalAliases.length === 0) {
                    return api.sendMessage(getLang("noAliasInSystem"), threadID, messageID);
                }
                
                const list = globalAliases.map(cmd => 
                    `🔹 ${cmd.commandName}: ${cmd.aliases.join(', ') || 'None'}`
                ).join('\n');
                
                return api.sendMessage(getLang("aliasList", list), threadID, messageID);
            }

            if (Object.keys(aliasesData).length === 0) {
                return api.sendMessage(getLang("notExistAliasInGroup"), threadID, messageID);
            }
            
            const list = Object.entries(aliasesData).map(([cmd, aliases]) => 
                `🔹 ${cmd}: ${aliases.join(', ') || 'None'}`
            ).join('\n');
            
            return api.sendMessage(getLang("aliasListInGroup", list), threadID, messageID);
        }

        default: {
            const guide = this.config.guide.en
                .replace(/{pn}/g, this.config.name)
                .replace(/  /g, '');
            return api.sendMessage(`📝 Command Guide:\n${guide}`, threadID, messageID);
        }
    }
};
