const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "createpost",
    version: "1.0.0",
    role: 2,
    author: "Asif Mahmud",
    category: "admin",
    shortDescription: {
      en: "Create new post on bot account"
    },
    longDescription: {
      en: "Create posts on the bot's Facebook account with custom content and privacy settings"
    },
    guide: {
      en: "createpost"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ message, event }) {
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
            "base_state": "FRIENDS", // SELF EVERYONE
            "deny": [],
            "tag_expansion_state": "UNSPECIFIED"
          }
        },
        "message": {
          "ranges": [],
          "text": ""
        },
        "with_tags_ids": [],
        "inline_activities": [],
        "explicit_place_id": "0",
        "text_format_preset_id": "0",
        "logging": {
          "composer_session_id": uuid
        },
        "tracking": [
          null
        ],
        "actor_id": global.utils.botID,
        "client_mutation_id": Math.floor(Math.random() * 17)
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
      "groupID": null,
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
      "hashtag": null,
      "canUserManageOffers": false
    };

    return message.reply("Choose who can see this post:\n1. Everyone\n2. Friends\n3. Only me", (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        formData,
        type: "whoSee"
      });
    });
  },

  handleReply: async function ({ event, handleReply, message }) {
    if (event.senderID !== handleReply.author) return;
    
    const { type, formData } = handleReply;
    const { threadID, attachments, body } = event;

    async function uploadAttachments(attachments) {
      let uploads = [];
      for (const attachment of attachments) {
        const form = {
          file: attachment
        };
        uploads.push(global.utils.getStreamFromURL(attachment.url));
      }
      uploads = await Promise.all(uploads);
      return uploads;
    }

    if (type === "whoSee") {
      if (!["1", "2", "3"].includes(body)) {
        return message.reply('Please choose 1, 2, or 3 from the options above');
      }
      formData.input.audience.privacy.base_state = body === "1" ? "EVERYONE" : body === "2" ? "FRIENDS" : "SELF";
      
      message.reply("Reply to this message with the content of your post, reply 0 to leave empty", (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          formData,
          type: "content"
        });
      });
    }
    else if (type === "content") {
      if (body !== "0") formData.input.message.text = body;
      
      message.reply("Reply to this message with images (you can send multiple images), reply 0 if you don't want to post images", (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          formData,
          type: "image"
        });
      });
    }
    else if (type === "image") {
      if (body !== "0" && attachments.length > 0) {
        const allStreamFile = [];
        const pathImage = path.join(__dirname, 'cache', 'imagePost.png');
        
        for (const attach of attachments) {
          if (attach.type !== "photo") continue;
          const getFile = (await axios.get(attach.url, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(pathImage, Buffer.from(getFile));
          allStreamFile.push(fs.createReadStream(pathImage));
        }
        
        const uploadFiles = await uploadAttachments(allStreamFile);
        for (let result of uploadFiles) {
          if (typeof result === "string") {
            try {
              result = JSON.parse(result.replace("for (;;);", ""));
            } catch (e) {
              console.error("Error parsing upload result:", e);
              continue;
            }
          }
          formData.input.attachments.push({
            "photo": {
              "id": result.payload.fbid.toString(),
            }
          });
        }
      }

      const form = {
        av: global.utils.botID,
        fb_api_req_friendly_name: "ComposerStoryCreateMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "7711610262190099",
        variables: JSON.stringify(formData)
      };

      try {
        const response = await axios.post('https://www.facebook.com/api/graphql/', form);
        const info = response.data;
        
        if (typeof info === "string") {
          try {
            info = JSON.parse(info.replace("for (;;);", ""));
          } catch (e) {
            throw new Error("Failed to parse response");
          }
        }
        
        const postID = info.data.story_create.story.legacy_story_hideable_id;
        const urlPost = info.data.story_create.story.url;
        
        if (!postID) throw new Error("No post ID returned");
        
        try {
          fs.unlinkSync(path.join(__dirname, 'cache', 'imagePost.png'));
        } catch (e) {}
        
        return message.reply(`Post created successfully!\nPost ID: ${postID}\nURL: ${urlPost}`);
      } catch (error) {
        console.error("Post creation error:", error);
        return message.reply("Failed to create post, please try again later");
      }
    }
  }
};

function getGUID() {
  let sectionLength = Date.now();
  const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.floor((sectionLength + Math.random() * 16) % 16);
    sectionLength = Math.floor(sectionLength / 16);
    const _guid = (c === "x" ? r : (r & 7) | 8).toString(16);
    return _guid;
  });
  return id;
}
