const moment = require("moment-timezone");

module.exports.config = {
    name: "acp",
    aliases: ["friendreq", "frequest"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "𝐹𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡"
    },
    longDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒𝑠 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑓𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠 (𝑎𝑐𝑐𝑒𝑝𝑡 𝑜𝑟 𝑑𝑒𝑙𝑒𝑡𝑒)"
    },
    guide: {
        en: "{p}acp\n{p}acp <add|del> <number|all>"
    },
    dependencies: {
        "moment-timezone": "",
        "axios": ""
    }
};

module.exports.onStart = async function({ message, api }) {
    try {
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

        const response = await api.httpPost("https://www.facebook.com/api/graphql/", form);
        const data = JSON.parse(response);
        
        if (!data.data || !data.data.viewer || !data.data.viewer.friending_possibilities) {
            return message.reply("✅ 𝑁𝑜 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝑓𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠 𝑎𝑡 𝑡ℎ𝑖𝑠 𝑡𝑖𝑚𝑒.");
        }

        const listRequest = data.data.viewer.friending_possibilities.edges;
        
        if (listRequest.length === 0) {
            return message.reply("✅ 𝑁𝑜 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝑓𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠 𝑎𝑡 𝑡ℎ𝑖𝑠 𝑡𝑖𝑚𝑒.");
        }

        let msg = "» 𝑃𝑒𝑛𝑑𝑖𝑛𝑔 𝐹𝑟𝑖𝑒𝑛𝑑 𝑅𝑒𝑞𝑢𝑒𝑠𝑡𝑠 «\n\n";
        let i = 0;

        for (const user of listRequest) {
            i++;
            msg += `${i}. 𝑁𝑎𝑚𝑒: ${user.node.name}\n` +
                   `𝐼𝐷: ${user.node.id}\n` +
                   `𝑈𝑅𝐿: ${user.node.url ? user.node.url.replace("www.facebook", "fb") : "𝑁/𝐴"}\n` +
                   `𝐷𝑎𝑡𝑒: ${moment(user.time * 1000).tz("𝐴𝑠𝑖𝑎/𝐷ℎ𝑎𝑘𝑎").format("𝐷𝐷/𝑀𝑀/𝑌𝑌𝑌𝑌 𝐻𝐻:𝑚𝑚:𝑠𝑠")}\n\n`;
        }

        msg += "𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ: <𝑎𝑑𝑑|𝑑𝑒𝑙> <𝑛𝑢𝑚𝑏𝑒𝑟|𝑎𝑙𝑙> 𝑡𝑜 𝑚𝑎𝑛𝑎𝑔𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠";

        await message.reply(msg);

    } catch (error) {
        console.error("𝐴𝐶𝑃 𝑂𝑛𝑆𝑡𝑎𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝑓𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠.");
    }
};

module.exports.onChat = async function({ event, message, api }) {
    if (event.type === "message_reply") {
        try {
            const args = event.body.toLowerCase().split(" ");
            
            if (args.length < 2) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑜𝑟𝑚𝑎𝑡. 𝑈𝑠𝑒: <𝑎𝑑𝑑|𝑑𝑒𝑙> <𝑛𝑢𝑚𝑏𝑒𝑟|𝑎𝑙𝑙>");
            }

            const action = args[0];
            const target = args[1];

            if (!["add", "del"].includes(action)) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑎𝑐𝑡𝑖𝑜𝑛. 𝑈𝑠𝑒: 𝑎𝑑𝑑 𝑜𝑟 𝑑𝑒𝑙");
            }

            // First fetch current friend requests
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

            const response = await api.httpPost("https://www.facebook.com/api/graphql/", form);
            const data = JSON.parse(response);
            
            if (!data.data || !data.data.viewer || !data.data.viewer.friending_possibilities) {
                return message.reply("✅ 𝑁𝑜 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝑓𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠 𝑡𝑜 𝑚𝑎𝑛𝑎𝑔𝑒.");
            }
            
            const listRequest = data.data.viewer.friending_possibilities.edges;

            if (listRequest.length === 0) {
                return message.reply("✅ 𝑁𝑜 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝑓𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠 𝑡𝑜 𝑚𝑎𝑛𝑎𝑔𝑒.");
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
                targetIDs = args.slice(1).map(num => parseInt(num)).filter(num => !isNaN(num));
            }

            for (const stt of targetIDs) {
                const user = listRequest[stt - 1];
                if (!user) {
                    failed.push(`𝑠𝑡𝑡 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 ${stt}`);
                    continue;
                }

                try {
                    actionForm.variables.input.friend_requester_id = user.node.id;
                    const actionResponse = await api.httpPost("https://www.facebook.com/api/graphql/", {
                        ...actionForm,
                        variables: JSON.stringify(actionForm.variables)
                    });
                    
                    const result = JSON.parse(actionResponse);
                    if (result.errors) {
                        failed.push(user.node.name);
                    } else {
                        success.push(user.node.name);
                    }
                } catch (e) {
                    failed.push(user.node.name);
                }
            }

            const actionText = action === 'add' ? '𝑎𝑐𝑐𝑒𝑝𝑡𝑒𝑑' : '𝑑𝑒𝑙𝑒𝑡𝑒𝑑';
            let resultMsg = "";
            
            if (success.length > 0) {
                resultMsg += `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 ${actionText} ${success.length} 𝑟𝑒𝑞𝑢𝑒𝑠𝑡(𝑠):\n${success.join("\n")}\n\n`;
            }
            
            if (failed.length > 0) {
                resultMsg += `❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑓𝑜𝑟 ${failed.length} 𝑟𝑒𝑞𝑢𝑒𝑠𝑡(𝑠):\n${failed.join("\n")}`;
            }

            await message.reply(resultMsg || "❌ 𝑁𝑜 𝑎𝑐𝑡𝑖𝑜𝑛𝑠 𝑤𝑒𝑟𝑒 𝑝𝑒𝑟𝑓𝑜𝑟𝑚𝑒𝑑.");

        } catch (error) {
            console.error("𝐴𝐶𝑃 𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑚𝑎𝑛𝑎𝑔𝑖𝑛𝑔 𝑓𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠.");
        }
    }
};
