const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');
const crypto = require('crypto');
const cron = require('node-cron');

module.exports.config = {
    name: "botrent",
    aliases: ["rentbot", "botlease"],
    version: "1.7.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 1,
    role: 3,
    category: "system",
    shortDescription: {
        en: "𝐵𝑜𝑡 𝑟𝑒𝑛𝑡𝑎𝑙 𝑠𝑦𝑠𝑡𝑒𝑚 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡"
    },
    longDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑏𝑜𝑡 𝑟𝑒𝑛𝑡𝑎𝑙 𝑠𝑦𝑠𝑡𝑒𝑚 𝑤𝑖𝑡ℎ 𝑘𝑒𝑦 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑒𝑥𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛 𝑡𝑟𝑎𝑐𝑘𝑖𝑛𝑔"
    },
    guide: {
        en: "{p}botrent [𝑎𝑑𝑑|𝑙𝑖𝑠𝑡|𝑖𝑛𝑓𝑜|𝑛𝑒𝑤𝑘𝑒𝑦|𝑐ℎ𝑒𝑐𝑘]"
    },
    dependencies: {
        "fs-extra": "",
        "path": "",
        "moment-timezone": "",
        "crypto": "",
        "node-cron": ""
    }
};

module.exports.onLoad = function() {
    const RENT_DATA_PATH = path.join(__dirname, 'cache/data/thuebot.json');
    const RENT_KEY_PATH = path.join(__dirname, 'cache/data/keys.json');
    const setNameCheckPath = path.join(__dirname, 'data/setnamecheck.json');
    const TIMEZONE = 'Asia/Dhaka';

    // Create directories if they don't exist
    if (!fs.existsSync(path.dirname(RENT_DATA_PATH))) {
        fs.mkdirSync(path.dirname(RENT_DATA_PATH), { recursive: true });
    }
    if (!fs.existsSync(path.dirname(setNameCheckPath))) {
        fs.mkdirSync(path.dirname(setNameCheckPath), { recursive: true });
    }

    this.rentData = fs.existsSync(RENT_DATA_PATH) ? JSON.parse(fs.readFileSync(RENT_DATA_PATH, 'utf8')) : [];
    this.keys = fs.existsSync(RENT_KEY_PATH) ? JSON.parse(fs.readFileSync(RENT_KEY_PATH, 'utf8')) : {};
    this.setNameCheck = fs.existsSync(setNameCheckPath) ? JSON.parse(fs.readFileSync(setNameCheckPath, 'utf8')) : {};

    // Schedule daily tasks
    cron.schedule('42 03 * * *', async () => {
        console.log('𝑈𝑝𝑑𝑎𝑡𝑖𝑛𝑔 𝑏𝑜𝑡 𝑛𝑎𝑚𝑒𝑠 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑟𝑒𝑛𝑡𝑎𝑙 𝑒𝑥𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛');
        await this.updateGroupNames();
        await this.cleanupAllKeys();
    }, {
        scheduled: true,
        timezone: TIMEZONE
    });
};

module.exports.saveData = function() {
    const RENT_DATA_PATH = path.join(__dirname, 'cache/data/thuebot.json');
    fs.writeFileSync(RENT_DATA_PATH, JSON.stringify(this.rentData, null, 2), 'utf8');
};

module.exports.saveKeys = function() {
    const RENT_KEY_PATH = path.join(__dirname, 'cache/data/keys.json');
    fs.writeFileSync(RENT_KEY_PATH, JSON.stringify(this.keys, null, 2), 'utf8');
};

module.exports.formatDate = function(input) {
    return input.split('/').reverse().join('/');
};

module.exports.isInvalidDate = function(date) {
    return isNaN(new Date(date).getTime());
};

module.exports.generateKey = function() {
    const randomString = crypto.randomBytes(6).toString('hex').slice(0, 6);
    return `hphong_${randomString}_key_2025`.toLowerCase();
};

