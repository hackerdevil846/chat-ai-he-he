module.exports.config = {
  name: "busy",
  version: "1.6",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Turn on/off do not disturb (busy) mode. When someone tags you, the bot will inform them you're busy.",
  commandCategory: "box chat",
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

/**
 * Helper: Get stored user object (supporting different GoatBot storage APIs).
 * Returns an object like { userID, data } or null.
 */
async function _getUserRecord(userID, Users) {
  try {
    if (Users && typeof Users.getData === 'function') {
      // Some GoatBot implementations: Users.getData(userID) -> { name, data, ... }
      const u = await Users.getData(userID);
      if (u && typeof u === 'object') return u;
    }
  } catch (e) { /* ignore and fallback */ }

  // Fallback to global.db.allUserData
  try {
    if (global.db && Array.isArray(global.db.allUserData)) {
      return global.db.allUserData.find(item => item.userID == userID) || null;
    }
  } catch (e) { /* ignore */ }

  return null;
}

/**
 * Helper: Set user's busy value (supports Users.setData or direct global.db mutation).
 * busyVal: string (reason) or "" / null to remove.
 */
async function _setUserBusy(userID, busyVal, Users) {
  try {
    if (Users && typeof Users.setData === 'function') {
      // Some implementations expect key path like "data.busy" or a full object.
      // Try both safe ways.
      const current = await Users.getData(userID) || {};
      const data = current.data || {};
      if (busyVal) data.busy = busyVal;
      else delete data.busy;
      // prefer setData(userID, updatedObj) if available, else setData(userID, data, "data")
      if (Users.setData.length >= 2) {
        // some setData signature: setData(userID, data)
        await Users.setData(userID, { ...current, data });
      } else if (typeof Users.setData === 'function') {
        // attempt setData(userID, value, path)
        await Users.setData(userID, busyVal, "data.busy");
      }
      return true;
    }
  } catch (e) { /* ignore and fallback */ }

  // Fallback: modify global.db.allUserData
  try {
    if (global.db && Array.isArray(global.db.allUserData)) {
      const rec = global.db.allUserData.find(item => item.userID == userID);
      if (rec) {
        if (busyVal) rec.data = rec.data || {}, rec.data.busy = busyVal;
        else if (rec.data) delete rec.data.busy;
        return true;
      } else {
        // create record if not exists
        const newRec = { userID: userID, data: busyVal ? { busy: busyVal } : {} };
        global.db.allUserData.push(newRec);
        return true;
      }
    }
  } catch (e) { /* ignore */ }

  return false;
}

/**
 * Helper: Read user's busy reason. Returns false if not busy, or the reason string if busy.
 */
async function _getUserBusyReason(userID, Users) {
  try {
    const rec = await _getUserRecord(userID, Users);
    if (!rec) return false;
    // rec.data.busy or rec.busy (some variants)
    if (rec.data && typeof rec.data.busy !== 'undefined') {
      return rec.data.busy || false;
    }
    if (typeof rec.busy !== 'undefined') return rec.busy || false;
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * run - executes when user calls the command:
 *   - `busy` or `busy <reason>` => turn on busy with optional reason
 *   - `busy off` => turn off busy
 */
module.exports.run = async function ({ api, event, args, Users, getLang = (k, ...p) => {
  // fallback simple getLang if environment doesn't provide one
  const lang = (this && this.languages && this.languages.en) ? this.languages.en : module.exports.languages.en;
  let txt = lang[k] || k;
  if (p && p.length) {
    p.forEach((val, idx) => { txt = txt.replace(`%${idx + 1}`, val); });
  }
  return txt;
} }) {
  const { senderID, threadID, messageID } = event;
  const langKey = (event && event.senderID && event.lang) ? event.lang : "en";

  // parse args
  if (args && args.length && args[0].toLowerCase() === "off") {
    // turn off busy
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

/**
 * handleEvent - listens for any message events and replies when someone mentions a busy user.
 * - If the incoming event contains 'mentions' (typical in many frameworks), it will check each mentioned user.
 * - On first busy mention it replies once with the busy info.
 */
module.exports.handleEvent = async function ({ event, api, Users }) {
  try {
    const { threadID, messageID, senderID } = event;

    // Mentions object (common): { "123456789": "@Name", ... }
    const mentions = event.mentions || (event.message && event.message.mentions) || null;
    if (!mentions || Object.keys(mentions).length === 0) return;

    // iterate mentions, check busy state
    for (const userID of Object.keys(mentions)) {
      const reasonBusy = await _getUserBusyReason(userID, Users);
      if (reasonBusy !== false) {
        // prepare display name: sometimes mentions[userID] is '@Name' or the name string
        const displayName = (mentions[userID] || "").toString().replace(/^@/, "") || "User";
        const reply = reasonBusy
          ? module.exports.languages.en.alreadyOnWithReason.replace("%1", displayName).replace("%2", reasonBusy)
          : module.exports.languages.en.alreadyOn.replace("%1", displayName);

        // Send the reply once (do not spam for multiple busy mentions)
        return api.sendMessage(reply, threadID, messageID);
      }
    }
  } catch (err) {
    // silent fail to avoid generating extra errors in runtime
    // console.error("[busy] handleEvent error:", err);
  }
};

/**
 * Optional onLoad hook: nothing needed but kept for completeness.
 */
module.exports.onLoad = function ({ }) {
  // No on-load actions needed currently.
};
