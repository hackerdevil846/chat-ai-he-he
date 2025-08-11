const axios = global.nodemodule["axios"];

module.exports.config = {
    name: "game",
    version: "1.1.8",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑵𝒊𝒋𝒆𝒓 𝒎𝒆𝒔𝒔𝒆𝒏𝒈𝒆𝒓 𝒆 𝒄𝒂𝒕𝒄𝒉𝒑𝒉𝒓𝒂𝒔𝒆 𝒅𝒉𝒐𝒓𝒂𝒓 𝒌𝒉𝒆𝒍𝒂!!!",
    commandCategory: "Entertainment",
    usages: "𝑫𝒖𝒊 𝒅𝒉𝒐𝒓𝒐𝒏𝒆𝒓 𝒎𝒐𝒅𝒅𝒉𝒆 𝒆𝒌𝒕𝒂 𝒃𝒆𝒄𝒉𝒆 𝒏𝒊𝒏 [1/2]",
    cooldowns: 0
};

module.exports.handleReply = async function ({
    args,
    event,
    Users,
    api,
    handleReply,
    Currencies
}) {
    var {
        tukhoa
    } = handleReply;
    const coinsup = 200;
    switch (handleReply.type) {
    case "choosee": {
        switch (event.body) {
        case "2": {
            api.unsendMessage(handleReply.messageID);
            const res = await axios.get(`https://raw.githubusercontent.com/J-JRT/Judas-Bot-dep/main/data/anh.json`);
            let length1 = res.data.doanhinh.length
            let dataGame = res.data.doanhinh[Math.floor(Math.random() * length1)];
            var tukhoadung = dataGame.tukhoa;
            let fs = global.nodemodule["fs-extra"];
            let sokitu = dataGame.sokitu;
            let anh1 = dataGame.link1;
            let anh2 = dataGame.link2;
            let Avatar = (await axios.get(anh1, {
                responseType: "arraybuffer"
            })).data;
            fs.writeFileSync(__dirname + "/cache/anh1.png", Buffer.from(Avatar, "utf-8"));
            let Avatar2 = (await axios.get(anh2, {
                responseType: "arraybuffer"
            })).data;
            fs.writeFileSync(__dirname + "/cache/anh2.png", Buffer.from(Avatar2, "utf-8"));
            var imglove = [];
            imglove.push(fs.createReadStream(__dirname + "/cache/anh1.png"));
            imglove.push(fs.createReadStream(__dirname + "/cache/anh2.png"));
            var msg = {
                body: `*🆁🅴🅿🅻🆈 🔄 𝙠𝙤𝙧𝙚 𝙨𝙤𝙩𝙝𝙞𝙠 𝙪𝙩𝙩𝙤𝙧 𝙩𝙞 𝙙𝙞𝙣*.\n*Sothik uttorer clue: ${sokitu}*`,
                attachment: imglove
            }
            return api.sendMessage(msg, event.threadID, (err, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    tukhoa: tukhoadung,
                    type: "doanhinh"
                })
            })
        }
        case "1": {
            api.unsendMessage(handleReply.messageID);
            const res = await axios.get(`https://raw.githubusercontent.com/J-JRT/Judas-Bot-dep/main/data/data.json`);
            let length2 = res.data.tukhoa.length
            let dataGame = res.data.tukhoa[Math.floor(Math.random() * length2)];
            var tukhoadung = dataGame.tukhoa;
            let fs = global.nodemodule["fs-extra"];
            let sokitu = dataGame.sokitu;
            let anh1 = dataGame.link1;
            let Avatar = (await axios.get(anh1, {
                responseType: "arraybuffer"
            })).data;
            fs.writeFileSync(__dirname + "/cache/anh1.png", Buffer.from(Avatar, "utf-8"));
            var imglove = [];
            imglove.push(fs.createReadStream(__dirname + "/cache/anh1.png"));
            var msg = {
                body: `*🆁🅴🅿🅻🆈 🔄 𝙠𝙤𝙧𝙚 𝙨𝙤𝙩𝙝𝙞𝙠 𝙪𝙩𝙩𝙤𝙧 𝙩𝙞 𝙙𝙞𝙣*.\n*Sothik uttorer clue: ${sokitu}*`,
                attachment: imglove
            }
            return api.sendMessage(msg, event.threadID, (err, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    tukhoa: tukhoadung,
                    type: "doanvan"
                })
            })
        }
        }
        const choose = parseInt(event.body);
        if (isNaN(event.body)) return api.sendMessage("Dayakore 1 othoba 2 select korun", event.threadID, event.messageID);
        if (choose > 2 || choose < 1) return api.sendMessage("Option ti khuje paoa jaini.", event.threadID, event.messageID);
    }
    case "doanvan": {
        const dapan = event.body
        if (dapan.toLowerCase() == tukhoa) {
            await Currencies.increaseMoney(event.senderID, parseInt(coinsup));
            var name1 = await Users.getData(event.senderID)
            return setTimeout(function () {
                api.unsendMessage(handleReply.messageID)
            }, 30000), api.sendMessage(`*🎉Ovinondon ${name1.name} apni sothik uttor diyechen🎉*\n*Sothik uttor: ${tukhoa}*\n*Apni ${coinsup}$ jitychen*`, event.threadID, event.messageID)
        } else
            return api.sendMessage(`*Vul uttor, abar chesta korun*`, event.threadID, event.messageID);
    }
    case "doanhinh": {
        const dapan1 = event.body
        if (dapan1.toLowerCase() == tukhoa) {
            await Currencies.increaseMoney(event.senderID, parseInt(coinsup));
            var name1 = await Users.getData(event.senderID)
            return setTimeout(function () {
                api.unsendMessage(handleReply.messageID)
            }, 30000), api.sendMessage(`*🎉Ovinondon ${name1.name} apni sothik uttor diyechen🎉*\n*Sothik uttor: ${tukhoa}*\n*Apni ${coinsup}$ jitychen*`, event.threadID, event.messageID)
        } else
            return api.sendMessage(`*Vul uttor, abar chesta korun*`, event.threadID, event.messageID);
    }
    }
}

