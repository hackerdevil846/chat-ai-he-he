module.exports.config = {
    name: "file",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🛠️ Manage command folder files and directories",
    commandCategory: "𝗔𝗗𝗠𝗜𝗡",
    usages: "[start/ext/help] [text]",
    cooldowns: 5
};

module.exports.languages = {
    "en": {
        "missingFile": "❌ No files found in commands folder",
        "noMatchStart": "❌ No files starting with '%1'",
        "noMatchExt": "❌ No files with extension '%1'",
        "noMatchText": "❌ No files containing '%1'",
        "deleteSuccess": "✅ Successfully deleted:\n%1",
        "helpMessage": `📖 𝗙𝗜𝗟𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗚𝗨𝗜𝗗𝗘:

• 🔹 𝗨𝘀𝗮𝗴𝗲: file start <text>
• 📝 𝗗𝗲𝘀𝗰: Delete files starting with specific text
• ✨ 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: file start rank

• 🔹 𝗨𝘀𝗮𝗴𝗲: file ext <extension>
• 📝 𝗗𝗲𝘀𝗰: Delete files with specific extension
• ✨ 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: file ext .js

• 🔹 𝗨𝘀𝗮𝗴𝗲: file <text>
• 📝 𝗗𝗲𝘀𝗰: Delete files containing text
• ✨ 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: file config

• 🔹 𝗨𝘀𝗮𝗴𝗲: file help
• 📝 𝗗𝗲𝘀𝗰: Show this help menu`
    }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const fs = require("fs-extra");
    if (event.senderID != handleReply.author) return;
    
    const nums = event.body.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n));
    let deletedItems = [];

    for (const num of nums) {
        if (num > handleReply.files.length || num < 1) continue;
        
        const target = handleReply.files[num-1];
        const path = __dirname + '/' + target;
        
        try {
            const stats = fs.statSync(path);
            if (stats.isDirectory()) {
                fs.rmdirSync(path, { recursive: true });
                deletedItems.push(`🗂️  ${target}`);
            } else if (stats.isFile()) {
                fs.unlinkSync(path);
                deletedItems.push(`📄  ${target}`);
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    }

    if (deletedItems.length > 0) {
        api.sendMessage(`✅ 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆:\n${deletedItems.join('\n')}`, event.threadID);
    } else {
        api.sendMessage("❌ No valid files/folders selected", event.threadID);
    }
};

module.exports.run = async function({ api, event, args }) {
    const fs = require("fs-extra");
    let files = fs.readdirSync(__dirname + "/");
    let message = "";
    let filteredFiles = [];

    if (args[0] === "help") {
        return api.sendMessage(this.languages.en.helpMessage, event.threadID);
    }

    if (args[0] === "start" && args[1]) {
        const prefix = args.slice(1).join(" ");
        filteredFiles = files.filter(file => file.startsWith(prefix));
        if (filteredFiles.length === 0) {
            return api.sendMessage(this.languages.en.noMatchStart.replace("%1", prefix), event.threadID);
        }
        message = `📁 𝗙𝗶𝗹𝗲𝘀 𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝘄𝗶𝘁𝗵 "${prefix}":\n\n`;
    } 
    else if (args[0] === "ext" && args[1]) {
        const extension = args[1];
        filteredFiles = files.filter(file => file.endsWith(extension));
        if (filteredFiles.length === 0) {
            return api.sendMessage(this.languages.en.noMatchExt.replace("%1", extension), event.threadID);
        }
        message = `📁 𝗙𝗶𝗹𝗲𝘀 𝘄𝗶𝘁𝗵 𝗲𝘅𝘁𝗲𝗻𝘀𝗶𝗼𝗻 "${extension}":\n\n`;
    }
    else if (args.length === 0) {
        filteredFiles = files;
        if (filteredFiles.length === 0) {
            return api.sendMessage(this.languages.en.missingFile, event.threadID);
        }
        message = "📁 𝗔𝗹𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗳𝗶𝗹𝗲𝘀:\n\n";
    }
    else {
        const searchText = args.join(" ");
        filteredFiles = files.filter(file => file.includes(searchText));
        if (filteredFiles.length === 0) {
            return api.sendMessage(this.languages.en.noMatchText.replace("%1", searchText), event.threadID);
        }
        message = `📁 𝗙𝗶𝗹𝗲𝘀 𝗰𝗼𝗻𝘁𝗮𝗶𝗻𝗶𝗻𝗴 "${searchText}":\n\n`;
    }

    filteredFiles.forEach((file, index) => {
        const isDir = fs.statSync(__dirname + '/' + file).isDirectory();
        message += `${index+1}. ${isDir ? '🗂️' : '📄'} ${file}\n`;
    });

    message += "\n💡 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗻𝘂𝗺𝗯𝗲𝗿𝘀 𝘁𝗼 𝗱𝗲𝗹𝗲𝘁𝗲 (𝗲𝘅: 𝟭 𝟯 𝟱)";

    api.sendMessage(message, event.threadID, (err, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            files: filteredFiles
        });
    });
};
