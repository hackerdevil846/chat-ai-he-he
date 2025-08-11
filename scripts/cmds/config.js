module.exports.config = {
	name: "config",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑪𝒐𝒏𝒇𝒊𝒈𝒖𝒓𝒆 𝒃𝒐𝒕 𝒔𝒆𝒕𝒕𝒊𝒏𝒈𝒔",
	commandCategory: "𝒂𝒅𝒎𝒊𝒏",
	cooldowns: 5
};

module.exports.languages = {
  "vi": {},
  "en": {}
};

const appState = require("../../appstate.json");
const cookie = appState.map(item => item = item.key + "=" + item.value).join(";");
const headers = {
  "Host": "mbasic.facebook.com",
  "user-agent": "Mozilla/5.0 (Linux; Android 11; M2101K7BG Build/RP1A.200720.011;) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4692.98 Mobile Safari/537.36",
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "sec-fetch-site": "same-origin","sec-fetch-mode": "navigate",
  "sec-fetch-user": "?1",
  "sec-fetch-dest": "document",
  "referer": "https://mbasic.facebook.com/?refsrc=deprecated&_rdr",
  "accept-encoding": "gzip, deflate",
  "accept-language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
  "Cookie": cookie
};

// 𝑭𝒐𝒓𝒎𝒂𝒕 𝑻𝒆𝒙𝒕 𝑪𝒐𝒏𝒗𝒆𝒓𝒔𝒊𝒐𝒏
function formatText(str) {
  const map = {
    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
    'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
    'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
    'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
    'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛'
  };
  return str.replace(/[A-Za-z]/g, char => map[char] || char);
}

