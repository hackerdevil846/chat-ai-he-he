var limit = 20;

module.exports.config = {
	name: "count",
	version: "1.8.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑪𝒉𝒆𝒄𝒌 𝒈𝒓𝒐𝒖𝒑 𝒎𝒆𝒎𝒃𝒆𝒓𝒔' 𝒊𝒏𝒕𝒆𝒓𝒂𝒄𝒕𝒊𝒐𝒏 𝒓𝒂𝒏𝒌𝒊𝒏𝒈𝒔",
	category: "𝑮𝒓𝒐𝒖𝒑",
	usages: "[𝒂𝒍𝒍/𝒕𝒂𝒈]",
	cooldowns: 5,
	dependencies: {},
	envConfig: {}
};

module.exports.run = async function({ api, event, args, Users, Threads, Currencies }) {
    try {
        if (args[0] === "all") {
            const { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
            const expData = [];

            for (const userID of participantIDs) {
                try {
                    const userData = await Users.getData(userID);
                    const currencyData = await Currencies.getData(userID);
                    expData.push({
                        name: userData.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓",
                        exp: currencyData.exp || 0,
                        uid: userID
                    });
                } catch (error) {
                    console.error(`Error processing user ${userID}:`, error);
                }
            }

            expData.sort((a, b) => b.exp - a.exp);
            
            const page = Math.max(1, parseInt(args[1]) || 1);
            const numPage = Math.ceil(expData.length / limit);
            const currentPage = Math.min(page, numPage);
            const startIdx = (currentPage - 1) * limit;
            const endIdx = Math.min(startIdx + limit, expData.length);

            let msg = `📊 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗧𝗘𝗥𝗔𝗖𝗧𝗜𝗢𝗡 𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗 📊\n━━━━━━━━━━━━━━━━━━\n\n`;
            
            for (let i = startIdx; i < endIdx; i++) {
                const rank = i + 1;
                const user = expData[i];
                let rankEmoji = "🔹";
                if (rank === 1) rankEmoji = "👑";
                else if (rank === 2) rankEmoji = "🥈";
                else if (rank === 3) rankEmoji = "🥉";
                
                msg += `${rankEmoji} 𝗥𝗮𝗻𝗸 ${rank}: ${user.name}\n   📝 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀: ${user.exp}\n\n`;
            }

            msg += `━━━━━━━━━━━━━━━━━━\n📑 𝗣𝗮𝗴𝗲 ${currentPage}/${numPage}\n`;
            msg += `🔍 𝗨𝘀𝗲: ${global.config.PREFIX}count all <𝗽𝗮𝗴𝗲 𝗻𝘂𝗺𝗯𝗲𝗿>`;

            return api.sendMessage(msg, event.threadID);

        } else {
            let targetID;
            if (event.type === "message_reply") {
                targetID = event.messageReply.senderID;
            } else if (Object.keys(event.mentions).length > 0) {
                targetID = Object.keys(event.mentions)[0];
            } else {
                targetID = event.senderID;
            }

            const { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
            const expData = [];

            for (const userID of participantIDs) {
                try {
                    const currencyData = await Currencies.getData(userID);
                    expData.push({
                        exp: currencyData.exp || 0,
                        uid: userID
                    });
                } catch (error) {
                    console.error(`Error processing user ${userID}:`, error);
                }
            }

            expData.sort((a, b) => b.exp - a.exp);
            const rank = expData.findIndex(x => x.uid === targetID) + 1;
            
            if (rank === 0) {
                return api.sendMessage("❌ 𝗨𝘀𝗲𝗿 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱 𝗶𝗻 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽", event.threadID, event.messageID);
            }
            
            const userExp = expData[rank - 1].exp;
            const userName = (await Users.getData(targetID)).name;

            let rankEmoji = "🔹";
            if (rank === 1) rankEmoji = "👑";
            else if (rank === 2) rankEmoji = "🥈";
            else if (rank === 3) rankEmoji = "🥉";
            
            return api.sendMessage(
                `👤 𝗨𝗦𝗘𝗥: ${userName}\n${rankEmoji} 𝗥𝗔𝗡𝗞: #${rank}\n💬 𝗠𝗘𝗦𝗦𝗔𝗚𝗘𝗦: ${userExp}\n\n🏆 𝗧𝗼𝗽 𝗖𝗼𝗻𝘁𝗿𝗶𝗯𝘂𝘁𝗼𝗿𝘀 𝗶𝗻 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽!`,
                event.threadID,
                event.messageID
            );
        }
    } catch (error) {
        console.error("Error in count command:", error);
        return api.sendMessage("❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗲𝗱. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.", event.threadID);
    }
};
