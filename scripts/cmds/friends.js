module.exports = {
  config: {
    name: "friends",
    version: "1.0.0",
    role: 2,
    author: "asif",
    description: "List friends and manage Facebook friends list",
    category: "admin",
    usage: "[page number]",
    example: "friends 1\nfriends 2",
    cooldown: 5
  },

  onReply: async function({ api, event, handleReply }) {
    const { threadID, senderID } = event;

    try {
      // Verify the reply author
      if (senderID.toString() !== handleReply.author) return;

      let msg = "";
      let processed = 0;
      const { uidUser, nameUser, urlUser } = handleReply;

      // Handle "all" command
      if (event.body.toLowerCase() === "all") {
        for (let i = 0; i < uidUser.length; i++) {
          try {
            await api.removeFriend(uidUser[i]);
            msg += `👤 ${nameUser[i]}\n🔗 ${urlUser[i]}\n\n`;
            processed++;
          } catch (error) {
            console.error(`Failed to remove ${nameUser[i]}:`, error);
          }
        }
      } 
      // Handle number selections
      else {
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
          } catch (error) {
            console.error(`Failed to remove ${nameUser[num - 1]}:`, error);
          }
        }
      }

      // Send result
      if (processed > 0) {
        api.sendMessage({
          body: `✅ Successfully removed ${processed} friend(s):\n\n${msg}`,
          mentions: []
        }, threadID, () => api.unsendMessage(handleReply.messageID));
      } else {
        api.sendMessage("❌ No valid friends were selected for removal.", threadID);
      }
    } catch (error) {
      console.error("Friends reply error:", error);
      api.sendMessage("⚠️ An error occurred while processing your request.", threadID);
    }
  },

  onStart: async function({ event, api, args }) {
    const { threadID, senderID } = event;

    try {
      // Get friends list
      const friendsList = await api.getFriendsList();
      const friendCount = friendsList.length;

      if (friendCount === 0) {
        return api.sendMessage("📭 Your Facebook friends list is empty.", threadID);
      }

      // Prepare friend data
      const formattedFriends = friendsList.map(friend => ({
        name: friend.fullName || "Unknown Name",
        uid: friend.userID,
        gender: friend.gender || "Unknown",
        vanity: friend.vanity || "No Vanity",
        profileUrl: friend.profileUrl || "https://www.facebook.com"
      }));

      // Pagination setup
      const page = Math.max(1, parseInt(args[0]) || 1);
      const perPage = 10;
      const totalPages = Math.ceil(formattedFriends.length / perPage);

      // Validate page number
      if (page > totalPages) {
        return api.sendMessage(
          `⚠️ Invalid page number! Only ${totalPages} pages available.`, 
          threadID
        );
      }

      // Build message content
      let message = `👥 You have ${friendCount} friends\n📄 Page ${page}/${totalPages}\n\n`;
      const startIndex = (page - 1) * perPage;
      const endIndex = Math.min(page * perPage, formattedFriends.length);

      for (let i = startIndex; i < endIndex; i++) {
        const friend = formattedFriends[i];
        const num = i + 1;
        message += `${num}. ${friend.name}\n🆔 ID: ${friend.uid}\n🌕 Gender: ${friend.gender}\n🎭 Vanity: ${friend.vanity}\n🔗 Profile: ${friend.profileUrl}\n\n`;
      }

      message += `📝 Removal Instructions:\n`
        + `• Single: 1, 3, 5\n`
        + `• Range: 1-5\n`
        + `• Combined: 1, 3-5, 7\n`
        + `• All: type "all"\n\n`
        + `Reply to this message with your selection`;

      // Store data for reply handling
      const nameUser = formattedFriends.map(f => f.name);
      const urlUser = formattedFriends.map(f => f.profileUrl);
      const uidUser = formattedFriends.map(f => f.uid);

      // Send the message
      return api.sendMessage(message, threadID, (error, info) => {
        if (error) {
          console.error("Failed to send friends list:", error);
          return api.sendMessage("❌ Failed to display friends list.", threadID);
        }

        // Set up reply handler
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: senderID,
          messageID: info.messageID,
          nameUser,
          urlUser,
          uidUser,
          type: 'reply'
        });
      });
    } catch (error) {
      console.error("Friends command error:", error);
      return api.sendMessage("⚠️ An error occurred while fetching your friends list.", threadID);
    }
  }
};
