const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports.config = {
	name: "coin",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒏𝒊𝒋𝒆𝒓 𝒃𝒂 𝒕𝒂𝒈 𝒌𝒐𝒓𝒂 𝒍𝒐𝒌𝒆𝒓 𝒕𝒂𝒌𝒂 𝒅𝒆𝒌𝒉𝒐",
	commandCategory: "𝑒𝒄𝒐𝒏𝒐𝒎𝒚",
	usages: "[𝒕𝒂𝒈]",
	cooldowns: 5,
	dependencies: {
		"canvas": ""
	}
};

module.exports.run = async function({ api, event, args, Users, Currencies }) {
	const { threadID, messageID, senderID, mentions } = event;
	
	async function createCoinImage(name, money, avatarURL) {
		const canvas = createCanvas(600, 350);
		const ctx = canvas.getContext('2d');
		
		// Background gradient
		const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
		gradient.addColorStop(0, '#2c3e50');
		gradient.addColorStop(1, '#4ca1af');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		// Decorative elements
		ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
		for (let i = 0; i < 20; i++) {
			const radius = Math.random() * 30 + 10;
			const x = Math.random() * canvas.width;
			const y = Math.random() * canvas.height;
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.fill();
		}
		
		// User avatar
		try {
			const avatar = await loadImage(avatarURL);
			ctx.save();
			ctx.beginPath();
			ctx.arc(125, 175, 80, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(avatar, 45, 95, 160, 160);
			ctx.restore();
			
			// Avatar border
			ctx.strokeStyle = '#f1c40f';
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.arc(125, 175, 85, 0, Math.PI * 2);
			ctx.stroke();
		} catch (e) {
			console.error("Error loading avatar:", e);
		}
		
		// Text styles
		ctx.fillStyle = '#ecf0f1';
		ctx.textAlign = 'center';
		
		// Title
		ctx.font = 'bold 36px "Segoe UI"';
		ctx.fillText('𝑵𝒊𝒋𝒆𝒓 𝑻𝒂𝒌𝒂 𝑺𝒕𝒂𝒕𝒖𝒔', canvas.width / 2 + 50, 100);
		
		// User name
		ctx.font = 'bold 28px "Segoe UI"';
		ctx.fillText(name, canvas.width / 2 + 50, 170);
		
		// Balance text
		ctx.font = '32px "Segoe UI"';
		ctx.fillText('Current Balance:', canvas.width / 2 + 50, 240);
		
		// Balance amount
		ctx.fillStyle = '#f1c40f';
		ctx.font = 'bold 40px "Segoe UI"';
		ctx.fillText(`$${money.toLocaleString()}`, canvas.width / 2 + 50, 300);
		
		// Decorative coins
		ctx.fillStyle = 'rgba(241, 196, 15, 0.6)';
		for (let i = 0; i < 5; i++) {
			const size = Math.random() * 30 + 20;
			const x = Math.random() * 400 + 200;
			const y = Math.random() * 100;
			ctx.beginPath();
			ctx.arc(x, y, size/2, 0, Math.PI * 2);
			ctx.fill();
			
			ctx.fillStyle = 'rgba(230, 126, 34, 0.8)';
			ctx.beginPath();
			ctx.arc(x, y, size/3, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = 'rgba(241, 196, 15, 0.6)';
		}
		
		const imagePath = path.join(__dirname, 'cache', `coin_${Date.now()}.png`);
		fs.writeFileSync(imagePath, canvas.toBuffer());
		return imagePath;
	}
	
	try {
		if (!args[0]) {
			// Self balance
			const money = (await Currencies.getData(senderID)).money || 0;
			const userInfo = await Users.getData(senderID);
			const avatarURL = userInfo.avatarUrl || 'https://i.imgur.com/8nLFCVP.png';
			const name = userInfo.name || "User";
			
			const imagePath = await createCoinImage(name, money, avatarURL);
			return api.sendMessage({
				body: `💵 𝐘𝐨𝐮𝐫 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐁𝐚𝐥𝐚𝐧𝐜𝐞: $${money.toLocaleString()}`,
				attachment: fs.createReadStream(imagePath)
			}, threadID, () => fs.unlinkSync(imagePath), messageID);
		}
		
		// Mentioned user
		if (Object.keys(mentions).length !== 1) 
			return api.sendMessage("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒂𝒈 𝒐𝒏𝒍𝒚 𝒐𝒏𝒆 𝒖𝒔𝒆𝒓!", threadID, messageID);
		
		const mentionID = Object.keys(mentions)[0];
		const money = (await Currencies.getData(mentionID)).money || 0;
		const userInfo = await Users.getData(mentionID);
		const avatarURL = userInfo.avatarUrl || 'https://i.imgur.com/8nLFCVP.png';
		const name = mentions[mentionID].replace('@', '');
		
		const imagePath = await createCoinImage(name, money, avatarURL);
		api.sendMessage({
			body: `💳 ${name}'𝐬 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐁𝐚𝐥𝐚𝐧𝐜𝐞: $${money.toLocaleString()}`,
			mentions: [{ tag: name, id: mentionID }],
			attachment: fs.createReadStream(imagePath)
		}, threadID, () => fs.unlinkSync(imagePath), messageID);
		
	} catch (error) {
		console.error(error);
		api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒄𝒐𝒊𝒏 𝒄𝒐𝒎𝒎𝒂𝒏𝒅", threadID, messageID);
	}
};
