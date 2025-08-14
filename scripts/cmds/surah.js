const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Quran Metadata
const QuranData = {
  Sura: [
    // [start, ayas, order, rukus, name, tname, ename, type]
    [],
    [0, 7, 5, 1, 'الفاتحة', "Al-Faatiha", 'The Opening', 'Meccan'],
    [7, 286, 87, 40, 'البقرة', "Al-Baqara", 'The Cow', 'Medinan'],
    [293, 200, 89, 20, 'آل عمران', "Aal-i-Imraan", 'The Family of Imraan', 'Medinan'],
    [493, 176, 92, 24, 'النساء', "An-Nisaa", 'The Women', 'Medinan'],
    [669, 120, 112, 16, 'المائدة', "Al-Maaida", 'The Table', 'Medinan'],
    [789, 165, 55, 20, 'الأنعام', "Al-An'aam", 'The Cattle', 'Meccan'],
    [954, 206, 39, 24, 'الأعراف', "Al-A'raaf", 'The Heights', 'Meccan'],
    [1160, 75, 88, 10, 'الأنفال', "Al-Anfaal", 'The Spoils of War', 'Medinan'],
    [1235, 129, 113, 16, 'التوبة', "At-Tawba", 'The Repentance', 'Medinan'],
    [1364, 109, 51, 11, 'يونس', "Yunus", 'Jonas', 'Meccan'],
    [1473, 123, 52, 10, 'هود', "Hud", 'Hud', 'Meccan'],
    [1596, 111, 53, 12, 'يوسف', "Yusuf", 'Joseph', 'Meccan'],
    [1707, 43, 96, 6, 'الرعد', "Ar-Ra'd", 'The Thunder', 'Medinan'],
    [1750, 52, 72, 7, 'ابراهيم', "Ibrahim", 'Abraham', 'Meccan'],
    [1802, 99, 54, 6, 'الحجر', "Al-Hijr", 'The Rock', 'Meccan'],
    [1901, 128, 70, 16, 'النحل', "An-Nahl", 'The Bee', 'Meccan'],
    [2029, 111, 50, 12, 'الإسراء', "Al-Israa", 'The Night Journey', 'Meccan'],
    [2140, 110, 69, 12, 'الكهف', "Al-Kahf", 'The Cave', 'Meccan'],
    [2250, 98, 44, 6, 'مريم', "Maryam", 'Mary', 'Meccan'],
    [2348, 135, 45, 8, 'طه', "Taa-Haa", 'Taa-Haa', 'Meccan'],
    [2483, 112, 73, 7, 'الأنبياء', "Al-Anbiyaa", 'The Prophets', 'Meccan'],
    [2595, 78, 103, 10, 'الحج', "Al-Hajj", 'The Pilgrimage', 'Medinan'],
    [2673, 118, 74, 6, 'المؤمنون', "Al-Muminoon", 'The Believers', 'Meccan'],
    [2791, 64, 102, 9, 'النور', "An-Noor", 'The Light', 'Medinan'],
    [2855, 77, 42, 6, 'الفرقان', "Al-Furqaan", 'The Criterion', 'Meccan'],
    [2932, 227, 47, 11, 'الشعراء', "Ash-Shu'araa", 'The Poets', 'Meccan'],
    [3159, 93, 48, 7, 'النمل', "An-Naml", 'The Ant', 'Meccan'],
    [3252, 88, 49, 8, 'القصص', "Al-Qasas", 'The Stories', 'Meccan'],
    [3340, 69, 85, 7, 'العنكبوت', "Al-Ankaboot", 'The Spider', 'Meccan'],
    [3409, 60, 84, 6, 'الروم', "Ar-Room", 'The Romans', 'Meccan'],
    [3469, 34, 57, 3, 'لقمان', "Luqman", 'Luqman', 'Meccan'],
    [3503, 30, 75, 3, 'السجدة', "As-Sajda", 'The Prostration', 'Meccan'],
    [3533, 73, 90, 9, 'الأحزاب', "Al-Ahzaab", 'The Clans', 'Medinan'],
    [3606, 54, 58, 6, 'سبإ', "Saba", 'Sheba', 'Meccan'],
    [3660, 45, 43, 5, 'فاطر', "Faatir", 'The Originator', 'Meccan'],
    [3705, 83, 41, 5, 'يس', "Yaseen", 'Yaseen', 'Meccan'],
    [3788, 182, 56, 5, 'الصافات', "As-Saaffaat", 'Those drawn up in Ranks', 'Meccan'],
    [3970, 88, 38, 5, 'ص', "Saad", 'The letter Saad', 'Meccan'],
    [4058, 75, 59, 8, 'الزمر', "Az-Zumar", 'The Groups', 'Meccan'],
    [4133, 85, 60, 9, 'غافر', "Al-Ghaafir", 'The Forgiver', 'Meccan'],
    [4218, 54, 61, 6, 'فصلت', "Fussilat", 'Explained in detail', 'Meccan'],
    [4272, 53, 62, 5, 'الشورى', "Ash-Shura", 'Consultation', 'Meccan'],
    [4325, 89, 63, 7, 'الزخرف', "Az-Zukhruf", 'Ornaments of gold', 'Meccan'],
    [4414, 59, 64, 3, 'الدخان', "Ad-Dukhaan", 'The Smoke', 'Meccan'],
    [4473, 37, 65, 4, 'الجاثية', "Al-Jaathiya", 'Crouching', 'Meccan'],
    [4510, 35, 66, 4, 'الأحقاف', "Al-Ahqaf", 'The Dunes', 'Meccan'],
    [4545, 38, 95, 4, 'محمد', "Muhammad", 'Muhammad', 'Medinan'],
    [4583, 29, 111, 4, 'الفتح', "Al-Fath", 'The Victory', 'Medinan'],
    [4612, 18, 106, 2, 'الحجرات', "Al-Hujuraat", 'The Inner Apartments', 'Medinan'],
    [4630, 45, 34, 3, 'ق', "Qaaf", 'The letter Qaaf', 'Meccan'],
    [4675, 60, 67, 3, 'الذاريات', "Adh-Dhaariyat", 'The Winnowing Winds', 'Meccan'],
    [4735, 49, 76, 2, 'الطور', "At-Tur", 'The Mount', 'Meccan'],
    [4784, 62, 23, 3, 'النجم', "An-Najm", 'The Star', 'Meccan'],
    [4846, 55, 37, 3, 'القمر', "Al-Qamar", 'The Moon', 'Meccan'],
    [4901, 78, 97, 3, 'الرحمن', "Ar-Rahmaan", 'The Beneficent', 'Medinan'],
    [4979, 96, 46, 3, 'الواقعة', "Al-Waaqia", 'The Inevitable', 'Meccan'],
    [5075, 29, 94, 4, 'الحديد', "Al-Hadid", 'The Iron', 'Medinan'],
    [5104, 22, 105, 3, 'المجادلة', "Al-Mujaadila", 'The Pleading Woman', 'Medinan'],
    [5126, 24, 101, 3, 'الحشر', "Al-Hashr", 'The Exile', 'Medinan'],
    [5150, 13, 91, 2, 'الممتحنة', "Al-Mumtahana", 'She that is to be examined', 'Medinan'],
    [5163, 14, 109, 2, 'الصف', "As-Saff", 'The Ranks', 'Medinan'],
    [5177, 11, 110, 2, 'الجمعة', "Al-Jumu'a", 'Friday', 'Medinan'],
    [5188, 11, 104, 2, 'المنافقون', "Al-Munaafiqoon", 'The Hypocrites', 'Medinan'],
    [5199, 18, 108, 2, 'التغابن', "At-Taghaabun", 'Mutual Disillusion', 'Medinan'],
    [5217, 12, 99, 2, 'الطلاق', "At-Talaaq", 'Divorce', 'Medinan'],
    [5229, 12, 107, 2, 'التحريم', "At-Tahrim", 'The Prohibition', 'Medinan'],
    [5241, 30, 77, 2, 'الملك', "Al-Mulk", 'The Sovereignty', 'Meccan'],
    [5271, 52, 2, 2, 'القلم', "Al-Qalam", 'The Pen', 'Meccan'],
    [5323, 52, 78, 2, 'الحاقة', "Al-Haaqqa", 'The Reality', 'Meccan'],
    [5375, 44, 79, 2, 'المعارج', "Al-Ma'aarij", 'The Ascending Stairways', 'Meccan'],
    [5419, 28, 71, 2, 'نوح', "Nooh", 'Noah', 'Meccan'],
    [5447, 28, 40, 2, 'الجن', "Al-Jinn", 'The Jinn', 'Meccan'],
    [5475, 20, 3, 2, 'المزمل', "Al-Muzzammil", 'The Enshrouded One', 'Meccan'],
    [5495, 56, 4, 2, 'المدثر', "Al-Muddaththir", 'The Cloaked One', 'Meccan'],
    [5551, 40, 31, 2, 'القيامة', "Al-Qiyaama", 'The Resurrection', 'Meccan'],
    [5591, 31, 98, 2, 'الانسان', "Al-Insaan", 'Man', 'Medinan'],
    [5622, 50, 33, 2, 'المرسلات', "Al-Mursalaat", 'The Emissaries', 'Meccan'],
    [5672, 40, 80, 2, 'النبإ', "An-Naba", 'The Announcement', 'Meccan'],
    [5712, 46, 81, 2, 'النازعات', "An-Naazi'aat", 'Those who drag forth', 'Meccan'],
    [5758, 42, 24, 1, 'عبس', "Abasa", 'He frowned', 'Meccan'],
    [5800, 29, 7, 1, 'التكوير', "At-Takwir", 'The Overthrowing', 'Meccan'],
    [5829, 19, 82, 1, 'الإنفطار', "Al-Infitaar", 'The Cleaving', 'Meccan'],
    [5848, 36, 86, 1, 'المطففين', "Al-Mutaffifin", 'Defrauding', 'Meccan'],
    [5884, 25, 83, 1, 'الإنشقاق', "Al-Inshiqaaq", 'The Splitting Open', 'Meccan'],
    [5909, 22, 27, 1, 'البروج', "Al-Burooj", 'The Constellations', 'Meccan'],
    [5931, 17, 36, 1, 'الطارق', "At-Taariq", 'The Morning Star', 'Meccan'],
    [5948, 19, 8, 1, 'الأعلى', "Al-A'laa", 'The Most High', 'Meccan'],
    [5967, 26, 68, 1, 'الغاشية', "Al-Ghaashiya", 'The Overwhelming', 'Meccan'],
    [5993, 30, 10, 1, 'الفجر', "Al-Fajr", 'The Dawn', 'Meccan'],
    [6023, 20, 35, 1, 'البلد', "Al-Balad", 'The City', 'Meccan'],
    [6043, 15, 26, 1, 'الشمس', "Ash-Shams", 'The Sun', 'Meccan'],
    [6058, 21, 9, 1, 'الليل', "Al-Lail", 'The Night', 'Meccan'],
    [6079, 11, 11, 1, 'الضحى', "Ad-Dhuhaa", 'The Morning Hours', 'Meccan'],
    [6090, 8, 12, 1, 'الشرح', "Ash-Sharh", 'The Consolation', 'Meccan'],
    [6098, 8, 28, 1, 'التين', "At-Tin", 'The Fig', 'Meccan'],
    [6106, 19, 1, 1, 'العلق', "Al-Alaq", 'The Clot', 'Meccan'],
    [6125, 5, 25, 1, 'القدر', "Al-Qadr", 'The Power, Fate', 'Meccan'],
    [6130, 8, 100, 1, 'البينة', "Al-Bayyina", 'The Evidence', 'Medinan'],
    [6138, 8, 93, 1, 'الزلزلة', "Az-Zalzala", 'The Earthquake', 'Medinan'],
    [6146, 11, 14, 1, 'العاديات', "Al-Aadiyaat", 'The Chargers', 'Meccan'],
    [6157, 11, 30, 1, 'القارعة', "Al-Qaari'a", 'The Calamity', 'Meccan'],
    [6168, 8, 16, 1, 'التكاثر', "At-Takaathur", 'Competition', 'Meccan'],
    [6176, 3, 13, 1, 'العصر', "Al-Asr", 'The Declining Day, Epoch', 'Meccan'],
    [6179, 9, 32, 1, 'الهمزة', "Al-Humaza", 'The Traducer', 'Meccan'],
    [6188, 5, 19, 1, 'الفيل', "Al-Fil", 'The Elephant', 'Meccan'],
    [6193, 4, 29, 1, 'قريش', "Quraish", 'Quraysh', 'Meccan'],
    [6197, 7, 17, 1, 'الماعون', "Al-Maa'un", 'Almsgiving', 'Meccan'],
    [6204, 3, 15, 1, 'الكوثر', "Al-Kawthar", 'Abundance', 'Meccan'],
    [6207, 6, 18, 1, 'الكافرون', "Al-Kaafiroon", 'The Disbelievers', 'Meccan'],
    [6213, 3, 114, 1, 'النصر', "An-Nasr", 'Divine Support', 'Medinan'],
    [6216, 5, 6, 1, 'المسد', "Al-Masad", 'The Palm Fibre', 'Meccan'],
    [6221, 4, 22, 1, 'الإخلاص', "Al-Ikhlaas", 'Sincerity', 'Meccan'],
    [6225, 5, 20, 1, 'الفلق', "Al-Falaq", 'The Dawn', 'Meccan'],
    [6230, 6, 21, 1, 'الناس', "An-Naas", 'Mankind', 'Meccan'],
    [6236, 1]
  ]
};

