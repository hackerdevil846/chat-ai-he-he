module.exports.config = {
    name: "petmonsters",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑺𝒖𝒏 𝒃𝒆𝒂𝒓𝒔 𝒆𝒓𝒂 𝒆𝒌𝒂𝒕𝒉𝒆 𝒆𝒌𝒍𝒂 𝒕𝒉𝒂𝒌𝒆 :))",
    commandCategory: "game",
    usages: "-r/-s/-l/-p",
    cooldowns: 0,
    dependencies: {
        "request":"",
        "fs-extra":""
    }
};

module.exports.run = ({ event, api, args, client, utils }) => {
    if (!args[0]) {
        api.sendMessage(`𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒕𝒂𝒈𝒔 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏: -r/-s/-l/-p`, event.threadID);
    } else {
        switch(args[0]) {
            case "-r": {
            return api.sendMessage(
                "𝑺𝒊𝒈𝒏 𝒖𝒑 𝒔𝒂𝒑𝒉𝒂𝒍 !!!\n𝑩𝒓𝒐 𝒔𝒐𝒎𝒎𝒖𝒉𝒊𝒕𝒐 𝒄𝒐𝒂𝒄𝒉 𝒉𝒐𝒍𝒐"
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "-r"
                });
            }, event.messageID);
        }
        case "-s": {
            return api.sendMessage(
                "===== 𝑺𝑯𝑶𝑷 𝑷𝑬𝑻𝑴𝑶𝑵𝑺𝑻𝑬𝑹𝑺 =====\n1.𝑭𝑶𝑶𝑫\n2.𝑾𝑬𝑨𝑷𝑶𝑵𝑺\n3.𝑨𝑹𝑴𝑶𝑹\n4.𝑷𝑬𝑻"
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "-s"
                });
            }, event.messageID);
        }
        case "-l": {
            return api.sendMessage(
                "1.𝑭𝑰𝑹𝑬 𝑺𝒀𝑺𝑻𝑬𝑴 𝑷𝑬𝑻\n2.𝑾𝑨𝑻𝑬𝑹 𝑺𝒀𝑺𝑻𝑬𝑴 𝑷𝑬𝑻\n3.𝑬𝑨𝑹𝑻𝑯 𝑺𝒀𝑺𝑻𝑬𝑴 𝑷𝑬𝑻\n4.𝑮𝑹𝑨𝑺𝑺 𝑺𝒀𝑺𝑻𝑬𝑴 𝑷𝑬𝑻\n5.𝑳𝑰𝑮𝑯𝑻 𝑺𝒀𝑺𝑻𝑬𝑴 𝑷𝑬𝑻\n6.𝑫𝑨𝑹𝑲 𝑺𝒀𝑺𝑻𝑬𝑴 𝑷𝑬𝑻"
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "-l"
                });
            }, event.messageID);
        }
        case "-p": {
            return api.sendMessage(
                "𝑨𝒔𝒄𝒉𝒆 𝒂𝒏𝒆𝒌𝒆 𝒂𝒔𝒃𝒆..."
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "-p"
                });
            }, event.messageID);
        }
            default:
            return utils.throwError("petmonsters", event.threadID, event.messageID); break;
        }
    }
};

