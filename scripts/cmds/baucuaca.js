module.exports.config = {
	name: "baucuaca",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑺𝒍𝒐𝒕 𝑴𝒂𝒄𝒉𝒊𝒏𝒆 𝑮𝒂𝒎𝒆",
	commandCategory: "𝒈𝒂𝒎𝒆𝒔",
	usages: "baucuaca [𝒃𝒆𝒕 𝒂𝒎𝒐𝒖𝒏𝒕]",
	cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Currencies }) {
	const { threadID, messageID, senderID } = event;
	const slotItems = ["🦀", "🐟", "🗳️"];
	
	// Mathematical Bold Italic formatting
	const formatText = text => {
		const boldItalicMap = {
			'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉',
			'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑',
			'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙',
			'y': '𝒚', 'z': '𝒛', 'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭',
			'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵',
			'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽',
			'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
		};
		
		return text.split('').map(char => boldItalicMap[char] || char).join('');
	};

	let money = (await Currencies.getData(senderID)).money;
	let coin = parseInt(args[0]);
	
	if (!args[0]) return api.sendMessage(formatText("Please enter your bet amount!"), threadID, messageID);
	if (isNaN(coin)) return api.sendMessage(formatText("Your bet must be a number!"), threadID, messageID);
	if (coin > money) return api.sendMessage(formatText(`You don't have enough money! Current balance: ${money}$`), threadID, messageID);
	if (coin < 50) return api.sendMessage(formatText("Minimum bet is 50$!"), threadID, messageID);
	
	let number = [];
	for (let i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);
	
	let result = "";
	let winnings = 0;
	let multiplier = 1;
	
	if (number[0] === number[1] && number[1] === number[2]) {
		winnings = coin * 9;
		multiplier = 9;
		result = formatText("✨ 𝑱𝑨𝑪𝑲𝑷𝑶𝑻! ✨");
	} else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
		winnings = coin * 2;
		multiplier = 2;
		result = formatText("🎉 𝑾𝑰𝑵𝑵𝑬𝑹! 🎉");
	} else {
		winnings = 0;
		result = formatText("😢 𝑳𝑶𝑺𝑻...");
	}
	
	const slotResult = `╭──🎰───────╮
│ ${slotItems[number[0]]}  |  ${slotItems[number[1]]}  |  ${slotItems[number[2]]} │
╰────────────╯
${result}`;

	if (winnings > 0) {
		await Currencies.increaseMoney(senderID, winnings);
		const winMsg = formatText(`You won ${winnings}$!\nMultiplier: ${multiplier}x\nCurrent balance: ${money + winnings}$`);
		api.sendMessage(`${slotResult}\n${winMsg}`, threadID, messageID);
	} else {
		await Currencies.decreaseMoney(senderID, coin);
		const lossMsg = formatText(`You lost ${coin}$\nCurrent balance: ${money - coin}$`);
		api.sendMessage(`${slotResult}\n${lossMsg}`, threadID, messageID);
	}
}
