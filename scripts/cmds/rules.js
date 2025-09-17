const { getPrefix } = global.utils;

module.exports = {
    config: {
        name: "rules",
        aliases: ["ru", "নিয়ম"],
        version: "1.6",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑔𝑟𝑜𝑢𝑝",
        shortDescription: {
            en: "𝐺𝑟𝑜𝑢𝑝 𝑟𝑢𝑙𝑒𝑠 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡 𝑠𝑦𝑠𝑡𝑒𝑚"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒/𝑣𝑖𝑒𝑤/𝑎𝑑𝑑/𝑒𝑑𝑖𝑡/𝑐ℎ𝑎𝑛𝑔𝑒 𝑝𝑜𝑠𝑖𝑡𝑖𝑜𝑛/𝑑𝑒𝑙𝑒𝑡𝑒 𝑔𝑟𝑜𝑢𝑝 𝑟𝑢𝑙𝑒𝑠"
        },
        guide: {
            en: "{p}rules [𝑎𝑑𝑑|𝑒𝑑𝑖𝑡|𝑚𝑜𝑣𝑒|𝑑𝑒𝑙𝑒𝑡𝑒|𝑟𝑒𝑚𝑜𝑣𝑒|<𝑛𝑢𝑚𝑏𝑒𝑟>]"
        },
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    languages: {
        en: {
            yourRules: "📜 𝑌𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 𝑟𝑢𝑙𝑒𝑠:\n%1",
            noRules: "❗ 𝑌𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 ℎ𝑎𝑠 𝑛𝑜 𝑟𝑢𝑙𝑒𝑠. 𝑇𝑜 𝑎𝑑𝑑 𝑜𝑛𝑒 𝑢𝑠𝑒: `%1rules 𝑎𝑑𝑑 <𝑟𝑢𝑙𝑒>`",
            noPermissionAdd: "🔒 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑎𝑑𝑑 𝑟𝑢𝑙𝑒𝑠 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝",
            noContent: "✏️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑟𝑢𝑙𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑎𝑑𝑑",
            success: "✅ 𝐴𝑑𝑑𝑒𝑑 𝑛𝑒𝑤 𝑟𝑢𝑙𝑒 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦",
            noPermissionEdit: "🔒 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑒𝑑𝑖𝑡 𝑔𝑟𝑜𝑢𝑝 𝑟𝑢𝑙𝑒𝑠",
            invalidNumber: "🔢 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑟𝑢𝑙𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑒𝑑𝑖𝑡",
            rulesNotExist: "⚠️ 𝑅𝑢𝑙𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 %1 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡",
            numberRules: "ℹ️ 𝑌𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 ℎ𝑎𝑠 %1 𝑟𝑢𝑙𝑒𝑠",
            noContentEdit: "✏️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑠𝑒𝑡 𝑓𝑜𝑟 𝑟𝑢𝑙𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 %1",
            successEdit: "✅ 𝐸𝑑𝑖𝑡𝑒𝑑 𝑟𝑢𝑙𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 %1 𝑡𝑜: %2",
            noPermissionMove: "🔒 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑚𝑜𝑣𝑒 𝑔𝑟𝑜𝑢𝑝 𝑟𝑢𝑙𝑒𝑠",
            invalidNumberMove: "🔢 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑤𝑜 𝑣𝑎𝑙𝑖𝑑 𝑟𝑢𝑙𝑒 𝑛𝑢𝑚𝑏𝑒𝑟𝑠 𝑡𝑜 𝑠𝑤𝑎𝑝",
            sameNumberMove: "❗ 𝐶𝑎𝑛𝑛𝑜𝑡 𝑠𝑤𝑎𝑝 𝑝𝑜𝑠𝑖𝑡𝑖𝑜𝑛𝑠 𝑜𝑓 𝑡ℎ𝑒 𝑠𝑎𝑚𝑒 𝑟𝑢𝑙𝑒",
            rulesNotExistMove: "⚠️ 𝑅𝑢𝑙𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 %1 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡",
            rulesNotExistMove2: "⚠️ 𝑅𝑢𝑙𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 %1 𝑎𝑛𝑑 %2 𝑑𝑜 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡",
            successMove: "✅ 𝑆𝑤𝑎𝑝𝑝𝑒𝑑 𝑝𝑜𝑠𝑖𝑡𝑖𝑜𝑛 𝑜𝑓 𝑟𝑢𝑙𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 %1 𝑎𝑛𝑑 %2 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦",
            noPermissionDelete: "🔒 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑑𝑒𝑙𝑒𝑡𝑒 𝑔𝑟𝑜𝑢𝑝 𝑟𝑢𝑙𝑒𝑠",
            invalidNumberDelete: "🔢 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑡ℎ𝑒 𝑟𝑢𝑙𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒",
            rulesNotExistDelete: "⚠️ 𝑅𝑢𝑙𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 %1 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡",
            successDelete: "🗑️ 𝐷𝑒𝑙𝑒𝑡𝑒𝑑 𝑟𝑢𝑙𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 %1, 𝑐𝑜𝑛𝑡𝑒𝑛𝑡: %2",
            noPermissionRemove: "🔒 𝑂𝑛𝑙𝑦 𝑔𝑟𝑜𝑢𝑝 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑟𝑒𝑚𝑜𝑣𝑒 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑟𝑢𝑙𝑒𝑠",
            confirmRemove: "⚠️ 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑎𝑛𝑦 𝑒𝑚𝑜𝑗𝑖 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚 **𝑟𝑒𝑚𝑜𝑣𝑒 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑟𝑢𝑙𝑒𝑠**",
            successRemove: "✅ 𝑅𝑒𝑚𝑜𝑣𝑒𝑑 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑟𝑢𝑙𝑒𝑠 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦",
            invalidNumberView: "🔢 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑡ℎ𝑒 𝑟𝑢𝑙𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑣𝑖𝑒𝑤"
        }
    },

    onStart: async function({ message, event, args, usersData, threadsData }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ");
            }

            const threadID = event.threadID;
            const senderID = event.senderID;
            const type = args[0];
            const rulesOfThread = await threadsData.get(threadID, "data.rules", []);
            const totalRules = rulesOfThread.length;

            // Check admin permissions
            const threadData = await threadsData.get(threadID);
            const isAdmin = threadData.adminIDs && threadData.adminIDs.includes(senderID);
            const userData = await usersData.get(senderID);
            const isBotAdmin = userData.role > 0;

            // Helper function to get language string
            const getLang = (key, ...values) => {
                let text = this.languages.en[key] || key;
                values.forEach((val, i) => {
                    text = text.replace(`%${i + 1}`, val);
                });
                return text;
            };

            // VIEW all rules (no args)
            if (!type) {
                let i = 1;
                const msg = rulesOfThread.reduce((text, rule) => text + `${i++}. ${rule}\n`, "");
                const content = msg ? getLang("yourRules", msg) : getLang("noRules", getPrefix(threadID));
                await message.reply(content);
                return;
            }

            // ADD
            if (["add", "-a"].includes(type)) {
                if (!isAdmin && !isBotAdmin) return message.reply(getLang("noPermissionAdd"));
                if (!args[1]) return message.reply(getLang("noContent"));
                
                rulesOfThread.push(args.slice(1).join(" "));
                await threadsData.set(threadID, rulesOfThread, "data.rules");
                return message.reply(getLang("success"));
            }

            // EDIT
            if (["edit", "-e"].includes(type)) {
                if (!isAdmin && !isBotAdmin) return message.reply(getLang("noPermissionEdit"));
                const stt = parseInt(args[1]);
                if (isNaN(stt)) return message.reply(getLang("invalidNumber"));
                if (!rulesOfThread[stt - 1]) return message.reply(`${getLang("rulesNotExist", stt)}, ${totalRules === 0 ? getLang("noRules", getPrefix(threadID)) : getLang("numberRules", totalRules)}`);
                if (!args[2]) return message.reply(getLang("noContentEdit", stt));
                
                const newContent = args.slice(2).join(" ");
                rulesOfThread[stt - 1] = newContent;
                await threadsData.set(threadID, rulesOfThread, "data.rules");
                return message.reply(getLang("successEdit", stt, newContent));
            }

            // MOVE / SWAP
            if (["move", "-m"].includes(type)) {
                if (!isAdmin && !isBotAdmin) return message.reply(getLang("noPermissionMove"));
                const num1 = parseInt(args[1]);
                const num2 = parseInt(args[2]);
                if (isNaN(num1) || isNaN(num2)) return message.reply(getLang("invalidNumberMove"));
                if (num1 === num2) return message.reply(getLang("sameNumberMove"));

                const exist1 = !!rulesOfThread[num1 - 1];
                const exist2 = !!rulesOfThread[num2 - 1];

                if (!exist1 && !exist2) return message.reply(`${getLang("rulesNotExistMove2", num1, num2)}, ${totalRules === 0 ? getLang("noRules", getPrefix(threadID)) : getLang("numberRules", totalRules)}`);
                if (!exist1) return message.reply(`${getLang("rulesNotExistMove", num1)}, ${totalRules === 0 ? getLang("noRules", getPrefix(threadID)) : getLang("numberRules", totalRules)}`);
                if (!exist2) return message.reply(`${getLang("rulesNotExistMove", num2)}, ${totalRules === 0 ? getLang("noRules", getPrefix(threadID)) : getLang("numberRules", totalRules)}`);

                // swap
                [rulesOfThread[num1 - 1], rulesOfThread[num2 - 1]] = [rulesOfThread[num2 - 1], rulesOfThread[num1 - 1]];
                await threadsData.set(threadID, rulesOfThread, "data.rules");
                return message.reply(getLang("successMove", num1, num2));
            }

            // DELETE single
            if (["delete", "del", "-d"].includes(type)) {
                if (!isAdmin && !isBotAdmin) return message.reply(getLang("noPermissionDelete"));
                if (!args[1] || isNaN(args[1])) return message.reply(getLang("invalidNumberDelete"));
                
                const index = parseInt(args[1]) - 1;
                const rulesDel = rulesOfThread[index];
                if (!rulesDel) return message.reply(`${getLang("rulesNotExistDelete", args[1])}, ${totalRules === 0 ? getLang("noRules", getPrefix(threadID)) : getLang("numberRules", totalRules)}`);
                
                rulesOfThread.splice(index, 1);
                await threadsData.set(threadID, rulesOfThread, "data.rules");
                return message.reply(getLang("successDelete", args[1], rulesDel));
            }

            // REMOVE all
            if (["remove", "reset", "-r", "-rm"].includes(type)) {
                if (!isAdmin && !isBotAdmin) return message.reply(getLang("noPermissionRemove"));
                
                rulesOfThread.length = 0;
                await threadsData.set(threadID, rulesOfThread, "data.rules");
                return message.reply(getLang("successRemove"));
            }

            // VIEW specific numbers
            if (!isNaN(type)) {
                let msg = "";
                for (const stt of args) {
                    const idx = parseInt(stt) - 1;
                    const rule = rulesOfThread[idx];
                    if (rule) msg += `${parseInt(stt)}. ${rule}\n`;
                }
                if (msg === "") return message.reply(`${getLang("rulesNotExist", type)}, ${totalRules === 0 ? getLang("noRules", getPrefix(threadID)) : getLang("numberRules", totalRules)}`);
                return message.reply(msg);
            }

            // Unknown syntax
            return message.reply(getLang("invalidNumber"));

        } catch (error) {
            console.error("𝑅𝑢𝑙𝑒𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
