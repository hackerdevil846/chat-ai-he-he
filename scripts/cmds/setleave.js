const path = require("path");

module.exports = {
    config: {
        name: "setleave",
        aliases: ["setl"],
        version: "1.7",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑐𝑢𝑠𝑡𝑜𝑚",
        shortDescription: {
            en: "𝐸𝑑𝑖𝑡 𝑐𝑜𝑛𝑡𝑒𝑛𝑡/𝑡𝑢𝑟𝑛 𝑜𝑛/𝑜𝑓𝑓 𝑙𝑒𝑎𝑣𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤ℎ𝑒𝑛 𝑚𝑒𝑚𝑏𝑒𝑟 𝑙𝑒𝑎𝑣𝑒 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 𝑐ℎ𝑎𝑡"
        },
        longDescription: {
            en: "𝐶𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒 𝑙𝑒𝑎𝑣𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑓𝑜𝑟 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤ℎ𝑜 𝑙𝑒𝑎𝑣𝑒 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝"
        },
        guide: {
            en: 
                "   {p} 𝑜𝑛: 𝑇𝑢𝑟𝑛 𝑜𝑛 𝑙𝑒𝑎𝑣𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒\n" +
                "   {p} 𝑜𝑓𝑓: 𝑇𝑢𝑟𝑛 𝑜𝑓𝑓 𝑙𝑒𝑎𝑣𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒\n" +
                "   {p} 𝑡𝑒𝑥𝑡 [<𝑐𝑜𝑛𝑡𝑒𝑛𝑡> | 𝑟𝑒𝑠𝑒𝑡]: 𝑒𝑑𝑖𝑡 𝑡𝑒𝑥𝑡 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑜𝑟 𝑟𝑒𝑠𝑒𝑡 𝑡𝑜 𝑑𝑒𝑓𝑎𝑢𝑙𝑡\n" +
                "   𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑠ℎ𝑜𝑟𝑡𝑐𝑢𝑡𝑠:\n" +
                "     + {𝑢𝑠𝑒𝑟𝑁𝑎𝑚𝑒}: 𝑛𝑎𝑚𝑒 𝑜𝑓 𝑚𝑒𝑚𝑏𝑒𝑟\n" +
                "     + {𝑢𝑠𝑒𝑟𝑁𝑎𝑚𝑒𝑇𝑎𝑔}: 𝑛𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑡𝑎𝑔\n" +
                "     + {𝑏𝑜𝑥𝑁𝑎𝑚𝑒}: 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒\n" +
                "     + {𝑡𝑦𝑝𝑒}: 𝑙𝑒𝑎𝑣𝑒/𝑘𝑖𝑐𝑘𝑒𝑑\n" +
                "     + {𝑠𝑒𝑠𝑠𝑖𝑜𝑛}: 𝑡𝑖𝑚𝑒 𝑠𝑒𝑠𝑠𝑖𝑜𝑛\n\n" +
                "   𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p} 𝑡𝑒𝑥𝑡 {𝑢𝑠𝑒𝑟𝑁𝑎𝑚𝑒} ℎ𝑎𝑠 {𝑡𝑦𝑝𝑒} 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝\n\n" +
                "   𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑓𝑖𝑙𝑒 𝑎𝑛𝑑 𝑠𝑒𝑛𝑑 '{p} 𝑓𝑖𝑙𝑒' 𝑡𝑜 𝑎𝑑𝑑 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡\n" +
                "   {p} 𝑓𝑖𝑙𝑒 𝑟𝑒𝑠𝑒𝑡: 𝑟𝑒𝑚𝑜𝑣𝑒 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡"
        },
        countDown: 5,
        dependencies: {}
    },

    onStart: async function({ message, event, args, threadsData }) {
        try {
            const { threadID, senderID, body } = event;
            const threadData = await threadsData.get(threadID);
            const { data, settings } = threadData;

            switch (args[0]) {
                case "text": {
                    if (!args[1]) {
                        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑐𝑜𝑛𝑡𝑒𝑛𝑡");
                    } else if (args[1] == "reset") {
                        delete data.leaveMessage;
                    } else {
                        data.leaveMessage = body.slice(body.indexOf(args[0]) + args[0].length).trim();
                    }

                    await threadsData.set(threadID, threadData);
                    return message.reply(
                        data.leaveMessage ? 
                        `✅ 𝐸𝑑𝑖𝑡𝑒𝑑 𝑙𝑒𝑎𝑣𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:\n${data.leaveMessage}` : 
                        "✅ 𝑅𝑒𝑠𝑒𝑡 𝑙𝑒𝑎𝑣𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡"
                    );
                }
                case "file": {
                    if (args[1] == "reset") {
                        if (!data.leaveAttachment) {
                            return message.reply("❌ 𝑁𝑜 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡 𝑓𝑖𝑙𝑒 𝑡𝑜 𝑟𝑒𝑠𝑒𝑡");
                        }
                        delete data.leaveAttachment;
                        await threadsData.set(threadID, threadData);
                        return message.reply("✅ 𝑅𝑒𝑠𝑒𝑡 𝑙𝑒𝑎𝑣𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡 𝑓𝑖𝑙𝑒");
                    } else if (event.attachments.length === 0 && (!event.messageReply || event.messageReply.attachments.length === 0)) {
                        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑖𝑚𝑎𝑔𝑒/𝑣𝑖𝑑𝑒𝑜/𝑎𝑢𝑑𝑖𝑜 𝑓𝑖𝑙𝑒");
                    } else {
                        await this.saveChanges({ message, event, threadsData, threadID });
                    }
                    break;
                }
                case "on":
                case "off": {
                    settings.sendLeaveMessage = args[0] == "on";
                    await threadsData.set(threadID, threadData);
                    return message.reply(args[0] == "on" ? 
                        "✅ 𝑇𝑢𝑟𝑛𝑒𝑑 𝑜𝑛 𝑙𝑒𝑎𝑣𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒" : 
                        "✅ 𝑇𝑢𝑟𝑛𝑒𝑑 𝑜𝑓𝑓 𝑙𝑒𝑎𝑣𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"
                    );
                }
                default: {
                    const guide = this.config.guide.en.replace(/{p}/g, this.config.name);
                    return message.reply(`📝 𝑈𝑠𝑎𝑔𝑒 𝐺𝑢𝑖𝑑𝑒:\n${guide}`);
                }
            }
        } catch (error) {
            console.error("𝑆𝑒𝑡𝑙𝑒𝑎𝑣𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    },

    saveChanges: async function({ message, event, threadsData, threadID }) {
        try {
            const threadData = await threadsData.get(threadID);
            const attachments = [...event.attachments, ...(event.messageReply?.attachments || [])].filter(item =>
                ["photo", "png", "animated_image", "video", "audio"].includes(item.type)
            );

            if (!threadData.data.leaveAttachment) {
                threadData.data.leaveAttachment = [];
            }

            // For simplicity, store attachment URLs directly
            threadData.data.leaveAttachment = attachments.map(att => att.url);
            
            await threadsData.set(threadID, threadData);
            return message.reply(`✅ 𝐴𝑑𝑑𝑒𝑑 ${attachments.length} 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡(𝑠) 𝑡𝑜 𝑙𝑒𝑎𝑣𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒`);
        } catch (error) {
            console.error("𝑆𝑎𝑣𝑒 𝑐ℎ𝑎𝑛𝑔𝑒𝑠 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡𝑠");
        }
    }
};
