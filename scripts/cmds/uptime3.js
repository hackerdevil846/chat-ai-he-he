const os = require("os");
const fs = require("fs-extra");

const startTime = new Date();

module.exports = {
  config: {
    name: "uptime3",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝒕𝒆𝒔𝒕",
    category: "𝒃𝒐𝒙",
    usages: "𝒕𝒆𝒔𝒕",
    prefix: "𝒇𝒂𝒍𝒔𝒆",
    dependencies: {},
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    try {
      const uptimeInSeconds = (new Date() - startTime) / 1000;

      const seconds = uptimeInSeconds;
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secondsLeft = Math.floor(seconds % 60);
      const uptimeFormatted = `${days}𝒅 ${hours}𝒉 ${minutes}𝒎 ${secondsLeft}𝒔`;

      const loadAverage = os.loadavg();
      const cpuUsage =
        os
          .cpus()
          .map((cpu) => cpu.times.user)
          .reduce((acc, curr) => acc + curr) / os.cpus().length;

      const totalMemoryGB = os.totalmem() / 1024 ** 3;
      const freeMemoryGB = os.freemem() / 1024 ** 3;
      const usedMemoryGB = totalMemoryGB - freeMemoryGB;

      const currentDate = new Date();
      const options = { year: "numeric", month: "numeric", day: "numeric" };
      const date = currentDate.toLocaleDateString("en-US", options);
      const time = currentDate.toLocaleTimeString("en-US", {
        timeZone: "Asia/Dhaka",
        hour12: true,
      });

      const timeStart = Date.now();
      await api.sendMessage({
        body: "🔎| 𝒄𝒉𝒆𝒄𝒌 𝒌𝒐𝒓𝒄𝒉𝒊........",
      }, event.threadID);

      const ping = Date.now() - timeStart;

      let pingStatus = "⛔| 𝒃𝒂𝒅 𝒔𝒚𝒔𝒕𝒆𝒎";
      if (ping < 1000) {
        pingStatus = "✅| 𝒔𝒎𝒐𝒐𝒕𝒉 𝒔𝒚𝒔𝒕𝒆𝒎";
      }
      const systemInfo = `♡   ∩_∩
 （„• ֊ •„)♡
╭─∪∪────────────⟡
│ 𝑼𝑷𝑻𝑰𝑴𝑬 𝑰𝑵𝑭𝑶
├───────────────⟡
│ ⏰ 𝑹𝑼𝑵𝑻𝑰𝑴𝑬
│  ${uptimeFormatted}
├───────────────⟡
│ 👑 𝑺𝒀𝑺𝑻𝑬𝑴 𝑰𝑵𝑭𝑶
│𝑶𝑺: ${os.type()} ${os.arch()}
│𝑳𝑨𝑵𝑮 𝑽𝑬𝑹: ${process.version}
│𝑪𝑷𝑼 𝑴𝑶𝑫𝑬𝑳: ${os.cpus()[0].model}
│𝑺𝑻𝑶𝑹𝑨𝑮𝑬: ${usedMemoryGB.toFixed(2)} 𝑮𝑩 / ${totalMemoryGB.toFixed(2)} 𝑮𝑩
│𝑪𝑷𝑼 𝑼𝑺𝑨𝑮𝑬: ${cpuUsage.toFixed(1)}%
│𝑹𝑨𝑴 𝑼𝑺𝑮𝑬: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} 𝑴𝑩
├───────────────⟡
│ ✅ 𝑶𝑻𝑯𝑬𝑹 𝑰𝑵𝑭𝑶
│𝑫𝑨𝑻𝑬: ${date}
│𝑻𝑰𝑴𝑬: ${time}
│𝑷𝑰𝑵𝑮: ${ping}𝒎𝒔
│𝑺𝑻𝑨𝑻𝑼𝑺: ${pingStatus}
╰───────────────⟡
`;

      api.sendMessage(
        {
          body: systemInfo,
        },
        event.threadID,
        (err, messageInfo) => {
          if (err) {
            console.error("Error sending message with attachment:", err);
          } else {
            console.log(
              "Message with attachment sent successfully:",
              messageInfo,
            );
          }
        },
      );
    } catch (error) {
      console.error("Error retrieving system information:", error);
      api.sendMessage(
        "𝑼𝒏𝒂𝒃𝒍𝒆 𝒕𝒐 𝒓𝒆𝒕𝒓𝒊𝒆𝒗𝒆 𝒔𝒚𝒔𝒕𝒆𝒎 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏.",
        event.threadID
      );
    }
  }
};
