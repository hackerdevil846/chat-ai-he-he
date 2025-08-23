module.exports.config = {
  name: "job",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "💼 Work to earn money with various jobs - Enhanced Edition",
  category: "economy",
  usages: "[job number]",
  cooldowns: 5,
  envConfig: {
    cooldownTime: 5000
  },
  dependencies: {}
};

module.exports.languages = {
  "en": {
    "cooldown": "⏱️ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 %1 𝗺𝗶𝗻𝘂𝘁𝗲(𝘀) %2 𝘀𝗲𝗰𝗼𝗻𝗱(𝘀) 𝗯𝗲𝗳𝗼𝗿𝗲 𝘄𝗼𝗿𝗸𝗶𝗻𝗴 𝗮𝗴𝗮𝗶𝗻 ✨",
    "invalidNumber": "❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗻𝘂𝗺𝗯𝗲𝗿! 𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗷𝗼𝗯 𝗻𝘂𝗺𝗯𝗲𝗿 𝗯𝗲𝘁𝘄𝗲𝗲𝗻 𝟭-𝟳 🌟",
    "invalidJob": "❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗷𝗼𝗯 𝘀𝗲𝗹𝗲𝗰𝘁𝗶𝗼𝗻! 𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗼𝗼𝘀𝗲 𝗮 𝗷𝗼𝗯 𝗳𝗿𝗼𝗺 𝘁𝗵𝗲 𝗹𝗶𝘀𝘁 📋",
    "jobError": "❌ 𝗝𝗼𝗯 𝗲𝗿𝗿𝗼𝗿! 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗽𝗿𝗼𝗰𝗲𝘀𝘀 𝘆𝗼𝘂𝗿 𝗷𝗼𝗯. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿 🔄",
    "systemError": "❌ 𝗦𝘆𝘀𝘁𝗲𝗺 𝗲𝗿𝗿𝗼𝗿! 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗮𝗰𝗰𝗲𝘀𝘀 𝗷𝗼𝗯 𝗰𝗲𝗻𝘁𝗲𝗿. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿 🛠️",
    "welcome": "💼 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝘁𝗵𝗲 𝗘𝗹𝗶𝘁𝗲 𝗝𝗼𝗯 𝗖𝗲𝗻𝘁𝗲𝗿! 𝗘𝗮𝗿𝗻 𝗰𝗼𝗶𝗻𝘀 𝗮𝗻𝗱 𝗹𝗲𝘃𝗲𝗹 𝘂𝗽 𝘆𝗼𝘂𝗿 𝗰𝗮𝗿𝗲𝗲𝗿 🚀"
  }
};

