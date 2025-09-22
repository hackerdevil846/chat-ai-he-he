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

module.exports = {
  config: {
    name: "hot",
    aliases: ["sexyvid", "spicy"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "🔥 𝐺𝑒𝑡 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 ℎ𝑜𝑡 𝑣𝑖𝑑𝑒𝑜"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 ℎ𝑜𝑡 𝑣𝑖𝑑𝑒𝑜 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑐𝑢𝑟𝑎𝑡𝑒𝑑 𝑙𝑖𝑏𝑟𝑎𝑟𝑦"
    },
    guide: {
      en: "{p}hot"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onLoad: async function() {
    try {
      await fs.ensureDir(videoLibrary.cacheDir);
      const files = await fs.readdir(videoLibrary.cacheDir);
      if (files.length > 0) {
        await this.cleanupCache();
      }
      console.log("✨ 𝐻𝑜𝑡 𝑣𝑖𝑑𝑒𝑜 𝑐𝑎𝑐ℎ𝑒 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
    } catch (error) {
      console.error("❌ 𝐻𝑜𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
    }
  },

  onStart: async function({ message, event }) {
    try {
      await message.reply("⏳ 𝐹𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑎 ℎ𝑜𝑡 𝑣𝑖𝑑𝑒𝑜 𝑓𝑜𝑟 𝑦𝑜𝑢...");

      const availableVideos = await this.getAvailableVideos();
      let videoPath;

      if (availableVideos.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableVideos.length);
        videoPath = path.join(videoLibrary.cacheDir, availableVideos[randomIndex]);
      } else {
        videoPath = await this.downloadNewVideo();
      }

      await message.reply({
        body: "🔥 𝐻𝑒𝑟𝑒'𝑠 𝑎 ℎ𝑜𝑡 𝑣𝑖𝑑𝑒𝑜 𝑓𝑜𝑟 𝑦𝑜𝑢!",
        attachment: fs.createReadStream(videoPath)
      });

    } catch (error) {
      console.error("❌ 𝐻𝑜𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑎 ℎ𝑜𝑡 𝑣𝑖𝑑𝑒𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  },

  getAvailableVideos: async function() {
    try {
      const files = await fs.readdir(videoLibrary.cacheDir);
      return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return videoLibrary.fileExtensions.includes(ext);
      });
    } catch (error) {
      console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑟𝑒𝑎𝑑𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜 𝑐𝑎𝑐ℎ𝑒:", error);
      return [];
    }
  },

  downloadNewVideo: async function() {
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
      console.error("❌ 𝑉𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑:", error);

      if (await fs.pathExists(filePath)) {
        try {
          await fs.unlink(filePath);
        } catch (cleanupErr) {
          console.error("❌ 𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupErr);
        }
      }

      throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜");
    }
  },

  cleanupCache: async function() {
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

      console.log(`🗑️ 𝐶𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝 ${deleteCount} 𝑜𝑙𝑑 𝑣𝑖𝑑𝑒𝑜(𝑠) 𝑓𝑟𝑜𝑚 𝑐𝑎𝑐ℎ𝑒`);
    } catch (error) {
      console.error("❌ 𝐶𝑎𝑐ℎ𝑒 𝑐𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", error);
    }
  }
};
