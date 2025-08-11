module.exports.config = {
  name: "download",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑭𝒂𝒊𝒍 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
  commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
  usages: "𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 <𝒍𝒊𝒏𝒌> || 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 <𝒑𝒂𝒕𝒉> <𝒍𝒊𝒏𝒌>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const rq = global.nodemodule["request"];
    
    if(!args[1]) {
        var path = __dirname + '';
        var link = args.slice(0).join("");
    }
    else {
        var path = __dirname + '/' + args[0];
        var link = args.slice(1).join("");
    };
    
    var format = rq.get(link);
    var namefile = format.uri.pathname;
    var path = path + '/' + (namefile.slice(namefile.lastIndexOf("/") + 1));
    
    let getimg = (await axios.get(link, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, Buffer.from(getimg, "utf-8"));
  
    return api.sendMessage("𝑭𝒂𝒊𝒍 𝒔𝒂𝒗𝒆 𝒉𝒐𝒍𝒐 𝒇𝒐𝒍𝒅𝒆𝒓 𝒆: " + path, event.threadID, event.messageID);
}
