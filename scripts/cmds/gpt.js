const axios = require('axios');

if (!global.temp) global.temp = {};
if (!global.temp.openAIUsing) global.temp.openAIUsing = {};
if (!global.temp.openAIHistory) global.temp.openAIHistory = {};

const { openAIUsing, openAIHistory } = global.temp;

module.exports.config = {
  name: "gpt",
  version: "1.5",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🤖 AI assistant with image generation capability (Free Version)",
  category: "ai",
  usages: "[draw] [prompt] | [clear] | [prompt]",
  cooldowns: 5,
  dependencies: {
    "axios": "latest"
  },
  envConfig: {
    maxStorageMessage: 4,
    unsplashAccessKey: "H1P1t9KPzHUPWQI-RxHg6e8kaKdLAhYR0LRsy5Sp-tk"
  }
};

module.exports.languages = {
  en: {
    invalidContentDraw: "🖼️ Please provide a description for image generation.",
    yourAreUsing: "⏳ You have an ongoing conversation. Please wait for it to complete.",
    processingRequest: "⏳ Generating response... This may take a moment.",
    invalidContent: "💬 Please provide a message to chat with AI.",
    error: "❌ Error: %1",
    clearHistory: "🗑️ Conversation history cleared successfully.",
    noApiKey: "🔑 This command uses free services that may have limitations.",
    attribution: "📸 Image from Unsplash - Don't forget to support photographers!"
  }
};

// Free text generation API (Gemini API proxy)
async function askGpt(event, prompt) {
  try {
    const response = await axios.get(`https://gemini-api.replit.app/gemini?prompt=${encodeURIComponent(prompt)}`);
    return { data: { choices: [{ message: { content: response.data.answer } }] } };
  } catch (error) {
    // Fallback to another free API
    try {
      const response = await axios.get(`https://api.kenaisq.rocks/api/gpt4?q=${encodeURIComponent(prompt)}`);
      return { data: { choices: [{ message: { content: response.data.response } }] } };
    } catch (error2) {
      throw new Error("All text generation services are currently unavailable");
    }
  }
}

// Free image generation API with Unsplash integration
async function generateFreeImage(prompt, unsplashAccessKey) {
  try {
    // First try pollinations.ai
    const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
      responseType: 'stream'
    });
    // Add a path property that GoatBot expects for attachments
    response.data.path = `${Date.now()}.png`;
    return [response.data];
  } catch (error) {
    // Fallback to Unsplash if pollinations fails
    try {
      const unsplashResponse = await axios.get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=1&client_id=${unsplashAccessKey}`);

      if (unsplashResponse.data.results && unsplashResponse.data.results.length > 0) {
        const imageUrl = unsplashResponse.data.results[0].urls.regular;
        const image = await axios.get(imageUrl, { responseType: 'stream' });
        image.data.path = `${Date.now()}.jpg`;
        return [image.data];
      } else {
        throw new Error("No images found for this prompt");
      }
    } catch (unsplashError) {
      throw new Error("All image generation services are currently unavailable");
    }
  }
}

module.exports.onLoad = function () {
  // Optional onLoad hook — reserved for future initialization if needed
  return;
};

module.exports.run = async function ({ api, event, args, getLang, prefix, config }) {
  const { maxStorageMessage, unsplashAccessKey } = config.envConfig;

  switch ((args[0] || "").toLowerCase()) {
    case 'img':
    case 'image':
    case 'draw': {
      if (!args[1]) return api.sendMessage(getLang('invalidContentDraw'), event.threadID, event.messageID);
      if (openAIUsing[event.senderID]) return api.sendMessage(getLang("yourAreUsing"), event.threadID, event.messageID);

      openAIUsing[event.senderID] = true;
      let sending;

      try {
        sending = api.sendMessage(getLang('processingRequest'), event.threadID, event.messageID);
        const images = await generateFreeImage(args.slice(1).join(' '), unsplashAccessKey);

        api.sendMessage({
          body: "🎨 Here's your generated image (Free Service):\n" + getLang('attribution'),
          attachment: images
        }, event.threadID, event.messageID);
      }
      catch (err) {
        const errorMessage = err.message || "";
        api.sendMessage(getLang('error', errorMessage), event.threadID, event.messageID);
      }
      finally {
        delete openAIUsing[event.senderID];
        if (sending) {
          try {
            api.unsendMessage((await sending).messageID);
          } catch (e) { /* ignore unsend errors */ }
        }
      }
      break;
    }

    case 'clear': {
      openAIHistory[event.senderID] = [];
      api.sendMessage(getLang('clearHistory'), event.threadID, event.messageID);
      break;
    }

    default: {
      if (!args[0]) return api.sendMessage(getLang('invalidContent'), event.threadID, event.messageID);

      api.sendMessage(getLang('noApiKey'), event.threadID, event.messageID);

      try {
        openAIUsing[event.senderID] = true;

        if (!openAIHistory[event.senderID] || !Array.isArray(openAIHistory[event.senderID])) {
          openAIHistory[event.senderID] = [];
        }

        if (openAIHistory[event.senderID].length >= maxStorageMessage) {
          openAIHistory[event.senderID].shift();
        }

        // Build the prompt with conversation history
        let fullPrompt = openAIHistory[event.senderID].map(msg =>
          `${msg.role}: ${msg.content}`
        ).join('\n');

        fullPrompt += `\nuser: ${args.join(' ')}`;

        const response = await askGpt(event, fullPrompt);
        const text = response.data.choices[0].message.content;

        openAIHistory[event.senderID].push({
          role: 'user',
          content: args.join(' ')
        });

        openAIHistory[event.senderID].push({
          role: 'assistant',
          content: text
        });

        api.sendMessage(text, event.threadID, (err, info) => {
          if (!err && info && info.messageID && global.GoatBot && global.GoatBot.onReply) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              author: event.senderID,
              messageID: info.messageID
            });
          }
        });
      }
      catch (err) {
        const errorMessage = err.message || "";
        api.sendMessage(getLang('error', errorMessage), event.threadID, event.messageID);
      }
      finally {
        delete openAIUsing[event.senderID];
      }
    }
  }
};

module.exports.handleReply = async function ({ api, event, Reply, getLang, config }) {
  const { maxStorageMessage } = config.envConfig;
  const { author } = Reply;

  if (author != event.senderID) return;

  try {
    openAIUsing[event.senderID] = true;

    if (!openAIHistory[event.senderID] || !Array.isArray(openAIHistory[event.senderID])) {
      openAIHistory[event.senderID] = [];
    }

    if (openAIHistory[event.senderID].length >= maxStorageMessage) {
      openAIHistory[event.senderID].shift();
    }

    // Build the prompt with conversation history
    let fullPrompt = openAIHistory[event.senderID].map(msg =>
      `${msg.role}: ${msg.content}`
    ).join('\n');

    fullPrompt += `\nuser: ${event.body}`;

    const response = await askGpt(event, fullPrompt);
    const text = response.data.choices[0].message.content;

    openAIHistory[event.senderID].push({
      role: 'user',
      content: event.body
    });

    openAIHistory[event.senderID].push({
      role: 'assistant',
      content: text
    });

    api.sendMessage(text, event.threadID, (err, info) => {
      if (!err && info && info.messageID && global.GoatBot && global.GoatBot.onReply) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: event.senderID,
          messageID: info.messageID
        });
      }
    });
  }
  catch (err) {
    const errorMessage = err.message || "";
    api.sendMessage(getLang('error', errorMessage), event.threadID, event.messageID);
  }
  finally {
    delete openAIUsing[event.senderID];
  }
};
