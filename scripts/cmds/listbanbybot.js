module.exports.config = {
  name: "ban",
  version: "1.0.3",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑩𝒂𝒏/𝑼𝒏𝒃𝒂𝒏 𝒎𝒐𝒅𝒖𝒍𝒆 𝒇𝒐𝒓 𝒂𝒅𝒎𝒊𝒏𝒔",
  category: "𝑨𝒅𝒎𝒊𝒏",
  usages: "[𝒕𝒉𝒓𝒆𝒂𝒅/𝒖𝒔𝒆𝒓]",
  cooldowns: 5
};

module.exports.languages = {
  "en": {
    "no_banned_groups": "Currently there are no banned groups! ✅",
    "no_banned_users": "Currently there are no banned users! ✅",
    "invalid_order": "Invalid order number! ⚠️",
    "only_initiator": "Only the initiator can use this command! ⚠️",
    "error_processing": "An error occurred while processing! ⚠️"
  },
  "bn": {
    "no_banned_groups": "এখন কোন banned গ্রুপ নেই! ✅",
    "no_banned_users": "এখন কোন banned ইউজার নেই! ✅",
    "invalid_order": "অবৈধ অর্ডার নাম্বার! ⚠️",
    "only_initiator": "শুধুমাত্র যিনি কমান্ড চালিয়েছিলেন তিনি ব্যবহার করতে পারেন! ⚠️",
    "error_processing": "প্রসেসিং করার সময় একটি ত্রুটি ঘটেছে! ⚠️"
  }
};

module.exports.onLoad = function () {
  // Ensure handleReply array exists so push won't fail
  if (!global.client) global.client = {};
  if (!global.client.handleReply) global.client.handleReply = [];
};