module.exports.handleReply = async function({ api, event, handleReply, client }) {
  switch(handleReply.type) {
    case "-s":
      switch(event.body) {
        case "1":
        return api.sendMessage(
                "===[𝑭𝑶𝛰𝛿]===\n1.𝑭𝒊𝒔𝒉(100$)\n𝑩𝒊𝒌𝒓𝒊𝒕𝒆 𝒌𝒂𝒓𝒕𝒆 <3 𝒅𝒓𝒐𝒑 𝒌𝒐𝒓𝒖𝒏!!!\n2.𝑪𝒐𝒖𝒏𝒕𝒓𝒚 𝒅𝒊𝒔𝒉(100$)\n𝑩𝒊𝒌𝒓𝒊𝒕𝒆 𝒌𝒂𝒓𝒕𝒆 👍 𝒅𝒓𝒐𝒑 𝒌𝒐𝒓𝒖𝒏!!!\n3.𝑭𝒓𝒖𝒊𝒕(100$)\n𝑩𝒊𝒌𝒓𝒊𝒕𝒆 𝒌𝒂𝒓𝒕𝒆 😢 𝒅𝒓𝒐𝒑 𝒌𝒐𝒓𝒖𝒏!!!"
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "FOOD"
                });
            }, event.messageID);
        case "2":
          return api.sendMessage(
                "===[𝑾𝑬𝑨𝑷𝑶𝑵𝑺]===\n1.𝑺𝒘𝒐𝒓𝒅\n2.𝑮𝒖𝒏𝒔\n3.𝑺𝒉𝒊𝒆𝒍𝒅"
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "WEAPONS"
                });
            }, event.messageID);
          case "3":
          return api.sendMessage(
                "===[𝑨𝑹𝑴𝑶𝑹]===\n1.𝑳𝒆𝒂𝒕𝒉𝒆𝒓 𝒂𝒓𝒎𝒐𝒓\n2.𝑨𝒔𝒄𝒉𝒆 𝒂𝒏𝒆𝒌𝒆 𝒂𝒔𝒃𝒆..."
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "ARMOR"
                });
            }, event.messageID);
          case "4":
          return api.sendMessage("𝑨𝒔𝒄𝒉𝒆 𝒂𝒏𝒆𝒌𝒆 𝒂𝒔𝒃𝒆...",  event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "PET"
                });
            }, event.messageID);
                  }
      case "-l":
      switch(event.body) {
        case "1":
        return api.sendMessage("𝑵𝒂𝒎𝒆: 𝑻𝒉𝒓𝒆𝒆 𝒕𝒐𝒑 𝒅𝒐𝒈\n𝑱𝒆𝒏𝒆𝒓𝒂𝒔𝒊: 𝑭𝒊𝒓𝒆\n𝑹𝒂𝒌𝒕𝒐: 120\n𝑨𝒕𝒕𝒂𝒄𝒌: 120\n𝑺𝒑𝒆𝒄𝒊𝒂𝒍 𝒔𝒌𝒊𝒍𝒍: 𝑩𝒓𝒆𝒂𝒕𝒉𝒆 𝒐𝒖𝒕 𝒇𝒊𝒓𝒆", event.threadID); break;
        case "2":
          return api.sendMessage("𝑵𝒂𝒎𝒆: 𝑻𝒉𝒓𝒆𝒆-𝑻𝒂𝒊𝒍𝒆𝒅 𝑪𝒓𝒐𝒄𝒐𝒅𝒊𝒍𝒆\n𝑱𝒆𝒏𝒆𝒓𝒂𝒔𝒊: 𝑾𝒂𝒕𝒆𝒓\n𝑹𝒂𝒌𝒕𝒐: 120\n𝑨𝒕𝒕𝒂𝒄𝒌: 120\n𝑺𝒑𝒆𝒄𝒊𝒂𝒍 𝒔𝒌𝒊𝒍𝒍: 𝑺𝒑𝒊𝒕 𝒐𝒖𝒕 𝒘𝒂𝒕𝒆𝒓", event.threadID); break;
          case "3":
          return api.sendMessage("𝑵𝒂𝒎𝒆: 𝑩𝒆𝒂𝒓 𝑫𝒐𝒈\n𝑱𝒆𝒏𝒆𝒓𝒂𝒔𝒊: 𝑺𝒐𝒊𝒍\n𝑹𝒂𝒌𝒕𝒐: 120\n𝑨𝒕𝒕𝒂𝒄𝒌: 120\n𝑺𝒑𝒆𝒄𝒊𝒂𝒍 𝑺𝒌𝒊𝒍𝒍: 𝑬𝒂𝒓𝒕𝒉𝒒𝒖𝒂𝒌𝒆", event.threadID); break;
          case "4":
          return api.sendMessage("𝑵𝒂𝒎𝒆: 𝑮𝒊𝒂𝒏𝒕 𝑺𝒏𝒂𝒌𝒆\n𝑱𝒆𝒏𝒆𝒓𝒂𝒔𝒊: 𝑮𝒓𝒂𝒔𝒔\n𝑹𝒂𝒌𝒕𝒐: 120\n𝑨𝒕𝒕𝒂𝒄𝒌: 120\n𝑺𝒑𝒆𝒄𝒊𝒂𝒍 𝒔𝒌𝒊𝒍𝒍: 𝑻𝒊𝒆𝒅 𝒖𝒑 𝒕𝒉𝒆 𝒗𝒊𝒄𝒕𝒊𝒎", event.threadID); break;
          case "5":
          return api.sendMessage("𝑵𝒂𝒎𝒆: 𝑻𝒉𝒓𝒆𝒆 𝑯𝒆𝒂𝒅𝒆𝒅 𝑫𝒓𝒂𝒈𝒐𝒏\n𝑱𝒆𝒏𝒆𝒓𝒂𝒔𝒊: 𝑳𝒊𝒈𝒉𝒕\n𝑹𝒂𝒌𝒕𝒐: 120\n𝑨𝒕𝒕𝒂𝒄𝒌: 120\n𝑺𝒑𝒆𝒄𝒊𝒂𝒍 𝑺𝒌𝒊𝒍𝒍: 𝑺𝒉𝒐𝒘 𝒐𝒇𝒇 𝒘𝒉𝒊𝒕𝒆 𝒂𝒏𝒅 𝒃𝒓𝒊𝒈𝒉𝒕", event.threadID); break;
          case "6":
          return api.sendMessage("𝑵𝒂𝒎𝒆: 𝑫𝒆𝒗𝒊𝒍\n𝑻𝒚𝒑𝒆: 𝑫𝒂𝒓𝒌𝒏𝒆𝒔𝒔\n𝑹𝒂𝒌𝒕𝒐: 120\n𝑨𝒕𝒕𝒂𝒄𝒌: 120\n𝑺𝒑𝒆𝒄𝒊𝒂𝒍 𝒔𝒌𝒊𝒍𝒍: 𝑫𝒂𝒓𝒌𝒏𝒆𝒔𝒔 𝒄𝒐𝒗𝒆𝒓𝒔, 𝒃𝒍𝒊𝒏𝒅 𝒕𝒉𝒆 𝒐𝒑𝒑𝒐𝒏𝒆𝒏𝒕'𝒔 𝒆𝒚𝒆𝒔", event.threadID); break;
      }
  }
}