module.exports.updateGroupNames = async function() {
    console.log('𝑈𝑝𝑑𝑎𝑡𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒𝑠');
    const TIMEZONE = 'Asia/Dhaka';
    const setNameCheckPath = path.join(__dirname, 'data/setnamecheck.json');

    try {
        for (const entry of this.rentData) {
            const { t_id, time_end } = entry;
            const currentDate = moment().tz(TIMEZONE);
            const endDate = moment(time_end, 'DD/MM/YYYY');
            const daysRemaining = endDate.diff(currentDate, 'days');

            let botName;
            if (daysRemaining <= 0) {
                botName = `『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME} || 𝐸𝑥𝑝𝑖𝑟𝑒𝑑: ${time_end}`;
            } else if (daysRemaining <= 3) {
                botName = `『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME} || ⚠️${daysRemaining} 𝑑𝑎𝑦𝑠 𝑟𝑒𝑚𝑎𝑖𝑛𝑖𝑛𝑔`;
            } else {
                botName = `『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME} || 𝐸𝑥𝑝𝑖𝑟𝑒𝑠: ${time_end} || ✅${daysRemaining} 𝑑𝑎𝑦𝑠`;
            }

            try {
                const currentUserId = await global.client.api.getCurrentUserID();
                if (currentUserId) {
                    await global.client.api.changeNickname(botName, t_id, currentUserId);
                    this.setNameCheck[t_id] = true;
                }
            } catch (error) {
                console.error(`𝐸𝑟𝑟𝑜𝑟 𝑢𝑝𝑑𝑎𝑡𝑖𝑛𝑔 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑓𝑜𝑟 𝑔𝑟𝑜𝑢𝑝 ${t_id}:`, error);
            }
        }
        fs.writeFileSync(setNameCheckPath, JSON.stringify(this.setNameCheck, null, 2), 'utf8');
    } catch (error) {
        console.error('𝐸𝑟𝑟𝑜𝑟 𝑢𝑝𝑑𝑎𝑡𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒𝑠:', error);
    }
};

