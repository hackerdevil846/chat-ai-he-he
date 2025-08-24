module.exports.config = {
  name: "appstate",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝒂𝒑𝒑𝒔𝒕𝒂𝒕𝒆.𝒋𝒔𝒐𝒏 𝒌𝒆 𝒓𝒆𝒇𝒓𝒆𝒔𝒉 𝒌𝒐𝒓𝒂",
  category: "Admin",
  usages: "appstate",
  cooldowns: 5,
  dependencies: {}
};

// onStart added to prevent "onStart of command undefined" error in loader
module.exports.onStart = async function () {
  // intentionally empty — loader expects this function to exist
  return;
};

module.exports.run = async function ({ api, event, args }) {
  const fs = require("fs-extra");
  const permission = ["61571630409265"];
  
  if (!permission.includes(String(event.senderID))) {
    return api.sendMessage("𝑨𝒑𝒏𝒂𝒓 𝑷𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝑵𝒆𝒊! 😾", event.threadID, event.messageID);
  }

  let appstate = api.getAppState();
  const data = JSON.stringify(appstate);
  
  fs.writeFile(`${__dirname}/../../appstate.json`, data, 'utf8', (err) => {
    if (err) {
      return api.sendMessage(`𝒂𝒑𝒑𝒔𝒕𝒂𝒕𝒆 𝒓𝒆𝒇𝒓𝒆𝒔𝒉 𝒌𝒐𝒓𝒂𝒓 𝒔𝒐𝒎𝒐𝒔𝒔𝒂: ${err}`, event.threadID);
    } else {
      return api.sendMessage("𝒂𝒑𝒑𝒔𝒕𝒂𝒕𝒆 𝒓𝒆𝒇𝒓𝒆𝒔𝒉 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐 𝒔𝒐𝒎𝒐𝒔𝒔𝒂𝒏𝒂𝒊! 😸", event.threadID);
    }
  });
};
