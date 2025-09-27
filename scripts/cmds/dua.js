const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "dua",
    aliases: [],
    version: "1.3.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "islamic",
    shortDescription: {
      en: "Islamic supplications and prayers"
    },
    longDescription: {
      en: "Provides Islamic supplications, prayers and duas with beautiful images"
    },
    guide: {
      en: "{p}dua\n{p}dua [number]"
    },
    dependencies: {
      "fs-extra": "",
      "axios": ""
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      const { threadID, messageID } = event;
      
      const duaContent = [
            {
                text: "Dua 1: Forgiveness and Protection\n\nاللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ\n\nTransliteration: 'Allahummagh-fir lee dhanbee kullah, diqqahu wa jillahu, wa awwalahu wa aakhirahu, wa 'alaaniyatahu wa sirrahu'\n\nMeaning: 'O Allah, forgive me all my sins, great and small, the first and the last, those that are apparent and those that are hidden.'",
                image: "https://i.imgur.com/aESlOKd.jpeg"
            },
            {
                text: "Dua 2: Righteous Family\n\nرَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا\n\nTransliteration: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lilmuttaqeena imama'\n\nMeaning: 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.'",
                image: "https://i.imgur.com/aESlOKd.jpeg"
            },
            {
                text: "Dua 3: Protection from Satan\n\nبِسْمِ اللّهِ اللّهُمَّ جَنِّبْنَا الشَّيْطَانَ وَ جَنِّبِ الشَّيْطَانَ مَا رَزَقْتَنَا\n\nTransliteration: 'Bismillahi Allahumma jannibnash-shaytana wa jannibish-shaytana ma razaqtana'\n\nMeaning: 'In the name of Allah. O Allah, keep us away from Satan and keep Satan away from what You provide us.'",
                image: "https://i.imgur.com/3Bmg4Nd.jpeg"
            },
            {
                text: "Dua 4: Paradise and Protection from Hell\n\nاللّٰهُمَّ إِنَّا نَسْأَلُكَ الْجَنَّةَ وَالنَّارِ نَعُوْذُ بِكَ مِنَ النَّارِ\n\nTransliteration: 'Allahumma inna nas'alukal jannata wa na'udhu bika minan-nar'\n\nMeaning: 'O Allah, we ask You for Paradise and seek refuge in You from the Hellfire.'",
                image: "https://i.imgur.com/TUm1LQW.jpeg"
            },
            {
                text: "Dua 5: Protection on Judgement Day\n\nاللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ\n\nTransliteration: 'Allahumma qini 'adhabaka yawma tab'athu 'ibadaka'\n\nMeaning: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.'",
                image: "https://i.imgur.com/wp7hM0m.jpeg"
            },
            {
                text: "Dua 6: Forgiveness and Mercy\n\nرَبَّنَاۤ اٰمَنَّا فَاغۡفِرۡ لَنَا وَ ارۡحَمۡنَا وَ اَنۡتَ خَیۡرُ الرّٰحِمِیۡنَ\n\nTransliteration: 'Rabbana amanna faghfir lana warhamna wa anta khayrur rahimeen'\n\nMeaning: 'Our Lord, we have believed, so forgive us and have mercy upon us, and You are the best of the merciful.'",
                image: "https://i.imgur.com/pFvUmsm.jpeg"
            },
            {
                text: "Dua 7: Relief from Burdens\n\nرَبَّنَا وَلَا تُحَمِّلۡنَا مَا لَا طَاقَةَ لَنَا بِهِۦ وَاعۡفُ عَنَّا وَاغۡفِرۡ لَنَا وَارۡحَمۡنَا\n\nTransliteration: 'Rabbana wa la tuhammilna ma la taqata lana bihi wa'fu 'anna waghfir lana warhamna'\n\nMeaning: 'Our Lord, do not impose upon us that which we have no ability to bear. Pardon us; forgive us; and have mercy upon us.'",
                image: "https://i.imgur.com/LH2qVcm.jpeg"
            },
            {
                text: "Dua 8: Righteous Children\n\nرَبِّ هَبْ لِي مِنَ الصَّالِحِينَ\n\nTransliteration: 'Rabbi hab li minas saliheen'\n\nMeaning: 'My Lord, grant me [a child] from among the righteous.'",
                image: "https://i.imgur.com/28Et6s2.jpeg"
            },
            {
                text: "Dua 9: Grave Visit Supplication\n\nالسَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَاحِقُونَ\n\nTransliteration: 'Assalamu 'alaykum ahlad-diyari minal-mu'mineena wal-muslimeena, wa inna in sha'allahu bikum lahiqoon'\n\nMeaning: 'Peace be upon you, O inhabitants of the graves, among the believers and Muslims. Indeed, we will, if Allah wills, join you.'",
                image: "https://i.imgur.com/NIjfdfz.jpeg"
            },
            {
                text: "Dua 10: Pure Offspring\n\nرَبِّ هَبْ لِي مِن لَّدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاء\n\nTransliteration: 'Rabbi hab li mil ladunka dhurriyyatan tayyibatan innaka sami'ud-du'a'\n\nMeaning: 'My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.'",
                image: "https://i.imgur.com/1ufw46l.jpeg"
            },
            {
                text: "Dua 11: Comprehensive Supplication\n\nاللّٰهُمَّ إِنِّيْ أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى\n\nTransliteration: 'Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina'\n\nMeaning: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.'",
                image: "https://i.imgur.com/0wcNcmI.jpeg"
            },
            {
                text: "Dua 12: Grave Visiting Etiquette\n\nGuidelines for Visiting Graves:\n\n1. Stand beside the grave and offer greetings of peace\n2. Recite Surah Al-Fatihah\n3. Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas\n4. Make dua for the deceased\n5. Depart respectfully without stepping on graves\n\nVisiting graves is recommended (mustahabb) in Islam to remember the Hereafter.",
                image: "https://i.imgur.com/AnIgU1J.jpeg"
            }
        ];

      if (args[0] && !isNaN(args[0])) {
        const selection = parseInt(args[0]);
        if (selection < 1 || selection > duaContent.length) {
          return message.reply(`Invalid selection! Please enter a number between 1-${duaContent.length}.`);
        }
        
        const dua = duaContent[selection - 1];
        try {
          const imageStream = await global.utils.getStreamFromURL(dua.image);
          return message.reply({
            body: dua.text,
            attachment: imageStream
          });
        } catch (error) {
          console.error("Image error:", error);
          return message.reply(`${dua.text}\n\nImage could not be displayed, showing text only`);
        }
      }

      const menuMessage = `Islamic Dua Collection

Select a dua from the list by entering a number:

1.  Forgiveness and Protection
2.  Righteous Family
3.  Protection from Satan
4.  Paradise and Hellfire Protection
5.  Judgement Day Protection
6.  Forgiveness and Mercy
7.  Relief from Burdens
8.  Righteous Children
9.  Grave Visit Supplication
10. Pure Offspring
11. Comprehensive Dua
12. Grave Visiting Guide

Usage: dua [number] (example: dua 5)`;

      return message.reply(menuMessage);

    } catch (error) {
      console.error("Dua Error:", error);
      await message.reply("Failed to load prayers. Please try again later.");
    }
  }
};
