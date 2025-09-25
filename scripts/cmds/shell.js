const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

module.exports = {
  config: {
    name: "shell",
    aliases: [],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "system",
    shortDescription: {
      en: "💻 𝑅𝑢𝑛 𝑠ℎ𝑒𝑙𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 (𝑜𝑤𝑛𝑒𝑟 𝑜𝑛𝑙𝑦)"
    },
    longDescription: {
      en: "𝐸𝑥𝑒𝑐𝑢𝑡𝑒 𝑠𝑦𝑠𝑡𝑒𝑚 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑜𝑛 𝑡ℎ𝑒 𝑠𝑒𝑟𝑣𝑒𝑟 (𝑟𝑒𝑠𝑡𝑟𝑖𝑐𝑡𝑒𝑑 𝑡𝑜 𝑜𝑤𝑛𝑒𝑟)"
    },
    guide: {
      en: "{p}shell [𝑐𝑜𝑚𝑚𝑎𝑛𝑑]"
    },
    countDown: 0,
    dependencies: {
      "child_process": ""
    }
  },

  langs: {
    "en": {
      "notAllowed": "❌ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.",
      "noCommand": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑡𝑜 𝑒𝑥𝑒𝑐𝑢𝑡𝑒.",
      "execError": "❌ 𝐸𝑟𝑟𝑜𝑟:",
      "execStderr": "⚠️ 𝑆𝑡𝑑𝑒𝑟𝑟:",
      "execStdout": "✅ 𝑆𝑡𝑑𝑜𝑢𝑡:",
      "noOutput": "✅ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑥𝑒𝑐𝑢𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑏𝑢𝑡 𝑡ℎ𝑒𝑟𝑒 𝑤𝑎𝑠 𝑛𝑜 𝑜𝑢𝑡𝑝𝑢𝑡."
    }
  },

  onStart: async function ({ api, event, args, message, getText }) {
    try {
      // Only allow specific sender IDs to run this command (owner only)
      const permission = ["61571630409265"];
      if (!permission.includes(String(event.senderID))) {
        return message.reply(getText("notAllowed"));
      }

      const text = args.join(" ").trim();
      if (!text) {
        return message.reply(getText("noCommand"));
      }

      // Execute the command with increased buffer size
      exec(text, { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout, stderr) => {
        try {
          // Handle execution errors
          if (error) {
            const errMsg = `${getText("execError")}\n${error.message || String(error)}`;
            
            if (errMsg.length >= 1500) {
              const filePath = path.join(__dirname, `shell_error_${Date.now()}.txt`);
              fs.writeFileSync(filePath, errMsg, "utf8");
              
              await message.reply({ 
                body: "❌ 𝐸𝑟𝑟𝑜𝑟 (𝑜𝑢𝑡𝑝𝑢𝑡 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔, 𝑠𝑒𝑛𝑡 𝑎𝑠 𝑓𝑖𝑙𝑒):", 
                attachment: fs.createReadStream(filePath) 
              });
              
              fs.unlinkSync(filePath);
            } else {
              return message.reply(errMsg);
            }
            return;
          }

          // Handle stderr output
          if (stderr && String(stderr).trim()) {
            const stderrText = `${getText("execStderr")}\n${stderr}`;
            
            if (stderrText.length >= 1500) {
              const filePath = path.join(__dirname, `shell_stderr_${Date.now()}.txt`);
              fs.writeFileSync(filePath, stderrText, "utf8");
              
              await message.reply({ 
                body: "⚠️ 𝑆𝑡𝑑𝑒𝑟𝑟 (𝑜𝑢𝑡𝑝𝑢𝑡 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔, 𝑠𝑒𝑛𝑡 𝑎𝑠 𝑓𝑖𝑙𝑒):", 
                attachment: fs.createReadStream(filePath) 
              });
              
              fs.unlinkSync(filePath);
            } else {
              await message.reply(stderrText);
            }
          }

          // Handle stdout output
          if (stdout && String(stdout).trim()) {
            const outText = `${getText("execStdout")}\n${stdout}`;
            
            if (outText.length >= 1500) {
              const filePath = path.join(__dirname, `shell_stdout_${Date.now()}.txt`);
              fs.writeFileSync(filePath, outText, "utf8");
              
              await message.reply({ 
                body: "✅ 𝑆𝑡𝑑𝑜𝑢𝑡 (𝑜𝑢𝑡𝑝𝑢𝑡 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔, 𝑠𝑒𝑛𝑡 𝑎𝑠 𝑓𝑖𝑙𝑒):", 
                attachment: fs.createReadStream(filePath) 
              });
              
              fs.unlinkSync(filePath);
            } else {
              return message.reply(outText);
            }
          } else {
            // No output case
            return message.reply(getText("noOutput"));
          }
        } catch (innerErr) {
          // Handle inner errors
          const msg = `❌ 𝐼𝑛𝑡𝑒𝑟𝑛𝑎𝑙 ℎ𝑎𝑛𝑑𝑙𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:\n${innerErr?.message || String(innerErr)}`;
          return message.reply(msg);
        }
      });
    } catch (err) {
      // Handle top-level errors
      const msg = `❌ 𝑈𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟:\n${err?.message || String(err)}`;
      return message.reply(msg);
    }
  }
};
