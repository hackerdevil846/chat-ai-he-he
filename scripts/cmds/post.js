module.exports.config = {
	name: "post",
	version: "1.5.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑩𝒐𝒕 𝒆𝒓 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒆 𝒏𝒐𝒕𝒐𝒏 𝒑𝒐𝒔𝒕 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒄𝒐𝒎𝒎𝒂𝒏𝒅",
	category: "𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "[text] [image]",
	cooldowns: 10,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.run = async ({ event, api, args }) => {
  const { threadID, messageID, senderID } = event;
  const botID = api.getCurrentUserID();
  
  const postData = {
    privacy: "FRIENDS",
    content: "",
    images: []
  };
  
  const options = {
    "1": "🌐 𝑺𝒐𝒃𝒂𝒊 (Public)",
    "2": "👥 𝑩𝒐𝒏𝒅𝒉𝒖𝒅𝒆𝒓 (Friends)",
    "3": "🔒 𝑲𝒆𝒗𝒂𝒍 𝒂𝒎𝒊 (Only Me)"
  };
  
  const menu = Object.entries(options).map(([key, value]) => `» ${key}. ${value}`).join('\n');
  
  return api.sendMessage(`📝 𝑷𝒐𝒔𝒕 𝑪𝒓𝒆𝒂𝒕𝒊𝒐𝒏 𝑴𝒆𝒏𝒖:\n\n${menu}\n\n𝑺𝒆𝒍𝒆𝒄𝒕 𝒘𝒉𝒐 𝒄𝒂𝒏 𝒔𝒆𝒆 𝒕𝒉𝒊𝒔 𝒑𝒐𝒔𝒕:`, threadID, (e, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: senderID,
      postData,
      type: "privacy",
      botID
    });
  }, messageID);
};

module.exports.handleReply = async ({ event, api, handleReply }) => {
  const { type, author, postData, botID } = handleReply;
  if (event.senderID !== author) return;
  
  const { threadID, messageID, attachments, body } = event;
  const axios = require("axios");
  const fs = require("fs-extra");
  
  switch (type) {
    case "privacy":
      if (!["1", "2", "3"].includes(body)) {
        return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒔𝒆𝒍𝒆𝒄𝒕𝒊𝒐𝒏! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒄𝒉𝒐𝒐𝒔𝒆 1, 2 𝒐𝒓 3", threadID, messageID);
      }
      
      postData.privacy = body === "1" ? "EVERYONE" : body === "2" ? "FRIENDS" : "SELF";
      api.unsendMessage(handleReply.messageID);
      
      api.sendMessage("✍️ 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒑𝒐𝒔𝒕 𝒄𝒐𝒏𝒕𝒆𝒏𝒕:\n(𝑻𝒚𝒑𝒆 '0' 𝒕𝒐 𝒔𝒌𝒊𝒑)", threadID, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: author,
          postData,
          type: "content",
          botID
        });
      }, messageID);
      break;
      
    case "content":
      if (body !== "0") postData.content = body;
      api.unsendMessage(handleReply.messageID);
      
      api.sendMessage("🖼️ 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 𝒇𝒐𝒓 𝒕𝒉𝒆 𝒑𝒐𝒔𝒕:\n(𝑹𝒆𝒑𝒍𝒚 '0' 𝒕𝒐 𝒑𝒐𝒔𝒕 𝒘𝒊𝒕𝒉𝒐𝒖𝒕 𝒊𝒎𝒂𝒈𝒆)", threadID, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: author,
          postData,
          type: "image",
          botID
        });
      }, messageID);
      break;
      
    case "image":
      api.unsendMessage(handleReply.messageID);
      
      if (body !== "0" && attachments.length > 0) {
        try {
          const imageUrls = [];
          for (const attachment of attachments) {
            if (attachment.type === "photo") {
              imageUrls.push(attachment.url);
            }
          }
          
          if (imageUrls.length > 0) {
            postData.images = await Promise.all(imageUrls.map(async url => {
              const response = await axios.get(url, { responseType: "arraybuffer" });
              return Buffer.from(response.data);
            }));
          }
        } catch (e) {
          console.error(e);
        }
      }
      
      try {
        const postResult = await createPost(api, botID, postData);
        api.sendMessage(`✅ 𝑷𝒐𝒔𝒕 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑪𝒓𝒆𝒂𝒕𝒆𝒅!\n\n🔗 𝑷𝒐𝒔𝒕 𝑼𝑹𝑳: ${postResult.url}\n👁️ 𝑷𝒓𝒊𝒗𝒂𝒄𝒚: ${getPrivacyName(postData.privacy)}`, threadID, messageID);
      } catch (error) {
        console.error(error);
        api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒄𝒓𝒆𝒂𝒕𝒊𝒏𝒈 𝒑𝒐𝒔𝒕! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.", threadID, messageID);
      }
      break;
  }
};

async function createPost(api, botID, postData) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const uuid = getGUID();
  
  const formData = {
    "input": {
      "composer_entry_point": "inline_composer",
      "composer_source_surface": "timeline",
      "idempotence_token": uuid + "_FEED",
      "source": "WWW",
      "attachments": [],
      "audience": {
        "privacy": {
          "allow": [],
          "base_state": postData.privacy,
          "deny": [],
          "tag_expansion_state": "UNSPECIFIED"
        }
      },
      "message": {
        "ranges": [],
        "text": postData.content || ""
      },
      "with_tags_ids": [],
      "inline_activities": [],
      "explicit_place_id": "0",
      "text_format_preset_id": "0",
      "logging": {
        "composer_session_id": uuid
      },
      "tracking": [null],
      "actor_id": botID,
      "client_mutation_id": Math.floor(Math.random() * 17)
    },
    // ... (other parameters remain same as original)
  };
  
  // Upload images if any
  if (postData.images.length > 0) {
    for (const imageBuffer of postData.images) {
      const path = "./post_image.jpg";
      fs.writeFileSync(path, imageBuffer);
      
      const uploadForm = {
        file: fs.createReadStream(path)
      };
      
      const uploadRes = await api.httpPostFormData(`https://www.facebook.com/profile/picture/upload/?profile_id=${botID}&photo_source=57&av=${botID}`, uploadForm);
      formData.input.attachments.push({
        "photo": {
          "id": uploadRes.payload.fbid.toString()
        }
      });
      fs.unlinkSync(path);
    }
  }
  
  // Submit post
  const response = await api.httpPost('https://www.facebook.com/api/graphql/', {
    av: botID,
    fb_api_req_friendly_name: "ComposerStoryCreateMutation",
    fb_api_caller_class: "RelayModern",
    doc_id: "7711610262190099",
    variables: JSON.stringify(formData)
  });
  
  const data = JSON.parse(response.replace("for (;;);", ""));
  return {
    id: data.data.story_create.story.legacy_story_hideable_id,
    url: data.data.story_create.story.url
  };
}

function getGUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function getPrivacyName(privacy) {
  return privacy === "EVERYONE" ? "🌐 Public" : 
         privacy === "FRIENDS" ? "👥 Friends" : 
         "🔒 Only Me";
}
