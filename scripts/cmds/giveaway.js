const fs = require('fs-extra');

module.exports.config = {
    name: "giveaway",
    aliases: ["gift", "gaway"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "economy",
    shortDescription: {
        en: "🎉 𝐴𝑑𝑣𝑎𝑛𝑐𝑒𝑑 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    longDescription: {
        en: "🎉 𝐴𝑑𝑣𝑎𝑛𝑐𝑒𝑑 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡 𝑠𝑦𝑠𝑡𝑒𝑚 𝑤𝑖𝑡ℎ 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛 𝑠𝑢𝑝𝑝𝑜𝑟𝑡"
    },
    guide: {
        en: "{p}giveaway [𝑐𝑟𝑒𝑎𝑡𝑒/𝑑𝑒𝑡𝑎𝑖𝑙𝑠/𝑗𝑜𝑖𝑛/𝑟𝑜𝑙𝑙/𝑒𝑛𝑑] [𝐼𝐷𝐺𝑖𝑣𝑒𝐴𝑤𝑎𝑦]"
    },
    dependencies: {
        "fs-extra": ""
    },
    envConfig: {
        maxGiveaways: 50
    }
};

module.exports.languages = {
    "en": {
        "createSuccess": "🎉 𝑁𝑒𝑤 𝐺𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝐶𝑟𝑒𝑎𝑡𝑒𝑑!",
        "detailsTitle": "📊 𝐺𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝐷𝑒𝑡𝑎𝑖𝑙𝑠",
        "joinSuccess": "✅ 𝐽𝑜𝑖𝑛𝑒𝑑 𝐺𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!",
        "winnerSelected": "🎁 𝑊𝑖𝑛𝑛𝑒𝑟 𝑆𝑒𝑙𝑒𝑐𝑡𝑒𝑑!",
        "giveawayEnded": "🔚 𝐺𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝐸𝑛𝑑𝑒𝑑!",
        "missingReward": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑡ℎ𝑒 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝑟𝑒𝑤𝑎𝑟𝑑!",
        "missingID": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝐼𝐷!",
        "notFound": "❌ 𝐺𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑!",
        "alreadyJoined": "❌ 𝑌𝑜𝑢'𝑣𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑗𝑜𝑖𝑛𝑒𝑑 𝑡ℎ𝑖𝑠 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦!",
        "notOwner": "❌ 𝑂𝑛𝑙𝑦 𝑡ℎ𝑒 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝑐𝑟𝑒𝑎𝑡𝑜𝑟 𝑐𝑎𝑛 𝑝𝑒𝑟𝑓𝑜𝑟𝑚 𝑡ℎ𝑖𝑠 𝑎𝑐𝑡𝑖𝑜𝑛!",
        "noParticipants": "❌ 𝑁𝑜 𝑝𝑎𝑟𝑡𝑖𝑐𝑖𝑝𝑎𝑛𝑡𝑠 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦!"
    }
};

module.exports.onLoad = function() {
    try {
        const path = __dirname + "/cache/giveaways.json";
        
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify({}), "utf-8");
        }
        
        const data = JSON.parse(fs.readFileSync(path, "utf-8"));
        global.data.GiveAway = new Map(Object.entries(data));
    } catch (error) {
        console.error("𝐺𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝑜𝑛𝐿𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        global.data.GiveAway = new Map();
    }
};

