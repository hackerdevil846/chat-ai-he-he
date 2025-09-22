const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "imprison",
    aliases: ["cell", "behindbars"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🚔 𝐽𝑎𝑖𝑙 𝑖𝑚𝑎𝑔𝑒 𝑒𝑓𝑓𝑒𝑐𝑡"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑗𝑎𝑖𝑙 𝑖𝑚𝑎𝑔𝑒 𝑒𝑓𝑓𝑒𝑐𝑡 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    guide: {
      en: "{p}imprison @𝑡𝑎𝑔"
    },
    countDown: 5,
    dependencies: {
      "discord-image-generation": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ event, message, usersData, args }) {
    try {
      const uid2 = Object.keys(event.mentions)[0];
      if (!uid2) {
        return message.reply("❌ 𝑌𝑜𝑢 𝑚𝑢𝑠𝑡 𝑡𝑎𝑔 𝑡ℎ𝑒 𝑝𝑒𝑟𝑠𝑜𝑛 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑖𝑚𝑝𝑟𝑖𝑠𝑜𝑛");
      }

      const avatarURL2 = await usersData.getAvatarUrl(uid2);
      const img = await new DIG.Jail().getImage(avatarURL2);
      const pathSave = `${__dirname}/tmp/${uid2}_Imprison.png`;
      
      await fs.writeFileSync(pathSave, Buffer.from(img));
      
      const content = args.join(' ').replace(Object.keys(event.mentions)[0], "");
      
      await message.reply({
        body: `${(content || "🔒 𝑌𝑜𝑢'𝑟𝑒 𝑖𝑛 𝑗𝑎𝑖𝑙!")} 🚔`,
        attachment: fs.createReadStream(pathSave)
      });
      
      fs.unlinkSync(pathSave);
      
    } catch (error) {
      console.error("𝐼𝑚𝑝𝑟𝑖𝑠𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑗𝑎𝑖𝑙 𝑖𝑚𝑎𝑔𝑒 𝑒𝑓𝑓𝑒𝑐𝑡");
    }
  }
};
