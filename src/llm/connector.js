

const gemini = require('./gemini');
const kaggle = require('./kaggle-fallback');
require('dotenv').config();

function getMode() {
    return (process.env.LLM_MODE || 'gemini').toLowerCase();
}


async function generateResponse(systemPrompt, userMessage, history = []) {
    const mode = getMode();

    if (mode === 'kaggle') {
        return await kaggle.generateResponse(systemPrompt, userMessage, history);
    }

    if (mode === 'hybrid') {
        
        const geminiResult = await gemini.generateResponse(systemPrompt, userMessage, history);
        if (geminiResult.success) return geminiResult;

        console.warn('[LLM] Gemini failed, falling back to Kaggle:', geminiResult.error);
        const kaggleResult = await kaggle.generateResponse(systemPrompt, userMessage, history);
        if (kaggleResult.success) return kaggleResult;

        return {
            success: false,
            error: `Both backends failed. Gemini: ${geminiResult.error}. Kaggle: ${kaggleResult.error}`,
            source: 'hybrid'
        };
    }

    
    return await gemini.generateResponse(systemPrompt, userMessage, history);
}


async function generateJSON(systemPrompt, userMessage) {
    const mode = getMode();

    if (mode === 'kaggle') {
        return await kaggle.generateJSON(systemPrompt, userMessage);
    }

    if (mode === 'hybrid') {
        const geminiResult = await gemini.generateJSON(systemPrompt, userMessage);
        if (geminiResult.success) return geminiResult;

        console.warn('[LLM] Gemini JSON failed, falling back to Kaggle:', geminiResult.error);
        const kaggleResult = await kaggle.generateJSON(systemPrompt, userMessage);
        if (kaggleResult.success) return kaggleResult;

        return {
            success: false,
            error: `Both backends failed. Gemini: ${geminiResult.error}. Kaggle: ${kaggleResult.error}`,
            source: 'hybrid'
        };
    }

    return await gemini.generateJSON(systemPrompt, userMessage);
}


async function healthCheck() {
    const [geminiOk, kaggleOk] = await Promise.all([
        gemini.healthCheck(),
        kaggle.healthCheck()
    ]);

    return {
        mode: getMode(),
        gemini: geminiOk,
        kaggle: kaggleOk,
        available: geminiOk || kaggleOk
    };
}

module.exports = { generateResponse, generateJSON, healthCheck };
