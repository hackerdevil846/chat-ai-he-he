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
    return require(modName);
  } catch (err) {
    try {
      execSync(`npm install ${modName} --no-audit --no-fund`, { stdio: "inherit" });
      return require(modName);
    } catch (installErr) {
      throw new Error(`Auto-install failed for ${modName}: ${installErr?.message || installErr}`);
    }
  }
}

// Ensure and load dependencies
let fsExtra, axios, getInstagram;
try {
  fsExtra = (await ensureModule("fs-extra")).default || (await ensureModule("fs-extra"));
  const axiosMod = await ensureModule("axios");
  axios = axiosMod.default || axiosMod;
  const igDirectMod = await ensureModule("instagram-url-direct");
  getInstagram = igDirectMod.getInstagram || igDirectMod;
} catch (error) {
  console.error("Dependency loading failed:", error);
  throw error;
}

export const config = {
  name: "igautodownload",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🟦 | Automatically download Instagram videos",
  category: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",
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
      api.sendMessage("⬇️ | Downloading your video...", event.threadID, event.messageID);

      let results;
      try {
        results = await getInstagram(url);
      } catch (libError) {
        console.error("Instagram downloader library error:", libError);
        await api.sendMessage(
          "⚠️ | Instagram downloader library error. Try again later.",
          event.threadID,
          event.messageID
        );
        continue;
      }

      if (!results || !results.results || results.results.length === 0) {
        await api.sendMessage(
          "❌ | No video found at this link!",
          event.threadID,
          event.messageID
        );
        continue;
      }

      // Get the highest quality video
      const videoResult = results.results.find(r => r.type === 'video') || results.results[0];
      const hdLink = videoResult.url;

      const response = await axios.get(hdLink, { responseType: "stream", timeout: 30000 });

      const randomName = randomBytes(16).toString("hex");
      tempFilePath = join(tmpdir(), `ig_video_${randomName}.mp4`);

      const writer = createWriteStream(tempFilePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await api.sendMessage(
        {
          body: "✅ | Successfully downloaded your video!\nCredits: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
          attachment: fsExtra.createReadStream(tempFilePath)
        },
        event.threadID
      );
    } catch (error) {
      console.error("Error:", error);
      await api.sendMessage(
        "❌ | Download failed! Please try again later.",
        event.threadID,
        event.messageID
      );
    } finally {
      if (tempFilePath) {
        try {
          if (fsExtra.existsSync(tempFilePath)) {
            fsExtra.unlinkSync(tempFilePath);
          }
        } catch (cleanupError) {
          console.error("Cleanup failed:", cleanupError);
        }
      }
    }
  }
}
