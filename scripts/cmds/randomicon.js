const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
	name: "rdi", // Command name
	version: "0.0.2",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Creator
	description: "𝑺𝒍𝒐𝒕 𝑴𝒂𝒄𝒉𝒊𝒏𝒆 𝑮𝒂𝒎𝒆",
	category: "game-sp", // Single player games
	usages: "rdi [bet amount]",
	cooldowns: 5,
	dependencies: {
		"canvas": ""
	}
};

module.exports.languages = {
	bn: {
		noBet: "𝑨𝒑𝒏𝒊 𝒃𝒆𝒕 𝒂𝒎𝒐𝒖𝒏𝒕 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒆𝒏 𝒏𝒂𝒊!",
		notNumber: "𝑨𝒑𝒏𝒂𝒓 𝒃𝒆𝒕 𝒂𝒎𝒐𝒖𝒏𝒕 𝒆𝒌𝒕𝒊 𝒏𝒖𝒎𝒃𝒆𝒓 𝒏𝒂!",
		tooLow: "𝑨𝒑𝒏𝒂𝒓 𝒃𝒆𝒕 𝒂𝒎𝒐𝒖𝒏𝒕 𝒌𝒉𝒖𝒃 𝒌𝒐𝒎, 𝒏𝒊𝒎𝒏𝒆𝒓𝒎𝒐 𝒃𝒆𝒕 𝟏𝟎𝟎 𝒕𝒂𝒌𝒂!",
		notEnough: "𝑨𝒑𝒏𝒂𝒓 𝒕𝒂𝒌𝒂 𝒑𝒂𝒓𝒕𝒆𝒔𝒆 𝒏𝒂!",
		winJackpot: "🎉 𝑱𝒂𝒄𝒌𝒑𝒐𝒕! 💰 𝑨𝒑𝒏𝒊 𝒑𝒂𝒃𝒆𝒏 %1 𝒕𝒂𝒌𝒂!",
		winSmall: "✨ 𝑨𝒑𝒏𝒊 𝒋𝒊𝒕𝒆𝒄𝒉𝒆𝒏! 💰 𝑨𝒑𝒏𝒊 𝒑𝒂𝒃𝒐 %1 𝒕𝒂𝒌𝒂!",
		lose: "😢 𝑨𝒑𝒏𝒊 𝒉𝒂𝒓𝒊𝒆𝒄𝒉𝒆𝒏! %1 𝒕𝒂𝒌𝒂 𝒉𝒂𝒓𝒂𝒍𝒆𝒏!",
		slotTitle: "🎰 𝑺𝒍𝒐𝒕 𝑴𝒂𝒄𝒉𝒊𝒏𝒆"
	},
	en: {
		noBet: "You didn't enter a bet amount!",
		notNumber: "Your bet amount is not a valid number!",
		tooLow: "Your bet amount is too low. Minimum bet is 100 taka!",
		notEnough: "You don't have enough money!",
		winJackpot: "🎉 Jackpot! 💰 You win %1 taka!",
		winSmall: "✨ You win! 💰 You get %1 taka!",
		lose: "😢 You lost! You lost %1 taka!",
		slotTitle: "🎰 Slot Machine"
	}
};

module.exports.onStart = async function({ api, event, args, Currencies, getText }) {
	const { threadID, messageID, senderID } = event;
	const minBet = 100;
	const slotItems = ["🚀","⏳","👓","🔦","💡","🕯️","🥽","🎲","🔥","🔔","🏺","🍆","🐣"];
	let money = (await Currencies.getData(senderID)).money;
	let coin = args[0];

	// Input validations
	if (!coin) return api.sendMessage(getText("noBet"), threadID, messageID);
	if (isNaN(coin) || coin < 0) return api.sendMessage(getText("notNumber"), threadID, messageID);
	coin = parseInt(coin);
	if (coin < minBet) return api.sendMessage(getText("tooLow"), threadID, messageID);
	if (coin > money) return api.sendMessage(getText("notEnough"), threadID, messageID);

	// Roll slot numbers
	let number = [];
	for (let i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);

	let winType = 0; // 0=lose, 1=small win, 2=jackpot
	let winnings = 0;
	if (number[0] === number && number === number) {
		winType = 2;
		winnings = coin * 9;
		await Currencies.increaseMoney(senderID, winnings);
	} else if (number === number || number === number || number === number) {
		winType = 1;
		winnings = coin * 2;
		await Currencies.increaseMoney(senderID, winnings);
	} else {
		winType = 0;
		await Currencies.decreaseMoney(senderID, coin);
		winnings = coin;
	}

	// Prepare slot display
	const slotResult = `${slotItems[number]} │ ${slotItems[number]} │ ${slotItems[number]}`;
	let msg;
	if (winType === 2) {
		msg = `${getText("slotTitle")}
${slotResult}\n
${getText("winJackpot", winnings)}`;
	} else if (winType === 1) {
		msg = `${getText("slotTitle")}
${slotResult}\n
${getText("winSmall", winnings)}`;
	} else {
		msg = `${getText("slotTitle")}
${slotResult}\n
${getText("lose", winnings)}`;
	}

	// Canvas
	try {
		const canvasWidth = 550, canvasHeight = 250;
		const canvas = createCanvas(canvasWidth, canvasHeight);
		const ctx = canvas.getContext('2d');
		// Background
		ctx.fillStyle = "#23282e";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		// Slot banner
		ctx.font = "bold 36px Arial";
		ctx.fillStyle = "#ffcb05";
		ctx.textAlign = "center";
		ctx.fillText(getText("slotTitle"), canvasWidth/2, 60);
		// Slot symbols
		ctx.font = "bold 60px Arial";
		ctx.fillStyle = "#fff";
		ctx.fillText(slotItems[number[0]], 150, 140);
		ctx.fillText(slotItems[number], 275, 140);
		ctx.fillText(slotItems[number], 400, 140);
		// Win/Lose message
		ctx.font = "bold 29px Arial";
		ctx.fillStyle = (winType ? "#55e460" : "#de2e2e");
		ctx.fillText(
			(winType === 2 ? getText("winJackpot", winnings) : winType === 1 ? getText("winSmall", winnings) : getText("lose", winnings)),
			canvasWidth/2, 210
		);
		const fs = require('fs-extra');
		const path = __dirname + `/cache/slot_${senderID}.png`;
		const buffer = canvas.toBuffer('image/png');
		fs.writeFileSync(path, buffer);
		api.sendMessage({ body: msg, attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID);
	} catch (e) {
		return api.sendMessage(msg, threadID, messageID);
	}
};