module.exports.handleReaction = async function({ api, event, handleReaction, Users }) {
    try {
        const data = global.data.GiveAway.get(handleReaction.ID);
        if (!data || data.status !== "open") return;

        const { userID, reaction } = event;
        const userInfo = await Users.getInfo(userID);
        const userName = userInfo.name || "𝑈𝑠𝑒𝑟";

        if (!reaction) {
            data.joined = data.joined.filter(id => id !== userID);
            api.sendMessage(`❌ ${userName} 𝑙𝑒𝑓𝑡 𝑡ℎ𝑒 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦 (𝐼𝐷: #${handleReaction.ID})`, event.threadID);
        } else {
            if (!data.joined.includes(userID)) {
                data.joined.push(userID);
                api.sendMessage(`✅ ${userName} 𝑗𝑜𝑖𝑛𝑒𝑑 𝑡ℎ𝑒 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦 (𝐼𝐷: #${handleReaction.ID})`, event.threadID);
            }
        }

        global.data.GiveAway.set(handleReaction.ID, data);
        const path = __dirname + "/cache/giveaways.json";
        fs.writeFileSync(
            path, 
            JSON.stringify(Object.fromEntries(global.data.GiveAway), null, 2)
        );
    } catch (error) {
        console.error("𝐺𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onStart = async function({ api, event, args, Users, getText }) {
    const { threadID, messageID, senderID } = event;
    const path = __dirname + "/cache/giveaways.json";

    const getLang = (key) => {
        return module.exports.languages["en"][key] || key;
    };

    const saveData = () => {
        fs.writeFileSync(path, JSON.stringify(Object.fromEntries(global.data.GiveAway), null, 2));
    };

    switch (args[0]) {
        case "create": {
            const reward = args.slice(1).join(" ");
            if (!reward) return api.sendMessage(getLang("missingReward"), threadID, messageID);

            const giveawayID = Math.floor(10000 + Math.random() * 90000);
            const userInfo = await Users.getInfo(senderID);
            const userName = userInfo.name || "𝑈𝑠𝑒𝑟";

            const message = await api.sendMessage({
                body: `🎉====== 𝐆𝐈𝐕𝐄𝐀𝐖𝐀𝐘 ======🎉\n` +
                    `👤 𝐶𝑟𝑒𝑎𝑡𝑜𝑟: ${userName}\n` +
                    `🎁 𝑅𝑒𝑤𝑎𝑟𝑑: ${reward}\n` +
                    `🆔 𝐼𝐷: #${giveawayID}\n` +
                    `📊 𝑆𝑡𝑎𝑡𝑢𝑠: 🟢 𝑂𝑃𝐸𝑁\n\n` +
                    `💬 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑗𝑜𝑖𝑛!`,
                mentions: [{
                    tag: userName,
                    id: senderID
                }]
            }, threadID);

            const giveawayData = {
                ID: giveawayID,
                author: userName,
                authorID: senderID,
                messageID: message.messageID,
                reward: reward,
                joined: [],
                status: "open",
                createdAt: Date.now()
            };

            global.data.GiveAway.set(giveawayID.toString(), giveawayData);
            saveData();

            global.client.handleReaction.push({
                name: this.config.name,
                messageID: message.messageID,
                author: senderID,
                ID: giveawayID.toString()
            });

            return api.sendMessage(getLang("createSuccess"), threadID, messageID);
        }

        case "details": {
            if (!args[1]) return api.sendMessage(getLang("missingID"), threadID, messageID);
            
            const giveawayID = args[1].replace("#", "");
            const data = global.data.GiveAway.get(giveawayID);
            
            if (!data) return api.sendMessage(getLang("notFound"), threadID, messageID);

            return api.sendMessage({
                body: `📊====== ${getLang("detailsTitle")} ======📊\n` +
                    `👤 𝐶𝑟𝑒𝑎𝑡𝑜𝑟: ${data.author}\n` +
                    `🎁 𝑅𝑒𝑤𝑎𝑟𝑑: ${data.reward}\n` +
                    `🆔 𝐼𝐷: #${data.ID}\n` +
                    `👥 𝑃𝑎𝑟𝑡𝑖𝑐𝑖𝑝𝑎𝑛𝑡𝑠: ${data.joined.length}\n` +
                    `📅 𝐶𝑟𝑒𝑎𝑡𝑒𝑑: ${new Date(data.createdAt).toLocaleString()}\n` +
                    `📌 𝑆𝑡𝑎𝑡𝑢𝑠: ${data.status === "open" ? "🟢 𝑂𝑃𝐸𝑁" : "🔴 𝐶𝐿𝑂𝑆𝐸𝐷"}`
            }, threadID, messageID);
        }

        case "join": {
            if (!args[1]) return api.sendMessage(getLang("missingID"), threadID, messageID);
            
            const giveawayID = args[1].replace("#", "");
            const data = global.data.GiveAway.get(giveawayID);
            
            if (!data) return api.sendMessage(getLang("notFound"), threadID, messageID);
            if (data.joined.includes(senderID)) return api.sendMessage(getLang("alreadyJoined"), threadID, messageID);

            data.joined.push(senderID);
            global.data.GiveAway.set(giveawayID, data);
            saveData();

            const userInfo = await Users.getInfo(senderID);
            return api.sendMessage(`✅ ${userInfo.name} ${getLang("joinSuccess")}`, threadID, messageID);
        }

        case "roll": {
            if (!args[1]) return api.sendMessage(getLang("missingID"), threadID, messageID);
            
            const giveawayID = args[1].replace("#", "");
            const data = global.data.GiveAway.get(giveawayID);
            
            if (!data) return api.sendMessage(getLang("notFound"), threadID, messageID);
            if (data.authorID !== senderID) return api.sendMessage(getLang("notOwner"), threadID, messageID);
            if (data.joined.length === 0) return api.sendMessage(getLang("noParticipants"), threadID, messageID);

            const winnerID = data.joined[Math.floor(Math.random() * data.joined.length)];
            const userInfo = await Users.getInfo(winnerID);

            return api.sendMessage({
                body: `🎉 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠 ${userInfo.name}!\n` +
                    `𝑌𝑜𝑢 𝑤𝑜𝑛 𝑡ℎ𝑒 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦: ${data.reward}\n` +
                    `🏆 𝐺𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝐼𝐷: #${data.ID}\n\n` +
                    `📩 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 ${data.author} 𝑡𝑜 𝑐𝑙𝑎𝑖𝑚 𝑦𝑜𝑢𝑟 𝑝𝑟𝑖𝑧𝑒!`,
                mentions: [{
                    tag: userInfo.name,
                    id: winnerID
                }]
            }, threadID, messageID);
        }

        case "end": {
            if (!args[1]) return api.sendMessage(getLang("missingID"), threadID, messageID);
            
            const giveawayID = args[1].replace("#", "");
            const data = global.data.GiveAway.get(giveawayID);
            
            if (!data) return api.sendMessage(getLang("notFound"), threadID, messageID);
            if (data.authorID !== senderID) return api.sendMessage(getLang("notOwner"), threadID, messageID);

            data.status = "ended";
            global.data.GiveAway.set(giveawayID, data);
            saveData();

            api.unsendMessage(data.messageID);
            return api.sendMessage(
                `🔚 𝐺𝑖𝑣𝑒𝑎𝑤𝑎𝑦 #${data.ID} ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑒𝑛𝑑𝑒𝑑 𝑏𝑦 ${data.author}!`, 
                threadID, 
                messageID
            );
        }

        default: {
            return api.sendMessage({
                body: `🎉 𝐆𝐈𝐕𝐄𝐀𝐖𝐀𝐘 𝐒𝐘𝐒𝐓𝐄𝐌 🎉\n\n` +
                    `📌 𝑐𝑟𝑒𝑎𝑡𝑒 [𝑟𝑒𝑤𝑎𝑟𝑑] - 𝐶𝑟𝑒𝑎𝑡𝑒 𝑛𝑒𝑤 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦\n` +
                    `📌 𝑑𝑒𝑡𝑎𝑖𝑙𝑠 [𝑖𝑑] - 𝑆ℎ𝑜𝑤 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝑑𝑒𝑡𝑎𝑖𝑙𝑠\n` +
                    `📌 𝑗𝑜𝑖𝑛 [𝑖𝑑] - 𝐽𝑜𝑖𝑛 𝑎 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦\n` +
                    `📌 𝑟𝑜𝑙𝑙 [𝑖𝑑] - 𝑅𝑜𝑙𝑙 𝑤𝑖𝑛𝑛𝑒𝑟\n` +
                    `📌 𝑒𝑛𝑑 [𝑖𝑑] - 𝐸𝑛𝑑 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦\n\n` +
                    `🔮 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑔𝑖𝑣𝑒𝑎𝑤𝑎𝑦 𝑐𝑟𝑒𝑎𝑡𝑒 $5 𝑃𝑎𝑦𝑃𝑎𝑙`
            }, threadID, messageID);
        }
    }
};
