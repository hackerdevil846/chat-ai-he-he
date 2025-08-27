const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "islam",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑", // Applied Metalix Italic Bold font
    role: 0, // Assuming 0 for general users
    category: "Islamic",
    shortDescription: {
      en: "Get random Islamic inspirational videos"
    },
    longDescription: {
      en: "Sends a random Islamic inspirational video with a greeting and a message of blessing."
    },
    guide: {
      en: "{p}islam"
    },
    priority: 0 // Default priority
  },

  onStart: async function ({ message, api, event }) {
    try {
      const islamicDesign = `🕌┏━━━━━━━━━━━━━━━━━━┓🕌
📖  ইসলামিক কন্টেন্ট মডিউল প্রস্তুত!
📖  'islam' টাইপ করুন ইসলামিক
📖  অনুপ্রেরণামূলক ভিডিও পেতে
🕌┗━━━━━━━━━━━━━━━━━━┛🕌`;
      await message.reply(islamDesign);
    } catch (error) {
      console.error("Error in onStart of islam command:", error);
      // It's good practice to notify the user if onStart fails, though less critical here.
    }
  },

  run: async function ({ message, api, event, global }) { // Changed onStart to run for the main command logic
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
      const processingMsg = await message.reply(processingDesign); // Using message.reply

      const greetings = [
        `🕌┏━━━━━━━━━━━━━━━━━━┓🕌\n\n📖  আসসালামু আলাইকুম! 🖤💫\n📖  প্রিয় ভাই ও বোন - তুমাদের জন্য নিয়ে আসলাম\n📖  পবিত্র কুরআনের তেলাওয়াত\n\n🕌┗━━━━━━━━━━━━━━━━━━┛🕌`,
        `🕌┏━━━━━━━━━━━━━━━━━━┓🕌\n\n📖  السلام عليكم ورحمة الله وبركاته\n📖  আল্লাহর রহমতে আপনার জন্য নির্বাচিত\n📖  ইসলামিক বাণী\n\n🕌┗━━━━━━━━━━━━━━━━━━┛🕌`,
        `🕌┏━━━━━━━━━━━━━━━━━━┓🕌\n\n📖  আসসালামু আলাইকুম ভাই ও বোনেরা!\n📖  আপনার রুহানী খোরাকের জন্য\n📖  এই ভিডিওটি উপহার\n\n🕌┗━━━━━━━━━━━━━━━━━━┛🕌`
      ];
      
      // Updated video links - KEPT EXACTLY AS PROVIDED
      const islamicVideos = [
        "https://drive.usercontent.google.com/download?id=1Y5O3qRzxt-MFR4vVhz0QsMwHQmr-34iH&export=download",
        "https://drive.usercontent.google.com/download?id=1YDyNrN-rnzsboFmYm8Q5-FhzoJD9WV3O&export=download",
        "https://drive.usercontent.google.com/download?id=1XzgEzopoYBfuDzPsml5-RiRnItXVx4zW&export=download",
        "https://drive.usercontent.google.com/download?id=1YEeal83MYRI9sjHuEhJdjXZo9nVZmfHD&export=download",
        "https://drive.usercontent.google.com/download?id=1YMEDEKVXjnHE0KcCJHbcT2PSbu8uGSk4&export=download",
        "https://drive.usercontent.google.com/download?id=1YRb2k01n4rIdA9Vf69oxIOdv54JyAprG&export=download",
        "https://drive.usercontent.google.com/download?id=1YSQCTVhrHTNl6B9xSBCQ7frBJ3bp_KoA&export=download",
        "https://drive.usercontent.google.com/download?id=1Yc9Rwwdpqha1AWeEb5BXV-goFbag0441&export=download",
        "https://drive.usercontent.google.com/download?id=1YcwtkC5wRbbHsAFuEQYQuwQsH4-ZiBS8&export=download",
        "https://drive.usercontent.google.com/download?id=1YhfyPl8oGmsIAIOjWQyzQYkDdZUPSalo&export=download"
      ];

      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      const randomVideo = islamicVideos[Math.floor(Math.random() * islamicVideos.length)];
      
      // Kept exact path construction for videoPath
      const videoPath = path.join(cacheDir, `islamic_${Date.now()}.mp4`);
      
      await message.reply("🔄 ভিডিও ডাউনলোড করা হচ্ছে...");
      
      // Using global.utils.getStreamFromURL for robust downloading
      const videoStream = await global.utils.getStreamFromURL(randomVideo);

      // Now save the stream to the file
      await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(videoPath);
        videoStream.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const finalDesign = `✅┏━━━━━━━━━━━━━━━━━━┓✅\n\n📖  পবিত্র ইসলামিক ভিডিও\n📖  সফলভাবে প্রেরণ করা হলো!\n📖  আল্লাহ আপনার ঈমান বৃদ্ধি করুন\n\n✅┗━━━━━━━━━━━━━━━━━━┛✅`;
      
      await message.reply({
        body: `${randomGreeting}\n\n${finalDesign}`,
        attachment: fs.createReadStream(videoPath)
      });

      // Cleanup
      fs.unlinkSync(videoPath);
      // Use api.unsendMessage with the messageID from message.reply
      if (processingMsg && processingMsg.messageID) {
        await api.unsendMessage(processingMsg.messageID);
      }

    } catch (error) {
      const errorDesign = `❌┏━━━━━━━━━━━━━━━━━━┓❌\n\n⚠️  এই মুহূর্তে ইসলামিক ভিডিও পাওয়া যায়নি\n⚠️  দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন\n⚠️  আল্লাহ আপনাকে উত্তম প্রতিদান দান করুন\n\n❌┗━━━━━━━━━━━━━━━━━━┛❌`;
      
      console.error("Islamic Video Error:", error);
      await message.reply(errorDesign);
    }
  }
};
