const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "wanted2",
    version: "1.1",
    author: "Asif Mahmud",
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 1,
    role: 0,
    shortDescription: {
      en: "wanted poster",
      bn: "ওয়ান্টেড পোস্টার তৈরি করুন"
    },
    longDescription: {
      en: "Generate a wanted poster image with a user's avatar",
      bn: "একজন ব্যবহারকারীর প্রোফাইল ছবি দিয়ে ওয়ান্টেড পোস্টার তৈরি করুন"
    },
    category: "meme",
    guide: {
      en: "{pn} [@mention | reply]",
      bn: "{pn} [@উল্লেখ করুন | রিপ্লাই দিন]"
    },
    envConfig: {
      deltaNext: 5
    }
  },

  langs: {
    vi: {
      noTag: "Vui lòng tag người bạn muốn tạo poster."
    },
    en: {
      noTag: "You must tag the person you want to create a wanted poster for."
    },
    bn: {
      noTag: "আপনাকে অবশ্যই যার জন্য পোস্টার বানাতে চান তাকে ট্যাগ করতে হবে।"
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    try {
      const mentions = Object.keys(event.mentions || {});
      let uid;

      if (event.type === "message_reply" && event.messageReply) {
        uid = event.messageReply.senderID;
      } else {
        uid = mentions[0] || event.senderID;
      }

      // get avatar URL and generate image
      let url = await usersData.getAvatarUrl(uid);
      let avt = await new DIG.Wanted().getImage(url);

      // ensure tmp directory exists (path kept as requested)
      const tmpDir = `${__dirname}/tmp`;
      fs.ensureDirSync(tmpDir);

      const pathSave = `${tmpDir}/wanted.png`;
      fs.writeFileSync(pathSave, Buffer.from(avt));

      // message body: same behavior as original
      let body = mentions[0] ? "NEPAL KO WANTED MANXE" : "আপনি নিজেই ওয়ান্টেড!";

      // send reply with attachment, then remove temp file
      message.reply(
        {
          body: body,
          attachment: fs.createReadStream(pathSave)
        },
        () => {
          try {
            fs.unlinkSync(pathSave);
          } catch (e) {
            // ignore unlink errors
          }
        }
      );
    } catch (err) {
      console.error(err);
      return message.reply(getLang("noTag"));
    }
  }
};
