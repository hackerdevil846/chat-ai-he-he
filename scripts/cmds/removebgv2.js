const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const downloader = require('image-downloader');

module.exports = {
  config: {
    name: 'removebgv2',
    version: '1.2.0',
    hasPermssion: 0,
    credits: 'Asif',
    description: 'Remove image backgrounds with enhanced API handling',
    category: 'media',
    usages: '[reply to image]',
    cooldowns: 15,
    dependencies: {
      'form-data': '',
      'image-downloader': '',
      'fs-extra': '',
      'axios': ''
    }
  },

  onStart: async function({ api, event }) {
    try {
      // Validate message reply
      if (event.type !== 'message_reply' || 
          !event.messageReply.attachments || 
          !event.messageReply.attachments.length) {
        return api.sendMessage('🖼️ | Please reply to a photo to remove background', event.threadID, event.messageID);
      }

      const attachment = event.messageReply.attachments[0];
      if (attachment.type !== 'photo') {
        return api.sendMessage('❌ | This is not a valid image file', event.threadID, event.messageID);
      }

      const cachePath = path.join(__dirname, 'removebg_cache.png');
      
      // Download image with retry
      let downloadSuccess = false;
      for (let i = 0; i < 3; i++) {
        try {
          await downloader.image({
            url: attachment.url,
            dest: cachePath
          });
          downloadSuccess = true;
          break;
        } catch (downloadError) {
          if (i === 2) throw downloadError;
        }
      }

      if (!downloadSuccess) {
        return api.sendMessage('⚠️ | Failed to download image after multiple attempts', event.threadID, event.messageID);
      }

      // Prepare API request
      const form = new FormData();
      form.append('size', 'auto');
      form.append('image_file', fs.createReadStream(cachePath));

      // Rotating API keys
      const apiKeys = [
        'y5K9ssQnhr8sB9Tp4hrMsLtU',
        's6d6EanXm7pEsck9zKjgnJ5u',
        'GJkFyR3WdGAwn8xW5MDYAVWf',
        'ZLTgza4FPGii1AEUmZpkzYb7',
        'ymutgb6hEYEDR6xUbfQUiPri',
        'm6AhtWhWJBAPqZzy5BrvMmUp',
        'xHSGza4zdY8KsHGpQs4phRx9'
      ];
      const activeKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

      // Process image through remove.bg API
      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: form,
        responseType: 'arraybuffer',
        headers: {
          ...form.getHeaders(),
          'X-Api-Key': activeKey
        }
      });

      // Validate API response
      if (response.status !== 200 || !response.data) {
        throw new Error('Invalid API response');
      }

      // Save processed image
      fs.writeFileSync(cachePath, Buffer.from(response.data));
      
      // Send result
      api.sendMessage({
        body: '✅ | Background removed successfully!',
        attachment: fs.createReadStream(cachePath)
      }, event.threadID, () => {
        // Cleanup after sending
        try {
          fs.unlinkSync(cachePath);
        } catch (cleanupError) {
          console.warn('Cleanup error:', cleanupError);
        }
      });

    } catch (error) {
      console.error('RemoveBG Error:', error);
      api.sendMessage('❌ | Failed to process image. Possible reasons:\n- API limit reached\n- Invalid image format\n- Server issues\n\nTry again later or use a different image', event.threadID, event.messageID);
    }
  }
};
