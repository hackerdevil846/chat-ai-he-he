module.exports.config = {
    name: "translate",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Text translation (Google Translate)",
    category: "𝑴𝒆𝒅𝒊𝒂",
    usages: "[text] -> [lang]\nOr reply to a message and send: -> [lang]",
    cooldowns: 5,
    dependencies: {
        "request": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const request = global.nodemodule["request"];
    const content = args.join(" ").trim();

    // If no input and not a reply -> show usage
    if (!content && event.type !== "message_reply") {
        return api.sendMessage(
            "❌ Usage:\n• Send: `text -> lang` (example: hello -> bn)\n• Or reply to a message and send: `-> bn` to translate the replied text.",
            event.threadID,
            event.messageID
        );
    }

    // parse input for "->" (support both "->" and " -> ")
    const arrowPattern = /\s*->\s*/;
    let translateThis = "";
    let lang = "";

    if (event.type === "message_reply") {
        // If replying: translate the replied message body
        translateThis = event.messageReply && event.messageReply.body ? String(event.messageReply.body).trim() : "";
        if (content && content.length) {
            // user may have provided "-> lang" after reply
            const parts = content.split(arrowPattern);
            if (parts.length > 1) lang = parts[parts.length - 1].trim();
        }
    } else {
        // Not a reply: try split by arrow to get text and lang
        if (arrowPattern.test(content)) {
            const parts = content.split(arrowPattern);
            translateThis = parts.slice(0, parts.length - 1).join(" -> ").trim(); // in case text contains '->'
            lang = parts[parts.length - 1].trim();
            // if user only sent "-> lang" accidentally
            if (!translateThis) {
                return api.sendMessage("❌ কোনো টেক্সট দেওয়া নেই। অনুগ্রহ করে অনুবাদ করার জন্য কিছু টেক্সট লিখুন।", event.threadID, event.messageID);
            }
        } else {
            translateThis = content;
        }
    }

    // fallback: if still no text (shouldn't happen) -> notify
    if (!translateThis || !translateThis.length) {
        return api.sendMessage("❌ অনুবাদের জন্য কোনো টেক্সট পাওয়া যায়নি।", event.threadID, event.messageID);
    }

    // default language if not provided
    if (!lang || !lang.length) {
        lang = (global.config && global.config.language) ? global.config.language : "en";
    }

    // build the Google Translate request (unchanged link logic)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(lang)}&dt=t&q=${encodeURIComponent(translateThis)}`;

    return request(encodeURI(url), (err, response, body) => {
        if (err || !body) {
            return api.sendMessage("❌ সার্ভারে সমস্যা হয়েছে বা রেসপন্স পাওয়া যায়নি। আবার চেষ্টা করুন।", event.threadID, event.messageID);
        }

        try {
            const retrieve = JSON.parse(body);
            // build translated text from returned array
            let text = "";
            if (Array.isArray(retrieve[0])) {
                retrieve[0].forEach(item => {
                    if (item && item[0]) text += item[0];
                });
            }

            // determine detected source language robustly
            let fromLang = "auto";
            if (typeof retrieve[2] === "string" && retrieve[2].length) {
                fromLang = retrieve[2];
            } else if (retrieve[8] && Array.isArray(retrieve[8]) && retrieve[8][0] && retrieve[8][0][0]) {
                fromLang = retrieve[8][0][0];
            }

            // Prepare a pretty message with emojis
            const msg =
`🔤 𝑻𝒓𝒂𝒏𝒔𝒍𝒂𝒕𝒊𝒐𝒏 𝑹𝒆𝒔𝒖𝒍𝒕 🌍

📥 𝐎𝐫𝐢𝐠𝐢𝐧𝐚𝐥: 
${translateThis}

📝 𝐓𝐫𝐚𝐧𝐬𝐥𝐚𝐭𝐞𝐝:
${text || "— (কোনো অনুবাদ পাওয়া যায়নি)"}

🔎 𝐅𝐫𝐨𝐦: ${fromLang}
🔁 𝐓𝐨: ${lang}

━━━━━━━━━━━━━━
✨ Powered by Google Translate
🧾 Credits: ${module.exports.config.credits}`;

            return api.sendMessage(msg, event.threadID, event.messageID);
        } catch (e) {
            // parsing error
            return api.sendMessage("❌ অনুবাদ প্রস্তুত করতে সমস্যা। আবার চেষ্টা করুন বা অন্য টেক্সট ব্যবহার করে দেখুন।", event.threadID, event.messageID);
        }
    });
};
