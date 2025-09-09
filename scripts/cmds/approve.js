const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "approve",
    aliases: ["app", "approval"],
    version: "1.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑝𝑝𝑟𝑜𝑣𝑎𝑙𝑠 𝑓𝑜𝑟 𝑏𝑜𝑡"
    },
    longDescription: {
        en: "𝐴𝑝𝑝𝑟𝑜𝑣𝑒 𝑜𝑟 𝑚𝑎𝑛𝑎𝑔𝑒 𝑔𝑟𝑜𝑢𝑝𝑠 𝑓𝑜𝑟 𝑏𝑜𝑡 𝑢𝑠𝑎𝑔𝑒"
    },
    guide: {
        en: "{p}approve [𝑙𝑖𝑠𝑡/𝑝𝑒𝑛𝑑𝑖𝑛𝑔/𝑑𝑒𝑙/ℎ𝑒𝑙𝑝]"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        const dataPath = path.join(__dirname, "approvedThreads.json");
        const dataPending = path.join(__dirname, "pendingThreads.json");

        // Ensure data files exist
        if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
        if (!fs.existsSync(dataPending)) fs.writeFileSync(dataPending, JSON.stringify([]));

        let approved = JSON.parse(fs.readFileSync(dataPath));
        let pending = JSON.parse(fs.readFileSync(dataPending));
        
        const { threadID } = event;
        let targetID = args[0] ? args[0] : threadID;

        // Helper function for Mathematical Bold Italic
        const toBI = (text) => {
            const map = {
                'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋',
                'k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝒒','r': '𝒓','s': '𝒔','t': '𝒕',
                'u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
                'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱',
                'K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻',
                'U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿','Y': '𝒀','Z': '𝒁',
                '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗'
            };
            return text.split('').map(char => map[char] || char).join('');
        };

        // HELP COMMAND
        if (args[0] === "help" || args[0] === "h") {
            const helpMessage = `🎭 ${toBI("APPROVE COMMANDS")} 🎭

${toBI(global.config.PREFIX + this.config.name)} ${toBI('𝑙𝑖𝑠𝑡')} - 𝑣𝑖𝑒𝑤 𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑 𝑔𝑟𝑜𝑢𝑝𝑠
${toBI(global.config.PREFIX + this.config.name)} ${toBI('𝑝𝑒𝑛𝑑𝑖𝑛𝑔')} - 𝑣𝑖𝑒𝑤 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝𝑠
${toBI(global.config.PREFIX + this.config.name)} ${toBI('𝑑𝑒𝑙')} [𝑖𝑑] - 𝑟𝑒𝑚𝑜𝑣𝑒 𝑓𝑟𝑜𝑚 𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑
${toBI(global.config.PREFIX + this.config.name)} [𝑖𝑑] - 𝑎𝑝𝑝𝑟𝑜𝑣𝑒 𝑎 𝑔𝑟𝑜𝑢𝑝

${toBI("𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦:")} ${toBI(this.config.author)}`;
            return message.reply(helpMessage);
        }

        // LIST APPROVED GROUPS
        if (args[0] === "list" || args[0] === "l") {
            if (approved.length === 0) {
                return message.reply("❌ 𝑁𝑜 𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑 𝑔𝑟𝑜𝑢𝑝𝑠 𝑓𝑜𝑢𝑛𝑑");
            }

            let msg = `${toBI("APPROVED GROUPS")} [${approved.length}]:\n\n`;
            approved.forEach((id, index) => {
                msg += `〘${index + 1}〙 » ${id}\n`;
            });
            
            return message.reply(msg);
        }

        // LIST PENDING GROUPS
        if (args[0] === "pending" || args[0] === "p") {
            if (pending.length === 0) {
                return message.reply("❌ 𝑁𝑜 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝𝑠 𝑓𝑜𝑢𝑛𝑑");
            }

            let msg = `${toBI("PENDING GROUPS")} [${pending.length}]:\n\n`;
            pending.forEach((id, index) => {
                msg += `〘${index + 1}〙 » ${id}\n`;
            });
            
            return message.reply(msg);
        }

        // DELETE FROM APPROVED
        if (args[0] === "del" || args[0] === "d") {
            const idToRemove = args[1] || threadID;
            
            if (!approved.includes(idToRemove)) {
                return message.reply("❌ 𝐺𝑟𝑜𝑢𝑝 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑 𝑙𝑖𝑠𝑡");
            }

            approved = approved.filter(id => id !== idToRemove);
            fs.writeFileSync(dataPath, JSON.stringify(approved, null, 2));
            
            return message.reply(`✅ 𝐺𝑟𝑜𝑢𝑝 ${idToRemove} 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑 𝑙𝑖𝑠𝑡`);
        }

        // APPROVE A GROUP
        if (!isNaN(targetID)) {
            if (approved.includes(targetID)) {
                return message.reply("✅ 𝐺𝑟𝑜𝑢𝑝 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑");
            }

            approved.push(targetID);
            // Remove from pending if it was there
            pending = pending.filter(id => id !== targetID);
            
            fs.writeFileSync(dataPath, JSON.stringify(approved, null, 2));
            fs.writeFileSync(dataPending, JSON.stringify(pending, null, 2));
            
            return message.reply(`✅ 𝐺𝑟𝑜𝑢𝑝 ${targetID} 𝑎𝑝𝑝𝑟𝑜𝑣𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦`);
        }

        // DEFAULT: SHOW HELP
        return message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑. 𝑈𝑠𝑒 ${global.config.PREFIX}approve ℎ𝑒𝑙𝑝 𝑓𝑜𝑟 𝑖𝑛𝑠𝑡𝑟𝑢𝑐𝑡𝑖𝑜𝑛𝑠`);

    } catch (error) {
        console.error("𝐴𝑝𝑝𝑟𝑜𝑣𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
