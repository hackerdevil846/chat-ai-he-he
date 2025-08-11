module.exports.config = {
  name: "fbcover",
  version: "1.0.9",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑪𝒖𝒔𝒕𝒐𝒎 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒄𝒐𝒗𝒆𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒐𝒓",
  commandCategory: "𝑰𝒎𝒂𝒈𝒆-𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒐𝒓",
  cooldowns: 0,
  usage: "<𝒃𝒍𝒂𝒏𝒌>",
  dependencies: {
      "fs-extra": "",
      "request": "",
      "axios": ""
  }
};

module.exports.run = async function ({ api, args, event }) {
const request = require('request');
const fs = require("fs-extra")
const axios = require("axios")
const { threadID, messageID, senderID, body } = event;

  if (!args[0]){
    api.sendMessage(`𝑨𝒑𝒏𝒊 𝒄𝒐𝒏𝒕𝒊𝒏𝒖𝒆 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒊𝒔𝒐𝒏? 𝑹𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒆 𝒏𝒊𝒋𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝑯𝒂𝒏`,event.threadID, (err, info) => {
     return global.client.handleReply.push({
        type: "characters",
        name: this.config.name,
        author: senderID,
        tenchinh: args.join(" ").toUpperCase(),
        messageID: info.messageID
      });
  },event.messageID);
}
}

