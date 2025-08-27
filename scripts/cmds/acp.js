module.exports = {
  config: {
    name: "acp",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑", // 𝑼𝒑𝒅𝒂𝒕𝒆𝒅 𝒄𝒓𝒆𝒅𝒊𝒕𝒔
    role: 2, // 𝑶𝒏𝒍𝒚 𝒃𝒐𝒕 𝒐𝒘𝒏𝒆𝒓/𝒂𝒅𝒎𝒊𝒏 𝒄𝒂𝒏 𝒖𝒔𝒆
    category: "bot id",
    shortDescription: {
      en: "𝐹𝑟𝑖𝑒𝑛𝑑 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡" // 𝑩𝒂𝒏𝒈𝒍𝒊𝒔𝒉 𝒅𝒆𝒔𝒄𝒓𝒊𝒑𝒕𝒊𝒐𝒏
    },
    longDescription: {
      en: "𝑴𝒂𝒏𝒂𝒈𝒆𝒔 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒇𝑟𝑖𝑒𝑛𝑑 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔 (𝒂𝒄𝒄𝒆𝒑𝒕 𝒐𝒓 𝒅𝒆𝒍𝒆𝒕𝒆)"
    },
    guide: {
      en: "{p}acp\n{p}acp <𝒂𝒅𝒅 | 𝒅𝒆𝒍> <𝒐𝒓𝒅𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓 | 𝒂𝒍𝒍>"
    },
    priority: 0,
    cooldowns: 0
  },

  handleReply: async function({ handleReply, event, api, message }) {
    try {
      const { author, listRequest } = handleReply;
      if (author != event.senderID) return;
      const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");

      const form = {
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

      const success = [];
      const failed = [];

      if (args[0] == "add") {
        form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
        form.doc_id = "3147613905362928";
      } else if (args[0] == "del") {
        form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
        form.doc_id = "4108254489275063";
      } else return message.reply("𝑷𝒍𝒆𝒂𝒔𝒆 𝒄𝒉𝒐𝒐𝒔𝒆: <𝒂𝒅𝒅 | 𝒅𝒆𝒍> <𝒐𝒓𝒅𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓 | 𝒂𝒍𝒍>");

      let targetIDs = args.slice(1);

      if (args[1] == "all") {
        targetIDs = [];
        const lengthList = listRequest.length;
        for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
      }

      const newTargetIDs = [];
      const promiseFriends = [];

      for (const stt of targetIDs) {
        const u = listRequest[parseInt(stt) - 1];
        if (!u) {
          failed.push(`𝒔𝒕𝒕 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅 ${stt} 𝒊𝒏 𝒕𝒉𝒆 𝒍𝒊𝒔𝒕`);
          continue;
        }
        form.variables.input.friend_requester_id = u.node.id;
        form.variables = JSON.stringify(form.variables);
        newTargetIDs.push(u);
        promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
        form.variables = JSON.parse(form.variables);
      }

      const lengthTarget = newTargetIDs.length;
      for (let i = 0; i < lengthTarget; i++) {
        try {
          const friendRequest = await promiseFriends[i];
          if (JSON.parse(friendRequest).errors) failed.push(newTargetIDs[i].node.name);
          else success.push(newTargetIDs[i].node.name);
        } catch (e) {
          failed.push(newTargetIDs[i].node.name);
        }
      }

      const action = args[0] == 'add' ? '𝒂𝒄𝒄𝒆𝒑𝒕𝒆𝒅' : '𝒅𝒆𝒍𝒆𝒕𝒆𝒅';
      const successMsg = success.length > 0 ?
        `» 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 ${action} ${success.length} 𝒓𝒆𝒒𝒖𝒆𝒔𝒕(𝒔):\n${success.join("\n")}` :
        "";
      const failMsg = failed.length > 0 ?
        `\n» 𝑭𝒂𝒊𝒍𝒆𝒅 𝒇𝒐𝒓 ${failed.length} 𝒓𝒆𝒒𝒖𝒆𝒔𝒕(𝒔):\n${failed.join("\n")}` :
        "";

      await message.reply(successMsg + failMsg);
    } catch (error) {
      console.error("𝑨𝑪𝑷 𝑯𝒂𝒏𝒅𝒍𝒆𝑹𝒆𝒑𝒍𝒚 𝑬𝒓𝒓𝒐𝒓:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒎𝒂𝒏𝒂𝒈𝒊𝒏𝒈 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔.");
    }
  },

  onStart: async function({ event, api, message, global }) {
    try {
      const moment = require("moment-timezone");
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

      const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;
      let msg = "» 𝑷𝒆𝒏𝒅𝒊𝒏𝒈 𝑭𝒓𝒊𝑒𝒏𝒅 𝑹𝒆𝒒𝒖𝒆𝒔𝒕𝒔 «\n";
      let i = 0;

      if (listRequest.length === 0) {
        return message.reply("✅ 𝑵𝒐 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒇𝑟𝑖𝑒𝑛𝑑 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔 𝒂𝒕 𝒕𝒉𝒊𝒔 𝒕𝒊𝒎𝒆.");
      }

      for (const user of listRequest) {
        i++;
        msg += (`\n${i}. 𝑵𝒂𝒎𝒆: ${user.node.name}` +
          `\n𝑰𝑫: ${user.node.id}` +
          `\n𝑼𝒓𝒍: ${user.node.url.replace("www.facebook", "fb")}` +
          `\n𝑫𝒂𝒕𝒆: ${moment(user.time*1000).tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss")}\n`);
      }

      msg += "\n𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉: <𝒂𝒅𝒅 | 𝒅𝒆𝒍> <𝒏𝒖𝒎𝒃𝒆𝒓 | 𝒂𝒍𝒍> 𝒕𝒐 𝒎𝒂𝒏𝒂𝒈𝒆 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔";

      await message.reply(msg, (e, info) => {
        if (e) return console.error("𝑨𝑪𝑷 𝑶𝒏𝑺𝒕𝒂𝒓𝒕 𝑬𝒓𝒓𝒐𝒓:", e);
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          listRequest,
          author: event.senderID
        });
      });
    } catch (error) {
      console.error("𝑨𝑪𝑷 𝑶𝒏𝑺𝒕𝒂𝒓𝒕 𝑬𝒓𝒓𝒐𝒓:", error);
      await message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒇𝒆𝒕𝒄𝒉 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒇𝑟𝑖𝑒𝑛𝑑 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔.");
    }
  }
};