// Configuration for backup systems
const BACKUP_CONFIG = {
  cacheDir: './quran_cache',
  maxRetries: 3,
  retryDelay: 1000,
  cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
  fallbackAPIs: [
    'https://api.quran.com/api/v4/verses/by_chapter/{chapter}?verse_key={chapter}:{verse}&limit={count}&translations=131',
    'https://api.alquran.cloud/v1/ayah/{chapter}:{verse}/en.asad'
  ]
};

function toArabDigits(num) {
  const arabdigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(digit => arabdigits[digit]).join('');
}

// Ensure cache directory exists
async function ensureCacheDir() {
  try {
    await fs.mkdir(BACKUP_CONFIG.cacheDir, { recursive: true });
  } catch (error) {
    console.warn('Could not create cache directory:', error.message);
  }
}

// Generate cache key for verse data
function getCacheKey(chapter, verse, count) {
  return `${chapter}_${verse}_${count}.json`;
}

// Save data to cache
async function saveToCache(key, data) {
  try {
    await ensureCacheDir();
    const cacheFile = path.join(BACKUP_CONFIG.cacheDir, key);
    const cacheData = {
      timestamp: Date.now(),
      data: data
    };
    await fs.writeFile(cacheFile, JSON.stringify(cacheData, null, 2));
    console.log(`Cached data saved: ${key}`);
  } catch (error) {
    console.warn('Failed to save cache:', error.message);
  }
}