module.exports.handleReply = async function({ api, event, args, handleReply }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");
    var info = await api.getUserInfo(event.senderID);
    var nameSender = info[event.senderID].name;
    var arraytag = [];
    arraytag.push({id: event.senderID, tag: nameSender});
    
    if (handleReply.author != event.senderID) return;
    
    const { threadID, messageID } = event;

    switch (handleReply.type) {
        case "characters": { 
        	api.unsendMessage(handleReply.messageID);
        	return api.sendMessage(`𝑹𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒆 𝒏𝒊𝒋𝒆𝒓 𝒑𝒓𝒊𝒎𝒂𝒓𝒚 𝒏𝒂𝒎𝒆 𝒍𝒊𝒌𝒉𝒂𝒏`,threadID, (err, info) => { 
        	  return global.client.handleReply.push({ 
        	  	type: 'subname',
        	  	name: 'fbcover',
        	  	author: senderID,
        	  	characters: event.body,
        	  	messageID: info.messageID
        	  })
        	}, messageID);
        } 
        
        case "subname": { 
        	api.unsendMessage(handleReply.messageID);
        	return api.sendMessage(`𝑨𝒑𝒏𝒊 𝒆𝒓 𝒑𝒓𝒊𝒎𝒂𝒓𝒚 𝒏𝒂𝒎𝒆: ${event.body}\n(𝑹𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒆 𝒏𝒊𝒋𝒆𝒓 𝒔𝒆𝒄𝒐𝒏𝒅𝒂𝒓𝒚 𝒏𝒂𝒎𝒆 𝒍𝒊𝒌𝒉𝒂𝒏)`,threadID, (err, info) => { 
        		return global.client.handleReply.push({ 
        			type: 'number',
        			name: 'fbcover',
        			author: senderID,
                    characters: handleReply.characters,
        			name_s: event.body,
        			messageID: info.messageID
        		})
        	}, messageID);
        }

        case "number": { 
        	api.unsendMessage(handleReply.messageID);
        	return api.sendMessage(`𝑨𝒑𝒏𝒊 𝒆𝒓 𝒔𝒆𝒄𝒐𝒏𝒅𝒂𝒓𝒚 𝒏𝒂𝒎𝒆: ${event.body}\n(𝑹𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒆 𝒏𝒊𝒋𝒆𝒓 𝒑𝒉𝒐𝒏𝒆 𝒏𝒖𝒎𝒃𝒆𝒓 𝒍𝒊𝒌𝒉𝒂𝒏)`,threadID, (err, info) => { 
        	  return global.client.handleReply.push({ 
        	  	type: 'address',
        	  	name: 'fbcover',
        	  	author: senderID,
                characters: handleReply.characters,
                subname: event.body,
                name_s: handleReply.name_s,
        	  	messageID: info.messageID
        	  })
        	}, messageID);
        }

        case "address": { 
            api.unsendMessage(handleReply.messageID);
        	return api.sendMessage(`𝑨𝒑𝒏𝒊 𝒆𝒓 𝒑𝒉𝒐𝒏𝒆 𝒏𝒖𝒎𝒃𝒆𝒓: ${event.body}\n(𝑹𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒆 𝒏𝒊𝒋𝒆𝒓 𝒂𝒅𝒅𝒓𝒆𝒔𝒔 𝒍𝒊𝒌𝒉𝒂𝒏)`,threadID, (err, info) => { 
        	  return global.client.handleReply.push({ 
        	  	type: 'email',
        	  	name: 'fbcover',
        	  	author: senderID,
                characters: handleReply.characters,
                subname: handleReply.subname,
                number: event.body,
                name_s: handleReply.name_s,
        	  	messageID: info.messageID
        	  })
        	}, messageID);
        }

        case "email": { 
        	api.unsendMessage(handleReply.messageID);
        	return api.sendMessage(`𝑨𝒑𝒏𝒊 𝒆𝒓 𝒂𝒅𝒅𝒓𝒆𝒔𝒔: ${event.body}\n(𝑹𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒆 𝒏𝒊𝒋𝒆𝒓 𝒆𝒎𝒂𝒊𝒍 𝒍𝒊𝒌𝒉𝒂𝒏)`,threadID, (err, info) => { 
        	  return global.client.handleReply.push({ 
        	  	type: 'color',
        	  	name: 'fbcover',
        	  	author: senderID,
        	  	characters: handleReply.characters,
                subname: handleReply.subname,
                number: handleReply.number,
                address: event.body,
                name_s: handleReply.name_s,
        	  	messageID: info.messageID
        	  })
        	}, messageID);
        }
        
        case "color": { 
        	api.unsendMessage(handleReply.messageID);
        	return api.sendMessage(`𝑨𝒑𝒏𝒊 𝒆𝒓 𝒆𝒎𝒂𝒊𝒍: ${event.body}\n(𝑹𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒆 𝒃𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝒄𝒐𝒍𝒐𝒓 𝒆𝒓 𝒏𝒂𝒎 𝒍𝒊𝒌𝒉𝒂𝒏 - 𝑱𝒐𝒅𝒊 𝒏𝒂 𝒄𝒉𝒂𝒊𝒍𝒆 "𝒏𝒐" 𝒍𝒊𝒌𝒉𝒂𝒏)`,threadID, (err, info) => {
        		return global.client.handleReply.push({ 
        			type: 'create',
        			name: 'fbcover',
        			author: senderID,
        			characters: handleReply.characters,
                    subname: handleReply.subname,
                    number: handleReply.number,
                    address: handleReply.address,
                    email: event.body,
                    name_s: handleReply.name_s,
        			messageID: info.messageID
        		})
        	}, messageID)
        }
        
        case "create": {
            var char = handleReply.characters;
            var name = handleReply.name_s;
            var subname = handleReply.subname;
            var number = handleReply.number;
            var address = handleReply.address;
            var email = handleReply.email;
            var uid = event.senderID;
            var color = event.body;
            
            api.unsendMessage(handleReply.messageID);
            api.sendMessage(`𝑰𝒏𝒊𝒕𝒊𝒂𝒍𝒊𝒛𝒊𝒏𝒈...`,threadID, (err, info) => {
                setTimeout(() => {
            	    api.unsendMessage(info.messageID);
            	    var callback = () => api.sendMessage({
            	        body: `𝑺𝒆𝒏𝒅𝒆𝒓 𝑵𝒂𝒎𝒆: ${nameSender}\n𝑵𝒂𝒎𝒆: ${name}\n𝑺𝒖𝒃 𝑵𝒂𝒎𝒆: ${subname}\n𝑰𝑫: ${uid}\n𝑪𝒐𝒍𝒐𝒓: ${color}\n𝑨𝒅𝒅𝒓𝒆𝒔𝒔: ${address}\n𝑬𝒎𝒂𝒊𝒍: ${email}\n𝑷𝒉𝒐𝒏𝒆: ${number}`,
            	        mentions: arraytag,
            	        attachment: fs.createReadStream(__dirname + "/cache/fbcover.png")
            	    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/fbcover.png"), event.messageID);
                    
                    return request(encodeURI(`https://api.phamvandien.xyz/fbcover/v1?name=${name}&uid=${uid}&address=${address}&email=${email}&subname=${subname}&sdt=${number}&color=${color}&apikey=KeyTest`))
                        .pipe(fs.createWriteStream(__dirname + '/cache/fbcover.png'))
                        .on('close', () => callback());
                }, 1000);
            }, messageID);
        }
    }
}
