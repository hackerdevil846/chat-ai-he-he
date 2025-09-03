const GameManager = require('./masoi/GameManager');

const loader = () => {
    var exportData = {};
    exportData['masoi'] = require('./masoi/index');
    return exportData;
};

try {
    if (!global.gameManager) {
        var gameManager = new GameManager(loader());
        global.gameManager = gameManager;
    }
} catch (e) {
    console.error("Failed to initialize GameManager:", e);
}

module.exports = {
    config: {
        name: "masoi",
        version: "1.0.0",
        role: 0,
        author: "Asif Mahmud",
        category: "game",
        shortDescription: {
            en: "A werewolf game on mirai"
        },
        longDescription: {
            en: "Play a werewolf game with friends"
        },
        guide: {
            en: "{p}masoi [options]"
        },
        countDown: 0,
        dependencies: {}
    },

    onStart: async function ({ usersData, event, args }) {
        try {
            global.Users = usersData;
            if (!global.gameManager) {
                console.error("GameManager not initialized");
                return;
            }
            global.gameManager.run(this.config.name, {
                masterID: event.senderID,
                threadID: event.threadID,
                param: args,
                isGroup: event.isGroup
            });
        } catch (error) {
            console.error("Error in masoi command:", error);
        }
    },

    onChat: async function ({ event, message }) {
        if (!global.gameManager || !global.gameManager.items.some(i => i.name === "Ma Sói")) return;

        for (const game of global.gameManager.items) {
            if (!game.participants) continue;
            if ((game.participants.includes(event.senderID) && !event.isGroup) || game.threadID === event.threadID) {
                game.onMessage(event, (msg) => message.reply(msg));
            }
        }
    }
};
