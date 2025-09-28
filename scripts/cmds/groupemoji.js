module.exports = {
    config: {
        name: "groupemoji",
        aliases: ["setemoji", "changeemoji"],
        version: "1.0.1", 
        author: "Asif Mahmud",
        countDown: 5,
        role: 1,
        category: "group",
        shortDescription: {
            en: "Change group emoji"
        },
        longDescription: {
            en: "Change the emoji of the current group chat"
        },
        guide: {
            en: "{p}groupemoji [emoji]"
        }
    },

    onStart: async function({ message, args, event, api }) {
        try {
            const emoji = args.join(" ").trim();
            
            // Check if user provided an emoji
            if (!emoji) {
                return message.reply("❌ Please provide an emoji!\n\n💡 Example: groupemoji 😎\n💡 Example: groupemoji 🎉");
            }

            // Validate emoji format (basic check)
            const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
            const validEmojis = emoji.match(emojiRegex);
            
            if (!validEmojis || validEmojis.length === 0) {
                return message.reply("❌ Please provide a valid emoji!\n\n💡 Examples: 😊, 🎯, ❤️, 🌟, 🔥");
            }

            // Check if it's a group chat
            if (event.isGroup === false) {
                return message.reply("❌ This command can only be used in group chats!");
            }

            // Check user permissions (role 1 = admin)
            const threadInfo = await api.getThreadInfo(event.threadID);
            const participantInfo = threadInfo.participants.find(p => p.id === event.senderID);
            
            if (!participantInfo) {
                return message.reply("❌ Cannot verify your permissions in this group.");
            }

            // Try to change the emoji
            try {
                await api.changeThreadEmoji(emoji, event.threadID);
                
                return message.reply(`✅ Successfully changed group emoji to: ${emoji}\n\n🔄 The change should appear shortly.`);
                
            } catch (changeError) {
                console.error("Emoji change error:", changeError);
                
                if (changeError.message.includes("permission") || changeError.message.includes("not admin")) {
                    return message.reply("❌ You need to be an admin to change the group emoji!");
                } else if (changeError.message.includes("invalid") || changeError.message.includes("emoji")) {
                    return message.reply("❌ Invalid emoji provided. Please try a different emoji.");
                } else {
                    throw changeError; // Re-throw to be caught by outer catch
                }
            }
            
        } catch (error) {
            console.error("Group Emoji Command Error:", error);
            
            let errorMessage = "❌ Failed to change group emoji. Please try again later.";
            
            if (error.message.includes("threadID")) {
                errorMessage = "❌ Invalid group chat. Please try in a different group.";
            } else if (error.message.includes("network") || error.message.includes("ECONN")) {
                errorMessage = "🌐 Network error. Please check your connection and try again.";
            } else if (error.message.includes("timeout")) {
                errorMessage = "⏰ Request timeout. Please try again.";
            }
            
            return message.reply(errorMessage);
        }
    }
};
