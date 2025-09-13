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

module.exports.config = {
    name: "ftp",
    aliases: ["ftpupload", "serverupload"],
    version: "2.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    shortDescription: {
        en: "📤 𝑈𝑝𝑙𝑜𝑎𝑑, 𝑙𝑖𝑠𝑡, 𝑑𝑒𝑙𝑒𝑡𝑒 𝐹𝑇𝑃 𝑓𝑖𝑙𝑒𝑠"
    },
    longDescription: {
        en: "📁 𝑈𝑝𝑙𝑜𝑎𝑑 .𝑗𝑠/.𝑡𝑥𝑡/.ℎ𝑡𝑚𝑙/𝑒𝑡𝑐 𝑡𝑜 𝑦𝑜𝑢𝑟 𝐹𝑇𝑃 𝑠𝑒𝑟𝑣𝑒𝑟 (ℎ𝑡𝑑𝑜𝑐𝑠/𝑠𝑡𝑜𝑟𝑒)"
    },
    category: "𝑡𝑜𝑜𝑙𝑠",
    guide: {
        en: "📚 𝑈𝑠𝑎𝑔𝑒:\n\n" +
            "📤 𝑈𝑝𝑙𝑜𝑎𝑑:\n" +
            "➤ {𝑝}𝑓𝑡𝑝 𝑓𝑖𝑙𝑒.𝑗𝑠 𝑐𝑜𝑛𝑠𝑜𝑙𝑒.𝑙𝑜𝑔('ℎ𝑖');\n" +
            "➤ {𝑝}𝑓𝑡𝑝 𝑓𝑖𝑙𝑒.𝑗𝑠 ℎ𝑡𝑡𝑝𝑠://𝑙𝑖𝑛𝑘\n\n" +
            "📄 𝐿𝑖𝑠𝑡 𝑓𝑖𝑙𝑒𝑠:\n" +
            "➤ {𝑝}𝑓𝑡𝑝 𝑙𝑖𝑠𝑡\n\n" +
            "🗑 𝐷𝑒𝑙𝑒𝑡𝑒 𝑓𝑖𝑙𝑒:\n" +
            "➤ {𝑝}𝑓𝑡𝑝 𝑑𝑒𝑙𝑒𝑡𝑒 𝑓𝑖𝑙𝑒.𝑗𝑠"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "basic-ftp": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        if (!args || args.length === 0) {
            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑. 𝑈𝑠𝑒: {𝑝}𝑓𝑡𝑝 ℎ𝑒𝑙𝑝");
        }
        return await handleFtp(message, args);
    } catch (error) {
        console.error("𝐹𝑇𝑃 𝐸𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: " + error.message);
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
            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑎 𝑓𝑖𝑙𝑒 𝑛𝑎𝑚𝑒 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒");
        return await deleteFile(message, filename);
    }

    // === Help Command ===
    if (subCmd === "help") {
        return message.reply(module.exports.config.guide.en);
    }

    // === 📤 Upload File ===
    const [filename, ...rest] = args;
    if (!filename || !/\.(js|php|html|txt|py|json)$/i.test(filename)) {
        return message.reply("🚫 𝑉𝑎𝑙𝑖𝑑 𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 (.𝑗𝑠, .𝑝ℎ𝑝...)");
    }

    const content = rest.join(" ");
    if (!content)
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑐𝑜𝑑𝑒 𝑜𝑟 𝑢𝑟𝑙");

    let code;
    try {
        code = /^https?:\/\//i.test(content.trim())
            ? (await axios.get(content.trim())).data
            : content;
    } catch (err) {
        return message.reply("❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑓𝑒𝑡𝑐ℎ 𝑐𝑜𝑑𝑒 𝑓𝑟𝑜𝑚 𝑢𝑟𝑙");
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
            `✅ 𝑈𝑝𝑙𝑜𝑎𝑑𝑒𝑑 \`${filename}\`\n` +
            `📁 𝑡𝑜 \`ℎ𝑡𝑑𝑜𝑐𝑠/𝑠𝑡𝑜𝑟𝑒\``
        );
    } catch (err) {
        return message.reply(
            `❌ 𝑈𝑝𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑\n𝑅𝑒𝑎𝑠𝑜𝑛: ${err.message}`
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
            return message.reply("📭 𝑁𝑜 𝑓𝑖𝑙𝑒𝑠 𝑓𝑜𝑢𝑛𝑑");

        const fileList = files
            .map((f, i) => `📄 ${i + 1}. ${f.name} — \`${f.size} 𝑏𝑦𝑡𝑒𝑠\``)
            .join("\n");

        return message.reply(
            `📁 𝐹𝑖𝑙𝑒𝑠 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑠𝑡𝑜𝑟𝑒:\n\n${fileList}`
        );
    } catch (err) {
        return message.reply("❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑙𝑖𝑠𝑡 𝑓𝑖𝑙𝑒𝑠");
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
            `🗑️ 𝐷𝑒𝑙𝑒𝑡𝑒𝑑 \`${filename}\`\n` +
            `💨 𝑓𝑟𝑜𝑚 \`ℎ𝑡𝑑𝑜𝑐𝑠/𝑠𝑡𝑜𝑟𝑒\``
        );
    } catch (err) {
        return message.reply(
            `❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑑𝑒𝑙𝑒𝑡𝑒\n𝑅𝑒𝑎𝑠𝑜𝑛: ${err.message}`
        );
    } finally {
        client.close();
    }
}
