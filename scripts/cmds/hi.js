const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "hi",
        aliases: ["salam", "islamicgreet"],
        version: "12.0.4",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "islamic",
        shortDescription: {
            en: "Ultra-Stylish Islamic Greetings with Stickers"
        },
        longDescription: {
            en: "Automatic Islamic greetings with ultra-stylish fonts, stickers, and smart detection"
        },
        guide: {
            en: "{p}hi [on/off/status]"
        }
    },

    onChat: async function({ event, message, usersData, threadsData, api }) {
        try {
            const { threadID, senderID, body } = event;
            
            // Skip if message is from bot
            if (senderID === global.GoatBot?.botID) return;

            // Get thread data
            let threadData;
            try {
                threadData = await threadsData.get(threadID);
            } catch (error) {
                return;
            }
            
            // Check if module is enabled (default: disabled - manual activation required)
            if (!threadData?.data?.salam) return;

            // Comprehensive Islamic greeting triggers
            const triggers = [
                "salam", "assalamualaikum", "assalamu alaikum", "as salam", 
                "سلام", "السلام عليكم", "allah hu akbar", "الله أكبر", 
                "subhanallah", "سبحان الله", "alhamdulillah", "الحمد لله", 
                "mashallah", "ما شاء الله", "astagfirullah", "أستغفر الله", 
                "inshallah", "إن شاء الله", "bismillah", "بسم الله", 
                "ramadan", "رمضان", "eid mubarak", "عيد مبارك", 
                "jazakallah", "جزاك الله", "fi amanillah", "في أمان الله", 
                "barakallahu", "بارك الله", "ya allah", "يا الله", 
                "la ilaha illallah", "لا إله إلا الله", "muhammad", "محمد",
                "hello", "hi", "hey", "hola", "namaste"
            ];

            const userMsg = body?.toLowerCase() || "";
            const hasTrigger = triggers.some(trigger => userMsg.includes(trigger));
            
            if (!hasTrigger) return;

            // Get user data
            let userData;
            try {
                userData = await usersData.get(senderID);
            } catch (error) {
                return;
            }

            const name = userData?.name || "Friend";
            
            // Get current time and prayer session
            let hours, session, sessionEmoji;
            try {
                hours = parseInt(moment.tz('Asia/Dhaka').format('HH'));
                if (hours >= 0 && hours < 4) {
                    session = "𝐓𝐀𝐇𝐀𝐉𝐉𝐔𝐃 𝐓𝐈𝐌𝐄"; sessionEmoji = "🌙";
                } else if (hours >= 4 && hours < 6) {
                    session = "𝐅𝐀𝐉𝐑 𝐏𝐑𝐀𝐘𝐄𝐑"; sessionEmoji = "🌄";
                } else if (hours >= 6 && hours < 12) {
                    session = "𝐃𝐔𝐇𝐀 𝐓𝐈𝐌𝐄"; sessionEmoji = "☀️";
                } else if (hours >= 12 && hours < 14) {
                    session = "𝐃𝐇𝐔𝐇𝐑 𝐏𝐑𝐀𝐘𝐄𝐑"; sessionEmoji = "🕛";
                } else if (hours >= 14 && hours < 16) {
                    session = "𝐀𝐒𝐑 𝐏𝐑𝐀𝐘𝐄𝐑"; sessionEmoji = "🕒";
                } else if (hours >= 16 && hours < 19) {
                    session = "𝐌𝐀𝐆𝐇𝐑𝐈𝐁 𝐏𝐑𝐀𝐘𝐄𝐑"; sessionEmoji = "🌅";
                } else {
                    session = "𝐈𝐒𝐇𝐀 𝐏𝐑𝐀𝐘𝐄𝐑"; sessionEmoji = "🌃";
                }
            } catch (timeError) {
                session = "𝐁𝐋𝐄𝐒𝐒𝐄𝐃 𝐓𝐈𝐌𝐄"; sessionEmoji = "📿";
            }

            // Islamic sticker IDs
            const stickerIDs = [
                "789381034156662", "789381067489992", "789381100823322", 
                "789381134156652", "789381167489982", "789381200823315", 
                "789381234156645", "789381267489975", "789381300823305", 
                "789381334156635", "789381367489965", "789381400823295", 
                "789381434156625", "789381467489955", "789381500823285", 
                "789381534156615", "789381567489945", "789381600823275", 
                "789381634156605", "789381667489935"
            ];

            // Ultra-stylish font messages
            const messages = [
                `✦𝗜𝗦𝗟𝗔𝗠𝗜𝗖 𝗚𝗥𝗘𝗘𝗧𝗜𝗡𝗚𝗦✦
▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃

🕌 𝗔𝗦𝗦𝗔𝗟𝗔𝗠𝗨𝗔𝗟𝗔𝗜𝗞𝗨𝗠 𝗪𝗔𝗥𝗔𝗛𝗠𝗔𝗧𝗨𝗟𝗟𝗔𝗛𝗜 𝗪𝗔𝗕𝗔𝗥𝗔𝗞𝗔𝗧𝗨𝗛

╭───────────────╮
│ 𝗡𝗔𝗠𝗘: ${name}
│ 𝗧𝗜𝗠𝗘: ${session} ${sessionEmoji}
╰───────────────╯

✨ 𝗠𝗮𝘆 𝗔𝗹𝗹𝗮𝗵'𝘀 𝗽𝗲𝗮𝗰𝗲 & 𝗯𝗹𝗲𝘀𝘀𝗶𝗻𝗴𝘀 𝗯𝗲 𝘂𝗽𝗼𝗻 𝘆𝗼𝘂
▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃`,

                `☪️𝗔𝗟𝗟𝗔𝗛 𝗛𝗨 𝗔𝗞𝗕𝗔𝗥☪️
✧･ﾟ: *✧･ﾟ:* ✧･ﾟ: *✧･ﾟ:*

╔═══════════════╗
   𝗚𝗥𝗘𝗘𝗧𝗜𝗡𝗚 𝗙𝗢𝗥:
   👤 ${name}
   ⏰ ${session} ${sessionEmoji}
╚═══════════════╝

🌟 𝗠𝗮𝘆 𝗔𝗹𝗹𝗮𝗵'𝘀 𝗴𝗿𝗲𝗮𝘁𝗻𝗲𝘀𝘀 𝗳𝗶𝗹𝗹 𝘆𝗼𝘂𝗿 𝗵𝗲𝗮𝗿𝘁
✧･ﾟ: *✧･ﾟ:* ✧･ﾟ: *✧･ﾟ:*`,

                `📿𝗦𝗨𝗕𝗛𝗔𝗡𝗔𝗟𝗟𝗔𝗛📿
༶•┈┈┈┈┈┈┈┈┈┈┈•༶

┌────────────────┐
│ 𝗗𝗘𝗔𝗥: ${name}    │
│ 𝗦𝗘𝗦𝗦𝗜𝗢𝗡: ${session} ${sessionEmoji} │
└────────────────┘

🌙 𝗚𝗹𝗼𝗿𝘆 𝘁𝗼 𝗔𝗹𝗹𝗮𝗵 𝗶𝗻 𝘁𝗵𝗶𝘀 𝗯𝗹𝗲𝘀𝘀𝗲𝗱 𝗺𝗼𝗺𝗲𝗻𝘁
༶•┈┈┈┈┈┈┈┈┈┈┈•༶`,

                `🌙𝗔𝗟𝗛𝗔𝗠𝗗𝗨𝗟𝗜𝗟𝗟𝗔𝗛🌙
✦ ─────────── ✦

◈ 𝗨𝗦𝗘𝗥: ${name}
◈ 𝗣𝗥𝗔𝗬𝗘𝗥: ${session} ${sessionEmoji}

🕯️ 𝗔𝗹𝗹 𝗽𝗿𝗮𝗶𝘀𝗲 𝘁𝗼 𝗔𝗹𝗹𝗮𝗵 𝗳𝗼𝗿 𝘁𝗵𝗶𝘀 𝗯𝗲𝗮𝘂𝘁𝗶𝗳𝘂𝗹 𝘁𝗶𝗺𝗲
✦ ─────────── ✦`,

                `🕋𝗠𝗔𝗦𝗛𝗔𝗟𝗟𝗔𝗛🕋
╰┈➤ ❝ 𝕴𝖘𝖑𝖆𝖒𝖎𝖈 𝕲𝖗𝖊𝖊𝖙𝖎𝖓𝖌 ❞

• 𝗡𝗮𝗺𝗲: ${name}
• 𝗧𝗶𝗺𝗲: ${session} ${sessionEmoji}

💫 𝗔𝗹𝗹𝗮𝗵 𝗵𝗮𝘀 𝘄𝗶𝗹𝗹𝗲𝗱 𝘁𝗵𝗶𝘀 𝗯𝗲𝗮𝘂𝘁𝗶𝗳𝘂𝗹 𝗺𝗼𝗺𝗲𝗻𝘁
╰┈➤ ❝ 𝕭𝖑𝖊𝖘𝖘𝖊𝖉 𝕽𝖊𝖘𝖕𝖔𝖓𝖘𝖊 ❞`,

                `🌹𝗕𝗜𝗦𝗠𝗜𝗟𝗟𝗔𝗛🌹
★・・・・・★・・・・・★

    𝗚𝗿𝗲𝗲𝘁𝗶𝗻𝗴 𝗳𝗼𝗿:
    ✨ ${name}
    📿 ${session} ${sessionEmoji}

✨ 𝗕𝗲𝗴𝗶𝗻 𝗶𝗻 𝘁𝗵𝗲 𝗻𝗮𝗺𝗲 𝗼𝗳 𝗔𝗹𝗹𝗮𝗵, 𝘁𝗵𝗲 𝗠𝗼𝘀𝘁 𝗚𝗿𝗮𝗰𝗶𝗼𝘂𝘀
★・・・・・★・・・・・★`,

                `🙏𝗝𝗔𝗭𝗔𝗞𝗔𝗟𝗟𝗔𝗛 𝗞𝗛𝗔𝗜𝗥🙏
»»————-　★　————-««

  ╭────────────────╮
  │ 𝗥𝗘𝗖𝗜𝗣𝗜𝗘𝗡𝗧: ${name} │
  │ 𝗧𝗜𝗠𝗘: ${session} ${sessionEmoji}    │
  ╰────────────────╯

⭐ 𝗠𝗮𝘆 𝗔𝗹𝗹𝗮𝗵 𝗿𝗲𝘄𝗮𝗿𝗱 𝘆𝗼𝘂 𝘄𝗶𝘁𝗵 𝗴𝗼𝗼𝗱𝗻𝗲𝘀𝘀
»»————-　★　————-««`,

                `🕌𝗙𝗜 𝗔𝗠𝗔𝗡𝗜𝗟𝗟𝗔𝗛🕌
✼　 ҉    ✼    ҉ 　✼

   ┌────────────┐
   │ 𝗙𝗢𝗥: ${name} │
   │ 𝗔𝗧: ${session} ${sessionEmoji}  │
   └────────────┘

🕌 𝗠𝗮𝘆 𝗔𝗹𝗹𝗮𝗵 𝗽𝗿𝗼𝘁𝗲𝗰𝘁 𝘆𝗼𝘂 𝗶𝗻 𝗛𝗶𝘀 𝗰𝗮𝗿𝗲
✼　 ҉    ✼    ҉ 　✼`,

                `🌙𝗟𝗔 𝗜𝗟𝗔𝗛𝗔 𝗜𝗟𝗟𝗔𝗟𝗟𝗔𝗛🌙
♡₊˚ 🦢・₊✧

    𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗙𝗢𝗥:
    💫 ${name}
    📿 ${session} ${sessionEmoji}

💫 𝗧𝗵𝗲𝗿𝗲 𝗶𝘀 𝗻𝗼 𝗴𝗼𝗱 𝗯𝘂𝘁 𝗔𝗹𝗹𝗮𝗵
♡₊˚ 🦢・₊✧`,

                `☪️𝗥𝗔𝗠𝗔𝗗𝗔𝗡 𝗠𝗨𝗕𝗔𝗥𝗔𝗞☪️
๑۞๑,¸¸,ø¤º°`°º¤ø,¸¸,๑۞๑

   ╔════════════╗
   ║ 𝗧𝗢: ${name}   ║
   ║ 𝗪𝗜𝗧𝗛: ${session} ${sessionEmoji} ║
   ╚════════════╝

🕋 𝗕𝗹𝗲𝘀𝘀𝗲𝗱 𝗥𝗮𝗺𝗮𝗱𝗮𝗻 𝘁𝗼 𝘆𝗼𝘂 𝗮𝗻𝗱 𝘆𝗼𝘂𝗿 𝗳𝗮𝗺𝗶𝗹𝘆
๑۞๑,¸¸,ø¤º°`°º¤ø,¸¸,๑۞๑`
            ];

            // Random selection
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            const randomSticker = stickerIDs[Math.floor(Math.random() * stickerIDs.length)];

            // Send response with slight delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Send text message
            const response = {
                body: randomMessage,
                mentions: [{ tag: name, id: senderID }]
            };

            await message.reply(response);

            // Send sticker after short delay
            await new Promise(resolve => setTimeout(resolve, 500));
            await message.reply({
                sticker: randomSticker
            });

        } catch (error) {
            console.error("Ultra-Stylish Islamic Greeting Error:", error);
        }
    },

    onStart: async function({ message, event, threadsData, args }) {
        try {
            const { threadID } = event;
            
            // Get current thread data
            let threadData;
            try {
                threadData = await threadsData.get(threadID);
            } catch (error) {
                return await message.reply("❌ Failed to access thread settings.");
            }

            // Initialize data if not exists
            if (!threadData.data) {
                threadData.data = {};
            }

            const action = args[0]?.toLowerCase();

            // Handle different commands
            if (action === 'off') {
                threadData.data.salam = false;
                await threadsData.set(threadID, threadData);
                return await message.reply(`╔══════════════════════════╗
🔕 𝗜𝗦𝗟𝗔𝗠𝗜𝗖 𝗚𝗥𝗘𝗘𝗧𝗜𝗡𝗚𝗦 𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗

✦ Auto-responses are now OFF
✦ Use "hi on" to enable again
╚══════════════════════════╝`);
            } 
            else if (action === 'on') {
                threadData.data.salam = true;
                await threadsData.set(threadID, threadData);
                return await message.reply(`╔══════════════════════════╗
🔔 𝗜𝗦𝗟𝗔𝗠𝗜𝗖 𝗚𝗥𝗘𝗘𝗧𝗜𝗡𝗚𝗦 𝗘𝗡𝗔𝗕𝗟𝗘𝗗

✦ Auto-responses are now ACTIVE
✦ Use "hi off" to disable
╚══════════════════════════╝`);
            }
            else if (action === 'status') {
                const isEnabled = threadData.data.salam === true;
                const statusMessage = isEnabled ?
                    `╔══════════════════════════╗
✅ 𝗦𝗧𝗔𝗧𝗨𝗦: 𝗘𝗡𝗔𝗕𝗟𝗘𝗗

✦ Islamic greetings: ACTIVE
✦ Sticker responses: ACTIVE
✦ Smart detection: ACTIVE
╚══════════════════════════╝` :
                    `╔══════════════════════════╗
❌ 𝗦𝗧𝗔𝗧𝗨𝗦: 𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗

✦ Islamic greetings: INACTIVE
✦ Sticker responses: INACTIVE
✦ Smart detection: INACTIVE
╚══════════════════════════╝`;
                return await message.reply(statusMessage);
            }

            // Show main help menu
            const isEnabled = threadData.data.salam === true;
            const status = isEnabled ? "🟢 𝗘𝗡𝗔𝗕𝗟𝗘𝗗" : "🔴 𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗";

            const helpMessage = `╔══════════════════════════════╗
          🕌 𝗜𝗦𝗟𝗔𝗠𝗜𝗖 𝗚𝗥𝗘𝗘𝗧𝗜𝗡𝗚 𝗦𝗬𝗦𝗧𝗘𝗠 🕌

📊 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗦𝗧𝗔𝗧𝗨𝗦: ${status}

╭────────────────────────────╮
│ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦:                 │
│ • 𝗵𝗶 𝗼𝗻    ➤ Enable       │
│ • 𝗵𝗶 𝗼𝗳𝗳   ➤ Disable      │
│ • 𝗵𝗶 𝘀𝘁𝗮𝘁𝘂𝘀 ➤ Check status │
╰────────────────────────────╯

🤲 𝗧𝗥𝗜𝗚𝗚𝗘𝗥 𝗣𝗛𝗥𝗔𝗦𝗘𝗦:
• Salam / Assalamualaikum
• Allah Hu Akbar
• Subhanallah / Alhamdulillah
• Ramadan / Eid Mubarak
• And many more...

🎨 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦:
✦ Ultra-stylish fonts
✦ Islamic stickers
✦ Prayer time detection
✦ Personalized responses
╚══════════════════════════════╝`;

            await message.reply(helpMessage);

        } catch (error) {
            console.error("Hi Command Error:", error);
            await message.reply("❌ Error accessing settings. Please try again.");
        }
    }
};
