const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const ftp = require("basic-ftp");

const FTP_CONFIG = {
  host: "ftpupload.net",
  user: "cpfr_39361582",
  password: "chitron@2448766",
  secure: false,
  port: 21
};

module.exports = {
  config: {
    name: "ftp",
    version: "2.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    shortDescription: { en: "📤 Upload, list, delete FTP files" },
    description: {
      en: "📁 Upload .js/.txt/.html/etc to your FTP server (htdocs/store)"
    },
    category: "tools",
    guide: {
      en:
        "📚 Usage:\n\n" +
        "📤 Upload:\n" +
        "➤ +ftp file.js console.log('hi');\n" +
        "➤ +ftp file.js https://link\n\n" +
        "📄 List files:\n" +
        "➤ +ftp list\n\n" +
        "🗑 Delete file:\n" +
        "➤ +ftp delete file.js"
    }
  },

  onStart: async function ({ message, args }) {
    return handleFtp(message, args);
  },

  onChat: async function ({ event, message, args, prefix }) {
    if (!prefix || !args[0]) return;
    const trigger = args[0].toLowerCase();
    if (trigger !== "ftp") return;
    return handleFtp(message, args.slice(1));
  }
};

async function handleFtp(message, args) {
  const subCmd = args[0];

  // === 📄 List Files ===
  if (subCmd === "list") {
    return await listFiles(message);
  }

  // === 🗑 Delete File ===
  if (subCmd === "delete") {
    const filename = args[1];
    if (!filename)
      return message.reply("❌ Please specify a file name to delete");
    return await deleteFile(message, filename);
  }

  // === 📤 Upload File ===
  const [filename, ...rest] = args;
  if (!filename || !/\.(js|php|html|txt|py|json)$/i.test(filename)) {
    return message.reply("🚫 Valid filename required (.js, .php...)");
  }

  const content = rest.join(" ");
  if (!content)
    return message.reply("❌ Please provide code or url");

  let code;
  try {
    code = /^https?:\/\//i.test(content.trim())
      ? (await axios.get(content.trim())).data
      : content;
  } catch (err) {
    return message.reply("❌ Could not fetch code from url");
  }

  const tempPath = path.join(__dirname, "cache", filename);
  await fs.ensureDir(path.dirname(tempPath));
  await fs.writeFile(tempPath, code);

  const client = new ftp.Client();
  try {
    await client.access(FTP_CONFIG);
    await client.cd("htdocs");
    try {
      await client.send("MKD store");
    } catch {}
    await client.cd("store");

    await client.uploadFrom(tempPath, filename);
    await client.close();

    return message.reply(
      `✅ Uploaded \`${filename}\`\n` +
      `📁 to \`htdocs/store\``
    );
  } catch (err) {
    return message.reply(
      `❌ Upload failed\nReason: ${err.message}`
    );
  } finally {
    client.close();
    await fs.remove(tempPath);
  }
}

// === 📄 List Files ===
async function listFiles(message) {
  const client = new ftp.Client();
  try {
    await client.access(FTP_CONFIG);
    await client.cd("htdocs/store");
    const files = await client.list();

    if (!files.length)
      return message.reply("📭 No files found");

    const fileList = files
      .map((f, i) => `📄 ${i + 1}. ${f.name} — \`${f.size} bytes\``)
      .join("\n");

    return message.reply(
      `📁 Files in your store:\n\n${fileList}`
    );
  } catch (err) {
    return message.reply("❌ Could not list files");
  } finally {
    client.close();
  }
}

// === 🗑 Delete File ===
async function deleteFile(message, filename) {
  const client = new ftp.Client();
  try {
    await client.access(FTP_CONFIG);
    await client.remove(`htdocs/store/${filename}`);

    return message.reply(
      `🗑️ Deleted \`${filename}\`\n` +
      `💨 from \`htdocs/store\``
    );
  } catch (err) {
    return message.reply(
      `❌ Could not delete\nReason: ${err.message}`
    );
  } finally {
    client.close();
  }
}
