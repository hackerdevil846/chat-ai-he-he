const { createCanvas, loadImage } = require('canvas');
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "customrankcard",
    aliases: ["crc", "customrank", "rankcard"],
    version: "1.12",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "✨ 𝐷𝑒𝑠𝑖𝑔𝑛 𝑦𝑜𝑢𝑟 𝑜𝑤𝑛 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑟𝑎𝑛𝑘 𝑐𝑎𝑟𝑑 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑐𝑜𝑙𝑜𝑟𝑠 𝑎𝑛𝑑 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑𝑠"
    },
    longDescription: {
        en: "✨ 𝐷𝑒𝑠𝑖𝑔𝑛 𝑦𝑜𝑢𝑟 𝑜𝑤𝑛 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑟𝑎𝑛𝑘 𝑐𝑎𝑟𝑑 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑐𝑜𝑙𝑜𝑟𝑠 𝑎𝑛𝑑 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑𝑠"
    },
    category: "rank",
    guide: {
        en: "{p}customrankcard [𝑜𝑝𝑡𝑖𝑜𝑛] [𝑣𝑎𝑙𝑢𝑒]"
    },
    dependencies: {
        "canvas": "",
        "fs-extra": "",
        "moment-timezone": "",
        "axios": ""
    }
};

module.exports.languages = {
    "en": {
        "invalidImage": "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑑𝑖𝑟𝑒𝑐𝑡 𝑖𝑚𝑎𝑔𝑒 𝑙𝑖𝑛𝑘 (𝑗𝑝𝑔, 𝑗𝑝𝑒𝑔, 𝑝𝑛𝑔, 𝑔𝑖𝑓).",
        "invalidAttachment": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑡𝑡𝑎𝑐ℎ 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑓𝑖𝑙𝑒",
        "invalidColor": "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑙𝑜𝑟 𝑐𝑜𝑑𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 ℎ𝑒𝑥 (#𝑅𝑅𝐺𝐺𝐵𝐵) 𝑜𝑟 𝑟𝑔𝑏𝑎 𝑓𝑜𝑟𝑚𝑎𝑡",
        "notSupportImage": "❌ 𝐼𝑚𝑎𝑔𝑒 𝑈𝑅𝐿𝑠 𝑎𝑟𝑒 𝑛𝑜𝑡 𝑠𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑑 𝑓𝑜𝑟 \"%1\" 𝑜𝑝𝑡𝑖𝑜𝑛",
        "success": "✅ 𝑌𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑟𝑎𝑛𝑘 𝑐𝑎𝑟𝑑 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑠𝑎𝑣𝑒𝑑!\n\n🎉 𝑃𝑟𝑒𝑣𝑖𝑒𝑤:",
        "reseted": "🔄 𝐴𝑙𝑙 𝑟𝑎𝑛𝑘 𝑐𝑎𝑟𝑑 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑟𝑒𝑠𝑒𝑡 𝑡𝑜 𝑑𝑒𝑓𝑎𝑢𝑙𝑡",
        "invalidAlpha": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑎𝑛 𝑜𝑝𝑎𝑐𝑖𝑡𝑦 𝑣𝑎𝑙𝑢𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 0 𝑎𝑛𝑑 1"
    }
};

module.exports.onLoad = function() {
    const cacheDir = path.join(__dirname, 'cache');
    try {
        fs.ensureDirSync(cacheDir);
    } catch (e) {
    }
};

