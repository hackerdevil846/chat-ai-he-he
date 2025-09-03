module.exports = {
  config: {
    name: "mail10p",
    version: "1.0.0",
    role: 0,
    author: "Asif Mahmud",
    category: "utility",
    shortDescription: {
      en: "Get temporary 10-minute mail"
    },
    longDescription: {
      en: "Create and manage temporary email accounts that expire after 10 minutes"
    },
    guide: {
      en: "{p}mail10p [new/list/more/get/check]"
    },
    countDown: 2,
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ api, event, args }) {
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
        
        return api.sendMessage(`» Mail name: ${user}\n» Host: ${host}\n» Mail ${user}@${host} (.)com\n» Time: ${time}\n» Server time: ${stime}\n» Key: ${kmail}\n» Time left: ${ltime}s\n» Mail id: ${mid}\n» Content ${sub}\n» Date: ${date}`, event.threadID, event.messageID);
      }
      else if (args[0] == "list") {
        const res = await axios.get(`https://www.phamvandienofficial.xyz/mail10p/domain`);
        var list = res.data.domain;
        return api.sendMessage(`Domain list: \n${list}`, event.threadID, event.messageID);
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
        return api.sendMessage(`» Mail name: ${user}\n» Host: ${host}\n» Mail ${user}@${host} (.)com\n» Time: ${time}\n» Server time: ${stime}\n» Key: ${kmail}\n» Time left: ${ltime}s\n» Mail id: ${mid}\n» Content ${sub}\n» Date: ${date}`, event.threadID, event.messageID);
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
        return api.sendMessage(`» Email: ${maill}\n» Mail ID: ${id}\n» Mail URL: ${urlMail}\n» Mail Key: ${key_mail}`, event.threadID, event.messageID);
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
        return api.sendMessage(`» Email: ${maill}\n» Mail ID: ${id}\n» From: ${formMail}\n» Subject: ${subject}\n» ${time}`, event.threadID, event.messageID);
      }
      else {
        return api.sendMessage(`NEW - Create new mail\nCHECK - Check inbox\nGET - Get current mail\nLIST - View mail list\nMORE - Add new mail\n-------------------------\n\nYou can click on the mail URL and enter the Mail Key to view mail content.`, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage("An error occurred while executing the command!", event.threadID, event.messageID);
    }
  }
};
