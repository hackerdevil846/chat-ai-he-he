module.exports.config = {
    name: "dogfact",
    version: "1.0.0",
    hasPermision: 0,
    credit: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝒓𝒂𝒏𝒅𝒐𝒎 𝒅𝒐𝒈 𝒊𝒎𝒂𝒈𝒆 𝒂𝒏𝒅 𝒇𝒂𝒄𝒕",
    commandCategory: "𝒓𝒂𝒏𝒅𝒐𝒎-𝒊𝒎𝒈",
    cooldowns: 0,
};

module.exports.run = async function({api, event, args, utils, Users, Threads}) {
    try {
        let axios = require('axios');
        let fs = require("fs-extra");
        let request = require("request");
        let {threadID, senderID, messageID} = event;
	const res = await axios.get(`https://some-random-api.ml/animal/dog`);
	var data = res.data;
	let callback = function() {
            return api.sendMessage({
                body:`𝑫𝒐𝒈 𝒇𝒂𝒄𝒕: ${data.fact}`,
                attachment: fs.createReadStream(__dirname + `/cache/image.png`)
            }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/image.png`), event.messageID);
        };
		return request(encodeURI(data.image)).pipe(fs.createWriteStream(__dirname + `/cache/image.png`)).on("close", callback);
		} catch (err) {
        console.log(err)
        return api.sendMessage(`𝑬𝒓𝒓𝒐𝒓 𝒉𝒐𝒊𝒚𝒆𝒄𝒉𝒆, 𝒅𝒆𝒌𝒉𝒐 𝒌𝒆𝒏𝒐?`, event.threadID)
    }
}
