module.exports = {
  config: {
    name: "out",
    aliases: ["leave", "exit"],
    version: "1.0.0",
    author: "Asif Mahmud",
    countDown: 10,
    role: 2,
    shortDescription: {
      en: "Bot leaves the group"
    },
    longDescription: {
      en: "Makes the bot leave the current group or a specified group"
    },
    category: "admin",
    guide: {
      en: "{p}out [group_ID]"
    }
  },

  onStart: async function({ message, args, event, api }) {
    try {
      if (!args[0]) {
        await message.reply(`🥲 Ami toder sukh dewar jonno aschilam...\n😞 Kintu tora amar joggo na...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
      }

      if (!isNaN(args[0])) {
        return api.removeUserFromGroup(api.getCurrentUserID(), args[0]);
      }

      await message.reply("❌ Please provide a valid group ID...");
    } catch (error) {
      console.log("Error in out command:", error);
      await message.reply("❌ Error occurred: " + error.message);
    }
  }
};
