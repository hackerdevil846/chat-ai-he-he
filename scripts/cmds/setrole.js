module.exports = {
    config: {
        name: "setrole",
        aliases: ["changerole", "permchange"],
        version: "1.4",
        role: 1,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑖𝑛𝑓𝑜",
        shortDescription: {
            en: "𝐸𝑑𝑖𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑢𝑠𝑎𝑔𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠 (𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑤𝑖𝑡ℎ 𝑟𝑜𝑙𝑒 < 2)"
        },
        longDescription: {
            en: "𝑀𝑜𝑑𝑖𝑓𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑙𝑒𝑣𝑒𝑙𝑠 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝"
        },
        guide: {
            en: 
                "{p} <𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑁𝑎𝑚𝑒> <𝑛𝑒𝑤 𝑟𝑜𝑙𝑒>: 𝑈𝑝𝑑𝑎𝑡𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠\n" +
                "   𝑊𝑖𝑡ℎ:\n" +
                "   + <𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑁𝑎𝑚𝑒>: 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑛𝑎𝑚𝑒\n" +
                "   + <𝑛𝑒𝑤 𝑟𝑜𝑙𝑒>: 𝑛𝑒𝑤 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑙𝑒𝑣𝑒𝑙:\n" +
                "   + 0: 𝑎𝑙𝑙 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑐𝑎𝑛 𝑢𝑠𝑒\n" +
                "   + 1: 𝑎𝑑𝑚𝑖𝑛𝑠 𝑜𝑛𝑙𝑦\n" +
                "   + 𝑑𝑒𝑓𝑎𝑢𝑙𝑡: 𝑟𝑒𝑠𝑒𝑡 𝑡𝑜 𝑑𝑒𝑓𝑎𝑢𝑙𝑡\n\n" +
                "   𝐸𝑥𝑎𝑚𝑝𝑙𝑒𝑠:\n" +
                "   {p} 𝑟𝑎𝑛𝑘 1 (𝑟𝑎𝑛𝑘 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑜𝑟 𝑎𝑑𝑚𝑖𝑛𝑠 𝑜𝑛𝑙𝑦)\n" +
                "   {p} 𝑟𝑎𝑛𝑘 0 (𝑟𝑎𝑛𝑘 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑜𝑟 𝑎𝑙𝑙 𝑚𝑒𝑚𝑏𝑒𝑟𝑠)\n" +
                "   {p} 𝑟𝑎𝑛𝑘 𝑑𝑒𝑓𝑎𝑢𝑙𝑡 (𝑟𝑒𝑠𝑒𝑡 𝑡𝑜 𝑑𝑒𝑓𝑎𝑢𝑙𝑡)\n\n" +
                "   {p} [𝑣𝑖𝑒𝑤𝑟𝑜𝑙𝑒|𝑣𝑖𝑒𝑤|𝑠ℎ𝑜𝑤]: 𝑣𝑖𝑒𝑤 𝑒𝑑𝑖𝑡𝑒𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠"
        },
        countDown: 5,
        dependencies: {}
    },

    onStart: async function({ message, event, args, threadsData, usersData }) {
        try {
            const { threadID, senderID } = event;
            const setRole = await threadsData.get(threadID, "data.setRole", {});

            // Check admin permissions
            const threadInfo = await threadsData.get(threadID);
            const isAdmin = threadInfo.adminIDs.includes(senderID);
            const userData = await usersData.get(senderID);
            const isBotAdmin = userData.role > 0;

            if (!isAdmin && !isBotAdmin) {
                return message.reply("❗ 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑒𝑥𝑒𝑐𝑢𝑡𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑");
            }

            if (["view", "viewrole", "show"].includes(args[0])) {
                if (!setRole || Object.keys(setRole).length === 0) {
                    return message.reply("✅ 𝑁𝑜 𝑒𝑑𝑖𝑡𝑒𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝");
                }
                let msg = "⚠️ 𝐸𝑑𝑖𝑡𝑒𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝:\n";
                for (const cmd in setRole) {
                    msg += `- ${cmd} => ${setRole[cmd]}\n`;
                }
                return message.reply(msg);
            }

            let commandName = (args[0] || "").toLowerCase();
            let newRole = args[1];
            
            if (!commandName || (isNaN(newRole) && newRole !== "default")) {
                const guide = this.config.guide.en.replace(/{p}/g, this.config.name);
                return message.reply(`📝 𝑈𝑠𝑎𝑔𝑒 𝐺𝑢𝑖𝑑𝑒:\n${guide}`);
            }

            const command = global.GoatBot.commands.get(commandName) || 
                           global.GoatBot.commands.get(global.GoatBot.aliases.get(commandName));
            
            if (!command) {
                return message.reply(`❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 "${commandName}" 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑`);
            }

            commandName = command.config.name;
            
            if (command.config.role > 1) {
                return message.reply(`❗ 𝐶𝑎𝑛𝑛𝑜𝑡 𝑐ℎ𝑎𝑛𝑔𝑒 𝑟𝑜𝑙𝑒 𝑜𝑓 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${commandName}"`);
            }

            let Default = false;
            if (newRole === "default" || newRole == command.config.role) {
                Default = true;
                newRole = command.config.role;
            } else {
                newRole = parseInt(newRole);
            }

            if (Default) {
                delete setRole[commandName];
            } else {
                setRole[commandName] = newRole;
            }

            await threadsData.set(threadID, setRole, "data.setRole");
            
            return message.reply("✅ " + (Default ? 
                `𝑅𝑒𝑠𝑒𝑡 𝑟𝑜𝑙𝑒 𝑜𝑓 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${commandName}" 𝑡𝑜 𝑑𝑒𝑓𝑎𝑢𝑙𝑡` : 
                `𝐶ℎ𝑎𝑛𝑔𝑒𝑑 𝑟𝑜𝑙𝑒 𝑜𝑓 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 "${commandName}" 𝑡𝑜 ${newRole}`
            ));

        } catch (error) {
            console.error("𝑆𝑒𝑡𝑟𝑜𝑙𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
