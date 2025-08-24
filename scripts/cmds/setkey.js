module.exports.config = {
    name: "setkey",
    version: "1.1",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Edit YouTube API v3 key in configuration",
    category: "Admin",
    usages: "setkey [your-YouTube-API-key]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        missingKey: "❌ Please provide a valid YouTube API v3 key!",
        invalidKey: "⚠️ Invalid key format! YouTube API keys should be 39 characters long",
        successUpdate: "🔄 Successfully updated YouTube API key!\n\nRebooting system to apply changes...",
        manualRestart: "✅ API key updated!\n⚠️ Please manually restart the bot to apply changes",
        errorUpdate: "❌ An error occurred while updating the API key"
    }
};

module.exports.run = async function({ api, event, args, client }) {
    const fs = require("fs-extra");
    const { exec } = require("child_process");
    const configPath = client.dirConfig;

    try {
        // Check if key is provided
        if (!args[0]) {
            return api.sendMessage(global.utils.getText("en", "missingKey"), event.threadID);
        }

        // Validate key format
        if (!/^[A-Za-z0-9_-]{39}$/.test(args[0])) {
            return api.sendMessage(global.utils.getText("en", "invalidKey"), event.threadID);
        }

        // Load existing config
        const config = require(configPath);

        // Update YouTube API key
        config.video = config.video || {};
        config.video.YOUTUBE_API = args[0];

        // Save config
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");

        // Notify and attempt restart
        api.sendMessage(global.utils.getText("en", "successUpdate"), event.threadID, async () => {
            try {
                exec("pm2 restart 0", (error) => {
                    if (error) {
                        console.error("❌ Restart Error:", error);
                        return api.sendMessage(global.utils.getText("en", "manualRestart"), event.threadID);
                    }
                });
            } catch (err) {
                console.error("❌ Restart Exception:", err);
                api.sendMessage(global.utils.getText("en", "manualRestart"), event.threadID);
            }
        });

    } catch (error) {
        console.error("❌ SetKey Error:", error);
        return api.sendMessage(global.utils.getText("en", "errorUpdate"), event.threadID);
    }
};
