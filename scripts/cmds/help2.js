module.exports = {
    config: {
        name: "help2",
        aliases: [],
        version: "1.0.3",
        author: "Asif Mahmud",
        countDown: 1,
        role: 0,
        category: "system",
        shortDescription: {
            en: "Bot Command List"
        },
        longDescription: {
            en: "Shows all available commands or detailed information about a specific command"
        },
        guide: {
            en: "{p}help2 [command name]"
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            const { commands } = global.client;
            const commandName = (args[0] || "").toLowerCase();
            const command = commands.get(commandName);
            const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};
            const prefix = threadSetting.PREFIX || global.config.PREFIX;

            // If specific command is requested
            if (command) {
                const roleText = command.config.role === 0 ? "User" : 
                               command.config.role === 1 ? "Admin Group" : "Bot Admin";

                const shortDesc = command.config.shortDescription?.en || "No description";
                const guideText = command.config.guide?.en?.replace(/\{p\}/g, prefix) || "";
                
                const moduleInfo = `╭───────────⭓
│ Command: ${command.config.name}
│ Description: ${shortDesc}
│
│ Usage: ${prefix}${command.config.name} ${guideText}
│ Category: ${command.config.category || "Uncategorized"}
│ Cooldown: ${command.config.countDown || 5}s
│ Permission: ${roleText}
│ Aliases: ${command.config.aliases?.join(", ") || "None"}
╰─────────────⭓

📝 Module by: ${command.config.author}`;

                await message.reply(moduleInfo);
                return;
            }

            // Show command list
            const arrayInfo = Array.from(commands.keys()).filter(cmd => {
                const cmdObj = commands.get(cmd);
                return cmdObj && cmdObj.config && cmdObj.config.name;
            }).sort();

            if (arrayInfo.length === 0) {
                return message.reply("❌ No commands available.");
            }

            const page = parseInt(args[0]) || 1;
            const numberOfOnePage = 20;
            const totalPages = Math.ceil(arrayInfo.length / numberOfOnePage);
            
            if (page < 1 || page > totalPages) {
                return message.reply(`❌ Invalid page number! Available pages: 1-${totalPages}`);
            }

            const startSlice = (page - 1) * numberOfOnePage;
            const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);
            
            let msg = returnArray.map((item, index) => {
                const cmd = commands.get(item);
                const role = cmd?.config?.role || 0;
                const roleIcon = role === 0 ? "👤" : role === 1 ? "🛡️" : "⚡";
                return `${startSlice + index + 1}. ${roleIcon} ${prefix}${item}`;
            }).join("\n");

            const helpMessage = `╭───────⭓
│ 🤖 Bot Commands
│ 📊 Total: ${arrayInfo.length}
│ 📄 Page: ${page}/${totalPages}
│ 🔑 Prefix: ${prefix}
╰─────────⭓

${msg}

📖 Use "${prefix}help2 <command>" for details!
🔢 Use "${prefix}help2 <page>" to view other pages`;

            await message.reply(helpMessage);

        } catch (error) {
            console.error("Help Command Error:", error);
            await message.reply("❌ An error occurred while processing the help command. Please try again.");
        }
    },

    onChat: async function({ message, event }) {
        try {
            const { commands } = global.client;
            const { body } = event;

            if (!body || !body.toLowerCase().startsWith("help2")) return;
            
            const splitBody = body.toLowerCase().split(/\s+/);
            if (splitBody.length < 2) return;
            
            const commandName = splitBody[1];
            const command = commands.get(commandName);
            
            if (!command) return;

            const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};
            const prefix = threadSetting.PREFIX || global.config.PREFIX;
            
            const roleText = command.config.role === 0 ? "User" : 
                           command.config.role === 1 ? "Admin Group" : "Bot Admin";

            const shortDesc = command.config.shortDescription?.en || "No description";
            const guideText = command.config.guide?.en?.replace(/\{p\}/g, prefix) || "";

            const moduleInfo = `╭───────────⭓
│ Command: ${command.config.name}
│ Description: ${shortDesc}
│
│ Usage: ${prefix}${command.config.name} ${guideText}
│ Category: ${command.config.category || "Uncategorized"}
│ Cooldown: ${command.config.countDown || 5}s
│ Permission: ${roleText}
│ Aliases: ${command.config.aliases?.join(", ") || "None"}
╰─────────────⭓

📝 Module by: ${command.config.author}`;

            await message.reply(moduleInfo);
        } catch (error) {
            console.error("Help onChat Error:", error);
            // Silent fail for onChat to avoid spam
        }
    }
};
