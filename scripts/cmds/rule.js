module.exports.config = {
	name: "rule",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑷𝒓𝒐𝒕𝒊𝒕𝒊 𝒈𝒓𝒖𝒑𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒌𝒉𝒂𝒔𝒂 𝒌𝒐𝒓𝒂",
	commandCategory: "𝒈𝒓𝒖𝒑",
	usages: "[𝒂𝒅𝒅/𝒓𝒆𝒎𝒐𝒗𝒆/𝒂𝒍𝒍] [𝒔𝒉𝒐𝒃𝒅𝒐/𝑰𝑫]",
	cooldowns: 5,
	dependencies: {
        "fs-extra": "",
        "path": ""
    }
}

module.exports.onLoad = () => {
    const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const pathData = join(__dirname, "cache", "rules.json");
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
}

module.exports.run = ({ event, api, args, permssion }) => {
    const { threadID, messageID } = event;
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const pathData = join(__dirname, "cache", "rules.json");
    const content = (args.slice(1, args.length)).join(" ");
    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };

    function toMathBoldItalic(str) {
        const map = {
            'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
            'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
            'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
            'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
        };
        return str.split('').map(char => map[char] || char).join('');
    }

    switch (args[0]) {
        case "add": {
            if (permssion == 0) return api.sendMessage(toMathBoldItalic("[𝑵𝒊𝒚𝒐𝒎] 𝑨𝒑𝒏𝒂𝒓 𝒂𝒓𝒐 𝒏𝒊𝒚𝒐𝒎 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒑𝒐𝒓𝒂 𝒌𝒉𝒐𝒎𝒐𝒕𝒂 𝒏𝒆𝒊!"), threadID, messageID);
            if (content.length == 0) return api.sendMessage(toMathBoldItalic("[𝑵𝒊𝒚𝒐𝒎] 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒔𝒉𝒐𝒏 𝒑𝒖𝒓𝒐𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒏𝒊!"), threadID, messageID);
            if (content.indexOf("\n") != -1) {
                const contentSplit = content.split("\n");
                for (const item of contentSplit) thisThread.listRule.push(item);
            }
            else {
                thisThread.listRule.push(content);
            }
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            api.sendMessage(toMathBoldItalic('[𝑵𝒊𝒚𝒐𝒎] 𝑵𝒐𝒕𝒖𝒏 𝒏𝒊𝒚𝒐𝒎 𝒔𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!'), threadID, messageID);
            break;
        }
        case "list":
        case"all": {
            var msg = "", index = 0;
            for (const item of thisThread.listRule) msg += `${index+=1}/ ${item}\n`;
            if (msg.length == 0) return api.sendMessage(toMathBoldItalic("[𝑵𝒊𝒚𝒐𝒎] 𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒖𝒑𝒆𝒓 𝒌𝒐𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒏𝒆𝒊 𝒅𝒆𝒌𝒉𝒂𝒏𝒐𝒓 𝒋𝒐𝒏𝒏𝒐!"), threadID, messageID);
            api.sendMessage(toMathBoldItalic(`=== 𝑮𝒓𝒖𝒑 𝒏𝒊𝒚𝒐𝒎 ===\n\n${msg}`), threadID, messageID);
            break;
        }
        case "rm":
        case "remove":
        case "delete": {
            if (!isNaN(content) && content > 0) {
                if (permssion == 0) return api.sendMessage(toMathBoldItalic("[𝑵𝒊𝒚𝒐𝒎] 𝑵𝒊𝒚𝒐𝒎 𝒎𝒆𝒕𝒆 𝒑𝒆𝒕𝒆 𝒂𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒎𝒐𝒕𝒂 𝒏𝒆𝒊!"), threadID, messageID);
                if (thisThread.listRule.length == 0) return api.sendMessage(toMathBoldItalic("[𝑵𝒊𝒚𝒐𝒎] 𝑴𝒆𝒕𝒆 𝒅𝒆𝒐𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒌𝒐𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒏𝒆𝒊!"), threadID, messageID);
                thisThread.listRule.splice(content - 1, 1);
                api.sendMessage(toMathBoldItalic(`[𝑵𝒊𝒚𝒐𝒎] ${content} 𝒏𝒖𝒎𝒃𝒆𝒓 𝒏𝒊𝒚𝒐𝒎 𝒎𝒆𝒕𝒆 𝒅𝒆𝒐𝒂 𝒉𝒐𝒍𝒐!`), threadID, messageID);
                break;
            }
            else if (content == "all") {
                if (permssion == 0) return api.sendMessage(toMathBoldItalic("[𝑵𝒊𝒚𝒐𝒎] 𝑵𝒊𝒚𝒐𝒎 𝒎𝒆𝒕𝒆 𝒑𝒆𝒕𝒆 𝒂𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒎𝒐𝒕𝒂 𝒏𝒆𝒊!"), threadID, messageID);
                if (thisThread.listRule.length == 0) return api.sendMessage(toMathBoldItalic("[𝑵𝒊𝒚𝒐𝒎] 𝑴𝒆𝒕𝒆 𝒅𝒆𝒐𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒌𝒐𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒏𝒆𝒊!"), threadID, messageID);
                thisThread.listRule = [];
                api.sendMessage(toMathBoldItalic(`[𝑵𝒊𝒚𝒐𝒎] 𝑺𝒐𝒃 𝒏𝒊𝒚𝒐𝒎 𝒎𝒆𝒕𝒆 𝒅𝒆𝒐𝒂 𝒉𝒐𝒍𝒐!`), threadID, messageID);
                break;
            }
        }
        default: {
            if (thisThread.listRule.length != 0) {
                var msg = "", index = 0;
                for (const item of thisThread.listRule) msg += `${index+=1}/ ${item}\n`;
                return api.sendMessage(toMathBoldItalic(`=== 𝑮𝒓𝒖𝒑 𝒏𝒊𝒚𝒐𝒎 ===\n\n${msg} \n[𝑮𝒓𝒖𝒑𝒆𝒓 𝒏𝒊𝒚𝒐𝒎 𝒎𝒂𝒏𝒆 𝒂𝒑𝒏𝒂𝒓 𝒌𝒐𝒎𝒖𝒏𝒊𝒕𝒊𝒌𝒆 𝒃𝒉𝒂𝒍𝒐 𝒓𝒂𝒌𝒉𝒕𝒆 𝒔𝒂𝒉𝒂𝒋𝒐𝒈 𝒌𝒐𝒓𝒃𝒆!]`), threadID, messageID);
            }
            else return api.sendMessage(toMathBoldItalic("[𝑵𝒊𝒚𝒐𝒎] 𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒖𝒑𝒆𝒓 𝒌𝒐𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒏𝒆𝒊!"), threadID, messageID);
        }
    }

    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
    return writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
}
