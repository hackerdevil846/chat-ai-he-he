const moment = require("moment-timezone");

const num = 10; // spam limit (number of commands within time window to trigger ban)
const timee = 120; // time window in seconds

module.exports.config = {
  name: "spamban",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: `𝘼𝙪𝙩𝙤𝙢𝙖𝙩𝙞𝙘 𝙗𝙖𝙣 𝙪𝙨𝙚𝙧 𝙟𝙤𝙙𝙞 ${num} 𝘽𝘼𝙍/${timee} 𝙎𝙀𝘾𝙊𝙉𝘿 𝙢𝙖𝙟𝙝𝙚 𝙨𝙥𝙖𝙢 𝙠𝙤𝙧𝙚`,
  category: "𝙎𝙮𝙨𝙩𝙚𝙢",
  usages: "x",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  try {
    const text = `𝘼𝙪𝙩𝙤𝙢𝙖𝙩𝙞𝙘 𝙗𝙖𝙣 𝙪𝙨𝙚𝙧 𝙟𝙤𝙙𝙞 𝙠𝙚𝙪 ${num} 𝘽𝘼𝙍/${timee} 𝙎𝙀𝘾𝙊𝙉𝘿 𝙢𝙖𝙟𝙝𝙚 𝙨𝙥𝙖𝙢 𝙠𝙤𝙧𝙚`;
    return api.sendMessage(text, event.threadID, event.messageID);
  } catch (err) {
    // prevent bot crash on unexpected error
    console.error("spamban.run error:", err);
  }
};

module.exports.handleEvent = async function ({ Users, Threads, api, event }) {
  try {
    // only proceed for normal messages
    if (!event || !event.threadID || !event.senderID) return;

    const { senderID, threadID } = event;

    // prepare thread data and prefix
    const threadSetting = global.data.threadData && global.data.threadData.get(threadID) ? global.data.threadData.get(threadID) : {};
    const prefix = threadSetting.PREFIX || (global.config && global.config.PREFIX) || "";

    // ignore if message doesn't start with prefix (so only commands count)
    if (!event.body || prefix === "" || event.body.indexOf(prefix) !== 0) return;

    // initialize global.client.autoban map if needed
    if (!global.client) global.client = {};
    if (!global.client.autoban) global.client.autoban = {};

    // initialize user record for autoban
    if (!global.client.autoban[senderID]) {
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };
    }

    // reset counter if time window expired
    const now = Date.now();
    if ((global.client.autoban[senderID].timeStart + (timee * 1000)) <= now) {
      global.client.autoban[senderID] = {
        timeStart: now,
        number: 0
      };
      return; // reset means this command is first in new window; don't increment further this event
    } else {
      // increment count within same time window
      global.client.autoban[senderID].number++;
    }

    // if limit reached -> ban user
    if (global.client.autoban[senderID].number >= num) {
      // fetch thread info safely
      let datathread = {};
      try {
        datathread = (await Threads.getData(threadID)).threadInfo || {};
      } catch (e) {
        datathread.threadName = datathread.threadName || "";
      }
      const namethread = datathread.threadName || "";

      // time string in Asia/Dhaka
      const timeDate = moment.tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");

      // user data
      let dataUser = {};
      try {
        dataUser = await Users.getData(senderID) || {};
      } catch (e) {
        dataUser = { name: "", data: {} };
      }
      let data = dataUser.data || {};

      // if already banned, do nothing
      if (data && data.banned === true) {
        // reset counters anyway so it doesn't spam banning repeatedly
        global.client.autoban[senderID] = {
          timeStart: Date.now(),
          number: 0
        };
        return;
      }

      // set ban fields
      data.banned = true;
      data.reason = `𝙎𝙥𝙖𝙢 𝙗𝙤𝙩 ${num} 𝘽𝘼𝙍/${timee} 𝙎𝙀𝘾𝙊𝙉𝘿` || null;
      data.dateAdded = timeDate;

      // save user data
      try {
        await Users.setData(senderID, { data });
      } catch (e) {
        console.error("spamban: error setting user data:", e);
      }

      // update global banned map if exists
      try {
        if (!global.data) global.data = {};
        if (!global.data.userBanned) global.data.userBanned = new Map();
        global.data.userBanned.set(senderID, { reason: data.reason, dateAdded: data.dateAdded });
      } catch (e) {
        console.error("spamban: error updating global.data.userBanned:", e);
      }

      // reset counter after ban
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };

      // notify thread and admins
      const notifyMsg =
        `😻 https://www.facebook.com/profile.php?id=61571630409265\n` +
        `😻 𝑰𝑫: ${senderID}\n` +
        `😻 𝑵𝑨𝑴𝑬: ${dataUser.name || ""}\n` +
        `😻 𝑹𝑬𝑨𝑺𝑶𝑵: ${num} 𝘽𝘼𝙍/${timee} 𝙎𝙋𝘼𝙈\n\n` +
        `✔️ 𝘼𝘿𝙈𝙄𝙉 𝘽𝙊𝙏𝙀 𝙍𝙀𝙋𝙊𝙍𝙏 𝙃𝙊𝙇𝙊`;

      // send to current thread
      try {
        api.sendMessage(notifyMsg, threadID, () => {
          // send detailed report to admins if ADMINBOT exists
          try {
            const admins = global.config && global.config.ADMINBOT ? global.config.ADMINBOT : [];
            if (Array.isArray(admins) && admins.length > 0) {
              for (let ad of admins) {
                const adminMsg =
                  `😻 𝙎𝙋𝘼𝙈 𝙆𝙊𝙍𝘼𝙍 𝙆𝘼𝙍𝙊𝙉𝙀 𝘽𝘼𝙉\n` +
                  `😻 𝑵𝑨𝑴𝑬: ${dataUser.name || ""}\n` +
                  `😻 𝑰𝑫: ${senderID}\n` +
                  `😻 𝘽𝙊𝙓 𝑰𝑫: ${threadID}\n` +
                  `😻 𝘽𝙊𝙓 𝙉𝘼𝙈𝙀: ${namethread}\n` +
                  `😻 𝙎𝙊𝙈𝙊𝙔: ${timeDate}`;
                api.sendMessage(adminMsg, ad);
              }
            }
          } catch (e) {
            console.error("spamban: error notifying admins:", e);
          }
        });
      } catch (e) {
        console.error("spamban: error sending thread/admin messages:", e);
      }
    }
  } catch (err) {
    console.error("spamban.handleEvent error:", err);
  }
};