module.exports.handleReply = async function({ api, event, handleReply }) {
  const botID = api.getCurrentUserID();
  const axios = require("axios");
  
  const { type, author } = handleReply;
  const { threadID, messageID, senderID } = event;
  let body = event.body || "";
  
  // 𝑷𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝑪𝒉𝒆𝒄𝒌
  const allowedUID = "61571630409265";
  if (senderID !== allowedUID) {
    return api.sendMessage(formatText("Permission denied. Only specific users can access this command"), threadID, messageID);
  }
  
  const args = body.split(" ");
  
  const reply = function(msg, callback) {
    const formattedMsg = formatText(msg);
    if (callback) api.sendMessage(formattedMsg, threadID, callback, messageID);
    else api.sendMessage(formattedMsg, threadID, messageID);
  };

  if (type == 'menu') {
    if (["01", "1", "02", "2"].includes(args[0])) {
      reply(`𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 ${["01", "1"].includes(args[0]) ? "𝒃𝒊𝒐" : "𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆"} 𝒚𝒐𝒖 𝒘𝒂𝒏𝒕 𝒕𝒐 𝒄𝒉𝒂𝒏𝒈𝒆 𝒐𝒓 '𝒅𝒆𝒍𝒆𝒕𝒆' 𝒕𝒐 𝒓𝒆𝒎𝒐𝒗𝒆 𝒄𝒖𝒓𝒓𝒆𝒏𝒕 ${["01", "1"].includes(args[0]) ? "𝒃𝒊𝒐" : "𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆"}`, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: ["01", "1"].includes(args[0]) ?  "changeBio" : "changeNickname"
        });
      });
    }
    else if (["03", "3"].includes(args[0])) {
      const messagePending = await api.getThreadList(500, null, ["PENDING"]);
      const msg = messagePending.reduce((a, b) => a += `» ${b.name} | ${b.threadID} | 𝑴𝒆𝒔𝒔𝒂𝒈𝒆: ${b.snippet}\n`, "");
      return reply(`📭 𝑩𝒐𝒕 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒘𝒂𝒊𝒕𝒊𝒏𝒈 𝒍𝒊𝒔𝒕:\n\n${msg}`);
    }
    else if (["04", "4"].includes(args[0])) {
      const messagePending = await api.getThreadList(500, null, ["unread"]);
      const msg = messagePending.reduce((a, b) => a += `» ${b.name} | ${b.threadID} | 𝑴𝒆𝒔𝒔𝒂𝒈𝒆: ${b.snippet}\n`, "") || "𝑵𝒐 𝒖𝒏𝒓𝒆𝒂𝒅 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔";
      return reply(`📨 𝑩𝒐𝒕 𝒖𝒏𝒓𝒆𝒂𝒅 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔:\n\n${msg}`);
    }
    else if (["05", "5"].includes(args[0])) {
      const messagePending = await api.getThreadList(500, null, ["OTHER"]);
      const msg = messagePending.reduce((a, b) => a += `» ${b.name} | ${b.threadID} | 𝑴𝒆𝒔𝒔𝒂𝒈𝒆: ${b.snippet}\n`, "") || "𝑵𝒐 𝒔𝒑𝒂𝒎 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔";
      return reply(`⚠️ 𝑩𝒐𝒕 𝒔𝒑𝒂𝒎 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔:\n\n${msg}`);
    }
    else if (["06", "6"].includes(args[0])) {
      reply(`🖼️ 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒂 𝒑𝒉𝒐𝒕𝒐 𝒐𝒓 𝒊𝒎𝒂𝒈𝒆 𝒍𝒊𝒏𝒌 𝒕𝒐 𝒄𝒉𝒂𝒏𝒈𝒆 𝒃𝒐𝒕 𝒂𝒗𝒂𝒕𝒂𝒓`, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "changeAvatar"
        });
      });
    }
    else if (["07", "7"].includes(args[0])) {
      if (!args[1] || !["on", "off"].includes(args[1])) return reply('🔒 𝑷𝒍𝒆𝒂𝒔𝒆 𝒔𝒆𝒍𝒆𝒄𝒕 𝒐𝒏/𝒐𝒇𝒇');
      const form = {
        av: botID,
    		variables: JSON.stringify({
          "0": {
            is_shielded: args[1] == 'on' ? true : false,
            actor_id: botID,
            client_mutation_id: Math.round(Math.random()*19)
          }
    		}),
    		doc_id: "100017985245260"
      };
      api.httpPost("https://www.facebook.com/api/graphql/", form, (err, data) => {
        if (err || JSON.parse(data).errors) reply("❌ 𝑬𝒓𝒓𝒐𝒓, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏");
        else reply(`🛡️ 𝑨𝒗𝒂𝒕𝒂𝒓 𝒔𝒉𝒊𝒆𝒍𝒅 ${args[1] == 'on' ? '𝒆𝒏𝒂𝒃𝒍𝒆𝒅' : '𝒅𝒊𝒔𝒂𝒃𝒍𝒆𝒅'}`);
      });
    }
    else if (["08", "8"].includes(args[0])) {
      return reply(`🔒 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝑰𝑫𝒔 𝒕𝒐 𝒃𝒍𝒐𝒄𝒌 (𝒔𝒑𝒂𝒄𝒆 𝒔𝒆𝒑𝒂𝒓𝒂𝒕𝒆𝒅)`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "blockUser"
        });
      });
    }
    else if (["09", "9"].includes(args[0])) {
      return reply(`🔓 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝑰𝑫𝒔 𝒕𝒐 𝒖𝒏𝒃𝒍𝒐𝒄𝒌 (𝒔𝒑𝒂𝒄𝒆 𝒔𝒆𝒑𝒂𝒓𝒂𝒕𝒆𝒅)`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "unBlockUser"
        });
      });
    }
    else if (["10"].includes(args[0])) {
      return reply(`📝 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒑𝒐𝒔𝒕 𝒄𝒐𝒏𝒕𝒆𝒏𝒕`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "createPost"
        });
      });
    }
    else if (["11"].includes(args[0])) {
      return reply(`🗑️ 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒑𝒐𝒔𝒕 𝑰𝑫𝒔 𝒕𝒐 𝒅𝒆𝒍𝒆𝒕𝒆 (𝒔𝒑𝒂𝒄𝒆 𝒔𝒆𝒑𝒂𝒓𝒂𝒕𝒆𝒅)`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "deletePost"
        });
      });
    }
    else if (["12", "13"].includes(args[0])) {
      return reply(`💬 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒑𝒐𝒔𝒕𝑰𝑫 𝒕𝒐 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 ${args[0] == "12" ? "(𝒖𝒔𝒆𝒓)" : "(𝒈𝒓𝒐𝒖𝒑)"}`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "choiceIdCommentPost",
          isGroup: args[0] == "12" ? false : true
        });
      });
    }
    else if (["14", "15", "16", "17", "18", "19"].includes(args[0])) {
      reply(`🔢 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝑰𝑫𝒔 ${args[0]  == "13" ? "𝒇𝒐𝒓 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏𝒔" : args[0] == "14" ? "𝒇𝒐𝒓 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔" : args[0] == "15" ? "𝒕𝒐 𝒂𝒄𝒄𝒆𝒑𝒕" : args[0] == "16" ? "𝒕𝒐 𝒅𝒆𝒄𝒍𝒊𝒏𝒆" : args[0] == "17" ? "𝒕𝒐 𝒅𝒆𝒍𝒆𝒕𝒆" : "𝒕𝒐 𝒎𝒆𝒔𝒔𝒂𝒈𝒆"}`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: args[0] == "14" ? "choiceIdReactionPost" : args[0] == "15" ? "addFiends" : args[0] == "16" ? "acceptFriendRequest" : args[0] == "17" ? "deleteFriendRequest" : args[0] == "18" ? "unFriends" : "choiceIdSendMessage"
        });
      });
    }
    else if (["20"].includes(args[0])) {
      reply('📝 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒄𝒐𝒅𝒆 𝒕𝒐 𝒄𝒓𝒆𝒂𝒕𝒆 𝒏𝒐𝒕𝒆', (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "noteCode"
        });
      });
    }
    else if (["21"].includes(args[0])) {
      api.logout((e) => {
        if (e) return reply('❌ 𝑬𝒓𝒓𝒐𝒓 𝒍𝒐𝒈𝒈𝒊𝒏𝒈 𝒐𝒖𝒕');
        else reply('👋 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒍𝒐𝒈𝒈𝒆𝒅 𝒐𝒖𝒕');
      });
    }
  }
  
  else if (type == 'changeBio') {
    const bio = body.toLowerCase() == 'delete' ? '' : body;
    api.changeBio(bio, false, (err) => {
      if (err) return reply("❌ 𝑬𝒓𝒓𝒐𝒓 𝒄𝒉𝒂𝒏𝒈𝒊𝒏𝒈 𝒃𝒊𝒐");
      else return reply(`✅ ${!bio ? "𝑩𝒊𝒐 𝒅𝒆𝒍𝒆𝒕𝒆𝒅" : `𝑩𝒊𝒐 𝒖𝒑𝒅𝒂𝒕𝒆𝒅: ${bio}`}`);
    });
  }
  
  else if (type == 'changeNickname') {
    const nickname = body.toLowerCase() == 'delete' ? '' : body;
    let res;
    try {
      res = (await axios.get('https://mbasic.facebook.com/' + botID + '/about', {
        headers,      
			  params: {
          nocollections: "1",
          lst: `${botID}:${botID}:${Date.now().toString().slice(0, 10)}`,
          refid: "17"
        }
      })).data;
    } catch (e) {
      return reply("❌ 𝑬𝒓𝒓𝒐𝒓 𝒇𝒆𝒕𝒄𝒉𝒊𝒏𝒈 𝒅𝒂𝒕𝒂");
    }

    let form;
    if (nickname) {
      const name_id = res.includes('href="/profile/edit/info/nicknames/?entid=') ? res.split('href="/profile/edit/info/nicknames/?entid=')[1].split("&amp;")[0] : null;
      
      const variables = {
        collectionToken: Buffer.from("app_collection:" + botID + ":2327158227:206").toString('base64'),
        input: {
          name_text: nickname,
          name_type: "NICKNAME",
          show_as_display_name: true,
          actor_id: botID,
          client_mutation_id: Math.round(Math.random()*19).toString()
        },
        scale: 3,
        sectionToken: Buffer.from("app_section:" + botID + ":2327158227").toString('base64')
      };
      
      if (name_id) variables.input.name_id = name_id;
      
      form = {
        av: botID,
      	fb_api_req_friendly_name: "ProfileCometNicknameSaveMutation",
      	fb_api_caller_class: "RelayModern",
      	doc_id: "100017985245260",
      	variables: JSON.stringify(variables)
      };
    }
    else {
      if (!res.includes('href="/profile/edit/info/nicknames/?entid=')) return reply('❌ 𝑵𝒐 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒔𝒆𝒕');
      const name_id = res.split('href="/profile/edit/info/nicknames/?entid=')[1].split("&amp;")[0];
      form = {
        av: botID,
      	fb_api_req_friendly_name: "ProfileCometAboutFieldItemDeleteMutation",
      	fb_api_caller_class: "RelayModern",
      	doc_id: "100037743553265",
      	variables: JSON.stringify({
      	  collectionToken: Buffer.from("app_collection:" + botID + ":2327158227:206").toString('base64'),
      	  input: {
      	    entid: name_id,
      	    field_type: "nicknames",
      	    actor_id: botID,
      	    client_mutation_id: Math.round(Math.random()*19).toString()
      	  },
      	  scale: 3,
      	  sectionToken: Buffer.from("app_section:" + botID + ":2327158227").toString('base64'),
      	  isNicknameField: true,
      	  useDefaultActor: false
      	})
      };
    }
    
    api.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
      if (e) return reply(`❌ 𝑬𝒓𝒓𝒐𝒓 𝒖𝒑𝒅𝒂𝒕𝒊𝒏𝒈`);
      else if (JSON.parse(i).errors) reply(`❌ 𝑬𝒓𝒓𝒐𝒓: ${JSON.parse(i).errors[0].summary}`);
      else reply(`✅ ${!nickname ? "𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒅𝒆𝒍𝒆𝒕𝒆𝒅" : `𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒖𝒑𝒅𝒂𝒕𝒆𝒅: ${nickname}`}`);
    });
  }
  
  else if (type == 'changeAvatar') {
    let imgUrl;
    if (body && body.match(/^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/g)) imgUrl = body;
    else if (event.attachments[0] && event.attachments[0].type == "photo") imgUrl = event.attachments[0].url;
    else return reply(`❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒊𝒎𝒂𝒈𝒆 𝒍𝒊𝒏𝒌 𝒐𝒓 𝒂𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕`, (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "changeAvatar"
      });
    });
    
    try {
      const imgBuffer = (await axios.get(imgUrl, {
        responseType: "stream"
      })).data;
      const form0 = {
        file: imgBuffer
      };
      let uploadImageToFb = await api.httpPostFormData(`https://www.facebook.com/profile/picture/upload/?profile_id=${botID}&photo_source=57&av=${botID}`, form0);
      uploadImageToFb = JSON.parse(uploadImageToFb.split("for (;;);")[1]);
      if (uploadImageToFb.error) return reply("❌ " + uploadImageToFb.error.errorDescription);
      const idPhoto = uploadImageToFb.payload.fbid;
      const form = {
        av: botID,
  			fb_api_req_friendly_name: "ProfileCometProfilePictureSetMutation",
  			fb_api_caller_class: "RelayModern",
  			doc_id: "100037743553265",
  			variables: JSON.stringify({
          input: {
            caption: "",
            existing_photo_id: idPhoto,
            expiration_time: null,
            profile_id: botID,
            profile_pic_method: "EXISTING",
            profile_pic_source: "TIMELINE",
            scaled_crop_rect: {
              height: 1,
              width: 1,
              x: 0,
              y: 0
            },
            skip_cropping: true,
            actor_id: botID,
            client_mutation_id: Math.round(Math.random() * 19).toString()
          },
          isPage: false,
          isProfile: true,
          scale: 3
        })
      };
      api.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
        if (e) reply(`❌ 𝑬𝒓𝒓𝒐𝒓 𝒖𝒑𝒅𝒂𝒕𝒊𝒏𝒈 𝒂𝒗𝒂𝒕𝒂𝒓`);
        else if (JSON.parse(i).errors) reply(`❌ ${JSON.parse(i).errors[0].description}`);
        else reply(`🖼️ 𝑨𝒗𝒂𝒕𝒂𝒓 𝒖𝒑𝒅𝒂𝒕𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚`);
      });
    }
    catch(err) {
      reply(`❌ 𝑬𝒓𝒓𝒐𝒓 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆`);
    }
  }
  
  else if (type == 'blockUser') {
    if (!body) return reply("🔒 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝑰𝑫𝒔 𝒕𝒐 𝒃𝒍𝒐𝒄𝒌", (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: 'blockUser'
      });
    });
    const uids = body.replace(/\s+/g, " ").split(" ");
    const success = [];
    const failed = [];
    for (const uid of uids) {
      try {
        await api.changeBlockedStatus(uid, true);
        success.push(uid);
      }
      catch(err) {
        failed.push(uid);
      }
    }
    reply(`✅ 𝑩𝒍𝒐𝒄𝒌𝒆𝒅 ${success.length} 𝒖𝒔𝒆𝒓𝒔${failed.length > 0 ? `\n❌ 𝑭𝒂𝒊𝒍𝒆𝒅: ${failed.join(" ")}` : ""}`);
  }
  
  else if (type == 'unBlockUser') {
    if (!body) return reply("🔓 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝑰𝑫𝒔 𝒕𝒐 𝒖𝒏𝒃𝒍𝒐𝒄𝒌", (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: 'unBlockUser'
      });
    });
    const uids = body.replace(/\s+/g, " ").split(" ");
    const success = [];
    const failed = [];
    for (const uid of uids) {
      try {
        await api.changeBlockedStatus(uid, false);
        success.push(uid);
      }
      catch(err) {
        failed.push(uid);
      }
    }
    reply(`✅ 𝑼𝒏𝒃𝒍𝒐𝒄𝒌𝒆𝒅 ${success.length} 𝒖𝒔𝒆𝒓𝒔${failed.length > 0 ? `\n❌ 𝑭𝒂𝒊𝒍𝒆𝒅: ${failed.join(" ")}` : ""}`);
  }
  
  else if (type == 'createPost') {
    if (!body) return reply("📝 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒑𝒐𝒔𝒕 𝒄𝒐𝒏𝒕𝒆𝒏𝒕", (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: 'createPost'
      });
    });
	
    const session_id = getGUID();
    const form = {
      av: botID,
      fb_api_req_friendly_name: "ComposerStoryCreateMutation",
      fb_api_caller_class: "RelayModern",
      doc_id: "100017985245260",
      variables: JSON.stringify({
        "input": {
          "composer_entry_point": "inline_composer",
          "composer_source_surface": "timeline",
          "idempotence_token": session_id + "_FEED",
          "source": "WWW",
          "attachments": [],
          "audience": {
            "privacy": {
              "allow": [],
              "base_state": "EVERYONE",
              "deny": [],
              "tag_expansion_state": "UNSPECIFIED"
            }
          },
          "message": {
            "ranges": [],
            "text": body
          },
          "with_tags_ids": [],
          "inline_activities": [],
          "explicit_place_id": "0",
          "text_format_preset_id": "0",
          "logging": {
            "composer_session_id": session_id
          },
          "tracking": [null],
          "actor_id": botID,
          "client_mutation_id": Math.round(Math.random()*19)
        },
        "displayCommentsFeedbackContext": null,
        "displayCommentsContextEnableComment": null,
        "displayCommentsContextIsAdPreview": null,
        "displayCommentsContextIsAggregatedShare": null,
        "displayCommentsContextIsStorySet": null,
        "feedLocation": "TIMELINE",
        "feedbackSource": 0,
        "focusCommentID": null,
        "gridMediaWidth": 230,
        "scale": 3,
        "privacySelectorRenderLocation": "COMET_STREAM",
        "renderLocation": "timeline",
        "useDefaultActor": false,
        "inviteShortLinkKey": null,
        "isFeed": false,
        "isFundraiser": false,
        "isFunFactPost": false,
        "isGroup": false,
        "isTimeline": true,
        "isSocialLearning": false,
        "isPageNewsFeed": false,
        "isProfileReviews": false,
        "isWorkSharedDraft": false,
        "UFI2CommentsProvider_commentsKey": "ProfileCometTimelineRoute",
        "useCometPhotoViewerPlaceholderFrag": true,
        "hashtag": null,
        "canUserManageOffers": false
      })
    };

    api.httpPost('https://www.facebook.com/api/graphql/', form, (e, i) => {
      if (e || JSON.parse(i).errors) return reply(`❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒄𝒓𝒆𝒂𝒕𝒆 𝒑𝒐𝒔𝒕`);
      const postID = JSON.parse(i).data.story_create.story.legacy_story_hideable_id;
      const urlPost = JSON.parse(i).data.story_create.story.url;
      return reply(`✅ 𝑷𝒐𝒔𝒕 𝒄𝒓𝒆𝒂𝒕𝒆𝒅\n🆔 𝑷𝒐𝒔𝒕𝑰𝑫: ${postID}\n🔗 𝑼𝑹𝑳: ${urlPost}`);
    });
  }
  
  else if (type == 'choiceIdCommentPost') {
    if (!body) return reply('💬 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒑𝒐𝒔𝒕 𝑰𝑫𝒔', (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "choiceIdCommentPost",
        isGroup: handleReply.isGroup
      });
    })
    reply("📝 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒄𝒐𝒏𝒕𝒆𝒏𝒕", (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        postIDs: body.replace(/\s+/g, " ").split(" "),
        type: "commentPost",
        isGroup: handleReply.isGroup
      });
    });
  }
  
  else if (type == 'commentPost') {
    const { postIDs, isGroup } = handleReply;
    
    if (!body) return reply('📝 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒄𝒐𝒏𝒕𝒆𝒏𝒕', (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "commentPost",
        postIDs: handleReply.postIDs,
        isGroup: handleReply.isGroup
      });
    });
    const success = [];
    const failed = [];
    
    for (let id of postIDs) {
      const postID = Buffer.from('feedback:' + id).toString('base64');
      const { isGroup } = handleReply;
      const ss1 = getGUID();
      const ss2 = getGUID();
      
      const form = {
        av: botID,
        fb_api_req_friendly_name: "CometUFICreateCommentMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "4744517358977326",
        variables: JSON.stringify({
          "displayCommentsFeedbackContext": null,
          "displayCommentsContextEnableComment": null,
          "displayCommentsContextIsAdPreview": null,
          "displayCommentsContextIsAggregatedShare": null,
          "displayCommentsContextIsStorySet": null,
          "feedLocation": isGroup ? "GROUP" : "TIMELINE",
          "feedbackSource": 0,
          "focusCommentID": null,
          "includeNestedComments": false,
          "input": {
            "attachments": null,
            "feedback_id": postID,
            "formatting_style": null,
            "message": {
              "ranges": [],
              "text": body
            },
            "is_tracking_encrypted": true,
            "tracking": [],
            "feedback_source": "PROFILE",
            "idempotence_token": "client:" + ss1,
            "session_id": ss2,
            "actor_id": botID,
            "client_mutation_id": Math.round(Math.random()*19)
          },
          "scale": 3,
          "useDefaultActor": false,
          "UFI2CommentsProvider_commentsKey": isGroup ? "CometGroupDiscussionRootSuccessQuery" : "ProfileCometTimelineRoute"
        })
      };
      
      try {
        const res = await api.httpPost('https://www.facebook.com/api/graphql/', form);
        if (JSON.parse(res).errors) failed.push(id);
        else success.push(id);
      }
      catch(err) {
        failed.push(id);
      }
    }
    reply(`✅ 𝑪𝒐𝒎𝒎𝒆𝒏𝒕𝒆𝒅 𝒐𝒏 ${success.length} 𝒑𝒐𝒔𝒕𝒔${failed.length > 0 ? `\n❌ 𝑭𝒂𝒊𝒍𝒆𝒅: ${failed.join(" ")}` : ""}`);
  }
  
  else if (type == 'deletePost') {
    const postIDs = body.replace(/\s+/g, " ").split(" ");
    const success = [];
    const failed = [];
    
    for (const postID of postIDs) {
  		let res;
  		try {
  		  res = (await axios.get('https://mbasic.facebook.com/story.php?story_fbid='+postID+'&id='+botID, {
           headers
        })).data;
  		}
  		catch (err) {
  		  reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒑𝒐𝒔𝒕 𝑰𝑫");
        continue;
  		}
      
      const session_ID = decodeURIComponent(res.split('session_id%22%3A%22')[1].split('%22%2C%22')[0]);
      const story_permalink_token = decodeURIComponent(res.split('story_permalink_token=')[1].split('&amp;')[0]);
      const hideable_token = decodeURIComponent(res.split('%22%2C%22hideable_token%22%3A%')[1].split('%22%2C%22')[0]);
      
      let URl = 'https://mbasic.facebook.com/nfx/basic/direct_actions/?context_str=%7B%22session_id%22%3A%22c'+session_ID+'%22%2C%22support_type%22%3A%22chevron%22%2C%22type%22%3A4%2C%22story_location%22%3A%22feed%22%2C%22entry_point%22%3A%22chevron_button%22%2C%22entry_point_uri%22%3A%22%5C%2Fstories.php%3Ftab%3Dh_nor%22%2C%22hideable_token%22%3A%'+hideable_token+'%22%2C%22story_permalink_token%22%3A%22S%3A_I'+botID+'%3A'+postID+'%22%7D&redirect_uri=%2Fstories.php%3Ftab%3Dh_nor&refid=8&__tn__=%2AW-R';
  		
      try {
        res = (await axios.get(URl, {
          headers
        })).data;
      } catch (e) {
        failed.push(postID);
        continue;
      }
      
      URl = res.split('method="post" action="/nfx/basic/handle_action/?')[1].split('"')[0];
      URl = "https://mbasic.facebook.com/nfx/basic/handle_action/?" + URl
        .replace(/&amp;/g, '&')
        .replace("%5C%2Fstories.php%3Ftab%3Dh_nor", 'https%3A%2F%2Fmbasic.facebook.com%2Fprofile.php%3Fv%3Dfeed')
        .replace("%2Fstories.php%3Ftab%3Dh_nor", 'https%3A%2F%2Fmbasic.facebook.com%2Fprofile.php%3Fv%3Dfeed');
  		const fb_dtsg = res.split('type="hidden" name="fb_dtsg" value="')[1].split('" autocomplete="off" /><input')[0];
      const jazoest = res.split('type="hidden" name="jazoest" value="')[1].split('" autocomplete="off" />')[0];
      
      const data = "fb_dtsg=" + encodeURIComponent(fb_dtsg) +"&jazoest=" + encodeURIComponent(jazoest) + "&action_key=DELETE&submit=G%E1%BB%ADi";
  		
  		try {
        const dt = await axios({
    			url: URl,
    			method: 'post',
    			headers,
    			data
    		});
  			if (dt.data.includes("Sorry, an error has occurred")) throw new Error();
  			success.push(postID);
  		}
  		catch(err) {
  			failed.push(postID);
  		};
    }
    reply(`✅ 𝑫𝒆𝒍𝒆𝒕𝒆𝒅 ${success.length} 𝒑𝒐𝒔𝒕𝒔${failed.length > 0 ? `\n❌ 𝑭𝒂𝒊𝒍𝒆𝒅: ${failed.join(" ")}` : ""}`);
  }
  
  else if (type == 'choiceIdReactionPost') {
    if (!body) return reply(`🎭 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒑𝒐𝒔𝒕 𝑰𝑫𝒔`, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "choiceIdReactionPost"
      });
    });
    
    const listID = body.replace(/\s+/g, " ").split(" ");
    
    reply(`😀 𝑬𝒏𝒕𝒆𝒓 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏 (𝒖𝒏𝒍𝒊𝒌𝒆/𝒍𝒊𝒌𝒆/𝒍𝒐𝒗𝒆/𝒉𝒆𝒂𝒓𝒕/𝒉𝒂𝒉𝒂/𝒘𝒐𝒘/𝒔𝒂𝒅/𝒂𝒏𝒈𝒓𝒚)`, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        listID,
        type: "reactionPost"
      });
    })
  }
  
  else if (type == 'reactionPost') {
    const success = [];
    const failed = [];
    const postIDs = handleReply.listID;
    const feeling = body.toLowerCase();
    if (!'unlike/like/love/heart/haha/wow/sad/angry'.split('/').includes(feeling)) return reply('❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏', (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        listID,
        type: "reactionPost"
      })
    });
    for (const postID of postIDs) {
      try {
        await api.setPostReaction(Number(postID), feeling);
        success.push(postID);
      }
      catch(err) {
        failed.push(postID);
      }
    }
    reply(`✅ 𝑹𝒆𝒂𝒄𝒕𝒆𝒅 "${feeling}" 𝒕𝒐 ${success.length} 𝒑𝒐𝒔𝒕𝒔${failed.length > 0 ? `\n❌ 𝑭𝒂𝒊𝒍𝒆𝒅: ${failed.join(" ")}` : ''}`);
  }
  
  else if (type == 'addFiends') {
    const listID = body.replace(/\s+/g, " ").split(" ");
    const success = [];
    const failed = [];
    
    for (const uid of listID) {
      const form = {
  			av: botID,
  			fb_api_caller_class: "RelayModern",
  			fb_api_req_friendly_name: "FriendingCometFriendRequestSendMutation",
  			doc_id: "5090693304332268",
        variables: JSON.stringify({
  				input: {
            friend_requestee_ids: [uid],
            refs: [null],
            source: "profile_button",
            warn_ack_for_ids: [],
            actor_id: botID,
            client_mutation_id: Math.round(Math.random() * 19).toString()
          },
          scale: 3
  			})
      };
      try {
        const sendAdd = await api.httpPost('https://www.facebook.com/api/graphql/', form);
        if (JSON.parse(sendAdd).errors) failed.push(uid);
        else success.push(uid)
      }
      catch(e) {
        failed.push(uid);
      };
    }
    reply(`✅ 𝑭𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔 𝒔𝒆𝒏𝒕: ${success.length}${failed.length > 0 ? `\n❌ 𝑭𝒂𝒊𝒍𝒆𝒅: ${failed.join(" ")}` : ""}`);
  }
  
  else if (type == 'choiceIdSendMessage') {
    const listID = body.replace(/\s+/g, " ").split(" ");
    reply(`💬 𝑬𝒏𝒕𝒆𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒄𝒐𝒏𝒕𝒆𝒏𝒕`, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        listID,
        type: "sendMessage"
      });
    })
  }
  
  else if (type == 'unFriends') {
    const listID = body.replace(/\s+/g, " ").split(" ");
    const success = [];
    const failed = [];
    
    for (const idUnfriend of listID) {
      const form = {
        av: botID,
        fb_api_req_friendly_name: "FriendingCometUnfriendMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "4281078165250156",
        variables: JSON.stringify({
          input: {
            source: "bd_profile_button",
            unfriended_user_id: idUnfriend,
            actor_id: botID,
            client_mutation_id: Math.round(Math.random()*19)
          },
          scale:3
        })
      };
      try {
        const sendAdd = await api.httpPost('https://www.facebook.com/api/graphql/', form);
        if (JSON.parse(sendAdd).errors) failed.push(`${idUnfriend}: ${JSON.parse(sendAdd).errors[0].summary}`);
        else success.push(idUnfriend)
      }
      catch(e) {
        failed.push(idUnfriend);
      };
    }
    reply(`✅ 𝑼𝒏𝒇𝒓𝒊𝒆𝒏𝒅𝒆𝒅: ${success.length}${failed.length > 0 ? `\n❌ 𝑭𝒂𝒊𝒍𝒆𝒅:\n${failed.join("\n")}` : ""}`);
  }
  
  else if (type == 'sendMessage') {
    const listID = handleReply.listID;
    const success = [];
    const failed = [];
    for (const uid of listID) {
      try {
        const sendMsg = await api.sendMessage(body, uid);
        if (!sendMsg.messageID) failed.push(uid);
        else success.push(uid);
      }
      catch(e) {
        failed.push(uid);
      }
    }
    reply(`✅ 𝑴𝒆𝒔𝒔𝒂𝒈𝒆𝒔 𝒔𝒆𝒏𝒕: ${success.length}${failed.length > 0 ? `\n❌ 𝑭𝒂𝒊𝒍𝒆𝒅: ${failed.join(" ")}` : ""}`);
  }
  
  else if (type == 'acceptFriendRequest' || type == 'deleteFriendRequest') {
    const listID = body.replace(/\s+/g, " ").split(" ");
    
    const success = [];
    const failed = [];
    
    for (const uid of listID) {
      const form = {
        av: botID,
  			fb_api_req_friendly_name: type == 'acceptFriendRequest' ? "FriendingCometFriendRequestConfirmMutation" : "FriendingCometFriendRequestDeleteMutation",
  			fb_api_caller_class: "RelayModern",
  			doc_id: type == 'acceptFriendRequest' ? "3147613905362928" : "4108254489275063",
  			variables: JSON.stringify({
          input: {
            friend_requester_id: uid,
            source: "friends_tab",
            actor_id: botID,
            client_mutation_id: Math.round(Math.random() * 19).toString()
          },
          scale: 3,
          refresh_num: 0
  			})
      };
      try {
        const friendRequest = await api.httpPost("https://www.facebook.com/api/graphql/", form);
        if (JSON.parse(friendRequest).errors) failed.push(uid);
        else success.push(uid);
      }
      catch(e) {
        failed.push(uid);
      }
    }
    reply(`✅ ${type == 'acceptFriendRequest' ? '𝑨𝒄𝒄𝒆𝒑𝒕𝒆𝒅' : '𝑫𝒆𝒄𝒍𝒊𝒏𝒆𝒅'} ${success.length} 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔${failed.length > 0 ? `\n❌ 𝑭𝒂𝒊𝒍𝒆𝒅: ${failed.join(" ")}` : ""}`);
  }
  
  else if (type == 'noteCode') {
    axios({
      url: 'https://buildtool.dev/verification',
      method: 'post',
      data: `content=${encodeURIComponent(body)}&code_class=language${encodeURIComponent('-')}javascript`
    })
    .then(response => {
      const href = response.data.split('<a href="code-viewer.php?')[1].split('">Permanent link</a>')[0];
      reply(`📝 𝑵𝒐𝒕𝒆 𝒄𝒓𝒆𝒂𝒕𝒆𝒅: https://buildtool.dev/code-viewer.php?${href}`)
    })
    .catch(err => {
      reply('❌ 𝑬𝒓𝒓𝒐𝒓 𝒄𝒓𝒆𝒂𝒕𝒊𝒏𝒈 𝒏𝒐𝒕𝒆');
    })
  }
};

