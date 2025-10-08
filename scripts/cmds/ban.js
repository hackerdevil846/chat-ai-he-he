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

module.exports = {
    config: {
        name: "ban",
        aliases: [],
        version: "2.0.5",
        author: "Asif Mahmud",
        countDown: 5,
        role: 1,
        category: "group",
        shortDescription: {
            en: "𝖡𝖺𝗇 𝗈𝗋 𝗐𝖺𝗋𝗇 𝗀𝗋𝗈𝗎𝗉 𝗆𝖾𝗆𝖻𝖾𝗋𝗌"
        },
        longDescription: {
            en: "𝖬𝖺𝗇𝖺𝗀𝖾 𝗀𝗋𝗈𝗎𝗉 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝗐𝖺𝗋𝗇𝗂𝗇𝗀𝗌 𝖺𝗇𝖽 𝖻𝖺𝗇𝗌"
        },
        guide: {
            en: "{p}ban [𝗏𝗂𝖾𝗐|𝗎𝗇𝖻𝖺𝗇|𝗅𝗂𝗌𝗍𝖻𝖺𝗇|𝗋𝖾𝗌𝖾𝗍|@𝗍𝖺𝗀]"
        },
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function ({ event, message, args, usersData, threadsData, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply(toBI("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁."));
            }

            const { threadID, messageID, senderID } = event;
            
            // Ensure cache directory exists
            const cacheDir = path.join(__dirname, 'cache');
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply(toBI("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒"));
            }
            
            // Initialize bans data if not exists
            const bansPath = path.join(__dirname, 'cache', 'bans.json');
            let bans = { warns: {}, banned: {} };
            
            try {
                if (fs.existsSync(bansPath)) {
                    const fileContent = fs.readFileSync(bansPath, 'utf8');
                    bans = JSON.parse(fileContent);
                } else {
                    fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
                }
            } catch (fileError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖻𝖺𝗇𝗌 𝖿𝗂𝗅𝖾:", fileError);
                // Continue with empty bans object
            }
            
            // Get thread info to check admin status
            let threadInfo;
            let isBotAdmin = false;
            let isUserAdmin = false;
            
            try {
                threadInfo = await threadsData.get(threadID);
                const botID = api.getCurrentUserID();
                isBotAdmin = threadInfo.adminIDs?.some(admin => admin.id === botID) || false;
            } catch (threadError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError);
                return message.reply(toBI("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇"));
            }
            
            if (!isBotAdmin) {
                return message.reply(toBI("❌ 𝖡𝗈𝗍 𝗆𝗎𝗌𝗍 𝖻𝖾 𝖺𝗇 𝖺𝖽𝗆𝗂𝗇 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽"));
            }
            
            // Check if user is admin
            try {
                isUserAdmin = threadInfo.adminIDs?.some(admin => admin.id === senderID) || 
                               (global.GoatBot && global.GoatBot.config.ADMINBOT?.includes(senderID)) || false;
            } catch (adminError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗁𝖾𝖼𝗄𝗂𝗇𝗀 𝖺𝖽𝗆𝗂𝗇 𝗌𝗍𝖺𝗍𝗎𝗌:", adminError);
                isUserAdmin = false;
            }
            
            // Initialize thread data if not exists
            if (!bans.warns.hasOwnProperty(threadID)) {
                bans.warns[threadID] = {};
            }
            
            if (!bans.banned.hasOwnProperty(threadID)) {
                bans.banned[threadID] = [];
            }
            
            // Handle different commands
            switch (args[0]) {
                case "view": {
                    if (!args[1]) {
                        // View own warns
                        const mywarn = bans.warns[threadID][senderID];
                        if (!mywarn || mywarn.length === 0) {
                            return message.reply(toBI("✅ 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾 𝗇𝗈 𝗐𝖺𝗋𝗇𝗌"));
                        }
                        
                        let msg = "";
                        for (let reasonwarn of mywarn) {
                            msg += `• ${reasonwarn}\n`;
                        }
                        return message.reply(toBI(`❎ 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾 𝗐𝖺𝗋𝗇𝗌:\n${msg}`));
                    } 
                    else if (args[1] === "all") {
                        if (!isUserAdmin) {
                            return message.reply(toBI("❌ 𝖮𝗇𝗅𝗒 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝗏𝗂𝖾𝗐 𝖺𝗅𝗅 𝗐𝖺𝗋𝗇𝗌"));
                        }
                        
                        // View all warns in group
                        const dtwbox = bans.warns[threadID];
                        let allwarn = "";
                        
                        for (let idtvw in dtwbox) {
                            if (dtwbox[idtvw].length > 0) {
                                try {
                                    const name = await usersData.getName(idtvw);
                                    let msg = "";
                                    for (let reasonwtv of dtwbox[idtvw]) {
                                        msg += `• ${reasonwtv}\n`;
                                    }
                                    allwarn += `${name}:\n${msg}\n`;
                                } catch (nameError) {
                                    console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗇𝖺𝗆𝖾 𝖿𝗈𝗋 ${idtvw}:`, nameError);
                                    allwarn += `𝖴𝗌𝖾𝗋 ${idtvw}:\n• 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗇𝖺𝗆𝖾\n\n`;
                                }
                            }
                        }
                        
                        if (allwarn === "") {
                            return message.reply(toBI("✅ 𝖭𝗈 𝗈𝗇𝖾 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗐𝖺𝗋𝗇𝖾𝖽 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉"));
                        } else {
                            return message.reply(toBI("❎ 𝖶𝖺𝗋𝗇𝖾𝖽 𝗆𝖾𝗆𝖻𝖾𝗋𝗌:\n" + allwarn));
                        }
                    } else {
                        return message.reply(toBI("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗏𝗂𝖾𝗐 𝖼𝗈𝗆𝗆𝖺𝗇𝖽. 𝖴𝗌𝖾 '𝗏𝗂𝖾𝗐' 𝗈𝗋 '𝗏𝗂𝖾𝗐 𝖺𝗅𝗅'"));
                    }
                }
                
                case "unban": {
                    if (!isUserAdmin) {
                        return message.reply(toBI("❌ 𝖮𝗇𝗅𝗒 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝗎𝗇𝖻𝖺𝗇 𝗎𝗌𝖾𝗋𝗌"));
                    }
                    
                    const id = parseInt(args[1]);
                    if (!id || isNaN(id)) {
                        return message.reply(toBI("❌ 𝖯𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋 𝖨𝖣 𝗍𝗈 𝗎𝗇𝖻𝖺𝗇"));
                    }
                    
                    const mybox = bans.banned[threadID] || [];
                    if (!mybox.includes(id)) {
                        return message.reply(toBI("✅ 𝖳𝗁𝗂𝗌 𝗎𝗌𝖾𝗋 𝗂𝗌 𝗇𝗈𝗍 𝖻𝖺𝗇𝗇𝖾𝖽"));
                    }
                    
                    // Remove from banned list and warns
                    bans.banned[threadID] = mybox.filter(userId => userId !== id);
                    delete bans.warns[threadID][id];
                    
                    try {
                        fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
                    } catch (writeError) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝖻𝖺𝗇𝗌 𝖿𝗂𝗅𝖾:", writeError);
                        return message.reply(toBI("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝖽𝖺𝗍𝖺"));
                    }
                    
                    return message.reply(toBI(`✅ 𝖴𝗌𝖾𝗋 ${id} 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗎𝗇𝖻𝖺𝗇𝗇𝖾𝖽`));
                }
                
                case "listban": {
                    const mybox = bans.banned[threadID] || [];
                    if (mybox.length === 0) {
                        return message.reply(toBI("✅ 𝖭𝗈 𝗈𝗇𝖾 𝗂𝗌 𝖻𝖺𝗇𝗇𝖾𝖽 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉"));
                    }
                    
                    let msg = "";
                    for (let iduser of mybox) {
                        try {
                            const name = await usersData.getName(iduser);
                            msg += `╔ 𝖭𝖺𝗆𝖾: ${name}\n╚ 𝖨𝖣: ${iduser}\n\n`;
                        } catch (nameError) {
                            console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗇𝖺𝗆𝖾 𝖿𝗈𝗋 ${iduser}:`, nameError);
                            msg += `╔ 𝖭𝖺𝗆𝖾: 𝖴𝗇𝗄𝗇𝗈𝗐𝗇\n╚ 𝖨𝖣: ${iduser}\n\n`;
                        }
                    }
                    return message.reply(toBI("❎ 𝖡𝖺𝗇𝗇𝖾𝖽 𝗆𝖾𝗆𝖻𝖾𝗋𝗌:\n" + msg));
                }
                
                case "reset": {
                    if (!isUserAdmin) {
                        return message.reply(toBI("❌ 𝖮𝗇𝗅𝗒 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝗋𝖾𝗌𝖾𝗍 𝖽𝖺𝗍𝖺"));
                    }
                    
                    bans.warns[threadID] = {};
                    bans.banned[threadID] = [];
                    try {
                        fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
                    } catch (writeError) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝖻𝖺𝗇𝗌 𝖿𝗂𝗅𝖾:", writeError);
                        return message.reply(toBI("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝖽𝖺𝗍𝖺"));
                    }
                    return message.reply(toBI("✅ 𝖠𝗅𝗅 𝗀𝗋𝗈𝗎𝗉 𝖽𝖺𝗍𝖺 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗋𝖾𝗌𝖾𝗍"));
                }
                
                default: {
                    // Default ban command
                    if (!isUserAdmin) {
                        return message.reply(toBI("❌ 𝖮𝗇𝗅𝗒 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽"));
                    }
                    
                    // Check if message is a reply or has mentions
                    const { messageReply, mentions } = event;
                    let iduser = [];
                    let reason = args.slice(1).join(" ") || toBI("𝖭𝗈 𝗋𝖾𝖺𝗌𝗈𝗇 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽");
                    
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
                        return message.reply(toBI("❌ 𝖳𝖺𝗀 𝖺 𝗎𝗌𝖾𝗋 𝗈𝗋 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺 𝗆𝖾𝗌𝗌𝖺𝗀𝖾"));
                    }
                    
                    const arraytag = [];
                    const arrayname = [];
                    
                    for (let iid of iduser) {
                        const id = parseInt(iid);
                        if (isNaN(id)) continue;
                        
                        try {
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
                                } catch (banError) {
                                    console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖻𝖺𝗇 ${id}:`, banError.message);
                                }
                            }
                        } catch (userError) {
                            console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 ${iid}:`, userError);
                        }
                    }
                    
                    try {
                        fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
                    } catch (writeError) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝖻𝖺𝗇𝗌 𝖿𝗂𝗅𝖾:", writeError);
                        return message.reply(toBI("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝖽𝖺𝗍𝖺"));
                    }
                    
                    return message.reply({
                        body: toBI(`❎ 𝖡𝖺𝗇𝗇𝖾𝖽 ${arrayname.join(", ")} 𝖿𝗈𝗋: ${reason}`),
                        mentions: arraytag
                    });
                }
            }
        } catch (error) {
            console.error("💥 𝖡𝖺𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
