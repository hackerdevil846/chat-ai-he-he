const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");
const request = require("node-superfetch");
const Canvas = require("canvas");

module.exports.config = {
	name: "rank",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑮𝒓𝒖𝒑 𝒆𝒓 𝒎𝒆𝒎𝒃𝒆𝒓𝒅𝒆𝒓𝒆𝒓 𝒓𝒂𝒏𝒌 𝒅𝒆𝒌𝒉𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
	commandCategory: "𝑮𝒓𝒐𝒖𝒑",
	usages: "[user] or [tag]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
		"path": "",
		"jimp": "",
		"node-superfetch": "",
		"canvas": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"rankcard": "✨ 𝐘𝐨𝐮𝐫 𝐑𝐚𝐧𝐤 𝐂𝐚𝐫𝐝 ✨",
		"processing": "🔄 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐫𝐚𝐧𝐤 𝐜𝐚𝐫𝐝...",
		"error": "❌ 𝐄𝐫𝐫𝐨𝐫: 𝐔𝐬𝐞𝐫 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝 𝐢𝐧 𝐫𝐚𝐧𝐤𝐢𝐧𝐠 𝐬𝐲𝐬𝐭𝐞𝐦"
	}
};

const expToLevel = (point) => point < 0 ? 0 : Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2;
const levelToExp = (level) => level <= 0 ? 0 : 3 * level * (level - 1);

async function circle(image) {
	image = await jimp.read(image);
	image.circle();
	return await image.getBufferAsync("image/png");
}

async function getInfo(uid, Currencies) {
	const point = (await Currencies.getData(uid))?.exp || 0;
	const level = expToLevel(point);
	return {
		level,
		expCurrent: point - levelToExp(level),
		expNextLevel: levelToExp(level + 1) - levelToExp(level)
	};
}

