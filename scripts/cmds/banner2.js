const axios = require('axios');
const fs = require('fs-extra');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

// Define the toBI function for bold italic text
const toBI = (text) => {
  const map = {
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆',
    f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
    k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐',
    p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
    u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚',
    z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫',
    E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰',
    J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵',
    O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺',
    T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿',
    Y: '𝒀', Z: '𝒁', 
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
};

module.exports = {
  config: {
    name: "banner2",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    category: "media",
    shortDescription: {
      en: toBI("Banner creation tool")
    },
    longDescription: {
      en: toBI("Create custom anime banners with your name")
    },
    guide: {
      en: toBI("{p}banner2 [find/list] or reply to use")
    }
  },

  onStart: async function ({ event, message, args }) {
    try {
      const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
      
      if (args[0] == "find" || args[0] == "tìm") {
        if (!args[1]) {
          return message.reply(toBI("❎ Please provide a character ID. Use 'banner2 list' to see available characters"));
        }
        
        const character = lengthchar[args[1]];
        if (!character) {
          return message.reply(toBI("❎ Character not found. Use 'banner2 list' to see available characters"));
        }
        
        const imageStream = (await axios.get(character.imgAnime, { responseType: "stream" })).data;
        const msg = {
          body: toBI(`𝑪𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝑰𝑫: ${args[1]}, 𝑫𝒆𝒇𝒂𝒖𝒍𝒕 𝑪𝒐𝒍𝒐𝒓: ${character.colorBg}`),
          attachment: imageStream
        };
        return message.reply(msg);
      }
      else if (args[0] == "list") {
        const alime = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
        const count = alime.listAnime.length;
        const data = alime.listAnime;
        let page = parseInt(args[1]) || 1;
        page = page < 1 ? 1 : page;
        
        const limit = 20;
        const numPage = Math.ceil(count / limit);
        
        if (page > numPage) {
          return message.reply(toBI(`❎ Page ${page} doesn't exist. There are only ${numPage} pages`));
        }
        
        let msg = toBI("𝑨𝒏𝒊𝒎𝒆 𝑳𝒊𝒔𝒕:\n\n");
        const startIndex = limit * (page - 1);
        const endIndex = Math.min(startIndex + limit, count);
        
        for (let i = startIndex; i < endIndex; i++) {
          msg += `[ ${i + 1} ] - ${data[i].ID} | ${data[i].name}\n`;
        }
        
        msg += toBI(`\n𝑷𝒂𝒈𝒆 (${page}/${numPage})\n𝑼𝒔𝒆 ${global.config.PREFIX}banner2 list <𝒑𝒂𝒈𝒆 𝒏𝒖𝒎𝒃𝒆𝒓>`);
        return message.reply(msg);
      } 
      else {
        return message.reply(toBI("𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒕𝒉𝒊𝒔 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝒂 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝑰𝑫"), (err, info) => {
          global.client.handleReply.push({
            step: 1,
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
          });
        });
      }
    } catch (error) {
      console.error("Banner error:", error);
      return message.reply(toBI("❎ An error occurred. Please try again later"));
    }
  },

  onReply: async function({ event, message, Reply }) {
    try {
      if (event.senderID !== Reply.author) {
        return message.reply(toBI("❎ Access denied"));
      }

      const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;

      if (Reply.step === 1) {
        const characterId = event.body.trim();
        const character = lengthchar[characterId];
        
        if (!character) {
          return message.reply(toBI("❎ Invalid character ID. Please try again"), (err, info) => {
            global.client.handleReply.push({
              step: 1,
              name: this.config.name,
              author: event.senderID,
              messageID: info.messageID
            });
          });
        }

        message.unsend(Reply.messageID);
        return message.reply(toBI(`𝒀𝒐𝒖 𝒔𝒆𝒍𝒆𝒄𝒕𝒆𝒅: ${characterId}\n𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒏𝒂𝒎𝒆`), (err, info) => {
          global.client.handleReply.push({
            step: 2,
            name: this.config.name,
            chartid: characterId,
            author: event.senderID,
            messageID: info.messageID
          });
        });
      } 
      else if (Reply.step === 2) {
        message.unsend(Reply.messageID);
        return message.reply(toBI(`𝒀𝒐𝒖𝒓 𝒏𝒂𝒎𝒆: ${event.body}\n𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒄𝒐𝒍𝒐𝒓 𝒏𝒂𝒎𝒆 𝒐𝒓 𝒉𝒆𝒙 𝒄𝒐𝒅𝒆 (or type 'no' for default)`), (err, info) => {
          global.client.handleReply.push({
            step: 3,
            name: this.config.name,
            chartid: Reply.chartid,
            ten: event.body,
            author: event.senderID,
            messageID: info.messageID
          });
        });
      } 
      else if (Reply.step === 3) {
        message.unsend(Reply.messageID);
        
        const color = event.body.trim();
        const id = Reply.chartid;
        const title = Reply.ten;
        const character = lengthchar[id];
        
        if (!character) {
          return message.reply(toBI("❎ Character data not found"));
        }
        
        const color_ = (!color || color.toLowerCase() === "no") ? character.colorBg : color;
        
        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        // Define paths
        const pathImg = path.join(cacheDir, 'banner_output.png');
        const pathAva = path.join(cacheDir, 'character.png');
        const fontPath = path.join(cacheDir, 'MTOJamai.ttf');
        
        try {
          // Download font if missing
          if (!fs.existsSync(fontPath)) {
            const fontData = (await axios.get('https://github.com/hanakuUwU/font/raw/main/MTOJamai.ttf', { 
              responseType: 'arraybuffer' 
            })).data;
            fs.writeFileSync(fontPath, Buffer.from(fontData));
          }
          
          // Download character image
          const avtAnime = (await axios.get(character.imgAnime, { responseType: 'arraybuffer' })).data;
          fs.writeFileSync(pathAva, Buffer.from(avtAnime));
          
          // Download assets
          const assetUrls = [
            'https://lh3.googleusercontent.com/-tZ8DTN-bXEY/YhScBI5VuSI/AAAAAAAA5QI/8OxatfQvJU8q4TWk8vo9OWawDRn0aQhOACNcBGAsYHQ/s0/a1.png',
            'https://lh3.googleusercontent.com/-_GlhDWCWQLA/YhScA7so4UI/AAAAAAAA5QA/4NqayceKTTkbQrPT0Cu5TQCuEp-V95T3ACNcBGAsYHQ/s0/a2.png',
            'https://lh3.googleusercontent.com/-IiDSkRdLuK4/YhScA1Xd7WI/AAAAAAAA5QE/KlFoQuZpFc8W31A2C8-uUmXkpvLbmL6JQCNcBGAsYHQ/s0/a3.png',
            'https://lh3.googleusercontent.com/-jagDZ8l1rwc/YhSbpTKubAI/AAAAAAAA5P4/GYy2WICTkHAM0AoJvYhsLc6asVsnbAR2wCNcBGAsYHQ/s0/l1.png',
            'https://lh3.googleusercontent.com/-EE6U5xmi_QY/YhScRCT94XI/AAAAAAAA5QY/6WJM0j7URsgjisGTEN-tgOJ6NVx_Ql5-ACNcBGAsYHQ/s0/l2.png',
            'https://lh3.googleusercontent.com/-hkTkESFE1OU/YhSdWD3kR_I/AAAAAAAA5Qk/Fw4rwDc5CxEaLacLatZJLT6FAnm5dNYYACNcBGAsYHQ/s0/b1.png',
            'https://lh3.googleusercontent.com/-U-P92f1nTfk/YhSdVnqbEFI/AAAAAAAA5Qg/UgA37F2XTCY0u_Cu0fghfppITmPZIokFwCNcBGAsYHQ/s0/b2.png'
          ];
          
          const assetPaths = [];
          for (let i = 0; i < assetUrls.length; i++) {
            const assetPath = path.join(cacheDir, `asset_${i}.png`);
            const assetData = (await axios.get(assetUrls[i], { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(assetPath, Buffer.from(assetData));
            assetPaths.push(assetPath);
          }
          
          // Create banner
          const canvas = createCanvas(1080, 1920);
          const ctx = canvas.getContext('2d');
          
          // Load all images
          const [
            characterImage,
            ...assetImages
          ] = await Promise.all([
            loadImage(pathAva),
            ...assetPaths.map(path => loadImage(path))
          ]);
          
          // Draw background
          ctx.fillStyle = color_;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw assets
          ctx.drawImage(assetImages[0], 0, 0, canvas.width, canvas.height); // a1.png
          ctx.drawImage(characterImage, -100, -1000, 1700, 1700);
          ctx.drawImage(assetImages[3], 0, 0, canvas.width, canvas.height); // l1.png
          ctx.drawImage(assetImages[4], 0, 0, canvas.width, canvas.height); // l2.png
          ctx.drawImage(assetImages[1], 0, 0, canvas.width, canvas.height); // a2.png
          ctx.drawImage(assetImages[5], -50, 130, 800, 800); // b1.png
          ctx.drawImage(assetImages[6], 0, 0, canvas.width, canvas.height); // b2.png
          
          // Draw text
          registerFont(fontPath, { family: 'MTOJamai' });
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 80px MTOJamai';
          ctx.setTransform(1, -0.1, 0, 1, 0, 0);
          ctx.textAlign = 'center';
          ctx.shadowColor = '#000';
          ctx.shadowBlur = 10;
          
          for (let i = 0; i < 5; i++) {
            ctx.fillText(title, 370, 580);
          }
          
          // Reset transform
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          
          // Save image
          const buffer = canvas.toBuffer();
          fs.writeFileSync(pathImg, buffer);
          
          // Send result
          return message.reply({
            body: toBI("𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝒃𝒂𝒏𝒏𝒆𝒓:"),
            attachment: fs.createReadStream(pathImg)
          }, async () => {
            // Cleanup files
            try {
              fs.unlinkSync(pathImg);
              fs.unlinkSync(pathAva);
              assetPaths.forEach(assetPath => fs.unlinkSync(assetPath));
            } catch (cleanupError) {
              console.error('Cleanup error:', cleanupError);
            }
          });
        } catch (error) {
          console.error('Banner creation error:', error);
          return message.reply(toBI("❎ Error creating banner. Please try again later"));
        }
      }
    } catch (error) {
      console.error('Reply handler error:', error);
      return message.reply(toBI("❎ An error occurred. Please try again"));
    }
  }
};
