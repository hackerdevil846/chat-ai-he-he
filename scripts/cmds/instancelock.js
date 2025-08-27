const mongoose = require("mongoose");
const os = require("os");

const instanceSchema = new mongoose.Schema({
  activeInstanceId: String,
  updatedAt: Date
});
const Instance = mongoose.models["instancelock"] || mongoose.model("instancelock", instanceSchema);

const myInstanceId = `${os.hostname()}-${process.pid}`;
const HEARTBEAT_INTERVAL = 10000; // 10 seconds
const TIMEOUT_LIMIT = 15000; // 15 seconds timeout for old instance

module.exports = {
  config: {
    name: "instancelock",
    version: "1.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Kill duplicate bot instances"
    },
    description: {
      en: "Prevents the same bot ID running in multiple environments"
    },
    category: "system",
    guide: {
      en: "Auto runs on load. No command needed."
    }
  },

  onStart: async function () {
    try {
      const now = Date.now();
      const existing = await Instance.findOne({});

      if (existing && existing.activeInstanceId !== myInstanceId) {
        const lastUpdate = existing.updatedAt?.getTime() || 0;
        const timeDiff = now - lastUpdate;

        if (timeDiff < TIMEOUT_LIMIT) {
          console.log(`🛑 Another instance (${existing.activeInstanceId}) is active. Exiting...`);
          return process.exit(0);
        } else {
          console.warn(`⚠️ Previous instance (${existing.activeInstanceId}) seems inactive. Overriding...`);
        }
      }

      await Instance.updateOne(
        {},
        { activeInstanceId: myInstanceId, updatedAt: new Date() },
        { upsert: true }
      );

      console.log(`✅ This instance (${myInstanceId}) is now the active bot.`);

      // Heartbeat to keep this instance alive
      setInterval(async () => {
        await Instance.updateOne(
          { activeInstanceId: myInstanceId },
          { updatedAt: new Date() }
        );
      }, HEARTBEAT_INTERVAL);

    } catch (err) {
      console.error("❌ Instance lock error:", err);
      process.exit(1);
    }
  }
};
