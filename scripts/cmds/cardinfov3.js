const sendWaiting = true; // Enable or disable "please wait" message
const textWaiting = "⏳ 𝑰𝒎𝒂𝒈𝒆 𝒊𝒏𝒊𝒕𝒊𝒂𝒍𝒊𝒛𝒂𝒕𝒊𝒐𝒏, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕...";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;

module.exports.config = {
	name: "cardinfov3",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "📇 Create Facebook user information card",
	commandCategory: "group",
	usages: "[reply/@mention]",
	cooldowns: 5,
	dependencies: {
		"canvas": "",
		"axios": "",
		"fs-extra": "",
		"jimp": ""
	}
};

module.exports.circle = async (image) => {
	const jimp = global.nodemodule["jimp"];
	image = await jimp.read(image);
	image.circle();
	return await image.getBufferAsync("image/png");
};

function toMathBoldItalic(text) {
	const map = {
		'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱',
		'K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻',
		'U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿','Y': '𝒀','Z': '𝒁',
		'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋',
		'k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝒒','r': '𝒓','s': '𝒔','t': '𝒕',
		'u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
		'0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗',
		' ':' ',':': ':','>': '>','<': '<','(': '(' ,')': ')','[': '[',']': ']','{': '{','}': '}',',': ',',
		'.': '.',';': ';','!': '!','?': '?',"'" : "'",'"' : '"','-': '-','_': '_','=': '=','+': '+','*': '*',
		'/': '/','\\': '\\','|': '|','&': '&','^': '^','%': '%','$': '$','#': '#','@': '@'
	};
	return text.split('').map(char => map[char] || char).join('');
}

module.exports.run = async function ({ api, event, args }) {
	if (this.config.credits !== "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅") {
		return api.sendMessage("⚠️ Credits has been changed!", event.threadID, event.messageID);
	}

	let { threadID, messageID } = event;
	const { loadImage, createCanvas, registerFont } = require("canvas");
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];

	let pathImg = __dirname + `/cache/1.png`;
	let pathAvata = __dirname + `/cache/2.png`;

	// Detect target UID
	let uid;
	if (event.type === "message_reply") {
		uid = event.messageReply.senderID;
	} else if (Object.keys(event.mentions).length > 0) {
		uid = Object.keys(event.mentions)[0];
	} else {
		uid = event.senderID;
	}

	// Optional wait message
	if (sendWaiting) api.sendMessage(textWaiting, threadID, messageID);

	const res = await api.getUserInfoV2(uid);

	let getAvatarOne = (await axios.get(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
	let bg = (await axios.get(`https://i.imgur.com/ufsPjwE.png`, { responseType: "arraybuffer" })).data;

	fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
	let avataruser = await this.circle(pathAvata);
	fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

	if (!fs.existsSync(__dirname + `${fonts}`)) {
		let getfont = (await axios.get(downfonts, { responseType: "arraybuffer" })).data;
		fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
	}

	let baseImage = await loadImage(pathImg);
	let baseAvata = await loadImage(avataruser);
	let canvas = createCanvas(baseImage.width, baseImage.height);
	let ctx = canvas.getContext("2d");

	// Draw background & avatar
	ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(baseAvata, 855, 70, 350, 350);

	// Ensure values
	if (!res.location) res.location = toMathBoldItalic("Not Found");
	if (!res.birthday) res.birthday = toMathBoldItalic("Not Found");
	if (!res.relationship_status) res.relationship_status = toMathBoldItalic("Not Found");
	if (!res.follow) res.follow = toMathBoldItalic("Not Found");

	let gender = res.gender === 'male' ? toMathBoldItalic("Male") :
		res.gender === 'female' ? toMathBoldItalic("Female") :
		toMathBoldItalic("Not Found");

	let birthday = res.birthday || toMathBoldItalic("No information");
	let love = res.relationship_status || toMathBoldItalic("No information");
	let location = res.location || toMathBoldItalic("No information");

	registerFont(__dirname + `${fonts}`, { family: "Play-Bold" });

	// Labels
	const nameLabel = toMathBoldItalic(`${res.name}`);
	const sexLabel = toMathBoldItalic("💠 Sex:");
	const followLabel = toMathBoldItalic("👥 Follow:");
	const relationshipLabel = toMathBoldItalic("💞 Relationship:");
	const dobLabel = toMathBoldItalic("🎂 DOB:");
	const uidLabel = toMathBoldItalic("🆔 UID:");
	const profileLabel = toMathBoldItalic("🌐 Profile:");

	// Write text
	ctx.font = `${fontsInfo}px Play-Bold`;
	ctx.fillStyle = "#FFCC33";
	ctx.textAlign = "start";
	ctx.fillText(nameLabel, 130, 130);

	ctx.font = `${fontsInfo}px Play-Bold`;
	ctx.fillStyle = "#FFCC33";
	ctx.fillText(`${sexLabel}   ${gender}`, 70, 180);
	ctx.fillText(`${followLabel}   ${res.follow}`, 70, 230);
	ctx.fillText(`${relationshipLabel}   ${love}`, 70, 280);
	ctx.fillText(`${dobLabel}   ${birthday}`, 70, 330);
	ctx.fillText(`${uidLabel}   ${uid}`, 70, 380);

	ctx.font = `${fontsLink}px Play-Bold`;
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText(`${profileLabel}  ${res.link}`, 50, 450);

	// Export final image
	const imageBuffer = canvas.toBuffer();
	fs.writeFileSync(pathImg, imageBuffer);
	fs.removeSync(pathAvata);

	return api.sendMessage(
		{ body: `✨ 𝑯𝒆𝒓𝒆 𝒊𝒔 𝒕𝒉𝒆 𝒄𝒂𝒓𝒅 𝒐𝒇 ${res.name}`, attachment: fs.createReadStream(pathImg) },
		threadID,
		() => fs.unlinkSync(pathImg),
		messageID
	);
};
