module.exports.config = {
	name: "quiz",
	version: "1.0.0",
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	hasPermssion: 0,
	description: "𝑸𝒖𝒊𝒛 𝒌𝒉𝒆𝒍𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 (𝑬𝒏𝒈𝒍𝒊𝒔𝒉)",
	commandCategory: "khela",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.handleReaction = ({ api, event, handleReaction }) => {
	if (event.userID !== handleReaction.author) return;
	let response = "";
	if (event.reaction == "👍") response = "True";
	else if (event.reaction == "😢") response = "False";
	
	if (response === handleReaction.answer) 
		api.sendMessage("𝑨𝒃𝒂𝒓, 𝒕𝒖𝒎𝒊 𝒕𝒉𝒊𝒌 𝒖𝒕𝒕𝒐𝒓 𝒅𝒊𝒍𝒆! 😄", event.threadID);
	else 
		api.sendMessage("𝑯𝒂𝒚 𝒓𝒆, 𝒕𝒖𝒎𝒊 𝒗𝒖𝒍 𝒖𝒕𝒕𝒐𝒓 𝒅𝒊𝒍𝒆 😢", event.threadID);
	
	const indexOfHandle = global.client.handleReaction.findIndex(e => e.messageID === handleReaction.messageID);
	if (indexOfHandle !== -1) {
		global.client.handleReaction.splice(indexOfHandle, 1);
	}
};

module.exports.run = async ({ api, event, args }) => {
	const axios = global.nodemodule["axios"];
	let difficulties = ["easy", "medium", "hard"];
	let difficulty = args[0];
	
	if (!difficulties.includes(difficulty)) {
		difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
	}
	
	try {
		let fetch = await axios.get(`https://opentdb.com/api.php?amount=1&encode=url3986&type=boolean&difficulty=${difficulty}`);
		if (!fetch.data || !fetch.data.results || fetch.data.results.length === 0) {
			return api.sendMessage("𝑺𝒆𝒓𝒗𝒆𝒓 𝒃𝒖𝒔𝒚 𝒕𝒉𝒂𝒌𝒂𝒓 𝒑𝒓𝒐𝒔𝒏𝒐 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂 😔", event.threadID);
		}
		
		const question = decodeURIComponent(fetch.data.results[0].question);
		const correctAnswer = fetch.data.results[0].correct_answer;
		
		const message = `𝑻𝒐𝒎𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒑𝒓𝒐𝒔𝒏𝒐:\n━━━━━━━━━━━━\n「 ${question} 」\n━━━━━━━━━━━━\n\n👍: 𝑻𝒉𝒊𝒌\t\t😢: 𝑽𝒖𝒍`;
		
		return api.sendMessage(message, event.threadID, async (err, info) => {
			global.client.handleReaction.push({
				name: "quiz",
				messageID: info.messageID,
				author: event.senderID,
				answer: correctAnswer
			});
			
			await new Promise(resolve => setTimeout(resolve, 20000));
			
			const indexOfHandle = global.client.handleReaction.findIndex(e => e.messageID === info.messageID);
			if (indexOfHandle !== -1) {
				const banglaAnswer = correctAnswer === "True" ? "𝑻𝒉𝒊𝒌" : "𝑽𝒖𝒍";
				api.sendMessage(`𝑺𝒐𝒎𝒐𝒚 𝒔𝒆𝒔𝒉! 𝑻𝒉𝒊𝒌 𝒖𝒕𝒕𝒐𝒓 𝒉𝒐𝒍𝒐: ${banglaAnswer}`, event.threadID, info.messageID);
				global.client.handleReaction.splice(indexOfHandle, 1);
			}
		});
	} catch (error) {
		api.sendMessage("𝑺𝒐𝒎𝒐𝒚 𝒔𝒐𝒎𝒐𝒔𝒔𝒂 𝒉𝒐𝒍𝒆𝒄𝒉𝒆, 𝒑𝒖𝒏𝒐𝒓𝒂𝒚 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏 😓", event.threadID);
	}
};
