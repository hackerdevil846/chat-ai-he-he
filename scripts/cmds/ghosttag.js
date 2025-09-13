module.exports.config = {
    name: "ghosttag",
    aliases: ["gtag", "spamtag"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 1,
    role: 1,
    category: "group",
    shortDescription: {
        en: "𝐶𝑜𝑛𝑡𝑖𝑛𝑢𝑜𝑢𝑠𝑙𝑦 𝑡𝑎𝑔 𝑢𝑠𝑒𝑟 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑡𝑖𝑚𝑒𝑠"
    },
    longDescription: {
        en: "𝑇𝑎𝑔 𝑎 𝑢𝑠𝑒𝑟 𝑐𝑜𝑛𝑡𝑖𝑛𝑢𝑜𝑢𝑠𝑙𝑦 𝑓𝑜𝑟 𝑎 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑒𝑑 𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑡𝑖𝑚𝑒𝑠"
    },
    guide: {
        en: "{p}ghosttag @mention [𝑡𝑖𝑚𝑒𝑠] [𝑑𝑒𝑙𝑎𝑦]"
    },
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    try {
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const { mentions, threadID, messageID } = event;
        
        function reply(body) {
            api.sendMessage(body, threadID, messageID);
        }

        if (!global.client.modulesGhostTag) global.client.modulesGhostTag = [];
        const dataGhostTag = global.client.modulesGhostTag;
        
        if (!dataGhostTag.some(item => item.threadID == threadID)) {
            dataGhostTag.push({ threadID, targetID: [] });
        }
        
        const thisGhostTag = dataGhostTag.find(item => item.threadID == threadID);

        if (args[0] == "stop") {
            if (args[1] == "all") {
                thisGhostTag.targetID = [];
                return reply("✅ 𝑆𝑡𝑜𝑝𝑝𝑒𝑑 𝑎𝑙𝑙 𝑔ℎ𝑜𝑠𝑡 𝑡𝑎𝑔𝑔𝑖𝑛𝑔");
            } else {
                if (Object.keys(mentions).length == 0) {
                    return reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑠𝑡𝑜𝑝 𝑔ℎ𝑜𝑠𝑡 𝑡𝑎𝑔𝑔𝑖𝑛𝑔");
                }
                
                let msg = "";
                for (let id in mentions) {
                    const userName = mentions[id].replace("@", "");
                    if (!thisGhostTag.targetID.includes(id)) {
                        msg += `\n${userName} 𝑖𝑠 𝑛𝑜𝑡 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑏𝑒𝑖𝑛𝑔 𝑔ℎ𝑜𝑠𝑡 𝑡𝑎𝑔𝑔𝑒𝑑`;
                    } else {
                        thisGhostTag.targetID.splice(thisGhostTag.targetID.findIndex(item => item == id), 1);
                        msg += `\n✅ 𝑆𝑡𝑜𝑝𝑝𝑒𝑑 𝑔ℎ𝑜𝑠𝑡 𝑡𝑎𝑔𝑔𝑖𝑛𝑔 ${userName}`;
                    }
                }
                return reply(msg);
            }
        } else {
            if (Object.keys(mentions).length == 0) {
                return reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑔ℎ𝑜𝑠𝑡 𝑡𝑎𝑔");
            }
            
            let timesToTag = args[args.length - 2];
            let delayTime = args[args.length - 1];
            
            if (!timesToTag || !delayTime) {
                return reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑡𝑖𝑚𝑒𝑠 𝑎𝑛𝑑 𝑑𝑒𝑙𝑎𝑦");
            }
            
            if (isNaN(timesToTag)) {
                return reply("𝑁𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑡𝑖𝑚𝑒𝑠 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟");
            }
            
            if (isNaN(delayTime)) {
                return reply("𝐷𝑒𝑙𝑎𝑦 𝑡𝑖𝑚𝑒 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟");
            }
            
            delayTime = delayTime * 1000;
            const target = Object.keys(mentions)[0];
            
            if (thisGhostTag.targetID.includes(target)) {
                return reply("𝑇ℎ𝑖𝑠 𝑢𝑠𝑒𝑟 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑏𝑒𝑖𝑛𝑔 𝑔ℎ𝑜𝑠𝑡 𝑡𝑎𝑔𝑔𝑒𝑑");
            }
            
            thisGhostTag.targetID.push(target);
            
            const userName = mentions[target].replace("@", "");
            const messageContent = args.slice(0, args.length - 2).join(" ").replace("@", "");
            
            reply(`✅ 𝐴𝑑𝑑𝑒𝑑 ${userName} 𝑡𝑜 𝑔ℎ𝑜𝑠𝑡 𝑡𝑎𝑔𝑔𝑖𝑛𝑔:\n📊 𝑇𝑖𝑚𝑒𝑠: ${timesToTag}\n⏰ 𝐷𝑒𝑙𝑎𝑦: ${delayTime/1000} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠`);
            
            let count = 0;
            while (true) {
                await delay(delayTime);
                
                if (count == timesToTag) {
                    thisGhostTag.targetID.splice(thisGhostTag.targetID.findIndex(item => item == target), 1);
                    break;
                }
                
                if (!global.client.modulesGhostTag.find(item => item.threadID == threadID).targetID.includes(target)) {
                    break;
                }
                
                await api.sendMessage({
                    body: messageContent || `👻 ${userName}`,
                    mentions: [{ id: target, tag: userName }]
                }, threadID);
                
                count++;
            }
        }
    } catch (error) {
        console.error("𝐺ℎ𝑜𝑠𝑡 𝑇𝑎𝑔 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑔ℎ𝑜𝑠𝑡 𝑡𝑎𝑔", event.threadID, event.messageID);
    }
};