module.exports.onStart = async function({ api, event, args, message, usersData, threadsData }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const lang = this.languages.en;

    const reply = async (msg, attach) => {
        if (attach) {
            return api.sendMessage({ body: msg, attachment: attach }, threadID);
        } else {
            return api.sendMessage(msg, threadID);
        }
    };

    if (!args || !args[0]) {
        const guideMsg = 
            "🎨 𝑐𝑢𝑠𝑡𝑜𝑚𝑟𝑎𝑛𝑘𝑐𝑎𝑟𝑑 [𝑚𝑎𝑖𝑛𝑐𝑜𝑙𝑜𝑟 | 𝑠𝑢𝑏𝑐𝑜𝑙𝑜𝑟 | 𝑙𝑖𝑛𝑒𝑐𝑜𝑙𝑜𝑟 | 𝑒𝑥𝑝𝑏𝑎𝑟𝑐𝑜𝑙𝑜𝑟 | 𝑝𝑟𝑜𝑔𝑟𝑒𝑠𝑠𝑐𝑜𝑙𝑜𝑟 | 𝑎𝑙𝑝ℎ𝑎𝑠𝑢𝑏𝑐𝑜𝑙𝑜𝑟 | 𝑡𝑒𝑥𝑡𝑐𝑜𝑙𝑜𝑟 | 𝑛𝑎𝑚𝑒𝑐𝑜𝑙𝑜𝑟 | 𝑒𝑥𝑝𝑐𝑜𝑙𝑜𝑟 | 𝑟𝑎𝑛𝑘𝑐𝑜𝑙𝑜𝑟 | 𝑙𝑒𝑣𝑒𝑙𝑐𝑜𝑙𝑜𝑟 | 𝑟𝑒𝑠𝑒𝑡] <𝑣𝑎𝑙𝑢𝑒>\n\n" +
            "🌈 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑜𝑝𝑡𝑖𝑜𝑛𝑠:\n" +
            "  • 𝑚𝑎𝑖𝑛𝑐𝑜𝑙𝑜𝑟 | 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 <𝑣𝑎𝑙𝑢𝑒> - 𝑀𝑎𝑖𝑛 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 (𝑔𝑟𝑎𝑑𝑖𝑒𝑛𝑡/𝑖𝑚𝑎𝑔𝑒)\n" +
            "  • 𝑠𝑢𝑏𝑐𝑜𝑙𝑜𝑟 <𝑣𝑎𝑙𝑢𝑒> - 𝑆𝑢𝑏 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑\n" +
            "  • 𝑙𝑖𝑛𝑒𝑐𝑜𝑙𝑜𝑟 <𝑣𝑎𝑙𝑢𝑒> - 𝐿𝑖𝑛𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑𝑠\n" +
            "  • 𝑒𝑥𝑝𝑏𝑎𝑟𝑐𝑜𝑙𝑜𝑟 <𝑣𝑎𝑙𝑢𝑒> - 𝐸𝑥𝑝𝑒𝑟𝑖𝑒𝑛𝑐𝑒 𝑏𝑎𝑟 𝑐𝑜𝑙𝑜𝑟\n" +
            "  • 𝑝𝑟𝑜𝑔𝑟𝑒𝑠𝑠𝑐𝑜𝑙𝑜𝑟 <𝑣𝑎𝑙𝑢𝑒> - 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑝𝑟𝑜𝑔𝑟𝑒𝑠𝑠 𝑐𝑜𝑙𝑜𝑟\n" +
            "  • 𝑎𝑙𝑝ℎ𝑎𝑠𝑢𝑏𝑐𝑜𝑙𝑜𝑟 <𝑣𝑎𝑙𝑢𝑒> - 𝑆𝑢𝑏 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑜𝑝𝑎𝑐𝑖𝑡𝑦 (0-1)\n" +
            "  • 𝑡𝑒𝑥𝑡𝑐𝑜𝑙𝑜𝑟 <𝑣𝑎𝑙𝑢𝑒> - 𝑇𝑒𝑥𝑡 𝑐𝑜𝑙𝑜𝑟\n" +
            "  • 𝑛𝑎𝑚𝑒𝑐𝑜𝑙𝑜𝑟 <𝑣𝑎𝑙𝑢𝑒> - 𝑁𝑎𝑚𝑒 𝑐𝑜𝑙𝑜𝑟\n" +
            "  • 𝑒𝑥𝑝𝑐𝑜𝑙𝑜𝑟 <𝑣𝑎𝑙𝑢𝑒> - 𝐸𝑋𝑃 𝑡𝑒𝑥𝑡 𝑐𝑜𝑙𝑜𝑟\n" +
            "  • 𝑟𝑎𝑛𝑘𝑐𝑜𝑙𝑜𝑟 <𝑣𝑎𝑙𝑢𝑒> - 𝑅𝑎𝑛𝑘 𝑡𝑒𝑥𝑡 𝑐𝑜𝑙𝑜𝑟\n" +
            "  • 𝑙𝑒𝑣𝑒𝑙𝑐𝑜𝑙𝑜𝑟 <𝑣𝑎𝑙𝑢𝑒> - 𝐿𝑒𝑣𝑒𝑙 𝑡𝑒𝑥𝑡 𝑐𝑜𝑙𝑜𝑟\n\n" +
            "💡 𝑉𝑎𝑙𝑢𝑒 𝑐𝑎𝑛 𝑏𝑒: ℎ𝑒𝑥 𝑐𝑜𝑑𝑒, 𝑟𝑔𝑏, 𝑟𝑔𝑏𝑎, 𝑔𝑟𝑎𝑑𝑖𝑒𝑛𝑡 (𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑐𝑜𝑙𝑜𝑟𝑠 𝑠𝑒𝑝𝑎𝑟𝑎𝑡𝑒𝑑 𝑏𝑦 𝑠𝑝𝑎𝑐𝑒), 𝑜𝑟 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿\n" +
            "📸 𝑌𝑜𝑢 𝑐𝑎𝑛 𝑎𝑙𝑠𝑜 𝑠𝑒𝑛𝑑 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑎𝑠 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡\n\n" +
            "🔄 𝑐𝑢𝑠𝑡𝑜𝑚𝑟𝑎𝑛𝑘𝑐𝑎𝑟𝑑 𝑟𝑒𝑠𝑒𝑡 - 𝑅𝑒𝑠𝑒𝑡 𝑎𝑙𝑙 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 𝑡𝑜 𝑑𝑒𝑓𝑎𝑢𝑙𝑡";
        
        return reply(guideMsg);
    }

    let customRankCard = (await threadsData.get(threadID, "data.customRankCard")) || {};
    const key = args[0].toLowerCase();
    let value = args.slice(1).join(" ").trim();

    const checkUrlRegex = /https?:\/\/.*\.(?:png|jpg|jpeg|gif)/gi;
    const regExColor = /#([0-9a-f]{6})|rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)|rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+\.?\d*)\)/gi;

    const supportImage = ["maincolor", "background", "bg", "subcolor", "expbarcolor", "progresscolor", "linecolor"];
    const notSupportImage = ["textcolor", "namecolor", "expcolor", "rankcolor", "levelcolor", "lvcolor"];

    try {
        const attachments = [
            ...(event.attachments || []).filter(a => ["photo", "animated_image"].includes(a.type)),
            ...(event.messageReply?.attachments || []).filter(a => ["photo", "animated_image"].includes(a.type))
        ];

        if (value === 'reset' || key === 'reset') {
            await threadsData.set(threadID, { customRankCard: {} }, "data");
            return reply("🔄 𝐴𝑙𝑙 𝑟𝑎𝑛𝑘 𝑐𝑎𝑟𝑑 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑟𝑒𝑠𝑒𝑡 𝑡𝑜 𝑑𝑒𝑓𝑎𝑢𝑙𝑡");
        }

        if ([...notSupportImage, ...supportImage].includes(key)) {
            if (value.match(/^https?:\/\//)) {
                const matchUrl = value.match(checkUrlRegex);
                if (!matchUrl) return reply(lang.invalidImage);
                value = matchUrl[0];
            } else if (attachments.length > 0) {
                if (!["photo", "animated_image"].includes(attachments[0].type))
                    return reply(lang.invalidAttachment);
                value = attachments[0].url;
            } else {
                const colors = value.match(regExColor);
                if (!colors) return reply(lang.invalidColor);
                value = colors.length === 1 ? colors[0] : colors;
            }

            if (value !== "reset" && notSupportImage.includes(key) && String(value).startsWith?.("http")) {
                return reply(lang.notSupportImage.replace("%1", key));
            }

            switch (key) {
                case "maincolor":
                case "background":
                case "bg":
                    value === "reset" ? delete customRankCard.main_color : customRankCard.main_color = value;
                    break;
                case "subcolor":
                    value === "reset" ? delete customRankCard.sub_color : customRankCard.sub_color = value;
                    break;
                case "linecolor":
                    value === "reset" ? delete customRankCard.line_color : customRankCard.line_color = value;
                    break;
                case "progresscolor":
                    value === "reset" ? delete customRankCard.exp_color : customRankCard.exp_color = value;
                    break;
                case "expbarcolor":
                    value === "reset" ? delete customRankCard.expNextLevel_color : customRankCard.expNextLevel_color = value;
                    break;
                case "textcolor":
                    value === "reset" ? delete customRankCard.text_color : customRankCard.text_color = value;
                    break;
                case "namecolor":
                    value === "reset" ? delete customRankCard.name_color : customRankCard.name_color = value;
                    break;
                case "rankcolor":
                    value === "reset" ? delete customRankCard.rank_color : customRankCard.rank_color = value;
                    break;
                case "levelcolor":
                case "lvcolor":
                    value === "reset" ? delete customRankCard.level_color : customRankCard.level_color = value;
                    break;
                case "expcolor":
                    value === "reset" ? delete customRankCard.exp_text_color : customRankCard.exp_text_color = value;
                    break;
            }

            await threadsData.set(threadID, { customRankCard }, "data");
            
            const userData = await usersData.get(senderID) || {};
            const rankCardPreviewBuffer = await generateRankCardPreview(userData, customRankCard);

            const cacheDir = path.join(__dirname, 'cache');
            fs.ensureDirSync(cacheDir);
            const tmpPath = path.join(cacheDir, `crc_preview_${senderID}_${Date.now()}.png`);
            fs.writeFileSync(tmpPath, rankCardPreviewBuffer);

            await reply(lang.success, fs.createReadStream(tmpPath));
            
            setTimeout(() => {
                try { fs.unlinkSync(tmpPath); } catch (e) { }
            }, 15000);

        } else if (["alphasubcolor", "alphasubcard"].includes(key)) {
            const alphaValue = parseFloat(value);
            if (isNaN(alphaValue) || alphaValue < 0 || alphaValue > 1)
                return reply(lang.invalidAlpha);
            customRankCard.alpha_subcard = alphaValue;
            await threadsData.set(threadID, { customRankCard }, "data");

            const userData = await usersData.get(senderID) || {};
            const rankCardPreviewBuffer = await generateRankCardPreview(userData, customRankCard);

            const cacheDir = path.join(__dirname, 'cache');
            fs.ensureDirSync(cacheDir);
            const tmpPath = path.join(cacheDir, `crc_preview_${senderID}_${Date.now()}.png`);
            fs.writeFileSync(tmpPath, rankCardPreviewBuffer);

            await reply(lang.success, fs.createReadStream(tmpPath));
            setTimeout(() => {
                try { fs.unlinkSync(tmpPath); } catch (e) { }
            }, 15000);

        } else if (key === "reset") {
            await threadsData.set(threadID, { customRankCard: {} }, "data");
            return reply(lang.reseted);
        } else {
            return reply("⚠️ 𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑜𝑝𝑡𝑖𝑜𝑛. 𝑈𝑠𝑒 `𝑐𝑢𝑠𝑡𝑜𝑚𝑟𝑎𝑛𝑘𝑐𝑎𝑟𝑑` 𝑡𝑜 𝑠𝑒𝑒 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑜𝑝𝑡𝑖𝑜𝑛𝑠.");
        }
    } catch (err) {
        console.error(err);
        return reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: " + (err.message || err));
    }
};

async function generateRankCardPreview(userData = {}, customRankCard = {}) {
    const canvas = createCanvas(800, 300);
    const ctx = canvas.getContext('2d');

    if (customRankCard.main_color) {
        if (Array.isArray(customRankCard.main_color)) {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            customRankCard.main_color.forEach((color, i) => {
                gradient.addColorStop(i / (customRankCard.main_color.length - 1), color);
            });
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (String(customRankCard.main_color).startsWith('http')) {
            try {
                const img = await loadImage(customRankCard.main_color);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } catch (e) {
                ctx.fillStyle = '#36393f';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        } else {
            ctx.fillStyle = customRankCard.main_color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    } else {
        ctx.fillStyle = '#36393f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const alpha = typeof customRankCard.alpha_subcard === 'number' ? customRankCard.alpha_subcard : 0.5;
    const subColor = customRankCard.sub_color ? adjustAlpha(customRankCard.sub_color, alpha) : `rgba(0, 0, 0, ${alpha})`;
    ctx.fillStyle = subColor;
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

    if (customRankCard.line_color) {
        ctx.strokeStyle = customRankCard.line_color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, 60);
        ctx.lineTo(canvas.width - 20, 60);
        ctx.stroke();
    }

    ctx.fillStyle = customRankCard.name_color || '#ffffff';
    ctx.font = 'bold 28px Arial';
    const displayName = userData.name || '𝑈𝑠𝑒𝑟';
    ctx.fillText(displayName, 150, 80);

    ctx.fillStyle = customRankCard.level_color || '#f1c40f';
    ctx.font = '20px Arial';
    ctx.fillText('𝐿𝑒𝑣𝑒𝑙: 25', 150, 120);

    ctx.fillStyle = customRankCard.rank_color || '#e74c3c';
    ctx.fillText('𝑅𝑎𝑛𝑘: #15', 300, 120);

    ctx.fillStyle = customRankCard.expNextLevel_color || '#2c3e50';
    ctx.fillRect(150, 160, 500, 20);

    ctx.fillStyle = customRankCard.exp_color || '#3498db';
    ctx.fillRect(150, 160, 350, 20);

    ctx.fillStyle = customRankCard.exp_text_color || '#ecf0f1';
    ctx.font = '16px Arial';
    ctx.fillText('3500/5000 𝑋𝑃', 150, 200);

    ctx.save();
    ctx.beginPath();
    ctx.arc(80, 150, 60, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    if (userData.avatar) {
        try {
            const av = await loadImage(userData.avatar);
            ctx.drawImage(av, 20, 90, 120, 120);
        } catch (e) {
            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(20, 90, 120, 120);
        }
    } else {
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(20, 90, 120, 120);
    }
    ctx.restore();

    return canvas.toBuffer();
}

function adjustAlpha(color, alpha) {
    try {
        if (String(color).startsWith('#')) {
            const hex = color.replace('#', '');
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else if (String(color).startsWith('rgb')) {
            const match = color.match(/(\d+),\s*(\d+),\s*(\d+)(,\s*[\d.]+)?/);
            if (match) {
                return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
            }
        }
    } catch (e) {
    }
    return color;
}
