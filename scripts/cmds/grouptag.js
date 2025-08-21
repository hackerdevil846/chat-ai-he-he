module.exports.config = {
  name: "grouptag",
  aliases: ["grtag"],
  version: "1.5",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Tag members by group",
  commandCategory: "info",
  usages: "add/del/remove/list/info/rename/tag <groupTagName>",
  cooldowns: 5
};

module.exports.languages = {
  vi: {
    noGroupTagName: "Vui lòng nhập tên nhóm tag",
    noMention: "Bạn chưa tag thành viên nào để thêm vào nhóm tag",
    addedSuccess: "✅ Đã thêm các thành viên sau vào nhóm tag \"%1\":\n%2",
    addedSuccess2: "✅ Đã thêm nhóm tag \"%1\" với các thành viên sau:\n%2",
    existedInGroupTag: "⚠️ Các thành viên sau:\n%1\nđã có trong nhóm tag \"%2\" từ trước",
    notExistedInGroupTag: "❌ Các thành viên sau:\n%1\nkhông có trong nhóm tag \"%2\"",
    noExistedGroupTag: "❌ Nhóm tag \"%1\" không tồn tại trong box chat của bạn",
    noExistedGroupTag2: "📭 Box chat của bạn chưa thêm nhóm tag nào",
    noMentionDel: "Vui lòng tag thành viên muốn xóa khỏi nhóm tag \"%1\"",
    deletedSuccess: "🗑️ Đã xóa các thành viên sau:\n%1\nkhỏi nhóm tag \"%2\"",
    deletedSuccess2: "🗑️ Đã xóa nhóm tag \"%1\"",
    tagged: "🔔 Tag nhóm \"%1\":\n%2",
    noGroupTagName2: "Vui lòng nhập tên nhóm tag cũ và tên mới, cách nhau bằng dấu \"|\"",
    renamedSuccess: "✏️ Đã đổi tên nhóm tag \"%1\" thành \"%2\"",
    infoGroupTag: "📑 | Tên nhóm: %1\n👥 | Số thành viên: %2\n👨‍👩‍👧‍👦 | Danh sách thành viên:\n %3"
  },
  en: {
    noGroupTagName: "❗ Please enter group tag name",
    noMention: "❗ You haven't tagged any member to add to group tag",
    addedSuccess: "✅ Added members to group tag \"%1\":\n%2",
    addedSuccess2: "✅ Added group tag \"%1\" with members:\n%2",
    existedInGroupTag: "⚠️ Members:\n%1\nalready existed in group tag \"%2\"",
    notExistedInGroupTag: "❌ Members:\n%1\ndoesn't exist in group tag \"%2\"",
    noExistedGroupTag: "❌ Group tag \"%1\" doesn't exist in your group chat",
    noExistedGroupTag2: "📭 Your group chat hasn't added any group tag",
    noMentionDel: "❗ Please tag members to remove from group tag \"%1\"",
    deletedSuccess: "🗑️ Deleted members:\n%1\nfrom group tag \"%2\"",
    deletedSuccess2: "🗑️ Deleted group tag \"%1\"",
    tagged: "🔔 Tag group \"%1\":\n%2",
    noGroupTagName2: "❗ Please enter old group tag name and new group tag name, separated by \"|\"",
    renamedSuccess: "✏️ Renamed group tag \"%1\" to \"%2\"",
    infoGroupTag: "📑 | Group name: %1\n👥 | Number of members: %2\n👨‍👩‍👧‍👦 | List of members:\n %3"
  }
};

// Helper: robust thread data getters/setters to maximize compatibility with different Goat-like frameworks
async function _getThreadData(Threads, threadID) {
  // prefer Threads.getData(threadID)
  try {
    if (Threads && typeof Threads.getData === 'function') {
      const d = await Threads.getData(threadID);
      return d || {};
    }
    if (Threads && typeof Threads.get === 'function') {
      const d = await Threads.get(threadID);
      return d || {};
    }
    if (global && global.data && global.data.threadData && global.data.threadData[threadID]) {
      return global.data.threadData[threadID];
    }
  }
  catch (e) {
    // ignore and fallback
  }
  // fallback: use an internal store on Threads
  Threads._data = Threads._data || {};
  Threads._data[threadID] = Threads._data[threadID] || {};
  return Threads._data[threadID];
}

