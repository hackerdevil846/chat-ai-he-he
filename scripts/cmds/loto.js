const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
    config: {
        name: "loto",
        version: "1.0.4",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "game",
        shortDescription: {
            en: "𝑃𝑙𝑎𝑦 𝑙𝑜𝑡𝑡𝑜 𝑔𝑎𝑚𝑒"
        },
        longDescription: {
            en: "𝐴 𝑓𝑢𝑛 𝑙𝑜𝑡𝑡𝑜 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑓𝑟𝑖𝑒𝑛𝑑𝑠"
        },
        guide: {
            en: "{𝑝}𝑙𝑜𝑡𝑜 [𝑐𝑟𝑒𝑎𝑡𝑒/𝑗𝑜𝑖𝑛/𝑠𝑡𝑎𝑟𝑡]"
        },
        envConfig: {
            maxPlayers: 10,
            getDelay: 8
        }
    },

    loto: {
        "loto_pink.jpg": [
            [15, 30, 49, 60, 74],
            [7, 26, 33, 52, 69],
            [22, 41, 55, 71, 88],
            [11, 37, 64, 76, 90],
            [18, 38, 50, 78, 84],
            [3, 29, 43, 59, 61],
            [10, 48, 63, 75, 81],
            [1, 21, 35, 62, 77],
            [9, 16, 40, 54, 70]
        ],
        "loto_blue.jpg": [
            [25, 52, 60, 77, 83],
            [1, 30, 44, 51, 70],
            [11, 21, 47, 56, 62],
            [2, 33, 59, 68, 73],
            [23, 39, 42, 75, 80],
            [14, 26, 66, 79, 88],
            [19, 20, 37, 55, 81],
            [8, 13, 57, 61, 87],
            [28, 34, 58, 76, 82]
        ],
        "loto_cyan.jpg": [
            [11, 33, 69, 78, 85],
            [2, 14, 21, 35, 76],
            [8, 19, 41, 50, 84],
            [9, 15, 37, 44, 87],
            [6, 26, 65, 77, 82],
            [1, 18, 30, 59, 66],
            [10, 38, 47, 51, 80],
            [5, 13, 29, 52, 79],
            [3, 20, 54, 70, 88]
        ],
        "loto_green.jpg": [
            [6, 19, 27, 56, 63],
            [7, 30, 45, 69, 77],
            [1, 17, 47, 58, 81],
            [20, 37, 49, 53, 78],
            [5, 12, 28, 65, 71],
            [15, 22, 31, 57, 90],
            [3, 25, 35, 50, 64],
            [9, 33, 51, 60, 76],
            [36, 41, 55, 62, 85]
        ],
        "loto_orange.jpg": [
            [3, 10, 22, 58, 75],
            [26, 33, 60, 78, 86],
            [17, 27, 62, 71, 80],
            [15, 32, 47, 50, 69],
            [2, 30, 42, 77, 83],
            [11, 34, 67, 73, 81],
            [6, 14, 49, 66, 70],
            [29, 37, 44, 51, 85],
            [16, 23, 39, 54, 90]
        ],
        "loto_red.jpg": [
            [12, 41, 56, 72, 83],
            [9, 33, 40, 60, 86],
            [7, 15, 45, 51, 78],
            [18, 44, 53, 65, 90],
            [1, 21, 48, 54, 77],
            [6, 30, 59, 71, 87],
            [14, 25, 32, 47, 66],
            [5, 27, 55, 69, 73],
            [2, 10, 39, 52, 63]
        ],
        "loto_lawn.jpg": [
            [2, 15, 39, 46, 66],
            [7, 12, 53, 76, 88],
            [8, 34, 41, 70, 83],
            [33, 47, 59, 64, 86],
            [22, 30, 51, 69, 87],
            [5, 21, 49, 75, 80],
            [17, 28, 40, 55, 67],
            [9, 16, 43, 79, 84],
            [10, 44, 56, 60, 71]
        ],
        "loto_yellow.jpg": [
            [8, 19, 26, 57, 60],
            [6, 10, 39, 44, 81],
            [1, 20, 37, 75, 83],
            [7, 13, 56, 65, 88],
            [4, 28, 49, 51, 66],
            [22, 30, 43, 79, 80],
            [2, 29, 34, 59, 63],
            [5, 17, 46, 73, 89],
            [3, 15, 32, 40, 54]
        ],
        "loto_purple.jpg": [
            [9, 14, 59, 60, 89],
            [6, 22, 36, 47, 79],
            [4, 27, 51, 66, 74],
            [7, 21, 42, 55, 81],
            [5, 11, 39, 52, 88],
            [1, 17, 44, 68, 75],
            [20, 56, 63, 73, 87],
            [3, 19, 26, 58, 76],
            [10, 24, 33, 67, 85]
        ],
        "loto_teal.jpg": [
            [4, 31, 46, 66, 75],
            [8, 12, 35, 53, 89],
            [1, 25, 40, 50, 65],
            [14, 47, 52, 61, 71],
            [9, 19, 34, 55, 81],
            [3, 22, 49, 72, 82],
            [11, 33, 57, 69, 87],
            [2, 24, 39, 44, 78],
            [5, 29, 51, 67, 80]
        ]
    },

    onLoad: async function () {
        try {
            const lotoPath = path.resolve(__dirname, './loto/');
            if (!fs.existsSync(lotoPath)) {
                fs.mkdirSync(lotoPath, { recursive: true });
            }

            const response = await axios.get("https://raw.githubusercontent.com/RFS-ADRENO/lotoData/main/data.json");
            const imageData = response.data;

            for (const fileName in imageData) {
                const filePath = path.resolve(lotoPath, fileName);
                if (!fs.existsSync(filePath)) {
                    const buffer = Buffer.from(imageData[fileName], 'base64');
                    fs.writeFileSync(filePath, buffer);
                }
            }

            if (!global.client.loto) {
                global.client.loto = {};
            }
        } catch (error) {
            console.error("𝐿𝑜𝑡𝑜 𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        }
    },

    onStart: async function ({ event, message, usersData, args }) {
        const { threadID, senderID } = event;
        const userMoney = (await usersData.get(senderID)).money;

        if (!global.client.loto) {
            global.client.loto = {};
        }

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        const messages = {
            missingInput: "𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡!",
            moneyBetNotEnough: "𝑌𝑜𝑢 𝑛𝑒𝑒𝑑 $%1 𝑡𝑜 𝑝𝑙𝑎𝑦!",
            limitBet: "𝑀𝑖𝑛𝑖𝑚𝑢𝑚 𝑏𝑒𝑡 𝑖𝑠 $50!",
            noGame: "𝑁𝑜 𝑎𝑐𝑡𝑖𝑣𝑒 𝑔𝑎𝑚𝑒 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!",
            alreadyHave: "𝐺𝑎𝑚𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑥𝑖𝑠𝑡𝑠!",
            openSuccess: "𝐺𝑎𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑! (%1/%2)\n𝐽𝑜𝑖𝑛 𝑤𝑖𝑡ℎ:\n%3𝑗𝑜𝑖𝑛",
            alreadyJoined: "𝑌𝑜𝑢'𝑟𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑖𝑛!",
            out_of_room: "𝑅𝑜𝑜𝑚 𝑖𝑠 𝑓𝑢𝑙𝑙!",
            alreadyStarted_1: "𝐺𝑎𝑚𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑠𝑡𝑎𝑟𝑡𝑒𝑑!",
            joinSuccess: "𝐽𝑜𝑖𝑛𝑒𝑑! (%1/%2)",
            playersNotEnough: "𝑁𝑒𝑒𝑑 𝑎𝑡 𝑙𝑒𝑎𝑠𝑡 2 𝑝𝑙𝑎𝑦𝑒𝑟𝑠!",
            not_author: "𝑌𝑜𝑢'𝑟𝑒 𝑛𝑜𝑡 𝑡ℎ𝑒 𝑐𝑟𝑒𝑎𝑡𝑜𝑟!",
            alreadyStarted_2: "𝐺𝑎𝑚𝑒 𝑖𝑠 𝑟𝑢𝑛𝑛𝑖𝑛𝑔!",
            testInbox: "𝐶ℎ𝑒𝑐𝑘𝑖𝑛𝑔 𝑖𝑛𝑏𝑜𝑥 𝑎𝑐𝑐𝑒𝑠𝑠...",
            checkInbox_noti: "𝐶ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑖𝑛𝑏𝑜𝑥 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑐𝑎𝑟𝑑!",
            cannotInbox: "𝐶𝑎𝑛'𝑡 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 %1!",
            notJoined: "𝑌𝑜𝑢'𝑟𝑒 𝑛𝑜𝑡 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒!",
            getReady: "𝐺𝑎𝑚𝑒 𝑠𝑡𝑎𝑟𝑡𝑠!\n𝑁𝑢𝑚𝑏𝑒𝑟𝑠 𝑒𝑣𝑒𝑟𝑦 %1𝑠!",
            gotNum: "𝑁𝑢𝑚𝑏𝑒𝑟: %1",
            BINGO: "𝐵𝐼𝑁𝐺𝑂! %1 𝑤𝑜𝑛 $%2!",
            notReady: "𝐶𝑎𝑛'𝑡 𝑠𝑡𝑎𝑟𝑡 𝑔𝑎𝑚𝑒!",
            info: "𝐿𝑂𝑇𝑇𝑂 𝐺𝐴𝑀𝐸\n- 𝐹𝑢𝑛 𝑙𝑜𝑡𝑡𝑜 𝑔𝑎𝑚𝑒 -\n+ 𝐵𝑒𝑡 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑝𝑙𝑎𝑦\n+ 𝑊𝑖𝑛 𝑏𝑦 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑖𝑛𝑔 𝑎 𝑟𝑜𝑤"
        };

        switch (args[0]) {
            case 'create': {
                const moneyBet = parseInt(args[1]);
                if (isNaN(moneyBet) || moneyBet <= 0) return message.reply(messages.missingInput);
                if (moneyBet < 50) return message.reply(messages.limitBet);
                if (moneyBet > userMoney) return message.reply(messages.moneyBetNotEnough.replace("%1", moneyBet));
                if (threadID in global.client.loto) return message.reply(messages.alreadyHave);

                global.client.loto[threadID] = {
                    author: senderID,
                    data: { [senderID]: [] },
                    status: "pending",
                    maximumBet: moneyBet
                };

                await usersData.decreaseMoney(senderID, moneyBet);
                return message.reply(messages.openSuccess
                    .replace("%1", "1")
                    .replace("%2", "10")
                    .replace("%3", "{p}"));
            }

            case 'join': {
                if (!(threadID in global.client.loto)) return message.reply(messages.noGame);
                if (senderID in global.client.loto[threadID].data) return message.reply(messages.alreadyJoined);
                if (Object.keys(global.client.loto[threadID].data).length >= 10) return message.reply(messages.out_of_room);
                if (global.client.loto[threadID].status === "started") return message.reply(messages.alreadyStarted_1);
                if (global.client.loto[threadID].maximumBet > userMoney) return message.reply(messages.moneyBetNotEnough.replace("%1", global.client.loto[threadID].maximumBet));

                global.client.loto[threadID].data[senderID] = [];
                await usersData.decreaseMoney(senderID, global.client.loto[threadID].maximumBet);
                return message.reply(messages.joinSuccess
                    .replace("%1", Object.keys(global.client.loto[threadID].data).length.toString())
                    .replace("%2", "10"));
            }

            case 'start': {
                if (!(threadID in global.client.loto)) return message.reply(messages.noGame);
                if (Object.keys(global.client.loto[threadID].data).length < 2) return message.reply(messages.playersNotEnough);
                if (!(senderID in global.client.loto[threadID].data)) return message.reply(messages.notJoined);
                if (global.client.loto[threadID].author !== senderID) return message.reply(messages.not_author);
                if (global.client.loto[threadID].status === "started") return message.reply(messages.alreadyStarted_2);

                global.client.loto[threadID].status = "started";
                const lotoKeys = Object.keys(this.loto);
                
                // Shuffle keys
                for (let i = lotoKeys.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [lotoKeys[i], lotoKeys[j]] = [lotoKeys[j], lotoKeys[i]];
                }

                // Send cards to players
                message.reply(messages.checkInbox_noti);
                for (const playerId of Object.keys(global.client.loto[threadID].data)) {
                    try {
                        const randomIndex = Math.floor(Math.random() * lotoKeys.length);
                        const cardFile = lotoKeys[randomIndex];
                        global.client.loto[threadID].data[playerId] = cardFile;
                        
                        const cardPath = path.resolve(__dirname, './loto/', cardFile);
                        if (fs.existsSync(cardPath)) {
                            await message.reply({
                                body: "𝑌𝑜𝑢𝑟 𝑐𝑎𝑟𝑑:",
                                attachment: fs.createReadStream(cardPath)
                            }, playerId);
                        }
                        await delay(300);
                    } catch (error) {
                        console.error("𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑐𝑎𝑟𝑑:", error);
                    }
                }

                // Start number drawing
                const allNumbers = Array.from({length: 90}, (_, i) => i + 1);
                const calledNumbers = [];
                
                const drawNumber = async () => {
                    if (!global.client.loto[threadID]) return;
                    
                    const randomIndex = Math.floor(Math.random() * allNumbers.length);
                    const drawnNumber = allNumbers.splice(randomIndex, 1)[0];
                    calledNumbers.push(drawnNumber);
                    
                    await message.reply(messages.gotNum.replace("%1", drawnNumber));
                    
                    // Check for winners
                    for (const [playerId, cardFile] of Object.entries(global.client.loto[threadID].data)) {
                        const cardNumbers = this.loto[cardFile];
                        for (const row of cardNumbers) {
                            if (row.every(num => calledNumbers.includes(num))) {
                                const playerName = await usersData.getName(playerId);
                                const reward = global.client.loto[threadID].maximumBet * 
                                              (Object.keys(global.client.loto[threadID].data).length - 1);
                                
                                await usersData.increaseMoney(playerId, reward + global.client.loto[threadID].maximumBet);
                                await message.reply(messages.BINGO
                                    .replace("%1", playerName)
                                    .replace("%2", reward.toString()));
                                
                                delete global.client.loto[threadID];
                                return;
                            }
                        }
                    }
                    
                    // Continue drawing if no winner yet
                    if (allNumbers.length > 0 && global.client.loto[threadID]) {
                        setTimeout(drawNumber, 8000);
                    }
                };
                
                setTimeout(drawNumber, 8000);
                break;
            }

            default: {
                return message.reply(messages.info);
            }
        }
    }
};
