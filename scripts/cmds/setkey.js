module.exports.config = {
    name: "setkey",
    version: "1.1",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑬𝒅𝒊𝒕 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝑨𝑷𝑰 𝒗3 𝒌𝒆𝒚 𝒊𝒏 𝒄𝒐𝒏𝒇𝒊𝒈𝒖𝒓𝒂𝒕𝒊𝒐𝒏",
    commandCategory: "𝑨𝒅𝒎𝒊𝒏",
    usages: "setkey [your-YouTube-API-key]",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args, client }) {
    try {
        const fs = require("fs-extra");
        const configPath = client.dirConfig;
        
        // Validate API key input
        if (!args[0]) {
            return api.sendMessage("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝑨𝑷𝑰 𝒗3 𝒌𝒆𝒚", event.threadID);
        }

        // Validate key format (basic check)
        if (!/^[A-Za-z0-9_-]{39}$/.test(args[0])) {
            return api.sendMessage("⚠️ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒌𝒆𝒚 𝒇𝒐𝒓𝒎𝒂𝒕! 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝑨𝑷𝑰 𝒌𝒆𝒚𝒔 𝒔𝒉𝒐𝒖𝒍𝒅 𝒃𝒆 39 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓𝒔 𝒍𝒐𝒏𝒈", event.threadID);
        }

        // Load current config
        const config = require(configPath);
        
        // Update YouTube API key
        config.video = config.video || {};
        config.video.YOUTUBE_API = args[0];
        
        // Save updated config
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
        
        // Notify user
        api.sendMessage("🔄 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒖𝒑𝒅𝒂𝒕𝒆𝒅 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝑨𝑷𝑰 𝒌𝒆𝒚!\n\n𝗥𝗲𝗯𝗼𝗼𝘁𝗶𝗻𝗴 𝘀𝘆𝘀𝘁𝗲𝗺 𝘁𝗼 𝗮𝗽𝗽𝗹𝘆 𝗰𝗵𝗮𝗻𝗴𝗲𝘀...", event.threadID, async () => {
            try {
                // Graceful restart
                const { exec } = require("child_process");
                exec("pm2 restart 0", (error) => {
                    if (error) {
                        console.error("❌ 𝑹𝒆𝒔𝒕𝒂𝒓𝒕 𝑬𝒓𝒓𝒐𝒓:", error);
                        api.sendMessage("✅ 𝑨𝑷𝑰 𝒌𝒆𝒚 𝒖𝒑𝒅𝒂𝒕𝒆𝒅!\n⚠️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒎𝒂𝒏𝒖𝒂𝒍𝒍𝒚 𝒓𝒆𝒔𝒕𝒂𝒓𝒕 𝒕𝒉𝒆 𝒃𝒐𝒕 𝒕𝒐 𝒂𝒑𝒑𝒍𝒚 𝒄𝒉𝒂𝒏𝒈𝒆𝒔", event.threadID);
                    }
                });
            } catch (restartError) {
                console.error("❌ 𝑹𝒆𝒔𝒕𝒂𝒓𝒕 𝑬𝒙𝒄𝒆𝒑𝒕𝒊𝒐𝒏:", restartError);
                api.sendMessage("✅ 𝑨𝑷𝑰 𝒌𝒆𝒚 𝒖𝒑𝒅𝒂𝒕𝒆𝒅!\n⚠️ 𝑴𝒂𝒏𝒖𝒂𝒍 𝒓𝒆𝒔𝒕𝒂𝒓𝒕 𝒓𝒆𝒒𝒖𝒊𝒓𝒆𝒅", event.threadID);
            }
        });
        
    } catch (error) {
        console.error("❌ 𝑺𝒆𝒕𝒌𝒆𝒚 𝑬𝒓𝒓𝒐𝒓:", error);
        api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒖𝒑𝒅𝒂𝒕𝒊𝒏𝒈 𝒕𝒉𝒆 𝑨𝑷𝑰 𝒌𝒆𝒚", event.threadID);
    }
};
