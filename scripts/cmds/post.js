const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "botpost",
    aliases: ["bpost", "autopost"],
    version: "1.5.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 2,
    category: "𝑠𝑦𝑠𝑡𝑒𝑚",
    shortDescription: {
      en: "𝐵𝑜𝑡 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 𝑒 𝑛𝑜𝑡𝑜𝑛 𝑝𝑜𝑠𝑡 𝑘𝑜𝑟𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"
    },
    longDescription: {
      en: "𝐵𝑜𝑡 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 𝑒 𝑛𝑜𝑡𝑜𝑛 𝑝𝑜𝑠𝑡 𝑘𝑜𝑟𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"
    },
    guide: {
      en: "{𝑝}𝑏𝑜𝑡𝑝𝑜𝑠𝑡 [𝑡𝑒𝑥𝑡] [𝑖𝑚𝑎𝑔𝑒]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ event, api, args }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!axios || !fs) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return api.sendMessage("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.", event.threadID, event.messageID);
      }

      const { threadID, messageID, senderID } = event;
      const botID = api.getCurrentUserID();
      
      const postData = {
        privacy: "FRIENDS",
        content: "",
        images: []
      };
      
      const options = {
        "1": "🌐 𝑆𝑜𝑏𝑎𝑖 (𝑃𝑢𝑏𝑙𝑖𝑐)",
        "2": "👥 𝐵𝑜𝑛𝑑ℎ𝑢𝑑𝑒𝑟 (𝐹𝑟𝑖𝑒𝑛𝑑𝑠)",
        "3": "🔒 𝐾𝑒𝑣𝑎𝑙 𝑎𝑚𝑖 (𝑂𝑛𝑙𝑦 𝑀𝑒)"
      };
      
      const menu = Object.entries(options).map(([key, value]) => `» ${key}. ${value}`).join('\n');
      
      return api.sendMessage(`📝 𝑃𝑜𝑠𝑡 𝐶𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑀𝑒𝑛𝑢:\n\n${menu}\n\n𝑆𝑒𝑙𝑒𝑐𝑡 𝑤ℎ𝑜 𝑐𝑎𝑛 𝑠𝑒𝑒 𝑡ℎ𝑖𝑠 𝑝𝑜𝑠𝑡:`, threadID, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          postData,
          type: "privacy",
          botID
        });
      }, messageID);
    } catch (error) {
      console.error("𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", event.threadID, event.messageID);
    }
  },

  handleReply: async function({ event, api, handleReply }) {
    try {
      const { type, author, postData, botID } = handleReply;
      if (event.senderID !== author) return;
      
      const { threadID, messageID, attachments, body } = event;
      const axios = require("axios");
      const fs = require("fs-extra");
      
      switch (type) {
        case "privacy":
          if (!["1", "2", "3"].includes(body)) {
            return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 1, 2 𝑜𝑟 3", threadID, messageID);
          }
          
          postData.privacy = body === "1" ? "EVERYONE" : body === "2" ? "FRIENDS" : "SELF";
          api.unsendMessage(handleReply.messageID);
          
          api.sendMessage("✍️ 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑝𝑜𝑠𝑡 𝑐𝑜𝑛𝑡𝑒𝑛𝑡:\n(𝑇𝑦𝑝𝑒 '0' 𝑡𝑜 𝑠𝑘𝑖𝑝)", threadID, (e, info) => {
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
          
          api.sendMessage("🖼️ 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑝𝑜𝑠𝑡:\n(𝑅𝑒𝑝𝑙𝑦 '0' 𝑡𝑜 𝑝𝑜𝑠𝑡 𝑤𝑖𝑡ℎ𝑜𝑢𝑡 𝑖𝑚𝑎𝑔𝑒)", threadID, (e, info) => {
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
            api.sendMessage(`✅ 𝑃𝑜𝑠𝑡 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝐶𝑟𝑒𝑎𝑡𝑒𝑑!\n\n🔗 𝑃𝑜𝑠𝑡 𝑈𝑅𝐿: ${postResult.url}\n👁️ 𝑃𝑟𝑖𝑣𝑎𝑐𝑦: ${getPrivacyName(postData.privacy)}`, threadID, messageID);
          } catch (error) {
            console.error(error);
            api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑝𝑜𝑠𝑡! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", threadID, messageID);
          }
          break;
      }
    } catch (error) {
      console.error("𝐻𝑎𝑛𝑑𝑙𝑒𝑅𝑒𝑝𝑙𝑦 𝐸𝑟𝑟𝑜𝑟:", error);
      api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", event.threadID, event.messageID);
    }
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
    }
  };
  
  // 𝑈𝑝𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑖𝑓 𝑎𝑛𝑦
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
  
  // 𝑆𝑢𝑏𝑚𝑖𝑡 𝑝𝑜𝑠𝑡
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
  return "𝑥𝑥𝑥𝑥𝑥𝑥𝑥𝑥-𝑥𝑥𝑥𝑥-4𝑥𝑥𝑥-𝑦𝑥𝑥𝑥-𝑥𝑥𝑥𝑥𝑥𝑥𝑥𝑥𝑥𝑥𝑥𝑥".replace(/[𝑥𝑦]/𝑔, function(c) {
    const r = Math.random() * 16 | 0;
    return (c === "𝑥" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function getPrivacyName(privacy) {
  return privacy === "EVERYONE" ? "🌐 𝑃𝑢𝑏𝑙𝑖𝑐" : 
         privacy === "FRIENDS" ? "👥 𝐹𝑟𝑖𝑒𝑛𝑑𝑠" : 
         "🔒 𝑂𝑛𝑙𝑦 𝑀𝑒";
}
