module.exports.config = {
	name: "cao3la",
	version: "1.0.4",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅",
	description: "𝑩𝒂𝒊 𝑪𝒂𝒐 𝒈𝒂𝒎𝒆 𝒇𝒐𝒓 𝒈𝒓𝒐𝒖𝒑𝒔",
	category: "𝒈𝒂𝒎𝒆-𝒎𝒑",
	usages: "[𝒔𝒕𝒂𝒓𝒕/𝒋𝒐𝒊𝒏/𝒊𝒏𝒇𝒐/𝒍𝒆𝒂𝒗𝒆]",
	cooldowns: 1
};

const toBI = (text) => {
  const map = {
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆',
    f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
    k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐',
    p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
    u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚',
    z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫',
    E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰',
    J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵',
    O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺',
    T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿',
    Y: '𝒀', Z: '𝒁', 
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
};

module.exports.handleEvent = async ({ event, api, Users }) => {
	const { senderID, threadID, body, messageID } = event;

	if (typeof body == "undefined") return;
	if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
	if (!global.moduleData.baicao.has(threadID)) return;
	var values = global.moduleData.baicao.get(threadID);
	if (values.start != 1) return;

	if (body.indexOf(toBI("chia bai")) == 0) {
		if (values.chiabai == 1) return;
		for(const key in values.player) {
			const card1 = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
			const card2 = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
			const card3 = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
			var tong = (card1 + card2 + card3);
			if (tong >= 20) tong -= 20;
			if (tong >= 10) tong -= 10;
			values.player[key].card1 = card1;
			values.player[key].card2 = card2;
			values.player[key].card3 = card3;
			values.player[key].tong = tong;
			api.sendMessage(toBI(`your cards: ${card1} | ${card2} | ${card3} \n\nYour total: ${tong}`), values.player[key].id, (error, info) => {
				if (error) api.sendMessage(toBI(`Can't share cards with user: ${values.player[key].id}`), threadID)
			});
				
		}
		values.chiabai = 1;
		global.moduleData.baicao.set(threadID, values);
		return api.sendMessage(toBI("Cards have been dealt! Players can now check their cards"), threadID);
	}

	if (body.indexOf(toBI("doi bai")) == 0) {
		if (values.chiabai != 1) return;
		var player = values.player.find(item => item.id == senderID);
		if (player.doibai == 0) return api.sendMessage(toBI("You've used all your card changes"), threadID, messageID);
		if (player.ready == true) return api.sendMessage(toBI("You're already ready, can't change cards!"), threadID, messageID);
		const card = ["card1","card2","card3"];
		player[card[(Math.floor(Math.random() * card.length))]] = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
		player.tong = (player.card1 + player.card2 + player.card3);
		if (player.tong >= 20) player.tong -= 20;
		if (player.tong >= 10) player.tong -= 10;
		player.doibai -= 1;
		global.moduleData.baicao.set(values);
		return api.sendMessage(toBI(`Your new cards: ${player.card1} | ${player.card2} | ${player.card3} \n\nYour total: ${player.tong}`), player.id, (error, info) => {
			if (error) api.sendMessage(toBI(`Can't send cards to user: ${player.id}`), threadID)
		});
	}

	if (body.indexOf(toBI("ready")) == 0) {
		if (values.chiabai != 1) return;
		var player = values.player.find(item => item.id == senderID);
		if (player.ready == true) return;
		const name = await Users.getNameUser(player.id);
		values.ready += 1;
		player.ready = true;
		if (values.player.length == values.ready) {
			const player = values.player;
			player.sort(function (a, b) { return b.tong - a.tong });

			var ranking = [], num = 1;

			for (const info of player) {
				const name = await Users.getNameUser(info.id);
				ranking.push(toBI(`${num++} • ${name} with ${info.card1} | ${info.card2} | ${info.card3} => ${info.tong} points\n`));
			}

			global.moduleData.baicao.delete(threadID);
			return api.sendMessage(toBI(`Results:\n\n ${ranking.join("\n")}`), threadID);
		}
		else return api.sendMessage(toBI(`player: ${name} is ready, waiting for: ${values.player.length - values.ready} players`), event.threadID);
	}
	
	if (body.indexOf(toBI("nonready")) == 0) {
		const data = values.player.filter(item => item.ready == false);
		var msg = [];

		for (const info of data) {
			const name = global.data.userName.get(info.id) || await Users.getNameUser(info.id);
			msg.push(name);
		}
		if (msg.length != 0) return api.sendMessage(toBI("Players not ready: " + msg.join(", ")), threadID);
		else return;
	}
}

module.exports.run = async ({ api, event, args }) => {
	var { senderID, threadID, messageID } = event;

	threadID = String(threadID);
	senderID = String(senderID);
	
	if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
	var values = global.moduleData.baicao.get(threadID) || {};

	switch (args[0]) {
		case "create":
		case "-c": {
			if (global.moduleData.baicao.has(threadID)) return api.sendMessage(toBI("A game is already running in this group"), threadID, messageID);
			global.moduleData.baicao.set(event.threadID, { "author": senderID, "start": 0, "chiabai": 0, "ready": 0, player: [ { "id": senderID, "card1": 0, "card2": 0, "card3": 0, "doibai": 2, "ready": false } ] });
			return api.sendMessage(toBI("Game created! Players can join with 'cao3la join'"), threadID, messageID);
		}
		
		case "join":
		case "-j": {
			if (!values) return api.sendMessage(toBI("No game running. Create one with 'cao3la create'"), threadID, messageID);
			if (values.start == 1) return api.sendMessage(toBI("Game has already started"), threadID, messageID);
			if (values.player.find(item => item.id == senderID)) return api.sendMessage(toBI("You've already joined the game"), threadID, messageID);
			values.player.push({ "id": senderID, "card1": 0, "card2": 0, "card3": 0, "tong": 0, "doibai": 2, "ready": false });
			global.moduleData.baicao.set(threadID, values);
			return api.sendMessage(toBI("You've joined the game!"), threadID, messageID);
		}

		case "leave":
		case "-l": {
			if (typeof values.player == "undefined") return api.sendMessage(toBI("No game running. Create one with 'cao3la create'"), threadID, messageID);
			if (!values.player.some(item => item.id == senderID)) return api.sendMessage(toBI("You're not in this game"), threadID, messageID);
			if (values.start == 1) return api.sendMessage(toBI("Game has already started"), threadID, messageID);
			if (values.author == senderID) {
				global.moduleData.baicao.delete(threadID);
				api.sendMessage(toBI("Game creator left. Game ended!"), threadID, messageID);
			}
			else {
				values.player.splice(values.player.findIndex(item => item.id === senderID), 1);
				api.sendMessage(toBI("You've left the game"), threadID, messageID);
				global.moduleData.baicao.set(threadID, values);
			}
			return;
		}

		case "start":
		case "-s": {
			if (!values) return api.sendMessage(toBI("No game running. Create one with 'cao3la create'"), threadID, messageID);
			if (values.author !== senderID) return api.sendMessage(toBI("Only game creator can start"), threadID, messageID);
			if (values.player.length <= 1) return api.sendMessage(toBI("Not enough players to start"), threadID, messageID);
			if (values.start == 1) return api.sendMessage(toBI("Game already started"), threadID, messageID);
			values.start = 1;
			return api.sendMessage(toBI("Game started!"), threadID, messageID);
		}

		case "info":
		case "-i": {
			if (typeof values.player == "undefined") return api.sendMessage(toBI("No game running. Create one with 'cao3la create'"), threadID, messageID);
			return api.sendMessage(toBI(
				"=== 𝑩𝒂𝒊 𝑪𝒂𝒐 𝑮𝒂𝒎𝒆 ===" +
				"\n- 𝑪𝒓𝒆𝒂𝒕𝒐𝒓: " + values.author +
				"\n- 𝑷𝒍𝒂𝒚𝒆𝒓𝒔: " + values.player.length + " 𝒑𝒍𝒂𝒚𝒆𝒓𝒔"
			), threadID, messageID);
		}

		default: {
			const helpMessage = toBI(
				"𝑩𝒂𝒊 𝑪𝒂𝒐 𝑮𝒂𝒎𝒆 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔:\n" +
				"𝒄𝒓𝒆𝒂𝒕𝒆/-𝒄: 𝑪𝒓𝒆𝒂𝒕𝒆 𝒂 𝒏𝒆𝒘 𝒈𝒂𝒎𝒆\n" +
				"𝒋𝒐𝒊𝒏/-𝒋: 𝑱𝒐𝒊𝒏 𝒄𝒖𝒓𝒓𝒆𝒏𝒕 𝒈𝒂𝒎𝒆\n" +
				"𝒍𝒆𝒂𝒗𝒆/-𝒍: 𝑳𝒆𝒂𝒗𝒆 𝒕𝒉𝒆 𝒈𝒂𝒎𝒆\n" +
				"𝒔𝒕𝒂𝒓𝒕/-𝒔: 𝑺𝒕𝒂𝒓𝒕 𝒕𝒉𝒆 𝒈𝒂𝒎𝒆\n" +
				"𝒊𝒏𝒇𝒐/-𝒊: 𝑺𝒉𝒐𝒘 𝒈𝒂𝒎𝒆 𝒊𝒏𝒇𝒐\n\n" +
				"𝑮𝒂𝒎𝒆 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔:\n" +
				"𝒄𝒉𝒊𝒂 𝒃𝒂𝒊: 𝑫𝒆𝒂𝒍 𝒄𝒂𝒓𝒅𝒔\n" +
				"𝒅𝒐𝒊 𝒃𝒂𝒊: 𝑪𝒉𝒂𝒏𝒈𝒆 𝒄𝒂𝒓𝒅𝒔\n" +
				"𝒓𝒆𝒂𝒅𝒚: 𝑹𝒆𝒂𝒅𝒚 𝒖𝒑\n" +
				"𝒏𝒐𝒏𝒓𝒆𝒂𝒅𝒚: 𝑺𝒉𝒐𝒘 𝒏𝒐𝒕 𝒓𝒆𝒂𝒅𝒚 𝒑𝒍𝒂𝒚𝒆𝒓𝒔\n\n" +
				"𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝒃𝒚: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅"
			);
			return api.sendMessage(helpMessage, threadID, messageID);
		}
	}
}
