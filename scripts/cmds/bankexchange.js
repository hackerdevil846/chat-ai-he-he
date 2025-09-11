const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "bankexchange",
    aliases: ["exchange", "bank"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "economy",
    shortDescription: {
        en: "𝐵𝑎𝑛𝑘 𝑒𝑥𝑐ℎ𝑎𝑛𝑔𝑒 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    longDescription: {
        en: "𝐸𝑥𝑐ℎ𝑎𝑛𝑔𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑚𝑜𝑛𝑒𝑦 𝑎𝑛𝑑 𝑒𝑥𝑝 𝑝𝑜𝑖𝑛𝑡𝑠"
    },
    guide: {
        en: "{p}bankexchange [𝑐ℎ𝑒𝑐𝑘]"
    },
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = function () {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    const billFile = path.join(cacheDir, "bill.json");
    if (!fs.existsSync(billFile)) {
        fs.writeFileSync(billFile, JSON.stringify([]));
    }
};

module.exports.onStart = async function ({ event, message, args, usersData, api }) {
    const billFile = path.join(__dirname, "cache", "bill.json");
    
    if (!fs.existsSync(billFile)) {
        fs.writeFileSync(billFile, JSON.stringify([]));
    }

    const getData = JSON.parse(fs.readFileSync(billFile, "utf8"));

    if (!args[0]) {
        const menuMessage = `🏦 𝗕𝗔𝗡𝗞 𝗘𝗫𝗖𝗛𝗔𝗡𝗚𝗘 𝗦𝗬𝗦𝗧𝗘𝗠
━━━━━━━━━━━━━━
𝟭. 𝐸𝑥𝑐ℎ𝑎𝑛𝑔𝑒 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑒𝑥𝑝 💰→⭐
𝟮. 𝐸𝑥𝑐ℎ𝑎𝑛𝑔𝑒 𝑒𝑥𝑝 𝑡𝑜 𝑚𝑜𝑛𝑒𝑦 ⭐→💰
𝟯. 𝑈𝑝𝑑𝑎𝑡𝑒 𝑠𝑜𝑜𝑛 ⚒

𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑐ℎ𝑜𝑜𝑠𝑒`;

        return message.reply(menuMessage, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "banking"
            });
        });
    }

    if (args[0] === "check") {
        if (getData.length === 0) {
            return message.reply("📭 𝑁𝑜 𝑡𝑟𝑎𝑛𝑠𝑎𝑐𝑡𝑖𝑜𝑛 ℎ𝑖𝑠𝑡𝑜𝑟𝑦 𝑓𝑜𝑢𝑛𝑑");
        }
        
        let workList = "📋 𝗧𝗥𝗔𝗡𝗦𝗔𝗖𝗧𝗜𝗢𝗡 𝗛𝗜𝗦𝗧𝗢𝗥𝗬\n━━━━━━━━━━━━━━\n";
        getData.forEach((item, index) => {
            workList += `\n${index + 1}. ${item}`;
        });
        return message.reply(workList);
    }
};

module.exports.onReply = async function ({ event, message, handleReply, usersData, api }) {
    if (handleReply.author !== event.senderID) return;

    const billFile = path.join(__dirname, "cache", "bill.json");
    const getData = JSON.parse(fs.readFileSync(billFile, "utf8"));

    const userData = await usersData.get(handleReply.author);
    const exp = userData.exp;
    const money = userData.money;
    const d = new Date();
    const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    const time = `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;

    switch (handleReply.type) {
        case "banking": {
            switch (event.body) {
                case "1": {
                    return message.reply(
                        "💵 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑎𝑚𝑜𝑢𝑛𝑡 𝑜𝑓 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑒𝑥𝑐ℎ𝑎𝑛𝑔𝑒 𝑡𝑜 𝑒𝑥𝑝\n𝑅𝑎𝑡𝑒: 10$ = 1⭐ 𝑒𝑥𝑝",
                        (error, info) => {
                            global.client.handleReply.push({
                                name: this.config.name,
                                messageID: info.messageID,
                                author: event.senderID,
                                type: "money"
                            });
                        }
                    );
                }
                case "2": {
                    return message.reply(
                        "⭐ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑎𝑚𝑜𝑢𝑛𝑡 𝑜𝑓 𝑒𝑥𝑝 𝑡𝑜 𝑒𝑥𝑐ℎ𝑎𝑛𝑔𝑒 𝑡𝑜 𝑚𝑜𝑛𝑒𝑦\n𝑅𝑎𝑡𝑒: 5⭐ 𝑒𝑥𝑝 = 1$",
                        (error, info) => {
                            global.client.handleReply.push({
                                name: this.config.name,
                                messageID: info.messageID,
                                author: event.senderID,
                                type: "exp"
                            });
                        }
                    );
                }
                default:
                    return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐ℎ𝑜𝑖𝑐𝑒");
            }
        }

        case "exp": {
            const content = parseInt(event.body);
            if (isNaN(content)) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟");
            }
            if (content > exp) {
                return message.reply("❌ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑒𝑛𝑜𝑢𝑔ℎ 𝑒𝑥𝑝 𝑝𝑜𝑖𝑛𝑡𝑠");
            }

            const moneyGain = Math.floor(content / 5);
            await usersData.set(handleReply.author, {
                money: money + moneyGain,
                exp: exp - content
            });

            const msg = `✅ 𝐸𝑋𝐶𝐻𝐴𝑁𝐺𝐸 𝑆𝑈𝐶𝐶𝐸𝑆𝑆𝐹𝑈𝐿!\n⏰ 𝑇𝑖𝑚𝑒: ${time} - ${date}\n📊 𝐷𝑒𝑡𝑎𝑖𝑙𝑠: ${content}⭐ → ${moneyGain}$`;
            
            message.reply(msg);
            getData.push(msg);
            fs.writeFileSync(billFile, JSON.stringify(getData));
            
            return message.reply("✅ 𝑇𝑟𝑎𝑛𝑠𝑎𝑐𝑡𝑖𝑜𝑛 𝑠𝑎𝑣𝑒𝑑 𝑡𝑜 ℎ𝑖𝑠𝑡𝑜𝑟𝑦");
        }

        case "money": {
            const content = parseInt(event.body);
            if (isNaN(content)) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟");
            }
            if (content > money) {
                return message.reply("❌ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑒𝑛𝑜𝑢𝑔ℎ 𝑚𝑜𝑛𝑒𝑦");
            }

            const expGain = Math.floor(content / 10);
            await usersData.set(handleReply.author, {
                money: money - content,
                exp: exp + expGain
            });

            const msg = `✅ 𝐸𝑋𝐶𝐻𝐴𝑁𝐺𝐸 𝑆𝑈𝐶𝐶𝐸𝑆𝑆𝐹𝑈𝐿!\n⏰ 𝑇𝑖𝑚𝑒: ${time} - ${date}\n📊 𝐷𝑒𝑡𝑎𝑖𝑙𝑠: ${content}$ → ${expGain}⭐`;
            
            message.reply(msg);
            getData.push(msg);
            fs.writeFileSync(billFile, JSON.stringify(getData));
            
            return message.reply("✅ 𝑇𝑟𝑎𝑛𝑠𝑎𝑐𝑡𝑖𝑜𝑛 𝑠𝑎𝑣𝑒𝑑 𝑡𝑜 ℎ𝑖𝑠𝑡𝑜𝑟𝑦");
        }
    }
};
