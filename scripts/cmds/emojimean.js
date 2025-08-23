const axios = require("axios");
const cheerio = require("cheerio");
const Canvas = require("canvas");
const fs = require("fs-extra");
const path = require("path");

const langsSupported = [
	'sq', 'ar', 'az', 'bn', 'bs', 'bg', 'my', 'zh-hans',
	'zh-hant', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fil',
	'fi', 'fr', 'ka', 'de', 'el', 'he', 'hi', 'hu', 'id',
	'it', 'ja', 'kk', 'ko', 'lv', 'lt', 'ms', 'nb', 'fa',
	'pl', 'pt', 'ro', 'ru', 'sr', 'sk', 'sl', 'es', 'sv',
	'th', 'tr', 'uk', 'vi'
];

module.exports.config = {
	name: "emojimean",
	version: "1.4",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Find the meaning of an emoji 📌",
	category: "wiki",
	usages: "[emoji]",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"cheerio": "",
		"canvas": "",
		"fs-extra": ""
	},
	envConfig: {}
};

module.exports.languages = {
	vi: {
		missingEmoji: "⚠️ Bạn chưa nhập emoji",
		meaningOfEmoji: "📌 Ý nghĩa của emoji %1:\n\n📄 Nghĩa đầu tiên: %2\n\n📑 Nghĩa khác: %3%4\n\n📄 Shortcode: %5\n\n©️ Nguồn: %6\n\n📺 Dưới đây là hình ảnh hiển thị của emoji trên một số nền tảng:",
		meaningOfWikipedia: "\n\n📝 Reaction tin nhắn này để xem nghĩa \"%1\" từ Wikipedia",
		meanOfWikipedia: "📑 Nghĩa của \"%1\" trên Wikipedia:\n%2",
		manyRequest: "⚠️ Hiện tại bot đã gửi quá nhiều yêu cầu, vui lòng thử lại sau",
		notHave: "Không có"
	},
	en: {
		missingEmoji: "⚠️ You have not entered an emoji",
		meaningOfEmoji: "📌 Meaning of emoji %1:\n\n📄 First meaning: %2\n\n📑 More meaning: %3%4\n\n📄 Shortcode: %5\n\n©️ Source: %6\n\n📺 Below are images of the emoji displayed on some platforms:",
		meaningOfWikipedia: "\n\n📝 React to this message to see the meaning \"%1\" from Wikipedia",
		meanOfWikipedia: "📑 Meaning of \"%1\" on Wikipedia:\n%2",
		manyRequest: "⚠️ The bot has sent too many requests, please try again later",
		notHave: "Not have"
	}
};

/**
 * Ensure tmp folder exists when the module loads.
 */
module.exports.onLoad = function () {
	try {
		const tmpDir = path.join(__dirname, "tmp");
		fs.ensureDirSync(tmpDir);
	} catch (e) {
		console.error("Failed to ensure tmp folder for emojimean:", e);
	}
};

/**
 * Helper: safe getLang function (tries to use provided getLang, otherwise falls back to internal languages).
 */
function makeGetLang(providedGetLang, threadDataLang) {
	if (typeof providedGetLang === "function") return providedGetLang;
	return function (key, ...args) {
		const langCode = langsSupported.includes(threadDataLang) ? threadDataLang : "en";
		let template = (module.exports.languages[langCode] && module.exports.languages[langCode][key]) || (module.exports.languages["en"] && module.exports.languages["en"][key]) || key;
		// simple placeholder replacement %1, %2...:
		args.forEach((v, i) => {
			template = template.replace(new RegExp(`%${i + 1}`, "g"), v == null ? "" : v);
		});
		return template;
	};
}

/**
 * MAIN run function. Flexible parameters to support different GoatBot variants.
 * Accepts an object which may contain:
 *  - api, event, args, message, threadsData, Threads, getLang, commandName
 */
