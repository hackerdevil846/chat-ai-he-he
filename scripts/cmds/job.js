module.exports = {
  config: {
    name: "job",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Asif",
    description: "Work to earn money with various jobs",
    category: "economy",  // Correct category for economy commands
    cooldowns: 5,
    envConfig: {
      cooldownTime: 5000
    }
  },

  languages: {
    "en": {
      "cooldown": "⏱️ You need to wait %1 minute(s) %2 second(s) before working again.",
      "invalidNumber": "❌ Please enter a valid job number",
      "invalidJob": "❌ Invalid job selection",
      "jobError": "❌ Failed to process your job. Please try again later.",
      "systemError": "❌ Failed to access job center. Please try again later."
    }
  },

  jobTypes: {
    1: {
      name: "🏭 Industrial Zone",
      tasks: [
        "hiring staff", 
        "hotel administrator", 
        "at the power plant", 
        "restaurant chef", 
        "factory worker"
      ],
      minCoins: 200,
      maxCoins: 600
    },
    2: {
      name: "💼 Service Area",
      tasks: [
        "plumber", 
        "AC repair technician", 
        "multi-level sales", 
        "flyer distribution", 
        "delivery driver", 
        "computer repair", 
        "tour guide", 
        "child care"
      ],
      minCoins: 200,
      maxCoins: 1000
    },
    3: {
      name: "🛢️ Oil Field",
      tasks: [
        "drilling supervisor", 
        "pipeline technician", 
        "safety inspector", 
        "equipment operator", 
        "refinery worker"
      ],
      minCoins: 300,
      maxCoins: 800
    },
    4: {
      name: "⛏️ Mining Ore",
      tasks: [
        "iron ore extraction", 
        "gold mining", 
        "coal mining", 
        "copper excavation", 
        "mineral processing"
      ],
      minCoins: 250,
      maxCoins: 750
    },
    5: {
      name: "💎 Digging Rock",
      tasks: [
        "diamond prospecting", 
        "gemstone excavation", 
        "quarry worker", 
        "geological surveyor", 
        "stone cutting"
      ],
      minCoins: 200,
      maxCoins: 500
    },
    6: {
      name: "🌟 Special Job",
      tasks: [
        "VIP personal assistant", 
        "patent consultant", 
        "private investigator", 
        "executive chauffeur", 
        "luxury event planner"
      ],
      minCoins: 500,
      maxCoins: 1500
    }
  },

  onStart: async function ({ api, event }) {
    api.sendMessage("💼 Job Center is ready! Type '.job' to start working and earning coins", event.threadID);
  },

  handleReply: async function ({ event, api, handleReply, Currencies, getText }) {
    const { threadID, senderID, body } = event;
    const jobType = parseInt(body);

    // Validate input
    if (isNaN(jobType)) {
      return api.sendMessage(getText("invalidNumber"), threadID);
    }

    if (!this.jobTypes[jobType] && jobType !== 7) {
      return api.sendMessage(getText("invalidJob"), threadID);
    }

    try {
      if (jobType === 7) {
        api.unsendMessage(handleReply.messageID);
        return api.sendMessage("🚧 New job opportunities coming soon! Check back later.", threadID);
      }

      // Get job details
      const job = this.jobTypes[jobType];
      const task = job.tasks[Math.floor(Math.random() * job.tasks.length)];
      const coinsEarned = Math.floor(Math.random() * (job.maxCoins - job.minCoins + 1)) + job.minCoins;

      // Add coins to user's balance
      await Currencies.increaseMoney(senderID, coinsEarned);

      // Create success message
      const message = `💼 You worked as ${task} in ${job.name} and earned ${coinsEarned} coins!`;

      api.unsendMessage(handleReply.messageID);
      api.sendMessage(message, threadID);

      // Update cooldown
      const userData = await Currencies.getData(senderID);
      userData.data = userData.data || {};
      userData.data.workTime = Date.now();
      await Currencies.setData(senderID, userData);

    } catch (error) {
      console.error("Job Error:", error);
      api.sendMessage(getText("jobError"), threadID);
    }
  },

  run: async function ({ event, api, Currencies, getText }) {
    const { threadID, senderID } = event;
    const cooldownTime = this.config.envConfig.cooldownTime;
    
    try {
      const userData = await Currencies.getData(senderID);
      const workData = userData.data || {};
      
      // Check cooldown
      if (workData.workTime && (Date.now() - workData.workTime) < cooldownTime) {
        const remainingTime = cooldownTime - (Date.now() - workData.workTime);
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        
        return api.sendMessage(
          getText("cooldown", minutes, seconds < 10 ? "0" + seconds : seconds), 
          threadID
        );
      }

      // Create job menu
      let menu = "💼 JOB CENTER - Earn Coins 💰\n\n";
      menu += "Choose a job by replying with its number:\n\n";
      
      for (const [id, job] of Object.entries(this.jobTypes)) {
        menu += `${id}. ${job.name} (${job.minCoins}-${job.maxCoins} coins)\n`;
      }
      
      menu += "7. Coming soon...\n\n";
      menu += "💼 Reply with the job number to start working";

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
  }
};
