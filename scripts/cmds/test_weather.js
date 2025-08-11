const weatherModule = require('./weather.js');

// Mock api object
const mockApi = {
    sendMessage: (message, threadID, messageID) => {
        console.log("API Message:", message.body);
        if (message.location) {
            console.log("Location:", message.location);
        }
    }
};

// Mock event object
const mockEvent = {
    threadID: "12345",
    messageID: "67890"
};

// Mock getText function
const mockGetText = (key, ...args) => {
    const languages = weatherModule.languages;
    const lang = "en"; // Test with English first
    let text = languages[lang][key];
    args.forEach((arg, index) => {
        text = text.replace(`%${index + 1}`, arg);
    });
    return text;
};

// Test cases
async function runTests() {
    console.log("\n--- Testing with English (Dhaka) ---");
    await weatherModule.run({ api: mockApi, event: mockEvent, args: ["Dhaka"], getText: mockGetText });

    console.log("\n--- Testing with English (Invalid Location) ---");
    await weatherModule.run({ api: mockApi, event: mockEvent, args: ["asdfghjkl"], getText: mockGetText });

    // Test with Bangla
    const mockGetTextBn = (key, ...args) => {
        const languages = weatherModule.languages;
        const lang = "bn"; // Test with Bangla
        let text = languages[lang][key];
        args.forEach((arg, index) => {
            text = text.replace(`%${index + 1}`, arg);
        });
        return text;
    };

    console.log("\n--- Testing with Bangla (Dhaka) ---");
    await weatherModule.run({ api: mockApi, event: mockEvent, args: ["Dhaka"], getText: mockGetTextBn });

    console.log("\n--- Testing with Bangla (Invalid Location) ---");
    await weatherModule.run({ api: mockApi, event: mockEvent, args: ["asdfghjkl"], getText: mockGetTextBn });

    console.log("\n--- Testing with no location ---");
    await weatherModule.run({ api: mockApi, event: mockEvent, args: [], getText: mockGetText });
}

runTests();


