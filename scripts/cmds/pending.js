module.exports.config = {
	name: "pending",
	version: "1.1.0",
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	hasPermssion: 2,
	description: "𝑩𝒐𝒕 𝒆𝒓 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒎𝒂𝒏𝒂𝒈𝒆 𝒌𝒐𝒓𝒂",
	commandCategory: "system",
	usages: "[approve/reject] [numbers]",
	cooldowns: 5,
	dependencies: {
		"canvas": "",
		"fs-extra": ""
	}
};

module.exports.languages = {
	"en": {
		"invaildNumber": "❌ | %1 𝒆𝒌𝒕𝒂 𝒔𝒂𝒕𝒉𝒊𝒌 𝒏𝒂𝒎𝒃𝒂𝒓 𝒏𝒂!",
		"cancelSuccess": "❌ | %1 𝒕𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒓𝒆𝒋𝒆𝒄𝒕 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!",
		"notiBox": "🌟 | 𝑩𝒐𝑻 𝒔𝒂𝒕𝒉𝒊𝒌𝒃𝒉𝒂𝒃𝒆 𝒄𝒐𝒏𝒏𝒆𝒄𝒕 𝒉𝒐𝒍𝒐!\n𝑨𝒓𝒐 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒔𝒉𝒐𝒏 𝒋𝒂𝒏𝒕𝒆 +𝒉𝒆𝒍𝒑 𝒕𝒂𝒊𝒑 𝒌𝒐𝒓𝒖𝒏",
		"approveSuccess": "✅ | %1 𝒕𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒂𝒑𝒑𝒓𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!",
		"cantGetPendingList": "⚠️ | 𝑷𝒆𝒏𝒅𝒊𝒏𝒈 𝒍𝒊𝒔𝒕 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂!",
		"returnListPending": "📋 | 𝑷𝒆𝒏𝒅𝒊𝒏𝒈 𝑳𝒊𝒔𝒕 (%1 𝒕𝒊 𝒕𝒉𝒓𝒆𝒂𝒅)",
		"returnListClean": "✨ | 𝑷𝒆𝒏𝒅𝒊𝒏𝒈 𝒍𝒊𝒔𝒕𝒆 𝒌𝒐𝒏𝒐 𝒕𝒉𝒓𝒆𝒂𝒅 𝒏𝒆𝒊",
		"instructions": "⚡ 𝑰𝒏𝒔𝒕𝒓𝒖𝒄𝒕𝒊𝒐𝒏𝒔:\n✅ 𝒂𝒑𝒑𝒓𝒐𝒗𝒆: 1,2,3\n❌ 𝒓𝒆𝒋𝒆𝒄𝒕: c1,2,3"
	}
};

module.exports.handleReply = async function({ api, event, handleReply, getText }) {
    if (String(event.senderID) !== String(handleReply.author)) return;
    const { body, threadID, messageID } = event;
    let count = 0;

    if (body.toLowerCase().startsWith("c") || body.toLowerCase().startsWith("cancel")) {
        const index = body.replace(/[^0-9\s]/g, '').split(/\s+/).filter(Boolean);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);
            
            api.removeUserFromGroup(api.getCurrentUserID(), handleReply.pending[singleIndex - 1].threadID);
            count++;
        }
        return api.sendMessage(getText("cancelSuccess", count), threadID, messageID);
    }
    else {
        const index = body.split(/\s+/).filter(Boolean);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);
            
            api.sendMessage(getText("notiBox"), handleReply.pending[singleIndex - 1].threadID);
            count++;
        }
        return api.sendMessage(getText("approveSuccess", count), threadID, messageID);
    }
};

module.exports.run = async function({ api, event, getText }) {
	const { createCanvas, loadImage } = require("canvas");
	const fs = require("fs-extra");
	const { threadID, messageID } = event;
	
	try {
		const spam = await api.getThreadList(100, null, ["OTHER"]) || [];
		const pending = await api.getThreadList(100, null, ["PENDING"]) || [];
		const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

		if (list.length === 0) {
			return api.sendMessage(getText("returnListClean"), threadID, messageID);
		}

		// Create stylish canvas header
		const canvas = createCanvas(800, 200);
		const ctx = canvas.getContext("2d");
		
		// Gradient background
		const gradient = ctx.createLinearGradient(0, 0, 800, 0);
		gradient.addColorStop(0, "#8A2BE2");
		gradient.addColorStop(1, "#1E90FF");
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 800, 200);
		
		// Add header text
		ctx.font = "bold 40px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.fillText("📋 PENDING THREADS", 400, 80);
		
		// Add subtitle
		ctx.font = "25px Arial";
		ctx.fillText(`${list.length} Threads Awaiting Approval`, 400, 130);
		
		// Save canvas as image
		const pathImg = __dirname + '/cache/pending_header.png';
		const buffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, buffer);
		
		// Generate thread list
		let msg = "";
		list.forEach((group, index) => {
			msg += `[ ${index + 1} ] ${group.name || "Unnamed Group"} (${group.threadID})\n`;
		});
		msg += `\n${getText("instructions")}`;
		
		// Send message with canvas header
		api.sendMessage({
			body: getText("returnListPending", list.length) + "\n\n" + msg,
			attachment: fs.createReadStream(pathImg)
		}, threadID, (err, info) => {
			fs.unlinkSync(pathImg);
			if (!err) {
				global.client.handleReply.push({
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					pending: list
				});
			}
		}, messageID);
		
	} catch (e) {
		console.error(e);
		return api.sendMessage(getText("cantGetPendingList"), threadID, messageID);
	}
};
