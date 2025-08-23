module.exports.config = {
  name: "mobilelegends",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑴𝒐𝒃𝒊𝒍𝒆 𝑳𝒆𝒈𝒆𝒏𝒅𝒔 𝒆𝒓 𝒎𝒆𝒎𝒆",
  category: "Entertainment",
  usages: "𝒎𝒐𝒃𝒊𝒍𝒆𝒍𝒆𝒈𝒆𝒏𝒅𝒔",
  cooldowns: 3,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":"",
    "canvas":"",
    "discord-image-generation":""
  }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
const Canvas = global.nodemodule["canvas"];
const DIG = global.nodemodule["discord-image-generation"];

  try {
    // Fetch trending memes from r/MobileLegendsGame subreddit
    const redditResponse = await axios.get("https://www.reddit.com/r/MobileLegendsGame/hot.json?limit=50");
    const posts = redditResponse.data.data.children;

    // Filter for image posts and extract image URLs
    const imageUrls = posts.filter(post => post.data.post_hint === 'image' && !post.data.is_video && !post.data.is_self)
                           .map(post => post.data.url);

    if (imageUrls.length === 0) {
      return api.sendMessage("Sorry, no trending Mobile Legends meme images found at the moment. Please try again later.", event.threadID);
    }

    const randomMemeUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    
    // Fetch the image
    const imageResponse = await axios.get(randomMemeUrl, { 
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const image = await Canvas.loadImage(imageResponse.data);

    // Create canvas with image dimensions
    const canvas = Canvas.createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw the original image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Add stylish text overlay
    const fontSize = Math.max(20, Math.min(60, canvas.width / 15));
    ctx.font = `bold ${fontSize}px Impact, Arial`;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    
    // Add shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Add text at the bottom
    const text = '🎮 MOBILE LEGENDS MEME! 🎮';
    const textY = canvas.height - (fontSize / 2);
    
    ctx.strokeText(text, canvas.width / 2, textY);
    ctx.fillText(text, canvas.width / 2, textY);

    // Convert to buffer
    const attachment = canvas.toBuffer();

    // Save to cache
    fs.writeFileSync(__dirname + "/cache/ken.jpg", attachment);

    // Send the enhanced meme
    api.sendMessage({
      body: `🤣 𝑬𝒊 𝒏𝒂𝒐 𝒕𝒐𝒎𝒂𝒓 𝑴𝒐𝒃𝒊𝒍𝒆 𝑳𝒆𝒈𝒆𝒏𝒅𝒔 𝒆𝒓 𝒎𝒆𝒎𝒆! 🤣\n\n✨ 𝑩𝒆𝒂𝒖𝒕𝒊𝒇𝒖𝒍𝒍𝒚 𝒆𝒏𝒉𝒂𝒏𝒄𝒆𝒅 𝒘𝒊𝒕𝒉 𝑪𝒂𝒏𝒗𝒂𝒔! ✨\n🔥 𝑪𝒓𝒆𝒅𝒊𝒕𝒔: ${module.exports.config.credits} 🔥`,
      attachment: fs.createReadStream(__dirname + "/cache/ken.jpg")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/ken.jpg"));

  } catch (error) {
    console.error("Error generating Mobile Legends meme:", error);
    
    // Fallback message with error handling
    api.sendMessage({
      body: `❌ 𝑺𝒐𝒓𝒓𝒚, 𝒂𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒇𝒆𝒕𝒄𝒉𝒊𝒏𝒈 𝑴𝒐𝒃𝒊𝒍𝒆 𝑳𝒆𝒈𝒆𝒏𝒅𝒔 𝒎𝒆𝒎𝒆.\n\n🔄 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓!\n\n🎮 𝑪𝒓𝒆𝒅𝒊𝒕𝒔: ${module.exports.config.credits}`
    }, event.threadID);
  }
};

