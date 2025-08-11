const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');

module.exports.config = {
  name: "prayer",
  version: "1.3.0",
  hasPermission: 0,
  credits: "Asif",
  description: "Automated prayer time notifications with audio reminders",
  category: "utility",
  usages: "N/A (auto-timed)",
  cooldowns: 0,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "node-cron": ""
  }
};

// Prayer configuration with Bengali messages and audio URLs
const PRAYER_CONFIG = {
    "Fajr": {
        message: "⏰ ফজরের আজান হয়েছে\n\nসবাই নামাজের জন্য প্রস্তুতি নিন\nফজরের নামাজ শুরু হতে আর কিছু সময় বাকি",
        audio: "https://drive.google.com/uc?id=1m5jiP4q9"
    },
    "Dhuhr": {
        message: "⏰ জোহরের আজান হয়েছে\n\nসবাই নামাজের জন্য প্রস্তুতি নিন\nজোহরের নামাজ শুরু হতে আর কিছু সময় বাকি",
        audio: "https://drive.google.com/uc?id=1mB8EpEEb"
    },
    "Asr": {
        message: "⏰ আসরের আজান হয়েছে\n\nসবাই নামাজের জন্য প্রস্তুতি নিন\nআসরের নামাজ শুরু হতে আর কিছু সময় বাকি",
        audio: "https://drive.google.com/uc?id=1mkNnhFFv"
    },
    "Maghrib": {
        message: "⏰ মাগরিবের আজান হয়েছে\n\nসবাই নামাজের জন্য প্রস্তুতি নিন\nমাগরিবের নামাজ শুরু হতে আর কিছু সময় বাকি",
        audio: "https://drive.google.com/uc?id=1mNVwfsTE"
    },
    "Isha": {
        message: "⏰ ইশার আজান হয়েছে\n\nসবাই নামাজের জন্য প্রস্তুতি নিন\nইশার নামাজ শুরু হতে আর কিছু সময় বাকি",
        audio: "https://drive.google.com/uc?id=1mP2HJlKR"
    }
};

// Fallback prayer times for Dhaka, Bangladesh
const FALLBACK_TIMES = {
    Fajr: "05:35",
    Dhuhr: "13:00",
    Asr: "16:30",
    Maghrib: "19:05",
    Isha: "20:15"
};

// Changed from onLoad to onStart
module.exports.onStart = async function({ api }) {
    try {
        // Create cache directory
        const cacheDir = path.join(__dirname, 'prayer_cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        // Pre-download audio files
        for (const [prayerName, config] of Object.entries(PRAYER_CONFIG)) {
            const audioPath = path.join(cacheDir, `${prayerName}.mp3`);
            if (!fs.existsSync(audioPath)) {
                try {
                    const response = await axios({
                        method: 'get',
                        url: config.audio,
                        responseType: 'stream',
                        timeout: 30000
                    });

                    const writer = fs.createWriteStream(audioPath);
                    response.data.pipe(writer);
                    
                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });
                    console.log(`Downloaded ${prayerName} audio`);
                } catch (error) {
                    console.error(`Failed to download ${prayerName} audio:`, error.message);
                }
            }
        }
        
        // Schedule prayer notifications
        await schedulePrayerNotifications(api);
        
        // Schedule daily reset at midnight (Asia/Dhaka time)
        cron.schedule('0 0 * * *', async () => {
            console.log("Rescheduling prayer notifications for the new day...");
            await schedulePrayerNotifications(api);
        }, {
            scheduled: true,
            timezone: "Asia/Dhaka"
        });

        console.log("Prayer reminders initialized successfully");
        
    } catch (error) {
        console.error("Error in prayer command initialization:", error);
    }
};

async function schedulePrayerNotifications(api) {
    try {
        // Get prayer times
        const timings = await getPrayerTimes();
        
        // Schedule each prayer
        for (const [prayerName, config] of Object.entries(PRAYER_CONFIG)) {
            const time = timings[prayerName];
            if (!time) continue;
            
            // Convert to cron format (HH:mm -> mm HH * * *)
            const [hours, minutes] = time.split(':');
            const cronTime = `${minutes} ${hours} * * *`;
            
            cron.schedule(cronTime, async () => {
                console.log(`Sending ${prayerName} notification at ${time}`);
                await sendPrayerNotification(api, prayerName);
            }, {
                scheduled: true,
                timezone: "Asia/Dhaka"
            });
            
            console.log(`Scheduled ${prayerName} at ${time}`);
        }
    } catch (error) {
        console.error("Error scheduling prayer notifications:", error);
    }
}

async function getPrayerTimes() {
    try {
        // Fetch prayer times for Dhaka, Bangladesh
        const response = await axios.get(
            `https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1`,
            { timeout: 5000 }
        );
        
        // Return only the prayers we need
        const { Fajr, Dhuhr, Asr, Maghrib, Isha } = response.data.data.timings;
        return { Fajr, Dhuhr, Asr, Maghrib, Isha };
        
    } catch (error) {
        console.error('Failed to fetch prayer times, using fallback:', error.message);
        return FALLBACK_TIMES;
    }
}

async function sendPrayerNotification(api, prayerName) {
    const config = PRAYER_CONFIG[prayerName];
    if (!config) return;
    
    try {
        const cacheDir = path.join(__dirname, 'prayer_cache');
        const audioPath = path.join(cacheDir, `${prayerName}.mp3`);
        
        // Create message
        const messageData = {
            body: config.message,
            attachment: fs.existsSync(audioPath) 
                ? fs.createReadStream(audioPath)
                : undefined
        };

        // Send to all active threads
        global.data.allThreadID.forEach(threadID => {
            api.sendMessage(messageData, threadID);
        });

    } catch (error) {
        console.error(`Error sending ${prayerName} notification:`, error);
        // Fallback to text-only message
        global.data.allThreadID.forEach(threadID => {
            api.sendMessage(config.message, threadID);
        });
    }
}

module.exports.run = async function() {};
