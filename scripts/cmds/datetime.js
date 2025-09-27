const moment = require('moment-timezone');

module.exports = {
    config: {
        name: "datetime",
        aliases: ["bdtime", "timebd", "bangladeshtime"],
        version: "2.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "Show Bangladesh date and time with info"
        },
        longDescription: {
            en: "Displays beautiful Bangladesh date and time with additional information"
        },
        guide: {
            en: "{p}datetime"
        },
        dependencies: {
            "moment-timezone": ""
        }
    },

    onStart: async function ({ message }) {
        try {
            // Dependency check
            try {
                require("moment-timezone");
            } catch (e) {
                return message.reply("❌ Missing dependency: moment-timezone");
            }

            const bdTime = moment.tz("Asia/Dhaka");
            const date = bdTime.format("DD MMMM YYYY");
            const day = bdTime.format("dddd");
            const time = bdTime.format("hh:mm:ss A");
            const week = bdTime.week();
            const dayOfYear = bdTime.dayOfYear();
            const daysLeft = 365 - dayOfYear;
            
            const response = `✨ BANGLADESH TIME INFO ✨

📅 DATE: ${date}
🗓️ DAY: ${day}
⏰ TIME: ${time}

📊 WEEK NUMBER: ${week}
🌤️ DAY OF YEAR: ${dayOfYear}
⏳ DAYS LEFT: ${daysLeft}

🌏 TIMEZONE: Asia/Dhaka (GMT+6)
🔮 POWERED BY: Asif Mahmud

🇧🇩 SHONAR BANGLA DESH TIME 🇧🇩`;

            await message.reply(response);
        } 
        catch (error) {
            console.error("DateTime Error:", error);
            await message.reply("❌ An error occurred while fetching time data. Please try again later.");
        }
    },

    onChat: async function ({ event, message }) {
        const lowerBody = event.body.toLowerCase();
        if (lowerBody.includes("time") && lowerBody.includes("bd")) {
            this.onStart({ message, event, args: [] });
        }
    }
};