// Load data from cache
async function loadFromCache(key) {
  try {
    const cacheFile = path.join(BACKUP_CONFIG.cacheDir, key);
    const cacheContent = await fs.readFile(cacheFile, 'utf8');
    const cacheData = JSON.parse(cacheContent);
    
    // Check if cache is still valid
    if (Date.now() - cacheData.timestamp < BACKUP_CONFIG.cacheExpiry) {
      console.log(`Using cached data: ${key}`);
      return cacheData.data;
    } else {
      console.log(`Cache expired: ${key}`);
      return null;
    }
  } catch (error) {
    console.log(`No cache found: ${key}`);
    return null;
  }
}

// Sleep function for retry delays
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Primary method: Fetch from Google Sheets
async function fetchFromGoogleSheets(chapter, verse, count) {
  let vnum = 0;
  for (let i = 1; i < chapter; i++) {
    vnum += QuranData.Sura[i][1];
  }
  vnum += parseInt(verse) + 1;

  const url = `https://docs.google.com/spreadsheets/d/0Aps7j0tW_eq0dFUzN3djMC1IUUYyMHV4VFhqRUhJSmc/gviz/tq?tqx=out:json&range=C${vnum}:D${vnum + count - 1}`;

  const response = await axios.get(url, { timeout: 10000 });
  let data = response.data;
  
  if (data.startsWith('/*O_o*/')) {
    data = data.substring('/*O_o*/'.length);
  }
  
  const jsonData = JSON.parse(data);
  return jsonData.table.rows.map(row => ({
    arabic: row.c[0]?.v || '',
    translation: row.c[1]?.v || ''
  }));
}