module.exports.run = async function (params) {
	// Flexible extraction
	const api = params.api;
	const event = params.event || {};
	const args = params.args || [];
	const commandName = params.commandName || (module.exports.config && module.exports.config.name);
	// threads data helper (some frameworks pass 'threadsData', others pass 'Threads')
	const threadsDataWrapper = params.threadsData || params.Threads || null;
	// message helper (if framework gives message object with reply)
	let message = params.message || null;

	// Create a fallback message object if we have api & event
	if (!message && api && event && event.threadID && event.messageID) {
		message = {
			reply: (body, callback) => {
				// if body is an object (with attachment), pass directly. Otherwise wrap.
				if (typeof body === "object" && body !== null && (body.body || body.attachment)) {
					api.sendMessage(body, event.threadID, (err, info) => {
						if (typeof callback === "function") callback(err, info);
					});
				} else {
					api.sendMessage(body, event.threadID, (err, info) => {
						if (typeof callback === "function") callback(err, info);
					}, event.messageID || undefined);
				}
			}
		};
	}

	// get thread language
	let threadLang = null;
	try {
		if (threadsDataWrapper && typeof threadsDataWrapper.get === "function") {
			const tdata = await threadsDataWrapper.get(event.threadID);
			threadLang = (tdata && tdata.data && tdata.data.lang) || null;
		} else if (params.threadData && params.threadData.lang) {
			threadLang = params.threadData.lang;
		}
	} catch (e) {
		// ignore and fallback to default
	}

	const getLang = makeGetLang(params.getLang, threadLang || (global && global.GoatBot && global.GoatBot.config && global.GoatBot.config.language) || "en");

	const emoji = args[0];
	if (!emoji) {
		return message.reply(getLang("missingEmoji"));
	}

	// call the same logic as original, with retry on 429
	let getMeaning;
	try {
		getMeaning = await getEmojiMeaning(emoji, threadLang || (global && global.GoatBot && global.GoatBot.config && global.GoatBot.config.language) || "en");
	} catch (e) {
		if (e.response && e.response.status == 429) {
			let tryNumber = 0;
			while (tryNumber < 3) {
				try {
					getMeaning = await getEmojiMeaning(emoji, threadLang || (global && global.GoatBot && global.GoatBot.config && global.GoatBot.config.language) || "en");
					break;
				} catch (err) {
					tryNumber++;
				}
			}
			if (tryNumber == 3)
				return message.reply(getLang("manyRequest"));
		} else {
			// Unexpected error — pass helpful message
			console.error("getEmojiMeaning error:", e);
			return message.reply("❌ Error fetching emoji data. Please try again later.");
		}
	}

	const {
		meaning,
		moreMeaning,
		wikiText,
		meaningOfWikipedia,
		shortcode,
		source
	} = getMeaning;
	let images = getMeaning.images;

	// Canvas layout constants (kept same as original)
	const sizeImage = 190;
	const imageInRow = 5;
	const paddingOfTable = 20;
	const marginImageAndText = 10;
	const marginImage = 20;
	const marginText = 2;
	const fontSize = 30;
	const addWidthImage = 150;

	const font = `${fontSize}px Arial`;
	const _canvas = Canvas.createCanvas(0, 0);
	const _ctx = _canvas.getContext("2d");

	const widthOfOneImage = sizeImage + marginImage * 2 + addWidthImage;
	for (const item of images) {
		const text = wrapped(item.platform, widthOfOneImage, font, _ctx);
		item.text = text;
	}

	const maxRowText = Math.max(...images.map(item => item.text.length || 0));
	const heightForText = maxRowText * fontSize + marginText * 2 + fontSize;

	const heightOfOneImage = sizeImage + marginImageAndText + heightForText + marginImage + marginText;

	const witdhTable = paddingOfTable + imageInRow * widthOfOneImage + paddingOfTable;
	const heightTable = paddingOfTable + Math.ceil(images.length / imageInRow) * heightOfOneImage + paddingOfTable;

	const canvas = Canvas.createCanvas(witdhTable, heightTable);
	const ctx = canvas.getContext("2d");
	ctx.font = font;
	ctx.fillStyle = "#303342";
	ctx.fillRect(0, 0, witdhTable, heightTable);

	// Load images (preserve original urls/paths)
	images = await Promise.all(images.map(async (el) => {
		let imageLoaded;
		const url = `https://www.emojiall.com/${el.url}`;
		try {
			imageLoaded = await Canvas.loadImage(url);
		} catch (e) {
			try {
				const splitUrl = url.split("/");
				imageLoaded = await Canvas.loadImage(`https://www.emojiall.com/images/svg/${splitUrl[splitUrl.length - 2]}/${splitUrl[splitUrl.length - 1].replace(".png", ".svg")}`);
			} catch (e) {
				imageLoaded = null;
			}
		}
		return {
			...el,
			imageLoaded
		};
	}));

	images = images.filter(item => item.imageLoaded);

	let xStart = paddingOfTable + marginImage;
	let yStart = paddingOfTable + marginImage;

	ctx.fillStyle = "white";
	ctx.textAlign = "center";

	// draw each image card
	for (const el of images) {
		const image = el.imageLoaded;

		// background rounded card
		ctx.fillStyle = "#2c2f3b";
		drawSquareRounded(ctx, xStart - marginImage + marginImage / 2, yStart - marginImage + marginImage / 2, widthOfOneImage - marginImage, heightOfOneImage - marginImage, 30);
		// border
		drawLineSquareRounded(ctx, xStart - marginImage + marginImage / 2, yStart - marginImage + marginImage / 2, widthOfOneImage - marginImage, heightOfOneImage - marginImage, 30, "#3f4257", 5);

		ctx.drawImage(image, xStart + addWidthImage / 2, yStart, sizeImage, sizeImage);

		ctx.fillStyle = "white";
		const texts = wrapped(el.platform, widthOfOneImage, ctx.font, ctx);
		for (let i = 0; i < texts.length; i++) {
			ctx.fillText(texts[i], xStart + sizeImage / 2 + addWidthImage / 2, yStart + sizeImage + marginImageAndText + 2 + fontSize * (i + 1));
		}

		xStart += sizeImage + marginImage * 2 + addWidthImage;
		if (xStart >= witdhTable - paddingOfTable) {
			xStart = paddingOfTable + marginImage;
			yStart += heightOfOneImage;
		}
	}

	// Save canvas to tmp file
	const buffer = canvas.toBuffer("image/png");
	const pahtSave = `${__dirname}/tmp/${Date.now()}.png`;
	fs.writeFileSync(pahtSave, buffer);

	// Compose message body (use getLang for localization)
	const body = getLang("meaningOfEmoji", emoji, meaning, moreMeaning || getLang("notHave"), wikiText ? getLang("meaningOfWikipedia", wikiText) : "", shortcode || getLang("notHave"), source);

	// Send the message with attachment and set reaction handler for Wikipedia meaning (if any)
	return message.reply({
		body,
		attachment: fs.createReadStream(pahtSave)
	}, (err, info) => {
		// cleanup file
		try {
			fs.unlinkSync(pahtSave);
		} catch (e) { /* ignore */ }

		// set reaction hook so reacting shows Wikipedia text if available
		if (!err && info && info.messageID && wikiText) {
			// Ensure global reaction map exists
			if (!global.GoatBot) global.GoatBot = {};
			if (!global.GoatBot.onReaction) global.GoatBot.onReaction = new Map();

			global.GoatBot.onReaction.set(info.messageID, {
				commandName,
				author: event.senderID || event.userID,
				messageID: info.messageID,
				emoji,
				meaningOfWikipedia
			});
		}
	});
};

