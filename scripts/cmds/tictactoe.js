module.exports.config = {
	name: "tictactoe",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅-𝒆𝒓 𝒃𝒂𝒏𝒂𝒏𝒐 𝑻𝒊𝒄 𝑻𝒂𝒄 𝑻𝒐𝒆 𝒌𝒉𝒆𝒍𝒂",
	category: "game-sp",
	usages: "x/o/delete/continue",
	cooldowns: 5,
	dependencies: {
		"canvas": "",
		"fs": ""
	}
};

module.exports.languages = {
	"vi": {},
	"en": {}
};

const fs = require("fs");
const { loadImage, createCanvas } = require("canvas");

var AIMove;

/* Initialize board object */
function startBoard({ isX, data }) {
	data.board = new Array(3);
	data.isX = isX;
	data.gameOn = true;
	data.gameOver = false;
	data.available = [];
	for (let i = 0; i < 3; i++) {
		data.board[i] = new Array(3).fill(0);
	}
	return data;
}

/* Draw board image and return attachment stream */
async function displayBoard(data) {
	const path = __dirname + "/cache/ttt.png";
	let canvas = createCanvas(1200, 1200);
	let cc = canvas.getContext("2d");
	// NOTE: links intentionally unchanged per request
	let background = await loadImage("https://i.postimg.cc/nhDWmj1h/background.png");
	cc.drawImage(background, 0, 0, 1200, 1200);
	let quanO = await loadImage("https://i.postimg.cc/rFP6xCLXQ/O.png");
	let quanX = await loadImage("https://i.postimg.cc/HLbFqcJh/X.png");

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			let temp = data.board[i][j].toString();
			let x = 54 + 366 * j;
			let y = 54 + 366 * i;
			if (temp == "1") {
				if (data.isX) cc.drawImage(quanO, x, y, 360, 360);
				else cc.drawImage(quanX, x, y, 360, 360);
			}
			if (temp == "2") {
				if (data.isX) cc.drawImage(quanX, x, y, 360, 360);
				else cc.drawImage(quanO, x, y, 360, 360);
			}
		}
	}

	// ensure cache folder exists
	try {
		const cacheDir = __dirname + "/cache";
		if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
	} catch (e) {}

	fs.writeFileSync(path, canvas.toBuffer("image/png"));
	return [fs.createReadStream(path)];
}

/* Winning checks */
function checkAIWon(data) {
	if (data.board[0][0] == data.board[1][1] && data.board[0][0] == data.board[2][2] && data.board[0][0] == 1) return true;
	if (data.board[0][2] == data.board[1][1] && data.board[0][2] == data.board[2][0] && data.board[0][2] == 1) return true;
	for (let i = 0; i < 3; ++i) {
		if (data.board[i][0] == data.board[i][1] && data.board[i][0] == data.board[i][2] && data.board[i][0] == 1) return true;
		if (data.board[0][i] == data.board[1][i] && data.board[0][i] == data.board[2][i] && data.board[0][i] == 1) return true;
	}
	return false;
}

function checkPlayerWon(data) {
	if (data.board[0][0] == data.board[1][1] && data.board[0][0] == data.board[2][2] && data.board[0][0] == 2) return true;
	if (data.board[0][2] == data.board[1][1] && data.board[0][2] == data.board[2][0] && data.board[0][2] == 2) return true;
	for (let i = 0; i < 3; ++i) {
		if (data.board[i][0] == data.board[i][1] && data.board[i][0] == data.board[i][2] && data.board[i][0] == 2) return true;
		if (data.board[0][i] == data.board[1][i] && data.board[0][i] == data.board[2][i] && data.board[0][i] == 2) return true;
	}
	return false;
}

/* Helpers */
function getAvailable(data) {
	let availableMove = [];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (data.board[i][j] == 0) availableMove.push([i, j]);
		}
	}
	return availableMove;
}

function checkAvailableSpot(point, pointArray) {
	return pointArray.some((element) => element.toString() == point.toString());
}

function placeMove({ point, player, data }) {
	data.board[point[0]][point[1]] = player;
}

