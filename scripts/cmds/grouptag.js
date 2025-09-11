module.exports.config = {
  name: "grouptag",
  aliases: ["grtag"],
  version: "1.5",
  author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
  countDown: 5,
  role: 0,
  category: "utility",
  shortDescription: {
    en: "𝑇𝑎𝑔 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑏𝑦 𝑔𝑟𝑜𝑢𝑝"
  },
  longDescription: {
    en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔𝑠 𝑓𝑜𝑟 𝑒𝑎𝑠𝑦 𝑚𝑒𝑚𝑏𝑒𝑟 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑖𝑛𝑔"
  },
  guide: {
    en: "{p}grouptag add/𝑑𝑒𝑙/𝑟𝑒𝑚𝑜𝑣𝑒/𝑙𝑖𝑠𝑡/𝑖𝑛𝑓𝑜/𝑟𝑒𝑛𝑎𝑚𝑒/𝑡𝑎𝑔 <𝑔𝑟𝑜𝑢𝑝𝑇𝑎𝑔𝑁𝑎𝑚𝑒>"
  },
  dependencies: {
    "fs-extra": ""
  }
};

module.exports.languages = {
  "en": {
    "noGroupTagName": "❗ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔 𝑛𝑎𝑚𝑒",
    "noMention": "❗ 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒𝑛'𝑡 𝑡𝑎𝑔𝑔𝑒𝑑 𝑎𝑛𝑦 𝑚𝑒𝑚𝑏𝑒𝑟 𝑡𝑜 𝑎𝑑𝑑 𝑡𝑜 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔",
    "addedSuccess": "✅ 𝐴𝑑𝑑𝑒𝑑 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑡𝑜 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔 \"%1\":\n%2",
    "addedSuccess2": "✅ 𝐴𝑑𝑑𝑒𝑑 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔 \"%1\" 𝑤𝑖𝑡ℎ 𝑚𝑒𝑚𝑏𝑒𝑟𝑠:\n%2",
    "existedInGroupTag": "⚠️ 𝑀𝑒𝑚𝑏𝑒𝑟𝑠:\n%1\𝑛𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑥𝑖𝑠𝑡𝑒𝑑 𝑖𝑛 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔 \"%2\"",
    "notExistedInGroupTag": "❌ 𝑀𝑒𝑚𝑏𝑒𝑟𝑠:\n%1\𝑛𝑑𝑜𝑒𝑠𝑛'𝑡 𝑒𝑥𝑖𝑠𝑡 𝑖𝑛 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔 \"%2\"",
    "noExistedGroupTag": "❌ 𝐺𝑟𝑜𝑢𝑝 𝑡𝑎𝑔 \"%1\" 𝑑𝑜𝑒𝑠𝑛'𝑡 𝑒𝑥𝑖𝑠𝑡 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 𝑐ℎ𝑎𝑡",
    "noExistedGroupTag2": "📭 𝑌𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 𝑐ℎ𝑎𝑡 ℎ𝑎𝑠𝑛'𝑡 𝑎𝑑𝑑𝑒𝑑 𝑎𝑛𝑦 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔",
    "noMentionDel": "❗ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 𝑓𝑟𝑜𝑚 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔 \"%1\"",
    "deletedSuccess": "🗑️ 𝐷𝑒𝑙𝑒𝑡𝑒𝑑 𝑚𝑒𝑚𝑏𝑒𝑟𝑠:\n%1\𝑛𝑓𝑟𝑜𝑚 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔 \"%2\"",
    "deletedSuccess2": "🗑️ 𝐷𝑒𝑙𝑒𝑡𝑒𝑑 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔 \"%1\"",
    "tagged": "🔔 𝑇𝑎𝑔 𝑔𝑟𝑜𝑢𝑝 \"%1\":\n%2",
    "noGroupTagName2": "❗ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑜𝑙𝑑 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔 𝑛𝑎𝑚𝑒 𝑎𝑛𝑑 𝑛𝑒𝑤 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔 𝑛𝑎𝑚𝑒, 𝑠𝑒𝑝𝑎𝑟𝑎𝑡𝑒𝑑 𝑏𝑦 \"|\"",
    "renamedSuccess": "✏️ 𝑅𝑒𝑛𝑎𝑚𝑒𝑑 𝑔𝑟𝑜𝑢𝑝 𝑡𝑎𝑔 \"%1\" 𝑡𝑜 \"%2\"",
    "infoGroupTag": "📑 | 𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒: %1\n👥 | 𝑁𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑚𝑒𝑚𝑏𝑒𝑟𝑠: %2\n👨‍👩‍👧‍👦 | 𝐿𝑖𝑠𝑡 𝑜𝑓 𝑚𝑒𝑚𝑏𝑒𝑟𝑠:\n %3"
  }
};

// Helper: robust thread data getters/setters
async function _getThreadData(Threads, threadID) {
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

module.exports.onStart = async function({ api, event, args, Threads, message }) {
  try {
    const threadID = event.threadID;
    const threadData = await _getThreadData(Threads, threadID);
    threadData.data = threadData.data || {};
    const groupTags = threadData.data.groupTags || [];

    const moduleLangs = module.exports.languages;
    const eventLang = 'en';
    const getLang = (key, ...p) => _getLang(moduleLangs, eventLang, key, ...p);

    const reply = async (msg) => {
      return message.reply(msg);
    };

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
          return showInfoGroupTag(message, groupTag, getLang);
        }
        const msg = groupTags.reduce((m, group) => m + `\n\n${group.name}:\n ${Object.values(group.users).map(name => name).join('\n ')}`, "");
        return reply(msg || getLang('noExistedGroupTag2'));
      }

      case 'info': {
        const groupTagName = args.slice(1).join(' ');
        if (!groupTagName) return reply(getLang('noGroupTagName'));
        const groupTag = groupTags.find(tag => tag.name.toLowerCase() === groupTagName.toLowerCase());
        if (!groupTag) return reply(getLang('noExistedGroupTag', groupTagName));
        return showInfoGroupTag(message, groupTag, getLang);
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

        return message.reply({ body: getLang('tagged', groupTagName, msg), mentions });
      }
    }
  } catch (error) {
    console.error("𝐺𝑟𝑜𝑢𝑝𝑇𝑎𝑔 𝐸𝑟𝑟𝑜𝑟:", error);
    message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
  }
};

// Helper to show info about a group tag
async function showInfoGroupTag(message, groupTag, getLang) {
  const body = getLang('infoGroupTag', groupTag.name, Object.keys(groupTag.users).length, Object.keys(groupTag.users).map(uid => groupTag.users[uid]).join('\n '));
  return message.reply(body);
}