/**
 * Reaction handler: when a user reacts to the bot message we previously stored in global.GoatBot.onReaction
 * This function tries to be flexible with input params from different GoatBot variants.
 *
 * Example frameworks may call this handler with:
 *  module.exports.handleReaction = async ({ event, api, getLang, handleReaction, Reaction, message })
 *
 * We'll attempt to read relevant values from params (or fallback to global.GoatBot.onReaction map).
 */
module.exports.handleReaction = async function (params) {
	const event = params.event || {};
	const api = params.api || null;
	const Reaction = params.Reaction || null; // sometimes frameworks pass this pre-built
	const message = params.message || null;
	const getLangParam = params.getLang || null;

	// Try to find our stored reaction data
	let stored;
	try {
		if (Reaction) {
			stored = Reaction;
		} else if (global && global.GoatBot && global.GoatBot.onReaction) {
			stored = global.GoatBot.onReaction.get(event.messageID);
		}
	} catch (e) {
		stored = null;
	}

	if (!stored) return;

	// Ensure only the original author can trigger Wikipedia reply (this mirrors original behavior)
	if (stored.author && stored.author != (event.userID || event.senderID)) return;

	// send the wikipedia meaning
	const getLang = makeGetLang(getLangParam, null);
	const replyText = getLang("meanOfWikipedia", stored.emoji, stored.meaningOfWikipedia || getLang("notHave"));

	// Use message.reply if available, otherwise api.sendMessage
	if (message && typeof message.reply === "function") {
		return message.reply(replyText);
	} else if (api && event && event.threadID) {
		return api.sendMessage(replyText, event.threadID);
	}
};

