const fs = require("fs-extra");

module.exports.config = {
    name: "status",
    version: "1.2.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "বটের বিভিন্ন সেটিংসের স্ট্যাটাস দেখায়, ভিজ্যুয়ালি",
    category: "system",
    usages: "",
    cooldowns: 3,
    dependencies: {}
};

module.exports.run = async function({ api, event, Threads }) {
    try {
        const { threadID, messageID } = event;

        // Fetch thread data
        const dataThread = await Threads.getData(threadID);
        const data = dataThread.data || {};

        // Define status variables with default fallbacks
        const log = data.log != null ? data.log : true;
        const rankup = data.rankup != null ? data.rankup : false;
        const resend = data.resend != null ? data.resend : false;
        const tagadmin = data.tagadmin != null ? data.tagadmin : true;
        const guard = data.guard != null ? data.guard : true;
        const antiout = data.antiout != null ? data.antiout : true;

        // Helper function for emoji ON/OFF
        const statusEmoji = state => state ? "🟢 ON" : "🔴 OFF";

        // Dynamic thread name (if available)
        const threadName = dataThread.name || "Unknown Thread";

        // Construct status message
        const statusMessage = 
`🌟 𝗕𝗼𝘁 𝗦𝘁𝗮𝘁𝘂𝘀 - ${threadName} 🌟

🍄────•🦋•────🍄
❯ 🍉 𝑳𝒐𝒈: ${statusEmoji(log)}
❯ 🍇 𝑹𝒂𝒏𝒌𝒖𝒑: ${statusEmoji(rankup)}
❯ 🍓 𝑹𝒆𝒔𝒆𝒏𝒅: ${statusEmoji(resend)}
❯ 🥕 𝑻𝒂𝒈 𝑨𝒅𝒎𝒊𝒏: ${statusEmoji(tagadmin)}
❯ 🛡️ 𝑨𝒏𝒕𝒊𝒓𝒐𝒃𝒃𝒆𝒓𝒚: ${statusEmoji(guard)}
❯ 🍒 𝑨𝒏𝒕𝒊𝒐𝒖𝒕: ${statusEmoji(antiout)}
🍄────•🦋•────🍄

✨ Created by: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 ✨`;

        // Send the message
        return api.sendMessage(statusMessage, threadID, messageID);

    } catch (error) {
        console.error("Error in status command:", error);
        return api.sendMessage("⚠️ Status command এ কিছু সমস্যা হয়েছে।", event.threadID, event.messageID);
    }
};
