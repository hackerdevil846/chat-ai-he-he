module.exports.config = {
  name: "busy",
  version: "1.6",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Turn on/off do not disturb (busy) mode. When someone tags you, the bot will inform them you're busy.",
  category: "box chat",
  usages: "[empty | <reason>]   OR   off",
  cooldowns: 5,
  dependencies: {}
};

module.exports.languages = {
  "bn": {
    "turnedOff": "✅ | Do not disturb mode off kora hoise.",
    "turnedOn": "✅ | Do not disturb mode on kora hoise.",
    "turnedOnWithReason": "✅ | Busy mode on kora hoise, karon: %1",
    "turnedOnWithoutReason": "✅ | Busy mode on kora hoise. Ami apnake pore bole dibo! 😉",
    "alreadyOn": "⚠️ | %1 ekhono busy ache.",
    "alreadyOnWithReason": "⚠️ | %1 ekhono busy ache. Karon: %2"
  },
  "en": {
    "turnedOff": "✅ | Do not disturb mode has been turned off.",
    "turnedOn": "✅ | Do not disturb mode has been turned on.",
    "turnedOnWithReason": "✅ | Do not disturb mode has been turned on with reason: %1",
    "turnedOnWithoutReason": "✅ | Do not disturb mode has been turned on.",
    "alreadyOn": "⚠️ | User %1 is currently busy.",
    "alreadyOnWithReason": "⚠️ | User %1 is currently busy. Reason: %2"
  }
};

async function _getUserRecord(userID, Users) {
  try {
    if (Users && typeof Users.getData === 'function') {
      const u = await Users.getData(userID);
      if (u && typeof u === 'object') return u;
    }
  } catch (e) { }

  try {
    if (global.db && Array.isArray(global.db.allUserData)) {
      return global.db.allUserData.find(item => item.userID == userID) || null;
    }
  } catch (e) { }

  return null;
}

async function _setUserBusy(userID, busyVal, Users) {
  try {
    if (Users && typeof Users.setData === 'function') {
      const current = await Users.getData(userID) || {};
      const data = current.data || {};
      if (busyVal) data.busy = busyVal;
      else delete data.busy;
      if (Users.setData.length >= 2) {
        await Users.setData(userID, { ...current, data });
      } else if (typeof Users.setData === 'function') {
        await Users.setData(userID, busyVal, "data.busy");
      }
      return true;
    }
  } catch (e) { }

  try {
    if (global.db && Array.isArray(global.db.allUserData)) {
      const rec = global.db.allUserData.find(item => item.userID == userID);
      if (rec) {
        if (busyVal) rec.data = rec.data || {}, rec.data.busy = busyVal;
        else if (rec.data) delete rec.data.busy;
        return true;
      } else {
        const newRec = { userID: userID, data: busyVal ? { busy: busyVal } : {} };
        global.db.allUserData.push(newRec);
        return true;
      }
    }
  } catch (e) { }

  return false;
}

async function _getUserBusyReason(userID, Users) {
  try {
    const rec = await _getUserRecord(userID, Users);
    if (!rec) return false;
    if (rec.data && typeof rec.data.busy !== 'undefined') {
      return rec.data.busy || false;
    }
    if (typeof rec.busy !== 'undefined') return rec.busy || false;
    return false;
  } catch (e) {
    return false;
  }
}

module.exports.onStart = async function ({ api, event, args, Users, getLang = (k, ...p) => {
  const lang = (this && this.languages && this.languages.en) ? this.languages.en : module.exports.languages.en;
  let txt = lang[k] || k;
  if (p && p.length) {
    p.forEach((val, idx) => { txt = txt.replace(`%${idx + 1}`, val); });
  }
  return txt;
} }) {
  const { senderID, threadID, messageID } = event;

  if (args && args.length && args[0].toLowerCase() === "off") {
    await _setUserBusy(senderID, null, Users);
    return api.sendMessage(getLang.call(module.exports, "turnedOff"), threadID, messageID);
  }

  const reason = args && args.length ? args.join(" ").trim() : "";
  await _setUserBusy(senderID, reason, Users);
  return api.sendMessage(
    reason ? getLang.call(module.exports, "turnedOnWithReason", reason) : getLang.call(module.exports, "turnedOnWithoutReason"),
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({ event, api, Users }) {
  try {
    const { threadID, messageID, senderID } = event;

    const mentions = event.mentions || (event.message && event.message.mentions) || null;
    if (!mentions || Object.keys(mentions).length === 0) return;

    for (const userID of Object.keys(mentions)) {
      const reasonBusy = await _getUserBusyReason(userID, Users);
      if (reasonBusy !== false) {
        const displayName = (mentions[userID] || "").toString().replace(/^@/, "") || "User";
        const reply = reasonBusy
          ? module.exports.languages.en.alreadyOnWithReason.replace("%1", displayName).replace("%2", reasonBusy)
          : module.exports.languages.en.alreadyOn.replace("%1", displayName);

        return api.sendMessage(reply, threadID, messageID);
      }
    }
  } catch (err) {
  }
};

module.exports.onLoad = function ({ }) {
};
