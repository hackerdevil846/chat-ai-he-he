module.exports = {
  config: {
    name: "prefix",
    version: "1.8",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    description: "𝑩𝒐𝒕𝒆𝒓 𝒑𝒓𝒆𝒇𝒊𝒙 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒖𝒏 𝒔𝒖𝒏𝒅𝒐𝒓 𝒅𝒆𝒛𝒂𝒊𝒏𝒆",
    category: "⚙️ 𝑲𝒐𝒏𝒇𝒊𝒈𝒖𝒓𝒆𝒔𝒉𝒐𝒏",
    guide: {
      en: `
╭───────『 ✧  𝑷𝑹𝑬𝑭𝑰𝑿 𝑮𝑼𝑰𝑫𝑬  ✧ 』───────╮
│
│ ✦ {pn} <𝒏𝒆𝒘 𝒑𝒓𝒆𝒇𝒊𝒙>
│     𝑬𝒊 𝒄𝒉𝒂𝒕 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒑𝒓𝒆𝒇𝒊𝒙 𝒔𝒆𝒕 𝒌𝒐𝒓𝒖𝒏
│     𝑼𝒅𝒂𝒉𝒂𝒓𝒐𝒏: {pn} $
│
│ ✦ {pn} <𝒏𝒆𝒘 𝒑𝒓𝒆𝒇𝒊𝒙> -g
│     𝑮𝒍𝒐𝒃𝒂𝒍 𝒑𝒓𝒆𝒇𝒊𝒙 𝒔𝒆𝒕 𝒌𝒐𝒓𝒖𝒏 (𝑨𝒅𝒎𝒊𝒏 𝒅𝒆𝒓 𝒋𝒐𝒏𝒏𝒐)
│     𝑼𝒅𝒂𝒉𝒂𝒓𝒐𝒏: {pn} $ -g
│
│ ♻️ {pn} reset
│     𝑫𝒆𝒇𝒂𝒖𝒍𝒕 𝒑𝒓𝒆𝒇𝒊𝒙 𝒆 𝒓𝒊𝒔𝒆𝒕 𝒌𝒐𝒓𝒖𝒏
│
╰───────────────────────╯`
    }
  },

  onStart: async function ({ message, event, args, threadsData, role, api }) {
    const { threadID } = event;
    
    if (!args[0]) {
      return this.showPrefix(message, threadID, threadsData);
    }

    if (args[0] === "reset") {
      await threadsData.set(threadID, "", "data.prefix");
      return message.reply(this.getLang("reset", global.config.PREFIX));
    }

    const newPrefix = args[0];
    const setGlobal = args[1] === "-g";

    if (setGlobal) {
      if (role < 2) {
        return message.reply(this.getLang("onlyAdmin"));
      }
      
      global.config.PREFIX = newPrefix;
      fs.writeFileSync(global.client.configPath, JSON.stringify(global.config, null, 2));
      return message.reply(this.getLang("successGlobal", newPrefix));
    }

    await threadsData.set(threadID, newPrefix, "data.prefix");
    return message.reply(this.getLang("successThisThread", newPrefix));
  },

  onChat: async function ({ event, message, threadsData }) {
    if (event.body && event.body.toLowerCase() === "prefix") {
      this.showPrefix(message, event.threadID, threadsData);
    }
  },

  showPrefix: async function (message, threadID, threadsData) {
    const globalPrefix = global.config.PREFIX;
    const threadPrefix = await threadsData.get(threadID, "data.prefix") || globalPrefix;
    
    message.reply({
      body: this.getLang("myPrefix", globalPrefix, threadPrefix),
      attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/e7bozl.jpg")
    });
  },

  getLang: function (key, ...values) {
    const lang = {
      reset: 
`╭───────『 ✧  𝑷𝑹𝑬𝑭𝑰𝑿 𝑹𝑬𝑺𝑬𝑻  ✧ 』───────╮
│
│ ✅ » 𝑫𝒆𝒇𝒂𝒖𝒍𝒕 𝒆 𝒓𝒊𝒔𝒆𝒕 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐: %1
│
╰───────────────────────╯`,
      onlyAdmin: 
`╭───────『 ✧  𝑷𝑬𝑹𝑴𝑰𝑺𝑺𝑰𝑶𝑵  ✧ 』───────╮
│
│ ⛔ » 𝑺𝒖𝒅𝒉𝒖 𝒃𝒐𝒕 𝒂𝒅𝒎𝒊𝒏𝒓𝒂 𝒈𝒍𝒐𝒃𝒂𝒍 𝒑𝒓𝒆𝒇𝒊𝒙 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒃𝒆𝒏!
│
╰───────────────────────╯`,
      successGlobal: 
`╭───────『 ✧  𝑺𝑼𝑪𝑪𝑬𝑺𝑺  ✧ 』───────╮
│
│ ✅ » 𝑮𝒍𝒐𝒃𝒂𝒍 𝒑𝒓𝒆𝒇𝒊𝒙: %1
│
╰───────────────────────╯`,
      successThisThread: 
`╭───────『 ✧  𝑺𝑼𝑪𝑪𝑬𝑺𝑺  ✧ 』───────╮
│
│ ✅ » 𝑪𝒉𝒂𝒕 𝒑𝒓𝒆𝒇𝒊𝒙: %1
│
╰───────────────────────╯`,
      myPrefix: 
`╭───────『 ✧  𝑨𝒕𝒐𝒎𝒊𝒄𝑩𝒐𝒕  ✧ 』───────╮
│
│ ✨ 𝑨𝑺𝑺𝑨𝑳𝑨𝑴𝑼𝑨𝑳𝑨𝑰𝑲𝑼𝑴 ✨
│
│ ❄️ » 𝑺𝒊𝒔𝒕𝒆𝒎 𝑷𝒓𝒆𝒇𝒊𝒙: 【%1】
│ 💬 » 𝑪𝒉𝒂𝒕 𝑷𝒓𝒆𝒇𝒊𝒙: 【%2】
│
│ 📜 » 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝒅𝒆𝒌𝒉𝒕𝒆 『%2help』 𝒍𝒊𝒌𝒉𝒖𝒏
│
│ 🌟 » 𝑶𝒘𝒏𝒆𝒓: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅
│
╰───────────────────────╯`
    };

    return lang[key].replace(/%(\d+)/g, (_, index) => values[parseInt(index) - 1]);
  }
};
