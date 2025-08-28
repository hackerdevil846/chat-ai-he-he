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
    version: "2.0.5",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅",
    category: "group",
    shortDescription: {
      en: toBI("Group theke member der permanently ban kora")
    },
    longDescription: {
      en: toBI("Group theke member der permanently ban kora (QTV bot set kora rakhun)")
    },
    guide: {
      en: toBI("{p}ban [key]")
    }
  },

  onStart: async function ({ event, message, args, usersData, threadsData, api }) {
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
      return message.reply(toBI("❌ Botke group admin dite hobe ei command chalanor jonno\nPlease add kore abar try korun!"));
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
            return message.reply(toBI("✅ Apnake kokhono warn kora hoyni"));
          }
          
          let msg = "";
          for (let reasonwarn of mywarn) {
            msg += `• ${reasonwarn}\n`;
          }
          return message.reply(toBI(`❎ Apnake warn kora hoyeche:\n${msg}`));
        } 
        else if (args[1] === "all") {
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
            return message.reply(toBI("✅ Apnar group e aj porjonto keu warn hoyni"));
          } else {
            return message.reply(toBI("❎ Warn hoyeche emon memberra:\n" + allwarn));
          }
        } else {
          return message.reply(toBI("❎ Invalid view command. Use 'view' or 'view all'"));
        }
      }
      
      case "unban": {
        if (!isUserAdmin) {
          return message.reply(toBI("❎ Permission denied! Shudhu group adminra ei command use korte paren"));
        }
        
        const id = parseInt(args[1]);
        if (!id) {
          return message.reply(toBI("❎ Group er ban list theke remove korar jonno user er id dite hobe"));
        }
        
        const mybox = bans.banned[threadID] || [];
        if (!mybox.includes(id)) {
          return message.reply(toBI("✅ Ei user ke apnar group theke ban kora hoyni"));
        }
        
        // Remove from banned list and warns
        bans.banned[threadID] = mybox.filter(userId => userId !== id);
        delete bans.warns[threadID][id];
        
        fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
        return message.reply(toBI(`✅ Group er ban list theke id ${id} wala member ke remove kora holo`));
      }
      
      case "listban": {
        const mybox = bans.banned[threadID] || [];
        if (mybox.length === 0) {
          return message.reply(toBI("✅ Apnar group e aj porjonto keu ban hoyni"));
        }
        
        let msg = "";
        for (let iduser of mybox) {
          const name = await usersData.getName(iduser);
          msg += `╔ Name: ${name}\n╚ ID: ${iduser}\n\n`;
        }
        return message.reply(toBI("❎ Group theke ban kora hoyeche emon memberra:\n" + msg));
      }
      
      case "reset": {
        if (!isUserAdmin) {
          return message.reply(toBI("❎ Permission denied! Shudhu group adminra ei command use korte paren"));
        }
        
        bans.warns[threadID] = {};
        bans.banned[threadID] = [];
        fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
        return message.reply(toBI("✅ Apnar group er shob data reset kora holo"));
      }
      
      default: {
        // Default ban command
        if (!isUserAdmin) {
          return message.reply(toBI("❎ Permission denied! Shudhu group adminra ei command use korte paren"));
        }
        
        // Check if message is a reply or has mentions
        const { messageReply, mentions } = event;
        let iduser = [];
        let reason = args.slice(1).join(" ") || toBI("Kono reason dewa hoyni");
        
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
          return message.reply(toBI("❎ Kise ban korben? User ke tag koren ba reply din"));
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
              console.error("Ban error:", error);
            }
          }
        }
        
        fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
        
        return message.reply({
          body: toBI(`❎ Banned members ${arrayname.join(", ")} reason: ${reason} diye group theke permanently ber kora holo`),
          mentions: arraytag
        });
      }
    }
  }
};
