module.exports.config = {
	name: "language",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑩𝑶𝑻 𝒆𝒓 𝒍𝒂𝒏𝒈𝒖𝒂𝒈𝒆 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒖𝒏",
	commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "[𝒃𝒂𝒏𝒈𝒍𝒂] [𝒆𝒏𝒈𝒍𝒊𝒔𝒉]",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;

    switch (args[0]) {
        case "bangla":
        case "bn":
            {
                return api.sendMessage(`𝑩𝑶𝑻 𝒆𝒓 𝒍𝒂𝒏𝒈𝒖𝒂𝒈𝒆 𝑩𝒂𝒏𝒈𝒍𝒂 𝒕𝒆 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒐𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐 🇧🇩`, threadID, () => global.config.language = "bn"); 
            }
            break;
        
        case "english":
        case "en":
            {
                return api.sendMessage(`𝑩𝑶𝑻 𝒆𝒓 𝒍𝒂𝒏𝒈𝒖𝒂𝒈𝒆 𝑬𝒏𝒈𝒍𝒊𝒔𝒉 𝒕𝒆 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒐𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐 🇬🇧`, threadID, () => global.config.language = "en"); 
            }
            break;
    
        default:
            {
                return api.sendMessage("⚠️ 𝑺𝒚𝒏𝒕𝒂𝒙 𝒆𝒓𝒓𝒐𝒓, 𝒖𝒔𝒆: 𝒍𝒂𝒏𝒈𝒖𝒂𝒈𝒆 [𝒃𝒏 / 𝒆𝒏]", threadID, messageID);
            }   
            break; 
    }	
}
