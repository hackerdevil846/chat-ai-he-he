module.exports = {
  config: {
    name: "spam",
    version: "1.0.0",
    permission: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Ekti message onekbar pathaite parba",
    category: "spam",
    usages: "[msg] [amount]",
    prefix: true,
    cooldowns: 5
  },

  onStart: async function () {
    // এখানে কিছু লাগবে না, শুধু স্ট্রাকচার ঠিক রাখার জন্য ফাঁকা রাখা হয়েছে
  },

  run: async function ({ api, event, args }) {
    const permission = ["61571630409265"]; // শুধুমাত্র এই UID এই কমান্ড চালাতে পারবে
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("Only Bot Admin Can Use this command", event.threadID, event.messageID);
    }

    if (args.length < 2) {
      return api.sendMessage(
        `Invalid number of arguments.\nUsage: ${global.config.PREFIX}spam [msg] [amount]`,
        event.threadID,
        event.messageID
      );
    }

    const msg = args.slice(0, -1).join(" "); // শেষ আর্গুমেন্ট ছাড়া বাকি সব মেসেজ
    const count = parseInt(args[args.length - 1]);

    if (isNaN(count) || count <= 0) {
      return api.sendMessage("Please enter a valid positive number for amount.", event.threadID, event.messageID);
    }

    for (let i = 0; i < count; i++) {
      api.sendMessage(msg, event.threadID);
    }
  }
};