/* Minimax AI (fixed initial min/max values) */
function solveAIMove({ depth, turn, data }) {
	if (checkAIWon(data)) return +1;
	if (checkPlayerWon(data)) return -1;
	let availablePoint = getAvailable(data);
	if (availablePoint.length == 0) return 0;

	let max = Number.MIN_SAFE_INTEGER; // for AI (maximizer)
	let min = Number.MAX_SAFE_INTEGER; // for player (minimizer)

	for (let i = 0; i < availablePoint.length; i++) {
		let point = availablePoint[i];
		if (turn == 1) { // AI's turn (1)
			placeMove({ point, player: 1, data });
			let currentScore = solveAIMove({ depth: depth + 1, turn: 2, data });
			max = Math.max(currentScore, max);
			if (currentScore >= 0 && depth == 0) AIMove = point;
			if (currentScore == 1) {
				data.board[point[0]][point[1]] = 0;
				break;
			}
			if (i == availablePoint.length - 1 && max < 0 && depth == 0) AIMove = point;
		} else { // Player's turn (2)
			placeMove({ point, player: 2, data });
			let currentScore = solveAIMove({ depth: depth + 1, turn: 1, data });
			min = Math.min(currentScore, min);
			if (min == -1) {
				data.board[point[0]][point[1]] = 0;
				break;
			}
		}
		data.board[point[0]][point[1]] = 0;
	}
	return turn == 1 ? max : min;
}

/* Player move, then AI move if game not over */
function move(x, y, data) {
	let availablePoint = getAvailable(data);
	let playerMove = [x, y];
	if (checkAvailableSpot(playerMove, availablePoint)) placeMove({ point: playerMove, player: 2, data });
	else return "𝑬𝒊 𝒃𝒐𝒙 𝒕𝒂 𝒑𝒆𝒕𝒆 𝒄𝒉𝒆𝒄𝒌 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!";

	// If player just won or board is full, don't let AI move
	if (checkPlayerWon(data) || getAvailable(data).length == 0) return;

	// compute AI move
	solveAIMove({ depth: 0, turn: 1, data });
	// if AIMove set, place it
	if (AIMove && Array.isArray(AIMove)) placeMove({ point: AIMove, player: 1, data });
}

/* Game over check */
function checkGameOver(data) {
	return getAvailable(data).length == 0 || checkAIWon(data) || checkPlayerWon(data);
}

/* AI random start */
function AIStart(data) {
	let point = [Math.round(Math.random() * 2), Math.round(Math.random() * 2)];
	placeMove({ point, player: 1, data });
}

/* handleReply — receive user's numbered replies 1-9 */
module.exports.handleReply = async function ({ api, event, handleReply }) {
	try {
		let { body, threadID, messageID, senderID } = event;
		if (!global.client.handleReply) global.client.handleReply = new Map();
		let data = global.client.handleReply.get(threadID);
		if (!data || data.gameOn == false) return;

		let number = parseInt(body);
		if (!isNaN(number) && number > 0 && number < 10) {
			let row = number < 4 ? 0 : number < 7 ? 1 : 2;
			let col = (number - 1) % 3;

			let temp = move(row, col, data);
			let lmao = "𝒄𝒉𝒊𝒄𝒌𝒆𝒏 🐔";

			if (checkGameOver(data)) {
				let gayban = ["𝒄𝒉𝒊𝒄𝒌𝒆𝒏 🐔", "𝒉𝒂𝒕 🐔", "𝑾𝒉𝒂𝒕 𝒂𝒈𝒆 🐔", "𝒂 𝒃𝒊𝒕 𝒊𝒎𝒎𝒂𝒕𝒖𝒓𝒆 🐔", "𝒄𝒉𝒊𝒄𝒌𝒆𝒏 𝒗𝒄𝒍 🐔", "𝒆𝒂𝒔𝒚 𝒈𝒂𝒎𝒆 🐔"];
				if (checkAIWon(data)) lmao = `𝑻𝒖𝒎𝒊 𝒉𝒂𝒓𝒍𝒆! ${gayban[Math.floor(Math.random() * gayban.length)]}`;
				else if (checkPlayerWon(data)) lmao = "𝑻𝒖𝒎𝒊 𝒋𝒊𝒕𝒍𝒆! :<";
				else lmao = "𝑫𝒓𝒂𝒘 𝒉𝒐𝒊𝒔𝒆!";
				global.client.handleReply.delete(threadID);
			}

			let msg = lmao !== "𝒄𝒉𝒊𝒄𝒌𝒆𝒏 🐔" ? lmao : temp || "𝑪𝒉𝒆𝒄𝒌 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒄𝒆𝒍𝒍 𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒅𝒂𝒐";
			api.sendMessage({
				body: msg,
				attachment: await displayBoard(data)
			}, threadID, (error, info) => {
				if (!error) global.client.handleReply.set(threadID, { ...data, messageID: info.messageID, player: senderID });
			}, messageID);
		} else {
			return api.sendMessage("𝑽𝒖𝒍 𝒄𝒆𝒍𝒍 𝒏𝒖𝒎𝒃𝒆𝒓!", threadID, messageID);
		}
	} catch (e) {
		console.log(e);
	}
};


