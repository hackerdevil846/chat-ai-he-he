const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "kiss",
    aliases: ["kiss"],
    version: "1.0",
    author: "Asif",
    countDown: 5,
    role: 0,
    shortDescription: "Generate a kiss image for fun",
    longDescription: "Create a kissing scene between two users' profile pictures.",
    category: "fun",
    guide: "{pn} [@user1] (@user2)",
    dependencies: {
      "discord-image-generation": "^2.3.0",
      "fs-extra": "^10.0.0"
    }
  },

  onStart: async function ({ api, message, event, Users }) {
    try {
      const { senderID, mentions } = event;
      const mentionedUsers = Object.keys(mentions);

      // Validate mentions
      if (mentionedUsers.length === 0) {
        return message.reply("💔 Please mention at least one user to kiss!");
      }

      // Prepare participants
      let user1, user2, avatar1, avatar2;

      // If only one user mentioned
      if (mentionedUsers.length === 1) {
        // Use bot avatar as default
        const botInfo = await api.getCurrentUserInfo();
        avatar1 = botInfo.avatar || botInfo.getAvatarURL();
        user2 = mentionedUsers[0];
        avatar2 = await Users.getAvatarUrl(user2);
        return createKissImage(api, message, avatar1, avatar2, user2);
      }

      // If two users mentioned
      if (mentionedUsers.length > 1) {
        user1 = mentionedUsers[0];
        user2 = mentionedUsers[1];
        avatar1 = await Users.getAvatarUrl(user1);
        avatar2 = await Users.getAvatarUrl(user2);
        return createKissImage(api, message, avatar1, avatar2, `${user1} and ${user2}`);
      }

    } catch (error) {
      console.error("Kiss command error:", error);
      message.reply("❌ Failed to generate the kiss image. Please try again later.");
    }
  }
};

async function createKissImage(api, message, avatar1, avatar2, participants) {
  try {
    // Generate image
    const img = await new DIG.Kiss().getImage(avatar1, avatar2);
    const tempDir = path.join(__dirname, "tmp");
    const tempPath = path.join(tempDir, `kiss_${Date.now()}.png`);

    // Create tmp directory if it doesn't exist
    await fs.ensureDir(tempDir);

    // Save image to temp file
    await fs.writeFile(tempPath, img, "utf8");

    // Send result
    await message.reply({
      body: `💋 | ${participants} are feeling romantic today!`,
      attachment: fs.createReadStream(tempPath)
    });

    // Clean up temp file after sending
    setTimeout(() => {
      fs.unlink(tempPath).catch(() => {});
    }, 30000); // Delete after 30 seconds

  } catch (error) {
    console.error("Error generating kiss image:", error);
    message.reply("❌ Failed to generate the kissing image. Please try again later.");
  }
}
