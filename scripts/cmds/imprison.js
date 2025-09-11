const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports.config = {
    name: "imprison",
    aliases: ["jail", "prison"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐼𝑚𝑎𝑔𝑒 𝑒𝑓𝑓𝑒𝑐𝑡"
    },
    longDescription: {
        en: "𝐽𝑎𝑖𝑙 𝑖𝑚𝑎𝑔𝑒 𝑒𝑓𝑓𝑒𝑐𝑡"
    },
    category: "𝑖𝑚𝑎𝑔𝑒",
    guide: {
        en: "{p}imprison @𝑡𝑎𝑔"
    },
    dependencies: {
        "discord-image-generation": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ event, message, usersData, args }) {
    try {
        const uid2 = Object.keys(event.mentions)[0];
        if (!uid2) {
            return message.reply("𝒴𝑜𝓊 𝓂𝓊𝓈𝓉 𝓉𝒶𝑔 𝓉𝒽𝑒 𝓅𝑒𝓇𝓈𝑜𝓃 𝓎𝑜𝓊 𝓌𝒶𝓃𝓉 𝓉𝑜 𝒾𝓂𝓅𝓇𝒾𝓈𝑜𝓃");
        }

        const avatarURL2 = await usersData.getAvatarUrl(uid2);
        const img = await new DIG.Jail().getImage(avatarURL2);
        const pathSave = `${__dirname}/tmp/${uid2}_Imprison.png`;
        
        await fs.writeFileSync(pathSave, Buffer.from(img));
        
        const content = args.join(' ').replace(Object.keys(event.mentions)[0], "");
        
        await message.reply({
            body: `${(content || "𝒴𝑜𝓊'𝓇𝑒 𝒾𝓃 𝒿𝒶𝒾𝓁!")} 🚔`,
            attachment: fs.createReadStream(pathSave)
        });
        
        fs.unlinkSync(pathSave);
        
    } catch (error) {
        console.error("𝐼𝑚𝑝𝑟𝑖𝑠𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑗𝑎𝑖𝑙 𝑖𝑚𝑎𝑔𝑒 𝑒𝑓𝑓𝑒𝑐𝑡");
    }
};
