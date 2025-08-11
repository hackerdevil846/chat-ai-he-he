const axios = require("axios");

module.exports.config = {
  name: "prayertime",
  version: "1.3.0",
  hasPermission: 0,
  credits: "Asif",
  description: "Get accurate Islamic prayer times for any location worldwide",
  category: "utility",
  usages: "[city] or [city, country]",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

module.exports.onStart = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  let processingMsg;
  
  try {
    // Get location from arguments or use default
    const location = args.join(" ") || "Dhaka";
    
    // Send processing message
    processingMsg = await api.sendMessage(
      `⏳ Fetching prayer times for ${location}...`,
      threadID
    );

    // Get prayer times from API
    const apiUrl = `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(location)}`;
    const response = await axios.get(apiUrl, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response");
    }
    
    const prayerData = response.data.data;
    const timings = prayerData.timings;
    const dateInfo = prayerData.date;
    const meta = prayerData.meta;
    
    // Create formatted message
    let prayerMessage = "🕌 Islamic Prayer Times 🕌\n\n";
    prayerMessage += `📍 Location: ${location}\n`;
    prayerMessage += `📅 Date: ${dateInfo.readable}\n`;
    prayerMessage += `📅 Hijri Date: ${dateInfo.hijri.day} ${dateInfo.hijri.month.en} ${dateInfo.hijri.year}\n\n`;
    
    prayerMessage += "⏰ Prayer Schedule:\n";
    prayerMessage += `• Fajr: ${timings.Fajr}\n`;
    prayerMessage += `• Sunrise: ${timings.Sunrise}\n`;
    prayerMessage += `• Dhuhr: ${timings.Dhuhr}\n`;
    prayerMessage += `• Asr: ${timings.Asr}\n`;
    prayerMessage += `• Maghrib: ${timings.Maghrib}\n`;
    prayerMessage += `• Isha: ${timings.Isha}\n\n`;
    
    prayerMessage += "🌙 Additional Information:\n";
    prayerMessage += `• Qibla Direction: ${meta.qiblaDirection}° from North\n`;
    prayerMessage += `• Calculation Method: ${meta.method.name}\n`;
    prayerMessage += `• Timezone: ${meta.timezone}`;

    // Send the prayer times
    await api.sendMessage(prayerMessage, threadID, messageID);
    
    // Delete processing message
    if (processingMsg) {
      api.unsendMessage(processingMsg.messageID);
    }
    
  } catch (error) {
    console.error("Prayer time command error:", error);
    
    // Delete processing message if exists
    if (processingMsg) {
      api.unsendMessage(processingMsg.messageID);
    }
    
    // Send detailed error message
    let errorMessage = "❌ Failed to get prayer times. Please try:\n\n";
    errorMessage += "1. Check your location spelling\n";
    errorMessage += "2. Try a nearby major city (e.g., 'London' instead of 'Lndn')\n";
    errorMessage += "3. Use city and country format (e.g., 'Paris, France')\n";
    errorMessage += "4. Ensure you have an internet connection\n";
    errorMessage += "5. Try again in a few minutes\n\n";
    errorMessage += "Example: prayertime New York";
    
    api.sendMessage(errorMessage, threadID, messageID);
  }
};
