const GameManager = require('./masoi/GameManager');

// Initialize game manager on load
try {
    if (!global.gameManager) {
        const loader = () => {
            const exportData = {};
            exportData['masoi'] = require('./masoi/index');
            return exportData;
        };
        
        const gameManager = new GameManager(loader());
        global.gameManager = gameManager;
    }
} catch (e) {
    console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒 𝐺𝑎𝑚𝑒𝑀𝑎𝑛𝑎𝑔𝑒𝑟:", e);
}

module.exports = {
    config: {
        name: "masoi",
        aliases: ["werewolf", "maSoi"],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 0,
        role: 0,
        category: "𝑔𝑎𝑚𝑒",
        shortDescription: {
            en: "𝐴 𝑤𝑒𝑟𝑒𝑤𝑜𝑙𝑓 𝑔𝑎𝑚𝑒 𝑜𝑛 𝑀𝑖𝑟𝑎𝑖"
        },
        longDescription: {
            en: "𝑃𝑙𝑎𝑦 𝑎 𝑤𝑒𝑟𝑒𝑤𝑜𝑙𝑓 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑓𝑟𝑖𝑒𝑛𝑑𝑠"
        },
        guide: {
            en: "{p}masoi [𝑜𝑝𝑡𝑖𝑜𝑛𝑠]"
        },
        dependencies: {
            "./masoi/GameManager": "",
            "./masoi/index": ""
        }
    },

    onStart: async function ({ usersData, event, args, message }) {
        try {
            // Check if dependencies are available
            if (typeof require('./masoi/GameManager') === 'undefined') {
                return message.reply("❌ 𝐺𝑎𝑚𝑒𝑀𝑎𝑛𝑎𝑔𝑒𝑟 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
            }
            
            if (typeof require('./masoi/index') === 'undefined') {
                return message.reply("❌ 𝑀𝑎𝑆𝑜𝑖 𝑔𝑎𝑚𝑒 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
            }

            global.Users = usersData;
            
            if (!global.gameManager) {
                return message.reply("❌ 𝐺𝑎𝑚𝑒𝑀𝑎𝑛𝑎𝑔𝑒𝑟 𝑛𝑜𝑡 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑");
            }

            global.gameManager.run(this.config.name, {
                masterID: event.senderID,
                threadID: event.threadID,
                param: args,
                isGroup: event.isGroup
            });

        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑚𝑎𝑠𝑜𝑖 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
            message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒");
        }
    },

    onChat: async function ({ event, message }) {
        try {
            if (!global.gameManager || !global.gameManager.items) {
                return;
            }

            // Check if Ma Sói game exists
            const maSoiGame = global.gameManager.items.find(i => i.name === "𝑀𝑎 𝑆ó𝑖");
            if (!maSoiGame) {
                return;
            }

            // Check if user is participant or message is in game thread
            if ((maSoiGame.participants && maSoiGame.participants.includes(event.senderID) && !event.isGroup) || 
                maSoiGame.threadID === event.threadID) {
                
                maSoiGame.onMessage(event, (msg) => {
                    message.reply(msg);
                });
            }
        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑚𝑎𝑠𝑜𝑖 𝑐ℎ𝑎𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟:", error);
        }
    }
};
