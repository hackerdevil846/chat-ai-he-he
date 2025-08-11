const fs = require("fs");
const axios = require("axios");

module.exports.config = {
	name: "groupimage",
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒊𝒎𝒂𝒈𝒆 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒐",
	commandCategory: "𝑩𝒐𝒙", 
	usages: "𝒈𝒓𝒐𝒖𝒑𝒊𝒎𝒂𝒈𝒆", 
	cooldowns: 0,
	dependencies: [] 
};

module.exports.run = async ({ api, event }) => {
	if (event.type !== "message_reply") {
		return api.sendMessage("❌ 𝑨𝒑𝒏𝒊 𝒆𝒌𝒕𝒂 𝒊𝒎𝒂𝒈𝒆 𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
	}
	
	if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
		return api.sendMessage("❌ 𝑨𝒑𝒏𝒊 𝒆𝒌𝒕𝒂 𝒊𝒎𝒂𝒈𝒆 𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
	}
	
	if (event.messageReply.attachments.length > 1) {
		return api.sendMessage("❌ 𝑬𝒌𝒕𝒂𝒓 𝒃𝒆𝒔𝒊 𝒊𝒎𝒂𝒈𝒆 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒃𝒆𝒏 𝒏𝒂! 𝑴𝒂𝒕𝒓𝒂 𝒆𝒌𝒕𝒂 𝒊𝒎𝒂𝒈𝒆 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
	}
	
	try {
		const imageUrl = event.messageReply.attachments[0].url;
		const pathImg = __dirname + '/cache/group_image_' + Date.now() + '.png';
		
		const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
		fs.writeFileSync(pathImg, Buffer.from(response.data, 'utf-8'));
		
		await api.changeGroupImage(
			fs.createReadStream(pathImg), 
			event.threadID,
			() => {
				fs.unlinkSync(pathImg);
				api.sendMessage("✅ 𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒊𝒎𝒂𝒈𝒆 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒐 𝒉𝒐𝒍𝒐!", event.threadID);
			}
		);
	} catch (error) {
		console.error(error);
		return api.sendMessage("❌ 𝑰𝒎𝒂𝒈𝒆 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏𝒐𝒓 𝒌𝒉𝒂𝒕𝒆 𝒉𝒐𝒄𝒄𝒉𝒆! 𝑨𝒃𝒂𝒓 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
	}
};
