module.exports.config = {
    name: "imgsearch",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑰𝒎𝒂𝒈𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒌𝒐𝒓𝒖𝒏",
    commandCategory: "monoronjon",
    usages: "[Text]",
    cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const keySearch = args.join(" ");
    
    if(keySearch.includes("-") == false) {
        return api.sendMessage('𝑫𝒆𝒌𝒉𝒐 𝒆𝒊 𝒃𝒉𝒂𝒃𝒆 𝒍𝒊𝒌𝒉𝒖𝒏: 𝒌𝒆𝒚𝒘𝒐𝒓𝒅 𝒕𝒂 𝒔𝒆𝒂𝒓𝒄𝒉 𝒌𝒐𝒓𝒃𝒐 - 𝒋𝒆𝒕𝒐 𝒈𝒖𝒍𝒊 𝒄𝒉𝒂𝒊', event.threadID, event.messageID);
    }
    
    const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
    const numberSearch = keySearch.split("-").pop().trim() || 6;
    
    try {
        const res = await axios.get(`https://api.ndtmint.repl.co/pinterest?search=${encodeURIComponent(keySearchs)}`);
        const data = res.data.data;
        var num = 0;
        var imgData = [];
        
        for (var i = 0; i < Math.min(parseInt(numberSearch), data.length); i++) {
            let path = __dirname + `/cache/${num += 1}.jpg`;
            let getDown = (await axios.get(data[i], { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
            imgData.push(fs.createReadStream(path));
        }
        
        api.sendMessage({
            attachment: imgData,
            body: `𝑺𝒂𝒎𝒂𝒏 ${numberSearch} 𝒕𝒊 𝒏𝒊𝒚𝒐𝒏 𝒌𝒐𝒓𝒆 𝒕𝒖𝒎𝒊 𝒔𝒆𝒂𝒓𝒄𝒉 𝒌𝒐𝒓𝒂: ${keySearchs}`
        }, event.threadID, (err) => {
            if (err) console.log(err);
            // Cleanup cache files
            for (let ii = 1; ii <= num; ii++) {
                fs.unlinkSync(__dirname + `/cache/${ii}.jpg`);
            }
        }, event.messageID);
        
    } catch (error) {
        api.sendMessage("𝑨𝒎𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒚𝒆𝒄𝒉𝒆, 𝒂𝒈𝒂𝒃𝒂𝒓 𝒕𝒓𝒚 𝒌𝒐𝒓𝒖𝒏 😢", event.threadID, event.messageID);
        console.log(error);
    }
};
