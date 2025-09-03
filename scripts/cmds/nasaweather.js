const axios = require('axios');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "nasaweather",
    version: "beta",
    role: 0,
    author: "Asif Mahmud",
    category: "utility",
    shortDescription: {
      en: "Automatic weather updates from NASA satellites"
    },
    longDescription: {
      en: "Get weather information from NASA satellite data with automatic updates"
    },
    guide: {
      en: "nasaweather [city/province]"
    },
    countDown: 3,
    dependencies: {
      "axios": "",
      "moment-timezone": ""
    }
  },

  onLoad: function({ api }) {
    const weatherSchedules = [
      {
        timer: '12:05:00 AM',
        message: ['\n{weatherInfo}']
      }
    ];

    setInterval(async () => {
      const currentTime = new Date(Date.now() + 25200000).toLocaleString().split(/,/).pop().trim();
      const schedule = weatherSchedules.find(i => i.timer === currentTime);
      
      if (schedule) {
        try {
          const randomMessage = schedule.message[Math.floor(Math.random() * schedule.message.length)];
          const res = await axios.get(`https://api.popcat.xyz/weather?q=${encodeURI('Ho Chi Minh')}`);
          
          const moment = require("moment-timezone");
          let dayOfWeek = moment.tz('Asia/Dhaka').format('dddd');
          const days = {
            'Sunday': 'Sunday',
            'Monday': 'Monday', 
            'Tuesday': 'Tuesday',
            'Wednesday': 'Wednesday',
            'Thursday': 'Thursday',
            'Friday': 'Friday',
            'Saturday': 'Saturday'
          };
          dayOfWeek = days[dayOfWeek] || dayOfWeek;

          const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
          
          let weatherCondition = `${res.data[0].current.skytext}`;
          const conditions = {
            'Sunny': 'Sunny',
            'Mostly Sunny': 'Mostly Sunny',
            'Partly Sunny': 'Partly Sunny',
            'Rain Showers': 'Rain Showers',
            'T-Storms': 'Thunderstorms',
            'Light Rain': 'Light Rain',
            'Mostly Cloudy': 'Mostly Cloudy',
            'Rain': 'Rain',
            'Heavy T-Storms': 'Heavy Thunderstorms',
            'Partly Cloudy': 'Partly Cloudy',
            'Mostly Clear': 'Mostly Clear',
            'Cloudy': 'Cloudy',
            'Clear': 'Clear'
          };
          weatherCondition = conditions[weatherCondition] || weatherCondition;

          let windDirection = res.data[0].current.winddisplay.toString().split(" ")[2];
          const directions = {
            'Northeast': 'Northeast',
            'Northwest': 'Northwest',
            'Southeast': 'Southeast',
            'Southwest': 'Southwest',
            'East': 'East',
            'West': 'West',
            'North': 'North',
            'South': 'South'
          };
          windDirection = directions[windDirection] || windDirection;

          const weatherInfo = `Weather update for ${res.data[0].location.name}\n→ Time: ${dayOfWeek} ${date}\n→ Temperature: ${res.data[0].current.temperature}°${res.data[0].location.degreetype}\n→ Forecast: ${weatherCondition}\n→ Humidity: ${res.data[0].current.humidity}%\n→ Wind Direction: ${res.data[0].current.windspeed} ${windDirection}\n→ Recorded at: ${res.data[0].current.observationtime} from NASA space control station\n→ Use nasaweather + city/province to see details for upcoming days`;

          global.data.allThreadID.forEach(threadID => {
            api.sendMessage(randomMessage.replace(/{weatherInfo}/g, weatherInfo), threadID);
          });
        } catch (error) {
          console.error('Weather update error:', error);
        }
      }
    }, 1000);
  },

  onStart: async function({ message, event, args }) {
    try {
      const city = args.join(" ");
      if (!city) return message.reply("Please enter a city/province to check weather");

      const res = await axios.get(`https://api.popcat.xyz/weather?q=${encodeURI(city)}`);
      const forecast = res.data[0].forecast;
      
      let weatherText = `Weather forecast for: ${city}`;
      
      for (let i = 0; i < 5; i++) {
        let dayOfWeek = forecast[i].day;
        const days = {
          'Sunday': 'Sunday',
          'Monday': 'Monday',
          'Tuesday': 'Tuesday',
          'Wednesday': 'Wednesday',
          'Thursday': 'Thursday',
          'Friday': 'Friday',
          'Saturday': 'Saturday'
        };
        dayOfWeek = days[dayOfWeek] || dayOfWeek;

        let weatherCondition = forecast[i].skytextday;
        const conditions = {
          'Sunny': 'Sunny',
          'Mostly Sunny': 'Mostly Sunny',
          'Partly Sunny': 'Partly Sunny',
          'Rain Showers': 'Rain Showers',
          'T-Storms': 'Thunderstorms',
          'Light Rain': 'Light Rain',
          'Mostly Cloudy': 'Mostly Cloudy',
          'Rain': 'Rain',
          'Heavy T-Storms': 'Heavy Thunderstorms',
          'Partly Cloudy': 'Partly Cloudy',
          'Mostly Clear': 'Mostly Clear',
          'Cloudy': 'Cloudy',
          'Clear': 'Clear'
        };
        weatherCondition = conditions[weatherCondition] || weatherCondition;

        weatherText += `\n${i+1}. ${dayOfWeek} ${forecast[i].date}\n→ Temperature: ${forecast[i].low}°C to ${forecast[i].high}°C\n→ Forecast: ${weatherCondition}\n→ Rain chance: ${forecast[i].precip}%\n`;
      }

      message.reply(weatherText);
    } catch (error) {
      console.error('Weather command error:', error);
      message.reply("Error getting weather information. Please try again later.");
    }
  }
};
