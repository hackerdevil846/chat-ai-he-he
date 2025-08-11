const os = require("os");

const startTime = Date.now();

// Helper function to convert text to Mathematical Bold Italic
function toBoldItalic(text) {
  const boldItalicMap = {
    A: "𝑨", B: "𝑩", C: "𝑪", D: "𝑫", E: "𝑬", F: "𝑭", G: "𝑮", H: "𝑯", I: "𝑰", J: "𝑱", K: "𝑲", L: "𝑳", M: "𝑴",
    N: "𝑵", O: "𝑶", P: "𝑷", Q: "𝑸", R: "𝑹", S: "𝑺", T: "𝑻", U: "𝑼", V: "𝑽", W: "𝑾", X: "𝑿", Y: "𝒀", Z: "𝒁",
    a: "𝒂", b: "𝒃", c: "𝒄", d: "𝒅", e: "𝒆", f: "𝒇", g: "𝒈", h: "𝒉", i: "𝒊", j: "𝒋", k: "𝒌", l: "𝒍", m: "𝒎",
    n: "𝒏", o: "𝒐", p: "𝒑", q: "𝒒", r: "𝒓", s: "𝒔", t: "𝒕", u: "𝒖", v: "𝒗", w: "𝒘", x: "𝒙", y: "𝒚", z: "𝒛"
  };

  return text.split('').map(char => 
    boldItalicMap[char] || char
  ).join('');
}

module.exports = {
  config: {
    name: "uptime",
    aliases: ['up', 'upt'],
    version: "1.0",
    author: "Asif",
    countDown: 5,
    role: 0,
    category: "system",
    shortDescription: "Show bot uptime & system info",
    longDescription: "Get current uptime, RAM, CPU and bot info (no media)",
    guide: "{pn}",
  },

  onStart: async function ({ api, event, threadsData, usersData }) {
    try {
      // 🕒 Uptime calculation
      const uptimeInMs = Date.now() - startTime;
      const totalSeconds = Math.floor(uptimeInMs / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // 🧠 RAM & CPU
      const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      const usedMem = (totalMem - freeMem).toFixed(2);
      const ramUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
      const cpuModel = os.cpus()[0]?.model || "Unknown CPU";

      // ⏰ Time & date
      const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Dhaka" });

      // 📡 Ping check
      const pingStart = Date.now();
      await api.sendMessage("⏳ Fetching system info...", event.threadID);
      const ping = Date.now() - pingStart;

      // 👤 Data counts
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();

      // Format titles with Mathematical Bold Italic
      const titles = {
        bot: toBoldItalic("BOT SYSTEM INFO"),
        uptime: toBoldItalic("Uptime"),
        time: toBoldItalic("Time"),
        ping: toBoldItalic("Ping"),
        cpu: toBoldItalic("CPU"),
        os: toBoldItalic("OS"),
        ram: toBoldItalic("RAM"),
        memory: toBoldItalic("Memory"),
        users: toBoldItalic("Users"),
        threads: toBoldItalic("Threads")
      };

      // 📦 Final Output
      const info = `
🔧 ${titles.bot} 🔧
────────────────────────
${titles.uptime}: ${uptime}
${titles.time}: ${now}
${titles.ping}: ${ping}ms

${titles.cpu}: ${cpuModel}
${titles.os}: ${os.type()} ${os.arch()}
${titles.ram}: ${ramUsage} MB used by bot
${titles.memory}: ${usedMem} GB / ${totalMem} GB

${titles.users}: ${allUsers.length}
${titles.threads}: ${allThreads.length}
────────────────────────`;

      await api.sendMessage(info, event.threadID);

    } catch (err) {
      console.error("❌ uptime.js error:", err);
      return api.sendMessage("⚠️ An error occurred while showing system info.", event.threadID);
    }
  },
};