const jobTypes = {
  1: {
    name: "🏭 𝗜𝗻𝗱𝘂𝘀𝘁𝗿𝗶𝗮𝗹 𝗭𝗼𝗻𝗲",
    tasks: [
      "𝗵𝗶𝗿𝗶𝗻𝗴 𝘀𝘁𝗮𝗳𝗳", 
      "𝗵𝗼𝘁𝗲𝗹 𝗮𝗱𝗺𝗶𝗻𝗶𝘀𝘁𝗿𝗮𝘁𝗼𝗿", 
      "𝗮𝘁 𝘁𝗵𝗲 𝗽𝗼𝘄𝗲𝗿 𝗽𝗹𝗮𝗻𝘁", 
      "𝗿𝗲𝘀𝘁𝗮𝘂𝗿𝗮𝗻𝘁 𝗰𝗵𝗲𝗳", 
      "𝗳𝗮𝗰𝘁𝗼𝗿𝘆 𝘄𝗼𝗿𝗸𝗲𝗿"
    ],
    minCoins: 200,
    maxCoins: 600,
    emoji: "🏭"
  },
  2: {
    name: "💼 𝗦𝗲𝗿𝘃𝗶𝗰𝗲 𝗔𝗿𝗲𝗮",
    tasks: [
      "𝗽𝗹𝘂𝗺𝗯𝗲𝗿", 
      "𝗔𝗖 𝗿𝗲𝗽𝗮𝗶𝗿 𝘁𝗲𝗰𝗵𝗻𝗶𝗰𝗶𝗮𝗻", 
      "𝗺𝘂𝗹𝘁𝗶-𝗹𝗲𝘃𝗲𝗹 𝘀𝗮𝗹𝗲𝘀", 
      "𝗳𝗹𝘆𝗲𝗿 𝗱𝗶𝘀𝘁𝗿𝗶𝗯𝘂𝘁𝗶𝗼𝗻", 
      "𝗱𝗲𝗹𝗶𝘃𝗲𝗿𝘆 𝗱𝗿𝗶𝘃𝗲𝗿", 
      "𝗰𝗼𝗺𝗽𝘂𝘁𝗲𝗿 𝗿𝗲𝗽𝗮𝗶𝗿", 
      "𝘁𝗼𝘂𝗿 𝗴𝘂𝗶𝗱𝗲", 
      "𝗰𝗵𝗶𝗹𝗱 𝗰𝗮𝗿𝗲"
    ],
    minCoins: 200,
    maxCoins: 1000,
    emoji: "💼"
  },
  3: {
    name: "🛢️ 𝗢𝗶𝗹 𝗙𝗶𝗲𝗹𝗱",
    tasks: [
      "𝗱𝗿𝗶𝗹𝗹𝗶𝗻𝗴 𝘀𝘂𝗽𝗲𝗿𝘃𝗶𝘀𝗼𝗿", 
      "𝗽𝗶𝗽𝗲𝗹𝗶𝗻𝗲 𝘁𝗲𝗰𝗵𝗻𝗶𝗰𝗶𝗮𝗻", 
      "𝘀𝗮𝗳𝗲𝘁𝘆 𝗶𝗻𝘀𝗽𝗲𝗰𝘁𝗼𝗿", 
      "𝗲𝗾𝘂𝗶𝗽𝗺𝗲𝗻𝘁 𝗼𝗽𝗲𝗿𝗮𝘁𝗼𝗿", 
      "𝗿𝗲𝗳𝗶𝗻𝗲𝗿𝘆 𝘄𝗼𝗿𝗸𝗲𝗿"
    ],
    minCoins: 300,
    maxCoins: 800,
    emoji: "🛢️"
  },
  4: {
    name: "⛏️ 𝗠𝗶𝗻𝗶𝗻𝗴 𝗢𝗿𝗲",
    tasks: [
      "𝗶𝗿𝗼𝗻 𝗼𝗿𝗲 𝗲𝘅𝘁𝗿𝗮𝗰𝘁𝗶𝗼𝗻", 
      "𝗴𝗼𝗹𝗱 𝗺𝗶𝗻𝗶𝗻𝗴", 
      "𝗰𝗼𝗮𝗹 𝗺𝗶𝗻𝗶𝗻𝗴", 
      "𝗰𝗼𝗽𝗽𝗲𝗿 𝗲𝘅𝗰𝗮𝘃𝗮𝘁𝗶𝗼𝗻", 
      "𝗺𝗶𝗻𝗲𝗿𝗮𝗹 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴"
    ],
    minCoins: 250,
    maxCoins: 750,
    emoji: "⛏️"
  },
  5: {
    name: "💎 𝗗𝗶𝗴𝗴𝗶𝗻𝗴 𝗥𝗼𝗰𝗸",
    tasks: [
      "𝗱𝗶𝗮𝗺𝗼𝗻𝗱 𝗽𝗿𝗼𝘀𝗽𝗲𝗰𝘁𝗶𝗻𝗴", 
      "𝗴𝗲𝗺𝘀𝘁𝗼𝗻𝗲 𝗲𝘅𝗰𝗮𝘃𝗮𝘁𝗶𝗼𝗻", 
      "𝗾𝘂𝗮𝗿𝗿𝘆 𝘄𝗼𝗿𝗸𝗲𝗿", 
      "𝗴𝗲𝗼𝗹𝗼𝗴𝗶𝗰𝗮𝗹 𝘀𝘂𝗿𝘃𝗲𝘆𝗼𝗿", 
      "𝘀𝘁𝗼𝗻𝗲 𝗰𝘂𝘁𝘁𝗶𝗻𝗴"
    ],
    minCoins: 200,
    maxCoins: 500,
    emoji: "💎"
  },
  6: {
    name: "🌟 𝗦𝗽𝗲𝗰𝗶𝗮𝗹 𝗝𝗼𝗯",
    tasks: [
      "𝗩𝗜𝗣 𝗽𝗲𝗿𝘀𝗼𝗻𝗮𝗹 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁", 
      "𝗽𝗮𝘁𝗲𝗻𝘁 𝗰𝗼𝗻𝘀𝘂𝗹𝘁𝗮𝗻𝘁", 
      "𝗽𝗿𝗶𝘃𝗮𝘁𝗲 𝗶𝗻𝘃𝗲𝘀𝘁𝗶𝗴𝗮𝘁𝗼𝗿", 
      "𝗲𝘅𝗲𝗰𝘂𝘁𝗶𝘃𝗲 𝗰𝗵𝗮𝘂𝗳𝗳𝗲𝘂𝗿", 
      "𝗹𝘂𝘅𝘂𝗿𝘆 𝗲𝘃𝗲𝗻𝘁 𝗽𝗹𝗮𝗻𝗻𝗲𝗿"
    ],
    minCoins: 500,
    maxCoins: 1500,
    emoji: "🌟"
  },
  7: {
    name: "🚀 𝗘𝗹𝗶𝘁𝗲 𝗠𝗶𝘀𝘀𝗶𝗼𝗻",
    tasks: [
      "𝗰𝘆𝗯𝗲𝗿𝘀𝗲𝗰𝘂𝗿𝗶𝘁𝘆 𝗲𝘅𝗽𝗲𝗿𝘁", 
      "𝗮𝗜 𝗿𝗲𝘀𝗲𝗮𝗿𝗰𝗵𝗲𝗿", 
      "𝗾𝘂𝗮𝗻𝘁𝘂𝗺 𝗰𝗼𝗺𝗽𝘂𝘁𝗶𝗻𝗴 𝘀𝗽𝗲𝗰𝗶𝗮𝗹𝗶𝘀𝘁", 
      "𝘀𝗽𝗮𝗰𝗲 𝗲𝗻𝗴𝗶𝗻𝗲𝗲𝗿", 
      "𝗯𝗹𝗼𝗰𝗸𝗰𝗵𝗮𝗶𝗻 𝗱𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿"
    ],
    minCoins: 800,
    maxCoins: 2500,
    emoji: "🚀"
  }
};

