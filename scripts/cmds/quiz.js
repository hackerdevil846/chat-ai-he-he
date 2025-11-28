const axios = require("axios");

// ✨ Helper: Convert text to Dark Stylish Font (Bold Serif)
const toStylish = (text) => {
  const map = {
    A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇", I: "𝐈", J: "𝐉", K: "𝐊", L: "𝐋", M: "𝐌",
    N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑", S: "𝐒", T: "𝐓", U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙",
    a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡", i: "𝐢", j: "𝐣", k: "𝐤", l: "𝐥", m: "𝐦",
    n: "𝐧", o: "𝐨", p: "𝐩", q: "𝐪", r: "𝐫", s: "𝐬", t: "𝐭", u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱", y: "𝐲", z: "𝐳",
    0: "𝟎", 1: "𝟏", 2: "𝟐", 3: "𝟑", 4: "𝟒", 5: "𝟓", 6: "𝟔", 7: "𝟕", 8: "𝟖", 9: "𝟗",
    "?": "❓", "!": "❗"
  };
  return text.split("").map(c => map[c] || c).join("");
};

// ✨ Helper: Cleanup handlers to prevent double answering
const removeHandlers = (messageID) => {
  if (global.client.handleReaction) {
    const reactionIdx = global.client.handleReaction.findIndex(e => e.messageID === messageID);
    if (reactionIdx !== -1) global.client.handleReaction.splice(reactionIdx, 1);
  }

  if (global.client.handleReply) {
    const replyIdx = global.client.handleReply.findIndex(e => e.messageID === messageID);
    if (replyIdx !== -1) global.client.handleReply.splice(replyIdx, 1);
  }
};

module.exports = {
  config: {
    name: "quiz",
    aliases: ["question", "trivia"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: toStylish("Play a True/False Quiz")
    },
    longDescription: {
      en: toStylish("Test your knowledge with True/False questions. Answer via Reaction or Reply!")
    },
    guide: {
      en: "{p}quiz [easy/medium/hard]"
    },
    dependencies: {
      "axios": ""
    }
  },

  // 1️⃣ HANDLE REACTION
  handleReaction: function({ api, event, handleReaction }) {
    if (event.userID !== handleReaction.author) return;

    let userAnswer = "";
    if (event.reaction === "👍") userAnswer = "True";
    else if (event.reaction === "😢") userAnswer = "False";
    else return; // Ignore other emojis

    const isCorrect = userAnswer === handleReaction.correctAnswer;
    const resultMsg = isCorrect 
      ? `✅ | ${toStylish("Correct! You are a genius!")} 🎉`
      : `❌ | ${toStylish("Wrong! Better luck next time.")} 😢`;

    api.sendMessage(resultMsg, event.threadID, () => {
      removeHandlers(handleReaction.messageID);
    }, event.messageID); // Reply to the reaction
  },

  // 2️⃣ HANDLE REPLY
  handleReply: function({ api, event, handleReply }) {
    if (event.senderID !== handleReply.author) return;

    const input = event.body.toLowerCase().trim();
    let userAnswer = null;

    // Check for "True" keywords
    if (["true", "t", "thik", "yes", "y", "right", "satya"].includes(input)) userAnswer = "True";
    // Check for "False" keywords
    if (["false", "f", "vul", "no", "n", "wrong", "mittha"].includes(input)) userAnswer = "False";

    if (!userAnswer) return; // Invalid input, ignore

    const isCorrect = userAnswer === handleReply.correctAnswer;
    const resultMsg = isCorrect 
      ? `✅ | ${toStylish("Correct! You got it right!")} 🎉`
      : `❌ | ${toStylish("Wrong Answer! The correct answer was:")} ${handleReply.correctAnswer}`;

    api.sendMessage(resultMsg, event.threadID, () => {
      removeHandlers(handleReply.messageID);
    }, event.messageID); // Reply to the user's message
  },

  // 3️⃣ MAIN FUNCTION
  onStart: async function({ api, event, args }) {
    try {
      // Dependency Check
      if (!axios) return api.sendMessage("❌ | Missing 'axios'. Please install it.", event.threadID);

      // Difficulty Selection
      const difficulties = ["easy", "medium", "hard"];
      let difficulty = args[0] && difficulties.includes(args[0]) ? args[0] : difficulties[Math.floor(Math.random() * difficulties.length)];

      // Fetch Question
      let quizData = await fetchOpenTDBQuestion(difficulty);
      if (!quizData) quizData = await fetchTheTriviaAPIQuestion(difficulty);

      if (!quizData) {
        return api.sendMessage(toStylish("Server is busy. Unable to fetch questions."), event.threadID);
      }

      const { question, correctAnswer } = quizData;

      // Prepare Stylish Message
      const header = toStylish("QUIZ TIME");
      const qText = toStylish(question);
      const diffText = toStylish(difficulty.toUpperCase());
      const footer = toStylish("React or Reply with True/False");

      const msgBody = `✨ ${header} ✨\n━━━━━━━━━━━━━━━━━━\n❓ ${qText}\n━━━━━━━━━━━━━━━━━━\n\n👍 = 𝐓𝐫𝐮𝐞   |   😢 = 𝐅𝐚𝐥𝐬𝐞\n\n📊 𝐃𝐢𝐟𝐟𝐢𝐜𝐮𝐥𝐭𝐲: ${diffText}\n💡 ${footer}`;

      // Send Question & Register Handlers
      api.sendMessage(msgBody, event.threadID, (err, info) => {
        if (err) return;

        const data = {
          name: "quiz",
          messageID: info.messageID,
          author: event.senderID,
          correctAnswer: correctAnswer
        };

        // Add Reaction Handler
        if (!global.client.handleReaction) global.client.handleReaction = [];
        global.client.handleReaction.push(data);

        // Add Reply Handler
        if (!global.client.handleReply) global.client.handleReply = [];
        global.client.handleReply.push(data);

        // Auto-Timeout after 20 seconds
        setTimeout(() => {
          const checkExists = global.client.handleReaction ? global.client.handleReaction.find(e => e.messageID === info.messageID) : null;
          if (checkExists) {
            api.sendMessage(toStylish(`Time's up! The answer was: ${correctAnswer}`), event.threadID, info.messageID);
            removeHandlers(info.messageID);
          }
        }, 20000);
      });

    } catch (error) {
      console.error("Quiz Error:", error);
      api.sendMessage("❌ | Error starting quiz.", event.threadID);
    }
  }
};

// --- API FETCH FUNCTIONS ---

async function fetchOpenTDBQuestion(difficulty) {
  try {
    const res = await axios.get(`https://opentdb.com/api.php?amount=1&encode=url3986&type=boolean&difficulty=${difficulty}`);
    if (res.data?.results?.[0]) {
      return {
        question: decodeURIComponent(res.data.results[0].question),
        correctAnswer: res.data.results[0].correct_answer // "True" or "False"
      };
    }
  } catch (e) {}
  return null;
}

async function fetchTheTriviaAPIQuestion(difficulty) {
  try {
    const res = await axios.get(`https://the-trivia-api.com/api/questions?limit=1&difficulty=${difficulty}&type=boolean`);
    if (res.data?.[0]) {
      return {
        question: res.data[0].question.text,
        correctAnswer: res.data[0].correctAnswer ? "True" : "False" // Ensures string format
      };
    }
  } catch (e) {}
  return null;
}
