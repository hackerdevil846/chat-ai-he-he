module.exports.config = {
    name: "friends",
    aliases: ["friendlist", "managefriends"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "📜 𝐿𝑖𝑠𝑡 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑎𝑛𝑑 𝑚𝑎𝑛𝑎𝑔𝑒 𝑦𝑜𝑢𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑙𝑖𝑠𝑡"
    },
    longDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑦𝑜𝑢𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑙𝑖𝑠𝑡 - 𝑣𝑖𝑒𝑤 𝑎𝑛𝑑 𝑟𝑒𝑚𝑜𝑣𝑒 𝑓𝑟𝑖𝑒𝑛𝑑𝑠"
    },
    guide: {
        en: "{p}friends [𝑝𝑎𝑔𝑒 𝑛𝑢𝑚𝑏𝑒𝑟]"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.languages = {
    "en": {
        "invalidPage": "⚠️ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑎𝑔𝑒 𝑛𝑢𝑚𝑏𝑒𝑟! 𝑂𝑛𝑙𝑦 %1 𝑝𝑎𝑔𝑒𝑠 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒.",
        "emptyList": "📭 𝑌𝑜𝑢𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑙𝑖𝑠𝑡 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦.",
        "fetchError": "⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑙𝑖𝑠𝑡.",
        "removeError": "⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.",
        "noValid": "❌ 𝑁𝑜 𝑣𝑎𝑙𝑖𝑑 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑤𝑒𝑟𝑒 𝑠𝑒𝑙𝑒𝑐𝑡𝑒𝑑 𝑓𝑜𝑟 𝑟𝑒𝑚𝑜𝑣𝑎𝑙.",
        "removed": "✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 %1 𝑓𝑟𝑖𝑒𝑛𝑑(𝑠):\n\n%2"
    }
};

module.exports.onReply = async function({ api, event, handleReply, getText }) {
    const { threadID, senderID } = event;

    try {
        if (senderID.toString() !== handleReply.author) return;

        let msg = "";
        let processed = 0;
        const { uidUser, nameUser, urlUser } = handleReply;

        // --- Handle "all"
        if (event.body.toLowerCase() === "all") {
            for (let i = 0; i < uidUser.length; i++) {
                try {
                    await api.removeFriend(uidUser[i]);
                    msg += `👤 ${nameUser[i]}\n🔗 ${urlUser[i]}\n\n`;
                    processed++;
                } catch (e) {
                    console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 ${nameUser[i]}:`, e);
                }
            }
        } else {
            // --- Handle number selections
            const selections = event.body.split(',')
                .flatMap(item => {
                    if (item.includes('-')) {
                        const [start, end] = item.split('-').map(Number);
                        if (start > end) return [];
                        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
                    }
                    return Number(item.trim());
                })
                .filter(num => !isNaN(num) && num > 0 && num <= uidUser.length);

            const uniqueSelections = [...new Set(selections)];

            for (const num of uniqueSelections) {
                try {
                    await api.removeFriend(uidUser[num - 1]);
                    msg += `👤 ${nameUser[num - 1]}\n🔗 ${urlUser[num - 1]}\n\n`;
                    processed++;
                } catch (e) {
                    console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 ${nameUser[num - 1]}:`, e);
                }
            }
        }

        // --- Send result
        if (processed > 0) {
            api.sendMessage(
                getText("removed", processed, msg),
                threadID,
                () => api.unsendMessage(handleReply.messageID)
            );
        } else {
            api.sendMessage(getText("noValid"), threadID);
        }
    } catch (err) {
        console.error("𝐹𝑟𝑖𝑒𝑛𝑑𝑠 𝑟𝑒𝑝𝑙𝑦 𝑒𝑟𝑟𝑜𝑟:", err);
        api.sendMessage(getText("removeError"), threadID);
    }
};

module.exports.onStart = async function({ api, event, args, getText }) {
    const { threadID, senderID } = event;

    try {
        // --- Fetch friends
        const friendsList = await api.getFriendsList();
        const friendCount = friendsList.length;

        if (friendCount === 0) {
            return api.sendMessage(getText("emptyList"), threadID);
        }

        // --- Format data
        const formattedFriends = friendsList.map(friend => ({
            name: friend.fullName || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑁𝑎𝑚𝑒",
            uid: friend.userID,
            gender: friend.gender || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛",
            vanity: friend.vanity || "𝑁𝑜 𝑉𝑎𝑛𝑖𝑡𝑦",
            profileUrl: friend.profileUrl || "ℎ𝑡𝑡𝑝𝑠://𝑤𝑤𝑤.𝑓𝑎𝑐𝑒𝑏𝑜𝑜𝑘.𝑐𝑜𝑚"
        }));

        // --- Pagination
        const page = Math.max(1, parseInt(args[0]) || 1);
        const perPage = 10;
        const totalPages = Math.ceil(formattedFriends.length / perPage);

        if (page > totalPages) {
            return api.sendMessage(getText("invalidPage", totalPages), threadID);
        }

        let message = `👥 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 ${friendCount} 𝑓𝑟𝑖𝑒𝑛𝑑𝑠\n📄 𝑃𝑎𝑔𝑒 ${page}/${totalPages}\n\n`;
        const startIndex = (page - 1) * perPage;
        const endIndex = Math.min(page * perPage, formattedFriends.length);

        for (let i = startIndex; i < endIndex; i++) {
            const friend = formattedFriends[i];
            const num = i + 1;
            message += `🔢 ${num}. ${friend.name}\n🆔 𝐼𝐷: ${friend.uid}\n🌕 𝐺𝑒𝑛𝑑𝑒𝑟: ${friend.gender}\n🎭 𝑉𝑎𝑛𝑖𝑡𝑦: ${friend.vanity}\n🔗 𝑃𝑟𝑜𝑓𝑖𝑙𝑒: ${friend.profileUrl}\n\n`;
        }

        message += `📌 𝑅𝑒𝑚𝑜𝑣𝑎𝑙 𝐼𝑛𝑠𝑡𝑟𝑢𝑐𝑡𝑖𝑜𝑛𝑠:\n`
            + `• 𝑆𝑖𝑛𝑔𝑙𝑒: 1, 3, 5\n`
            + `• 𝑅𝑎𝑛𝑔𝑒: 1-5\n`
            + `• 𝐶𝑜𝑚𝑏𝑖𝑛𝑒𝑑: 1, 3-5, 7\n`
            + `• 𝐴𝑙𝑙: 𝑡𝑦𝑝𝑒 "𝑎𝑙𝑙"\n\n`
            + `✍️ 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛`;

        // --- Store reply data
        const nameUser = formattedFriends.map(f => f.name);
        const urlUser = formattedFriends.map(f => f.profileUrl);
        const uidUser = formattedFriends.map(f => f.uid);

        return api.sendMessage(message, threadID, (err, info) => {
            if (err) {
                console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑙𝑖𝑠𝑡:", err);
                return api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑖𝑠𝑝𝑙𝑎𝑦 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑙𝑖𝑠𝑡.", threadID);
            }

            global.client.handleReply.push({
                commandName: module.exports.config.name,
                author: senderID,
                messageID: info.messageID,
                nameUser,
                urlUser,
                uidUser,
                type: 'reply'
            });
        });

    } catch (err) {
        console.error("𝐹𝑟𝑖𝑒𝑛𝑑𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", err);
        return api.sendMessage(getText("fetchError"), threadID);
    }
};