async function _setThreadData(Threads, threadID, data) {
  try {
    if (Threads && typeof Threads.setData === 'function') {
      await Threads.setData(threadID, data);
      return;
    }
    if (Threads && typeof Threads.set === 'function') {
      await Threads.set(threadID, data);
      return;
    }
    if (global && global.data && global.data.threadData) {
      global.data.threadData[threadID] = data;
      return;
    }
  }
  catch (e) {
    // ignore and fallback
  }
  Threads._data = Threads._data || {};
  Threads._data[threadID] = data;
}

function _getLang(moduleLangs, eventLang, key, ...params) {
  const language = (eventLang || 'en');
  const dict = moduleLangs[language] || moduleLangs['en'];
  let str = dict && dict[key] ? dict[key] : key;
  params.forEach((p, i) => {
    const placeholder = new RegExp('%' + (i + 1), 'g');
    str = str.replace(placeholder, p);
  });
  return str;
}

module.exports.run = async function({ api, event, args, Threads, Users, Currencies, permssion }) {
  const threadID = event.threadID || event.message?.threadID;
  const threadData = await _getThreadData(Threads, threadID);
  threadData.data = threadData.data || {};
  const groupTags = threadData.data.groupTags || [];

  const moduleLangs = module.exports.languages;
  const eventLang = (event.lang || 'en');
  const getLang = (key, ...p) => _getLang(moduleLangs, eventLang, key, ...p);

  // helper reply
  const reply = async (msg) => {
    if (typeof msg === 'string') return api.sendMessage(msg, threadID);
    // else msg is an object like { body, mentions }
    return api.sendMessage(msg, threadID);
  };

  // normalize mentions: convert to map uid->name (strip leading @)
  const mentionsMap = {};
  if (event.mentions) {
    for (const uid in event.mentions) {
      mentionsMap[uid] = event.mentions[uid].replace(/^@/, "");
    }
  }

  const cmd = args[0] ? args[0].toLowerCase() : "tag";

  switch (cmd) {
    case 'add': {
      const mentionsID = Object.keys(event.mentions || {});
      const content = (args.slice(1) || []).join(' ');
      if (!mentionsID[0]) return reply(getLang('noMention'));

      // find groupTagName by extracting substring before first mention name
      const firstMentionName = event.mentions[mentionsID[0]];
      const idx = content.indexOf(firstMentionName);
      const groupTagName = (idx > 0) ? content.slice(0, idx - 1).trim() : content.slice(0, content.indexOf(firstMentionName)).trim();
      if (!groupTagName) return reply(getLang('noGroupTagName'));

      const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
      if (oldGroupTag) {
        const usersIDExist = [];
        const usersIDNotExist = [];
        for (const uid in mentionsMap) {
          if (oldGroupTag.users.hasOwnProperty(uid)) usersIDExist.push(uid);
          else {
            oldGroupTag.users[uid] = mentionsMap[uid];
            usersIDNotExist.push(uid);
          }
        }
        // persist
        threadData.data.groupTags = groupTags;
        await _setThreadData(Threads, threadID, threadData);

        let msg = "";
        if (usersIDNotExist.length > 0) msg += getLang('addedSuccess', oldGroupTag.name, usersIDNotExist.map(uid => mentionsMap[uid]).join('\n')) + '\n';
        if (usersIDExist.length > 0) msg += getLang('existedInGroupTag', usersIDExist.map(uid => mentionsMap[uid]).join('\n'), oldGroupTag.name);
        return reply(msg);
      }
      else {
        const newGroupTag = { name: groupTagName, users: mentionsMap };
        groupTags.push(newGroupTag);
        threadData.data.groupTags = groupTags;
        await _setThreadData(Threads, threadID, threadData);
        return reply(getLang('addedSuccess2', groupTagName, Object.values(mentionsMap).join('\n')));
      }
    }

    case 'list':
    case 'all': {
      if (args[1]) {
        const groupTagName = args.slice(1).join(' ');
        if (!groupTagName) return reply(getLang('noGroupTagName'));
        const groupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
        if (!groupTag) return reply(getLang('noExistedGroupTag', groupTagName));
        return showInfoGroupTag(api, threadID, groupTag, getLang);
      }
      const msg = groupTags.reduce((m, group) => m + `\n\n${group.name}:\n ${Object.values(group.users).map(name => name).join('\n ')}`, "");
      return reply(msg || getLang('noExistedGroupTag2'));
    }

    case 'info': {
      const groupTagName = args.slice(1).join(' ');
      if (!groupTagName) return reply(getLang('noGroupTagName'));
      const groupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
      if (!groupTag) return reply(getLang('noExistedGroupTag', groupTagName));
      return showInfoGroupTag(api, threadID, groupTag, getLang);
    }

    case 'del': {
      const content = (args.slice(1) || []).join(' ');
      const mentionsID = Object.keys(event.mentions || {});
      if (!mentionsID[0]) return reply(getLang('noMentionDel', ''));

      const firstMentionName = event.mentions[mentionsID[0]];
      const idx = content.indexOf(firstMentionName);
      const groupTagName = (idx > 0) ? content.slice(0, idx - 1).trim() : content.slice(0, content.indexOf(firstMentionName)).trim();
      if (!groupTagName) return reply(getLang('noGroupTagName'));

      const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
      if (!oldGroupTag) return reply(getLang('noExistedGroupTag', groupTagName));

      const usersIDExist = [];
      const usersIDNotExist = [];
      for (const uid in mentionsMap) {
        if (oldGroupTag.users.hasOwnProperty(uid)) {
          delete oldGroupTag.users[uid];
          usersIDExist.push(uid);
        }
        else usersIDNotExist.push(uid);
      }

      threadData.data.groupTags = groupTags;
      await _setThreadData(Threads, threadID, threadData);

      let msg = "";
      if (usersIDNotExist.length > 0) msg += getLang('notExistedInGroupTag', usersIDNotExist.map(uid => mentionsMap[uid]).join('\n'), groupTagName) + '\n';
      if (usersIDExist.length > 0) msg += getLang('deletedSuccess', usersIDExist.map(uid => mentionsMap[uid]).join('\n'), groupTagName);
      return reply(msg);
    }

    case 'remove':
    case 'rm': {
      const groupTagName = (args.slice(1) || []).join(' ').trim();
      if (!groupTagName) return reply(getLang('noGroupTagName'));
      const index = groupTags.findIndex(group => group.name.toLowerCase() === groupTagName.toLowerCase());
      if (index === -1) return reply(getLang('noExistedGroupTag', groupTagName));
      groupTags.splice(index, 1);
      threadData.data.groupTags = groupTags;
      await _setThreadData(Threads, threadID, threadData);
      return reply(getLang('deletedSuccess2', groupTagName));
    }

    case 'rename': {
      const content = (args.slice(1) || []).join(' ');
      const arr = content.split('|').map(str => str.trim());
      const oldGroupTagName = arr[0];
      const newGroupTagName = arr[1];
      if (!oldGroupTagName || !newGroupTagName) return reply(getLang('noGroupTagName2'));
      const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === oldGroupTagName.toLowerCase());
      if (!oldGroupTag) return reply(getLang('noExistedGroupTag', oldGroupTagName));
      oldGroupTag.name = newGroupTagName;
      threadData.data.groupTags = groupTags;
      await _setThreadData(Threads, threadID, threadData);
      return reply(getLang('renamedSuccess', oldGroupTagName, newGroupTagName));
    }

    case 'tag':
    default: {
      const content = (args.slice(cmd === 'tag' ? 1 : 0) || []).join(' ');
      const groupTagName = content.trim();
      if (!groupTagName) return reply(getLang('noGroupTagName'));
      const oldGroupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
      if (!oldGroupTag) return reply(getLang('noExistedGroupTag', groupTagName));

      const users = oldGroupTag.users;
      const mentions = [];
      let msg = "";
      for (const uid in users) {
        const userName = users[uid];
        mentions.push({ id: uid, tag: userName });
        msg += `${userName}\n`;
      }

      return api.sendMessage({ body: getLang('tagged', groupTagName, msg), mentions }, threadID);
    }
  }
};

// Helper to show info about a group tag
async function showInfoGroupTag(api, threadID, groupTag, getLang) {
  const body = getLang('infoGroupTag', groupTag.name, Object.keys(groupTag.users).length, Object.keys(groupTag.users).map(uid => groupTag.users[uid]).join('\n '));
  return api.sendMessage(body, threadID);
}