module.exports.cleanupAllKeys = function() {
    console.log('𝐶𝑙𝑒𝑎𝑛𝑖𝑛𝑔 𝑢𝑝 𝑎𝑙𝑙 𝑘𝑒𝑦𝑠');
    this.keys = {};
    const RENT_KEY_PATH = path.join(__dirname, 'cache/data/keys.json');
    fs.writeFileSync(RENT_KEY_PATH, JSON.stringify(this.keys, null, 2), 'utf8');
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        if (!global.config.ADMINBOT.includes(event.senderID)) {
            return message.reply(`⚠️ 𝑂𝑛𝑙𝑦 𝑚𝑎𝑖𝑛 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!`);
        }

        const prefix = global.config.PREFIX;

        switch (args[0]) {
            case 'add':
                if (!args[1]) return message.reply(`❎ 𝑈𝑠𝑒: ${prefix}${this.config.name} 𝑎𝑑𝑑 + 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑢𝑠𝑒𝑟`);
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
                    return message.reply(`❎ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑑𝑎𝑡𝑒 𝑓𝑜𝑟𝑚𝑎𝑡!`);
                }
                
                const existingData = this.rentData.find(entry => entry.t_id === t_id);
                if (existingData) {
                    return message.reply(`⚠️ 𝐺𝑟𝑜𝑢𝑝 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑥𝑖𝑠𝑡𝑠 𝑖𝑛 𝑟𝑒𝑛𝑡𝑎𝑙 𝑠𝑦𝑠𝑡𝑒𝑚!`);
                }
                
                this.rentData.push({ t_id, id: userId, time_start, time_end });
                this.saveData();
                return message.reply(`✅ 𝐴𝑑𝑑𝑒𝑑 𝑔𝑟𝑜𝑢𝑝 𝑡𝑜 𝑟𝑒𝑛𝑡𝑎𝑙 𝑠𝑦𝑠𝑡𝑒𝑚!`);

            case 'list':
                if (this.rentData.length === 0) {
                    return message.reply('❎ 𝑁𝑜 𝑔𝑟𝑜𝑢𝑝𝑠 𝑖𝑛 𝑟𝑒𝑛𝑡𝑎𝑙 𝑠𝑦𝑠𝑡𝑒𝑚!');
                }
                
                const updatedData = this.rentData.map((item) => {
                    const timeEnd = new Date(this.formatDate(item.time_end)).getTime();
                    const now = Date.now();
                    const remainingTime = timeEnd - now;
                    const daysRemaining = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                    const hoursRemaining = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    
                    return {
                        ...item,
                        daysRemaining,
                        hoursRemaining,
                        status: remainingTime <= 0 ? '❎ 𝐸𝑥𝑝𝑖𝑟𝑒𝑑' : '✅ 𝐴𝑐𝑡𝑖𝑣𝑒'
                    };
                });

                const listMessage = `[ 𝐵𝑂𝑇 𝑅𝐸𝑁𝑇𝐴𝐿 𝑆𝑌𝑆𝑇𝐸𝑀 ]\n\n${updatedData.map((item, i) => 
                    `${i + 1}. ${global.data.userName.get(item.id)}\n⩺ 𝑆𝑡𝑎𝑡𝑢𝑠: ${item.status}\n⩺ 𝐺𝑟𝑜𝑢𝑝: ${(global.data.threadInfo.get(item.t_id) || {}).threadName}\n⩺ ${item.daysRemaining} 𝑑𝑎𝑦𝑠 ${item.hoursRemaining} ℎ𝑜𝑢𝑟𝑠 𝑟𝑒𝑚𝑎𝑖𝑛𝑖𝑛𝑔`
                ).join('\n\n')}`;

                return message.reply(listMessage);

            case 'info':
                const rentInfo = this.rentData.find(entry => entry.t_id === event.threadID);
                if (!rentInfo) {
                    return message.reply(`❎ 𝑁𝑜 𝑟𝑒𝑛𝑡𝑎𝑙 𝑑𝑎𝑡𝑎 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝`);
                }
                
                const timeEnd = new Date(this.formatDate(rentInfo.time_end)).getTime();
                const now = Date.now();
                const daysRemaining = Math.floor((timeEnd - now) / (1000 * 60 * 60 * 24));
                const hoursRemaining = Math.floor((timeEnd - now) / (1000 * 60 * 60) % 24);
                
                return message.reply(`[ 𝑅𝐸𝑁𝑇𝐴𝐿 𝐼𝑁𝐹𝑂 ]\n\n👤 𝑈𝑠𝑒𝑟: ${global.data.userName.get(rentInfo.id)}\n🔗 𝐿𝑖𝑛𝑘: https://www.facebook.com/profile.php?id=${rentInfo.id}\n🗓️ 𝑆𝑡𝑎𝑟𝑡: ${rentInfo.time_start}\n⌛ 𝐸𝑛𝑑: ${rentInfo.time_end}\n⩺ ${daysRemaining} 𝑑𝑎𝑦𝑠 ${hoursRemaining} ℎ𝑜𝑢𝑟𝑠 𝑟𝑒𝑚𝑎𝑖𝑛𝑖𝑛𝑔`);

            case 'newkey':
                const days = parseInt(args[1], 10) || 31;
                if (isNaN(days) || days <= 0) {
                    return message.reply(`❎ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑑𝑎𝑦𝑠 𝑣𝑎𝑙𝑢𝑒!`);
                }
                
                const generatedKey = this.generateKey();
                this.keys[generatedKey] = {
                    days: days,
                    used: false,
                    groupId: null
                };
                this.saveKeys();
                return message.reply(`🔑 𝑁𝑒𝑤 𝑘𝑒𝑦: ${generatedKey}\n📆 𝑉𝑎𝑙𝑖𝑑 𝑓𝑜𝑟 ${days} 𝑑𝑎𝑦𝑠`);

            case 'check':
                if (Object.keys(this.keys).length === 0) {
                    return message.reply('❎ 𝑁𝑜 𝑘𝑒𝑦𝑠 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒!');
                }
                
                const keyList = Object.entries(this.keys).map(([key, info], i) => 
                    `${i + 1}. 𝐾𝑒𝑦: ${key}\n🗓️ 𝐷𝑎𝑦𝑠: ${info.days}\n📝 𝑆𝑡𝑎𝑡𝑢𝑠: ${info.used ? '✅ 𝑈𝑠𝑒𝑑' : '❎ 𝑈𝑛𝑢𝑠𝑒𝑑'}\n📎 𝐺𝑟𝑜𝑢𝑝 𝐼𝐷: ${info.groupId || '𝑁/𝐴'}`
                ).join('\n\n');
                
                return message.reply(`[ 𝐾𝐸𝑌 𝐿𝐼𝑆𝑇 ]\n\n${keyList}\n\n⩺ 𝐴𝑢𝑡𝑜-𝑟𝑒𝑓𝑟𝑒𝑠ℎ 𝑎𝑡 00:00 𝑑𝑎𝑖𝑙𝑦!`);

            default:
                return message.reply(`[ 𝐵𝑂𝑇 𝑅𝐸𝑁𝑇𝐴𝐿 𝑀𝐸𝑁𝑈 ]\n──────────────────\n⩺ ${prefix}botrent 𝑎𝑑𝑑: 𝐴𝑑𝑑 𝑔𝑟𝑜𝑢𝑝 𝑡𝑜 𝑟𝑒𝑛𝑡𝑎𝑙 𝑠𝑦𝑠𝑡𝑒𝑚\n⩺ ${prefix}botrent 𝑛𝑒𝑤𝑘𝑒𝑦: 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑛𝑒𝑤 𝑟𝑒𝑛𝑡𝑎𝑙 𝑘𝑒𝑦\n⩺ ${prefix}botrent 𝑖𝑛𝑓𝑜: 𝑉𝑖𝑒𝑤 𝑟𝑒𝑛𝑡𝑎𝑙 𝑖𝑛𝑓𝑜 𝑓𝑜𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑔𝑟𝑜𝑢𝑝\n⩺ ${prefix}botrent 𝑐ℎ𝑒𝑐𝑘: 𝐶ℎ𝑒𝑐𝑘 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑘𝑒𝑦𝑠\n⩺ ${prefix}botrent 𝑙𝑖𝑠𝑡: 𝐿𝑖𝑠𝑡 𝑎𝑙𝑙 𝑟𝑒𝑛𝑡𝑒𝑑 𝑔𝑟𝑜𝑢𝑝𝑠`);
        }
    } catch (error) {
        console.error("𝐵𝑜𝑡𝑅𝑒𝑛𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
    }
};