// Fallback method 1: Quran.com API
async function fetchFromQuranAPI(chapter, verse, count) {
  const url = `https://api.quran.com/api/v4/verses/by_chapter/${chapter}?verse_key=${chapter}:${verse}&limit=${count}&translations=131`;
  
  const response = await axios.get(url, { timeout: 10000 });
  const data = response.data;
  
  if (!data.verses || data.verses.length === 0) {
    throw new Error('No verses found in Quran.com API response');
  }
  
  return data.verses.map(verse => ({
    arabic: verse.text_uthmani || verse.text_imlaei || '',
    translation: verse.translations && verse.translations[0] ? verse.translations[0].text : 'Translation not available'
  }));
}

// Fallback method 2: AlQuran.cloud API
async function fetchFromAlQuranCloud(chapter, verse, count) {
  const verses = [];
  
  for (let i = 0; i < count; i++) {
    const currentVerse = verse + i;
    const url = `https://api.alquran.cloud/v1/ayah/${chapter}:${currentVerse}/en.asad`;
    
    try {
      const response = await axios.get(url, { timeout: 10000 });
      const data = response.data;
      
      if (data.code === 200 && data.data) {
        // Get Arabic text separately
        const arabicUrl = `https://api.alquran.cloud/v1/ayah/${chapter}:${currentVerse}`;
        const arabicResponse = await axios.get(arabicUrl, { timeout: 10000 });
        const arabicData = arabicResponse.data;
        
        verses.push({
          arabic: arabicData.data ? arabicData.data.text : '',
          translation: data.data.text || 'Translation not available'
        });
      }
    } catch (error) {
      console.warn(`Failed to fetch verse ${chapter}:${currentVerse} from AlQuran.cloud:`, error.message);
      verses.push({
        arabic: '',
        translation: 'Translation not available'
      });
    }
    
    // Small delay between requests to avoid rate limiting
    if (i < count - 1) {
      await sleep(200);
    }
  }
  
  return verses;
}

