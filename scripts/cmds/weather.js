const axios = require("axios");
const moment = require("moment-timezone");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "weather",
  version: "1.5.0",
  hasPermssion: 0,
  credits: "Asif",
  description: "Get detailed weather forecasts",
  category: "info",
  usages: "[location]",
  cooldowns: 15,
  dependencies: {
    "axios": "",
    "moment-timezone": "",
    "canvas": "",
    "fs-extra": "",
    "path": ""
  },
  envConfig: {
    weatherApiKey: "d7e795ae6a0d44aaa8abb1a0a7ac19e4"
  }
};

// Helper functions
function convertFtoC(F) {
  return Math.floor((F - 32) / 1.8);
}

function formatHours(date) {
  return moment(date).tz("Asia/Dhaka").format("h:mm A");
}

function createGradientBackground(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#1e5799");
  gradient.addColorStop(0.5, "#2989d8");
  gradient.addColorStop(1, "#7db9e8");
  
  // Fill background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add cloud effect
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = 30 + Math.random() * 70;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  return canvas;
}

module.exports.run = async function({ api, event, args }) {
  const apikey = this.config.envConfig.weatherApiKey;
  const { threadID, messageID } = event;
  
  // Default to Dhaka if no location specified
  const area = args.length > 0 ? args.join(" ") : "Dhaka";
  let loadingMsg;
  
  try {
    // Send loading message
    loadingMsg = await api.sendMessage(`⏳ Fetching weather data for ${area}...`, threadID);
    
    // Get location data
    const locationResponse = await axios.get(
      "https://api.accuweather.com/locations/v1/cities/search.json", {
        params: {
          q: area,
          apikey: apikey,
          language: "en"
        }
      }
    );

    if (!locationResponse.data || locationResponse.data.length === 0) {
      await api.unsendMessage(loadingMsg.messageID);
      return api.sendMessage(`❌ Location not found: ${area}`, threadID, messageID);
    }

    const locationData = locationResponse.data[0];
    const areaKey = locationData.Key;
    const areaName = locationData.LocalizedName + ", " + locationData.Country.LocalizedName;

    // Get weather data
    const weatherResponse = await axios.get(
      `https://api.accuweather.com/forecasts/v1/daily/5day/${areaKey}`, {
        params: {
          apikey: apikey,
          details: true,
          language: "en",
          metric: false
        }
      }
    );

    const weatherData = weatherResponse.data;
    if (!weatherData.DailyForecasts || weatherData.DailyForecasts.length === 0) {
      throw new Error("No forecast data available");
    }

    const forecastData = weatherData.DailyForecasts;
    const today = forecastData[0];

    // Create text summary
    const summary = `📍 ${areaName}\n\n☁️ ${weatherData.Headline?.Text || "No weather summary available"}\n🌡 Low: ${convertFtoC(today.Temperature?.Minimum?.Value) || "N/A"}°C | High: ${convertFtoC(today.Temperature?.Maximum?.Value) || "N/A"}°C\n🌡 Feels like: ${convertFtoC(today.RealFeelTemperature?.Minimum?.Value) || "N/A"}°C - ${convertFtoC(today.RealFeelTemperature?.Maximum?.Value) || "N/A"}°C\n🌅 Sunrise: ${formatHours(today.Sun?.Rise) || "N/A"}\n🌄 Sunset: ${formatHours(today.Sun?.Set) || "N/A"}\n🌃 Moonrise: ${formatHours(today.Moon?.Rise) || "N/A"}\n🏙️ Moonset: ${formatHours(today.Moon?.Set) || "N/A"}\n🌞 Day: ${today.Day?.LongPhrase || "N/A"}\n🌙 Night: ${today.Night?.LongPhrase || "N/A"}`;

    // Create weather image
    const canvasWidth = 900;
    const canvasHeight = 400;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");
    
    // Create gradient background
    const bgCanvas = createGradientBackground(canvasWidth, canvasHeight);
    ctx.drawImage(bgCanvas, 0, 0, canvasWidth, canvasHeight);
    
    // Set up text styles
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    
    // Title and date
    ctx.font = "bold 32px Arial";
    ctx.fillText(areaName, canvasWidth / 2, 40);
    
    ctx.font = "20px Arial";
    ctx.fillText(moment().tz("Asia/Dhaka").format("dddd, MMMM D, YYYY"), canvasWidth / 2, 70);
    
    // Current weather info
    ctx.font = "bold 24px Arial";
    ctx.fillText("5-Day Forecast", canvasWidth / 2, 110);
    
    // Draw forecast days
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const startX = 80;
    const y = 180;
    const spacing = 160;
    
    for (let i = 0; i < Math.min(5, forecastData.length); i++) {
      const day = forecastData[i];
      const date = moment(day.Date).tz("Asia/Dhaka");
      const x = startX + (i * spacing);
      
      // Draw day name and date
      ctx.font = "bold 22px Arial";
      ctx.fillText(days[date.day()], x, y - 20);
      
      ctx.font = "18px Arial";
      ctx.fillText(date.format("MMM D"), x, y);
      
      try {
        // Load weather icon
        const iconUrl = `https://developer.accuweather.com/sites/default/files/${day.Day.Icon < 10 ? '0' + day.Day.Icon : day.Day.Icon}-s.png`;
        const { data: iconBuffer } = await axios.get(iconUrl, { responseType: 'arraybuffer' });
        const icon = await loadImage(iconBuffer);
        ctx.drawImage(icon, x - 35, y + 10, 70, 45);
      } catch (iconError) {
        console.error("Weather icon error:", iconError);
      }
      
      // Draw temperatures
      const maxTemp = convertFtoC(day.Temperature?.Maximum?.Value);
      const minTemp = convertFtoC(day.Temperature?.Minimum?.Value);
      ctx.font = "bold 20px Arial";
      ctx.fillText(`↑ ${maxTemp}°C`, x, y + 90);
      ctx.font = "18px Arial";
      ctx.fillText(`↓ ${minTemp}°C`, x, y + 115);
    }

    // Add footer
    ctx.font = "14px Arial";
    ctx.fillText("Powered by AccuWeather", canvasWidth / 2, canvasHeight - 20);

    // Save image
    const cacheDir = path.join(__dirname, "cache", "weather");
    await fs.ensureDir(cacheDir);
    
    const outputPath = path.join(cacheDir, `weather_${Date.now()}.jpg`);
    const buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });
    await fs.writeFile(outputPath, buffer);

    // Send result
    await api.unsendMessage(loadingMsg.messageID);
    await api.sendMessage({
      body: summary,
      attachment: fs.createReadStream(outputPath)
    }, threadID);
    
    // Clean up after sending
    setTimeout(() => {
      fs.unlink(outputPath, () => {});
    }, 5000);

  } catch (error) {
    console.error("Weather command error:", error);
    if (loadingMsg) {
      try {
        await api.unsendMessage(loadingMsg.messageID);
      } catch (e) {}
    }
    api.sendMessage(
      `❌ Weather service is currently unavailable for ${area}.\nError: ${error.message}`,
      threadID,
      messageID
    );
  }
};

module.exports.onStart = async function() {};
