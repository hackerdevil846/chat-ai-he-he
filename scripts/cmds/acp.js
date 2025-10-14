const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "acp",
        aliases: [],
        version: "1.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 0,
        role: 2,
        category: "admin",
        shortDescription: {
            en: "𝖥𝗋𝗂𝖾𝗇𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍 𝗆𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍"
        },
        longDescription: {
            en: "𝖬𝖺𝗇𝖺𝗀𝖾𝗌 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖿𝗋𝗂𝖾𝗇𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝗌 (𝖺𝖼𝖼𝖾𝗉𝗍 𝗈𝗋 𝖽𝖾𝗅𝖾𝗍𝖾)"
        },
        guide: {
            en: "{p}acp\n𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁: 𝖺𝖽𝖽/𝖽𝖾𝗅 <𝗇𝗎𝗆𝖻𝖾𝗋|𝖺𝗅𝗅>"
        },
        dependencies: {
            "moment-timezone": ""
        }
    },

    onStart: async function({ message, api, event }) {
        try {
            // Dependency check
            let momentAvailable = true;
            try {
                require("moment-timezone");
            } catch (e) {
                momentAvailable = false;
            }

            if (!momentAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝗆𝗈𝗆𝖾𝗇𝗍-𝗍𝗂𝗆𝖾𝗓𝗈𝗇𝖾.");
            }

            const form = {
                av: api.getCurrentUserID(),
                fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
                fb_api_caller_class: "RelayModern",
                doc_id: "4499164963466303",
                variables: JSON.stringify({
                    input: {
                        scale: 3
                    }
                })
            };

            const response = await api.httpPost("https://www.facebook.com/api/graphql/", form, {
                timeout: 30000
            });
            
            let data;
            try {
                data = JSON.parse(response);
            } catch (parseError) {
                console.error("𝖩𝖲𝖮𝖭 𝖯𝖺𝗋𝗌𝖾 𝖤𝗋𝗋𝗈𝗋:", parseError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝖺𝗋𝗌𝖾 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾.");
            }
            
            if (!data.data || !data.data.viewer || !data.data.viewer.friending_possibilities) {
                return message.reply("✅ 𝖭𝗈 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝖿𝗋𝗂𝖾𝗇𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝗌 𝖺𝗍 𝗍𝗁𝗂𝗌 𝗍𝗂𝗆𝖾.");
            }

            const listRequest = data.data.viewer.friending_possibilities.edges;
            
            if (listRequest.length === 0) {
                return message.reply("✅ 𝖭𝗈 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝖿𝗋𝗂𝖾𝗇𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝗌 𝖺𝗍 𝗍𝗁𝗂𝗌 𝗍𝗂𝗆𝖾.");
            }

            let msg = "» 𝖯𝖾𝗇𝖽𝗂𝗇𝗀 𝖥𝗋𝗂𝖾𝗇𝖽 𝖱𝖾𝗊𝗎𝖾𝗌𝗍𝗌 «\n\n";
            let i = 0;

            for (const user of listRequest) {
                i++;
                const timestamp = user.time ? user.time * 1000 : Date.now();
                const dateTime = moment(timestamp).tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");
                
                msg += `${i}. 𝖭𝖺𝗆𝖾: ${user.node.name}\n` +
                       `𝖨𝖣: ${user.node.id}\n` +
                       `𝖴𝖱𝖫: ${user.node.url ? user.node.url.replace("www.facebook", "fb") : "𝖭/𝖠"}\n` +
                       `𝖣𝖺𝗍𝖾: ${dateTime}\n\n`;
            }

            msg += "𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁: 𝖺𝖽𝖽/𝖽𝖾𝗅 <𝗇𝗎𝗆𝖻𝖾𝗋|𝖺𝗅𝗅> 𝗍𝗈 𝗆𝖺𝗇𝖺𝗀𝖾 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝗌";

            const sentMsg = await message.reply(msg);

            // Initialize global handleReply if it doesn't exist
            if (!global.client.handleReply) {
                global.client.handleReply = [];
            }

            global.client.handleReply.push({
                name: this.config.name,
                messageID: sentMsg.messageID,
                author: event.senderID,
                timestamp: Date.now()
            });

            // Clean up old replies after 5 minutes
            setTimeout(() => {
                if (global.client.handleReply) {
                    global.client.handleReply = global.client.handleReply.filter(
                        reply => Date.now() - reply.timestamp < 300000 // 5 minutes
                    );
                }
            }, 300000);

        } catch (error) {
            console.error("💥 𝖠𝖢𝖯 𝖮𝗇𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖿𝗋𝗂𝖾𝗇𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝗌.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            }
            
            await message.reply(errorMessage);
        }
    },

    onReply: async function({ event, message, api, Reply }) {
        try {
            // Check if reply is still valid (within 5 minutes)
            if (Date.now() - Reply.timestamp > 300000) {
                return message.reply("❌ 𝖳𝗁𝗂𝗌 𝗋𝖾𝗉𝗅𝗒 𝗌𝖾𝗌𝗌𝗂𝗈𝗇 𝗁𝖺𝗌 𝖾𝗑𝗉𝗂𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 {p}acp 𝖺𝗀𝖺𝗂𝗇.");
            }

            if (Reply.author !== event.senderID) return;
            
            const args = event.body.toLowerCase().trim().split(/\s+/);
            
            if (args.length < 2) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖿𝗈𝗋𝗆𝖺𝗍. 𝖴𝗌𝖾: 𝖺𝖽𝖽/𝖽𝖾𝗅 <𝗇𝗎𝗆𝖻𝖾𝗋|𝖺𝗅𝗅>");
            }

            const action = args[0];
            const target = args[1];

            if (!["add", "del"].includes(action)) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖺𝖼𝗍𝗂𝗈𝗇. 𝖴𝗌𝖾: 𝖺𝖽𝖽 𝗈𝗋 𝖽𝖾𝗅");
            }

            // Fetch current friend requests
            const form = {
                av: api.getCurrentUserID(),
                fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
                fb_api_caller_class: "RelayModern",
                doc_id: "4499164963466303",
                variables: JSON.stringify({
                    input: {
                        scale: 3
                    }
                })
            };

            const response = await api.httpPost("https://www.facebook.com/api/graphql/", form, {
                timeout: 30000
            });
            
            let data;
            try {
                data = JSON.parse(response);
            } catch (parseError) {
                console.error("𝖩𝖲𝖮𝖭 𝖯𝖺𝗋𝗌𝖾 𝖤𝗋𝗋𝗈𝗋:", parseError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝖺𝗋𝗌𝖾 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾.");
            }
            
            if (!data.data || !data.data.viewer || !data.data.viewer.friending_possibilities) {
                return message.reply("✅ 𝖭𝗈 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝖿𝗋𝗂𝖾𝗇𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝗌 𝗍𝗈 𝗆𝖺𝗇𝖺𝗀𝖾.");
            }
            
            const listRequest = data.data.viewer.friending_possibilities.edges;

            if (listRequest.length === 0) {
                return message.reply("✅ 𝖭𝗈 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝖿𝗋𝗂𝖾𝗇𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝗌 𝗍𝗈 𝗆𝖺𝗇𝖺𝗀𝖾.");
            }

            const actionForm = {
                av: api.getCurrentUserID(),
                fb_api_caller_class: "RelayModern",
                variables: {
                    input: {
                        source: "friends_tab",
                        actor_id: api.getCurrentUserID(),
                        client_mutation_id: Math.round(Math.random() * 19).toString()
                    },
                    scale: 3,
                    refresh_num: 0
                }
            };

            if (action === "add") {
                actionForm.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
                actionForm.doc_id = "3147613905362928";
            } else {
                actionForm.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
                actionForm.doc_id = "4108254489275063";
            }

            const success = [];
            const failed = [];

            let targetIDs = [];
            
            if (target === "all") {
                targetIDs = listRequest.map((_, index) => index + 1);
            } else {
                targetIDs = args.slice(1).map(num => parseInt(num)).filter(num => 
                    !isNaN(num) && num > 0 && num <= listRequest.length
                );
            }

            if (targetIDs.length === 0) {
                return message.reply("❌ 𝖭𝗈 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖻𝖾𝗋𝗌 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽.");
            }

            const processingMsg = await message.reply(`⏳ 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 ${targetIDs.length} 𝗋𝖾𝗊𝗎𝖾𝗌𝗍(𝗌)...`);

            for (const stt of targetIDs) {
                const user = listRequest[stt - 1];
                if (!user) {
                    failed.push(`#${stt} (𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽)`);
                    continue;
                }

                try {
                    actionForm.variables.input.friend_requester_id = user.node.id;
                    const actionResponse = await api.httpPost("https://www.facebook.com/api/graphql/", {
                        ...actionForm,
                        variables: JSON.stringify(actionForm.variables)
                    }, {
                        timeout: 15000
                    });
                    
                    const result = JSON.parse(actionResponse);
                    if (result.errors) {
                        failed.push(`${user.node.name} (#${stt})`);
                    } else {
                        success.push(`${user.node.name} (#${stt})`);
                    }
                } catch (e) {
                    failed.push(`${user.node.name} (#${stt})`);
                }
            }

            // Clean up processing message
            try {
                await message.unsend(processingMsg.messageID);
            } catch (unsendError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

            const actionText = action === 'add' ? '𝖺𝖼𝖼𝖾𝗉𝗍𝖾𝖽' : '𝖽𝖾𝗅𝖾𝗍𝖾𝖽';
            let resultMsg = "";
            
            if (success.length > 0) {
                resultMsg += `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 ${actionText} ${success.length} 𝗋𝖾𝗊𝗎𝖾𝗌𝗍(𝗌):\n${success.join("\n")}\n\n`;
            }
            
            if (failed.length > 0) {
                resultMsg += `❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝖿𝗈𝗋 ${failed.length} 𝗋𝖾𝗊𝗎𝖾𝗌𝗍(𝗌):\n${failed.join("\n")}`;
            }

            await message.reply(resultMsg || "❌ 𝖭𝗈 𝖺𝖼𝗍𝗂𝗈𝗇𝗌 𝗐𝖾𝗋𝖾 𝗉𝖾𝗋𝖿𝗈𝗋𝗆𝖾𝖽.");

            // Remove this reply from handleReply
            if (global.client.handleReply) {
                global.client.handleReply = global.client.handleReply.filter(
                    reply => reply.messageID !== Reply.messageID
                );
            }

        } catch (error) {
            console.error("💥 𝖠𝖢𝖯 𝖱𝖾𝗉𝗅𝗒 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝗌.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
