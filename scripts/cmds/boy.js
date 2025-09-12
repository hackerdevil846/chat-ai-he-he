const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "boy",
    aliases: ["boys", "male"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 0,
    category: "random-img",
    shortDescription: {
        en: "𝑆𝑒𝑛𝑑 𝑟𝑎𝑛𝑑𝑜𝑚 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑏𝑜𝑦 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑏𝑜𝑦 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    guide: {
        en: "{p}boy"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "success": "📸✨ 𝐵𝑂𝑌 𝐹𝐵 𝑃𝑅𝑂𝐹𝐼𝐿𝐸 𝐼𝑀𝐺",
        "error": "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
    }
};

module.exports.onLoad = async function () {
    const cachePath = path.join(__dirname, "cache");
    try {
        await fs.ensureDir(cachePath);
    } catch (e) {
        console.error("𝐵𝑜𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑜𝑛𝐿𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", e);
    }
};

module.exports.onStart = async function ({ message, event }) {
    try {
        const imageLinks = [
            "https://i.imgur.com/oq4f87f.jpg",
            "https://i.imgur.com/epThBlZ.jpg",
            "https://i.imgur.com/wMBN6K7.jpg",
            "https://i.imgur.com/2atpJzj.jpg",
            "https://i.imgur.com/7JLuYbu.jpg",
            "https://i.imgur.com/00YvDcR.jpg",
            "https://i.imgur.com/rOa63Tq.jpg",
            "https://i.imgur.com/kBL2l1P.jpg",
            "https://i.imgur.com/DKYQ7kV.jpg",
            "https://i.imgur.com/BBLEhmS.jpg",
            "https://i.imgur.com/oYdndAt.jpg",
            "https://i.imgur.com/V8XWjx2.jpg",
            "https://i.imgur.com/eURx7sM.jpg",
            "https://i.imgur.com/usTg8Zp.jpg",
            "https://i.imgur.com/RJyW8Gn.jpg",
            "https://i.imgur.com/eycBp5h.jpg",
            "https://i.imgur.com/NjJbvT6.jpg",
            "https://i.imgur.com/HS5aQTq.jpg",
            "https://i.imgur.com/J6fStUC.jpg",
            "https://i.imgur.com/EZfeHFM.jpg",
            "https://i.imgur.com/U5eUBs9.jpg",
            "https://i.imgur.com/lyLPIvT.jpg",
            "https://i.imgur.com/977wThF.jpg",
            "https://i.imgur.com/zOdlDvr.jpg",
            "https://i.imgur.com/Irqu6CX.jpg",
            "https://i.imgur.com/EEdAqZY.jpg",
            "https://i.imgur.com/aXmbFnV.jpg",
            "https://i.imgur.com/BLf7EAY.jpg",
            "https://i.imgur.com/PYERMm2.jpg",
            "https://i.imgur.com/DktkKNY.jpg",
            "https://i.imgur.com/wPnudiZ.jpg",
            "https://i.imgur.com/mAmTQ78.jpg",
            "https://i.imgur.com/TNtKGrL.jpg",
            "https://i.imgur.com/dkK3sB1.jpg",
            "https://i.imgur.com/2hxfzz6.jpg",
            "https://i.imgur.com/NUEheJr.jpg",
            "https://i.imgur.com/LoyYI0k.jpg",
            "https://i.imgur.com/7PFQp1P.jpg",
            "https://i.imgur.com/OvuYqkr.jpg",
            "https://i.imgur.com/Fo4P7nO.jpg",
            "https://i.imgur.com/VIuhjbp.jpg",
            "https://i.imgur.com/oveMzon.jpg",
            "https://i.imgur.com/G7J5wD0.jpg",
            "https://i.imgur.com/t4q8vJ0.jpg",
            "https://i.imgur.com/gCnua3O.jpg",
            "https://i.imgur.com/T3GhJfg.jpg",
            "https://i.imgur.com/bQeTvch.jpg",
            "https://i.imgur.com/rmILT2x.jpg",
            "https://i.imgur.com/sUEjhO0.jpg",
            "https://i.imgur.com/Toyb6aR.jpg",
            "https://i.imgur.com/p9N93oR.jpg",
            "https://i.imgur.com/0VF3Rqj.jpg",
            "https://i.imgur.com/ycjEuIF.jpg",
            "https://i.imgur.com/KxcOPHy.jpg",
            "https://i.imgur.com/KpE2es2.jpg",
            "https://i.imgur.com/QdB4Nni.jpg",
            "https://i.imgur.com/TVTziiP.jpg",
            "https://i.imgur.com/a9mcRfZ.jpg",
            "https://i.imgur.com/LWR2bDd.jpg",
            "https://i.imgur.com/hFtWZYZ.jpg",
            "https://i.imgur.com/gM45t43.jpg",
            "https://i.imgur.com/ekSjTwU.jpg",
            "https://i.imgur.com/Z8kwShy.jpg",
            "https://i.imgur.com/BPNa18o.jpg",
            "https://i.imgur.com/uGRPBwz.jpg",
            "https://i.imgur.com/ZzOU9Ms.jpg",
            "https://i.imgur.com/HWnAgZZ.jpg",
            "https://i.imgur.com/dbF5Oip.jpg",
            "https://i.imgur.com/MIfi3MD.jpg",
            "https://i.imgur.com/uXX8dbd.jpg",
            "https://i.imgur.com/aQkI19u.jpg",
            "https://i.imgur.com/Op8acRb.jpg",
            "https://i.imgur.com/zcv9LxC.jpg",
            "https://i.imgur.com/94eKE2j.jpg",
            "https://i.imgur.com/pr7zPjP.jpg",
            "https://i.imgur.com/VERHJ4v.jpg",
            "https://i.imgur.com/aYLfyTh.jpg",
            "https://i.imgur.com/UF5GhpP.jpg",
            "https://i.imgur.com/jpXOVGi.jpg",
            "https://i.imgur.com/bxl0osW.jpg",
            "https://i.imgur.com/bjYYC8v.jpg",
            "https://i.imgur.com/PGFGVxi.jpg",
            "https://i.imgur.com/0JtVVTF.jpg",
            "https://i.imgur.com/oGh17sb.jpg",
            "https://i.imgur.com/8l4VZa8.jpg",
            "https://i.imgur.com/mQDizCa.jpg",
            "https://i.imgur.com/Fi2d9S3.jpg",
            "https://i.imgur.com/nK4PCSD.jpg",
            "https://i.imgur.com/POB92dR.jpg",
            "https://i.imgur.com/yiEXFb0.jpg",
            "https://i.imgur.com/pVBzeht.jpg",
            "https://i.imgur.com/fbhmUDO.jpg",
            "https://i.imgur.com/0kCGT5p.jpg",
            "https://i.imgur.com/Q2IOc17.jpg",
            "https://i.imgur.com/ObXNJZ5.jpg",
            "https://i.imgur.com/rI2MIYF.jpg",
            "https://i.imgur.com/ANhek4x.jpg",
            "https://i.imgur.com/AgNYAr6.jpg",
            "https://i.imgur.com/MmovRWq.jpg",
            "https://i.imgur.com/eEH8W2P.jpg",
            "https://i.imgur.com/tZlXawA.jpg",
            "https://i.imgur.com/QhlqGb1.jpg",
            "https://i.imgur.com/BQDcmQ7.jpg",
            "https://i.imgur.com/A2bkbNb.jpg",
            "https://i.imgur.com/ncg20xm.jpg",
            "https://i.imgur.com/jVxUXTK.jpg",
            "https://i.imgur.com/sJvWPWK.jpg",
            "https://i.imgur.com/ReJPvHq.jpg",
            "https://i.imgur.com/asKxDK8.jpg",
            "https://i.imgur.com/FJNdTMe.jpg",
            "https://i.imgur.com/dQg3YHi.jpg",
            "https://i.imgur.com/RiNrjIO.jpg",
            "https://i.imgur.com/olfWeCl.jpg",
            "https://i.imgur.com/2Hx0Bff.jpg",
            "https://i.imgur.com/xUVu8UA.jpg",
            "https://i.imgur.com/s3t1Aag.jpg",
            "https://i.imgur.com/koQjHE8.jpg",
            "https://i.imgur.com/7cYzLYP.jpg",
            "https://i.imgur.com/VHoGuJS.jpg",
            "https://i.imgur.com/D0Yk3cA.jpg",
            "https://i.imgur.com/gMoTt6l.jpg",
            "https://i.imgur.com/raUIgUZ.jpg",
            "https://i.imgur.com/wh5c2F8.jpg",
            "https://i.imgur.com/5lQBE5S.jpg",
            "https://i.imgur.com/ytlBQar.jpg",
            "https://i.imgur.com/IBY0JJ1.jpg",
            "https://i.imgur.com/SN9dO2X.jpg",
            "https://i.imgur.com/CURZ2xi.jpg",
            "https://i.imgur.com/pI2yFKW.jpg",
            "https://i.imgur.com/xZTrxXX.jpg",
            "https://i.imgur.com/hncJisT.jpg",
            "https://i.imgur.com/NdB4Jpv.jpg",
            "https://i.imgur.com/TFwWRzh.jpg",
            "https://i.imgur.com/qUQACV6.jpg",
            "https://i.imgur.com/WFSU1Fg.jpg",
            "https://i.imgur.com/0C6OMog.jpg",
            "https://i.imgur.com/XRNqQwD.jpg",
            "https://i.imgur.com/JMAQfKP.jpg",
            "https://i.imgur.com/Dm7H99b.jpg",
            "https://i.imgur.com/ljSjY66.jpg",
            "https://i.imgur.com/zgGE7XX.jpg",
            "https://i.imgur.com/wvIRzqH.jpg",
            "https://i.imgur.com/wCqcDtS.jpg",
            "https://i.imgur.com/7sefpqA.jpg",
            "https://i.imgur.com/gaNJLgU.jpg",
            "https://i.imgur.com/K5RfFYF.jpg",
            "https://i.imgur.com/BFuXq0I.jpg"
        ];

        const randomLink = imageLinks[Math.floor(Math.random() * imageLinks.length)];
        const cachePath = path.join(__dirname, "cache");
        await fs.ensureDir(cachePath);

        const imagePath = path.join(cachePath, `boy_${Date.now()}.jpg`);
        const response = await axios.get(randomLink, { responseType: "arraybuffer" });

        await fs.writeFile(imagePath, Buffer.from(response.data, "binary"));

        const messageBody = module.exports.languages["en"].success;

        await message.reply({
            body: messageBody + " 🔁",
            attachment: fs.createReadStream(imagePath)
        });

        try {
            if (fs.existsSync(imagePath)) {
                await fs.unlink(imagePath);
            }
        } catch (e) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 𝑡𝑒𝑚𝑝 𝑖𝑚𝑎𝑔𝑒:", e);
        }

    } catch (err) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑏𝑜𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", err);
        try {
            await message.reply(module.exports.languages["en"].error);
        } catch (e) {
            console.error("𝐴𝑙𝑠𝑜 𝑓𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑒𝑟𝑟𝑜𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", e);
        }
    }
};
