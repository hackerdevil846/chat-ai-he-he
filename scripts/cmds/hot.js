const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// Video library configuration
const videoLibrary = {
  cacheDir: path.join(__dirname, 'cache', 'hotvideos'),
  maxCacheSize: 10,
  videoLinks: [
    "https://drive.google.com/uc?export=download&id=15Jr-J_idxDeC93oSrz0GsFkWLeutwVu-",
    "https://drive.google.com/uc?export=download&id=15NxnRbMAcxDu5Yn5MM4PmFgftWww55mr",
    "https://drive.google.com/uc?export=download&id=15Fil5wzen-4f34mwSHCzCh6pZKJF7i--",
    "https://drive.google.com/uc?export=download&id=158txfPsgwK1a4Ds0tZrczNJNPpNjACpU",
    "https://drive.google.com/uc?export=download&id=15Lx0NCAozdaV0QR3OQLGoGOB2TKLf_jg",
    "https://drive.google.com/uc?export=download&id=158UG3kV3JEQPbb4zG5KDVJ59G-gIokbm",
    "https://drive.google.com/uc?export=download&id=15ExhciaMohg4UsCsJBr0FdNZXy3OAtkZ",
    "https://drive.google.com/uc?export=download&id=15QBo9GKUvUqWfH5jTcai35FFiS3Duge_"
  ],
  fileExtensions: ['.mp4']
};

module.exports.config = {
  name: "hot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Get a random hot video",
  commandCategory: "media",
  usages: "hot",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.onLoad = async function() {
  try {
    await fs.ensureDir(videoLibrary.cacheDir);
    const files = await fs.readdir(videoLibrary.cacheDir);
    if (files.length > 0) {
      await this.cleanupCache();
    }
    console.log("✨ Hot video cache initialized successfully");
  } catch (error) {
    console.error("❌ Hot command initialization error:", error);
  }
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  try {
    await api.sendMessage("⏳ Fetching a hot video for you...", threadID, messageID);

    const availableVideos = await this.getAvailableVideos();
    let videoPath;

    if (availableVideos.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableVideos.length);
      videoPath = path.join(videoLibrary.cacheDir, availableVideos[randomIndex]);
    } else {
      videoPath = await this.downloadNewVideo();
    }

    return api.sendMessage({
      body: "🔥 Here's a hot video for you!",
      attachment: fs.createReadStream(videoPath)
    }, threadID, messageID);

  } catch (error) {
    console.error("❌ Hot command error:", error);
    return api.sendMessage("❌ Failed to get a hot video. Please try again later.", threadID, messageID);
  }
};

module.exports.getAvailableVideos = async function() {
  try {
    const files = await fs.readdir(videoLibrary.cacheDir);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return videoLibrary.fileExtensions.includes(ext);
    });
  } catch (error) {
    console.error("❌ Error reading video cache:", error);
    return [];
  }
};

module.exports.downloadNewVideo = async function() {
  const randomLink = videoLibrary.videoLinks[
    Math.floor(Math.random() * videoLibrary.videoLinks.length)
  ];

  const fileName = `hot_${Date.now()}.mp4`;
  const filePath = path.join(videoLibrary.cacheDir, fileName);

  try {
    const response = await axios({
      method: 'GET',
      url: randomLink,
      responseType: 'stream',
      timeout: 60000
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    await this.cleanupCache();

    return filePath;
  } catch (error) {
    console.error("❌ Video download failed:", error);

    if (await fs.pathExists(filePath)) {
      try {
        await fs.unlink(filePath);
      } catch (cleanupErr) {
        console.error("❌ Cleanup error:", cleanupErr);
      }
    }

    throw new Error("Failed to download video");
  }
};

module.exports.cleanupCache = async function() {
  try {
    const files = await this.getAvailableVideos();
    if (files.length <= videoLibrary.maxCacheSize) return;

    const fileStats = await Promise.all(
      files.map(file => fs.stat(path.join(videoLibrary.cacheDir, file)))
    );

    const sortedFiles = files
      .map((file, i) => ({ file, mtime: fileStats[i].mtimeMs }))
      .sort((a, b) => a.mtime - b.mtime);

    const deleteCount = sortedFiles.length - videoLibrary.maxCacheSize;
    const filesToDelete = sortedFiles.slice(0, deleteCount);

    await Promise.all(
      filesToDelete.map(item => fs.unlink(path.join(videoLibrary.cacheDir, item.file)))
    );

    console.log(`🗑️ Cleaned up ${deleteCount} old video(s) from cache`);
  } catch (error) {
    console.error("❌ Cache cleanup error:", error);
  }
};
