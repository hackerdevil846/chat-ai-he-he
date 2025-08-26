const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports.config = {
	name: "osu",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Get stylish osu! player information with canvas",
	category: "𝑔𝑎𝑚𝑒",
	usages: "[𝒖𝒔𝒆𝒓𝒏𝒂𝒎𝒆]",
	cooldowns: 10,
	dependencies: {
		"axios": "",
		"canvas": "",
		"fs-extra": ""
	},
	envConfig: {
		SIGNATURE_API: "http://lemmmy.pw/osusig/sig.php"
	}
};

module.exports.onStart = async function({ api, event, args }) {
	const { envConfig } = global.config;
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];
	
	if (!args[0]) {
		return api.sendMessage("⚡ Please enter an osu! username!", event.threadID, event.messageID);
	}

	try {
		const username = encodeURIComponent(args.join(" "));
		const sigUrl = `${envConfig.SIGNATURE_API}?colour=hex8866ee&uname=${username}&pp=1&countryrank&rankedscore&onlineindicator=undefined&xpbar&xpbarhex`;
		
		// Download signature image
		const sigPath = __dirname + `/cache/${event.senderID}-osu.png`;
		const response = await axios({ url: sigUrl, method: 'GET', responseType: 'stream' });
		const writer = fs.createWriteStream(sigPath);
		response.data.pipe(writer);
		
		await new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		});

		// Create stylish canvas
		const bgPath = __dirname + "/assets/osu-bg.png";
		const canvas = createCanvas(700, 350);
		const ctx = canvas.getContext('2d');
		
		// Load background
		const bg = await loadImage(bgPath);
		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
		
		// Load signature
		const signature = await loadImage(sigPath);
		ctx.drawImage(signature, 50, 150, 600, 150);
		
		// Add stylish text
		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 36px 'Segoe UI'";
		ctx.textAlign = "center";
		ctx.fillText(`🎮 osu! Player Stats`, canvas.width / 2, 60);
		
		ctx.font = "28px 'Segoe UI'";
		ctx.fillStyle = "#ff66aa";
		ctx.fillText(`${args.join(" ")}`, canvas.width / 2, 110);
		
		// Add decorations
		ctx.beginPath();
		ctx.strokeStyle = "#ff66aa";
		ctx.lineWidth = 3;
		ctx.moveTo(150, 125);
		ctx.lineTo(550, 125);
		ctx.stroke();
		
		// Save final image
		const finalPath = __dirname + `/cache/${event.senderID}-osu-final.png`;
		const out = fs.createWriteStream(finalPath);
		const stream = canvas.createPNGStream();
		stream.pipe(out);
		
		await new Promise((resolve, reject) => {
			out.on('finish', resolve);
			out.on('error', reject);
		});

		// Send result
		await api.sendMessage({
			body: `🌟 𝙊𝙎𝙐! 𝙋𝙇𝘼𝙔𝙀𝙍 𝙄𝙉𝙁𝙊 🌟\n🎮 𝙐𝙨𝙚𝙧𝙣𝙖𝙢𝙚: ${args.join(" ")}\n🔗 𝙋𝙧𝙤𝙛𝙞𝙡𝙚: https://osu.ppy.sh/users/${username}`,
			attachment: fs.createReadStream(finalPath)
		}, event.threadID);

		// Clean up
		fs.unlinkSync(sigPath);
		fs.unlinkSync(finalPath);
		
	} catch (error) {
		console.error(error);
		return api.sendMessage("❌ Error: Please check username and try again!", event.threadID, event.messageID);
	}
};
