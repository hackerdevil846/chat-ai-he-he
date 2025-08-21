module.exports.config = {
  name: "friends",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "📜 List friends and manage your Facebook friends list",
  commandCategory: "admin",
  usages: "[page number]",
  cooldowns: 5
};

module.exports.languages = {
  "en": {
    invalidPage: "⚠️ Invalid page number! Only %1 pages available.",
    emptyList: "📭 Your Facebook friends list is empty.",
    fetchError: "⚠️ An error occurred while fetching your friends list.",
    removeError: "⚠️ An error occurred while processing your request.",
    noValid: "❌ No valid friends were selected for removal.",
    removed: "✅ Successfully removed %1 friend(s):\n\n%2"
  },
  "bn": {
    invalidPage: "⚠️ ভুল পেজ নাম্বার! শুধুমাত্র %1 পেজ আছে।",
    emptyList: "📭 আপনার ফেসবুক ফ্রেন্ডলিস্ট খালি।",
    fetchError: "⚠️ ফ্রেন্ডলিস্ট আনতে সমস্যা হয়েছে।",
    removeError: "⚠️ রিকোয়েস্ট প্রসেস করতে সমস্যা হয়েছে।",
    noValid: "❌ কোন বৈধ ফ্রেন্ড সিলেক্ট করা হয়নি।",
    removed: "✅ সফলভাবে %1 জন ফ্রেন্ড রিমুভ হয়েছে:\n\n%2"
  }
};

module.exports.handleReply = async function({ api, event, handleReply, getText }) {
  const { threadID, senderID } = event;

  try {
    if (senderID.toString() !== handleReply.author) return;

    let msg = "";
    let processed = 0;
    const { uidUser, nameUser, urlUser } = handleReply;

    // --- Handle "all"
    if (event.body.toLowerCase() === "all") {
      for (let i = 0; i < uidUser.length; i++) {
        try {
          await api.removeFriend(uidUser[i]);
          msg += `👤 ${nameUser[i]}\n🔗 ${urlUser[i]}\n\n`;
          processed++;
        } catch (e) {
          console.error(`Failed to remove ${nameUser[i]}:`, e);
        }
      }
    } else {
      // --- Handle number selections
      const selections = event.body.split(',')
        .flatMap(item => {
          if (item.includes('-')) {
            const [start, end] = item.split('-').map(Number);
            if (start > end) return [];
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
          }
          return Number(item.trim());
        })
        .filter(num => !isNaN(num) && num > 0 && num <= uidUser.length);

      const uniqueSelections = [...new Set(selections)];

      for (const num of uniqueSelections) {
        try {
          await api.removeFriend(uidUser[num - 1]);
          msg += `👤 ${nameUser[num - 1]}\n🔗 ${urlUser[num - 1]}\n\n`;
          processed++;
        } catch (e) {
          console.error(`Failed to remove ${nameUser[num - 1]}:`, e);
        }
      }
    }

    // --- Send result
    if (processed > 0) {
      api.sendMessage(
        getText("removed", processed, msg),
        threadID,
        () => api.unsendMessage(handleReply.messageID)
      );
    } else {
      api.sendMessage(getText("noValid"), threadID);
    }
  } catch (err) {
    console.error("Friends reply error:", err);
    api.sendMessage(getText("removeError"), threadID);
  }
};

module.exports.run = async function({ api, event, args, getText }) {
  const { threadID, senderID } = event;

  try {
    // --- Fetch friends
    const friendsList = await api.getFriendsList();
    const friendCount = friendsList.length;

    if (friendCount === 0) {
      return api.sendMessage(getText("emptyList"), threadID);
    }

    // --- Format data
    const formattedFriends = friendsList.map(friend => ({
      name: friend.fullName || "Unknown Name",
      uid: friend.userID,
      gender: friend.gender || "Unknown",
      vanity: friend.vanity || "No Vanity",
      profileUrl: friend.profileUrl || "https://www.facebook.com"
    }));

    // --- Pagination
    const page = Math.max(1, parseInt(args[0]) || 1);
    const perPage = 10;
    const totalPages = Math.ceil(formattedFriends.length / perPage);

    if (page > totalPages) {
      return api.sendMessage(getText("invalidPage", totalPages), threadID);
    }

    let message = `👥 You have ${friendCount} friends\n📄 Page ${page}/${totalPages}\n\n`;
    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(page * perPage, formattedFriends.length);

    for (let i = startIndex; i < endIndex; i++) {
      const friend = formattedFriends[i];
      const num = i + 1;
      message += `🔢 ${num}. ${friend.name}\n🆔 ID: ${friend.uid}\n🌕 Gender: ${friend.gender}\n🎭 Vanity: ${friend.vanity}\n🔗 Profile: ${friend.profileUrl}\n\n`;
    }

    message += `📌 Removal Instructions:\n`
      + `• Single: 1, 3, 5\n`
      + `• Range: 1-5\n`
      + `• Combined: 1, 3-5, 7\n`
      + `• All: type "all"\n\n`
      + `✍️ Reply to this message with your selection`;

    // --- Store reply data
    const nameUser = formattedFriends.map(f => f.name);
    const urlUser = formattedFriends.map(f => f.profileUrl);
    const uidUser = formattedFriends.map(f => f.uid);

    return api.sendMessage(message, threadID, (err, info) => {
      if (err) {
        console.error("Failed to send friends list:", err);
        return api.sendMessage("❌ Failed to display friends list.", threadID);
      }

      global.GoatBot.onReply.set(info.messageID, {
        commandName: module.exports.config.name,
        author: senderID,
        messageID: info.messageID,
        nameUser,
        urlUser,
        uidUser,
        type: 'reply'
      });
    });

  } catch (err) {
    console.error("Friends command error:", err);
    return api.sendMessage(getText("fetchError"), threadID);
  }
};
