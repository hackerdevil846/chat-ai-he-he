const fs = require("fs");

module.exports = {
  config: {
    name: "asif",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "hihihihi",
    category: "no prefix",
    usages: "asif",
    cooldowns: 5
  },

  handleEvent: function({ api, event, client, __GLOBAL }) {
    if (this.config.credits != '𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅') {
      console.log('[ WARN ] » Change credits to your mothers dick, bitch:)) ' + global.config.BOTNAME + ' change credits modules "' + this.config.name + '"');
      return api.sendMessage('[ WARN ] Change the credits, write 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 again', event.threadID, event.messageID);
    }

    var { threadID, messageID } = event;
    const triggerWords = [
      "@Asif Mahmud",
      "@𝐓ɽ͜͡𝐮𝐬ʈ 𝐌̽𝐞 𝐁𝐚͜͡𝐛ɣ̈̈›› 𝐈 𝐖ɪ̽ɭɭ ဗီူံ ๛⃝𓆩𝐁ɽ͜͡𝐞̽ɑ̽𝐤 𝐘ǿ𝐮̽ɾ 𝐇𝐞̽𝐚͜͡𝐫ʈﮩﮩــﮩــــ𓆩  𓆪〘̶𑁍 〘̶𑁍𓆩⃝A̶S̶I̶F̶𓆪 † 』𓆩๏̬̬̬̬̬̬𓆪†『٭𝐱͜͡⃝ᴆ』†٭❯",
      "@𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
      "@Asif",
      "Asif"
    ];

    if (triggerWords.some(word => event.body.indexOf(word) === 0)) {
      var msg = {
        body: "『 @𝐓ɽ͜͡𝐮𝐬ʈ 𝐌̽𝐞 𝐁𝐚͜͡𝐛ɣ̈̈›› 𝐈 𝐖ɪ̽ɭɭ ဗီူံ ๛⃝𓆩𝐁ɽ͜͡𝐞̽ɑ̽𝐤 𝐘ǿ𝐮̽ɾ 𝐇𝐞̽𝐚͜͡𝐫ʈﮩﮩــﮩــــ𓆩  𓆪〘̶𑁍 〘̶𑁍𓆩⃝A̶S̶I̶F̶𓆪 † 』𓆩๏̬̬̬̬̬̬𓆪†『٭𝐱͜͡⃝ᴆ』†٭❯ 』",
        attachment: fs.createReadStream(__dirname + `/scripts/cmds/noprefix/Asif.png`)
      }
      api.sendMessage(msg, threadID, messageID);
      api.setMessageReaction("💔", event.messageID, (err) => {}, true);
    }
  },

  onStart: function({ api, event, client, __GLOBAL }) {
    // This function is called when the command is executed directly
    // You can add functionality here if needed
  }
};
