module.exports = {
  config: {
     name: "pp",
    aliases: ["pfp", "profile"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "image",
    shortDescription: {
      en: "𝐺𝑒𝑡 𝑢𝑠𝑒𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
      en: "𝐺𝑒𝑡 𝑎𝑛𝑦 𝑢𝑠𝑒𝑟'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒 𝑏𝑦 𝑡𝑎𝑔, 𝐼𝐷, 𝑜𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑈𝑅𝐿"
    },
    guide: {
      en: "{𝑝}pp @𝑡𝑎𝑔 𝑜𝑟 𝑢𝑠𝑒𝑟𝐼𝐷 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑜𝑟 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑈𝑅𝐿"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    try {
      const getAvatarUrl = async (uid) => await usersData.getAvatarUrl(uid);
      const uid = Object.keys(event.mentions)[0] || args[0] || event.senderID;
      let avt;

      if (event.type === "message_reply") {
        avt = await getAvatarUrl(event.messageReply.senderID);
      } else if (args.join(" ").includes("facebook.com")) {
        const match = args.join(" ").match(/(\d+)/);
        if (match) avt = await getAvatarUrl(match[0]);
        else throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑈𝑅𝐿.");
      } else {
        avt = await getAvatarUrl(uid);
      }
      
      await message.reply({ 
        body: "", 
        attachment: await global.utils.getStreamFromURL(avt) 
      });
      
    } catch (error) {
      await message.reply(`⚠️ 𝐸𝑟𝑟𝑜𝑟: ${error.message}`);
    }
  }
};
