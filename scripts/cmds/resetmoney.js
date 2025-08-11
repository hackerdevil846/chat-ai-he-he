module.exports.config = {
    name: "resetmoney",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑮𝒓𝒖𝒑𝒆𝒓 𝒔𝒐𝒃𝒂𝒊𝒆𝒓 𝒕𝒂𝒌𝒂 𝒔𝒖𝒏𝒚𝒂𝒌𝒆 𝒔𝒆𝒕 𝒌𝒐𝒓𝒂 𝒉𝒐𝒃𝒆",
    commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "[𝒄𝒄], [𝒅𝒆𝒍], [𝒂𝒍𝒍]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, Currencies }) => {
    const data = await api.getThreadInfo(event.threadID);
    for (const user of data.userInfo) {
        var currenciesData = await Currencies.getData(user.id)
        if (currenciesData != false) {
            var money = currenciesData.money;
            if (typeof money != "undefined") {
                money -= money;
                await Currencies.setData(user.id, { money });
            }
        }
    }
    return api.sendMessage("𝑮𝒓𝒖𝒑𝒆𝒓 𝒔𝒐𝒃 𝒎𝒆𝒎𝒃𝒆𝒓𝒅𝒆𝒓 𝒆𝒓 𝒕𝒂𝒌𝒂 𝒔𝒖𝒏𝒚𝒂𝒌𝒆 𝒔𝒆𝒕 𝒉𝒐𝒍𝒆𝒄𝒉𝒆! (0)", event.threadID);
}
