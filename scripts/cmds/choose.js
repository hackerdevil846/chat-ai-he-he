module.exports = {
  config: {
    name: "choose",
    version: "2.2.0",
    author: "Asif",
    category: "utilities",
    shortDescription: "Decision-making assistant",
    longDescription: "Randomly selects between multiple options to help you decide",
    guide: {
      en: "{p}choose option1 | option2 | option3\nExample: {p}choose pizza | burger | sushi"
    },
    cooldowns: 3
  },

  langs: {
    en: {
      missingOptions: "🔍 Please provide options to choose from!\n\nExample: choose pizza | burger | sushi",
      singleOption: "🤔 You only gave me one option: '%1'",
      deciding: "🔮 Deciding between your options...\n\nOptions:\n%1",
      result: "🎯 My recommendation: '%1'",
      error: "❌ An error occurred. Please try again with different options."
    }
  },

  onStart: async function ({ api, event, args, getText }) {
    const { threadID, messageID } = event;
    
    try {
      // Check if user provided any options
      if (args.length === 0) {
        return api.sendMessage(getText("missingOptions"), threadID, messageID);
      }

      const input = args.join(" ");
      
      // Split options by pipe symbol and clean them
      let options = input.split("|")
        .map(option => option.trim())
        .filter(option => option.length > 0);

      // Handle case with only one valid option
      if (options.length === 1) {
        return api.sendMessage(
          getText("singleOption", options[0]), 
          threadID, 
          messageID
        );
      }
      
      // Handle case with no valid options
      if (options.length === 0) {
        return api.sendMessage(
          getText("missingOptions"), 
          threadID, 
          messageID
        );
      }

      // Format options list for display
      const optionsList = options.map((option, index) => `${index + 1}. ${option}`).join("\n");
      
      // Send deciding message with options
      const decidingMsg = await api.sendMessage(
        getText("deciding", optionsList), 
        threadID
      );
      
      // Add a short delay for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Delete the deciding message
      await api.unsendMessage(decidingMsg.messageID);
      
      // Randomly select an option
      const randomIndex = Math.floor(Math.random() * options.length);
      const selected = options[randomIndex];
      
      // Create a visual representation of the selection
      const visualOptions = options.map((option, index) => {
        return index === randomIndex ? `✅ ${option}` : `❌ ${option}`;
      }).join("\n");
      
      // Create result message
      const resultMessage = `${getText("result", selected)}\n\n` +
                           "📊 Results:\n" +
                           `${visualOptions}\n\n` +
                           "🎲 Selection was random - trust your instincts too!";
      
      // Send the result
      api.sendMessage(resultMessage, threadID, messageID);

    } catch (error) {
      console.error("Choose command error:", error);
      api.sendMessage(getText("error"), threadID, messageID);
    }
  }
};
