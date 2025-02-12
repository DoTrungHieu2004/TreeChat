const { NlpManager } = require('node-nlp');
const logger = require('../config/logger');

class ArborMind {
    constructor() {
        this.manager = new NlpManager({ languages: ["en"], forceNER: true });
        this.memory = {}; // Store user memory
        this.trainBot();
    }

    async trainBot() {
        // 🤖 Basic greetings
        this.manager.addDocument("en", "hello", "greetings.hello");
        this.manager.addDocument("en", "hi", "greetings.hello");
        this.manager.addDocument("en", "hey", "greetings.hello");

        this.manager.addAnswer("en", "greetings.hello", "👋 Hello! How can I assist you?");
        this.manager.addAnswer("en", "greetings.hello", "Hi there! Need any help?");

        // ❓ General questions
        this.manager.addDocument("en", "what is treechat", "info.treechat");
        this.manager.addAnswer("en", "info.treechat", "🌲 TreeChat is an AI chatbot app powered by ArborMind!");

        this.manager.addDocument("en", "who made you", "info.creator");
        this.manager.addAnswer("en", "info.creator", "I was created by Hieu10 (AI Department).");

        // 🌎 Small talk
        this.manager.addDocument("en", "how are you", "smalltalk.howareyou");
        this.manager.addAnswer("en", "smalltalk.howareyou", "I'm just a bot, but I'm feeling great! 😊");

        // 🚀 Training the AI model
        logger.info("🤖 Training ArborMind AI...");
        await this.manager.train();
        this.manager.save();
        logger.info("✅ ArborMind AI is ready! 🚀");
    }

    async getResponse(text) {
        const response = await this.manager.process("en", text);

        // Save conversaton context
        this.memory[userId] = this.memory[userId] || [];
        this.memory[userId].push({ input: text, output: response.answer });
        
        return response.answer || "🤔 I'm not sure about that.";
    }
}

module.exports = new ArborMind();