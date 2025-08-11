const axios = require("axios");
const { decode } = require("querystring");

// Enhanced quiz database with more questions
const FALLBACK_QUESTIONS = {
  easy: [
    { question: "Water boils at 100°C at sea level", answer: "True" },
    { question: "The capital of France is London", answer: "False" },
    { question: "Humans have four lungs", answer: "False" },
    { question: "The sun rises in the east", answer: "True" },
    { question: "Python is a type of snake", answer: "True" },
    { question: "There are 7 continents on Earth", answer: "True" },
    { question: "Antarctica is the smallest continent", answer: "False" },
    { question: "Jupiter is the largest planet in our solar system", answer: "True" }
  ],
  medium: [
    { question: "Light travels faster than sound", answer: "True" },
    { question: "The human body has 206 bones", answer: "True" },
    { question: "HTML is a programming language", answer: "False" },
    { question: "The Great Wall of China is visible from space", answer: "False" },
    { question: "Venus is the hottest planet in our solar system", answer: "True" },
    { question: "Electrons are larger than atoms", answer: "False" },
    { question: "The chemical symbol for gold is Ag", answer: "False" },
    { question: "Mount Everest is the tallest mountain in the world", answer: "True" }
  ],
  hard: [
    { question: "Entropy always decreases over time", answer: "False" },
    { question: "A photon has mass", answer: "False" },
    { question: "The derivative of e^x is itself", answer: "True" },
    { question: "Quantum entanglement can transmit information faster than light", answer: "False" },
    { question: "DNA stands for Deoxyribonucleic Acid", answer: "True" },
    { question: "The speed of light is approximately 300,000 km/s", answer: "True" },
    { question: "Black holes emit radiation", answer: "True" },
    { question: "Neutrinos travel faster than light", answer: "False" }
  ]
};

// API categories mapping
const API_CATEGORIES = {
  general: 9,
  science: 17,
  history: 23,
  computers: 18,
  mathematics: 19,
  animals: 27,
  geography: 22
};

// Current quizzes storage
global.quizActive = global.quizActive || {};

module.exports = {
  config: {
    name: "quiz",
    version: "2.2.0",
    credits: "Asif",
    hasPermission: 0,
    description: "True/False quiz game with multiple difficulty levels and categories",
    category: "game",
    usages: "[easy/medium/hard] [category]",
    cooldowns: 5,
    dependencies: { "axios": "" }
  },

  onStart: async function() {
    // Initialization if needed
    console.log("Quiz command initialized");
  },

  run: async function({ api, event, args }) {
    try {
      const { threadID, senderID, messageID } = event;
      
      // Clear any existing quiz in this thread
      if (global.quizActive[threadID]) {
        clearTimeout(global.quizActive[threadID].timer);
        delete global.quizActive[threadID];
      }

      // Parse difficulty and category
      const difficulties = ["easy", "medium", "hard"];
      let difficulty = args[0]?.toLowerCase() || difficulties[Math.floor(Math.random() * 3)];
      let category = args[1]?.toLowerCase();
      
      if (!difficulties.includes(difficulty)) {
        api.sendMessage(
          `⚠️ Invalid difficulty! Using random difficulty instead.\n\n` +
          `Available difficulties: ${difficulties.join(", ")}`,
          threadID,
          messageID
        );
        difficulty = difficulties[Math.floor(Math.random() * 3)];
      }

      let questionData;
      let categoryName = "General Knowledge";
      let usedFallback = false;
      
      try {
        // Build API URL
        let apiUrl = `https://opentdb.com/api.php?amount=1&type=boolean&difficulty=${difficulty}&encode=url3986`;
        
        if (category && API_CATEGORIES[category]) {
          apiUrl += `&category=${API_CATEGORIES[category]}`;
          categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        } else if (category) {
          const validCategories = Object.keys(API_CATEGORIES).join(", ");
          api.sendMessage(
            `⚠️ Invalid category! Using General Knowledge.\n\n` +
            `Available categories: ${validCategories}`,
            threadID,
            messageID
          );
        }
        
        // Fetch question from API
        const response = await axios.get(apiUrl, { timeout: 5000 });
        
        if (!response.data.results || response.data.results.length === 0) {
          throw new Error("No questions returned from API");
        }
        
        questionData = response.data.results[0];
      } catch (apiError) {
        // Use fallback questions if API fails
        console.error("Quiz API Error:", apiError);
        usedFallback = true;
        const fallback = FALLBACK_QUESTIONS[difficulty];
        questionData = fallback[Math.floor(Math.random() * fallback.length)];
        questionData.question = encodeURIComponent(questionData.question);
        questionData.correct_answer = questionData.answer;
      }

      const question = decodeURIComponent(questionData.question);
      const correctAnswer = questionData.correct_answer;

      const message = `🧠 ${difficulty.toUpperCase()} QUIZ${category ? ` (${categoryName})` : ''}\n\n${question}\n\n` +
                     `React with:\n👍 = True\n👎 = False\n\n` +
                     `You have 20 seconds to answer!` +
                     (usedFallback ? "\n\nℹ️ Using fallback questions (API failed)" : "");

      api.sendMessage(message, threadID, async (err, info) => {
        if (err) return console.error("Send Message Error:", err);

        // Add reactions
        api.addReaction("👍", info.messageID, () => {});
        api.addReaction("👎", info.messageID, () => {});

        // Store quiz data
        global.quizActive[threadID] = {
          messageID: info.messageID,
          correctAnswer,
          answered: false,
          userID: senderID,
          timer: setTimeout(() => {
            if (global.quizActive[threadID] && !global.quizActive[threadID].answered) {
              api.sendMessage(
                `⏰ Time's up! The correct answer was: ${correctAnswer}\n` +
                `Type "quiz" to play again!`,
                threadID
              );
              delete global.quizActive[threadID];
            }
          }, 20000)
        };
      });

    } catch (error) {
      console.error("Quiz Command Error:", error);
      api.sendMessage(
        "❌ Failed to start quiz. Please try again later.\n" +
        "Possible reasons:\n" +
        "1. API service is down\n" +
        "2. Invalid parameters\n" +
        "3. Network issues",
        event.threadID,
        event.messageID
      );
    }
  },

  handleReaction: function({ api, event }) {
    const { threadID, messageID, userID, reaction } = event;
    
    // Validate reaction
    if (!global.quizActive[threadID] || 
        global.quizActive[threadID].messageID !== messageID ||
        global.quizActive[threadID].answered ||
        userID !== global.quizActive[threadID].userID) {
      return;
    }

    const quiz = global.quizActive[threadID];
    const userAnswer = reaction === "👍" ? "True" : "False";
    const isCorrect = userAnswer === quiz.correctAnswer;

    // Clear timeout
    clearTimeout(quiz.timer);
    
    // Send result
    api.sendMessage(
      isCorrect 
        ? `🎉 Correct! ${userAnswer} was the right answer!\n` +
          `Type "quiz" to play again! 🎉` 
        : `❌ Wrong! The correct answer was: ${quiz.correctAnswer}\n` +
          `Type "quiz" to try again!`,
      threadID
    );

    // Clean up
    quiz.answered = true;
    delete global.quizActive[threadID];
  }
};