/* -----------------------------
   Helper functions (kept & slightly hardened from original)
   ----------------------------- */

async function getEmojiMeaning(emoji, lang) {
	const url = `https://www.emojiall.com/${lang}/emoji/${encodeURI(emoji)}`;
	const urlImages = `https://www.emojiall.com/${lang}/image/${encodeURI(emoji)}`;

	const { data } = await axios.get(url);
	const { data: dataImages } = await axios.get(urlImages);

	const $ = cheerio.load(data);

	const getElMeaning = $(".emoji_card_list.pages > div.emoji_card_content.px-4.py-3");
	const meaning = getElMeaning.eq(0).text().trim();
	const moreMeaning = getElMeaning.eq(1).text().trim();

	// get wikipedia
	const getEl1 = $(".emoji_card_list.pages > .emoji_card_list.border_top > .emoji_card_content.pointer");
	const getWikiText = getEl1.text().replace(/\s+/g, " ").trim();
	let wikiText;
	if (getWikiText)
		wikiText = getWikiText.split(':').find(item => item.includes(emoji)).trim();

	const getEl2 = $(".emoji_card_list.border_top > div.emoji_card_content.border_top.small > div.category_all_list");
	const meaningOfWikipedia = getEl2.text().trim();

	const getEl3 = $("table.table.table-hover.top_no_border").eq(0);
	const getEl4 = getEl3.find("tr").has(`sup > a[href='/${lang}/help-shortcode']`);
	const shortcode = getEl4.text().match(/(:.*:)/)?.[1];

	const $images = cheerio.load(dataImages);
	const getEl5 = $images(".emoji_card_content").find('img[loading="lazy"]');
	const arr = [];

	getEl5.each((i, el) => {
		const content = $images(el).parent().find("p[class='capitalize'] > a[class='text_blue']").eq(1).text().trim();
		const href = $images(el).attr("data-src") || $images(el).attr("src");
		arr.push({
			url: href,
			platform: content
		});
	});

	return {
		meaning,
		moreMeaning,
		wikiText: wikiText || null,
		meaningOfWikipedia: meaningOfWikipedia || null,
		shortcode,
		images: arr,
		source: url
	};
}

function wrapped(text, max, font, ctx) {
	const words = (text || "").split(" ");
	const lines = [];
	let line = "";
	try {
		ctx.font = font;
	} catch (e) {
		// ctx may sometimes be a font string in previous calls; ignore if setting fails
	}
	for (let i = 0; i < words.length; i++) {
		const testLine = line + words[i] + " ";
		const metrics = ctx.measureText(testLine);
		const testWidth = metrics.width;
		if (testWidth > max && i > 0) {
			lines.push(line.trim());
			line = words[i] + " ";
		} else {
			line = testLine;
		}
	}
	if (line) lines.push(line.trim());
	return lines;
}

function drawSquareRounded(ctx, x, y, w, h, r, color) {
	ctx.save();
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
	if (color) ctx.fillStyle = color;
	ctx.fill();
	ctx.restore();
}

function drawLineSquareRounded(ctx, x, y, w, h, r, color, lineWidth) {
	ctx.save();
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	ctx.lineWidth = lineWidth || 1;
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
	if (color) ctx.strokeStyle = color;
	ctx.stroke();
	ctx.restore();
}
