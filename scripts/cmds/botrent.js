const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');
const crypto = require('crypto');
const cron = require('node-cron');

module.exports = {
    config: {
        name: "botrent",
        aliases: [],
        version: "1.7.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 1,
        role: 3,
        category: "system",
        shortDescription: {
            en: "𝖡𝗈𝗍 𝗋𝖾𝗇𝗍𝖺𝗅 𝗌𝗒𝗌𝗍𝖾𝗆 𝗆𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍"
        },
        longDescription: {
            en: "𝖬𝖺𝗇𝖺𝗀𝖾 𝖻𝗈𝗍 𝗋𝖾𝗇𝗍𝖺𝗅 𝗌𝗒𝗌𝗍𝖾𝗆 𝗐𝗂𝗍𝗁 𝗄𝖾𝗒 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖺𝗇𝖽 𝖾𝗑𝗉𝗂𝗋𝖺𝗍𝗂𝗈𝗇 𝗍𝗋𝖺𝖼𝗄𝗂𝗇𝗀"
        },
        guide: {
            en: "{p}botrent [𝖺𝖽𝖽|𝗅𝗂𝗌𝗍|𝗂𝗇𝖿𝗈|𝗇𝖾𝗐𝗄𝖾𝗒|𝖼𝗁𝖾𝖼𝗄]"
        },
        dependencies: {
            "fs-extra": "",
            "path": "",
            "moment-timezone": "",
            "crypto": "",
            "node-cron": ""
        }
    },

    onLoad: function() {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("path");
                require("moment-timezone");
                require("crypto");
                require("node-cron");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌 𝖿𝗈𝗋 𝖻𝗈𝗍𝗋𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
                return;
            }

            const RENT_DATA_PATH = path.join(__dirname, 'cache/data/thuebot.json');
            const RENT_KEY_PATH = path.join(__dirname, 'cache/data/keys.json');
            const setNameCheckPath = path.join(__dirname, 'data/setnamecheck.json');
            const TIMEZONE = 'Asia/Dhaka';

            // Create directories if they don't exist
            try {
                if (!fs.existsSync(path.dirname(RENT_DATA_PATH))) {
                    fs.mkdirSync(path.dirname(RENT_DATA_PATH), { recursive: true });
                }
                if (!fs.existsSync(path.dirname(setNameCheckPath))) {
                    fs.mkdirSync(path.dirname(setNameCheckPath), { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗂𝖾𝗌:", dirError);
            }

            // Load data with error handling
            try {
                this.rentData = fs.existsSync(RENT_DATA_PATH) ? JSON.parse(fs.readFileSync(RENT_DATA_PATH, 'utf8')) : [];
                this.keys = fs.existsSync(RENT_KEY_PATH) ? JSON.parse(fs.readFileSync(RENT_KEY_PATH, 'utf8')) : {};
                this.setNameCheck = fs.existsSync(setNameCheckPath) ? JSON.parse(fs.readFileSync(setNameCheckPath, 'utf8')) : {};
            } catch (loadError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖽𝖺𝗍𝖺:", loadError);
                this.rentData = [];
                this.keys = {};
                this.setNameCheck = {};
            }

            // Schedule daily tasks
            try {
                cron.schedule('42 03 * * *', async () => {
                    console.log('🔄 𝖴𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝖻𝗈𝗍 𝗇𝖺𝗆𝖾𝗌 𝖻𝖺𝗌𝖾𝖽 𝗈𝗇 𝗋𝖾𝗇𝗍𝖺𝗅 𝖾𝗑𝗉𝗂𝗋𝖺𝗍𝗂𝗈𝗇');
                    await this.updateGroupNames();
                    await this.cleanupAllKeys();
                }, {
                    scheduled: true,
                    timezone: TIMEZONE
                });
            } catch (cronError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖼𝗁𝖾𝖽𝗎𝗅𝗂𝗇𝗀 𝖼𝗋𝗈𝗇 𝗃𝗈𝖻:", cronError);
            }

        } catch (error) {
            console.error("💥 𝖡𝗈𝗍𝖱𝖾𝗇𝗍 𝗈𝗇𝖫𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    saveData: function() {
        try {
            const RENT_DATA_PATH = path.join(__dirname, 'cache/data/thuebot.json');
            fs.writeFileSync(RENT_DATA_PATH, JSON.stringify(this.rentData, null, 2), 'utf8');
        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗋𝖾𝗇𝗍 𝖽𝖺𝗍𝖺:", error);
        }
    },

    saveKeys: function() {
        try {
            const RENT_KEY_PATH = path.join(__dirname, 'cache/data/keys.json');
            fs.writeFileSync(RENT_KEY_PATH, JSON.stringify(this.keys, null, 2), 'utf8');
        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗄𝖾𝗒𝗌:", error);
        }
    },

    formatDate: function(input) {
        try {
            return input.split('/').reverse().join('/');
        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖿𝗈𝗋𝗆𝖺𝗍𝗍𝗂𝗇𝗀 𝖽𝖺𝗍𝖾:", error);
            return input;
        }
    },

    isInvalidDate: function(date) {
        try {
            return isNaN(new Date(date).getTime());
        } catch (error) {
            return true;
        }
    },

    generateKey: function() {
        try {
            const randomString = crypto.randomBytes(6).toString('hex').slice(0, 6);
            return `hphong_${randomString}_key_2025`.toLowerCase();
        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝗄𝖾𝗒:", error);
            return `hphong_${Date.now().toString(36)}_key_2025`;
        }
    },

    updateGroupNames: async function() {
        console.log('🔄 𝖴𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾𝗌');
        const TIMEZONE = 'Asia/Dhaka';
        const setNameCheckPath = path.join(__dirname, 'data/setnamecheck.json');

        try {
            for (const entry of this.rentData) {
                const { t_id, time_end } = entry;
                
                try {
                    const currentDate = moment().tz(TIMEZONE);
                    const endDate = moment(time_end, 'DD/MM/YYYY');
                    const daysRemaining = endDate.diff(currentDate, 'days');

                    let botName;
                    if (daysRemaining <= 0) {
                        botName = `『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME} || 𝖤𝗑𝗉𝗂𝗋𝖾𝖽: ${time_end}`;
                    } else if (daysRemaining <= 3) {
                        botName = `『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME} || ⚠️${daysRemaining} 𝖽𝖺𝗒𝗌 𝗋𝖾𝗆𝖺𝗂𝗇𝗂𝗇𝗀`;
                    } else {
                        botName = `『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME} || 𝖤𝗑𝗉𝗂𝗋𝖾𝗌: ${time_end} || ✅${daysRemaining} 𝖽𝖺𝗒𝗌`;
                    }

                    try {
                        const currentUserId = await global.api.getCurrentUserID();
                        if (currentUserId) {
                            await global.api.changeNickname(botName, t_id, currentUserId);
                            this.setNameCheck[t_id] = true;
                        }
                    } catch (nicknameError) {
                        console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗎𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾 𝖿𝗈𝗋 𝗀𝗋𝗈𝗎𝗉 ${t_id}:`, nicknameError.message);
                    }
                } catch (dateError) {
                    console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖽𝖺𝗍𝖾 𝖿𝗈𝗋 𝗀𝗋𝗈𝗎𝗉 ${t_id}:`, dateError);
                }
            }
            
            try {
                fs.writeFileSync(setNameCheckPath, JSON.stringify(this.setNameCheck, null, 2), 'utf8');
            } catch (writeError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗌𝖾𝗍𝗇𝖺𝗆𝖾𝖼𝗁𝖾𝖼𝗄:", writeError);
            }
        } catch (error) {
            console.error('💥 𝖤𝗋𝗋𝗈𝗋 𝗎𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾𝗌:', error);
        }
    },

    cleanupAllKeys: function() {
        console.log('🧹 𝖢𝗅𝖾𝖺𝗇𝗂𝗇𝗀 𝗎𝗉 𝖺𝗅𝗅 𝗄𝖾𝗒𝗌');
        this.keys = {};
        const RENT_KEY_PATH = path.join(__dirname, 'cache/data/keys.json');
        try {
            fs.writeFileSync(RENT_KEY_PATH, JSON.stringify(this.keys, null, 2), 'utf8');
        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝖼𝗅𝖾𝖺𝗇𝖾𝖽 𝗄𝖾𝗒𝗌:", error);
        }
    },

    onStart: async function({ message, event, args, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("path");
                require("moment-timezone");
                require("crypto");
                require("node-cron");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝗉𝖺𝗍𝗁, 𝗆𝗈𝗆𝖾𝗇𝗍-𝗍𝗂𝗆𝖾𝗓𝗈𝗇𝖾, 𝖼𝗋𝗒𝗉𝗍𝗈, 𝖺𝗇𝖽 𝗇𝗈𝖽𝖾-𝖼𝗋𝗈𝗇.");
            }

            if (!global.config.ADMINBOT.includes(event.senderID)) {
                return message.reply(`⚠️ 𝖮𝗇𝗅𝗒 𝗆𝖺𝗂𝗇 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽!`);
            }

            const prefix = global.config.PREFIX;

            switch (args[0]) {
                case 'add':
                    if (!args[1]) return message.reply(`❎ 𝖴𝗌𝖾: ${prefix}${this.config.name} 𝖺𝖽𝖽 + 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗎𝗌𝖾𝗋`);
                    let userId = event.senderID;
                    if (event.type === "message_reply") {
                        userId = event.messageReply.senderID;
                    } else if (Object.keys(event.mentions).length > 0) {
                        userId = Object.keys(event.mentions)[0];
                    }
                    let t_id = event.threadID;
                    let time_start = moment.tz('Asia/Dhaka').format('DD/MM/YYYY');
                    let time_end = args[1];
                    
                    if (this.isInvalidDate(this.formatDate(time_start)) || this.isInvalidDate(this.formatDate(time_end))) {
                        return message.reply(`❎ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖽𝖺𝗍𝖾 𝖿𝗈𝗋𝗆𝖺𝗍!`);
                    }
                    
                    const existingData = this.rentData.find(entry => entry.t_id === t_id);
                    if (existingData) {
                        return message.reply(`⚠️ 𝖦𝗋𝗈𝗎𝗉 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖾𝗑𝗂𝗌𝗍𝗌 𝗂𝗇 𝗋𝖾𝗇𝗍𝖺𝗅 𝗌𝗒𝗌𝗍𝖾𝗆!`);
                    }
                    
                    this.rentData.push({ t_id, id: userId, time_start, time_end });
                    this.saveData();
                    return message.reply(`✅ 𝖠𝖽𝖽𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 𝗍𝗈 𝗋𝖾𝗇𝗍𝖺𝗅 𝗌𝗒𝗌𝗍𝖾𝗆!`);

                case 'list':
                    if (this.rentData.length === 0) {
                        return message.reply('❎ 𝖭𝗈 𝗀𝗋𝗈𝗎𝗉𝗌 𝗂𝗇 𝗋𝖾𝗇𝗍𝖺𝗅 𝗌𝗒𝗌𝗍𝖾𝗆!');
                    }
                    
                    const updatedData = this.rentData.map((item) => {
                        try {
                            const timeEnd = new Date(this.formatDate(item.time_end)).getTime();
                            const now = Date.now();
                            const remainingTime = timeEnd - now;
                            const daysRemaining = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                            const hoursRemaining = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            
                            return {
                                ...item,
                                daysRemaining,
                                hoursRemaining,
                                status: remainingTime <= 0 ? '❎ 𝖤𝗑𝗉𝗂𝗋𝖾𝖽' : '✅ 𝖠𝖼𝗍𝗂𝗏𝖾'
                            };
                        } catch (error) {
                            return {
                                ...item,
                                daysRemaining: 0,
                                hoursRemaining: 0,
                                status: '❎ 𝖤𝗋𝗋𝗈𝗋'
                            };
                        }
                    });

                    const listMessage = `[ 𝖡𝖮𝖳 𝖱𝖤𝖭𝖳𝖠𝖫 𝖲𝖸𝖲𝖳𝖤𝖬 ]\n\n${updatedData.map((item, i) => 
                        `${i + 1}. ${global.data.userName.get(item.id) || '𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋'}\n⩺ 𝖲𝗍𝖺𝗍𝗎𝗌: ${item.status}\n⩺ 𝖦𝗋𝗈𝗎𝗉: ${(global.data.threadInfo.get(item.t_id) || {}).threadName || '𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖦𝗋𝗈𝗎𝗉'}\n⩺ ${item.daysRemaining} 𝖽𝖺𝗒𝗌 ${item.hoursRemaining} 𝗁𝗈𝗎𝗋𝗌 𝗋𝖾𝗆𝖺𝗂𝗇𝗂𝗇𝗀`
                    ).join('\n\n')}`;

                    return message.reply(listMessage);

                case 'info':
                    const rentInfo = this.rentData.find(entry => entry.t_id === event.threadID);
                    if (!rentInfo) {
                        return message.reply(`❎ 𝖭𝗈 𝗋𝖾𝗇𝗍𝖺𝗅 𝖽𝖺𝗍𝖺 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉`);
                    }
                    
                    try {
                        const timeEnd = new Date(this.formatDate(rentInfo.time_end)).getTime();
                        const now = Date.now();
                        const daysRemaining = Math.floor((timeEnd - now) / (1000 * 60 * 60 * 24));
                        const hoursRemaining = Math.floor((timeEnd - now) / (1000 * 60 * 60) % 24);
                        
                        return message.reply(`[ 𝖱𝖤𝖭𝖳𝖠𝖫 𝖨𝖭𝖥𝖮 ]\n\n👤 𝖴𝗌𝖾𝗋: ${global.data.userName.get(rentInfo.id) || '𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋'}\n🔗 𝖫𝗂𝗇𝗄: https://www.facebook.com/profile.php?id=${rentInfo.id}\n🗓️ 𝖲𝗍𝖺𝗋𝗍: ${rentInfo.time_start}\n⌛ 𝖤𝗇𝖽: ${rentInfo.time_end}\n⩺ ${daysRemaining} 𝖽𝖺𝗒𝗌 ${hoursRemaining} 𝗁𝗈𝗎𝗋𝗌 𝗋𝖾𝗆𝖺𝗂𝗇𝗂𝗇𝗀`);
                    } catch (dateError) {
                        return message.reply(`❎ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖽𝖺𝗍𝖾 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇`);
                    }

                case 'newkey':
                    const days = parseInt(args[1], 10) || 31;
                    if (isNaN(days) || days <= 0) {
                        return message.reply(`❎ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖽𝖺𝗒𝗌 𝗏𝖺𝗅𝗎𝖾!`);
                    }
                    
                    const generatedKey = this.generateKey();
                    this.keys[generatedKey] = {
                        days: days,
                        used: false,
                        groupId: null
                    };
                    this.saveKeys();
                    return message.reply(`🔑 𝖭𝖾𝗐 𝗄𝖾𝗒: ${generatedKey}\n📆 𝖵𝖺𝗅𝗂𝖽 𝖿𝗈𝗋 ${days} 𝖽𝖺𝗒𝗌`);

                case 'check':
                    if (Object.keys(this.keys).length === 0) {
                        return message.reply('❎ 𝖭𝗈 𝗄𝖾𝗒𝗌 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾!');
                    }
                    
                    const keyList = Object.entries(this.keys).map(([key, info], i) => 
                        `${i + 1}. 𝖪𝖾𝗒: ${key}\n🗓️ 𝖣𝖺𝗒𝗌: ${info.days}\n📝 𝖲𝗍𝖺𝗍𝗎𝗌: ${info.used ? '✅ 𝖴𝗌𝖾𝖽' : '❎ 𝖴𝗇𝗎𝗌𝖾𝖽'}\n📎 𝖦𝗋𝗈𝗎𝗉 𝖨𝖣: ${info.groupId || '𝖭/𝖠'}`
                    ).join('\n\n');
                    
                    return message.reply(`[ 𝖪𝖤𝖸 𝖫𝖨𝖲𝖳 ]\n\n${keyList}\n\n⩺ 𝖠𝗎𝗍𝗈-𝗋𝖾𝖿𝗋𝖾𝗌𝗁 𝖺𝗍 00:00 𝖽𝖺𝗂𝗅𝗒!`);

                default:
                    return message.reply(`[ 𝖡𝖮𝖳 𝖱𝖤𝖭𝖳𝖠𝖫 𝖬𝖤𝖭𝖴 ]\n──────────────────\n⩺ ${prefix}botrent 𝖺𝖽𝖽: 𝖠𝖽𝖽 𝗀𝗋𝗈𝗎𝗉 𝗍𝗈 𝗋𝖾𝗇𝗍𝖺𝗅 𝗌𝗒𝗌𝗍𝖾𝗆\n⩺ ${prefix}botrent 𝗇𝖾𝗐𝗄𝖾𝗒: 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝗇𝖾𝗐 𝗋𝖾𝗇𝗍𝖺𝗅 𝗄𝖾𝗒\n⩺ ${prefix}botrent 𝗂𝗇𝖿𝗈: 𝖵𝗂𝖾𝗐 𝗋𝖾𝗇𝗍𝖺𝗅 𝗂𝗇𝖿𝗈 𝖿𝗈𝗋 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗀𝗋𝗈𝗎𝗉\n⩺ ${prefix}botrent 𝖼𝗁𝖾𝖼𝗄: 𝖢𝗁𝖾𝖼𝗄 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝗄𝖾𝗒𝗌\n⩺ ${prefix}botrent 𝗅𝗂𝗌𝗍: 𝖫𝗂𝗌𝗍 𝖺𝗅𝗅 𝗋𝖾𝗇𝗍𝖾𝖽 𝗀𝗋𝗈𝗎𝗉𝗌`);
            }
        } catch (error) {
            console.error("💥 𝖡𝗈𝗍𝖱𝖾𝗇𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.");
        }
    },

    onChat: async function({ event, message, api }) {
        try {
            const msg = event.body.toLowerCase();
            const groupId = event.threadID;
            const keyMatch = msg.match(/hphong_[0-9a-fA-F]{6}_key_2025/);

            if (keyMatch && event.senderID !== api.getCurrentUserID()) {
                const key = keyMatch[0];
                
                if (this.keys.hasOwnProperty(key)) {
                    const keyInfo = this.keys[key];
                    if (!keyInfo.used) {
                        const existingData = this.rentData.find(entry => entry.t_id === groupId);
                        const time_start = moment().format('DD/MM/YYYY');
                        let time_end;

                        try {
                            if (existingData) {
                                const oldEndDate = moment(existingData.time_end, 'DD/MM/YYYY');
                                time_end = oldEndDate.add(keyInfo.days, 'days').format('DD/MM/YYYY');
                                existingData.time_end = time_end;
                            } else {
                                time_end = moment().add(keyInfo.days, 'days').format('DD/MM/YYYY');
                                this.rentData.push({ t_id: groupId, id: event.senderID, time_start, time_end });
                            }

                            const botName = `『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME} || 𝖤𝗑𝗉𝗂𝗋𝖾𝗌: ${time_end}`;
                            await api.changeNickname(botName, groupId, api.getCurrentUserID());

                            keyInfo.used = true;
                            keyInfo.groupId = groupId;
                            this.saveKeys();
                            this.saveData();
                            
                            message.reply(`🔑 𝖪𝖾𝗒 𝗏𝖺𝗅𝗂𝖽! 𝖡𝗈𝗍 𝗋𝖾𝗇𝗍𝖺𝗅 𝖾𝗑𝗍𝖾𝗇𝖽𝖾𝖽 𝖿𝗈𝗋 ${keyInfo.days} 𝖽𝖺𝗒𝗌.`);
                        } catch (dateError) {
                            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖽𝖺𝗍𝖾:", dateError);
                            message.reply(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗄𝖾𝗒. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.`);
                        }
                    } else {
                        message.reply(`🔒 𝖪𝖾𝗒 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗎𝗌𝖾𝖽 𝗈𝗋 𝗂𝗇𝗏𝖺𝗅𝗂𝖽!`);
                    }
                } else {
                    message.reply(`❎ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗄𝖾𝗒 𝖿𝗈𝗋𝗆𝖺𝗍!`);
                }
            }
        } catch (error) {
            console.error("💥 𝖪𝖾𝗒 𝖧𝖺𝗇𝖽𝗅𝗂𝗇𝗀 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    }
};
