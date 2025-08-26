module.exports.config = {
  name: "ronaldo",
  aliases: ["cr7"],
  version: "1.2",
  author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  hasPermssion: 0,
  countDown: 5,
  role: 0,
  shortDescription: "Send random Cristiano Ronaldo photos ⚽🐐",
  longDescription: "Sends high-quality random images of Cristiano Ronaldo with automatic error recovery and progressive retry delay.",
  category: "football",
  usages: "{pn}",
  cooldowns: 5,
  dependencies: {}
};

module.exports.languages = {
  "en": {
    "sending": "🌟 Here Comes The GOAT — Cristiano Ronaldo! 🐐⚽\nEnjoy the picture — requested by {sender}",
    "error_retry": "⚠️ Server busy — retrying ({retry}/{max})...",
    "failed": "❌ Oops! Too many failures. Please try again later."
  },
  "bn": {
    "sending": "🌟 এখানে আসছেন GOAT — Cristiano Ronaldo! 🐐⚽\nছবি নিচ্ছি — অনুরোধকারী {sender}",
    "error_retry": "⚠️ সার্ভার ব্যস্ত — পুনরায় চেষ্টা হচ্ছে ({retry}/{max})...",
    "failed": "❌ দুঃখিত! খুব বেশি ত্রুটি। পরে চেষ্টা করুন।"
  }
};

/**
 * onLoad is optional; kept for compatibility.
 */
module.exports.onLoad = function () {
  // Nothing required on load for this command.
};

/**
 * Core run function — compatible with common GoatBot runtimes.
 * Tries to use message.send if available; otherwise falls back to api.sendMessage.
 */
module.exports.onStart = async function ({ api, event, args, message, Users, Threads }) {
  // Preserve original links exactly as provided (no changes).
  const allLinks = [
    "https://i.imgur.com/gwAuLMT.jpg",
    "https://i.imgur.com/MuuhaJ4.jpg",
    "https://i.imgur.com/6t0R8fs.jpg",
    "https://i.imgur.com/7RTC4W5.jpg",
    "https://i.imgur.com/VTi2dTP.jpg",
    "https://i.imgur.com/gdXJaK9.jpg",
    "https://i.imgur.com/VqZp7IU.jpg",
    "https://i.imgur.com/9pio8Lb.jpg",
    "https://i.imgur.com/iw714Ym.jpg",
    "https://i.imgur.com/zFbcrjs.jpg",
    "https://i.imgur.com/e0td0K9.jpg",
    "https://i.imgur.com/gsJWOmA.jpg",
    "https://i.imgur.com/lU8CaT0.jpg",
    "https://i.imgur.com/mmZXEYl.jpg",
    "https://i.imgur.com/d2Ot9pW.jpg",
    "https://i.imgur.com/iJ1ZGwZ.jpg",
    "https://i.imgur.com/isqQhNQ.jpg",
    "https://i.imgur.com/GoKEy4g.jpg",
    "https://i.imgur.com/TjxTUsl.jpg",
    "https://i.imgur.com/VwPPL03.jpg",
    "https://i.imgur.com/45zAhI7.jpg",
    "https://i.imgur.com/n3agkNi.jpg",
    "https://i.imgur.com/F2mynhI.jpg",
    "https://i.imgur.com/XekHaDO.jpg"
  ].filter(link => link.startsWith('https')); // keep only secure links

  // Fisher-Yates shuffle
  function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Helper: unified sender (tries message.send first, falls back to api.sendMessage)
  async function unifiedSend(payload) {
    // If the caller provided `message` object with send() use that (older GoatBot styles)
    if (message && typeof message.send === "function") {
      return await message.send(payload);
    }

    // Otherwise use api.sendMessage. Accept two payload forms:
    // 1) string
    // 2) object { body, attachment }
    const threadID = (event && (event.threadID || event.senderID)) || null;
    const messageID = (event && event.messageID) || null;

    if (!threadID) {
      // Fallback: try to use api.sendMessage directly without thread id (some runtimes accept)
      return await api.sendMessage(payload, null);
    }

    // api.sendMessage signature varies; most accept (message, threadID, callback, messageID)
    // We'll call with (messageObject, threadID, messageID) hoping runtime supports it.
    // If it requires callback, caller's runtime usually handles returning a promise.
    try {
      return await api.sendMessage(payload, threadID, messageID);
    } catch (err) {
      // Last attempt: try without messageID
      return await api.sendMessage(payload, threadID);
    }
  }

  const maxRetries = 4;
  let retryCount = 0;
  let links = shuffleArray(allLinks);

  // Determine sender name if available (for nicer message)
  let senderName = "Friend";
  try {
    if (event && event.senderID && typeof Users === "object" && Users.getData) {
      // some runtimes provide Users model; best-effort
      const userData = await Users.getData(event.senderID);
      if (userData && userData.name) senderName = userData.name;
    } else if (event && event.senderName) {
      senderName = event.senderName;
    }
  } catch (e) {
    // ignore and keep fallback
  }

  while (retryCount <= maxRetries) {
    try {
      if (links.length === 0) links = shuffleArray(allLinks);
      const imgUrl = links.pop();

      // fetch stream from URL — uses existing global utility as in original code
      const imageStream = await global.utils.getStreamFromURL(imgUrl);

      // Build beautiful message body with emojis
      const bodyText = `🌟 𝐇𝐞𝐫𝐞 𝐂𝐨𝐦𝐞𝐬 𝐓𝐡𝐞 𝐆𝐎𝐀𝐓 — Cristiano Ronaldo! 🐐⚽\n\nRequested by: ${senderName}\n\n— 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;

      // Use unified sender to deliver either with message.send or api.sendMessage
      return await unifiedSend({
        body: bodyText,
        attachment: imageStream
      });
    } catch (error) {
      retryCount++;
      // If possible, let the user know we're retrying (non-blocking best-effort)
      try {
        const retryMsg = `⚠️ Server busy — retrying (${retryCount}/${maxRetries})...`;
        // Fire-and-forget: don't await to avoid long waits; best-effort notification
        if (retryCount <= maxRetries) unifiedSend(retryMsg).catch(() => {});
      } catch (e) {
        // ignore
      }

      if (retryCount > maxRetries) {
        console.error("Ronaldo command failed after retries:", error);
        const failText = `❌ Server overload — too many requests. Please try again in a minute.`;
        return await unifiedSend(failText);
      }

      // Progressive delay: 1s, 2s, 3s, ...
      await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
    }
  }
};
