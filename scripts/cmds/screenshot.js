module.exports.config = {
	name: "screenshot",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑬𝒌𝒕𝒊 𝒘𝒆𝒃𝒔𝒂𝒊𝒕𝒆𝒓 𝒔𝒌𝒓𝒊𝒏𝒔𝒉𝒐𝒕 𝒏𝒊𝒚𝒆 (𝑵𝑺𝑭𝑾 𝑷𝑨𝑮𝑬 𝒂𝒍𝒍𝒐𝒘 𝒏𝒆𝒊)",
	commandCategory: "𝑨𝒏𝒚𝒂",
	usages: "[url site]",
	cooldowns: 5,
	dependencies: {
        "fs-extra": "",
        "path": "",
        "url": ""
    }
};

module.exports.onLoad = async () => {
    const { existsSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];

    const path = resolve(__dirname, "cache", "pornlist.txt");

    if (!existsSync(path)) return await global.utils.downloadFile("https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt", path);
    else return;
}

module.exports.run = async ({ event, api, args, }) => {
    const { readFileSync, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
    const url = global.nodemodule["url"];

    if (!global.moduleData.pornList) global.moduleData.pornList = readFileSync(__dirname + "/cache/pornlist.txt", "utf-8").split('\n').filter(site => site && !site.startsWith('#')).map(site => site.replace(/^(0.0.0.0 )/, ''));
    const urlParsed = url.parse(args[0]);

    if (global.moduleData.pornList.some(pornURL => urlParsed.host == pornURL)) return api.sendMessage("𝑨𝒑𝒏𝒊 𝒅𝒂𝒌𝒉𝒂𝒏𝒐 𝒔𝒂𝒊𝒕𝒆𝒕𝒊 𝒏𝒊𝒓𝒂𝒑𝒂𝒅𝒅𝒂 𝒏𝒐𝒚!!(𝑵𝑺𝑭𝑾 𝑷𝑨𝑮𝑬)", event.threadID, event.messageID);

    try {
        const path = __dirname + `/cache/${event.threadID}-${event.senderID}s.png`;
        await global.utils.downloadFile(`https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${args[0]}`, path);
        api.sendMessage({ attachment: createReadStream(path) }, event.threadID, () => unlinkSync(path));
    }
    catch {
        return api.sendMessage("𝑬𝒊 𝒖𝒓𝒍𝒕𝒊 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂, 𝒇𝒐𝒓𝒎𝒂𝒕 𝒕𝒉𝒊𝒌 𝒂𝒄𝒄𝒉𝒆 𝒏𝒂 𝒌𝒊? (𝑺𝒂𝒉𝒂𝒚𝒚𝒂: 𝒔𝒄𝒓𝒆𝒆𝒏𝒔𝒉𝒐𝒕 [𝒖𝒓𝒍])", event.threadID, event.messageID);
    }
}
