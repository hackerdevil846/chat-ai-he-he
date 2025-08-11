module.exports.config = {
	name: "bio",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
	description: "𝑩𝒐𝒕 𝒆𝒓 𝒃𝒊𝒐 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒆",
	commandCategory: "𝒂𝒅𝒎𝒊𝒏",
	usages: "bio [𝒕𝒆𝒙𝒕]",
	cooldowns: 5
}

module.exports.run = async ({ api, event, args }) => {
    const newBio = args.join(" ");
    if (!newBio) return api.sendMessage("𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒕𝒉𝒆 𝒏𝒆𝒘 𝒃𝒊𝒐 𝒕𝒆𝒙𝒕", event.threadID);

    api.changeBio(newBio, (error) => {
        if (error) {
            return api.sendMessage(`𝑬𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅: ${error.message}`, event.threadID);
        }
        api.sendMessage(`𝑩𝒐𝒕 𝒆𝒓 𝒃𝒊𝒐 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒄𝒉𝒂𝒏𝒈𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆:\n${newBio}`, event.threadID);
    });
}
