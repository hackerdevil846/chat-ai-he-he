const fs = require("fs-extra");
const { promisify } = require("util");

module.exports.config = {
    name: "cache",
    aliases: ["cacheman", "cm"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 2,
    category: "system",
    shortDescription: {
        en: "📁 𝑀𝑎𝑛𝑎𝑔𝑒 𝑐𝑎𝑐ℎ𝑒 𝑓𝑜𝑙𝑑𝑒𝑟 𝑓𝑖𝑙𝑒𝑠 𝑎𝑛𝑑 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑖𝑒𝑠"
    },
    longDescription: {
        en: "📁 𝑀𝑎𝑛𝑎𝑔𝑒𝑠 𝑐𝑎𝑐ℎ𝑒 𝑓𝑜𝑙𝑑𝑒𝑟 𝑓𝑖𝑙𝑒𝑠 𝑎𝑛𝑑 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑖𝑒𝑠 𝑤𝑖𝑡ℎ 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑓𝑖𝑙𝑡𝑒𝑟𝑠"
    },
    guide: {
        en: "{p}cache [𝑠𝑡𝑎𝑟𝑡|𝑒𝑥𝑡|ℎ𝑒𝑙𝑝] [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "fs-extra": "",
        "util": ""
    },
    envConfig: {
        allowedUsers: ["61571630409265"]
    }
};

const toMBI = (str) => {
    const map = {
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 
        'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 
        'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 
        'y': '𝒚', 'z': '𝒛', 'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 
        'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 
        'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 
        'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
    };
    return str.split('').map(char => map[char] || char).join('');
};

module.exports.onReply = async function({ api, event, handleReply }) {
    if (event.senderID !== handleReply.author) return;
    
    const unlinkAsync = promisify(fs.unlink);
    const rmdirAsync = promisify(fs.rmdir);
    
    let successList = [];
    let errorList = [];
    const nums = event.body.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n) && n > 0 && n <= handleReply.files.length);

    if (nums.length === 0) {
        return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟𝑠 𝑠𝑒𝑝𝑎𝑟𝑎𝑡𝑒𝑑 𝑏𝑦 𝑠𝑝𝑎𝑐𝑒𝑠.", event.threadID);
    }

    for (const num of nums) {
        const target = handleReply.files[num - 1];
        const path = `${__dirname}/cache/${target}`;
        
        try {
            if (fs.existsSync(path)) {
                const stat = fs.statSync(path);
                if (stat.isDirectory()) {
                    await rmdirAsync(path, { recursive: true });
                    successList.push(`🗂️ ${target}`);
                } else {
                    await unlinkAsync(path);
                    successList.push(`📄 ${target}`);
                }
            }
        } catch (error) {
            errorList.push(`❌ ${target}: ${error.message}`);
        }
    }

    let response = "";
    if (successList.length > 0) {
        response += `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑒𝑙𝑒𝑡𝑒𝑑 ${successList.length} 𝑖𝑡𝑒𝑚(𝑠):\n${successList.join('\n')}\n\n`;
    }
    if (errorList.length > 0) {
        response += `❌ 𝐸𝑟𝑟𝑜𝑟𝑠 ${errorList.length}:\n${errorList.join('\n')}`;
    }

    api.sendMessage(toMBI(response || "⚠️ 𝑁𝑜 𝑖𝑡𝑒𝑚𝑠 𝑤𝑒𝑟𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑒𝑑"), event.threadID);
};

