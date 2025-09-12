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
    aliases: ["emoji", "emojimeaning"],
    version: "1.4",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "wiki",
    shortDescription: {
        en: "𝐹𝑖𝑛𝑑 𝑡ℎ𝑒 𝑚𝑒𝑎𝑛𝑖𝑛𝑔 𝑜𝑓 𝑎𝑛 𝑒𝑚𝑜𝑗𝑖 📌"
    },
    longDescription: {
        en: "𝐹𝑖𝑛𝑑 𝑡ℎ𝑒 𝑚𝑒𝑎𝑛𝑖𝑛𝑔 𝑜𝑓 𝑎𝑛 𝑒𝑚𝑜𝑗𝑖 𝑓𝑟𝑜𝑚 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑝𝑙𝑎𝑡𝑓𝑜𝑟𝑚𝑠"
    },
    guide: {
        en: "{p}emojimean [𝑒𝑚𝑜𝑗𝑖]"
    },
    dependencies: {
        "axios": "",
        "cheerio": "",
        "canvas": "",
        "fs-extra": "",
        "moment-timezone": ""
    }
};

module.exports.languages = {
    "en": {
        "missingEmoji": "⚠️ 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑛𝑜𝑡 𝑒𝑛𝑡𝑒𝑟𝑒𝑑 𝑎𝑛 𝑒𝑚𝑜𝑗𝑖",
        "meaningOfEmoji": "📌 𝑀𝑒𝑎𝑛𝑖𝑛𝑔 𝑜𝑓 𝑒𝑚𝑜𝑗𝑖 %1:\n\n📄 𝐹𝑖𝑟𝑠𝑡 𝑚𝑒𝑎𝑛𝑖𝑛𝑔: %2\n\n📑 𝑀𝑜𝑟𝑒 𝑚𝑒𝑎𝑛𝑖𝑛𝑔: %3%4\n\n📄 𝑆ℎ𝑜𝑟𝑡𝑐𝑜𝑑𝑒: %5\n\n©️ 𝑆𝑜𝑢𝑟𝑐𝑒: %6\n\n📺 𝐵𝑒𝑙𝑜𝑤 𝑎𝑟𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑜𝑓 𝑡ℎ𝑒 𝑒𝑚𝑜𝑗𝑖 𝑑𝑖𝑠𝑝𝑙𝑎𝑦𝑒𝑑 𝑜𝑛 𝑠𝑜𝑚𝑒 𝑝𝑙𝑎𝑡𝑓𝑜𝑟𝑚𝑠:",
        "meaningOfWikipedia": "\n\n📝 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑠𝑒𝑒 𝑡ℎ𝑒 𝑚𝑒𝑎𝑛𝑖𝑛𝑔 \"%1\" 𝑓𝑟𝑜𝑚 𝑊𝑖𝑘𝑖𝑝𝑒𝑑𝑖𝑎",
        "meanOfWikipedia": "📑 𝑀𝑒𝑎𝑛𝑖𝑛𝑔 𝑜𝑓 \"%1\" 𝑜𝑛 𝑊𝑖𝑘𝑖𝑝𝑒𝑑𝑖𝑎:\n%2",
        "manyRequest": "⚠️ 𝑇ℎ𝑒 𝑏𝑜𝑡 ℎ𝑎𝑠 𝑠𝑒𝑛𝑡 𝑡𝑜𝑜 𝑚𝑎𝑛𝑦 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟",
        "notHave": "𝑁𝑜𝑡 ℎ𝑎𝑣𝑒"
    }
};

module.exports.onLoad = function () {
    try {
        const tmpDir = path.join(__dirname, "tmp");
        fs.ensureDirSync(tmpDir);
    } catch (e) {
        console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑡𝑚𝑝 𝑓𝑜𝑙𝑑𝑒𝑟:", e);
    }
};

