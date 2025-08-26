const axios = require("axios");
const moment = require("moment-timezone");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "weather",
  version: "2.0.0",
  Permssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑴𝒐𝒔𝒂𝒎 𝒆𝒓 𝒃𝒊𝒔𝒕𝒓𝒊𝒕𝒐 𝒋𝒂𝒏𝒌𝒂𝒓𝒊",
  category: "info",
  usages: "[𝒋𝒂𝒚𝒈𝒂 𝒆𝒓 𝒏𝒂𝒎]",
  cooldowns: 15,
  dependencies: {
    "axios": "",
    "moment-timezone": "",
    "canvas": "",
    "fs-extra": "",
    "path": ""
  }
};

// Helper: format time for Dhaka (display)
function formatHours(dateString, tz = "Asia/Dhaka") {
  return moment(dateString).tz(tz).format("h:mm A");
}

function getWeatherIcon(weatherCode) {
  const iconMap = {
    0: "01d", // Clear sky
    1: "02d", // Mainly clear
    2: "03d", // Partly cloudy
    3: "04d", // Overcast
    45: "50d", // Fog
    48: "50d", // Depositing rime fog
    51: "09d", // Light drizzle
    53: "09d", // Moderate drizzle
    55: "09d", // Dense drizzle
    56: "13d", // Light freezing drizzle
    57: "13d", // Dense freezing drizzle
    61: "10d", // Slight rain
    63: "10d", // Moderate rain
    65: "10d", // Heavy rain
    66: "13d", // Light freezing rain
    67: "13d", // Heavy freezing rain
    71: "13d", // Slight snow fall
    73: "13d", // Moderate snow fall
    75: "13d", // Heavy snow fall
    77: "13d", // Snow grains
    80: "09d", // Slight rain showers
    81: "09d", // Moderate rain showers
    82: "09d", // Violent rain showers
    85: "13d", // Slight snow showers
    86: "13d", // Heavy snow showers
    95: "11d", // Thunderstorm
    96: "11d", // Thunderstorm with slight hail
    99: "11d"  // Thunderstorm with heavy hail
  };
  return iconMap[weatherCode] || "01d";
}

function getWeatherDescription(weatherCode) {
  const descriptions = {
    0: "𝒔𝒂𝒇 𝒂𝒌𝒂𝒔𝒉",
    1: "𝒂𝒌𝒂𝒔𝒉 𝒔𝒂𝒇",
    2: "𝒂𝒍𝒑𝒐 𝒎𝒆𝒈𝒉",
    3: "𝒎𝒆𝒈𝒉𝒍𝒂",
    45: "𝒌𝒖𝒚𝒂𝒔𝒂",
    48: "𝒃𝒓𝒇 𝒌𝒖𝒚𝒂𝒔𝒂",
    51: "𝒂𝒍𝒑𝒐 𝒇𝒖𝒂 𝒇𝒖𝒂",
    53: "𝒇𝒖𝒂 𝒇𝒖𝒂",
    55: "𝒃𝒆𝒔𝒊 𝒇𝒖𝒂 𝒇𝒖𝒂",
    56: "𝒃𝒓𝒇 𝒇𝒖𝒂 𝒇𝒖𝒂",
    57: "𝒃𝒆𝒔𝒊 𝒃𝒓𝒇 𝒇𝒖𝒂 𝒇𝒖𝒂",
    61: "𝒂𝒍𝒑𝒐 𝒃𝒓𝒔𝒕𝒊",
    63: "𝒃𝒓𝒔𝒕𝒊",
    65: "𝒃𝒆𝒔𝒊 𝒃𝒓𝒔𝒕𝒊",
    66: "𝒃𝒓𝒇 𝒃𝒓𝒔𝒕𝒊",
    67: "𝒃𝒆𝒔𝒊 𝒃𝒓𝒇 𝒃𝒓𝒔𝒕𝒊",
    71: "𝒂𝒍𝒑𝒐 𝒃𝒓𝒇",
    73: "𝒃𝒓𝒇",
    75: "𝒃𝒆𝒔𝒊 𝒃𝒓𝒇",
    77: "𝒃𝒓𝒇 𝒌𝒐𝒏𝒂",
    80: "𝒂𝒍𝒑𝒐 𝒃𝒓𝒔𝒕𝒊",
    81: "𝒃𝒓𝒔𝒕𝒊",
    82: "𝒃𝒆𝒔𝒊 𝒃𝒓𝒔𝒕𝒊",
    85: "𝒂𝒍𝒑𝒐 𝒃𝒓𝒇",
    86: "𝒃𝒆𝒔𝒊 𝒃𝒓𝒇",
    95: "𝒃𝒊𝒋𝒍𝒊 𝒃𝒂𝒅𝒂𝒍",
    96: "𝒃𝒊𝒋𝒍𝒊 𝒃𝒂𝒅𝒂𝒍 𝒂𝒓 𝒐𝒍𝒂",
    99: "𝒃𝒊𝒋𝒍𝒊 𝒃𝒂𝒅𝒂𝒍 𝒂𝒓 𝒃𝒆𝒔𝒊 𝒐𝒍𝒂"
  };
  return descriptions[weatherCode] || "𝒂𝒌𝒂𝒔𝒉 𝒔𝒂𝒇";
}

