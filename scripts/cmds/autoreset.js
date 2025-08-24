module.exports.config = {
    name: "autoreset",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑨𝑼𝑻𝑶 𝑹𝑬𝑺𝑻𝑨𝑹𝑻 𝑺𝒀𝑺𝑻𝑬𝑴",
    category: "𝑺𝒚𝒔𝒕𝒆𝒎",
    cooldowns: 5
}

module.exports.handleEvent = async function({ api }) {
    const moment = require("moment-timezone");
    const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
    const seconds = moment.tz("Asia/Dhaka").format("ss");
    const adminIDs = global.config.ADMINBOT;
    
    // Create time strings for each hour
    const restartTimes = Array.from({length: 12}, (_, i) => 
        `${(i+1).toString().padStart(2, '0')}:00:${seconds}`
    );
    
    // Check if current time matches any restart time
    if (restartTimes.includes(timeNow) && parseInt(seconds) < 6) {
        for (const adminID of adminIDs) {
            api.sendMessage(
                `⚡️ 𝑨𝒌𝒉𝒐𝒏 𝒔𝒐𝒎𝒐𝒚: ${timeNow}\n𝑩𝒂𝒃𝒚 𝒓𝒆𝒔𝒕𝒂𝒓𝒕 𝒉𝒐𝒄𝒄𝒉𝒆!!!`,
                adminID,
                () => process.exit(1)
            );
        }
    }
}

module.exports.onStart = async function({ api, event }) {
    const moment = require("moment-timezone");
    const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
    api.sendMessage(`🕒 𝑨𝒌𝒉𝒏𝒆𝒓 𝒔𝒐𝒎𝒐𝒚: ${timeNow}`, event.threadID);
}
