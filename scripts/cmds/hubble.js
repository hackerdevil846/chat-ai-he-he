const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
    config: {
        name: "hubble",
        aliases: ["nasaimage", "spacepic"],
        version: "1.3",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "View Hubble telescope images"
        },
        longDescription: {
            en: "Get astronomical images from NASA's Hubble telescope by date"
        },
        guide: {
            en: "{p}hubble <date (mm-dd)>"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onLoad: async function () {
        const pathData = __dirname + '/assets/hubble/nasa.json';
        
        if (!fs.existsSync(__dirname + '/assets/hubble')) {
            fs.mkdirSync(__dirname + '/assets/hubble', { recursive: true });
        }
        
        if (!fs.existsSync(pathData)) {
            try {
                const res = await axios.get('https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/scripts/cmds/assets/hubble/nasa.json');
                fs.writeFileSync(pathData, JSON.stringify(res.data, null, 2));
            } catch (error) {
                console.error('Failed to download NASA data:', error);
            }
        }
    },

    onStart: async function ({ message, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ Missing dependencies: axios and fs-extra");
            }

            const date = args[0] || "";
            const dateText = checkValidDate(date);
            
            if (!date || !dateText) {
                return message.reply("❌ Invalid date format! Please use mm-dd format");
            }

            const pathData = __dirname + '/assets/hubble/nasa.json';
            if (!fs.existsSync(pathData)) {
                return message.reply("🔴 Data not available. Please try again later");
            }

            const hubbleData = JSON.parse(fs.readFileSync(pathData));
            const data = hubbleData.find(e => e.date.startsWith(dateText));
            
            if (!data) {
                return message.reply("🌌 No Hubble image found for this date");
            }

            const { image, name, caption, url } = data;
            const imageUrl = 'https://imagine.gsfc.nasa.gov/hst_bday/images/' + image;
            
            const imageStream = await global.utils.getStreamFromURL(imageUrl);
            
            const msg = `✨ HUBBLE TELESCOPE IMAGE ✨

📅 Date: ${dateText}
🌠 Name: ${name}
📝 Caption: ${caption}
🔗 Source: ${url}`;

            await message.reply({
                body: msg,
                attachment: imageStream
            });

        } catch (error) {
            console.error(error);
            await message.reply("❌ An error occurred while processing your request");
        }
    }
};

const monthText = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function checkValidDate(date) {
    const dateArr = date.split(/[-/]/);
    if (dateArr.length !== 2) return false;
    
    let [month, day] = dateArr.map(Number);
    
    if (month > 12) {
        [day, month] = [month, day];
    }
    
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;
    if (month === 2 && day > 29) return false;
    if ([4, 6, 9, 11].includes(month) && day > 30) return false;
    
    return `${monthText[month - 1]} ${day}`;
}
