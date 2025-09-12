const { removeHomeDir, log } = global.utils;

module.exports.config = {
    name: "eval",
    aliases: ["run", "execute"],
    version: "1.6",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "owner",
    shortDescription: {
        en: "𝑇𝑒𝑠𝑡 𝑐𝑜𝑑𝑒 𝑞𝑢𝑖𝑐𝑘𝑙𝑦 𝑤𝑖𝑡ℎ 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑜𝑢𝑡𝑝𝑢𝑡 📝"
    },
    longDescription: {
        en: "𝐸𝑥𝑒𝑐𝑢𝑡𝑒 𝑎𝑛𝑑 𝑡𝑒𝑠𝑡 𝐽𝑎𝑣𝑎𝑆𝑐𝑟𝑖𝑝𝑡 𝑐𝑜𝑑𝑒 𝑤𝑖𝑡ℎ 𝑛𝑖𝑐𝑒𝑙𝑦 𝑓𝑜𝑟𝑚𝑎𝑡𝑡𝑒𝑑 𝑜𝑢𝑡𝑝𝑢𝑡"
    },
    guide: {
        en: "{p}eval <𝑐𝑜𝑑𝑒_𝑡𝑜_𝑡𝑒𝑠𝑡>"
    },
    dependencies: {
        "moment": ""
    }
};

module.exports.languages = {
    "en": {
        "error": "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑑𝑒:",
        "success": "✨ 𝐶𝑜𝑑𝑒 𝑒𝑥𝑒𝑐𝑢𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!"
    }
};

module.exports.onStart = async function({ api, event, args, getText }) {
    try {
        if (args.length === 0) {
            return api.sendMessage("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑐𝑜𝑑𝑒 𝑡𝑜 𝑒𝑥𝑒𝑐𝑢𝑡𝑒.", event.threadID, event.messageID);
        }

        // Helper for output
        function output(msg) {
            const formattedMsg = formatOutput(msg);
            api.sendMessage(`📊 𝑂𝑢𝑡𝑝𝑢𝑡:\n${formattedMsg}`, event.threadID);
        }

        function out(msg) {
            output(msg);
        }

        // Format nicely with emojis
        function formatOutput(msg) {
            if (typeof msg === "number") return `🔢 ${msg.toString()}`;
            else if (typeof msg === "boolean") return `⚡ ${msg.toString()}`;
            else if (typeof msg === "function") return `🔧 ${msg.toString()}`;
            else if (msg instanceof Map) {
                let text = `🗺️ 𝑀𝑎𝑝(${msg.size}) `;
                text += JSON.stringify(mapToObj(msg), null, 2);
                return text;
            }
            else if (typeof msg === "object" && msg !== null)
                return `📦 ${JSON.stringify(msg, null, 2)}`;
            else if (typeof msg === "undefined")
                return "❓ 𝑢𝑛𝑑𝑒𝑓𝑖𝑛𝑒𝑑";
            else
                return `📝 ${msg}`;
        }

        // Convert Map to Object
        function mapToObj(map) {
            const obj = {};
            map.forEach((v, k) => obj[k] = v);
            return obj;
        }

        // Eval wrapped
        const evalCode = `
        (async () => {
            try {
                ${args.join(" ")}
            } catch(err) {
                log.err("eval command", err);
                output(
                    "${getText("error")}\\n" +
                    (err.stack ?
                        removeHomeDir(err.stack) :
                        removeHomeDir(JSON.stringify(err, null, 2) || "")
                    )
                );
            }
        })()`;
        
        eval(evalCode);
        api.sendMessage(getText("success"), event.threadID, event.messageID);
    } 
    catch (error) {
        log.error("Eval command error", error);
        api.sendMessage(`❌ 𝐸𝑟𝑟𝑜𝑟: ${error.message}`, event.threadID, event.messageID);
    }
};