async function getCoordinates(location) {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
        limit: 1
      },
      headers: {
        'User-Agent': 'WeatherBot/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        name: (result.display_name || "").split(",")[0]
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

function createGradientBackground(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#1e5799");
  gradient.addColorStop(0.5, "#2989d8");
  gradient.addColorStop(1, "#7db9e8");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

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

function findNearestIndex(timeArray, targetIso) {
  if (!Array.isArray(timeArray) || timeArray.length === 0) return -1;
  let nearest = 0;
  let minDiff = Math.abs(moment(timeArray[0]).diff(moment(targetIso)));
  for (let i = 1; i < timeArray.length; i++) {
    const diff = Math.abs(moment(timeArray[i]).diff(moment(targetIso)));
    if (diff < minDiff) {
      minDiff = diff;
      nearest = i;
    }
  }
  return nearest;
}

module.exports.onStart = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const area = args.length > 0 ? args.join(" ") : "Dhaka";
  let loadingMsg = null;

  try {
    loadingMsg = await api.sendMessage(`⏳ 𝑴𝒐𝒔𝒂𝒎 𝒆𝒓 𝒕𝒐𝒕𝒉𝒚𝒐 𝒂𝒏𝒄𝒉𝒊 ${area} 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐...`, threadID);

    let coordinates;
    if (area.toLowerCase().trim() === "dhaka") {
      coordinates = { lat: 23.8103, lon: 90.4125, name: "Dhaka" };
    } else {
      coordinates = await getCoordinates(area);
    }

    if (!coordinates) {
      if (loadingMsg) {
        try { await api.unsendMessage(loadingMsg.messageID); } catch (e) {}
      }
      return api.sendMessage(`❌ 𝑬𝒊 𝒋𝒂𝒚𝒈𝒂 𝒑𝒂𝒐𝒚𝒂 𝒋𝒂𝒚 𝒏𝒂: ${area}`, threadID, messageID);
    }

    // Request hourly + daily data (keep using open-meteo endpoint)
    const weatherResponse = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: coordinates.lat,
        longitude: coordinates.lon,
        hourly: "temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,wind_speed_10m,wind_direction_10m",
        daily: "weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset",
        timezone: "auto",
        forecast_days: 7
      }
    });

    const weatherData = weatherResponse.data;
    if (!weatherData || (!weatherData.hourly && !weatherData.daily)) {
      throw new Error("𝑴𝒐𝒔𝒂𝒎 𝒆𝒓 𝒕𝒐𝒕𝒉𝒚𝒐 𝒑𝒂𝒐𝒚𝒂 𝒋𝒂𝒚 𝒏𝒂");
    }

    // Determine timezone used by API (auto or provided)
    const apiTimezone = weatherData.timezone || "UTC";

    // Find current index in hourly arrays (nearest hour)
    const nowIso = moment().tz(apiTimezone).startOf("hour").format();
    const hourly = weatherData.hourly || {};
    const daily = weatherData.daily || {};
    let currentIndex = -1;
    if (hourly.time && Array.isArray(hourly.time)) {
      // direct match
      currentIndex = hourly.time.indexOf(nowIso);
      if (currentIndex === -1) {
        currentIndex = findNearestIndex(hourly.time, nowIso);
      }
    }

    // Fallbacks for current values
    const currentTemperature = (hourly.temperature_2m && hourly.temperature_2m[currentIndex] != null)
      ? hourly.temperature_2m[currentIndex]
      : (weatherData.current_weather && weatherData.current_weather.temperature) || null;

    const currentApparent = (hourly.apparent_temperature && hourly.apparent_temperature[currentIndex] != null)
      ? hourly.apparent_temperature[currentIndex]
      : null;

    const currentHumidity = (hourly.relativehumidity_2m && hourly.relativehumidity_2m[currentIndex] != null)
      ? hourly.relativehumidity_2m[currentIndex]
      : null;

    const currentWindSpeed = (hourly.wind_speed_10m && hourly.wind_speed_10m[currentIndex] != null)
      ? hourly.wind_speed_10m[currentIndex]
      : (weatherData.current_weather && weatherData.current_weather.windspeed) || null;

    const currentWeatherCode = (hourly.weathercode && hourly.weathercode[currentIndex] != null)
      ? hourly.weathercode[currentIndex]
      : (weatherData.current_weather && weatherData.current_weather.weathercode) || (daily.weathercode && daily.weathercode[0]);

    const areaName = coordinates.name || area;

    const summary = `📍 ${areaName}

🌡️ 𝑬𝒌𝒉𝒐𝒏: ${currentTemperature != null ? Math.round(currentTemperature) + "°C" : "N/A"}
🌡️ 𝑳𝒂𝒈𝒆: ${currentApparent != null ? Math.round(currentApparent) + "°C" : "N/A"}
🌡️ 𝑨𝒋𝒌𝒆𝒓 𝒌𝒐𝒎: ${daily.temperature_2m_min && daily.temperature_2m_min[0] != null ? Math.round(daily.temperature_2m_min[0]) + "°C" : "N/A"} | 𝒃𝒆𝒔𝒊: ${daily.temperature_2m_max && daily.temperature_2m_max[0] != null ? Math.round(daily.temperature_2m_max[0]) + "°C" : "N/A"}
💧 𝑨𝒓𝒅𝒓𝒐𝒕𝒂: ${currentHumidity != null ? Math.round(currentHumidity) + "%" : "N/A"}
🌅 𝑺𝒖𝒓𝒋𝒐 𝒖𝒕𝒉𝒂: ${daily.sunrise && daily.sunrise[0] ? formatHours(daily.sunrise[0], apiTimezone) : "N/A"}
🌄 𝑺𝒖𝒓𝒋𝒐 𝒂𝒔𝒕𝒂: ${daily.sunset && daily.sunset[0] ? formatHours(daily.sunset[0], apiTimezone) : "N/A"}
☁️ 𝑨𝒌𝒂𝒔𝒉: ${getWeatherDescription(currentWeatherCode)}
💨 𝑩𝒂𝒕𝒂𝒔𝒉: ${currentWindSpeed != null ? Math.round(currentWindSpeed) + " km/h" : "N/A"}`;

    // Create canvas image
    const canvasWidth = 900;
    const canvasHeight = 400;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    const bgCanvas = createGradientBackground(canvasWidth, canvasHeight);
    ctx.drawImage(bgCanvas, 0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

    ctx.font = "bold 32px Arial";
    ctx.fillText(areaName, canvasWidth / 2, 40);

    ctx.font = "20px Arial";
    ctx.fillText(moment().tz("Asia/Dhaka").format("dddd, MMMM D, YYYY"), canvasWidth / 2, 70);

    ctx.font = "bold 24px Arial";
    ctx.fillText("𝟕 𝒅𝒊𝒏 𝒆𝒓 𝒎𝒐𝒔𝒂𝒎", canvasWidth / 2, 110);

    const days = ["𝑹𝒐𝒃𝒊𝒃𝒂𝒓", "𝑺𝒐𝒎𝒃𝒂𝒓", "𝑴𝒐𝒏𝒈𝒈𝒐𝒍𝒃𝒂𝒓", "𝑩𝒖𝒅𝒉𝒃𝒂𝒓", "𝑩𝒓𝒊𝒉𝒐𝒔𝒑𝒐𝒕𝒊𝒃𝒂𝒓", "𝑺𝒖𝒌𝒓𝒐𝒃𝒂𝒓", "𝑺𝒐𝒏𝒊𝒃𝒂𝒓"];
    const startX = 80;
    const y = 180;
    const spacing = 140;

    const dayCount = Math.min(6, (daily.time && daily.time.length) ? daily.time.length : 0);
    for (let i = 0; i < dayCount; i++) {
      const dateIso = daily.time[i];
      const date = moment(dateIso).tz(apiTimezone);
      const x = startX + (i * spacing);

      ctx.font = "bold 20px Arial";
      ctx.fillText(days[date.day()], x, y - 20);

      ctx.font = "16px Arial";
      ctx.fillText(date.format("MMM D"), x, y);

      try {
        const iconCode = getWeatherIcon((daily.weathercode && daily.weathercode[i] != null) ? daily.weathercode[i] : (currentWeatherCode || 0));
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const { data: iconBuffer } = await axios.get(iconUrl, { responseType: 'arraybuffer' });
        const icon = await loadImage(iconBuffer);
        ctx.drawImage(icon, x - 30, y + 10, 60, 40);
      } catch (iconError) {
        console.error("Weather icon error:", iconError);
        ctx.font = "30px Arial";
        ctx.fillText("☁️", x, y + 35);
      }

      const maxTemp = Math.round(daily.temperature_2m_max[i]);
      const minTemp = Math.round(daily.temperature_2m_min[i]);
      ctx.font = "bold 18px Arial";
      ctx.fillText(`↑ ${maxTemp}°C`, x, y + 80);
      ctx.font = "16px Arial";
      ctx.fillText(`↓ ${minTemp}°C`, x, y + 100);
    }

    ctx.font = "14px Arial";
    ctx.fillText("𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", canvasWidth / 2, canvasHeight - 20);

    // Save image to cache dir
    const cacheDir = path.join(__dirname, "cache", "weather");
    await fs.ensureDir(cacheDir);

    const outputPath = path.join(cacheDir, `weather_${Date.now()}.jpg`);
    const buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });
    await fs.writeFile(outputPath, buffer);

    // Send results
    if (loadingMsg) {
      try { await api.unsendMessage(loadingMsg.messageID); } catch (e) {}
    }

    await api.sendMessage({
      body: summary,
      attachment: fs.createReadStream(outputPath)
    }, threadID);

    // cleanup after a short while
    setTimeout(() => {
      fs.unlink(outputPath, () => {});
    }, 5000);

  } catch (error) {
    console.error("Weather command error:", error);
    if (loadingMsg) {
      try { await api.unsendMessage(loadingMsg.messageID); } catch (e) {}
    }

    let errorMessage = `❌ 𝑴𝒐𝒔𝒂𝒎 𝒆𝒓 𝒔𝒆𝒃𝒂 𝒆𝒌𝒉𝒐𝒏 𝒃𝒐𝒏𝒅𝒉𝒐 ${area} 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐.`;
    if (error.response && error.response.status === 404) {
      errorMessage = `❌ 𝑬𝒊 𝒋𝒂𝒚𝒈𝒂 𝒑𝒂𝒐𝒚𝒂 𝒋𝒂𝒚 𝒏𝒂: ${area}`;
    }
    return api.sendMessage(errorMessage, threadID, messageID);
  }
};

module.exports.onStart = async function () {};
