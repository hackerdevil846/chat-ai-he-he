const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "dog",
    version: "1.2.0",
    author: "Asif",
    category: "fun",
    shortDescription: "Get random dog pictures",
    longDescription: "Fetch adorable dog images from the Dog API to brighten your day",
    guide: {
      en: "{p}dog"
    },
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const { threadID } = event;
      
      // Show fetching message
      const processingMsg = await api.sendMessage("🐾 Searching for the cutest doggo...", threadID);

      // Get random dog image from API
      const response = await axios.get('https://dog.ceo/api/breeds/image/random');
      const imageUrl = response.data.message;
      
      if (!imageUrl) {
        await api.sendMessage("🐾 Couldn't find a dog picture right now. Please try again later!", threadID);
        return api.unsendMessage(processingMsg.messageID);
      }

      // Create cache directory
      const cacheDir = path.join(__dirname, 'dog-cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Download the image
      const imagePath = path.join(cacheDir, `dog_${Date.now()}.jpg`);
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 10000
      });
      
      // Save image to cache
      await fs.writeFile(imagePath, Buffer.from(imageResponse.data, 'binary'));

      // Send the image
      await api.sendMessage({
        body: "🐶 Here's a cute doggo for you! 🐾\n\nBreed: " + this.extractBreedName(imageUrl),
        attachment: fs.createReadStream(imagePath)
      }, threadID);
      
      // Delete processing message
      api.unsendMessage(processingMsg.messageID);
      
      // Clean up the image file
      await fs.unlink(imagePath);
      
    } catch (error) {
      console.error("❌ Dog command error:", error);
      api.sendMessage({
        body: "😿 Woof! Something went wrong...\n• API might be down\n• Connection timed out\n• Try again later",
        attachment: await this.getFallbackImage()
      }, event.threadID);
    }
  },

  extractBreedName: function(imageUrl) {
    try {
      // Extract breed name from URL
      const urlParts = imageUrl.split('/');
      const breedIndex = urlParts.indexOf('breeds') + 1;
      if (breedIndex > 0 && breedIndex < urlParts.length) {
        const breed = urlParts[breedIndex];
        return breed.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }
      return "Unknown Breed";
    } catch {
      return "Mystery Dog";
    }
  },

  getFallbackImage: async function() {
    try {
      // Try to get a fallback image from another API
      const fallback = await axios.get('https://api.thedogapi.com/v1/images/search', {
        timeout: 5000
      });
      
      if (fallback.data && fallback.data[0]?.url) {
        const response = await axios.get(fallback.data[0].url, {
          responseType: 'arraybuffer',
          timeout: 5000
        });
        return Buffer.from(response.data, 'binary');
      }
    } catch (fallbackError) {
      console.error("Fallback failed:", fallbackError);
    }
    
    // If all fails, use local fallback
    try {
      const fallbackPath = path.join(__dirname, 'assets', 'dog_fallback.jpg');
      if (fs.existsSync(fallbackPath)) {
        return fs.createReadStream(fallbackPath);
      }
    } catch (e) {
      console.error("Local fallback failed:", e);
    }
    
    return null;
  }
};
