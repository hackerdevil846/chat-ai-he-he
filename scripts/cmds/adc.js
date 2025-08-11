module.exports.config = {
    name: "adc",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑", // Updated credits
    description: "𝑩𝒖𝒊𝒍𝒅𝒕𝒐𝒐𝒍𝒅𝒆𝒗 𝒂𝒖𝒓 𝑷𝒂𝒔𝒕𝒆𝒃𝒊𝒏 𝒔𝒆 𝒄𝒐𝒅𝒆 𝒂𝒑𝒍𝒂𝒊 𝒌𝒂𝒓𝒆𝒏", // Banglish description
    commandCategory: "Admin",
    usages: "[reply or text]",
    cooldowns: 0,
    dependencies: {
        "pastebin-api": "",
        "cheerio": "",
        "request": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const axios = require('axios');
    const fs = require('fs');
    const request = require('request');
    const cheerio = require('cheerio');
    const { join, resolve } = require("path");
    const { senderID, threadID, messageID, messageReply, type } = event;
    var name = args[0];
    if (type == "message_reply") {
        var text = messageReply.body;
    }
    if(!text && !name) return api.sendMessage('𝑷𝒍𝒆𝒂𝒔𝒆 𝒍𝒊𝒏𝒌 𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒌𝒂𝒓𝒐 𝒋𝒆𝒕𝒂 𝒄𝒐𝒅𝒆 𝒂𝒑𝒍𝒂𝒊 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒐 𝒂𝒕𝒐𝒃𝒂 𝒏𝒂𝒎 𝒍𝒆𝒌𝒉𝒐 𝒇𝒂𝒊𝒍𝒆𝒓 𝒏𝒂𝒎 𝒋𝒆𝒕𝒂 𝒑𝒂𝒔𝒕𝒆𝒃𝒊𝒏 𝒆 𝒖𝒑𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒃𝒐!', threadID, messageID);
    if(!text && name) {
        var data = fs.readFile(
          `${__dirname}/${args[0]}.js`,
          "utf-8",
          async (err, data) => {
            if (err) return api.sendMessage(`𝑪𝒐𝒎𝒎𝒂𝒏𝒅 ${args[0]} 𝒆𝒙𝒊𝒔𝒕 𝒌𝒐𝒓𝒆 𝒏𝒂!`, threadID, messageID);
            const { PasteClient } = require('pastebin-api')
            const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");
            async function pastepin(name) {
              const url = await client.createPaste({
                code: data,
                expireDate: 'N',
                format: "javascript",
                name: name,
                publicity: 1
              });
              var id = url.split('/')[3]
              return 'https://pastebin.com/raw/' + id
            }
            var link = await pastepin(args[1] || 'noname')
            return api.sendMessage(link, threadID, messageID);
          }
        );
        return
    }
    var urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    var url = text.match(urlR);
    if (url[0].indexOf('pastebin') !== -1) {
        axios.get(url[0]).then(i => {
            var data = i.data
            fs.writeFile(
                `${__dirname}/${args[0]}.js`,
                data,
                "utf-8",
                function (err) {
                    if (err) return api.sendMessage(`𝑪𝒐𝒅𝒆 ${args[0]}.js 𝒂𝒑𝒍𝒂𝒊 𝒌𝒐𝒓𝒂𝒓 𝒔𝒐𝒎𝒐𝒚 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒊𝒆𝒄𝒉𝒆!`, threadID, messageID);
                    api.sendMessage(`𝑪𝒐𝒅𝒆 ${args[0]}.js 𝒆 𝒂𝒑𝒍𝒂𝒊 𝒉𝒐𝒊𝒆𝒄𝒉𝒆, 𝒖𝒔𝒆 𝒌𝒐𝒓𝒕𝒆 𝒍𝒐𝒂𝒅 𝒄𝒐𝒎𝒎𝒂𝒏𝒅!`, threadID, messageID);
                }
            );
        })
    }

    if (url[0].indexOf('buildtool') !== -1 || url[0].indexOf('tinyurl.com') !== -1) {
        const options = {
            method: 'GET',
            url: messageReply.body
        };
        request(options, function (error, response, body) {
            if (error) return api.sendMessage('𝑺𝒐𝒅𝒉𝒐 𝒍𝒊𝒏𝒌 𝒆𝒊 𝒓𝒆𝒑𝒍𝒚 𝒌𝒂𝒓𝒐 (𝒍𝒊𝒏𝒌 𝒃𝒂𝒅𝒆 𝒂𝒓 𝒌𝒊𝒄𝒉𝒖 𝒏𝒂)', threadID, messageID);
            const load = cheerio.load(body);
            load('.language-js').each((index, el) => {
                if (index !== 0) return;
                var code = el.children[0].data
                fs.writeFile(`${__dirname}/${args[0]}.js`, code, "utf-8",
                    function (err) {
                        if (err) return api.sendMessage(`"${args[0]}.js" 𝒆 𝒏𝒐𝒕𝒖𝒏 𝒄𝒐𝒅𝒆 𝒂𝒑𝒍𝒂𝒊 𝒌𝒐𝒓𝒂𝒓 𝒔𝒐𝒎𝒐𝒚 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒊𝒆𝒄𝒉𝒆!`, threadID, messageID);
                        return api.sendMessage(`"${args[0]}.js" 𝒄𝒐𝒅𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒊𝒆𝒄𝒉𝒆, 𝒖𝒔𝒆 𝒌𝒐𝒓𝒕𝒆 𝒍𝒐𝒂𝒅 𝒄𝒐𝒎𝒎𝒂𝒏𝒅!`, threadID, messageID);
                    }
                );
            });
        });
        return
    }
    if (url[0].indexOf('drive.google') !== -1) {
      var id = url[0].match(/[-\w]{25,}/)
      const path = resolve(__dirname, `${args[0]}.js`);
      try {
        await utils.downloadFile(`https://drive.google.com/u/0/uc?id=${id}&export=download`, path);
        return api.sendMessage(`"${args[0]}.js" 𝒄𝒐𝒅𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒊𝒆𝒄𝒉𝒆, 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒍𝒆 𝒅𝒓𝒊𝒗𝒆 𝒇𝒂𝒊𝒍𝒆 𝒕𝒙𝒕 𝒕𝒆 𝒄𝒉𝒂𝒏𝒈𝒆 𝒌𝒐𝒓𝒐!`, threadID, messageID);
      }
      catch(e) {
        return api.sendMessage(`"${args[0]}.js" 𝒆 𝒏𝒐𝒕𝒖𝒏 𝒄𝒐𝒅𝒆 𝒂𝒑𝒍𝒂𝒊 𝒌𝒐𝒓𝒂𝒓 𝒔𝒐𝒎𝒐𝒚 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒊𝒆𝒄𝒉𝒆!`, threadID, messageID);
      }
    }
}
