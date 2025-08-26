const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const moment = require('moment');

module.exports.config = {
    name: "pay",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💰 𝑻𝒓𝒂𝒏𝒔𝒇𝒆𝒓 𝒎𝒐𝒏𝒆𝒚 𝒘𝒊𝒕𝒉 𝒔𝒕𝒚𝒍𝒊𝒔𝒉 𝒓𝒆𝒄𝒆𝒊𝒑𝒕𝒔",
    category: "economy",
    usages: "[@𝒕𝒂𝒈] [𝒂𝒎𝒐𝒖𝒏𝒕]",
    cooldowns: 15,
    dependencies: {
        "canvas": "",
        "moment": ""
    },
    envConfig: {
        taxRate: 0.15
    }
};

module.exports.languages = {
    "bn": {
        "missingTag": "💸 | 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒂𝒈 𝒕𝒉𝒆 𝒓𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕",
        "overTagLength": "⚠️ | 𝑶𝒏𝒍𝒚 𝒐𝒏𝒆 𝒓𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕 𝒂𝒍𝒍𝒐𝒘𝒆𝒅",
        "userNotExist": "❌ | 𝑹𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅 𝒊𝒏 𝒔𝒚𝒔𝒕𝒆𝒎",
        "invalidInput": "⚠️ | 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕 𝒆𝒏𝒕𝒆𝒓𝒆𝒅",
        "payerNotExist": "❌ | 𝑺𝒆𝒏𝒅𝒆𝒓 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏",
        "notEnoughMoney": "⚠️ | 𝑰𝒏𝒔𝒖𝒇𝒇𝒊𝒄𝒊𝒆𝒏𝒕 𝒃𝒂𝒍𝒂𝒏𝒄𝒆",
        "paySuccess": "💸 | 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓𝒓𝒆𝒅 %1$ (𝟏𝟓% 𝒕𝒂𝒙 𝒅𝒆𝒅𝒖𝒄𝒕𝒆𝒅) 𝒕𝒐: %2",
        "error": "❌ | 𝑻𝒓𝒂𝒏𝒔𝒇𝒆𝒓 𝒇𝒂𝒊𝒍𝒆𝒅, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏"
    },
    "en": {
        "missingTag": "💸 | 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒂𝒈 𝒕𝒉𝒆 𝒓𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕",
        "overTagLength": "⚠️ | 𝑶𝒏𝒍𝒚 𝒐𝒏𝒆 𝒓𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕 𝒂𝒍𝒍𝒐𝒘𝒆𝒅",
        "userNotExist": "❌ | 𝑹𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅 𝒊𝒏 𝒔𝒚𝒔𝒕𝒆𝒎",
        "invalidInput": "⚠️ | 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕 𝒆𝒏𝒕𝒆𝒓𝒆𝒅",
        "payerNotExist": "❌ | 𝑺𝒆𝒏𝒅𝒆𝒓 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏",
        "notEnoughMoney": "⚠️ | 𝑰𝒏𝒔𝒖𝒇𝒇𝒊𝒄𝒊𝒆𝒏𝒕 𝒃𝒂𝒍𝒂𝒏𝒄𝒆",
        "paySuccess": "💸 | 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓𝒓𝒆𝒅 %1$ (𝟏𝟓% 𝒕𝒂𝒙 𝒅𝒆𝒅𝒖𝒄𝒕𝒆𝒅) 𝒕𝒐: %2",
        "error": "❌ | 𝑻𝒓𝒂𝒏𝒔𝒇𝒆𝒓 𝒇𝒂𝒊𝒍𝒆𝒅, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏"
    }
};

