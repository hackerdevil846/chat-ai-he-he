const fs = require('fs-extra');

module.exports = {
  config: {
    name: "appstate",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝒂𝒑𝒑𝒔𝒕𝒂𝒕𝒆.𝒋𝒔𝒐𝒏 𝒌𝒆 𝒓𝒆𝒇𝒓𝒆𝒔𝒉 𝒌𝒐𝒓𝒂",
    category: "Admin",
    usages: "appstate",
    cooldowns: 5,
    dependencies: {}
  },

  onStart: async function({ api, event, args }) {
    try {
      const permission = ["61571630409265"];
      
      if (!permission.includes(String(event.senderID))) {
        return api.sendMessage("𝑨𝒑𝒏𝒂𝒓 𝑷𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝑵𝒆𝒊! 😾", event.threadID, event.messageID);
      }

      let appstate = api.getAppState();
      const data = JSON.stringify(appstate, null, 2);
      
      await fs.writeFile(`${__dirname}/../../appstate.json`, data, 'utf8');
      return api.sendMessage("𝒂𝒑𝒑𝒔𝒕𝒂𝒕𝒆 𝒓𝒆𝒇𝒓𝒆𝒔𝒉 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐 𝒔𝒐𝒎𝒐𝒔𝒔𝒂𝒏𝒂𝒊! 😸", event.threadID, event.messageID);
      
    } catch (err) {
      console.error("𝑨𝒑𝒑𝒔𝒕𝒂𝒕𝒆 𝑬𝒓𝒓𝒐𝒓:", err);
      return api.sendMessage(`𝒂𝒑𝒑𝒔𝒕𝒂𝒕𝒆 𝒓𝒆𝒇𝒓𝒆𝒔𝒉 𝒌𝒐𝒓𝒂𝒓 𝒔𝒐𝒎𝒐𝒔𝒔𝒂: ${err.message}`, event.threadID, event.messageID);
    }
  }
};
