const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage, registerFont } = require("canvas");
const jimp = require("jimp");

// Resource URLs
const BACKGROUND_URL = "https://i.ibb.co/QvG4LTw/image.png";
const ADMIN_FRAME_URL = "https://i.ibb.co/H41cdDM/1624768781720.png";
const FONT_URL = "https://drive.google.com/uc?id=1q0FPVuJ-Lq7-tvOYH0ILgbjrX1boW7KW&export=download";

// Track processing threads
const processingThreads = new Map();

module.exports = {
  config: {
    name: "family",
    version: "1.4.0",
    hasPermission: 1,
    credits: "Asif",
    description: "Create beautiful group photo collages",
    category: "image",
    usages: "family <size> [color] [title]",
    cooldowns: 30,
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "canvas": "",
      "jimp": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const startTime = Date.now();
    
    // Check if this thread is already processing
    if (processingThreads.has(threadID)) {
      return api.sendMessage(
        "🔄 This group is already creating a family photo. Please wait...", 
        threadID, 
        messageID
      );
    }
    
    // Mark thread as processing
    processingThreads.set(threadID, true);

    try {
      // Create cache directory
      const cacheDir = path.join(__dirname, "cache", "family");
      await fs.ensureDir(cacheDir);

      // Font path
      const fontPath = path.join(cacheDir, "VNCORSI.ttf");
      
      // Download font if missing
      if (!fs.existsSync(fontPath)) {
        try {
          const fontData = await axios.get(FONT_URL, { 
            responseType: "arraybuffer",
            timeout: 30000
          });
          await fs.writeFile(fontPath, Buffer.from(fontData.data));
        } catch (error) {
          console.error("Font download error:", error);
          return api.sendMessage(
            "❌ Failed to download required font. Please try again later.", 
            threadID, 
            messageID
          );
        }
      }

      // Show help if requested
      if (args[0] === "help" || !args[0]) {
        const helpMessage = `
📸 Family Photo Generator Help
━━━━━━━━━━━━━━
Create beautiful group photo collages with all members

Usage: family <size> [color] [title]

• size: Avatar size in pixels (0 for auto-size)
• color: Hex color for title (e.g., #FF0000)
• title: Custom title (default: group name)

Examples:
• family 200
• family 150 #ff0000 My Group
• family 0 (auto-size)

⚠️ Notes:
- Maximum size: 500px
- Auto-size adjusts based on member count
- Processing may take 30-60 seconds for large groups
        `;
        return api.sendMessage(helpMessage, threadID, messageID);
      }

      // Parse arguments
      const size = parseInt(args[0]);
      if (isNaN(size)) {
        return api.sendMessage(
          "❌ Please enter a valid size number (e.g., 200)", 
          threadID, 
          messageID
        );
      }

      // Validate size
      if (size > 500) {
        return api.sendMessage(
          "❌ Maximum size is 500 pixels", 
          threadID, 
          messageID
        );
      }
      
      if (size < 0) {
        return api.sendMessage(
          "❌ Size must be a positive number", 
          threadID, 
          messageID
        );
      }

      // Parse color and title
      const color = args[1] && args[1].startsWith("#") ? args[1] : "#FFFFFF";
      const title = args.slice(color.startsWith("#") ? 2 : 1).join(" ") || "";

      // Get group information
      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.threadName;
      const memberIds = threadInfo.participantIDs;
      const adminIds = threadInfo.adminIDs.map(admin => admin.id);
      
      // Final title
      const finalTitle = title || groupName;

      // Send processing message
      const processingMsg = await api.sendMessage(
        `🔄 Creating family photo for ${groupName}\n━━━━━━━━━━━━━━\n📏 Size: ${size}px\n🎨 Color: ${color}\n👥 Members: ${memberIds.length}\n⏳ Please wait 30-60 seconds...`,
        threadID
      );

      // Create the family photo
      const result = await this.createFamilyPhoto({
        size,
        color,
        title: finalTitle,
        memberIds,
        adminIds,
        cacheDir
      });

      // Calculate processing time
      const processingTime = Math.floor((Date.now() - startTime) / 1000);

      // Send result
      await api.unsendMessage(processingMsg.messageID);
      api.sendMessage({
        body: `✅ Family Photo Created!\n━━━━━━━━━━━━━━\n👥 Members: ${result.memberCount}\n🎨 Color: ${color}\n⏱️ Time: ${processingTime}s\n🖼️ Dimensions: ${result.width}x${result.height}`,
        attachment: fs.createReadStream(result.outputPath)
      }, threadID, () => {
        // Clean up file
        fs.unlink(result.outputPath, (err) => {
          if (err) console.error("Cleanup error:", err);
        });
      }, messageID);
    } catch (error) {
      console.error("Family photo creation error:", error);
      api.sendMessage(
        "❌ Failed to create family photo. Please try again later.", 
        threadID, 
        messageID
      );
    } finally {
      // Remove processing flag
      processingThreads.delete(threadID);
    }
  },

  createFamilyPhoto: async function ({ size, color, title, memberIds, adminIds, cacheDir }) {
    // Constants
    const TOP_SPACE = 200;
    const PADDING = 10;
    
    // Load background image
    const background = await loadImage(BACKGROUND_URL);
    const bgWidth = background.width;
    const bgHeight = background.height;
    
    // Calculate auto size if requested
    let avatarSize = size;
    
    if (size === 0) {
      // Auto-size calculation based on member count
      if (memberIds.length <= 20) {
        avatarSize = 150;
      } else if (memberIds.length <= 50) {
        avatarSize = 120;
      } else if (memberIds.length <= 100) {
        avatarSize = 90;
      } else {
        avatarSize = 70;
      }
    }
    
    // Calculate padding between avatars
    const padding = Math.max(5, Math.floor(avatarSize / 20));
    
    // Create canvas
    const canvas = createCanvas(bgWidth, bgHeight);
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
    // Load admin frame
    const adminFrame = await loadImage(ADMIN_FRAME_URL);
    
    // Calculate layout
    const avatarsPerRow = Math.floor((bgWidth - padding) / (avatarSize + padding));
    const maxRows = Math.floor((bgHeight - TOP_SPACE - padding) / (avatarSize + padding));
    
    // Position tracking
    let row = 0;
    let col = 0;
    let drawnMembers = 0;
    
    // Draw avatars
    for (const memberId of memberIds) {
      if (row >= maxRows) break;
      
      try {
        // Get avatar
        const avatarResponse = await axios.get(
          `https://graph.facebook.com/${memberId}/picture?width=512&height=512`,
          { responseType: "arraybuffer" }
        );
        
        // Load avatar
        const avatar = await loadImage(Buffer.from(avatarResponse.data));
        
        // Calculate position
        const x = padding + col * (avatarSize + padding);
        const y = TOP_SPACE + row * (avatarSize + padding);
        
        // Draw avatar
        ctx.drawImage(avatar, x, y, avatarSize, avatarSize);
        
        // Add admin frame if member is admin
        if (adminIds.includes(memberId)) {
          ctx.drawImage(adminFrame, x, y, avatarSize, avatarSize);
        }
        
        // Update position
        col++;
        if (col >= avatarsPerRow) {
          col = 0;
          row++;
        }
        
        drawnMembers++;
      } catch (error) {
        console.error(`Skipping member ${memberId}:`, error.message);
      }
    }
    
    // Register font
    registerFont(path.join(cacheDir, "VNCORSI.ttf"), {
      family: "FamilyFont"
    });
    
    // Draw title
    ctx.font = "bold 100px 'FamilyFont'";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    
    // Scale title to fit if needed
    let fontSize = 100;
    const maxWidth = bgWidth - 100;
    
    while (ctx.measureText(title).width > maxWidth && fontSize > 30) {
      fontSize -= 5;
      ctx.font = `bold ${fontSize}px 'FamilyFont'`;
    }
    
    ctx.fillText(title, bgWidth / 2, 50);
    
    // Save to buffer
    const imageBuffer = canvas.toBuffer("image/png");
    
    // Crop image to content
    const outputPath = path.join(cacheDir, `family_${Date.now()}.png`);
    const jimpImage = await jimp.read(imageBuffer);
    
    // Calculate content height
    const contentHeight = TOP_SPACE + (row + 1) * (avatarSize + padding);
    jimpImage.crop(0, 0, bgWidth, Math.min(contentHeight, bgHeight));
    
    // Save image
    await jimpImage.writeAsync(outputPath);
    
    return {
      outputPath,
      memberCount: drawnMembers,
      width: bgWidth,
      height: Math.min(contentHeight, bgHeight)
    };
  }
};
