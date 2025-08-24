module.exports = {
  config: {
    name: "rstname",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Group-e bot-er naam ke default (BOTNAME [ PREFIX ]) a kore reset kore.",
    category: "group",
    usages: "",
    cooldowns: 5
  },

  languages: {
    "en": {
      "NOT_GROUP": "❌ This command works only in groups!",
      "RESET_SUCCESS": "✅ Name has been reset to: %1",
      "RESET_FAIL": "❌ Failed to change the name. An error occurred."
    },
    "bn": {
      "NOT_GROUP": "❌ Ei command-ta sudhu group-e kaj kore!",
      "RESET_SUCCESS": "✅ Nam reset kora holo: %1",
      "RESET_FAIL": "❌ Nam poriborton kora jaini. Error hoise."
    }
  },

  /**
   * run - main entry
   * @param {Object} param0
   * @param {Object} param0.api - bot api
   * @param {Object} param0.event - event data
   * @param {Array}  param0.args - command args (not used)
   */
  run: async function ({ api, event, args }) {
    const { threadID, senderID } = event;

    // Only allow in groups
    if (!event.isGroup) {
      return api.sendMessage(this.languages["bn"]["NOT_GROUP"], threadID);
    }

    // Read bot name and prefix from global config (fallbacks included)
    const botName = (global.config && global.config.BOTNAME) ? global.config.BOTNAME : "Bot";
    const prefix = (global.config && global.config.PREFIX) ? global.config.PREFIX : "!";

    // Format new nickname: BOTNAME [ PREFIX ]
    const newNick = `${botName} [ ${prefix} ]`;

    try {
      // Change the bot's nickname in the current thread
      await api.changeNickname(newNick, threadID, api.getCurrentUserID());

      // Success message (Banglish first, also friendly emoji)
      const successMsg = `✅ Nam reset kora holo: ${newNick}\n\n• Bot name updated successfully.`;
      return api.sendMessage(successMsg, threadID);
    } catch (error) {
      // Log the error for debugging but send a user-friendly message
      console.error("rstname command error:", error);
      return api.sendMessage("❌ Nam poriborton kora jaini. Error hoise.", threadID);
    }
  }
};
