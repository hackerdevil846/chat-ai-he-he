import { createWriteStream } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { randomBytes } from "crypto";
import { execSync } from "child_process";
import { createRequire } from "module";

// Helper to require or auto-install a dependency
const require = createRequire(import.meta.url);

async function ensureModule(modName) {
  try {
    console.log(`Checking for ${modName}...`);
    return require(modName);
  } catch (err) {
    try {
      console.log(`Installing missing dependency: ${modName}`);
      execSync(`npm install ${modName} --no-audit --no-fund --save`, { 
        stdio: "pipe",
        timeout: 120000 // 2 minute timeout for installation
      });
      console.log(`Successfully installed ${modName}`);
      return require(modName);
    } catch (installErr) {
      console.error(`Auto-install failed for ${modName}:`, installErr.message);
      throw new Error(`Dependency installation failed: ${modName}. Please install manually.`);
    }
  }
}

// Ensure and load dependencies with proper error handling
let fsExtra, axios, getInstagram;

try {
  console.log("Loading dependencies...");
  
  // Load fs-extra
  const fsExtraMod = await ensureModule("fs-extra");
  fsExtra = fsExtraMod.default || fsExtraMod;
  
  // Load axios
  const axiosMod = await ensureModule("axios");
  axios = axiosMod.default || axiosMod;
  
  // Load instagram-url-direct
  const igDirectMod = await ensureModule("instagram-url-direct");
  getInstagram = igDirectMod.getInstagram || igDirectMod;
  
  console.log("All dependencies loaded successfully");
} catch (error) {
  console.error("Critical error: Failed to load dependencies:", error.message);
  // We can't continue without dependencies
  process.exit(1);
}

export const config = {
  name: "igautodownload",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🟦 | Automatically download Instagram videos",
  commandCategory: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",
  usages: "[instagram-link]",
  cooldowns: 5,
  dependencies: {
    "instagram-url-direct": "",
    "axios": "",
    "fs-extra": ""
  }
};

export async function run({ api, event }) {
  return api.sendMessage(
    "✨ | This command doesn't need a prefix!\nJust send an Instagram video link in the chat 💙",
    event.threadID,
    event.messageID
  );
}

export async function handleEvent({ api, event }) {
  if (event.type !== "message" || !event.body) return;

  const instaRegex = /https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p|stories)\/([^\/\s?]+)/gi;
  const instaMatch = event.body.match(instaRegex);
  
  if (!instaMatch) return;

  for (const url of instaMatch) {
    let tempFilePath = null;
    try {
      await api.sendMessage("⬇️ | Downloading your video...", event.threadID);

      let results;
      try {
        console.log(`Processing Instagram URL: ${url}`);
        results = await getInstagram(url);
        
        if (!results || !results.results) {
          throw new Error("Invalid response from Instagram API");
        }
        
        console.log(`Found ${results.results.length} media items`);
      } catch (libError) {
        console.error("Instagram downloader library error:", libError.message);
        await api.sendMessage(
          "⚠️ | Failed to process this Instagram link. It might be private or unavailable.",
          event.threadID
        );
        continue;
      }

      if (results.results.length === 0) {
        await api.sendMessage(
          "❌ | No downloadable content found at this link!",
          event.threadID
        );
        continue;
      }

      // Get the highest quality video
      const videoResults = results.results.filter(r => r.type === 'video');
      const bestResult = videoResults.length > 0 ? videoResults[0] : results.results[0];
      
      if (!bestResult.url) {
        throw new Error("No download URL available");
      }

      const hdLink = bestResult.url;
      console.log("Downloading from:", hdLink);

      // Download the video with timeout and proper headers
      const response = await axios.get(hdLink, { 
        responseType: "stream", 
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': '*/*',
          'Accept-Encoding': 'identity',
          'Connection': 'keep-alive'
        }
      });

      // Create temporary file
      const randomName = randomBytes(16).toString("hex");
      tempFilePath = join(tmpdir(), `ig_video_${randomName}.mp4`);

      const writer = createWriteStream(tempFilePath);
      response.data.pipe(writer);

      // Wait for download to complete
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
        response.data.on("error", reject);
      });

      // Verify the downloaded file
      const stats = fsExtra.statSync(tempFilePath);
      if (stats.size === 0) {
        throw new Error("Downloaded file is empty");
      }

      console.log(`Download completed. File size: ${stats.size} bytes`);

      // Send the video
      await api.sendMessage(
        {
          body: "✅ | Successfully downloaded your video!\nCredits: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
          attachment: fsExtra.createReadStream(tempFilePath)
        },
        event.threadID
      );

    } catch (error) {
      console.error("Error processing Instagram video:", error.message);
      await api.sendMessage(
        "❌ | Download failed! Please try again later.",
        event.threadID
      );
    } finally {
      // Clean up temporary file
      if (tempFilePath) {
        try {
          if (fsExtra.existsSync(tempFilePath)) {
            fsExtra.unlinkSync(tempFilePath);
            console.log("Temporary file cleaned up");
          }
        } catch (cleanupError) {
          console.error("Cleanup failed:", cleanupError.message);
        }
      }
    }
  }
}
