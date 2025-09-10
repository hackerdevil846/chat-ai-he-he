const fs = require("fs");
const path = require("path");

const LOCKS_PATH = path.join(__dirname, "../../../includes/database/nameLocks.json");
const OWNER_UID = "61571630409265"; // 🔒 Owner UID

module.exports.config = {
    name: "autosetname",
    aliases: ["namelock"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 2,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "𝑈𝑠𝑒𝑟 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑔𝑟𝑜𝑢𝑝 𝑙𝑜𝑐𝑘/𝑢𝑛𝑙𝑜𝑐𝑘"
    },
    longDescription: {
        en: "𝐺𝑟𝑜𝑢𝑝 𝑢𝑠𝑒𝑟 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑙𝑜𝑐𝑘 𝑎𝑛𝑑 𝑢𝑛𝑙𝑜𝑐𝑘 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"
    },
    guide: {
        en: "{p}autosetname [lock/unlock] @mention [𝑛𝑎𝑚𝑒]"
    },
    dependencies: {
        "fs": "",
        "path": ""
    }
};

module.exports.onStart = async function({ message, event, args, api }) {
    try {
        // Check if user is owner
        if (event.senderID !== OWNER_UID) {
            return await message.reply("❌ 𝑂𝑛𝑙𝑦 𝑜𝑤𝑛𝑒𝑟 𝑐𝑎𝑛 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!");
        }

        // Validate arguments
        if (!args[0] || !event.mentions || Object.keys(event.mentions).length === 0) {
            return await message.reply("❌ 𝑈𝑠𝑎𝑔𝑒: 𝑙𝑜𝑐𝑘/𝑢𝑛𝑙𝑜𝑐𝑘 @𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑁𝑎𝑚𝑒");
        }

        const action = args[0].toLowerCase();
        const mentionedID = Object.keys(event.mentions)[0];
        
        // Extract name from arguments (remove mention part)
        let nameArgs = args.slice(1).join(" ");
        const mentionRegex = new RegExp(`@${mentionedID}\\s*`, "i");
        nameArgs = nameArgs.replace(mentionRegex, '').trim();

        // Load existing locks
        let locks = {};
        if (fs.existsSync(LOCKS_PATH)) {
            locks = JSON.parse(fs.readFileSync(LOCKS_PATH, "utf-8"));
        }

        const threadID = event.threadID;
        if (!locks[threadID]) {
            locks[threadID] = {};
        }

        // Lock action
        if (action === "lock") {
            if (!nameArgs) {
                return await message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑛𝑎𝑚𝑒 𝑡𝑜 𝑙𝑜𝑐𝑘!");
            }

            // Save lock to database
            locks[threadID][mentionedID] = nameArgs;
            fs.writeFileSync(LOCKS_PATH, JSON.stringify(locks, null, 2));
            
            // Change nickname using API
            try {
                await api.changeNickname(nameArgs, threadID, mentionedID);
                return await message.reply(`🔒 𝑁𝑎𝑚𝑒 𝑙𝑜𝑐𝑘𝑒𝑑: ${nameArgs}`);
            } catch (error) {
                console.error("𝑁𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
                return await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑡 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒. 𝑁𝑎𝑚𝑒 𝑠𝑎𝑣𝑒𝑑 𝑏𝑢𝑡 𝑛𝑜𝑡 𝑎𝑝𝑝𝑙𝑖𝑒𝑑.");
            }
        }

        // Unlock action
        if (action === "unlock") {
            if (locks[threadID] && locks[threadID][mentionedID]) {
                delete locks[threadID][mentionedID];
                fs.writeFileSync(LOCKS_PATH, JSON.stringify(locks, null, 2));
                return await message.reply("🔓 𝑁𝑎𝑚𝑒 𝑢𝑛𝑙𝑜𝑐𝑘𝑒𝑑!");
            } else {
                return await message.reply("⚠️ 𝑁𝑜 𝑛𝑎𝑚𝑒 𝑙𝑜𝑐𝑘 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑢𝑠𝑒𝑟!");
            }
        }

        return await message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑! 𝑈𝑠𝑒: 𝑙𝑜𝑐𝑘/𝑢𝑛𝑙𝑜𝑐𝑘 @𝑚𝑒𝑛𝑡𝑖𝑜𝑛");
        
    } catch (error) {
        console.error("🔴 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
    }
};
