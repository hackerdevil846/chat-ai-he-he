module.exports.config = {
    name: "fbcoverv2",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Facebook cover creation tool",
    category: "image",
    usages: "",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "request": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");
    
    try {
        if (args[0] == "list") {
            const res = await axios.get("https://api.nguyenmanh.name.vn/taoanhdep/list");
            
            var trang = 1;
            trang = parseInt(args[1]) || 1;
            trang < -1 ? trang = 1 : "";
            var limit = 11;
            var danhsach = res.data.listAnime.length;
            var soTrang = Math.ceil(danhsach / limit);
            var msg = [];
      
            for (var i = limit * (trang - 1); i < limit * (trang - 1) + limit; i++) {
                if (i >= danhsach) break;
                var nv = res.data.listAnime[i].name;
                msg += `${i + 0}. ${nv}\n`
            }
      
            msg += `» 𝑨𝒍𝒍 ${danhsach} 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓\n» 𝑷𝒂𝒈𝒆𝒔 (${trang}/${soTrang})\n» 𝑼𝒔𝒆 ${global.config.PREFIX}fbcover list <𝒑𝒂𝒈𝒆 𝒏𝒖𝒎𝒃𝒆𝒓> 𝒕𝒐 𝒔𝒆𝒆 𝒎𝒐𝒓𝒆`;
            return api.sendMessage(`●─●𝑬𝒎𝒊𝒍𝒊𝒂●──●\n` + msg + `\n●──●𝑬𝒏𝒅●──●`, threadID, messageID);
            
        } else if (args[0] == "find") {
            if (!args[1]) return api.sendMessage("❌ Please enter a character name to search", threadID, messageID);
            
            var char = args.slice(1).join(" ");
            const res = await axios.get(`https://api.nguyenmanh.name.vn/taoanhdep/search?key=${encodeURIComponent(char)}`);
            var id = res.data.ID;
            return api.sendMessage(`𝑰𝑫 𝒐𝒇 ${char}: ${id - 1}`, threadID, messageID);
        } 
          
        else if (args[0] == "color") {
            const mautienganh = "https://4.bp.blogspot.com/-_nVsmtO-a8o/VYfZIUJXydI/AAAAAAAACBQ/FHfioHYszpk/w1200-h630-p-k-no-nu/cac-mau-trong-tieng-anh.jpg";
            var callback = () => {
                api.sendMessage({
                    body: "[ 𝑬𝒏𝒈𝒍𝒊𝒔𝒉 𝒄𝒐𝒍𝒐𝒓 𝒍𝒊𝒔𝒕 ]",
                    attachment: fs.createReadStream(__dirname + `/cache/mautienganh.jpg`)
                }, threadID, () => fs.unlinkSync(__dirname + `/cache/mautienganh.jpg`))
            };
            request(encodeURI(mautienganh)).pipe(fs.createWriteStream(__dirname + `/cache/mautienganh.jpg`)).on("close", callback);
        } else {
            return api.sendMessage(`» 𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒕𝒉𝒊𝒔 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝒕𝒉𝒆 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝑰𝑫 𝒚𝒐𝒖 𝒘𝒂𝒏𝒕 𝒕𝒐 𝒄𝒉𝒐𝒐𝒔𝒆`, threadID, (error, info) => {
                if (error) return console.error(error);
                global.client.handleReply.push ({
                    type: "characters",
                    name: this.config.name,
                    author: senderID,
                    messageID: info.messageID
                });
            }, event.messageID);
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ An error occurred while processing your request", threadID, messageID);
    }
}

module.exports.handleReply = async function({ api, event, handleReply }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");
    
    if (handleReply.author != event.senderID) return api.sendMessage('𝑨𝒑𝒏𝒂𝒓 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒏𝒆𝒊', event.threadID, event.messageID);
    const { threadID, messageID, senderID } = event;
  
    try {
        switch (handleReply.type) {
            case "characters": {
                const id = parseInt(event.body);
                if (isNaN(id)) return api.sendMessage("❌ Please enter a valid number", threadID, messageID);
                
                const res = await axios.get(`https://api.nguyenmanh.name.vn/taoanhdep/search/id?id=${id + 1}`);
                var name = res.data.name
                
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage(`» 𝑨𝒑𝒏𝒊 𝒔𝒆𝒍𝒆𝒄𝒕𝒆𝒅 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓: ${name}\n» 𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒕𝒉𝒊𝒔 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒏𝒂𝒎𝒆`, threadID, (error, info) => {
                    if (error) return console.error(error);
                    global.client.handleReply.push({
                        type: 'subname',
                        name: this.config.name,
                        author: senderID,
                        characters: event.body,
                        messageID: info.messageID
                    });
                }, messageID);
            }
            
            case "subname": {
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage(`» 𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒕𝒉𝒊𝒔 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒔𝒆𝒄𝒐𝒏𝒅𝒂𝒓𝒚 𝒏𝒂𝒎𝒆`, threadID, (error, info) => {
                    if (error) return console.error(error);
                    global.client.handleReply.push({
                        type: 'color',
                        name: this.config.name,
                        author: senderID,
                        characters: handleReply.characters,
                        name_s: event.body,
                        messageID: info.messageID
                    });
                }, messageID);
            }
      
            case "color": {
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage(`» 𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒕𝒉𝒊𝒔 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝒃𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝒄𝒐𝒍𝒐𝒓\n» 𝑼𝒔𝒆 "${global.config.PREFIX}fbcover color" 𝒕𝒐 𝒔𝒆𝒆 𝒄𝒐𝒍𝒐𝒓 𝒍𝒊𝒔𝒕`, threadID, (error, info) => {
                    if (error) return console.error(error);
                    global.client.handleReply.push({
                        type: 'create',
                        name: this.config.name,
                        author: senderID,
                        characters: handleReply.characters,
                        subname: event.body,
                        name_s: handleReply.name_s,
                        messageID: info.messageID
                    });
                }, messageID);
            }
            
            case "create": {
                var idchar = handleReply.characters;
                var name_ = handleReply.name_s;
                var subname_ = handleReply.subname;
                var color_ = event.body;
                
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage(`𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒄𝒐𝒗𝒆𝒓 𝒃𝒂𝒏𝒂𝒄𝒄𝒉𝒆... ✨`, event.threadID, async (error, info) => {
                    if (error) return console.error(error);
                    
                    await new Promise(resolve => setTimeout(resolve, 3 * 1000));
                    try {
                        var imag = (await axios.get(`https://api.nguyenmanh.name.vn/fbcover/v2?name=${encodeURIComponent(name_)}&id=${idchar}&subname=${encodeURIComponent(subname_)}&color=${encodeURIComponent(color_)}&apikey=KeyTest`, {
                            responseType: "stream"
                        })).data;
                        
                        var msg = {
                            body: `𝑵𝒊𝒋𝒆𝒓 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒄𝒐𝒗𝒆𝒓 ⚡`,
                            attachment: imag
                        };
                        return api.sendMessage(msg, event.threadID, event.messageID);
                    } catch (error) {
                        console.error(error);
                        return api.sendMessage("❌ Failed to generate cover. Please try again later.", event.threadID, event.messageID);
                    }
                }, event.messageID);
            }
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ An error occurred while processing your request", threadID, messageID);
    }
}
