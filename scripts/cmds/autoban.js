module.exports.config = {
  name: "fixspam-ch",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Automatically ban users who use bad words against the bot",
  category: "system",
  usages: "noprefix",
  cooldowns: 0,
  dependencies: {}
};

module.exports.languages = {
  "en": {
    "banned_notice_subject": "» Notice from Owner 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 «",
    "banned_message": "{name}, you have been banned from using the bot system for using inappropriate language.",
    "auto_command_msg": "⚠️ This is an automated system command. It does not need to be called manually.\n\nWhen users use bad words against the bot, they will be automatically banned. ✅",
    "admin_notify_subject": "=== Bot Notification ===",
    "admin_notify_body": "👤 User: {name}\n🆔 UID: {uid}\n💬 Message: {msg}\n\nBanned from the system."
  },
  "bn": {
    "auto_command_msg": "⚠️ এটী একটি অটোমেটেড সিস্টেম কমান্ড। ম্যানুয়ালি কল করার দরকার নেই।\n\nযদি কেউ বটকে গালি দেয়, তারা স্বয়ংক্রিয়ভাবে ব্যান হয়ে যাবে। ✅"
  }
};

module.exports.onLoad = function () {
  // Ensure global.data.userBanned exists and is a Map (to avoid runtime errors)
  if (!global.data) global.data = {};
  if (!global.data.userBanned) global.data.userBanned = new Map();

  // Ensure there is a ADMINBOT array to notify (if not present, keep empty array to avoid crashes)
  if (!global.config) global.config = {};
  if (!global.config.ADMINBOT) global.config.ADMINBOT = [];
};

module.exports.handleEvent = async function ({ event, api, Users }) {
  try {
    // Basic destructuring and safe handling for message body
    const threadID = event.threadID || event.threadId || (event.message && event.message.threadID);
    const senderID = event.senderID || (event.message && event.message.senderID);
    let body = (event.body || (event.message && (event.message.text || event.message.body)) || "");
    if (!body || typeof body !== "string") return; // nothing to check

    // Don't react to the bot's own messages
    try {
      const selfID = typeof api.getCurrentUserID === "function" ? await api.getCurrentUserID() : (api.getCurrentUserID || null);
      if (selfID && senderID == selfID) return;
    } catch (errSelf) {
      // ignore getCurrentUserID errors and continue
    }

    // Normalize message for case-insensitive checking
    const bodyNormalized = body.toLowerCase();

    // Bad words list (kept as requested, unchanged text content)
    const badWords = [
      "bot mc", "mc bot", "chutiya bot", "bsdk bot", "bot teri maa ki chut",
      "jhatu bot", "rhaine bobo", "stupid bots", "chicken bot", "bot lund",
      "priyansh mc", "mc priyansh", "bsdk priyansh", "fuck bots",
      "priyansh chutiya", "priyansh gandu", "bobo ginoong choru bot",
      "priyansh bc", "crazy bots", "bc priyansh", "nikal bsdk bot",
      "bot khùng", "đĩ bot", "bot paylac rồi", "con bot lòn", "cmm bot",
      "clap bot", "bot ncc", "bot oc", "bot óc", "bot óc chó", "cc bot",
      "bot tiki", "lozz bottt", "lol bot", "loz bot", "lồn bot", "bot lồn",
      "bot lon", "bot cac", "bot nhu lon", "bot như cc", "bot như bìu",
      "bot sida", "bot fake", "bảo ngu", "bot shoppee",
      "bad bots", "bot cau"
    ];

    // Check each bad word: case-insensitive, detect if the bad phrase appears anywhere in the message
    for (const rawWord of badWords) {
      if (!rawWord) continue;
      const word = rawWord.toLowerCase().trim();
      if (!word) continue;

      // If message contains the word (anywhere) -> ban
      if (bodyNormalized.includes(word)) {
        // Fetch user name (best-effort)
        let userName = senderID;
        try {
          userName = await Users.getNameUser(senderID) || senderID;
        } catch (e) {
          // ignore
        }

        console.log(`Bad word detected: ${userName} said "${rawWord}"`);

        // Prepare time in Asia/Dhaka
        let time = "";
        try {
          const moment = require("moment-timezone");
          time = moment().tz("Asia/Dhaka").format("HH:mm:ss, DD/MM/YYYY");
        } catch (errMoment) {
          time = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });
        }

        // Mark user data as banned (best-effort; silent failures won't break)
        try {
          const userData = (await Users.getData(senderID)) || {};
          userData.banned = 1;
          userData.reason = rawWord;
          userData.dateAdded = time;
          await Users.setData(senderID, userData);

          // Also update global banned map used by some GoatBot setups
          if (!global.data) global.data = {};
          if (!global.data.userBanned) global.data.userBanned = new Map();
          global.data.userBanned.set(senderID, {
            reason: userData.reason,
            dateAdded: userData.dateAdded
          });
        } catch (errSetData) {
          console.error("Failed to set user data for ban:", errSetData);
        }

        // Send warning message to the thread
        const warningBody = [
          "» Notice from Owner 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 «",
          "",
          `${userName}, you have been banned from using the bot system for using inappropriate language. 🚫`,
          "",
          `Reason: "${rawWord}"`,
          `Time: ${time}`
        ].join("\n");

        try {
          await api.sendMessage({ body: warningBody }, threadID);
        } catch (errSend) {
          console.error("Failed to send warning message:", errSend);
        }

        // Notify each admin
        const adminMsg = [
          "=== Bot Notification ===",
          "",
          `👤 User: ${userName}`,
          `🆔 UID: ${senderID}`,
          `💬 Message: ${rawWord}`,
          "",
          `Banned from the system. 🔒`
        ].join("\n");

        try {
          const admins = Array.isArray(global.config.ADMINBOT) ? global.config.ADMINBOT : [];
          for (const adminID of admins) {
            try {
              await api.sendMessage(adminMsg, adminID);
            } catch (errAdmin) {
              console.error(`Failed to notify admin ${adminID}:`, errAdmin);
            }
          }
        } catch (errNotifyAll) {
          console.error("Error while notifying admins:", errNotifyAll);
        }

        // Break after first match to avoid multiple notifications for same message
        break;
      }
    }
  } catch (err) {
    console.error("Error in fixspam-ch handleEvent:", err);
  }
};

module.exports.onStart = async function ({ event, api }) {
  try {
    // Friendly informational reply when someone purposely calls the command
    const msg = [
      "⚠️ Automated System Command",
      "",
      "This command runs automatically on message events — you don't need to call it manually.",
      "",
      "When users use bad words against the bot, they will be automatically banned. ✅",
      "",
      "If you are an admin and want to update the bad words list or manage bans, edit the script."
    ].join("\n");

    await api.sendMessage({ body: msg }, event.threadID);
  } catch (err) {
    console.error("Error in fixspam-ch onStart():", err);
  }
};
