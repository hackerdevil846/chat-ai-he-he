const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "programmer",
    aliases: [],
    version: "2.3.0",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗁𝗂𝗅𝖺𝗋𝗂𝗈𝗎𝗌 𝗉𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗆𝖾𝗆𝖾𝗌 𝖺𝗇𝖽 𝗏𝗂𝖽𝖾𝗈𝗌"
    },
    longDescription: {
      en: "𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗁𝗂𝗅𝖺𝗋𝗂𝗈𝗎𝗌 𝗉𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗆𝖾𝗆𝖾𝗌 𝖺𝗇𝖽 𝗏𝗂𝖽𝖾𝗈𝗌"
    },
    guide: {
      en: ""
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api }) {
    try {
      // 𝖢𝗁𝖾𝖼𝗄 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌
      let dependenciesAvailable = true;
      try {
        require("axios");
        require("fs-extra");
        require("path");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝖽 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌");
        return;
      }
      
      console.log("🤖 𝖯𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗆𝗈𝖽𝗎𝗅𝖾 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽");
      
      // 𝖢𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝗌𝖾𝗍𝗎𝗉
      const cacheDir = path.join(__dirname, 'cache', 'programmer');
      try {
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }
      } catch (dirError) {
        console.error("𝖢𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝖾𝗋𝗋𝗈𝗋:", dirError);
      }
      
    } catch (error) {
      console.error("💥 𝖨𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖺𝗍𝗂𝗈𝗇 𝖤𝗋𝗋𝗈𝗋:", error);
    }
  },

  onChat: async function({ event, api }) {
    try {
      const { threadID, body, senderID } = event;
      
      // 𝖨𝗀𝗇𝗈𝗋𝖾 𝗂𝖿 𝖻𝗈𝗍 𝗌𝖾𝗇𝗍 𝗍𝗁𝖾 𝗆𝖾𝗌𝗌𝖺𝗀𝖾
      if (senderID === api.getCurrentUserID()) return;

      const content = body ? body.toLowerCase().trim() : '';
      
      // 𝖯𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋-𝗋𝖾𝗅𝖺𝗍𝖾𝖽 𝗍𝗋𝗂𝗀𝗀𝖾𝗋 𝗐𝗈𝗋𝖽𝗌
      const triggerWords = [
        "programmer", "coding", "debug", "bug", "code", "developer",
        "programming", "software", "algorithm", "function", "variable",
        "compile", "syntax", "error", "exception", "stack overflow",
        "github", "git", "commit", "push", "pull", "merge", "conflict",
        "javascript", "python", "java", "c++", "html", "css", "php",
        "react", "node", "vue", "angular", "database", "sql", "api",
        "framework", "library", "package", "module", "dependency",
        "backend", "frontend", "fullstack", "devops", "deployment",
        "server", "client", "localhost", "port", "http", "https",
        "terminal", "command line", "cli", "ide", "vs code", "sublime",
        "debugging", "testing", "unit test", "integration", "qa",
        "agile", "scrum", "sprint", "kanban", "waterfall", "jira",
        "documentation", "comment", "indentation", "semicolon",
        "bracket", "parenthesis", "curly brace", "string", "integer",
        "boolean", "array", "object", "class", "method", "property",
        "inheritance", "polymorphism", "encapsulation", "abstraction",
        "loop", "for", "while", "if else", "switch", "case", "return",
        "import", "export", "require", "include", "namespace", "pointer",
        "memory", "heap", "stack", "garbage collection", "recursion",
        "optimization", "performance", "latency", "throughput", "scalability",
        "microservice", "monolith", "container", "docker", "kubernetes",
        "cloud", "aws", "azure", "google cloud", "firebase", "mongodb",
        "mysql", "postgresql", "redis", "elasticsearch", "graphql",
        "rest", "soap", "json", "xml", "authentication", "authorization",
        "encryption", "hashing", "ssl", "tls", "oauth", "jwt",
        "machine learning", "ai", "neural network", "deep learning",
        "blockchain", "smart contract", "cryptocurrency", "bitcoin",
        "ethereum", "solidity", "web3", "metaverse", "ar", "vr"
      ];

      // 𝖢𝗁𝖾𝖼𝗄 𝗂𝖿 𝖺𝗇𝗒 𝗍𝗋𝗂𝗀𝗀𝖾𝗋 𝗐𝗈𝗋𝖽 𝗂𝗌 𝗎𝗌𝖾𝖽
      const hasTriggerWord = triggerWords.some(word => content.includes(word));
      
      if (hasTriggerWord) {
        this.cleanCache(); // 𝖢𝗅𝖾𝖺𝗇 𝖼𝖺𝖼𝗁𝖾 𝖻𝖾𝖿𝗈𝗋𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀
        
        // 𝖯𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗆𝖾𝗆𝖾 𝗏𝗂𝖽𝖾𝗈𝗌
        const videoLinks = [
          "https://i.imgur.com/ymvcyfg.mp4"
        ];
        
        // 𝖲𝖾𝗅𝖾𝖼𝗍 𝗋𝖺𝗇𝖽𝗈𝗆 𝗏𝗂𝖽𝖾𝗈
        const randomVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];
        
        // 𝖢𝗋𝖾𝖺𝗍𝖾 𝗎𝗇𝗂𝗊𝗎𝖾 𝖿𝗂𝗅𝖾𝗇𝖺𝗆𝖾
        const cacheDir = path.join(__dirname, 'cache', 'programmer');
        const videoPath = path.join(cacheDir, `programmer_${threadID}_${Date.now()}.mp4`);
        
        try {
          // 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗏𝗂𝖽𝖾𝗈
          const response = await axios.get(randomVideo, {
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          // 𝖲𝖺𝗏𝖾 𝗏𝗂𝖽𝖾𝗈
          await fs.writeFile(videoPath, Buffer.from(response.data));
          
          // 𝖲𝖾𝗇𝖽 𝗋𝖾𝗉𝗅𝗒
          await api.sendMessage({
            body: "💻 𝖯𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗅𝗂𝖿𝖾! 🤓",
            attachment: fs.createReadStream(videoPath)
          }, threadID);

          // 𝖢𝗅𝖾𝖺𝗇 𝗎𝗉 𝖺𝖿𝗍𝖾𝗋 𝗌𝖾𝗇𝖽𝗂𝗇𝗀
          try {
            if (await fs.pathExists(videoPath)) {
              await fs.unlink(videoPath);
            }
          } catch (cleanupError) {
            console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError);
          }
          
        } catch (error) {
          console.error("💥 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
      }
    } catch (error) {
      console.error("💥 𝖯𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
    }
  },

  cleanCache: function() {
    try {
      const cacheDir = path.join(__dirname, 'cache', 'programmer');
      if (!fs.existsSync(cacheDir)) return;
      
      const files = fs.readdirSync(cacheDir);
      const now = Date.now();
      
      files.forEach(file => {
        const filePath = path.join(cacheDir, file);
        try {
          const stats = fs.statSync(filePath);
          const fileAge = now - stats.mtimeMs;
          
          if (fileAge > 3600000) { // 𝖣𝖾𝗅𝖾𝗍𝖾 𝖿𝗂𝗅𝖾𝗌 𝗈𝗅𝖽𝖾𝗋 𝗍𝗁𝖺𝗇 1 𝗁𝗈𝗎𝗋
            fs.unlinkSync(filePath);
          }
        } catch (fileError) {
          console.warn("𝖥𝗂𝗅𝖾 𝖼𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", fileError);
        }
      });
    } catch (error) {
      console.error("💥 𝖢𝖺𝖼𝗁𝖾 𝖼𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", error);
    }
  }
};
