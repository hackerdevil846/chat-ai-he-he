const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
	name: "reload",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🔄 Bot command punararmbho korbe stylish canvas message soho",
	commandCategory: "𝑷𝒆𝒏𝒈𝒖𝒊𝒏",
	usages: "reload [somoy]",
	cooldowns: 5,
	dependencies: {
		"canvas": "^2.12.0"
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {},
	"bn": {}
};

module.exports.run = async ({ api, event, args }) => {
	const { threadID, messageID, senderID } = event;
	const GOD = global.config.GOD || [];

	if (!GOD.includes(senderID)) {
		return api.sendMessage("⚠️ Apnar ei command babohar sompotto nei!", threadID, messageID);
	}

	// Time calculation
	let time = args.join(" ");
	const rstime = time && !isNaN(time) ? parseInt(time) : 69;

	// Canvas setup
	const canvas = createCanvas(600, 250);
	const ctx = canvas.getContext("2d");

	// Background
	ctx.fillStyle = "#1a1a1a";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Stylish text
	ctx.fillStyle = "#00ffea";
	ctx.font = "bold 32px Sans";
	ctx.textAlign = "center";
	ctx.fillText("🤖 BOT RELOADING...", canvas.width / 2, 80);

	ctx.fillStyle = "#ffffff";
	ctx.font = "22px Sans";
	ctx.fillText(`Punararmbho hobe ${rstime} second por ⏳`, canvas.width / 2, 140);

	ctx.font = "18px Sans";
	ctx.fillText("⚡ Stay tuned!", canvas.width / 2, 200);

	const buffer = canvas.toBuffer();

	// Send stylish canvas image
	api.sendMessage({ attachment: buffer }, threadID, async () => {
		// Timeout for restart
		setTimeout(() => {
			api.sendMessage("✅ Bot punararmbho hocche...", threadID, () => process.exit(1));
		}, rstime * 1000);
	});
};