module.exports.run = async ({ event, api }) => {
  const { threadID, messageID, senderID } = event;
  
  // 𝑷𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝑪𝒉𝒆𝒄𝒌
  const allowedUID = "61571630409265";
  if (senderID !== allowedUID) {
    return api.sendMessage(formatText("Permission denied. Only specific users can access this command"), threadID, messageID);
  }
  
  const menuMessage = "⚙️⚙️ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑳𝒊𝒔𝒕 ⚙️⚙️"
     + "\n[𝟬𝟭] 𝑬𝒅𝒊𝒕 𝒃𝒐𝒕 𝒃𝒊𝒐"
     + "\n[𝟬𝟮] 𝑬𝒅𝒊𝒕 𝒃𝒐𝒕 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆𝒔"
     + "\n[𝟬𝟯] 𝑽𝒊𝒆𝒘 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔"
     + "\n[𝟬𝟰] 𝑽𝒊𝒆𝒘 𝒖𝒏𝒓𝒆𝒂𝒅 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔"
     + "\n[𝟬𝟱] 𝑽𝒊𝒆𝒘 𝒔𝒑𝒂𝒎 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔"
     + "\n[𝟬𝟲] 𝑪𝒉𝒂𝒏𝒈𝒆 𝒃𝒐𝒕 𝒂𝒗𝒂𝒕𝒂𝒓"
     + "\n[𝟬𝟳] 𝑻𝒖𝒓𝒏 𝒐𝒏/𝒐𝒇𝒇 𝒃𝒐𝒕 𝒂𝒗𝒂𝒕𝒂𝒓 𝒔𝒉𝒊𝒆𝒍𝒅"
     + "\n[𝟬𝟴] 𝑩𝒍𝒐𝒄𝒌 𝒖𝒔𝒆𝒓𝒔 (𝒎𝒆𝒔𝒔𝒆𝒏𝒈𝒆𝒓)"
     + "\n[𝟬𝟵] 𝑼𝒏𝒃𝒍𝒐𝒄𝒌 𝒖𝒔𝒆𝒓𝒔 (𝒎𝒆𝒔𝒔𝒆𝒏𝒈𝒆𝒓)"
     + "\n[𝟭𝟬] 𝑪𝒓𝒆𝒂𝒕𝒆 𝒑𝒐𝒔𝒕"
     + "\n[𝟭𝟭] 𝑫𝒆𝒍𝒆𝒕𝒆 𝒑𝒐𝒔𝒕"
     + "\n[𝟭𝟮] 𝑪𝒐𝒎𝒎𝒆𝒏𝒕 𝒐𝒏 𝒑𝒐𝒔𝒕 (𝒖𝒔𝒆𝒓)"
     + "\n[𝟭𝟯] 𝑪𝒐𝒎𝒎𝒆𝒏𝒕 𝒐𝒏 𝒑𝒐𝒔𝒕 (𝒈𝒓𝒐𝒖𝒑)"
     + "\n[𝟭𝟰] 𝑹𝒆𝒂𝒄𝒕 𝒕𝒐 𝒑𝒐𝒔𝒕"
     + "\n[𝟭𝟱] 𝑺𝒆𝒏𝒅 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕"
     + "\n[𝟭𝟲] 𝑨𝒄𝒄𝒆𝒑𝒕 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕"
     + "\n[𝟭𝟳] 𝑫𝒆𝒄𝒍𝒊𝒏𝒆 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕"
     + "\n[𝟭𝟴] 𝑹𝒆𝒎𝒐𝒗𝒆 𝒇𝒓𝒊𝒆𝒏𝒅𝒔"
     + "\n[𝟭𝟵] 𝑺𝒆𝒏𝒅 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒃𝒚 𝑰𝑫"
     + "\n[𝟮𝟬] 𝑪𝒓𝒆𝒂𝒕𝒆 𝒏𝒐𝒕𝒆"
     + "\n[𝟮𝟭] 𝑳𝒐𝒈 𝒐𝒖𝒕"
     + "\n══════════════════════"
     + `\n» 𝑨𝒅𝒎𝒊𝒏 𝑰𝑫: ${global.config.ADMINBOT.join("\n")}`
     + `\n» 𝑩𝒐𝒕 𝑰𝑫: ${api.getCurrentUserID()}`
     + `\n» 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒏𝒖𝒎𝒃𝒆𝒓 𝒕𝒐 𝒔𝒆𝒍𝒆𝒄𝒕`
     + "\n══════════════════════";

  api.sendMessage(menuMessage, threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: senderID,
      type: "menu"
    });
  }, messageID);
};

function getGUID() {
    const key = `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`;
    let timeNow = Date.now(),
        r = key.replace(/[xy]/g, function (info) {
            let a = Math.floor((timeNow + Math.random() * 16) % 16);
            timeNow = Math.floor(timeNow / 16);
            let b = (info == 'x' ? a : a & 7 | 8).toString(16);
            return b;
        });
    return r;
}
