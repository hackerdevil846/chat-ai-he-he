module.exports.config = {
	name: "nsfw",
	version: "1.0.1",
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🔞 NSFW command toggle for groups",
	commandCategory: "⚙️ System",
	usages: "[on/off]",
	cooldowns: 5,
	dependencies: {}
};

module.exports.languages = {
	"en": {
		"returnSuccessEnable": "✅ | NSFW commands enabled!\n━━━━━━━━━━━━━━\n🔞 Now active in this group",
		"returnSuccessDisable": "⛔ | NSFW commands disabled!\n━━━━━━━━━━━━━━\n🚫 Restricted in this group",
		"error": "❌ | Error occurred!\nPlease try again later"
	}
};

module.exports.run = async function ({ event, api, Threads, getText }) {
    const { threadID, messageID } = event;
    const { getData, setData } = Threads;
    let type;

    try {
        let data = (await getData(threadID)).data || {};
        if (!data.hasOwnProperty("NSFW") || data.NSFW === false) {
            // Enable NSFW
            data.NSFW = true;
            global.data.threadAllowNSFW = global.data.threadAllowNSFW || [];
            if (!global.data.threadAllowNSFW.includes(threadID)) {
                global.data.threadAllowNSFW.push(parseInt(threadID));
            }
            type = "on";
        } else {
            // Disable NSFW
            data.NSFW = false;
            global.data.threadAllowNSFW = global.data.threadAllowNSFW.filter(item => item != threadID);
            type = "off";
        }
        
        await setData(threadID, { data });
        return api.sendMessage(
            type === "on" 
                ? getText("returnSuccessEnable") 
                : getText("returnSuccessDisable"),
            threadID,
            messageID
        );
    } catch (e) { 
        console.error("NSFW Command Error:", e);
        return api.sendMessage(getText("error"), threadID, messageID);
    }
};
