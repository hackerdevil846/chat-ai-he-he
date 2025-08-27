// ghibli.js
const axios = require('axios');

module.exports = {
 config: {
 name: "studioghibli",
 version: "1.0",
 author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑", // Changed author name with formatting
 countDown: 10,
 role: 0,
 shortDescription: {
 vi: "𝑋𝑒𝑚 𝑝ℎ𝑖𝑚 𝐺ℎ𝑖𝑏𝑙𝑖 𝑛𝑔𝑎̂̃𝑢 𝑛ℎ𝑖𝑒̂𝑛",
 en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑆𝑡𝑢𝑑𝑖𝑜 𝐺ℎ𝑖𝑏𝑙𝑖 𝑓𝑖𝑙𝑚"
 },
 longDescription: {
 vi: "𝑋𝑒𝑚 𝑡ℎ𝑜̂𝑛𝑔 𝑡𝑖𝑛 𝑝ℎ𝑖𝑚 ℎ𝑜𝑎̣𝑡 ℎ𝑖̀𝑛ℎ 𝑆𝑡𝑢𝑑𝑖𝑜 𝐺ℎ𝑖𝑏𝑙𝑖 𝑛𝑔𝑎̂̃𝑢 𝑛ℎ𝑖𝑒̂𝑛",
 en: "𝐺𝑒𝑡 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑆𝑡𝑢𝑑𝑖𝑜 𝐺ℎ𝑖𝑏𝑙𝑖 𝑎𝑛𝑖𝑚𝑎𝑡𝑒𝑑 𝑓𝑖𝑙𝑚𝑠"
 },
 category: "𝑒𝑛𝑡𝑒𝑟𝑡𝑎𝑖𝑛𝑚𝑒𝑛𝑡",
 guide: {
 vi: " {𝑝𝑛}: 𝑥𝑒𝑚 𝑝ℎ𝑖𝑚 𝑛𝑔𝑎̂̃𝑢 𝑛ℎ𝑖𝑒̂𝑛"
 + "\n {𝑝𝑛} <𝑡𝑢̛̀ 𝑘ℎ𝑜́𝑎>: 𝑡𝑖̀𝑚 𝑝ℎ𝑖𝑚 𝑡ℎ𝑒𝑜 𝑡𝑢̛̀ 𝑘ℎ𝑜́𝑎",
 en: " {𝑝𝑛}: 𝑔𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑓𝑖𝑙𝑚"
 + "\n {𝑝𝑛} <𝑘𝑒𝑦𝑤𝑜𝑟𝑑>: 𝑠𝑒𝑎𝑟𝑐ℎ 𝑓𝑖𝑙𝑚𝑠 𝑏𝑦 𝑘𝑒𝑦𝑤𝑜𝑟𝑑"
 }
 },

 langs: {
 vi: {
 loading: "𝐷𝑎𝑛𝑔 𝑡𝑖̀𝑚 𝑘𝑖𝑒̂́𝑚 𝑝ℎ𝑖𝑚 𝐺ℎ𝑖𝑏𝑙𝑖 𝑐ℎ𝑜 𝑏𝑎𝑛...",
 result: "🎬 %1\n📅 𝑁𝑎̆𝑚: %2\n🎥 𝐷𝑎̣𝑜 𝑑𝑖𝑒̂̃𝑛: %3\n⭐ 𝐷𝑎́𝑛ℎ 𝑔𝑖𝑎́: %4/100\n\n📖 𝑁𝑜̣̂𝑖 𝑑𝑢𝑛𝑔: %5",
 noResult: "𝐾ℎ𝑜̂𝑛𝑔 𝑡𝑖̀𝑚 𝑡ℎ𝑎̂́𝑦 𝑝ℎ𝑖𝑚 𝑛𝑎̀𝑜 𝑝ℎ𝑢̀ ℎ𝑜̛̣𝑝 𝑣𝑜̛́𝑖 𝑡𝑢̛̀ 𝑘ℎ𝑜́𝑎 𝑐𝑢̉𝑎 𝑏𝑎𝑛"
 },
 en: {
 loading: "𝐹𝑖𝑛𝑑𝑖𝑛𝑔 𝑎 𝐺ℎ𝑖𝑏𝑙𝑖 𝑓𝑖𝑙𝑚 𝑓𝑜𝑟 𝑦𝑜𝑢...",
 result: "🎬 %1\n📅 𝑌𝑒𝑎𝑟: %2\n🎥 𝐷𝑖𝑟𝑒𝑐𝑡𝑜𝑟: %3\n⭐ 𝑅𝑎𝑡𝑖𝑛𝑔: %4/100\n\n📖 𝑆𝑦𝑛𝑜𝑝𝑠𝑖𝑠: %5",
 noResult: "𝑁𝑜 𝑓𝑖𝑙𝑚𝑠 𝑓𝑜𝑢𝑛𝑑 𝑚𝑎𝑡𝑐ℎ𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑘𝑒𝑦𝑤𝑜𝑟𝑑"
 }
 },

 onStart: async function ({ message, event, args, getLang }) {
 try {
 // Show loading message
 await message.reply(getLang("loading"));
 
 // Fetch Ghibli films
 const { data: films } = await axios.get('https://ghibliapi.vercel.app/films');
 
 let selectedFilm;
 if (args.length > 0) {
 // Search films if keyword provided
 const keyword = args.join(' ').toLowerCase();
 const matchedFilms = films.filter(film => 
 film.title.toLowerCase().includes(keyword) ||
 film.original_title.toLowerCase().includes(keyword) ||
 film.director.toLowerCase().includes(keyword)
 );
 
 if (matchedFilms.length === 0) {
 return message.reply(getLang("noResult"));
 }
 selectedFilm = matchedFilms[Math.floor(Math.random() * matchedFilms.length)];
 } else {
 // Get random film if no keyword
 selectedFilm = films[Math.floor(Math.random() * films.length)];
 }

 // Format the result
 const response = getLang(
 "result",
 selectedFilm.title,
 selectedFilm.release_date,
 selectedFilm.director,
 selectedFilm.rt_score,
 selectedFilm.description
 );

 // Send result with image attachment if available
 if (selectedFilm.image) {
 await message.reply({
 body: response,
 attachment: await global.utils.getStreamFromURL(selectedFilm.image)
 });
 } else {
 await message.reply(response);
 }

 } catch (error) {
 console.error(error);
 await message.reply("𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝐺ℎ𝑖𝑏𝑙𝑖 𝑓𝑖𝑙𝑚𝑠 😢");
 }
 }
};
