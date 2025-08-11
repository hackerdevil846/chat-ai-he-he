module.exports.config = {
    name: "nhentai",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑵𝑯𝒆𝒏𝒕𝒂𝒊 𝒆 𝒈𝒂𝒍𝒑𝒐 𝒆𝒓 𝒊𝒏𝒇𝒐 𝒌𝒉𝒖𝒏𝒋𝒖𝒏",
    commandCategory: "𝒏𝒔𝒇𝒘",
    usages: "[𝑰𝑫]",
    cooldowns: 5,
    dependencies: {
        "request": "" 
    },
};

module.exports.languages = {
    "en": {
        "genarateCode": "𝑨𝒑𝒏𝒂𝒓 𝒋𝒐𝒏𝒚𝒐 𝒊𝒅𝒆𝒂𝒍 𝒌𝒐𝒅: %1",
        "notFound": "𝑨𝒑𝒏𝒂𝒓 𝒉𝒆𝒏𝒕𝒂𝒊 𝒎𝒂𝒏𝒈𝒂 𝒌𝒉𝒖𝒋𝒆 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂!",
        "returnResult": "» 𝑵𝒂𝒎: %1\n» 𝑳𝒆𝒌𝒉𝒐𝒌: %2\n» 𝑪𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓: %3\n» 𝑻𝒂𝒈: %4\n» 𝑳𝒊𝒏𝒌: https://nhentai.net/g/%5"
    }
}

module.exports.run = ({ api, event, args, getText }) => {
    const request = global.nodemodule["request"];
    const { threadID, messageID } = event;

    if (!args[0] || typeof parseInt(args[0]) !== "number") {
        const randomCode = Math.floor(Math.random() * 99999);
        return api.sendMessage(getText("genarateCode", randomCode), threadID, messageID);
    }
    
    return request(`https://nhentai.net/api/gallery/${parseInt(args[0])}`, (error, response, body) => {
        try {
            var codeData = JSON.parse(body);
            if (codeData.error) throw new Error();
        } catch {
            return api.sendMessage(getText("notFound"), threadID, messageID);
        }

        const title = codeData.title.pretty;
        var tagList = [],
            artistList = [],
            characterList = [];
        
        codeData.tags.forEach(item => {
            if (item.type === "tag") tagList.push(item.name);
            else if (item.type === "artist") artistList.push(item.name);
            else if (item.type === "character") characterList.push(item.name);
        });
        
        const tags = tagList.join(', ');
        const artists = artistList.join(', ') || '𝑶𝒓𝒊𝒈𝒊𝒏𝒂𝒍';
        const characters = characterList.join(', ') || '𝑶𝒓𝒊𝒈𝒊𝒏𝒂𝒍';
        
        return api.sendMessage(
            getText("returnResult", title, artists, characters, tags, args[0]),
            threadID,
            messageID
        );
    });
}
