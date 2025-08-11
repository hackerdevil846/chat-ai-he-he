module.exports.config = {
	name: "help",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑩𝒐𝒕 𝒆𝒓 𝒔𝒐𝒃 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒆𝒓 𝒍𝒊𝒔𝒕",
	commandCategory: "𝒔𝒚𝒔𝒕𝒆𝒎",
	usages: "[𝑴𝒐𝒅𝒖𝒍𝒆 𝒏𝒂𝒎𝒆]",
	cooldowns: 1,
	envConfig: {
		autoUnsend: true,
		delayUnsend: 300
	}
};

module.exports.languages = {
	"en": {
		"moduleInfo": "「 %1 」\n%2\n\n❯ 𝑼𝒔𝒂𝒈𝒆: %3\n❯ 𝑪𝒂𝒕𝒆𝒈𝒐𝒓𝒚: %4\n❯ 𝑾𝒂𝒊𝒕𝒊𝒏𝒈 𝒕𝒊𝒎𝒆: %5 𝒔𝒆𝒄𝒐𝒏𝒅(𝒔)\n❯ 𝑷𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏: %6\n\n» 𝑴𝒐𝒅𝒖𝒍𝒆 𝒄𝒐𝒅𝒆 𝒃𝒚 %7 «",
		"helpList": '[ 𝑻𝒐𝒕𝒂𝒍 %1 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒂𝒄𝒉𝒆 𝒆𝒊 𝒃𝒐𝒕 𝒆, 𝑼𝒔𝒆: "%2𝒉𝒆𝒍𝒑 𝒏𝒂𝒎𝒆𝑪𝒐𝒎𝒎𝒂𝒏𝒅" 𝒅𝒆𝒕𝒂𝒊𝒍𝒔 𝒋𝒂𝒏𝒂𝒓 𝒋𝒐𝒏𝒏𝒆! ]',
		"user": "𝑼𝒔𝒆𝒓",
        "adminGroup": "𝑨𝒅𝒎𝒊𝒏 𝒈𝒓𝒐𝒖𝒑",
        "adminBot": "𝑨𝒅𝒎𝒊𝒏 𝒃𝒐𝒕"
	}
};

module.exports.handleEvent = function ({ api, event, getText }) {
	const { commands } = global.client;
	const { threadID, messageID, body } = event;

	if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
	const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
	if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const command = commands.get(splitBody[1].toLowerCase());
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
	return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
}

module.exports.run = function({ api, event, args, getText }) {
	const { commands } = global.client;
	const { threadID, messageID } = event;
	const command = commands.get((args[0] || "").toLowerCase());
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

	if (!command) {
		const arrayInfo = [];
		const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 10;
    let i = 0;
    let msg = "";
    
    for (var [name, value] of (commands)) {
      name += ``;
      arrayInfo.push(name);
    }

    arrayInfo.sort((a, b) => a.data - b.data);
    
    const startSlice = numberOfOnePage*page - numberOfOnePage;
    i = startSlice;
    const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);
    
    for (let item of returnArray) msg += `「 ${++i} 」${prefix}${item}\n`;
    
    const header = `𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝒍𝒊𝒔𝒕 📄\n𝒕𝒚𝒑𝒆 ${prefix}𝒉𝒆𝒍𝒑 (𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒏𝒂𝒎𝒆) ✨\n󰂆 󰟯 󰟰 󰟷 󰟺 󰟵 󰟫`;
    const footer = `\n𝑷𝒂𝒈𝒆 (${page}/${Math.ceil(arrayInfo.length/numberOfOnePage)})\n`;
 
    return api.sendMessage(header + "\n\n" + msg  + footer, threadID, async (error, info) => {
			if (autoUnsend) {
				await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
				return api.unsendMessage(info.messageID);
			} else return;
		}, event.messageID);
	}

	return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
};
