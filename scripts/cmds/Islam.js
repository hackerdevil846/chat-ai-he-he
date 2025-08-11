const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "islam",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Get random Islamic inspirational videos",
    category: "Islamic", // Fixed property name from commandCategory to category
    usages: "islam",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event }) {
    const islamicDesign = `🕌┏━━━━━━━━━━━━━━━━━━┓🕌
📖  ইসলামিক কন্টেন্ট মডিউল প্রস্তুত!
📖  'islam' টাইপ করুন ইসলামিক
📖  অনুপ্রেরণামূলক ভিডিও পেতে
🕌┗━━━━━━━━━━━━━━━━━━┛🕌`;
    api.sendMessage(islamicDesign, event.threadID);
  },

  run: async function ({ api, event }) {
    try {
      const cacheDir = path.join(__dirname, 'cache', 'islamic_videos');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const processingDesign = `📥┏━━━━━━━━━━━━━━━━━━┓📥
🕋  আপনার জন্য একটি ইসলামিক ভিডিও
🕋  সংগ্রহ করা হচ্ছে...
🕋  অনুগ্রহ করে অপেক্ষা করুন
📥┗━━━━━━━━━━━━━━━━━━┛📥`;
      const processingMsg = await api.sendMessage(processingDesign, event.threadID);

      const greetings = [
        `🕌┏━━━━━━━━━━━━━━━━━━┓🕌\n\n📖  আসসালামু আলাইকুম! 🖤💫\n📖  প্রিয় ভাই ও বোন - তুমাদের জন্য নিয়ে আসলাম\n📖  পবিত্র কুরআনের তেলাওয়াত\n\n🕌┗━━━━━━━━━━━━━━━━━━┛🕌`,
        `🕌┏━━━━━━━━━━━━━━━━━━┓🕌\n\n📖  السلام عليكم ورحمة الله وبركاته\n📖  আল্লাহর রহমতে আপনার জন্য নির্বাচিত\n📖  ইসলামিক বাণী\n\n🕌┗━━━━━━━━━━━━━━━━━━┛🕌`,
        `🕌┏━━━━━━━━━━━━━━━━━━┓🕌\n\n📖  আসসালামু আলাইকুম ভাই ও বোনেরা!\n📖  আপনার রুহানী খোরাকের জন্য\n📖  এই ভিডিওটি উপহার\n\n🕌┗━━━━━━━━━━━━━━━━━━┛🕌`
      ];
      
      // Updated video links
      const islamicVideos = [
        "https://drive.usercontent.google.com/download?id=1Y5O3qRzxt-MFR4vVhz0QsMwHQmr-34iH&export=download",
        "https://drive.usercontent.google.com/download?id=1YDyNrN-rnzsboFmYm8Q5-FhzoJD9WV3O&export=download",
        "https://drive.usercontent.google.com/download?id=1XzgEzopoYBfuDzPsml5-RiRnItXVx4zW&export=download",
        "https://drive.usercontent.google.com/download?id=1YEeal83MYRI9sjHuEhJdjXZo9nVZmfHD&export=download",
        "https://drive.usercontent.google.com/download?id=1YMEDEKVXjnHE0KcCJHbcT2PSbu8uGSk4&export=download",
        "https://drive.usercontent.google.com/download?id=1YRb2k01n4rIdA9Vf69oxIOdv54JyAprD&export=download",
        "https://drive.usercontent.google.com/download?id=1YSQCTVhrHTNl6B9xSBCQ7frBJ3bp_KoA&export=download",
        "https://drive.usercontent.google.com/download?id=1Yc9Rwwdpqha1AWeEb5BXV-goFbag0441&export=download",
        "https://drive.usercontent.google.com/download?id=1YcwtkC5wRbbHsAFuEQYQuwQsH4-ZiBS8&export=download",
        "https://drive.usercontent.google.com/download?id=1YhfyPl8oGmsIAIOjWQyzQYkDdZUPSalo&export=download"
      ];

      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      const randomVideo = islamicVideos[Math.floor(Math.random() * islamicVideos.length)];
      
      const videoPath = path.join(cacheDir, `islamic_${Date.now()}.mp4`);
      
      // Download video with progress
      api.sendMessage("🔄 ভিডিও ডাউনলোড করা হচ্ছে...", event.threadID);
      
      const response = await axios({
        method: 'get',
        url: randomVideo,
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const writer = fs.createWriteStream(videoPath);
      response.data.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const finalDesign = `✅┏━━━━━━━━━━━━━━━━━━┓✅\n\n📖  পবিত্র ইসলামিক ভিডিও\n📖  সফলভাবে প্রেরণ করা হলো!\n📖  আল্লাহ আপনার ঈমান বৃদ্ধি করুন\n\n✅┗━━━━━━━━━━━━━━━━━━┛✅`;
      
      await api.sendMessage({
        body: `${randomGreeting}\n\n${finalDesign}`,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID);

      // Cleanup
      fs.unlinkSync(videoPath);
      api.unsendMessage(processingMsg.messageID);

    } catch (error) {
      const errorDesign = `❌┏━━━━━━━━━━━━━━━━━━┓❌\n\n⚠️  এই মুহূর্তে ইসলামিক ভিডিও পাওয়া যায়নি\n⚠️  দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন\n⚠️  আল্লাহ আপনাকে উত্তম প্রতিদান দান করুন\n\n❌┗━━━━━━━━━━━━━━━━━━┛❌`;
      
      console.error("Islamic Video Error:", error);
      api.sendMessage(errorDesign, event.threadID);
    }
  }
};
