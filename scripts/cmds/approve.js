const fs = require("fs-extra");

module.exports = {
  config: {
    name: "approve",
    version: "2.0.0",
    permission: 0,
    credits: "asif",
    description: "approve thread using thread id",
    prefix: false,
    category: "admin",
    usages: "approve [group/remove] [threadid]",
    cooldowns: 5,
  },

  languages: {
    "vi": {
        "listAdmin": 'Danh sách toàn bộ người điều hành bot: \n\n%1',
        "notHavePermssion": 'Bạn không đủ quyền hạn để có thể sử dụng chức năng "%1"',
        "addedNewAdmin": 'Đã thêm %1 người dùng trở thành người điều hành bot:\n\n%2',
        "removedAdmin": 'Đã gỡ bỏ %1 người điều hành bot:\n\n%2'
    },
    "en": {
        "listAdmin": 'approved list : \n\n%1',
        "notHavePermssion": 'you have no permission to use "%1"',
        "addedNewAdmin": 'approved %1 box :\n\n%2',
        "removedAdmin": 'remove %1 box in approve lists :\n\n%2'
    }
  },

  onStart: async function({ api, event, args, Threads, Users, permssion, getText }) {
    const content = args.slice(1, args.length);
    const { threadID, messageID, mentions } = event;
    const { configPath } = global.client;
    const { APPROVED } = global.config;
    const { userName } = global.data;
    const { writeFileSync } = fs;
    const mention = Object.keys(mentions);

    // Clear config cache and reload
    delete require.cache[require.resolve(configPath)];
    let config = require(configPath);

    // Helper function to get box/user info
    const getBoxInfo = async (id) => {
      try {
        const groupname = await global.data.threadInfo.get(id).threadName || "name does not exist";
        return `group name : ${groupname}\ngroup id : ${id}`;
      } catch (error) {
        const username = await Users.getNameUser(id);
        return `user name : ${username}\nuser id : ${id}`;
      }
    };

    // Main command logic
    try {
      switch (args[0]) {
        case "list":
        case "all":
        case "-a": {
          const listAdmin = APPROVED || config.APPROVED || [];
          const msg = [];

          for (const idAdmin of listAdmin) {
            if (parseInt(idAdmin)) {
              const boxname = await getBoxInfo(idAdmin);
              msg.push(`\n${boxname}`);
            }
          }

          return api.sendMessage(`approved users and groups :\n${msg.join('\n')}`, threadID, messageID);
        }

        case "box": {
          if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "add"), threadID, messageID);

          // Handle mentions
          if (mention.length != 0 && isNaN(content[0])) {
            const listAdd = [];

            for (const id of mention) {
              if (!APPROVED.includes(id)) {
                APPROVED.push(id);
                config.APPROVED.push(id);
                listAdd.push(`${id} - ${event.mentions[id]}`);
              }
            }

            writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
            return api.sendMessage(
              getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")),
              threadID,
              messageID
            );
          }
          // Handle thread/user IDs
          else if (content.length != 0 && !isNaN(content[0])) {
            const id = content[0];
            if (!APPROVED.includes(id)) {
              APPROVED.push(id);
              config.APPROVED.push(id);

              const boxname = await getBoxInfo(id);
              writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

              // Notify the approved group/user
              api.sendMessage('this box has been approved', id, () => {
                api.sendMessage(
                  getText("addedNewAdmin", 1, `${boxname}`),
                  threadID,
                  messageID
                );
              });
              return;
            }
          }
          else {
            return global.utils.throwError(this.config.name, threadID, messageID);
          }
          break;
        }

        case "remove":
        case "rm":
        case "delete": {
          if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "delete"), threadID, messageID);

          // Handle mentions
          if (mentions.length != 0 && isNaN(content[0])) {
            const mention = Object.keys(mentions);
            const listAdd = [];

            for (const id of mention) {
              const index = config.APPROVED.findIndex(item => item == id);
              if (index !== -1) {
                APPROVED.splice(index, 1);
                config.APPROVED.splice(index, 1);
                listAdd.push(`${id} - ${event.mentions[id]}`);
              }
            }

            writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
            return api.sendMessage(
              getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")),
              threadID,
              messageID
            );
          }
          // Handle thread/user IDs
          else if (content.length != 0 && !isNaN(content[0])) {
            const id = content[0];
            const index = config.APPROVED.findIndex(item => item.toString() == id);

            if (index !== -1) {
              APPROVED.splice(index, 1);
              config.APPROVED.splice(index, 1);

              const boxname = await getBoxInfo(id);
              writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

              // Notify the removed group/user
              api.sendMessage('this box has been removed from approved list', id, () => {
                api.sendMessage(
                  getText("removedAdmin", 1, `${boxname}`),
                  threadID,
                  messageID
                );
              });
              return;
            }
          }
          else {
            return global.utils.throwError(this.config.name, threadID, messageID);
          }
          break;
        }

        default: {
          return global.utils.throwError(this.config.name, threadID, messageID);
        }
      }
    } catch (error) {
      console.error("Error in approve command:", error);
      return api.sendMessage("An error occurred while processing your request.", threadID, messageID);
    }
  }
};
