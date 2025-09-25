const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "quranverse",
        aliases: ["verse","ayah"],
        version: "2.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "islam",
        shortDescription: {
            en: "🌙 𝐺𝑒𝑡 𝑄𝑢𝑟𝑎𝑛 𝑣𝑒𝑟𝑠𝑒𝑠 𝑤𝑖𝑡ℎ 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛𝑠 𝑎𝑛𝑑 𝑎𝑢𝑑𝑖𝑜"
        },
        longDescription: {
            en: "🌙 𝐹𝑒𝑡𝑐ℎ 𝑄𝑢𝑟𝑎𝑛 𝑣𝑒𝑟𝑠𝑒𝑠 𝑤𝑖𝑡ℎ 𝑚𝑢𝑙𝑡𝑖𝑙𝑖𝑛𝑔𝑢𝑎𝑙 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛𝑠 𝑎𝑛𝑑 𝑎𝑢𝑑𝑖𝑜 𝑟𝑒𝑐𝑖𝑡𝑎𝑡𝑖𝑜𝑛"
        },
        guide: {
            en: "{p}quranverse [𝑟𝑎𝑛𝑑𝑜𝑚] | 𝑎𝑢𝑑𝑖𝑜 | [𝑠𝑢𝑟𝑎ℎ]:[𝑣𝑒𝑟𝑠𝑒] | 𝑙𝑎𝑛𝑔 [𝑐𝑜𝑑𝑒]"
        },
        countDown: 10,
        dependencies: {
            "axios": "",
            "canvas": "",
            "fs-extra": ""
        }
    },

    // --- Language labels (for headers) ---
    LANGS: {
        en: '𝐸𝑛𝑔𝑙𝑖𝑠ℎ',
        ur: '𝑈𝑟𝑑𝑢',
        ar: '𝐴𝑟𝑎𝑏𝑖𝑐',
        bn: '𝐵𝑒𝑛𝑔𝑎𝑙𝑖'
    },

    onLoad: function() {
        try {
            const tmpDir = path.join(__dirname, 'tmp');
            if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
            console.log(`[𝑞𝑢𝑟𝑎𝑛𝑣𝑒𝑟𝑠𝑒] 𝑡𝑚𝑝 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦 𝑟𝑒𝑎𝑑𝑦: ${tmpDir}`);
        } catch (err) {
            console.error('[𝑞𝑢𝑟𝑎𝑛𝑣𝑒𝑟𝑠𝑒] 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑡𝑚𝑝 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦:', err);
        }
    },

    // --- Utility: wrap text for canvas ---
    wrapText: function(ctx, text, x, y, maxWidth, lineHeight) {
        if (!text) return;
        const words = String(text).split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line.trim(), x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), x, y);
    },

    // --- Create the verse image ---
    createVerseImage: async function(verseData, language) {
        const width = 800;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0c1e25');
        gradient.addColorStop(1, '#1d4a5d');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Decorative soft circles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * width,
                Math.random() * height,
                Math.random() * 10 + 5,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Title
        ctx.font = 'bold 40px "Segoe UI"';
        ctx.fillStyle = '#f1c40f';
        ctx.textAlign = 'center';
        ctx.fillText('🌙 𝑄𝑢𝑟𝑎𝑛 𝑉𝑒𝑟𝑠𝑒 🌙', width / 2, 70);

        // Surah info
        ctx.font = '28px "Segoe UI"';
        ctx.fillStyle = '#e67e22';
        ctx.fillText(`${verseData.surahName} (${verseData.surahNameTranslation || ''})`, width / 2, 130);

        ctx.font = '22px "Segoe UI"';
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText(`𝑆𝑢𝑟𝑎ℎ ${verseData.surahNumber}:${verseData.verseNumber} | ${verseData.revelationPlace || ''}`, width / 2, 170);

        // Arabic text
        ctx.font = 'bold 36px "Traditional Arabic"';
        ctx.fillStyle = '#2ecc71';
        ctx.textAlign = 'center';
        const arabic = verseData.arabic1 || verseData.arabic || '';
        const arabicLines = String(arabic).split('\n');
        let arabicY = 240;
        for (const line of arabicLines) {
            ctx.fillText(line.trim(), width / 2, arabicY);
            arabicY += 36;
        }

        // Translation header
        ctx.font = 'italic 26px "Segoe UI"';
        ctx.fillStyle = '#3498db';
        ctx.fillText(`${this.LANGS[language] || this.LANGS.en} 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛:`, width / 2, 330);

        // Translation text
        const translation = verseData[language] || verseData.english || verseData.translation || '';
        ctx.font = '24px "Segoe UI"';
        ctx.fillStyle = '#ecf0f1';
        ctx.textAlign = 'center';
        this.wrapText(ctx, translation, width / 2, 380, 700, 34);

        // Footer
        ctx.font = '18px "Segoe UI"';
        ctx.fillStyle = '#bdc3c7';
        ctx.fillText('𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑏𝑦 𝐺𝑜𝑎𝑡𝐵𝑜𝑡 • 𝐶𝑟𝑒𝑑𝑖𝑡𝑠: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑', width / 2, height - 30);

        // Save image
        const imagePath = path.join(__dirname, 'tmp', `quran_${Date.now()}.png`);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(imagePath, buffer);

        return imagePath;
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                if (!axios || !createCanvas || !loadImage || !fs) {
                    throw new Error("Missing required dependencies");
                }
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑥𝑖𝑜𝑠, 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            const actionRaw = args[0] ? String(args[0]).toLowerCase() : '';
            const wantsAudio = actionRaw === 'audio';
            const wantsLanguage = actionRaw === 'lang' && args[1];
            const wantsSpecific = /^\d+:\d+$/.test(actionRaw);

            if (wantsLanguage) {
                const langCode = String(args[1]).toLowerCase();
                if (this.LANGS[langCode]) {
                    global.quranLanguage = langCode;
                    return message.reply(`✅ 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑠𝑒𝑡 𝑡𝑜 ${this.LANGS[langCode]}`);
                }
                return message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒. 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒: ${Object.keys(this.LANGS).join(', ')}`);
            }

            const language = global.quranLanguage || 'en';

            // Fetch surah list
            const surahsResponse = await axios.get('https://quranapi.pages.dev/api/surah.json');
            if (!surahsResponse || !surahsResponse.data) throw new Error("𝐶𝑜𝑢𝑙𝑑𝑛'𝑡 𝑓𝑒𝑡𝑐ℎ 𝑠𝑢𝑟𝑎ℎ 𝑙𝑖𝑠𝑡");

            const surahs = surahsResponse.data;
            let surahNumber, verseNumber;

            if (wantsSpecific) {
                [surahNumber, verseNumber] = actionRaw.split(':').map(Number);
            } else {
                // Pick a random surah
                const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];
                surahNumber = randomSurah.number;
                const surahDetail = await axios.get(`https://quranapi.pages.dev/api/${surahNumber}.json`);
                if (!surahDetail || !surahDetail.data) throw new Error("𝐶𝑜𝑢𝑙𝑑𝑛'𝑡 𝑓𝑒𝑡𝑐ℎ 𝑠𝑢𝑟𝑎ℎ 𝑑𝑒𝑡𝑎𝑖𝑙𝑠");
                const totalVerses = (surahDetail.data.english || []).length || 1;
                verseNumber = Math.floor(Math.random() * totalVerses) + 1;
            }

            const verseResponse = await axios.get(`https://quranapi.pages.dev/api/${surahNumber}/${verseNumber}.json`);
            if (!verseResponse || !verseResponse.data) throw new Error("𝐶𝑜𝑢𝑙𝑑𝑛'𝑡 𝑓𝑒𝑡𝑐ℎ 𝑣𝑒𝑟𝑠𝑒 𝑑𝑒𝑡𝑎𝑖𝑙𝑠");

            const verseData = verseResponse.data;
            verseData.surahNumber = surahNumber;
            verseData.verseNumber = verseNumber;

            // Create image
            const imagePath = await this.createVerseImage(verseData, language);

            // Compose message body
            let messageBody = `📖 ${verseData.surahName} (${verseData.surahNameTranslation || ''})\n` +
                              `𝑆𝑢𝑟𝑎ℎ ${surahNumber}:${verseNumber} | ${verseData.revelationPlace || ''}\n\n` +
                              `"${verseData.arabic1 || verseData.arabic || ''}"\n\n` +
                              `*${this.LANGS[language] || this.LANGS.en} 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛:*\n${verseData[language] || verseData.english || ''}`;

            if (wantsAudio && verseData.audio) {
                const reciters = Object.values(verseData.audio || {});
                if (reciters.length) {
                    messageBody += `\n\n🎧 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑅𝑒𝑐𝑖𝑡𝑒𝑟𝑠:\n`;
                    reciters.forEach((reciter, i) => {
                        messageBody += `${i + 1}. ${reciter.reciter || reciter.name || '𝑅𝑒𝑐𝑖𝑡𝑒𝑟'}\n`;
                    });
                    messageBody += `\n𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 ℎ𝑒𝑎𝑟 𝑟𝑒𝑐𝑖𝑡𝑎𝑡𝑖𝑜𝑛`;

                    global.quranAudioOptions = {
                        reciters: reciters,
                        verseInfo: `${verseData.surahName} ${surahNumber}:${verseNumber}`
                    };
                }
            }

            await message.reply({
                body: messageBody,
                attachment: fs.createReadStream(imagePath)
            });

            // Clean up
            fs.unlinkSync(imagePath);

        } catch (error) {
            console.error('[𝑞𝑢𝑟𝑎𝑛𝑣𝑒𝑟𝑠𝑒] 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑟𝑢𝑛:', error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑄𝑢𝑟𝑎𝑛 𝑣𝑒𝑟𝑠𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    },

    onReply: async function({ message, event }) {
        try {
            if (!global.quranAudioOptions || !event.body) return;

            const selectedNumber = parseInt(event.body);
            const { reciters, verseInfo } = global.quranAudioOptions;

            if (isNaN(selectedNumber)) return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟.");
            if (selectedNumber < 1 || selectedNumber > reciters.length) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑙𝑖𝑠𝑡.");
            }

            const selectedReciter = reciters[selectedNumber - 1];
            const stream = await global.utils.getStreamFromURL(selectedReciter.url || selectedReciter.link);

            await message.reply({
                body: `🎧 𝑃𝑙𝑎𝑦𝑖𝑛𝑔 ${verseInfo} - ${selectedReciter.reciter || selectedReciter.name || '𝑅𝑒𝑐𝑖𝑡𝑒𝑟'}`,
                attachment: stream
            });

            // Clean up
            delete global.quranAudioOptions;

        } catch (error) {
            console.error('[𝑞𝑢𝑟𝑎𝑛𝑣𝑒𝑟𝑠𝑒] 𝑜𝑛𝑅𝑒𝑝𝑙𝑦 𝑒𝑟𝑟𝑜𝑟:', error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑙𝑎𝑦 𝑡ℎ𝑒 𝑟𝑒𝑐𝑖𝑡𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        }
    }
};