async function generateReceipt(api, senderID, receiverID, amount, tax, net) {
    try {
        const width = 800;
        const height = 450;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#2c3e50');
        gradient.addColorStop(1, '#4a235a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Header
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, 80);
        
        // Title
        ctx.font = 'bold 36px "Segoe UI"';
        ctx.fillStyle = '#f1c40f';
        ctx.textAlign = 'center';
        ctx.fillText('💰 𝑷𝑨𝒀𝑴𝑬𝑵𝑻 𝑹𝑬𝑪𝑬𝑰𝑷𝑻', width/2, 55);
        
        // Border
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 3;
        ctx.strokeRect(20, 100, width-40, height-180);
        
        // Transaction details
        ctx.font = '24px "Segoe UI"';
        ctx.fillStyle = '#ecf0f1';
        ctx.textAlign = 'left';
        
        const detailsY = [150, 200, 250, 300, 350];
        ctx.fillText(`📅 𝑫𝒂𝒕𝒆: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`, 40, detailsY[0]);
        ctx.fillText(`💳 𝑺𝒆𝒏𝒅𝒆𝒓: ${(await api.getUserInfo(senderID))[senderID].name}`, 40, detailsY[1]);
        ctx.fillText(`👤 𝑹𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕: ${(await api.getUserInfo(receiverID))[receiverID].name}`, 40, detailsY[2]);
        ctx.fillText(`💵 𝑨𝒎𝒐𝒖𝒏𝒕: $${amount}`, 40, detailsY[3]);
        ctx.fillText(`📊 𝑵𝒆𝒕 𝑹𝒆𝒄𝒆𝒊𝒗𝒆𝒅: $${net} (${tax * 100}% 𝒕𝒂𝒙 𝒅𝒆𝒅𝒖𝒄𝒕𝒆𝒅)`, 40, detailsY[4]);
        
        // Updated footer with Asif Mahmud copyright
        ctx.font = 'italic 20px "Segoe UI"';
        ctx.fillStyle = '#bdc3c7';
        ctx.textAlign = 'center';
        ctx.fillText('© 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝑬𝒄𝒐𝒏𝒐𝒎𝒚 𝑺𝒚𝒔𝒕𝒆𝒎', width/2, height-15);
        
        // Save image
        const receiptPath = path.join(__dirname, 'cache', `pay_receipt_${Date.now()}.png`);
        if (!fs.existsSync(path.dirname(receiptPath))) {
            fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
        }
        
        const out = fs.createWriteStream(receiptPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        
        await new Promise((resolve, reject) => {
            out.on('finish', resolve);
            out.on('error', reject);
        });
        
        return receiptPath;
    } catch (e) {
        console.error('Receipt generation error:', e);
        return null;
    }
}

module.exports.onStart = async function ({ api, event, args, Currencies, Users, getText }) {
    try {
        const { threadID, messageID, senderID } = event;
        const { taxRate } = global.configModule[this.config.name].envConfig;
        let targetID, amount;
        
        // Argument processing
        if (!args[0]) return api.sendMessage(getText("missingTag"), threadID, messageID);
        if (Object.keys(event.mentions).length > 1) {
            return api.sendMessage(getText("overTagLength"), threadID, messageID);
        }
        
        // Get target user
        if (Object.keys(event.mentions).length === 1) {
            targetID = Object.keys(event.mentions)[0];
            amount = args[args.indexOf(event.mentions[targetID]) + 1];
        } else {
            targetID = args[0];
            amount = args[1];
        }
        
        // Validate user and amount
        if (!global.data.allUserID.includes(targetID)) {
            return api.sendMessage(getText("userNotExist"), threadID, messageID);
        }
        if (isNaN(amount) || amount < 1) {
            return api.sendMessage(getText("invalidInput"), threadID, messageID);
        }
        
        // Currency operations
        const payerData = await Currencies.getData(senderID);
        if (!payerData || !payerData.money) {
            return api.sendMessage(getText("payerNotExist"), threadID, messageID);
        }
        if (payerData.money < amount) {
            return api.sendMessage(getText("notEnoughMoney"), threadID, messageID);
        }
        
        const taxAmount = Math.floor(amount * taxRate);
        const netAmount = amount - taxAmount;
        
        await Currencies.decreaseMoney(senderID, parseInt(amount));
        await Currencies.increaseMoney(targetID, netAmount);
        
        // Generate receipt
        const receiverName = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
        const receiptPath = await generateReceipt(api, senderID, targetID, amount, taxRate, netAmount);
        
        // Send result
        const successMsg = getText("paySuccess", netAmount, `${receiverName}`);
        if (receiptPath) {
            api.sendMessage({
                body: successMsg,
                attachment: fs.createReadStream(receiptPath)
            }, threadID, () => fs.unlinkSync(receiptPath), messageID);
        } else {
            api.sendMessage(successMsg, threadID, messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage(getText("error"), threadID, messageID);
    }
};