module.exports.run = async function ({ api, event, Users, Threads, args }) {
  const { threadID, messageID } = event;
  let listBanned = [];
  let i = 1;

  try {
    switch ((args[0] || "").toLowerCase()) {
      case "thread":
      case "t":
      case "-t": {
        const threadBanned = Array.from(global.data.threadBanned.keys());

        for (const singleThread of threadBanned) {
          // Try to get a readable thread name
          const dataThread = (await Threads.getData(singleThread)) || {};
          const threadInfo = dataThread.threadInfo || {};
          const nameT = threadInfo.threadName || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑮𝒓𝒐𝒖𝒑";

          // Include an ASCII ID line to guarantee reliable ID extraction later
          listBanned.push(`${i++}. ${nameT}\n🍂 𝑻𝑰𝑫: ${singleThread}\nID: ${singleThread}`);
        }

        if (listBanned.length === 0) {
          return api.sendMessage(this.languages.en.no_banned_groups, threadID, messageID);
        }

        return api.sendMessage(
          `📋 𝑪𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 ${listBanned.length} 𝒃𝒂𝒏𝒏𝒆𝒅 𝒈𝒓𝒐𝒖𝒑𝒔:\n\n${listBanned.join("\n")}\n\n📝 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒐𝒓𝒅𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓 𝒕𝒐 𝒖𝒏𝒃𝒂𝒏`,
          threadID,
          (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "unbanthread",
              listBanned
            });
          },
          messageID
        );
      }

      case "user":
      case "u":
      case "-u": {
        const userBanned = Array.from(global.data.userBanned.keys());

        for (const singleUser of userBanned) {
          const name = global.data.userName.get(singleUser) || await Users.getNameUser(singleUser) || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";
          listBanned.push(`${i++}. ${name}\n🍁 𝑰𝑫: ${singleUser}\nID: ${singleUser}`);
        }

        if (listBanned.length === 0) {
          return api.sendMessage(this.languages.en.no_banned_users, threadID, messageID);
        }

        return api.sendMessage(
          `📋 𝑪𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 ${listBanned.length} 𝒃𝒂𝒏𝒏𝒆𝒅 𝒖𝒔𝒆𝒓𝒔:\n\n${listBanned.join("\n")}\n\n📝 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒐𝒓𝒅𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓 𝒕𝒐 𝒖𝒏𝒃𝒂𝒏`,
          threadID,
          (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "unbanuser",
              listBanned
            });
          },
          messageID
        );
      }

      default: {
        const helpMessage = `» 𝑩𝒂𝒏 𝑴𝒐𝒅𝒖𝒍𝒆 «\n━━━━━━━━━━━━━━━━━━\n🔹 𝑼𝒔𝒂𝒈𝒆: ${global.config.PREFIX || "!"}ban [option]\n\n🔸 𝑶𝒑𝒕𝒊𝒐𝒏𝒔:\n  • thread / t - Show banned groups\n  • user / u   - Show banned users\n\n📝 𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂 𝒍𝒊𝒔𝒕𝒆𝒅 𝒊𝒕𝒆𝒎 𝒘𝒊𝒕𝒉 𝒊𝒕𝒔 𝒐𝒓𝒅𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓 𝒕𝒐 𝒖𝒏𝒃𝒂𝒏`;
        return api.sendMessage(helpMessage, threadID, messageID);
      }
    }
  } catch (error) {
    console.error(error);
    return api.sendMessage(this.languages.en.error_processing, threadID, messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply, Users, Threads }) {
  const { threadID, messageID, senderID, body } = event;

  try {
    // Only the author who triggered the list can unban via reply
    if (parseInt(senderID) !== parseInt(handleReply.author)) {
      return api.sendMessage(this.languages.en.only_initiator, threadID, messageID);
    }

    const orderNumber = parseInt(body.trim());
    if (isNaN(orderNumber) || orderNumber < 1 || orderNumber > handleReply.listBanned.length) {
      return api.sendMessage(this.languages.en.invalid_order, threadID, messageID);
    }

    const selectedItem = handleReply.listBanned[orderNumber - 1];

    // Extract the first long digit sequence in the selected item (ID/TID)
    const idMatch = selectedItem.match(/(\d{4,})/);
    if (!idMatch) {
      return api.sendMessage("Failed to extract ID! ⚠️", threadID, messageID);
    }

    const targetID = idMatch[1];
    const userName = await Users.getNameUser(senderID);
    let targetName = "𝑼𝒏𝒌𝒏𝒐𝒘𝒏";

    switch (handleReply.type) {
      case "unbanthread": {
        const threadInfo = await Threads.getInfo(targetID);
        targetName = (threadInfo && threadInfo.threadName) ? threadInfo.threadName : "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑮𝒓𝒐𝒖𝒑";

        // Update stored thread data (if exists)
        const threadDataObj = (await Threads.getData(targetID)) || {};
        const threadData = threadDataObj.data || {};
        threadData.banned = false;
        threadData.reason = null;
        threadData.dateAdded = null;

        await Threads.setData(targetID, { data: threadData });
        if (global.data && global.data.threadBanned) global.data.threadBanned.delete(targetID);

        // Notify the group and the admin who unbanned
        api.sendMessage(
          `» 𝑵𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 «\n━━━━━━━━━━━━━━━━━━\n${userName} 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅 𝒕𝒉𝒊𝒔 𝒃𝒐𝒕 𝒇𝒓𝒐𝒎 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑\n\n- 𝑻𝒉𝒆 𝒈𝒓𝒐𝒖𝒑 '${targetName}' 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅`,
          targetID
        );

        return api.sendMessage(
          `✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔\n━━━━━━━━━━━━━━━━━━\n${userName} 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅 𝒈𝒓𝒐𝒖𝒑:\n→ ${targetName}`,
          threadID,
          messageID
        );
      }

      case "unbanuser": {
        targetName = await Users.getNameUser(targetID) || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";

        // Update stored user data (if exists)
        const userDataObj = (await Users.getData(targetID)) || {};
        const userData = userDataObj.data || {};
        userData.banned = false;
        userData.reason = null;
        userData.dateAdded = null;

        await Users.setData(targetID, { data: userData });
        if (global.data && global.data.userBanned) global.data.userBanned.delete(targetID);

        // Notify the user (if possible) and the admin who unbanned
        api.sendMessage(
          `» 𝑵𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 «\n━━━━━━━━━━━━━━━━━━\n${userName} 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅 𝒚𝒐𝒖 𝒇𝒓𝒐𝒎 𝒂𝒅𝒎𝒊𝒏\n\n- 𝒀𝒐𝒖'𝒗𝒆 𝒃𝒆𝒆𝒏 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅 𝒇𝒓𝒐𝒎 𝒕𝒉𝒆 𝒃𝒐𝒕`,
          targetID
        );

        return api.sendMessage(
          `✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔\n━━━━━━━━━━━━━━━━━━\n${userName} 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅 𝒖𝒔𝒆𝒓:\n→ ${targetName}`,
          threadID,
          messageID
        );
      }

      default:
        return api.sendMessage(this.languages.en.error_processing, threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    return api.sendMessage(this.languages.en.error_processing, threadID, messageID);
  }
};
