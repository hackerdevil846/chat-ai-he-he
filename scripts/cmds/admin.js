const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "admin",
        aliases: ["adm", "botadmin"],
        version: "1.0.5",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2,
        category: "admin",
        shortDescription: {
            en: "🤖 𝐵𝑜𝑡 𝑎𝑑𝑚𝑖𝑛 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡"
        },
        longDescription: {
            en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟𝑠 𝑎𝑛𝑑 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠"
        },
        guide: {
            en: "{p}admin [𝑙𝑖𝑠𝑡/𝑎𝑑𝑑/𝑟𝑒𝑚𝑜𝑣𝑒] [𝑢𝑠𝑒𝑟𝐼𝐷]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            // 🛡️ Dependency check
            try {
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            const configPath = path.join(__dirname, '..', '..', 'config.json');
            
            // 🛡️ Load config with multiple safety checks
            let config = {};
            try {
                if (fs.existsSync(configPath)) {
                    const configContent = fs.readFileSync(configPath, 'utf8');
                    if (configContent.trim() === '') {
                        // Create default config if empty
                        config = { ADMINBOT: [] };
                        fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    } else {
                        config = JSON.parse(configContent);
                    }
                } else {
                    // Create config file if it doesn't exist
                    config = { ADMINBOT: [] };
                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                }
            } catch (configError) {
                console.error("𝐶𝑜𝑛𝑓𝑖𝑔 𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", configError);
                return message.reply("❌ 𝐶𝑜𝑛𝑓𝑖𝑔 𝑓𝑖𝑙𝑒 𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑐𝑜𝑛𝑓𝑖𝑔 𝑓𝑖𝑙𝑒.");
            }

            // 🛡️ Ensure ADMINBOT array exists in both configs
            if (!config.ADMINBOT || !Array.isArray(config.ADMINBOT)) {
                config.ADMINBOT = [];
            }
            
            if (!global.config) global.config = {};
            if (!global.config.ADMINBOT || !Array.isArray(global.config.ADMINBOT)) {
                global.config.ADMINBOT = [];
            }

            const { mentions } = event;
            const mention = Object.keys(mentions);
            const action = args[0]?.toLowerCase();

            // 🛡️ Helper function to save config safely
            const saveConfig = () => {
                try {
                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    return true;
                } catch (saveError) {
                    console.error("𝐶𝑜𝑛𝑓𝑖𝑔 𝑠𝑎𝑣𝑒 𝑒𝑟𝑟𝑜𝑟:", saveError);
                    return false;
                }
            };

            // 🛡️ Helper function to check if user is bot admin
            const isBotAdmin = (userId) => {
                return config.ADMINBOT.includes(userId.toString());
            };

            // 🛡️ Helper function to get user info safely
            const getUserInfo = async (userId) => {
                try {
                    const userInfo = await usersData.get(userId);
                    return userInfo?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
                } catch (error) {
                    return "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
                }
            };

            switch (action) {
                case "list":
                case "all":
                case "-a": {
                    const listAdmin = config.ADMINBOT || [];
                    
                    if (listAdmin.length === 0) {
                        return message.reply("📋 [ 𝐴𝐷𝑀𝐼𝑁 ] 𝑁𝑜 𝑎𝑑𝑚𝑖𝑛𝑠 𝑓𝑜𝑢𝑛𝑑");
                    }

                    const msg = [];
                    for (const idAdmin of listAdmin) {
                        if (idAdmin && idAdmin.toString().length >= 9) {
                            const name = await getUserInfo(idAdmin);
                            msg.push(`• ${name} (${idAdmin})`);
                        }
                    }

                    const adminList = msg.join("\n") || "𝑁𝑜 𝑣𝑎𝑙𝑖𝑑 𝑎𝑑𝑚𝑖𝑛𝑠 𝑓𝑜𝑢𝑛𝑑";
                    return message.reply(`📋 [ 𝐴𝐷𝑀𝐼𝑁 ] 𝐴𝑑𝑚𝑖𝑛 𝑙𝑖𝑠𝑡:\n\n${adminList}`);
                }

                case "add": {
                    // 🛡️ Check if user is bot admin
                    if (!isBotAdmin(event.senderID)) {
                        return message.reply("❌ [ 𝐴𝐷𝑀𝐼𝑁 ] 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑎𝑑𝑑 𝑎𝑑𝑚𝑖𝑛𝑠");
                    }

                    if (mention.length > 0) {
                        const listAdd = [];

                        for (const id of mention) {
                            if (id && !isBotAdmin(id)) {
                                config.ADMINBOT.push(id);
                                global.config.ADMINBOT.push(id);
                                const userName = mentions[id]?.replace("@", "") || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
                                listAdd.push(`• ${userName} (${id})`);
                            }
                        }

                        if (listAdd.length === 0) {
                            return message.reply("❌ 𝑁𝑜 𝑛𝑒𝑤 𝑢𝑠𝑒𝑟𝑠 𝑡𝑜 𝑎𝑑𝑑 𝑜𝑟 𝑎𝑙𝑙 𝑢𝑠𝑒𝑟𝑠 𝑎𝑟𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑎𝑑𝑚𝑖𝑛𝑠");
                        }

                        if (!saveConfig()) {
                            return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛");
                        }

                        return message.reply(`✅ [ 𝐴𝐷𝑀𝐼𝑁 ] 𝐴𝑑𝑑𝑒𝑑 ${listAdd.length} 𝑎𝑑𝑚𝑖𝑛𝑠:\n\n${listAdd.join("\n")}`);
                    }
                    else if (args[1] && !isNaN(args[1]) && args[1].length >= 9) {
                        const targetID = args[1];
                        
                        if (isBotAdmin(targetID)) {
                            return message.reply("❌ 𝑈𝑠𝑒𝑟 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑎𝑛 𝑎𝑑𝑚𝑖𝑛");
                        }

                        config.ADMINBOT.push(targetID);
                        global.config.ADMINBOT.push(targetID);
                        
                        const name = await getUserInfo(targetID);
                        
                        if (!saveConfig()) {
                            return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛");
                        }

                        return message.reply(`✅ [ 𝐴𝐷𝑀𝐼𝑁 ] 𝐴𝑑𝑑𝑒𝑑 𝑛𝑒𝑤 𝑎𝑑𝑚𝑖𝑛:\n\n• ${name} (${targetID})`);
                    }
                    else {
                        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑎𝑔𝑒.\n💡 𝑈𝑠𝑒: 𝑎𝑑𝑚𝑖𝑛 𝑎𝑑𝑑 [@𝑡𝑎𝑔] 𝑂𝑅 𝑎𝑑𝑚𝑖𝑛 𝑎𝑑𝑑 [𝑢𝑠𝑒𝑟𝐼𝐷]");
                    }
                }

                case "remove":
                case "rm":
                case "delete": {
                    // 🛡️ Check if user is bot admin
                    if (!isBotAdmin(event.senderID)) {
                        return message.reply("❌ [ 𝐴𝐷𝑀𝐼𝑁 ] 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 𝑎𝑑𝑚𝑖𝑛𝑠");
                    }
                    
                    if (mention.length > 0) {
                        const listRemove = [];

                        for (const id of mention) {
                            const index = config.ADMINBOT.indexOf(id);
                            if (index !== -1) {
                                config.ADMINBOT.splice(index, 1);
                                global.config.ADMINBOT.splice(global.config.ADMINBOT.indexOf(id), 1);
                                const userName = mentions[id]?.replace("@", "") || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
                                listRemove.push(`• ${userName} (${id})`);
                            }
                        }

                        if (listRemove.length === 0) {
                            return message.reply("❌ 𝑁𝑜 𝑢𝑠𝑒𝑟𝑠 𝑤𝑒𝑟𝑒 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑒 𝑎𝑑𝑚𝑖𝑛 𝑙𝑖𝑠𝑡");
                        }

                        if (!saveConfig()) {
                            return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛");
                        }

                        return message.reply(`🗑️ [ 𝐴𝐷𝑀𝐼𝑁 ] 𝑅𝑒𝑚𝑜𝑣𝑒𝑑 ${listRemove.length} 𝑎𝑑𝑚𝑖𝑛𝑠:\n\n${listRemove.join("\n")}`);
                    }
                    else if (args[1] && !isNaN(args[1]) && args[1].length >= 9) {
                        const targetID = args[1];
                        const index = config.ADMINBOT.indexOf(targetID);
                        
                        if (index === -1) {
                            return message.reply("❌ 𝑈𝑠𝑒𝑟 𝑖𝑠 𝑛𝑜𝑡 𝑎𝑛 𝑎𝑑𝑚𝑖𝑛");
                        }

                        config.ADMINBOT.splice(index, 1);
                        global.config.ADMINBOT.splice(global.config.ADMINBOT.indexOf(targetID), 1);
                        
                        const name = await getUserInfo(targetID);
                        
                        if (!saveConfig()) {
                            return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛");
                        }

                        return message.reply(`🗑️ [ 𝐴𝐷𝑀𝐼𝑁 ] 𝑅𝑒𝑚𝑜𝑣𝑒𝑑 𝑎𝑑𝑚𝑖𝑛:\n\n• ${name} (${targetID})`);
                    }
                    else {
                        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑎𝑔𝑒.\n💡 𝑈𝑠𝑒: 𝑎𝑑𝑚𝑖𝑛 𝑟𝑒𝑚𝑜𝑣𝑒 [@𝑡𝑎𝑔] 𝑂𝑅 𝑎𝑑𝑚𝑖𝑛 𝑟𝑒𝑚𝑜𝑣𝑒 [𝑢𝑠𝑒𝑟𝐼𝐷]");
                    }
                }

                default: {
                    const helpMessage = `🤖 𝐴𝑑𝑚𝑖𝑛 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐻𝑒𝑙𝑝:
━━━━━━━━━━━━━━━━━━
📋 » 𝑎𝑑𝑚𝑖𝑛 𝑙𝑖𝑠𝑡
   𝑆ℎ𝑜𝑤 𝑎𝑙𝑙 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟𝑠

👥 » 𝑎𝑑𝑚𝑖𝑛 𝑎𝑑𝑑 [@𝑡𝑎𝑔/𝐼𝐷]
   𝐴𝑑𝑑 𝑛𝑒𝑤 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛

🗑️ » 𝑎𝑑𝑚𝑖𝑛 𝑟𝑒𝑚𝑜𝑣𝑒 [@𝑡𝑎𝑔/𝐼𝐷]
   𝑅𝑒𝑚𝑜𝑣𝑒 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛

⚠️  𝑁𝑜𝑡𝑒: 𝑂𝑛𝑙𝑦 𝑒𝑥𝑖𝑠𝑡𝑖𝑛𝑔 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑚𝑎𝑛𝑎𝑔𝑒 𝑜𝑡ℎ𝑒𝑟 𝑎𝑑𝑚𝑖𝑛𝑠`;
                        
                    return message.reply(helpMessage);
                }
            }

        } catch (error) {
            console.error("𝐴𝑑𝑚𝑖𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
