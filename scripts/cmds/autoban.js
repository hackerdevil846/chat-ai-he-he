const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "fixspam-ch",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑏𝑎𝑛 𝑢𝑠𝑒𝑟𝑠 𝑤ℎ𝑜 𝑢𝑠𝑒 𝑏𝑎𝑑 𝑤𝑜𝑟𝑑𝑠 𝑎𝑔𝑎𝑖𝑛𝑠𝑡 𝑡ℎ𝑒 𝑏𝑜𝑡",
    category: "system",
    usages: "noprefix",
    cooldowns: 0,
    dependencies: {}
  },

  languages: {
    "en": {
      "banned_notice_subject": "» 𝑁𝑜𝑡𝑖𝑐𝑒 𝑓𝑟𝑜𝑚 𝑂𝑤𝑛𝑒𝑟 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 «",
      "banned_message": "{𝑛𝑎𝑚𝑒}, 𝑦𝑜𝑢 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑏𝑎𝑛𝑛𝑒𝑑 𝑓𝑟𝑜𝑚 𝑢𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑠𝑦𝑠𝑡𝑒𝑚 𝑓𝑜𝑟 𝑢𝑠𝑖𝑛𝑔 𝑖𝑛𝑎𝑝𝑝𝑟𝑜𝑝𝑟𝑖𝑎𝑡𝑒 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒.",
      "auto_command_msg": "⚠️ 𝑇ℎ𝑖𝑠 𝑖𝑠 𝑎𝑛 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑒𝑑 𝑠𝑦𝑠𝑡𝑒𝑚 𝑐𝑜𝑚𝑚𝑎𝑛𝑑. 𝐼𝑡 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑏𝑒 𝑐𝑎𝑙𝑙𝑒𝑑 𝑚𝑎𝑛𝑢𝑎𝑙𝑙𝑦.\n\n𝑊ℎ𝑒𝑛 𝑢𝑠𝑒𝑟𝑠 𝑢𝑠𝑒 𝑏𝑎𝑑 𝑤𝑜𝑟𝑑𝑠 𝑎𝑔𝑎𝑖𝑛𝑠𝑡 𝑡ℎ𝑒 𝑏𝑜𝑡, 𝑡ℎ𝑒𝑦 𝑤𝑖𝑙𝑙 𝑏𝑒 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑏𝑎𝑛𝑛𝑒𝑑. ✅",
      "admin_notify_subject": "=== 𝐵𝑜𝑡 𝑁𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 ===",
      "admin_notify_body": "👤 𝑈𝑠𝑒𝑟: {𝑛𝑎𝑚𝑒}\n🆔 𝑈𝐼𝐷: {𝑢𝑖𝑑}\n💬 𝑀𝑒𝑠𝑠𝑎𝑔𝑒: {𝑚𝑠𝑔}\n\n𝐵𝑎𝑛𝑛𝑒𝑑 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑠𝑦𝑠𝑡𝑒𝑚."
    },
    "bn": {
      "auto_command_msg": "⚠️ এটী একটি অটোমেটেড সিস্টেম কমান্ড। ম্যানুয়ালি কল করার দরকার নেই।\n\nযদি কেউ বটকে গালি দেয়, তারা স্বয়ংক্রিয়ভাবে ব্যান হয়ে যাবে। ✅"
    }
  },

  onLoad: function () {
    // 𝐸𝑛𝑠𝑢𝑟𝑒 𝑔𝑙𝑜𝑏𝑎𝑙.𝑑𝑎𝑡𝑎.𝑢𝑠𝑒𝑟𝐵𝑎𝑛𝑛𝑒𝑑 𝑒𝑥𝑖𝑠𝑡𝑠 𝑎𝑛𝑑 𝑖𝑠 𝑎 𝑀𝑎𝑝
    if (!global.data) global.data = {};
    if (!global.data.userBanned) global.data.userBanned = new Map();

    // 𝐸𝑛𝑠𝑢𝑟𝑒 𝑡ℎ𝑒𝑟𝑒 𝑖𝑠 𝑎𝑛 𝐴𝐷𝑀𝐼𝑁𝐵𝑂𝑇 𝑎𝑟𝑟𝑎𝑦 𝑡𝑜 𝑛𝑜𝑡𝑖𝑓𝑦
    if (!global.config) global.config = {};
    if (!global.config.ADMINBOT) global.config.ADMINBOT = [];
  },

  handleEvent: async function ({ event, api, Users }) {
    try {
      const threadID = event.threadID || event.threadId || (event.message && event.message.threadID);
      const senderID = event.senderID || (event.message && event.message.senderID);
      let body = (event.body || (event.message && (event.message.text || event.message.body)) || "");
      if (!body || typeof body !== "string") return;

      // 𝐷𝑜𝑛'𝑡 𝑟𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑒 𝑏𝑜𝑡'𝑠 𝑜𝑤𝑛 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠
      try {
        const selfID = typeof api.getCurrentUserID === "function" ? await api.getCurrentUserID() : (api.getCurrentUserID || null);
        if (selfID && senderID == selfID) return;
      } catch (errSelf) {
        // 𝑖𝑔𝑛𝑜𝑟𝑒 𝑒𝑟𝑟𝑜𝑟𝑠
      }

      const bodyNormalized = body.toLowerCase();

      // 𝐵𝑎𝑑 𝑤𝑜𝑟𝑑𝑠 𝑙𝑖𝑠𝑡
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

      for (const rawWord of badWords) {
        if (!rawWord) continue;
        const word = rawWord.toLowerCase().trim();
        if (!word) continue;

        if (bodyNormalized.includes(word)) {
          let userName = senderID;
          try {
            userName = await Users.getNameUser(senderID) || senderID;
          } catch (e) {
            // 𝑖𝑔𝑛𝑜𝑟𝑒
          }

          console.log(`𝐵𝑎𝑑 𝑤𝑜𝑟𝑑 𝑑𝑒𝑡𝑒𝑐𝑡𝑒𝑑: ${userName} 𝑠𝑎𝑖𝑑 "${rawWord}"`);

          let time = "";
          try {
            const moment = require("moment-timezone");
            time = moment().tz("Asia/Dhaka").format("HH:mm:ss, DD/MM/YYYY");
          } catch (errMoment) {
            time = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });
          }

          try {
            const userData = (await Users.getData(senderID)) || {};
            userData.banned = 1;
            userData.reason = rawWord;
            userData.dateAdded = time;
            await Users.setData(senderID, userData);

            if (!global.data) global.data = {};
            if (!global.data.userBanned) global.data.userBanned = new Map();
            global.data.userBanned.set(senderID, {
              reason: userData.reason,
              dateAdded: userData.dateAdded
            });
          } catch (errSetData) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑡 𝑢𝑠𝑒𝑟 𝑑𝑎𝑡𝑎 𝑓𝑜𝑟 𝑏𝑎𝑛:", errSetData);
          }

          const warningBody = [
            "» 𝑁𝑜𝑡𝑖𝑐𝑒 𝑓𝑟𝑜𝑚 𝑂𝑤𝑛𝑒𝑟 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 «",
            "",
            `${userName}, 𝑦𝑜𝑢 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑏𝑎𝑛𝑛𝑒𝑑 𝑓𝑟𝑜𝑚 𝑢𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑠𝑦𝑠𝑡𝑒𝑚 𝑓𝑜𝑟 𝑢𝑠𝑖𝑛𝑔 𝑖𝑛𝑎𝑝𝑝𝑟𝑜𝑝𝑟𝑖𝑎𝑡𝑒 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒. 🚫`,
            "",
            `𝑅𝑒𝑎𝑠𝑜𝑛: "${rawWord}"`,
            `𝑇𝑖𝑚𝑒: ${time}`
          ].join("\n");

          try {
            await api.sendMessage({ body: warningBody }, threadID);
          } catch (errSend) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑤𝑎𝑟𝑛𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", errSend);
          }

          const adminMsg = [
            "=== 𝐵𝑜𝑡 𝑁𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 ===",
            "",
            `👤 𝑈𝑠𝑒𝑟: ${userName}`,
            `🆔 𝑈𝐼𝐷: ${senderID}`,
            `💬 𝑀𝑒𝑠𝑠𝑎𝑔𝑒: ${rawWord}`,
            "",
            `𝐵𝑎𝑛𝑛𝑒𝑑 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑠𝑦𝑠𝑡𝑒𝑚. 🔒`
          ].join("\n");

          try {
            const admins = Array.isArray(global.config.ADMINBOT) ? global.config.ADMINBOT : [];
            for (const adminID of admins) {
              try {
                await api.sendMessage(adminMsg, adminID);
              } catch (errAdmin) {
                console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑛𝑜𝑡𝑖𝑓𝑦 𝑎𝑑𝑚𝑖𝑛 ${adminID}:`, errAdmin);
              }
            }
          } catch (errNotifyAll) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑤ℎ𝑖𝑙𝑒 𝑛𝑜𝑡𝑖𝑓𝑦𝑖𝑛𝑔 𝑎𝑑𝑚𝑖𝑛𝑠:", errNotifyAll);
          }

          break;
        }
      }
    } catch (err) {
      console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑓𝑖𝑥𝑠𝑝𝑎𝑚-𝑐ℎ ℎ𝑎𝑛𝑑𝑙𝑒𝐸𝑣𝑒𝑛𝑡:", err);
    }
  },

  onStart: async function ({ event, api }) {
    try {
      const msg = [
        "⚠️ 𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑒𝑑 𝑆𝑦𝑠𝑡𝑒𝑚 𝐶𝑜𝑚𝑚𝑎𝑛𝑑",
        "",
        "𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑟𝑢𝑛𝑠 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑜𝑛 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑒𝑣𝑒𝑛𝑡𝑠 — 𝑦𝑜𝑢 𝑑𝑜𝑛'𝑡 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑐𝑎𝑙𝑙 𝑖𝑡 𝑚𝑎𝑛𝑢𝑎𝑙𝑙𝑦.",
        "",
        "𝑊ℎ𝑒𝑛 𝑢𝑠𝑒𝑟𝑠 𝑢𝑠𝑒 𝑏𝑎𝑑 𝑤𝑜𝑟𝑑𝑠 𝑎𝑔𝑎𝑖𝑛𝑠𝑡 𝑡ℎ𝑒 𝑏𝑜𝑡, 𝑡ℎ𝑒𝑦 𝑤𝑖𝑙𝑙 𝑏𝑒 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑏𝑎𝑛𝑛𝑒𝑑. ✅",
        "",
        "𝐼𝑓 𝑦𝑜𝑢 𝑎𝑟𝑒 𝑎𝑛 𝑎𝑑𝑚𝑖𝑛 𝑎𝑛𝑑 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑢𝑝𝑑𝑎𝑡𝑒 𝑡ℎ𝑒 𝑏𝑎𝑑 𝑤𝑜𝑟𝑑𝑠 𝑙𝑖𝑠𝑡 𝑜𝑟 𝑚𝑎𝑛𝑎𝑔𝑒 𝑏𝑎𝑛𝑠, 𝑒𝑑𝑖𝑡 𝑡ℎ𝑒 𝑠𝑐𝑟𝑖𝑝𝑡."
      ].join("\n");

      await api.sendMessage({ body: msg }, event.threadID);
    } catch (err) {
      console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑓𝑖𝑥𝑠𝑝𝑎𝑚-𝑐ℎ 𝑜𝑛𝑆𝑡𝑎𝑟𝑡():", err);
    }
  }
};
