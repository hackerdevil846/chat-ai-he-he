const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "1.8",
    author: "Asif",
    countDown: 5,
    role: 0,
    description: "Change bot prefix with elegant design",
    category: "⚙️ Configuration",
    guide: {
      en:
        "╭───────『 ✧  PREFIX GUIDE  ✧ 』───────╮\n"
      + "│\n"
      + "│ ✦ {pn} <new prefix>\n"
      + "│     Set new prefix for this chat\n"
      + "│     Example: {pn} $\n"
      + "│\n"
      + "│ ✦ {pn} <new prefix> -g\n"
      + "│     Set global prefix (Admin only)\n"
      + "│     Example: {pn} $ -g\n"
      + "│\n"
      + "│ ♻️ {pn} reset\n"
      + "│     Reset to default prefix\n"
      + "│\n"
      + "╰───────────────────────╯"
    }
  },

  langs: {
    en: {
      reset:
        "╭───────『 ✧  PREFIX RESET  ✧ 』───────╮\n"
      + "│\n"
      + "│ ✅ » Reset to default: %1\n"
      + "│\n"
      + "╰───────────────────────╯",
      onlyAdmin:
        "╭───────『 ✧  PERMISSION  ✧ 』───────╮\n"
      + "│\n"
      + "│ ⛔ » Only bot admins can change global prefix!\n"
      + "│\n"
      + "╰───────────────────────╯",
      confirmGlobal:
        "╭───────『 ✧  CONFIRMATION  ✧ 』───────╮\n"
      + "│\n"
      + "│ ✨ » React to confirm global prefix update\n"
      + "│\n"
      + "╰───────────────────────╯",
      confirmThisThread:
        "╭───────『 ✧  CONFIRMATION  ✧ 』───────╮\n"
      + "│\n"
      + "│ ✨ » React to confirm chat prefix update\n"
      + "│\n"
      + "╰───────────────────────╯",
      successGlobal:
        "╭───────『 ✧  SUCCESS  ✧ 』───────╮\n"
      + "│\n"
      + "│ ✅ » Global prefix: %1\n"
      + "│\n"
      + "╰───────────────────────╯",
      successThisThread:
        "╭───────『 ✧  SUCCESS  ✧ 』───────╮\n"
      + "│\n"
      + "│ ✅ » Chat prefix: %1\n"
      + "│\n"
      + "╰───────────────────────╯",
      myPrefix:
        "╭───────『 ✧  𝑨𝒕𝒐𝒎𝒊𝒄𝑩𝒐𝒕  ✧ 』───────╮\n"
        + "│\n"
        + "│ ✨ 𝑨𝑺𝑺𝑨𝑳𝑨𝑴𝑼𝑨𝑳𝑨𝑰𝑲𝑼𝑴 ✨\n"
        + "│\n"
        + "│ ❄️ » System Prefix: 【%1】\n"
        + "│ 💬 » Chat Prefix: 【%2】\n"
        + "│\n"
        + "│ 📜 » Use 『%2help』 to see commands\n"
        + "│\n"
        + "│ 🌟 » Owner: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n"
        + "│\n"
        + "╰───────────────────────╯"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0]) return message.SyntaxError();

    if (args[0] === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix,
      setGlobal: args[1] === "-g"
    };

    if (formSet.setGlobal && role < 2) {
      return message.reply(getLang("onlyAdmin"));
    }

    const confirmMessage = formSet.setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread");
    return message.reply(confirmMessage, (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    }

    await threadsData.set(event.threadID, newPrefix, "data.prefix");
    return message.reply(getLang("successThisThread", newPrefix));
  },

  onChat: async function ({ event, message, threadsData, getLang }) {
    const globalPrefix = global.GoatBot.config.prefix;
    const threadPrefix = await threadsData.get(event.threadID, "data.prefix") || globalPrefix;

    if (event.body && event.body.toLowerCase() === "prefix") {
      return message.reply({
        body: getLang("myPrefix", globalPrefix, threadPrefix),
        attachment: await utils.getStreamFromURL("https://files.catbox.moe/e7bozl.jpg")
      });
    }
  }
};