module.exports.onChat = async function({ event, message, api }) {
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

                    if (existingData) {
                        const oldEndDate = moment(existingData.time_end, 'DD/MM/YYYY');
                        time_end = oldEndDate.add(keyInfo.days, 'days').format('DD/MM/YYYY');
                        existingData.time_end = time_end;
                    } else {
                        time_end = moment().add(keyInfo.days, 'days').format('DD/MM/YYYY');
                        this.rentData.push({ t_id: groupId, id: event.senderID, time_start, time_end });
                    }

                    const botName = `『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME} || 𝐸𝑥𝑝𝑖𝑟𝑒𝑠: ${time_end}`;
                    await api.changeNickname(botName, groupId, api.getCurrentUserID());

                    keyInfo.used = true;
                    keyInfo.groupId = groupId;
                    this.saveKeys();
                    this.saveData();
                    
                    message.reply(`🔑 𝐾𝑒𝑦 𝑣𝑎𝑙𝑖𝑑! 𝐵𝑜𝑡 𝑟𝑒𝑛𝑡𝑎𝑙 𝑒𝑥𝑡𝑒𝑛𝑑𝑒𝑑 𝑓𝑜𝑟 ${keyInfo.days} 𝑑𝑎𝑦𝑠.`);
                } else {
                    message.reply(`🔒 𝐾𝑒𝑦 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑢𝑠𝑒𝑑 𝑜𝑟 𝑖𝑛𝑣𝑎𝑙𝑖𝑑!`);
                }
            } else {
                message.reply(`❎ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑘𝑒𝑦 𝑓𝑜𝑟𝑚𝑎𝑡!`);
            }
        }
    } catch (error) {
        console.error("𝐾𝑒𝑦 𝐻𝑎𝑛𝑑𝑙𝑖𝑛𝑔 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};
