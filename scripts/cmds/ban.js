const fs = require('fs-extra');
const path = require('path');

// Define the toBI function for bold italic text
const toBI = (text) => {
  const map = {
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆',
    f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
    k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐',
    p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
    u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚',
    z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫',
    E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰',
    J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵',
    O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺',
    T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿',
    Y: '𝒀', Z: '𝒁', 
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
};

module.exports.config = {
    name: "ban",
    aliases: ["warn", "moderate"],
    version: "2.0.5",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "group",
    shortDescription: {
        en: "𝐵𝑎𝑛 𝑜𝑟 𝑤𝑎𝑟𝑛 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠"
    },
    longDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠 𝑎𝑛𝑑 𝑏𝑎𝑛𝑠"
    },
    guide: {
        en: "{p}ban [𝑣𝑖𝑒𝑤|𝑢𝑛𝑏𝑎𝑛|𝑙𝑖𝑠𝑡𝑏𝑎𝑛|𝑟𝑒𝑠𝑒𝑡|@𝑡𝑎𝑔]"
    },
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onStart = async function ({ event, message, args, usersData, threadsData, api }) {
    try {
        const { threadID, messageID, senderID } = event;
        
        // Ensure cache directory exists
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        // Initialize bans data if not exists
        const bansPath = path.join(__dirname, 'cache', 'bans.json');
        if (!fs.existsSync(bansPath)) {
            const initialData = { warns: {}, banned: {} };
            fs.writeFileSync(bansPath, JSON.stringify(initialData, null, 2));
        }
        
        let bans = JSON.parse(fs.readFileSync(bansPath));
        
        // Get thread info to check admin status
        const threadInfo = await threadsData.get(threadID);
        const isBotAdmin = threadInfo.adminIDs.some(admin => admin.id === api.getCurrentUserID());
        
        if (!isBotAdmin) {
            return message.reply(toBI("❌ 𝐵𝑜𝑡 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑎𝑛 𝑎𝑑𝑚𝑖𝑛 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"));
        }
        
        if (!bans.warns.hasOwnProperty(threadID)) {
            bans.warns[threadID] = {};
            fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
        }
        
        if (!bans.banned.hasOwnProperty(threadID)) {
            bans.banned[threadID] = [];
            fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
        }
        
        // Check if user is admin
        const isUserAdmin = threadInfo.adminIDs.some(admin => admin.id === senderID) || 
                           (global.GoatBot && global.GoatBot.config.ADMINBOT.includes(senderID));
        
        // Handle different commands
        switch (args[0]) {
            case "view": {
                if (!args[1]) {
                    // View own warns
                    const mywarn = bans.warns[threadID][senderID];
                    if (!mywarn || mywarn.length === 0) {
                        return message.reply(toBI("✅ 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑛𝑜 𝑤𝑎𝑟𝑛𝑠"));
                    }
                    
                    let msg = "";
                    for (let reasonwarn of mywarn) {
                        msg += `• ${reasonwarn}\n`;
                    }
                    return message.reply(toBI(`❎ 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑤𝑎𝑟𝑛𝑠:\n${msg}`));
                } 
                else if (args[1] === "all") {
                    if (!isUserAdmin) {
                        return message.reply(toBI("❌ 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑣𝑖𝑒𝑤 𝑎𝑙𝑙 𝑤𝑎𝑟𝑛𝑠"));
                    }
                    
                    // View all warns in group
                    const dtwbox = bans.warns[threadID];
                    let allwarn = "";
                    
                    for (let idtvw in dtwbox) {
                        if (dtwbox[idtvw].length > 0) {
                            const name = await usersData.getName(idtvw);
                            let msg = "";
                            for (let reasonwtv of dtwbox[idtvw]) {
                                msg += `• ${reasonwtv}\n`;
                            }
                            allwarn += `${name}:\n${msg}\n`;
                        }
                    }
                    
                    if (allwarn === "") {
                        return message.reply(toBI("✅ 𝑁𝑜 𝑜𝑛𝑒 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑤𝑎𝑟𝑛𝑒𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝"));
                    } else {
                        return message.reply(toBI("❎ 𝑊𝑎𝑟𝑛𝑒𝑑 𝑚𝑒𝑚𝑏𝑒𝑟𝑠:\n" + allwarn));
                    }
                } else {
                    return message.reply(toBI("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑣𝑖𝑒𝑤 𝑐𝑜𝑚𝑚𝑎𝑛𝑑. 𝑈𝑠𝑒 '𝑣𝑖𝑒𝑤' 𝑜𝑟 '𝑣𝑖𝑒𝑤 𝑎𝑙𝑙'"));
                }
            }
            
            case "unban": {
                if (!isUserAdmin) {
                    return message.reply(toBI("❌ 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑢𝑛𝑏𝑎𝑛 𝑢𝑠𝑒𝑟𝑠"));
                }
                
                const id = parseInt(args[1]);
                if (!id) {
                    return message.reply(toBI("❌ 𝑃𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑢𝑠𝑒𝑟 𝐼𝐷 𝑡𝑜 𝑢𝑛𝑏𝑎𝑛"));
                }
                
                const mybox = bans.banned[threadID] || [];
                if (!mybox.includes(id)) {
                    return message.reply(toBI("✅ 𝑇ℎ𝑖𝑠 𝑢𝑠𝑒𝑟 𝑖𝑠 𝑛𝑜𝑡 𝑏𝑎𝑛𝑛𝑒𝑑"));
                }
                
                // Remove from banned list and warns
                bans.banned[threadID] = mybox.filter(userId => userId !== id);
                delete bans.warns[threadID][id];
                
                fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
                return message.reply(toBI(`✅ 𝑈𝑠𝑒𝑟 ${id} ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑢𝑛𝑏𝑎𝑛𝑛𝑒𝑑`));
            }
            
            case "listban": {
                const mybox = bans.banned[threadID] || [];
                if (mybox.length === 0) {
                    return message.reply(toBI("✅ 𝑁𝑜 𝑜𝑛𝑒 𝑖𝑠 𝑏𝑎𝑛𝑛𝑒𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝"));
                }
                
                let msg = "";
                for (let iduser of mybox) {
                    const name = await usersData.getName(iduser);
                    msg += `╔ 𝑁𝑎𝑚𝑒: ${name}\n╚ 𝐼𝐷: ${iduser}\n\n`;
                }
                return message.reply(toBI("❎ 𝐵𝑎𝑛𝑛𝑒𝑑 𝑚𝑒𝑚𝑏𝑒𝑟𝑠:\n" + msg));
            }
            
            case "reset": {
                if (!isUserAdmin) {
                    return message.reply(toBI("❌ 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑟𝑒𝑠𝑒𝑡 𝑑𝑎𝑡𝑎"));
                }
                
                bans.warns[threadID] = {};
                bans.banned[threadID] = [];
                fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
                return message.reply(toBI("✅ 𝐴𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑑𝑎𝑡𝑎 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑟𝑒𝑠𝑒𝑡"));
            }
            
            default: {
                // Default ban command
                if (!isUserAdmin) {
                    return message.reply(toBI("❌ 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"));
                }
                
                // Check if message is a reply or has mentions
                const { messageReply, mentions } = event;
                let iduser = [];
                let reason = args.slice(1).join(" ") || toBI("𝑁𝑜 𝑟𝑒𝑎𝑠𝑜𝑛 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑");
                
                if (messageReply) {
                    iduser.push(messageReply.senderID);
                } else if (Object.keys(mentions).length > 0) {
                    iduser = Object.keys(mentions);
                    // Remove mentions from reason
                    const mentionValues = Object.values(mentions);
                    for (let mention of mentionValues) {
                        reason = reason.replace(mention, "").trim();
                    }
                } else {
                    return message.reply(toBI("❌ 𝑇𝑎𝑔 𝑎 𝑢𝑠𝑒𝑟 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"));
                }
                
                const arraytag = [];
                const arrayname = [];
                
                for (let iid of iduser) {
                    const id = parseInt(iid);
                    const name = await usersData.getName(id);
                    arraytag.push({ id: id, tag: name });
                    arrayname.push(name);
                    
                    // Initialize user warns if not exists
                    if (!bans.warns[threadID][id]) {
                        bans.warns[threadID][id] = [];
                    }
                    
                    // Add warn reason
                    bans.warns[threadID][id].push(reason);
                    
                    // Ban user if they have warns
                    if (bans.warns[threadID][id].length > 0) {
                        try {
                            await api.removeUserFromGroup(id, threadID);
                            if (!bans.banned[threadID].includes(id)) {
                                bans.banned[threadID].push(id);
                            }
                        } catch (error) {
                            console.error("𝐵𝑎𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
                        }
                    }
                }
                
                fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
                
                return message.reply({
                    body: toBI(`❎ 𝐵𝑎𝑛𝑛𝑒𝑑 ${arrayname.join(", ")} 𝑓𝑜𝑟: ${reason}`),
                    mentions: arraytag
                });
            }
        }
    } catch (error) {
        console.error("𝐵𝑎𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑");
    }
};
