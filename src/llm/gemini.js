

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const MODEL_NAME = 'gemini-2.5-flash';
let genAI = null;
let model = null;

function init() {
    if (model) return;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set in .env');
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: MODEL_NAME });
}


function toSystemInstruction(text) {
    return { role: 'user', parts: [{ text }] };
}


async function generateResponse(systemPrompt, userMessage, history = []) {
    init();

    const chatModel = genAI.getGenerativeModel({
        model: MODEL_NAME,
        systemInstruction: toSystemInstruction(systemPrompt)
    });

    const chat = chatModel.startChat({
        history: history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            parts: [{ text: msg.content }]
        }))
    });

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            const result = await chat.sendMessage(userMessage);
            const text = result.response.text();
            return { success: true, text, source: 'gemini' };
        } catch (error) {
            attempts++;
            if (attempts >= maxAttempts) {
                return { success: false, error: error.message, source: 'gemini' };
            }
            
            await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempts)));
        }
    }
}


async function generateJSON(systemPrompt, userMessage) {
    init();

    const jsonModel = genAI.getGenerativeModel({
        model: MODEL_NAME,
        systemInstruction: toSystemInstruction(systemPrompt),
        generationConfig: { responseMimeType: 'application/json' }
    });

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            const result = await jsonModel.generateContent(userMessage);
            const text = result.response.text();
            const parsed = JSON.parse(text);
            return { success: true, data: parsed, raw: text, source: 'gemini' };
        } catch (error) {
            attempts++;
            if (attempts >= maxAttempts) {
                return { success: false, error: error.message, source: 'gemini' };
            }
            await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempts)));
        }
    }
}

async function healthCheck() {
    try {
        init();
        const result = await model.generateContent('Reply with OK');
        return result.response.text().length > 0;
    } catch {
        return false;
    }
}

module.exports = { generateResponse, generateJSON, healthCheck };
