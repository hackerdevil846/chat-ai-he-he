const https = require("https");
const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "fluxpro",
  version: "2.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🎨 Generate high-quality images using Flux.1 Pro AI",
  category: "IMAGE GENERATOR",
  usages: "[prompt] --style [style_id] --size [dimensions]",
  cooldowns: 20,
  dependencies: {
    axios: "",
    "fs-extra": ""
  }
};

module.exports.languages = {
  "en": {
    missingPrompt: "🔍 Please provide a prompt for image generation\n💡 Example: .fluxpro futuristic cityscape --style 7 --size 1024x768",
    generating: (prompt) => `🖌️ Generating your image for:\n✨ "${prompt}" ...\n\n⏳ Please wait...`,
    success: (prompt, styleId, size, time) =>
      `✅ Flux.1 Pro Image Generated Successfully!\n\n` +
      `🎨 Prompt: ${prompt}\n` +
      `🎭 Style: ${styleId}\n` +
      `📐 Size: ${size}\n` +
      `⏱️ Time Taken: ${time}s\n\n✨ Enjoy your masterpiece!`,
    failed: "❌ Image generation failed."
  }
};

module.exports.onStart = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const tempPath = __dirname + `/cache/fluxpro_${Date.now()}_${senderID}.jpg`;

  if (!args.length)
    return api.sendMessage(
      module.exports.languages.en.missingPrompt,
      threadID,
      messageID
    );

  let fullInput = args.join(" ");

  let styleId = 4;
  let size = "1024x1024";

  function extractFlag(input, flag) {
    const regex = new RegExp(`--${flag}\\s+(\\S+)`);
    const match = input.match(regex);
    if (match) {
      input = input.replace(match[0], "").trim();
      return { input, value: match[1] };
    }
    return { input, value: null };
  }

  let res = extractFlag(fullInput, "style");
  fullInput = res.input;
  if (res.value && !isNaN(res.value)) styleId = parseInt(res.value);

  res = extractFlag(fullInput, "size");
  fullInput = res.input;
  if (res.value) size = res.value;

  const prompt = fullInput;

  const sizeMap = {
    "1024x1024": "1-1",
    "1024x768": "4-3",
    "768x1024": "3-4",
    "1920x1080": "16-9",
    "1080x1920": "9-16"
  };
  const apiSize = sizeMap[size] || "1-1";

  try {
    const processingMsg = await api.sendMessage(
      module.exports.languages.en.generating(prompt),
      threadID,
      messageID
    );

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const postData = JSON.stringify({
      prompt: prompt,
      style_id: styleId,
      size: apiSize
    });

    const options = {
      method: "POST",
      hostname: "ai-text-to-image-generator-flux-free-api.p.rapidapi.com",
      path: "/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php",
      headers: {
        "x-rapidapi-key": "78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb",
        "x-rapidapi-host": "ai-text-to-image-generator-flux-free-api.p.rapidapi.com",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData)
      },
      timeout: 60000
    };

    const startTime = Date.now();

    const imageUrl = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.image_url) resolve(json.image_url);
            else reject(new Error("API did not return an image URL"));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on("error", (err) => reject(err));
      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timed out"));
      });

      req.write(postData);
      req.end();
    });

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 60000
    });

    await fs.outputFile(tempPath, imageResponse.data);

    const generationTime = ((Date.now() - startTime) / 1000).toFixed(1);

    await api.sendMessage(
      {
        body: module.exports.languages.en.success(prompt, styleId, size, generationTime),
        attachment: fs.createReadStream(tempPath)
      },
      threadID,
      messageID
    );

    api.unsendMessage(processingMsg.messageID);
    api.setMessageReaction("✅", messageID, () => {}, true);

    fs.unlinkSync(tempPath);
  } catch (err) {
    console.error("FluxPro Error:", err);

    let errorMessage = module.exports.languages.en.failed + " ";
    if (err.message.includes("timed out"))
      errorMessage += "⏱️ Request timed out. Try a simpler prompt.";
    else if (err.message.includes("image URL"))
      errorMessage += "⚠️ API didn't return a valid image.";
    else errorMessage += `Error: ${err.message || "Unknown error"}`;

    api.sendMessage(errorMessage, threadID, messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);

    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
};
