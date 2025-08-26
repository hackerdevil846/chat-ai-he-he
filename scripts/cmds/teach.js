module.exports.config = {
  name: "teach",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Simmike shikhano kaj - prosno o uttor add koro",
  category: "𝙎𝙞𝙢",
  usages: "",
  cooldowns: 2,
  dependencies: {
    "axios": ""
  },
  envConfig: {
    SIM_API_KEY: "" // set your API key here if you have one
  }
};

module.exports.onStart = async function({ api, event, args, Users }) {
  const { threadID, messageID, senderID } = event;
  return api.sendMessage(
    "⸙͎ Prosno likhen — simmike shikhano jonno ei message-er reply e prosno pathan.",
    threadID,
    (err, info) => {
      if (err) return console.error(err);
      // register a handleReply object so next reply is handled by handleReply
      global.client.handleReply.push({
        step: 1,
        name: module.exports.config.name,
        messageID: info.messageID,
        content: {
          id: senderID,
          ask: "",
          ans: ""
        }
      });
    },
    messageID
  );
};

module.exports.handleReply = async function({ api, event, Users, handleReply }) {
  const axios = require("axios");
  const { threadID, messageID, senderID, body } = event;

  // only accept replies from the original user who invoked the command
  if (!handleReply || !handleReply.content || handleReply.content.id !== senderID) return;

  const userInput = (body || "").trim();

  // helper: remove old stored handleReply and optionally push new one
  const replaceHandleReply = (newObj) => {
    try {
      const idx = global.client.handleReply.findIndex(i => i.messageID == handleReply.messageID && i.name == handleReply.name);
      if (idx !== -1) global.client.handleReply.splice(idx, 1);
      if (newObj) global.client.handleReply.push(newObj);
      // try to unsend the bot's previous prompt (cleanup)
      try { api.unsendMessage(handleReply.messageID); } catch(e) {}
    } catch(e) { console.error(e); }
  };

  switch (handleReply.step) {
    case 1:
      // user has replied with the question (prosno)
      handleReply.content.ask = userInput;
      // send next prompt to get the answer
      api.sendMessage(
        "⸙͎ Uttor likhen — ekhon ei message-er reply e uttor pathan.",
        threadID,
        (err, info) => {
          if (err) return console.error(err);
          // remove old and push updated handleReply with step 2
          replaceHandleReply({
            step: 2,
            name: module.exports.config.name,
            messageID: info.messageID,
            content: handleReply.content
          });
        },
        messageID
      );
      break;

    case 2:
      // user replied with the answer (uttor)
      handleReply.content.ans = userInput;

      // remove stored handleReply (we will finish now)
      replaceHandleReply(null);

      // prepare timestamp in Asia/Dhaka without external libs
      const timeZ = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });

      // call external API to save the Q/A (fallback to PriyanshVip if no env key)
      const apikey = (module.exports.config.envConfig && module.exports.config.envConfig.SIM_API_KEY) ? module.exports.config.envConfig.SIM_API_KEY : "PriyanshVip";
      const ask = encodeURIComponent(handleReply.content.ask);
      const ans = encodeURIComponent(handleReply.content.ans);
      const url = `https://sim-api-by-priyansh.glitch.me/sim?type=teach&ask=${ask}&ans=${ans}&apikey=${apikey}`;

      try {
        const res = await axios.get(url);
        if (res.data && res.data.error) {
          return api.sendMessage(`❌ Problem: ${res.data.error}`, threadID, messageID);
        }

        // success message (Banglish)
        return api.sendMessage(
          `✅ Safollo — simmike sikkhano hoye geche.\n\n` +
          `🤤 Prosno: ${handleReply.content.ask}\n` +
          `🤓 Uttor: ${handleReply.content.ans}\n\n` +
          `⏱ Somoy: ${timeZ}`,
          threadID,
          messageID
        );
      } catch (error) {
        console.error("Error while saving teach:", error);
        return api.sendMessage(
          "❌ Kichu ekta problem hoyeche, poroborti te abar chesta korun.",
          threadID,
          messageID
        );
      }

    default:
      break;
  }
};
