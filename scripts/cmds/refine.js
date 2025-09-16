const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  config: {
    name: "refine",
    aliases: ["enhance", "aiimage"],
    version: "1.5.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "image",
    shortDescription: {
      en: "✨ Enhance and transform images using AI technology"
    },
    longDescription: {
      en: "✨ Enhance and transform images using AI technology with various creative enhancements"
    },
    guide: {
      en: "{p}refine [prompt]\nReply to an image with your enhancement prompt"
    },
    dependencies: {
      "axios": "",
      "form-data": "",
      "fs-extra": "",
      "canvas": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Check dependencies
      try {
        if (!axios || !FormData || !fs || !path || !createCanvas || !loadImage) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install axios, form-data, fs-extra, and canvas.", event.threadID, event.messageID);
      }

      const { threadID, messageID } = event;
      const imageAttachment = event.messageReply?.attachments?.[0] || event.attachments?.[0];

      if (!imageAttachment || !['photo', 'image'].includes(imageAttachment.type)) {
        return api.sendMessage(
          "🖼️ Please reply to an image or send an image with this command\n\n" +
          "✨ Usage Examples:\n" +
          "• Reply to image: refine professional headshot\n" +
          "• Send with image: refine anime style [attach image]",
          threadID, 
          messageID
        );
      }

      const userPrompt = args.join(" ") || "Enhance this image with creative details";
      const processingMsg = await api.sendMessage(
        `✨ Refining your image...\n━━━━━━━━━━━━━━\n` +
        `🔮 Prompt: "${userPrompt}"\n` +
        `⏳ Estimated: 15-60 seconds`,
        threadID
      );

      const result = await processImage(imageAttachment.url, userPrompt);
      
      if (result.success && result.type === 'image') {
        api.unsendMessage(processingMsg.messageID);
        
        // Create stylish canvas frame
        const styledImage = await createStyledCanvas(result.path);
        
        await api.sendMessage({
          body: `✨ Refinement Complete!\n━━━━━━━━━━━━━━\n` + 
              `🔮 Prompt: "${userPrompt}"\n\n` +
              `💡 Tips for better results:\n` +
              "• Be specific about desired changes\n" +
              "• Mention art styles (anime, oil painting)\n" +
              "• Describe background/foreground elements",
          attachment: fs.createReadStream(styledImage)
        }, threadID, () => {
          [result.path, styledImage].forEach(file => {
            if (fs.existsSync(file)) fs.unlinkSync(file);
          });
        });
      } else {
        const errorBody = `❌ Refinement Failed\n━━━━━━━━━━━━━━\n` + 
                        `🔧 Reason: ${result.message || 'API error'}\n\n` +
                        `🛠️ Solutions:\n` +
                        "• Try a different prompt\n" +
                        "• Use higher quality images\n" +
                        "• Wait before retrying";
                        
        api.sendMessage(errorBody, threadID, messageID);
        api.unsendMessage(processingMsg.messageID);
      }
    } catch (error) {
      console.error("Refine command error:", error);
      api.sendMessage(
        "⚠️ An unexpected error occurred. Please try again later", 
        event.threadID, 
        event.messageID
      );
    }
  }
};

async function processImage(imageUrl, prompt) {
  try {
    const API_KEY = 'd7843d40-7604-11f0-bf3f-4f562e7a2c44';
    const requestData = {
      url: imageUrl,
      enhancements: ["denoise", "deblur", "light"],
      width: 2000
    };

    const response = await axios.post('https://deep-image.ai/rest_api/process_result', {
      parameters: JSON.stringify(requestData)
    }, {
      headers: { 'x-api-key': API_KEY },
      timeout: 90000
    });

    if (response.data?.url) {
      const imageResponse = await axios.get(response.data.url, {
        responseType: 'stream',
        timeout: 30000
      });

      const cacheDir = path.join(__dirname, 'cache', 'refine');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const outputPath = path.join(cacheDir, `refined_${Date.now()}.png`);
      const writer = fs.createWriteStream(outputPath);
      imageResponse.data.pipe(writer);
      
      return new Promise((resolve) => {
        writer.on('finish', () => resolve({
          success: true,
          type: 'image',
          path: outputPath
        }));
        writer.on('error', () => resolve({
          success: false,
          message: 'Failed to save image'
        }));
      });
    } else {
      throw new Error('No processed image URL');
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || error.message
    };
  }
}

async function createStyledCanvas(imagePath) {
  try {
    const img = await loadImage(imagePath);
    const canvas = createCanvas(img.width + 40, img.height + 120);
    const ctx = canvas.getContext('2d');
    
    // Create stylish background
    ctx.fillStyle = '#2c2c54';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add image with border
    ctx.strokeStyle = '#f7f1e3';
    ctx.lineWidth = 10;
    ctx.strokeRect(15, 15, img.width, img.height);
    ctx.drawImage(img, 20, 20, img.width, img.height);
    
    // Add footer text
    ctx.fillStyle = '#f7f1e3';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✨ AI-ENHANCED IMAGE ✨', canvas.width/2, img.height + 80);
    
    // Add watermark
    ctx.font = 'italic 16px Arial';
    ctx.fillText('Processed by Refine AI', canvas.width/2, img.height + 110);
    
    // Save to cache
    const cacheDir = path.join(__dirname, 'cache', 'refine');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const outputPath = path.join(cacheDir, `styled_${Date.now()}.png`);
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    
    return new Promise((resolve) => {
      out.on('finish', () => resolve(outputPath));
    });
  } catch {
    return imagePath; // Fallback to original if canvas fails
  }
}

// Cache cleaning function
function cleanRefineCache() {
  try {
    const cacheDir = path.join(__dirname, 'cache', 'refine');
    if (!fs.existsSync(cacheDir)) return;

    const files = fs.readdirSync(cacheDir);
    const now = Date.now();
    
    files.forEach(file => {
      const filePath = path.join(cacheDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtimeMs > 3600000) { 
        fs.unlinkSync(filePath);
      }
    });
    console.log('✨ Refine cache cleaned successfully');
  } catch (cleanError) {
    console.error('Refine cache cleanup error:', cleanError);
  }
}

// Set up periodic cache cleaning
setInterval(cleanRefineCache, 3600000);
