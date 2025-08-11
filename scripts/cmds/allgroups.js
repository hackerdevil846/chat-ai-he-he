module.exports = {
  config: {
    name: "allgroups",
    version: "2.0.0",
    permission: 2,
    credits: "Asif",
    description: "List all groups and allow banning or leaving groups",
    prefix: true,
    category: "admin",
    usages: "groups",
    cooldowns: 5,
  },
  onStart: async function({ api, event, args, Threads }) {
    try {
      // Get list of groups
      var inbox = await api.getThreadList(100, null, ['INBOX']);
      let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);

      // Get detailed info for each group
      var listthread = [];
      for (var groupInfo of list) {
        let data = await api.getThreadInfo(groupInfo.threadID);
        listthread.push({
          id: groupInfo.threadID,
          name: groupInfo.name,
          sotv: data.userInfo.length,
        });
      }

      // Sort groups by member count (descending)
      var listbox = listthread.sort((a, b) => {
        if (a.sotv > b.sotv) return -1;
        if (a.sotv < b.sotv) return 1;
        return 0;
      });

      // Format the message with group info
      let msg = 'List of groups you are in:\n\n';
      let i = 1;
      var groupid = [];
      for (var group of listbox) {
        msg += `${i++}. ${group.name}\nGroup ID: ${group.id}\nMembers: ${group.sotv}\n\n`;
        groupid.push(group.id);
      }

      // Add instructions
      msg += 'Reply with "ban [number]" to ban a group or "out [number]" to leave a group.\n';
      msg += 'Use "all" instead of a number to apply to all groups.\n';
      msg += 'Example: "ban 3" to ban the 3rd group in the list.\n';
      msg += 'Or "out all" to leave all groups.';

      // Send the message and set up reply handler
      api.sendMessage(
        msg,
        event.threadID,
        (e, data) => {
          global.GoatBot.onReply.set(data.messageID, {
            commandName: this.config.name,
            author: event.senderID,
            messageID: data.messageID,
            groupid,
            type: 'reply'
          });
        },
        event.messageID
      );
    } catch (error) {
      console.error("Error in allgroups command:", error);
      api.sendMessage("An error occurred while fetching group information.", event.threadID);
    }
  },
  onReply: async function({ api, event, args, Threads, Reply }) {
    try {
      if (parseInt(event.senderID) !== parseInt(Reply.author)) return;

      const commandArgs = event.body.split(" ");
      const action = commandArgs[0].toLowerCase();
      const target = commandArgs[1];

      if (!['ban', 'out'].includes(action)) {
        return api.sendMessage(
          'Please use either "ban [number|all]" or "out [number|all]"',
          event.threadID,
          event.messageID
        );
      }

      // Handle "all" case
      if (target === 'all') {
        for (const idgr of Reply.groupid) {
          if (action === 'ban') {
            const data = (await Threads.getData(idgr)).data || {};
            data.banned = 1;
            await Threads.setData(idgr, { data });
            global.data.threadBanned.set(parseInt(idgr), 1);
          } else if (action === 'out') {
            try {
              await api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr);
            } catch (e) {
              console.error("Error leaving group:", idgr, e);
            }
          }
        }
        return api.sendMessage(
          `Successfully ${action === 'ban' ? 'banned' : 'left'} all groups.`,
          event.threadID,
          event.messageID
        );
      }

      // Handle specific group case
      const groupNumber = parseInt(target);
      if (isNaN(groupNumber) || groupNumber < 1 || groupNumber > Reply.groupid.length) {
        return api.sendMessage(
          `Please provide a valid group number between 1 and ${Reply.groupid.length}`,
          event.threadID,
          event.messageID
        );
      }

      const idgr = Reply.groupid[groupNumber - 1];

      if (action === 'ban') {
        const data = (await Threads.getData(idgr)).data || {};
        data.banned = 1;
        await Threads.setData(idgr, { data });
        global.data.threadBanned.set(parseInt(idgr), 1);
        return api.sendMessage(
          `Successfully banned group: ${idgr}`,
          event.threadID,
          event.messageID
        );
      } else if (action === 'out') {
        await api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr);
        const groupData = await Threads.getData(idgr);
        return api.sendMessage(
          `Left group: ${groupData.name}\n(Group ID: ${idgr})`,
          event.threadID,
          event.messageID
        );
      }
    } catch (error) {
      console.error("Error in allgroups reply handler:", error);
      api.sendMessage(
        "An error occurred while processing your request.",
        event.threadID,
        event.messageID
      );
    }
  }
};
