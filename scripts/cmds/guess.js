const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const cacheDir = path.join(__dirname, 'cache');
const IMAGE_NAME = 'character.jpg';

module.exports.config = {
    name: "guess",
    aliases: ["animeguess", "character"],
    version: "1.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "game",
    shortDescription: {
        en: "𝐺𝑢𝑒𝑠𝑠 𝑡ℎ𝑒 𝑎𝑛𝑖𝑚𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟"
    },
    longDescription: {
        en: "𝐺𝑢𝑒𝑠𝑠 𝑡ℎ𝑒 𝑛𝑎𝑚𝑒 𝑜𝑓 𝑡ℎ𝑒 𝑎𝑛𝑖𝑚𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑡𝑟𝑎𝑖𝑡𝑠 𝑎𝑛𝑑 𝑡𝑎𝑔𝑠 𝑤𝑖𝑡ℎ 𝑟𝑎𝑛𝑑𝑜𝑚 𝑖𝑚𝑎𝑔𝑒𝑠."
    },
    guide: {
        en: "{p}guess"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "moment-timezone": ""
    }
};

module.exports.languages = {
    "en": {
        "startGame": "🎮 | 𝐺𝑢𝑒𝑠𝑠 𝑇ℎ𝑒 𝐴𝑛𝑖𝑚𝑒 𝐶ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟\n━━━━━━━━━━━━━━\n✨ 𝑇𝑟𝑎𝑖𝑡𝑠: %1\n🏷️ 𝑇𝑎𝑔𝑠: %2\n\n⏰ 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 15 𝑠𝑒𝑐𝑜𝑛𝑑𝑠 𝑡𝑜 𝑎𝑛𝑠𝑤𝑒𝑟!",
        "correct": "✅ | 𝐶𝑜𝑟𝑟𝑒𝑐𝑡 𝐴𝑛𝑠𝑤𝑒𝑟!\n\n💰 | 𝑌𝑜𝑢𝑟 𝑊𝑎𝑙𝑙𝑒𝑡:\n━━━━━━━━━━━━━━\n💵 𝐵𝑎𝑙𝑎𝑛𝑐𝑒: %1$\n🎁 𝑅𝑒𝑤𝑎𝑟𝑑: +%2$\n━━━━━━━━━━━━━━",
        "wrong": "❌ | 𝑊𝑟𝑜𝑛𝑔! 𝑇ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟 𝑤𝑎𝑠: %1",
        "error": "❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒."
    }
};

module.exports.onLoad = async function () {
    try {
        await fs.ensureDir(cacheDir);
        if (!global.client) global.client = {};
        if (!global.client.onReply || typeof global.client.onReply.set !== 'function') {
            global.client.onReply = new Map();
        }
    } catch (err) {
        console.error('[𝑔𝑢𝑒𝑠𝑠] 𝑜𝑛𝐿𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:', err);
    }
};

async function getMoneyForUser(userID, context = {}) {
    try {
        if (context.usersData && typeof context.usersData.get === 'function') {
            const money = await context.usersData.get(userID, "money");
            return Number(money) || 0;
        }
        if (context.Currencies && typeof context.Currencies.getData === 'function') {
            const d = await context.Currencies.getData(userID) || {};
            return Number(d.money) || 0;
        }
        if (context.Users && typeof context.Users.getData === 'function') {
            const d = await context.Users.getData(userID) || {};
            return Number(d.money) || 0;
        }
    } catch (e) {
        console.error('[𝑔𝑢𝑒𝑠𝑠] 𝑔𝑒𝑡𝑀𝑜𝑛𝑒𝑦𝐹𝑜𝑟𝑈𝑠𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:', e);
    }
    return 0;
}

async function setMoneyForUser(userID, amount, context = {}) {
    try {
        if (context.usersData && typeof context.usersData.set === 'function') {
            await context.usersData.set(userID, { money: amount });
            return;
        }
        if (context.Currencies && typeof context.Currencies.setData === 'function') {
            await context.Currencies.setData(userID, { money: amount });
            return;
        }
        if (context.Users && typeof context.Users.setData === 'function') {
            const d = (await context.Users.getData(userID)) || {};
            d.money = amount;
            await context.Users.setData(userID, d);
            return;
        }
    } catch (e) {
        console.error('[𝑔𝑢𝑒𝑠𝑠] 𝑠𝑒𝑡𝑀𝑜𝑛𝑒𝑦𝐹𝑜𝑟𝑈𝑠𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:', e);
    }
}