module.exports.onStart = async function({ api, event, args }) {
    const cachePath = `${__dirname}/cache`;
    
    // Permission check
    if (!module.exports.config.envConfig.allowedUsers.includes(event.senderID)) {
        return api.sendMessage("⛔ 𝐴𝑐𝑐𝑒𝑠𝑠 𝐷𝑒𝑛𝑖𝑒𝑑: 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑", event.threadID);
    }

    // Help command
    if (args[0] === "help") {
        const helpMsg = `
🔄 𝐂𝐀𝐂𝐇𝐄 𝐌𝐀𝐍𝐀𝐆𝐄𝐌𝐄𝐍𝐓 𝐒𝐘𝐒𝐓𝐄𝐌

▸ 𝑐𝑎𝑐ℎ𝑒 𝑠𝑡𝑎𝑟𝑡 <𝑡𝑒𝑥𝑡>
   ↳ 𝐹𝑖𝑙𝑡𝑒𝑟 𝑓𝑖𝑙𝑒𝑠 𝑠𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑤𝑖𝑡ℎ 𝑡𝑒𝑥𝑡
   ↳ 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑐𝑎𝑐ℎ𝑒 𝑠𝑡𝑎𝑟𝑡 𝑎𝑏𝑐

▸ 𝑐𝑎𝑐ℎ𝑒 𝑒𝑥𝑡 <𝑒𝑥𝑡𝑒𝑛𝑠𝑖𝑜𝑛>
   ↳ 𝐹𝑖𝑙𝑡𝑒𝑟 𝑓𝑖𝑙𝑒𝑠 𝑏𝑦 𝑒𝑥𝑡𝑒𝑛𝑠𝑖𝑜𝑛
   ↳ 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑐𝑎𝑐ℎ𝑒 𝑒𝑥𝑡 .𝑝𝑛𝑔

▸ 𝑐𝑎𝑐ℎ𝑒 <𝑡𝑒𝑥𝑡>
   ↳ 𝐹𝑖𝑙𝑡𝑒𝑟 𝑓𝑖𝑙𝑒𝑠 𝑐𝑜𝑛𝑡𝑎𝑖𝑛𝑖𝑛𝑔 𝑡𝑒𝑥𝑡
   ↳ 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑐𝑎𝑐ℎ𝑒 𝑡𝑒𝑠𝑡

▸ 𝑐𝑎𝑐ℎ𝑒
   ↳ 𝐿𝑖𝑠𝑡 𝑎𝑙𝑙 𝑐𝑎𝑐ℎ𝑒 𝑓𝑖𝑙𝑒𝑠

▸ 𝑐𝑎𝑐ℎ𝑒 ℎ𝑒𝑙𝑝
   ↳ 𝑆ℎ𝑜𝑤 𝑡ℎ𝑖𝑠 ℎ𝑒𝑙𝑝 𝑚𝑒𝑠𝑠𝑎𝑔𝑒

📝 𝑁𝑂𝑇𝐸: 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑛𝑢𝑚𝑏𝑒𝑟𝑠 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒 𝑓𝑖𝑙𝑒𝑠/𝑓𝑜𝑙𝑑𝑒𝑟𝑠
🔒 𝑃𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛: 𝐵𝑜𝑡 𝐴𝑑𝑚𝑖𝑛 𝑂𝑛𝑙𝑦
👨‍💻 𝐶𝑟𝑒𝑎𝑡𝑜𝑟: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;
        return api.sendMessage(helpMsg, event.threadID);
    }

    // Read cache directory
    let files = [];
    try {
        files = fs.readdirSync(cachePath);
    } catch (error) {
        return api.sendMessage(`❌ 𝐸𝑟𝑟𝑜𝑟 𝑟𝑒𝑎𝑑𝑖𝑛𝑔 𝑐𝑎𝑐ℎ𝑒 𝑓𝑜𝑙𝑑𝑒𝑟: ${error.message}`, event.threadID);
    }

    let filterType = "";
    let filterValue = "";
    let filteredFiles = [];

    // Apply filters
    if (args[0] === "start" && args[1]) {
        filterValue = args.slice(1).join(" ");
        filteredFiles = files.filter(file => file.startsWith(filterValue));
        filterType = `𝑠𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑤𝑖𝑡ℎ "${filterValue}"`;
    } else if (args[0] === "ext" && args[1]) {
        filterValue = args[1];
        filteredFiles = files.filter(file => file.endsWith(filterValue));
        filterType = `𝑤𝑖𝑡ℎ 𝑒𝑥𝑡𝑒𝑛𝑠𝑖𝑜𝑛 "${filterValue}"`;
    } else if (args.length > 0) {
        filterValue = args.join(" ");
        filteredFiles = files.filter(file => file.includes(filterValue));
        filterType = `𝑐𝑜𝑛𝑡𝑎𝑖𝑛𝑖𝑛𝑔 "${filterValue}"`;
    } else {
        filteredFiles = files;
        filterType = "𝑖𝑛 𝑐𝑎𝑐ℎ𝑒";
    }

    // Handle no results
    if (filteredFiles.length === 0) {
        return api.sendMessage(
            `📭 𝑁𝑜 𝑓𝑖𝑙𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 ${filterType}\n💡 𝑇𝑟𝑦: 𝑐𝑎𝑐ℎ𝑒 ℎ𝑒𝑙𝑝 𝑓𝑜𝑟 𝑢𝑠𝑎𝑔𝑒 𝑖𝑛𝑠𝑡𝑟𝑢𝑐𝑡𝑖𝑜𝑛𝑠`, 
            event.threadID
        );
    }

    // Format file list
    let fileList = "";
    filteredFiles.forEach((file, index) => {
        const fullPath = `${cachePath}/${file}`;
        try {
            const stat = fs.statSync(fullPath);
            const type = stat.isDirectory() ? "🗂️" : "📄";
            const size = stat.isDirectory() ? "" : ` (${formatBytes(stat.size)})`;
            fileList += `${index + 1}. ${type} ${file}${size}\n`;
        } catch (error) {
            fileList += `${index + 1}. ❓ ${file} (𝑖𝑛𝑎𝑐𝑐𝑒𝑠𝑠𝑖𝑏𝑙𝑒)\n`;
        }
    });

    // Send results
    const totalSize = await getTotalSize(cachePath, filteredFiles);
    const message = `
📦 𝐂𝐀𝐂𝐇𝐄 𝐌𝐀𝐍𝐀𝐆𝐄𝐑

🔍 𝐹𝑜𝑢𝑛𝑑 ${filteredFiles.length} 𝑖𝑡𝑒𝑚𝑠 ${filterType}
💾 𝑇𝑜𝑡𝑎𝑙 𝑠𝑖𝑧𝑒: ${formatBytes(totalSize)}

${fileList}
✨ 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑛𝑢𝑚𝑏𝑒𝑟𝑠 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒 (𝑒𝑥: 1 3 5)
📝 𝑀𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑛𝑢𝑚𝑏𝑒𝑟𝑠 𝑠𝑒𝑝𝑎𝑟𝑎𝑡𝑒𝑑 𝑏𝑦 𝑠𝑝𝑎𝑐𝑒𝑠
❌ 𝑇𝑦𝑝𝑒 '𝑐𝑎𝑛𝑐𝑒𝑙' 𝑡𝑜 𝑎𝑏𝑜𝑟𝑡 𝑜𝑝𝑒𝑟𝑎𝑡𝑖𝑜𝑛
    `;

    api.sendMessage(toMBI(message), event.threadID, (error, info) => {
        if (!error) {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                files: filteredFiles
            });
        }
    });
};

// Helper functions
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 𝐵𝑦𝑡𝑒𝑠';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['𝐵𝑦𝑡𝑒𝑠', '𝐾𝐵', '𝑀𝐵', '𝐺𝐵'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function getTotalSize(cachePath, files) {
    let totalSize = 0;
    
    for (const file of files) {
        try {
            const stat = fs.statSync(`${cachePath}/${file}`);
            if (!stat.isDirectory()) {
                totalSize += stat.size;
            }
        } catch (error) {
            // Skip inaccessible files
        }
    }
    
    return totalSize;
}
