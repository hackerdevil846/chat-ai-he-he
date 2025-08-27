const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "acp",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 2,
    category: "admin",
    shortDescription: {
      en: "𝑭𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕 𝒎𝒂𝒏𝒂𝒈𝒆𝒎𝒆𝒏𝒕"
    },
    longDescription: {
      en: "𝑴𝒂𝒏𝒂𝒈𝒆𝒔 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔 (𝒂𝒄𝒄𝒆𝒑𝒕 𝒐𝒓 𝒅𝒆𝒍𝒆𝒕𝒆)"
    },
    guide: {
      en: "{p}acp\n{p}acp <add|del> <number|all>"
    },
    cooldowns: 0
  },

  onStart: async function({ event, message, api }) {
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
        return message.reply("✅ 𝑵𝒐 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔 𝒂𝒕 𝒕𝒉𝒊𝒔 𝒕𝒊𝒎𝒆.");
      }

      const listRequest = data.data.viewer.friending_possibilities.edges;
      
      if (listRequest.length === 0) {
        return message.reply("✅ 𝑵𝒐 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔 𝒂𝒕 𝒕𝒉𝒊𝒔 𝒕𝒊𝒎𝒆.");
      }

      let msg = "» 𝑷𝒆𝒏𝒅𝒊𝒏𝒈 𝑭𝒓𝒊𝒆𝒏𝒅 𝑹𝒆𝒒𝒖𝒆𝒔𝒕𝒔 «\n\n";
      let i = 0;

      for (const user of listRequest) {
        i++;
        msg += `${i}. 𝑵𝒂𝒎𝒆: ${user.node.name}\n` +
               `𝑰𝑫: ${user.node.id}\n` +
               `𝑼𝒓𝒍: ${user.node.url ? user.node.url.replace("www.facebook", "fb") : "N/A"}\n` +
               `𝑫𝒂𝒕𝒆: ${moment(user.time * 1000).tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss")}\n\n`;
      }

      msg += "𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉: <add|del> <number|all> 𝒕𝒐 𝒎𝒂𝒏𝒂𝒈𝒆 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔";

      await message.reply(msg);

    } catch (error) {
      console.error("𝑨𝑪𝑷 𝑶𝒏𝑺𝒕𝒂𝒓𝒕 𝑬𝒓𝒓𝒐𝒓:", error);
      await message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒇𝒆𝒕𝒄𝒉 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔.");
    }
  },

  onChat: async function({ event, message, api, reply }) {
    if (event.type === "message_reply") {
      try {
        const args = event.body.toLowerCase().split(" ");
        
        if (args.length < 2) {
          return message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒇𝒐𝒓𝒎𝒂𝒕. 𝑼𝒔𝒆: <add|del> <number|all>");
        }

        const action = args[0];
        const target = args[1];

        if (!["add", "del"].includes(action)) {
          return message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒂𝒄𝒕𝒊𝒐𝒏. 𝑼𝒔𝒆: add 𝒐𝒓 del");
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
        const listRequest = data.data.viewer.friending_possibilities.edges;

        if (listRequest.length === 0) {
          return message.reply("✅ 𝑵𝒐 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔 𝒕𝒐 𝒎𝒂𝒏𝒂𝒈𝒆.");
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
            failed.push(`𝒔𝒕𝒕 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅 ${stt}`);
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

        const actionText = action === 'add' ? '𝒂𝒄𝒄𝒆𝒑𝒕𝒆𝒅' : '𝒅𝒆𝒍𝒆𝒕𝒆𝒅';
        let resultMsg = "";
        
        if (success.length > 0) {
          resultMsg += `✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 ${actionText} ${success.length} 𝒓𝒆𝒒𝒖𝒆𝒔𝒕(𝒔):\n${success.join("\n")}\n\n`;
        }
        
        if (failed.length > 0) {
          resultMsg += `❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒇𝒐𝒓 ${failed.length} 𝒓𝒆𝒒𝒖𝒆𝒔𝒕(𝒔):\n${failed.join("\n")}`;
        }

        await message.reply(resultMsg || "❌ 𝑵𝒐 𝒂𝒄𝒕𝒊𝒐𝒏𝒔 𝒘𝒆𝒓𝒆 𝒑𝒆𝒓𝒇𝒐𝒓𝒎𝒆𝒅.");

      } catch (error) {
        console.error("𝑨𝑪𝑷 𝑪𝒉𝒂𝒕 𝑬𝒓𝒓𝒐𝒓:", error);
        await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒎𝒂𝒏𝒂𝒈𝒊𝒏𝒈 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔.");
      }
    }
  }
};