async function makeRankCard(data) {
	const { id, name, rank, level, expCurrent, expNextLevel } = data;
	const __root = path.resolve(__dirname, "cache");
	const PI = Math.PI;
	
	Canvas.registerFont(path.join(__root, "regular-font.ttf"), {
		family: "Manrope",
		weight: "regular",
		style: "normal"
	});
	
	Canvas.registerFont(path.join(__root, "bold-font.ttf"), {
		family: "Manrope",
		weight: "bold",
		style: "normal"
	});

	const pathCustom = path.resolve(__dirname, "cache", "customrank");
	let dirImage = path.join(__root, "rankcard.png");
	
	if (fs.existsSync(pathCustom)) {
		const customFiles = fs.readdirSync(pathCustom);
		for (const file of customFiles) {
			const [minStr, maxStr] = file.replace('.png', '').split('-');
			const min = parseInt(minStr);
			const max = parseInt(maxStr || minStr);
			
			if (level >= min && level <= max) {
				dirImage = path.join(pathCustom, file);
				break;
			}
		}
	}

	const rankCard = await Canvas.loadImage(dirImage);
	const pathImg = path.join(__root, `rank_${id}.png`);
	let expWidth = (expCurrent * 610) / expNextLevel;
	if (expWidth > 590.5) expWidth = 590.5;
	
	const avatar = await circle(
		(await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body
	);

	const canvas = Canvas.createCanvas(1000, 282);
	const ctx = canvas.getContext("2d");

	ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(await Canvas.loadImage(avatar), 70, 75, 150, 150);

	// Stylish text rendering
	ctx.font = "bold 36px Manrope";
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "start";
	ctx.fillText(name, 270, 164);
	
	ctx.font = "42px Manrope";
	ctx.fillStyle = "#FF7F24";
	ctx.textAlign = "center";

	// Level with gradient
	const levelGradient = ctx.createLinearGradient(800, 50, 900, 100);
	levelGradient.addColorStop(0, "#FF0000");
	levelGradient.addColorStop(1, "#FF4500");
	ctx.font = "bold 38px Manrope";
	ctx.fillStyle = levelGradient;
	ctx.textAlign = "end";
	ctx.fillText(level, 934 - 68, 82);
	ctx.fillStyle = "#FFD700";
	ctx.fillText("Lv.", 934 - 55 - ctx.measureText(level).width - 10, 82);

	// Rank with shiny effect
	ctx.font = "bold 39px Manrope";
	ctx.fillStyle = "#00BFFF";
	ctx.textAlign = "end";
	ctx.fillText(rank, 934 - 55 - ctx.measureText(level).width - 16 - ctx.measureText(`Lv.`).width - 25, 82);
	ctx.fillStyle = "#1E90FF";
	ctx.fillText("#", 934 - 55 - ctx.measureText(level).width - 16 - ctx.measureText(`Lv.`).width - 16 - ctx.measureText(rank).width - 16, 82);

	// Experience with glow effect
	ctx.shadowColor = "rgba(0, 191, 255, 0.8)";
	ctx.shadowBlur = 10;
	ctx.font = "bold 40px Manrope";
	ctx.fillStyle = "#1874CD";
	ctx.textAlign = "start";
	ctx.fillText("/ " + expNextLevel, 710 + ctx.measureText(expCurrent).width + 10, 164);
	ctx.fillStyle = "#00BFFF";
	ctx.fillText(expCurrent, 710, 164);
	ctx.shadowBlur = 0;

	// Animated progress bar
	ctx.beginPath();
	const gradient = ctx.createLinearGradient(275, 200, 900, 220);
	gradient.addColorStop(0, "#FF8C00");
	gradient.addColorStop(1, "#FFD700");
	ctx.fillStyle = gradient;
	ctx.arc(257 + 18.5, 202, 18.5, 1.5 * PI, 0.5 * PI, true);
	ctx.fill();
	ctx.fillRect(257 + 18.5, 183.5, expWidth, 37.5);
	ctx.arc(257 + 18.5 + expWidth, 202, 18.75, 1.5 * PI, 0.5 * PI, false);
	ctx.fill();

	// Add decorative elements
	ctx.strokeStyle = "rgba(255, 215, 0, 0.5)";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(145, 150, 85, 0, 2 * Math.PI);
	ctx.stroke();

	// Save and return
	fs.writeFileSync(pathImg, canvas.toBuffer());
	return pathImg;
}

module.exports.onLoad = async function() {
	const { downloadFile } = global.utils;
	const __root = path.resolve(__dirname, "cache");
	
	if (!fs.existsSync(path.join(__root, "customrank"))) {
		fs.mkdirSync(path.join(__root, "customrank"), { recursive: true });
	}

	const files = [
		{ url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/regular-font.ttf", path: "regular-font.ttf" },
		{ url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/bold-font.ttf", path: "bold-font.ttf" },
		{ url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/rank_card/rankcard.png", path: "rankcard.png" }
	];

	for (const file of files) {
		const filePath = path.join(__root, file.path);
		if (!fs.existsSync(filePath)) {
			await downloadFile(file.url, filePath);
			console.log(`Downloaded ${file.path}`);
		}
	}
};

module.exports.run = async function({ event, api, args, Currencies, Users }) {
	try {
		const { threadID, messageID, senderID } = event;
		const dataAll = (await Currencies.getAll(["userID", "exp"])).filter(item => item.exp > 0);
		
		dataAll.sort((a, b) => b.exp - a.exp);
		
		const getTargetIDs = () => {
			if (args.length === 0) return [senderID];
			return Object.keys(event.mentions).length > 0 
				? Object.keys(event.mentions) 
				: [senderID];
		};

		const targetIDs = getTargetIDs();
		
		for (const userID of targetIDs) {
			const rankIndex = dataAll.findIndex(item => parseInt(item.userID) === parseInt(userID));
			if (rankIndex === -1) {
				api.sendMessage(this.languages.en.error, threadID, messageID);
				continue;
			}
			
			const rank = rankIndex + 1;
			const name = global.data.userName.get(userID) || await Users.getNameUser(userID);
			const pointInfo = await getInfo(userID, Currencies);
			
			api.sendMessage(this.languages.en.processing, threadID, messageID);
			const timeStart = Date.now();
			
			const pathRankCard = await makeRankCard({
				id: userID,
				name,
				rank,
				...pointInfo
			});
			
			api.sendMessage({
				body: `✨ 𝐘𝐨𝐮𝐫 𝐑𝐚𝐧𝐤 𝐂𝐚𝐫𝐝 ✨\n⏱️ 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐢𝐧 ${Date.now() - timeStart}𝐦𝐬`,
				attachment: fs.createReadStream(pathRankCard)
			}, threadID, () => fs.unlinkSync(pathRankCard), messageID);
		}
	} catch (error) {
		console.error(error);
		api.sendMessage("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐫𝐚𝐧𝐤 𝐜𝐚𝐫𝐝", event.threadID, event.messageID);
	}
};