module.exports.run = async function ({
    args,
    api,
    event,
    Users
}) {
    if (this.config.credits != "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅") return api.sendMessage('Credit poriborton kora hoyeche!', event.threadID, event.messageID);
    if (!args[0]) return api.sendMessage("Dayakore 1 othoba 2 select korun\n1: Chobi khuje ber korar jonno okkhor chase korun.\n2: Shobdo khuje ber korar jonno chobi chase korun.", event.threadID, (err, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "choosee"
        })
    })
    if (args[0] == "1") {
        const res = await axios.get(`https://raw.githubusercontent.com/J-JRT/Judas-Bot-dep/main/data/data.json`);
        let length2 = res.data.tukhoa.length
        let dataGame = res.data.tukhoa[Math.floor(Math.random() * length2)];
        var tukhoadung = dataGame.tukhoa;
        let fs = global.nodemodule["fs-extra"];
        let sokitu = dataGame.sokitu;
        let anh1 = dataGame.link1;
        let Avatar = (await axios.get(anh1, {
            responseType: "arraybuffer"
        })).data;
        fs.writeFileSync(__dirname + "/cache/anh1.png", Buffer.from(Avatar, "utf-8"));
        var imglove = [];
        imglove.push(fs.createReadStream(__dirname + "/cache/anh1.png"));
        var msg = {
            body: `*🆁🅴🅿🅻🆈 🔄 𝙠𝙤𝙧𝙚 𝙨𝙤𝙩𝙝𝙞𝙠 𝙪𝙩𝙩𝙤𝙧 𝙩𝙞 𝙙𝙞𝙣*.\n*Sothik uttorer clue: ${sokitu}*`,
            attachment: imglove
        }
        return api.sendMessage(msg, event.threadID, (err, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                tukhoa: tukhoadung,
                type: "doanvan"
            })
        })
    }
    if (args[0] == "2") {
        const res = await axios.get(`https://raw.githubusercontent.com/J-JRT/Judas-Bot-dep/main/data/anh.json`);
        let length1 = res.data.doanhinh.length
        let dataGame = res.data.doanhinh[Math.floor(Math.random() * length1)];
        var tukhoadung = dataGame.tukhoa;
        let fs = global.nodemodule["fs-extra"];
        let sokitu = dataGame.sokitu;
        let anh1 = dataGame.link1;
        let anh2 = dataGame.link2;
        let Avatar = (await axios.get(anh1, {
            responseType: "arraybuffer"
        })).data;
        fs.writeFileSync(__dirname + "/cache/anh1.png", Buffer.from(Avatar, "utf-8"));
        let Avatar2 = (await axios.get(anh2, {
            responseType: "arraybuffer"
        })).data;
        fs.writeFileSync(__dirname + "/cache/anh2.png", Buffer.from(Avatar2, "utf-8"));
        var imglove = [];
        imglove.push(fs.createReadStream(__dirname + "/cache/anh1.png"));
        imglove.push(fs.createReadStream(__dirname + "/cache/anh2.png"));
        var msg = {
            body: `*🆁🅴🅿🅻🆈 🔄 𝙠𝙤𝙧𝙚 𝙨𝙤𝙩𝙝𝙞𝙠 𝙪𝙩𝙩𝙤𝙧 𝙩𝙞 𝙙𝙞𝙣*.\n*Sothik uttorer clue: ${sokitu}*`,
            attachment: imglove
        }
        return api.sendMessage(msg, event.threadID, (err, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                tukhoa: tukhoadung,
                type: "doanhinh"
            })
        })
    }
}
