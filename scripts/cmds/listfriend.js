module.exports.config = {
    name: "listfriend",
    aliases: ["friendslist", "flist"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "system",
    shortDescription: {
        en: "𝑉𝑖𝑒𝑤 𝑎𝑛𝑑 𝑚𝑎𝑛𝑎𝑔𝑒 𝑓𝑟𝑖𝑒𝑛𝑑 𝑙𝑖𝑠𝑡"
    },
    longDescription: {
        en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑦𝑜𝑢𝑟 𝑓𝑟𝑖𝑒𝑛𝑑 𝑙𝑖𝑠𝑡 𝑤𝑖𝑡ℎ 𝑑𝑒𝑡𝑎𝑖𝑙𝑠 𝑎𝑛𝑑 𝑎𝑙𝑙𝑜𝑤𝑠 𝑑𝑒𝑙𝑒𝑡𝑖𝑛𝑔 𝑓𝑟𝑖𝑒𝑛𝑑𝑠"
    },
    guide: {
        en: "{p}listfriend [𝑝𝑎𝑔𝑒]"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.languages = {
    "en": {
        "listTitle": "🎭 𝑌𝑜𝑢𝑟 𝐹𝑟𝑖𝑒𝑛𝑑 𝐿𝑖𝑠𝑡: %1 𝐹𝑟𝑖𝑒𝑛𝑑𝑠 🎭",
        "listFormat": "┏⊰ 𝑁𝑜.%1\n┣⊰ 𝑁𝑎𝑚𝑒: %2\n┣⊰ 𝑈𝐼𝐷: %3\n┣⊰ 𝐺𝑒𝑛𝑑𝑒𝑟: %4\n┣⊰ 𝑉𝑎𝑛𝑖𝑡𝑦: %5\n┗⊰ 𝑃𝑟𝑜𝑓𝑖𝑙𝑒: %6",
        "pageInfo": "📄 𝑃𝑎𝑔𝑒 %1/%2",
        "instructions": "🎭 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑛𝑢𝑚𝑏𝑒𝑟𝑠 (1-10) 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒 𝑓𝑟𝑖𝑒𝑛𝑑𝑠\n🔢 𝑀𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑛𝑢𝑚𝑏𝑒𝑟𝑠 𝑠𝑒𝑝𝑎𝑟𝑎𝑡𝑒𝑑 𝑏𝑦 𝑠𝑝𝑎𝑐𝑒",
        "deleteSuccess": "🗑️ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝐷𝑒𝑙𝑒𝑡𝑒𝑑 𝐹𝑟𝑖𝑒𝑛𝑑𝑠 🗑️\n\n%1"
    }
};

module.exports.onReply = async function({ api, event, handleReply }) {
    if (event.senderID != handleReply.author) return;
    const { threadID, messageID } = event;
    
    const { listFriend, nameUser, urlUser, uidUser, messageID: replyID } = handleReply;
    const numbers = event.body.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n) && n > 0 && n <= listFriend.length);
    
    if (numbers.length === 0) return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟𝑠 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑", threadID, messageID);
    
    let deleteReport = "";
    for (const num of numbers) {
        const index = num - 1;
        try {
            await api.removeFriend(uidUser[index]);
            deleteReport += `❌ 𝐷𝑒𝑙𝑒𝑡𝑒𝑑: ${nameUser[index]}\n🔗 𝐿𝑖𝑛𝑘: ${urlUser[index]}\n\n`;
        } catch (error) {
            deleteReport += `⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒: ${nameUser[index]}\n`;
        }
    }
    
    api.sendMessage(deleteReport, threadID, () => 
        api.unsendMessage(replyID), messageID
    );
};

module.exports.onStart = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    try {
        const listFriend = (await api.getFriendsList()).map(friend => ({
            name: friend.fullName || "❌ 𝑁𝑎𝑚𝑒 𝑁𝑜𝑡 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒",
            uid: friend.userID,
            gender: friend.gender == 1 ? "♀️ 𝐹𝑒𝑚𝑎𝑙𝑒" : "♂️ 𝑀𝑎𝑙𝑒",
            vanity: friend.vanity || "❌ 𝑁𝑜 𝑉𝑎𝑛𝑖𝑡𝑦",
            profileUrl: friend.profileUrl
        }));

        const page = Math.max(parseInt(args[0]) || 1, 1);
        const limit = 10;
        const numPage = Math.ceil(listFriend.length / limit);
        const startIdx = limit * (page - 1);
        
        let msg = `╔═══════╗\n`;
        msg += `║ 𝐹𝑅𝐼𝐸𝑁𝐷 𝐿𝐼𝑆𝑇 ║\n`;
        msg += `╚═══════╝\n`;
        msg += `✦ 𝑇𝑜𝑡𝑎𝑙 𝐹𝑟𝑖𝑒𝑛𝑑𝑠: ${listFriend.length} ✦\n\n`;
        
        for (let i = startIdx; i < Math.min(startIdx + limit, listFriend.length); i++) {
            const friend = listFriend[i];
            msg += this.languages.en.listFormat
                .replace("%1", i+1)
                .replace("%2", friend.name)
                .replace("%3", friend.uid)
                .replace("%4", friend.gender)
                .replace("%5", friend.vanity)
                .replace("%6", friend.profileUrl) + "\n\n";
        }
        
        msg += `✦ ${this.languages.en.pageInfo.replace("%1", page).replace("%2", numPage)} ✦\n`;
        msg += `✦ ${this.languages.en.instructions} ✦`;

        return api.sendMessage(msg, threadID, (err, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                listFriend,
                nameUser: listFriend.map(f => f.name),
                urlUser: listFriend.map(f => f.profileUrl),
                uidUser: listFriend.map(f => f.uid)
            });
        }, messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑓𝑟𝑖𝑒𝑛𝑑 𝑙𝑖𝑠𝑡", threadID, messageID);
    }
};
