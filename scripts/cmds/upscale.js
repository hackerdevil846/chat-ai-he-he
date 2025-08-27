const axios = require("axios");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "upscale", // 🔄 নতুন নাম
    aliases: ["enhance", "hdphoto"],
    version: "1.1",
    role: 0,
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // 🔄 নতুন credits
    category: "image",
    cooldowns: 10,
    shortDescription: {
      en: "Enhance image quality (unblur + upscale)"
    },
    longDescription: {
      en: "Uses Cutout Pro API to enhance photo quality and resolution"
    },
    guide: {
      en: "Reply to an image or provide URL\nExample: +upscale [image_url] [output format]\nFormats: png, jpg_90, jpg_80"
    }
  },

  onStart: async ({ api, event, args }) => {
    try {
      let imageUrl;
      const outputFormat = args[1] || "png";

      if (event.messageReply?.attachments?.[0]?.type === "photo") {
        imageUrl = event.messageReply.attachments[0].url;
      } else if (args[0]?.match(/^https?:\/\/.+\.(jpe?g|png|gif|bmp)$/i)) {
        imageUrl = args[0];
      } else {
        return api.sendMessage("🔍 Please reply to an image or provide a valid image URL", event.threadID, event.messageID);
      }

      const imageBuffer = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;

      const form = new FormData();
      form.append("file", imageBuffer, { filename: "input.jpg", contentType: "image/jpeg" });

      const apiUrl = `https://www.cutout.pro/api/v1/photoEnhance?outputFormat=${outputFormat}`;
      const response = await axios.post(apiUrl, form, {
        headers: {
          "APIKEY": "db95b47632c54582b5bb24271de428bc",
          ...form.getHeaders()
        },
        responseType: "stream"
      });

      await api.sendMessage({
        body: `🖼️ Enhanced HD Image (Format: ${outputFormat})`,
        attachment: response.data
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error("CutoutPro Error:", error.response?.data || error.message);

      let errorMsg = "❌ Error enhancing image";
      if (error.response?.status === 429) {
        errorMsg = "⚠️ API limit reached (try again later)";
      } else if (error.message.includes("timeout")) {
        errorMsg = "⌛ Processing took too long (try smaller image)";
      }
      api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  }
};
