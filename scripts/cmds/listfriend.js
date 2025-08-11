module.exports.config = {
  name: "listfriend",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑩𝒂𝒏𝒅𝒉𝒖𝒅𝒆𝒓 𝒅𝒆𝒓 𝒊𝒏𝒇𝒐 𝒅𝒆𝒌𝒉𝒂𝒓 𝒂𝒓 𝒓𝒆𝒑𝒍𝒚 𝒅𝒊𝒚𝒆 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
  commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
  usages: "",
  cooldowns: 5
};

module.exports.handleReply = async function ({ api, args, Users, handleReply, event, Threads }) {
  const { threadID, messageID } = event;
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

  switch (handleReply.type) {
    case "reply":
      {
        var msg = "", name, urlUser, uidUser;
        var arrnum = event.body.split(" ");
        var nums = arrnum.map(n => parseInt(n));
        for (let num of nums) {
          name = handleReply.nameUser[num - 1];
          urlUser = handleReply.urlUser[num - 1];
          uidUser = handleReply.uidUser[num - 1];

          api.unfriend(uidUser);
          msg += '┣⊱ ' + name + '\n┗⊱ 𝑷𝒓𝒐𝒇𝒊𝒍𝒆𝑼𝒓𝒍: ' + urlUser + "\n\n";
        }

        api.sendMessage(`🗑️ 𝑫𝒆𝒍𝒆𝒕𝒆𝒅 𝑭𝒓𝒊𝒆𝒏𝒅𝒔 🗑️\n\n${msg}`, threadID, () =>
          api.unsendMessage(handleReply.messageID));
      }
      break;
  }
};

module.exports.run = async function ({ event, api, args }) {
  const { threadID, messageID, senderID } = event;
  try {
    var listFriend = [];
    var dataFriend = await api.getFriendsList();
    var countFr = dataFriend.length;

    for (var friends of dataFriend) {
      listFriend.push({
        name: friends.fullName || "𝑪𝒉𝒆𝒍𝒆 𝒏𝒂𝒎",
        uid: friends.userID,
        gender: friends.gender,
        vanity: friends.vanity,
        profileUrl: friends.profileUrl
      });
    }
    
    var nameUser = [], urlUser = [], uidUser = [];
    var page = 1;
    page = parseInt(args[0]) || 1;
    page < -1 ? page = 1 : "";
    var limit = 10;
    var numPage = Math.ceil(listFriend.length / limit);
    
    var msg = `🎭 𝑻𝒐𝒎𝒂𝒓 𝑩𝒂𝒏𝒅𝒉𝒖𝒅𝒆𝒓 𝑺𝒐𝒏𝒌𝒉𝒂: ${countFr} 🎭\n━━━━━━━━━━━━━━━━━━\n\n`;
    
    for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
      if (i >= listFriend.length) break;
      let infoFriend = listFriend[i];
      msg += `┏⊰ ${i + 1}. ${infoFriend.name}\n`;
      msg += `┣⊰ 𝑰𝑫: ${infoFriend.uid}\n`;
      msg += `┣⊰ 𝑳𝒊𝒏𝒈: ${infoFriend.gender}\n`;
      msg += `┣⊰ 𝑽𝒂𝒏𝒊𝒕𝒚: ${infoFriend.vanity || '𝑵𝒂𝒊'}\n`;
      msg += `┗⊰ 𝑷𝒓𝒐𝒇𝒊𝒍𝒆𝑼𝒓𝒍: ${infoFriend.profileUrl}\n\n`;
      
      nameUser.push(infoFriend.name);
      urlUser.push(infoFriend.profileUrl);
      uidUser.push(infoFriend.uid);
    }
    
    msg += `✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n📄 𝑷𝒂𝒈𝒆 ${page}/${numPage}\n\n`;
    msg += '🎭 𝑹𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒐 𝒏𝒖𝒎𝒃𝒆𝒓 𝒅𝒊𝒚𝒆 (1 𝒕𝒆 10 𝒆𝒓 𝒎𝒐𝒋𝒂𝒛𝒂), 𝒆𝒌𝒂𝒅𝒉𝒊𝒌 𝒏𝒖𝒎𝒃𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒃𝒆𝒏, 𝒏𝒖𝒎𝒃𝒆𝒓 𝒈𝒖𝒍𝒊 𝒔𝒑𝒂𝒄𝒆 𝒅𝒊𝒚𝒆 𝒂𝒍𝒂𝒅𝒂 𝒌𝒐𝒓𝒖𝒏 𝒋𝒆 𝒃𝒂𝒏𝒅𝒉𝒖𝒅𝒆𝒓 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒐!';

    return api.sendMessage(msg, threadID, (e, data) =>
      global.client.handleReply.push({
        name: this.config.name,
        author: event.senderID,
        messageID: data.messageID,
        nameUser,
        urlUser,
        uidUser,
        type: 'reply'
      })
    );
  }
  catch (e) {
    return console.log(e)
  }
}
