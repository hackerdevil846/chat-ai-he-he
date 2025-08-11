module.exports.config = {
  name: "ping",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑺𝒐𝒃𝒂𝒊𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒂",
  commandCategory: "system",
  usages: "[Text]",
  cooldowns: 80
};

module.exports.run = async function({ api, event, args }) {
  try {
    const botID = api.getCurrentUserID();
    let listAFK, listUserID;
    
    if (global.moduleData["afk"] && global.moduleData["afk"].afkList) {
      listAFK = Object.keys(global.moduleData["afk"].afkList);
    } else {
      listAFK = [];
    }
    
    listUserID = event.participantIDs.filter(ID => ID !== botID && ID !== event.senderID);
    listUserID = listUserID.filter(item => !listAFK.includes(item));
    
    let body = (args.length !== 0) ? args.join(" ") : "𝑺𝒐𝒃𝒂𝒊𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐 😊";
    let mentions = [];
    let index = 0;
    
    for (const idUser of listUserID) {
      body = "‎" + body;
      mentions.push({
        id: idUser,
        tag: "‎",
        fromIndex: index
      });
      index += 1;
    }

    return api.sendMessage({
      body,
      mentions
    }, event.threadID, event.messageID);
  }
  catch (e) { 
    return console.log("𝑬𝒓𝒓𝒐𝒓: " + e); 
  }
}