module.exports.onStart = async function({ message, event, args, usersData, Currencies, Users }) {
    try {
        const resp = await axios.get('https://global-prime-mahis-apis.vercel.app');
        if (!resp || !resp.data) throw new Error('𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒');

        const characters = resp.data.data;
        const charactersArray = Array.isArray(characters) ? characters : [characters];
        if (!charactersArray.length) throw new Error('𝑁𝑜 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑑𝑎𝑡𝑎 𝑟𝑒𝑡𝑢𝑟𝑛𝑒𝑑 𝑓𝑟𝑜𝑚 𝐴𝑃𝐼');

        const randomIndex = Math.floor(Math.random() * charactersArray.length);
        const pick = charactersArray[randomIndex];

        const image = pick.image || pick.img || pick.url;
        const traits = pick.traits || pick.description || pick.trait || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";
        const tags = pick.tags || pick.tag || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";
        const fullName = pick.fullName || pick.full_name || pick.name || "";
        const firstName = pick.firstName || pick.first_name || (typeof fullName === 'string' ? fullName.split(" ")[0] : "");

        if (!image) throw new Error('𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿 𝑓𝑜𝑟 𝑠𝑒𝑙𝑒𝑐𝑡𝑒𝑑 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟');

        await fs.ensureDir(cacheDir);
        const imagePath = path.join(cacheDir, IMAGE_NAME);
        const imageRes = await axios.get(image, { responseType: 'arraybuffer' });
        await fs.writeFile(imagePath, imageRes.data);

        const body = this.languages.en.startGame.replace('%1', traits).replace('%2', tags);

        await message.reply({
            body,
            attachment: fs.createReadStream(imagePath)
        }, async (err, info) => {
            if (err) {
                console.error('[𝑔𝑢𝑒𝑠𝑠] 𝑠𝑒𝑛𝑑𝑀𝑒𝑠𝑠𝑎𝑔𝑒 𝑒𝑟𝑟𝑜𝑟:', err);
                await message.reply(this.languages.en.error);
                await fs.unlink(imagePath).catch(() => {});
                return;
            }

            if (!global.client.onReply) global.client.onReply = new Map();

            global.client.onReply.set(info.messageID, {
                commandName: this.config.name,
                messageID: info.messageID,
                correctAnswer: [String(fullName || "").trim(), String(firstName || "").trim()].filter(Boolean),
                senderID: event.senderID,
                _created: Date.now()
            });

            setTimeout(async () => {
                try {
                    await message.unsend(info.messageID).catch(() => {});
                } catch (e) {}
                try {
                    global.client.onReply.delete(info.messageID);
                } catch (e) {}
                await fs.unlink(imagePath).catch(() => {});
            }, 15000);
        });

    } catch (err) {
        console.error('[𝑔𝑢𝑒𝑠𝑠] 𝑜𝑛𝑆𝑡𝑎𝑟𝑡 𝑒𝑟𝑟𝑜𝑟:', err);
        await message.reply(this.languages.en.error);
    }
};

module.exports.onReply = async function({ event, message, handleReply, usersData, Currencies, Users }) {
    try {
        if (!handleReply) {
            const repliedTo = event.messageReply ? event.messageReply.messageID : event.messageID;
            if (global.client && global.client.onReply) {
                handleReply = global.client.onReply.get(repliedTo) || null;
            }
        }

        if (!handleReply) return;

        if (event.senderID !== handleReply.senderID) return;

        const userAnswer = (event.body || "").trim().toLowerCase();
        const correctAnswers = (handleReply.correctAnswer || []).map(a => String(a).toLowerCase());

        if (correctAnswers.length === 0) {
            await message.reply(this.languages.en.error);
            return;
        }

        if (correctAnswers.includes(userAnswer)) {
            const reward = 1000;
            const currentMoney = await getMoneyForUser(event.senderID, { usersData, Users, Currencies });
            const newBalance = Number(currentMoney) + Number(reward);
            await setMoneyForUser(event.senderID, newBalance, { usersData, Users, Currencies });

            const successMsg = this.languages.en.correct.replace('%1', newBalance).replace('%2', reward);
            await message.reply(successMsg);
        } else {
            const wrongMsg = this.languages.en.wrong.replace('%1', (handleReply.correctAnswer || []).join(" 𝑜𝑟 "));
            await message.reply(wrongMsg);
        }

        try { await message.unsend(handleReply.messageID).catch(() => {}); } catch (e) {}
        try { await message.unsend(event.messageID).catch(() => {}); } catch (e) {}

        try { global.client.onReply.delete(handleReply.messageID); } catch (e) {}

    } catch (err) {
        console.error('[𝑔𝑢𝑒𝑠𝑠] 𝑜𝑛𝑅𝑒𝑝𝑙𝑦 𝑒𝑟𝑟𝑜𝑟:', err);
    }
};
