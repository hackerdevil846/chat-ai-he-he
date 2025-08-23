const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// Try to load Genius fallback without forcing dependency errors
let GeniusClient = null;
try {
  const Genius = require('genius-lyrics');
  GeniusClient = new Genius.Client(); // token optional; scrapes genius.com
} catch (e) {
  GeniusClient = null;
}

module.exports.config = {
  name: "lyrics",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑮𝒂𝒏𝒆𝒓 𝒆𝒓 𝒍𝒚𝒓𝒊𝒄𝒔 𝒋𝒂𝒏𝒂𝒏",
  category: "𝑴𝒆𝒅𝒊𝒂",
  usages: "𝒍𝒚𝒓𝒊𝒄𝒔 [𝒈𝒂𝒏𝒆𝒓 𝒏𝒂𝒎]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const songName = args.join(" ").trim();
  if (!songName) {
    return api.sendMessage("🎵 𝑮𝒂𝒏𝒆𝒓 𝒆𝒓 𝒏𝒂𝒎 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏!\nউদাহরণ: lyrics Tum Hi Ho", event.threadID, event.messageID);
  }

  const cacheDir = path.join(__dirname, 'cache');
  const imagePath = path.join(cacheDir, 'lyrics.png'); // DO NOT CHANGE (kept same path)
  await fs.ensureDir(cacheDir);

  api.sendMessage(`🔍 \"${songName}\" 𝒆𝒓 𝒍𝒚𝒓𝒊𝒄𝒔 𝒌𝒉𝒖𝒏𝒄𝒉𝒊... ⏳`, event.threadID, event.messageID);

  // Helpers
    const sendResult = async ({ title, artist, lyrics }) => {
    const header = [
      "━━━━━━━━━━━━━━━",
      "🎶 𝐋𝐲𝐫𝐢𝐜𝐬 𝐅𝐢𝐧𝐝𝐞𝐫",
      "━━━━━━━━━━━━━━━"
    ].join("\n");

    const info = [
      `🎼 𝑮𝒂𝒏 𝒆𝒓 𝒏𝒂𝒎: ${title || 'N/A'}`,
      `👤 𝑮𝒐𝒍𝒐𝒌: ${artist || 'N/A'}`
    ].join("\n");

    const footer = [
      "\n━━━━━━━━━━━━━━━",
      "© Credits: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
      "━━━━━━━━━━━━━━━"
    ].join("\n");

    const bodyText = `${header}\n${info}\n\n📝 𝑳𝒚𝒓𝒊𝒄𝒔:\n${lyrics || 'Not found.'}\n${footer}`;

    return api.sendMessage({ body: bodyText }, event.threadID, event.messageID);
  };

  // Step 1: Try original API (kept unchanged)
  try {
    const url = `https://lrclib.net/api/search?q=${encodeURIComponent(songName)}`;
    const { data } = await axios.get(url, { timeout: 15000 });

    if (Array.isArray(data) && data.length > 0) {
      const payload = data[0];
      const title = payload.trackName || songName;
      const artist = payload.artistName || 'Unknown';
      const lyrics = payload.plainLyrics || '';

      if (lyrics && typeof lyrics === 'string') {
        return await sendResult({ title, artist, lyrics });
      }
    }
  } catch (e) {
    // Continue to fallback
  }

  // Step 2: Fallback to Genius (no token required). Keeps same output + image path
  try {
    if (!GeniusClient) throw new Error('genius-lyrics not installed');

    const results = await GeniusClient.songs.search(songName);
    if (!results || results.length === 0) throw new Error('No results from Genius');

    const song = results[0];
    const lyrics = await song.lyrics();
    const title = song.title || song.fullTitle || songName;
    const artist = (song.artist && song.artist.name) ? song.artist.name : 'Unknown';
    const image = song.thumbnail || (song.raw && (song.raw.song_art_image_url || song.raw.header_image_url)) || null;

        return await sendResult({ title, artist, lyrics });
  } catch (e) {
    // Final error
    return api.sendMessage(
      "⚠️ 𝑳𝒚𝒓𝒊𝒄𝒔 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂. 𝒅𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒌𝒊𝒄𝒉𝒖 𝒑𝒐𝒓𝒆 𝒑𝒖𝒏𝒐𝒓𝒂𝒚 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏 😢",
      event.threadID,
      event.messageID
    );
  }
};


