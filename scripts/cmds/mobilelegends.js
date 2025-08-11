module.exports.config = {
  name: "mobilelegends",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑴𝒐𝒃𝒊𝒍𝒆 𝑳𝒆𝒈𝒆𝒏𝒅𝒔 𝒆𝒓 𝒎𝒆𝒎𝒆",
  commandCategory: "Entertainment",
  usages: "𝒎𝒐𝒃𝒊𝒍𝒆𝒍𝒆𝒈𝒆𝒏𝒅𝒔",
  cooldowns: 3,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
  var link = [
"https://i.imgur.com/KOoiqg6.jpg",
"https://i.imgur.com/sRUIrUk.jpg", 
"https://i.imgur.com/rQADlNS.jpg", 
"https://i.imgur.com/SFhEKpH.jpg", 
"https://i.imgur.com/QSnmMiE.jpg", 
"https://i.imgur.com/1CkO7F3.jpg", 
  ];
	 var callback = () => api.sendMessage({body:`🤣 𝑬𝒊 𝒏𝒂𝒐 𝒕𝒐𝒎𝒂𝒓 𝑴𝒐𝒃𝒊𝒍𝒆 𝑳𝒆𝒈𝒆𝒏𝒅𝒔 𝒆𝒓 𝒎𝒆𝒎𝒆! 🤣\n\n𝗠𝗼𝘁 𝗺𝗲𝗺𝗲 𝗮𝗰𝗵𝗲: ${link.length} 𝘁𝗮!`,attachment: fs.createReadStream(__dirname + "/cache/ken.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/ken.jpg"));	
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/ken.jpg")).on("close",() => callback());
   };
