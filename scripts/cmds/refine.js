const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "refine",
  version: "1.3.0",
  hasPermission: 0,
  credits: "Asif",
  countDown: 15,
  description: "Enhance and transform images using AI technology",
  category: "image",
  usages: "[prompt]",
  dependencies: {
    "axios": "",
    "form-data": "",
    "fs-extra": ""
  }
};

// Add empty onStart to satisfy the loader
module.exports.onStart = async function() {};

// Cache directory setup
const cacheDir = path.join(__dirname, 'cache', 'refine');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

module.exports.run = async function({ api, event, args }) {
  try {
    const { threadID, messageID } = event;
    
    // Check if we have an image to process
    const imageAttachment = event.messageReply?.attachments?.[0] || 
                           event.attachments?.[0];
    
    if (!imageAttachment || !['photo', 'image'].includes(imageAttachment.type)) {
      return api.sendMessage(
        "🖼️ Please reply to an image or send an image with this command to use the refinement feature.\n\n" +
        "Example:\n" +
        "  • Reply to an image: refine make this look professional\n" +
        "  • Send with image: refine turn this into anime style [attach image]",
        threadID, 
        messageID
      );
    }

    // Get user prompt or use default
    const userPrompt = args.join(" ") || "Enhance this image with creative details";
    
    // Show processing message
    const processingMsg = await api.sendMessage(
      "✨ Your image is being refined by AI...\n━━━━━━━━━━━━━━\n" +
      "⏳ Processing: This may take 15-60 seconds\n" +
      `📝 Prompt: "${userPrompt}"`,
      threadID
    );

    // Process the image
    const result = await this.processImage(imageAttachment.url, userPrompt);
    
    // Handle result
    if (result.success && result.type === 'image') {
      // Unsend processing message
      api.unsendMessage(processingMsg.messageID);
      
      // Send the refined image
      await api.sendMessage({
        body: "✅ Image Refinement Complete!\n━━━━━━━━━━━━━━\n" + 
              `📝 Prompt: "${userPrompt}"\n\n` +
              "💡 Tips for better results:\n" +
              "  • Be specific about what you want\n" +
              "  • Include style references (e.g., 'anime style')\n" +
              "  • Mention desired elements (e.g., 'add mountains in background')",
        attachment: fs.createReadStream(result.path)
      }, threadID, () => {
        // Cleanup generated image
        try {
          if (fs.existsSync(result.path)) {
            fs.unlinkSync(result.path);
          }
        } catch (cleanupErr) {
          console.error("Cleanup error:", cleanupErr);
        }
      }, messageID);
    } else {
      // Send error message
      const errorBody = "❌ Image processing failed\n━━━━━━━━━━━━━━\n" + 
                       `🔍 Reason: ${result.message || 'Unknown error'}\n\n` +
                       "💡 Try these solutions:\n" +
                       "  • Use a different prompt\n" +
                       "  • Try a different image\n" +
                       "  • Wait a few minutes and try again";
                       
      await api.sendMessage(errorBody, threadID, messageID);
      api.unsendMessage(processingMsg.messageID);
    }
  } catch (error) {
    console.error("Refine command error:", error);
    return api.sendMessage(
      "❌ An unexpected error occurred while processing your image. Please try again later.", 
      event.threadID, 
      event.messageID
    );
  }
};

module.exports.processImage = async function(imageUrl, prompt) {
  try {
    const form = new FormData();
    form.append('url', imageUrl);
    form.append('prompt', prompt);
    
    const response = await axios.post('https://smfahim.xyz/gedit', form, {
      headers: form.getHeaders(),
      responseType: 'stream',
      timeout: 90000 // 90 seconds timeout
    });

    // Create output path
    const outputPath = path.join(cacheDir, `refined_${Date.now()}.png`);
    const writer = fs.createWriteStream(outputPath);
    
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve({
        success: true,
        type: 'image',
        path: outputPath
      }));
      
      writer.on('error', (error) => reject({
        success: false,
        type: 'error',
        message: 'Failed to save image: ' + error.message
      }));
    });
    
  } catch (error) {
    let errorMessage = 'API request failed';
    
    if (error.response) {
      // Try to get error details from API response
      try {
        const errorData = error.response.data;
        if (typeof errorData === 'object' && errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          // Try to extract error message from HTML
          const match = errorData.match(/<pre>(.*?)<\/pre>/s);
          errorMessage = match ? match[1] : 'API returned an error';
        } else {
          errorMessage = `API responded with status ${error.response.status}`;
        }
      } catch (parseError) {
        errorMessage = `API responded with status ${error.response.status}`;
      }
    } else if (error.request) {
      errorMessage = 'No response received from API server';
    } else {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      type: 'error',
      message: errorMessage
    };
  }
};

// Clean cache every hour
setInterval(() => {
  try {
    const files = fs.readdirSync(cacheDir);
    const now = Date.now();
    
    files.forEach(file => {
      const filePath = path.join(cacheDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtimeMs > 3600000) { // 1 hour
        fs.unlinkSync(filePath);
      }
    });
    console.log('Refine cache cleaned successfully');
  } catch (cleanError) {
    console.error('Refine cache cleanup error:', cleanError);
  }
}, 3600000); // Run every hour
