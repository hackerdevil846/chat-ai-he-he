const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "hubble",
        aliases: [],
        version: "1.1.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "education",
        shortDescription: {
            en: "🪐 𝖲𝗁𝗈𝗐𝗌 𝖽𝖺𝗂𝗅𝗒 𝖧𝗎𝖻𝖻𝗅𝖾 𝖲𝗉𝖺𝖼𝖾 𝖳𝖾𝗅𝖾𝗌𝖼𝗈𝗉𝖾 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗋𝗈𝗆 𝗇𝖺𝗌𝖺.𝗃𝗌𝗈𝗇"
        },
        longDescription: {
            en: "𝖣𝗂𝗌𝗉𝗅𝖺𝗒𝗌 𝗂𝗆𝖺𝗀𝖾 𝗂𝗇𝖿𝗈 𝖽𝗂𝗋𝖾𝖼𝗍𝗅𝗒 𝖿𝗋𝗈𝗆 𝗒𝗈𝗎𝗋 𝗇𝖺𝗌𝖺.𝗃𝗌𝗈𝗇 𝖿𝗂𝗅𝖾 — 𝗇𝗈 𝗀𝗎𝖾𝗌𝗌𝗂𝗇𝗀, 𝗇𝗈 𝖾𝗑𝗍𝖾𝗋𝗇𝖺𝗅 𝖠𝖯𝖨."
        },
        guide: {
            en: "{p}hubble\n{p}hubble [𝖽𝖺𝗍𝖾 𝗈𝗋 𝗇𝖺𝗆𝖾]\n{p}hubble 𝗋𝖺𝗇𝖽𝗈𝗆"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message, args }) {
        try {
            // Dependency check
            let axiosAvailable = true;
            let fsAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                axiosAvailable = false;
                fsAvailable = false;
            }

            if (!axiosAvailable || !fsAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const hubbleDataPath = path.join(__dirname, "assets/hubble/nasa.json");

            // Load JSON data with error handling
            if (!fs.existsSync(hubbleDataPath)) {
                return message.reply("❌ 𝖧𝗎𝖻𝖻𝗅𝖾 𝖽𝖺𝗍𝖺 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖿𝗂𝗅𝖾 𝗉𝖺𝗍𝗁.");
            }

            let hubbleData;
            try {
                const fileContent = fs.readFileSync(hubbleDataPath, "utf8");
                hubbleData = JSON.parse(fileContent);
            } catch (parseError) {
                console.error("𝖩𝖲𝖮𝖭 𝗉𝖺𝗋𝗌𝖾 𝖾𝗋𝗋𝗈𝗋:", parseError);
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖩𝖲𝖮𝖭 𝖿𝗈𝗋𝗆𝖺𝗍 𝗂𝗇 𝗇𝖺𝗌𝖺.𝗃𝗌𝗈𝗇 𝖿𝗂𝗅𝖾.");
            }

            if (!Array.isArray(hubbleData) || hubbleData.length === 0) {
                return message.reply("❌ 𝖳𝗁𝖾 𝗇𝖺𝗌𝖺.𝗃𝗌𝗈𝗇 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒 𝗈𝗋 𝗂𝗇𝗏𝖺𝗅𝗂𝖽.");
            }

            let selectedImage;

            // If user didn't provide arguments, pick today's date or random
            if (args.length === 0) {
                const today = new Date();
                const months = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                const todayFormatted = `${months[today.getMonth()]} ${today.getDate()}`;

                selectedImage = hubbleData.find(item => {
                    if (!item.date) return false;
                    const itemDate = item.date.split(" ").slice(0, 2).join(" ");
                    return itemDate === todayFormatted;
                });

                if (!selectedImage) {
                    selectedImage = hubbleData[Math.floor(Math.random() * hubbleData.length)];
                }
            } else {
                const searchTerm = args.join(" ").toLowerCase();

                if (searchTerm === "random" || searchTerm === "r") {
                    selectedImage = hubbleData[Math.floor(Math.random() * hubbleData.length)];
                } else {
                    selectedImage = hubbleData.find(item =>
                        (item.date && item.date.toLowerCase().includes(searchTerm)) ||
                        (item.name && item.name.toLowerCase().includes(searchTerm)) ||
                        (item.caption && item.caption.toLowerCase().includes(searchTerm)) ||
                        (item.year && item.year.toString().includes(searchTerm))
                    );
                }

                if (!selectedImage) {
                    return message.reply(`❌ 𝖭𝗈 𝗋𝖾𝗌𝗎𝗅𝗍 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 "${searchTerm}". 𝖳𝗋𝗒 𝖺𝗇𝗈𝗍𝗁𝖾𝗋 𝖽𝖺𝗍𝖾 𝗈𝗋 𝗇𝖺𝗆𝖾.`);
                }
            }

            // Validate selected image data
            if (!selectedImage) {
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗅𝖾𝖼𝗍 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            // Construct text with fallbacks for missing data
            const text =
                `🪐 𝖧𝗎𝖻𝖻𝗅𝖾 𝖲𝗉𝖺𝖼𝖾 𝖳𝖾𝗅𝖾𝗌𝖼𝗈𝗉𝖾\n\n` +
                `📅 𝖣𝖺𝗍𝖾: ${selectedImage.date || "𝖭𝗈𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾"}\n` +
                `🔭 𝖭𝖺𝗆𝖾: ${selectedImage.name || "𝖭𝗈𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾"}\n` +
                `📖 𝖢𝖺𝗉𝗍𝗂𝗈𝗇: ${selectedImage.caption || "𝖭𝗈𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾"}\n` +
                `📅 𝖸𝖾𝖺𝗋: ${selectedImage.year || "𝖭𝗈𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾"}\n` +
                `🔗 𝖲𝗈𝗎𝗋𝖼𝖾: ${selectedImage.url || "𝖭𝗈𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾"}`;

            // Handle image with comprehensive error handling
            let imageField = selectedImage.image || "";
            let attachment = null;

            if (imageField.startsWith("http://") || imageField.startsWith("https://")) {
                // Download the image temporarily
                const tempPath = path.join(__dirname, `hubble_temp_${Date.now()}.jpg`);
                try {
                    console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾: ${imageField}`);
                    
                    const res = await axios.get(imageField, { 
                        responseType: "arraybuffer",
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    await fs.writeFile(tempPath, res.data);
                    
                    // Verify file was written successfully
                    const stats = await fs.stat(tempPath);
                    if (stats.size > 0) {
                        attachment = fs.createReadStream(tempPath);
                        await message.reply({ body: text, attachment });
                        console.log("✅ 𝖨𝗆𝖺𝗀𝖾 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                    } else {
                        throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                    }
                } catch (err) {
                    console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽:", err.message);
                    await message.reply({ body: text + "\n\n⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾." });
                } finally {
                    // Clean up temporary file
                    try {
                        if (await fs.pathExists(tempPath)) {
                            await fs.unlink(tempPath);
                        }
                    } catch (cleanupError) {
                        console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
                    }
                }
            } else if (imageField && await fs.pathExists(path.join(__dirname, "assets/hubble", imageField))) {
                // Local file (if some entries point to a filename)
                try {
                    attachment = fs.createReadStream(path.join(__dirname, "assets/hubble", imageField));
                    await message.reply({ body: text, attachment });
                } catch (localError) {
                    console.error("❌ 𝖫𝗈𝖼𝖺𝗅 𝖿𝗂𝗅𝖾 𝖾𝗋𝗋𝗈𝗋:", localError.message);
                    await message.reply({ body: text + "\n\n⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗅𝗈𝖺𝖽 𝗅𝗈𝖼𝖺𝗅 𝗂𝗆𝖺𝗀𝖾." });
                }
            } else {
                // Text-only if no valid image found
                await message.reply({ body: text + "\n\n📸 𝖭𝗈 𝗂𝗆𝖺𝗀𝖾 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾" });
            }

        } catch (error) {
            console.error("💥 𝖧𝗎𝖻𝖻𝗅𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖧𝗎𝖻𝖻𝗅𝖾 𝖽𝖺𝗍𝖺.";
            
            if (error.message.includes('JSON')) {
                errorMessage = "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖩𝖲𝖮𝖭 𝖿𝗈𝗋𝗆𝖺𝗍 𝗂𝗇 𝗇𝖺𝗌𝖺.𝗃𝗌𝗈𝗇 𝖿𝗂𝗅𝖾.";
            } else if (error.message.includes('network') || error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
