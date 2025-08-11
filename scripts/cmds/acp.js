const moment = require("moment-timezone");

// Constants
const MULTIPLIER_FOR_FB_TIMESTAMP = 1009; // Verify if this is correct; typically it's 1000
const COUNTDOWN_DURATION_MS = 20000; // 20 seconds, matching the countDown: 8 (assuming 8 units = 20000 ms)
const MAX_RANDOM_ID = 19; // Used for client_mutation_id

module.exports = {
  config: {
    name: "accept",
    aliases: ['acp'],
    version: "1.0",
    author: "Asif",  // Fixed the missing closing quote
    countDown: 8,
    role: 2,
    shortDescription: "accept users",
    longDescription: "accept users",
    category: "Utility",
  },
  onReply: async function ({ message, Reply, event, api, commandName }) {
    const { author, listRequest, messageID } = Reply;
    if (author !== event.senderID) return;

    const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");
    clearTimeout(Reply.unsendTimeout);

    const form = {
      av: api.getCurrentUserID(),
      fb_api_caller_class: "RelayModern",
      variables: {
        input: {
          source: "friends_tab",
          actor_id: api.getCurrentUserID(),
          client_mutation_id: Math.round(Math.random() * MAX_RANDOM_ID).toString()
        },
        scale: 3,
        refresh_num: 0
      }
    };

    const success = [];
    const failed = [];

    if (args[0] === "add") {
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
      form.doc_id = "3147613905362928";
    }
    else if (args[0] === "del") {
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
      form.doc_id = "4108254489275063";
    }
    else {
      return api.sendMessage("Please select <add | del > <target number | or \"all\">", event.threadID, event.messageID);
    }

    let targetIDs = args.slice(1);
    if (args[1] === "all") {
      targetIDs = [];
      const lengthList = listRequest.length;
      for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
    }

    const newTargetIDs = [];
    const promiseFriends = [];

    for (const stt of targetIDs) {
      const u = listRequest[parseInt(stt) - 1];
      if (!u) {
        failed.push(`Can't find stt ${stt} in the list`);
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
        const response = JSON.parse(friendRequest);
        if (response.errors) {
          failed.push(newTargetIDs[i].node.name);
          console.error("Error processing friend request:", response.errors);
        } else {
          success.push(newTargetIDs[i].node.name);
        }
      } catch (e) {
        failed.push(newTargetIDs[i].node.name);
        console.error("Exception while processing friend request:", e);
      }
    }

    if (success.length > 0) {
      let responseMessage = `» The ${args[0] === 'add' ? 'friend request' : 'friend request deletion'} has been processed for ${success.length} people:\n\n${success.join("\n")}`;
      if (failed.length > 0) {
        responseMessage += `\n» The following ${failed.length} people encountered errors: ${failed.join("\n")}`;
      }
      api.sendMessage(responseMessage, event.threadID, event.messageID);
    } else {
      api.unsendMessage(messageID);
      return api.sendMessage("Invalid response. Please provide a valid response.", event.threadID);
    }
    api.unsendMessage(messageID);
  },
  onStart: async function ({ event, api, commandName }) {
    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
      fb_api_caller_class: "RelayModern",
      doc_id: "4499164963466303",
      variables: JSON.stringify({ input: { scale: 3 } })
    };

    try {
      const response = await api.httpPost("https://www.facebook.com/api/graphql/", form);
      const data = JSON.parse(response).data.viewer.friending_possibilities.edges;
      let msg = "";
      let i = 0;

      for (const user of data) {
        i++;
        const userTime = moment(user.time * MULTIPLIER_FOR_FB_TIMESTAMP).tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss");
        const userUrl = user.node.url.replace("www.facebook.com", "fb.com");
        msg += (`\n${i}. Name: ${user.node.name}`
          + `\nID: ${user.node.id}`
          + `\nUrl: ${userUrl}`
          + `\nTime: ${userTime}\n`);
      }

      api.sendMessage(`${msg}\nReply to this message with content: <add | del> <comparison | or "all"> to take action`,
        event.threadID,
        (e, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            listRequest: data, // Using the parsed data
            author: event.senderID,
            unsendTimeout: setTimeout(() => {
              api.unsendMessage(info.messageID);
            }, this.config.countDown * COUNTDOWN_DURATION_MS / 8) // Assuming countDown:8 corresponds to COUNTDOWN_DURATION_MS
          });
        },
        event.messageID
      );
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      api.sendMessage("An error occurred while fetching friend requests.", event.threadID);
    }
  }
};
