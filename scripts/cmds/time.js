const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "time",
    version: "1.2.0",
    hasPermssion: 0,
    credits: "Asif Developer",
    description: "Display current time and date with timezone support",
    category: "info",
    usages: "[timezone]",
    cooldowns: 5,
    dependencies: {
      "moment-timezone": ""
    }
  },

  // Added required onStart function
  onStart: async function() {
    // Initialization if needed
  },

  run: async function({ api, event, args }) {
    try {
      const { threadID, messageID } = event;
      
      // List of valid timezones
      const validTimezones = [
        'Asia/Dhaka', 'Asia/Manila', 'America/New_York', 'Europe/London',
        'Asia/Tokyo', 'Australia/Sydney', 'Europe/Paris', 'Asia/Dubai',
        'Asia/Kolkata', 'Asia/Shenzhen', 'Europe/Amsterdam', 'Asia/Kuala_Lumpur',
        'America/Los_Angeles', 'Africa/Lagos', 'Asia/Seoul', 'Europe/Berlin'
      ];
      
      // Handle no arguments
      if (args.length === 0) {
        const timezoneList = validTimezones.map(tz => `• ${tz}`).join('\n');
        return api.sendMessage(
          `🕒 TIME COMMAND\n\n` +
          `Display current time for any timezone\n\n` +
          `Usage: time [timezone]\n` +
          `Example: time Asia/Manila\n\n` +
          `Available timezones:\n${timezoneList}\n\n` +
          `💡 Tip: Use the exact timezone name from the list`,
          threadID,
          messageID
        );
      }
      
      // Validate timezone
      const timezone = args[0];
      if (!moment.tz.zone(timezone)) {
        // Find similar timezones
        const suggestions = validTimezones.filter(tz => 
          tz.toLowerCase().includes(timezone.toLowerCase())
        );
        
        if (suggestions.length > 0) {
          return api.sendMessage(
            `⚠️ Invalid timezone. Did you mean:\n${suggestions.join('\n')}`,
            threadID,
            messageID
          );
        }
        
        return api.sendMessage(
          `❌ Invalid timezone. Use "time" without arguments to see available timezones.`,
          threadID,
          messageID
        );
      }
      
      // Get current time data
      const now = moment().tz(timezone);
      const formattedTime = now.format('h:mm:ss A');
      const formattedDate = now.format('dddd, MMMM D, YYYY');
      const utcOffset = now.format('Z');
      const dayOfYear = now.dayOfYear();
      const weekOfYear = now.week();
      const isDST = now.isDST() ? ' (DST)' : '';
      
      // Get timezone location name
      const locationName = timezone.split('/').pop().replace(/_/g, ' ');
      
      // Create time information message
      const message = `🕒 TIME INFORMATION: ${locationName}\n\n` +
        `⏰ Current Time: ${formattedTime}\n` +
        `📅 Date: ${formattedDate}\n` +
        `🌐 Timezone: ${timezone}\n` +
        `⏱️ UTC Offset: UTC${utcOffset}${isDST}\n\n` +
        `📆 Day of Year: ${dayOfYear}\n` +
        `🗓️ Week of Year: ${weekOfYear}\n\n` +
        `⏳ Current Unix Timestamp: ${moment().unix()}`;
      
      // Send the time information
      api.sendMessage(message, threadID, messageID);
      
    } catch (error) {
      console.error("Time command error:", error);
      api.sendMessage(
        "❌ An error occurred while fetching time information. Please try again later.",
        threadID,
        event.messageID
      );
    }
  }
};
