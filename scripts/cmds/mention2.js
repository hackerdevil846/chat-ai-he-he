module.exports.config = {
  name: "mentionbot",
  version: "1.0.0-beta-fixbyDungUwU",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑩𝒐𝒕 𝒂𝒅𝒎𝒊𝒏 𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒍𝒆 𝒃𝒂 𝒃𝒐𝒕 𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒍𝒆 𝒓𝒆𝒑𝒍𝒚 𝒅𝒆𝒃𝒆",
  commandCategory: "Other",
  usages: "",
  cooldowns: 1
};

module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "61551225242006") {
    var aid = ["61571630409265", "61571630409206"];
    for (const id of aid) {
      if (Object.keys(event.mentions).includes(id)) {
        var msg = [
          "Amake disturb korona 😒", 
          "Amake dakish na, ami jaanu er sathe busy 🙈", 
          "Bola nai mention korish na, dur theko 🫡", 
          "Ki hoyeche, keno dakchish? 😒😒", 
          "Hayre, amar sharam lagche 🙈 evabe dakish na", 
          "Chup kor 😒😒😒", 
          "Bolo na jaanu", 
          "Haa jaan, dakchish keno?", 
          "Bolen mere sarkar 🐥"
        ];
        return api.sendMessage({
          body: msg[Math.floor(Math.random() * msg.length)]
        }, event.threadID, event.messageID);
      }
    }
  }
};

module.exports.run = async function({}) {}