// Fallback method 3: Generate basic fallback data
function generateFallbackData(chapter, verse, count) {
  console.log('Using fallback data generation');
  const verses = [];
  
  for (let i = 0; i < count; i++) {
    const currentVerse = verse + i;
    verses.push({
      arabic: `[Verse ${chapter}:${currentVerse} - Arabic text unavailable]`,
      translation: `[Verse ${chapter}:${currentVerse} - Translation unavailable. Please try again later or check your internet connection.]`
    });
  }
  
  return verses;
}

// Main function with comprehensive fallback system
async function fetchQuranTextWithBackup(chapter, verse, count = 1) {
  const cacheKey = getCacheKey(chapter, verse, count);
  
  // Try to load from cache first
  const cachedData = await loadFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  const methods = [
    { name: 'Google Sheets', func: fetchFromGoogleSheets },
    { name: 'Quran.com API', func: fetchFromQuranAPI },
    { name: 'AlQuran.cloud API', func: fetchFromAlQuranCloud }
  ];
  
  let lastError = null;
  
  // Try each method with retries
  for (const method of methods) {
    console.log(`Attempting to fetch from ${method.name}...`);
    
    for (let retry = 0; retry < BACKUP_CONFIG.maxRetries; retry++) {
      try {
        const data = await method.func(chapter, verse, count);
        
        // Validate data
        if (data && data.length > 0 && data[0].arabic && data[0].translation) {
          console.log(`Successfully fetched from ${method.name}`);
          
          // Save to cache for future use
          await saveToCache(cacheKey, data);
          
          return data;
        } else {
          throw new Error('Invalid or empty data received');
        }
      } catch (error) {
        lastError = error;
        console.warn(`${method.name} attempt ${retry + 1} failed:`, error.message);
        
        if (retry < BACKUP_CONFIG.maxRetries - 1) {
          console.log(`Retrying in ${BACKUP_CONFIG.retryDelay}ms...`);
          await sleep(BACKUP_CONFIG.retryDelay);
        }
      }
    }
  }
  
  // If all methods fail, generate fallback data
  console.error('All backup methods failed. Last error:', lastError?.message);
  const fallbackData = generateFallbackData(chapter, verse, count);
  
  // Still save fallback data to cache to avoid repeated failures
  await saveToCache(cacheKey, fallbackData);
  
  return fallbackData;
}

// Enhanced error handling wrapper
async function fetchQuranText(chapter, verse, count = 1) {
  try {
    return await fetchQuranTextWithBackup(chapter, verse, count);
  } catch (error) {
    console.error('Critical error in fetchQuranText:', error);
    return generateFallbackData(chapter, verse, count);
  }
}

// Cache management functions
async function clearCache() {
  try {
    const files = await fs.readdir(BACKUP_CONFIG.cacheDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        await fs.unlink(path.join(BACKUP_CONFIG.cacheDir, file));
      }
    }
    console.log('Cache cleared successfully');
  } catch (error) {
    console.warn('Failed to clear cache:', error.message);
  }
}

