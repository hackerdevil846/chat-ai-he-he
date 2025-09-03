const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "subnautica",
    version: "2.0.0",
    role: 0,
    author: "Asif Mahmud",
    countDown: 0,
    shortDescription: {
      en: "Subnautica fishing game!"
    },
    longDescription: {
      en: "Subnautica fishing game where you can catch various fish and explore underwater worlds!"
    },
    category: "game",
    guide: {
      en: "help"
    },
    envConfig: {
      APIKEY: ""
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const { threadID, messageID, senderID } = event;
      const { readFileSync, writeFileSync, existsSync, createReadStream } = fs;
      
      // Check if dependencies are available
      if (!axios || !fs || !path) {
        throw new Error("Missing required dependencies");
      }

      const checkPath = function (type, senderID) {
        const pathItem = path.join(__dirname, 'cache', 'cauca', `item.json`);
        const pathUser = path.join(__dirname, 'cache', 'cauca', 'datauser', `${senderID}.json`);
        const pathUser_1 = require("./cache/cauca/datauser/" + senderID + '.json');
        const pathItem_1 = require("./cache/cauca/item.json");
        if (type == 1) return pathItem;
        if (type == 2) return pathItem_1;
        if (type == 3) return pathUser;
        if (type == 4) return pathUser_1;
      };

      const subnauticaImage = async function() {
        var images = [];
        let download = (await axios.get('https://i.imgur.com/2VPuOVI.png', { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync( __dirname + `/cache/cauca/cache/subnauticapage.png`, Buffer.from(download, "utf-8"));
        images.push(fs.createReadStream(__dirname + `/cache/cauca/cache/subnauticapage.png`));
        return images;
      };

      const getFishImage = async function(link) {
        var images = [];
        let download = (await axios.get(link, { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync( __dirname + `/cache/cauca/cache/subnautica.png`, Buffer.from(download, "utf-8"));
        images.push(fs.createReadStream(__dirname + `/cache/cauca/cache/subnautica.png`));
        return images;
      };

      const getFishType = function () {
        var rate = Math.floor(Math.random() * 100) + 1;
        if (rate <= 4) return false;
        if (rate > 4 && rate <= 34) return 'Common';
        if (rate > 34 && rate <= 59) return 'Uncommon';
        if (rate > 59 && rate <= 79) return 'Rare';
        if (rate > 79 && rate <= 94) return 'Epic';
        if (rate > 94 && rate <= 99) return 'Legendary';
        if (rate > 99 && rate <= 100) return 'Mythical';
      };

      const dataFish = async function (a, b) {
        const data = (await axios.get(`https://raw.githubusercontent.com/duongcongnam/subnautica/main/subnautica.json`)).data;
        var loc = data.find(i => i.location == a);
        var are = loc.area.find(i => i.name == b);
        return are.creature;
      };

      // Initialize data on first run
      const dir = __dirname + `/cache/cauca/`;
      const dirCache = __dirname + `/cache/cauca/cache/`;
      const dirData = __dirname + `/cache/cauca/datauser/`;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      if (!fs.existsSync(dirData)) fs.mkdirSync(dirData, { recursive: true });
      if (!fs.existsSync(dirCache)) fs.mkdirSync(dirCache, { recursive: true });

      if (!fs.existsSync(dir + "data.json")) {
        const response = await axios({
          url: "https://raw.githubusercontent.com/phamvandien1/abc/main/data.json",
          method: 'GET',
          responseType: 'stream'
        });
        response.data.pipe(fs.createWriteStream(dir + "data.json"));
      }

      if (!fs.existsSync(dir + "item.json")) {
        const response = await axios({
          url: "https://raw.githubusercontent.com/phamvandien1/abc/main/item.json",
          method: 'GET',
          responseType: 'stream'
        });
        response.data.pipe(fs.createWriteStream(dir + "item.json"));
      }

      const pathData = path.join(__dirname, 'cache', 'cauca', 'datauser', `${senderID}.json`);
      
      switch (args[0]) {
        case 'register':
        case '-r': {
          const nDate = new Date().toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh'
          });
          if (!existsSync(pathData)) {
            var obj = {};
            const userData = await usersData.get(senderID);
            obj.name = userData.name;
            obj.ID = senderID;
            obj.mainROD = null;
            obj.GPS = {};
            obj.GPS.locate = null;
            obj.GPS.area = null;
            obj.fishBag = [];
            obj.item = [];
            obj.timeRegister = nDate;
            obj.fishBag.push({
              ID: 0,
              name: 'Challenge Fish',
              category: 'Legendary',
              size: 999999,
              sell: 0
            });
            writeFileSync(pathData, JSON.stringify(obj, null, 4));
            var msg = {body: "[ Subnautica Fishing Game ]\n──────────────────\n✅ Registered successfully\n🏬 /subnautica shop/-s: To buy fishing equipment!", attachment: await subnauticaImage()};
            return api.sendMessage(msg, threadID, messageID);
          } else return api.sendMessage({body: "[ Subnautica Fishing Game ]\n──────────────────\n⚡ You have already registered!", attachment: await subnauticaImage()}, threadID, messageID);
        }
        case 'shop':
        case '-s': {
          if (!existsSync(pathData)) {
            return api.sendMessage({body: "[ Subnautica Fishing Game ]\n──────────────────\n🦈 You haven't registered an account\n⚡ /subnautica register/-r: To register for the game!", attachment: await subnauticaImage()}, threadID, messageID);
          }
          return api.sendMessage({body: "[ Subnautica Shop ]\n──────────────────\n1 » 💰 Buy items\n2 » 💵 Sell caught items\n3 » ⚡ Upgrade/Repair items\n──────────────────\n💬 Reply to this message with your choice!", attachment: await subnauticaImage()}, threadID, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "shop"
            });
          }, messageID);
        }
        case 'bag':
        case '-b': {
          if (!existsSync(pathData)) {
            return api.sendMessage({body: "[ Subnautica Fishing Game ]\n──────────────────\n🦈 You haven't registered an account\n⚡ /subnautica register/-r: To register for the game!", attachment: await subnauticaImage()}, threadID, messageID);
          }
          var data = require(checkPath(3, senderID));

          return api.sendMessage({body: `[ Subnautica Inventory ]\n──────────────────\n1 » 🦈 Fish caught: ${data.fishBag.length} fish\n2 » 🎣 Fishing rods owned: ${data.item.length} rods\n──────────────────\n💬 Please reply to view items!`, attachment: await subnauticaImage()}, threadID, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "choosebag"
            });
          }, messageID);
        }
        case 'custom':
        case '-c': {
          if (!existsSync(pathData)) {
            return api.sendMessage({body: "[ Subnautica Fishing Game ]\n──────────────────\n🦈 You haven't registered an account\n⚡ /subnautica register/-r: To register for the game!", attachment: await subnauticaImage()}, threadID, messageID);
          }
          if (args[1] == 'rod') {
            var data = require(checkPath(3, senderID));
            var listItem = '[ Subnautica Select Fishing Rod ]\n──────────────────\n',
                number = 1;
            for (let i of data.item) {
              listItem += `${number++} » 🎣 Rod name: ${i.name}\n⏱️ Cooldown: ${i.countdown}s\n⚡ Durability: ${i.durability}\n──────────────────\n`;
            }
            listItem += '💬 Please reply to select your main fishing rod!';
            return api.sendMessage(listItem, threadID, (error, info) => {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "rodMain",
                data: data,
                item: data.item
              });
            }, messageID);
          }
          if (args[1] == 'locate') {
            return api.sendMessage({body: "[ Select Fishing Location ]\n──────────────────\n1 » The Crater\n\n2 » Sector Zero", attachment: await subnauticaImage()}, threadID, (error, info) => {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "location"
              });
            }, messageID);
          }
        }
        case 'help': {
          return api.sendMessage({body: "[ Subnautica Game Help ]\n──────────────────\n🦈 /subnautica register/-r: Register for the game\n🏬 /subnautica shop/-s: Fishing shop\n🌊 /subnautica custom/-c rod/custom locate: Select fishing area\n🎒 /subnautica bag/-b: View inventory", attachment: await subnauticaImage()}, threadID, messageID);
        }
        default: {
          async function checkTime(cooldown, dataTime) {
            if (cooldown - (Date.now() - dataTime) > 0) {
              var time = cooldown - (Date.now() - dataTime),
                  minutes = Math.floor(time / 60000),
                  seconds = ((time % 60000) / 1000).toFixed(0);
              return api.sendMessage(`⏰ Please buy a higher level rod to fish consecutively in a short time!\n⌚ Remaining wait time: ${minutes}:${seconds}`, threadID, messageID);
            }
          }
          if (!existsSync(pathData)) {
            return api.sendMessage({body: "[ Subnautica Fishing Game ]\n──────────────────\n⚡ /subnautica help: To see how to play!", attachment: await subnauticaImage()}, threadID, messageID);
          }
          var data = require(checkPath(3, senderID));
          if (data.item.length == 0) return api.sendMessage(`⚡ You don't have a fishing rod, please go to the shop to buy one!`, threadID, messageID);
          if (data.mainROD == null) return api.sendMessage('⚡ You haven\'t selected a fishing rod to fish with\n❗ Please enter "/subnautica custom rod" to select a fishing rod!', threadID, messageID);
          if (data.GPS.locate == null || data.GPS.area == null) return api.sendMessage('⚡ You haven\'t selected a fishing location\n❗ Please enter "/subnautica custom locate" to select a fishing location!', threadID, messageID);
          var rod = data.mainROD;
          var location = data.GPS.locate;
          var area = data.GPS.area;
          var type = getFishType();
          var findRod = data.item.find(i => i.name == rod);
          if (findRod.durability <= 0) return api.sendMessage('⚡ The fishing rod is broken, you need to repair it or select a new one!', threadID, messageID);
          await checkTime(findRod.countdown * 1000, findRod.countdownData);
          findRod.countdownData = Date.now();
          findRod.durability = findRod.durability - 10;
          writeFileSync(checkPath(3, senderID), JSON.stringify(require(checkPath(3, senderID)), null, 2));
          if (type == false) return api.sendMessage('❎ You missed and didn\'t catch any fish!', threadID, messageID);
          var fil = (await dataFish(location, area)).filter(i => i.category == type);
          if (fil.length == 0) return api.sendMessage('❎ You missed and didn\'t catch any fish!', threadID, messageID);
          var getData = fil[Math.floor(Math.random() * fil.length)];
          var IDF = (require(checkPath(3, senderID))).fishBag[parseInt((require(checkPath(3, senderID))).fishBag.length - 1)].ID + 1;
          (require(checkPath(3, senderID))).fishBag.push({
            ID: IDF,
            name: getData.name,
            category: getData.category,
            size: getData.size,
            sell: getData.sell,
            image: getData.image
          });
          writeFileSync(checkPath(3, senderID), JSON.stringify(require(checkPath(3, senderID)), null, 2));
          var msg = {body: `[ Subnautica Fishing Game ]\n──────────────────\n🎣 You caught a fish\n🦈 Fish name: ${getData.name}\n💵 Price: ${getData.sell}$\n📖 Fish type: ${getData.category}\n📏 Size: ${getData.size}cm`, attachment: await getFishImage(getData.image)};
          return api.sendMessage(msg, threadID, messageID);
        }
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ An error occurred while processing the command!", threadID, messageID);
    }
  },

  handleReply: async function ({ event, api, handleReply, usersData }) {
    try {
      const { body, threadID, messageID, senderID } = event;
      const { readFileSync, writeFileSync, existsSync } = fs;
      const axios = require("axios");
      
      const checkPath = function (type, senderID) {
        const pathItem = path.join(__dirname, 'cache', 'cauca', `item.json`);
        const pathUser = path.join(__dirname, 'cache', 'cauca', 'datauser', `${senderID}.json`);
        const pathUser_1 = require("./cache/cauca/datauser/" + senderID + '.json');
        const pathItem_1 = require("./cache/cauca/item.json');
        if (type == 1) return pathItem;
        if (type == 2) return pathItem_1;
        if (type == 3) return pathUser;
        if (type == 4) return pathUser_1;
      };

      const getFishImage = async function(link) {
        var images = [];
        let download = (await axios.get(link, { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync( __dirname + `/cache/cauca/cache/subnautica.png`, Buffer.from(download, "utf-8"));
        images.push(fs.createReadStream(__dirname + `/cache/cauca/cache/subnautica.png`));
        return images;
      };

      async function checkMoney(senderID, maxMoney) {
        var i, w;
        i = (await usersData.getData(senderID)) || {};
        w = i.money || 0;
        if (w < parseInt(maxMoney)) return api.sendMessage('⚡ You don\'t have enough money for this transaction!', threadID, messageID);
      }

      async function checkDur(a, b, c) {
        var data = require("./cache/cauca/item.json");
        var find = data.find(i => i.name == a);
        if (c == 'rate') return (b / find.durability) * 100;
        if (c == 'reset') return find.durability;
        return `${b}/${find.durability} (${((b/find.durability)*100).toFixed(0)}%)`;
      }

      switch (handleReply.type) {
        case 'shop': {
          if (body == 1) {
            api.unsendMessage(handleReply.messageID);
            var pathItem = require(checkPath(2, senderID));
            var listItem = '[ Fishing Rod Shop ]\n──────────────────\n',
                number = 1;
            for (let i of pathItem) {
              listItem += `${number++} » 🎣 Name: ${i.name}\n💵 Price: ${i.price}$\n⏱️ Cooldown: ${i.countdown}\n⚡ Durability: ${i.durability}\n──────────────────\n`;
            }
            return api.sendMessage(listItem + '💬 Reply to this message to choose your fishing rod, Each fishing reduces 10% durability!', threadID, (error, info) => {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "buyfishingrod"
              });
            }, messageID);
          }
          if (body == 2) {
            api.unsendMessage(handleReply.messageID);
            var data = require(checkPath(3, senderID)).fishBag;
            if (data.length == 0) return api.sendMessage('⚡ Your bag is empty!', threadID, messageID);
            var Common = data.filter(i => i.category == 'Common');
            var Uncommon = data.filter(i => i.category == 'Uncommon');
            var Rare = data.filter(i => i.category == 'Rare');
            var Epic = data.filter(i => i.category == 'Epic');
            var Legendary = data.filter(i => i.category == 'Legendary');
            var Mythical = data.filter(i => i.category == 'Mythical');
            var listCategory = [Common, Uncommon, Rare, Epic, Legendary, Mythical];
            return api.sendMessage(`[ Subnautica Sell Fish ]\n──────────────────\n1 » Fish: Common\n🛍️ Quantity: ${Common.length}\n\n2 » Fish: Uncommon\n🛍️ Quantity: ${Uncommon.length}\n\n3 » Fish: Rare\n🛍️ Quantity: ${Rare.length}\n\n4 » Fish: Epic\n🛍️ Quantity: ${Epic.length}\n\n5 » Fish: Legendary\n🛍️ Quantity: ${Legendary.length}\n\n6 » Fish: Mythical\n🛍️ Quantity: ${Mythical.length}\n──────────────────\n💬 Reply to choose which fish to sell!`, threadID, (error, info) => {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "chooseFish",
                listCategory
              });
            }, messageID);
          }
          if (body == 3) {
            api.unsendMessage(handleReply.messageID);
            var data = require(checkPath(3, senderID)).item;
            var msg = `[ Current Fishing Rods ]\n──────────────────\n`,
                number = 1;
            for (let i of data) {
              msg += `${number++} » 🎣 Rod name: ${i.name}\n⚡ Durability: ${await checkDur(i.name, i.durability, 0)}\n──────────────────\n`;
            }
            return api.sendMessage(msg + '💬 Please reply with the item you want to repair, repair cost is 1/3 of the item price!', threadID, (error, info) => {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "fixfishingrod",
                list: data
              });
            }, messageID);
          } else return api.sendMessage('⚡ Invalid selection!', threadID, messageID);
        }
        case 'choosebag': {
          api.unsendMessage(handleReply.messageID);
          var data = require(checkPath(3, senderID));
          if (body == 1) {
            if (data.fishBag.length == 0) return api.sendMessage('⚡ Your bag has no fish!', threadID, messageID);
            var listFish = `[ Fish Caught ]\n──────────────────\n`,
                number = 1;
            for (let i of data.fishBag) {
              listFish += `${number++} » 🦈 Fish name: ${i.name}\n❗ Length: ${i.size}cm - ${i.category}\n💵 Price: ${i.sell}$\n──────────────────\n`;
            }
            return api.sendMessage(listFish, threadID, messageID);
          }
          if (body == 2) {
            api.unsendMessage(handleReply.messageID);
            if (data.item.length == 0) return api.sendMessage('⚡ Your bag has no items!', threadID, messageID);
            var listItemm = `[ Current Fishing Rods ]\n──────────────────\n`,
                number = 1;
            for (let i of data.item) {
              listItemm += `${number++} » 🎣 Rod name: ${i.name}\n💵 Price: ${i.price}$\n⚡ Durability: ${i.durability}\n⏱️ Cooldown: ${i.countdown}s\n──────────────────\n`;
            }
            return api.sendMessage(listItemm, threadID, messageID);
          } else return api.sendMessage('⚡ Invalid selection!', threadID, messageID);
        }
        case 'rodMain': {
          var data = handleReply.data;
          var item = handleReply.item;
          if (parseInt(body) > item.length || parseInt(body) <= 0) return api.sendMessage('⚡ Invalid selection!', threadID, messageID);
          api.unsendMessage(handleReply.messageID);
          data.mainROD = item[parseInt(body) - 1].name;
          writeFileSync(checkPath(3, senderID), JSON.stringify(data, null, 2));
          return api.sendMessage(`[ Select Main Rod Success ]\n──────────────────\n📌 Set fishing rod: ${item[parseInt(body) - 1].name} as main rod successfully!`, threadID, messageID);
        }
        case 'location': {
          const data = require("./cache/cauca/data.json");
          if (body != 1 && body != 2) return api.sendMessage("⚡ Invalid selection!", threadID, messageID);
          api.unsendMessage(handleReply.messageID);
          var listLoca = '[ Select Fishing Location ]\n──────────────────\n',
              number = 1;
          for (let i of data[parseInt(body) - 1].area) {
            listLoca += `${number++} » 🌊 Name: ${i.name}\n──────────────────\n`;
          };
          (require(checkPath(3, senderID))).GPS.locate = data[parseInt(body) - 1].location;
          writeFileSync(checkPath(3, senderID), JSON.stringify(require(checkPath(3, senderID)), null, 2));
          if(body == 1) var images = 'https://i.imgur.com/SJewp15.png';
          if(body == 2) var images = 'https://i.imgur.com/FtB2vWi.png';
          return api.sendMessage({body: listLoca + '⚡ Please select the location you want to fish!', attachment: await getFishImage(images)}, threadID, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "chooseArea",
              area: data[parseInt(body) - 1]
            });
          }, messageID);
        }
        case 'chooseArea': {
          var area = handleReply.area;
          var pathh = require(checkPath(3, senderID));
          var pathhh = checkPath(3, senderID);
          if (parseInt(body) > area.area.length || parseInt(body) <= 0) return api.sendMessage('⚡ Invalid selection!', threadID, messageID);
          api.unsendMessage(handleReply.messageID);
          pathh.GPS.area = area.area[parseInt(body) - 1].name;
          writeFileSync(pathhh, JSON.stringify(pathh, null, 2));
          return api.sendMessage(`[ Subnautica Fishing Game ]\n──────────────────\n✅ Moved to area: ${area.location} - ${area.area[parseInt(body) - 1].name} successfully!`, threadID, messageID);
        }
        case 'fixfishingrod': {
          if (parseInt(body) > handleReply.list.length || parseInt(body) <= 0) return api.sendMessage('⚡ Invalid selection!', threadID, messageID);
          var rod = handleReply.list[parseInt(body) - 1];
          if (await checkDur(rod.name, rod.durability, 'rate') > 75) return api.sendMessage('⚡ Can only repair rods with durability below 75%!', threadID, messageID);
          api.unsendMessage(handleReply.messageID);
          await checkMoney(senderID, parseInt((rod.price * (1 / 3)).toFixed(0)));
          await usersData.decreaseMoney(senderID, parseInt((rod.price * (1 / 3)).toFixed(0)));
          rod.durability = await checkDur(rod.name, rod.durability, 'reset');
          writeFileSync(checkPath(3, senderID), JSON.stringify(require(checkPath(3, senderID)), null, 2));
          return api.sendMessage(`[ Repair Successful ]\n──────────────────\n🎣 Fishing rod: ${rod.name}\n💵 Repair cost: ${parseInt((rod.price*(1/3)).toFixed(0))}$`, threadID, messageID);
        }
        case 'buyfishingrod': {
          var pathItem = require(checkPath(2, senderID));
          if (parseInt(body) > pathItem.length || parseInt(body) <= 0) return api.sendMessage('⚡ Invalid selection!', threadID, messageID);
          var data = pathItem[parseInt(body) - 1];
          var checkM = await checkMoney(senderID, data.price);
          if ((require(checkPath(3, senderID))).item.some(i => i.name == data.name)) return api.sendMessage('⚡ You already own this item!', threadID, messageID);
          (require(checkPath(3, senderID))).item.push({
            name: data.name,
            price: data.price,
            durability: data.durability,
            countdown: data.countdown,
            countdownData: null,
            image: data.image
          });
          writeFileSync(checkPath(3, senderID), JSON.stringify(require(checkPath(3, senderID)), null, 2));
          api.unsendMessage(handleReply.messageID);
          var msg = { body: `[ Subnautica Fishing Game ]\n──────────────────\n✅ Successfully purchased fishing rod\n🎣 Rod name: ${data.name}\n💵 Purchase price: ${data.price}$\n⚡ Durability: ${data.durability}\n⏱️ Cooldown: ${data.countdown}`, attachment: await getFishImage(data.image)};
          return api.sendMessage(msg, threadID, messageID);
        }
        case 'chooseFish': {
          if (parseInt(body) > handleReply.listCategory.length || parseInt(body) <= 0) return api.sendMessage('⚡ Invalid selection!', threadID, messageID);
          api.unsendMessage(handleReply.messageID);
          if (handleReply.listCategory[parseInt(body) - 1].length == 0) return api.sendMessage('⚡ You don\'t have any fish!', threadID, messageID);
          var fish = "[ Subnautica Sell Fish ]\n──────────────────\n",
              number = 1;
          for (let i of handleReply.listCategory[parseInt(body) - 1]) {
            fish += `${number++} » 🦈 Fish name: ${i.name} - ${i.size}cm\n❗ Type: ${i.category}\n💵 Price: ${i.sell}$\n──────────────────\n`;
          }
          return api.sendMessage(fish + "💬 Reply with the number to sell (can reply multiple numbers) or reply 'all' to sell all fish!", threadID, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "sell",
              list: handleReply.listCategory[parseInt(body) - 1]
            });
          }, messageID);
        }
        case 'sell': {
          if ((parseInt(body) > handleReply.list.length || parseInt(body) <= 0) && body.toLowerCase() != 'all') return api.sendMessage('⚡ Invalid selection!', threadID, messageID);
          api.unsendMessage(handleReply.messageID);
          var bag = (require(checkPath(3, senderID))).fishBag;
          var coins = 0;
          if (body.toLowerCase() == 'all') {
            for (let i of handleReply.list) {
              await usersData.increaseMoney(senderID, parseInt(i.sell));
              coins += parseInt(i.sell);
              var index = (require(checkPath(3, senderID))).fishBag.findIndex(item => item.ID == i.ID);
              bag.splice(index, 1);
              writeFileSync(checkPath(3, senderID), JSON.stringify((require(checkPath(3, senderID))), null, 2));
            }
            return api.sendMessage(`✅ Successfully sold: ${handleReply.list.length} fish and earned: ${coins}$`, threadID, messageID);
          }
          else {
            var msg = 'Code_By_D-Jukie ' + body;
            var chooses = msg.split(" ").map(n => parseInt(n));
            chooses.shift();
            var text = `[ Sell Fish Successful ]\n──────────────────\n`,
                number = 1;
            for (let i of chooses) {
              const index = (require(checkPath(3, senderID))).fishBag.findIndex(item => item.ID == handleReply.list[i - 1].ID);
              text += `${number++} » 🦈 Fish name: ${bag[index].name}\n💵 Price: ${bag[index].sell}$\n──────────────────\n`;
              coins += parseInt(bag[index].sell);
              await usersData.increaseMoney(senderID, parseInt(bag[index].sell));
              bag.splice(index, 1);
              writeFileSync(checkPath(3, senderID), JSON.stringify((require(checkPath(3, senderID))), null, 2));
            }
            return api.sendMessage(text + `\n💵 Earned: ${coins}$`, threadID, messageID);
          }
        }
        default: {
          api.unsendMessage(handleReply.messageID);
          return api.sendMessage('⚡ Invalid selection!', threadID, messageID);
        }
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ An error occurred while processing the reply!", threadID, messageID);
    }
  }
};
