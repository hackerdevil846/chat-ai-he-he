module.exports = {
  config: {
    name: "quote",
    version: "1.1.0",
    permission: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Get Islamic quotes with beautiful images",
    prefix: true,
    category: "islamic",
    usages: "",
    cooldowns: 5,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },
  
  run: async function({ api, event }) {
    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];
    const { createCanvas, loadImage } = global.nodemodule["canvas"];
    
    // Array of motivational/religious quotes
    const quotes = [
      "ღ••\n– কোনো নেতার পিছনে নয়.!!🤸‍♂️\n– মসজিদের ইমামের পিছনে দাড়াও জীবন বদলে যাবে ইনশাআল্লাহ.!!🖤🌻\n৫",
      "-!\n__আল্লাহর রহমত থেকে নিরাশ হওয়া যাবে না!” আল্লাহ অবশ্যই তোমাকে ক্ষমা করে দিবেন☺️🌻\nসুরা যুমাহ্ আয়াত ৫২..৫৩💙🌸\n-!",
      "- ইসলাম অহংকার করতে শেখায় না!🌸\n\n- ইসলাম শুকরিয়া আদায় করতে শেখায়!🤲🕋🥀",
      "- বেপর্দা নারী যদি নায়িকা হতে পারে\n _____🤗🥀 -তবে পর্দাশীল নারী গুলো সব ইসলামের শাহাজাদী __🌺🥰\n  __মাশাল্লাহ।।",
      "┏━━━━ ﷽ ━━━━┓\n 🖤﷽স্মার্ট নয় ইসলামিক ﷽🥰\n 🖤﷽ জীবন সঙ্গি খুঁজুন ﷽🥰\n┗━━━━ ﷽ ━━━━┛",
      "ღ࿐– যখন বান্দার জ্বর হয়,😇\n🖤তখন গুনাহ গুলো ঝড়ে পড়তে থাকে☺️\n– হযরত মুহাম্মদ(সাঃ)●───༊༆",
      "~🍂🦋\n              ━𝐇𝐚𝐩𝐩𝐢𝐧𝐞𝐬𝐬 𝐈𝐬 𝐄𝐧𝐣𝐨𝐲𝐢𝐧𝐠 𝐓𝐡𝐢𝐧𝐠𝐬 𝐈𝐧 𝐿𝑖𝑓𝑒..♡🌸\n                          ━𝐓𝐡𝐢𝐧𝐠𝐬 𝐈𝐧 𝐿𝑖𝑓𝑒..♡🌸\n           ━𝐀𝐥𝐡𝐚𝐦𝐝𝐮𝐥𝐢𝐥𝐥𝐚𝐡 𝐅𝐨𝐫 𝐄𝐯𝐞𝐫𝐲𝐭𝐡𝐢𝐧𝐠...💗🥰",
      "•___💜🌈___•\n°___:))-তুমি আসক্ত হও-||-🖤🌸✨\n°___:))-তবে নেশায় নয় আল্লাহর ইবাদতে-||-🖤🌸✨\n•___🍒🖇️✨___•",
      "─❝হাসতে❜❜ হাসতে❜❜ একদিন❜❜😊😊\n ━❥❝সবাইকে❜❜ ─❝কাদিয়ে ❜❜বিদায়❜❜ নিবো❜❞.!!🙂💔🥀 ",
      "🦋🥀࿐\nლ_༎হাজারো༎স্বপ্নের༎শেষ༎স্থান༎••༊🙂🤲🥀\n♡_༎কবরস্থান༎_♡❤\n🦋🥀࿐",
      "•\n\nপ্রসঙ্গ যখন ধর্ম নিয়ে•🥰😊\nতখন আমাদের ইসলামই সেরা•❤️\n𝐀𝐥𝐡𝐚𝐦𝐝𝐮𝐥i𝐥𝐥𝐚🌸❤️",
      "🥀😒কেউ পছন্দ না করলে,,,,\n        কি যায় আসে,,🙂\n                😇আল্লাহ তো,,\n        পছন্দ করেই বানিয়েছে,,♥️🥀\n         🥰  Alhamdulillah 🕋",
      "🌼 এত অহংকার করে লাভ নেই! 🌺 \n  মৃত্যুটা নিশ্চিত,, শুধু সময়টা\n   অ'নিশ্চিত।🖤🙂 ",
      "_🌻••ছিঁড়ে ফেলুন অতীতের\nসকল পাপের\n                 অধ্যায় ।\n_ফিরে আসুন রবের ভালোবাসায়••🖤🥀",
      "_বুকে হাজারো কষ্ট নিয়ে\n                  আলহামদুলিল্লাহ বলাটা••!☺️\n_আল্লাহর প্রতি অগাধ বিশ্বাসের নমুনা❤️🥀",
      "_আল্লাহর ভালোবাসা পেতে চাও•••!🤗\n\n_তবে রাসুল (সা:)কে অনুসরণ করো••!🥰   "
    ];

    // Array of image URLs
    const images = [
      "https://i.postimg.cc/7LdGnyjQ/images-31.jpg",
      "https://i.postimg.cc/65c81ZDZ/images-30.jpg",
      "https://i.postimg.cc/Y0wvTzr6/images-29.jpg",
      "https://i.postimg.cc/1Rpnw2BJ/images-28.jpg",
      "https://i.postimg.cc/mgrPxDs5/images-27.jpg",
      "https://i.postimg.cc/yxXDK3xw/images-26.jpg",
      "https://i.postimg.cc/kXqVcsh9/muslim-boy-having-worship-praying-fasting-eid-islamic-culture-mosque-73899-1334.webp",
      "https://i.postimg.cc/hGzhj5h8/muslims-reading-from-quran-53876-20958.webp",
      "https://i.postimg.cc/x1Fc92jT/blue-mosque-istanbul-1157-8841.webp",
      "https://i.postimg.cc/j5y56nHL/muhammad-ali-pasha-cairo-219717-5352.webp",
      "https://i.postimg.cc/dVWyHfhr/images-1-21.jpg",
      "https://i.postimg.cc/q7MGgn3X/images-1-22.jpg",
      "https://i.postimg.cc/sX5CXtSh/images-1-16.jpg",
      "https://i.postimg.cc/66Rp2Pwz/images-1-17.jpg",
      "https://i.postimg.cc/Qtzh9pY2/images-1-18.jpg",
      "https://i.postimg.cc/MGrhdz0R/images-1-19.jpg",
      "https://i.postimg.cc/LsMSj9Ts/images-1-20.jpg",
      "https://i.postimg.cc/KzNXyttX/images-1-13.jpg"
    ];

    try {
      // Select random elements
      const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
      const selectedImage = images[Math.floor(Math.random() * images.length)];
      
      // Download image
      const { data } = await axios.get(selectedImage, { responseType: 'arraybuffer' });
      const background = await loadImage(Buffer.from(data));
      
      // Create canvas
      const canvas = createCanvas(background.width, background.height);
      const ctx = canvas.getContext('2d');
      
      // Draw background
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      
      // Add overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Text styling
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      
      // Font settings
      const fontSize = Math.min(canvas.width * 0.04, 36);
      ctx.font = `bold ${fontSize}px Arial`;
      
      // Split text into lines
      const maxWidth = canvas.width * 0.8;
      const lineHeight = fontSize * 1.5;
      const lines = [];
      let line = '';
      
      for (const word of selectedQuote.split(' ')) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          lines.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      
      // Calculate text position
      const textHeight = lines.length * lineHeight;
      const startY = (canvas.height - textHeight) / 2;
      
      // Draw text lines
      lines.forEach((line, i) => {
        const y = startY + (i * lineHeight);
        ctx.fillText(line.trim(), canvas.width / 2, y);
      });
      
      // Add decorative elements
      ctx.strokeStyle = '#F1C40F';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.1, startY - 20);
      ctx.lineTo(canvas.width * 0.9, startY - 20);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.1, startY + textHeight + 20);
      ctx.lineTo(canvas.width * 0.9, startY + textHeight + 20);
      ctx.stroke();
      
      // Add Islamic decorations
      ctx.font = `bold ${fontSize * 2}px Arial`;
      ctx.fillText('﷽', canvas.width / 2, startY - 60);
      
      // Save image
      const path = __dirname + '/cache/quote.png';
      const buffer = canvas.toBuffer();
      fs.writeFileSync(path, buffer);
      
      // Send message
      api.sendMessage({
        body: `✨🕋 ইসলমিক উক্তি 🕋✨\n━━━━━━━━━━━━━━━━━━\n\n"${selectedQuote}"\n\n━━━━━━━━━━━━━━━━━━\n🌙 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path));
      
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ উক্তি তৈরি করতে সমস্যা হয়েছে, আবার চেষ্টা করুন!", event.threadID);
    }
  }
};