module.exports.onStart = async function ({ api, event, args }) {
	if (!global.client.handleReply) global.client.handleReply = new Map();
	let { threadID, messageID, senderID } = event;
	const threadSetting = global.data.threadData.get(threadID) || {};
	let prefix = threadSetting.PREFIX || global.config.PREFIX;
	let data = global.client.handleReply.get(threadID) || { gameOn: false, player: "𝒄𝒉𝒊𝒄𝒌𝒆𝒏 🐔" };
	let concak = "𝒄𝒉𝒊𝒄𝒌𝒆𝒏 🐔 " + prefix + this.config.name;
	let newData;

	try {
		if (args.length == 0) return api.sendMessage("𝑿 𝒃𝒂 𝑶 𝒔𝒆𝒍𝒆𝒄𝒕 𝒌𝒐𝒓𝒐", threadID, messageID);

		let sub = args[0].toLowerCase();
		if (sub == "delete") {
			global.client.handleReply.delete(threadID);
			return api.sendMessage("𝑪𝒉𝒆𝒔𝒔𝒃𝒐𝒂𝒓𝒅 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!", threadID, messageID);
		}

		if (sub == "continue") {
			if (!data.gameOn) return api.sendMessage("𝑲𝒐𝒏𝒐 𝒅𝒂𝒕𝒂 𝒏𝒂𝒊! 𝑩𝒂𝒃𝒐𝒉𝒂𝒓 𝒌𝒐𝒓𝒐 " + concak + " 𝒏𝒆𝒘 𝒌𝒉𝒆𝒍𝒂𝒓 𝒋𝒐𝒏𝒏𝒐", threadID, messageID);
			return api.sendMessage({
				body: "𝑪𝒉𝒆𝒄𝒌 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒄𝒆𝒍𝒍 𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒅𝒂𝒐",
				attachment: await displayBoard(data)
			}, threadID, (error, info) => {
				if (!error) global.client.handleReply.set(threadID, { ...data, messageID: info.messageID, player: senderID });
			}, messageID);
		}

		// Start new game
		if (!data.gameOn) {
			let abc = sub;
			if (abc !== "x" && abc !== "o") return api.sendMessage("𝑿 𝒃𝒂 𝑶 𝒔𝒆𝒍𝒆𝒄𝒕 𝒌𝒐𝒓𝒐", threadID, messageID);

			if (abc == "o") {
				newData = startBoard({ isX: false, data, threadID });
				api.sendMessage({
					body: "𝑻𝒖𝒎𝒊 𝒂𝒈𝒆 𝒌𝒉𝒆𝒍𝒐!\n𝑪𝒆𝒍𝒍 𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒅𝒂𝒐",
					attachment: await displayBoard(newData)
				}, threadID, (error, info) => {
					if (!error) global.client.handleReply.set(threadID, { ...newData, messageID: info.messageID, player: senderID });
				}, messageID);
			}

			if (abc == "x") {
				newData = startBoard({ isX: true, data, threadID });
				AIStart(newData);
				api.sendMessage({
					body: "𝑨𝑰 𝒂𝒈𝒆 𝒌𝒉𝒆𝒍𝒃𝒆!\n𝑪𝒆𝒍𝒍 𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒅𝒂𝒐",
					attachment: await displayBoard(newData)
				}, threadID, (error, info) => {
					if (!error) global.client.handleReply.set(threadID, { ...newData, messageID: info.messageID, player: senderID });
				}, messageID);
			}
		} else {
			// Replaced old asterisks message with a clear Banglish notice
			return api.sendMessage(
				`✅ Aikhane ekta game cholche.\n${concak}\nGame continue korte 'continue' likho, board remove korte 'delete' likho.`,
				threadID,
				messageID
			);
		}
	} catch (e) {
		console.log(e);
	}
};