function makeGetLang(providedGetLang, threadDataLang) {
    if (typeof providedGetLang === "function") return providedGetLang;
    return function (key, ...args) {
        const langCode = langsSupported.includes(threadDataLang) ? threadDataLang : "en";
        let template = (module.exports.languages[langCode] && module.exports.languages[langCode][key]) || 
                      (module.exports.languages["en"] && module.exports.languages["en"][key]) || key;
        args.forEach((v, i) => {
            template = template.replace(new RegExp(`%${i + 1}`, "g"), v == null ? "" : v);
        });
        return template;
    };
}

module.exports.onStart = async function({ api, event, args, message, threadsData, getLang }) {
    try {
        const emoji = args[0];
        if (!emoji) {
            return message.reply(getLang("missingEmoji"));
        }

        let threadLang = "en";
        try {
            if (threadsData && typeof threadsData.get === "function") {
                const tdata = await threadsData.get(event.threadID);
                threadLang = (tdata && tdata.data && tdata.data.lang) || "en";
            }
        } catch (e) {
            threadLang = "en";
        }

        let getMeaning;
        try {
            getMeaning = await getEmojiMeaning(emoji, threadLang);
        } catch (e) {
            if (e.response && e.response.status == 429) {
                let tryNumber = 0;
                while (tryNumber < 3) {
                    try {
                        getMeaning = await getEmojiMeaning(emoji, threadLang);
                        break;
                    } catch (err) {
                        tryNumber++;
                    }
                }
                if (tryNumber == 3)
                    return message.reply(getLang("manyRequest"));
            } else {
                console.error("𝐸𝑚𝑜𝑗𝑖 𝑚𝑒𝑎𝑛𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", e);
                return message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑒𝑚𝑜𝑗𝑖 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            }
        }

        const {
            meaning,
            moreMeaning,
            wikiText,
            meaningOfWikipedia,
            shortcode,
            source,
            images
        } = getMeaning;

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

        const loadedImages = await Promise.all(images.map(async (el) => {
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

        const filteredImages = loadedImages.filter(item => item.imageLoaded);

        let xStart = paddingOfTable + marginImage;
        let yStart = paddingOfTable + marginImage;

        ctx.fillStyle = "white";
        ctx.textAlign = "center";

        for (const el of filteredImages) {
            const image = el.imageLoaded;

            ctx.fillStyle = "#2c2f3b";
            drawSquareRounded(ctx, xStart - marginImage + marginImage / 2, yStart - marginImage + marginImage / 2, widthOfOneImage - marginImage, heightOfOneImage - marginImage, 30);
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

        const buffer = canvas.toBuffer("image/png");
        const pahtSave = `${__dirname}/tmp/${Date.now()}.png`;
        fs.writeFileSync(pahtSave, buffer);

        const body = getLang("meaningOfEmoji", emoji, meaning, moreMeaning || getLang("notHave"), wikiText ? getLang("meaningOfWikipedia", wikiText) : "", shortcode || getLang("notHave"), source);

        await message.reply({
            body,
            attachment: fs.createReadStream(pahtSave)
        });

        fs.unlinkSync(pahtSave);

    } catch (error) {
        console.error("𝑀𝑎𝑖𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑚𝑜𝑗𝑖 𝑚𝑒𝑎𝑛𝑖𝑛𝑔.");
    }
};

async function getEmojiMeaning(emoji, lang) {
    const url = `https://www.emojiall.com/${lang}/emoji/${encodeURI(emoji)}`;
    const urlImages = `https://www.emojiall.com/${lang}/image/${encodeURI(emoji)}`;

    const { data } = await axios.get(url);
    const { data: dataImages } = await axios.get(urlImages);

    const $ = cheerio.load(data);

    const getElMeaning = $(".emoji_card_list.pages > div.emoji_card_content.px-4.py-3");
    const meaning = getElMeaning.eq(0).text().trim();
    const moreMeaning = getElMeaning.eq(1).text().trim();

    const getEl1 = $(".emoji_card_list.pages > .emoji_card_list.border_top > .emoji_card_content.pointer");
    const getWikiText = getEl1.text().replace(/\s+/g, " ").trim();
    let wikiText;
    if (getWikiText)
        wikiText = getWikiText.split(':').find(item => item.includes(emoji))?.trim();

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
    } catch (e) {}
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
