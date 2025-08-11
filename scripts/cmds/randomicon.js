module.exports.config = {
	name: "rdi",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑺𝒍𝒐𝒕 𝑴𝒂𝒄𝒉𝒊𝒏𝒆 𝑮𝒂𝒎𝒆",
	commandCategory: "𝒈𝒂𝒎𝒆𝒔",
	usages: "rdi [𝒃𝒆𝒕 𝒂𝒎𝒐𝒖𝒏𝒕]",
	cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Currencies }) {
	const { threadID, messageID, senderID } = event;
	const cointt = "𝟏𝟎𝟎 𝒕𝒂𝒌𝒂";
	const slotItems = ["🚀","⏳","👓","🔦","💡","🕯️","🥽","🎲","🔥","🔔","🏺","🍆","🐣"];
	let money = (await Currencies.getData(senderID)).money;
	let coin = args.join(" ");

	if (!coin) return api.sendMessage(`𝑨𝒑𝒏𝒊 𝒃𝒆𝒕 𝒂𝒎𝒐𝒖𝒏𝒕 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒆𝒏 𝒏𝒂𝒊!`, threadID, messageID);
	if (isNaN(coin) || coin.indexOf("-") !== -1) return api.sendMessage(`𝑨𝒑𝒏𝒂𝒓 𝒃𝒆𝒕 𝒂𝒎𝒐𝒖𝒏𝒕 𝒆𝒌𝒕𝒊 𝒏𝒖𝒎𝒃𝒆𝒓 𝒏𝒂!`, threadID, messageID);
	if (coin < 100) return api.sendMessage(`𝑨𝒑𝒏𝒂𝒓 𝒃𝒆𝒕 𝒂𝒎𝒐𝒖𝒏𝒕 𝒌𝒉𝒖𝒃 𝒌𝒐𝒎, 𝒏𝒊𝒎𝒏𝒆𝒓𝒎𝒐 𝒃𝒆𝒕 ${cointt}!`, threadID, messageID);
	if (coin > money) return api.sendMessage(`𝑨𝒑𝒏𝒂𝒓 𝒕𝒂𝒌𝒂 𝒑𝒂𝒓𝒕𝒆𝒔𝒆 𝒏𝒂!`, threadID, messageID);

	let win = false;
	let number = [];
	for (let i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);

	if (number[0] === number[1] && number[1] === number[2]) {
		coin = parseInt(coin) * 9;
		await Currencies.increaseMoney(senderID, coin);
		win = true;
	} else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
		coin = parseInt(coin) * 2;
		await Currencies.increaseMoney(senderID, coin);
		win = true;
	} else {
		await Currencies.decreaseMoney(senderID, parseInt(coin));
	}

	const result = 
		`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n` +
		(win 
			? `𝑨𝒑𝒏𝒊 𝒋𝒊𝒕𝒆𝒄𝒉𝒆𝒏! 💰\n𝑨𝒑𝒏𝒊 𝒑𝒂𝒃𝒐 ${coin} 𝒕𝒂𝒌𝒂!` 
			: `𝑨𝒑𝒏𝒊 𝒉𝒂𝒓𝒊𝒆𝒄𝒉𝒆𝒏! 😢\n${coin} 𝒕𝒂𝒌𝒂 𝒉𝒂𝒓𝒂𝒍𝒆𝒏!`);

	return api.sendMessage(result, threadID, messageID);
}
