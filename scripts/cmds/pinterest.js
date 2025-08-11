module.exports.config = {
    name: "pinterest",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑰𝒎𝒂𝒈𝒆 𝒌𝒉𝒐𝒏𝒋𝒂𝒓 𝒌𝒂𝒋",
    commandCategory: "khoj",
    usePrefix: false,
    usages: "[Text]",
    cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const keySearch = args.join(" ");
    
    if(keySearch.includes("-") == false) 
        return api.sendMessage('𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒇𝒐𝒓𝒎𝒂𝒕 𝒆 𝒍𝒊𝒌𝒉𝒖𝒏: 𝒑𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 𝑷𝒓𝒊𝒚𝒂𝒏𝒔𝒉 - 10 (𝒂𝒑𝒏𝒊 𝒋𝒐𝒕𝒐 𝒄𝒉𝒂𝒊 𝒕𝒐𝒕𝒐 𝒊𝒎𝒂𝒈𝒆 𝒅𝒆𝒌𝒉𝒂𝒃𝒆)', event.threadID, event.messageID);
    
    const keySearchs = keySearch.substr(0, keySearch.indexOf('-'));
    const numberSearch = keySearch.split("-").pop() || 6;
    
    const res = await axios.get(`https://api-dien.kira1011.repl.co/pinterest?search=${encodeURIComponent(keySearchs)}`);
    const data = res.data.data;
    
    var num = 0;
    var imgData = [];
    
    for (var i = 0; i < parseInt(numberSearch); i++) {
        let path = __dirname + `/cache/${num += 1}.jpg`;
        let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
        imgData.push(fs.createReadStream(path));
    }
    
    api.sendMessage({
        body: `${numberSearch} 𝑻𝒂 𝒌𝒉𝒐𝒏𝒋𝒂𝒓 𝒓𝒆𝒔𝒖𝒍𝒕 𝒌𝒆𝒚𝒘𝒐𝒓𝒅 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐: ${keySearchs}`,
        attachment: imgData
    }, event.threadID, (err) => {
        if (err) console.error(err);
        for (let ii = 1; ii <= parseInt(numberSearch); ii++) {
            fs.unlinkSync(__dirname + `/cache/${ii}.jpg`);
        }
    }, event.messageID);
};
