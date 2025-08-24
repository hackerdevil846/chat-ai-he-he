module.exports.config = {
  name: "unban",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝙂𝙧𝙪𝙥 𝙖𝙧 𝙪𝙨𝙚𝙧𝙙𝙚𝙧 𝙗𝙖𝙣 𝙨𝙤𝙢𝙪𝙝𝙤 𝙚𝙠 𝙨𝙖𝙩𝙝𝙚 𝙢𝙪𝙘𝙝𝙚 𝙙𝙚𝙤𝙖",
  category: "𝙎𝙮𝙨𝙩𝙚𝙢",
  usages: "unban",
  cooldowns: 2,
  dependencies: {}
};

module.exports.run = async ({ event, api, Users, Threads, args }) => {
  const { threadID, messageID } = event;

  // credit check (preserve exactly the credit string requested)
  const { commands } = global.client;
  const command = commands.get("unban");
  const credit = command && command.config ? command.config.credits : "";
  const requiredCredit = "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅";
  if (credit !== requiredCredit) {
    return api.sendMessage(`❌ 𝙒𝙧𝙤𝙣𝙜 𝙘𝙧𝙚𝙙𝙞𝙩! 𝙆𝙝𝙖𝙡𝙞 𝙈𝙖𝙝𝙢𝙪𝙙 𝙗𝙖𝙗𝙤𝙝𝙖𝙧 𝙠𝙤𝙧𝙩𝙚 𝙥𝙖𝙧𝙗𝙚𝙣`, threadID, messageID);
  }

  // thread settings / prefix if needed (kept as original pattern)
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  switch ((args[0] || "").toLowerCase()) {
    case 'admin':
    case 'ad': {
      const listAdmin = Array.isArray(global.config.ADMINBOT) ? global.config.ADMINBOT : [];
      for (const idad of listAdmin) {
        const userData = (await Users.getData(idad)).data || {};
        userData.banned = 0;
        userData.reason = null;
        userData.dateAdded = null;
        await Users.setData(idad, { data: userData });
        if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') global.data.userBanned.delete(idad);
      }
      return api.sendMessage("✅ 𝙎𝙖𝙗 𝘼𝙙𝙢𝙞𝙣 𝘽𝙤𝙩 𝙠𝙚 𝙪𝙣𝙗𝙖𝙣 𝙠𝙤𝙧𝙖 𝙝𝙤𝙮𝙚𝙘𝙝𝙚", threadID, messageID);
    }

    case 'ndh': {
      const listNDH = Array.isArray(global.config.NDH) ? global.config.NDH : [];
      for (const idNDH of listNDH) {
        const userData = (await Users.getData(idNDH)).data || {};
        userData.banned = 0;
        userData.reason = null;
        userData.dateAdded = null;
        await Users.setData(idNDH, { data: userData });
        if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') global.data.userBanned.delete(idNDH);
      }
      return api.sendMessage("✅ 𝙎𝙖𝙗 𝙎𝙪𝙥𝙥𝙤𝙧𝙩𝙚𝙧𝙙𝙚𝙧 𝙠𝙚 𝙪𝙣𝙗𝙖𝙣 𝙠𝙤𝙧𝙖 𝙝𝙤𝙮𝙚𝙘𝙝𝙚", threadID, messageID);
    }

    case 'allbox':
    case 'allthread': {
      const threadBanned = (global.data.threadBanned && typeof global.data.threadBanned.keys === 'function')
        ? Array.from(global.data.threadBanned.keys())
        : [];
      for (const singleThread of threadBanned) {
        const threadData = (await Threads.getData(singleThread)).data || {};
        threadData.banned = 0;
        threadData.reason = null;
        threadData.dateAdded = null;
        await Threads.setData(singleThread, { data: threadData });
        if (global.data.threadBanned && typeof global.data.threadBanned.delete === 'function') global.data.threadBanned.delete(singleThread);
      }
      return api.sendMessage("✅ 𝙎𝙖𝙧𝙗𝙖𝙨𝙬𝙖𝙨𝙚𝙧𝙞 𝙜𝙧𝙪𝙥 𝙨𝙖𝙢𝙪𝙝𝙚 𝙨𝙚𝙧𝙫𝙚𝙧 𝙩𝙝𝙚𝙠𝙚 𝙪𝙣𝙗𝙖𝙣 𝙠𝙤𝙧𝙖 𝙝𝙤𝙮𝙚𝙘𝙝𝙚", threadID, messageID);
    }

    case 'box':
    case 'thread': {
      const idbox = threadID;
      const tData = (await Threads.getData(idbox)).data || {};
      tData.banned = 0;
      tData.reason = null;
      tData.dateAdded = null;
      await Threads.setData(idbox, { data: tData });
      if (global.data.threadBanned && typeof global.data.threadBanned.delete === 'function') global.data.threadBanned.delete(idbox);
      return api.sendMessage("✅ 𝙀 𝙜𝙧𝙪𝙥𝙚𝙧 𝙗𝙖𝙣 𝙢𝙪𝙘𝙝𝙚 𝙙𝙚𝙤𝙖 𝙝𝙤𝙮𝙚𝙘𝙝𝙚", threadID, messageID);
    }

    case 'allmember':
    case 'alluser': {
      const userBanned = (global.data.userBanned && typeof global.data.userBanned.keys === 'function')
        ? Array.from(global.data.userBanned.keys())
        : [];
      for (const singleUser of userBanned) {
        const uData = (await Users.getData(singleUser)).data || {};
        uData.banned = 0;
        uData.reason = null;
        uData.dateAdded = null;
        await Users.setData(singleUser, { data: uData });
        if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') global.data.userBanned.delete(singleUser);
      }
      return api.sendMessage("✅ 𝙎𝙖𝙧𝙗𝙖𝙨𝙬𝙖𝙨𝙚𝙧𝙞 𝙪𝙨𝙚𝙧𝙙𝙚𝙧 𝙨𝙚𝙧𝙫𝙚𝙧 𝙩𝙝𝙚𝙠𝙚 𝙪𝙣𝙗𝙖𝙣 𝙠𝙤𝙧𝙖 𝙝𝙤𝙮𝙚𝙘𝙝𝙚", threadID, messageID);
    }

    case 'qtvall':
    case 'allqtv': {
      const allThreads = await Threads.getAll();
      for (let i = 0; i < allThreads.length; i++) {
        const threadInfo = allThreads[i].threadInfo || {};
        const idAdmins = Array.isArray(threadInfo.adminIDs) ? threadInfo.adminIDs : [];
        for (let j = 0; j < idAdmins.length; j++) {
          const idad = idAdmins[j].id;
          if (!idad) continue;
          const uData = (await Users.getData(idad)).data || {};
          uData.banned = 0;
          uData.reason = null;
          uData.dateAdded = null;
          await Users.setData(idad, { data: uData });
          if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') global.data.userBanned.delete(idad);
        }
      }
      return api.sendMessage('✅ 𝙎𝙖𝙗 𝙎𝙚𝙧𝙫𝙚𝙧 𝙀𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙩𝙤𝙧𝙙𝙚𝙧 𝙠𝙚 𝙪𝙣𝙗𝙖𝙣 𝙠𝙤𝙧𝙖 𝙝𝙤𝙮𝙚𝙘𝙝𝙚', threadID, messageID);
    }

    case 'qtv': {
      const threadData = await Threads.getData(threadID);
      const threadInfo = threadData.threadInfo || {};
      const listQTV = Array.isArray(threadInfo.adminIDs) ? threadInfo.adminIDs : [];
      for (const adminObj of listQTV) {
        const idQtv = adminObj.id;
        if (!idQtv) continue;
        const uData = (await Users.getData(idQtv)).data || {};
        uData.banned = 0;
        uData.reason = null;
        uData.dateAdded = null;
        await Users.setData(idQtv, { data: uData });
        if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') global.data.userBanned.delete(idQtv);
      }
      return api.sendMessage("✅ 𝙀 𝙜𝙧𝙪𝙥𝙚𝙧 𝙨𝙖𝙗 𝙚𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙩𝙤𝙧 𝙪𝙣𝙗𝙖𝙣 𝙠𝙤𝙧𝙖 𝙝𝙤𝙮𝙚𝙘𝙝𝙚", threadID, messageID);
    }

    case 'member':
    case 'mb':
    case 'user': {
      // if no second arg -> unban all participants in current thread
      if (!args[1]) {
        const listMember = Array.isArray(event.participantIDs) ? event.participantIDs : [];
        for (const idMember of listMember) {
          const uData = (await Users.getData(idMember)).data || {};
          uData.banned = 0;
          uData.reason = null;
          uData.dateAdded = null;
          await Users.setData(idMember, { data: uData });
          if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') global.data.userBanned.delete(idMember);
        }
        return api.sendMessage("✅ 𝙀 𝙜𝙧𝙪𝙥𝙚𝙧 𝙨𝙖𝙗 𝙢𝙚𝙢𝙗𝙚𝙧 𝙠𝙚 𝙪𝙣𝙗𝙖𝙣 𝙠𝙤𝙧𝙖 𝙝𝙤𝙮𝙚𝙘𝙝𝙚", threadID, messageID);
      }

      // if mention present -> unban mentioned user
      if (args.join().indexOf('@') !== -1 && event.mentions && Object.keys(event.mentions).length > 0) {
        const mentions = Object.keys(event.mentions);
        const userID = mentions[0];
        const nameUser = event.mentions[userID] || userID;
        const uData = (await Users.getData(userID)).data || {};
        uData.banned = 0;
        uData.reason = null;
        uData.dateAdded = null;
        await Users.setData(userID, { data: uData });
        if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') global.data.userBanned.delete(userID);
        return api.sendMessage(`✅ 𝙐𝙨𝙚𝙧 ${nameUser} 𝙧 𝙗𝙖𝙣 𝙢𝙪𝙘𝙝𝙚 𝙙𝙚𝙤𝙖 𝙝𝙤𝙮𝙚𝙘𝙝𝙚`, threadID, messageID);
      }

      // if reached here but no valid mention or arg -> show usage later (fall through to default)
      break;
    }

    default: {
      const helpMsg = `「    𝙐𝙉𝘽𝘼𝙉    𝘾𝙊𝙉𝙁𝙄𝙂    」\n◆━━━━━━━━━━━◆\n\n✅ 𝙐𝙣𝙗𝙖𝙣 𝙖𝙙𝙢𝙞𝙣 => 𝙎𝙖𝙗 𝘼𝙙𝙢𝙞𝙣 𝘽𝙤𝙩 𝙠𝙚 𝙗𝙖𝙣 𝙢𝙪𝙘𝙝𝙚 𝙙𝙚𝙤𝙖\n✅ 𝙐𝙣𝙗𝙖𝙣 𝙣𝙙𝙝 => 𝙎𝙖𝙗 𝙎𝙪𝙥𝙥𝙤𝙧𝙩𝙚𝙧 𝙠𝙚 𝙗𝙖𝙣 𝙢𝙪𝙘𝙝𝙚 𝙙𝙚𝙤𝙖\n✅ 𝙐𝙣𝙗𝙖𝙣 𝙖𝙡𝙡𝙗𝙤𝙭 => 𝙎𝙖𝙧𝙗𝙖𝙨𝙬𝙖𝙨𝙚𝙧𝙞 𝙜𝙧𝙪𝙥 𝙨𝙖𝙢𝙪𝙝𝙚 𝙗𝙖𝙣 𝙢𝙪𝙘𝙝𝙚 𝙙𝙚𝙤𝙖\n✅ 𝙐𝙣𝙗𝙖𝙣 𝙗𝙤𝙭 => 𝙀𝙠𝙝𝙤𝙣𝙠𝙖𝙧 𝙜𝙧𝙪𝙥𝙚𝙧 𝙗𝙖𝙣 𝙢𝙪𝙘𝙝𝙚 𝙙𝙚𝙤𝙖 (1 𝙜𝙧𝙪𝙥)\n✅ 𝙐𝙣𝙗𝙖𝙣 𝙖𝙡𝙡𝙪𝙨𝙚𝙧 => 𝙎𝙖𝙧𝙗𝙖𝙨𝙬𝙖𝙨𝙚𝙧𝙞 𝙪𝙨𝙚𝙧𝙙𝙚𝙧 𝙗𝙖𝙣 𝙢𝙪𝙘𝙝𝙚 𝙙𝙚𝙤𝙖\n✅ 𝙐𝙣𝙗𝙖𝙣 𝙖𝙡𝙡𝙦𝙩𝙫 => 𝙎𝙖𝙗 𝙎𝙚𝙧𝙫𝙚𝙧 𝙀𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙩𝙤𝙧 𝙠𝙚 𝙗𝙖𝙣 𝙢𝙪𝙘𝙝𝙚 𝙙𝙚𝙤𝙖\n✅ 𝙐𝙣𝙗𝙖𝙣 𝙦𝙩𝙫 => 𝙀 𝙜𝙧𝙪𝙥𝙚𝙧 𝙨𝙖𝙗 𝙚𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙩𝙤𝙧 𝙠𝙚 𝙗𝙖𝙣 𝙢𝙪𝙘𝙝𝙚 𝙙𝙚𝙤𝙖 (1 𝙜𝙧𝙪𝙥)\n✅ 𝙐𝙣𝙗𝙖𝙣 𝙢𝙚𝙢𝙗𝙚𝙧 => 𝙀 𝙜𝙧𝙪𝙥𝙚𝙧 𝙨𝙖𝙗 𝙢𝙚𝙢𝙗𝙚𝙧 𝙠𝙚 𝙗𝙖𝙣 𝙢𝙪𝙘𝙝𝙚 𝙙𝙚𝙤𝙖\n✅ 𝙐𝙣𝙗𝙖𝙣 𝙢𝙚𝙢𝙗𝙚𝙧 𝙩𝙖𝙜 => 𝙏𝙖𝙜 𝙠𝙖𝙧𝙖 𝙪𝙨𝙚𝙧 𝙚𝙧 𝙗𝙖𝙣 𝙢𝙪𝙘𝙝𝙚 𝙙𝙚𝙤𝙖`;
      return api.sendMessage(helpMsg, threadID, messageID);
    }
  }
};
