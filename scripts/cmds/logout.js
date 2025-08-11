module.exports.config = {
    name: "logout",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑩𝒐𝒕 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒍𝒐𝒈𝒐𝒖𝒕 𝒌𝒐𝒓𝒖𝒏",
    commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "",
    cooldowns: 0
};

module.exports.run = async function({ api, event }) {
    api.sendMessage("🔒 𝑩𝒐𝒕 𝒍𝒐𝒈𝒐𝒖𝒕 𝒉𝒐𝒄𝒄𝒉𝒆...", event.threadID, event.messageID);
    setTimeout(() => {
        api.logout();
    }, 1500);
}
