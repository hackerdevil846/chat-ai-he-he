const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "createpost",
    aliases: ["post", "makepost"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑛𝑒𝑤 𝑝𝑜𝑠𝑡 𝑜𝑛 𝑏𝑜𝑡 𝑎𝑐𝑐𝑜𝑢𝑛𝑡"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑝𝑜𝑠𝑡𝑠 𝑜𝑛 𝑡ℎ𝑒 𝑏𝑜𝑡'𝑠 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑎𝑛𝑑 𝑝𝑟𝑖𝑣𝑎𝑐𝑦 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠"
    },
    guide: {
        en: "{p}createpost"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function ({ message, event, api }) {
    try {
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
                        "base_state": "FRIENDS",
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
                "actor_id": api.getCurrentUserID(),
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

        await message.reply("𝐶ℎ𝑜𝑜𝑠𝑒 𝑤ℎ𝑜 𝑐𝑎𝑛 𝑠𝑒𝑒 𝑡ℎ𝑖𝑠 𝑝𝑜𝑠𝑡:\n1. 𝐸𝑣𝑒𝑟𝑦𝑜𝑛𝑒\n2. 𝐹𝑟𝑖𝑒𝑛𝑑𝑠\n3. 𝑂𝑛𝑙𝑦 𝑚𝑒", (err, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                formData,
                type: "whoSee"
            });
        });

    } catch (error) {
        console.error("𝐶𝑟𝑒𝑎𝑡𝑒𝑃𝑜𝑠𝑡 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒 𝑝𝑜𝑠𝑡 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛");
    }
};

module.exports.onReply = async function ({ event, handleReply, message, api }) {
    if (event.senderID !== handleReply.author) return;
    
    const { type, formData } = handleReply;
    const { attachments, body } = event;

    async function uploadAttachments(attachmentUrls) {
        const uploads = [];
        for (const url of attachmentUrls) {
            try {
                const stream = await global.utils.getStreamFromURL(url);
                uploads.push(stream);
            } catch (error) {
                console.error("𝑈𝑝𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            }
        }
        return uploads;
    }

    if (type === "whoSee") {
        if (!["1", "2", "3"].includes(body)) {
            return message.reply('𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 1, 2, 𝑜𝑟 3 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑜𝑝𝑡𝑖𝑜𝑛𝑠 𝑎𝑏𝑜𝑣𝑒');
        }
        formData.input.audience.privacy.base_state = body === "1" ? "EVERYONE" : body === "2" ? "FRIENDS" : "SELF";
        
        await message.reply("𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑜𝑓 𝑦𝑜𝑢𝑟 𝑝𝑜𝑠𝑡, 𝑟𝑒𝑝𝑙𝑦 0 𝑡𝑜 𝑙𝑒𝑎𝑣𝑒 𝑒𝑚𝑝𝑡𝑦", (err, info) => {
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
        
        await message.reply("𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑖𝑚𝑎𝑔𝑒𝑠 (𝑦𝑜𝑢 𝑐𝑎𝑛 𝑠𝑒𝑛𝑑 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑖𝑚𝑎𝑔𝑒𝑠), 𝑟𝑒𝑝𝑙𝑦 0 𝑖𝑓 𝑦𝑜𝑢 𝑑𝑜𝑛'𝑡 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑝𝑜𝑠𝑡 𝑖𝑚𝑎𝑔𝑒𝑠", (err, info) => {
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
        try {
            if (body !== "0" && attachments && attachments.length > 0) {
                const imageUrls = attachments
                    .filter(attach => attach.type === "photo")
                    .map(attach => attach.url);
                
                if (imageUrls.length > 0) {
                    const uploadedFiles = await uploadAttachments(imageUrls);
                    
                    for (const result of uploadedFiles) {
                        formData.input.attachments.push({
                            "photo": {
                                "id": result.toString(),
                            }
                        });
                    }
                }
            }

            const form = {
                av: api.getCurrentUserID(),
                fb_api_req_friendly_name: "ComposerStoryCreateMutation",
                fb_api_caller_class: "RelayModern",
                doc_id: "7711610262190099",
                variables: JSON.stringify(formData)
            };

            const response = await axios.post('https://www.facebook.com/api/graphql/', form);
            let info = response.data;
            
            if (typeof info === "string") {
                try {
                    info = JSON.parse(info.replace("for (;;);", ""));
                } catch (e) {
                    throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑎𝑟𝑠𝑒 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
                }
            }
            
            const postID = info.data?.story_create?.story?.legacy_story_hideable_id;
            const urlPost = info.data?.story_create?.story?.url;
            
            if (!postID) throw new Error("𝑁𝑜 𝑝𝑜𝑠𝑡 𝐼𝐷 𝑟𝑒𝑡𝑢𝑟𝑛𝑒𝑑");
            
            try {
                const cachePath = path.join(__dirname, 'cache', 'imagePost.png');
                if (fs.existsSync(cachePath)) {
                    fs.unlinkSync(cachePath);
                }
            } catch (e) {}
            
            await message.reply(`𝑃𝑜𝑠𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n𝑃𝑜𝑠𝑡 𝐼𝐷: ${postID}\n𝑈𝑅𝐿: ${urlPost || '𝑁/𝐴'}`);
            
        } catch (error) {
            console.error("𝑃𝑜𝑠𝑡 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑝𝑜𝑠𝑡, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟");
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
