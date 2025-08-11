module.exports.config = {
  name: "spam",
  version: "",
  permission: 2,
  credits: "Asif",
  description: "",
  category: "spam",
  usages: "[msg] [amount]",
  prefix: true,
  cooldowns: 5,
  dependencies: "",
};

module.exports.onStart = function({ api, event, Users, args }) {
  return module.exports.config;
};

module.exports.run = function({ api, event, Users, args }) {
  const permission = ["61571630409265"];
   if (!permission.includes(event.senderID))
   return api.sendMessage("Only Bot Admin Can Use this command", event.threadID, event.messageID);
  if (args.length !== 2) {
    api.sendMessage(`Invalid number of arguments. Usage: ${global.config.PREFIX}spam [msg] [amount]`, event.threadID);
    return;
  }
  var { threadID, messageID } = event;
  var k = function(k) { api.sendMessage(k, threadID) };
  const msg = args[0];
  const count = args[1];
  for (let i = 0; i < `${count}`; i++) {
    k(`${msg}`);
  }
};