async function getCacheStats() {
  try {
    const files = await fs.readdir(BACKUP_CONFIG.cacheDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    let totalSize = 0;
    let validFiles = 0;
    let expiredFiles = 0;
    
    for (const file of jsonFiles) {
      const filePath = path.join(BACKUP_CONFIG.cacheDir, file);
      const stats = await fs.stat(filePath);
      totalSize += stats.size;
      
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(content);
        
        if (Date.now() - data.timestamp < BACKUP_CONFIG.cacheExpiry) {
          validFiles++;
        } else {
          expiredFiles++;
        }
      } catch (error) {
        // Invalid cache file
      }
    }
    
    return {
      totalFiles: jsonFiles.length,
      validFiles,
      expiredFiles,
      totalSize: Math.round(totalSize / 1024) + ' KB'
    };
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = {
  config: {
    name: "surah",
    version: "2.0",
    author: "Asif (Enhanced with Backup by Manus)",
    category: "Islamic",
    shortDescription: "Get Quran verses with fallback backup",
    longDescription: "Fetch and display Quran verses with translation using multiple backup sources and caching",
    guide: "{prefix}surah [chapter] [verse] [count=1]\n{prefix}surah cache-stats\n{prefix}surah clear-cache",
    countDown: 5
  },

  // Export utility functions for testing and external use
  fetchQuranText,
  fetchQuranTextWithBackup,
  clearCache,
  getCacheStats,
  toArabDigits,

  onStart: async function ({ api, event, args }) {
    try {
      const { threadID, messageID } = event;
      
      // Handle cache management commands
      if (args[0] === 'cache-stats') {
        const stats = await getCacheStats();
        const message = stats.error 
          ? `❌ Error getting cache stats: ${stats.error}`
          : `📊 Cache Statistics:\n` +
            `• Total files: ${stats.totalFiles}\n` +
            `• Valid files: ${stats.validFiles}\n` +
            `• Expired files: ${stats.expiredFiles}\n` +
            `• Total size: ${stats.totalSize}`;
        return api.sendMessage(message, threadID, messageID);
      }
      
      if (args[0] === 'clear-cache') {
        await clearCache();
        return api.sendMessage("🗑️ Cache cleared successfully!", threadID, messageID);
      }
      
      // Parse arguments for verse fetching
      let chapter = parseInt(args[0]);
      let verse = parseInt(args[1]);
      let count = parseInt(args[2]) || 1;

      // Validate chapter
      if (isNaN(chapter) || chapter < 1 || chapter > 114) {
        return api.sendMessage("❌ Invalid chapter. Please specify a chapter between 1-114.", threadID, messageID);
      }

      // Validate verse
      const maxVerse = QuranData.Sura[chapter][1];
      if (isNaN(verse) || verse < 1 || verse > maxVerse) {
        return api.sendMessage(`❌ Invalid verse. Chapter ${chapter} has ${maxVerse} verses.`, threadID, messageID);
      }

      // Validate count
      if (count < 1 || (verse + count - 1) > maxVerse) {
        return api.sendMessage(`❌ Invalid count. Maximum ${maxVerse - verse + 1} verses available from verse ${verse}.`, threadID, messageID);
      }

      // Show loading message for longer requests
      if (count > 5) {
        api.sendMessage("🔄 Fetching verses... This may take a moment.", threadID);
      }

      // Fetch verses with backup system
      const verses = await fetchQuranText(chapter, verse, count);
      
      // Format output
      let output = `📖 Surah ${QuranData.Sura[chapter][4]} (${chapter}:${verse}`;
      if (count > 1) {
        output += `-${verse + count - 1}`;
      }
      output += `)\n\n`;
      
      verses.forEach((v, i) => {
        const currentVerse = verse + i;
        output += `${v.arabic} ﴿${toArabDigits(currentVerse)}﴾\n`;
        output += `➥ ${v.translation}\n\n`;
      });
      
      // Add audio link
      const leadZero = (num, digits) => num.toString().padStart(digits, '0');
      const audioUrl = `https://www.everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/${leadZero(chapter,3)}${leadZero(verse,3)}.mp3`;
      output += `🎧 Audio: ${audioUrl}\n`;
      
      // Add backup system info if fallback was used
      if (verses[0].arabic.includes('[Verse') || verses[0].translation.includes('unavailable')) {
        output += `\n⚠️ Note: Using fallback data due to connectivity issues. Please try again later for complete content.`;
      }
      
      api.sendMessage(output, threadID, messageID);
      
    } catch (error) {
      console.error("Quran command error:", error);
      api.sendMessage("❌ An unexpected error occurred. The backup system will help ensure this works better next time.", threadID, messageID);
    }
  }
};