module.exports.onLoad = function () {
  console.log("🔄 Job command loaded successfully");
};

module.exports.handleReply = async function({ event, api, handleReply, Currencies, getText }) {
  const { threadID, senderID, body } = event;
  const jobType = parseInt(body);

  if (isNaN(jobType)) {
    return api.sendMessage(getText("invalidNumber"), threadID);
  }

  if (!jobTypes[jobType]) {
    return api.sendMessage(getText("invalidJob"), threadID);
  }

  try {
    const job = jobTypes[jobType];
    const task = job.tasks[Math.floor(Math.random() * job.tasks.length)];
    const coinsEarned = Math.floor(Math.random() * (job.maxCoins - job.minCoins + 1)) + job.minCoins;
    
    // Chance for bonus coins (20% chance)
    const bonusChance = Math.random();
    let bonusMessage = "";
    let totalCoins = coinsEarned;
    
    if (bonusChance < 0.2) {
      const bonusCoins = Math.floor(coinsEarned * 0.5);
      totalCoins += bonusCoins;
      bonusMessage = `\n\n🎉 𝗕𝗢𝗡𝗨𝗦! You received an extra ${bonusCoins} coins for excellent performance!`;
    }

    await Currencies.increaseMoney(senderID, totalCoins);

    const messages = [
      `💼 ${job.emoji} 𝗬𝗢𝗨𝗥 𝗪𝗢𝗥𝗞 𝗥𝗘𝗦𝗨𝗟𝗧𝗦 ${job.emoji}\n\n𝗝𝗼𝗯: ${task}\n𝗔𝗿𝗲𝗮: ${job.name}\n𝗖𝗼𝗶𝗻𝘀 𝗘𝗮𝗿𝗻𝗲𝗱: ${totalCoins} 💰${bonusMessage}\n\nKeep up the great work! 🚀`,
      `🎯 𝗪𝗢𝗥𝗞 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘𝗗!\n\n𝗥𝗼𝗹𝗲: ${task}\n𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻: ${job.name}\n𝗥𝗲𝘄𝗮𝗿𝗱: ${totalCoins} coins 💵${bonusMessage}\n\nYour career is progressing! 🌟`,
      `🏆 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟 𝗪𝗢𝗥𝗞 𝗗𝗔𝗬!\n\n𝗧𝗮𝘀𝗸: ${task}\n𝗗𝗲𝗽𝗮𝗿𝘁𝗺𝗲𝗻𝘁: ${job.name}\n𝗘𝗮𝗿𝗻𝗶𝗻𝗴𝘀: ${totalCoins} coins 🪙${bonusMessage}\n\nYou're building your future! 💪`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    api.unsendMessage(handleReply.messageID);
    api.sendMessage(randomMessage, threadID);

    const userData = await Currencies.getData(senderID);
    userData.data = userData.data || {};
    userData.data.workTime = Date.now();
    await Currencies.setData(senderID, userData);

  } catch (error) {
    console.error("Job Error:", error);
    api.sendMessage(getText("jobError"), threadID);
  }
};

module.exports.run = async function({ event, api, Currencies, getText }) {
  const { threadID, senderID } = event;
  const cooldownTime = this.config.envConfig.cooldownTime;
  
  try {
    const userData = await Currencies.getData(senderID);
    const workData = userData.data || {};
    
    if (workData.workTime && (Date.now() - workData.workTime) < cooldownTime) {
      const remainingTime = cooldownTime - (Date.now() - workData.workTime);
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      
      return api.sendMessage(
        getText("cooldown", minutes, seconds < 10 ? "0" + seconds : seconds), 
        threadID
      );
    }

    let menu = `✨━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✨\n`;
    menu += `         💼 𝗘𝗟𝗜𝗧𝗘 𝗝𝗢𝗕 𝗖𝗘𝗡𝗧𝗘𝗥 💼\n`;
    menu += `✨━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✨\n\n`;
    menu += `${getText("welcome")}\n\n`;
    menu += `🎯 𝗖𝗵𝗼𝗼𝘀𝗲 𝗮 𝗷𝗼𝗯 𝗯𝘆 𝗿𝗲𝗽𝗹𝘆𝗶𝗻𝗴 𝘄𝗶𝘁𝗵 𝗶𝘁𝘀 𝗻𝘂𝗺𝗯𝗲𝗿:\n\n`;
    
    for (const [id, job] of Object.entries(jobTypes)) {
      menu += `🔸 ${id}. ${job.name} (${job.minCoins}-${job.maxCoins} coins) ${job.emoji}\n`;
    }
    
    menu += `\n💡 𝗧𝗶𝗽: Higher risk jobs offer greater rewards!\n`;
    menu += `⏱️ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: 5 minutes between jobs\n\n`;
    menu += `💝 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝘁𝗵𝗲 𝗷𝗼𝗯 𝗻𝘂𝗺𝗯𝗲𝗿 𝘁𝗼 𝘀𝘁𝗮𝗿𝘁 𝘄𝗼𝗿𝗸𝗶𝗻𝗴`;

    api.sendMessage(menu, threadID, (error, info) => {
      if (error) {
        console.error("Menu Error:", error);
        return api.sendMessage(getText("systemError"), threadID);
      }
      
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "jobSelection"
      });
    });

  } catch (error) {
    console.error("Job System Error:", error);
    api.sendMessage(getText("systemError"), threadID);
  }
};
