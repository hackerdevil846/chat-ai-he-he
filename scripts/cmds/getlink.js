module.exports = {
    config: {
        name: "getlink",
        aliases: [],
        version: "1.0.2",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "Get download links for attached media"
        },
        longDescription: {
            en: "Retrieves download links for attached media files (images, videos, audio)"
        },
        guide: {
            en: "Reply to a message with media and use: {p}getlink"
        }
    },

    onStart: async function({ message, event }) {
        try {
            const { messageReply } = event;
            
            // Enhanced validation
            if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
                return message.reply("❌ Please reply to a message that contains an image, video, or audio file.");
            }
            
            if (messageReply.attachments.length > 1) {
                return message.reply("❌ Please reply to a message with only one media attachment.");
            }
            
            const attachment = messageReply.attachments[0];
            const allowedTypes = ['image', 'video', 'audio'];
            
            if (!allowedTypes.includes(attachment.type)) {
                return message.reply("❌ Unsupported file type. Please reply to an image, video, or audio file.");
            }

            // Send both the link and the media preview
            await message.reply({
                body: `📎 Download Link:\n${attachment.url}\n\n✨ File Type: ${attachment.type.toUpperCase()}`,
                attachment: await global.utils.getStreamFromURL(attachment.url)
            });

        } catch (error) {
            console.error("GetLink Error:", error);
            message.reply("❌ An error occurred while processing the media. Please try again.");
        }
    }
};
