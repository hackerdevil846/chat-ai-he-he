module.exports.config = {
    name: "resetexp",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝒔𝒐𝒃 𝒖𝒔𝒆𝒓 𝒆𝒓 𝒆𝒙𝒑 𝒓𝒆𝒔𝒆𝒕 𝒌𝒐𝒓𝒆 𝒅𝒂𝒐",
    commandCategory: "𝒔𝒚𝒔𝒕𝒆𝒎",
    usages: "[𝒄𝒄], [𝒅𝒆𝒍], [𝒂𝒍𝒍]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, Currencies }) => {
    const data = await api.getThreadInfo(event.threadID);
    for (const user of data.userInfo) {
        var currenciesData = await Currencies.getData(user.id)
        if (currenciesData != false) {
            var exp = currenciesData.exp;
            if (typeof exp != "undefined") {
                exp -= exp;
                await Currencies.setData(user.id, { exp });
            }
        }
    }
    return api.sendMessage("𝒔𝒐𝒃 𝒆𝒙𝒑 𝒔𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 𝒓𝒆𝒔𝒆𝒕 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒆𝒄𝒉𝒆", event.threadID);
}
