module.exports.config = {
    name: "mail10p",
    aliases: ["tempemail", "10minmail"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 0,
    category: "utility",
    shortDescription: {
        en: "𝐺𝑒𝑡 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 10-𝑚𝑖𝑛𝑢𝑡𝑒 𝑚𝑎𝑖𝑙"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎𝑛𝑑 𝑚𝑎𝑛𝑎𝑔𝑒 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑒𝑚𝑎𝑖𝑙 𝑎𝑐𝑐𝑜𝑢𝑛𝑡𝑠 𝑡ℎ𝑎𝑡 𝑒𝑥𝑝𝑖𝑟𝑒 𝑎𝑓𝑡𝑒𝑟 10 𝑚𝑖𝑛𝑢𝑡𝑒𝑠"
    },
    guide: {
        en: "{p}mail10p [𝑛𝑒𝑤/𝑙𝑖𝑠𝑡/𝑚𝑜𝑟𝑒/𝑔𝑒𝑡/𝑐ℎ𝑒𝑐𝑘]"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    const axios = require("axios");
    
    try {
        if (args[0] == "new") {
            const res = await axios.get(`https://10minutemail.net/address.api.php?new=1`);
            var user = res.data.mail_get_user;
            var host = res.data.mail_get_host;
            var time = res.data.mail_get_time;
            var stime = res.data.mail_server_time;
            var kmail = res.data.mail_get_key;
            var ltime = res.data.mail_left_time;
            var mid = res.data.mail_list[0].mail_id;
            var sub = res.data.mail_list[0].subject;
            var date = res.data.mail_list[0].datetime2;
            
            return message.reply(`» 𝑀𝑎𝑖𝑙 𝑛𝑎𝑚𝑒: ${user}\n» 𝐻𝑜𝑠𝑡: ${host}\n» 𝑀𝑎𝑖𝑙 ${user}@${host} (.)𝑐𝑜𝑚\n» 𝑇𝑖𝑚𝑒: ${time}\n» 𝑆𝑒𝑟𝑣𝑒𝑟 𝑡𝑖𝑚𝑒: ${stime}\n» 𝐾𝑒𝑦: ${kmail}\n» 𝑇𝑖𝑚𝑒 𝑙𝑒𝑓𝑡: ${ltime}𝑠\n» 𝑀𝑎𝑖𝑙 𝑖𝑑: ${mid}\n» 𝐶𝑜𝑛𝑡𝑒𝑛𝑡 ${sub}\n» 𝐷𝑎𝑡𝑒: ${date}`);
        }
        else if (args[0] == "list") {
            const res = await axios.get(`https://www.phamvandienofficial.xyz/mail10p/domain`);
            var list = res.data.domain;
            return message.reply(`𝐷𝑜𝑚𝑎𝑖𝑛 𝑙𝑖𝑠𝑡: \n${list}`);
        }
        else if (args[0] == "more") {
            const res = await axios.get(`https://10minutemail.net/address.api.php?more=1`);
            var user = res.data.mail_get_user;
            var host = res.data.mail_get_host;
            var time = res.data.mail_get_time;
            var stime = res.data.mail_server_time;
            var kmail = res.data.mail_get_key;
            var ltime = res.data.mail_left_time;
            var mid = res.data.mail_list[0].mail_id;
            var sub = res.data.mail_list[0].subject;
            var date = res.data.mail_list[0].datetime2;
            return message.reply(`» 𝑀𝑎𝑖𝑙 𝑛𝑎𝑚𝑒: ${user}\n» 𝐻𝑜𝑠𝑡: ${host}\n» 𝑀𝑎𝑖𝑙 ${user}@${host} (.)𝑐𝑜𝑚\n» 𝑇𝑖𝑚𝑒: ${time}\n» 𝑆𝑒𝑟𝑣𝑒𝑟 𝑡𝑖𝑚𝑒: ${stime}\n» 𝐾𝑒𝑦: ${kmail}\n» 𝑇𝑖𝑚𝑒 𝑙𝑒𝑓𝑡: ${ltime}𝑠\n» 𝑀𝑎𝑖𝑙 𝑖𝑑: ${mid}\n» 𝐶𝑜𝑛𝑡𝑒𝑛𝑡 ${sub}\n» 𝐷𝑎𝑡𝑒: ${date}`);
        }
        else if (args[0] == "get") {
            var get = await axios.get(`https://10minutemail.net/address.api.php`);
            var data = get.data;
            var mail = data.mail_get_mail,
                id = data.session_id,
                url = data.permalink.url,
                key_mail = data.permalink.key;
            let urlMail = url.replace(/\./g, ' . ');
            let maill = mail.replace(/\./g, ' . ');
            return message.reply(`» 𝐸𝑚𝑎𝑖𝑙: ${maill}\n» 𝑀𝑎𝑖𝑙 𝐼𝐷: ${id}\n» 𝑀𝑎𝑖𝑙 𝑈𝑅𝐿: ${urlMail}\n» 𝑀𝑎𝑖𝑙 𝐾𝑒𝑦: ${key_mail}`);
        }
        else if (args[0] == "check") {
            var get = await axios.get(`https://10minutemail.net/address.api.php`);
            var data = get.data.mail_list[0];
            var email = get.data.mail_get_mail;
            var id = data.mail_id,
                from = data.from,
                subject = data.subject,
                time = data.datetime2;
            let formMail = from.replace(/\./g, ' . ');
            let maill = email.replace(/\./g, ' . ');
            return message.reply(`» 𝐸𝑚𝑎𝑖𝑙: ${maill}\n» 𝑀𝑎𝑖𝑙 𝐼𝐷: ${id}\n» 𝐹𝑟𝑜𝑚: ${formMail}\n» 𝑆𝑢𝑏𝑗𝑒𝑐𝑡: ${subject}\n» ${time}`);
        }
        else {
            return message.reply(`𝑁𝐸𝑊 - 𝐶𝑟𝑒𝑎𝑡𝑒 𝑛𝑒𝑤 𝑚𝑎𝑖𝑙\n𝐶𝐻𝐸𝐶𝐾 - 𝐶ℎ𝑒𝑐𝑘 𝑖𝑛𝑏𝑜𝑥\n𝐺𝐸𝑇 - 𝐺𝑒𝑡 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑚𝑎𝑖𝑙\n𝐿𝐼𝑆𝑇 - 𝑉𝑖𝑒𝑤 𝑚𝑎𝑖𝑙 𝑙𝑖𝑠𝑡\n𝑀𝑂𝑅𝐸 - 𝐴𝑑𝑑 𝑛𝑒𝑤 𝑚𝑎𝑖𝑙\n-------------------------\n\n𝑌𝑜𝑢 𝑐𝑎𝑛 𝑐𝑙𝑖𝑐𝑘 𝑜𝑛 𝑡ℎ𝑒 𝑚𝑎𝑖𝑙 𝑈𝑅𝐿 𝑎𝑛𝑑 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑀𝑎𝑖𝑙 𝐾𝑒𝑦 𝑡𝑜 𝑣𝑖𝑒𝑤 𝑚𝑎𝑖𝑙 𝑐𝑜𝑛𝑡𝑒𝑛𝑡.`);
        }
    } catch (error) {
        console.error(error);
        return message.reply("𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!");
    }
};
