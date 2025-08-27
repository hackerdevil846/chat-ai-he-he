const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "imprison",
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: "𝐼𝑚𝑎𝑔𝑒 𝑒𝑓𝑓𝑒𝑐𝑡",
    longDescription: "𝐽𝑎𝑖𝑙 𝑖𝑚𝑎𝑔𝑒 𝑒𝑓𝑓𝑒𝑐𝑡",
    category: "𝑖𝑚𝑎𝑔𝑒",
    guide: {
      en: "{pn} @𝑡𝑎𝑔"
    }
  },

  langs: {
    vi: {
      noTag: "𝐵𝑎̣𝑛 𝑝ℎ𝑎̉𝑖 𝑡𝑎𝑔 𝑛𝑔𝑢̛𝑜̛̀𝑖 𝑚𝑢𝑜̂́𝑛 𝑏𝑜̉ 𝑡𝑢"
    },
    en: {
      noTag: "𝒴𝑜𝓊 𝓂𝓊𝓈𝓉 𝓉𝒶𝑔 𝓉𝒽𝑒 𝓅𝑒𝓇𝓈𝑜𝓃 𝓎𝑜𝓊 𝓌𝒶𝓃𝓉 𝓉𝑜 𝒾𝓂𝓅𝓇𝒾𝓈𝑜𝓃"
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];
    if (!uid2)
      return message.reply(getLang("noTag"));
    const avatarURL1 = await usersData.getAvatarUrl(uid1);
    const avatarURL2 = await usersData.getAvatarUrl(uid2);
    const img = await new DIG.Jail().getImage(avatarURL2);
    const pathSave = `${__dirname}/tmp/${uid2}_Imprison.png`;
    fs.writeFileSync(pathSave, Buffer.from(img));
    const content = args.join(' ').replace(Object.keys(event.mentions)[0], "");
    message.reply({
      body: `${(content || "𝒴𝑜𝓊'𝓇𝑒 𝒾𝓃 𝒿𝒶𝒾𝓁!")} 馃殧`,
      attachment: fs.createReadStream(pathSave)
    }, () => fs.unlinkSync(pathSave));
  }
};
